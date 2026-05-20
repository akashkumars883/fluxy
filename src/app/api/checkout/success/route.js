import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendInvoiceEmail } from "@/lib/resend";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      plan_id,
      user_id,
      amount,
      currency,
      email,
      name,
      partner_id,
      promo_code
    } = await req.json();

    // 1. Verify Signature (Security)
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    const isSimulated = (razorpay_order_id && razorpay_order_id.startsWith("order_sim_")) || 
                        (!key_secret || key_secret.includes("placeholder"));

    if (!isSimulated) {
      if (!razorpay_signature) {
        return NextResponse.json({ error: "Missing payment signature" }, { status: 400 });
      }
      const hmac = crypto.createHmac("sha256", key_secret || "");
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generated_signature = hmac.digest("hex");

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ error: "Invalid signature. Payment could not be verified." }, { status: 400 });
      }
    } else {
      console.log("Razorpay Sandbox Mode: Bypassing signature check for simulated order/placeholder secret.");
    }

    const isDevBypass = user_id === "00000000-0000-0000-0000-000000000000";
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    if (isDevBypass) {
      console.log("Dev bypass checkout: Bypassing DB storage for mock session.");
      // Trigger invoice email sending helper (mock)
      try {
        await sendInvoiceEmail({
          email,
          name,
          planName: plan_id.replace('_', ' '),
          amount: `${currency} ${amount}`,
          invoiceId: invoiceNumber
        });
      } catch (e) {
        console.warn("Mock email send warning:", e.message);
      }
      return NextResponse.json({ success: true, invoiceNumber });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 2. Save to Invoices Table
    const { error: invError } = await supabase
      .from("invoices")
      .insert([{
        user_id,
        amount,
        currency,
        plan_name: plan_id.replace('_', ' ').toUpperCase(),
        payment_id: razorpay_payment_id,
        invoice_number: invoiceNumber,
        status: 'paid'
      }]);

    if (invError) throw invError;

    // 3. Update User Subscription
    const { error: subError } = await supabase
      .from("subscriptions")
      .upsert({
        user_id,
        plan_id,
        status: 'active',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (subError) throw subError;

    // 3.5. Record Referral/Affiliate Partner Attribution if applicable
    if (partner_id) {
      try {
        let commissionRate = 0.20; // default 20%
        let transactionAmount = Number(amount) || 0;

        if (promo_code) {
          const { data: promo } = await supabase
            .from("promo_codes")
            .select("partner_commission_percent, sales_count")
            .eq("code", promo_code)
            .single();

          if (promo) {
            commissionRate = (promo.partner_commission_percent || 20) / 100;
            // Increment promo code sales
            await supabase
              .from("promo_codes")
              .update({ sales_count: (promo.sales_count || 0) + 1 })
              .eq("code", promo_code);
          }
        } else {
          // Find partner commission rate from profile
          const { data: profile } = await supabase
            .from("partner_profiles")
            .select("commission_rate")
            .eq("id", partner_id)
            .single();
          if (profile) {
            commissionRate = Number(profile.commission_rate) || 0.15;
          }
        }

        const commissionEarned = Math.round(transactionAmount * commissionRate);

        // 1. Insert attribution log
        await supabase.from("referral_attributions").insert({
          customer_user_id: user_id,
          promo_code_used: promo_code || null,
          partner_id: partner_id,
          subscription_plan: plan_id,
          transaction_amount: transactionAmount,
          commission_earned: commissionEarned,
          transaction_id: razorpay_payment_id || `pay_${Date.now()}`,
          status: "completed"
        });

        // 2. Update partner profile metrics
        const { data: partnerProf } = await supabase
          .from("partner_profiles")
          .select("total_referrals_count, monthly_recurring_revenue, unpaid_earnings")
          .eq("id", partner_id)
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
            .eq("id", partner_id);
        }
      } catch (attErr) {
        console.warn("Server-side partner attribution failed:", attErr.message);
      }
    }

    // 4. Send Email via Resend
    await sendInvoiceEmail({
      email,
      name,
      planName: plan_id.replace('_', ' '),
      amount: `${currency} ${amount}`,
      invoiceId: invoiceNumber
    });

    return NextResponse.json({ success: true, invoiceNumber });

  } catch (error) {
    console.error("Checkout Success API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
