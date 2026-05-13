"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, DollarSign, Users, Gift, Link as LinkIcon, BarChart3, Star, Target, CheckCircle2 } from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import CTA from "@/components/marketing/CTA";

export default function PartnersPage() {
  // Calculator State
  const [referrals, setReferrals] = useState(25);
  // Assume avg subscription is ₹2999/mo, 30% commission is roughly ₹900/mo per user.
  const averageCommissionPerUser = 900; 
  const monthlyIncome = (referrals * averageCommissionPerUser).toLocaleString('en-IN');

  const steps = [
    {
      title: "Get Your Link",
      desc: "Sign up in 2 minutes and get your unique tracking link and custom promo codes.",
      icon: LinkIcon,
      color: "text-[#6366F1] bg-[#6366F1]/10"
    },
    {
      title: "Share with Audience",
      desc: "Promote Automixa on Instagram, YouTube, your blog, or directly to your clients.",
      icon: Users,
      color: "text-amber-500 bg-amber-500/10"
    },
    {
      title: "Earn Recurring Cash",
      desc: "Get paid 30% every single month for as long as your referred user stays active.",
      icon: DollarSign,
      color: "text-emerald-500 bg-emerald-500/10"
    }
  ];

  const tiers = [
    {
      name: "Silver",
      commission: "20%",
      req: "0 - 10 Referrals",
      perks: ["60-Day Cookie", "Basic Dashboard", "Standard Support"],
      active: false
    },
    {
      name: "Gold",
      commission: "30%",
      req: "11 - 50 Referrals",
      perks: ["Custom Promo Codes", "Marketing Assets", "Priority Support"],
      active: true // Highlighted tier
    },
    {
      name: "Platinum",
      commission: "40%",
      req: "50+ Referrals",
      perks: ["Free Automixa Premium", "Dedicated Manager", "Custom Co-branding"],
      active: false
    }
  ];

  return (
    <main className="min-h-screen text-foreground overflow-hidden relative font-sans pt-24 pb-6 selection:bg-[#6366F1]/20">
      
      {/* Ambient Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6366F1]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <PageTransition>
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          
          {/* HERO SECTION */}
          <div className="flex flex-col items-center text-center gap-6 mb-16 pt-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-widest border border-emerald-500/20"
            >
              <DollarSign size={14} />
              Partner Program
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1] max-w-4xl"
            >
              Earn <span className="text-[#6366F1] font-normal">Passive Income</span> <br className="hidden sm:block" /> with Automixa.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 text-lg sm:text-xl leading-relaxed max-w-2xl"
            >
              Join the Automixa Ambassadors program. Refer creators and brands to the best Instagram automation tool and earn up to 40% recurring commission every single month.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto"
            >
              <Link href="/login" className="px-8 py-4 bg-foreground text-background font-bold rounded-full hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 group w-full sm:w-auto">
                Become a Partner
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* INTERACTIVE CALCULATOR */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white rounded-[32px] border border-zinc-200/60 shadow-2xl overflow-hidden mb-24 relative"
          >
            {/* Soft glow behind calculator */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/5 to-transparent pointer-events-none" />
            
            <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row gap-12 items-center">
              
              {/* Slider Side */}
              <div className="w-full md:w-3/5 space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                    <BarChart3 className="text-[#6366F1]" />
                    Revenue Calculator
                  </h3>
                  <p className="text-zinc-500 mt-2">Drag the slider to see your potential monthly earnings based on active referrals.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-zinc-700 uppercase tracking-wider">Number of Referrals</span>
                    <span className="text-3xl font-bold text-[#6366F1]">{referrals}</span>
                  </div>
                  
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={referrals} 
                    onChange={(e) => setReferrals(parseInt(e.target.value))}
                    className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#6366F1]"
                  />
                  
                  <div className="flex justify-between text-xs font-bold text-zinc-400">
                    <span>1 User</span>
                    <span>100+ Users</span>
                  </div>
                </div>
              </div>

              {/* Result Side */}
              <div className="w-full md:w-2/5 bg-zinc-900 rounded-3xl p-8 text-center text-white shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest block mb-4 relative z-10">Monthly Passive Income</span>
                <div className="flex justify-center items-start gap-1 relative z-10">
                  <span className="text-2xl font-bold text-emerald-400 mt-2">₹</span>
                  <span className="text-6xl font-bold text-white tracking-tight">{monthlyIncome}</span>
                </div>
                <p className="text-zinc-400 text-xs mt-4 relative z-10">
                  *Calculated at 30% Gold Tier commission on average plan value. Earnings are recurring.
                </p>
              </div>

            </div>
          </motion.div>

          {/* HOW IT WORKS */}
          <div className="py-16 text-center max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight mb-16">
              How it works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 ${step.color}`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900">{step.title}</h3>
                    <p className="text-zinc-500 leading-relaxed text-sm">{step.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* TIERS SECTION */}
          <div className="py-20">
            <div className="text-center mb-16">
              <span className="text-[#6366F1] font-bold uppercase tracking-widest text-xs">Growth Paths</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mt-2 tracking-tight">
                The more you refer, the more you earn.
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {tiers.map((tier, idx) => (
                <div 
                  key={idx} 
                  className={`rounded-3xl p-8 border ${tier.active ? 'bg-zinc-900 border-zinc-800 text-white shadow-2xl scale-105 z-10' : 'bg-white border-zinc-200/60 text-zinc-900 shadow-lg'}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className={`text-xl font-bold ${tier.active ? 'text-white' : 'text-zinc-900'}`}>{tier.name}</h3>
                      <p className={`text-sm mt-1 ${tier.active ? 'text-zinc-400' : 'text-zinc-500'}`}>{tier.req}</p>
                    </div>
                    {tier.active && <Star className="text-amber-400 fill-amber-400" size={24} />}
                  </div>
                  
                  <div className="mb-8">
                    <span className={`text-5xl font-bold ${tier.active ? 'text-emerald-400' : 'text-[#6366F1]'}`}>{tier.commission}</span>
                    <span className={`text-sm font-bold ml-2 ${tier.active ? 'text-zinc-400' : 'text-zinc-500'}`}>Recurring</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {tier.perks.map((perk, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 size={18} className={tier.active ? 'text-emerald-400' : 'text-sage'} />
                        <span className={tier.active ? 'text-zinc-300' : 'text-zinc-600'}>{perk}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full py-3 rounded-full font-bold transition-all ${tier.active ? 'bg-white text-zinc-900 hover:bg-zinc-200' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'}`}>
                    Start at {tier.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </PageTransition>

      <div className="mt-16">
        <CTA />
      </div>
    </main>
  );
}
