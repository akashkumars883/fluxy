"use client";

import { motion } from "framer-motion";
import { Zap, Heart, CreditCard } from "lucide-react";

export default function TrustBanner() {
  return (
    <section className="w-full bg-transparent relative overflow-hidden py-4 sm:py-6 lg:py-4">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full grid grid-cols-2 lg:flex lg:flex-row lg:items-center lg:justify-between gap-x-4 sm:gap-x-8 md:gap-x-12 gap-y-6 sm:gap-y-8 lg:gap-y-0 transition-all duration-300"
        >
          {/* Badge 1: Instant Setup */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 text-left justify-self-center lg:justify-self-auto">
            <Zap className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-amber-500 shrink-0 fill-amber-500/10" />
            <div>
              <span className="text-xs sm:text-sm font-bold text-zinc-800 block">Instant Setup</span>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 font-medium">Live in under 3 mins</p>
            </div>
          </div>

          {/* Vertical Divider (Desktop Only) */}
          <div className="hidden xl:block w-[1px] h-10 bg-zinc-200/80" />

          {/* Badge 2: Meta Verified */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 text-left justify-self-center lg:justify-self-auto">
            <svg className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-[#0064E0] shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
            </svg>
            <div>
              <span className="text-xs sm:text-sm font-bold text-zinc-800 block">Meta Verified</span>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 font-medium">Secure API Integration</p>
            </div>
          </div>

          {/* Vertical Divider (Desktop Only) */}
          <div className="hidden xl:block w-[1px] h-10 bg-zinc-200/80" />

          {/* Badge 3: Made in India */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 text-left justify-self-center lg:justify-self-auto">
            <Heart className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-rose-500 shrink-0 fill-rose-500/10" />
            <div>
              <span className="text-xs sm:text-sm font-bold text-zinc-800 block">Made in India</span>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 font-medium">Built with pride in Bharat</p>
            </div>
          </div>

          {/* Vertical Divider (Desktop Only) */}
          <div className="hidden xl:block w-[1px] h-10 bg-zinc-200/80" />

          {/* Badge 4: No Credit Card */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 text-left justify-self-center lg:justify-self-auto">
            <CreditCard className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#6366F1] shrink-0 fill-[#6366F1]/10" />
            <div>
              <span className="text-xs sm:text-sm font-bold text-zinc-800 block">No Credit Card</span>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 font-medium">Start free with zero card</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
