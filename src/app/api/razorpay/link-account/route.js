import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { method, upiId, accountNo, ifsc, holderName } = body;

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay keys missing on server." }, { status: 500 });
    }

    // Prepare Razorpay payload
    const payload = {
      name: holderName || user.email.split('@')[0],
      email: user.email,
      tnc_accepted: true,
      account_details: {
        business_name: holderName || user.email.split('@')[0],
        business_type: "individual"
      }
    };

    if (method === "upi") {
      payload.vpa = { address: upiId };
    } else {
      payload.bank_account = {
        ifsc_code: ifsc,
        beneficiary_name: holderName,
        account_number: accountNo
      };
    }

    // Call Razorpay API to create linked account
    const rzpRes = await fetch("https://api.razorpay.com/beta/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64")
      },
      body: JSON.stringify(payload)
    });

    const rzpData = await rzpRes.json();

    if (!rzpRes.ok) {
      console.error("Razorpay Error:", rzpData);
      return NextResponse.json({ 
        error: rzpData.error?.description || "Failed to create Linked Account in Razorpay." 
      }, { status: 400 });
    }

    const accountId = rzpData.id; // e.g., acc_xxxxx

    // Prepare final address for legacy compatibility
    const finalAddress = method === "upi"
      ? upiId
      : JSON.stringify({ accountNo, ifsc, holderName });

    // Update Supabase
    const { error: dbError } = await supabase.from("partner_profiles").upsert({
      id: user.id,
      payout_method: method,
      payout_address: finalAddress,
      razorpay_account_id: accountId,
      payout_verified: true
    }, { onConflict: "id" });

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, accountId });

  } catch (err) {
    console.error("Link Account Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
