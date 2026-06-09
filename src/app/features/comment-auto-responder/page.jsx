"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, MessageSquare, TrendingUp, Star, Play, 
  CheckCircle2, Sparkles, ShieldCheck
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function CommentAutoResponderPage() {
  const benefits = [
    {
      title: "Chat to Build Rules",
      tagline: "AI Campaign Setup",
      description: "No tech skills? No problem. Simply describe your automation rules in plain English. Our AI reads your prompt and generates your keywords, replies, and DM cards instantly.",
      bullets: [
        "1-click AI-powered prompt builder",
        "Configures matching spelling typos automatically",
        "Set up standard greetings in under 30 seconds"
      ],
      icon: Sparkles,
      image: "https://images.unsplash.com/photo-1515378960530-7c0da6229674?q=80&w=1200&auto=format&fit=crop",
      color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Spam Guard & Reply Rotator",
      tagline: "Account Safety",
      description: "Instagram has strict limits on repetitive replies. Automixa lets you configure multiple reply variations and timing controls to keep business responses natural and within platform rules.",
      bullets: [
        "Anti-spam reply rotation engine",
        "Human-like timing intervals",
        "Official Meta API Graph integration"
      ],
      icon: ShieldCheck,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Live Preview Playground",
      tagline: "Interactive Sandbox",
      description: "Never launch blind. Test your triggers, verify comment matches, and preview your cards in an interactive phone mockup inside your dashboard. Test everything with zero API credits spent.",
      bullets: [
        "100% free offline sandbox simulator",
        "Real-time mobile display rendering",
        "Instant logic validation before launch"
      ],
      icon: Play,
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1200&auto=format&fit=crop",
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    }
  ];

  const faqs = [
    {
      q: "How does the Instagram comment auto responder help my business?",
      a: "It helps you answer common customer comments faster, route interested users to the correct resource, and keep a record of conversations in your dashboard."
    },
    {
      q: "Is Automixa safe for my Instagram account?",
      a: "Yes. Automixa uses official Meta APIs and secure OAuth. We do not ask for your Instagram password or use unofficial browser scraping."
    },
    {
      q: "Can I set multiple keywords for the same post?",
      a: "Absolutely! You can trigger different direct messages based on the exact keyword. If someone comments 'REEL', they get a video course. If they comment 'EBOOK', they get a PDF download link."
    },
    {
      q: "Does this work on Instagram Stories and DMs too?",
      a: "Yes! While this page highlights our Instagram comment responder, Automixa also offers full DM Auto-Reply and Story Mention automation features. You can run all three simultaneously."
    }
  ];

  return (
    <main className="min-h-screen text-foreground bg-[#FBFBFD] overflow-hidden relative font-sans pt-32 pb-16 selection:bg-[#6366F1]/20">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#6366F1]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#6366F1]/5 rounded-full blur-[120px] pointer-events-none" />

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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-xs font-black uppercase tracking-[0.3em] border border-[#6366F1]/20 shadow-sm">
                <MessageSquare size={14} className="animate-pulse" />
                Comment Responder
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                Turn Comments into <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 font-bold">Sales 24/7.</span>
              </h1>
              
              <p className="text-zinc-500 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Stop losing customer questions in comment threads. Reply to comments automatically, send approved checkout links, discount codes, or files to Instagram DMs, and keep business conversations organized.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/login" 
                  className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group text-sm"
                >
                  Start Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="#features-list" 
                  className="px-8 py-4 bg-white border border-zinc-200 text-zinc-800 font-bold rounded-xl hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <Play size={18} className="text-[#6366F1] fill-[#6366F1]" />
                  Explore Features
                </Link>
              </div>

              {/* Trust/Social Indicators */}
              <div className="pt-6 flex items-center gap-6 border-t border-zinc-200/60 max-w-md">
                <div className="flex -space-x-2">
                  <span className="w-8 h-8 rounded-full bg-zinc-200 border-2 border-white flex items-center justify-center font-bold text-[10px]">A</span>
                  <span className="w-8 h-8 rounded-full bg-[#6366F1]/10 border-2 border-white flex items-center justify-center font-bold text-[10px] text-[#6366F1]">B</span>
                  <span className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center font-bold text-[10px] text-emerald-600">C</span>
                </div>
                <div className="text-xs text-zinc-500 font-medium">
                  Trusted by businesses, educators, and e-commerce teams for customer messaging.
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
                    src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1200&auto=format&fit=crop" 
                    alt="Instagram automation tool in action" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  
                  {/* Floating Analytics Card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-5 rounded-2xl shadow-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#6366F1]/20 border border-[#6366F1]/30 rounded-xl flex items-center justify-center">
                        <TrendingUp className="text-indigo-400" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">Responses Sent</h4>
                        <p className="text-[10px] text-zinc-400">Automatic responses sent today</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400 font-display">1,402</div>
                      <div className="text-[9px] text-zinc-400 font-semibold">Customer comments</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FEATURES LIST */}
          <div id="features-list" className="py-16 md:py-24 border-t border-zinc-200/60 scroll-mt-20">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] block">Core Capabilities</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight leading-[1.1]">
                Answer customer comments <span className="text-sage font-normal">without manual copy-paste.</span>
              </h2>
              <p className="text-zinc-500 text-sm md:text-lg max-w-lg font-normal leading-relaxed">
                Discover the comment automation features that help teams reply faster and deliver resources consistently.
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
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-2 border shadow-sm ${benefit.color}`}>
                        <Icon size={26} />
                      </div>
                      <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] block">{benefit.tagline}</p>
                      <h3 className="text-2xl sm:text-4xl font-bold text-foreground leading-tight tracking-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-zinc-500 text-base sm:text-lg leading-relaxed font-normal">
                        {benefit.description}
                      </p>
                      
                      <ul className="space-y-3 pt-3">
                        {benefit.bullets.map((bullet, bulletIdx) => (
                          <li key={bulletIdx} className="flex items-start gap-3 text-zinc-600 font-medium text-sm">
                            <CheckCircle2 size={18} className="text-[#6366F1] mt-0.5 shrink-0" />
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
          
        </div>
      </PageTransition>

      <FAQ customFaqs={faqs} />
      
      <div className="mt-16">
        <CTA />
      </div>
    </main>
  );
}
