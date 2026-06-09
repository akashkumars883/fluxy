"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, Zap, MessageCircle, Clock, ShieldCheck, Play, 
  CheckCircle2, Sparkles
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function DMAutoReplyPage() {
  const benefits = [
    {
      title: "AI FAQ & Sales Agents",
      tagline: "24/7 Smart Conversations",
      description: "Train a custom AI Chat Agent on your business document, FAQ sheets, or website content. It automatically answers complex customer questions, provides product suggestions, and drives leads to close deals in the DM.",
      bullets: [
        "Train AI in 1-click on your raw text or website",
        "Fully understands intent and answers naturally",
        "Passes complex queries to your support inbox"
      ],
      icon: Sparkles,
      image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200&auto=format&fit=crop",
      color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Magic Write Copilot",
      tagline: "Instant Copywriting",
      description: "Stuck on what to reply in your automated responses? Use Magic Write to instantly write 3 variations of engaging copy with a specific tone (Friendly, Professional, or Urgent) to maximize clicks and sales.",
      bullets: [
        "Select and customize tone in 1-click",
        "Optimized for high-converting sales scripts",
        "Keeps replies fresh, dynamic, and engaging"
      ],
      icon: Zap,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
      color: "text-orange-600 bg-orange-500/10 border-orange-500/20",
    },
    {
      title: "Chat to Build Rules",
      tagline: "Simple Prompting Setup",
      description: "Skip the complicated workflow chart builders. Simply describe the trigger word and the message card structure you want, and let our AI compile the logic for you instantly.",
      bullets: [
        "Zero workflow layout menus required",
        "Auto-sets keywords, media grids, and quick replies",
        "Official Meta API approved configuration"
      ],
      icon: MessageCircle,
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop",
      color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20",
    }
  ];

  const faqs = [
    {
      q: "How does the Instagram DM auto reply tool work?",
      a: "Automixa listens for incoming messages on your Instagram account via the official Meta Graph API. The moment a user sends a message containing your set keywords, our cloud engine triggers the pre-configured reply in under 2 seconds."
    },
    {
      q: "Can I use the AI FAQ Agent for multi-language replies?",
      a: "Yes! The AI agent automatically detects the language of the incoming message (Hindi, English, Spanish, etc.) and replies in the exact same language automatically."
    },
    {
      q: "Is Automixa safe for my Instagram account?",
      a: "Automixa uses secure OAuth and supported Meta APIs. We do not use scrapers or ask for passwords, and users must follow Meta's platform rules when configuring replies."
    },
    {
      q: "Can I set up quick-reply buttons inside the DM?",
      a: "Absolutely! You can add up to 3 quick-reply buttons (like 'Buy Now', 'FAQs', 'Contact Support') that users can tap to instantly continue the conversation or redirect to a link."
    }
  ];

  return (
    <main className="min-h-screen text-foreground bg-[#FBFBFD] overflow-hidden relative font-sans pt-32 pb-16 selection:bg-[#6366F1]/20">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#6366F1]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[#6366F1]/5 rounded-full blur-[120px] pointer-events-none" />

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
                <Zap size={14} className="animate-pulse" />
                DM Auto-Reply
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                Never Miss a <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 font-bold">DM Lead Again.</span>
              </h1>
              
              <p className="text-zinc-500 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Convert direct messages into organized customer workflows. Automixa handles common questions, sends approved checkout links, and captures customer details so your team can avoid repetitive copy-pasting.
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

              {/* Trust Indicators */}
              <div className="pt-6 flex items-center gap-6 border-t border-zinc-200/60 max-w-md">
                <div className="w-10 h-10 bg-[#6366F1]/10 rounded-xl flex items-center justify-center border border-[#6366F1]/20 shrink-0">
                  <ShieldCheck className="text-[#6366F1]" size={20} />
                </div>
                <div className="text-xs text-zinc-500 font-medium">
                  Secure API-based workflows. UPI-friendly billing.
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
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" 
                    alt="Instagram DM automation tool" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  
                  {/* Floating Notification */}
                  <div className="absolute bottom-6 left-6 right-6 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-5 rounded-2xl shadow-xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#6366F1]/20 border border-[#6366F1]/30 rounded-xl flex items-center justify-center shrink-0">
                      <MessageCircle className="text-indigo-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">AI Agent Active</h4>
                      <p className="text-[10px] text-zinc-400">Successfully answered shipment query in 1.4 seconds.</p>
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
                Unlock the full potential <span className="text-sage font-normal">of your DMs.</span>
              </h2>
              <p className="text-zinc-500 text-sm md:text-lg max-w-lg font-normal leading-relaxed">
                Discover the advanced features that make Automixa the ultimate Instagram DM auto-reply software.
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
