"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full flex items-start justify-center px-4 sm:px-6 md:px-8 pt-28 pb-12 lg:pt-28 lg:pb-8 lg:h-screen lg:min-h-[700px] lg:max-h-[900px] overflow-hidden">
      
      <div className="bg-gradient-to-br from-sage via-[#1C1242] to-[#050716] rounded-[24px] sm:rounded-[32px] md:rounded-[40px] relative overflow-hidden flex flex-col justify-center items-center text-center p-8 sm:p-12 md:p-14 lg:p-16 shadow-none w-full max-w-8xl mx-auto h-auto lg:h-[calc(100vh-160px)] lg:min-h-[500px] lg:max-h-[720px] group z-10 transition-all duration-300">
        
        {/* SVG Noise Overlay */}
        <div
          className="absolute inset-0 opacity-[0.14] mix-blend-overlay pointer-events-none z-[2]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        {/* Dynamic Background Glowing Orbs */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-sage/20 rounded-full blur-[120px] pointer-events-none z-[1]" />
        <div className="absolute bottom-[-20%] right-[20%] w-[60%] h-[60%] bg-sage/10 rounded-full blur-[120px] pointer-events-none z-[1]" />

        {/* Content Wrapper */}
        <div className="relative z-[3] max-w-5xl mx-auto flex flex-col items-center">
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.12] sm:leading-[1.08] tracking-tight font-display max-w-4xl px-2 animate-in fade-in"
          >
            Automate Instagram <br className="sm:hidden" />
            Comments & DMs <br className="hidden sm:inline" />
            Safely with Automixa
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm md:text-base lg:text-lg text-white/75 font-light leading-relaxed max-w-2xl mx-auto mt-4 md:mt-5 px-4 animate-in fade-in"
          >
            Send instant links, download codes, or product guides to your audience automatically when they comment or DM. 100% safe, official Meta API, and no password required.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 md:mt-8 animate-in fade-in"
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-4 bg-white text-black pl-8 pr-3 py-3 rounded-full font-bold hover:scale-[1.03] hover:shadow-2xl hover:shadow-white/5 active:scale-[0.98] transition-all w-fit text-sm group"
            >
              Get Started Free
              <div className="bg-[#050716] text-white rounded-full p-2.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-rotate-45">
                <ArrowRight size={16} />
              </div>
            </Link>
          </motion.div>



        </div>

      </div>
    </section>
  );
}
