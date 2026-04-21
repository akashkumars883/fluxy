/* src/components/dashboard/AutomationPreview.jsx */
"use client";

import { useState, useEffect } from "react";
import { Send, MoreHorizontal, Camera, Heart, MessageCircle, Bookmark, MoreVertical, Layout, MessageSquare } from "lucide-react";

/**
 * AUTOMATION PREVIEW COMPONENT
 * A versatile device mockup that simulates both Instagram Feed Posts and DM conversations.
 */
export default function AutomationPreview({ 
  keyword, 
  response, 
  type, 
  buttonText, 
  buttonLink, 
  publicReply, 
  postUrl,
  botImageUrl = "/default-bot.png", 
  botName = "Automixa Bot" 
}) {
  const [view, setView] = useState("dm"); // 'dm' or 'post'

  // Automatically switch to 'post' if a media URL is provided for the first time
  useEffect(() => {
    if (postUrl) {
      setView("post");
    }
  }, [postUrl]);

  return (
    <div className="flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-1000">
      
      {/* TOGGLE SWITCH */}
      <div className="mb-6 flex p-1 bg-zinc-100 rounded-2xl border border-border shadow-inner">
         <button 
           onClick={() => setView('post')}
           className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${view === 'post' ? 'bg-white text-foreground shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
         >
            <Layout size={14} /> POST
         </button>
         <button 
           onClick={() => setView('dm')}
           className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${view === 'dm' ? 'bg-white text-foreground shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
         >
            <MessageSquare size={14} /> DM
         </button>
      </div>

      <div className="relative w-[300px] h-[600px] bg-white border-[8px] border-zinc-900 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col">
        
        {/* STATUS BAR */}
        <div className="h-10 bg-white flex items-center justify-between px-8 pt-2 shrink-0">
          <span className="text-[10px] font-bold">9:41</span>
          <div className="flex items-center gap-1.5">
             <div className="w-4 h-2 bg-zinc-900 rounded-sm opacity-20" />
             <div className="w-3 h-3 bg-zinc-900 rounded-full opacity-20" />
          </div>
        </div>

        {view === 'dm' ? (
          /* DM VIEW */
          <>
            {/* CHAT HEADER */}
            <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3 shrink-0">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 p-[1.5px] items-center justify-center flex">
                  <div className="w-full h-full bg-white rounded-full p-[1px]">
                      <div className="w-full h-full bg-zinc-100 rounded-full flex items-center justify-center text-[10px] font-bold overflow-hidden">
                         {botName[0]}
                      </div>
                  </div>
               </div>
               <div className="flex-1">
                  <p className="text-[11px] font-bold leading-none">{botName}</p>
                  <p className="text-[9px] text-zinc-muted leading-none mt-1">Active now</p>
               </div>
               <MoreHorizontal size={16} className="text-zinc-muted" />
            </div>

            {/* CHAT AREA */}
            <div className="flex-1 p-4 bg-white flex flex-col gap-4 overflow-y-auto no-scrollbar">
               <div className="text-[10px] text-zinc-300 text-center my-4">MARCH 21, 9:41 AM</div>

               {/* USER MESSAGE (KEYWORD) */}
               {keyword && (
                 <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="max-w-[70%] bg-indigo-500 text-white px-4 py-2.5 rounded-[22px] rounded-br-[4px] text-[11px] font-medium shadow-sm">
                     {keyword}
                   </div>
                   <span className="text-[8px] text-zinc-300 mt-1 mr-1">Seen</span>
                 </div>
               )}

               {/* BOT RESPONSE */}
               {response && (
                 <div className="flex gap-2 animate-in fade-in slide-in-from-left-4 duration-500 items-end">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[8px] font-bold shrink-0">
                      {botName[0]}
                    </div>
                    <div className="max-w-[75%] space-y-2">
                        {buttonLink ? (
                          /* CARD RESPONSE (IF LINK EXISTS) */
                          <div className="w-full bg-white border border-zinc-200 rounded-[24px] overflow-hidden shadow-sm animate-in zoom-in-95 duration-500">
                             <div className="aspect-[1.91/1] bg-zinc-100 flex items-center justify-center border-b border-zinc-100">
                                <Send size={24} className="text-zinc-200" />
                             </div>
                             <div className="p-4 space-y-1">
                                <h4 className="text-[11px] font-black text-foreground leading-tight">{response}</h4>
                                <p className="text-[9px] text-zinc-muted leading-tight">Tap below to access</p>
                             </div>
                             <div className="p-3 border-t border-zinc-50 flex items-center justify-center text-[10px] font-black text-indigo-600">
                                {buttonText || "Get Access 🔗"}
                             </div>
                          </div>
                        ) : (
                          /* SIMPLE BUBBLE RESPONSE */
                          <div className="bg-zinc-100 text-zinc-800 px-4 py-2.5 rounded-[22px] rounded-bl-[4px] text-[11px] font-medium leading-relaxed">
                            {response}
                          </div>
                        )}
                    </div>
                 </div>
               )}

               <div className="flex-1" />
               
               {!keyword && !response && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-30">
                     <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-border">
                        <MessageCircle size={24} />
                     </div>
                     <p className="text-[10px] font-bold">Start typing to see magic ✨</p>
                  </div>
               )}
            </div>

            {/* CHAT INPUT */}
            <div className="p-4 bg-white border-t border-border/40 shrink-0">
               <div className="bg-zinc-50 border border-border/60 rounded-full px-4 py-2 flex items-center gap-3">
                  <Camera size={16} className="text-zinc-500" />
                  <div className="flex-1 text-[10px] text-zinc-300 font-medium">Message...</div>
                  <Send size={16} className="text-zinc-300" />
               </div>
            </div>
          </>
        ) : (
          /* POST VIEW */
          <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
            {/* POST HEADER */}
            <div className="px-4 py-3 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-[8px] font-bold border border-border overflow-hidden">
                    {botName[0]}
                  </div>
                  <span className="text-[11px] font-bold">{botName}</span>
               </div>
               <MoreHorizontal size={16} className="text-zinc-400" />
            </div>

            {/* THE IMAGE */}
            <div className="aspect-square bg-zinc-50 border-y border-border overflow-hidden relative">
              {postUrl ? (
                <img src={postUrl} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-500" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300 p-8 text-center italic">
                  <Layout size={40} strokeWidth={1} className="mb-2 opacity-50" />
                  <p className="text-[10px] font-medium leading-relaxed">Select a post on the left to see it here</p>
                </div>
              )}
            </div>

            {/* ACTIONS BAR */}
            <div className="p-3 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Heart size={20} className="text-zinc-800" />
                  <MessageCircle size={20} className="text-zinc-800" />
                  <Send size={20} className="text-zinc-800" />
               </div>
               <Bookmark size={20} className="text-zinc-800" />
            </div>

            {/* CAPTION & COMMENTS */}
            <div className="px-3 space-y-2 pb-8">
               <div className="text-[11px] font-bold">1,234 likes</div>
               <div className="text-[11px] leading-relaxed">
                  <span className="font-bold mr-2">{botName}</span>
                  <span className="text-zinc-600">Automate your growth with Automixa 🚀</span>
               </div>
               
               {/* SIMULATED TRIGGER COMMENT */}
               {keyword && (
                 <div className="pt-2 border-t border-border/40 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-start gap-2">
                       <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[7px] font-bold shrink-0">
                         ME
                       </div>
                       <div className="flex-1">
                          <p className="text-[11px] leading-tight">
                            <span className="font-bold mr-2">follower_user</span>
                            {keyword}
                          </p>
                          <p className="text-[9px] text-zinc-400 mt-1">1m • reply</p>
                       </div>
                       <Heart size={10} className="text-zinc-300" />
                    </div>
                 </div>
               )}

               {/* BOT REPLIES IN PUBLIC */}
               {publicReply && (
                 <div className="ml-8 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                    <div className="flex items-start gap-2">
                       <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center text-[6px] font-bold shrink-0 border border-border overflow-hidden">
                         {botName[0]}
                       </div>
                       <div className="flex-1">
                          <p className="text-[11px] leading-tight font-medium">
                            <span className="font-bold mr-2">{botName}</span>
                            {publicReply}
                          </p>
                          <p className="text-[9px] text-zinc-400 mt-1">Just now • active</p>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* HOME INDICATOR */}
        <div className="h-6 flex items-center justify-center shrink-0">
           <div className="w-24 h-1 bg-zinc-950 rounded-full opacity-10" />
        </div>

      </div>
      
      <div className="mt-8 text-center flex flex-col items-center gap-2">
         <div className="px-4 py-1.5 bg-foreground/5 border border-border rounded-full flex items-center gap-2 text-[10px] font-bold text-zinc-muted uppercase tracking-wider">
            {view === 'dm' ? <MessageSquare size={12} /> : <Layout size={12} />} 
            Live {view === 'dm' ? 'DM' : 'Post'} Preview
         </div>
      </div>
    </div>
  );
}
