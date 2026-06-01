"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { 
  ArrowRight, Target, Users, Heart, Share2, Play, 
  CheckCircle2, Clock, Sparkles, Phone, Send, RotateCcw, AlertCircle, ShieldCheck
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function StoryMentionPage() {
  // Simulator State
  const [step, setStep] = useState("idle"); // idle, posting_story, story_posted, dm_received
  const [discountClaimed, setDiscountClaimed] = useState(false);

  const runSimulation = () => {
    setStep("posting_story");
    setDiscountClaimed(false);
    
    // Simulate story posting animation
    setTimeout(() => {
      setStep("story_posted");
      
      // Simulate DM trigger delay (1.5 seconds)
      setTimeout(() => {
        setStep("dm_received");
      }, 1500);
    }, 1000);
  };

  const resetSimulation = () => {
    setStep("idle");
    setDiscountClaimed(false);
  };

  const benefits = [
    {
      title: "Boost Word-of-Mouth Sales",
      tagline: "Organic Viral Loops",
      description: "Encourage your customers to share their purchase or tag your product in their stories by offering automatic rewards. Deliver discount codes, exclusive templates, or download links straight to their DM the instant they tag you.",
      bullets: [
        "Automatically detects @mentions in public stories",
        "Deliver discount codes or checkout links instantly",
        "Increases organic user-generated content by up to 10x"
      ],
      icon: Users,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Smart 24h Cooldown Limits",
      tagline: "Spam Prevention Logic",
      description: "Keep your communications friendly and natural. If a follower tags you in multiple stories throughout the day, our smart cooldown logic ensures they only receive a single DM reward every 24 hours.",
      bullets: [
        "Configurable custom interval limits",
        "Protects account from sending redundant spam",
        "Prevents duplicate coupon deliveries"
      ],
      icon: Clock,
      color: "text-teal-600 bg-teal-50 border-teal-100",
    },
    {
      title: "Chat to Build Story Rules",
      tagline: "AI Triggers Setup",
      description: "Skipping coding or menu configurations. Tell the AI what you want to reward when tagged. The AI constructs the story match listener, sets custom cooldowns, and designs your coupon DM cards instantly.",
      bullets: [
        "1-click AI prompt builder integration",
        "No complicated workflow charts to manage",
        "Tested & verified Meta API alignment"
      ],
      icon: Sparkles,
      color: "text-green-600 bg-green-50 border-green-100",
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
    <main className="min-h-screen text-foreground bg-[#FBFBFD] overflow-hidden relative font-sans pt-24 pb-6 selection:bg-emerald-500/20">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      <PageTransition>
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          
          {/* HERO SECTION */}
          <div className="flex flex-col lg:flex-row items-center gap-16 py-12 md:py-20">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-1/2 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-black uppercase tracking-widest border border-emerald-500/20 shadow-sm">
                <Target size={14} className="animate-pulse text-emerald-500" />
                Story Mention Automation
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                Reward Followers for <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 font-bold">Tagging Your Brand.</span>
              </h1>
              
              <p className="text-zinc-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Amplify your organic reach on autopilot. Automatically send a direct message with discount codes, guides, or thank you cards the second someone mentions your handle in their Instagram Story. Grow your word-of-mouth with India&apos;s #1 <strong className="text-zinc-900 font-semibold">Instagram automation tool</strong>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/login" 
                  className="px-8 py-4.5 bg-zinc-950 text-white font-bold rounded-full hover:bg-emerald-600 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 group text-sm"
                >
                  Start Story Auto-Replies Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#simulator" 
                  className="px-8 py-4.5 bg-white border border-zinc-200 text-zinc-800 font-bold rounded-full hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <Play size={18} className="text-emerald-500 fill-emerald-500" />
                  Try Live Simulator
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex items-center gap-6 border-t border-zinc-200/60 max-w-md">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 shrink-0">
                  <ShieldCheck className="text-emerald-600" size={20} />
                </div>
                <div className="text-xs text-zinc-500 font-medium">
                  Approved Meta API Integration. Safe and compliant with Instagram Guidelines.
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
                    <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center shrink-0">
                      <Target className="text-emerald-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">Story Tag Detected</h4>
                      <p className="text-[10px] text-zinc-400">15% Discount Code sent to follower automatically.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* INTERACTIVE STORY MENTION SIMULATOR SECTION */}
          <div id="simulator" className="py-16 md:py-24 scroll-mt-20">
            <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
              <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Interactive Playground</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                Try the Story Tag auto-reply live simulator
              </h2>
              <p className="text-zinc-500 text-sm sm:text-base max-w-xl mx-auto">
                Watch how tagging a brand instantly triggers a DM coupon delivery, increasing organic shares.
              </p>
            </div>

            {/* Simulator Grid */}
            <div className="bg-white/60 border border-white rounded-[48px] p-6 md:p-12 shadow-xl shadow-zinc-200/50 backdrop-blur-xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Simulator Controls */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold rounded-full">
                    <Sparkles size={12} />
                    Story Tag Simulator
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
                    Simulate a follower tagging your page
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Tagging a business is a major endorsement. Automixa makes it viral: when a follower uploads a story tagging <code className="bg-zinc-100 text-emerald-600 px-2 py-0.5 rounded font-bold">@automixa_app</code>, they get an instant coupon code.
                  </p>
                </div>

                <div className="bg-zinc-50/80 border border-zinc-200/60 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
                    <span>STATUS DETECTOR</span>
                    <span className="uppercase text-emerald-600">{step}</span>
                  </div>
                  
                  {/* Status Steps */}
                  <div className="space-y-3">
                    <div className={`flex items-center gap-3 text-xs font-semibold ${step !== "idle" ? "text-emerald-600" : "text-zinc-400"}`}>
                      <CheckCircle2 size={16} className={step !== "idle" ? "text-emerald-500" : "text-zinc-300"} />
                      Follower posts an Instagram Story tagging your brand.
                    </div>
                    <div className={`flex items-center gap-3 text-xs font-semibold ${step === "story_posted" || step === "dm_received" ? "text-emerald-600" : "text-zinc-400"}`}>
                      <CheckCircle2 size={16} className={step === "story_posted" || step === "dm_received" ? "text-emerald-500" : "text-zinc-300"} />
                      Webhook registers mention and starts DM cooldown check.
                    </div>
                    <div className={`flex items-center gap-3 text-xs font-semibold ${step === "dm_received" ? "text-emerald-600" : "text-zinc-400"}`}>
                      <CheckCircle2 size={16} className={step === "dm_received" ? "text-emerald-500" : "text-zinc-300"} />
                      Discount coupon code auto-delivered inside Instagram DMs.
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={runSimulation}
                    disabled={step !== "idle"}
                    className="flex-1 px-6 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-100"
                  >
                    <Play size={16} />
                    Start Story Tag Demo
                  </button>
                  <button
                    onClick={resetSimulation}
                    className="px-6 py-4 bg-white border border-zinc-200 text-zinc-600 font-bold rounded-2xl hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>
              </div>

              {/* iPhone Mockup */}
              <div className="flex justify-center">
                <div className="relative w-[320px] h-[600px] bg-zinc-950 border-[10px] border-zinc-900 rounded-[50px] shadow-2xl ring-4 ring-zinc-800 overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-zinc-900 rounded-full z-50 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-zinc-950 rounded-full ml-auto mr-4" />
                  </div>

                  {/* Simulator Screen */}
                  <div className="w-full h-full bg-white relative flex flex-col justify-between pt-8">
                    
                    {/* Header */}
                    <div className="px-4 py-2 border-b border-zinc-100 flex items-center gap-2 bg-zinc-50">
                      <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                        AM
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-800 flex items-center gap-0.5">
                          automixa_app ✓
                        </span>
                        <span className="text-[7px] text-zinc-400">Story Trigger Engine</span>
                      </div>
                    </div>

                    {/* Chat Area / Screen Content */}
                    <div className="flex-1 p-4 relative overflow-y-auto bg-zinc-50 flex flex-col gap-3">
                      
                      {step === "idle" && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                          <Share2 className="text-zinc-300" size={32} />
                          <p className="text-xs text-zinc-400 font-medium">Click &ldquo;Start Story Tag Demo&rdquo; to simulate organic word-of-mouth loops</p>
                        </div>
                      )}

                      {step === "posting_story" && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs text-zinc-500">Follower is posting Story and adding tag sticker...</p>
                        </div>
                      )}

                      {step === "story_posted" && (
                        <div className="flex flex-col h-full justify-between pb-4">
                          <div className="space-y-3">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Follower&apos;s Active Story</span>
                            
                            <div className="relative rounded-2xl overflow-hidden aspect-[9/16] h-[340px] border border-zinc-200 shadow-md">
                              <img 
                                src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=600&auto=format&fit=crop" 
                                alt="User Story mock background" 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/25" />
                              
                              {/* Story Sticker Tag */}
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-white font-bold text-[10px] text-emerald-700 shadow-lg flex items-center gap-1"
                              >
                                🏷️ @automixa_app
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* DM received screen simulation */}
                      {step === "dm_received" && (
                        <div className="flex flex-col h-full justify-between">
                          <div className="space-y-4">
                            <div className="text-center">
                              <span className="text-[9px] font-semibold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">INBOX REWARDED</span>
                            </div>
                            
                            <motion.div 
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white border border-zinc-150 rounded-2xl overflow-hidden shadow-md max-w-[90%] mx-auto"
                            >
                              <div className="bg-emerald-50 p-4 border-b border-zinc-100 flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <div className="text-[10px] font-bold text-emerald-900">Story Reward Triggered!</div>
                                  <div className="text-[8px] text-emerald-700">Thank you for sharing automixa!</div>
                                </div>
                                <span className="text-xl">🎁</span>
                              </div>
                              <div className="p-3.5 space-y-3">
                                <p className="text-[10px] text-zinc-700 leading-relaxed">
                                  Hey! We saw you tagged us in your story. You are awesome! Here is your exclusive 15% discount code:
                                </p>
                                <div className="text-center py-2.5 bg-zinc-50 border border-zinc-200 border-dashed rounded-lg font-mono text-xs font-bold text-zinc-800">
                                  {discountClaimed ? "✓ CODE COPIED: GROW15" : "GROW15"}
                                </div>
                                <button 
                                  onClick={() => setDiscountClaimed(true)}
                                  className="w-full text-center py-2 bg-emerald-600 text-white font-bold text-[10px] rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                  {discountClaimed ? "✓ Claimed Successfully" : "Copy Discount Code"}
                                </button>
                              </div>
                            </motion.div>
                          </div>

                          <div className="bg-zinc-100 p-2.5 rounded-xl border border-zinc-200/50 flex items-center gap-2">
                            <AlertCircle size={14} className="text-emerald-600 shrink-0" />
                            <span className="text-[8px] text-zinc-500 font-semibold leading-normal">
                              Story webhook verified and DM triggered in 2.1 seconds.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC DETAILS BENTO */}
          <div className="py-16 md:py-24 border-t border-zinc-200/60">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Capabilities Details</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                Everything you need to automate your story mentions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="bg-white border border-zinc-200/40 rounded-[36px] p-8 shadow-xl shadow-zinc-200/10 hover:shadow-2xl hover:shadow-emerald-500/5 hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${benefit.color}`}>
                        <Icon size={22} />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">{benefit.tagline}</span>
                      <h3 className="text-xl font-bold text-zinc-900 leading-snug">{benefit.title}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">{benefit.description}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-zinc-100 space-y-3">
                      {benefit.bullets.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="flex items-start gap-2.5 text-xs text-zinc-700 font-medium">
                          <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                          <span>{bullet}</span>
                        </div>
                      ))}
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
