"use client";

import { motion } from "framer-motion";
import { ArrowRight,CheckCircle2,Layout,MessageSquare,Target,Zap,ShoppingBag,Sparkles } from "lucide-react";
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
    color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    icon: Sparkles
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
    color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    icon: MessageSquare
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
    color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    icon: Zap
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
    color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    icon: Target
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
    color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    icon: Layout,
    isComingSoon: true
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
    color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    icon: ShoppingBag
  }
];

export default function Features() {
  return (
    <section id="features" className="py-12 md:py-16 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-10">

        {/* Header Title Block */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] mb-3 block">
              Core Capabilities
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight leading-[1.1] mb-4">
              Precision automation <span className="text-sage font-normal">at scale.</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-sm md:text-lg max-w-sm font-normal leading-relaxed">
            Every tool you need to respond faster, organize leads, and deliver approved resources.
          </p>
        </div>

        {/* Dynamic Bento-Style Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col rounded-xl bg-white border border-zinc-200/80 hover:border-indigo-300 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
              >
                {/* Visual Area (Top) - Full Bleed */}
                <div className="relative h-72 sm:h-80 w-full flex items-center justify-center bg-zinc-50 overflow-hidden border-b border-white/60">
                  <motion.img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover z-10 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none" />
                  <div className={`absolute top-6 left-6 w-12 h-12 rounded-xl flex items-center justify-center border shadow-lg z-30 backdrop-blur-md bg-white ${feature.color}`}>
                    <Icon size={20} />
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-[#6366F1] transition-colors duration-300 tracking-tight mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-500 font-normal leading-relaxed mb-6">
                    {feature.desc}
                  </p>
                  <div className="space-y-3 mb-8">
                    {feature.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-3 text-zinc-600 font-medium text-xs">
                        <CheckCircle2 size={14} className="text-[#6366F1] shrink-0" />
                        {bullet}
                      </div>
                    ))}
                  </div>
                  <Link
                    href={feature.isComingSoon ? "#" : "/login"}
                    className={`mt-auto flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-xs transition-all duration-300 ${
                      feature.isComingSoon
                        ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
                    }`}
                    onClick={(e) => feature.isComingSoon && e.preventDefault()}
                  >
                    {feature.isComingSoon ? "Coming Soon" : "Get Started"}
                    {!feature.isComingSoon && <ArrowRight size={16} />}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
