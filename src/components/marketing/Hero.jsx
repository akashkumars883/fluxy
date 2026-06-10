"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28 flex items-center isolate min-h-[80vh] md:min-h-[85vh]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg.png"
          alt="Automixa Instagram business automation platform background"
          fill
          className="object-cover object-[25%_center] md:object-center"
          priority
        />
        <div className="absolute inset-0 bg-zinc-950/70 z-10" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-20 w-full text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-xs font-semibold text-zinc-300 mb-6"
        >
          <Sparkles size={13} className="text-indigo-400" />
          Built on official Meta APIs
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight font-display"
        >
          Automate Instagram Conversations
          <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400">
            {" "}in Seconds.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-xl text-zinc-200 font-normal leading-relaxed max-w-2xl mt-6"
        >
          Turn comments into customers. Capture leads, deliver resources, and grow on autopilot — 24/7.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4"
        >
          <Link
            href="/login"
            className="inline-flex items-center justify-between gap-3 bg-indigo-600 hover:bg-indigo-500 text-white pl-7 pr-2 py-2.5 rounded-xl font-bold transition-all w-full sm:w-fit text-sm group shadow-lg shadow-indigo-600/30"
          >
            Start Free Trial
            <div className="bg-white/15 group-hover:bg-white/25 text-white rounded-xl p-1.5 transition-all">
              <ArrowRight size={14} />
            </div>
          </Link>

          <Link
            href="/features/comment-auto-responder"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-xl text-sm font-bold transition-all"
          >
            Explore Features
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
