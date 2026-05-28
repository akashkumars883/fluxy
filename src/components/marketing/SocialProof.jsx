"use client";

import { motion } from "framer-motion";
import {
MessageSquare,
ShieldCheck,
TrendingUp,
Users
} from "lucide-react";

export default function SocialProof() {
  const stats = [
    {
      value: "50k+",
      label: "Auto Replies Sent",
      description: "Comments, DMs, and story replies sent instantly 24/7 without any delay.",
      icon: MessageSquare,
      iconBg: "bg-indigo-50 text-indigo-600",
      glowColor: "rgba(99, 102, 241, 0.15)",
    },
    {
      value: "< 2s",
      label: "Instant Reply Speed",
      description: "Replies are sent in under 2 seconds. Safe and fully approved by Meta.",
      icon: ShieldCheck,
      iconBg: "bg-emerald-50 text-emerald-600",
      glowColor: "rgba(16, 185, 129, 0.15)",
    },
    {
      value: "35%+",
      label: "More Link Clicks",
      description: "Average increase in active followers clicking your website and course links.",
      icon: TrendingUp,
      iconBg: "bg-rose-50 text-rose-600",
      glowColor: "rgba(244, 63, 94, 0.15)",
    },
    {
      value: "150+",
      label: "Indian Creators",
      description: "Active creators and business owners successfully automating their profiles.",
      icon: Users,
      iconBg: "bg-amber-50 text-amber-600",
      glowColor: "rgba(245, 158, 11, 0.15)",
    },
  ];

  return (
    <section className="py-10 md:py-12 bg-transparent relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-10">

        {/* Header Title */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6366F1] mb-4">
            Real Numbers. Real Growth.
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight leading-[1.1]">
            Grow your <span className="text-sage font-normal">Instagram</span> followers & sales
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-zinc-100/40 hover:shadow-2xl hover:shadow-zinc-200/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
              >
                {/* Subtle soft glowing aura on hover */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl"
                  style={{ background: `radial-gradient(circle at center, ${stat.glowColor} 0%, transparent 70%)` }}
                />

                {/* Glassmorphic Icon Badge */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform duration-300 group-hover:scale-110 ${stat.iconBg}`}>
                  <Icon size={22} className="shrink-0" />
                </div>

                {/* Value Stat */}
                <span className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-2">
                  {stat.value}
                </span>

                {/* Label */}
                <h3 className="text-base font-bold text-zinc-800 mb-2">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-500 font-medium leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
