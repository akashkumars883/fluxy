"use client";

import { createClient } from "@/lib/supabase";
import { AnimatePresence,motion } from "framer-motion";
import { ArrowRight,CheckCircle2,CreditCard,Tag,X,Zap } from "lucide-react";
import Link from "next/link";
import { useEffect,useState } from "react";
import { createPortal } from "react-dom";

export default function Pricing({ isModal = false } = {}) {
  const [isIndia, setIsIndia] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

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
      console.error("Location detection failed", e);
    }
  }, []);

  const tiers = [
    {
      name: "Free Plan",
      price_inr: "0",
      price_usd: "0",
      raw_inr: 0,
      raw_usd: 0,
      desc: "Perfect to test automated chat flows.",
      features: [
        "1 Instagram Account",
        "1 Personal Workspace",
        "25,000 AI Credits/mo",
        "5 Active Automations",
        "1,000 Auto-Replies/mo",
        "Follow before DM Gate",
        "Basic CRM (50 Contacts)",
        "Keyword Triggers Only"
      ],
      button: "Start Free",
      popular: false
    },
    {
      name: "Creator Pro",
      price_inr: "899",
      price_usd: "14",
      raw_inr: 899,
      raw_usd: 14,
      desc: "The sweet spot for Indian creators.",
      features: [
        "Multiple Connected Accounts",
        "Multiple Workspaces",
        "250,000 AI Credits (10X)",
        "Unlimited Automations",
        "AI Intent & Smart AI Mode",
        "AI Human Mimicry Mode",
        "Story Mention Responder",
        "Smart Bio & Mini Store Access",
        "CRM Unlimited + CSV Leads Export",
        "Ambassador Split Access (20%)"
      ],
      button: "Get Creator Pro",
      popular: true
    },
    {
      name: "Viral Scale",
      price_inr: "1,999",
      price_usd: "29",
      raw_inr: 1999,
      raw_usd: 29,
      desc: "For viral influencers & D2C brands.",
      features: [
        "2,000,000 AI Credits (100X)",
        "Everything in Creator Pro",
        "Auto-Fetch Profile Training",
        "Custom Brand Persona",
        "VIP Ambassador Split (25%)",
        "Priority WhatsApp Founder SLA"
      ],
      button: "Go Viral Scale",
      popular: false
    }
  ];

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    // 1. Check for mock codes first
    if (code === "AUTOMIXA30" || code === "CREATORVIP") {
      const discountPercent = code === "AUTOMIXA30" ? 30 : 20;
      const discountFactor = (100 - discountPercent) / 100;
      
      const newPriceInr = Math.round(selectedPlan.raw_inr * discountFactor);
      const newPriceUsd = Math.round(selectedPlan.raw_usd * discountFactor);
      
      setAppliedPromo({
        code,
        discountPercent,
        newPriceInr,
        newPriceUsd,
        partnerId: null
      });
      return;
    }

    // 2. Check Supabase DB for custom ambassador code
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*, partner_id")
        .eq("code", code)
        .eq("status", "active")
        .single();

      if (error || !data) {
        setPromoError("Invalid or inactive promo code. Please try again.");
        return;
      }

      const discountPercent = data.customer_discount_percent || 10;
      const discountFactor = (100 - discountPercent) / 100;
      
      const newPriceInr = Math.round(selectedPlan.raw_inr * discountFactor);
      const newPriceUsd = Math.round(selectedPlan.raw_usd * discountFactor);
      
      setAppliedPromo({
        code,
        discountPercent,
        newPriceInr,
        newPriceUsd,
        partnerId: data.partner_id
      });
    } catch (err) {
      console.error("Error applying database promo code:", err);
      setPromoError("Invalid promo code. Please try again.");
    }
  };

  const handleCheckoutSimulate = async () => {
    setCheckoutLoading(true);
    setPromoError(null);
    const planId = selectedPlan.name === "Viral Scale" ? "viral_scale" : "creator_pro";

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to login page and redirect back with upgrade parameter
        window.location.assign(`/login?redirect=/dashboard?upgrade=${planId}`);
        return;
      }

      const storedRef = typeof window !== "undefined" ? localStorage.getItem("automixa_ref") : null;

      // 1. Create order on the server
      const createRes = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          isAnnual: false, // Defaulting monthly on marketing page
          promoCode: appliedPromo?.code || null,
          ref: storedRef
        }),
      });

      const orderData = await createRes.json();
      if (!createRes.ok || orderData.error) {
        throw new Error(orderData.error || "Failed to initiate payment");
      }

      // 2. Load Razorpay Script dynamically
      const loadRzpScript = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const isLoaded = await loadRzpScript();
      if (!isLoaded) {
        alert("Failed to load Razorpay Checkout SDK. Please try again.");
        setCheckoutLoading(false);
        return;
      }

      // 3. Configure Razorpay checkout options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Automixa AI",
        description: `Subscription to ${selectedPlan.name}`,
        image: "/logo.png",
        order_id: orderData.isSimulated ? undefined : orderData.orderId,
        handler: async function (response) {
          try {
            setCheckoutLoading(true);
            // Call success webhook verification
            const res = await fetch("/api/checkout/success", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: orderData.isSimulated ? orderData.orderId : response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                plan_id: planId,
                user_id: user.id,
                amount: (orderData.amount / 100).toString(),
                currency: orderData.currency,
                email: user.email,
                name: user.user_metadata?.full_name || "Automixa User",
                partner_id: orderData.partnerId,
                promo_code: appliedPromo?.code || null
              }),
            });

            const result = await res.json();
            if (result.success) {
              setCheckoutSuccess(true);
              setTimeout(() => {
                window.location.assign(`/dashboard?upgrade=${planId}&payment=success`);
              }, 1500);
            } else {
              setPromoError("Payment verification failed: " + (result.error || "Unknown error"));
              setCheckoutLoading(false);
            }
          } catch (err) {
            console.error("Success verification error:", err);
            setPromoError("Error verifying transaction. Please contact support.");
            setCheckoutLoading(false);
          }
        },
        prefill: {
          name: orderData.userName || "",
          email: orderData.userEmail || "",
        },
        theme: {
          color: "#6366F1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout launch error:", err);
      setPromoError("Could not start checkout process: " + err.message);
      setCheckoutLoading(false);
    }
  };

  const handlePlanClick = (tier) => {
    if (tier.raw_inr === 0) {
      window.location.assign("/login");
      return;
    }
    // Redirect to dashboard with plan info to trigger the real modal
    const planId = tier.name === "Viral Scale" ? "viral_scale" : "creator_pro";
    window.location.assign(`/dashboard?upgrade=${planId}`);
  };

  return (
    <section id="pricing" className={`relative overflow-hidden ${isModal ? 'py-1' : 'py-12 md:py-16 bg-transparent'}`}>
      {/* Background Soft Glows */}
      {!isModal && (
        <>
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-10">

        {/* Header Title Block */}
        {!isModal && (
          <div className="flex flex-col items-center text-center mb-12 md:mb-16">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] mb-4 block">
                Transparent Pricing
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight leading-[1.1] mb-4">
                Simple pricing. <span className="text-sage font-normal">No surprises.</span>
              </h2>
            </div>
            <p className="text-zinc-500 text-sm md:text-lg max-w-sm font-normal leading-relaxed">
              Start free with 25,000 AI Credits. Upgrade anytime to unlock unlimited growth flows.
            </p>
          </div>
        )}

        {/* 3-Tier Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 ${isModal ? 'gap-4 sm:gap-5' : 'gap-8'} items-stretch`}>
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group flex flex-col justify-between transition-all duration-500 relative ${isModal ? 'rounded-2xl p-4 sm:p-5' : 'rounded-[48px] p-8 sm:p-10'
                } ${tier.popular
                  ? "bg-white/40 backdrop-blur-3xl border-2 border-[#6366F1] shadow-2xl shadow-indigo-500/20 scale-[1.02] z-10"
                  : "bg-white/40 backdrop-blur-3xl border border-white/60 hover:border-[#6366F1]/30 shadow-2xl shadow-zinc-200/10"
                }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#6366F1] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg shadow-indigo-500/30">
                  Most Popular
                </div>
              )}

              {/* Top Card Info */}
              <div>
                <div className={`${isModal ? 'mb-2' : 'mb-5'} relative z-10`}>
                  <h3 className={`${isModal ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} font-bold text-zinc-800 mb-1`}>{tier.name}</h3>
                  <p className={`text-zinc-500 ${isModal ? 'text-[11px]' : 'text-xs sm:text-sm'}`}>{tier.desc}</p>
                </div>

                <div className={`${isModal ? 'mb-3' : 'mb-6'} flex items-baseline gap-1 relative z-10`}>
                  <span className={`${isModal ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'} font-extrabold text-zinc-800 tracking-tight`}>
                    {isIndia ? '₹' : '$'}{isIndia ? tier.price_inr : tier.price_usd}
                  </span>
                  <span className={`text-zinc-400 ${isModal ? 'text-[11px]' : 'text-xs sm:text-sm'}`}>/month</span>
                </div>

                {/* Features list */}
                <div className={`${isModal ? 'space-y-1.5 mb-5' : 'space-y-3 mb-8'} relative z-10`}>
                  {tier.features.map((feature, fi) => (
                    <div key={fi} className={`flex items-center gap-2.5 text-zinc-600 ${isModal ? 'text-[11px]' : 'text-xs sm:text-sm'} font-medium`}>
                      <CheckCircle2 size={isModal ? 13 : 15} className={tier.popular ? "text-[#6366F1]" : "text-zinc-400"} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="relative z-10">
                <button
                  onClick={() => handlePlanClick(tier)}
                  className={`w-full ${isModal ? 'py-2.5 text-xs' : 'py-3 text-xs sm:text-sm'} rounded-full font-bold transition-all flex items-center justify-center gap-2 group/btn ${tier.popular
                      ? "bg-[#6366F1] text-white hover:bg-indigo-600 hover:scale-[1.02] shadow-lg shadow-indigo-500/20"
                      : "bg-zinc-950 text-white hover:bg-zinc-900 hover:scale-[1.02] shadow-sm"
                    }`}
                >
                  {tier.button}
                  <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full-width Custom / Enterprise Card */}
        {!isModal && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group w-full mt-6 sm:mt-10 bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white rounded-[24px] p-6 sm:p-8 lg:p-10 shadow-xl shadow-zinc-100/40 hover:shadow-2xl hover:shadow-zinc-200/40 transition-all duration-500 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden"
          >
            <div className="absolute top-1/2 -left-16 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -translate-y-1/2" />

            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider bg-zinc-950 text-white shadow-sm">
                Custom Quota
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-800 tracking-tight leading-tight">
                Need a tailored enterprise plan?
              </h3>
              <p className="text-zinc-500 text-xs sm:text-sm max-w-2xl leading-relaxed font-normal">
                Get custom API rate limits, dedicated database servers, complete white-label dashboards, and multi-team collaboration tools.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <Link
                href="/login"
                className="inline-flex items-center gap-3 bg-zinc-950 text-white pl-6 pr-5 py-3 rounded-full font-bold text-xs sm:text-sm hover:scale-[1.02] transition-all group/btn"
              >
                Talk to Founders
                <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        )}

      </div>

      {/* DEDICATED PROMO CODE & CHECKOUT MODAL USING REACT PORTAL */}
      <AnimatePresence>
        {selectedPlan && typeof document !== "undefined" && createPortal(
          <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
            <div
              className="fixed inset-0 bg-[#f3f3f3]/60 backdrop-blur-xl animate-in fade-in duration-500"
              onClick={() => setSelectedPlan(null)}
            />

            <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-zinc-200 rounded-[40px] shadow-2xl p-6 sm:p-8 flex flex-col gap-8 animate-in zoom-in-95 duration-500 z-10">

              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-zinc-200/50 pb-6 shrink-0">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6366F1]/10 text-[#6366F1] rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                    <Zap size={12} /> Secure Checkout
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">Complete Subscription</h2>
                  <p className="text-xs sm:text-sm font-normal text-zinc-500 mt-1">Activate your {selectedPlan.name} Plan instantly</p>
                </div>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="p-3 bg-white/40 border border-white/60 rounded-2xl text-zinc-500 hover:text-zinc-900 transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Order Summary & Pricing */}
              <div className="space-y-6">
                <div className="p-5 bg-zinc-50 border border-zinc-200/80 rounded-2xl flex items-center justify-between shadow-xs">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 tracking-tight">{selectedPlan.name} Monthly Plan</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Recurring billing, cancel anytime</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-extrabold tracking-tight ${appliedPromo ? 'line-through text-zinc-400 text-base font-semibold block' : 'text-zinc-900'}`}>
                      {isIndia ? '₹' : '$'}{isIndia ? selectedPlan.price_inr : selectedPlan.price_usd}
                    </span>
                    {appliedPromo && (
                      <span className="text-2xl font-extrabold text-emerald-600 block tracking-tight">
                        {isIndia ? '₹' : '$'}{isIndia ? appliedPromo.newPriceInr.toLocaleString('en-IN') : appliedPromo.newPriceUsd}
                      </span>
                    )}
                  </div>
                </div>

                {/* Promo Code Applied Success Badge */}
                {appliedPromo && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 animate-in fade-in duration-300">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      ✓
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-800 block">
                        🎉 Promo Code &apos;{appliedPromo.code}&apos; Applied! ({appliedPromo.discountPercent}% Off)
                      </span>
                      <p className="text-[10px] text-emerald-700/80 mt-0.5 leading-normal">
                        Affiliate commission attributed to creator partner via Razorpay Split.
                      </p>
                    </div>
                  </div>
                )}

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-900 ml-1 block">Have an Ambassador Promo Code?</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3.5 top-3.5 text-zinc-400" size={16} />
                      <input
                        type="text"
                        placeholder="e.g. AUTOMIXA30 or CREATORVIP"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value.replace(/\s+/g, ''))}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl text-xs font-bold text-zinc-900 outline-none focus:border-[#6366F1] uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs rounded-2xl shadow-sm transition-all h-[42px]"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-xs text-rose-600 font-semibold ml-1">{promoError}</p>}
                </form>

                {/* Razorpay Safe Banner */}
                <div className="p-4 bg-white/60 border border-zinc-200/80 rounded-2xl flex items-center gap-3">
                  <CreditCard size={20} className="text-[#6366F1] shrink-0" />
                  <span className="text-xs font-semibold text-zinc-600">
                    Secured by <strong className="text-zinc-900">Razorpay Subscriptions API</strong>. Automatic monthly recurring payments.
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center gap-4 border-t border-zinc-200/50 pt-6">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="px-6 py-4 rounded-2xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={checkoutLoading || checkoutSuccess}
                  onClick={handleCheckoutSimulate}
                  className="flex-1 px-8 py-4 bg-[#6366F1] hover:bg-[#5356e2] disabled:opacity-50 text-white rounded-2xl font-semibold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? "Connecting to Razorpay..." : checkoutSuccess ? "Subscription Active! Redirecting..." : "Proceed to Razorpay Checkout"}
                  {!checkoutLoading && !checkoutSuccess && <ArrowRight size={16} />}
                </button>
              </div>

            </div>
          </div>,
          document.body
        )}
      </AnimatePresence>

    </section>
  );
}
