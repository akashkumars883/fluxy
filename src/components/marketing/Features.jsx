"use client";

import { motion } from "framer-motion";
import { ArrowRight,CheckCircle2,Layout,MessageSquare,Target,Zap } from "lucide-react";
import Link from "next/link";

const features = [
  {
    id: "dm",
    title: "Instagram DM Auto-Reply",
    tagline: "Always On, Always Selling",
    desc: "Reply to every incoming direct message (DM) instantly without opening your phone. Give automatic answers to pricing questions or deliver links.",
    bullets: [
      "Instant keyword-based replies",
      "Personalized answers",
      "Approved by Instagram"
    ],
    image: "/images/instagram-dm.png",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    icon: Zap
  },
  {
    id: "comments",
    title: "Comment Auto-Responder",
    tagline: "Grow From Comments",
    desc: "Convert public comments on your Reels into private sales. Automixa replies to comments AND sends a DM with your link instantly.",
    bullets: [
      "Auto-reply to public comments",
      "Send links via DM instantly",
      "Works on specific Reels"
    ],
    image: "/images/instagram-comments-v2.png",
    color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    icon: MessageSquare
  },
  {
    id: "stories",
    title: "Story Auto-Reply",
    tagline: "Turn Views Into Customers",
    desc: "Automatically send a DM to anyone who mentions you in their story. Deliver leads and links when people reply to your stories.",
    bullets: [
      "Story Mention automation",
      "Keyword-based story replies",
      "Official Meta API connection"
    ],
    image: "/images/instagram-stories.png",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    icon: Target
  }
];

const smartBio = {
  title: "Next-Gen Smart Bio Link",
  desc: "One link to rule them all. Replace your boring Linktree with a high-converting, branded Smart Bio. Track clicks, collect leads, and showcase your best content in a beautiful, mobile-first interface.",
  bullets: [
    "Unlimited customizable buttons & links",
    "Real-time analytics & click tracking",
    "Email & Lead collection forms",
    "Deep-integration with Instagram Automations"
  ],
  image: "/images/smart-bio-solid.png",
  color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  icon: Layout
};

export default function Features() {
  return (
    <section id="features" className="py-12 md:py-16 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-10">

        {/* Header Title Block */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] mb-4 block">
              Core Capabilities
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground tracking-tight leading-[1.1] mb-8">
              Precision automation <br />
              <span className="text-sage font-normal">at scale.</span>
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
            className="group col-span-full relative flex flex-col lg:flex-row items-stretch rounded-[48px] bg-white/40 backdrop-blur-3xl border border-white/60 hover:border-[#6366F1]/30 transition-all duration-500 shadow-xl shadow-zinc-200/20 hover:shadow-2xl hover:shadow-[#6366F1]/5 overflow-hidden"
          >
            {/* Visual Area (Left/Top) - Full Bleed */}
            <div className="relative h-72 sm:h-80 lg:h-auto lg:w-[45%] flex items-center justify-center bg-transparent overflow-hidden border-b lg:border-b-0 lg:border-r border-white/60">
              <motion.img
                src={smartBio.image}
                alt={smartBio.title}
                className="w-full h-full object-cover z-10 transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
              />
              
              {/* More Noticeable 3-Side Fades */}
              <div className="absolute inset-0 bg-gradient-to-b from-white via-white/5 to-transparent z-20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent z-20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-l from-white via-white/40 to-transparent z-20 pointer-events-none" />
              
              <div className={`absolute top-6 left-6 w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xl z-30 backdrop-blur-md ${smartBio.color}`}>
                <smartBio.icon size={20} />
              </div>
            </div>

            {/* Content Area (Right/Bottom) */}
            <div className="p-8 md:p-12 flex flex-col justify-center flex-1">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-2 py-1 bg-[#6366F1]/10 text-[#6366F1] rounded-lg text-[10px] font-black uppercase tracking-wider">
                    New Feature
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground group-hover:text-[#6366F1] transition-colors duration-300 tracking-tight mb-6">
                  {smartBio.title}
                </h3>
                <p className="text-sm md:text-lg text-zinc-500 font-normal leading-relaxed mb-8">
                  {smartBio.desc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {smartBio.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-3 text-zinc-600 font-medium text-xs md:text-sm">
                      <CheckCircle2 size={16} className="text-[#6366F1] shrink-0" />
                      {bullet}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-10 flex items-center justify-center gap-2.5 bg-zinc-950 text-white py-4 rounded-3xl font-bold text-xs hover:bg-[#6366F1] transition-all duration-300 shadow-lg shadow-zinc-200"
                  >
                    Build Your Smart Bio
                    <ArrowRight size={16} />
                  </Link>
                  <p className="text-[11px] text-zinc-400 font-medium">Included in all plans</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
