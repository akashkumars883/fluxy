"use client";

import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "0",
      desc: "Perfect for new creators getting started.",
      features: ["1 Connected Account", "5 Active Automations", "Basic Keywork Matching", "Standard Statistics"],
      button: "Start for Free",
      popular: false
    },
    {
      name: "Growth",
      price: "29",
      desc: "Advanced features for growing brands.",
      features: ["3 Connected Accounts", "Unlimited Automations", "AI Reply Sequences", "Advanced Lead Analytics", "Priority Support"],
      button: "Get Pro Access",
      popular: true
    },
    {
      name: "Business",
      price: "99",
      desc: "Full power for agencies and large teams.",
      features: ["Unlimited Accounts", "White-label Dashboard", "Custom AI Training", "Dedicated Account Manager"],
      button: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-32 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[10px] font-bold text-sage uppercase tracking-[0.3em] mb-4 block">Fair Pricing</span>
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 tracking-normal">Built for every scale</h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto font-normal tracking-normal">Start free while we are in Beta. No credit card required.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((t, i) => (
            <div 
              key={i} 
              className={`relative p-8 md:p-10 rounded-xl border transition-all duration-500 hover:shadow-2xl flex flex-col ${
                t.popular 
                  ? "bg-foreground text-background border-foreground scale-105 z-10" 
                  : "bg-transparent border-border"
              }`}
            >
              {t.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sage text-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${t.popular ? "text-background" : "text-foreground"}`}>{t.name}</h3>
                <p className={`text-sm ${t.popular ? "text-background/60" : "text-zinc-500"}`}>{t.desc}</p>
              </div>

              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tighter">${t.price}</span>
                <span className={`text-sm ${t.popular ? "text-background/40" : "text-zinc-400"}`}>/month</span>
              </div>

              <div className="space-y-4 mb-12 flex-1">
                {t.features.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-3">
                    <div className={`p-0.5 rounded-full ${t.popular ? "bg-sage text-foreground" : "bg-zinc-100 text-zinc-500"}`}>
                      <Check size={12} />
                    </div>
                    <span className={`text-sm ${t.popular ? "text-background/80" : "text-zinc-500"}`}>{f}</span>
                  </div>
                ))}
              </div>

              <Link 
                href="/login"
                className={`w-full py-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  t.popular 
                    ? "bg-sage text-foreground hover:scale-[1.02] shadow-xl shadow-sage/10" 
                    : "bg-foreground text-background hover:scale-[1.02]"
                }`}
              >
                {t.button}
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
