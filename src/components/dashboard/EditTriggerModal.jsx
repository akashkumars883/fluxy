/* src/components/dashboard/EditTriggerModal.jsx */
"use client";

import { useState, useEffect } from "react";
import { X, Send, MousePointer2, ShieldCheck, Globe, Save } from "lucide-react";

export default function EditTriggerModal({ trigger, isOpen, onClose, onSave }) {
  const [keyword, setKeyword] = useState("");
  const [response, setResponse] = useState("");
  const [type, setType] = useState("DM");
  const [followerGate, setFollowerGate] = useState(false);
  const [publicReply, setPublicReply] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");

  useEffect(() => {
    if (trigger && isOpen) {
      setKeyword(trigger.keyword || "");
      setResponse(trigger.response || "");
      setType(trigger.type || "DM");
      setFollowerGate(trigger.metadata?.follower_gate || false);
      setPublicReply(trigger.variants?.public?.[0] || "");
      setButtonText(trigger.metadata?.button_text || "");
      setButtonLink(trigger.metadata?.button_link || "");
    }
  }, [trigger, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(trigger.id, {
      keyword,
      response,
      type,
      metadata: {
        follower_gate: followerGate,
        button_text: buttonLink ? (buttonText || "Get Access 🔗") : null,
        button_link: buttonLink
      },
      variants: {
        dm: [response],
        public: publicReply ? [publicReply] : []
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 md:p-16 lg:p-24">
      {/* GLASS BACKDROP */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-xl animate-in fade-in duration-700 ease-in-out"
        onClick={onClose}
      />

      {/* MODAL CARD */}
      <div className="relative w-full max-w-5xl max-h-full bg-white border border-border rounded-[48px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
        
        {/* HEADER */}
        <div className="p-8 border-b border-border/40 bg-zinc-50/50 flex items-center justify-between">
           <div>
              <h2 className="text-2xl font-semibold text-foreground tracking-normal">Edit Automation</h2>
              <p className="text-[10px] text-zinc-muted font-normal tracking-normal opacity-40 mt-1">Refine your flow rules</p>
           </div>
           <button 
             onClick={onClose}
             className="p-3 bg-white border border-border rounded-2xl text-zinc-muted hover:text-foreground hover:bg-zinc-50 transition-all"
           >
             <X size={20} />
           </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-10 max-h-[85vh] no-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* LEFT COLUMN: TRIGGER & CONFIG */}
            <div className="space-y-10">
              {/* TRIGGER TYPE & KEYWORD */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  {['DM', 'COMMENT', 'STORY_REPLY'].map((t) => (
                    <button 
                      key={t}
                      onClick={() => setType(t)}
                      className={`flex-1 py-3 rounded-2xl text-[9px] font-semibold tracking-normal border transition-all ${
                        type === t ? 'bg-foreground text-background border-foreground shadow-xl' : 'bg-zinc-50 text-zinc-muted border-border hover:bg-white'
                      }`}
                    >
                      {t.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 p-6 bg-zinc-50 rounded-[32px] border border-border/40">
                  <label className="text-[10px] font-semibold text-zinc-muted tracking-normal ml-1 opacity-50">The Trigger Keyword</label>
                  <input 
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value.toUpperCase())}
                    className="w-full text-4xl font-semibold text-foreground placeholder:text-zinc-200 outline-none border-b-4 border-transparent focus:border-foreground py-2 tracking-normal transition-all bg-transparent"
                  />
                </div>
              </div>

              {/* ADVANCED GATES */}
              <div className="space-y-4">
                  <label className="text-[10px] font-semibold text-zinc-muted tracking-normal ml-1 opacity-50">Safety & Rules</label>
                  <div className={`p-6 rounded-[32px] border-2 flex items-center justify-between transition-all ${followerGate ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-50 border-border/40'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${followerGate ? 'bg-emerald-500 text-white' : 'bg-zinc-100 text-zinc-300'}`}>
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-foreground tracking-normal">Follower Gate</p>
                          <p className="text-[9px] text-zinc-muted font-normal tracking-normal opacity-50">Required to follow</p>
                        </div>
                    </div>
                    <button 
                      onClick={() => setFollowerGate(!followerGate)}
                      className={`w-12 h-6 rounded-full relative transition-all ${followerGate ? 'bg-emerald-500' : 'bg-zinc-200'}`}
                    >
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${followerGate ? 'right-0.5' : 'left-0.5 shadow-sm'}`} />
                    </button>
                  </div>

                  {type === "COMMENT" && (
                    <div className="p-8 rounded-[32px] border-2 bg-blue-500/5 border-blue-500/10 space-y-4 animate-in zoom-in-95 duration-300">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500 text-white rounded-lg">
                            <Globe size={16} />
                          </div>
                          <span className="text-[11px] font-semibold text-foreground tracking-normal">Public Reply</span>
                      </div>
                      <input 
                        type="text" 
                        value={publicReply}
                        onChange={(e) => setPublicReply(e.target.value)}
                        placeholder="e.g. Sent you a DM! 🚀"
                        className="w-full bg-white border border-blue-100 rounded-2xl px-5 py-4 outline-none text-sm font-semibold text-blue-700 shadow-sm tracking-normal"
                      />
                    </div>
                  )}
              </div>
            </div>

            {/* RIGHT COLUMN: RESPONSE & CTA */}
            <div className="space-y-6">
              {/* RESPONSE AREA */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold text-zinc-muted tracking-normal ml-1 opacity-50">The Response Message (Text Only)</label>
                </div>
                <textarea 
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full h-[200px] bg-zinc-50 border-2 border-border/40 rounded-[32px] p-8 text-base font-semibold text-foreground outline-none focus:border-foreground focus:bg-white tracking-normal transition-all resize-none shadow-sm"
                  placeholder="What should Automixa say?"
                />

                {/* BUTTON OPTION */}
                <div className={`p-8 rounded-[32px] border-2 transition-all bg-foreground/5 border-foreground/10 ring-8 ring-emerald-500/5`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-2.5 rounded-xl bg-emerald-500 text-white`}>
                          <MousePointer2 size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-foreground">Premium Fulfillment Card</span>
                        <span className="text-[8px] text-zinc-muted font-normal opacity-60">Separate Link and Button</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-zinc-muted opacity-40 ml-1">Destination URL</label>
                          <input 
                            type="text"
                            value={buttonLink}
                            onChange={(e) => setButtonLink(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full bg-white border border-border/60 rounded-xl px-4 py-2.5 outline-none text-sm font-semibold focus:border-foreground transition-all shadow-sm"
                          />
                       </div>

                       <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-zinc-muted opacity-40 ml-1">Button Label</label>
                          <input 
                            type="text"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            disabled={!buttonLink}
                            placeholder="e.g. Visit Website 🌐"
                            className="w-full bg-white border border-border/60 rounded-xl px-4 py-2.5 outline-none text-sm font-semibold focus:border-foreground transition-all shadow-sm disabled:opacity-50"
                          />
                       </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-8 border-t border-border/40 bg-white flex items-center gap-4">
           <button 
             onClick={onClose}
             className="px-8 py-5 rounded-[24px] text-xs font-semibold text-zinc-muted hover:text-foreground tracking-normal transition-all"
           >
             Cancel
           </button>
           <button 
             onClick={handleSave}
             className="flex-1 px-8 py-5 bg-foreground text-background rounded-[24px] text-xs font-semibold tracking-normal shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
           >
             <Save size={18} />
             Save Changes
           </button>
        </div>
      </div>
    </div>
  );
}
