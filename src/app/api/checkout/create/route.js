import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";
import crypto from "crypto";

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
    const amountInPaise = finalPrice * 100; // PhonePe expects amount in paise

    // PhonePe Configuration
    const merchantId = process.env.PHONEPE_MERCHANT_ID?.trim() || "PGTESTPAYUAT";
    const saltKey = process.env.PHONEPE_SALT_KEY?.trim() || "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
    const saltIndex = process.env.PHONEPE_SALT_INDEX?.trim() || "1";
    const phonepeEnv = process.env.PHONEPE_ENV?.trim() || "sandbox";

    // 4. Initialize PhonePe and Create Checkout Redirect Link
    const transactionId = `TXN${Date.now()}${currentUser.id.substring(0, 6)}`.toUpperCase();

    // Check if PhonePe is configured, otherwise simulate transaction for localhost
    const hasKeys = !!process.env.PHONEPE_MERCHANT_ID;
    if (isDevHost && (!hasKeys || process.env.PHONEPE_SIMULATED === "true")) {
      console.log("PhonePe Dev Sandbox Mode: Returning simulated order redirect.");
      const redirectUrl = `/api/checkout/phonepe-callback?transactionId=${transactionId}&userId=${currentUser.id}&planId=${planId}&isAnnual=${isAnnual}&promoCode=${promoCode || ""}&partnerId=${partnerId || ""}&simulated=true`;
      
      return NextResponse.json({
        success: true,
        isSimulated: true,
        redirectUrl,
        planId,
        amount: amountInPaise
      });
    }

    const callbackUrl = `${reqUrl.origin}/api/webhooks/phonepe`;
    const redirectUrl = `${reqUrl.origin}/api/checkout/phonepe-callback?transactionId=${transactionId}&userId=${currentUser.id}&planId=${planId}&isAnnual=${isAnnual}&promoCode=${promoCode || ""}&partnerId=${partnerId || ""}`;

    const payload = {
      merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: currentUser.id,
      amount: amountInPaise,
      redirectUrl,
      redirectMode: "REDIRECT",
      callbackUrl,
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
    const signText = base64Payload + "/pg/v1/pay" + saltKey;
    const signature = crypto.createHash("sha256").update(signText).digest("hex");
    const xVerify = signature + "###" + saltIndex;

    try {
      const phonepeUrl = phonepeEnv === "production"
        ? "https://api.phonepe.com/apis/hermes/pg/v1/pay"
        : "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

      const response = await fetch(phonepeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify
        },
        body: JSON.stringify({ request: base64Payload })
      });

      const resData = await response.json();

      if (response.ok && resData.success && resData.data?.instrumentResponse?.redirectInfo?.url) {
        return NextResponse.json({
          success: true,
          isSimulated: false,
          redirectUrl: resData.data.instrumentResponse.redirectInfo.url,
          transactionId
        });
      } else {
        console.error("PhonePe API response failure:", resData);
        return NextResponse.json({ error: resData.message || "Failed to initiate PhonePe payment order." }, { status: 400 });
      }

    } catch (phonepeErr) {
      console.warn("PhonePe API payment call failed:", phonepeErr.message);
      return NextResponse.json(
        { error: "Failed to connect with PhonePe payment gateway." },
        { status: 502 }
      );
    }

  } catch (error) {
    console.error("API /api/checkout/create Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
