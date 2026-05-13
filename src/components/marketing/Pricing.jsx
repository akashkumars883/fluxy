"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { useState } from "react";

export default function Pricing() {
  const [isIndia, setIsIndia] = useState(true);

  const tiers = [
    {
      name: "Starter",
      price_inr: "0",
      price_usd: "0",
      desc: "Perfect for creators starting out.",
      features: [
        "1 Instagram Account",
        "5 Active Auto-Replies",
        "Instant Keyword Replies",
        "Simple Views & Clicks Stats"
      ],
      button: "Start for Free",
      popular: false
    },
    {
      name: "Growth",
      price_inr: "1,999",
      price_usd: "29",
      desc: "Perfect for growing creators.",
      features: [
        "3 Instagram Accounts",
        "Unlimited Auto-Replies",
        "Smart AI Follow-Up Messages",
        "Detailed Leads & Sales Stats",
        "Fast 24/7 Priority Support"
      ],
      button: "Get Pro Access",
      popular: true
    },
    {
      name: "Business",
      price_inr: "7,999",
      price_usd: "99",
      desc: "For agencies and large teams.",
      features: [
        "Unlimited Instagram Accounts",
        "Custom Branding Dashboard",
        "Train AI on Your Business Info",
        "Personal 1-on-1 Manager"
      ],
      button: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-10 md:py-12 bg-transparent relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        
        {/* Header Title Block (Synced with HowItWorks and Features) */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] mb-3 block">
              Fair Pricing
            </p>
            <h2 className="text-4xl md:text-6xl font-semibold text-foreground tracking-normal leading-[1.1]">
              Built for every <br />
              <span className="text-sage font-normal">scale.</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-base sm:text-lg max-w-sm font-normal leading-relaxed">
            Start free while we are in Beta. No credit card required. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-12 relative z-10">
          <div className="bg-zinc-100 p-1.5 rounded-full inline-flex items-center gap-1 shadow-inner border border-zinc-200">
            <button 
              onClick={() => setIsIndia(true)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${isIndia ? 'bg-white text-zinc-900 shadow-md' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              🇮🇳 India (₹)
            </button>
            <button 
              onClick={() => setIsIndia(false)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${!isIndia ? 'bg-white text-zinc-900 shadow-md' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              🌍 Global ($)
            </button>
          </div>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          {tiers.map((tier, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group flex flex-col justify-between rounded-[32px] p-8 lg:p-10 transition-all duration-500 relative ${
                tier.popular 
                  ? "bg-white/70 backdrop-blur-2xl border-2 border-[#6366F1] shadow-2xl shadow-indigo-500/10 scale-[1.03] hover:scale-[1.04] z-10" 
                  : "bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white hover:scale-[1.01] shadow-xl shadow-zinc-100/40 hover:shadow-2xl hover:shadow-zinc-200/40"
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#6366F1] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-indigo-500/30">
                  Most Popular
                </div>
              )}

              {/* Top Card Info */}
              <div>
                <div className="mb-6 relative z-10">
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-800 mb-2">{tier.name}</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm">{tier.desc}</p>
                </div>

                <div className="mb-8 flex items-baseline gap-1 relative z-10">
                  <span className="text-4xl sm:text-5xl font-extrabold text-zinc-800 tracking-tight">
                    {isIndia ? '₹' : '$'}{isIndia ? tier.price_inr : tier.price_usd}
                  </span>
                  <span className="text-zinc-400 text-xs sm:text-sm">/month</span>
                </div>

                {/* Features list */}
                <div className="space-y-4 mb-10 relative z-10">
                  {tier.features.map((feature, fi) => (
                    <div key={fi} className="flex items-center gap-3 text-zinc-600 text-xs sm:text-sm font-medium">
                      <CheckCircle2 size={16} className={tier.popular ? "text-[#6366F1]" : "text-zinc-400"} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="relative z-10">
                <Link 
                  href="/login"
                  className={`w-full py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn ${
                    tier.popular 
                      ? "bg-[#6366F1] text-white hover:bg-indigo-600 hover:scale-[1.02] shadow-lg shadow-indigo-500/20" 
                      : "bg-zinc-950 text-white hover:bg-zinc-900 hover:scale-[1.02] shadow-sm"
                  }`}
                >
                  {tier.button}
                  <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full-width Custom / Enterprise Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="group w-full mt-8 sm:mt-10 lg:mt-12 bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-xl shadow-zinc-100/40 hover:shadow-2xl hover:shadow-zinc-200/40 hover:scale-[1.005] transition-all duration-500 flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8 relative overflow-hidden"
        >
          {/* Inner ambient glow spot */}
          <div className="absolute top-1/2 -left-16 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -translate-y-1/2" />

          {/* Left Side: Info */}
          <div className="relative z-10 space-y-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-zinc-950 text-white shadow-sm">
              Custom Quota
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-800 tracking-tight">
              Need a tailored enterprise or agency plan?
            </h3>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-2xl leading-relaxed font-normal">
              Get custom API rate limits, dedicated database servers, complete white-label dashboards, custom AI agent persona training, and multi-team collaboration tools customized for your business.
            </p>
          </div>

          {/* Right Side: CTA Button */}
          <div className="relative z-10 shrink-0">
            <Link
              href="/login"
              className="inline-flex items-center gap-3 bg-zinc-950 text-white pl-6 pr-5 py-3.5 rounded-full font-bold text-xs sm:text-sm hover:scale-[1.02] hover:bg-zinc-900 transition-all shadow-sm group/btn"
            >
              Talk to Founders
              <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
