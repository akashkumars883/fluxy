"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, MessageCircle, Clock, ShieldCheck, Play, CheckCircle2, Sparkles } from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function DMAutoReplyPage() {
  const benefits = [
    {
      title: "AI FAQ & Sales Agents",
      description: "Deploy custom AI chat agents trained on your product information. They automatically close sales, answer questions, and direct leads to your website 24/7.",
      bullets: [
        "Train AI on your product info",
        "Natural, human-like conversations",
        "24/7 automated sales assistant"
      ],
      icon: Sparkles,
      image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Magic Write AI",
      description: "Stuck on what to reply in your direct messages? Let Magic Write generate 3 highly engaging, friendly response options for DMs instantly.",
      bullets: [
        "3 engaging reply variants per click",
        "Select your tone (Friendly, Witty, Pro)",
        "Boost clicks and conversion rates"
      ],
      icon: Zap,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Chat to Build",
      description: "Set up complex Direct Message triggers by typing one simple instruction. The AI configures your greeting cards, buttons, and redirects in seconds.",
      bullets: [
        "Zero manual setup required",
        "Instantly configures keyword rules",
        "Official and approved Instagram partner"
      ],
      icon: MessageCircle,
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop",
    }
  ];

  const faqs = [
    {
      q: "How fast is the DM Auto-Reply?",
      a: "Our system replies in under 2 seconds. The moment a user triggers the automation, the message is sent to their inbox instantly."
    },
    {
      q: "Can I set up multiple auto-replies for different keywords?",
      a: "Yes! You can set up unlimited flows. For example, if someone DMs 'PRICE', they get your pricing guide. If they DM 'LOCATION', they get your Google Maps link."
    },
    {
      q: "Will Instagram ban me for using auto-reply?",
      a: "No. Automixa uses the official Meta Instagram Graph API. Since we are an approved developer partner, your account is 100% safe from shadow-bans."
    },
    {
      q: "Does it work if my phone is off?",
      a: "Yes. Automixa runs on the cloud 24/7. Your phone can be off, and you can be asleep, but your Instagram will still reply to customers and capture leads."
    }
  ];

  return (
    <main className="min-h-screen text-foreground overflow-hidden relative font-sans pt-24 pb-6 selection:bg-amber-500/20">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

      <PageTransition>
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          
          {/* HERO SECTION */}
          <div className="flex flex-col lg:flex-row items-center gap-10 mb-16 pt-4">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold uppercase tracking-widest border border-amber-500/20">
                <Zap size={14} />
                Feature
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                Never Miss a <br />
                <span className="text-amber-500 font-normal">Message Again.</span>
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl leading-relaxed max-w-lg">
                Set up 24/7 intelligent auto-replies for your Instagram Direct Messages. Capture leads and answer queries while you sleep.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login" className="px-8 py-4 bg-foreground text-background font-bold rounded-full hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 group">
                  Start Free Trial
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#how-it-works" className="px-8 py-4 bg-white/40 backdrop-blur-md border border-zinc-200/60 text-zinc-800 font-bold rounded-full hover:bg-white transition-all flex items-center justify-center gap-2">
                  <Play size={18} className="text-amber-500" />
                  Watch Demo
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl aspect-[4/3] border border-zinc-200/40 bg-zinc-100">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" 
                  alt="Team member smiling and checking phone" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-lg border border-white flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">New Lead Captured</h4>
                    <p className="text-xs text-zinc-500">{`Auto-reply secured the customer's email.`}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* HOW IT HELPS SECTION */}
          <div id="how-it-works" className="py-12 scroll-mt-12">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
              <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">Direct Messages</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                Unlock the full potential <br className="hidden sm:block" /> of your DMs.
              </h2>
            </div>

            <div className="space-y-16">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                const isEven = idx % 2 !== 0;
                
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className={`flex flex-col gap-8 items-center ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                  >
                    <div className="w-full lg:w-1/2 space-y-4">
                      <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                        <Icon className="text-amber-500" size={28} />
                      </div>
                      <h3 className="text-2xl sm:text-4xl font-bold text-zinc-900 leading-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-zinc-500 text-lg leading-relaxed">
                        {benefit.description}
                      </p>
                      <ul className="space-y-3 pt-2">
                        {benefit.bullets.map((bullet, bulletIdx) => (
                          <li key={bulletIdx} className="flex items-center gap-3 text-zinc-700 font-medium">
                            <CheckCircle2 size={18} className="text-amber-500" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="w-full lg:w-1/2">
                      <div className="rounded-[32px] overflow-hidden aspect-[4/3] shadow-xl border border-zinc-200/50 relative group">
                        <img 
                          src={benefit.image} 
                          alt={benefit.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
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
