"use client";

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

export default function CampaignWizard({ step = 1, onStepChange, onPublish, onChange, onBack, values, media = [], stories = [], selectedPosts = [], onSelectPosts, currentPlan = "free", onUpgradeClick }) {
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
  // --- FLOW 1: COMMENT & DM AUTOMATOR ---
  const renderCommentDMFlow = () => {
    return (
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white border border-zinc-200/60 rounded-[24px] p-6 sm:p-8 shadow-xl shadow-zinc-200/20">
              {renderStepHeader()}
              <div className="text-left mb-8 px-2">
                <h3 className="text-2xl font-bold text-zinc-950 tracking-tighter">1. Select Target Posts</h3>
                <p className="text-[13px] font-medium text-zinc-500 mt-1.5">Which posts should trigger this automation?</p>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-[300px] overflow-y-auto p-1 no-scrollbar">
                <button onClick={() => onSelectPosts([])} className={`aspect-square rounded-[18px] border-2 transition-all flex flex-col items-center justify-center gap-2 ${selectedPosts.length === 0 ? 'border-[#6366F1] bg-[#6366F1]/5 text-[#6366F1] shadow-sm' : 'border-zinc-100 bg-white hover:border-zinc-200 text-zinc-500'}`}>
                  <Globe size={20} />
                  <span className="text-[11px] font-bold">All Posts</span>
                </button>
                {media.map((item) => {
                  const displayUrl = (item.media_type === "VIDEO" || item.media_product_type === "REELS")
                    ? (item.thumbnail_url || item.media_url)
                    : item.media_url;
                  return (
                    <button key={item.id} onClick={() => onSelectPosts(selectedPosts.includes(item.id) ? selectedPosts.filter(id => id !== item.id) : [...selectedPosts, item.id])} className={`relative aspect-square rounded-[18px] overflow-hidden border-2 transition-all ${selectedPosts.includes(item.id) ? 'border-[#6366F1] shadow-md scale-95' : 'border-white hover:border-zinc-200 hover:scale-[0.98]'}`}>
                      <img src={displayUrl} alt="post" className="w-full h-full object-cover" />
                      {selectedPosts.includes(item.id) && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#6366F1] rounded-full flex items-center justify-center shadow-lg">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={() => handleStepChange(2)} className="px-10 py-3.5 bg-zinc-950 text-white rounded-[14px] text-sm font-semibold shadow-xl hover:bg-[#6366F1] transition-all flex items-center gap-2">
                  Next: Setup Trigger <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white border border-zinc-200/60 rounded-[24px] p-6 sm:p-8 shadow-xl shadow-zinc-200/20 space-y-8">
              {renderStepHeader()}
              <div className="text-left px-2">
                <h3 className="text-2xl font-bold text-zinc-950 tracking-tighter">2. Setup Trigger</h3>
                <p className="text-[13px] font-medium text-zinc-500 mt-1.5">What keyword should activate the bot?</p>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange({ keyword: val });
                  }}
                  placeholder="Enter trigger keyword (e.g. price, 🔥, or *)"
                  className="w-full bg-white border-2 border-zinc-100 rounded-[18px] px-8 py-5 outline-none text-xl font-bold text-zinc-950 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 shadow-sm text-left transition-all"
                />
                <div className="p-4 bg-[#6366F1]/5 border border-[#6366F1]/20 rounded-[16px] flex items-start gap-3 mx-2">
                  <div className="mt-0.5 bg-white p-1.5 rounded-lg shadow-sm border border-[#6366F1]/10 text-[#6366F1]">
                    <Zap size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#6366F1] mb-1">Wildcard & Emojis Supported!</h4>
                    <p className="text-[13px] text-zinc-600 font-medium leading-relaxed">
                      You can use exact emojis (like 🔥) as your keyword, or type <span className="font-bold text-[#6366F1] px-2 py-0.5 bg-white rounded-md border border-[#6366F1]/20 shadow-sm mx-0.5">*</span> to reply to <span className="underline decoration-[#6366F1]/40 decoration-2">any</span> incoming comment or message automatically.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center pt-4">
                <button onClick={() => handleStepChange(3)} disabled={!keyword} className="px-10 py-3.5 bg-zinc-950 text-white rounded-[14px] text-sm font-semibold shadow-xl hover:bg-[#6366F1] transition-all flex items-center gap-2 disabled:opacity-50">
                  Next: Design Responses <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white border border-zinc-200/60 rounded-[24px] p-6 sm:p-8 shadow-xl shadow-zinc-200/20 space-y-8">
              {renderStepHeader()}
              <div className="text-left px-2">
                <h3 className="text-2xl font-bold text-zinc-950 tracking-tighter">3. Design Responses</h3>
                <p className="text-[13px] font-medium text-zinc-500 mt-1.5">First the DM, then the Comment Reply</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-[13px] font-bold text-zinc-900 ml-1">Action 1: Private DM</label>
                  <textarea value={response} onChange={(e) => onChange({ response: e.target.value })} rows={3} placeholder="Hey! Here is your link..." className="w-full bg-white border-2 border-zinc-100 rounded-[18px] p-5 text-[15px] font-medium outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all resize-none shadow-sm" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="Button Text (e.g. View Store)" value={buttonText} onChange={(e) => onChange({ buttonText: e.target.value })} className="bg-white border-2 border-zinc-100 rounded-[14px] px-4 py-3 text-[13px] font-semibold outline-none focus:border-[#6366F1] transition-all" />
                    <div className="flex flex-col gap-1">
                      <input type="text" placeholder="Link URL (https://...)" value={buttonLink} onChange={(e) => onChange({ buttonLink: e.target.value })} className="bg-white border-2 border-zinc-100 rounded-[14px] px-4 py-3 text-[13px] font-semibold outline-none focus:border-[#6366F1] transition-all" />
                      <span className="text-[11px] text-zinc-500 font-medium px-1">Optional: Paste a product link here!</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[13px] font-bold text-zinc-900 ml-1">Action 2: Public Comment Reply</label>
                  <input type="text" value={publicReply} onChange={(e) => onChange({ publicReply: e.target.value })} placeholder="Check your DMs! 🚀" className="w-full bg-white border-2 border-zinc-100 rounded-[16px] px-5 py-4 text-[15px] font-medium outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all shadow-sm" />
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-between p-5 bg-zinc-50/80 rounded-[18px] border border-zinc-100 hover:border-zinc-200 transition-colors group">
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-zinc-900">Follower Gate (Growth Mode)</span>
                      <span className="text-[13px] font-medium text-zinc-500 mt-0.5">Require users to follow your page before receiving the DM.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onChange({ followerGate: !followerGate })}
                      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${followerGate ? 'bg-[#6366F1] shadow-lg shadow-[#6366F1]/30' : 'bg-zinc-200'} cursor-pointer shrink-0`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${followerGate ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center pt-4">
                <button onClick={() => onPublish(keyword, response, { public_reply: publicReply, follower_gate: followerGate, sync_story: false, button_text: buttonText, button_link: buttonLink })} className="px-10 py-3.5 bg-[#6366F1] text-white rounded-[14px] text-sm font-bold shadow-xl shadow-[#6366F1]/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  Launch Automation <Rocket size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // --- FLOW 2: AI FAQ ASSISTANT ---
  const renderFAQFlow = () => {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 relative">
        <div className={`bg-white border border-zinc-200/60 rounded-[24px] p-6 sm:p-8 shadow-xl shadow-zinc-200/20 space-y-8`}>
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
            <div className={`bg-white border border-zinc-200/60 rounded-[24px] p-6 sm:p-8 shadow-xl shadow-zinc-200/20 space-y-8`}>
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
            <div className={`bg-white border border-zinc-200/60 rounded-[24px] p-6 sm:p-8 shadow-xl shadow-zinc-200/20 space-y-8`}>
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
        <div className={`bg-white border border-zinc-200/60 rounded-[24px] p-6 sm:p-8 shadow-xl shadow-zinc-200/20 space-y-8`}>
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
