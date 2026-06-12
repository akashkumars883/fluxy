"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import FollowerMarquee from "./FollowerMarquee";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden pt-32 pb-6 md:pb-12 flex flex-col items-center justify-center isolate min-h-[85vh] bg-transparent">

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-20 w-full text-left flex flex-col items-start">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/5 hover:bg-zinc-900/10 transition-colors border border-zinc-900/10 rounded-full text-[11px] uppercase tracking-widest font-semibold text-zinc-600 mb-8 font-mono"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Redefining Automation
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-[5.5rem] font-medium text-zinc-900 tracking-tight mb-6 sm:mb-8"
        >
          Supercharge Your Instagram <br className="hidden md:block" />
          <span className="text-zinc-500 font-light">With Powerful Automation</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[15px] sm:text-base md:text-xl text-zinc-500 font-normal leading-relaxed max-w-2xl mb-8 sm:mb-10"
        >
          Turn comments into customers automatically. Capture leads, deliver resources, and grow your audience on autopilot — without lifting a finger.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 bg-sage hover:bg-sage/90 text-white px-8 py-3.5 rounded-full font-medium transition-all w-full sm:w-auto text-sm shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] group"
          >
            Start Free Trial
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            className="flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 px-8 py-3.5 rounded-full font-medium transition-all w-full sm:w-auto text-sm shadow-sm"
          >
            <Play size={16} className="text-zinc-400" />
            Watch Demo
          </button>
        </motion.div>

        {/* Trust & Partner Badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-10 flex flex-row items-center justify-between sm:justify-start w-full sm:w-auto gap-2 sm:gap-8"
        >

          {/* Meta Business Partner */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 cursor-default hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#0064E0]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
            </svg>
            <div className="flex flex-col items-start justify-center leading-tight">
              <span className="font-bold text-[#1C2B33] text-[13px] sm:text-[15px] tracking-tight leading-none">Meta Business</span>
              <span className="font-medium text-zinc-500 text-[11px] sm:text-[13px] mt-0.5 leading-none">Partner</span>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="block w-[1px] h-6 sm:h-8 bg-zinc-200"></div>

          {/* Trustpilot Rating */}
          <div className="flex items-center gap-1.5 sm:gap-3 cursor-default hover:opacity-80 transition-opacity">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className={`flex items-center justify-center w-[16px] h-[16px] sm:w-[22px] sm:h-[22px] rounded-sm ${star <= 4 ? 'bg-[#00B67A]' : 'bg-[#dcdce6]'}`}>
                  <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start justify-center leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#1C2B33] text-[13px] sm:text-[15px] tracking-tight leading-none">4.0 Rating</span>
              </div>
              <span className="font-medium text-zinc-500 text-[11px] sm:text-[13px] mt-0.5 leading-none">on Trustpilot</span>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Instagram Follower Marquee */}
      <FollowerMarquee />
    </section>
  );
}
