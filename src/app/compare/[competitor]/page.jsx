"use client";

import CTA from "@/components/marketing/CTA";
import { competitorsData } from "@/data/comparisons";
import { AnimatePresence,motion } from "framer-motion";
import { ArrowRight,Check,Minus,Plus,ShieldCheck,Sparkles,X,Zap } from "lucide-react";
import Link from "next/link";
import { use,useState } from "react";

export default function ComparePage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const competitor = params?.competitor;
  const data = competitorsData[competitor];

  // Accordion active index state
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-zinc-800">Comparison Page Not Found</h1>
          <Link href="/" className="text-[#6366F1] font-semibold hover:underline">
            Go back to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background overflow-hidden selection:bg-[#6366F1]/20">
      
      {/* 1. Hero Section (Styled exactly like the homepage Hero) */}
      <section className="relative w-full overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28 flex items-center isolate">
        
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-[10] w-full">
          
          <div className="max-w-4xl flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-[10px] font-bold uppercase tracking-wider mb-6 shadow-sm border border-[#6366F1]/20"
            >
              <Sparkles size={12} /> Creator-First Alternative
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold text-zinc-950 leading-[1.1] tracking-tight font-display"
            >
              Automixa vs {data.name} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-400 to-pink-500">The Smarter Choice</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm md:text-xl text-zinc-500 font-normal leading-relaxed max-w-3xl mt-6"
            >
              {data.desc}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
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

      {/* 2. Side-by-Side Premium Grid Table */}
      <section className="py-12 max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[48px] shadow-2xl shadow-zinc-200/20 p-6 sm:p-10 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-200/50 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                <th className="py-4 pl-4 w-1/3">Core Features</th>
                <th className="py-4 pl-6 text-center w-1/3 bg-[#6366F1]/5 text-[#6366F1] rounded-t-[32px] border-x border-t border-[#6366F1]/20">
                  ⚡ Automixa (Safe & Smart)
                </th>
                <th className="py-4 text-center w-1/3 text-zinc-500">
                  ❌ Old-School {data.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/30 text-xs sm:text-sm font-semibold text-zinc-800">
              {data.features.map((feat, idx) => {
                const isTie = feat.winner === "tie";
                return (
                  <tr key={idx} className="group hover:bg-white/40 transition-colors">
                    <td className="py-5 pl-4">
                      <span className="text-zinc-900 font-bold block">{feat.name}</span>
                    </td>
                    
                    <td className="py-5 px-6 text-center bg-[#6366F1]/5 border-x border-[#6366F1]/10 text-zinc-900 font-bold">
                      <div className="flex items-center gap-2 justify-center">
                        <Check size={16} className="text-emerald-600 shrink-0" />
                        <span>{feat.automixa}</span>
                      </div>
                    </td>
                    
                    <td className="py-5 text-center text-zinc-500 font-medium">
                      <div className="flex items-center gap-2 justify-center max-w-[280px] mx-auto">
                        {isTie ? (
                          <Check size={16} className="text-emerald-600 shrink-0" />
                        ) : (
                          <X size={16} className="text-rose-400 shrink-0" />
                        )}
                        <span>{feat.competitor}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Bento Grid: Why Switch (Styled exactly like the homepage bento grid) */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          
          <div className="max-w-3xl mb-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-[10px] font-bold uppercase tracking-wider mb-4 shadow-sm border border-[#6366F1]/20"
            >
              <Zap size={12} /> The Automixa Advantage
            </motion.div>
            
            <h2 className="text-3xl sm:text-5xl font-semibold text-zinc-900 tracking-tight leading-[1.15]">
              Why creators switch from {data.name} to Automixa
            </h2>
          </div>

          {/* Three Custom Bento Column Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.whySwitch.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white border border-zinc-200/40 p-8 rounded-[36px] shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-950 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Dynamic Competitor-Specific FAQ Accordion */}
      <section className="py-24 bg-zinc-50/50 border-t border-zinc-100 relative z-10">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#6366F1]">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold text-zinc-900 tracking-tight mt-2">
              Automixa vs {data.name} FAQs
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-3">
              Clear, transparent answers about switching your automation engine safely.
            </p>
          </div>

          <div className="space-y-4">
            {data.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-zinc-200/60 rounded-[28px] overflow-hidden transition-shadow hover:shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 sm:px-8 py-5 flex items-center justify-between text-left gap-4 font-bold text-zinc-900 text-sm sm:text-base cursor-pointer hover:bg-zinc-50/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-500">
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 sm:px-8 pb-6 text-zinc-500 font-normal text-xs sm:text-sm leading-relaxed border-t border-zinc-100 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Homepage-style High-converting CTA Block */}
      <CTA />

    </main>
  );
}
