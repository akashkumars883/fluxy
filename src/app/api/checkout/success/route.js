import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@/lib/supabase";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { sendInvoiceEmail } from "@/lib/resend";
import crypto from "crypto";
import Razorpay from "razorpay";

const PLAN_IDS = new Set(["creator_pro", "viral_scale"]);

function timingSafeHexEqual(a, b) {
  const aBuf = Buffer.from(a || "", "hex");
  const bBuf = Buffer.from(b || "", "hex");
  return aBuf.length === bBuf.length && crypto.timingSafeEqual(aBuf, bBuf);
}

export async function POST(req) {
  try {
    const { 
      razorpay_signature,
      razorpay_order_id: orderIdFromClient,
      razorpay_payment_id: paymentIdFromClient,
    } = await req.json();

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    const reqUrl = new URL(req.url);
    const isLocalhost = ["localhost", "127.0.0.1"].includes(reqUrl.hostname);

    const supabaseAuth = createSupabaseClient();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSimulated = isLocalhost && orderIdFromClient?.startsWith("order_sim_");
    let verifiedOrder;
    let verifiedPayment;

    if (isSimulated) {
      console.log("Razorpay local sandbox: accepting simulated order on localhost only.");
      verifiedOrder = {
        id: orderIdFromClient,
        amount: Number(0),
        currency: "INR",
        notes: {
          userId: user.id,
          planId: "creator_pro",
          isAnnual: "false",
          promoCode: "",
          partnerId: "",
        },
      };
      verifiedPayment = { id: paymentIdFromClient || `pay_sim_${Date.now()}` };
    } else {
      if (!keyId || !keySecret) {
        return NextResponse.json({ error: "Razorpay keys are not configured" }, { status: 500 });
      }
      if (!razorpay_signature) {
        return NextResponse.json({ error: "Missing payment signature" }, { status: 400 });
      }
      if (!orderIdFromClient || !paymentIdFromClient) {
        return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
      }

      const hmac = crypto.createHmac("sha256", keySecret);
      hmac.update(`${orderIdFromClient}|${paymentIdFromClient}`);
      const generated_signature = hmac.digest("hex");

      if (!timingSafeHexEqual(generated_signature, razorpay_signature)) {
        return NextResponse.json({ error: "Invalid signature. Payment could not be verified." }, { status: 400 });
      }

      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      [verifiedOrder, verifiedPayment] = await Promise.all([
        razorpay.orders.fetch(orderIdFromClient),
        razorpay.payments.fetch(paymentIdFromClient),
      ]);

      if (verifiedPayment.order_id !== verifiedOrder.id) {
        return NextResponse.json({ error: "Payment does not belong to this order" }, { status: 400 });
      }
      if (!["captured", "authorized"].includes(verifiedPayment.status)) {
        return NextResponse.json({ error: "Payment is not complete" }, { status: 400 });
      }
      if (Number(verifiedPayment.amount) !== Number(verifiedOrder.amount)) {
        return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
      }
    }

    const orderNotes = verifiedOrder.notes || {};
    const plan_id = String(orderNotes.planId || "");
    const partner_id = orderNotes.partnerId || null;
    const promo_code = orderNotes.promoCode || null;
    const amount = (Number(verifiedOrder.amount || verifiedPayment.amount || 0) / 100).toFixed(2);
    const currency = verifiedOrder.currency || verifiedPayment.currency || "INR";
    const email = user.email;
    const name = user.user_metadata?.full_name || "Automixa User";

    if (!PLAN_IDS.has(plan_id)) {
      return NextResponse.json({ error: "Invalid plan on order" }, { status: 400 });
    }
    if (orderNotes.userId !== user.id) {
      return NextResponse.json({ error: "Order does not belong to this user" }, { status: 403 });
    }

    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    const supabase = createSupabaseAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 2. Save to Invoices Table
    const { error: invError } = await supabase
      .from("invoices")
      .insert([{
        user_id: user.id,
        amount,
        currency,
        plan_name: plan_id.replace('_', ' ').toUpperCase(),
        payment_id: verifiedPayment.id,
        invoice_number: invoiceNumber,
        status: 'paid'
      }]);

    if (invError) throw invError;

    // 3. Update User Subscription
    const { error: subError } = await supabase
      .from("subscriptions")
      .upsert({
        user_id: user.id,
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
          customer_user_id: user.id,
          promo_code_used: promo_code || null,
          partner_id: partner_id,
          subscription_plan: plan_id,
          transaction_amount: transactionAmount,
          commission_earned: commissionEarned,
          transaction_id: verifiedPayment.id || `pay_${Date.now()}`,
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
