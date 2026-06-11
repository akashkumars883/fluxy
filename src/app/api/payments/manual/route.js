import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request) {
  try {
    const supabase = createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId, isAnnual, promoCode, utrNumber, amount } = body;

    if (!utrNumber || utrNumber.length < 12) {
      return NextResponse.json({ error: "Invalid UTR number" }, { status: 400 });
    }

    if (!planId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert into manual_payments table
    const { data, error } = await supabase
      .from('manual_payments')
      .insert({
        user_id: user.id,
        plan_id: planId,
        amount: amount,
        utr_number: utrNumber,
        is_annual: isAnnual || false,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error("Manual Payment Insert Error:", error);
      if (error.code === '23505') { // Unique violation
        return NextResponse.json({ error: "This UTR number has already been submitted." }, { status: 400 });
      }
      return NextResponse.json({ error: "Failed to submit payment verification request." }, { status: 500 });
    }

    return NextResponse.json({ success: true, payment: data });

  } catch (err) {
    console.error("Manual Payment Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
