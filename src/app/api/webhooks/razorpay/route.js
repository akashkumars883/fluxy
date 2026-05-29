import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase';
// Assuming we have resend for emails
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_secret';

export async function POST(request) {
  try {
    const bodyText = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    // 1. Verify Signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(bodyText)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(bodyText);

    // 2. Process Order Payment Success
    if (payload.event === 'order.paid' || payload.event === 'payment.captured') {
      const paymentEntity = payload.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      
      const supabase = createClient();
      
      // Update order status
      const { data: order, error: orderError } = await supabase
        .from('store_orders')
        .update({ status: 'paid' })
        .eq('razorpay_order_id', orderId)
        .select(`
          *,
          store_products (
            name, type, file_url
          )
        `)
        .single();

      if (orderError || !order) {
        console.error("Order update failed:", orderError);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // 3. Fulfill the product (Digital)
      if (order.store_products.type === 'digital' && order.store_products.file_url) {
        // Send email with file link
        try {
          await resend.emails.send({
            from: 'Automixa Store <store@automixa.in>',
            to: order.customer_email,
            subject: `Your purchase: ${order.store_products.name}`,
            html: `
              <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
                <h2>Thank you for your purchase!</h2>
                <p>Hi ${order.customer_name || 'there'},</p>
                <p>Your payment for <strong>${order.store_products.name}</strong> was successful.</p>
                <p>You can download your digital file using the link below:</p>
                <div style="margin: 30px 0;">
                  <a href="${order.store_products.file_url}" style="background-color: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Download File
                  </a>
                </div>
                <p>If you have any issues, please reply to this email.</p>
                <hr style="border: 1px solid #eee; margin-top: 40px;" />
                <p style="color: #888; font-size: 12px;">Powered by Automixa</p>
              </div>
            `
          });
          
          // Mark as delivered
          await supabase.from('store_orders').update({ fulfillment_status: 'delivered' }).eq('id', order.id);
        } catch (emailErr) {
          console.error("Fulfillment email failed:", emailErr);
        }
      }

      // 4. CRM Sync: Add buyer to CRM
      if (order.customer_ig_handle) {
         try {
           const { data: existingAudience } = await supabase
            .from('audience')
            .select('id')
            .eq('automation_id', order.automation_id)
            .eq('username', order.customer_ig_handle)
            .single();

           if (existingAudience) {
             // Append to tags
             await supabase.from('audience')
              .update({ tags: ['customer'] }) // Simplified for MVP
              .eq('id', existingAudience.id);
           } else {
             // Create new audience record
             await supabase.from('audience')
              .insert({
                automation_id: order.automation_id,
                username: order.customer_ig_handle,
                name: order.customer_name,
                source: 'store',
                tags: ['customer']
              });
           }
         } catch (crmErr) {
           console.error("CRM Sync failed:", crmErr);
         }
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true, message: 'Event ignored' });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
