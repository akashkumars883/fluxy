"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Sparkles, Activity, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function Safety() {
  return (
    <section id="safety" className="py-12 md:py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-10">
        
        {/* Header Title Block - Simple, Clean, and Premium */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-20">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] mb-4 block">
              100% Safe & Secure
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground tracking-tight leading-[1.1] mb-8">
              Meet Automixa Shield. <br />
              <span className="text-sage font-normal">Built to keep your account safe.</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-sm md:text-lg max-w-xl font-normal leading-relaxed">
            Most automation tools send quick replies all at once, which can get your account blocked. Automixa Shield works slowly and naturally, just like a real human, to keep your Instagram account 100% safe.
          </p>
        </div>

        {/* Premium Bento Grid (Checkered 7-5 & 5-7 Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 items-stretch">
          
          {/* Card 1: Natural Human Delay (Col-Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group md:col-span-7 relative flex flex-col justify-between rounded-[48px] bg-white/40 backdrop-blur-3xl border border-white/60 hover:border-[#6366F1]/30 transition-all duration-500 shadow-xl shadow-zinc-200/20 hover:shadow-2xl hover:shadow-[#6366F1]/5 p-8 md:p-10 overflow-hidden"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xl backdrop-blur-md text-indigo-500 bg-indigo-500/10 border-indigo-500/20">
                <Activity size={20} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-[#6366F1] transition-colors duration-300 tracking-tight">
                  Natural Human Delay
                </h3>
                <p className="text-sm text-zinc-500 font-normal leading-relaxed max-w-lg">
                  If your post goes viral, our shield adds a random delay (like 4 to 12 seconds) between replies. This looks completely natural to Instagram's safety filters.
                </p>
              </div>
            </div>

            {/* Simulated Speed Throttling Bar Visual */}
            <div className="mt-8 p-6 bg-zinc-50 rounded-[32px] border border-zinc-100 flex flex-col gap-3 font-mono text-[11px]">
              <div className="flex justify-between items-center text-zinc-500">
                <span>REPLY QUEUE DELAY STATUS</span>
                <span className="text-[#6366F1] font-bold animate-pulse">SMART DELAY ACTIVE</span>
              </div>
              <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden relative">
                <motion.div 
                  className="absolute h-full bg-[#6366F1] rounded-full"
                  animate={{ width: ["15%", "65%", "45%", "95%", "15%"] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <div className="flex justify-between text-zinc-400 text-[10px]">
                <span>Normal Traffic: 3.4s</span>
                <span className="font-bold text-indigo-600">Surge Viral Traffic: 8.7s</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Different Reply Every Time (Col-Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group md:col-span-5 relative flex flex-col justify-between rounded-[48px] bg-white/40 backdrop-blur-3xl border border-white/60 hover:border-[#6366F1]/30 transition-all duration-500 shadow-xl shadow-zinc-200/20 hover:shadow-2xl hover:shadow-[#6366F1]/5 p-8 md:p-10 overflow-hidden"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xl backdrop-blur-md text-emerald-500 bg-emerald-500/10 border-emerald-500/20">
                <Sparkles size={20} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-[#6366F1] transition-colors duration-300 tracking-tight">
                  Unique Text Changer
                </h3>
                <p className="text-sm text-zinc-500 font-normal leading-relaxed">
                  Instead of sending the exact same message to everyone, our AI changes the words slightly for every reply. This keeps your account looking authentic.
                </p>
              </div>
            </div>

            {/* AI Text Variants Visual */}
            <div className="mt-8 space-y-2.5 font-mono text-[10px]">
              <div className="p-3 bg-white rounded-2xl border border-zinc-100 flex flex-col gap-1.5 shadow-sm">
                <span className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Reply Variant A</span>
                <span className="text-zinc-700 leading-snug">"Hey Akash! Just sent the link to your inbox: link"</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-zinc-100 flex flex-col gap-1.5 shadow-sm opacity-80">
                <span className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Reply Variant B</span>
                <span className="text-zinc-700 leading-snug">"Awesome Akash! Check your DMs, link delivered."</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Spam & Bot Protection (Col-Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="group md:col-span-5 relative flex flex-col justify-between rounded-[48px] bg-white/40 backdrop-blur-3xl border border-white/60 hover:border-[#6366F1]/30 transition-all duration-500 shadow-xl shadow-zinc-200/20 hover:shadow-2xl hover:shadow-[#6366F1]/5 p-8 md:p-10 overflow-hidden"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xl backdrop-blur-md text-rose-500 bg-rose-500/10 border-rose-500/20">
                <ShieldAlert size={20} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-[#6366F1] transition-colors duration-300 tracking-tight">
                  Spam & Bot Protection
                </h3>
                <p className="text-sm text-zinc-500 font-normal leading-relaxed">
                  If someone or a fake bot tries to spam your comments repeatedly, our shield stops replying to them automatically. This keeps your account safe.
                </p>
              </div>
            </div>

            {/* Blocked Spammer Banner Visual */}
            <div className="mt-8 p-5 bg-rose-50/50 border border-rose-100 rounded-3xl flex items-center justify-between gap-3 text-rose-800">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-rose-400 block font-mono">Abuse Detected</span>
                <p className="text-xs font-semibold leading-none">Spammer "spam_bot_99" Blocked</p>
              </div>
              <span className="px-2.5 py-1 bg-rose-500 text-white text-[9px] font-black tracking-widest font-mono rounded-lg uppercase">
                AUTO-BLOCK
              </span>
            </div>
          </motion.div>

          {/* Card 4: Official Instagram Partner (Col-Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="group md:col-span-7 relative flex flex-col justify-between rounded-[48px] bg-white/40 backdrop-blur-3xl border border-white/60 hover:border-[#6366F1]/30 transition-all duration-500 shadow-xl shadow-zinc-200/20 hover:shadow-2xl hover:shadow-[#6366F1]/5 p-8 md:p-10 overflow-hidden"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xl backdrop-blur-md text-amber-500 bg-amber-500/10 border-amber-500/20">
                <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-[#6366F1] transition-colors duration-300 tracking-tight">
                  Official & Approved Connection
                </h3>
                <p className="text-sm text-zinc-500 font-normal leading-relaxed max-w-lg">
                  We do not ask for your password and we do not use fake browser tricks. We connect directly through Instagram's official partner tools.
                </p>
              </div>
            </div>

            {/* Official Meta Badge Integration */}
            <div className="mt-8 p-6 bg-zinc-50 border border-zinc-100 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block font-mono">Verification Seal</span>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-600 font-bold text-xs">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>100% Meta API Compliant</span>
                </div>
              </div>
              <img 
                src="/images/meta-partner.png" 
                alt="Meta Business Partner" 
                className="w-full max-w-[120px] h-auto object-contain brightness-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300"
              />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
