"use client";

import { UserPlus, Settings2, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <UserPlus size={24} className="text-indigo-600" />,
      title: "Link Your Instagram",
      desc: "Connect your Creator or Business Instagram account in just one click. Safe and fully approved by Meta.",
      image: "/images/how-it-works-1.png"
    },
    {
      number: "02",
      icon: <Settings2 size={24} className="text-amber-600" />,
      title: "Create Reply Rules",
      desc: "Choose your trigger keywords (like 'INFO' or 'BUY') and set the product links or messages you want to send.",
      image: "/images/how-it-works-2.png"
    },
    {
      number: "03",
      icon: <PlayCircle size={24} className="text-emerald-600" />,
      title: "Watch Followers Grow",
      desc: "Go live! Automixa will reply to comments and send DMs instantly 24/7. Watch your sales and followers grow.",
      image: "/images/how-it-works-3.png"
    }
  ];

  return (
    <section id="how-it-works" className="py-12 bg-transparent relative overflow-hidden">
      {/* Background Soft Gradient Glows */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-1/3 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-10 relative z-10">

        {/* Header Title Block */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] mb-4 block">
              Process Flow
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground tracking-tight leading-[1.1] mb-8">
              Simple setup. <br />
              <span className="text-sage font-normal">Scalable results.</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-sm md:text-lg max-w-sm font-normal leading-relaxed">
            Automate your Instagram in just three incredibly simple steps.
          </p>
        </div>

        {/* 3-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-white/40 backdrop-blur-3xl border border-white/60 hover:border-[#6366F1]/30 rounded-[48px] overflow-hidden transition-all duration-500 flex flex-col h-full shadow-2xl shadow-zinc-200/20"
            >
              {/* Step Image */}
              <div className="relative h-48 md:h-56 w-full overflow-hidden bg-zinc-50 flex items-center justify-center">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/40 to-transparent" />

                {/* Floating Icon */}
                <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md border border-white flex items-center justify-center shadow-lg shadow-zinc-200/50">
                  {step.icon}
                </div>
              </div>

              {/* Text Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-extrabold font-display text-zinc-100 group-hover:text-indigo-100 transition-colors duration-500">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-zinc-800 mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-zinc-500 text-xs md:text-sm lg:text-base leading-relaxed">
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
