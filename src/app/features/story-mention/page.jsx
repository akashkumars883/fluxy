"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Target, Users, Heart, Share2, Play, CheckCircle2 } from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function StoryMentionPage() {
  const benefits = [
    {
      title: "Encourage User Generated Content",
      description: "When followers know they will get an instant reward (like a discount code) for tagging you in their stories, your brand visibility skyrockets.",
      icon: Users,
      image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Send Private Thank You's",
      description: "Automatically reply via DM to say 'Thank you for sharing!' whenever someone mentions your account. Build a loyal community.",
      icon: Heart,
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Amplify Giveaways & Contests",
      description: "Run 'Tag us to enter' contests. Automixa will instantly send a confirmation DM to every user who participates by tagging you.",
      icon: Share2,
      image: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=1200&auto=format&fit=crop",
    }
  ];

  const faqs = [
    {
      q: "Can I reply when someone mentions me in their Instagram Story?",
      a: "Yes! Automixa detects when a user tags your @handle in their story and instantly sends them a pre-configured DM."
    },
    {
      q: "What if someone tags me multiple times a day?",
      a: "To prevent spam, you can set a 'Cooldown Period'. Automixa will only reply to the same user once every 24 hours, even if they tag you 10 times."
    },
    {
      q: "Can I offer a discount code for story tags?",
      a: "Absolutely. This is the most popular use case. Tell your followers 'Tag us in your story for 10% off' and let Automixa handle the delivery of the code automatically."
    },
    {
      q: "Does this work for private accounts?",
      a: "Instagram's API restricts access to private accounts. Automixa can only detect and reply to mentions from users who have public Instagram profiles."
    }
  ];

  return (
    <main className="min-h-screen text-foreground overflow-hidden relative font-sans pt-24 pb-6 selection:bg-emerald-500/20">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
                <Target size={14} />
                Feature
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                Reward Your Biggest <span className="text-emerald-500 font-normal">Fans Instantly.</span>
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl leading-relaxed max-w-lg">
                Automatically send a DM whenever a follower tags your brand in an Instagram Story. Grow organic reach and foster community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login" className="px-8 py-4 bg-foreground text-background font-bold rounded-full hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 group">
                  Start Automating Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#how-it-works" className="px-8 py-4 bg-white/40 backdrop-blur-md border border-zinc-200/60 text-zinc-800 font-bold rounded-full hover:bg-white transition-all flex items-center justify-center gap-2">
                  <Play size={18} className="text-emerald-600" />
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
                  src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop" 
                  alt="Friends taking selfie" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-lg border border-white flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-emerald-500" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">Story Tag Detected</h4>
                    <p className="text-xs text-zinc-500">Automixa sent a 10% coupon to their DM.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* HOW IT HELPS SECTION */}
          <div id="how-it-works" className="py-12 scroll-mt-12">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
              <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Story Mentions</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                Turn your followers into <br className="hidden sm:block" /> your marketing team.
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
                      <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                        <Icon className="text-emerald-600" size={28} />
                      </div>
                      <h3 className="text-2xl sm:text-4xl font-bold text-zinc-900 leading-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-zinc-500 text-lg leading-relaxed">
                        {benefit.description}
                      </p>
                      <ul className="space-y-3 pt-2">
                        {[1, 2, 3].map((_, i) => (
                          <li key={i} className="flex items-center gap-3 text-zinc-700 font-medium">
                            <CheckCircle2 size={18} className="text-emerald-500" />
                            {i === 0 ? "Works 24/7 automatically" : i === 1 ? "Limit to once per user per 24hrs" : "Increase brand awareness"}
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
