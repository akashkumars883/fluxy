"use client";

import { useDashboard } from "@/context/DashboardContext";
import { createClient } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BarChart3, CheckCircle2, CreditCard, Sparkles, Tag, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import * as logger from "@/lib/logger";

export default function SubscriptionModal({ isOpen, onClose, currentPlan = "free", realtimeStats, upgradeReason = "" }) {
  const { user, setCurrentPlan } = useDashboard();
  const [isIndia, setIsIndia] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(currentPlan);
  const [activeTab, setActiveTab] = useState('plans'); // 'plans', 'billing', 'invoices'

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(null); // { code, discountPercent }
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");

  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  // Auto-detect location based on Timezone
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isInd = tz === "Asia/Kolkata" || tz === "Asia/Calcutta";
      const timer = setTimeout(() => {
        setIsIndia(isInd);
      }, 0);
      return () => clearTimeout(timer);
    } catch (e) {
      logger.warn("SubscriptionModal: Location detection failed", e);
    }
  }, []);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      setLoadingInvoices(true);
      const supabase = createClient();
      const { data } = await supabase
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

  const usedQuota = (realtimeStats?.totalDms || 0) + (realtimeStats?.autoReplies || 0);
  const currentMaxQuota = currentPlan === "viral_scale" ? 50000 : currentPlan === "creator_pro" ? 15000 : 1000;
  const quotaPercent = Math.min(Math.round((usedQuota / currentMaxQuota) * 100), 100);

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price_inr: '0',
      price_usd: '0',
      features: ['1k AI Credits', '5 Automations', 'Basic CRM'],
      popular: false
    },
    {
      id: 'creator_pro',
      name: 'Creator Pro',
      price_inr: '899',
      price_usd: '14',
      features: ['15k AI Credits', 'Unlimited Automations', 'Story Mentions'],
      popular: true
    },
    {
      id: 'viral_scale',
      name: 'Viral Scale',
      price_inr: '1,999',
      price_usd: '29',
      features: ['50k AI Credits', 'Custom Persona', 'Priority SLA'],
      popular: false
    }
  ];


  const getDisplayPrice = (plan) => {
    if (plan.id === 'free') return '0';
    let rawPrice = isIndia ? plan.price_inr : plan.price_usd;
    let numeric = parseInt(rawPrice.replace(',', ''));
    if (isAnnual) {
      numeric = Math.round((numeric * 0.8) * 12);
    }
    if (promoApplied && plan.id !== 'free') {
      numeric = Math.round(numeric * ((100 - promoApplied.discountPercent) / 100));
      return isIndia ? numeric.toLocaleString('en-IN') : numeric.toLocaleString();
    }
    return isAnnual ? (isIndia ? numeric.toLocaleString('en-IN') : numeric.toLocaleString()) : rawPrice;
  };

  const getReasonMessage = () => {
    switch (upgradeReason) {
      case "multiple_accounts": return "Upgrade to Creator Pro to connect multiple Instagram accounts.";
      case "multiple_workspaces": return "Upgrade to Creator Pro to create multiple workspaces.";
      case "wildcard_keyword": return "Upgrade to unlock Wildcard (*) auto-replies.";
      case "cooldown": return "Upgrade to unlock 24-Hour Cooldown gates.";
      case "story_automator": return "Upgrade to unlock Story Mention automations.";
      case "automation_limit": return "You've reached your limit! Upgrade to create unlimited automations.";
      case "mini_store": return "Upgrade to unlock the Mini Store feature.";
      case "smart_bio": return "Upgrade to unlock the Smart Bio feature.";
      default: return "";
    }
  };

  const handleApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    setPromoLoading(true);
    setPromoError("");
    setPromoApplied(null);
    try {
      const { createClient: getClient } = await import("@/lib/supabase");
      const supabase = getClient();
      const { data, error } = await supabase
        .from("promo_codes")
        .select("code, customer_discount_percent, status")
        .eq("code", code)
        .eq("status", "active")
        .maybeSingle();

      // Also check hardcoded codes
      if (!data && code === "AUTOMIXA30") {
        setPromoApplied({ code, discountPercent: 30 });
      } else if (!data && code === "CREATORVIP") {
        setPromoApplied({ code, discountPercent: 20 });
      } else if (data) {
        setPromoApplied({ code: data.code, discountPercent: data.customer_discount_percent || 10 });
      } else {
        setPromoError("Invalid or expired promo code.");
      }
    } catch (e) {
      logger.error("SubscriptionModal: Promo validation error:", e);
      setPromoError("Could not verify promo code. Try again.");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoInput("");
    setPromoError("");
  };

  const handleCheckout = async () => {
    try {
      const storedRef = typeof window !== "undefined" ? localStorage.getItem("automixa_ref") : null;

      // 1. Create order on the server
      const createRes = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlanId,
          isAnnual,
          promoCode: promoApplied?.code || null,
          ref: storedRef
        }),
      });

      const orderData = await createRes.json();
      if (!createRes.ok || orderData.error) {
        throw new Error(orderData.error || "Failed to initiate payment");
      }

      // 2. Redirect to PhonePe payment page (or local simulation callback)
      if (orderData.redirectUrl) {
        window.location.href = orderData.redirectUrl;
      } else {
        throw new Error("Invalid payment gateway URL returned.");
      }
    } catch (err) {
      logger.error("SubscriptionModal: Checkout launch error:", err);
      alert("Could not start checkout process: " + err.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4">
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
            className="relative bg-white/95 backdrop-blur-3xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] rounded-xl shadow-2xl border border-zinc-200/80 overflow-hidden flex flex-col z-10"
          >

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white min-h-0">
              {/* Header */}
              <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b border-zinc-200/50 shrink-0">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-zinc-950 tracking-tight leading-none">
                    {activeTab === 'plans' ? "Available Plans" : "Invoice History"}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-zinc-500 font-medium mt-1.5">Manage your Automixa subscription and billing details</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-zinc-100 border border-zinc-200/60 rounded-xl transition-all shadow-sm cursor-pointer">
                  <X size={16} className="text-zinc-500 hover:text-zinc-900" />
                </button>
              </div>

              {/* Upgrade Reason Banner */}
              {upgradeReason && upgradeReason !== "general" && activeTab === 'plans' && (
                <div className="bg-indigo-50 border-b border-indigo-100 px-5 sm:px-6 py-3 flex items-start sm:items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg shrink-0 mt-0.5 sm:mt-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-indigo-900 leading-tight">Creator Pro Feature</h4>
                    <p className="text-xs font-medium text-indigo-700 mt-0.5">{getReasonMessage()}</p>
                  </div>
                </div>
              )}

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6">

                {/* Section: Plans */}
                {activeTab === 'plans' && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Toggles & Location */}
                    <div className="flex items-center justify-between w-full border-b border-zinc-100 pb-4">
                      <div className="bg-zinc-100/80 p-0.5 rounded-full flex items-center gap-0.5 border border-zinc-200/60 shadow-inner">
                        <button onClick={() => setIsAnnual(false)} className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all ${!isAnnual ? 'bg-white shadow-md text-zinc-950' : 'text-zinc-400 hover:text-zinc-900'}`}>Monthly</button>
                        <button onClick={() => setIsAnnual(true)} className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all ${isAnnual ? 'bg-white shadow-md text-zinc-950' : 'text-zinc-400 hover:text-zinc-900'}`}>Yearly <span className="text-[11px] text-emerald-600 ml-0.5">-20%</span></button>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200/60 rounded-full shadow-xs">
                        <span className="text-xs font-medium text-zinc-500">Billing Location:</span>
                        <span className="text-xs font-semibold text-[#6366F1]">{isIndia ? "🇮🇳 India (INR)" : "🌍 Global (USD)"}</span>
                      </div>
                    </div>

                    {/* Plan Cards - List View */}
                    <div className="flex flex-col gap-3">
                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlanId(plan.id)}
                          className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${selectedPlanId === plan.id
                              ? "bg-[#6366F1]/[0.02] border-[#6366F1] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                              : "bg-white border-zinc-200/60 hover:bg-zinc-50 hover:border-zinc-300"
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${selectedPlanId === plan.id ? 'bg-[#6366F1]/10 text-[#6366F1]' : 'bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200 group-hover:text-zinc-600'
                              }`}>
                              {plan.id === 'viral_scale' ? <Sparkles size={18} /> : plan.id === 'creator_pro' ? <Zap size={18} /> : <BarChart3 size={18} />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-zinc-950 text-sm tracking-tight leading-none">{plan.name}</h4>
                                {plan.popular && (
                                  <span className="bg-[#6366F1] text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">popular</span>
                                )}
                              </div>
                              <p className="text-[11px] text-zinc-500 font-medium mt-1.5 leading-tight">
                                {plan.features.join(" • ")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-zinc-100 pt-3 sm:pt-0">
                            <div className="text-left sm:text-right">
                              <div className="flex items-baseline justify-start sm:justify-end gap-0.5">
                                <span className="text-xl font-semibold text-zinc-950 tracking-tight leading-none">{isIndia ? '₹' : '$'}{getDisplayPrice(plan)}</span>
                                <span className="text-xs font-medium text-zinc-400">/{isAnnual ? 'yr' : 'mo'}</span>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${selectedPlanId === plan.id ? 'border-[#6366F1] bg-[#6366F1]' : 'border-zinc-300'
                              }`}>
                              {selectedPlanId === plan.id && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Promo Code Input */}
                    {selectedPlanId !== 'free' && selectedPlanId !== currentPlan && (
                      <div className="space-y-2">
                        {promoApplied ? (
                          <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                            <div className="flex items-center gap-2">
                              <Tag size={13} className="text-emerald-600" />
                              <span className="text-xs font-semibold text-emerald-700">{promoApplied.code}</span>
                              <span className="text-xs text-emerald-600">— {promoApplied.discountPercent}% off applied!</span>
                            </div>
                            <button onClick={handleRemovePromo} className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold underline underline-offset-2">Remove</button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                              <input
                                type="text"
                                placeholder="Have a promo code?"
                                value={promoInput}
                                onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                                onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                                className="w-full pl-8 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
                              />
                            </div>
                            <button
                              onClick={handleApplyPromo}
                              disabled={promoLoading || !promoInput.trim()}
                              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
                            >
                              {promoLoading ? "Checking…" : "Apply"}
                            </button>
                          </div>
                        )}
                        {promoError && <p className="text-xs text-rose-500 font-medium px-1">{promoError}</p>}
                      </div>
                    )}

                    <button
                      onClick={handleCheckout}
                      disabled={selectedPlanId === currentPlan}
                      className="w-full py-4 bg-zinc-950 text-white rounded-xl font-medium text-xs shadow-xl flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:opacity-50 hover:scale-[1.01] transition-all active:scale-[0.98]"
                    >
                      <span>{selectedPlanId === currentPlan ? "Current Active Plan" : `Upgrade to ${selectedPlanId.replace('_', ' ')}${promoApplied ? ` (${promoApplied.discountPercent}% off)` : ''}`}</span>
                      <ArrowRight size={14} />
                    </button>

                    <p className="text-center text-[11px] text-zinc-400 font-medium pt-2">
                      🔒 secure checkout powered by PhonePe payment gateway
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
                            <th className="px-6 py-4 text-xs font-medium text-zinc-400">Invoice ID</th>
                            <th className="px-6 py-4 text-xs font-medium text-zinc-400">Plan</th>
                            <th className="px-6 py-4 text-xs font-medium text-zinc-400">Date</th>
                            <th className="px-6 py-4 text-xs font-medium text-zinc-400">Amount</th>
                            <th className="px-6 py-4 text-xs font-medium text-zinc-400 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {invoices.length > 0 ? (
                            invoices.map((inv) => (
                              <tr key={inv.id} className="hover:bg-zinc-50/50 transition-all cursor-default">
                                <td className="px-6 py-4 text-xs font-medium text-zinc-900">{inv.invoice_number}</td>
                                <td className="px-6 py-4 text-xs font-semibold text-zinc-600">{inv.plan_name}</td>
                                <td className="px-6 py-4 text-xs font-semibold text-zinc-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-xs font-medium text-zinc-900">{inv.currency} {inv.amount}</td>
                                <td className="px-6 py-4 text-right">
                                  <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${inv.status === 'paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-zinc-100 text-zinc-500 border-zinc-200"
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
                      <p className="text-xs text-zinc-400 font-medium">older invoices are archived. contact support for assistance.</p>
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

