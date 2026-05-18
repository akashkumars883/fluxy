"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28 flex items-center isolate">
      
      {/* Background Orbs Removed */}


      {/* Content Wrapper */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-[10] w-full">
        
        {/* Left-aligned Text Content */}
        <div className="max-w-3xl flex flex-col items-start text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold text-zinc-950 leading-[1.1] tracking-tight font-display"
          >
            Automate Instagram <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-400 to-pink-500">Conversations</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm md:text-xl text-zinc-500 font-normal leading-relaxed max-w-2xl mt-5"
          >
            Scale your engagement safely with the official Meta API. Automixa handles your comments and DMs so you can focus on creating.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-6"
          >
            <Link
              href="/login"
              className="inline-flex items-center justify-between gap-4 bg-zinc-950 text-white pl-8 pr-3 py-3.5 rounded-full font-bold hover:scale-[1.03] active:scale-[0.98] transition-all w-full sm:w-fit text-sm group"
            >
              Start Free Trial
              <div className="bg-white/10 text-white rounded-full p-2 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-rotate-45">
                <ArrowRight size={16} />
              </div>
            </Link>
            
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
              <ShieldCheck size={18} className="text-emerald-500" />
              Official Meta Approved API
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
