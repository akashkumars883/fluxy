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
  const [step, setStep] = useState(1); // 1 = plans, 2 = checkout

  // Reset to step 1 when tab changes or modal closes/opens.
  // We use the functional setter form to avoid the "setState synchronously
  // in effect" cascading-render lint error: the update is treated as a
  // queued state transition, not a synchronous write during render.
  useEffect(() => {
    setStep((prev) => (prev === 1 ? prev : 1));
  }, [activeTab, isOpen]);

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(null); // { code, discountPercent }
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");

  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  // Manual UPI State
  const [utrNumber, setUtrNumber] = useState("");
  const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);


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
      features: ['1k AI Credits', '2 Accounts', '5 Automations'],
      popular: false
    },
    {
      id: 'creator_pro',
      name: 'Business Pro',
      price_inr: '899',
      price_usd: '14',
      features: ['15k AI Credits', 'Unlimited Automations', 'Story Mentions'],
      popular: true
    },
    {
      id: 'viral_scale',
      name: 'Business Scale',
      price_inr: '1,999',
      price_usd: '29',
      features: ['50k AI Credits', 'Custom Persona', 'Priority SLA'],
      popular: false
    }
  ];


  const getDisplayPrice = (plan, includeGst = false) => {
    if (plan.id === 'free') return '0';
    let rawPrice = isIndia ? plan.price_inr : plan.price_usd;
    let numeric = parseInt(rawPrice.replace(',', ''));
    if (isAnnual) {
      numeric = Math.round((numeric * 0.8) * 12);
    }
    if (promoApplied && plan.id !== 'free') {
      numeric = Math.round(numeric * ((100 - promoApplied.discountPercent) / 100));
    }
    if (includeGst && isIndia) {
      const gst = Math.round(numeric * 0.18);
      numeric = numeric + gst;
    }
    return isIndia ? numeric.toLocaleString('en-IN') : numeric.toLocaleString();
  };

  const getReasonMessage = () => {
    switch (upgradeReason) {
      case "multiple_accounts": return "Upgrade to Business Pro to connect multiple Instagram accounts.";
      case "multiple_workspaces": return "Upgrade to Business Pro to create multiple workspaces.";
      case "wildcard_keyword": return "Upgrade to unlock Wildcard (*) auto-replies.";
      case "cooldown": return "Upgrade to unlock 24-Hour Cooldown gates.";
      case "story_automator": return "Upgrade to unlock Story Mention automations.";
      case "automation_limit": return "You've reached your limit. Upgrade to create more business workflows.";
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
    if (!utrNumber || utrNumber.length < 12) {
      alert("Please enter a valid 12-digit UPI Ref No.");
      return;
    }

    setIsSubmittingUtr(true);
    try {
      const finalAmount = getDisplayPrice(plans.find(p => p.id === selectedPlanId), true).replace(/,/g, '');
      
      const res = await fetch("/api/payments/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlanId,
          isAnnual,
          promoCode: promoApplied?.code || null,
          utrNumber,
          amount: parseFloat(finalAmount)
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit payment");
      }

      setPaymentSuccess(true);
      setUtrNumber("");
    } catch (err) {
      logger.error("SubscriptionModal: UTR submit error:", err);
      alert("Could not submit payment: " + err.message);
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/60"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`relative bg-white w-full ${step === 2 && !paymentSuccess ? 'max-w-3xl' : 'max-w-lg'} max-h-[85vh] rounded-xl border border-zinc-200/80 overflow-y-auto no-scrollbar flex flex-col z-10 transition-all duration-300 pointer-events-auto`}
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-zinc-100 shrink-0">
              <div>
                <h3 className="text-xl font-semibold text-zinc-950 tracking-tight leading-none">
                  {step === 1 ? "Billing & Subscription" : "Checkout"}
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 font-semibold mt-1.5">
                  {step === 1 
                    ? "Manage plans, verify invoices, and update billing settings."
                    : "Complete your subscription upgrade securely."}
                </p>
              </div>
              <button onClick={onClose} className="p-2 bg-zinc-50 border border-zinc-200/60 hover:bg-zinc-100 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-zinc-800">
                <X size={16} />
              </button>
            </div>
 
            {/* Premium Segmented Tab Selector */}
            {step === 1 && (
              <div className="flex border-b border-zinc-100 px-6 shrink-0 bg-zinc-50/50">
                <button
                  onClick={() => setActiveTab('plans')}
                  className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'plans'
                      ? 'border-[#6366F1] text-[#6366F1]'
                      : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  Choose Plan
                </button>
                <button
                  onClick={() => setActiveTab('invoices')}
                  className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'invoices'
                      ? 'border-[#6366F1] text-[#6366F1]'
                      : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  Invoice History
                </button>
              </div>
            )}
 
            {/* Upgrade Reason Banner */}
            {upgradeReason && upgradeReason !== "general" && activeTab === 'plans' && step === 1 && (
              <div className="bg-indigo-50/60 border-b border-indigo-100 px-6 py-3 flex items-start sm:items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-indigo-500/10 text-[#6366F1] p-1.5 rounded-xl shrink-0">
                  <Sparkles size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-indigo-900 uppercase tracking-wide">Business Pro Feature</h4>
                  <p className="text-xs font-semibold text-indigo-700 mt-0.5">{getReasonMessage()}</p>
                </div>
              </div>
            )}

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
              
              {/* Section: Plans */}
              {activeTab === 'plans' && step === 1 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  {/* Monthly / Yearly Toggle */}
                  <div className="flex justify-center border-b border-zinc-100 pb-4">
                    <div className="bg-zinc-100 p-0.5 rounded-xl flex items-center gap-0.5 border border-zinc-200/60 w-fit">
                      <button 
                        onClick={() => setIsAnnual(false)} 
                        className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${!isAnnual ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-zinc-800'}`}
                      >
                        Monthly
                      </button>
                      <button 
                        onClick={() => setIsAnnual(true)} 
                        className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${isAnnual ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-zinc-800'}`}
                      >
                        Yearly 
                        <span className="text-[9px] px-1 py-0.2 bg-emerald-500 text-white rounded-xl font-semibold">-20%</span>
                      </button>
                    </div>
                  </div>

                  {/* Plan Picker List */}
                  <div className="space-y-3">
                    {plans.map((plan) => {
                      const isCurrent = plan.id === currentPlan;
                      const isSelected = selectedPlanId === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlanId(plan.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 group ${
                            isSelected
                              ? "bg-indigo-50/10 border-[#6366F1]"
                              : "bg-white border-zinc-100 hover:bg-zinc-50/50 hover:border-zinc-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 ${
                              isSelected ? 'bg-[#6366F1]/15 text-[#6366F1]' : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100'
                            }`}>
                              {plan.id === 'viral_scale' ? <Sparkles size={16} /> : plan.id === 'creator_pro' ? <Zap size={16} /> : <BarChart3 size={16} />}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-semibold text-zinc-900 text-xs tracking-tight">{plan.name}</h4>
                                {plan.popular && (
                                  <span className="bg-[#6366F1] text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-xl uppercase tracking-wider">popular</span>
                                )}
                                {isCurrent && (
                                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-semibold px-1.5 py-0.5 rounded-xl uppercase tracking-wider">Active</span>
                                )}
                              </div>
                              <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                                {plan.features.join(" • ")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className="flex items-baseline justify-end gap-0.5">
                                <span className="text-sm font-semibold text-zinc-900 tracking-tight">
                                  {isIndia ? '₹' : '$'}{getDisplayPrice(plan, false)}
                                </span>
                                <span className="text-[9px] font-medium text-zinc-400">/{isAnnual ? 'yr' : 'mo'}</span>
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded-xl border flex items-center justify-center transition-all shrink-0 ${
                              isSelected ? 'border-[#6366F1] bg-[#6366F1]' : 'border-zinc-200 bg-white group-hover:border-zinc-300'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-xl" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Proceed to Checkout CTA */}
                  <div className="pt-3">
                    <button
                      onClick={() => setStep(2)}
                      disabled={selectedPlanId === currentPlan}
                      className="w-full py-3 bg-zinc-950 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-zinc-800 disabled:opacity-50 transition-all active:scale-[0.99] cursor-pointer"
                    >
                      <span>{selectedPlanId === currentPlan ? "Current Plan Active" : "Proceed to Checkout"}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'plans' && step === 2 && (
                <div className="animate-in fade-in duration-300 flex flex-col">
                  {/* Back button */}
                  {!paymentSuccess && (
                    <button 
                      onClick={() => setStep(1)} 
                      className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer mb-4"
                    >
                      <span>← Back to plans</span>
                    </button>
                  )}

                  {paymentSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 sm:p-8 text-center space-y-4">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900">Payment Submitted!</h3>
                      <p className="text-sm text-zinc-600 max-w-sm mx-auto">
                        Your UPI Reference Number has been received. Our team will verify the payment and upgrade your account within 1-2 hours.
                      </p>
                      <button
                        onClick={onClose}
                        className="mt-4 px-6 py-2.5 bg-zinc-950 text-white rounded-xl font-semibold text-xs hover:bg-zinc-800 transition-all cursor-pointer"
                      >
                        Back to Dashboard
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      {/* Left Side: Order Summary */}
                      <div className="bg-zinc-50/80 border border-zinc-200/60 rounded-xl p-5 sm:p-6 space-y-5 flex flex-col">
                        <div>
                          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-200/50 pb-2 mb-4">Order Summary</h4>
                          
                          {/* Selected Plan Summary card */}
                          <div className="bg-white border border-zinc-200 rounded-xl p-3 flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/50">
                                {selectedPlanId === 'viral_scale' ? <Sparkles size={16} /> : selectedPlanId === 'creator_pro' ? <Zap size={16} /> : <BarChart3 size={16} />}
                              </div>
                              <div>
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Plan</span>
                                <h5 className="text-sm font-bold text-zinc-900 leading-none mt-0.5">{plans.find(p => p.id === selectedPlanId)?.name}</h5>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-indigo-600">
                                {isIndia ? '₹' : '$'}{getDisplayPrice(plans.find(p => p.id === selectedPlanId), false)}
                              </span>
                              <p className="text-[9px] text-zinc-400 font-semibold mt-0.5">/{isAnnual ? 'yr' : 'mo'}</p>
                            </div>
                          </div>

                      {/* Promo Code Input (Hidden for free plan) */}
                      {selectedPlanId !== 'free' && (
                        <div className="space-y-2 mb-4">
                          {promoApplied ? (
                            <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 border border-emerald-200/80 rounded-xl animate-in zoom-in-95 duration-200">
                              <div className="flex items-center gap-1.5">
                                <Tag size={12} className="text-emerald-600" />
                                <span className="text-[11px] font-semibold text-emerald-700">{promoApplied.code}</span>
                                <span className="text-[10px] font-medium text-emerald-600">({promoApplied.discountPercent}% off)</span>
                              </div>
                              <button onClick={handleRemovePromo} className="text-[10px] text-emerald-600 hover:text-emerald-800 font-semibold underline cursor-pointer">Remove</button>
                            </div>
                          ) : (
                            <div className="flex gap-1.5">
                              <div className="relative flex-1">
                                <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                  type="text"
                                  placeholder="Promo code?"
                                  value={promoInput}
                                  onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                                  className="w-full pl-8 pr-2 py-2 bg-white border border-zinc-200 rounded-xl text-[11px] font-medium text-zinc-800 outline-none focus:border-indigo-400 transition-colors placeholder:text-zinc-400"
                                />
                              </div>
                              <button
                                onClick={handleApplyPromo}
                                disabled={promoLoading || !promoInput.trim()}
                                className="px-3 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-[10px] rounded-xl transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
                              >
                                {promoLoading ? "..." : "Apply"}
                              </button>
                            </div>
                          )}
                          {promoError && <p className="text-[10px] text-rose-500 font-semibold px-1">{promoError}</p>}
                        </div>
                      )}

                      {/* Cost Breakdown */}
                      {selectedPlanId !== 'free' ? (
                        <div className="border-t border-zinc-200/60 pt-3 space-y-2">
                          <div className="flex justify-between text-[11px] font-medium text-zinc-400">
                            <span>Subtotal</span>
                            <span>{isIndia ? '₹' : '$'}{
                              (isAnnual 
                                ? Math.round((parseInt(plans.find(p => p.id === selectedPlanId).price_inr.replace(',', '')) * 0.8) * 12) 
                                : parseInt(plans.find(p => p.id === selectedPlanId).price_inr.replace(',', ''))
                              ).toLocaleString(isIndia ? 'en-IN' : 'en-US')
                            }</span>
                          </div>
                          
                          {promoApplied && (
                            <div className="flex justify-between text-[11px] font-semibold text-emerald-600">
                              <span>Discount ({promoApplied.discountPercent}%)</span>
                              <span>-{isIndia ? '₹' : '$'}{
                                Math.round(
                                  (isAnnual 
                                    ? (parseInt(plans.find(p => p.id === selectedPlanId).price_inr.replace(',', '')) * 0.8) * 12 
                                    : parseInt(plans.find(p => p.id === selectedPlanId).price_inr.replace(',', '')))
                                  * (promoApplied.discountPercent / 100)
                                ).toLocaleString(isIndia ? 'en-IN' : 'en-US')
                              }</span>
                            </div>
                          )}

                          {isIndia && (
                            <div className="flex justify-between text-[11px] font-medium text-zinc-400">
                              <span>GST (18%)</span>
                              <span>₹{
                                Math.round(
                                  (promoApplied
                                    ? Math.round(
                                        (isAnnual 
                                          ? (parseInt(plans.find(p => p.id === selectedPlanId).price_inr.replace(',', '')) * 0.8) * 12 
                                          : parseInt(plans.find(p => p.id === selectedPlanId).price_inr.replace(',', '')))
                                        * ((100 - promoApplied.discountPercent) / 100)
                                      )
                                    : (isAnnual 
                                        ? Math.round((parseInt(plans.find(p => p.id === selectedPlanId).price_inr.replace(',', '')) * 0.8) * 12) 
                                        : parseInt(plans.find(p => p.id === selectedPlanId).price_inr.replace(',', '')))
                                  ) * 0.18
                                ).toLocaleString('en-IN')
                              }</span>
                            </div>
                          )}

                        <div className="border-t border-zinc-200/60 pt-4 mt-auto">
                          <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Payable</span>
                            <span className="text-xl font-black text-zinc-950 tracking-tight">{isIndia ? '₹' : '$'}{getDisplayPrice(plans.find(p => p.id === selectedPlanId), true)}</span>
                          </div>
                        </div>
                        </div>
                      ) : (
                        <div className="border-t border-zinc-200/60 pt-4 mt-auto flex justify-between items-end">
                          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Payable</span>
                          <span className="text-xl font-black text-zinc-950 tracking-tight">₹0 / $0</span>
                        </div>
                      )}
                      </div>
                    </div>

                    {/* Right Side: Payment Action */}
                    <div className="relative bg-white border border-indigo-100/80 rounded-xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
                      {/* Decorative Background Accents */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-xl-full pointer-events-none -z-10" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-50/30 rounded-xl-full pointer-events-none -z-10" />

                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <Zap size={12} className="fill-current" />
                          </div>
                          <h4 className="text-sm font-bold text-zinc-900">Secure UPI Payment</h4>
                        </div>
                        
                        {selectedPlanId !== 'free' && (
                          <div className="space-y-5">
                            <div className="text-center">
                              <p className="text-[11px] font-semibold text-zinc-500 mb-3">Scan with PhonePe, GPay, or Paytm</p>
                              <div className="mx-auto w-44 h-44 bg-white p-2 rounded-xl flex items-center justify-center border-2 border-indigo-100">
                                <img 
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=6201231875@pthdfc&pn=Automixa&am=${getDisplayPrice(plans.find(p => p.id === selectedPlanId), true).replace(/,/g, '')}`} 
                                  alt="UPI QR Code" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <p className="text-[10px] text-zinc-500 font-medium mt-3 bg-zinc-50 inline-block px-3 py-1 rounded-xl border border-zinc-200">
                                UPI ID: <strong className="text-zinc-800 select-all tracking-wide">6201231875@pthdfc</strong>
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest block ml-1">Enter 12-Digit UPI Ref No.</label>
                              <input
                                type="text"
                                placeholder="e.g. 315482910384"
                                value={utrNumber}
                                onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, '').slice(0, 22))}
                                className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm font-bold text-zinc-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-zinc-400 placeholder:font-medium"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 pt-6 mt-auto">
                        <button
                          onClick={handleCheckout}
                          disabled={selectedPlanId !== 'free' && (!utrNumber || isSubmittingUtr || utrNumber.length < 12)}
                          className="w-full py-3.5 bg-zinc-950 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-800 hover:-translate-y-0.5 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                        >
                          <span>{isSubmittingUtr ? "Verifying..." : selectedPlanId === 'free' ? "Confirm Switch" : `Submit Payment`}</span>
                          <ArrowRight size={16} />
                        </button>
                        <p className="text-center text-[10px] font-semibold text-emerald-600 flex items-center justify-center gap-1.5 bg-emerald-50 py-1.5 rounded-xl border border-emerald-100">
                          {selectedPlanId !== 'free' ? <><CheckCircle2 size={12} /> Direct Bank Transfer (No Extra Fees)</> : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              )}

              {/* Section: Invoices */}
              {activeTab === 'invoices' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white/50">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-zinc-50 border-b border-zinc-150">
                        <tr>
                          <th className="px-6 py-3.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Invoice ID</th>
                          <th className="px-6 py-3.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Plan</th>
                          <th className="px-6 py-3.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {invoices.length > 0 ? (
                          invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-zinc-50/50 transition-all cursor-default">
                              <td className="px-6 py-4 text-xs font-semibold text-zinc-900">{inv.invoice_number}</td>
                              <td className="px-6 py-4 text-xs font-semibold text-zinc-600">{inv.plan_name}</td>
                              <td className="px-6 py-4 text-xs font-semibold text-zinc-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-xs font-semibold text-zinc-900">{inv.currency} {inv.amount}</td>
                              <td className="px-6 py-4 text-right">
                                <span className={`px-2.5 py-0.8 text-[10px] font-semibold rounded-xl border ${
                                  inv.status === 'paid' 
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                    : "bg-zinc-50 text-zinc-400 border-zinc-200"
                                }`}>
                                  {inv.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-20 text-center text-zinc-400 font-semibold text-xs bg-zinc-50/30">
                              {loadingInvoices ? "Fetching your transaction history..." : "No invoices found. Your purchases will appear here."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-center py-6 bg-zinc-50 rounded-xl border border-zinc-200 border-dashed">
                    <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">older invoices are archived. contact support for assistance.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

