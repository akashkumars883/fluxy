"use client";

import { UserPlus, Settings2, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <UserPlus size={24} className="text-indigo-600" />,
      title: "Link Your Instagram",
      desc: "Connect your Creator or Business Instagram account in just one click. Safe and fully approved by Meta."
    },
    {
      number: "02",
      icon: <Settings2 size={24} className="text-amber-600" />,
      title: "Create Reply Rules",
      desc: "Choose your trigger keywords (like 'INFO' or 'BUY') and set the product links or messages you want to send."
    },
    {
      number: "03",
      icon: <PlayCircle size={24} className="text-emerald-600" />,
      title: "Watch Followers Grow",
      desc: "Go live! Automixa will reply to comments and send DMs instantly 24/7. Watch your sales and followers grow."
    }
  ];

  return (
    <section id="how-it-works" className="py-10 md:py-12 bg-transparent relative overflow-hidden">
      {/* Background Soft Gradient Glows */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-1/3 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        
        {/* Header Title Block */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-12 gap-6">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] mb-3 block">
              Process Flow
            </p>
            <h2 className="text-4xl md:text-6xl font-semibold text-foreground tracking-normal leading-[1.1]">
              Simple setup. <br />
              <span className="text-sage font-normal">Scalable results.</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-base sm:text-lg max-w-sm font-normal leading-relaxed">
            Automate your Instagram in just three incredibly simple steps.
          </p>
        </div>

        {/* 3-Step Glassmorphism Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white rounded-3xl p-8 shadow-xl shadow-zinc-100/40 hover:shadow-2xl hover:shadow-zinc-200/40 hover:scale-[1.01] transition-all duration-500 flex flex-col justify-between min-h-[280px] relative"
            >
              {/* Inner card glow spot */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Top Row: Icon and Step Number */}
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/80 border border-white flex items-center justify-center shadow-md shadow-zinc-100/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  {step.icon}
                </div>
                <span className="text-4xl sm:text-5xl font-extrabold font-display bg-gradient-to-br from-zinc-200 to-zinc-300 bg-clip-text text-transparent group-hover:from-indigo-400 group-hover:to-[#6366F1] transition-all duration-500 select-none">
                  {step.number}
                </span>
              </div>

              {/* Bottom Row: Text Content */}
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-800 mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
