"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Gift, Link as LinkIcon, Play, Users } from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function CreatorsSolutionPage() {
  const benefits = [
    {
      title: "Deliver Digital Products Instantly",
      tagline: "Deliver Lead Magnets",
      description: "Send courses, e-books, templates, and digital download links directly to interested users when they comment. Turn customer questions into organized email subscribers.",
      bullets: [
        "Deliver Notion templates, PDF guides, and videos automatically",
        "Integrates with Gumroad, Stan Store, Stripe, and personal websites",
        "Build a clear opt-in flow for interested customers"
      ],
      icon: LinkIcon,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
      color: "text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20",
    },
    {
      title: "Access Condition Workflow",
      tagline: "Qualify Resource Delivery",
      description: "Choose when a configured resource should be delivered. Automixa can use supported account relationship signals and your own instructions to send the right next step.",
      bullets: [
        "Useful for member-only or campaign-specific resources",
        "Checks supported account signals through official APIs",
        "Keeps delivery instructions consistent"
      ],
      icon: Users,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Organize Campaign Responses",
      tagline: "Customer Response Workflows",
      description: "Handle repeated campaign questions with consistent replies, DM cards, and resource links while keeping your team focused on high-value conversations.",
      bullets: [
        "Supports Reels, carousel posts, and static images",
        "Keeps repeated campaign replies consistent",
        "Cleaner customer journeys without extra manual work"
      ],
      icon: Gift,
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop",
      color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    }
  ];

  const faqs = [
    {
      q: "How does Automixa help teams handle product inquiries?",
      a: "By turning repeated comment questions into a clear customer workflow. When someone comments a keyword, Automixa can send the correct product, course, or resource link and record the lead."
    },
    {
      q: "Can I collect email addresses in the DM?",
      a: "Yes! Our advanced flows allow you to ask the user for their email address right inside the Instagram DM before delivering the free guide or lead magnet."
    },
    {
      q: "Do I need a large audience to use this?",
      a: "No. Automixa works for accounts of all sizes. Small teams use access conditions, keyword replies, and CRM tracking to keep resource delivery consistent."
    },
    {
      q: "Is it difficult to set up?",
      a: "Not at all. We have pre-built templates for common business workflows. You can have your first automation running in less than 2 minutes."
    }
  ];

  return (
    <main className="min-h-screen text-foreground bg-[#FBFBFD] overflow-hidden relative font-sans pt-32 pb-16 selection:bg-[#6366F1]/20">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold uppercase tracking-widest border border-[#6366F1]/20">
                <Users size={14} />
                For Digital Product Teams
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                Deliver Your <span className="text-[#6366F1]">Resources</span> <br className="hidden sm:block" /> Automatically.
              </h1>
              <p className="text-zinc-600 text-base sm:text-lg leading-relaxed max-w-lg">
                Stop manually replying to &ldquo;Link in bio&rdquo; requests. Automatically deliver your courses, ebooks, and digital products directly into interested users&apos; DMs with a secure business messaging workflow.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login" className="px-8 py-4.5 bg-zinc-950 text-white font-bold rounded-full hover:bg-[#6366F1] hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group text-sm">
                Start Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#features-list" className="px-8 py-4.5 bg-white border border-zinc-200 text-zinc-800 font-bold rounded-full hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 text-sm shadow-sm">
                  <Play size={18} className="text-[#6366F1] fill-[#6366F1]" />
                  See How It Works
                </Link>
              </div>
              
              <div className="flex items-center gap-6 pt-6 border-t border-zinc-200/50 max-w-md">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
                  ))}
                </div>
                <div className="text-xs text-zinc-500 font-medium leading-tight">
                  <span className="font-bold text-zinc-800 text-sm block">3,000+ Teams</span>
                  using structured message workflows.
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
                    src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop" 
                    alt="Team managing Instagram messages" 
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-lg border border-white flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="text-emerald-500" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-sm">&ldquo;Send link&rdquo; Comment Received</h4>
                      <p className="text-xs text-zinc-500">Automixa sent the course link to DM in 0.5s</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* DYNAMIC ALTERNATING BENEFITS SECTION */}
          <div id="features-list" className="py-16 md:py-24 border-t border-zinc-200/60 scroll-mt-20">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-[#6366F1] font-bold uppercase tracking-widest text-xs">Resource Delivery Workflows</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                Turn repeated questions into trackable customer workflows
              </h2>
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
                    {/* Left content text */}
                    <div className="w-full lg:w-1/2 space-y-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 border shadow-sm ${benefit.color}`}>
                        <Icon size={26} />
                      </div>
                      <span className="text-[10px] font-bold text-[#6366F1] uppercase tracking-widest block">{benefit.tagline}</span>
                      <h3 className="text-2xl sm:text-4xl font-bold text-zinc-900 leading-tight tracking-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-zinc-500 text-base sm:text-lg leading-relaxed font-normal">
                        {benefit.description}
                      </p>
                      <ul className="space-y-3 pt-2">
                        {benefit.bullets.map((bullet, bulletIdx) => (
                          <li key={bulletIdx} className="flex items-start gap-3 text-zinc-700 font-medium text-sm">
                            <CheckCircle2 size={18} className="text-[#6366F1] mt-0.5 shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Right content image */}
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
      
      <CTA />
    </main>
  );
}
