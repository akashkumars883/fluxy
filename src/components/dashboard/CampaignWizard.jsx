/* src/components/dashboard/CampaignWizard.jsx */
"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, MousePointer2, ShieldCheck, Globe, ArrowRight, ArrowLeft, Zap, Rocket } from "lucide-react";

/**
 * CAMPAIGN WIZARD COMPONENT
 * A horizontal-scrolling, linear configuration flow for automation.
 */
export default function CampaignWizard({ onPublish, onChange, onBack, values }) {
  const [step, setStep] = useState(0);

  // Destructure values from props (Controlled Component pattern)
  const { 
    keyword, 
    response, 
    type, 
    followerGate, 
    publicReply, 
    buttonText, 
    buttonLink 
  } = values;

  // Local setters that notify parent
  const setKeyword = (val) => onChange({ keyword: val });
  const setResponse = (val) => onChange({ response: val });
  const setType = (val) => onChange({ type: val });
  const setFollowerGate = (val) => onChange({ followerGate: val });
  const setPublicReply = (val) => onChange({ publicReply: val });
  const setButtonText = (val) => onChange({ buttonText: val });
  const setButtonLink = (val) => onChange({ buttonLink: val });

  const steps = [
    { id: 'keyword', title: 'Start Word', label: 'What word starts it?' },
    { id: 'response', title: 'Auto Message', label: 'What message should they get?' },
    { id: 'toggles', title: 'Finishing Up', label: 'Final settings' }
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
    <section className="bg-white border border-border rounded-[32px] shadow-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
      {/* HEADER WITH STEP TRACKER */}
      <div className="p-4 border-b border-border/40 bg-zinc-50/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
             {onBack && (
                <button 
                  onClick={onBack}
                  className="p-2 hover:bg-zinc-100 rounded-xl transition-all text-zinc-400 hover:text-foreground"
                  title="Back"
                >
                  <ArrowLeft size={18} />
                </button>
             )}
              <div>
                <h2 className="text-2xl font-semibold text-foreground tracking-normal leading-tight">Auto Reply Setup</h2>
                <p className="text-[10px] text-zinc-muted font-normal opacity-50 tracking-normal">Set up your automatic message</p>
              </div>
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
            <span>Save & Launch</span>
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
        <div className="flex transition-transform duration-700 h-[30vh]" style={{ transform: `translateX(-${step * 100}%)` }}>
          
          {/* STEP 1: KEYWORD */}
          <div className="min-w-full p-8 md:p-8 flex flex-col max-w-xl mx-auto overflow-y-auto no-scrollbar">
             <div className="space-y-8">
                 <div className="space-y-4">
                    <h3 className="text-3xl font-semibold text-foreground tracking-tight">Pick a Start Word</h3>
                    <p className="text-sm text-zinc-muted font-medium">Choose the word that starts the auto reply.</p>
                 </div>

                <div className="space-y-6">
                   <div className="flex gap-2">
                      {['COMMENT', 'STORY_REPLY'].map((t) => (
                       <button key={t} onClick={() => setType(t)}
                         className={`px-5 py-2.5 rounded-xl text-[11px] font-bold tracking-normal transition-all border ${
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
                     className="w-full text-4xl font-semibold text-foreground placeholder:text-zinc-200 outline-none border-b-2 focus:border-foreground py-2 tracking-normal transition-all"
                   />
                </div>
             </div>
          </div>

          {/* STEP 2: RESPONSE */}
          <div className="min-w-full p-8 md:p-12 flex flex-col max-w-xl mx-auto overflow-y-auto no-scrollbar">
             <div className="space-y-8">
                 <div className="space-y-4">
                    <h3 className="text-3xl font-semibold text-foreground tracking-tight">Write your Message</h3>
                    <p className="text-sm text-zinc-muted font-medium">What should we send them?</p>
                 </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-zinc-muted opacity-50 ml-1 uppercase">Message for them</label>
                       <textarea 
                         placeholder="Write the message here (without the link)..."
                         value={response}
                         onChange={(e) => setResponse(e.target.value)}
                         className="w-full h-32 text-base font-semibold text-foreground placeholder:text-zinc-200 outline-none border-2 focus:border-foreground bg-zinc-50/50 p-6 rounded-[28px] tracking-normal transition-all resize-none shadow-sm"
                       />
                    </div>
                                      <div className={`p-6 rounded-[32px] border-2 transition-all bg-foreground/5 border-foreground/10`}>
                        <div className="flex items-center gap-2 mb-4">
                          <MousePointer2 size={16} className="text-emerald-600" />
                          <span className="text-[11px] font-bold text-foreground tracking-normal uppercase">Website Button & Link</span>
                        </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="Button Text"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            className="w-full bg-white border border-border p-4 rounded-xl text-sm font-semibold outline-none focus:border-foreground shadow-sm"
                          />
                          <input 
                            type="text" 
                            placeholder="https://..."
                            value={buttonLink}
                            onChange={(e) => setButtonLink(e.target.value)}
                            className="w-full bg-white border border-border p-4 rounded-xl text-sm font-semibold outline-none focus:border-foreground shadow-sm"
                          />
                       </div>
                    </div>
                </div>
             </div>
          </div>

          {/* STEP 3: ADVANCED */}
          <div className="min-w-full p-8 md:p-12 flex flex-col max-w-xl mx-auto overflow-y-auto no-scrollbar">
             <div className="space-y-8">
                 <div className="space-y-4">
                    <h3 className="text-3xl font-semibold text-foreground tracking-tight">Finishing Up</h3>
                    <p className="text-sm text-zinc-muted font-medium">Extra security and comment replies.</p>
                 </div>

                <div className="space-y-4">
                   <div className={`p-6 rounded-[28px] border-2 transition-all flex items-center justify-between ${followerGate ? 'bg-emerald-50/50 border-emerald-500/30' : 'bg-zinc-50 border-border/40'}`}>
                      <div className="flex items-center gap-4">
                         <div className={`p-3 rounded-2xl ${followerGate ? 'bg-emerald-500 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                            <ShieldCheck size={20} />
                         </div>
                          <div>
                             <p className="text-[12px] font-bold text-foreground tracking-normal uppercase">For Followers Only</p>
                             <p className="text-[10px] text-zinc-muted font-normal tracking-normal">Only people who follow you get a reply</p>
                          </div>
                      </div>
                      <button onClick={() => setFollowerGate(!followerGate)}
                        className={`w-12 h-7 rounded-full relative transition-all ${followerGate ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                      >
                         <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${followerGate ? 'right-1' : 'left-1'}`} />
                      </button>
                   </div>

                   {type === "COMMENT" && (
                      <div className="p-6 rounded-[28px] border-2 bg-blue-50/50 border-blue-500/20 animate-in zoom-in-95 duration-500">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-500 text-white rounded-2xl">
                               <Globe size={24} />
                            </div>
                             <div>
                                <p className="text-sm font-bold text-foreground tracking-normal">Comment Reply 🌐</p>
                                <p className="text-[10px] text-zinc-muted font-normal tracking-normal">Automatically reply to their comment publicly</p>
                             </div>
                         </div>
                          <input 
                            type="text" 
                            placeholder="e.g. Check your message! 🚀"
                           value={publicReply}
                           onChange={(e) => setPublicReply(e.target.value)}
                           className="w-full bg-white/80 border border-blue-200 rounded-xl px-4 py-3 outline-none text-sm font-semibold text-blue-700 tracking-normal"
                         />
                      </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* FOOTER CONTROLS */}
      <div className="p-6 border-t border-border/40 bg-zinc-50/30 flex items-center justify-between">
         <button 
           onClick={() => setStep(Math.max(0, step - 1))}
           disabled={step === 0}
           className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-normal transition-all ${
             step === 0 ? "opacity-0 invisible" : "text-zinc-muted hover:text-foreground hover:bg-zinc-50"
           }`}
         >
           <ArrowLeft size={16} /> Back
         </button>

         {step < steps.length - 1 ? (
           <button 
             onClick={() => setStep(step + 1)}
             disabled={!canGoNext()}
             className={`flex items-center gap-2 px-10 py-4 bg-foreground text-background rounded-full text-xs font-bold tracking-normal transition-all shadow-lg hover:translate-x-1 ${
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
