"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const faqs = [
    {
      q: "Is Automixa safe for my Instagram account?",
      a: "Yes. Automixa is built using Meta's Official Graph API. We do not use password-sharing or scraping methods that can get your account flagged. Your account remains 100% compliant with Instagram's policies."
    },
    {
      q: "Do I need a Business or Creator account?",
      a: "Yes, to use Meta's messaging API, your account must be a Business or Creator account and connected to a Facebook Page."
    },
    {
      q: "Can I automate replies to all comments?",
      a: "You can set up rules to reply to all comments or only those containing specific keywords. Automixa gives you full control over when to trigger a message."
    },
    {
      q: "How does the 'Follower-Gate' work?",
      a: "The Follower-Gate is a feature where the automation only sends the final reward (like a link or file) if the user is following you. It's a great way to grow your fan base organically."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="py-32 px-6 bg-transparent">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em] mb-4 block">Help Center</span>
          <h2 className="text-4xl font-semibold text-foreground tracking-normal">Common Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden transition-all hover:border-zinc-400">
              <button 
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                className="w-full p-8 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="text-lg font-bold text-foreground pr-8">{f.q}</span>
                <div className={`p-2 rounded-full transition-colors ${activeIndex === i ? 'bg-foreground text-background' : 'bg-zinc-100 text-zinc-500'}`}>
                  {activeIndex === i ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-8 text-zinc-500 text-base leading-relaxed font-normal">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
