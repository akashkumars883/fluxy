"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRight, MessageSquare, TrendingUp, Search, Star, Play, 
  CheckCircle2, Sparkles, Phone, Send, RotateCcw, AlertCircle, ShieldCheck
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function CommentAutoResponderPage() {
  // Simulator State
  const [step, setStep] = useState("idle"); // idle, typing, commented, dm_received
  const [commentText, setCommentText] = useState("");

  const runSimulation = () => {
    setStep("typing");
    setCommentText("");
    
    // Simulate typing comment
    let fullText = "send link";
    let currentText = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        currentText += fullText[i];
        setCommentText(currentText);
        i++;
      } else {
        clearInterval(interval);
        setStep("commented");
        
        // Simulate DM delay (1.2 seconds)
        setTimeout(() => {
          setStep("dm_received");
        }, 1200);
      }
    }, 150);
  };

  const resetSimulation = () => {
    setStep("idle");
    setCommentText("");
  };

  const benefits = [
    {
      title: "Chat to Build Rules",
      tagline: "AI Campaign Setup",
      description: "No tech skills? No problem. Simply describe your automation rules in plain English. Our AI reads your prompt and generates your keywords, replies, and DM cards instantly.",
      bullets: [
        "1-click AI-powered prompt builder",
        "Configures matching spelling typos automatically",
        "Set up standard greetings in under 30 seconds"
      ],
      icon: Sparkles,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      title: "Spam Guard & Reply Rotator",
      tagline: "100% Account Safety",
      description: "Instagram has strict limits on repetitive replies. Automixa lets you configure up to 5 unique reply variations (Spintax) and rotates them randomly, keeping your account 100% shadowban-proof.",
      bullets: [
        "Anti-spam reply rotation engine",
        "Human-like timing intervals",
        "Official Meta API Graph integration"
      ],
      icon: ShieldCheck,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      title: "Live Preview Playground",
      tagline: "Interactive Sandbox",
      description: "Never launch blind. Test your triggers, verify comment matches, and preview your cards in an interactive phone mockup inside your dashboard. Test everything with zero API credits spent.",
      bullets: [
        "100% free offline sandbox simulator",
        "Real-time mobile display rendering",
        "Instant logic validation before launch"
      ],
      icon: Play,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    }
  ];

  const faqs = [
    {
      q: "How does the Instagram comment auto responder help grow my account?",
      a: "By replying to comments automatically, you drastically boost your post engagement. Instagram's algorithm sees hundreds of comments and replies and pushes your Reels or posts to the Explore page, giving you massive organic reach."
    },
    {
      q: "Is Automixa safe for my Instagram account?",
      a: "Yes! Automixa is a 100% official Meta Developer Partner. We build strictly on top of the official Meta Graph API. Unlike unofficial scraper bots, we don't ask for your password, keeping your account safe from bans."
    },
    {
      q: "Can I set multiple keywords for the same post?",
      a: "Absolutely! You can trigger different direct messages based on the exact keyword. If someone comments 'REEL', they get a video course. If they comment 'EBOOK', they get a PDF download link."
    },
    {
      q: "Does this work on Instagram Stories and DMs too?",
      a: "Yes! While this page highlights our Instagram comment responder, Automixa also offers full DM Auto-Reply and Story Mention automation features. You can run all three simultaneously."
    }
  ];

  return (
    <main className="min-h-screen text-foreground bg-[#FBFBFD] overflow-hidden relative font-sans pt-24 pb-6 selection:bg-indigo-500/20">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-black uppercase tracking-widest border border-indigo-500/20 shadow-sm">
                <MessageSquare size={14} className="animate-pulse" />
                Comment Responder
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                Turn Comments into <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 font-bold">Sales 24/7.</span>
              </h1>
              
              <p className="text-zinc-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Stop losing customers to manual bio links. Reply to comments on your Reels and posts automatically, sending direct checkout links, discount codes, or files straight to their Instagram DM. Scale your sales with the best <strong className="text-zinc-900 font-semibold">Instagram automation tool</strong>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/login" 
                  className="px-8 py-4.5 bg-zinc-950 text-white font-bold rounded-full hover:bg-indigo-600 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group text-sm"
                >
                  Start Automating Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#simulator" 
                  className="px-8 py-4.5 bg-white border border-zinc-200 text-zinc-800 font-bold rounded-full hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <Play size={18} className="text-indigo-600 fill-indigo-600" />
                  Try Live Simulator
                </a>
              </div>

              {/* Trust/Social Indicators */}
              <div className="pt-6 flex items-center gap-6 border-t border-zinc-200/60 max-w-md">
                <div className="flex -space-x-2">
                  <span className="w-8 h-8 rounded-full bg-zinc-200 border-2 border-white flex items-center justify-center font-bold text-[10px]">A</span>
                  <span className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center font-bold text-[10px] text-indigo-600">B</span>
                  <span className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center font-bold text-[10px] text-emerald-600">C</span>
                </div>
                <div className="text-xs text-zinc-500 font-medium">
                  Trusted by <span className="text-zinc-950 font-bold">12,000+</span> creators & e-commerce brands worldwide.
                </div>
              </div>
            </motion.div>
            
            {/* Right Graphic: Premium Bento Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl border border-white bg-white/40 p-3 backdrop-blur-md">
                <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] bg-zinc-950 border border-zinc-800">
                  <img 
                    src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1200&auto=format&fit=crop" 
                    alt="Instagram automation tool in action" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  
                  {/* Floating Analytics Card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-5 rounded-2xl shadow-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                        <TrendingUp className="text-indigo-400" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">Engagement Boost</h4>
                        <p className="text-[10px] text-zinc-400">Automatic responses sent today</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400 font-display">+412%</div>
                      <div className="text-[9px] text-zinc-400 font-semibold">1,402 Comments</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* INTERACTIVE PHONE SIMULATOR SECTION */}
          <div id="simulator" className="py-16 md:py-24 scroll-mt-20">
            <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
              <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Interactive Playground</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                Try the Instagram comment auto reply live simulator
              </h2>
              <p className="text-zinc-500 text-sm sm:text-base max-w-xl mx-auto">
                Watch how comments are detected instantly by Automixa and trigger an instant direct message inside the inbox.
              </p>
            </div>

            {/* Simulator Grid */}
            <div className="bg-white/60 border border-white rounded-[48px] p-6 md:p-12 shadow-xl shadow-zinc-200/50 backdrop-blur-xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Simulator Controls */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-bold rounded-full">
                    <Sparkles size={12} />
                    Auto-Responder Simulation
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
                    Trigger automation with trigger keywords
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Set a keyword like <code className="bg-zinc-100 text-indigo-600 px-2 py-0.5 rounded font-bold">send link</code> or <code className="bg-zinc-100 text-indigo-600 px-2 py-0.5 rounded font-bold">ebook</code>. When followers type this keyword in your comments section, Automixa replies to them instantly and triggers a rich DM template.
                  </p>
                </div>

                <div className="bg-zinc-50/80 border border-zinc-200/60 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
                    <span>STEP DETECTOR</span>
                    <span className="uppercase text-indigo-600">{step}</span>
                  </div>
                  
                  {/* Status Steps */}
                  <div className="space-y-3">
                    <div className={`flex items-center gap-3 text-xs font-semibold ${step !== "idle" ? "text-indigo-600" : "text-zinc-400"}`}>
                      <CheckCircle2 size={16} className={step !== "idle" ? "text-indigo-500" : "text-zinc-300"} />
                      User types keyword &ldquo;send link&rdquo; in Reels comment.
                    </div>
                    <div className={`flex items-center gap-3 text-xs font-semibold ${step === "commented" || step === "dm_received" ? "text-indigo-600" : "text-zinc-400"}`}>
                      <CheckCircle2 size={16} className={step === "commented" || step === "dm_received" ? "text-indigo-500" : "text-zinc-300"} />
                      Automixa auto-likes & auto-replies to comment.
                    </div>
                    <div className={`flex items-center gap-3 text-xs font-semibold ${step === "dm_received" ? "text-indigo-600" : "text-zinc-400"}`}>
                      <CheckCircle2 size={16} className={step === "dm_received" ? "text-indigo-500" : "text-zinc-300"} />
                      Rich DM with download link delivered automatically.
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={runSimulation}
                    disabled={step !== "idle"}
                    className="flex-1 px-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-100"
                  >
                    <Play size={16} />
                    Run Simulation
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

              {/* iPhone Mockup Visual */}
              <div className="flex justify-center">
                <div className="relative w-[320px] h-[600px] bg-zinc-950 border-[10px] border-zinc-900 rounded-[50px] shadow-2xl overflow-hidden ring-4 ring-zinc-800">
                  {/* Dynamic Island Notch */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-zinc-900 rounded-full z-50 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-zinc-950 rounded-full ml-auto mr-4" />
                  </div>

                  {/* Simulator Screen Container */}
                  <div className="w-full h-full bg-white relative flex flex-col justify-between pt-8">
                    
                    {/* Header profile info */}
                    <div className="px-4 py-2 border-b border-zinc-100 flex items-center gap-2 bg-zinc-50">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[1.5px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[10px] font-bold">
                          AM
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-800 flex items-center gap-0.5">
                          automixa_app
                          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[6px]">✓</span>
                        </span>
                        <span className="text-[8px] text-zinc-400">Sponsored</span>
                      </div>
                    </div>

                    {/* Dynamic Screen Content */}
                    <div className="flex-1 p-4 relative overflow-y-auto bg-zinc-50 flex flex-col gap-3">
                      
                      {step === "idle" && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                          <MessageSquare className="text-zinc-300" size={32} />
                          <p className="text-xs text-zinc-400 font-medium">Click &ldquo;Run Simulation&rdquo; above to start comments automation demo</p>
                        </div>
                      )}

                      {/* Comment typing simulation screen */}
                      {(step === "typing" || step === "commented") && (
                        <div className="flex flex-col h-full justify-between">
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Comments Section</span>
                            <div className="bg-white p-3 rounded-xl shadow-sm border border-zinc-100 flex items-start gap-2.5">
                              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-[8px] text-indigo-600">
                                AM
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="text-[10px] font-bold text-zinc-800">automixa_app</div>
                                <p className="text-[10px] text-zinc-600">Want the secret links to increase your reach? Comment &ldquo;send link&rdquo; below!</p>
                              </div>
                            </div>

                            {/* User commenting */}
                            {commentText && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-zinc-100 p-2.5 rounded-xl self-end max-w-[85%] ml-auto flex items-start gap-2"
                              >
                                <div className="flex-1">
                                  <div className="text-[8px] font-bold text-zinc-700">your_account</div>
                                  <p className="text-[10px] text-zinc-800">{commentText}</p>
                                </div>
                                <div className="w-5 h-5 rounded-full bg-zinc-300 flex items-center justify-center text-[8px] font-bold text-zinc-600">
                                  ME
                                </div>
                              </motion.div>
                            )}

                            {/* Automixa Comment Auto-Reply */}
                            {step === "commented" && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-xl flex items-start gap-2"
                              >
                                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[7px] font-bold text-white shrink-0">
                                  AM
                                </div>
                                <div className="flex-1">
                                  <div className="text-[8px] font-bold text-indigo-900">automixa_app ✓</div>
                                  <p className="text-[10px] text-indigo-950">Sent it! Check your Direct Messages 📥</p>
                                </div>
                              </motion.div>
                            )}
                          </div>

                          <div className="h-[1px] bg-zinc-200 my-2" />
                          <div className="flex items-center gap-2 bg-white px-3 py-2 border border-zinc-200 rounded-full">
                            <span className="text-[10px] text-zinc-400 flex-1">{commentText || "Type comment..."}</span>
                            <Send size={12} className="text-indigo-600" />
                          </div>
                        </div>
                      )}

                      {/* DM received screen simulation */}
                      {step === "dm_received" && (
                        <div className="flex flex-col h-full justify-between">
                          <div className="space-y-4">
                            <div className="text-center">
                              <span className="text-[9px] font-semibold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">DIRECT MESSAGE</span>
                            </div>
                            
                            <motion.div 
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white border border-zinc-150 rounded-2xl overflow-hidden shadow-md max-w-[90%] mx-auto"
                            >
                              <div className="h-28 bg-indigo-50 flex items-center justify-center p-3 relative">
                                <MessageSquare className="text-indigo-400 absolute opacity-20" size={60} />
                                <div className="z-10 text-center space-y-1">
                                  <div className="text-xs font-bold text-indigo-900">Automixa E-Book</div>
                                  <p className="text-[8px] text-indigo-600">The #1 guide to Instagram growth automation in India.</p>
                                </div>
                              </div>
                              <div className="p-3.5 space-y-3">
                                <p className="text-[10px] text-zinc-700 leading-relaxed">
                                  Hey! Thanks for commenting. Here is the direct download link you requested. Click below:
                                </p>
                                <a 
                                  href="#"
                                  onClick={(e) => e.preventDefault()}
                                  className="block text-center py-2 bg-indigo-600 text-white font-bold text-[10px] rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                  📥 Download PDF Guide
                                </a>
                              </div>
                            </motion.div>
                          </div>

                          <div className="bg-zinc-100 p-2.5 rounded-xl border border-zinc-200/50 flex items-center gap-2">
                            <AlertCircle size={14} className="text-indigo-600 shrink-0" />
                            <span className="text-[8px] text-zinc-500 font-semibold leading-normal">
                              Automated instantly in 1.2s using Automixa Core Engine.
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

          {/* DYNAMIC BENTO CAPABILITIES LIST */}
          <div className="py-16 md:py-24 border-t border-zinc-200/60">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Capabilities Details</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                Everything you need to automate your comment funnel
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
                    className="bg-white border border-zinc-200/40 rounded-[36px] p-8 shadow-xl shadow-zinc-200/10 hover:shadow-2xl hover:shadow-indigo-500/5 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${benefit.color}`}>
                        <Icon size={22} />
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">{benefit.tagline}</span>
                      <h3 className="text-xl font-bold text-zinc-900 leading-snug">{benefit.title}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">{benefit.description}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-zinc-100 space-y-3">
                      {benefit.bullets.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="flex items-start gap-2.5 text-xs text-zinc-700 font-medium">
                          <CheckCircle2 size={14} className="text-indigo-500 mt-0.5 shrink-0" />
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
