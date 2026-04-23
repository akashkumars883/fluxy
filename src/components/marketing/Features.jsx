"use client";

import { motion } from "framer-motion";
import { Zap, MessageSquare, Target, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    id: "dm",
    title: "DM Automation Autopilot",
    tagline: "Always On, Always Selling",
    desc: "Scale your influence without the burnout. Reply to every incoming DM instantly based on keywords, ensuring no lead is ever left hanging. Whether it's a price inquiry or a collaboration request, your business never sleeps.",
    bullets: [
        "Keyword-based instant routing",
        "Personalized conversational flows",
        "Seamless human handover capability"
    ],
    image: "/images/features-dm.png",
    reverse: false,
    icon: <Zap className="text-amber-500" size={20} />
  },
  {
    id: "comments",
    title: "Comment-to-DM Engine",
    tagline: "Growth on Steroids",
    desc: "Turn public engagement into private conversion. Automate public replies and private DMs to users who comment specific keywords on your posts. Scale your leads while you build a vibrant community in the comments.",
    bullets: [
        "Post-specific keyword triggers",
        "Auto-reply to public comments",
        "Instant link delivery via DM"
    ],
    image: "/images/features-comments.png",
    reverse: true,
    icon: <MessageSquare className="text-indigo-500" size={20} />
  },
  {
    id: "stories",
    title: "Story Engagement AI",
    tagline: "Engage, React, Close",
    desc: "Stories are where the real connection happens. Automatically reply to story mentions or reactions. Trigger instant DMs when users reply to your story with a specific word, turning casual viewers into qualified leads.",
    bullets: [
        "Reaction-based message triggers",
        "Story mention auto-acknowledgment",
        "Automated CTA following story views"
    ],
    image: "/images/features-stories.png",
    reverse: false,
    icon: <Target className="text-emerald-500" size={20} />
  }
];

export default function Features() {
  return (
    <section id="features" className="py-40 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Header Section */}
        <div className="text-center mb-32 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-950 text-white text-[10px] font-bold uppercase tracking-widest mb-6"
          >
             Core Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-semibold text-foreground tracking-tight mb-8"
          >
            Built for the modern <br />
            <span className="text-zinc-400">creator economy.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 text-lg font-medium leading-relaxed"
          >
            Powerful automation features designed to convert every follower into a lead, without you ever lifting a finger.
          </motion.p>
        </div>

        {/* Feature Blocks */}
        <div className="space-y-40 md:space-y-64">
           {features.map((f, i) => (
             <div 
               key={f.id} 
               className={`flex flex-col ${f.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-32`}
             >
                {/* Text Content */}
                <motion.div 
                  initial={{ opacity: 0, x: f.reverse ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex-1 space-y-8"
                >
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white border border-border rounded-2xl flex items-center justify-center shadow-sm">
                         {f.icon}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">{f.tagline}</span>
                   </div>
                   
                   <h3 className="text-3xl md:text-5xl font-semibold text-foreground tracking-tight leading-tight">
                      {f.title}
                   </h3>
                   
                   <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                      {f.desc}
                   </p>

                   <div className="space-y-4 pt-4">
                      {f.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-zinc-600 font-medium text-base">
                           <CheckCircle2 size={20} className="text-zinc-950 shrink-0" />
                           {bullet}
                        </div>
                      ))}
                   </div>

                   <div className="pt-8">
                      <Link 
                        href="/login" 
                        className="inline-flex items-center gap-3 bg-zinc-950 text-white px-8 py-4 rounded-full font-bold text-sm hover:scale-[1.05] transition-all group"
                      >
                         Learn more
                         <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                   </div>
                </motion.div>

                {/* Image Mockup */}
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9, x: f.reverse ? -50 : 50 }}
                   whileInView={{ opacity: 1, scale: 1, x: 0 }}
                   viewport={{ once: true, margin: "-100px" }}
                   transition={{ duration: 0.8, ease: "easeOut" }}
                   className="flex-1 relative w-full lg:w-auto"
                >
                   <div className="relative z-10 rounded-xl overflow-hidden border border-border shadow-2xl shadow-zinc-950/10">
                      <img 
                        src={f.image} 
                        alt={f.title} 
                        className="w-full h-auto hover:scale-105 transition-transform duration-1000" 
                      />
                   </div>
                   {/* Decorative elements */}
                   <div className="absolute -inset-4 bg-gradient-to-tr from-zinc-100 to-transparent rounded-2xl -z-10" />
                </motion.div>
             </div>
           ))}
        </div>

      </div>
    </section>
  );
}
