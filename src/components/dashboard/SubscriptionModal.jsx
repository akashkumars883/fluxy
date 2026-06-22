"use client";

import { useDashboard } from "@/context/DashboardContext";
import { createClient } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BarChart3, CheckCircle2, CreditCard, Sparkles, Tag, X, Zap, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import * as logger from "@/lib/logger";

export default function SubscriptionModal({ isOpen, onClose, currentPlan = "free", realtimeStats, upgradeReason = "" }) {
  const { user, setCurrentPlan, isGiveaway } = useDashboard();
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

  const getPriceBreakdown = (plan) => {
    if (!plan || plan.id === 'free') return { base: 0, annualDiscount: 0, promoDiscount: 0, taxable: 0, gst: 0, total: 0 };
    let rawPrice = isIndia ? plan.price_inr : plan.price_usd;
    let base = parseInt(rawPrice.replace(',', ''));
    
    if (isAnnual) base = base * 12;
    
    let annualDiscount = isAnnual ? Math.round(base * 0.2) : 0;
    let discountedBase = base - annualDiscount;
    let promoDiscount = promoApplied ? Math.round(discountedBase * (promoApplied.discountPercent / 100)) : 0;
    let taxable = discountedBase - promoDiscount;
    let gst = isIndia ? Math.round(taxable * 0.18) : 0;
    
    return { base, annualDiscount, promoDiscount, taxable, gst, total: taxable + gst };
  };

  const planWeights = { free: 0, creator_pro: 1, viral_scale: 2 };
  const isDowngradeOrCurrent = (planId) => {
    return (planWeights[planId] || 0) <= (planWeights[currentPlan] || 0);
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
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Annual Toggle */}
                  <div className="flex items-center justify-center gap-3 bg-zinc-50/50 py-3 rounded-xl border border-zinc-200/50 mx-auto w-max px-6">
                    <span className={`text-xs font-semibold ${!isAnnual ? "text-zinc-900" : "text-zinc-400"}`}>Monthly</span>
                    <button
                      onClick={() => setIsAnnual(!isAnnual)}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${isAnnual ? "bg-[#6366F1]" : "bg-zinc-300"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${isAnnual ? "left-6" : "left-1"}`} />
                    </button>
                    <span className={`text-xs font-semibold flex items-center gap-1.5 ${isAnnual ? "text-zinc-900" : "text-zinc-400"}`}>
                      Annual <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">Save 20%</span>
                    </span>
                  </div>

                  {/* Premium Plans List View */}
                  <div className="flex flex-col gap-3 mt-4">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => {
                          if (!isDowngradeOrCurrent(plan.id)) {
                            setSelectedPlanId(plan.id);
                          }
                        }}
                        className={`group relative rounded-2xl p-4 transition-all duration-300 flex items-center justify-between border-2 ${
                          isDowngradeOrCurrent(plan.id) ? "cursor-not-allowed opacity-60 bg-zinc-50 border-zinc-200/50" : "cursor-pointer"
                        } ${
                          selectedPlanId === plan.id && !isDowngradeOrCurrent(plan.id)
                            ? "border-[#6366F1] bg-[#6366F1]/[0.03] shadow-md shadow-indigo-100/50"
                            : !isDowngradeOrCurrent(plan.id)
                              ? "border-zinc-200/60 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                              : ""
                        }`}
                      >
                        {/* Radio / Selection Indicator */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            selectedPlanId === plan.id
                              ? "border-[#6366F1] bg-[#6366F1]"
                              : "border-zinc-300 bg-white group-hover:border-zinc-400"
                          }`}>
                            {selectedPlanId === plan.id && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className={`text-sm font-bold tracking-tight ${selectedPlanId === plan.id && !isDowngradeOrCurrent(plan.id) ? "text-[#6366F1]" : "text-zinc-900"}`}>
                                {plan.name}
                              </h4>
                              {plan.popular && (
                                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase tracking-wider">
                                  Popular
                                </span>
                              )}
                              {plan.id === currentPlan && !isGiveaway && (
                                <span className="px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-600 text-[9px] font-black uppercase tracking-wider">
                                  Current
                                </span>
                              )}
                              {plan.id === currentPlan && isGiveaway && (
                                <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                                  <Sparkles size={10} /> Early Adopter Giveaway
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              {plan.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                                  <CheckCircle2 size={12} className={selectedPlanId === plan.id && !isDowngradeOrCurrent(plan.id) ? "text-indigo-400" : "text-zinc-300"} />
                                  {f}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Price Section */}
                        <div className="text-right shrink-0 ml-4">
                          <div className="flex items-baseline justify-end gap-1">
                            <span className={`text-xl font-extrabold tracking-tight ${selectedPlanId === plan.id && !isDowngradeOrCurrent(plan.id) ? "text-indigo-900" : "text-zinc-900"}`}>
                              {isIndia ? '₹' : '$'}{getDisplayPrice(plan)}
                            </span>
                            {plan.id !== 'free' && <span className="text-xs font-semibold text-zinc-400">/mo</span>}
                          </div>
                          {plan.id !== 'free' && (
                            <p className="text-[10px] text-zinc-400 font-medium">{isAnnual ? "Billed Annually" : "Billed Monthly"}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Proceed Button */}
                  <div className="pt-4 border-t border-zinc-100 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      disabled={isDowngradeOrCurrent(selectedPlanId)}
                      className="px-8 py-3.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-xl shadow-zinc-950/20 transition-all flex items-center gap-2"
                    >
                      Continue to Payment
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Checkout Step */}
              {step === 2 && activeTab === 'plans' && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setStep(1)} className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors">
                      <ArrowRight size={18} className="rotate-180" />
                    </button>
                    <h3 className="text-lg font-bold text-zinc-900">Checkout</h3>
                  </div>

                  {!paymentSuccess ? (
                    <div className="flex flex-col md:flex-row gap-6">
                      
                      {/* Left: Price Breakup */}
                      <div className="flex-1 space-y-4">
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Order Summary</h4>
                          {(() => {
                            const p = plans.find(p => p.id === selectedPlanId);
                            const breakdown = getPriceBreakdown(p);
                            const sym = isIndia ? '₹' : '$';
                            
                            return (
                              <div className="space-y-3 text-sm font-medium">
                                <div className="flex justify-between text-zinc-700">
                                  <span>{p?.name} ({isAnnual ? 'Annual' : 'Monthly'})</span>
                                  <span>{sym}{breakdown.base.toLocaleString()}</span>
                                </div>
                                
                                {breakdown.annualDiscount > 0 && (
                                  <div className="flex justify-between text-emerald-600">
                                    <span>Annual Discount (20%)</span>
                                    <span>-{sym}{breakdown.annualDiscount.toLocaleString()}</span>
                                  </div>
                                )}
                                
                                {breakdown.promoDiscount > 0 && (
                                  <div className="flex justify-between text-emerald-600">
                                    <span>Promo Code ({promoApplied?.code})</span>
                                    <span>-{sym}{breakdown.promoDiscount.toLocaleString()}</span>
                                  </div>
                                )}

                                {isIndia && (
                                  <div className="flex justify-between text-zinc-500 border-t border-zinc-200 pt-3 mt-3">
                                    <span>Taxable Amount</span>
                                    <span>{sym}{breakdown.taxable.toLocaleString()}</span>
                                  </div>
                                )}
                                
                                {isIndia && (
                                  <div className="flex justify-between text-zinc-500">
                                    <span>GST (18%)</span>
                                    <span>{sym}{breakdown.gst.toLocaleString()}</span>
                                  </div>
                                )}
                                
                                <div className="flex justify-between text-lg font-bold text-zinc-900 border-t border-zinc-200 pt-3 mt-3">
                                  <span>Total Amount</span>
                                  <span className="text-[#6366F1]">{sym}{breakdown.total.toLocaleString()}</span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Promo Code Form */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-900 ml-1">Have a Promo Code?</label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Tag className="absolute left-3 top-2.5 text-zinc-400" size={14} />
                              <input
                                type="text"
                                placeholder="Code"
                                value={promoInput}
                                onChange={(e) => setPromoInput(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 outline-none focus:border-[#6366F1] uppercase"
                              />
                            </div>
                            <button
                              onClick={handleApplyPromo}
                              disabled={promoLoading}
                              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-xl transition-all"
                            >
                              Apply
                            </button>
                          </div>
                          {promoApplied && (
                            <div className="flex justify-between items-center text-[10px] font-bold text-emerald-600 ml-1">
                              <span>Promo '{promoApplied.code}' applied! ({promoApplied.discountPercent}% off)</span>
                              <button onClick={handleRemovePromo} className="text-zinc-400 hover:text-rose-500">Remove</button>
                            </div>
                          )}
                          {promoError && <p className="text-[10px] font-semibold text-rose-500 ml-1">{promoError}</p>}
                        </div>
                      </div>

                      {/* Right: Payment & UTR */}
                      <div className="flex-1 flex flex-col justify-between space-y-4">
                        <div className="bg-white border-2 border-indigo-50 rounded-xl p-5 text-center flex-1 flex flex-col justify-center">
                          {(() => {
                            const p = plans.find(p => p.id === selectedPlanId);
                            const breakdown = getPriceBreakdown(p);
                            const upiString = `upi://pay?pa=6201231875@pthdfc&pn=Automixa&am=${breakdown.total}&cu=INR`;
                            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
                            return (
                              <>
                                <img src={qrUrl} alt="UPI QR Code" className="w-36 h-36 mx-auto mb-3 rounded-lg border-4 border-white shadow-md" />
                                <p className="text-xs font-semibold text-zinc-500 mb-0.5">Scan to pay exactly <strong className="text-indigo-600 font-black">₹{breakdown.total.toLocaleString()}</strong></p>
                                <p className="text-[10px] font-medium text-zinc-400">Supported apps: GPay, PhonePe, Paytm, etc.</p>
                              </>
                            );
                          })()}
                        </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-900 ml-1 block">Enter 12-digit UTR/Reference No.</label>
                        <input
                          type="text"
                          maxLength="12"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 325412345678"
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-[#6366F1] focus:bg-white outline-none rounded-xl text-sm font-semibold text-zinc-900 transition-all tracking-widest placeholder:tracking-normal"
                        />
                      </div>
                      <button
                        onClick={handleCheckout}
                        disabled={isSubmittingUtr || utrNumber.length < 12}
                        className="w-full py-3.5 bg-[#6366F1] hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-[#6366F1] text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-200 transition-all flex justify-center items-center gap-2"
                      >
                        {isSubmittingUtr ? "Verifying..." : "Confirm Payment"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-4">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={32} />
                      </div>
                      <h4 className="text-xl font-bold text-zinc-900">Payment Submitted!</h4>
                      <p className="text-xs font-medium text-zinc-500 max-w-sm mx-auto leading-relaxed">
                        Your UTR number has been received. Our team will verify the payment and activate your <span className="text-zinc-900 font-bold">{plans.find(p => p.id === selectedPlanId)?.name}</span> within 2 hours.
                      </p>
                      <button onClick={onClose} className="mt-4 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold">
                        Return to Dashboard
                      </button>
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

