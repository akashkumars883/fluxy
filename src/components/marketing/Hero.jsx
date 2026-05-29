"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight,ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Moves the background down slightly as you scroll down, creating a parallax effect
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="relative w-full overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28 flex items-center isolate min-h-[90vh] md:min-h-[90vh]">
      
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0 h-[110%] -top-[5%] md:h-[120%] md:-top-[10%]" 
        style={{ y: backgroundY }}
      >
        <Image 
          src="/images/hero-bg.jpg.png"
          alt="Hero Background"
          fill
          className="object-cover object-[15%_center] md:object-center"
          priority
        />
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </motion.div>

      {/* Content Wrapper */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-20 w-full">
        
        {/* Left-aligned Text Content */}
        <div className="max-w-3xl flex flex-col items-start text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight font-display drop-shadow-sm"
          >
            Grow Your Audience with Smart <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 drop-shadow-lg">Instagram Automation.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm md:text-xl text-zinc-200 font-normal leading-relaxed max-w-2xl mt-6 drop-shadow-md"
          >
            Turn followers into loyal customers while you sleep. Automixa instantly auto-replies to comments and DMs, captures leads, and scales your engagement 24/7.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-6"
          >
            <Link
              href="/login"
              className="inline-flex items-center justify-between gap-4 bg-white text-zinc-950 pl-8 pr-3 py-3.5 rounded-full font-bold hover:scale-[1.03] active:scale-[0.98] transition-all w-full sm:w-fit text-sm group"
            >
              Start Free Trial
              <div className="bg-zinc-100 text-zinc-950 rounded-full p-2 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-rotate-45">
                <ArrowRight size={16} />
              </div>
            </Link>
            
            <div className="flex items-center gap-2 text-zinc-300 text-xs font-semibold drop-shadow">
              <ShieldCheck size={18} className="text-emerald-400" />
              Official Meta Approved API
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
