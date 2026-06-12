"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @typedef {{ q: string, a: string }} FaqItem
 * @typedef {{ customFaqs?: FaqItem[] | null }} FAQProps
 */

/** @param {FAQProps} props */
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
      q: "How does the access condition check work?",
      a: "Access conditions let a business decide when a configured resource should be delivered. Automixa can check available account relationship signals through supported APIs and then send the appropriate message or instruction."
    },
    {
      q: "Can I try Automixa for free before upgrading?",
      a: "Yes! While we are in Beta, our Starter plan is completely free of charge. No credit card is required to sign up, and you can test all the essential automation features right away."
    }
  ];

  const displayFaqs = customFaqs || defaultFaqs;
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="faq" className="py-12 md:py-16 bg-transparent relative overflow-hidden">
      {/* Background Ambient Glows Removed */}

      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-10">

        {/* Header Title Block */}
        <div className="text-center md:text-left mb-10 md:mb-14 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/5 hover:bg-zinc-900/10 transition-colors border border-zinc-900/10 rounded-full text-[11px] uppercase tracking-widest font-semibold text-sage mb-6 font-mono">
            Help Center
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight leading-[1.1] mb-6">
              Frequently asked <span className="text-sage font-normal">questions.</span>
            </h2>
          <p className="text-zinc-500 text-sm md:text-lg max-w-xl font-normal leading-relaxed">
            Can&apos;t find what you are looking for? Reach out to our 24/7 team.
          </p>
        </div>

        {/* 5-Item Elegant Accordion */}
        <div className="w-full space-y-0">
          {displayFaqs.map((faq, i) => {
            const isOpen = activeIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`group/faq bg-transparent border-b rounded-none overflow-hidden transition-all duration-500 ${isOpen
                  ? "border-indigo-200/80"
                  : "border-zinc-100 hover:border-zinc-200"
                  }`}
              >
                {/* Accordion Toggle Header */}
                <button
                  onClick={() => setActiveIndex(isOpen ? null : i)}
                  className="w-full p-5 sm:p-7 flex items-center justify-between text-left focus:outline-none group/btn relative z-10"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <HelpCircle size={16} className={`shrink-0 transition-colors duration-300 ${isOpen ? "text-[#6366F1]" : "text-zinc-400"}`} />
                    <span className="text-xs sm:text-base font-bold text-zinc-800 tracking-tight transition-colors duration-300">
                      {faq.q}
                    </span>
                  </div>

                  {/* Dynamic Circle Rotating Chevron */}
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all duration-500 shrink-0 ${isOpen
                    ? 'bg-[#6366F1] border-[#6366F1] text-white rotate-180 shadow-md shadow-indigo-500/20'
                    : 'bg-transparent border-zinc-200/80 text-zinc-500'
                    }`}>
                    <ChevronDown size={12} className="transition-transform duration-500" />
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
                      <div className="px-5 sm:px-7 pb-5 sm:pb-7 pt-1 text-zinc-500 text-[11px] sm:text-sm leading-relaxed font-normal border-t border-zinc-100/50">
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
