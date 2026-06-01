"use client";

import { UserPlus, Sparkles, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <UserPlus size={24} className="text-indigo-600" />,
      title: "Link Your Instagram",
      desc: "Connect your Instagram account in just one click. 100% safe, official, and approved by Instagram.",
      image: "/images/how-it-works-1.png"
    },
    {
      number: "02",
      icon: <Sparkles size={24} className="text-amber-600" />,
      title: "Chat to Build",
      desc: "Tell the AI what you want to automate in simple words (e.g., 'Send a discount code when someone comments VIP'). The AI sets up the replies and settings for you instantly.",
      image: "/images/how-it-works-2.png"
    },
    {
      number: "03",
      icon: <PlayCircle size={24} className="text-emerald-600" />,
      title: "Watch Your Sales Grow",
      desc: "Go live! Automixa will reply to comments and send direct messages instantly 24/7, turning views into customers automatically.",
      image: "/images/how-it-works-3.png"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-transparent relative overflow-hidden">
      {/* Background Soft Gradient Glows */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-1/3 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-10 relative z-10">

        {/* Header Title Block */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-16">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] mb-3 block">
              Process Flow
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight leading-[1.1] mb-4">
              Simple setup. <span className="text-sage font-normal">Scalable results.</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-sm md:text-lg max-w-lg font-normal leading-relaxed">
            Automate your Instagram in just three incredibly simple steps.
          </p>
        </div>

        {/* 3-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-white/60 backdrop-blur-3xl border border-white/80 hover:border-[#6366F1]/30 hover:bg-white/80 hover:shadow-2xl hover:shadow-[#6366F1]/5 rounded-[48px] overflow-hidden transition-all duration-500 flex flex-col h-full shadow-xl shadow-zinc-200/20"
            >
              {/* Step Image */}
              <div className="relative h-64 md:h-80 w-full overflow-hidden bg-zinc-50/30">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
                />

                {/* Floating Icon - Better Placement */}
                <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-xl border border-zinc-100 shadow-xl shadow-black/5 flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-110">
                  {step.icon}
                </div>
              </div>

              {/* Text Content */}
              <div className="p-6 md:p-8 flex flex-col flex-1 relative">
                <div className="absolute top-4 right-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                  <span className="text-7xl font-extrabold font-display text-zinc-400">
                    {step.number}
                  </span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-zinc-800 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors duration-300 relative z-10">
                  {step.title}
                </h3>
                <p className="text-zinc-500 text-sm md:text-base leading-relaxed relative z-10">
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
