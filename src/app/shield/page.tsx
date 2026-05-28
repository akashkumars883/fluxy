"use client";

import CTA from "@/components/marketing/CTA";
import FAQ from "@/components/marketing/FAQ";
import Safety from "@/components/marketing/Safety";
import { motion } from "framer-motion";
import { ArrowRight,Check,Shield,ShieldAlert,ShieldCheck,X } from "lucide-react";
import Link from "next/link";

export default function ShieldPage() {

  const securityFaqs = [
    {
      q: "Will my Instagram account get banned using Automixa?",
      a: "No. Automixa Shield™ operates 100% within the official Meta Graph API guidelines. Meta actively encourages automation through their official partner APIs to help businesses grow. We do not use web scraping, custom browser logins, or spam techniques that trigger Instagram blocks."
    },
    {
      q: "Do you need my Instagram password?",
      a: "Never. We authenticate your account using official Meta/Facebook OAuth secure login. We never see, ask for, or store your Instagram password. You can revoke access at any time directly from your Facebook settings."
    },
    {
      q: "How does the 'Human-Like Delay' system work?",
      a: "If a post goes viral and receives hundreds of comments, traditional automation tools reply to all of them instantly, triggering Instagram's spam filters. Automixa Shield automatically queues replies and adds randomized typing delays (between 4 to 12 seconds), mimicking natural human typing speed."
    },
    {
      q: "Is Automixa compliant with Meta's developer terms?",
      a: "Yes, 100%. Our platform communicates server-to-server exclusively through secure HTTPS API calls to Meta's verified endpoints. Because we are fully compliant, your automations are safe from API deprecation and account flags."
    }
  ];

  return (
    <main className="min-h-screen pt-24 bg-background overflow-hidden selection:bg-[#6366F1]/20">
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Decorative background grid and gradients */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-[#6366F1]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-20 h-20 rounded-[28px] flex items-center justify-center border shadow-2xl backdrop-blur-md text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20 mb-8"
          >
            <Shield size={40} className="fill-[#6366F1]/10 animate-pulse" />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm"
          >
            <ShieldCheck size={14} /> automixa Shield™ Active-Guard
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-semibold text-zinc-950 tracking-tight leading-[1.05] max-w-4xl mb-6"
          >
            100% Safe Instagram Automation. <br />
            <span className="text-[#6366F1]">Zero Account Risk.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-zinc-500 text-sm sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl mb-10"
          >
            Say goodbye to action blocks, shadowbans, and suspicious login warnings. Our proprietary safety engine protects your account around the clock.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-[#6366F1] text-white font-bold rounded-2xl hover:bg-[#5053db] transition-all shadow-lg shadow-[#6366F1]/20 hover:shadow-xl hover:shadow-[#6366F1]/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              Start Automating Safely
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#compare" 
              className="w-full sm:w-auto px-8 py-4 border border-zinc-200 text-zinc-700 font-bold rounded-2xl hover:bg-zinc-50 transition-all flex items-center justify-center"
            >
              Learn Security Measures
            </a>
          </motion.div>
        </div>
      </section>

      {/* Safety Bento Grid Component */}
      <Safety />

      {/* Comparison Grid Section */}
      <section id="compare" className="py-20 bg-zinc-50/50 border-y border-zinc-100 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em] mb-4 block">
              How We Differ
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold text-zinc-950 tracking-tight mb-4">
              Safe vs. Dangerous Automation
            </h2>
            <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-normal">
              Many cheap automation tools rely on illegal techniques that put your account at severe risk. Here is how Automixa Shield keeps you fully secure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Danger side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-red-100 rounded-[32px] p-8 md:p-10 shadow-xl shadow-red-500/5 space-y-8 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-zinc-900 mb-2">Traditional Spam Bots</h3>
                  <p className="text-xs text-zinc-500 font-normal">These common shortcuts will quickly lead to account flags or permanent bans.</p>
                </div>
                <div className="space-y-4">
                  {[
                    "Asks for your password or direct login",
                    "Spoofs browser sessions or uses headless scripts",
                    "Sends rapid, identical direct messages in bulk",
                    "Violates Meta's official developer terms of service",
                    "Leads to Suspicious Login warnings and bans"
                  ].map((text, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs text-zinc-600 font-semibold">
                      <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-zinc-100 flex items-center justify-center text-xs font-bold text-rose-500 bg-rose-50/50 py-3 rounded-2xl">
                ⚠️ HIGH SECURITY RISK FOR YOUR BRAND
              </div>
            </motion.div>

            {/* Shield side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white border-2 border-[#6366F1] rounded-[32px] p-8 md:p-10 shadow-2xl shadow-[#6366F1]/5 space-y-8 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-[#6366F1] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
                Shield Active
              </div>
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] flex items-center justify-center">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#6366F1] mb-2">automixa Shield™</h3>
                  <p className="text-xs text-zinc-500 font-normal">Our proprietary core safety framework is engineered for peace of mind.</p>
                </div>
                <div className="space-y-4">
                  {[
                    "100% Password-Free secure Meta OAuth connection",
                    "Communicates directly via Meta's Official Partner APIs",
                    "Simulates organic typing delays and random timings",
                    "Fully compliant with official Instagram policies",
                    "Proven track record of zero account warnings"
                  ].map((text, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs text-zinc-800 font-bold">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-zinc-100 flex items-center justify-center text-xs font-bold text-emerald-600 bg-emerald-50/50 py-3 rounded-2xl">
                🛡️ 100% COMPLIANT AND ACCOUNT SAFE
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security specific Accordion FAQ */}
      <FAQ customFaqs={securityFaqs as unknown as null} />

      {/* Security CTA Card */}
      <div className="pb-16">
        <CTA />
      </div>

    </main>
  );
}
