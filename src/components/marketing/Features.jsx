"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Layout, MessageSquare, Target, Zap, ShoppingBag, Sparkles } from "lucide-react";
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
    color: "text-indigo-400 bg-indigo-500/20 border-indigo-500/30",
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
    color: "text-indigo-400 bg-indigo-500/20 border-indigo-500/30",
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
    color: "text-indigo-400 bg-indigo-500/20 border-indigo-500/30",
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
    color: "text-indigo-400 bg-indigo-500/20 border-indigo-500/30",
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
    color: "text-indigo-400 bg-indigo-500/20 border-indigo-500/30",
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
    color: "text-indigo-400 bg-indigo-500/20 border-indigo-500/30",
    icon: ShoppingBag,
    link: "/login"
  }
];

export default function Features() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section id="features" className="py-24 bg-[#09090B] text-white relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-10">
        
        {/* Header */}
        <div className="text-center md:text-left mb-16 lg:mb-24 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/5 hover:bg-zinc-900/10 transition-colors border border-zinc-900/10 rounded-full text-[11px] uppercase tracking-widest font-semibold text-sage mb-8 font-mono"
          >
            Core Capabilities
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white tracking-tight leading-[1.1] mb-6">
            Precision automation <span className="text-zinc-500 font-normal">at scale.</span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-lg max-w-xl leading-relaxed">
            Every tool you need to respond faster, organize leads, and deliver approved resources automatically.
          </p>
        </div>

        {/* 2-Column Sticky Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">

          {/* Left Column: Scrolling Text Items */}
          <div className="w-full lg:w-1/2 flex flex-col relative pb-[10vh] lg:pb-[50vh]">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  onViewportEnter={() => setActiveIdx(idx)}
                  viewport={{ margin: "-50% 0px -50% 0px", amount: "some" }}
                  className={`py-8 lg:py-32 transition-opacity duration-500 flex flex-col ${activeIdx === idx ? "opacity-100" : "opacity-40 lg:opacity-30"
                    }`}
                >
                  <div className={`w-12 h-12 rounded-sm flex items-center justify-center mb-6 border ${feature.color}`}>
                    <Icon size={24} />
                  </div>

                  <h3 className="text-3xl font-bold text-white tracking-tight mb-4">
                    {feature.title}
                  </h3>

                  {/* Mobile Image (Hidden on Desktop) */}
                  <div className="block lg:hidden w-full h-64 sm:h-80 relative rounded-sm overflow-hidden mb-6 mt-2">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover opacity-90"
                    />
                  </div>

                  <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    {feature.desc}
                  </p>

                  <div className="space-y-4 mb-8">
                    {feature.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-3 text-zinc-300 font-medium">
                        <CheckCircle2 size={18} className="text-indigo-400 shrink-0" />
                        {bullet}
                      </div>
                    ))}
                  </div>

                  <Link
                    href={feature.link || (feature.isComingSoon ? "#" : "/login")}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm w-max transition-all ${feature.isComingSoon
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-500 hover:-translate-y-0.5"
                      }`}
                    onClick={(e) => feature.isComingSoon && e.preventDefault()}
                  >
                    {feature.isComingSoon ? "Coming Soon" : "Get Started"}
                    {!feature.isComingSoon && <ArrowRight size={16} />}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Sticky Black Image Card */}
          <div className="hidden lg:block w-full lg:w-1/2 sticky top-32 h-[600px]">
            {/* The Image Container */}
            <div className="relative w-full h-full flex items-center justify-center rounded-sm overflow-hidden">

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={features[activeIdx].image}
                    alt={features[activeIdx].title}
                    fill
                    className="object-cover md:object-contain opacity-90"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-zinc-950/30 pointer-events-none" />

              <div className="absolute bottom-10 left-10 right-10 flex flex-col items-center justify-end z-10 opacity-90">
                <motion.div
                  key={`tagline-${activeIdx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-zinc-900/50 backdrop-blur-md border border-zinc-700 text-zinc-300 text-xs font-mono tracking-widest uppercase"
                >
                  <Sparkles size={12} className="text-indigo-400" />
                  {features[activeIdx].tagline}
                </motion.div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
