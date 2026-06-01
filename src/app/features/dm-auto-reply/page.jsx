"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { 
  ArrowRight, Zap, MessageCircle, Clock, ShieldCheck, Play, 
  CheckCircle2, Sparkles, Phone, Send, RotateCcw, AlertCircle
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function DMAutoReplyPage() {
  // Simulator State
  const [selectedFlow, setSelectedFlow] = useState("price"); // price, agent
  const [step, setStep] = useState("idle"); // idle, typing_user, user_sent, typing_bot, bot_replied
  const [messages, setMessages] = useState([]);

  const runSimulation = (flow) => {
    setSelectedFlow(flow);
    setStep("typing_user");
    setMessages([]);

    const userText = flow === "price" ? "price list" : "do you ship to India?";
    
    // Simulate user typing
    setTimeout(() => {
      setMessages([{ sender: "user", text: userText }]);
      setStep("typing_bot");

      // Simulate bot typing delay
      setTimeout(() => {
        if (flow === "price") {
          setMessages(prev => [
            ...prev,
            { 
              sender: "bot", 
              text: "Hey there! here is our full pricing details and list. We have 3 plans tailored to your needs.",
              card: {
                title: "Automixa Growth Plans",
                subtitle: "Unlock complete automation starting from ₹999/month.",
                price: "₹999/mo",
                link: "🔗 View Plans & Checkout"
              }
            }
          ]);
        } else {
          setMessages(prev => [
            ...prev,
            { 
              sender: "bot", 
              text: "Yes, we certainly do! 🇮🇳 We offer free shipping across India for orders above ₹1,499. Orders usually arrive in 3-5 business days.",
              card: {
                title: "Fast Shipping Details",
                subtitle: "Delivered via BlueDart & Delhivery. Tracker provided.",
                price: "Free Shipping Available",
                link: "🔗 Track Order Status"
              }
            }
          ]);
        }
        setStep("bot_replied");
      }, 1200);
    }, 800);
  };

  const resetSimulation = () => {
    setStep("idle");
    setMessages([]);
  };

  const benefits = [
    {
      title: "AI FAQ & Sales Agents",
      tagline: "24/7 Smart Conversations",
      description: "Train a custom AI Chat Agent on your business document, FAQ sheets, or website content. It automatically answers complex customer questions, provides product suggestions, and drives leads to close deals in the DM.",
      bullets: [
        "Train AI in 1-click on your raw text or website",
        "Fully understands intent and answers naturally",
        "Passes complex queries to your support inbox"
      ],
      icon: Sparkles,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Magic Write Copilot",
      tagline: "Instant Copywriting",
      description: "Stuck on what to reply in your automated responses? Use Magic Write to instantly write 3 variations of engaging copy with a specific tone (Friendly, Professional, or Urgent) to maximize clicks and sales.",
      bullets: [
        "Select and customize tone in 1-click",
        "Optimized for high-converting sales scripts",
        "Keeps replies fresh, dynamic, and engaging"
      ],
      icon: Zap,
      color: "text-orange-600 bg-orange-50 border-orange-100",
    },
    {
      title: "Chat to Build Rules",
      tagline: "Simple Prompting Setup",
      description: "Skip the complicated workflow chart builders. Simply describe the trigger word and the message card structure you want, and let our AI compile the logic for you instantly.",
      bullets: [
        "Zero workflow layout menus required",
        "Auto-sets keywords, media grids, and quick replies",
        "Official Meta API approved configuration"
      ],
      icon: MessageCircle,
      color: "text-yellow-600 bg-yellow-50 border-yellow-100",
    }
  ];

  const faqs = [
    {
      q: "How does the Instagram DM auto reply tool work?",
      a: "Automixa listens for incoming messages on your Instagram account via the official Meta Graph API. The moment a user sends a message containing your set keywords, our cloud engine triggers the pre-configured reply in under 2 seconds."
    },
    {
      q: "Can I use the AI FAQ Agent for multi-language replies?",
      a: "Yes! The AI agent automatically detects the language of the incoming message (Hindi, English, Spanish, etc.) and replies in the exact same language automatically."
    },
    {
      q: "Will Instagram shadowban my account for using DM automation?",
      a: "No. Automixa is built strictly on top of the official Meta Instagram API and is an approved partner. We do not use scrapers or ask for passwords, ensuring your account safety is 100% guaranteed."
    },
    {
      q: "Can I set up quick-reply buttons inside the DM?",
      a: "Absolutely! You can add up to 3 quick-reply buttons (like 'Buy Now', 'FAQs', 'Contact Support') that users can tap to instantly continue the conversation or redirect to a link."
    }
  ];

  return (
    <main className="min-h-screen text-foreground bg-[#FBFBFD] overflow-hidden relative font-sans pt-24 pb-6 selection:bg-amber-500/20">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-700 text-xs font-black uppercase tracking-widest border border-amber-500/20 shadow-sm">
                <Zap size={14} className="animate-pulse text-amber-500" />
                DM Auto-Reply
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                Never Miss a <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 font-bold">DM Lead Again.</span>
              </h1>
              
              <p className="text-zinc-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Convert direct messages into checkout orders automatically. Automixa triggers 2-second responses, handles customer support with AI FAQ agents, and captures emails/phones on autopilot. Save hours of manual copy-pasting with this powerful <strong className="text-zinc-900 font-semibold">Instagram automation tool</strong>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/login" 
                  className="px-8 py-4.5 bg-zinc-950 text-white font-bold rounded-full hover:bg-amber-600 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-amber-100 flex items-center justify-center gap-2 group text-sm"
                >
                  Start Auto-Replies Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#simulator" 
                  className="px-8 py-4.5 bg-white border border-zinc-200 text-zinc-800 font-bold rounded-full hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <Play size={18} className="text-amber-500 fill-amber-500" />
                  Try Live Simulator
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex items-center gap-6 border-t border-zinc-200/60 max-w-md">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 shrink-0">
                  <ShieldCheck className="text-amber-600" size={20} />
                </div>
                <div className="text-xs text-zinc-500 font-medium">
                  Official Meta Developer Partner. Shadowban-proof API calls. UPI-friendly Billing.
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
                    src="https://images.unsplash.com/photo-152202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" 
                    alt="Instagram DM automation tool" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  
                  {/* Floating Notification */}
                  <div className="absolute bottom-6 left-6 right-6 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-5 rounded-2xl shadow-xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center shrink-0">
                      <MessageCircle className="text-amber-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">AI Agent Active</h4>
                      <p className="text-[10px] text-zinc-400">Successfully answered shipment query in 1.4 seconds.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* INTERACTIVE DM SIMULATOR SECTION */}
          <div id="simulator" className="py-16 md:py-24 scroll-mt-20">
            <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
              <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">Interactive Playground</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                Try the DM auto-reply live simulator
              </h2>
              <p className="text-zinc-500 text-sm sm:text-base max-w-xl mx-auto">
                Test both direct keyword automation and our intelligent AI Sales assistant in this real-time simulator.
              </p>
            </div>

            {/* Simulator Container */}
            <div className="bg-white/60 border border-white rounded-[48px] p-6 md:p-12 shadow-xl shadow-zinc-200/50 backdrop-blur-xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Controls */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-bold rounded-full">
                    <Sparkles size={12} />
                    Select Automation Flow
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
                    Choose which simulation flow to test
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Select a trigger logic to see how Automixa handles incoming Direct Messages. You can trigger standard product prices or test our custom AI sales agent answering shipment questions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => runSimulation("price")}
                    disabled={step !== "idle"}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedFlow === "price" && step !== "idle"
                        ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/10"
                        : "bg-white border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <div className="font-bold text-zinc-800 text-sm">Flow 1: Keyword Trigger</div>
                    <div className="text-xs text-zinc-500 mt-1">User sends keyword &ldquo;price list&rdquo;</div>
                  </button>

                  <button
                    onClick={() => runSimulation("agent")}
                    disabled={step !== "idle"}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedFlow === "agent" && step !== "idle"
                        ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/10"
                        : "bg-white border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <div className="font-bold text-zinc-800 text-sm">Flow 2: AI Support Agent</div>
                    <div className="text-xs text-zinc-500 mt-1">User asks &ldquo;do you ship to India?&rdquo;</div>
                  </button>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => runSimulation(selectedFlow)}
                    disabled={step !== "idle"}
                    className="flex-1 px-6 py-4 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-600 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-100"
                  >
                    <Play size={16} />
                    Run Active Flow
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
                      <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold">
                        AM
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-800 flex items-center gap-0.5">
                          automixa_app ✓
                        </span>
                        <span className="text-[7px] text-emerald-600 font-bold">● Active 24/7 AI Bot</span>
                      </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-4 relative overflow-y-auto bg-zinc-50 flex flex-col gap-3">
                      
                      {step === "idle" && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                          <MessageCircle className="text-zinc-300" size={32} />
                          <p className="text-xs text-zinc-400 font-medium">Select a flow on the left and click &ldquo;Run Active Flow&rdquo;</p>
                        </div>
                      )}

                      {/* Chat Messages */}
                      {messages.map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
                        >
                          <div className={`p-3 rounded-2xl text-[10px] leading-relaxed font-medium ${
                            msg.sender === "user" 
                              ? "bg-zinc-900 text-white rounded-tr-none" 
                              : "bg-white border border-zinc-200/60 text-zinc-800 rounded-tl-none shadow-sm"
                          }`}>
                            {msg.text}
                          </div>
                          
                          {/* Bot Rich Card */}
                          {msg.card && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.2 }}
                              className="mt-2 bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-md max-w-full"
                            >
                              <div className="bg-amber-50 p-2.5 border-b border-zinc-100">
                                <div className="text-[9px] font-bold text-amber-900">{msg.card.title}</div>
                                <div className="text-[7px] text-amber-700 mt-0.5">{msg.card.subtitle}</div>
                              </div>
                              <div className="p-2.5 flex items-center justify-between gap-2">
                                <span className="text-[9px] font-bold text-zinc-800">{msg.card.price}</span>
                                <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{msg.card.link}</span>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}

                      {/* Bot typing simulation */}
                      {step === "typing_bot" && (
                        <div className="bg-white border border-zinc-200/50 px-3.5 py-2.5 rounded-2xl rounded-tl-none mr-auto shadow-sm flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      )}
                    </div>

                    {/* Bottom Status Info */}
                    {step === "bot_replied" && (
                      <div className="p-3 bg-zinc-50 border-t border-zinc-150 flex items-center gap-2">
                        <AlertCircle size={14} className="text-amber-500 shrink-0" />
                        <span className="text-[8px] text-zinc-500 font-semibold leading-normal">
                          Replied in 1.4s. AI FAQ Agent verified.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC BENTO DETAILS */}
          <div className="py-16 md:py-24 border-t border-zinc-200/60">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">Capabilities Details</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                Everything you need to automate your direct messages
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
                    className="bg-white border border-zinc-200/40 rounded-[36px] p-8 shadow-xl shadow-zinc-200/10 hover:shadow-2xl hover:shadow-amber-500/5 hover:border-amber-500/20 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${benefit.color}`}>
                        <Icon size={22} />
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">{benefit.tagline}</span>
                      <h3 className="text-xl font-bold text-zinc-900 leading-snug">{benefit.title}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">{benefit.description}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-zinc-100 space-y-3">
                      {benefit.bullets.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="flex items-start gap-2.5 text-xs text-zinc-700 font-medium">
                          <CheckCircle2 size={14} className="text-amber-500 mt-0.5 shrink-0" />
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
