"use client";

import { ShieldCheck, Eye, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function Safety() {
  return (
    <section id="safety" className="py-10 md:py-12 bg-transparent relative overflow-hidden">
      {/* Background Soft Ambient Lights */}
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        
        {/* Massive Horizontal White Glass Card (Matches Features and Pricing styling) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="group bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white rounded-[32px] p-8 lg:p-12 shadow-xl shadow-zinc-100/40 hover:shadow-2xl hover:shadow-zinc-200/40 transition-all duration-500 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 w-full relative overflow-hidden"
        >
          {/* Inner ambient glow spot */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Left Column: Security Details */}
          <div className="flex-1 space-y-6 sm:space-y-8 w-full">
            
            {/* Shield Icon and Label */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/80 border border-white rounded-2xl flex items-center justify-center shadow-md shadow-zinc-100/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shrink-0">
                <ShieldCheck size={24} className="text-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6366F1]">
                Safety & Compliance
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-800 tracking-tight leading-tight">
              Official Instagram <br className="hidden sm:inline" />
              <span className="text-sage font-normal">Graph API Integration.</span>
            </h2>

            {/* Description */}
            <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
              Automixa is built strictly on top of Meta&apos;s official Graph APIs. We follow every security guideline and compliance protocol to ensure your professional account remains 100% safe, shadowban-free, and secure while you scale your digital presence.
            </p>

            {/* Custom Metrics Flow Badge */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-2">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-zinc-800 tracking-tight">100%</span>
                <span className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mt-1">Safe Flow Control</span>
              </div>
              <div className="hidden sm:block w-[1px] h-10 bg-zinc-200/80" />
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-zinc-800 tracking-tight">Meta Approved</span>
                <span className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mt-1">Official Graph API</span>
              </div>
            </div>

          </div>

          {/* Right Column: Stunning Pure-Tailwind Security Dashboard Mockup */}
          <div className="flex-1 w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-gradient-to-br from-zinc-50/40 to-white/20 border border-white rounded-[24px] flex items-center justify-center relative overflow-hidden group-hover:border-zinc-200/50 transition-all duration-500">
            {/* Visual background lights */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#6366F1]/5 via-transparent to-emerald-500/5 rounded-[24px] blur-xl" />
            
            {/* Geometric layered circles */}
            <div className="absolute w-72 h-72 rounded-full border border-dashed border-zinc-200/80 animate-[spin_60s_linear_infinite] opacity-60" />
            <div className="absolute w-56 h-56 rounded-full border border-zinc-100 opacity-80" />
            <div className="absolute w-36 h-36 rounded-full bg-white/70 border border-white shadow-xl shadow-zinc-100/50 flex items-center justify-center z-10" />

            {/* Interactive glass plates */}
            <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-white/80 border border-white shadow-lg shadow-zinc-100/50 flex items-center gap-3 z-20 hover:scale-105 transition-all duration-300 pointer-events-none">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-500">
                <ShieldCheck size={16} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-800 block">Status Compliant</span>
                <span className="text-[8px] text-zinc-400">Meta Guidelines Match</span>
              </div>
            </div>

            <div className="absolute top-6 right-6 p-4 rounded-2xl bg-white/80 border border-white shadow-lg shadow-zinc-100/50 flex items-center gap-3 z-20 hover:scale-105 transition-all duration-300 pointer-events-none">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-500">
                <Lock size={16} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-800 block">OAuth 2.0 Secure</span>
                <span className="text-[8px] text-zinc-400">Encrypted Token</span>
              </div>
            </div>

            {/* Central glowing lock shield */}
            <div className="relative z-20 flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-500">
              <div className="w-16 h-16 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shadow-xl shadow-zinc-950/20">
                <Lock size={28} className="text-white group-hover:text-emerald-400 transition-colors duration-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Encrypted</span>
            </div>

            {/* Moving decorative particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-pulse" />
          </div>

        </motion.div>

      </div>
    </section>
  );
}
