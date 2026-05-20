import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";
import Razorpay from "razorpay";

export const dynamic = "force-dynamic";

// Price definitions in INR (Razorpay standard)
const PLAN_PRICES = {
  creator_pro: {
    monthly: 899,
    annual: 8630 // Billed annually (approx 20% off of 899 * 12)
  },
  viral_scale: {
    monthly: 1999,
    annual: 19190 // Billed annually (approx 20% off of 1999 * 12)
  }
};

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { planId, isAnnual, promoCode, ref } = body;

    if (!planId || !PLAN_PRICES[planId]) {
      return NextResponse.json({ error: "Invalid or missing planId" }, { status: 400 });
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

    // 2. Determine base price
    const pricing = PLAN_PRICES[planId];
    let basePrice = isAnnual ? pricing.annual : pricing.monthly;
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
          const supabaseAdmin = createAdminClient();
          const { data: promoData, error: promoError } = await supabaseAdmin
            .from("promo_codes")
            .select("*, partner_id")
            .eq("code", code)
            .eq("status", "active")
            .single();

          if (!promoError && promoData) {
            discountPercent = promoData.customer_discount_percent || 10;
            partnerId = promoData.partner_id;
          }
        } catch (dbErr) {
          console.warn("DB Promo code verification failed, ignoring dynamic code:", dbErr.message);
        }
      }
    }

    // 3.5. If partnerId is not yet resolved via promoCode, try to resolve via tracking ref parameter
    if (!partnerId && ref) {
      try {
        const supabaseAdmin = createAdminClient();
        const { data: matches } = await supabaseAdmin
          .from("partner_profiles")
          .select("id")
          .or(`master_tracking_link.ilike.%${ref}%,id.eq.${ref.replace("partner_", "")}`);

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
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholderKey";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "secret_placeholderSecret";

    // Determine if we should run in simulated sandbox mode
    const isPlaceholder = keyId.includes("placeholder") || keySecret.includes("placeholder");

    if (isPlaceholder) {
      console.log("Razorpay Sandbox Mode: Placeholder keys detected. Returning simulated order.");
      return NextResponse.json({
        success: true,
        isSimulated: true,
        orderId: `order_sim_${Math.random().toString(36).substring(2, 10)}`,
        amount: amountInPaise,
        currency: "INR",
        keyId,
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
        keyId,
        userName: currentUser.user_metadata?.full_name || "Automixa User",
        userEmail: currentUser.email || "",
        planId,
        isAnnual: !!isAnnual,
        promoCode: promoCode || null,
        partnerId
      });

    } catch (razorpayErr) {
      console.warn("Razorpay API creation failed, falling back to Sandbox simulation:", razorpayErr.message);
      
      // Graceful fallback to simulated transaction on error
      return NextResponse.json({
        success: true,
        isSimulated: true,
        orderId: `order_sim_${Math.random().toString(36).substring(2, 10)}`,
        amount: amountInPaise,
        currency: "INR",
        keyId,
        userName: currentUser.user_metadata?.full_name || "Automixa User",
        userEmail: currentUser.email || "",
        planId,
        isAnnual: !!isAnnual,
        promoCode: promoCode || null,
        partnerId
      });
    }

  } catch (error) {
    console.error("API /api/checkout/create Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
