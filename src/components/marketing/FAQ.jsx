"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ({ customFaqs = null }) {
  const defaultFaqs = [
    {
      q: "Is Automixa safe for my Instagram account?",
      a: "Yes, 100%. Automixa uses official Instagram and Meta APIs. We never ask for your password or use shadow-scrapers that could flag your account. Your account remains safe, secure, and compliant with Instagram guidelines."
    },
    {
      q: "Do I need an Instagram Business or Creator account?",
      a: "Yes. To connect through Instagram Business Login, your Instagram account needs to be a Creator or Business profile."
    },
    {
      q: "Can I automate replies to direct messages (DMs) too?",
      a: "Absolutely! Automixa handles both public comment replies and direct messages. You can set it to automatically send a DM containing a resource link, guide, or custom reply whenever someone comments on your reels or posts."
    },
    {
      q: "How does the 'Follower-Gate' check work?",
      a: "Follower-Gate is a powerful organic growth loop. When active, Automixa verifies if the commenter is following your Instagram account. If they are, it instantly delivers the resource. If not, it politely asks them to follow you first to unlock the reward!"
    },
    {
      q: "Can I try Automixa for free before upgrading?",
      a: "Yes! While we are in Beta, our Starter plan is completely free of charge. No credit card is required to sign up, and you can test all the essential automation features right away."
    }
  ];

  const displayFaqs = customFaqs || defaultFaqs;
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="faq" className="py-10 md:py-12 bg-transparent relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        
        {/* Header Title Block (Symmetrical with HowItWorks, Features and Pricing) */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] mb-3 block">
              Help Center
            </p>
            <h2 className="text-4xl md:text-6xl font-semibold text-foreground tracking-normal leading-[1.1]">
              Frequently asked <br />
              <span className="text-sage font-normal">questions.</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-base sm:text-lg max-w-sm font-normal leading-relaxed">
            Can&apos;t find what you are looking for? Reach out to our 24/7 team for direct assistance.
          </p>
        </div>

        {/* 5-Item Elegant White-Glass Accordion Column */}
        <div className="max-w-4xl mx-auto space-y-4">
          {displayFaqs.map((faq, i) => {
            const isOpen = activeIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`group/faq bg-white/40 backdrop-blur-xl border rounded-[24px] overflow-hidden transition-all duration-500 shadow-sm ${
                  isOpen 
                    ? "border-indigo-200/80 bg-white/60 shadow-md shadow-zinc-100/50" 
                    : "border-white/60 hover:border-white/90 hover:bg-white/50"
                }`}
              >
                {/* Accordion Toggle Header */}
                <button
                  onClick={() => setActiveIndex(isOpen ? null : i)}
                  className="w-full p-6 sm:p-8 flex items-center justify-between text-left focus:outline-none group/btn relative z-10"
                >
                  <div className="flex items-center gap-4 pr-6">
                    <HelpCircle size={18} className={`shrink-0 transition-colors duration-300 ${isOpen ? "text-[#6366F1]" : "text-zinc-400 group-hover/faq:text-zinc-500"}`} />
                    <span className="text-sm sm:text-base font-bold text-zinc-800 tracking-tight transition-colors duration-300">
                      {faq.q}
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

                {/* Animated Dropdown Answer */}
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
                          {faq.a}
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
    </section>
  );
}
