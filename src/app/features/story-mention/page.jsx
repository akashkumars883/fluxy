"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, Target, Users, Play, 
  CheckCircle2, Clock, Sparkles, ShieldCheck
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function StoryMentionPage() {
  const benefits = [
    {
      title: "Handle Story Tag Responses",
      tagline: "Customer Message Workflows",
      description: "When customers tag your product in stories, Automixa can deliver configured discount codes, templates, or download links to their DM using a controlled workflow.",
      bullets: [
        "Automatically detects @mentions in public stories",
        "Deliver discount codes or checkout links instantly",
        "Keeps campaign response handling consistent"
      ],
      icon: Users,
      image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200&auto=format&fit=crop",
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Smart 24h Cooldown Limits",
      tagline: "Spam Prevention Logic",
      description: "Keep your communications friendly and natural. If a user tags you in multiple stories throughout the day, cooldown logic ensures they only receive the configured message once per period.",
      bullets: [
        "Configurable custom interval limits",
        "Protects account from sending redundant spam",
        "Prevents duplicate coupon deliveries"
      ],
      icon: Clock,
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1200&auto=format&fit=crop",
      color: "text-teal-600 bg-teal-500/10 border-teal-500/20",
    },
    {
      title: "Chat to Build Story Rules",
      tagline: "AI Triggers Setup",
      description: "Skip coding or menu configurations. Tell the AI what you want to reward when tagged. The AI constructs the story match listener, sets custom cooldowns, and designs your coupon DM cards instantly.",
      bullets: [
        "1-click AI prompt builder integration",
        "No complicated workflow charts to manage",
        "Tested & verified Meta API alignment"
      ],
      icon: Sparkles,
      image: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=1200&auto=format&fit=crop",
      color: "text-green-600 bg-green-500/10 border-green-500/20",
    }
  ];

  const faqs = [
    {
      q: "Does story mention automation work for private accounts?",
      a: "Due to Instagram's privacy policies, Meta's API does not allow third-party tools to detect story mentions from private accounts. Automixa only works when users with public profiles tag you."
    },
    {
      q: "How fast is the Story Mention DM sent?",
      a: "Once someone mentions you in their story, Meta notifies Automixa instantly. Our cloud servers process the webhook and reply to the user's inbox in under 3 seconds."
    },
    {
      q: "Can I customize the DM content for story tags?",
      a: "Yes! You can design a rich DM template containing custom text, emojis, image banners, and interactive buttons that redirect them to your landing page or checkout."
    },
    {
      q: "Do I need to leave my phone on to trigger replies?",
      a: "No. Automixa runs entirely on the cloud. Even if your phone is switched off or you are completely offline, our systems will detect mentions and reply automatically 24/7."
    }
  ];

  return (
    <main className="min-h-screen text-foreground bg-[#FBFBFD] overflow-hidden relative font-sans pt-32 pb-16 selection:bg-[#6366F1]/20">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#6366F1]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[#6366F1]/5 rounded-full blur-[120px] pointer-events-none" />

      <PageTransition>
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          
          {/* HERO SECTION */}
          <div className="flex flex-col lg:flex-row items-center gap-16 py-12 md:py-20 mb-8">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-1/2 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-xs font-black uppercase tracking-[0.3em] border border-[#6366F1]/20 shadow-sm">
                <Target size={14} className="animate-pulse" />
                Story Mention Automation
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                Reply to Story Tags <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 font-bold">With Helpful DMs.</span>
              </h1>
              
              <p className="text-zinc-500 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Automatically send a direct message with configured discount codes, guides, or thank-you notes when someone mentions your handle in an Instagram Story.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/login" 
                  className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group text-sm"
                >
                  Start Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="#features-list" 
                  className="px-8 py-4 bg-white border border-zinc-200 text-zinc-800 font-bold rounded-xl hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <Play size={18} className="text-[#6366F1] fill-[#6366F1]" />
                  Explore Features
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex items-center gap-6 border-t border-zinc-200/60 max-w-md">
                <div className="w-10 h-10 bg-[#6366F1]/10 rounded-xl flex items-center justify-center border border-[#6366F1]/20 shrink-0">
                  <ShieldCheck className="text-[#6366F1]" size={20} />
                </div>
                <div className="text-xs text-zinc-500 font-medium">
                  Built with Meta API integration and secure OAuth.
                </div>
              </div>
            </motion.div>
            
            {/* Right Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl border border-white bg-white/40 p-3 backdrop-blur-md">
                <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] bg-zinc-950 border border-zinc-800">
                  <img 
                    src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop" 
                    alt="Instagram Story Mention automation" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  
                  {/* Floating Action card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-5 rounded-2xl shadow-xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#6366F1]/20 border border-[#6366F1]/30 rounded-xl flex items-center justify-center shrink-0">
                      <Target className="text-indigo-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">Story Tag Detected</h4>
                      <p className="text-[10px] text-zinc-400">15% discount code sent through the configured workflow.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FEATURES LIST */}
          <div id="features-list" className="py-16 md:py-24 border-t border-zinc-200/60 scroll-mt-20">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] block">Core Capabilities</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight leading-[1.1]">
                Turn story mentions into <span className="text-sage font-normal">organized support workflows.</span>
              </h2>
              <p className="text-zinc-500 text-sm md:text-lg max-w-lg font-normal leading-relaxed">
                Discover story tag response capabilities for customer support, coupons, and resource delivery.
              </p>
            </div>

            <div className="space-y-24 md:space-y-32">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                const isEven = idx % 2 !== 0;
                
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex flex-col gap-12 lg:gap-16 items-center ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                  >
                    {/* Left: Text Details */}
                    <div className="w-full lg:w-1/2 space-y-5">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-2 border shadow-sm ${benefit.color}`}>
                        <Icon size={26} />
                      </div>
                      <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] block">{benefit.tagline}</p>
                      <h3 className="text-2xl sm:text-4xl font-bold text-foreground leading-tight tracking-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-zinc-500 text-base sm:text-lg leading-relaxed font-normal">
                        {benefit.description}
                      </p>
                      
                      <ul className="space-y-3 pt-3">
                        {benefit.bullets.map((bullet, bulletIdx) => (
                          <li key={bulletIdx} className="flex items-start gap-3 text-zinc-600 font-medium text-sm">
                            <CheckCircle2 size={18} className="text-[#6366F1] mt-0.5 shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Right: Glassmorphic Image Frame */}
                    <div className="w-full lg:w-1/2">
                      <div className="rounded-[40px] overflow-hidden bg-white/40 p-3 border border-white shadow-2xl relative group">
                        <div className="rounded-[32px] overflow-hidden aspect-[4/3] relative">
                          <img 
                            src={benefit.image} 
                            alt={benefit.title} 
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
        </div>
      </PageTransition>

      <FAQ customFaqs={faqs} />
      
      <div className="mt-16">
        <CTA />
      </div>
    </main>
  );
}
