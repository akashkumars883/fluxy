"use client";

import { motion } from "framer-motion";
import { ArrowRight,CheckCircle2,Layout,MessageSquare,Target,Zap,ShoppingBag,Sparkles,Rocket } from "lucide-react";
import Link from "next/link";

const features = [
  {
    id: "ai-builder",
    title: "One-Shot AI Campaign Builder",
    tagline: "Type, Build, Launch",
    desc: "Describe what you want to automate in one sentence and let our AI configure triggers, draft response copy, and build the entire funnel in seconds.",
    bullets: [
      "Zero manual configuration",
      "Powered by Llama 3.1 AI",
      "Instant setup in a single step"
    ],
    image: "/images/instagram-dm.png",
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    icon: Sparkles
  },
  {
    id: "comments",
    title: "Comment → DM Auto-Responder",
    tagline: "Grow From Comments",
    desc: "Convert public comments on your Reels into private sales. Automixa replies to comments AND sends a DM with your link instantly.",
    bullets: [
      "Auto-reply to public comments",
      "Send links via DM instantly",
      "Official Meta Graph API connection"
    ],
    image: "/images/instagram-comments-v2.png",
    color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    icon: MessageSquare
  },
  {
    id: "magic-write",
    title: "Magic Write AI Copywriter",
    tagline: "Engage Your Fans Automatically",
    desc: "Stuck on writing copies? Let Magic Write generate 3 highly engaging, conversion-optimized variations for your DMs and comments instantly.",
    bullets: [
      "3 conversion-ready variants per click",
      "Adjust tone & personality",
      "Boost CTR and engagement rate"
    ],
    image: "/images/smart-bio-solid.png",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    icon: Zap
  },
  {
    id: "ai-agents",
    title: "AI FAQ & Sales Closer Agents",
    tagline: "Your 24/7 Social Sales Team",
    desc: "Deploy custom AI agents trained on your product info and pricing. Automatically close leads, answer FAQs, and direct users to buy in DMs.",
    bullets: [
      "AI Tone customization (Witty, Pro)",
      "Upload custom FAQ training data",
      "Intelligent product-led conversations"
    ],
    image: "/images/mini-store.png",
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    icon: Rocket
  },
  {
    id: "preview",
    title: "Zero-API Simulation Preview",
    tagline: "Test-Drive Before Launching",
    desc: "Interact with your campaign live in a realistic iPhone mockup before deploying. Type comments, click CTAs, and see notifications at 0 credit cost.",
    bullets: [
      "Pure client-side state machine",
      "Simulate push notifications",
      "100% free sandbox playground"
    ],
    image: "/images/instagram-stories.png",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    icon: Layout
  },
  {
    id: "spintax",
    title: "Spintax Multi-Variant Replies",
    tagline: "Spam Filter Protection",
    desc: "Input up to 5 comment reply variations. Automixa rotates replies randomly, protecting your account and complying with Instagram security policies.",
    bullets: [
      "Configure up to 5 variations",
      "Random rotation algorithm",
      "Prevents spam detection flags"
    ],
    image: "/images/instagram-comments-v2.png",
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    icon: Target
  }
];

const smartBio = {
  title: "Next-Gen Smart Bio Link",
  desc: "Replace your boring Linktree with a high-converting, branded Smart Bio. Showcase your best content and sell products directly.",
  bullets: [
    "Beautiful Custom Themes & Presets",
    "Direct Store & Product Checkout",
    "Unlimited Custom Links & Socials",
    "Linked with Instagram Automations"
  ],
  image: "/images/smart-bio-solid.png",
  color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  icon: Layout
};

const miniStore = {
  title: "Integrated Mini Store",
  desc: "Sell E-books, templates, and digital courses directly from your profile. Collect payments effortlessly without third-party commission fees.",
  bullets: [
    "Zero transaction fees (excl. gateway)",
    "Instant payout to your bank account",
    "Automated delivery on Instagram",
    "Beautiful custom checkout pages"
  ],
  image: "/images/mini-store.png",
  color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  icon: ShoppingBag
};

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
            Every tool you need to turn your audience into a high-converting growth machine.
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
                className="group relative flex flex-col rounded-[48px] bg-white/40 backdrop-blur-3xl border border-white/60 hover:border-[#6366F1]/30 transition-all duration-500 shadow-xl shadow-zinc-200/20 hover:shadow-2xl hover:shadow-[#6366F1]/5 overflow-hidden"
              >
                {/* Visual Area (Top) - Full Bleed */}
                <div className="relative h-72 sm:h-80 w-full flex items-center justify-center bg-zinc-50 overflow-hidden border-b border-white/60">
                  <motion.img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover z-10 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none" />
                  <div className={`absolute top-6 left-6 w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xl z-30 backdrop-blur-md ${feature.color}`}>
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
                    href="/login"
                    className="mt-auto flex items-center justify-center gap-2.5 bg-zinc-950 text-white py-4 rounded-3xl font-bold text-xs hover:bg-[#6366F1] transition-all duration-300 shadow-lg shadow-zinc-200"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            );
          })}

          {/* Full Width Horizontal Card - Smart Bio */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="group col-span-full relative flex flex-col lg:flex-row items-stretch rounded-[36px] lg:h-[350px] bg-white/40 backdrop-blur-3xl border border-white/60 hover:border-[#6366F1]/30 transition-all duration-500 shadow-xl shadow-zinc-200/20 hover:shadow-2xl hover:shadow-[#6366F1]/5 overflow-hidden"
          >
            {/* Visual Area (Left/Top) - Full Bleed */}
            <div className="relative h-56 lg:h-full lg:w-[38%] shrink-0 flex items-center justify-center bg-zinc-50/50 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/60">
              <motion.img
                src={smartBio.image}
                alt={smartBio.title}
                className="w-full h-full object-cover object-top z-10 transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Smooth Blend to Right Content */}
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/40 to-transparent z-20 pointer-events-none hidden lg:block" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/40 to-transparent z-20 pointer-events-none lg:hidden" />
              
              <div className={`absolute top-5 left-5 w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xl z-30 backdrop-blur-md ${smartBio.color}`}>
                <smartBio.icon size={18} />
              </div>
            </div>

            {/* Content Area (Right/Bottom) */}
            <div className="p-6 lg:p-8 flex flex-col justify-center flex-1">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="px-2 py-1 bg-zinc-200/50 text-zinc-500 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    Coming Soon
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-[#6366F1] transition-colors duration-300 tracking-tight mb-2">
                  {smartBio.title}
                </h3>
                <p className="text-sm text-zinc-500 font-normal leading-relaxed mb-4">
                  {smartBio.desc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
                  {smartBio.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-zinc-600 font-medium text-[11px] md:text-xs">
                      <CheckCircle2 size={14} className="text-[#6366F1] shrink-0" />
                      {bullet}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div
                    className="w-full sm:w-auto px-6 flex items-center justify-center gap-2 bg-zinc-200 text-zinc-500 py-2.5 rounded-3xl font-bold text-xs cursor-not-allowed shadow-none"
                  >
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Full Width Horizontal Card - Mini Store */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="group col-span-full relative flex flex-col lg:flex-row-reverse items-stretch rounded-[36px] lg:h-[350px] bg-white/40 backdrop-blur-3xl border border-white/60 hover:border-[#6366F1]/30 transition-all duration-500 shadow-xl shadow-zinc-200/20 hover:shadow-2xl hover:shadow-[#6366F1]/5 overflow-hidden mt-2"
          >
            {/* Visual Area (Right/Top) - Full Bleed */}
            <div className="relative h-56 lg:h-full lg:w-[38%] shrink-0 flex items-center justify-center bg-zinc-50/50 overflow-hidden border-b lg:border-b-0 lg:border-l border-zinc-200/50">
              <motion.img
                src={miniStore.image}
                alt={miniStore.title}
                className="w-full h-full object-cover object-center z-10 transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Smooth Blend to Left Content */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/80 to-transparent z-20 pointer-events-none hidden lg:block" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/40 to-transparent z-20 pointer-events-none lg:hidden" />
              
              <div className={`absolute top-5 right-5 w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xl z-30 backdrop-blur-md ${miniStore.color}`}>
                <miniStore.icon size={18} />
              </div>
            </div>

            {/* Content Area (Left/Bottom) */}
            <div className="p-6 lg:p-8 flex flex-col justify-center flex-1">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="px-2 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    Most Requested
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-amber-500 transition-colors duration-300 tracking-tight mb-2">
                  {miniStore.title}
                </h3>
                <p className="text-sm text-zinc-500 font-normal leading-relaxed mb-4">
                  {miniStore.desc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
                  {miniStore.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-zinc-600 font-medium text-[11px] md:text-xs">
                      <CheckCircle2 size={14} className="text-amber-500 shrink-0" />
                      {bullet}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-6 flex items-center justify-center gap-2 bg-zinc-950 text-white py-2.5 rounded-3xl font-bold text-xs hover:bg-amber-500 transition-all duration-300 shadow-lg shadow-zinc-200"
                  >
                    Start Selling Now
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
