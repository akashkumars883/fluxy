import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import Razorpay from 'razorpay';

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, customerEmail, customerIgHandle, customerName } = body;

    if (!productId || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createAdminClient();
    
    // 1. Fetch product details
    const { data: product, error: productError } = await supabase
      .from('store_products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (!product.is_active) {
      return NextResponse.json({ error: 'Product is no longer available' }, { status: 400 });
    }

    // 2. Fetch Creator's Linked Razorpay Account via ig_accounts -> partner_profiles
    const { data: igAccount, error: igError } = await supabase
      .from("ig_accounts")
      .select("user_id")
      .eq("id", product.automation_id)
      .single();

    if (igError || !igAccount) {
      return NextResponse.json({ error: "Creator account not found" }, { status: 404 });
    }

    const { data: creatorProfile } = await supabase
      .from("partner_profiles")
      .select("razorpay_account_id")
      .eq("id", igAccount.user_id)
      .single();

    if (!creatorProfile?.razorpay_account_id) {
      return NextResponse.json({ 
        error: "Creator has not linked a payout account yet. Payments cannot be accepted." 
      }, { status: 400 });
    }

    // 3. Initialize Razorpay
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay keys missing" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const amountInPaise = Math.round(Number(product.price_inr) * 100);

    // 4. Create Razorpay Order with Transfers
    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_prod_${product.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        product_id: product.id,
        automation_id: product.automation_id,
        customer_email: customerEmail,
        customer_ig: customerIgHandle || '',
      },
      transfers: [
        {
          account: creatorProfile.razorpay_account_id,
          amount: amountInPaise, // 100% split to creator
          currency: "INR",
          notes: { item: product.name },
          on_hold: false
        }
      ]
    });

    // 5. Save Pending Order to Database
    const { error: orderError } = await supabase
      .from('store_orders')
      .insert({
        product_id: product.id,
        automation_id: product.automation_id,
        razorpay_order_id: rzpOrder.id,
        customer_email: customerEmail,
        customer_name: customerName,
        customer_ig_handle: customerIgHandle,
        amount: product.price_inr,
        status: 'pending'
      });

    if (orderError) throw orderError;

    return NextResponse.json({
      success: true,
      order: rzpOrder,
      keyId: keyId,
      product: {
        name: product.name,
        description: product.description,
        price: product.price_inr,
        cover_image: product.cover_image
      }
    });

  } catch (err) {
    console.error("Store Checkout Error:", err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
