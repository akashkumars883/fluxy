"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageSquare, TrendingUp, Search, Star, Play, CheckCircle2 } from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function CommentAutoResponderPage() {
  const benefits = [
    {
      title: "Keyword Triggers",
      description: "Ask your followers to comment a specific word like 'LINK' or 'GUIDE', and Automixa will instantly send the requested material to their DM.",
      icon: Search,
      image: "https://images.unsplash.com/photo-1515378960530-7c0da6229674?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Explode Your Engagement",
      description: "When people comment to get your link, it signals to the Instagram algorithm that your post is popular, pushing it to the top of their feeds.",
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Like Comments Automatically",
      description: "Show appreciation to your audience by automatically liking their comments just before sending the DM. It adds a human touch.",
      icon: Star,
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1200&auto=format&fit=crop",
    }
  ];

  const faqs = [
    {
      q: "Can I reply to comments on my Instagram Reels?",
      a: "Yes! Automixa works flawlessly on Instagram Reels, standard posts, and carousels. The moment someone comments your trigger keyword, they get the DM."
    },
    {
      q: "What if someone spells the keyword wrong?",
      a: "Our smart AI matching allows you to set up spelling variations (e.g., 'LINK', 'LNK', 'LINKS') so you never miss a lead due to a typo."
    },
    {
      q: "Can I automatically like their comment too?",
      a: "Yes. You can configure Automixa to automatically 'Like' the user's comment before sending them the DM. This boosts your engagement score on Instagram."
    },
    {
      q: "Will this make me look like a bot?",
      a: "Not at all. You can set up multiple variations of the DM (e.g., 'Hey, here is the link!', 'Sending it over now!'). The system will randomly pick one so your replies feel 100% human."
    }
  ];

  return (
    <main className="min-h-screen text-foreground overflow-hidden relative font-sans pt-24 pb-6 selection:bg-indigo-500/20">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-[#6366F1]/5 rounded-full blur-[100px] pointer-events-none" />

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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
                <MessageSquare size={14} />
                Feature
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                Turn Comments into <span className="text-indigo-600 font-normal">Cash Automatically.</span>
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl leading-relaxed max-w-lg">
                Stop telling people to click the link in your bio. Reply to their comments instantly with the exact link they want in their DMs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login" className="px-8 py-4 bg-foreground text-background font-bold rounded-full hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 group">
                  Start Free Trial
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#how-it-works" className="px-8 py-4 bg-white/40 backdrop-blur-md border border-zinc-200/60 text-zinc-800 font-bold rounded-full hover:bg-white transition-all flex items-center justify-center gap-2">
                  <Play size={18} className="text-indigo-600" />
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
                  src="https://images.unsplash.com/photo-1543269664-56d56914e204?q=80&w=1200&auto=format&fit=crop" 
                  alt="People working together" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-lg border border-white flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">Engagement Spiked</h4>
                    <p className="text-xs text-zinc-500">Post reached 40% more accounts today.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* HOW IT HELPS SECTION */}
          <div id="how-it-works" className="py-12 scroll-mt-12">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
              <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Comments & Replies</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                Engage every follower <br className="hidden sm:block" /> without lifting a finger.
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
                      <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
                        <Icon className="text-indigo-600" size={28} />
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
                            <CheckCircle2 size={18} className="text-indigo-600" />
                            {i === 0 ? "Setup multiple variations of replies" : i === 1 ? "Exclude negative keywords" : "Track click-through rates"}
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
