"use client";

import { Bookmark, Brain, Camera, Heart, Image as ImageIcon, Layout, MessageCircle, MessageSquare, Mic, MoreHorizontal, Phone, Send, Smile, Users, Video, X } from "lucide-react";
import { useState } from "react";

export default function AutomationPreview({ 
  keyword, 
  response, 
  buttonText, 
  buttonLink, 
  publicReply, 
  postUrl,
  aiName = "Automixa AI",
  strategy = "faq_assistant",
  faqs = [],
  aiGoal = "",
  aiKnowledge = "",
  aiPersona = "friendly",
  aiUseEmojis = true,
  storyTriggerType = "REPLY"
}) {
  const [view, setView] = useState(strategy === "faq_assistant" || strategy === "sales_closer" ? "faq" : (strategy === "story_automator" ? "story" : "dm"));
  const [chatInput, setChatInput] = useState("");
  const [testMessages, setTestMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const [prevStrategy, setPrevStrategy] = useState(strategy);
  const [prevPostUrl, setPrevPostUrl] = useState(postUrl);

  if (strategy !== prevStrategy || postUrl !== prevPostUrl) {
    setPrevStrategy(strategy);
    setPrevPostUrl(postUrl);
    setView(strategy === "faq_assistant" || strategy === "sales_closer" ? "faq" : (strategy === "story_automator" ? "story" : (postUrl ? "post" : "dm")));
  }

  const getPersonaResponse = (baseText, persona, useEmojis, isGreeting = false) => {
    if (!baseText && !isGreeting) return "";
    let final = baseText;
    
    const variations = {
      professional: {
        greet: "Greetings. I am your specialized AI Assistant. How may I facilitate your business requirements today?",
        prefix: "Our official stance regarding your inquiry is: ",
        suffix: ". Please let us know if you require further documentation."
      },
      friendly: {
        greet: "Hey there! I'm so happy to chat with you. How can I help you today? 😊",
        prefix: "I've got you covered! ",
        suffix: ". Hope that clears things up! ✨"
      },
      funny: {
        greet: "Alright, I'm the brainy one here! ✨ What's on your mind today?",
        prefix: "Alright, here's the tea: ",
        suffix: ". (I'm actually a genius, you know) 🚀"
      },
      concise: {
        greet: "Hi. I'm here to help. What's on your mind?",
        prefix: "",
        suffix: ""
      }
    };

    const config = variations[persona] || variations.friendly;

    if (isGreeting) return config.greet;

    if (persona === 'professional') {
      final = `${config.prefix}${baseText}${config.suffix}`;
    } else if (persona === 'funny') {
      final = `${config.prefix}${baseText}${config.suffix}`;
    } else if (persona === 'friendly') {
      final = `${config.prefix}${baseText}${config.suffix}`;
    }

    if (!useEmojis) {
      final = final.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
    }

    return final;
  };

  const handleSendTestMessage = (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim().toLowerCase();
    const newMessages = [...testMessages, { role: 'user', text: chatInput.trim() }];
    setTestMessages(newMessages);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      let aiText = "";
      let isGreeting = false;

      // 1. Check for greetings
      const greetings = ['hi', 'hello', 'hey', 'yo', 'namaste'];
      if (greetings.some(g => userMsg.includes(g))) {
        isGreeting = true;
      } else {
        // 2. Smart Match with synonyms
        const synonymMap = {
          price: ['how much', 'cost', 'expensive', 'cheap', 'pricing', 'pay'],
          shipping: ['delivery', 'track', 'courier', 'when', 'time', 'receive'],
          location: ['where', 'address', 'office', 'shop', 'store'],
          help: ['support', 'contact', 'talk', 'issue', 'problem']
        };

        const match = faqs.find(f => {
          if (!f.q) return false;
          const q = f.q.toLowerCase();
          if (userMsg.includes(q) || q.includes(userMsg)) return true;
          
          for (let key in synonymMap) {
            if (q.includes(key) && synonymMap[key].some(syn => userMsg.includes(syn))) return true;
          }
          return false;
        });

        if (strategy === "sales_closer") {
          const lowerGoal = aiGoal.toLowerCase();
          if (userMsg.includes('@') && userMsg.includes('.')) {
            aiText = `Perfect! Thank you for sharing your email. I've noted it down and will send you the information right away! Is there anything else you'd like to know?`;
            setTestMessages(prev => [...prev, { 
              role: 'ai', 
              text: aiUseEmojis ? `${aiText} ✅📩` : aiText 
            }]);
            setIsTyping(false);
            return;
          }

          if (lowerGoal.includes("email") || lowerGoal.includes("discount")) {
            aiText = `That's great! ${aiKnowledge ? `Based on what I know about ${aiKnowledge.slice(0, 30)}..., I think you'll love it.` : 'I can definitely help with that.'} Could you please share your email? I'll send the discount right over!`;
          } else if (lowerGoal.includes("book") || lowerGoal.includes("appointment") || lowerGoal.includes("call")) {
            aiText = `I'd be happy to help! ${aiKnowledge ? `Our ${aiKnowledge.slice(0, 20)}... is perfect for this.` : ''} Should we hop on a quick call to discuss further? What time works for you?`;
          } else {
            aiText = `I hear you! ${aiKnowledge ? `You should know that ${aiKnowledge.split('.')[0]}.` : 'I am here to guide you.'} To move forward, ${aiGoal ? aiGoal.toLowerCase().replace('get', 'we should try to').replace('mera goal hai', '') : 'shall we proceed'}?`;
          }
          
          setTestMessages(prev => [...prev, { 
            role: 'ai', 
            text: aiUseEmojis ? `${aiText} ✨` : aiText 
          }]);
          setIsTyping(false);
          return;
        } else {
          aiText = match ? match.a : "I'm still learning the specifics about this, but I'll make sure to note your question! Is there something else I can help with?";
        }
      }
      
      setTestMessages(prev => [...prev, { 
        role: 'ai', 
        text: getPersonaResponse(aiText, aiPersona, aiUseEmojis, isGreeting) 
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 animate-in fade-in zoom-in-95 duration-1000 w-full max-w-[280px] mx-auto">
      
      {/* Compact Segmented Switcher Tabs */}
      <div className="mb-3 flex p-1 bg-zinc-100 rounded-xl border border-zinc-200/50 shadow-none gap-0.5 max-w-full w-full">
         {strategy === "story_automator" ? (
            <>
              <button 
                onClick={() => setView('story')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all shrink-0 ${view === 'story' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                <Camera size={11} /> <span>Story</span>
              </button>
              <button 
                onClick={() => setView('dm')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all shrink-0 ${view === 'dm' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                <MessageSquare size={11} /> <span>DM</span>
              </button>
            </>
         ) : (
           <>
            <button 
              onClick={() => setView('post')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all shrink-0 ${view === 'post' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              <Layout size={11} /> <span>Post</span>
            </button>
            <button 
              onClick={() => setView('dm')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all shrink-0 ${view === 'dm' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              <MessageSquare size={11} /> <span>DM</span>
            </button>
            <button 
              onClick={() => setView('faq')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all shrink-0 ${view === 'faq' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              <MoreHorizontal size={11} /> <span>AI Sandbox</span>
            </button>
           </>
         )}
      </div>

      {/* iPhone Mockup Container */}
      <div className="relative w-[260px] h-[500px] bg-white border-[6px] border-zinc-950 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col">
        
        {/* Dynamic Island Notch */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-zinc-950 rounded-full z-30 flex items-center justify-center">
          <div className="w-1 h-1 bg-[#0a0a0c] rounded-full absolute right-2" />
        </div>

        {/* Status Bar */}
        <div className="h-8 bg-white flex items-center justify-between px-6 pt-1.5 shrink-0 relative z-20 select-none">
          <span className="text-[9px] font-bold text-zinc-900">9:41</span>
          <div className="flex items-center gap-1">
             <div className="w-3.5 h-2 bg-zinc-900 rounded-sm opacity-20" />
             <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full opacity-20" />
          </div>
        </div>

        {view === 'dm' && (
          <>
            <div className="px-4 py-2 border-b border-zinc-200/60 flex items-center gap-2 shrink-0 bg-white">
               <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 p-[1px] items-center justify-center flex shadow-sm">
                  <div className="w-full h-full bg-white rounded-full p-[0.5px]">
                      <div className="w-full h-full bg-zinc-100 rounded-full flex items-center justify-center text-[8px] font-semibold text-zinc-900 overflow-hidden">
                         {aiName[0]}
                      </div>
                  </div>
               </div>
               <div className="flex-1 truncate">
                  <p className="text-[10px] font-semibold text-zinc-900 leading-none truncate">{aiName}</p>
                  <p className="text-[8px] text-zinc-500 font-normal leading-none mt-0.5">Active now</p>
               </div>
               <div className="flex items-center gap-3 text-zinc-900">
                  <Phone size={14} />
                  <Video size={16} />
               </div>
            </div>

            <div className="flex-1 p-3 bg-white flex flex-col gap-3 overflow-y-auto no-scrollbar">
               <div className="text-[9px] text-zinc-400 font-semibold text-center my-2 capitalize">March 21, 9:41 am</div>

               {keyword && (
                 <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="max-w-[70%] bg-[#6366F1] text-white px-3 py-1.5 rounded-[16px] rounded-br-[3px] text-[10px] font-medium shadow-sm">
                     {keyword}
                    </div>
                    <span className="text-[7px] text-zinc-400 font-semibold mt-0.5 mr-0.5">Seen</span>
                 </div>
               )}

               {response && (
                 <div className="flex gap-1.5 animate-in fade-in slide-in-from-left-4 duration-500 items-end">
                    <div className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[7px] font-semibold text-zinc-900 shrink-0 shadow-sm">
                      {aiName[0]}
                    </div>
                    <div className="max-w-[75%] space-y-1.5">
                        {(() => {
                          const urlRegex = /(https?:\/\/[^\s]+)/g;
                          const scrapedUrls = (response || "").match(urlRegex);
                          const activeLink = buttonLink || (scrapedUrls && scrapedUrls[0]);
                          const buttonLabel = buttonText || "Get Access";
                          const textWithoutUrl = buttonLink ? response : (scrapedUrls ? response.replace(scrapedUrls[0], "").trim() : response);

                          const isFile = activeLink && (
                            activeLink.toLowerCase().endsWith('.pdf') || 
                            activeLink.toLowerCase().endsWith('.zip') || 
                            activeLink.toLowerCase().endsWith('.rar') ||
                            activeLink.toLowerCase().endsWith('.docx') ||
                            activeLink.toLowerCase().endsWith('.xlsx') ||
                            activeLink.toLowerCase().endsWith('.epub') ||
                            activeLink.includes('drive.google.com') || 
                            activeLink.includes('docs.google.com') ||
                            activeLink.includes('dropbox.com') || 
                            activeLink.includes('mediafire.com') ||
                            activeLink.includes('onedrive')
                          );

                          return (
                            <>
                                {activeLink ? (
                                  <div className="w-full bg-white border border-zinc-200/80 rounded-[18px] overflow-hidden shadow-sm animate-in zoom-in-95 duration-500">
                                     {!isFile && (
                                       <div className="aspect-[1.91/1] bg-[#6366F1]/5 flex items-center justify-center border-b border-zinc-100">
                                          <Send size={20} className="text-[#6366F1]" />
                                       </div>
                                     )}
                                     <div className="p-3 space-y-0.5">
                                        <h4 className="text-[10px] font-semibold text-zinc-900 leading-tight">{textWithoutUrl || "Exclusive Access! 🎁"}</h4>
                                        <p className="text-[8px] text-zinc-500 font-normal leading-tight">Tap below to access</p>
                                     </div>
                                     <div className="p-2 border-t border-zinc-100 flex items-center justify-center text-[9px] font-bold text-[#6366F1] hover:bg-[#6366F1]/5 transition-all">
                                        {buttonLabel} 🔗
                                     </div>
                                  </div>
                                ) : (
                                  <div className="bg-zinc-100 text-zinc-900 px-3 py-1.5 rounded-[16px] rounded-bl-[3px] text-[10px] font-medium leading-relaxed shadow-sm">
                                    {getPersonaResponse(response, aiPersona, aiUseEmojis)}
                                  </div>
                                )}
                            </>
                          );
                        })()}
                    </div>
                 </div>
               )}

                <div className="space-y-3 mt-1">
                  {testMessages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                       <div className={`max-w-[85%] px-3 py-1.5 text-[10.5px] font-medium leading-[1.35] shadow-sm ${
                         msg.role === 'user' 
                           ? 'bg-gradient-to-tr from-[#3897f0] to-[#00d2ff] text-white rounded-[16px] rounded-br-[3px]' 
                           : 'bg-[#efefef] text-zinc-900 rounded-[16px] rounded-bl-[3px]'
                       }`}>
                          {msg.text}
                       </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-1 animate-pulse ml-1.5">
                       <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                       <div className="w-1 h-1 bg-zinc-300 rounded-full" style={{ animationDelay: '0.2s' }} />
                       <div className="w-1 h-1 bg-zinc-300 rounded-full" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
                </div>

                <div className="flex-1" />
                
                {!keyword && !response && testMessages.length === 0 && (
                   <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-40">
                      <div className="w-10 h-10 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-200 shadow-sm">
                         <MessageCircle size={20} className="text-[#6366F1]" />
                      </div>
                      <p className="text-[9px] font-semibold text-zinc-900">Start typing to test DM ✨</p>
                   </div>
                )}
            </div>

            <div className="p-2 bg-white border-t border-zinc-200/60 shrink-0">
               <form onSubmit={handleSendTestMessage} className="bg-zinc-100 border border-zinc-200/50 rounded-[20px] px-3 py-1 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center text-white shrink-0">
                    <Camera size={12} />
                  </div>
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 bg-transparent border-none text-[10px] text-zinc-900 font-medium focus:ring-0 h-7"
                  />
                  <div className="flex items-center gap-2 text-zinc-900">
                    {chatInput.trim() ? (
                      <button type="submit" className="text-[#3897f0] font-bold text-xs">Send</button>
                    ) : (
                      <>
                        <Mic size={14} />
                        <ImageIcon size={14} />
                      </>
                    )}
                  </div>
               </form>
            </div>
          </>
        )}

        {view === 'faq' && (
          <>
            <div className="px-4 py-2 border-b border-zinc-200/60 flex items-center gap-2 shrink-0 bg-white">
               <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 p-[1px] items-center justify-center flex shadow-sm">
                  <div className="w-full h-full bg-white rounded-full p-[0.5px]">
                      <div className="w-full h-full bg-zinc-100 rounded-full flex items-center justify-center text-[8px] font-semibold text-zinc-900 overflow-hidden">
                         {aiName[0]}
                      </div>
                  </div>
               </div>
               <div className="flex-1 truncate">
                  <p className="text-[10px] font-semibold text-zinc-900 leading-none truncate">{aiName}</p>
                  <p className="text-[8px] text-zinc-500 font-normal leading-none mt-0.5">AI Assistant • Active</p>
               </div>
               <div className="flex items-center gap-3 text-zinc-900">
                  <Phone size={14} />
                  <Video size={16} />
               </div>
            </div>

            <div className="flex-1 p-3 bg-white flex flex-col gap-3 overflow-y-auto no-scrollbar">
               <div className="flex flex-col items-center gap-2 my-4 px-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100 mb-0.5">
                    <Brain size={20} className="text-zinc-400" />
                  </div>
                  <p className="text-[9px] text-zinc-400 font-medium leading-relaxed">
                    This is an <span className="text-zinc-900 font-bold">AI Interactive Preview</span>. 
                    Test how your persona sounds.
                  </p>
                  <div className="h-[1px] w-full bg-zinc-100" />
               </div>

               <div className="flex gap-1.5 animate-in fade-in slide-in-from-left-4 duration-500 items-end">
                  <div className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[7px] font-semibold text-zinc-900 shrink-0 shadow-sm">
                    {aiName[0]}
                  </div>
                  <div className="max-w-[75%] bg-zinc-100 text-zinc-900 px-3 py-1.5 rounded-[16px] rounded-bl-[3px] text-[10px] font-medium leading-relaxed shadow-sm">
                    {getPersonaResponse("Hi! I'm your AI assistant. Type a question below to test how I talk!", aiPersona, aiUseEmojis)}
                  </div>
               </div>

               <div className="space-y-3 mt-1">
                  {testMessages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                       <div className={`max-w-[85%] px-3 py-1.5 text-[10.5px] font-medium leading-[1.35] shadow-sm ${
                         msg.role === 'user' 
                           ? 'bg-gradient-to-tr from-[#3897f0] to-[#00d2ff] text-white rounded-[16px] rounded-br-[3px]' 
                           : 'bg-[#efefef] text-zinc-900 rounded-[16px] rounded-bl-[3px]'
                       }`}>
                          {msg.text}
                       </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-1 animate-pulse ml-1.5">
                       <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                       <div className="w-1 h-1 bg-zinc-300 rounded-full" style={{ animationDelay: '0.2s' }} />
                       <div className="w-1 h-1 bg-zinc-300 rounded-full" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
               </div>
            </div>

            <div className="p-3 bg-white border-t border-zinc-200/60 shrink-0">
               <form onSubmit={handleSendTestMessage} className="bg-[#efefef] rounded-[20px] px-3 py-1 flex items-center gap-2">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 bg-transparent border-none text-[11px] text-zinc-900 font-medium focus:ring-0 h-7"
                  />
                  <button type="submit" className={`text-[#3897f0] font-bold text-xs transition-all ${chatInput.trim() ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    Send
                  </button>
               </form>
            </div>
          </>
        )}

        {view === 'story' && (
          <div className="flex-1 bg-zinc-900 flex flex-col relative overflow-hidden group">
            {/* Story Progress Bars */}
            <div className="absolute top-1.5 inset-x-1.5 z-20 flex gap-0.5 px-0.5">
               <div className="h-0.5 flex-1 bg-white rounded-full" />
               <div className="h-0.5 flex-1 bg-white/30 rounded-full" />
               <div className="h-0.5 flex-1 bg-white/30 rounded-full" />
            </div>

            {/* Story Image Background */}
            <div className="absolute inset-0 opacity-40 select-none">
               <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=800&q=80" alt="story" className="w-full h-full object-cover" />
            </div>

            {/* Header */}
            <div className="relative z-10 p-3 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-[#6366F1] p-[0.5px]">
                    <div className="w-full h-full rounded-full bg-zinc-200 overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" alt="me" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-white flex items-center gap-1">
                      {aiName} <span className="w-1 h-1 bg-white/40 rounded-full" /> <span className="text-white/60 font-medium">9h</span>
                    </div>
                    <div className="text-[8px] text-white/40 font-medium">Sponsored</div>
                  </div>
               </div>
               <div className="flex items-center gap-2 text-white">
                  <MoreHorizontal size={16} />
                  <X size={16} />
               </div>
            </div>

            {/* Interaction Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
               {storyTriggerType === 'MENTION' && (
                 <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[24px] p-6 text-center space-y-3 animate-in zoom-in-95 duration-700">
                    <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-xl">
                       <Users size={24} className="text-[#6366F1]" />
                    </div>
                    <div>
                       <h4 className="text-white font-bold text-xs leading-tight">Someone tagged you!</h4>
                       <p className="text-white/60 text-[9px] mt-0.5">Auto DM will trigger on tags</p>
                    </div>
                 </div>
               )}
               
               {/* Chat Overlay for Replies */}
               <div className="w-full space-y-3">
                  {testMessages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                       <div className={`max-w-[85%] px-3 py-2 text-[10px] font-semibold leading-[1.35] shadow-lg ${
                         msg.role === 'user' 
                           ? 'bg-white text-zinc-950 rounded-[16px] rounded-br-[3px]' 
                           : 'bg-[#6366F1] text-white rounded-[16px] rounded-bl-[3px]'
                       }`}>
                          {msg.text}
                          {msg.role === 'ai' && buttonText && (
                            <div className="mt-1.5 pt-1.5 border-t border-white/20">
                              <div className="bg-white text-[#6366F1] py-1 px-2 rounded text-center text-[9px] font-bold shadow-sm">
                                {buttonText}
                              </div>
                            </div>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Footer / Reply Bar */}
            <div className="relative z-10 p-3 pb-6 space-y-3">
               <form onSubmit={handleSendTestMessage} className="flex items-center gap-2">
                  <div className="flex-1 h-9 rounded-full border border-white/30 bg-black/20 backdrop-blur-md px-3 flex items-center gap-2">
                     <input 
                       type="text"
                       value={chatInput}
                       onChange={(e) => setChatInput(e.target.value)}
                       placeholder="Send message..."
                       className="flex-1 bg-transparent border-none text-[10px] text-white placeholder:text-white/60 focus:ring-0"
                     />
                  </div>
                  <div className="flex items-center gap-3 text-white">
                     {chatInput.trim() ? (
                        <button type="submit" className="text-[#6366F1] font-bold text-[10px] bg-white px-3 py-1.5 rounded-full shadow-lg">Send</button>
                     ) : (
                        <>
                           <Heart size={18} />
                           <Send size={18} className="-rotate-12" />
                        </>
                     )}
                  </div>
               </form>
            </div>
          </div>
        )}

        {view === 'post' && (
          <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
            <div className="px-3 py-2 flex items-center justify-between border-b border-zinc-100">
               <div className="flex items-center gap-2 truncate">
                  <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[7px] font-semibold text-zinc-900 border border-zinc-200 overflow-hidden shadow-sm shrink-0">
                    {aiName[0]}
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-900 truncate">{aiName}</span>
               </div>
               <MoreHorizontal size={14} className="text-zinc-400 shrink-0" />
            </div>

            <div className="aspect-square bg-zinc-50 border-b border-zinc-100 overflow-hidden relative select-none">
              {postUrl ? (
                <img src={postUrl} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-500" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 p-6 text-center bg-zinc-50/50">
                  <Layout size={32} className="mb-1 text-zinc-300" />
                  <p className="text-[9px] font-semibold leading-relaxed">Select a post on the left to see it here</p>
                </div>
              )}
            </div>

            <div className="p-2.5 flex items-center justify-between border-b border-zinc-100 bg-white">
               <div className="flex items-center gap-3">
                  <Heart size={16} className="text-zinc-900" />
                  <MessageCircle size={16} className="text-zinc-900" />
                  <Send size={16} className="text-zinc-900" />
               </div>
               <Bookmark size={16} className="text-zinc-900" />
            </div>

            <div className="p-3.5 space-y-2 bg-white">
               <div className="text-[10px] font-semibold text-zinc-900">1,234 likes</div>
               <div className="text-[10px] leading-relaxed font-normal text-zinc-700">
                  <span className="font-semibold text-zinc-900 mr-1.5">{aiName}</span>
                  <span>Automate your growth with Automixa 🚀</span>
               </div>
               
               {keyword && (
                 <div className="pt-2 border-t border-zinc-200/60 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-start gap-2">
                       <div className="w-5 h-5 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-[7px] font-semibold shrink-0 shadow-sm">
                         User
                       </div>
                       <div className="flex-1">
                          <p className="text-[10px] font-semibold text-zinc-900 leading-tight">
                             <span className="mr-1.5 font-normal">follower_user</span>
                             <span className="text-[#6366F1]">{keyword}</span>
                          </p>
                          <p className="text-[8px] text-zinc-400 font-normal mt-0.5">1m • reply</p>
                       </div>
                       <Heart size={10} className="text-zinc-300" />
                    </div>
                 </div>
               )}

               {publicReply && (
                 <div className="ml-6 pt-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                    <div className="flex items-start gap-2">
                       <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center text-[6px] font-semibold text-zinc-900 shrink-0 border border-zinc-200 overflow-hidden shadow-sm">
                         {aiName[0]}
                       </div>
                       <div className="flex-1">
                          <p className="text-[10px] font-semibold text-zinc-900 leading-tight">
                             <span className="mr-1.5 font-semibold">{aiName}</span>
                             {publicReply}
                          </p>
                          <p className="text-[8px] text-zinc-400 font-normal mt-0.5">Just now • active</p>
                       </div>
                    </div>
                  </div>
               )}
            </div>
          </div>
        )}

        {/* Bottom Screen Bar */}
        <div className="h-4 flex items-center justify-center shrink-0 bg-white border-t border-zinc-100">
           <div className="w-16 h-1 bg-zinc-900 rounded-full opacity-20" />
        </div>

      </div>
    </div>
  );
}
