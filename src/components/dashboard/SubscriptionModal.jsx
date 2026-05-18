"use client";

import { useState, useEffect } from "react";
import { X, Zap, CheckCircle2, CreditCard, ArrowRight, BarChart3, ShieldCheck, Sparkles, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useDashboard } from "@/context/DashboardContext";
import { motion, AnimatePresence } from "framer-motion";

export default function SubscriptionModal({ isOpen, onClose, currentPlan = "free", realtimeStats }) {
  const { user, setCurrentPlan } = useDashboard();
  const [step, setStep] = useState(1);
  const [isIndia, setIsIndia] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(currentPlan);
  const [activeTab, setActiveTab] = useState('plans'); // 'plans', 'billing', 'invoices'

  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  // Auto-detect location based on Timezone
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") {
        setIsIndia(true);
      } else {
        setIsIndia(false);
      }
    } catch (e) {
      console.error("Location detection failed", e);
    }
  }, []);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      setLoadingInvoices(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setInvoices(data);
      setLoadingInvoices(false);
    };

    if (activeTab === 'invoices') {
      fetchInvoices();
    }
  }, [activeTab, user]);

  if (!isOpen) return null;

  const usedQuota = realtimeStats?.totalDms + realtimeStats?.autoReplies || 0;
  const currentMaxQuota = currentPlan === "free" ? 1000 : 1000000;
  const quotaPercent = currentPlan === "free" ? Math.min(Math.round((usedQuota / currentMaxQuota) * 100), 100) : 0;

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price_inr: '0',
      price_usd: '0',
      features: ['25k AI Credits', '5 Automations', 'Basic CRM'],
      popular: false
    },
    {
      id: 'creator_pro',
      name: 'Creator Pro',
      price_inr: '899',
      price_usd: '14',
      features: ['250k AI Credits', 'Unlimited Automations', 'Story Mentions'],
      popular: true
    },
    {
      id: 'viral_scale',
      name: 'Viral Scale',
      price_inr: '1,999',
      price_usd: '29',
      features: ['2M AI Credits', 'Custom Persona', 'Priority SLA'],
      popular: false
    }
  ];


  const getDisplayPrice = (plan) => {
    if (plan.id === 'free') return '0';
    let rawPrice = isIndia ? plan.price_inr : plan.price_usd;
    let numeric = parseInt(rawPrice.replace(',', ''));
    if (isAnnual) {
      // Annual discount: 20% off monthly price, billed yearly (x12)
      numeric = Math.round((numeric * 0.8) * 12);
      return isIndia ? numeric.toLocaleString('en-IN') : numeric.toLocaleString();
    }
    return rawPrice;
  };

  const handleCheckout = () => {
    // 1. Plan and Price logic
    const selectedPlan = plans.find(p => p.id === selectedPlanId);
    let rawPrice = isIndia ? selectedPlan.price_inr.replace(',', '') : selectedPlan.price_usd;
    let numericAmount = parseInt(rawPrice);
    if (isAnnual) {
      numericAmount = Math.round((numericAmount * 0.8) * 12);
    }
    const amount = numericAmount.toString();
    const currency = isIndia ? "INR" : "USD";

    // 2. Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_HERE",
        amount: parseInt(amount) * 100, // Amount in paise
        currency: currency,
        name: "Automixa AI",
        description: `Upgrade to ${selectedPlan.name} ${isAnnual ? 'Annual' : 'Monthly'}`,
        image: "/logo.png",
        handler: async function (response) {
          try {
            // Call our backend to verify and save
            const res = await fetch("/api/checkout/success", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                plan_id: selectedPlanId,
                user_id: user.id,
                amount: amount,
                currency: currency,
                email: user.email,
                name: user.user_metadata?.full_name || "Automixa User"
              }),
            });

            const result = await res.json();
            if (result.success) {
              alert(`Payment Successful! Invoice: ${result.invoiceNumber}`);
              setCurrentPlan(selectedPlanId);
              onClose();
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Success handling error:", err);
          }
        },
        prefill: {
          name: user?.user_metadata?.full_name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#6366F1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };
    document.body.appendChild(script);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xl animate-fade-in" 
            onClick={onClose} 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white/95 backdrop-blur-3xl w-full max-w-5xl h-[680px] rounded-[40px] shadow-2xl border border-zinc-200/80 overflow-hidden flex z-10"
          >
        
        {/* Left Sidebar - Navigation */}
        <div className="w-64 bg-zinc-50/50 backdrop-blur-md border-r border-zinc-200/60 p-8 flex flex-col justify-between shrink-0">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-2xl bg-zinc-950 flex items-center justify-center text-white border border-zinc-800 shadow-lg">
                <CreditCard size={14} className="text-[#6366F1]" />
              </div>
              <span className="font-black text-zinc-950 tracking-tight text-[11px] uppercase">Billing Center</span>
            </div>

            <nav className="space-y-1.5">
              {[
                { id: 'plans', label: 'Plans & Pricing', icon: Zap },
                { id: 'invoices', label: 'Invoice History', icon: BarChart3 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    activeTab === tab.id 
                      ? "text-zinc-950 bg-white border border-zinc-200/60 shadow-sm" 
                      : "text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100/50"
                  }`}
                >
                  <tab.icon size={14} className={activeTab === tab.id ? "text-[#6366F1]" : "text-zinc-400"} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-5 bg-white/60 backdrop-blur-xl border border-zinc-200/60 rounded-3xl shadow-sm space-y-3">
             <div className="flex justify-between items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                <span>Usage Quota</span>
                <span className="text-[#6366F1] font-black">{quotaPercent}%</span>
             </div>
             <div className="w-full h-1.5 bg-zinc-100 border border-zinc-200/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#6366F1] to-purple-600 transition-all duration-1000 rounded-full" style={{ width: `${quotaPercent}%` }} />
             </div>
             <p className="text-[10px] text-zinc-500 font-bold tracking-tight">{usedQuota.toLocaleString()} DMs sent this month</p>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white/40">
          {/* Header */}
          <div className="px-10 py-7 flex items-center justify-between border-b border-zinc-200/50">
             <div>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight leading-none">
                   {activeTab === 'plans' ? "Available Plans" : "Invoice History"}
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1.5">Manage your Automixa subscription and billing details</p>
             </div>
             <button onClick={onClose} className="p-2.5 hover:bg-zinc-100 border border-zinc-200/60 rounded-xl transition-all shadow-sm">
                <X size={16} className="text-zinc-500 hover:text-zinc-900" />
             </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-10">
             
             {/* Section: Plans */}
             {activeTab === 'plans' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   {/* Toggles & Location */}
                   <div className="flex items-center justify-between w-full border-b border-zinc-100 pb-4">
                      <div className="bg-zinc-100/80 p-0.5 rounded-full flex items-center gap-0.5 border border-zinc-200/60 shadow-inner">
                         <button onClick={() => setIsAnnual(false)} className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${!isAnnual ? 'bg-white shadow-md text-zinc-950' : 'text-zinc-400 hover:text-zinc-900'}`}>Monthly</button>
                         <button onClick={() => setIsAnnual(true)} className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${isAnnual ? 'bg-white shadow-md text-zinc-950' : 'text-zinc-400 hover:text-zinc-900'}`}>Yearly <span className="text-[9px] text-emerald-600 ml-0.5">-20%</span></button>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200/60 rounded-full shadow-xs">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Billing Location:</span>
                        <span className="text-[10px] font-black text-[#6366F1] uppercase tracking-wider">{isIndia ? "🇮🇳 India (INR)" : "🌍 Global (USD)"}</span>
                      </div>
                   </div>

                   {/* Plan Cards */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {plans.map((plan) => (
                         <div 
                           key={plan.id}
                           onClick={() => setSelectedPlanId(plan.id)}
                           className={`relative p-5 rounded-[28px] border-2 transition-all cursor-pointer flex flex-col justify-between group h-full ${
                             selectedPlanId === plan.id 
                               ? "border-[#6366F1] bg-[#6366F1]/5 shadow-xl shadow-indigo-500/5 scale-[1.02]" 
                               : "border-zinc-200/60 hover:border-zinc-300 hover:bg-zinc-50/50"
                           }`}
                         >
                            {plan.popular && (
                               <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#6366F1] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg shadow-indigo-500/20">Popular</div>
                            )}
                            
                            <div className="space-y-4">
                               <div className="flex items-center justify-between">
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                     selectedPlanId === plan.id ? 'bg-[#6366F1] text-white shadow-md' : 'bg-white border border-zinc-200/60 text-zinc-400 group-hover:border-zinc-300 shadow-xs'
                                  }`}>
                                     {plan.id === 'viral_scale' ? <Sparkles size={16} /> : plan.id === 'creator_pro' ? <Zap size={16} /> : <BarChart3 size={16} />}
                                  </div>
                                  {selectedPlanId === plan.id && <CheckCircle2 size={16} className="text-[#6366F1]" />}
                               </div>
                               <div>
                                  <h4 className="font-black text-zinc-950 text-sm tracking-tight">{plan.name}</h4>
                                  <div className="mt-2.5 flex items-baseline gap-0.5">
                                     <span className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">{isIndia ? '₹' : '$'}{getDisplayPrice(plan)}</span>
                                     <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{isAnnual ? '/yr' : '/mo'}</span>
                                  </div>
                               </div>
                               <ul className="space-y-2 pt-2 border-t border-zinc-100">
                                  {plan.features.map((f, i) => (
                                     <li key={i} className="flex items-center gap-2 text-[10px] font-semibold text-zinc-500 tracking-tight">
                                        <div className="w-1.5 h-1.5 bg-[#6366F1]/30 rounded-full" />
                                        <span>{f}</span>
                                     </li>
                                  ))}
                               </ul>
                            </div>
                         </div>
                      ))}
                   </div>

                   <button 
                     onClick={handleCheckout}
                     disabled={selectedPlanId === currentPlan}
                     className="w-full py-4 bg-zinc-950 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:opacity-50 hover:scale-[1.01] transition-all active:scale-[0.98]"
                   >
                      <span>{selectedPlanId === currentPlan ? "Current Active Plan" : `Upgrade to ${selectedPlanId.replace('_', ' ')}`}</span>
                      <ArrowRight size={14} />
                   </button>
                   
                   <p className="text-center text-[9px] text-zinc-400 font-bold uppercase tracking-widest pt-2">
                      🔒 Secure Checkout powered by Razorpay Subscriptions API
                   </p>
                </div>
             )}


             {/* Section: Invoices */}
             {activeTab === 'invoices' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="border border-zinc-200/60 rounded-[28px] overflow-hidden shadow-sm bg-white/50">
                      <table className="w-full text-left">
                         <thead className="bg-zinc-50">
                            <tr>
                               <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Invoice ID</th>
                               <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Plan</th>
                               <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Date</th>
                               <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Amount</th>
                               <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-right">Status</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-zinc-100">
                            {invoices.length > 0 ? (
                               invoices.map((inv) => (
                                  <tr key={inv.id} className="hover:bg-zinc-50/50 transition-all cursor-default">
                                     <td className="px-6 py-4 text-xs font-bold text-zinc-900">{inv.invoice_number}</td>
                                     <td className="px-6 py-4 text-xs font-semibold text-zinc-600">{inv.plan_name}</td>
                                     <td className="px-6 py-4 text-xs font-semibold text-zinc-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                                     <td className="px-6 py-4 text-xs font-bold text-zinc-900">{inv.currency} {inv.amount}</td>
                                     <td className="px-6 py-4 text-right">
                                        <span className={`px-2.5 py-1 text-[9px] font-semibold rounded-full border ${
                                          inv.status === 'paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-zinc-100 text-zinc-500 border-zinc-200"
                                        }`}>
                                           {inv.status}
                                        </span>
                                     </td>
                                  </tr>
                               ))
                            ) : (
                               <tr>
                                  <td colSpan="5" className="px-6 py-20 text-center text-zinc-400 font-medium text-xs">
                                     {loadingInvoices ? "Fetching your transaction history..." : "No invoices found. Your purchases will appear here."}
                                  </td>
                                </tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                   <div className="text-center py-6 bg-zinc-50 rounded-[28px] border border-zinc-200/60 border-dashed">
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Older invoices are archived. Contact support for assistance.</p>
                   </div>
                </div>
             )}
           </div>
         </div>
       </motion.div>
     </div>
      )}
    </AnimatePresence>
  );
}

