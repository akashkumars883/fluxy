"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, BookOpen, ChevronRight, Clock, HelpCircle, Mail, MessageSquare, PlayCircle, RefreshCw, Send, Trash2, X, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useDashboard } from "@/context/DashboardContext";

export default function HelpSlider({ isOpen, onClose }) {
  // Navigation State
  const [activeView, setActiveView] = useState("home"); // home, docs, chat, email, delete
  
  // Dashboard Context
  const { currentPlan } = useDashboard();
  
  // -- Deletion State --
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReasonText, setOtherReasonText] = useState("");
  const [userFeedback, setUserFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);

  // -- Chat State --
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hi there! I am the Automixa Support Bot. How can we help you today?", sender: "agent", time: "Just now" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatScrollRef = useRef(null);

  // -- Email State --
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const reasons = [
    { id: "no_longer_using", label: "No longer using automation" },
    { id: "too_difficult", label: "Too difficult to set up" },
    { id: "missing_features", label: "Missing specific features" },
    { id: "pricing", label: "Pricing or cost issues" },
    { id: "privacy", label: "Privacy concerns" },
    { id: "other", label: "Other reason" }
  ];

  // Helpers
  const goBack = () => {
    setActiveView("home");
    // Reset ticket if they go back? No, keep it active in state.
  };

  // Priority Logic based on plans
  const getSupportTier = () => {
    if (currentPlan === "viral_scale") return { label: "VIP Priority", color: "bg-amber-100 text-amber-700 border-amber-200", eta: "under 15 mins", iconColor: "text-amber-500" };
    if (currentPlan === "creator_pro") return { label: "High Priority", color: "bg-purple-100 text-purple-700 border-purple-200", eta: "within 2 hours", iconColor: "text-purple-500" };
    return { label: "Standard Support", color: "bg-zinc-100 text-zinc-600 border-zinc-200", eta: "within 24 hours", iconColor: "text-zinc-500" };
  };
  const supportTier = getSupportTier();

  // Handlers
  const handleRaiseTicket = (e) => {
    e.preventDefault();
    if (!selectedReason) {
      alert("Please select a reason.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const newTicket = {
        id: "TKT-DEL-" + Math.floor(1000 + Math.random() * 9000),
        reason: selectedReason === "other" ? otherReasonText || "Other" : reasons.find(r => r.id === selectedReason)?.label,
        status: "Pending Purge",
        estimatedCompletion: "24-48 Hours"
      };
      setActiveTicket(newTicket);
      setIsSubmitting(false);
    }, 1200);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMsg = { id: Date.now(), text: chatInput, sender: "user", time: "Just now" };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput("");

    // Mock admin panel reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `Thanks for reaching out! You are on our ${currentPlan.replace('_', ' ')} plan. An agent will connect with you ${supportTier.eta}.`,
        sender: "agent",
        time: "Just now"
      }]);
    }, 1500);
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, activeView]);

  if (typeof document === "undefined") return null;

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!emailSubject || !emailBody) return;
    setEmailSending(true);
    setTimeout(() => {
      setEmailSending(false);
      setEmailSent(true);
      setTimeout(() => {
        setEmailSent(false);
        setEmailSubject("");
        setEmailBody("");
        goBack();
      }, 2000);
    }, 1500);
  };

  const getHeaderTitle = () => {
    if (activeView === 'docs') return "Documentation";
    if (activeView === 'chat') return "Live Chat";
    if (activeView === 'email') return "Email Support";
    if (activeView === 'delete') return "Account Deletion";
    if (activeTicket) return "Ticket Status";
    return "Help & Resources";
  };

  const getHeaderSubtitle = () => {
    if (activeView === 'docs') return "Browse our detailed guides";
    if (activeView === 'chat') return supportTier.label + " Agent Access";
    if (activeView === 'email') return "Create a support ticket";
    if (activeView === 'delete') return "Submit deletion request";
    if (activeTicket) return "Track your request";
    return "Get assistance with Automixa";
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm" 
            onClick={onClose} 
          />

          {/* Slide-over Drawer - NO SCROLLING */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col overflow-hidden z-10 select-none"
          >
            
            {/* Header */}
            <div className="px-6 py-5 sm:px-8 border-b border-zinc-200/60 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                {activeView !== 'home' ? (
                  <button onClick={goBack} className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-50 border border-zinc-200/80 text-zinc-500 hover:text-zinc-900 transition-all">
                    <ArrowLeft size={18} />
                  </button>
                ) : (
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${
                    activeView === 'delete' || activeTicket ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-zinc-50 text-zinc-900 border-zinc-200/80"
                  }`}>
                    {activeView === 'delete' || activeTicket ? <AlertTriangle size={18} /> : <HelpCircle size={18} />}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">
                    {getHeaderTitle()}
                  </h2>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5 flex items-center gap-1.5">
                    {getHeaderSubtitle()}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 shadow-sm transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col bg-zinc-50/30 overflow-hidden relative">
              
              {/* --- VIEW: HOME --- */}
              {activeView === 'home' && !activeTicket && (
                <div className="px-6 py-6 sm:px-8 flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-1 mb-8">
                    <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider pl-2 mb-3">Support Options</h3>
                    
                    <button onClick={() => setActiveView('docs')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 transition-all group border border-transparent hover:border-zinc-200/60">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[14px] bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <BookOpen size={18} />
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold text-zinc-900 text-sm">Documentation</h4>
                          <p className="text-xs text-zinc-500 mt-0.5">Read our step-by-step guides</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                    </button>

                    <button onClick={() => setActiveView('chat')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 transition-all group border border-transparent hover:border-zinc-200/60">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[14px] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <MessageSquare size={18} />
                        </div>
                        <div className="text-left flex items-center gap-2">
                          <div>
                            <h4 className="font-semibold text-zinc-900 text-sm">Live Chat</h4>
                            <p className="text-xs text-zinc-500 mt-0.5">Talk to our support team</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {currentPlan !== 'free' && (
                           <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${supportTier.color}`}>
                             {supportTier.label}
                           </span>
                        )}
                        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                      </div>
                    </button>

                    <button onClick={() => setActiveView('email')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 transition-all group border border-transparent hover:border-zinc-200/60">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[14px] bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Mail size={18} />
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold text-zinc-900 text-sm">Email Support</h4>
                          <p className="text-xs text-zinc-500 mt-0.5">Guaranteed {supportTier.eta} response</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                    </button>
                  </div>

                  <div className="mt-auto">
                    <div className="p-5 border border-rose-100 bg-rose-50/30 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-rose-950">Danger Zone</h4>
                        <p className="text-xs text-rose-700/70 mt-0.5">Permanently delete account</p>
                      </div>
                      <button
                        onClick={() => setActiveView('delete')}
                        className="px-4 py-2 bg-white text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 font-semibold text-xs rounded-xl transition-all shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- VIEW: DOCS --- */}
              {activeView === 'docs' && (
                <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar p-6 sm:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                     {[
                       { title: "Connecting Instagram Account", text: "Ensure your account is a Professional or Business account. Go to Settings > Privacy > Messages and enable 'Allow access to messages'." },
                       { title: "Setting up your first Trigger", text: "Go to Dashboard > Create Trigger. Select the trigger type (Keyword, Story Reply) and build your flow in the editor." },
                       { title: "How Follower Gate Works", text: "When enabled, Automixa checks if the user follows you before sending the payload. If they don't, it sends a fallback message asking them to follow." },
                       { title: "Managing Subscription", text: "You can upgrade or downgrade your plan at any time from the Billing Center. Pro-rated charges apply automatically." }
                     ].map((doc, idx) => (
                       <div key={idx} className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-2">
                         <h4 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                            <BookOpen size={14} className="text-indigo-500" />
                            {doc.title}
                         </h4>
                         <p className="text-xs text-zinc-600 leading-relaxed pl-5">{doc.text}</p>
                       </div>
                     ))}
                  </div>
                </div>
              )}

              {/* --- VIEW: CHAT --- */}
              {activeView === 'chat' && (
                <div className="flex-1 flex flex-col h-full bg-white animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="px-6 py-3 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                     <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${supportTier.color}`}>
                       {supportTier.label} SLA
                     </span>
                     <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Admin Online
                     </span>
                  </div>
                  
                  {/* Messages Area */}
                  <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm font-medium ${
                          msg.sender === 'user' 
                            ? 'bg-zinc-900 text-white rounded-tr-sm' 
                            : 'bg-zinc-100 text-zinc-900 rounded-tl-sm'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-semibold mt-1 px-1">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 sm:p-6 border-t border-zinc-100 bg-white">
                    <form onSubmit={handleSendChat} className="flex items-center gap-3 bg-zinc-50 p-2 rounded-2xl border border-zinc-200/80 focus-within:border-indigo-400 focus-within:ring-2 ring-indigo-100 transition-all">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type your message..." 
                        className="flex-1 bg-transparent px-3 text-sm font-medium outline-none"
                      />
                      <button type="submit" disabled={!chatInput.trim()} className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white flex items-center justify-center transition-all shadow-sm">
                        <Send size={16} />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* --- VIEW: EMAIL --- */}
              {activeView === 'email' && (
                <div className="flex-1 flex flex-col p-6 sm:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  {emailSent ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300">
                       <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-2">
                          <CheckCircle2 size={32} />
                       </div>
                       <h3 className="text-xl font-bold text-zinc-900">Email Sent!</h3>
                       <p className="text-sm text-zinc-500 max-w-xs">Our team will get back to you {supportTier.eta}. Check your inbox soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSendEmail} className="h-full flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl mb-2 flex items-center gap-3">
                           <Clock size={20} className="text-blue-500 shrink-0" />
                           <div>
                              <p className="text-xs font-semibold text-blue-900">Priority: {supportTier.label}</p>
                              <p className="text-[11px] text-blue-700/80">Expected reply: {supportTier.eta}</p>
                           </div>
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-xs font-semibold text-zinc-700 pl-1">Subject</label>
                           <input 
                             type="text"
                             value={emailSubject}
                             onChange={(e) => setEmailSubject(e.target.value)}
                             required
                             placeholder="What is this regarding?"
                             className="w-full p-3.5 bg-white border border-zinc-200/80 rounded-xl text-sm font-medium outline-none focus:border-blue-400 shadow-sm"
                           />
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-xs font-semibold text-zinc-700 pl-1">Message</label>
                           <textarea 
                             rows={6}
                             value={emailBody}
                             onChange={(e) => setEmailBody(e.target.value)}
                             required
                             placeholder="Please describe your issue in detail..."
                             className="w-full p-3.5 bg-white border border-zinc-200/80 rounded-xl text-sm font-medium outline-none focus:border-blue-400 shadow-sm resize-none"
                           />
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={emailSending}
                        className="mt-6 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex justify-center items-center gap-2"
                      >
                        {emailSending ? <RefreshCw size={16} className="animate-spin" /> : <Mail size={16} />}
                        {emailSending ? "Sending..." : "Send Email"}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* --- VIEW: DELETE --- */}
              {activeView === 'delete' && !activeTicket && (
                <form onSubmit={handleRaiseTicket} className="p-6 sm:p-8 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm">
                      <h4 className="text-sm font-semibold text-rose-950 mb-1">Why are you leaving?</h4>
                      <p className="text-xs text-rose-700/80 mb-5">Your feedback helps us improve.</p>
                      
                      <div className="space-y-4">
                        <select 
                          value={selectedReason} 
                          onChange={(e) => setSelectedReason(e.target.value)}
                          className="w-full p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl text-sm font-medium text-zinc-900 outline-none focus:border-rose-400 focus:bg-white transition-colors"
                          required
                        >
                          <option value="" disabled>Select a reason...</option>
                          {reasons.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                        </select>

                        {selectedReason === "other" && (
                          <input
                            type="text"
                            placeholder="Specify reason..."
                            value={otherReasonText}
                            onChange={(e) => setOtherReasonText(e.target.value)}
                            required
                            className="w-full p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl text-sm font-medium text-zinc-900 outline-none focus:border-rose-400 focus:bg-white transition-colors"
                          />
                        )}

                        <textarea
                          rows={3}
                          value={userFeedback}
                          onChange={(e) => setUserFeedback(e.target.value)}
                          placeholder="How could we improve? (Optional)"
                          className="w-full p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl text-sm font-medium text-zinc-900 outline-none focus:border-rose-400 focus:bg-white resize-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800 font-medium flex gap-3 shadow-sm">
                      <AlertTriangle size={18} className="text-amber-600 shrink-0" />
                      <span>All data, active campaigns, and webhooks will be permanently purged within 24-48 hours.</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-auto pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Ticket"}
                    </button>
                  </div>
                </form>
              )}

              {/* --- VIEW: ACTIVE TICKET --- */}
              {activeTicket && (
                <div className="p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300 h-full flex flex-col justify-center">
                  <div className="bg-white border border-rose-200 p-8 rounded-3xl shadow-xl shadow-rose-500/5 text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-rose-50 rounded-[24px] flex items-center justify-center text-rose-600 mb-2 border border-rose-100">
                      <Clock size={32} className="animate-pulse" />
                    </div>
                    
                    <div>
                      <span className="text-[10px] font-bold text-rose-500 tracking-wider uppercase bg-rose-50 px-3 py-1 rounded-full">Active Ticket</span>
                      <h3 className="text-2xl font-bold text-zinc-900 mt-4 tracking-tight">{activeTicket.id}</h3>
                      <p className="text-sm text-zinc-500 font-medium mt-1">Data purge in progress</p>
                    </div>

                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-left space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500 font-medium">Reason</span>
                        <span className="font-semibold text-zinc-900 max-w-[150px] truncate">{activeTicket.reason}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500 font-medium">ETA</span>
                        <span className="font-semibold text-amber-600">{activeTicket.estimatedCompletion}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mt-8">
                    <button
                      onClick={() => setActiveTicket(null)}
                      className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <RefreshCw size={16} /> Cancel Request
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-6 py-4 sm:px-8 border-t border-zinc-200/60 bg-white flex items-center justify-between text-[11px] text-zinc-400 font-semibold shrink-0">
              <span>Automixa Support</span>
              <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
