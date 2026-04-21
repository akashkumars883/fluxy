/* src/components/dashboard/CampaignWizard.jsx */
"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, MousePointer2, ShieldCheck, Globe, ArrowRight, ArrowLeft, Zap, Rocket } from "lucide-react";

/**
 * CAMPAIGN WIZARD COMPONENT
 * A horizontal-scrolling, linear configuration flow for automation.
 */
export default function CampaignWizard({ onPublish, initialData = {} }) {
  const [step, setStep] = useState(0);
  const [keyword, setKeyword] = useState(initialData.keyword || "");
  const [response, setResponse] = useState(initialData.response || "");
  const [type, setType] = useState(initialData.type || "DM");
  const [followerGate, setFollowerGate] = useState(initialData.follower_gate || false);
  const [publicReply, setPublicReply] = useState(initialData.public_reply || "");
  const [buttonText, setButtonText] = useState(initialData.button_text || "");
  const [buttonLink, setButtonLink] = useState(initialData.button_link || "");

  const steps = [
    { id: 'keyword', title: 'The Trigger', label: 'What keyword starts it?' },
    { id: 'response', title: 'The Message', label: 'What do they get in DM?' },
    { id: 'toggles', title: 'Final Polish', label: 'Set your rules & gates' }
  ];

  const canGoNext = () => {
    if (step === 0) return keyword.length > 0;
    if (step === 1) return response.length > 0;
    return true;
  };

  const handlePublish = () => {
    onPublish(keyword, response, {
      type,
      follower_gate: followerGate,
      public_reply: type === "COMMENT" ? publicReply : null,
      button_text: buttonLink ? (buttonText || "Get Access 🔗") : null,
      button_link: buttonLink
    });
  };

  return (
    <section className="bg-white border border-border rounded-[32px] shadow-sm flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER WITH STEP TRACKER */}
      <div className="p-6 border-b border-border/40 bg-zinc-50/50">
        <div className="flex items-center justify-between mb-6">
           <div>
              <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2 tracking-normal">
                 Campaign Creator
              </h2>
              <p className="text-[10px] text-zinc-muted font-normal mt-1 opacity-50 tracking-normal">Draft your automation</p>
           </div>
           
           <button 
             onClick={handlePublish}
             disabled={!keyword || !response}
             className={`px-6 py-2.5 rounded-xl text-xs font-semibold tracking-normal flex items-center gap-2 transition-all ${
               !keyword || !response 
                 ? "bg-zinc-100 text-zinc-300 border border-zinc-200 cursor-not-allowed" 
                 : "bg-foreground text-background shadow-lg hover:scale-105 active:scale-95"
             }`}
           >
             <Rocket size={16} />
             <span>Publish</span>
           </button>
        </div>

        <div className="flex items-center gap-4">
           {steps.map((s, idx) => (
             <div key={s.id} className="flex items-center gap-4 flex-1">
                <div className="flex flex-col gap-2 flex-1">
                   <div className={`h-1.5 rounded-full transition-all duration-500 ${idx <= step ? 'bg-foreground' : 'bg-zinc-200'}`} />
                   <span className={`text-[11px] font-semibold tracking-normal ${idx === step ? 'text-foreground' : 'text-zinc-muted opacity-40'}`}>
                     {s.title}
                   </span>
                </div>
                {idx < steps.length - 1 && <ArrowRight size={12} className="text-zinc-200 mt-4" />}
             </div>
           ))}
        </div>
      </div>

      {/* HORIZONTAL CONTENT AREA */}
      <div className="flex-1 overflow-hidden relative">
        <div className="flex transition-transform duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)] h-full" style={{ transform: `translateX(-${step * 100}%)` }}>
          
          {/* STEP 1: KEYWORD */}
          <div className="min-w-full p-6 md:p-8 flex flex-col justify-center max-w-xl mx-auto">
             <div className="space-y-6">
                <div className="space-y-3">
                   <h3 className="text-2xl font-semibold text-foreground">Setting the Trigger</h3>
                   <p className="text-[11px] text-zinc-muted font-medium">Choose the word that starts everything.</p>
                </div>

                <div className="space-y-4">
                   <div className="flex gap-1.5">
                     {['DM', 'COMMENT', 'STORY_REPLY'].map((t) => (
                       <button key={t} onClick={() => setType(t)}
                         className={`px-4 py-2 rounded-lg text-[9px] font-semibold tracking-normal transition-all border ${
                           type === t ? "bg-foreground text-background border-foreground shadow-md" : "bg-zinc-50 text-zinc-muted border-border hover:bg-white"
                         }`}
                       >
                         {t.replace('_', ' ')}
                       </button>
                     ))}
                   </div>
                   <input 
                     type="text" 
                     placeholder="e.g. LINK, DEALS"
                     value={keyword}
                     onChange={(e) => setKeyword(e.target.value.toUpperCase())}
                     className="w-full text-3xl font-semibold text-foreground placeholder:text-zinc-200 outline-none border-b-2 focus:border-foreground py-2 tracking-normal transition-all"
                   />
                </div>
             </div>
          </div>

          {/* STEP 2: RESPONSE */}
          <div className="min-w-full p-6 md:p-8 flex flex-col justify-center max-w-xl mx-auto">
             <div className="space-y-6">
                <div className="space-y-3">
                   <div className="w-12 h-12 bg-emerald-500 text-white rounded-[18px] flex items-center justify-center shadow-lg">
                      <Send size={24} />
                   </div>
                   <h3 className="text-2xl font-semibold text-foreground tracking-normal">Craft the Response</h3>
                </div>

                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-muted opacity-50 ml-1">DM Message Text</label>
                      <textarea 
                        placeholder="Write your DM here (without the link)..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        className="w-full h-32 text-base font-semibold text-foreground placeholder:text-zinc-200 outline-none border-2 focus:border-foreground bg-zinc-50/50 p-4 rounded-[24px] tracking-normal transition-all resize-none shadow-sm"
                      />
                   </div>
                   
                   <div className={`p-6 rounded-[32px] border-2 transition-all bg-foreground/5 border-foreground/10`}>
                      <div className="flex items-center gap-2 mb-4">
                        <MousePointer2 size={16} className="text-emerald-600" />
                        <span className="text-[10px] font-semibold text-foreground tracking-normal">Fulfillment Button & Link</span>
                      </div>
                      
                      <div className="space-y-4">
                         <div className="space-y-1">
                            <label className="text-[9px] font-semibold text-zinc-muted opacity-40 ml-1">Destination URL (Product Link)</label>
                            <input 
                              type="text" 
                              placeholder="https://yourstore.com/product"
                              value={buttonLink}
                              onChange={(e) => setButtonLink(e.target.value)}
                              className="w-full bg-white border border-border/60 rounded-xl px-4 py-2.5 outline-none text-[11px] font-semibold tracking-normal focus:border-emerald-500 shadow-sm"
                            />
                         </div>

                         <div className="space-y-1">
                            <label className="text-[9px] font-semibold text-zinc-muted opacity-40 ml-1">Button Label (Optional)</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Shop Now 🛍️"
                              value={buttonText}
                              disabled={!buttonLink}
                              onChange={(e) => setButtonText(e.target.value)}
                              className="w-full bg-white border border-border/60 rounded-xl px-4 py-2.5 outline-none text-[11px] font-semibold tracking-normal focus:border-emerald-500 shadow-sm disabled:opacity-50"
                            />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* STEP 3: TOGGLES */}
          <div className="min-w-full p-6 md:p-8 flex flex-col justify-center max-w-xl mx-auto">
             <div className="space-y-6">
                <div className="space-y-3">
                   <div className="w-12 h-12 bg-blue-500 text-white rounded-[18px] flex items-center justify-center shadow-lg">
                      <ShieldCheck size={24} />
                   </div>
                   <h3 className="text-2xl font-semibold text-foreground tracking-normal">Final Polish</h3>
                </div>

                <div className="space-y-3">
                   <div className={`p-4 rounded-[24px] border-2 transition-all flex items-center justify-between ${followerGate ? 'bg-emerald-50/50 border-emerald-500/30' : 'bg-zinc-50 border-border/40'}`}>
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-xl ${followerGate ? 'bg-emerald-500 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                            <ShieldCheck size={18} />
                         </div>
                         <div>
                            <p className="text-[11px] font-semibold text-foreground tracking-normal">Follower Gate</p>
                            <p className="text-[9px] text-zinc-muted font-normal tracking-normal">Followers only</p>
                         </div>
                      </div>
                      <button onClick={() => setFollowerGate(!followerGate)}
                        className={`w-10 h-6 rounded-full relative transition-all ${followerGate ? 'bg-emerald-500' : 'bg-zinc-200'}`}
                      >
                         <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${followerGate ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                   </div>

                   {type === "COMMENT" && (
                      <div className="p-6 rounded-[32px] border-2 bg-blue-50/50 border-blue-500/20 animate-in zoom-in-95 duration-500">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-500 text-white rounded-2xl">
                               <Globe size={24} />
                            </div>
                            <div>
                               <p className="text-sm font-semibold text-foreground tracking-normal">Public Reply 🌐</p>
                               <p className="text-[10px] text-zinc-muted font-normal tracking-normal">Bot will reply to the comment publicly</p>
                            </div>
                         </div>
                         <input 
                           type="text" 
                           placeholder="e.g. Sent you a DM! 🚀"
                           value={publicReply}
                           onChange={(e) => setPublicReply(e.target.value)}
                           className="w-full bg-white/60 border border-blue-200 rounded-xl px-4 py-3 outline-none text-sm font-semibold text-blue-700 tracking-normal"
                         />
                      </div>
                   )}
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* FOOTER CONTROLS */}
      <div className="p-8 border-t border-border/40 bg-white flex items-center justify-between shrink-0">
         <button 
           onClick={() => setStep(Math.max(0, step - 1))}
           disabled={step === 0}
           className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold tracking-normal transition-all ${
             step === 0 ? "opacity-0 invisible" : "text-zinc-muted hover:text-foreground hover:bg-zinc-50"
           }`}
         >
           <ArrowLeft size={16} /> Back
         </button>

         {step < steps.length - 1 ? (
           <button 
             onClick={() => setStep(step + 1)}
             disabled={!canGoNext()}
             className={`flex items-center gap-2 px-10 py-4 bg-foreground text-background rounded-full text-xs font-semibold tracking-normal transition-all shadow-lg hover:translate-x-1 ${
               !canGoNext() ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95"
             }`}
           >
             Continue <ArrowRight size={16} />
           </button>
         ) : (
           <div className="flex items-center gap-2 text-emerald-600 font-semibold text-[10px] tracking-normal animate-pulse">
             All steps complete ✨
           </div>
         )}
      </div>
    </section>
  );
}
