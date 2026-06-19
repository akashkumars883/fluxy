"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Layout, MessageSquare, Target, Zap, ShoppingBag, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    id: "ai-builder",
    title: "Chat to Build",
    tagline: "Type, Build, Launch",
    desc: "Describe what you want to automate in one simple sentence and let our AI write the replies, configure triggers, and setup the settings for you instantly.",
    bullets: [
      "Zero manual configuration",
      "Powered by smart AI",
      "Instant setup in a single step"
    ],
    image: "/images/instagram-dm.png",
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    icon: Sparkles,
    link: "/login"
  },
  {
    id: "comments",
    title: "Comment Auto-Responder",
    tagline: "Respond From Comments",
    desc: "Turn public customer questions into private conversations. Automixa replies to comments and can send a configured DM with your approved link.",
    bullets: [
      "Auto-reply to public comments",
      "Send links via DMs instantly",
      "Multiple reply variations to avoid spam limits"
    ],
    image: "/images/instagram-comments-v2.png",
    color: "text-rose-600 bg-rose-50 border-rose-200",
    icon: MessageSquare,
    link: "/features/comment-auto-responder"
  },
  {
    id: "dm",
    title: "Instagram DM Auto-Reply",
    tagline: "Never Miss a Message",
    desc: "Set up 24/7 intelligent auto-replies for your Instagram DMs. Send instant product links, location cards, or custom guides.",
    bullets: [
      "Instant keyword replies",
      "Suggest replies using Magic Write AI",
      "Automatic AI FAQ & Sales Agents"
    ],
    image: "/images/smart-bio-solid.png",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    icon: Zap,
    link: "/features/dm-auto-reply"
  },
  {
    id: "stories",
    title: "Story Auto-Reply",
    tagline: "Handle Story Replies",
    desc: "Automatically send a helpful DM whenever someone tags your brand in a story or replies to your stories.",
    bullets: [
      "Reply to story tags & mentions",
      "Automatic cooldown spam limits",
      "Official Instagram API integration"
    ],
    image: "/images/instagram-stories.png",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    icon: Target,
    link: "/features/story-mention"
  },
  {
    id: "smart-bio",
    title: "Next-Gen Smart Bio Link",
    tagline: "Your Digital Storefront",
    desc: "Replace your boring bio link with a high-converting, branded Smart Bio. Showcase your best content and sell digital products directly.",
    bullets: [
      "Custom themes and presets",
      "Direct store and product checkout",
      "Unlimited custom links"
    ],
    image: "/images/smart-bio-solid.png",
    color: "text-pink-600 bg-pink-50 border-pink-200",
    icon: Layout,
    isComingSoon: false,
    link: "/bio"
  },
  {
    id: "mini-store",
    title: "Integrated Mini Store",
    tagline: "Sell Products Automatically",
    desc: "Sell E-books, templates, and digital courses directly from your profile. Collect payments effortlessly with zero transaction fees.",
    bullets: [
      "Zero transaction fees (excl. gateway)",
      "Instant payout to your bank account",
      "Automated delivery on Instagram"
    ],
    image: "/images/mini-store.png",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    icon: ShoppingBag,
    link: "/login"
  }
];

export default function Features() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section id="features" className="py-20 lg:py-28 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-10">
        
        {/* Header */}
        <div className="text-center md:text-left mb-12 lg:mb-20 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/5 hover:bg-zinc-900/10 transition-colors border border-zinc-900/10 rounded-full text-[11px] uppercase tracking-widest font-semibold text-zinc-600 mb-6 lg:mb-8 font-mono"
          >
            Core Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-zinc-900 tracking-tight leading-[1.1] mb-6"
          >
            Precision automation <span className="text-zinc-500 font-normal">at scale.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-500 text-sm md:text-lg max-w-xl leading-relaxed"
          >
            Every tool you need to respond faster, organize leads, and deliver approved resources automatically.
          </motion.p>
        </div>

        {/* Tabbed Interface Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">

          {/* Left Column: Interactive Tabs */}
          <div className="w-full lg:w-5/12 flex flex-col gap-3 relative z-20">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const isActive = activeIdx === idx;

              return (
                <div 
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`flex flex-col rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden border ${isActive ? 'bg-white border-zinc-200/80 shadow-lg shadow-zinc-200/40' : 'bg-transparent border-transparent hover:bg-zinc-50'}`}
                >
                  {/* Tab Header */}
                  <div className="flex items-center justify-between p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isActive ? feature.color : 'bg-zinc-100 text-zinc-400'}`}>
                        <Icon size={20} />
                      </div>
                      <h3 className={`text-lg sm:text-xl font-bold transition-colors ${isActive ? 'text-zinc-900' : 'text-zinc-500'}`}>
                        {feature.title}
                      </h3>
                    </div>
                    <ChevronRight size={18} className={`transition-transform duration-300 ${isActive ? 'rotate-90 text-indigo-600' : 'text-zinc-300'}`} />
                  </div>

                  {/* Tab Content (Accordion Expand) */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-4 sm:px-5 pb-5 pt-1">
                          
                          {/* Mobile Image (Hidden on Desktop) */}
                          <div className="block lg:hidden w-full h-56 sm:h-72 relative bg-zinc-950 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden mb-5 mt-2">
                            <Image
                              src={feature.image}
                              alt={feature.title}
                              fill
                              className="object-cover opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
                            <div className="absolute bottom-4 left-4 right-4 flex justify-center z-10 opacity-90">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md text-zinc-800 shadow-lg text-[10px] font-bold tracking-widest uppercase">
                                <Sparkles size={10} className="text-indigo-600" />
                                {feature.tagline}
                              </div>
                            </div>
                          </div>

                          <p className="text-[15px] sm:text-base text-zinc-500 leading-relaxed mb-6">
                            {feature.desc}
                          </p>

                          <div className="space-y-3 mb-6">
                            {feature.bullets.map((bullet, bIdx) => (
                              <div key={bIdx} className="flex items-start gap-2.5 text-zinc-600 font-medium text-sm">
                                <CheckCircle2 size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                                <span>{bullet}</span>
                              </div>
                            ))}
                          </div>

                          <Link
                            href={feature.link || (feature.isComingSoon ? "#" : "/login")}
                            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm w-max transition-all ${feature.isComingSoon
                              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                              : "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-md hover:-translate-y-0.5"
                              }`}
                            onClick={(e) => feature.isComingSoon && e.preventDefault()}
                          >
                            {feature.isComingSoon ? "Coming Soon" : "Get Started"}
                            {!feature.isComingSoon && <ArrowRight size={16} />}
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Image Showcase (Desktop Only) */}
          <div className="hidden lg:block w-7/12 sticky top-32 h-[550px] xl:h-[650px]">
            <div className="relative w-full h-full flex items-center justify-center bg-zinc-950 rounded-[32px] border border-zinc-800 shadow-2xl overflow-hidden group">

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={features[activeIdx].image}
                    alt={features[activeIdx].title}
                    fill
                    className="object-cover md:object-contain opacity-90 transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent pointer-events-none" />

              <div className="absolute bottom-8 left-8 right-8 flex flex-col items-center justify-end z-10 opacity-90">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`tagline-${activeIdx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200/80 text-zinc-800 shadow-xl shadow-zinc-900/10 text-[11px] font-bold tracking-widest uppercase"
                  >
                    <Sparkles size={14} className="text-indigo-600" />
                    {features[activeIdx].tagline}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
