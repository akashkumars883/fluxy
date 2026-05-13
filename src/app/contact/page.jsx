"use client";

import { useState } from "react";
import { Mail, ShieldCheck, ChevronDown, ArrowRight, Ticket, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/ui/PageTransition";

export default function ContactPage() {
  const [activeFaq, setActiveFaq] = useState(null);
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
    <main className="min-h-screen text-foreground overflow-hidden relative font-sans pt-32 pb-24 selection:bg-sage/20">
      
      {/* Premium Soft Ambient Backglows matching homepage FAQ & Pricing */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

      <PageTransition>
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          
          {/* Header Title Section (2-column layout matching homepage components) */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 md:mb-20 gap-6">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] mb-3 block">
                Support Hub
              </p>
              <h1 className="text-4xl md:text-6xl font-semibold text-foreground tracking-normal leading-[1.1]">
                How can we <br />
                <span className="text-sage font-normal">help you?</span>
              </h1>
            </div>
            <p className="text-zinc-500 text-base sm:text-lg max-w-sm font-normal leading-relaxed">
              Choose your preferred support channel below. Our official team is active and ready to guide you or resolve your technical issues.
            </p>
          </div>

          {/* Sleek 2-Card Support Hub Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-24 max-w-4xl mx-auto">
             
             {/* CARD 1: Email Support */}
             <motion.div 
               whileHover={{ y: -6 }}
               className="group bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white rounded-[32px] p-8 lg:p-10 shadow-xl shadow-zinc-100/40 hover:shadow-2xl hover:shadow-zinc-200/40 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
             >
                {/* Subtle hover glow matching the pricing hover card */}
                <div className="absolute top-1/2 -left-16 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -translate-y-1/2" />
                
                <div className="space-y-6">
                   <div className="w-12 h-12 bg-white/80 border border-white rounded-2xl flex items-center justify-center text-[#6366F1] shadow-md shadow-zinc-100/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shrink-0">
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

             {/* CARD 2: Helpdesk Tickets */}
             <motion.div 
               whileHover={{ y: -6 }}
               className="group bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white rounded-[32px] p-8 lg:p-10 shadow-xl shadow-zinc-100/40 hover:shadow-2xl hover:shadow-zinc-200/40 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
             >
                {/* Subtle hover glow matching the pricing hover card */}
                <div className="absolute top-1/2 -left-16 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -translate-y-1/2" />
                
                <div className="space-y-6">
                   <div className="w-12 h-12 bg-white/80 border border-white rounded-2xl flex items-center justify-center text-[#6366F1] shadow-md shadow-zinc-100/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shrink-0">
                      <Ticket size={22} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-zinc-800 tracking-tight leading-tight">
                        Helpdesk Tickets
                      </h3>
                      <p className="text-zinc-500 text-sm leading-relaxed font-normal">
                        Active customers can open a trackable technical ticket directly from their dashboard for high-priority engineering support.
                      </p>
                   </div>
                </div>

                <div className="pt-8 relative z-10">
                   <a 
                     href="/dashboard/support" 
                     className="w-full py-3.5 bg-[#6366F1] hover:bg-indigo-600 text-white font-bold rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/10 text-xs sm:text-sm hover:scale-[1.02]"
                   >
                     Go to Support Panel
                     <ArrowRight size={14} />
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
             className="group max-w-4xl mx-auto bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white rounded-[32px] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden mb-28 shadow-xl shadow-zinc-100/40 hover:shadow-2xl hover:shadow-zinc-200/40 transition-all duration-500"
          >
             {/* Green ambient backglow inside glass card */}
             <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-700" />
             
             <div className="w-12 h-12 bg-white/80 border border-white rounded-2xl flex items-center justify-center shrink-0 text-emerald-500 shadow-md shadow-zinc-100/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <ShieldCheck size={24} className="animate-pulse" />
             </div>
             
             <div className="text-center sm:text-left space-y-1 relative z-10">
                <h4 className="text-sm sm:text-base font-bold text-zinc-800">Official Meta API Architecture</h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-normal max-w-2xl">
                  Automixa communicates exclusively through secure developer tunnels vetted by Meta. We never request your Instagram password, nor do we store any credential databases. Your business page remains completely safe.
                </p>
             </div>
          </motion.div>

          {/* Interactive pre-sales FAQ Block */}
          <div className="border-t border-zinc-200/60 pt-16 max-w-4xl mx-auto">
             <div className="space-y-3 mb-10 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-800 tracking-tight leading-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-zinc-500 text-xs sm:text-sm font-medium">Quick answers to common inquiries before you reach out.</p>
             </div>

             <div className="space-y-4">
                {faqItems.map((item, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className={`group/faq bg-white/40 backdrop-blur-xl border rounded-[24px] overflow-hidden transition-all duration-500 shadow-sm ${
                        isOpen 
                          ? "border-indigo-200/80 bg-white/60 shadow-md shadow-zinc-100/50" 
                          : "border-white/60 hover:border-white/90 hover:bg-white/50"
                      }`}
                    >
                       <button
                         onClick={() => setActiveFaq(isOpen ? null : idx)}
                         className="w-full flex items-center justify-between p-6 sm:p-8 text-left focus:outline-none group/btn relative z-10 cursor-pointer"
                       >
                         <div className="flex items-center gap-4 pr-6">
                           <HelpCircle size={18} className={`shrink-0 transition-colors duration-300 ${isOpen ? "text-[#6366F1]" : "text-zinc-400 group-hover/faq:text-zinc-500"}`} />
                           <span className="text-sm sm:text-base font-bold text-zinc-800 tracking-tight transition-colors duration-300">
                             {item.q}
                           </span>
                         </div>

                         {/* Dynamic Circle Rotating Chevron */}
                         <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 shrink-0 ${
                           isOpen 
                             ? 'bg-[#6366F1] border-[#6366F1] text-white rotate-180 shadow-md shadow-indigo-500/20' 
                             : 'bg-white border-zinc-200/80 text-zinc-500 group-hover/btn:border-zinc-300'
                         }`}>
                           <ChevronDown size={14} className="transition-transform duration-500" />
                         </div>
                       </button>

                       <AnimatePresence initial={false}>
                         {isOpen && (
                           <motion.div
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: "auto", opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                           >
                             <div className="px-6 sm:px-8 pb-8 pt-1 text-zinc-500 text-xs sm:text-sm leading-relaxed font-normal border-t border-zinc-100/50">
                               <p className="max-w-2xl">
                                 {item.a}
                               </p>
                             </div>
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </motion.div>
                  );
                })}
             </div>
          </div>

        </div>
      </PageTransition>
    </main>
  );
}
