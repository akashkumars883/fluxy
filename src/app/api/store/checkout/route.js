import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import Razorpay from 'razorpay';

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, customerEmail, customerIgHandle, customerName } = body;

    if (!productId || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch product details
    const supabase = createClient();
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

    // 2. Initialize Razorpay (Using platform keys for MVP, later switch to Route/Creator keys)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amountInPaise = Math.round(Number(product.price_inr) * 100);

    // 3. Create Razorpay Order
    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_prod_${product.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        product_id: product.id,
        automation_id: product.automation_id,
        customer_email: customerEmail,
        customer_ig: customerIgHandle || '',
      }
    });

    // 4. Save Pending Order to Database
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

    // 5. Return order details to client for Checkout
    return NextResponse.json({
      success: true,
      order: rzpOrder,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      product: {
        name: product.name,
        description: product.description,
        price: product.price_inr
      }
    });

  } catch (err) {
    console.error("Store Checkout Error:", err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
