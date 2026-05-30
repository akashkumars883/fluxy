"use client";

import { useState, useEffect, useRef } from "react";

import { AnimatePresence,motion } from "framer-motion";
import {
ArrowLeft,
ArrowRight,
Brain,
Check,
Globe,
Heart,
MessageSquare,
Plus,
Rocket,
ShieldCheck,
Target,
Trash2,
Users,
Zap
} from "lucide-react";
import AutomationPreview from "./AutomationPreview";

export default function CampaignWizard({ step = 1, onStepChange, onPublish, onChange, onBack, values, media = [], stories = [], selectedPosts = [], onSelectPosts, currentPlan = "free", onUpgradeClick, campaignName }) {
  const {
    keyword = "",
    response = "",
    followerGate = false,
    publicReply = "",
    buttonText = "",
    buttonLink = "",
    campaignStrategy = "comment_dm",
    faqs = [],
    aiGoal = "",
    aiPersona = "friendly",
    aiUseEmojis = true
  } = values;

  const handleStepChange = (newStep) => {
    if (onStepChange) onStepChange(newStep);
  };

  const renderStepHeader = () => {
    return (
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-100 select-none">
        <button
          type="button"
          onClick={() => step > 1 ? handleStepChange(step - 1) : onBack()}
          className="p-2.5 bg-zinc-50 border border-zinc-150 hover:bg-zinc-100 rounded-xl text-zinc-500 hover:text-zinc-950 transition-all shadow-sm shrink-0"
        >
          <ArrowLeft size={16} />
        </button>
        {campaignStrategy === "comment_dm" && (
          <div className="flex-1 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all duration-700 ${s <= step ? 'bg-[#6366F1] shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'bg-zinc-100'}`}
              />
            ))}
          </div>
        )}
        {campaignStrategy === "story_automator" && (
          <div className="flex-1 flex gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all duration-700 ${s <= step ? 'bg-[#6366F1] shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'bg-zinc-100'}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Helper to render the appropriate flow based on strategy
  const renderFlow = () => {
    switch (campaignStrategy) {
      case "faq_assistant":
        return renderFAQFlow();
      case "sales_closer":
        return renderSalesFlow();
      case "story_automator":
        return renderStoryFlow();
      default:
        return renderCommentDMFlow();
    }
  };

  // --- FLOW 1: COMMENT & DM AUTOMATOR ---
  // Internal chat state for Chat-to-Build flow
  // Internal chat state for Chat-to-Build flow
  const [chatStep, setChatStep] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { id: '1', role: 'ai', text: "Hi! Let's build your automation. Which post do you want to automate?" }
  ]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, chatStep, isTyping]);

  const [tempKeyword, setTempKeyword] = useState(keyword || "");
  const [tempResponse, setTempResponse] = useState(response || "");
  const [tempBtnText, setTempBtnText] = useState(buttonText || "");
  const [tempBtnLink, setTempBtnLink] = useState(buttonLink || "");
  const [tempPublicReply, setTempPublicReply] = useState(publicReply || "");

  const simulateAiTyping = (text, nextStep) => {
    setChatStep(0); // hide input
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'ai', text }]);
      if (nextStep) setChatStep(nextStep);
    }, 1500); // 1.5s typing delay
  };

  const handleConfirmPosts = () => {
    if (selectedPosts.length === 0) return;
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', text: `Selected ${selectedPosts.length} post(s).` }]);
    simulateAiTyping("Great! What keyword should trigger the automation? You can select a suggestion below or type your own.", 2);
  };

  const handleConfirmKeyword = (kw) => {
    const finalKw = kw || tempKeyword;
    if (!finalKw) return;
    onChange({ keyword: finalKw });
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', text: `Keyword: "${finalKw}"` }]);
    simulateAiTyping(`Awesome. When someone comments "${finalKw}", what private DM should I send them?`, 3);
  };

  const handleConfirmResponse = () => {
    if (!tempResponse) return;
    onChange({ response: tempResponse });
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', text: `${tempResponse}` }]);
    simulateAiTyping("Do you want to add a button with a link to this DM? Type the text and link, or click Skip.", 4);
  };

  const handleConfirmCTA = (skipped) => {
    if (!skipped && (!tempBtnText || !tempBtnLink)) return;
    onChange({ buttonText: skipped ? "" : tempBtnText, buttonLink: skipped ? "" : tempBtnLink });
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', text: skipped ? "Skip button" : `Button: ${tempBtnText} -> ${tempBtnLink}` }]);
    simulateAiTyping("Perfect! And what should I publicly reply to their comment? (e.g. 'Check your DMs!')", 5);
  };

  const handleConfirmPublicReply = () => {
    if (!tempPublicReply) return;
    onChange({ publicReply: tempPublicReply });
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', text: `${tempPublicReply}` }]);
    simulateAiTyping("Almost done! Do you want to enable 'Follow Gate'? (Users must follow your page to receive the DM).", 6);
  };

  const handleConfirmFollowGate = (enable) => {
    onChange({ followerGate: enable });
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', text: enable ? "Yes, enable Follow Gate" : "No, skip Follow Gate" }]);
    simulateAiTyping("All set! Here is a preview of your automation. Click Confirm to Launch.", 7);
  };

  const renderCommentDMFlow = () => {
    return (
      <div className="flex flex-col overflow-hidden h-full w-full max-w-4xl mx-auto relative pb-2">
        
        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 space-y-8 no-scrollbar pb-40">
          
          {/* ChatGPT Style Initial Header */}
          {chatHistory.length === 1 && !isTyping && (
            <div className="flex flex-col items-center justify-center pt-10 pb-6 text-center animate-in fade-in zoom-in duration-500">
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">Automixa AI Assistant</h2>
              <p className="text-[15px] text-zinc-500 max-w-md">I will guide you step-by-step to build your perfect automation.</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {chatHistory.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 sm:gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[75%] text-[15px] sm:text-[16px] leading-relaxed ${msg.role === 'user' ? 'bg-[#6366F1] text-white px-5 py-3.5 rounded-[24px] rounded-br-[4px] shadow-sm' : 'text-zinc-800 pt-2'}`}>
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0">{line}</p>
                  ))}
                  
                  {/* Step 1: Render Post Picker directly in AI's first message if active */}
                  {msg.id === '1' && chatStep === 1 && (
                    <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar pr-4">
                        <button onClick={() => onSelectPosts([])} className={`relative flex-shrink-0 w-24 sm:w-32 aspect-square rounded-[16px] border-2 transition-all flex flex-col items-center justify-center gap-2 ${selectedPosts.length === 0 ? 'border-[#6366F1] bg-[#6366F1]/5 text-[#6366F1] shadow-sm' : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-500'}`}>
                          <Globe size={24} />
                          <span className="text-[12px] font-bold">All Posts</span>
                        </button>
                        {media.map((item) => {
                           const displayUrl = (item.media_type === "VIDEO" || item.media_product_type === "REELS") ? (item.thumbnail_url || item.media_url) : item.media_url;
                           const isSelected = selectedPosts.includes(item.id);
                           return (
                             <button 
                               key={item.id} 
                               onClick={() => onSelectPosts(isSelected ? selectedPosts.filter(id => id !== item.id) : [...selectedPosts, item.id])} 
                               className={`relative flex-shrink-0 w-24 sm:w-32 aspect-square rounded-[16px] overflow-hidden border-2 transition-all ${isSelected ? 'border-[#6366F1] scale-95 shadow-md' : 'border-zinc-200 opacity-80 hover:opacity-100 hover:border-zinc-300'}`}
                             >
                               <img src={displayUrl} alt="post" className="w-full h-full object-cover" />
                               {isSelected && (
                                 <div className="absolute top-2 right-2 w-5 h-5 bg-[#6366F1] rounded-full flex items-center justify-center shadow-md">
                                   <Check size={12} className="text-white" />
                                 </div>
                               )}
                             </button>
                           );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 7: Final Preview injected in the last AI message */}
                  {msg.id === chatHistory[chatHistory.length - 1].id && chatStep === 7 && (
                    <div className="mt-8 mb-4 max-w-sm w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="scale-[0.85] origin-top">
                        <AutomationPreview 
                          keyword={keyword}
                          response={response}
                          type={values.type || "COMMENT"}
                          buttonText={buttonText}
                          buttonLink={buttonLink}
                          publicReply={publicReply}
                          postUrl={values.type === "COMMENT" ? null : null}
                          aiName={campaignName || "Automixa AI"}
                          strategy="comment_dm"
                          faqs={faqs}
                          aiPersona={aiPersona}
                          aiUseEmojis={aiUseEmojis}
                          aiGoal={aiGoal}
                          aiKnowledge={values.aiKnowledge}
                        />
                      </div>
                      <button
                        onClick={() => onPublish(keyword, response, { public_reply: publicReply, follower_gate: followerGate, button_text: buttonText, button_link: buttonLink })}
                        className="w-full mt-4 py-4 bg-[#6366F1] text-white rounded-[16px] text-[16px] font-bold shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                      >
                        Confirm & Launch <Rocket size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 sm:gap-6 justify-start">
                <div className="pt-2 flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Floating Input Area (ChatGPT Style) */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#fafafa] via-[#fafafa] to-transparent pt-10 pb-6 px-4 sm:px-8 pointer-events-none">
          <div className="max-w-3xl mx-auto w-full pointer-events-auto">
            <AnimatePresence mode="wait">
              {chatStep === 1 && (
                <motion.div key="input1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                  <button onClick={handleConfirmPosts} disabled={selectedPosts.length === 0} className="w-full py-4 bg-zinc-900 text-white rounded-[20px] text-[16px] font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg">
                    Confirm Selection <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}

              {chatStep === 2 && (
                <motion.div key="input2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="space-y-3">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {['PRICE', 'LINK', 'GUIDE', 'YES', 'VIP'].map(sg => (
                      <button key={sg} onClick={() => handleConfirmKeyword(sg)} className="shrink-0 px-4 py-2 bg-white border border-zinc-200 hover:border-[#6366F1] rounded-full text-[14px] font-semibold text-zinc-700 shadow-sm transition-all">
                        {sg}
                      </button>
                    ))}
                  </div>
                  <div className="relative flex items-center w-full bg-white border border-zinc-300 rounded-[24px] shadow-lg overflow-hidden focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/20 transition-all">
                    <input 
                      type="text" 
                      value={tempKeyword} 
                      onChange={(e) => setTempKeyword(e.target.value)} 
                      placeholder="Type custom keyword..." 
                      className="flex-1 w-full px-6 py-4 text-[16px] outline-none bg-transparent"
                      onKeyDown={(e) => e.key === 'Enter' && tempKeyword && handleConfirmKeyword()}
                    />
                    <button onClick={() => handleConfirmKeyword()} disabled={!tempKeyword} className="absolute right-2 w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-zinc-300 transition-all">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {chatStep === 3 && (
                <motion.div key="input3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="relative flex items-end w-full bg-white border border-zinc-300 rounded-[24px] shadow-lg focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/20 transition-all p-2">
                  <textarea 
                    value={tempResponse} 
                    onChange={(e) => setTempResponse(e.target.value)} 
                    placeholder="Type DM message..." 
                    rows={1}
                    className="flex-1 w-full px-4 py-3 text-[16px] outline-none bg-transparent resize-none max-h-32 min-h-[48px]"
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleConfirmResponse(); } }}
                  />
                  <button onClick={handleConfirmResponse} disabled={!tempResponse} className="shrink-0 mb-1 w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-zinc-300 transition-all">
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}

              {chatStep === 4 && (
                <motion.div key="input4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-white border border-zinc-300 rounded-[24px] shadow-lg p-3 space-y-3">
                  <div className="flex gap-2">
                    <input type="text" placeholder="Button Name (e.g. Shop Now)" value={tempBtnText} onChange={(e) => setTempBtnText(e.target.value)} className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-[16px] text-[15px] outline-none" />
                    <input type="text" placeholder="URL (https://...)" value={tempBtnLink} onChange={(e) => setTempBtnLink(e.target.value)} className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-[16px] text-[15px] outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleConfirmCTA(true)} className="flex-1 py-3.5 bg-zinc-100 text-zinc-700 rounded-[16px] font-bold transition-all">Skip Button</button>
                    <button onClick={() => handleConfirmCTA(false)} disabled={!tempBtnText || !tempBtnLink} className="flex-1 py-3.5 bg-zinc-900 text-white rounded-[16px] font-bold disabled:opacity-50 transition-all">Add Button</button>
                  </div>
                </motion.div>
              )}

              {chatStep === 5 && (
                <motion.div key="input5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="relative flex items-end w-full bg-white border border-zinc-300 rounded-[24px] shadow-lg p-2 focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/20 transition-all">
                  <textarea 
                    value={tempPublicReply} 
                    onChange={(e) => setTempPublicReply(e.target.value)} 
                    placeholder="Type public comment reply..." 
                    rows={1}
                    className="flex-1 w-full px-4 py-3 text-[16px] outline-none bg-transparent resize-none max-h-32 min-h-[48px]"
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleConfirmPublicReply(); } }}
                  />
                  <button onClick={handleConfirmPublicReply} disabled={!tempPublicReply} className="shrink-0 mb-1 w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-zinc-300 transition-all">
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}

              {chatStep === 6 && (
                <motion.div key="input6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex justify-center gap-3">
                  <button onClick={() => handleConfirmFollowGate(false)} className="px-8 py-3.5 bg-white border border-zinc-200 text-zinc-700 rounded-full font-bold shadow-md hover:bg-zinc-50 transition-all">No, Skip</button>
                  <button onClick={() => handleConfirmFollowGate(true)} className="px-8 py-3.5 bg-zinc-900 text-white rounded-full font-bold shadow-md hover:bg-zinc-800 transition-all">Yes, Enable</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  // --- FLOW 2: AI FAQ ASSISTANT ---
  const renderFAQFlow = () => {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 relative">
        <div className={`bg-white border border-zinc-200/60 rounded-[20px] sm:rounded-[24px] p-4 sm:p-8 shadow-xl shadow-zinc-200/20 space-y-8`}>
          {renderStepHeader()}
          <div className="text-start">
            <h3 className="text-2xl font-bold text-zinc-950 tracking-tighter">Train Your AI Assistant</h3>
            <p className="text-[13px] font-medium text-zinc-500 mt-1.5">Add common questions and their answers to train your AI.</p>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
            {faqs.map((faq, idx) => (
              <div key={idx} className="group relative p-5 bg-white border-2 border-zinc-100 hover:border-zinc-200 rounded-[18px] space-y-3 transition-colors">
                <button
                  onClick={() => {
                    const newFaqs = faqs.filter((_, i) => i !== idx);
                    onChange({ faqs: newFaqs });
                  }}
                  className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-[10px] transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
                <input
                  type="text"
                  value={faq.q}
                  onChange={(e) => {
                    const newFaqs = [...faqs];
                    newFaqs[idx].q = e.target.value;
                    onChange({ faqs: newFaqs });
                  }}
                  placeholder="Question (e.g. What is your shipping time?)"
                  className="w-full bg-transparent border-none text-[15px] font-bold text-zinc-950 pr-10 focus:ring-0 focus:outline-none placeholder:font-medium placeholder:text-zinc-400"
                />
                <textarea
                  value={faq.a}
                  onChange={(e) => {
                    const newFaqs = [...faqs];
                    newFaqs[idx].a = e.target.value;
                    onChange({ faqs: newFaqs });
                  }}
                  rows={2}
                  placeholder="Answer..."
                  className="w-full bg-transparent border-none text-[14px] font-medium text-zinc-600 focus:ring-0 focus:outline-none resize-none placeholder:text-zinc-400"
                />
              </div>
            ))}
            <button onClick={() => onChange({ faqs: [...faqs, { q: "", a: "" }] })} className="w-full py-4 border-2 border-dashed border-zinc-200 rounded-[18px] text-[13px] font-bold text-zinc-500 hover:border-[#6366F1] hover:text-[#6366F1] hover:bg-[#6366F1]/5 transition-all flex items-center justify-center gap-2">
              <Plus size={16} strokeWidth={3} /> Add New FAQ
            </button>
          </div>

          <div className="space-y-5 border-t border-zinc-100 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-zinc-950">AI Tone & Persona</h4>
                <p className="text-[13px] font-medium text-zinc-500">How should your AI talk to users?</p>
              </div>

              <div className="flex items-center gap-3 p-2 px-3 bg-zinc-50 rounded-[14px] border border-zinc-100">
                <span className="text-[13px] font-bold text-zinc-700">Use Emojis</span>
                <button
                  onClick={() => onChange({ aiUseEmojis: !aiUseEmojis })}
                  className={`w-10 h-5 rounded-full transition-all relative ${aiUseEmojis ? 'bg-[#6366F1] shadow-md shadow-[#6366F1]/20' : 'bg-zinc-200'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${aiUseEmojis ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'professional', label: 'Professional', icon: ShieldCheck, desc: 'Formal & Polished' },
                { id: 'friendly', label: 'Friendly', icon: Heart, desc: 'Warm & Helpful' },
                { id: 'funny', label: 'Funny', icon: Zap, desc: 'Witty & Playful' },
                { id: 'concise', label: 'Concise', icon: Target, desc: 'Short & Direct' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => onChange({ aiPersona: p.id })}
                  className={`flex items-center gap-3 p-4 rounded-[16px] border-2 transition-all text-start ${aiPersona === p.id ? 'border-[#6366F1] bg-[#6366F1]/5 shadow-sm' : 'border-zinc-100 bg-white hover:border-zinc-200'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${aiPersona === p.id ? 'bg-[#6366F1] text-white shadow-md shadow-[#6366F1]/20' : 'bg-zinc-50 text-zinc-400 border border-zinc-200'}`}>
                    <p.icon size={18} />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-zinc-950 leading-none mb-1">{p.label}</div>
                    <div className="text-[11px] text-zinc-500 font-medium">{p.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button onClick={() => onPublish("AI_FAQ", "AUTOMATED", { faqs, faq_enabled: true })} className="px-10 py-3.5 bg-zinc-950 text-white rounded-[14px] text-sm font-bold shadow-xl hover:bg-[#6366F1] transition-all flex items-center gap-2">
              Launch AI Assistant <Rocket size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // --- FLOW 4: STORY AUTOMATOR ---
  const renderStoryFlow = () => {
    return (
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="story-step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 relative">
            <div className={`bg-white border border-zinc-200/60 rounded-[20px] sm:rounded-[24px] p-4 sm:p-8 shadow-xl shadow-zinc-200/20 space-y-8`}>
              {renderStepHeader()}
              <div className="text-start">
                <h3 className="text-2xl font-bold text-zinc-950 tracking-tighter">1. Select Source</h3>
                <p className="text-[13px] font-medium text-zinc-500 mt-1.5">Which stories should trigger this automation?</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[13px] font-bold text-zinc-900">Select Target Stories</label>
                    <button
                      onClick={() => onChange({ selectedStories: [] })}
                      className={`text-[12px] font-bold px-3 py-1.5 rounded-xl transition-all ${!values.selectedStories || values.selectedStories.length === 0 ? 'bg-[#6366F1] text-white shadow-sm shadow-[#6366F1]/20' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                    >
                      All Stories
                    </button>
                  </div>

                  <div className="flex gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar px-1">
                    {stories.map((story) => {
                      const isSelected = values.selectedStories?.includes(story.id);
                      return (
                        <button
                          key={story.id}
                          onClick={() => {
                            const current = values.selectedStories || [];
                            const next = isSelected ? current.filter(id => id !== story.id) : [...current, story.id];
                            onChange({ selectedStories: next });
                          }}
                          className={`relative flex-shrink-0 w-24 aspect-[9/16] rounded-[16px] overflow-hidden border-2 transition-all ${isSelected ? 'border-[#6366F1] scale-95 shadow-md shadow-[#6366F1]/20' : 'border-zinc-200 opacity-80 hover:opacity-100 hover:border-zinc-300'}`}
                        >
                          <img src={story.media_url} alt="story" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                            <span className="text-[10px] font-bold text-white tracking-wide">{story.timestamp}</span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-[#6366F1] rounded-full flex items-center justify-center shadow-lg">
                              <Check size={12} className="text-white" strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
                  {[
                    { id: 'MENTION', label: 'Story Mentions', icon: Users, desc: 'When tagged in story' },
                    { id: 'REPLY', label: 'Story Replies', icon: MessageSquare, desc: 'When someone replies' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => onChange({ storyTriggerType: type.id })}
                      className={`flex flex-col gap-3 p-6 rounded-[18px] border-2 transition-all text-start ${values.storyTriggerType === type.id ? 'border-[#6366F1] bg-[#6366F1]/5 shadow-sm' : 'border-zinc-100 bg-white hover:border-zinc-200'}`}
                    >
                      <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center transition-colors ${values.storyTriggerType === type.id ? 'bg-[#6366F1] text-white shadow-md shadow-[#6366F1]/20' : 'bg-zinc-50 text-zinc-400 border border-zinc-200'}`}>
                        <type.icon size={24} />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-zinc-950 leading-none mb-1.5">{type.label}</div>
                        <div className="text-[12px] text-zinc-500 font-medium">{type.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={() => handleStepChange(2)} className="px-10 py-3.5 bg-zinc-950 text-white rounded-[14px] text-sm font-bold shadow-xl hover:bg-[#6366F1] transition-all flex items-center gap-2">
                  Next: Design Response <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="story-step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className={`bg-white border border-zinc-200/60 rounded-[20px] sm:rounded-[24px] p-4 sm:p-8 shadow-xl shadow-zinc-200/20 space-y-8`}>
              {renderStepHeader()}
              <div className="text-start">
                <h3 className="text-2xl font-bold text-zinc-950 tracking-tighter">2. Design Response</h3>
                <p className="text-[13px] font-medium text-zinc-500 mt-1.5">Set your trigger conditions and DM reply</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-[13px] font-bold text-zinc-900 ml-1">Trigger Condition</label>
                  <div className="flex gap-3">
                    {['Any Reply', 'Specific Keyword'].map((cond) => (
                      <button
                        key={cond}
                        onClick={() => onChange({ storyCondition: cond === 'Any Reply' ? 'ANY' : 'KEYWORD' })}
                        className={`flex-1 py-4 rounded-[16px] text-[13px] font-bold border-2 transition-all ${values.storyCondition === (cond === 'Any Reply' ? 'ANY' : 'KEYWORD') ? 'border-[#6366F1] bg-[#6366F1]/5 text-[#6366F1] shadow-sm' : 'border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200'}`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                {values.storyCondition === 'KEYWORD' && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-[13px] font-bold text-zinc-900 ml-1">Target Keyword</label>
                    <input
                      type="text"
                      value={values.keyword}
                      onChange={(e) => onChange({ keyword: e.target.value })}
                      placeholder="e.g. VIP, DEALS, 🔥, or *"
                      className="w-full bg-white border-2 border-zinc-100 rounded-[16px] px-6 py-4 text-[15px] font-bold text-zinc-950 outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all shadow-sm"
                    />
                    <div className="p-4 bg-[#6366F1]/5 border border-[#6366F1]/20 rounded-[16px] flex items-start gap-3 mx-2">
                      <div className="mt-0.5 bg-white p-1.5 rounded-lg shadow-sm border border-[#6366F1]/10 text-[#6366F1]">
                        <Zap size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#6366F1] mb-1">Wildcard & Emojis Supported!</h4>
                        <p className="text-[13px] text-zinc-600 font-medium leading-relaxed">
                          Use <span className="font-bold text-[#6366F1] px-2 py-0.5 bg-white rounded-md border border-[#6366F1]/20 shadow-sm mx-0.5">*</span> to reply to <span className="underline decoration-[#6366F1]/40 decoration-2">any</span> message, or use specific emojis!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block text-[13px] font-bold text-zinc-900 ml-1">Automated DM Response</label>
                  <textarea
                    value={values.response}
                    onChange={(e) => onChange({ response: e.target.value })}
                    placeholder="What should be sent in DM?"
                    className="w-full bg-white border-2 border-zinc-100 rounded-[18px] p-6 text-[15px] font-medium text-zinc-900 outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all resize-none shadow-sm"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-3">
                    <label className="block text-[13px] font-bold text-zinc-900 ml-1">Button Text</label>
                    <input
                      type="text"
                      value={values.buttonText}
                      onChange={(e) => onChange({ buttonText: e.target.value })}
                      placeholder="e.g. Shop Now"
                      className="w-full bg-white border-2 border-zinc-100 rounded-[14px] px-5 py-3.5 text-[14px] font-medium text-zinc-900 outline-none focus:border-[#6366F1] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[13px] font-bold text-zinc-900 ml-1">Button Link (URL)</label>
                    <input
                      type="text"
                      value={values.buttonLink}
                      onChange={(e) => onChange({ buttonLink: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-white border-2 border-zinc-100 rounded-[14px] px-5 py-3.5 text-[14px] font-medium text-zinc-900 outline-none focus:border-[#6366F1] transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between p-5 bg-zinc-50/80 rounded-[18px] border border-zinc-100 hover:border-zinc-200 transition-colors group">
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-900">24-Hour Cooldown (Anti-Spam)</span>
                        {currentPlan === 'free' && <span className="text-[10px]">👑</span>}
                      </div>
                      <span className="text-[13px] font-medium text-zinc-500 mt-0.5">Only send one automated response per user every 24 hours.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (currentPlan === 'free') {
                          onUpgradeClick?.("cooldown");
                          return;
                        }
                        onChange({ cooldownGate: !values.cooldownGate });
                      }}
                      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${values.cooldownGate ? 'bg-[#6366F1] shadow-lg shadow-[#6366F1]/30' : 'bg-zinc-200'} cursor-pointer shrink-0`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${values.cooldownGate ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center pt-4">
                <button 
                  onClick={() => {
                    const finalKeyword = values.storyCondition === 'ANY' ? '*' : (values.keyword || "").trim().toUpperCase();
                    const finalResponse = (values.response || "").trim();
                    const finalType = values.storyTriggerType === 'MENTION' ? 'STORY_MENTION' : 'STORY_REPLY';

                    onPublish(finalKeyword, finalResponse, {
                      ...values,
                      type: finalType,
                      campaign_name: values.campaign_name || "Story Automator ⚡"
                    });
                  }}
                  className="px-10 py-3.5 bg-[#6366F1] text-white rounded-[14px] text-sm font-bold shadow-xl shadow-[#6366F1]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  Activate Story Automator <Rocket size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // --- FLOW 3: AI SALES CLOSER ---
  const renderSalesFlow = () => {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 relative">
        <div className={`bg-white border border-zinc-200/60 rounded-[20px] sm:rounded-[24px] p-4 sm:p-8 shadow-xl shadow-zinc-200/20 space-y-8`}>
          {renderStepHeader()}
          <div className="text-start">
            <h3 className="text-2xl font-bold text-zinc-950 tracking-tighter">AI Sales Agent</h3>
            <p className="text-[13px] font-medium text-zinc-500 mt-1.5">Configure your 24/7 sales representative</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                <label className="block text-[13px] font-bold text-zinc-900">Primary Sales Goal</label>
                <span className="text-[11px] font-bold text-[#6366F1] bg-[#6366F1]/10 px-2.5 py-1 rounded-lg">High Conversion</span>
              </div>
              <textarea
                value={aiGoal}
                onChange={(e) => onChange({ aiGoal: e.target.value })}
                placeholder="e.g. Get users to book a demo call"
                className="w-full bg-white border-2 border-zinc-100 rounded-[18px] p-6 text-[15px] font-medium text-zinc-900 outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 shadow-sm transition-all resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[13px] font-bold text-zinc-900 ml-1">Product Knowledge (AI Context)</label>
              <textarea
                value={values.aiKnowledge || ""}
                onChange={(e) => onChange({ aiKnowledge: e.target.value })}
                placeholder="Tell the AI about your product, pricing, and benefits..."
                className="w-full bg-white border-2 border-zinc-100 rounded-[18px] p-6 text-[15px] font-medium text-zinc-900 outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 shadow-sm transition-all resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-5 border-t border-zinc-100 pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-zinc-950">Closing Strategy</h4>
                  <p className="text-[13px] font-medium text-zinc-500">How should the AI handle negotiations?</p>
                </div>

                <div className="flex items-center gap-3 p-2 px-3 bg-zinc-50 rounded-[14px] border border-zinc-100">
                  <span className="text-[13px] font-bold text-zinc-700">Use Emojis</span>
                  <button
                    onClick={() => onChange({ aiUseEmojis: !aiUseEmojis })}
                    className={`w-10 h-5 rounded-full transition-all relative ${aiUseEmojis ? 'bg-[#6366F1] shadow-md shadow-[#6366F1]/20' : 'bg-zinc-200'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${aiUseEmojis ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'professional', label: 'Professional', icon: ShieldCheck, desc: 'B2B & Enterprise' },
                  { id: 'friendly', label: 'Friendly', icon: Heart, desc: 'Warm & Relatable' },
                  { id: 'funny', label: 'Bold', icon: Zap, desc: 'Direct & Persuasive' },
                  { id: 'concise', label: 'Precise', icon: Target, desc: 'Fact-driven & Short' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onChange({ aiPersona: p.id })}
                    className={`flex items-center gap-3 p-4 rounded-[16px] border-2 transition-all text-start ${aiPersona === p.id ? 'border-[#6366F1] bg-[#6366F1]/5 shadow-sm' : 'border-zinc-100 bg-white hover:border-zinc-200'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${aiPersona === p.id ? 'bg-[#6366F1] text-white shadow-md shadow-[#6366F1]/20' : 'bg-zinc-50 text-zinc-400 border border-zinc-200'}`}>
                      <p.icon size={18} />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-zinc-950 leading-none mb-1">{p.label}</div>
                      <div className="text-[11px] text-zinc-500 font-medium">{p.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-emerald-50/80 border border-emerald-100/80 rounded-[18px] flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <Brain size={24} />
            </div>
            <p className="text-[12px] text-emerald-900 font-medium leading-relaxed">
              AI uses <span className="font-bold">Natural Language Intent Discovery</span> to nudge users towards your sales goal without sounding like a bot.
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button onClick={() => onPublish("SALES_CLOSER", "AI_DRIVEN", { ai_goal: aiGoal, ai_persona: aiPersona, ai_use_emojis: aiUseEmojis, sales_closer_enabled: true })} className="px-10 py-3.5 bg-[#6366F1] text-white rounded-[14px] text-sm font-bold shadow-xl shadow-[#6366F1]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
              Activate Sales Agent <Rocket size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div key={campaignStrategy}>
      {renderFlow()}
    </div>
  );
}
