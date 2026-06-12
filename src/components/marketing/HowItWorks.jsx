"use client";

import { UserPlus, Sparkles, PlayCircle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <UserPlus size={22} className="text-indigo-600" />,
      title: "Link Your Instagram",
      desc: "Connect your Instagram account in just one click. 100% safe, official, and approved by Instagram.",
      image: "/images/how-it-works-1.png"
    },
    {
      number: "02",
      icon: <Sparkles size={22} className="text-amber-600" />,
      title: "Chat to Build",
      desc: "Tell the AI what you want to automate in simple words. The AI sets up the replies and settings instantly.",
      image: "/images/how-it-works-2.png"
    },
    {
      number: "03",
      icon: <PlayCircle size={22} className="text-emerald-600" />,
      title: "Watch Sales Grow",
      desc: "Automixa replies to comments and sends direct messages instantly 24/7, turning views into customers.",
      image: "/images/how-it-works-3.png"
    }
  ];

  return (
    <section id="how-it-works" className="py-8 md:py-12 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 relative z-10">

        <div className="flex flex-col gap-6 lg:gap-10">

          {/* Top Section: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl flex flex-col justify-start text-left"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/5 hover:bg-zinc-900/10 transition-colors border border-zinc-900/10 rounded-full text-[11px] uppercase tracking-widest font-semibold text-zinc-600 mb-8 font-mono"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Process Flow
              </motion.div>
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-zinc-900 tracking-tight leading-[1.1] mb-4">
                Simple setup.
                <span className="text-zinc-500 font-normal"> Scalable results.</span>
              </h2>
            </div>
            <p className="text-zinc-500 text-sm md:text-lg leading-relaxed max-w-xl">
              Automate your entire Instagram presence without writing a single line of code in three simple steps.
            </p>
          </motion.div>

          {/* Bottom Section: Static 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden rounded-none cursor-pointer"
              >
                {/* Background Image */}
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500" />

                {/* Content Container */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col items-start gap-4 overflow-hidden z-10">

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-none bg-white flex items-center justify-center shrink-0 shadow-xl transition-transform duration-500 group-hover:-translate-y-1">
                    {step.icon}
                  </div>

                  {/* Text (Title + Desc) */}
                  <div className="flex flex-col">
                    <h3 className="text-white font-bold text-xl sm:text-2xl mb-2">
                      {step.title}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
