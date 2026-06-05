"use client";

import CTA from "@/components/marketing/CTA";
import FAQ from "@/components/marketing/FAQ";
import PageTransition from "@/components/ui/PageTransition";
import { createClient } from "@/lib/supabase";
import { AnimatePresence,motion } from "framer-motion";
import { ArrowRight,BarChart3,CheckCircle2,DollarSign,Link as LinkIcon,Send,Sparkles,Star,Users,X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PartnersPage() {
  // Calculator State
  const [referrals, setReferrals] = useState(25);
  // Average commission per user on ₹1,999/mo plan at 20% Gold Tier is ₹400
  const averageCommissionPerUser = 400; 
  const monthlyIncome = (referrals * averageCommissionPerUser).toLocaleString('en-IN');

  // Application Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({ platform: "instagram", audienceRange: "10k-50k", handle: "", plan: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setIsApplying(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("partner_profiles").upsert({
          id: user.id,
          application_status: "pending",
          primary_platform: formData.platform,
          audience_tier: formData.audienceRange,
          social_handle: formData.handle,
          master_tracking_link: `https://automixa.com/?ref=${formData.handle.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'partner'}_${Date.now().toString().slice(-4)}`
        });
      }
    } catch (err) {
      console.error("Error inserting partner application:", err);
    } finally {
      setIsApplying(false);
      setIsSubmitted(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("partner_app_status", "pending");
      }
    }
  };

  const steps = [
    {
      title: "Apply & Get Vetted",
      desc: "Submit your business profile, agency website, or content channel. Our team reviews applications within 24 hours.",
      icon: LinkIcon,
      color: "text-[#6366F1] bg-[#6366F1]/10"
    },
    {
      title: "Share with Audience",
      desc: "Share Automixa with businesses, agencies, and teams that manage customer conversations.",
      icon: Users,
      color: "text-amber-500 bg-amber-500/10"
    },
    {
      title: "Earn Recurring Cash",
      desc: "Get paid up to 25% every single month for as long as your referred user stays active.",
      icon: DollarSign,
      color: "text-emerald-500 bg-emerald-500/10"
    }
  ];

  const tiers = [
    {
      name: "Silver",
      commission: "15%",
      req: "0 - 10 Referrals",
      perks: ["10% Customer Discount", "60-Day Cookie", "Standard Support"],
      active: false
    },
    {
      name: "Gold",
      commission: "20%",
      req: "11 - 50 Referrals",
      perks: ["10% Customer Discount", "Custom Promo Codes", "Priority Support"],
      active: true 
    },
    {
      name: "Platinum",
      commission: "25%",
      req: "50+ Referrals",
      perks: ["15% Customer Discount", "Free Automixa Premium", "Dedicated Manager"],
      active: false
    }
  ];

  const partnerFaqs = [
    {
      q: "How and when do I get paid?",
      a: "Payouts are disbursed on the 5th of every month for the previous month's earnings. We support UPI, Direct Bank Transfer, and Razorpay Route for fast, hassle-free payments."
    },
    {
      q: "What is the cookie duration for referrals?",
      a: "We use a 60-day tracking cookie. If a user clicks your link and signs up anytime within 60 days, the referral is attributed to you permanently."
    },
    {
      q: "Can I create my own custom promo codes?",
      a: "Yes! Once you reach the Gold Tier (11+ referrals), you can create custom vanity promo codes (for example, 'PARTNER20') that give your audience a discount and track your commission."
    },
    {
      q: "Is there a limit to how much I can earn?",
      a: "Absolutely not. The more users you refer, the higher your commission percentage becomes (up to 25%). Since Automixa is a subscription service, you earn every month the user stays active."
    }
  ];

  return (
    <main className="min-h-screen text-foreground overflow-hidden relative font-sans pt-32 pb-16 selection:bg-[#6366F1]/20">
      
      {/* Ambient Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6366F1]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <PageTransition>
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          
          {/* HERO SECTION */}
          {/* ... existing hero code ... */}
          <div className="flex flex-col items-center text-center gap-6 mb-16">
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
              Join the Automixa partner program. Refer businesses and agencies to our customer messaging workspace and earn up to 25% recurring commission plus customer discounts.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto"
            >
              <button 
                onClick={() => { setIsSubmitted(false); setShowApplyModal(true); }}
                className="px-8 py-4 bg-zinc-950 text-white font-bold rounded-full hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 group w-full sm:w-auto"
              >
                Apply for Partner Program
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* INTERACTIVE CALCULATOR */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white rounded-[32px] border border-zinc-200/60 shadow-2xl overflow-hidden mb-24 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/5 to-transparent pointer-events-none" />
            
            <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row gap-12 items-center">
              
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

              <div className="w-full md:w-2/5 bg-zinc-900 rounded-3xl p-8 text-center text-white shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest block mb-4 relative z-10">Monthly Passive Income</span>
                <div className="flex justify-center items-start gap-1 relative z-10">
                  <span className="text-2xl font-bold text-emerald-400 mt-2">₹</span>
                  <span className="text-6xl font-bold text-white tracking-tight">{monthlyIncome}</span>
                </div>
                <p className="text-zinc-400 text-xs mt-4 relative z-10">
                  *Calculated at 20% Gold Tier commission on average plan value. Earnings are recurring.
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
               <span className="text-[#6366F1] font-bold uppercase tracking-widest text-xs">Partner Tiers</span>
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
                        <CheckCircle2 size={18} className={tier.active ? 'text-emerald-400' : 'text-zinc-400'} />
                        <span className={tier.active ? 'text-zinc-300' : 'text-zinc-600'}>{perk}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => { setIsSubmitted(false); setShowApplyModal(true); }}
                    className={`w-full py-3 rounded-full font-bold transition-all ${tier.active ? 'bg-white text-zinc-900 hover:bg-zinc-200' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'}`}
                  >
                    Apply for {tier.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <FAQ customFaqs={partnerFaqs} />

        </div>
      </PageTransition>

      <CTA />

      {/* APPLICATION MODAL */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowApplyModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[32px] border border-zinc-200 shadow-2xl p-6 sm:p-8 max-w-lg w-full z-10 overflow-hidden"
            >
              {!isSubmitted ? (
                <form onSubmit={handleApplySubmit} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center border border-[#6366F1]/20 shadow-sm shrink-0">
                        <Sparkles size={20} />
                      </div>
                      <div>
                  <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Partner Application</h3>
                        <p className="text-xs text-zinc-500 font-normal">Join the Automixa Partner Program</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowApplyModal(false)}
                      className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-700 transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-4 text-left">
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 block mb-1.5">Primary Platform</label>
                      <select 
                        value={formData.platform}
                        onChange={(e) => setFormData({...formData, platform: e.target.value})}
                        className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold text-zinc-900 outline-none focus:border-[#6366F1]"
                      >
                        <option value="instagram">Instagram Business Page</option>
                        <option value="youtube">YouTube Channel</option>
                        <option value="agency">Marketing / Support Agency</option>
                        <option value="blog">Blog / Website</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-700 block mb-1.5">Audience / Client Reach</label>
                      <select 
                        value={formData.audienceRange}
                        onChange={(e) => setFormData({...formData, audienceRange: e.target.value})}
                        className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold text-zinc-900 outline-none focus:border-[#6366F1]"
                      >
                        <option value="under_10k">Under 10,000</option>
                        <option value="10k-50k">10,000 - 50,000</option>
                        <option value="50k-200k">50,000 - 200,000</option>
                        <option value="over_200k">200,000+</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-700 block mb-1.5">Profile / Channel Link</label>
                      <input 
                        type="url" 
                        required
                        placeholder="https://instagram.com/your_handle"
                        value={formData.handle}
                        onChange={(e) => setFormData({...formData, handle: e.target.value})}
                        className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold text-zinc-900 outline-none focus:border-[#6366F1]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-700 block mb-1.5">How will you promote Automixa?</label>
                      <textarea 
                        rows={3}
                        required
                        placeholder="e.g. In my product tutorials, newsletter, agency proposals, or directly to business clients."
                        value={formData.plan}
                        onChange={(e) => setFormData({...formData, plan: e.target.value})}
                        className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold text-zinc-900 outline-none focus:border-[#6366F1] resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={isApplying}
                      className="w-full py-3.5 bg-[#6366F1] hover:bg-[#5254D8] text-white font-bold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      {isApplying ? "Submitting Application..." : "Submit Partner Application"}
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center space-y-5 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Application Received!</h3>
                    <p className="text-xs sm:text-sm text-zinc-600 font-normal mt-2 leading-relaxed max-w-sm mx-auto">
                      Thank you for applying to the Automixa Partner Program. Our team will review your profile and activate your dashboard within 24 hours.
                    </p>
                  </div>
                  <div className="pt-4">
                    <Link 
                      href="/dashboard?tab=partner" 
                      className="px-8 py-3.5 bg-zinc-950 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all inline-block hover:scale-105"
                    >
                      Go to Partner Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
