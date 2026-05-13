"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
  return (
    <section id="cta" className="w-full bg-transparent py-10 md:py-12 px-4 sm:px-6 md:px-8 relative overflow-hidden flex justify-center">
      <div className="w-full max-w-8xl mx-auto relative z-10">
        
        {/* Massive Black Glass CTA Wrapper Card (Matches Hero.jsx dimensions and horizontal card layout exactly) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[24px] sm:rounded-[32px] md:rounded-[40px] px-6 sm:px-10 md:px-14 py-12 md:py-16 bg-gradient-to-br from-[#0c0c14] via-[#05050a] to-[#010103] border border-white/[0.06] shadow-none overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-10 group/main"
        >
          {/* SVG Noise Overlay */}
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none z-[2]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
          />

          {/* Inner Ambient Glow Spots */}
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 -translate-x-1/2 z-[1]" />
          <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-[#6366F1]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2 z-[1]" />

          {/* Left Side: Info Details */}
          <div className="relative z-10 text-left space-y-3 max-w-3xl">
            {/* Tagline label */}
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] block">
              Get Started Now
            </p>

            {/* Main Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              Ready to transform your Instagram <br className="hidden sm:inline" />
              <span className="text-sage font-normal">engagement?</span>
            </h2>

            {/* Description */}
            <p className="text-zinc-400 text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
              No credit card required. Connect your first business or creator account securely in seconds.
            </p>
          </div>

          {/* Right Side: Shining White Liquid CTA Button */}
          <div className="relative z-10 shrink-0">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-zinc-950 font-bold text-xs sm:text-sm rounded-full hover:scale-[1.03] active:scale-[0.98] hover:bg-zinc-50 transition-all shadow-xl shadow-black/30 tracking-normal group/btn"
            >
              Start Automating Free
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
