"use client";

import { AnimatePresence,motion } from "framer-motion";
import { ArrowRight,Clock,Rocket,Save,ShieldCheck,X } from "lucide-react";
import { useEffect,useState } from "react";

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
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className="relative w-full max-w-xl bg-white border border-zinc-200/80 rounded-[24px] sm:rounded-[32px] shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 sm:px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 shrink-0">
               <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#6366F1] flex items-center justify-center shadow-sm border border-indigo-100">
                      <Rocket size={16} />
                    </div>
                    <span className="text-[13px] font-medium text-[#6366F1]">Step {step} of 2</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight mt-1">
                    {step === 1 ? "Configure Trigger" : "Design Response"}
                  </h2>
               </div>
               <button 
                 onClick={onClose}
                 className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-500 hover:text-zinc-900 transition-all shadow-sm cursor-pointer hover:bg-zinc-50"
               >
                 <X size={18} />
               </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto flex-1 min-h-0 no-scrollbar">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-7"
                  >
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-zinc-700">Trigger Type</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'COMMENT', label: 'Comment / Reel' },
                          { id: 'DM', label: 'Inbox DM' },
                          { id: 'STORY', label: 'Story Tag' }
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setType(t.id)}
                            className={`px-4 py-3 rounded-xl text-[14px] font-medium transition-all border ${
                              type === t.id ? 'bg-[#6366F1] text-white border-[#6366F1] shadow-md shadow-[#6366F1]/20' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-zinc-700">Target Keyword</label>
                      <input 
                        type="text" 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="e.g. ready"
                        className="w-full bg-white border border-zinc-200 rounded-xl p-3.5 text-base font-medium text-zinc-900 outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all shadow-sm placeholder:text-zinc-400"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-50/80 rounded-2xl border border-zinc-200/80 hover:border-zinc-300 transition-all">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 shadow-sm">
                          <ShieldCheck size={20} strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">Follower Gate</p>
                          <p className="text-[13px] text-zinc-500 font-medium">Only trigger for your followers</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setFollowerGate(!followerGate)}
                        className={`w-11 h-6 rounded-full transition-all relative shadow-inner ${followerGate ? 'bg-[#6366F1]' : 'bg-zinc-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${followerGate ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>

                    {type === "STORY" && (
                      <div className="flex items-center justify-between p-4 bg-zinc-50/80 rounded-2xl border border-zinc-200/80 hover:border-zinc-300 transition-all animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 shadow-sm">
                            <Clock size={20} strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-900">24-Hour Cooldown</p>
                            <p className="text-[13px] text-zinc-500 font-medium">Reply once per 24h per user</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setCooldownGate(!cooldownGate)}
                          className={`w-11 h-6 rounded-full transition-all relative shadow-inner ${cooldownGate ? 'bg-[#6366F1]' : 'bg-zinc-300'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${cooldownGate ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-7"
                  >
                    {type === 'COMMENT' && (
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-zinc-700">Public Reply</label>
                        <input 
                          type="text" 
                          value={publicReply}
                          onChange={(e) => setPublicReply(e.target.value)}
                          placeholder="Check your DMs! 🚀"
                          className="w-full bg-white border border-zinc-200 rounded-xl p-3.5 text-[15px] font-medium text-zinc-900 outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all shadow-sm placeholder:text-zinc-400"
                        />
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-zinc-700">DM Response Message</label>
                      <textarea 
                        rows={5}
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Type your message here..."
                        className="w-full bg-white border border-zinc-200 rounded-2xl p-4 text-[15px] font-medium text-zinc-900 outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all shadow-sm resize-none placeholder:text-zinc-400"
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                       <label className="text-sm font-medium text-zinc-700">Call to Action (Optional)</label>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            placeholder="Button Text"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            className="bg-white border border-zinc-200 rounded-xl p-3.5 text-[14px] font-medium outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all shadow-sm placeholder:text-zinc-400"
                          />
                          <input 
                            type="text" 
                            placeholder="Link URL"
                            value={buttonLink}
                            onChange={(e) => setButtonLink(e.target.value)}
                            className="bg-white border border-zinc-200 rounded-xl p-3.5 text-[14px] font-medium outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all shadow-sm placeholder:text-zinc-400"
                          />
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 py-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between shrink-0 rounded-b-[24px] sm:rounded-b-[32px]">
              <button 
                onClick={() => step === 1 ? onClose() : setStep(1)}
                className="px-5 py-2.5 text-[14px] font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50 rounded-xl transition-all cursor-pointer"
              >
                {step === 1 ? "Cancel" : "Back"}
              </button>
              
              <button 
                onClick={() => step === 1 ? setStep(2) : handleSave()}
                className="px-6 py-3 bg-[#6366F1] text-white rounded-xl text-[14px] font-medium shadow-md shadow-[#6366F1]/20 hover:shadow-lg hover:shadow-[#6366F1]/30 hover:bg-[#5356e3] hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              >
                {step === 1 ? "Continue" : "Save Automation"}
                {step === 1 ? <ArrowRight size={16} /> : <Save size={16} />}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
