import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";
import Razorpay from "razorpay";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { planId, isAnnual, promoCode, ref } = body;
    const reqUrl = new URL(req.url);
    const isDevHost = ["localhost", "127.0.0.1"].includes(reqUrl.hostname);

    if (!planId) {
      return NextResponse.json({ error: "Missing planId" }, { status: 400 });
    }

    // 1. Authenticate user
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    let currentUser = user;
    if ((authError || !currentUser) && ["localhost", "127.0.0.1"].includes(new URL(req.url).hostname)) {
      currentUser = { 
        id: "00000000-0000-0000-0000-000000000000",
        email: "dev-tester@automixa.in",
        user_metadata: { full_name: "Dev Sandbox Tester" }
      };
    }

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch Base Price from DB
    const supabaseAdmin = createAdminClient();
    const { data: planData, error: planError } = await supabaseAdmin
      .from("pricing_plans")
      .select("*")
      .eq("plan_id", planId)
      .eq("is_active", true)
      .single();

    if (planError || !planData) {
      return NextResponse.json({ error: "Invalid or inactive planId" }, { status: 400 });
    }

    let basePrice = isAnnual ? planData.price_inr_annual : planData.price_inr_monthly;
    let discountPercent = 0;
    let partnerId = null;

    // 3. Handle Promo Code discount computation
    if (promoCode) {
      const code = promoCode.trim().toUpperCase();
      if (code === "AUTOMIXA30") {
        discountPercent = 30;
      } else if (code === "CREATORVIP") {
        discountPercent = 20;
      } else {
        // Query Supabase for dynamic promo codes
        try {
          const { data: promoData, error: promoError } = await supabaseAdmin
            .from("promo_codes")
            .select("*, partner_id, clicks_count")
            .eq("code", code)
            .eq("status", "active")
            .single();

          if (!promoError && promoData) {
            discountPercent = promoData.customer_discount_percent || 10;
            partnerId = promoData.partner_id;
            // Track click (fire-and-forget, non-blocking)
            supabaseAdmin
              .from("promo_codes")
              .update({ clicks_count: (promoData.clicks_count || 0) + 1 })
              .eq("code", code)
              .then(() => {})
              .catch((e) => console.warn("clicks_count update failed:", e.message));
          }
        } catch (dbErr) {
          console.warn("DB Promo code verification failed, ignoring dynamic code:", dbErr.message);
        }
      }
    }

    // 3.5. If partnerId is not yet resolved via promoCode, try to resolve via tracking ref parameter
    if (!partnerId && ref) {
      try {
        const cleanRef = String(ref).trim().slice(0, 120);
        const partnerIdCandidate = cleanRef.startsWith("partner_")
          ? cleanRef.replace("partner_", "")
          : cleanRef;
        const isUuid =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(partnerIdCandidate);
        let query = supabaseAdmin
          .from("partner_profiles")
          .select("id")
          .ilike("master_tracking_link", `%${cleanRef}%`)
          .limit(1);

        if (isUuid) {
          query = supabaseAdmin
            .from("partner_profiles")
            .select("id")
            .eq("id", partnerIdCandidate)
            .limit(1);
        }

        const { data: matches } = await query;

        if (matches && matches.length > 0) {
          partnerId = matches[0].id;
        }
      } catch (refErr) {
        console.warn("DB Tracking ref verification failed:", refErr.message);
      }
    }

    const finalPrice = Math.round(basePrice * ((100 - discountPercent) / 100));
    const amountInPaise = finalPrice * 100; // Razorpay expects amount in paise

    // 4. Initialize Razorpay and Create Order
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    const missingKeys = !keyId || !keySecret;

    if (missingKeys) {
      if (!isDevHost) {
        return NextResponse.json(
          { error: "Razorpay keys are not configured (NEXT_PUBLIC_RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)" },
          { status: 500 }
        );
      }
      console.log("Razorpay Dev Sandbox Mode: Missing keys on localhost. Returning simulated order.");
      return NextResponse.json({
        success: true,
        isSimulated: true,
        orderId: `order_sim_${Math.random().toString(36).substring(2, 10)}`,
        amount: amountInPaise,
        currency: "INR",
        keyId: keyId || "",
        userName: currentUser.user_metadata?.full_name || "Automixa User",
        userEmail: currentUser.email || "",
        planId,
        isAnnual: !!isAnnual,
        promoCode: promoCode || null,
        partnerId
      });
    }

    try {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const orderOptions = {
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}_${currentUser.id.substring(0, 8)}`,
        notes: {
          userId: currentUser.id,
          planId: planId,
          isAnnual: String(isAnnual),
          promoCode: promoCode || "",
          partnerId: partnerId || ""
        }
      };

      const order = await razorpay.orders.create(orderOptions);

      return NextResponse.json({
        success: true,
        isSimulated: false,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: keyId || "",
        userName: currentUser.user_metadata?.full_name || "Automixa User",
        userEmail: currentUser.email || "",
        planId,
        isAnnual: !!isAnnual,
        promoCode: promoCode || null,
        partnerId
      });

    } catch (razorpayErr) {
      console.warn("Razorpay API creation failed:", razorpayErr.message);
      return NextResponse.json(
        { error: "Failed to create Razorpay order" },
        { status: 502 }
      );
    }

  } catch (error) {
    console.error("API /api/checkout/create Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
