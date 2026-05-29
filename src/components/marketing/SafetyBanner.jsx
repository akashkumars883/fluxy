"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function SafetyBanner() {
  return (
    <section className="py-8 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="group relative flex flex-col md:flex-row items-center justify-between gap-6 rounded-[36px] bg-white/40 backdrop-blur-3xl border border-white/60 hover:border-[#6366F1]/30 transition-all duration-500 shadow-xl shadow-zinc-200/10 hover:shadow-2xl hover:shadow-[#6366F1]/5 p-6 sm:p-8"
        >
          {/* Left Side: Text and Compliance Badge */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
              Protected by automixa Shield™
            </h3>
            <p className="text-zinc-500 text-xs sm:text-sm font-medium mt-1 max-w-xl">
              Your Instagram account is fully secure. We use official APIs and smart typing delays to simulate natural human activity and prevent action blocks.
            </p>
          </div>

          {/* Right Side: Meta Badge, Seperator, and Link */}
          <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0 w-full md:w-auto justify-center sm:justify-between md:justify-end">
            <img 
              src="/images/meta-partner.png" 
              alt="Meta Business Partner Logo" 
              className="h-24 w-auto object-contain"
            />
            <div className="h-6 w-[1px] bg-zinc-200 hidden sm:block" />
            <Link 
              href="/shield" 
              className="w-full sm:w-auto px-6 py-3 bg-[#6366F1] hover:bg-[#5053db] text-white text-sm font-semibold rounded-full flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#6366F1]/10 hover:shadow-lg hover:shadow-[#6366F1]/20 hover:-translate-y-0.5"
            >
              See Security Protocol
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
