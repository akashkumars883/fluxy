"use client";

import { Bookmark,Brain,Camera,Heart,Image as ImageIcon,Layout,MessageCircle,MessageSquare,Mic,MoreHorizontal,Phone,Send,Smile,Users,Video,X } from "lucide-react";
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
          // Direct match or synonym match
          if (userMsg.includes(q) || q.includes(userMsg)) return true;
          
          // Check if any key in synonymMap exists in the question, 
          // and if its synonyms exist in the user message
          for (let key in synonymMap) {
            if (q.includes(key) && synonymMap[key].some(syn => userMsg.includes(syn))) return true;
          }
          return false;
        });

        if (strategy === "sales_closer") {
          const lowerGoal = aiGoal.toLowerCase();
          // SUCCESS CHECK: If user provides an email
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
    <div className="flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-1000 w-full max-w-sm mx-auto">
      
      <div className="mb-6 flex p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-zinc-200 shadow-sm gap-1 overflow-x-auto no-scrollbar max-w-full">
         {strategy === "story_automator" ? (
            <>
              <button 
                onClick={() => setView('story')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${view === 'story' ? 'bg-[#6366F1] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                <Camera size={14} /> <span>Story View</span>
              </button>
              <button 
                onClick={() => setView('dm')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${view === 'dm' ? 'bg-[#6366F1] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                <MessageSquare size={14} /> <span>DM View</span>
              </button>
            </>
         ) : (
           <>
            <button 
              onClick={() => setView('post')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${view === 'post' ? 'bg-[#6366F1] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              <Layout size={14} /> <span>Post</span>
            </button>
            <button 
              onClick={() => setView('dm')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${view === 'dm' ? 'bg-[#6366F1] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              <MessageSquare size={14} /> <span>DM</span>
            </button>
            <button 
              onClick={() => setView('faq')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${view === 'faq' ? 'bg-[#6366F1] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              <MoreHorizontal size={14} /> <span>AI Sandbox</span>
            </button>
           </>
         )}
      </div>

      <div className="relative w-[300px] h-[600px] bg-white border-[8px] border-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
        
        <div className="h-10 bg-white flex items-center justify-between px-8 pt-2 shrink-0">
          <span className="text-[10px] font-semibold text-zinc-900">9:41</span>
          <div className="flex items-center gap-1.5">
             <div className="w-4 h-2 bg-zinc-900 rounded-sm opacity-20" />
             <div className="w-3 h-3 bg-zinc-900 rounded-full opacity-20" />
          </div>
        </div>

        {view === 'dm' && (
          <>
            <div className="px-5 py-4 border-b border-zinc-200/60 flex items-center gap-3 shrink-0 bg-white">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 p-[1.5px] items-center justify-center flex shadow-sm">
                  <div className="w-full h-full bg-white rounded-full p-[1px]">
                      <div className="w-full h-full bg-zinc-100 rounded-full flex items-center justify-center text-[10px] font-semibold text-zinc-900 overflow-hidden">
                         {aiName[0]}
                      </div>
                  </div>
               </div>
               <div className="flex-1 truncate">
                  <p className="text-[11px] font-semibold text-zinc-900 leading-none truncate">{aiName}</p>
                  <p className="text-[9px] text-zinc-500 font-normal leading-none mt-1">Active now</p>
               </div>
               <div className="flex items-center gap-4 text-zinc-900">
                  <Phone size={18} />
                  <Video size={20} />
               </div>
            </div>

            <div className="flex-1 p-4 bg-white flex flex-col gap-4 overflow-y-auto no-scrollbar">
               <div className="text-[10px] text-zinc-400 font-semibold text-center my-4 capitalize">March 21, 9:41 am</div>

               {keyword && (
                 <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="max-w-[70%] bg-[#6366F1] text-white px-4 py-2.5 rounded-[22px] rounded-br-[4px] text-[11px] font-semibold shadow-sm">
                     {keyword}
                   </div>
                   <span className="text-[8px] text-zinc-400 font-semibold mt-1 mr-1">Seen</span>
                 </div>
               )}

               {response && (
                 <div className="flex gap-2 animate-in fade-in slide-in-from-left-4 duration-500 items-end">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[8px] font-semibold text-zinc-900 shrink-0 shadow-sm">
                      {aiName[0]}
                    </div>
                    {(() => {
                      const urlRegex = /(https?:\/\/[^\s]+)/g;
                      const scrapedUrls = (response || "").match(urlRegex);
                      const activeLink = buttonLink || (scrapedUrls && scrapedUrls[0]);
                      const buttonLabel = buttonText || "Get Access";
                      const textWithoutUrl = buttonLink ? response : (scrapedUrls ? response.replace(scrapedUrls[0], "").trim() : response);

                      // Robust file/drive link check for visual preview
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
                        <div className="max-w-[75%] space-y-2">
                            {activeLink ? (
                              <div className="w-full bg-white border border-zinc-200/80 rounded-[24px] overflow-hidden shadow-sm animate-in zoom-in-95 duration-500">
                                 {!isFile && (
                                   <div className="aspect-[1.91/1] bg-[#6366F1]/5 flex items-center justify-center border-b border-zinc-100">
                                      <Send size={24} className="text-[#6366F1]" />
                                   </div>
                                 )}
                                 <div className="p-4 space-y-1">
                                    <h4 className="text-[11px] font-semibold text-zinc-900 leading-tight">{textWithoutUrl || "Exclusive Access! 🎁"}</h4>
                                    <p className="text-[9px] text-zinc-500 font-normal leading-tight">Tap below to access</p>
                                 </div>
                                 <div className="p-3 border-t border-zinc-100 flex items-center justify-center text-[10px] font-semibold text-[#6366F1] hover:bg-[#6366F1]/5 transition-all">
                                    {buttonLabel} 🔗
                                 </div>
                              </div>
                            ) : (
                              <div className="bg-zinc-100 text-zinc-900 px-4 py-2.5 rounded-[22px] rounded-bl-[4px] text-[11px] font-semibold leading-relaxed shadow-sm">
                                {getPersonaResponse(response, aiPersona, aiUseEmojis)}
                              </div>
                            )}
                        </div>
                      );
                    })()}
                 </div>
               )}

                <div className="space-y-4 mt-2">
                  {testMessages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                       <div className={`max-w-[85%] px-4 py-2.5 text-[12px] font-medium leading-[1.4] shadow-sm ${
                         msg.role === 'user' 
                           ? 'bg-gradient-to-tr from-[#3897f0] to-[#00d2ff] text-white rounded-[20px] rounded-br-[4px]' 
                           : 'bg-[#efefef] text-zinc-900 rounded-[20px] rounded-bl-[4px]'
                       }`}>
                         {msg.text}
                       </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-1 animate-pulse ml-2">
                       <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                       <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" style={{ animationDelay: '0.2s' }} />
                       <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
                </div>

                <div className="flex-1" />
                
                {!keyword && !response && testMessages.length === 0 && (
                   <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
                      <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-200 shadow-sm">
                         <MessageCircle size={24} className="text-[#6366F1]" />
                      </div>
                      <p className="text-[10px] font-semibold text-zinc-900">Start typing to test your DM ✨</p>
                   </div>
                )}
            </div>

            <div className="p-3 bg-white border-t border-zinc-200/60 shrink-0">
               <form onSubmit={handleSendTestMessage} className="bg-zinc-100 border border-zinc-200/50 rounded-[24px] px-4 py-1.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#6366F1] flex items-center justify-center text-white shrink-0">
                    <Camera size={16} />
                  </div>
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 bg-transparent border-none text-[12px] text-zinc-900 font-medium focus:ring-0 h-9"
                  />
                  <div className="flex items-center gap-3 text-zinc-900">
                    {chatInput.trim() ? (
                      <button type="submit" className="text-[#3897f0] font-bold text-sm">Send</button>
                    ) : (
                      <>
                        <Mic size={18} />
                        <ImageIcon size={18} />
                        <Smile size={18} />
                      </>
                    )}
                  </div>
               </form>
            </div>
          </>
        )}

        {view === 'faq' && (
          <>
            <div className="px-5 py-4 border-b border-zinc-200/60 flex items-center gap-3 shrink-0 bg-white">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 p-[1.5px] items-center justify-center flex shadow-sm">
                  <div className="w-full h-full bg-white rounded-full p-[1px]">
                      <div className="w-full h-full bg-zinc-100 rounded-full flex items-center justify-center text-[10px] font-semibold text-zinc-900 overflow-hidden">
                         {aiName[0]}
                      </div>
                  </div>
               </div>
               <div className="flex-1 truncate">
                  <p className="text-[11px] font-semibold text-zinc-900 leading-none truncate">{aiName}</p>
                  <p className="text-[9px] text-zinc-500 font-normal leading-none mt-1">AI Assistant • Active</p>
               </div>
               <div className="flex items-center gap-4 text-zinc-900">
                  <Phone size={18} />
                  <Video size={20} />
               </div>
            </div>

            <div className="flex-1 p-4 bg-white flex flex-col gap-4 overflow-y-auto no-scrollbar">
               <div className="flex flex-col items-center gap-3 my-6 px-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100 mb-1">
                    <Brain size={24} className="text-zinc-400" />
                  </div>
                  <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                    This is an <span className="text-zinc-900 font-bold">AI Interactive Preview</span>. 
                    Test how your persona sounds before launching.
                  </p>
                  <div className="h-[1px] w-full bg-zinc-100" />
               </div>

               <div className="flex gap-2 animate-in fade-in slide-in-from-left-4 duration-500 items-end">
                  <div className="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[8px] font-semibold text-zinc-900 shrink-0 shadow-sm">
                    {aiName[0]}
                  </div>
                  <div className="max-w-[75%] bg-zinc-100 text-zinc-900 px-4 py-2.5 rounded-[22px] rounded-bl-[4px] text-[11px] font-semibold leading-relaxed shadow-sm">
                    {getPersonaResponse("Hi! I'm your AI assistant. Type a question below to test how I talk!", aiPersona, aiUseEmojis)}
                  </div>
               </div>

               <div className="space-y-4 mt-2">
                 {testMessages.map((msg, i) => (
                   <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`max-w-[85%] px-4 py-2.5 text-[12px] font-medium leading-[1.4] shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-tr from-[#3897f0] to-[#00d2ff] text-white rounded-[20px] rounded-br-[4px]' 
                          : 'bg-[#efefef] text-zinc-900 rounded-[20px] rounded-bl-[4px]'
                      }`}>
                        {msg.text}
                      </div>
                   </div>
                 ))}
                 
                 {isTyping && (
                   <div className="flex gap-1 animate-pulse ml-2">
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" style={{ animationDelay: '0.4s' }} />
                   </div>
                 )}
               </div>
            </div>

            <div className="p-4 bg-white border-t border-zinc-200/60 shrink-0">
               <form onSubmit={handleSendTestMessage} className="bg-[#efefef] rounded-[24px] px-4 py-1.5 flex items-center gap-3">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 bg-transparent border-none text-[13px] text-zinc-900 font-medium focus:ring-0 h-9"
                  />
                  <button type="submit" className={`text-[#3897f0] font-bold text-sm transition-all ${chatInput.trim() ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    Send
                  </button>
               </form>
            </div>
          </>
        )}

        {view === 'story' && (
          <div className="flex-1 bg-zinc-900 flex flex-col relative overflow-hidden group">
            {/* Story Progress Bars */}
            <div className="absolute top-2 inset-x-2 z-20 flex gap-1 px-1">
               <div className="h-0.5 flex-1 bg-white rounded-full" />
               <div className="h-0.5 flex-1 bg-white/30 rounded-full" />
               <div className="h-0.5 flex-1 bg-white/30 rounded-full" />
            </div>

            {/* Story Image Background */}
            <div className="absolute inset-0 opacity-40">
               <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=800&q=80" alt="story" className="w-full h-full object-cover" />
            </div>

            {/* Header */}
            <div className="relative z-10 p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-[#6366F1] p-0.5">
                    <div className="w-full h-full rounded-full bg-zinc-200 overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" alt="me" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white flex items-center gap-1">
                      {aiName} <span className="w-1 h-1 bg-white/40 rounded-full" /> <span className="text-white/60 font-medium">9h</span>
                    </div>
                    <div className="text-[9px] text-white/40 font-medium">Sponsored</div>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <MoreHorizontal size={20} className="text-white" />
                  <X size={20} className="text-white" />
               </div>
            </div>

            {/* Interaction Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
               {storyTriggerType === 'MENTION' && (
                 <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 text-center space-y-4 animate-in zoom-in-95 duration-700">
                    <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-2xl">
                       <Users size={32} className="text-[#6366F1]" />
                    </div>
                    <div>
                       <h4 className="text-white font-bold text-sm leading-tight">Someone mentioned you!</h4>
                       <p className="text-white/60 text-[10px] mt-1">Automation will trigger when followers tag you</p>
                    </div>
                 </div>
               )}
               
               {/* Chat Overlay for Replies */}
               <div className="w-full space-y-4">
                  {testMessages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                       <div className={`max-w-[85%] px-4 py-2.5 text-[11px] font-semibold leading-[1.4] shadow-lg ${
                         msg.role === 'user' 
                           ? 'bg-white text-zinc-950 rounded-[20px] rounded-br-[4px]' 
                           : 'bg-[#6366F1] text-white rounded-[20px] rounded-bl-[4px]'
                       }`}>
                         {msg.text}
                         {msg.role === 'ai' && buttonText && (
                           <div className="mt-2 pt-2 border-t border-white/20">
                             <div className="bg-white text-[#6366F1] py-1.5 px-3 rounded-lg text-center text-[10px] font-bold shadow-sm">
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
            <div className="relative z-10 p-4 pb-8 space-y-4">
               <form onSubmit={handleSendTestMessage} className="flex items-center gap-3">
                  <div className="flex-1 h-11 rounded-full border border-white/30 bg-black/20 backdrop-blur-md px-4 flex items-center gap-3">
                     <input 
                       type="text"
                       value={chatInput}
                       onChange={(e) => setChatInput(e.target.value)}
                       placeholder="Send message..."
                       className="flex-1 bg-transparent border-none text-[12px] text-white placeholder:text-white/60 focus:ring-0"
                     />
                  </div>
                  <div className="flex items-center gap-4 text-white">
                     {chatInput.trim() ? (
                        <button type="submit" className="text-[#6366F1] font-bold text-xs bg-white px-4 py-2 rounded-full shadow-lg">Send</button>
                     ) : (
                        <>
                           <Heart size={24} />
                           <Send size={24} className="-rotate-12" />
                        </>
                     )}
                  </div>
               </form>
            </div>
          </div>
        )}

        {view === 'post' && (
          <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
            <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-100">
               <div className="flex items-center gap-2 truncate">
                  <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-[8px] font-semibold text-zinc-900 border border-zinc-200 overflow-hidden shadow-sm shrink-0">
                    {aiName[0]}
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-900 truncate">{aiName}</span>
               </div>
               <MoreHorizontal size={16} className="text-zinc-400 shrink-0" />
            </div>

            <div className="aspect-square bg-zinc-50 border-b border-zinc-100 overflow-hidden relative">
              {postUrl ? (
                <img src={postUrl} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-500" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 p-8 text-center bg-zinc-50/50">
                  <Layout size={40} className="mb-2 text-zinc-300" />
                  <p className="text-[10px] font-semibold leading-relaxed">Select a post on the left to see it here</p>
                </div>
              )}
            </div>

            <div className="p-3 flex items-center justify-between border-b border-zinc-100 bg-white">
               <div className="flex items-center gap-4">
                  <Heart size={20} className="text-zinc-900" />
                  <MessageCircle size={20} className="text-zinc-900" />
                  <Send size={20} className="text-zinc-900" />
               </div>
               <Bookmark size={20} className="text-zinc-900" />
            </div>

            <div className="p-4 space-y-3 bg-white">
               <div className="text-[11px] font-semibold text-zinc-900">1,234 likes</div>
               <div className="text-[11px] leading-relaxed font-normal text-zinc-700">
                  <span className="font-semibold text-zinc-900 mr-2">{aiName}</span>
                  <span>Automate your growth with Automixa 🚀</span>
               </div>
               
               {keyword && (
                 <div className="pt-3 border-t border-zinc-200/60 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-start gap-2.5">
                       <div className="w-6 h-6 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-[7px] font-semibold shrink-0 shadow-sm">
                         User
                       </div>
                       <div className="flex-1">
                          <p className="text-[11px] font-semibold text-zinc-900 leading-tight">
                             <span className="mr-2 font-normal">follower_user</span>
                             <span className="text-[#6366F1]">{keyword}</span>
                          </p>
                          <p className="text-[9px] text-zinc-400 font-normal mt-1">1m • reply</p>
                       </div>
                       <Heart size={12} className="text-zinc-300" />
                    </div>
                 </div>
               )}

               {publicReply && (
                 <div className="ml-8 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                    <div className="flex items-start gap-2.5">
                       <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center text-[6px] font-semibold text-zinc-900 shrink-0 border border-zinc-200 overflow-hidden shadow-sm">
                         {aiName[0]}
                       </div>
                       <div className="flex-1">
                          <p className="text-[11px] font-semibold text-zinc-900 leading-tight">
                             <span className="mr-2 font-semibold">{aiName}</span>
                             {publicReply}
                          </p>
                          <p className="text-[9px] text-zinc-400 font-normal mt-1">Just now • active</p>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}

        <div className="h-6 flex items-center justify-center shrink-0 bg-white border-t border-zinc-100">
           <div className="w-24 h-1 bg-zinc-900 rounded-full opacity-20" />
        </div>

      </div>
      
      <div className="mt-6 text-center flex flex-col items-center">
         <div className="px-4 py-2 bg-white border border-zinc-200 rounded-full flex items-center gap-2 text-[10px] font-semibold text-zinc-700 shadow-sm capitalize">
            {view === 'dm' ? <MessageSquare size={12} className="text-[#6366F1]" /> : view === 'faq' ? <MoreHorizontal size={12} className="text-[#6366F1]" /> : view === 'story' ? <Camera size={12} className="text-[#6366F1]" /> : <Layout size={12} className="text-[#6366F1]" />} 
            <span>Live {view === 'dm' ? 'Direct Message' : view === 'faq' ? 'AI Sandbox' : view === 'story' ? 'Story Automator' : 'Instagram Post'} Preview</span>
         </div>
      </div>
    </div>
  );
}
