"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Camera,
  Check,
  Globe,
  MessageSquare,
  Rocket,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";

// ─────────────────────────────────────────────────────────
// Automation type definitions
// ─────────────────────────────────────────────────────────
const AUTOMATION_TYPES = [
  {
    id: "comment_dm",
    title: "Comment → DM",
    emoji: "💬",
    desc: "Someone comments a keyword → auto DM them",
    icon: MessageSquare,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    isPremium: false,
  },
  {
    id: "story_automator",
    title: "Story Reply",
    emoji: "📸",
    desc: "Auto-reply when someone replies to or mentions your story",
    icon: Camera,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    isPremium: true,
  },
  {
    id: "faq_assistant",
    title: "AI FAQ Bot",
    emoji: "🤖",
    desc: "AI answers common questions about your products automatically",
    icon: Sparkles,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    isPremium: true,
    isAI: true,
  },
  {
    id: "sales_closer",
    title: "AI Sales Agent",
    emoji: "🚀",
    desc: "Intelligent DM conversations that close deals for you 24/7",
    icon: Rocket,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    isPremium: true,
    isAI: true,
  },
];

const KEYWORD_SUGGESTIONS = ["PRICE", "LINK", "GUIDE", "YES", "VIP", "INFO", "JOIN"];
const DM_SUGGESTIONS = ["Here is the link! 🔗", "Sent it to you 📬", "Check your DMs!", "Happy to help! 😊"];
const PUBLIC_REPLY_SUGGESTIONS = ["Sent! Check DMs 📬", "Done! ✅", "Just messaged you!", "Check your request!"];

// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────
export default function CampaignWizard({
  onPublish,
  onBack,
  values,
  onChange,
  media = [],
  stories = [],
  selectedPosts = [],
  onSelectPosts,
  currentPlan = "free",
  onUpgradeClick,
  campaignName,
}) {
  // ── Chat state ──────────────────────────────────────────
  const [messages, setMessages] = useState([
    {
      id: "init",
      role: "ai",
      type: "text",
      text: `Hi! 👋 I'm your Automixa AI Copilot.\n\nWhat would you like to automate today?`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // ── Flow state ──────────────────────────────────────────
  const [phase, setPhase] = useState("select_type"); // select_type | select_post | keyword | dm_message | cta | public_reply | follow_gate | faq_setup | story_setup | sales_setup | done
  const [selectedType, setSelectedType] = useState(null);

  // ── Field state ─────────────────────────────────────────
  const [tempKeyword, setTempKeyword] = useState("");
  const [tempDM, setTempDM] = useState("");
  const [tempBtnText, setTempBtnText] = useState("");
  const [tempBtnLink, setTempBtnLink] = useState("");
  const [tempPublicReply, setTempPublicReply] = useState("");
  const [tempFaqs, setTempFaqs] = useState([{ q: "", a: "" }]);
  const [storyCondition, setStoryCondition] = useState("ANY");
  const [storyTriggerType, setStoryTriggerType] = useState("REPLY");
  const [storyKeyword, setStoryKeyword] = useState("");
  const [storyDM, setStoryDM] = useState("");
  const [aiGoal, setAiGoal] = useState("");
  const [aiKnowledge, setAiKnowledge] = useState("");
  const [aiPersona, setAiPersona] = useState("friendly");

  // ── Scroll ──────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, phase]);

  // ─────────────────────────────────────────────────────────
  // Helper: push AI message after typing delay
  // ─────────────────────────────────────────────────────────
  const aiSay = (msgOrMsgs, nextPhase, delayMs = 1200) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const arr = Array.isArray(msgOrMsgs) ? msgOrMsgs : [msgOrMsgs];
      setMessages((prev) => [
        ...prev,
        ...arr.map((m, i) => ({
          id: `${Date.now()}-${i}`,
          role: "ai",
          ...(typeof m === "string" ? { type: "text", text: m } : m),
        })),
      ]);
      if (nextPhase) setPhase(nextPhase);
    }, delayMs);
  };

  const userSay = (text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", type: "text", text },
    ]);
  };

  // ─────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────

  const handleSelectType = (type) => {
    if (type.isPremium && currentPlan === "free") {
      onUpgradeClick?.(type.id);
      return;
    }
    setSelectedType(type);
    onChange({ campaignStrategy: type.id });
    userSay(`I want to set up: ${type.title} ${type.emoji}`);

    if (type.id === "comment_dm") {
      aiSay("Great choice! 🎯 First, which post should trigger this automation? You can pick specific posts or choose **All Posts**.", "select_post");
    } else if (type.id === "story_automator") {
      aiSay("Perfect! Let's set up your Story automation. Choose what should trigger it:", "story_setup");
    } else if (type.id === "faq_assistant") {
      aiSay("Smart move! 🤖 Let me help you train your AI FAQ assistant. Add your most common questions and answers:", "faq_setup");
    } else if (type.id === "sales_closer") {
      aiSay("Let's build your AI Sales Agent! 🚀 First, what's the main goal you want the AI to achieve?", "sales_setup");
    }
  };

  const handleConfirmPosts = () => {
    const label = selectedPosts.length === 0 ? "All Posts" : `${selectedPosts.length} post(s)`;
    userSay(`Selected: ${label}`);
    aiSay(`Got it! Now, what **keyword** should people comment to trigger the automation?\n\nPick a suggestion or type your own:`, "keyword");
  };

  const handleConfirmKeyword = (kw) => {
    const finalKw = kw || tempKeyword;
    if (!finalKw.trim()) return;
    onChange({ keyword: finalKw.trim().toUpperCase() });
    userSay(`Keyword: "${finalKw.trim().toUpperCase()}"`);
    setTempKeyword("");
    aiSay(`Nice! 🎯 When someone comments **"${finalKw.trim().toUpperCase()}"**, what DM should I send them?`, "dm_message");
  };

  const handleConfirmDM = () => {
    if (!tempDM.trim()) return;
    onChange({ response: tempDM.trim() });
    userSay(tempDM.trim());
    setTempDM("");
    aiSay("Want to add a **button with a link** inside this DM? (e.g. Shop Now → your-link.com)\n\nOr skip if not needed.", "cta");
  };

  const handleConfirmCTA = (skip) => {
    if (!skip && (!tempBtnText.trim() || !tempBtnLink.trim())) return;
    onChange({
      buttonText: skip ? "" : tempBtnText.trim(),
      buttonLink: skip ? "" : tempBtnLink.trim(),
    });
    userSay(skip ? "Skip — no button" : `Button: ${tempBtnText} → ${tempBtnLink}`);
    setTempBtnText("");
    setTempBtnLink("");
    aiSay("Almost done! What should I **publicly reply** to their comment? (e.g. \"Sent! Check your DMs 📬\")", "public_reply");
  };

  const handleConfirmPublicReply = (reply) => {
    const finalReply = reply || tempPublicReply;
    if (!finalReply.trim()) return;
    onChange({ publicReply: finalReply.trim() });
    userSay(finalReply.trim());
    setTempPublicReply("");
    aiSay("Should I enable **Follow Gate**? — Users must follow your page before receiving the DM.", "follow_gate");
  };

  const handleConfirmFollowGate = (enable) => {
    onChange({ followerGate: enable });
    userSay(enable ? "Yes, enable Follow Gate 🔒" : "No, skip Follow Gate");
    aiSay("🎉 Your automation is ready! Review the summary and launch when you're set.", "done");
  };

  // Story
  const handleConfirmStory = () => {
    const finalKw = storyCondition === "ANY" ? "*" : storyKeyword.trim().toUpperCase();
    const finalType = storyTriggerType === "MENTION" ? "STORY_MENTION" : "STORY_REPLY";
    userSay(`Story ${storyTriggerType === "MENTION" ? "Mention" : "Reply"} • ${storyCondition === "ANY" ? "Any message" : `Keyword: "${finalKw}"`}`);
    onChange({ keyword: finalKw, storyCondition, storyTriggerType });
    aiSay("What should I send as the **auto DM reply** to story interactions?", "story_dm");
  };

  const handleConfirmStoryDM = () => {
    if (!storyDM.trim()) return;
    onChange({ response: storyDM.trim() });
    userSay(storyDM.trim());
    aiSay("🎉 Story automation is ready! Click launch when you're ready.", "done");
  };

  // FAQ
  const handleConfirmFAQ = () => {
    const validFaqs = tempFaqs.filter((f) => f.q.trim() && f.a.trim());
    if (validFaqs.length === 0) return;
    onChange({ faqs: validFaqs, aiPersona });
    userSay(`${validFaqs.length} FAQ(s) added • Persona: ${aiPersona}`);
    aiSay("🎉 Your AI FAQ Assistant is set up and ready to launch!", "done");
  };

  // Sales
  const handleConfirmSales = () => {
    if (!aiGoal.trim()) return;
    onChange({ aiGoal: aiGoal.trim(), aiKnowledge: aiKnowledge.trim(), aiPersona });
    userSay(`Goal: ${aiGoal.trim()}`);
    aiSay("🎉 Your AI Sales Closer is configured and ready to go!", "done");
  };

  // Final Publish
  const handlePublish = () => {
    const strategy = selectedType?.id || values.campaignStrategy;
    if (strategy === "comment_dm") {
      onPublish(values.keyword, values.response, {
        public_reply: values.publicReply,
        follower_gate: values.followerGate,
        button_text: values.buttonText,
        button_link: values.buttonLink,
        campaign_strategy: "comment_dm",
      });
    } else if (strategy === "story_automator") {
      const finalType = storyTriggerType === "MENTION" ? "STORY_MENTION" : "STORY_REPLY";
      onPublish(values.keyword || "*", values.response, {
        type: finalType,
        campaign_strategy: "story_automator",
        campaign_name: campaignName || "Story Automator ⚡",
      });
    } else if (strategy === "faq_assistant") {
      onPublish("AI_FAQ", "AUTOMATED", {
        faqs: values.faqs || tempFaqs,
        faq_enabled: true,
        ai_persona: aiPersona,
        campaign_strategy: "faq_assistant",
      });
    } else if (strategy === "sales_closer") {
      onPublish("AI_SALES", "AUTOMATED", {
        ai_goal: values.aiGoal || aiGoal,
        ai_knowledge: values.aiKnowledge || aiKnowledge,
        ai_persona: aiPersona,
        campaign_strategy: "sales_closer",
      });
    }
  };

  // ─────────────────────────────────────────────────────────
  // Render chat message bubbles
  // ─────────────────────────────────────────────────────────
  const renderMessage = (msg) => {
    const isAI = msg.role === "ai";
    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isAI ? "justify-start" : "justify-end"}`}
      >
        {isAI && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mr-3 mt-0.5 shadow-md shadow-indigo-200">
            <Brain size={16} className="text-white" />
          </div>
        )}
        <div
          className={`max-w-[80%] ${
            isAI
              ? "text-zinc-800 text-[14.5px] font-medium leading-relaxed"
              : "bg-[#6366F1] text-white px-5 py-3 rounded-[22px] rounded-br-[6px] text-[14px] font-semibold shadow-sm"
          }`}
        >
          {msg.text.split("\n").map((line, i) => (
            <p key={i} className={`${i > 0 ? "mt-1.5" : ""}`}>
              {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                j % 2 === 1 ? (
                  <strong key={j} className={isAI ? "text-zinc-950 font-bold" : "font-bold"}>
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>
          ))}
        </div>
      </motion.div>
    );
  };

  // ─────────────────────────────────────────────────────────
  // Render input panels (phase-based)
  // ─────────────────────────────────────────────────────────
  const renderInputPanel = () => {
    if (isTyping) return null;

    switch (phase) {
      // ── Step 0: Select automation type ───────────────────
      case "select_type":
        return (
          <motion.div key="sel-type" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {AUTOMATION_TYPES.map((type) => {
              const isLocked = type.isPremium && currentPlan === "free";
              return (
                <button
                  key={type.id}
                  onClick={() => handleSelectType(type)}
                  className={`group flex items-start gap-4 p-4 rounded-[20px] border-2 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                    isLocked
                      ? "border-zinc-100 bg-zinc-50 opacity-80"
                      : `border-zinc-200 bg-white hover:border-[#6366F1] hover:bg-[#6366F1]/5`
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${type.bg} ${type.color} group-hover:bg-[#6366F1] group-hover:text-white transition-colors`}>
                    <type.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-bold text-zinc-900 group-hover:text-[#6366F1] transition-colors">{type.title}</span>
                      {type.isAI && (
                        <span className="px-1.5 py-0.5 bg-gradient-to-r from-[#6366F1] to-purple-500 text-white text-[9px] font-semibold rounded-md">AI</span>
                      )}
                      {isLocked && (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded-md uppercase">Pro</span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 font-medium mt-0.5 leading-snug">{type.desc}</p>
                  </div>
                </button>
              );
            })}
          </motion.div>
        );

      // ── Step 1: Select post(s) ────────────────────────────
      case "select_post":
        return (
          <motion.div key="sel-post" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto no-scrollbar p-1">
              <button
                onClick={() => onSelectPosts([])}
                className={`relative flex flex-col items-center justify-center aspect-square rounded-[18px] border-2 transition-all gap-2 ${
                  selectedPosts.length === 0
                    ? "border-[#6366F1] bg-[#6366F1]/5 text-[#6366F1] shadow-md shadow-[#6366F1]/10"
                    : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-500"
                }`}
              >
                <Globe size={28} />
                <span className="text-[12px] font-bold">All Posts</span>
              </button>
              {media.map((item) => {
                const url =
                  item.media_type === "VIDEO" || item.media_product_type === "REELS"
                    ? item.thumbnail_url || item.media_url
                    : item.media_url;
                const isSel = selectedPosts.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      onSelectPosts(
                        isSel ? selectedPosts.filter((id) => id !== item.id) : [...selectedPosts, item.id]
                      )
                    }
                    className={`relative flex-col aspect-square rounded-[18px] overflow-hidden border-2 transition-all group ${
                      isSel ? "border-[#6366F1] scale-[0.97] shadow-md shadow-[#6366F1]/20" : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <img src={url} alt="post" className="w-full h-full object-cover" />
                    {isSel && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[#6366F1] rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-75">
                        <Check size={13} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleConfirmPosts}
              className="w-full py-4 bg-zinc-900 text-white rounded-[18px] text-[15px] font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-[#6366F1] transition-all"
            >
              Confirm Selection <ArrowRight size={18} />
            </button>
          </motion.div>
        );

      // ── Step 2: Keyword ───────────────────────────────────
      case "keyword":
        return (
          <motion.div key="keyword" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {KEYWORD_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleConfirmKeyword(s)}
                  className="shrink-0 px-4 py-2 bg-white border border-zinc-200 hover:border-[#6366F1] hover:text-[#6366F1] rounded-full text-[13px] font-bold text-zinc-700 shadow-sm transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="relative flex items-center w-full bg-white border border-zinc-300 rounded-[22px] shadow-lg overflow-hidden focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/20 transition-all">
              <input
                type="text"
                value={tempKeyword}
                onChange={(e) => setTempKeyword(e.target.value.toUpperCase())}
                placeholder="Type custom keyword..."
                className="flex-1 w-full px-6 py-4 text-[15px] outline-none bg-transparent font-medium uppercase"
                onKeyDown={(e) => e.key === "Enter" && tempKeyword.trim() && handleConfirmKeyword()}
              />
              <button
                onClick={() => handleConfirmKeyword()}
                disabled={!tempKeyword.trim()}
                className="absolute right-2 w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center disabled:opacity-40 transition-all hover:bg-[#6366F1]"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </motion.div>
        );

      // ── Step 3: DM message ────────────────────────────────
      case "dm_message":
        return (
          <motion.div key="dm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {DM_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setTempDM(s)}
                  className="shrink-0 px-4 py-2 bg-white border border-zinc-200 hover:border-[#6366F1] hover:text-[#6366F1] rounded-full text-[13px] font-semibold text-zinc-700 shadow-sm transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="relative flex items-end w-full bg-white border border-zinc-300 rounded-[22px] shadow-lg focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/20 transition-all p-2">
              <textarea
                value={tempDM}
                onChange={(e) => setTempDM(e.target.value)}
                placeholder="Type the DM message to send..."
                rows={2}
                className="flex-1 w-full px-4 py-3 text-[15px] outline-none bg-transparent resize-none max-h-32 min-h-[52px] font-medium"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleConfirmDM();
                  }
                }}
              />
              <button
                onClick={handleConfirmDM}
                disabled={!tempDM.trim()}
                className="shrink-0 mb-1 w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center disabled:opacity-40 transition-all hover:bg-[#6366F1]"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </motion.div>
        );

      // ── Step 4: CTA Button ────────────────────────────────
      case "cta":
        return (
          <motion.div key="cta" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-zinc-200 rounded-[22px] shadow-lg p-4 space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Button text (e.g. Shop Now)"
                value={tempBtnText}
                onChange={(e) => setTempBtnText(e.target.value)}
                className="px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-[14px] text-[14px] font-medium outline-none focus:border-[#6366F1] transition-all"
              />
              <input
                type="text"
                placeholder="URL (https://...)"
                value={tempBtnLink}
                onChange={(e) => setTempBtnLink(e.target.value)}
                className="px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-[14px] text-[14px] font-medium outline-none focus:border-[#6366F1] transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleConfirmCTA(true)}
                className="flex-1 py-3 bg-zinc-100 text-zinc-700 rounded-[14px] font-bold text-[14px] hover:bg-zinc-200 transition-all"
              >
                Skip
              </button>
              <button
                onClick={() => handleConfirmCTA(false)}
                disabled={!tempBtnText.trim() || !tempBtnLink.trim()}
                className="flex-1 py-3 bg-zinc-900 text-white rounded-[14px] font-bold text-[14px] disabled:opacity-40 transition-all hover:bg-[#6366F1]"
              >
                Add Button
              </button>
            </div>
          </motion.div>
        );

      // ── Step 5: Public reply ──────────────────────────────
      case "public_reply":
        return (
          <motion.div key="pr" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {PUBLIC_REPLY_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleConfirmPublicReply(s)}
                  className="shrink-0 px-4 py-2 bg-white border border-zinc-200 hover:border-[#6366F1] hover:text-[#6366F1] rounded-full text-[13px] font-semibold text-zinc-700 shadow-sm transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="relative flex items-end w-full bg-white border border-zinc-300 rounded-[22px] shadow-lg focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/20 transition-all p-2">
              <textarea
                value={tempPublicReply}
                onChange={(e) => setTempPublicReply(e.target.value)}
                placeholder="Public comment reply..."
                rows={2}
                className="flex-1 w-full px-4 py-3 text-[15px] outline-none bg-transparent resize-none max-h-28 min-h-[48px] font-medium"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleConfirmPublicReply();
                  }
                }}
              />
              <button
                onClick={() => handleConfirmPublicReply()}
                disabled={!tempPublicReply.trim()}
                className="shrink-0 mb-1 w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center disabled:opacity-40 transition-all hover:bg-[#6366F1]"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </motion.div>
        );

      // ── Step 6: Follow gate ───────────────────────────────
      case "follow_gate":
        return (
          <motion.div key="fg" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mt-2">
            <button
              onClick={() => handleConfirmFollowGate(false)}
              className="flex-1 py-4 bg-white border-2 border-zinc-200 text-zinc-700 rounded-[18px] font-bold shadow-sm hover:border-zinc-300 transition-all"
            >
              No, Skip
            </button>
            <button
              onClick={() => handleConfirmFollowGate(true)}
              className="flex-1 py-4 bg-zinc-900 text-white rounded-[18px] font-bold shadow-lg hover:bg-[#6366F1] transition-all"
            >
              Yes, Enable 🔒
            </button>
          </motion.div>
        );

      // ── Story setup ───────────────────────────────────────
      case "story_setup":
        return (
          <motion.div key="story-setup" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-2">
            {/* Trigger type */}
            <div className="space-y-2">
              <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">Trigger when...</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "REPLY", label: "Story Reply", emoji: "💬", desc: "Someone replies to your story" },
                  { id: "MENTION", label: "Story Mention", emoji: "📣", desc: "Someone tags you in their story" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setStoryTriggerType(t.id)}
                    className={`flex flex-col gap-2 p-4 rounded-[18px] border-2 text-left transition-all ${
                      storyTriggerType === t.id
                        ? "border-[#6366F1] bg-[#6366F1]/5"
                        : "border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <div>
                      <div className="text-[13px] font-bold text-zinc-900">{t.label}</div>
                      <div className="text-[11px] text-zinc-500 font-medium">{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">Trigger condition</p>
              <div className="flex gap-2">
                {["ANY", "KEYWORD"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setStoryCondition(c)}
                    className={`flex-1 py-3 rounded-[14px] text-[13px] font-bold border-2 transition-all ${
                      storyCondition === c
                        ? "border-[#6366F1] bg-[#6366F1]/5 text-[#6366F1]"
                        : "border-zinc-200 bg-white text-zinc-600"
                    }`}
                  >
                    {c === "ANY" ? "Any Message" : "Specific Keyword"}
                  </button>
                ))}
              </div>
            </div>

            {storyCondition === "KEYWORD" && (
              <input
                type="text"
                placeholder="e.g. COLLAB, VIP, INFO"
                value={storyKeyword}
                onChange={(e) => setStoryKeyword(e.target.value.toUpperCase())}
                className="w-full px-5 py-3.5 bg-white border-2 border-zinc-200 rounded-[16px] text-[14px] font-bold uppercase outline-none focus:border-[#6366F1] transition-all"
              />
            )}

            <button
              onClick={handleConfirmStory}
              className="w-full py-4 bg-zinc-900 text-white rounded-[18px] text-[15px] font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-[#6366F1] transition-all"
            >
              Next: Set DM Reply <ArrowRight size={18} />
            </button>
          </motion.div>
        );

      case "story_dm":
        return (
          <motion.div key="story-dm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-2">
            <div className="relative flex items-end w-full bg-white border border-zinc-300 rounded-[22px] shadow-lg focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/20 transition-all p-2">
              <textarea
                value={storyDM}
                onChange={(e) => setStoryDM(e.target.value)}
                placeholder="DM to send on story interaction..."
                rows={2}
                className="flex-1 w-full px-4 py-3 text-[15px] outline-none bg-transparent resize-none max-h-32 min-h-[52px] font-medium"
              />
              <button
                onClick={handleConfirmStoryDM}
                disabled={!storyDM.trim()}
                className="shrink-0 mb-1 w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center disabled:opacity-40 transition-all hover:bg-[#6366F1]"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </motion.div>
        );

      // ── FAQ setup ─────────────────────────────────────────
      case "faq_setup":
        return (
          <motion.div key="faq" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-2 bg-white border border-zinc-200 rounded-[22px] p-4 shadow-lg">
            <div className="space-y-3 max-h-[260px] overflow-y-auto no-scrollbar">
              {tempFaqs.map((faq, idx) => (
                <div key={idx} className="group relative p-4 bg-zinc-50 border border-zinc-200 rounded-[16px] space-y-2">
                  <button
                    onClick={() => setTempFaqs(tempFaqs.filter((_, i) => i !== idx))}
                    className="absolute top-3 right-3 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                  <input
                    type="text"
                    value={faq.q}
                    onChange={(e) => {
                      const f = [...tempFaqs];
                      f[idx].q = e.target.value;
                      setTempFaqs(f);
                    }}
                    placeholder="Question (e.g. What's the price?)"
                    className="w-full text-[13px] font-bold text-zinc-900 bg-transparent outline-none pr-8"
                  />
                  <textarea
                    value={faq.a}
                    onChange={(e) => {
                      const f = [...tempFaqs];
                      f[idx].a = e.target.value;
                      setTempFaqs(f);
                    }}
                    placeholder="Answer..."
                    rows={2}
                    className="w-full text-[13px] text-zinc-600 bg-transparent outline-none resize-none"
                  />
                </div>
              ))}
              <button
                onClick={() => setTempFaqs([...tempFaqs, { q: "", a: "" }])}
                className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-[16px] text-[13px] font-bold text-zinc-500 hover:border-[#6366F1] hover:text-[#6366F1] transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} strokeWidth={2.5} /> Add Question
              </button>
            </div>

            {/* Persona */}
            <div className="space-y-2 border-t border-zinc-100 pt-3">
              <p className="text-[12px] font-bold text-zinc-500">AI Tone</p>
              <div className="flex gap-2">
                {[
                  { id: "friendly", label: "Friendly 😊" },
                  { id: "professional", label: "Professional 🎩" },
                  { id: "concise", label: "Concise ⚡" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setAiPersona(p.id)}
                    className={`flex-1 py-2 text-[12px] font-bold rounded-[12px] border-2 transition-all ${
                      aiPersona === p.id ? "border-[#6366F1] bg-[#6366F1]/5 text-[#6366F1]" : "border-zinc-200 text-zinc-600"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirmFAQ}
              disabled={tempFaqs.filter((f) => f.q.trim() && f.a.trim()).length === 0}
              className="w-full py-3.5 bg-zinc-900 text-white rounded-[16px] font-bold text-[14px] disabled:opacity-40 transition-all hover:bg-[#6366F1] flex items-center justify-center gap-2 shadow-lg"
            >
              Launch AI FAQ <Sparkles size={16} />
            </button>
          </motion.div>
        );

      // ── Sales setup ───────────────────────────────────────
      case "sales_setup":
        return (
          <motion.div key="sales" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-2 bg-white border border-zinc-200 rounded-[22px] p-4 shadow-lg">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">Sales Goal</label>
              <textarea
                value={aiGoal}
                onChange={(e) => setAiGoal(e.target.value)}
                placeholder="e.g. Get users to book a demo call or buy the $99 plan"
                rows={2}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-[16px] text-[14px] font-medium outline-none focus:border-[#6366F1] transition-all resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">Product Knowledge (optional)</label>
              <textarea
                value={aiKnowledge}
                onChange={(e) => setAiKnowledge(e.target.value)}
                placeholder="Tell the AI about your product, pricing, and USPs..."
                rows={3}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-[16px] text-[14px] font-medium outline-none focus:border-[#6366F1] transition-all resize-none"
              />
            </div>

            {/* Persona */}
            <div className="space-y-2">
              <p className="text-[12px] font-bold text-zinc-500">AI Persona</p>
              <div className="flex gap-2">
                {[
                  { id: "friendly", label: "Friendly" },
                  { id: "professional", label: "Pro" },
                  { id: "concise", label: "Concise" },
                  { id: "funny", label: "Witty" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setAiPersona(p.id)}
                    className={`flex-1 py-2 text-[12px] font-bold rounded-[12px] border-2 transition-all ${
                      aiPersona === p.id ? "border-[#6366F1] bg-[#6366F1]/5 text-[#6366F1]" : "border-zinc-200 text-zinc-600"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirmSales}
              disabled={!aiGoal.trim()}
              className="w-full py-3.5 bg-zinc-900 text-white rounded-[16px] font-bold text-[14px] disabled:opacity-40 transition-all hover:bg-[#6366F1] flex items-center justify-center gap-2 shadow-lg"
            >
              Launch AI Sales Agent <Rocket size={16} />
            </button>
          </motion.div>
        );

      // ── Done: Launch button ───────────────────────────────
      case "done":
        return (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-2">
            <button
              onClick={handlePublish}
              className="w-full py-5 bg-gradient-to-r from-[#6366F1] to-purple-600 text-white rounded-[22px] text-[16px] font-bold shadow-xl shadow-indigo-300/30 hover:-translate-y-0.5 hover:shadow-2xl transition-all flex items-center justify-center gap-3"
            >
              <Rocket size={20} />
              Confirm & Launch Automation
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto relative">
      {/* ── Chat messages ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 no-scrollbar pb-8">
        {/* Intro header — shown only at the very start */}
        {messages.length === 1 && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center pt-6 pb-2"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[22px] flex items-center justify-center shadow-xl shadow-indigo-200 mb-4">
              <Brain size={32} className="text-white" />
            </div>
            <h2 className="text-[22px] font-black text-zinc-950 tracking-tight mb-1">
              Automixa AI Copilot
            </h2>
            <p className="text-[13px] font-medium text-zinc-500 max-w-xs leading-relaxed">
              Your intelligent assistant to build powerful Instagram automations in minutes.
            </p>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => renderMessage(msg))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-200">
              <Brain size={16} className="text-white" />
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Input panel (contextual) ────────────────────────── */}
      <div className="shrink-0 px-4 sm:px-6 pb-6 pt-2 bg-gradient-to-t from-white via-white to-transparent">
        <AnimatePresence mode="wait">{renderInputPanel()}</AnimatePresence>
      </div>
    </div>
  );
}
