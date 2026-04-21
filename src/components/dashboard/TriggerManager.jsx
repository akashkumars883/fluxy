"use client";

import { MessageSquare, Plus, Trash2, ArrowRight, Zap, Camera, ShieldCheck, Globe, Send, MousePointer2, AlertCircle, Pencil, Link, LayoutGrid } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * TRIGGER INPUT COMPONENT
 * Focused purely on creating new rules.
 */
export function TriggerInput({ onAdd }) {
  const [keyword, setKeyword] = useState("");
  const [response, setResponse] = useState("");
  const [type, setType] = useState("DM"); 
  const [followerGate, setFollowerGate] = useState(false);
  const [publicReply, setPublicReply] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [hasLink, setHasLink] = useState(false);

  useEffect(() => {
    // More permissive regex to catch common link patterns without requiring http://
    const urlRegex = /((https?:\/\/)|(www\.))[^\s]+|([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?)/gi;
    setHasLink(urlRegex.test(response));
  }, [response]);

  const handleSubmit = () => {
    if (!keyword || !response) return;
    onAdd(keyword, response, {
      follower_gate: followerGate,
      public_reply: type === "COMMENT" ? publicReply : null,
      button_text: hasLink ? buttonText : null,
      type: type
    });
    setKeyword(""); setResponse(""); setPublicReply(""); setButtonText(""); setFollowerGate(false);
  };

  const triggerTypes = [
    { id: "DM", label: "Direct Message", icon: Send },
    { id: "COMMENT", label: "Post Comment", icon: MessageSquare },
    { id: "STORY_REPLY", label: "Story Reply", icon: Camera },
  ];

  return (
    <section className="bg-white border border-border rounded-[32px] shadow-sm flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
      <div className="p-6 border-b border-border/40 flex items-center justify-between bg-zinc-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="font-semibold text-lg text-foreground tracking-normal">Engagement Hub</h2>
            <p className="text-[10px] text-zinc-muted font-normal tracking-normal opacity-60">Create your triggers</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-zinc-muted tracking-normal">Where should it trigger?</span>
            <div className="flex gap-2">
              {triggerTypes.map((t) => (
                <button key={t.id} onClick={() => setType(t.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-semibold tracking-normal transition-all border ${
                    type === t.id ? "bg-foreground text-background border-foreground shadow-md" : "bg-background text-zinc-muted border-border hover:bg-zinc-50"
                  }`}
                >
                  <t.icon size={13} /> {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-muted ml-1 tracking-normal">Keyword</label>
                <input type="text" placeholder="e.g. LINK" value={keyword} onChange={(e) => setKeyword(e.target.value)}
                  className="w-full px-5 py-4 bg-zinc-50 border-2 border-border/60 rounded-2xl outline-none focus:border-foreground focus:bg-white font-semibold text-sm tracking-normal transition-all text-foreground"
                />
             </div>

             <div className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-muted ml-1 tracking-normal">
                  Then send DM Message 
                  <span className="ml-2 text-[9px] text-emerald-600 px-1.5 py-0.5 rounded font-semibold tracking-normal">
                    Add a link inside to activate button 🔗
                  </span>
                </label>
                <textarea placeholder="e.g. Thanks for your interest! Here is the link: fluxy.ai" value={response} onChange={(e) => setResponse(e.target.value)}
                  className="w-full px-5 py-4 bg-zinc-50 border-2 border-border/60 rounded-2xl outline-none focus:border-foreground focus:bg-white font-semibold text-sm tracking-normal transition-all text-foreground min-h-[100px] resize-none"
                />
             </div>

             <div className="flex gap-4 items-center">
                <div className={`flex-1 p-5 rounded-2xl border-2 transition-all ${hasLink ? 'bg-foreground/5 border-foreground/10 ring-4 ring-emerald-500/5' : 'bg-zinc-50 border-dashed border-border/40 opacity-50'}`}>
                   <div className="flex items-center gap-2 mb-3">
                      <MousePointer2 size={14} className={hasLink ? 'text-emerald-600' : ''} />
                      <span className={`text-[10px] font-semibold tracking-normal ${hasLink ? 'text-emerald-700' : ''}`}>
                        {hasLink ? 'Button is Active! 🎉' : 'Button Name'}
                      </span>
                   </div>
                   <input type="text" placeholder={hasLink ? "e.g. Claim Offer 🛍️" : "Add a link above to enable button"} value={buttonText} onChange={(e) => setButtonText(e.target.value)}
                    disabled={!hasLink}
                    className="w-full bg-transparent border-b border-border/60 py-1 outline-none text-xs font-semibold tracking-normal focus:border-foreground"
                   />
                </div>

                {type === "COMMENT" && (
                   <div className="flex-1 p-5 rounded-2xl border-2 bg-blue-50/20 border-blue-500/10 animate-in slide-in-from-top-1">
                      <div className="flex items-center gap-2 mb-3">
                         <Globe size={14} className="text-blue-500" />
                         <span className="text-[10px] font-semibold text-blue-600 tracking-normal">
                           Public Comment Reply
                         </span>
                      </div>
                      <input type="text" placeholder="e.g. Sent you a DM! 🚀" value={publicReply} onChange={(e) => setPublicReply(e.target.value)}
                       className="w-full bg-transparent border-b border-blue-200 py-1 outline-none text-xs font-medium text-blue-700"
                      />
                   </div>
                )}
             </div>
          </div>

          <div className="pt-4 flex items-center justify-between gap-6 border-t border-border/30">
             <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                <ShieldCheck size={18} className="text-emerald-600" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-foreground leading-none tracking-normal">Follower-Gate</span>
                  <span className="text-[8px] text-emerald-700/60 font-semibold tracking-normal mt-1">Must Follow</span>
                </div>
                <button onClick={() => setFollowerGate(!followerGate)}
                  className={`w-10 h-5 rounded-full relative transition-all ${followerGate ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${followerGate ? 'left-5.5' : 'left-0.5'}`} />
                </button>
             </div>

             <button onClick={handleSubmit} 
              className="flex-1 py-5 bg-foreground text-background rounded-2xl font-semibold hover:scale-[1.01] tracking-normal transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <Plus size={18} strokeWidth={3} />
              <span className="text-sm text-white font-semibold">Create Rules</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * TRIGGER LIST COMPONENT
 * The sidebar-style rule tracker.
 */
export function TriggerList({ triggers, media, onDelete, onEdit, error = null }) {
  return (
    <section className="bg-white border border-border rounded-[40px] shadow-sm flex flex-col h-full overflow-hidden animate-in fade-in duration-700">
      <div className="px-8 py-6 border-b border-border/40 bg-zinc-50/30 flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-bold text-2xl text-foreground flex items-center gap-2">
             Active Automations
          </h2>
          <p className="text-[10px] text-zinc-muted font-medium mt-0.5 opacity-60 uppercase tracking-widest">Live Triggers</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-zinc-muted bg-white border border-border px-3 py-1 rounded-full shadow-sm">
             {triggers?.length || 0} Total
           </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4 bg-zinc-50/10">
        {!triggers || triggers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-muted/30 text-center px-10">
             <p className="text-xs font-bold text-zinc-400 tracking-normal mb-1 uppercase">No rules active yet</p>
             <p className="text-[10px] font-medium text-zinc-300">Create your first automation to see it here</p>
          </div>
        ) : (
          triggers.map((t) => {
            const activeMedia = t.target_media_ids 
              ? media.filter(m => t.target_media_ids.includes(m.id))
              : [];

            return (
              <div key={t.id} className="bg-white border border-border/60 p-3 rounded-[32px] hover:shadow-xl hover:shadow-zinc-950/5 hover:border-foreground/10 transition-all duration-300 group relative flex items-center justify-between gap-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-foreground/5 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* LEFT: TRIGGER INFO */}
                <div className="relative z-10 flex-1 min-w-0 space-y-3">
                   <div className="flex items-center gap-2">
                      <div className={`px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-widest uppercase border ${
                         t.type === 'DM' 
                           ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                           : t.type === 'COMMENT'
                             ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                             : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                         {t.type || "DM"}
                      </div>
                      
                      {!t.target_media_ids?.length && (
                         <div className="px-2.5 py-1 bg-foreground/5 text-foreground/60 border border-foreground/10 rounded-lg text-[9px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                            <Zap size={10} className="fill-current" />
                            GLOBAL
                         </div>
                      )}
                   </div>

                   <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                         <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Trigger:</span>
                         <span className="text-lg font-bold text-foreground tracking-tight group-hover:text-emerald-700 transition-colors">
                           {t.keyword}
                         </span>
                      </div>
                      <p className="text-xs font-semibold text-zinc-500 italic line-clamp-1 opacity-70">
                         "{t.response}"
                      </p>
                   </div>
                </div>

                {/* RIGHT: MEDIA & ACTIONS */}
                <div className="relative z-10 flex items-center gap-4 shrink-0">
                   {activeMedia.length > 0 && (
                      <div className="relative">
                        <div className="w-20 h-26 rounded-xl overflow-hidden border border-border/50 shadow-sm ring-4 ring-zinc-50 group-hover:ring-emerald-50 transition-all">
                           <img src={activeMedia[0].media_url} className="w-full h-full object-cover" alt="Post" />
                        </div>
                        {activeMedia.length > 1 && (
                           <div className="absolute -bottom-1 -right-1 bg-foreground text-background text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-border shadow-sm">
                              +{activeMedia.length - 1}
                           </div>
                        )}
                      </div>
                   )}

                   <div className="h-10 w-[1px] bg-border/20 mx-1 hidden sm:block" />

                   <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => onEdit(t)} 
                        className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => onDelete(t.id)} 
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                   </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
