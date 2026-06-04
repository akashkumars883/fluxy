import { NextResponse } from "next/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { sendInvoiceEmail } from "@/lib/resend";
import crypto from "crypto";

const PLAN_IDS = new Set(["creator_pro", "viral_scale"]);

export async function GET(req) {
  const reqUrl = new URL(req.url);
  
  // Extract checkout parameters from the redirect query string
  const transactionId = reqUrl.searchParams.get("transactionId");
  const userId = reqUrl.searchParams.get("userId");
  const planId = reqUrl.searchParams.get("planId");
  const isAnnual = reqUrl.searchParams.get("isAnnual") === "true";
  const promoCode = reqUrl.searchParams.get("promoCode");
  const partnerId = reqUrl.searchParams.get("partnerId");
  const simulated = reqUrl.searchParams.get("simulated") === "true";

  const isLocalhost = ["localhost", "127.0.0.1"].includes(reqUrl.hostname);

  try {
    if (!transactionId || !userId || !planId) {
      return NextResponse.redirect(new URL("/dashboard?error=Missing+transaction+details", req.url));
    }

    if (!PLAN_IDS.has(planId)) {
      return NextResponse.redirect(new URL("/dashboard?error=Invalid+plan", req.url));
    }

    let paymentVerified = false;
    let paymentId = transactionId;
    let transactionAmount = 0;

    // 1. Verify Payment Status
    if (simulated && isLocalhost) {
      console.log("PhonePe Local Simulation: marking transaction as verified");
      paymentVerified = true;
      // Get base mock amount for plans (pre-discount)
      const basePlanAmt = planId === "viral_scale" ? (isAnnual ? 19190 : 1999) : (isAnnual ? 8630 : 899);
      let discPercent = 0;
      if (promoCode) {
        const code = promoCode.trim().toUpperCase();
        if (code === "AUTOMIXA30") discPercent = 30;
        else if (code === "CREATORVIP") discPercent = 20;
        else discPercent = 10;
      }
      const priceBeforeGst = Math.round(basePlanAmt * ((100 - discPercent) / 100));
      const gstAmt = Math.round(priceBeforeGst * 0.18);
      transactionAmount = priceBeforeGst + gstAmt;
    } else {
      const merchantId = process.env.PHONEPE_MERCHANT_ID?.trim() || "PGTESTPAYUAT";
      const saltKey = process.env.PHONEPE_SALT_KEY?.trim() || "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
      const saltIndex = process.env.PHONEPE_SALT_INDEX?.trim() || "1";
      const phonepeEnv = process.env.PHONEPE_ENV?.trim() || "sandbox";

      const statusUrl = phonepeEnv === "production"
        ? `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${transactionId}`
        : `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transactionId}`;

      const signText = `/pg/v1/status/${merchantId}/${transactionId}` + saltKey;
      const signature = crypto.createHash("sha256").update(signText).digest("hex");
      const xVerify = signature + "###" + saltIndex;

      const response = await fetch(statusUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": merchantId
        }
      });

      const resData = await response.json();

      if (response.ok && resData.success && resData.code === "PAYMENT_SUCCESS") {
        paymentVerified = true;
        paymentId = resData.data.providerReferenceId || transactionId;
        transactionAmount = resData.data.amount / 100; // convert paise to rupees
      } else {
        console.error("PhonePe status check failed:", resData);
        return NextResponse.redirect(new URL(`/dashboard?error=${encodeURIComponent(resData.message || "Payment verification failed")}`, req.url));
      }
    }

    if (!paymentVerified) {
      return NextResponse.redirect(new URL("/dashboard?error=Payment+could+not+be+verified", req.url));
    }

    const supabase = createSupabaseAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 2. Fetch User Email/Details for resend
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError || !user) {
      throw new Error("User details not found");
    }

    const email = user.email;
    const name = user.user_metadata?.full_name || "Automixa User";
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    // 3. Save to Invoices Table
    const { error: invError } = await supabase
      .from("invoices")
      .insert([{
        user_id: userId,
        amount: transactionAmount.toFixed(2),
        currency: "INR",
        plan_name: planId.replace('_', ' ').toUpperCase(),
        payment_id: paymentId,
        invoice_number: invoiceNumber,
        status: 'paid'
      }]);

    if (invError) throw invError;

    // 4. Update User Subscription
    const { error: subError } = await supabase
      .from("subscriptions")
      .upsert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (subError) throw subError;

    // 5. Record Referral/Affiliate Partner Attribution
    if (partnerId) {
      try {
        let commissionRate = 0.20; // default 20%
        if (promoCode) {
          const { data: promo } = await supabase
            .from("promo_codes")
            .select("partner_commission_percent, sales_count")
            .eq("code", promoCode)
            .single();

          if (promo) {
            commissionRate = (promo.partner_commission_percent || 20) / 100;
            // Increment sales count
            await supabase
              .from("promo_codes")
              .update({ sales_count: (promo.sales_count || 0) + 1 })
              .eq("code", promoCode);
          }
        } else {
          const { data: profile } = await supabase
            .from("partner_profiles")
            .select("commission_rate")
            .eq("id", partnerId)
            .single();
          if (profile) {
            commissionRate = Number(profile.commission_rate) || 0.15;
          }
        }

        // Compute commission on pre-tax amount (excluding 18% GST)
        const priceExGst = transactionAmount / 1.18;
        const commissionEarned = Math.round(priceExGst * commissionRate);

        // Record log
        await supabase.from("referral_attributions").insert({
          customer_user_id: userId,
          promo_code_used: promoCode || null,
          partner_id: partnerId,
          subscription_plan: planId,
          transaction_amount: transactionAmount,
          commission_earned: commissionEarned,
          transaction_id: paymentId,
          status: "completed"
        });

        // Update partner profile metrics
        const { data: partnerProf } = await supabase
          .from("partner_profiles")
          .select("total_referrals_count, monthly_recurring_revenue, unpaid_earnings")
          .eq("id", partnerId)
          .single();

        if (partnerProf) {
          const newReferrals = (partnerProf.total_referrals_count || 0) + 1;
          const newMRR = (partnerProf.monthly_recurring_revenue || 0) + (transactionAmount / 12);
          const newUnpaid = (partnerProf.unpaid_earnings || 0) + commissionEarned;
          
          await supabase
            .from("partner_profiles")
            .update({
              total_referrals_count: newReferrals,
              monthly_recurring_revenue: Number(newMRR.toFixed(2)),
              unpaid_earnings: Number(newUnpaid.toFixed(2))
            })
            .eq("id", partnerId);
        }
      } catch (attErr) {
        console.warn("PhonePe callback referral attribution failed:", attErr.message);
      }
    }

    // 6. Send Invoice Email
    try {
      await sendInvoiceEmail({
        email,
        name,
        planName: planId.replace('_', ' '),
        amount: `INR ${transactionAmount.toFixed(2)}`,
        invoiceId: invoiceNumber
      });
    } catch (emailErr) {
      console.warn("PhonePe callback send email failed:", emailErr.message);
    }

    // Redirect to dashboard with success query param
    return NextResponse.redirect(new URL("/dashboard?success=subscribed", req.url));

  } catch (error) {
    console.error("PhonePe callback processing error:", error);
    return NextResponse.redirect(new URL(`/dashboard?error=${encodeURIComponent(error.message || "Internal server error")}`, req.url));
  }
}
