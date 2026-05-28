"use client";

import { useState, useEffect } from "react";
import { X, MousePointer2, ShieldCheck, Globe, Save, Sparkles, Wand2, Rocket, ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditTriggerModal({ trigger, isOpen, onClose, onSave }) {
  const [keyword, setKeyword] = useState("");
  const [response, setResponse] = useState("");
  const [type, setType] = useState("DM");
  const [followerGate, setFollowerGate] = useState(false);
  const [cooldownGate, setCooldownGate] = useState(false);
  const [publicReply, setPublicReply] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (trigger && isOpen) {
      const t = setTimeout(() => {
        setKeyword(trigger.keyword || "");
        setResponse(trigger.response || "");
        let initialType = trigger.type || "DM";
        if (initialType.startsWith("STORY")) {
          initialType = "STORY";
        }
        setType(initialType);
        setFollowerGate(trigger.metadata?.follower_gate || false);
        setCooldownGate(trigger.metadata?.cooldown_gate || false);
        setPublicReply(trigger.variants?.public?.[0] || "");
        setButtonText(trigger.metadata?.button_text || "");
        setButtonLink(trigger.metadata?.button_link || "");
        setCampaignName(trigger.metadata?.campaign_name || "");
        setStep(1);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [trigger, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    let finalType = type;
    if (type === "STORY" && trigger && trigger.type && trigger.type.startsWith("STORY")) {
      finalType = trigger.type;
    }
    onSave(trigger.id, {
      keyword,
      response,
      type: finalType,
      metadata: {
        follower_gate: followerGate,
        cooldown_gate: cooldownGate,
        button_text: buttonLink ? (buttonText || "Get Access") : null,
        button_link: buttonLink,
        campaign_name: campaignName || null
      },
      variants: {
        dm: [response],
        public: publicReply ? [publicReply] : []
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xl" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white border border-zinc-200/60 rounded-[28px] sm:rounded-[40px] shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30 shrink-0">
               <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#6366F1] text-white flex items-center justify-center shadow-lg shadow-[#6366F1]/20">
                      <Rocket size={16} />
                    </div>
                    <span className="text-[10px] font-semibold text-[#6366F1]">Step {step} of 2</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tighter mt-2">
                    {step === 1 ? "Configure Trigger" : "Design Response"}
                  </h2>
               </div>
               <button 
                 onClick={onClose}
                 className="p-3 bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:text-zinc-950 transition-all shadow-sm cursor-pointer"
               >
                 <X size={20} />
               </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto flex-1 min-h-0 no-scrollbar">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <label className="text-[10px] font-semibold text-zinc-400 ml-1">Trigger Type</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'COMMENT', label: 'Comment on Post / Reel' },
                          { id: 'DM', label: 'Inbox DM (Direct Message)' },
                          { id: 'STORY', label: 'Story Tag / Mention' }
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setType(t.id)}
                            className={`px-4 py-3 rounded-2xl text-[10px] font-semibold tracking-tight transition-all border ${
                              type === t.id ? 'bg-zinc-950 text-white border-zinc-950 shadow-lg' : 'bg-zinc-50 text-zinc-500 border-zinc-100 hover:border-zinc-200'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-semibold text-zinc-400 ml-1">Target Keyword</label>
                      <input 
                        type="text" 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value.toUpperCase())}
                        placeholder="e.g. READY"
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-lg font-bold text-zinc-950 outline-none focus:border-[#6366F1] focus:bg-white transition-all shadow-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-3xl border border-zinc-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 shadow-sm">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-950">Follower Gate</p>
                          <p className="text-[10px] text-zinc-500 font-normal lowercase">only trigger for followers</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setFollowerGate(!followerGate)}
                        className={`w-12 h-6 rounded-full transition-all relative ${followerGate ? 'bg-[#6366F1]' : 'bg-zinc-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${followerGate ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    {type === "STORY" && (
                      <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-3xl border border-zinc-100 mt-3 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 shadow-sm">
                            <Clock size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-950">24-Hour Cooldown</p>
                            <p className="text-[10px] text-zinc-500 font-normal lowercase">only reply once every 24h per user</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setCooldownGate(!cooldownGate)}
                          className={`w-12 h-6 rounded-full transition-all relative ${cooldownGate ? 'bg-[#6366F1]' : 'bg-zinc-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${cooldownGate ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {type === 'COMMENT' && (
                      <div className="space-y-3">
                        <label className="text-[10px] font-semibold text-zinc-400 ml-1">Public Reply</label>
                        <input 
                          type="text" 
                          value={publicReply}
                          onChange={(e) => setPublicReply(e.target.value)}
                          placeholder="Check your DMs! 🚀"
                          className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-normal text-zinc-500 outline-none focus:border-[#6366F1] focus:bg-white transition-all shadow-sm"
                        />
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="text-[10px] font-semibold text-zinc-400 ml-1">DM Response Message</label>
                      <textarea 
                        rows={4}
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Type your message here..."
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-3xl p-5 text-sm font-normal text-zinc-500 outline-none focus:border-[#6366F1] focus:bg-white transition-all shadow-sm no-scrollbar resize-none"
                      />
                    </div>

                    <div className="space-y-4 pt-2">
                       <label className="text-[10px] font-semibold text-zinc-400 ml-1">Call to Action (Optional)</label>
                       <div className="grid grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            placeholder="Button Text"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-[10px] font-semibold outline-none focus:bg-white transition-all"
                          />
                          <input 
                            type="text" 
                            placeholder="Link URL"
                            value={buttonLink}
                            onChange={(e) => setButtonLink(e.target.value)}
                            className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-[10px] font-semibold outline-none focus:bg-white transition-all lowercase"
                          />
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between shrink-0">
              <button 
                onClick={() => step === 1 ? onClose() : setStep(1)}
                className="px-6 py-3 text-[10px] font-semibold text-zinc-400 hover:text-zinc-600 transition-all cursor-pointer"
              >
                {step === 1 ? "Cancel" : "Back"}
              </button>
              
              <button 
                onClick={() => step === 1 ? setStep(2) : handleSave()}
                className="px-12 py-4 bg-zinc-950 text-white rounded-xl text-[12px] font-semibold shadow-2xl hover:bg-[#6366F1] transition-all flex items-center gap-2 cursor-pointer"
              >
                {step === 1 ? "Continue" : "Save Automation"}
                {step === 1 ? <ArrowRight size={14} /> : <Save size={14} />}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
