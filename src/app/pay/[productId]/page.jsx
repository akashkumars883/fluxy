"use client";

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Package, ShieldCheck, Mail, User, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage({ params }) {
  const { productId } = params;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [igHandle, setIgHandle] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('store_products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error || !data || !data.is_active) {
          notFound();
        } else {
          setProduct(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (productId) fetchProduct();
  }, [productId]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!name || !email) return toast.error("Name and Email are required");

    setProcessing(true);
    try {
      // 1. Create order
      const res = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: name,
          customerEmail: email,
          customerIgHandle: igHandle
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 2. Initialize Razorpay (Mocking the UI logic here)
      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Automixa Mini Store",
        description: product.name,
        order_id: data.order.id,
        handler: function (response) {
          toast.success("Payment successful! Check your email.");
          // In real implementation, this would redirect to a success page
          window.location.href = `/pay/success?order_id=${data.order.id}`;
        },
        prefill: {
          name: name,
          email: email,
        },
        theme: {
          color: "#6366F1"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        toast.error("Payment failed. Please try again.");
      });
      rzp.open();

    } catch (err) {
      toast.error(err.message || "Failed to initiate checkout");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-zinc-50"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!product) return null;

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 selection:bg-indigo-100 selection:text-indigo-900">
        <div className="w-full max-w-[900px] bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Left: Product Info */}
          <div className="w-full md:w-5/12 bg-zinc-950 text-white p-8 sm:p-10 flex flex-col relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent"></div>
            
            <div className="relative z-10 flex-1">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                {product.cover_image ? (
                  <img src={product.cover_image} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <Package size={28} className="text-indigo-300" />
                )}
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight mb-4">{product.name}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                {product.description || "You are purchasing a digital item. After payment, a secure download link will be sent directly to your email address."}
              </p>

              <div className="flex items-center gap-2 mt-auto text-emerald-400">
                <ShieldCheck size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Secure Checkout</span>
              </div>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="w-full md:w-7/12 p-8 sm:p-10">
            <div className="flex items-end justify-between mb-8 pb-6 border-b border-zinc-100">
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Due</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-zinc-900">₹</span>
                  <span className="text-4xl font-extrabold text-zinc-900 tracking-tight">{product.price_inr}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5"><User size={14}/> Full Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#6366F1] focus:bg-white transition-colors" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5"><Mail size={14}/> Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#6366F1] focus:bg-white transition-colors" />
                <p className="text-[11px] text-zinc-500 mt-1 font-medium">Your purchase will be sent here.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Instagram Handle (Optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">@</span>
                  <input type="text" value={igHandle} onChange={e => setIgHandle(e.target.value)} placeholder="username" className="w-full pl-9 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#6366F1] focus:bg-white transition-colors" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={processing}
                className="w-full mt-4 py-4 bg-[#6366F1] hover:bg-[#4f46e5] disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {processing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <><CreditCard size={18} /> Pay ₹{product.price_inr}</>
                )}
              </button>
            </form>

            <p className="text-center text-[10px] font-bold text-zinc-400 mt-6 uppercase tracking-widest">
              Powered by Automixa Payments
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
