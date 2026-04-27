"use client";

import { useState } from "react";
import { Zap, Send, MessageSquare, Camera, MousePointer2, ShieldCheck, Rocket, ChevronRight, Hash, Sparkles } from "lucide-react";

/**
 * NEXUS ENGINE COMPONENT
 * The core 'Studio' workspace for creating automations.
 * Features a unified vertical flow with glassmorphism styling.
 */
export default function NexusEngine({ onPublish }) {
  const [keyword, setKeyword] = useState("");
  const [response, setResponse] = useState("");
  const [type, setType] = useState("DM");
  const [followerGate, setFollowerGate] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const hasLink = /(https?:\/\/[^\s]+)/i.test(response);

  const handlePublish = () => {
    if (!keyword || !response) return;
    onPublish(keyword, response, {
      follower_gate: followerGate,
      button_text: hasLink ? buttonText : null,
      type: type
    });
    // Reset after some delay or feedback
  };

  const triggerTypes = [
    { id: "DM", label: "Direct Message", icon: Send, color: "text-blue-500" },
    { id: "COMMENT", label: "Post Comment", icon: MessageSquare, color: "text-emerald-500" },
    { id: "STORY_REPLY", label: "Story Reply", icon: Camera, color: "text-purple-500" },
  ];

  return (
    <section className="bg-white/60 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[40px] flex flex-col h-full overflow-hidden transition-all duration-700 hover:shadow-indigo-500/5 relative group">
      
      {/* Decorative Light Leak */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000"></div>

      {/* HEADER */}
      <div className="p-8 border-b border-border/10 bg-white/40 flex items-center justify-between shrink-0 relative z-10">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-indigo-500 fill-indigo-500/20" />
              <h2 className="font-black text-xl text-foreground tracking-tight">Nexus Studio</h2>
           </div>
           <p className="text-[10px] text-zinc-muted font-black uppercase tracking-[0.2em] opacity-40">Crafting Automation</p>
        </div>
        
        <button 
          onClick={handlePublish}
          disabled={!keyword || !response}
          className={`px-8 py-3 rounded-2xl font-black text-xs flex items-center gap-3 transition-all duration-500 ${
            !keyword || !response 
              ? "bg-zinc-100 text-zinc-300 border border-zinc-200 cursor-not-allowed" 
              : "bg-foreground text-background shadow-2xl hover:scale-105 active:scale-95 hover:shadow-indigo-500/20"
          }`}
        >
          <Rocket size={16} />
          <span>Deploy Flow</span>
        </button>
      </div>

      {/* UNIFIED SCROLLABLE WORKSPACE */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10 relative z-10">
        
        {/* SEGMENT 1: SOURCE TYPE */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center gap-3 opacity-60">
              <div className="w-6 h-6 bg-zinc-100 rounded-lg flex items-center justify-center text-[10px] font-black">1</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-muted">Choose Source</span>
           </div>
           <div className="grid grid-cols-3 gap-3">
              {triggerTypes.map((t) => {
                const isActive = type === t.id;
                return (
                  <button 
                    key={t.id} 
                    onClick={() => setType(t.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-500 group/btn ${
                      isActive 
                        ? "bg-white border-foreground shadow-xl scale-[1.02] z-10" 
                        : "bg-white/40 border-transparent hover:border-border/60 grayscale-[0.5] hover:grayscale-0"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                       <div className={`p-3 rounded-xl transition-all duration-500 ${isActive ? 'bg-foreground text-background' : 'bg-zinc-50 text-zinc-400'}`}>
                          <t.icon size={20} />
                       </div>
                       <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'text-foreground' : 'text-zinc-muted'}`}>
                         {t.label}
                       </span>
                    </div>
                  </button>
                );
              })}
           </div>
        </div>

        {/* CONNECTOR LINE */}
        <div className="ml-3 w-[1px] h-8 bg-gradient-to-b from-border/40 to-transparent"></div>

        {/* SEGMENT 2: KEYWORD */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
           <div className="flex items-center gap-3 opacity-60">
              <div className="w-6 h-6 bg-zinc-100 rounded-lg flex items-center justify-center text-[10px] font-black">2</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-muted">Define Trigger</span>
           </div>
           <div className="relative group/input">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within/input:text-foreground transition-colors">
                <Hash size={24} />
              </div>
              <input 
                type="text" 
                placeholder="TYPE TRIGGER KEYWORD..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value.toUpperCase())}
                className="w-full pl-16 pr-8 py-6 bg-white/40 border-2 border-transparent focus:border-foreground/20 rounded-[28px] outline-none text-2xl font-black text-foreground placeholder:text-zinc-100 transition-all focus:bg-white focus:shadow-2xl"
              />
           </div>
        </div>

        {/* CONNECTOR LINE */}
        <div className="ml-3 w-[1px] h-8 bg-gradient-to-b from-border/40 to-transparent"></div>

        {/* SEGMENT 3: ACTION */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-900">
           <div className="flex items-center gap-3 opacity-60">
              <div className="w-6 h-6 bg-zinc-100 rounded-lg flex items-center justify-center text-[10px] font-black">3</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-muted">Automation Action</span>
           </div>
           <div className="space-y-4">
              <textarea 
                placeholder="Write the personalized response here... tip: add a link to enable the CTA button!"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full h-32 p-6 bg-white/40 border-2 border-transparent focus:border-foreground/20 rounded-[28px] outline-none text-base font-bold text-foreground placeholder:text-zinc-200 transition-all focus:bg-white focus:shadow-2xl resize-none"
              />
              
              {/* Hybrid Button Logic Display */}
              <div className={`p-6 rounded-[28px] border-2 transition-all duration-700 ${hasLink ? 'bg-indigo-500/5 border-indigo-500/20 shadow-lg' : 'bg-zinc-50/50 border-dashed border-border/40 opacity-40'}`}>
                 <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${hasLink ? 'bg-indigo-500 text-white' : 'bg-zinc-200 text-zinc-400'}`}>
                        <MousePointer2 size={16} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Interactive CTA</p>
                         <p className="text-[9px] font-bold text-zinc-muted italic">Enabled via link detection</p>
                      </div>
                   </div>
                   {hasLink && <div className="text-[10px] font-black text-indigo-500 animate-pulse uppercase">Active</div>}
                 </div>
                 <input 
                   type="text" 
                   placeholder={hasLink ? "Enter Button Label (e.g. GET OFFER 🛍️)" : "Add link above for button"}
                   value={buttonText}
                   disabled={!hasLink}
                   onChange={(e) => setButtonText(e.target.value)}
                   className="w-full bg-transparent border-b border-border/40 py-2 outline-none text-xs font-black focus:border-indigo-500 transition-all placeholder:text-zinc-300"
                 />
              </div>
           </div>
        </div>

        {/* CONNECTOR LINE */}
        <div className="ml-3 w-[1px] h-8 bg-gradient-to-b from-border/40 to-transparent"></div>

        {/* SEGMENT 4: POLISH */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
           <div className="flex items-center gap-3 opacity-60">
              <div className="w-6 h-6 bg-zinc-100 rounded-lg flex items-center justify-center text-[10px] font-black">4</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-muted">Safety Polish</span>
           </div>
           
           <div className={`p-5 rounded-[24px] border-2 transition-all duration-500 flex items-center justify-between overflow-hidden relative ${followerGate ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/40 border-transparent hover:border-border/40'}`}>
              <div className="flex items-center gap-4 relative z-10">
                 <div className={`p-3 rounded-xl transition-all ${followerGate ? 'bg-emerald-500 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                    <ShieldCheck size={20} />
                 </div>
                 <div>
                    <h4 className="text-[11px] font-black text-foreground uppercase tracking-tight">Follower Gate</h4>
                    <p className="text-[9px] text-zinc-muted font-bold">Only active followers will receive this DM</p>
                 </div>
              </div>
              <button 
                onClick={() => setFollowerGate(!followerGate)}
                className={`w-12 h-6 rounded-full relative z-10 transition-all duration-500 ${followerGate ? 'bg-emerald-500' : 'bg-zinc-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-500 ${followerGate ? 'right-1' : 'left-1'}`} />
              </button>
           </div>
        </div>
      </div>

      {/* FOOTER STATS */}
      <div className="p-4 bg-zinc-50/50 border-t border-border/10 flex items-center justify-center gap-8 text-[9px] font-black uppercase text-zinc-muted tracking-[0.2em] opacity-40">
         <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> 100% Deliverability</div>
         <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> Meta Verified</div>
      </div>

    </section>
  );
}
