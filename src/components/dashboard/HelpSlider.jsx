"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, Mail, MessageSquare, AlertTriangle, Trash2, FileText, CheckCircle2, ChevronRight, Clock, RefreshCw, ArrowLeft } from "lucide-react";

export default function HelpSlider({ isOpen, onClose }) {
  const [showDeletionForm, setShowDeletionForm] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReasonText, setOtherReasonText] = useState("");
  const [userFeedback, setUserFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ticket State
  const [activeTicket, setActiveTicket] = useState(null);

  if (typeof document === "undefined") return null;

  const reasons = [
    { id: "no_longer_using", label: "No longer using Instagram automation" },
    { id: "too_difficult", label: "Too difficult or confusing to set up" },
    { id: "missing_features", label: "Missing specific features I need" },
    { id: "pricing", label: "Pricing / Subscription cost issues" },
    { id: "privacy", label: "Privacy or data security concerns" },
    { id: "other", label: "Other reason" }
  ];

  const handleRaiseTicket = (e) => {
    e.preventDefault();
    if (!selectedReason) {
      alert("Please select a reason for account deletion.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newTicket = {
        id: "TKT-DEL-" + Math.floor(1000 + Math.random() * 9000),
        reason: selectedReason === "other" ? otherReasonText || "Other" : reasons.find(r => r.id === selectedReason)?.label,
        feedback: userFeedback,
        submittedAt: "Just now",
        status: "Pending Data Purge",
        estimatedCompletion: "24-48 Hours"
      };
      setActiveTicket(newTicket);
      setIsSubmitting(false);
      setShowDeletionForm(false);
    }, 1200);
  };

  const handleCancelTicket = () => {
    alert("Your account deletion ticket has been successfully cancelled. We are thrilled to keep you with us!");
    setActiveTicket(null);
    setSelectedReason("");
    setOtherReasonText("");
    setUserFeedback("");
  };

  const faqs = [
    { q: "How to connect Instagram Business account?", a: "Make sure your Instagram account is converted to a Professional/Business profile and linked to a Facebook Page." },
    { q: "Why is my auto-reply not working?", a: "Verify that 'Allow access to messages' is turned on in your Instagram App -> Settings -> Privacy -> Messages." },
    { q: "How does Follower Gate work?", a: "Automixa checks if the commenter follows you. If not, it prompts them to follow before delivering the link." }
  ];

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
            className="fixed inset-0 bg-zinc-950/30 backdrop-blur-sm" 
            onClick={onClose} 
          />

          {/* Slide-over Drawer */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col overflow-y-auto z-10 select-none"
          >
            
            {/* Header */}
            <div className="p-6 border-b border-zinc-200/60 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-sm shrink-0 ${
                  showDeletionForm || activeTicket ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20"
                }`}>
                  {showDeletionForm || activeTicket ? <AlertTriangle size={20} /> : <HelpCircle size={20} />}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">
                    {showDeletionForm ? "Raise Deletion Ticket" : activeTicket ? "Active Deletion Ticket" : "Help & Support"}
                  </h2>
                  <p className="text-xs text-zinc-500 font-normal">
                    {showDeletionForm ? "Submit your request" : activeTicket ? "Ticket Status" : "Quick answers and support"}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-zinc-500 hover:text-zinc-950 shadow-sm transition-all shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              
              {/* Default Help Screen */}
              {!showDeletionForm && !activeTicket && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* FAQ Section */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Frequently Asked Questions</h3>
                    <div className="space-y-3">
                      {faqs.map((faq, idx) => (
                        <div key={idx} className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-[20px] space-y-1.5 shadow-xs">
                          <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 flex items-center gap-1.5">
                            <FileText size={14} className="text-[#6366F1] shrink-0" /> {faq.q}
                          </h4>
                          <p className="text-xs text-zinc-600 pl-5 leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Support */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Get in Touch</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <a 
                        href="mailto:support@automixa.com"
                        className="p-4 bg-white border border-zinc-200 hover:border-[#6366F1] rounded-[20px] flex flex-col items-center justify-center text-center gap-2 shadow-sm transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-all">
                          <Mail size={18} />
                        </div>
                        <span className="text-xs font-semibold text-zinc-800">Email Support</span>
                      </a>

                      <button 
                        onClick={() => alert("Launching Live Chat... Our team is online!")}
                        className="p-4 bg-white border border-zinc-200 hover:border-[#6366F1] rounded-[20px] flex flex-col items-center justify-center text-center gap-2 shadow-sm transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-all">
                          <MessageSquare size={18} />
                        </div>
                        <span className="text-xs font-semibold text-zinc-800">Live Chat</span>
                      </button>
                    </div>
                  </div>

                  {/* Account Deletion System Banner */}
                  <div className="space-y-4 pt-4 border-t border-zinc-200/60">
                    <h3 className="text-xs font-semibold text-rose-500 uppercase tracking-wider pl-1 flex items-center gap-1">
                      <AlertTriangle size={14} /> Account Deletion System
                    </h3>

                    <div className="p-6 bg-rose-50/60 border border-rose-200/80 rounded-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-rose-950 tracking-tight">Raise Deletion Ticket</h4>
                        <p className="text-xs text-rose-700/90 mt-0.5 leading-relaxed max-w-xs">
                          Submit a formal ticket to permanently erase your account, webhooks, and captured data.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowDeletionForm(true)}
                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 hover:scale-105"
                      >
                        <Trash2 size={14} /> <span>Raise Ticket</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Ticket Creation Wizard Form */}
              {showDeletionForm && (
                <form onSubmit={handleRaiseTicket} className="space-y-6 animate-in fade-in duration-300 flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-rose-100 pb-4">
                      <div>
                        <h4 className="text-base font-semibold text-rose-950 tracking-tight">Account Deletion Request</h4>
                        <p className="text-xs text-zinc-500 mt-0.5">Please let us know why you are leaving so we can improve.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDeletionForm(false)}
                        className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-xs font-semibold text-zinc-600 transition-all flex items-center gap-1"
                      >
                        <ArrowLeft size={14} /> Back
                      </button>
                    </div>

                    {/* Reason Selection */}
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-zinc-700 block">Select Deletion Reason <span className="text-rose-500">*</span></label>
                      <div className="grid grid-cols-1 gap-2">
                        {reasons.map((r) => (
                          <label
                            key={r.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                              selectedReason === r.id ? "bg-rose-50 border-rose-300 text-rose-900 shadow-xs" : "bg-zinc-50/50 border-zinc-200/80 text-zinc-700 hover:bg-zinc-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="deletionReason"
                              value={r.id}
                              checked={selectedReason === r.id}
                              onChange={() => setSelectedReason(r.id)}
                              className="text-rose-600 focus:ring-rose-500"
                            />
                            <span>{r.label}</span>
                          </label>
                        ))}
                      </div>

                      {selectedReason === "other" && (
                        <input
                          type="text"
                          placeholder="Please specify your reason..."
                          value={otherReasonText}
                          onChange={(e) => setOtherReasonText(e.target.value)}
                          required
                          className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 outline-none focus:border-rose-400 mt-2"
                        />
                      )}
                    </div>

                    {/* Additional Feedback */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-700 block">How could we improve? (Optional)</label>
                      <textarea
                        rows={3}
                        value={userFeedback}
                        onChange={(e) => setUserFeedback(e.target.value)}
                        placeholder="Tell us what was missing or what you didn&apos;t like..."
                        className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 outline-none focus:border-rose-400 resize-none"
                      />
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 font-medium flex items-start gap-2.5">
                      <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>Submitting this ticket will notify our compliance team. All data will be purged within 24-48 hours.</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-zinc-200/60 flex items-center justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowDeletionForm(false)}
                      className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "Submitting Ticket..." : "Submit Ticket"}
                    </button>
                  </div>
                </form>
              )}

              {/* Active Ticket Display View */}
              {activeTicket && (
                <div className="space-y-6 animate-in fade-in duration-300 flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-rose-100 pb-4">
                      <div>
                        <span className="text-[10px] font-semibold text-rose-600 uppercase tracking-wider bg-rose-100 px-2.5 py-1 rounded-full">
                          Active Ticket
                        </span>
                        <h4 className="text-xl font-semibold text-rose-950 mt-2">{activeTicket.id}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                          <Clock size={12} className="animate-spin" /> {activeTicket.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 bg-rose-50/50 border border-rose-200/80 rounded-[28px] space-y-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">Selected Reason:</span>
                        <span className="font-semibold text-zinc-900 max-w-[220px] truncate">{activeTicket.reason}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">Estimated Purge Time:</span>
                        <span className="font-semibold text-zinc-900">{activeTicket.estimatedCompletion}</span>
                      </div>
                      {activeTicket.feedback && (
                        <div className="pt-3 border-t border-rose-100/60">
                          <span className="text-zinc-500 text-xs block mb-1">Feedback Provided:</span>
                          <p className="text-xs text-zinc-700 italic bg-white/80 p-3 rounded-xl border border-rose-100/50 leading-relaxed">
                            &ldquo;{activeTicket.feedback}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-200/60 flex items-center justify-between gap-3 mt-6">
                    <button
                      onClick={() => setActiveTicket(null)}
                      className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition-all flex items-center gap-1"
                    >
                      <ArrowLeft size={14} /> Back to Help
                    </button>
                    <button
                      onClick={handleCancelTicket}
                      className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw size={12} /> Cancel Deletion Ticket
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-zinc-200/60 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500 font-semibold shrink-0">
              <span>Automixa v2.5</span>
              <a href="https://automixa.com/privacy" target="_blank" rel="noreferrer" className="hover:underline">Privacy Policy</a>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
