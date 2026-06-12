"use client";

import PageTransition from "@/components/ui/PageTransition";
import { motion } from "framer-motion";
import { Mail,ShieldCheck } from "lucide-react";
import { useState } from "react";

import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("info@automixa.in");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqItems = [
    {
      q: "Is Automixa safe for my Instagram account?",
      a: "Yes, 100%! Automixa is built strictly on top of the official Meta (Facebook/Instagram) Developer API. We never ask for, or store, your Instagram password. Your account is always completely safe and compliant."
    },
    {
      q: "Do I need an Instagram Creator or Business account?",
      a: "Yes. To use automated replies, Meta requires your account to be either a Free Creator Account or a Free Business Account, and linked to a Facebook Page. If you have a Personal Account, you can switch to a Creator/Business account in 1 minute inside your Instagram settings."
    },
    {
      q: "Can I try Automixa for free?",
      a: "Absolutely! Every new user gets a completely free trial account instantly upon linking their profile. You can set up your first comment and DM reply rules and test them out without paying anything."
    }
  ];

  return (
    <main className="min-h-screen text-foreground overflow-hidden relative font-sans pt-32 pb-16 selection:bg-sage/20">
      
      {/* Premium Soft Ambient Backglows Removed */}

      <PageTransition>
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          
          {/* Header Title Section (2-column layout matching homepage components) */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 md:mb-20 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/5 hover:bg-zinc-900/10 transition-colors border border-zinc-900/10 rounded-full text-[11px] uppercase tracking-widest font-semibold text-sage mb-6 font-mono">
                Support Hub
              </div>
              <h1 className="text-4xl md:text-6xl font-semibold text-foreground tracking-normal leading-[1.1]">
                How can we <br />
                <span className="text-sage font-normal">help you?</span>
              </h1>
            </div>
            <p className="text-zinc-500 text-base sm:text-lg max-w-sm font-normal leading-relaxed">
              Choose your preferred support channel below. Our official team is active and ready to guide you or resolve your technical issues.
            </p>
          </div>

          {/* Sleek Centered Support Hub */}
          <div className="max-w-md mx-auto mb-24">
             
             {/* CARD 1: Email Support */}
             <motion.div 
               whileHover={{ y: -6 }}
               className="group bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-sm p-8 lg:p-10 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
             >
                <div className="space-y-6">
                   <div className="w-12 h-12 bg-zinc-50 border border-zinc-200/80 rounded-sm flex items-center justify-center text-[#6366F1] transition-all duration-500 shrink-0">
                      <Mail size={22} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-zinc-800 tracking-tight leading-tight">
                        Email Support
                      </h3>
                      <p className="text-zinc-500 text-sm leading-relaxed font-normal">
                        Ideal for official business inquiries, partnerships, invoice/billing questions, and custom integration requests.
                      </p>
                   </div>
                </div>

                <div className="pt-8 space-y-3 relative z-10">
                   <button 
                     onClick={copyEmail}
                     className="w-full py-3.5 border border-zinc-200 hover:border-zinc-300 bg-white/80 hover:bg-zinc-50 text-zinc-800 font-bold rounded-full flex items-center justify-center gap-2 transition-all text-xs sm:text-sm cursor-pointer shadow-sm hover:scale-[1.02]"
                   >
                     {copied ? "Copied to Clipboard!" : "Copy: info@automixa.in"}
                   </button>
                   <a 
                     href="mailto:info@automixa.in" 
                     className="w-full text-center py-2 text-xs text-zinc-400 hover:text-[#6366F1] transition-colors font-medium block"
                   >
                     Or open mail app directly
                   </a>
                </div>
             </motion.div>

          </div>

          {/* 100% Meta Verified Official Security Strip (Premium Glassmorphic Variant) */}
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
             className="group max-w-4xl mx-auto bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden mb-28 transition-all duration-500"
          >
             <div className="w-12 h-12 bg-zinc-50 border border-zinc-200/80 rounded-sm flex items-center justify-center shrink-0 text-emerald-500 transition-all duration-500">
                <ShieldCheck size={24} className="animate-pulse" />
             </div>
             
             <div className="text-center sm:text-left space-y-1 relative z-10">
                <h4 className="text-sm sm:text-base font-bold text-zinc-800">Official Meta API Architecture</h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-normal max-w-2xl">
                   Automixa communicates exclusively through secure developer tunnels vetted by Meta. We never request your Instagram password, nor do we store any credential databases. Your business page remains completely safe.
                </p>
             </div>
          </motion.div>

          {/* Shared FAQ Block */}
          <FAQ customFaqs={faqItems} />

        </div>
      </PageTransition>
      <CTA />
    </main>
  );
}
