"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, Clock, ShieldCheck, Play, 
  CheckCircle2, ShieldAlert, Shield, X
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function ShieldPage() {
  const benefits = [
    {
      title: "Anti-Spam Circuit Breakers",
      tagline: "Real-time Abuse Protection",
      description: "Automixa Shield monitors incoming traffic velocity and isolates aggressive spammers instantly before Instagram's API rate limits get triggered. Your page remains active and protected from bot swarms.",
      bullets: [
        "Heavy Traffic Surge Cooldown (pauses replies for 2 minutes during comment floods)",
        "Spam Attack Circuit Breaker (isolates users triggering keywords >4 times in 2 mins)",
        "Anti-Loop Safety Guard (prevents infinite self-reply loops between accounts)"
      ],
      icon: ShieldAlert,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
      color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Human-Like Intelligent Pacing",
      tagline: "Response Queue",
      description: "Our cloud engine spaces out replies and adapts delivery timing based on current traffic, reducing repetitive response patterns during busy campaigns.",
      bullets: [
        "Natural Human Delay (randomized typing delay of 2s–12s between replies)",
        "Adaptive Surge Throttling (delays automatically stretch under high traffic spikes)",
        "Unique Text Spintax Changer (changes greetings and emojis for every reply)"
      ],
      icon: Clock,
      image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=1200&auto=format&fit=crop",
      color: "text-orange-600 bg-orange-500/10 border-orange-500/20",
    },
    {
      title: "Meta API Based Connection",
      tagline: "Secure Integration",
      description: "We communicate server-to-server through secure HTTPS API calls to Meta Graph API endpoints. No Instagram password storage is required.",
      bullets: [
        "100% Password-Free secure Meta OAuth connection",
        "Directly uses Meta's Official Instagram Developer APIs",
        "Human Handover support (instantly pauses auto-replies on 'help' or 'stop')"
      ],
      icon: CheckCircle2,
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
      color: "text-rose-600 bg-rose-500/10 border-rose-500/20",
    }
  ];

  const securityFaqs = [
    {
      q: "How does Automixa reduce account safety risk?",
      a: "Automixa uses supported Meta API workflows, secure OAuth, and rate-aware delivery controls. We do not use web scraping, custom browser logins, or password-based automation."
    },
    {
      q: "Do you need my Instagram password?",
      a: "Never. We authenticate your account using official Meta/Facebook OAuth secure login. We never see, ask for, or store your Instagram password. You can revoke access at any time directly from your Facebook settings."
    },
    {
      q: "How does the reply delay system work?",
      a: "During busy campaigns, Automixa Shield queues replies and adds randomized delivery delays. This helps avoid repetitive bursts and keeps response handling controlled."
    },
    {
      q: "Is Automixa compliant with Meta's developer terms?",
      a: "Automixa is designed around supported Meta API workflows and secure HTTPS requests. Users must also follow Meta's platform rules and avoid spam, deceptive, or prohibited content."
    }
  ];

  return (
    <main className="min-h-screen text-foreground bg-[#FBFBFD] overflow-hidden relative font-sans pt-24 pb-6 selection:bg-amber-500/20">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <PageTransition>
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          
          {/* HERO SECTION */}
          <div className="flex flex-col lg:flex-row items-center gap-16 py-12 md:py-20 mb-8">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-1/2 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-700 text-xs font-black uppercase tracking-widest border border-amber-500/20 shadow-sm">
                <Shield size={14} className="animate-pulse text-amber-500" />
                Automixa Shield™
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                Safer Instagram <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 font-bold">Message Workflows.</span>
              </h1>
              
              <p className="text-zinc-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Automixa Shield adds pacing, duplicate protection, and abuse detection to help businesses run customer messaging workflows responsibly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/login" 
                  className="px-8 py-4.5 bg-zinc-950 text-white font-bold rounded-full hover:bg-amber-600 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-amber-100 flex items-center justify-center gap-2 group text-sm"
                >
                  Start Automating Safely
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="#compare-section" 
                  className="px-8 py-4.5 bg-white border border-zinc-200 text-zinc-800 font-bold rounded-full hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <Play size={18} className="text-amber-500 fill-amber-500" />
                  Explore Security Layers
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex items-center gap-6 border-t border-zinc-200/60 max-w-md">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 shrink-0">
                  <ShieldCheck className="text-amber-600" size={20} />
                </div>
                <div className="text-xs text-zinc-500 font-medium">
                  Secure OAuth connection. No Instagram password storage.
                </div>
              </div>
            </motion.div>
            
            {/* Right Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl border border-white bg-white/40 p-3 backdrop-blur-md">
                <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] bg-zinc-950 border border-zinc-800">
                  <img 
                    src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop" 
                    alt="Instagram safety automation protection shield" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  
                  {/* Floating Notification */}
                  <div className="absolute bottom-6 left-6 right-6 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-5 rounded-2xl shadow-xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center shrink-0">
                      <ShieldCheck className="text-emerald-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">Automixa Shield Active</h4>
                      <p className="text-[10px] text-zinc-400">Circuit breaker & dynamic pacing fully guarding your page.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ALTERNATING SECURITY LAYERS LIST */}
          <div id="compare-section" className="py-16 md:py-24 border-t border-zinc-200/60 scroll-mt-20">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">Security Architecture</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                8 Layers of Active Protection
              </h2>
              <p className="text-zinc-500 text-sm sm:text-base">
                Discover the cloud-based controls that protect your brand reputation and message quality.
              </p>
            </div>

            <div className="space-y-24 md:space-y-32">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                const isEven = idx % 2 !== 0;
                
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex flex-col gap-12 lg:gap-16 items-center ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                  >
                    {/* Left: Text Details */}
                    <div className="w-full lg:w-1/2 space-y-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 border shadow-sm ${benefit.color}`}>
                        <Icon size={26} />
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">{benefit.tagline}</span>
                      <h3 className="text-2xl sm:text-4xl font-bold text-zinc-900 leading-tight tracking-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-zinc-500 text-base sm:text-lg leading-relaxed font-normal">
                        {benefit.description}
                      </p>
                      
                      <ul className="space-y-3 pt-3">
                        {benefit.bullets.map((bullet, bulletIdx) => (
                          <li key={bulletIdx} className="flex items-start gap-3 text-zinc-700 font-medium text-sm">
                            <CheckCircle2 size={18} className="text-amber-500 mt-0.5 shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Right: Glassmorphic Image Frame */}
                    <div className="w-full lg:w-1/2">
                      <div className="rounded-[40px] overflow-hidden bg-white/40 p-3 border border-white shadow-2xl relative group">
                        <div className="rounded-[32px] overflow-hidden aspect-[4/3] relative">
                          <img 
                            src={benefit.image} 
                            alt={benefit.title} 
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* DANGER VS SAFE SIDE BY SIDE COMPARISON */}
          <div className="py-16 md:py-24 border-t border-zinc-200/60">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-rose-500 font-bold uppercase tracking-widest text-xs">Risk Comparison</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                Safe Automation vs. Spam Tools
              </h2>
              <p className="text-zinc-500 text-sm sm:text-base">
                Using unauthorized scripts or password-based automation puts your business at severe risk. Here is why Automixa is completely different.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
              {/* Danger Box */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white border border-rose-100 rounded-[40px] p-8 md:p-10 shadow-xl shadow-rose-500/5 space-y-8 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center">
                    <ShieldAlert size={22} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-900 mb-2">Traditional Spam Bots</h3>
                    <p className="text-xs text-zinc-500 font-normal">These common shortcuts will quickly lead to account flags or permanent bans.</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      "Asks for your password or direct login credentials",
                      "Spoofs browser sessions or uses headless scrapers",
                      "Sends rapid, identical direct messages in bulk",
                      "Violates Meta's official developer terms of service",
                      "Leads to Suspicious Login warnings and page bans"
                    ].map((text, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs text-zinc-600 font-semibold">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-6 border-t border-zinc-150 flex items-center justify-center text-xs font-bold text-rose-500 bg-rose-50/50 py-3 rounded-2xl">
                  ⚠️ HIGH SECURITY RISK FOR YOUR BRAND
                </div>
              </motion.div>

              {/* Shield Box */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-amber-500 rounded-[40px] p-8 md:p-10 shadow-2xl shadow-amber-500/5 space-y-8 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
                  Shield Guard Enabled
                </div>
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-amber-600 mb-2">Automixa Shield™</h3>
                    <p className="text-xs text-zinc-500 font-normal">Our proprietary core safety framework is engineered for peace of mind.</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      "100% Password-Free secure Meta OAuth connection",
                      "Communicates directly via Meta's Official Partner APIs",
                      "Simulates organic typing delays and random timings",
                      "Fully compliant with official Instagram platform policies",
                    "Designed for controlled, rate-aware response handling"
                    ].map((text, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs text-zinc-800 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-6 border-t border-zinc-150 flex items-center justify-center text-xs font-bold text-emerald-600 bg-emerald-50/50 py-3 rounded-2xl">
                  API-BASED AND RATE-AWARE
                </div>
              </motion.div>
            </div>
          </div>
          
        </div>
      </PageTransition>

      <FAQ customFaqs={securityFaqs as any} />
      
      <div className="mt-16">
        <CTA />
      </div>
    </main>
  );
}
