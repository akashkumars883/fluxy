"use client";

import { AnimatePresence, motion } from "framer-motion";
import { 
  Link as LinkIcon, MessageSquare, Rocket, Save, ShieldCheck, Sparkles, Trash2, X 
} from "lucide-react";
import { useEffect, useState } from "react";

export default function EditTriggerModal({ 
  trigger, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  currentPlan = "free", 
  onUpgradeClick 
}) {
  const [keyword, setKeyword] = useState("");
  const [response, setResponse] = useState("");
  const [type, setType] = useState("DM");
  const [followerGate, setFollowerGate] = useState(false);
  const [followGateMessage, setFollowGateMessage] = useState("");
  const [introTitle, setIntroTitle] = useState("");
  const [introButtonText, setIntroButtonText] = useState("");
  const [publicReply, setPublicReply] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [campaignName, setCampaignName] = useState("");

  useEffect(() => {
    if (trigger && isOpen) {
      const t = setTimeout(() => {
        setKeyword((trigger.keyword || "").toUpperCase());
        setResponse(trigger.response || "");
        let initialType = trigger.type || "DM";
        if (initialType.startsWith("STORY")) {
          initialType = "STORY";
        }
        setType(initialType);
        setFollowerGate(trigger.metadata?.follower_gate || false);
        setFollowGateMessage(trigger.metadata?.follow_gate_message || "One final step to unlock! 🎁");
        setIntroTitle(trigger.metadata?.intro_title || "Hey {name}! 👋 Thanks for the comment! Tap the button below and I'll send you the access right away. ⚡");
        setIntroButtonText(trigger.metadata?.intro_button_text || "Send me the access");
        setPublicReply(trigger.variants?.public?.[0] || "");
        setButtonText(trigger.metadata?.button_text || "");
        setButtonLink(trigger.metadata?.button_link || "");
        setCampaignName(trigger.metadata?.campaign_name || "");
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
      keyword: keyword.trim().toUpperCase(),
      response,
      type: finalType,
      metadata: {
        follower_gate: followerGate,
        follow_gate_message: followerGate ? followGateMessage : "",
        intro_title: type === 'COMMENT' ? introTitle : null,
        intro_button_text: type === 'COMMENT' ? introButtonText : null,
        button_text: buttonLink ? (buttonText || "Get Access") : null,
        button_link: buttonLink,
        campaign_name: campaignName || null,
        is_draft: trigger.metadata?.is_draft || false,
        is_active: trigger.metadata?.is_active !== false,
      },
      variants: {
        dm: [response],
        public: publicReply ? [publicReply] : []
      }
    });
  };

  const handleDelete = () => {
    if (onDelete && trigger) {
      if (confirm(`Are you sure you want to delete this auto-reply rule (${keyword || "Untitled"})? This action cannot be undone.`)) {
        onDelete(trigger.id);
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/60 " 
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white border border-zinc-200/80 rounded-md flex flex-col max-h-[85vh] overflow-y-auto no-scrollbar pointer-events-auto"
          >
            {/* Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-zinc-150 flex items-center justify-between bg-zinc-50/50 shrink-0">
               <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-indigo-50 text-[#6366F1] flex items-center justify-center  border border-indigo-100">
                      <Rocket size={16} />
                    </div>
                    <span className="text-[13px] font-bold text-[#6366F1] tracking-tight">Edit Automation Rule</span>
                  </div>
                  <h2 className="text-lg font-bold text-black tracking-tight mt-0.5">
                    Customize your Keyword Trigger
                  </h2>
               </div>
               <button 
                 onClick={onClose}
                 className="p-2 bg-white border border-zinc-200 rounded-md text-zinc-550 hover:text-black transition-all  cursor-pointer hover:bg-zinc-50"
               >
                 <X size={16} />
               </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-5 sm:p-6 space-y-5">
              
              {/* SECTION 1: TRIGGER SETUP */}
              <div className="bg-zinc-50/40 border border-zinc-200/80 rounded-md p-4 sm:p-5 space-y-4 hover:border-zinc-300 transition-all">
                <h3 className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 pb-2.5">
                  <Sparkles size={14} className="text-[#6366F1]" /> 1. Trigger Setup
                </h3>
                
                {/* Trigger Type Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-black opacity-80 uppercase tracking-wide">Trigger Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'COMMENT', label: 'Comment' },
                      { id: 'DM', label: 'Direct DM' },
                      { id: 'STORY', label: 'Story Tag' }
                    ].map((t) => {
                      const isLocked = t.id === 'STORY' && currentPlan === 'free';
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            if (isLocked) {
                              onUpgradeClick?.("story_automator");
                              return;
                            }
                            setType(t.id);
                          }}
                          className={`relative py-2.5 rounded-md text-xs font-semibold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                            type === t.id 
                              ? 'bg-[#6366F1] text-white border-[#6366F1]-500/10' 
                              : 'bg-white text-black opacity-90 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                          }`}
                        >
                          <span>{t.label}</span>
                          {isLocked && <span className="text-[10px]" title="Premium Feature">👑</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target Keyword */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-black opacity-80 uppercase tracking-wide">Target Keyword</label>
                  <input 
                    type="text" 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value.toUpperCase())}
                    placeholder="e.g. READY"
                    className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 text-sm font-medium text-black outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 transition-all  placeholder:text-black opacity-60 uppercase"
                  />
                </div>

                {/* Toggle (Follower Gate) */}
                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  {/* Follower Gate Toggle */}
                  <div className="flex flex-col gap-2 p-3 bg-white border border-zinc-200/80 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-zinc-50 border border-zinc-200 flex items-center justify-center text-black opacity-80 shrink-0">
                          <ShieldCheck size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-black leading-tight">Access Check</p>
                          <p className="text-[10px] text-black opacity-60 font-medium">Only trigger when the access condition is met</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFollowerGate(!followerGate)}
                        className={`w-9 h-5.5 rounded-md transition-all relative shrink-0 ${followerGate ? 'bg-[#6366F1]' : 'bg-zinc-300'}`}
                      >
                        <div className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-md  transition-all ${followerGate ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>
                    {followerGate && (
                      <div className="pt-2 border-t border-zinc-100 space-y-1 animate-in fade-in duration-200">
                        <label className="text-[10px] font-bold text-black opacity-80 uppercase tracking-wider block">Custom Access Message</label>
                        <input 
                          type="text"
                          value={followGateMessage}
                          onChange={(e) => setFollowGateMessage(e.target.value)}
                          placeholder="One final step to unlock! 🎁"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-2 text-xs font-semibold outline-none focus:border-[#6366F1] focus:bg-white transition-all"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: AUTOMATION RESPONSE */}
              <div className="bg-zinc-50/40 border border-zinc-200/80 rounded-md p-4 sm:p-5 space-y-4 hover:border-zinc-300 transition-all">
                <h3 className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 pb-2.5">
                  <MessageSquare size={14} className="text-[#6366F1]" /> 2. Automation Response
                </h3>

                {type === 'COMMENT' && (
                  <>
                    {/* Public Reply to Comment */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-black opacity-80 uppercase tracking-wide">Public Comment Reply</label>
                      <input 
                        type="text" 
                        value={publicReply}
                        onChange={(e) => setPublicReply(e.target.value)}
                        placeholder="e.g. Check your DMs! 🚀"
                        className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 text-sm font-medium text-black outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 transition-all "
                      />
                      <p className="text-[10px] text-black opacity-60 font-medium">This reply will be published directly under the follower&apos;s comment.</p>
                    </div>

                    {/* Intro Greeting DM Message */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-black opacity-80 uppercase tracking-wide">Intro DM Greeting Message</label>
                      <textarea 
                        rows={2.5}
                        value={introTitle}
                        onChange={(e) => setIntroTitle(e.target.value)}
                        placeholder="Hey {name}! 👋 Tap the button below to claim..."
                        className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 text-sm font-medium text-black outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 transition-all  resize-none"
                      />
                      <p className="text-[10px] text-black opacity-60 font-medium">Variables: Use <code className="bg-zinc-100 px-1 py-0.5 rounded-md font-mono text-[9px]">{'{name}'}</code> to personalize.</p>
                    </div>

                    {/* Intro Button Text */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-black opacity-80 uppercase tracking-wide">Intro Button Label</label>
                      <input 
                        type="text" 
                        maxLength={20}
                        value={introButtonText}
                        onChange={(e) => setIntroButtonText(e.target.value)}
                        placeholder="Send me the access"
                        className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 text-sm font-medium text-black outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 transition-all "
                      />
                    </div>
                  </>
                )}

                {/* Main DM Response Message */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-black opacity-80 uppercase tracking-wide">
                    {type === 'COMMENT' ? 'DM Deliverable Message' : 'DM Response Message'}
                  </label>
                  <textarea 
                    rows={4.5}
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 text-sm font-medium text-black outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 transition-all  resize-none"
                  />
                </div>
              </div>

              {/* SECTION 3: CALL TO ACTION */}
              <div className="bg-zinc-50/40 border border-zinc-200/80 rounded-md p-4 sm:p-5 space-y-4 hover:border-zinc-300 transition-all pb-6">
                <h3 className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 pb-2.5">
                  <LinkIcon size={14} className="text-[#6366F1]" /> 3. Call to Action (Optional)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-black opacity-80 uppercase tracking-wide">Button Text</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Claim Discount"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 transition-all "
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-black opacity-80 uppercase tracking-wide">Button Link URL</label>
                    <input 
                      type="url" 
                      placeholder="https://yourstore.com/deal"
                      value={buttonLink}
                      onChange={(e) => setButtonLink(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 transition-all "
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-black opacity-80 uppercase tracking-wide">Campaign Name (Internal)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Summer Promo 2026"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 text-sm font-medium outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 transition-all "
                  />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-5 sm:px-6 py-4 bg-zinc-50 border-t border-zinc-150 flex items-center justify-between shrink-0 rounded-md-xl">
              {/* Optional Delete Button */}
              {onDelete ? (
                <button 
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2.5 bg-white border border-rose-200 hover:border-rose-300 hover:bg-rose-50 rounded-md text-xs font-semibold text-rose-600 transition-all flex items-center gap-1.5 cursor-pointer "
                >
                  <Trash2 size={14} /> <span className="hidden sm:inline">Delete Rule</span>
                </button>
              ) : (
                <div />
              )}
              
              <div className="flex items-center gap-2.5">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-bold text-black opacity-80 hover:text-black hover:bg-zinc-200/50 rounded-md transition-all cursor-pointer"
                >
                  Cancel
                </button>
                
                <button 
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-[#6366F1] hover:bg-[#4f46e5] text-white rounded-md text-xs font-bold  /10 hover: hover:-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Save Automation <Save size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
