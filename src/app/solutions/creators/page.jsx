"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Target, Users, Play, CheckCircle2, TrendingUp, Link as LinkIcon, Gift } from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function CreatorsSolutionPage() {
  const benefits = [
    {
      title: "Deliver Digital Products Instantly",
      description: "Send your course, ebook, or template links directly to users' DMs when they comment a specific keyword like 'LINK'.",
      icon: LinkIcon,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Boost Engagement & Algorithm",
      description: "Auto-replies to comments signal to the Instagram algorithm that your post is highly engaging, pushing it to the Explore page.",
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Capture Leads 24/7",
      description: "Stop losing potential leads because you were asleep. Automixa sends out your lead magnets automatically, day or night.",
      icon: Gift,
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop",
    }
  ];

  const faqs = [
    {
      q: "How does Automixa help creators make more money?",
      a: "By turning your comment section into an automated funnel. When you ask followers to comment 'COURSE', Automixa instantly sends them the link to buy it, capturing leads while you sleep."
    },
    {
      q: "Can I collect email addresses in the DM?",
      a: "Yes! Our advanced flows allow you to ask the user for their email address right inside the Instagram DM before delivering the free guide or lead magnet."
    },
    {
      q: "Do I need a big following to use this?",
      a: "No. Automixa works for accounts of all sizes. In fact, smaller creators use our 'Follower-Gate' feature to force commenters to follow them before receiving the free resource, driving massive organic growth."
    },
    {
      q: "Is it difficult to set up?",
      a: "Not at all. We have pre-built templates specifically for creators. You can have your first automation running in less than 2 minutes."
    }
  ];

  return (
    <main className="min-h-screen text-foreground overflow-hidden relative font-sans pt-24 pb-6 selection:bg-sage/20">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold uppercase tracking-widest border border-[#6366F1]/20">
                <Users size={14} />
                For Creators & Influencers
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                Scale Your <span className="text-sage font-normal">Audience</span> on Autopilot.
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl leading-relaxed max-w-lg">
                {`Stop manually replying to "Link in bio" requests. Automatically deliver your courses, ebooks, and digital products directly into your followers' DMs.`}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login" className="px-8 py-4 bg-foreground text-background font-bold rounded-full hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 group">
                  Start Automating Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#how-it-works" className="px-8 py-4 bg-white/40 backdrop-blur-md border border-zinc-200/60 text-zinc-800 font-bold rounded-full hover:bg-white transition-all flex items-center justify-center gap-2">
                  <Play size={18} className="text-sage" />
                  See How It Works
                </Link>
              </div>
              
              <div className="flex items-center gap-6 pt-6 border-t border-zinc-200/50">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
                  ))}
                </div>
                <div className="text-xs text-zinc-500 font-medium leading-tight">
                  <span className="font-bold text-zinc-800 text-sm block">3,000+ Creators</span>
                  already growing with us
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl aspect-[4/3] border border-zinc-200/40">
                <img 
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop" 
                  alt="Creator managing Instagram" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-lg border border-white flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-emerald-500" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">{`"Send link" Comment Received`}</h4>
                    <p className="text-xs text-zinc-500">Automixa sent the course link to DM in 0.5s</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* HOW IT HELPS SECTION */}
          <div id="how-it-works" className="py-12 scroll-mt-12">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
              <span className="text-sage font-bold uppercase tracking-widest text-xs">The Creator Playbook</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                Turn your content into a <br className="hidden sm:block" /> lead-generation machine.
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
                      <div className="w-14 h-14 bg-[#6366F1]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#6366F1]/20">
                        <Icon className="text-[#6366F1]" size={28} />
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
                            <CheckCircle2 size={18} className="text-sage" />
                            {i === 0 ? "100% Instagram Compliant" : i === 1 ? "Setup in under 2 minutes" : "Detailed analytics tracking"}
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
