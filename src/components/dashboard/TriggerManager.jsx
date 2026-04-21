"use client";

import { MessageSquare, Plus, Trash2, ArrowRight, Zap, Camera, ShieldCheck, Globe, Send, MousePointer2, AlertCircle, Pencil } from "lucide-react";
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
    <section className="bg-white border border-border rounded-[32px] shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-border/40 bg-zinc-50/50 flex items-center justify-between shrink-0">
        <h2 className="font-semibold text-xs text-foreground tracking-normal flex items-center gap-2">
           <Zap size={14} /> Active Rules
        </h2>
        <div className="text-[10px] font-semibold text-zinc-muted bg-foreground/5 px-2 py-1 rounded border border-border leading-none">
          {triggers?.length || 0}
        </div>
      </div>


      <div className="flex-1 overflow-y-auto no-scrollbar bg-zinc-50/10 divide-y divide-border/20">
        {!triggers || triggers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-muted/30 text-center px-10">
             <Zap size={32} className="mb-4 opacity-10" />
             <p className="text-[11px] font-semibold tracking-normal">No automation active yet</p>
          </div>
        ) : (
          triggers.map((t) => {
            // Find targeted media items
            const activeMedia = t.target_media_ids 
              ? media.filter(m => t.target_media_ids.includes(m.id))
              : [];

            return (
              <div key={t.id} className="p-6 hover:bg-zinc-50/80 group transition-all relative">
                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-foreground text-background rounded-lg text-[10px] font-semibold tracking-normal">
                        {t.keyword}
                      </span>
                      <ArrowRight size={10} className="text-zinc-muted/30" />
                      <div className="text-[10px] font-semibold text-zinc-muted/60 tracking-normal">
                         {t.type || "DM"}
                      </div>
                      {t.target_media_ids ? (
                         <span className="ml-auto text-[8px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 tracking-normal">
                           {t.target_media_ids.length} Post{t.target_media_ids.length > 1 ? 's' : ''}
                         </span>
                      ) : (
                         <span className="ml-auto text-[8px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 tracking-normal">
                           Global ✨
                         </span>
                      )}
                   </div>

                   {/* Visual Post Tracking (Thumbnails) */}
                   {activeMedia.length > 0 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                         {activeMedia.map(m => (
                            <div key={m.id} className="w-8 h-8 rounded-md overflow-hidden border border-border shadow-sm flex-shrink-0">
                               <img src={m.media_url} className="w-full h-full object-cover" alt="Post thumbnail" title={m.caption} />
                            </div>
                         ))}
                      </div>
                   )}

                   <div className="text-[11px] font-semibold text-foreground/70 italic line-clamp-1 opacity-60 tracking-normal">
                     "{t.response}"
                  </div>

                  <div className="flex items-center justify-end gap-2">
                     {t.metadata?.button_text && (
                        <div className="px-3 py-1 bg-white border border-border rounded-full text-[9px] font-semibold text-zinc-muted mr-auto tracking-normal">
                          {t.metadata.button_text}
                        </div>
                     )}
                     <button onClick={() => onEdit(t)} 
                      className="p-1.5 text-zinc-muted/20 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg group-hover:opacity-100 opacity-0 transition-all"
                     >
                      <Pencil size={16} />
                     </button>
                     <button onClick={() => onDelete(t.id)} 
                      className="p-1.5 text-zinc-muted/20 hover:text-red-500 hover:bg-red-50 rounded-lg group-hover:opacity-100 opacity-0 transition-all"
                     >
                      <Trash2 size={16} />
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
