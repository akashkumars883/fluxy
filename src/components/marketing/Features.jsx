"use client";

import { motion } from "framer-motion";
import { Zap, MessageSquare, Target, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    id: "dm",
    title: "Instagram DM Auto-Reply",
    tagline: "Always On, Always Selling",
    desc: "Reply to every incoming direct message (DM) instantly without opening your phone. Give automatic answers to pricing questions, send download links, or register users for your webinars on autopilot. Keep your audience engaged 24/7.",
    bullets: [
      "Instant replies based on keywords",
      "Personalized, friendly answers",
      "Approved by Instagram (100% Safe)"
    ],
    image: "/images/features-dm.png",
    reverse: false,
    icon: <Zap className="text-amber-500 animate-pulse" size={20} />
  },
  {
    id: "comments",
    title: "Instagram Comment Auto-Reply",
    tagline: "Grow From Comments",
    desc: "Convert public comments on your Reels and posts into private sales. When someone comments a keyword like 'LINK' or 'INFO' on your post, Automixa automatically replies to their comment publicly AND sends them a direct message with your link instantly.",
    bullets: [
      "Auto-reply to public comments instantly",
      "Send direct messages with links automatically",
      "Works on specific posts, Reels, or all of them"
    ],
    image: "/images/features-comments.png",
    reverse: true,
    icon: <MessageSquare className="text-indigo-500" size={20} />
  },
  {
    id: "stories",
    title: "Instagram Story Auto-Reply",
    tagline: "Turn Views Into Customers",
    desc: "Turn story viewers into customers. Automatically send a direct message (DM) to anyone who mentions you in their story, or when they reply to your story with a keyword. It's the easiest way to build relationships and deliver links instantly.",
    bullets: [
      "Reply to Story Mentions instantly",
      "Deliver links when people reply to stories",
      "Official, compliant Meta API connection"
    ],
    image: "/images/features-stories.png",
    reverse: false,
    icon: <Target className="text-emerald-500" size={20} />
  }
];

export default function Features() {
  return (
    <section id="features" className="py-10 md:py-12 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-12 gap-6">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] mb-3 block">
              Core Capabilities
            </p>
            <h2 className="text-4xl md:text-6xl font-semibold text-foreground tracking-normal leading-[1.1]">
              Built for the modern <br />
              <span className="text-sage font-normal">creator economy.</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-base sm:text-lg max-w-sm font-normal leading-relaxed">
            Powerful automation features designed to convert every follower into a lead, without you ever lifting a finger.
          </p>
        </div>

        {/* Feature Cards Stack */}
        <div className="space-y-12 sm:space-y-16">
           {features.map((f, i) => (
             <motion.div 
               key={f.id} 
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
               className={`group bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white rounded-[32px] p-8 lg:p-12 shadow-xl shadow-zinc-100/40 hover:shadow-2xl hover:shadow-zinc-200/40 transition-all duration-500 flex flex-col ${f.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-16 w-full`}
             >
                {/* Text Content */}
                <div className="flex-1 space-y-6 sm:space-y-8 w-full">
                   <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-white/80 border border-white rounded-2xl flex items-center justify-center shadow-md shadow-zinc-100/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shrink-0">
                         {f.icon}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6366F1]">{f.tagline}</span>
                   </div>
                   
                   <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-800 tracking-tight leading-tight">
                      {f.title}
                   </h3>
                   
                   <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
                      {f.desc}
                   </p>

                   <div className="space-y-3 pt-2">
                      {f.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-zinc-600 font-medium text-xs sm:text-sm">
                           <CheckCircle2 size={16} className="text-[#6366F1] shrink-0" />
                           {bullet}
                        </div>
                      ))}
                   </div>

                   <div className="pt-4 sm:pt-6">
                      <Link 
                        href="/login" 
                        className="inline-flex items-center gap-3 bg-zinc-950 text-white pl-6 pr-5 py-3 rounded-full font-bold text-xs sm:text-sm hover:scale-[1.03] hover:bg-zinc-900 transition-all group shadow-sm"
                      >
                         Learn more
                         <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                   </div>
                </div>

                {/* Image Mockup */}
                <div className="flex-1 relative w-full lg:w-auto mt-6 lg:mt-0">
                   <div className="relative z-10 rounded-2xl overflow-hidden border border-white/80 shadow-xl shadow-zinc-200/50">
                      <img 
                        src={f.image} 
                        alt={f.title} 
                        className="w-full h-auto hover:scale-105 transition-transform duration-1000 object-cover" 
                      />
                   </div>
                   {/* Gradient glow behind mockup */}
                   <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/5 to-rose-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
             </motion.div>
           ))}
        </div>

      </div>
    </section>
  );
}
