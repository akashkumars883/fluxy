"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Check,
  Globe,
  MessageSquare,
  Rocket,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import * as logger from "@/lib/logger";

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

const KEYWORD_SUGGESTIONS = ["*", "price", "link", "guide", "yes", "vip", "info"];
const DM_SUGGESTIONS = ["Here is the link! 🔗", "Sent it to you 📬", "Check your DMs!", "Happy to help! 😊"];
const PUBLIC_REPLY_SUGGESTIONS = ["Check your DMs", "Check your message requests", "Just messaged you", "Check your inbox"];

export default function CampaignWizard({
  onPublish,
  values,
  onChange,
  media = [],
  selectedPosts = [],
  onSelectPosts,
  currentPlan = "free",
  onUpgradeClick,
  campaignName,
  onPhaseChange,
}) {
  // ── Chat state ──────────────────────────────────────────
  const [messages, setMessages] = useState([
    {
      id: "init",
      role: "ai",
      type: "text",
      text: `Hi! 👋 I'm your Automixa AI.\n\nWhat would you like to automate today?`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // ── Flow state ──────────────────────────────────────────
  const [phase, setPhase] = useState("select_type"); // select_type | select_post | keyword | dm_message | cta | public_reply | follow_gate | faq_setup | story_setup | sales_setup | done
  const [selectedType, setSelectedType] = useState(null);

  // ── AI Setup states ──────────────────────────────────────
  const [isAiBuilding, setIsAiBuilding] = useState(false);
  const [aiBuildPrompt, setAiBuildPrompt] = useState("");
  const [aiBuildError, setAiBuildError] = useState("");

  const [suggestedTexts, setSuggestedTexts] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestType, setSuggestType] = useState("");

  // ── Field state ─────────────────────────────────────────
  const [tempKeyword, setTempKeyword] = useState("");
  const [tempDM, setTempDM] = useState("");
  const [followerGateEnabled, setFollowerGateEnabled] = useState(false);
  const [tempFollowGateMsg, setTempFollowGateMsg] = useState("One final step to unlock! 🎁");
  const [tempIntroMessage, setTempIntroMessage] = useState(values.introMessage || "Hey {name}! 👋 Thanks for the comment! Tap the button below and I'll send you the access right away. ⚡");
  const [tempIntroBtnText, setTempIntroBtnText] = useState(values.introButtonText || "Send me the access");
  const [tempBtnText, setTempBtnText] = useState("");
  const [tempBtnLink, setTempBtnLink] = useState("");
  const [tempPublicReply, setTempPublicReply] = useState("");
  const [publicReplyVariants, setPublicReplyVariants] = useState(["Check your DMs"]);
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

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [onPhaseChange, phase]);

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

  // ── AI Setup handlers ───────────────────────────────────
  const handleAiBuildSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!aiBuildPrompt.trim() || isAiBuilding) return;

    setIsAiBuilding(true);
    setAiBuildError("");
    userSay(`AI build request: "${aiBuildPrompt.trim()}"`);

    try {
      const res = await fetch("/api/ai/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiBuildPrompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate campaign");

      if (data.success) {
        const generatedStrategy = data.campaignStrategy || "comment_dm";
        const matchedType = AUTOMATION_TYPES.find(t => t.id === generatedStrategy) || AUTOMATION_TYPES[0];
        setSelectedType(matchedType);

        // Update campaign values - keyword normalized to uppercase
        onChange({
          keyword: (data.keyword || "OFFER").toUpperCase(),
          response: data.response || "Here is your access!",
          publicReply: [data.publicReply || "Check your DMs"],
          buttonText: data.buttonText || "Get Access",
          buttonLink: data.buttonLink || "https://example.com",
          followerGate: !!data.followerGate,
          campaignStrategy: generatedStrategy,
          introMessage: `Hey {name}! 👋 Thanks for the comment! Tap the button below and I'll send you the access right away. ⚡`,
          introButtonText: "Send me the access"
        });

        // Set local state variables as well
        setTempKeyword("");
        setTempDM("");
        setTempBtnText("");
        setTempBtnLink("");
        setTempPublicReply("");
        setPublicReplyVariants([data.publicReply || "Check your DMs"]);

        setAiBuildPrompt("");

        aiSay([
          "✨ I've designed your campaign automation using Automixa AI!",
          `Keyword: "${(data.keyword || "OFFER").toUpperCase()}" | DM: "${data.response}"`,
          "I configured the initial Intro Greeting Card, CTA buttons, and a public comment reply. You can test it live in the iPhone preview on the right!",
        ], "done", 1200);
      } else {
        throw new Error("Invalid response schema from AI Copilot");
      }
    } catch (err) {
      logger.error("CampaignWizard: AI build error:", err);
      setAiBuildError(err.message || "Failed to build campaign. Please try a different prompt.");
      aiSay("⚠️ I ran into an error generating that automation. Let's try again, or you can build it step-by-step using a template below.", "select_type", 1000);
    } finally {
      setIsAiBuilding(false);
    }
  };

  const handleAiSuggest = async (type, currentText) => {
    if (isSuggesting) return;
    setIsSuggesting(true);
    setSuggestedTexts([]);
    setSuggestType(type);

    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: currentText || (type === "public_reply" ? "Check your DMs 📬" : "Here is the access link!"),
          type,
          campaignName,
          keyword: values.keyword
        }),
      });
      const data = await res.json();
      if (data.success && data.suggestions) {
        setSuggestedTexts(data.suggestions);
      } else {
        throw new Error(data.error || "Suggestions request failed");
      }
    } catch (err) {
      logger.error("CampaignWizard: AI suggestion failed:", err);
    } finally {
      setIsSuggesting(false);
    }
  };

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
    // Normalize to uppercase
    onChange({ keyword: finalKw.trim().toUpperCase() });
    userSay(`Keyword: "${finalKw.trim().toUpperCase()}"`);
    setTempKeyword("");
    aiSay("Perfect! Before setting up the final DM, let's configure the first DM (Intro Card) that users get right after commenting. What should it say?", "intro_setup");
  };

  const handleConfirmIntro = () => {
    onChange({
      introMessage: tempIntroMessage.trim(),
      introButtonText: tempIntroBtnText.trim()
    });
    userSay(`Intro DM: "${tempIntroMessage.trim()}" | Button: "${tempIntroBtnText.trim()}"`);
    aiSay(`Got it! After they tap **"${tempIntroBtnText.trim()}"**, what final DM message should I send?`, "dm_message");
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
    let finalReplies = [];
    if (reply) {
      finalReplies = [reply.trim()];
    } else {
      finalReplies = publicReplyVariants.filter(r => r.trim() !== "");
      if (finalReplies.length === 0 && tempPublicReply.trim()) {
        finalReplies = [tempPublicReply.trim()];
      }
    }

    if (finalReplies.length === 0) return;

    onChange({ publicReply: finalReplies });
    userSay(finalReplies.join(" | "));
    setTempPublicReply("");
    setSuggestedTexts([]);
    aiSay("Should I enable **Follow Gate**? — Users must follow your page before receiving the DM.", "follow_gate");
  };

  const handleConfirmFollowGate = (enable, customMsg) => {
    onChange({
      followerGate: enable,
      followGateMessage: enable ? (customMsg || "").trim() : ""
    });
    userSay(enable ? "Yes, enable Follow Gate 🔒" : "No, skip Follow Gate");
    aiSay("🎉 Your automation is ready! Review the summary and launch when you're set.", "done");
  };

  // Story
  const handleConfirmStory = () => {
    const finalKw = storyCondition === "ANY" ? "*" : storyKeyword.trim().toUpperCase();
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

  const handleBackStep = () => {
    let prevPhase = "select_type";
    const currentStrategy = selectedType?.id || values.campaignStrategy;

    if (currentStrategy === "comment_dm") {
      if (phase === "select_post") prevPhase = "select_type";
      else if (phase === "keyword") prevPhase = "select_post";
      else if (phase === "intro_setup") prevPhase = "keyword";
      else if (phase === "dm_message") prevPhase = "intro_setup";
      else if (phase === "cta") prevPhase = "dm_message";
      else if (phase === "public_reply") prevPhase = "cta";
      else if (phase === "follow_gate") prevPhase = "public_reply";
      else if (phase === "done") prevPhase = "follow_gate";
    } else if (currentStrategy === "story_automator") {
      if (phase === "story_setup") prevPhase = "select_type";
      else if (phase === "story_dm") prevPhase = "story_setup";
      else if (phase === "done") prevPhase = "story_dm";
    } else if (currentStrategy === "faq_assistant") {
      if (phase === "faq_setup") prevPhase = "select_type";
      else if (phase === "done") prevPhase = "faq_setup";
    } else if (currentStrategy === "sales_closer") {
      if (phase === "sales_setup") prevPhase = "select_type";
      else if (phase === "done") prevPhase = "sales_setup";
    }

    setPhase(prevPhase);

    // Remove the last AI and user messages if applicable
    setMessages((prev) => {
      if (prev.length > 2) {
        return prev.slice(0, -2);
      }
      return [{
        id: "init",
        role: "ai",
        type: "text",
        text: `Hi! 👋 I'm your Automixa AI.\n\nWhat would you like to automate today?`,
      }];
    });
  };

  // Final Publish
  const handlePublish = (isDraft = false) => {
    const strategy = selectedType?.id || values.campaignStrategy;
    const extraOpts = {
      is_draft: isDraft,
      is_active: !isDraft,
    };
    if (strategy === "comment_dm") {
      onPublish(values.keyword, values.response, {
        public_reply: values.publicReply,
        follower_gate: values.followerGate,
        follow_gate_message: values.followerGate ? values.followGateMessage : "",
        intro_title: values.introMessage,
        intro_button_text: values.introButtonText,
        button_text: values.buttonText,
        button_link: values.buttonLink,
        campaign_strategy: "comment_dm",
        ...extraOpts,
      });
    } else if (strategy === "story_automator") {
      const finalType = storyTriggerType === "MENTION" ? "STORY_MENTION" : "STORY_REPLY";
      onPublish(values.keyword || "*", values.response, {
        type: finalType,
        campaign_strategy: "story_automator",
        follower_gate: values.followerGate,
        follow_gate_message: values.followerGate ? values.followGateMessage : "",
        campaign_name: campaignName || "Story Automator ⚡",
        ...extraOpts,
      });
    } else if (strategy === "faq_assistant") {
      onPublish("AI_FAQ", "AUTOMATED", {
        faqs: values.faqs || tempFaqs,
        faq_enabled: true,
        ai_persona: aiPersona,
        campaign_strategy: "faq_assistant",
        ...extraOpts,
      });
    } else if (strategy === "sales_closer") {
      onPublish("AI_SALES", "AUTOMATED", {
        ai_goal: values.aiGoal || aiGoal,
        ai_knowledge: values.aiKnowledge || aiKnowledge,
        ai_persona: aiPersona,
        campaign_strategy: "sales_closer",
        ...extraOpts,
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
          <img
            src="/logo.png"
            alt="Automixa AI"
            className="w-8 h-8 object-contain shrink-0 mr-3 mt-0.5 select-none"
          />
        )}
        <div
          className={`max-w-[90%] sm:max-w-[80%] ${isAI
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

  const renderInputPanel = () => {
    if (isAiBuilding) {
      return (
        <motion.div key="ai-loading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center p-8 bg-white border border-zinc-200 rounded-[22px] shadow-lg text-center space-y-4">
          <div className="w-12 h-12 bg-[#6366F1]/10 text-[#6366F1] rounded-2xl flex items-center justify-center border border-[#6366F1]/20">
            <Sparkles className="animate-spin text-[#6366F1]" size={24} />
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-zinc-950">Automixa AI is building...</h4>
            <p className="text-[11px] text-zinc-500 mt-1 font-medium leading-relaxed">Drafting copy, configuring triggers, and building your preview.</p>
          </div>
        </motion.div>
      );
    }

    if (isTyping) return null;

    switch (phase) {
      // ── Step 0: Select automation type ───────────────────
      case "select_type":
        const handleAiBuildClick = (e) => {
          if (currentPlan === "free") {
            e.preventDefault();
            onUpgradeClick?.("ai_builder");
          }
        };

        return (
          <motion.div key="sel-type" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-2">
            {/* One-Shot AI Input */}
            <form
              onSubmit={currentPlan === "free" ? handleAiBuildClick : handleAiBuildSubmit}
              className={`bg-white border border-zinc-200 rounded-[22px] p-3 sm:p-4 shadow-sm space-y-3 text-left transition-all ${currentPlan === "free" ? "hover:border-[#6366F1]/50 cursor-pointer" : ""}`}
              onClick={currentPlan === "free" ? handleAiBuildClick : undefined}
            >
              <div className="flex items-center justify-between text-[#6366F1]">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Build with Automixa AI</span>
                </div>
                {currentPlan === "free" && (
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded-md uppercase">Pro</span>
                )}
              </div>
              <div className="relative flex items-center w-full bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden focus-within:border-[#6366F1] focus-within:bg-white transition-all">
                <input
                  type="text"
                  value={aiBuildPrompt}
                  onChange={(e) => setAiBuildPrompt(e.target.value)}
                  onClick={currentPlan === "free" ? handleAiBuildClick : undefined}
                  readOnly={currentPlan === "free"}
                  placeholder={currentPlan === "free" ? "Upgrade to Pro to unlock AI Builder" : "Describe what you want to automate in 1 sentence..."}
                  className={`flex-1 w-full pl-4 pr-12 py-3 text-sm outline-none bg-transparent font-medium ${currentPlan === "free" ? "cursor-pointer text-zinc-400 placeholder:text-zinc-400" : ""}`}
                />
                <button
                  type="submit"
                  disabled={currentPlan === "free" || !aiBuildPrompt.trim() || isAiBuilding}
                  onClick={currentPlan === "free" ? handleAiBuildClick : undefined}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-950 text-white rounded-sm flex items-center justify-center disabled:opacity-40 transition-all hover:bg-[#6366F1]"
                >
                  <ArrowRight size={15} />
                </button>
              </div>
              {aiBuildError && (
                <p className="text-[11px] text-rose-500 font-semibold px-1">{aiBuildError}</p>
              )}
              <p className="text-[10px] text-zinc-400 font-medium px-1">
                e.g., &quot;Send a VIP discount code when someone comments &apos;COUPON&apos;&quot;
              </p>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-zinc-200"></div>
              <span className="flex-shrink mx-4 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Or start with a template</span>
              <div className="flex-grow border-t border-zinc-200"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AUTOMATION_TYPES.map((type) => {
                const isLocked = type.isPremium && currentPlan === "free";
                return (
                  <button
                    key={type.id}
                    onClick={() => handleSelectType(type)}
                    className={`group flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-[20px] border-2 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${isLocked
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
            </div>
          </motion.div>
        );

      // ── Step 1: Select post(s) ────────────────────────────
      case "select_post":
        return (
          <motion.div key="sel-post" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-2">
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-[185px] overflow-y-auto no-scrollbar p-1">
              <button
                onClick={() => onSelectPosts([])}
                className={`relative flex flex-col items-center justify-center aspect-square rounded-[12px] border-2 transition-all gap-1.5 ${selectedPosts.length === 0
                  ? "border-[#6366F1] bg-[#6366F1]/5 text-[#6366F1] shadow-md shadow-[#6366F1]/10"
                  : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-500"
                  }`}
              >
                <Globe size={18} />
                <span className="text-[10px] font-bold">All Posts</span>
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
                    className={`relative flex-col aspect-square rounded-[12px] overflow-hidden border-2 transition-all group ${isSel ? "border-[#6366F1] scale-[0.97] shadow-md shadow-[#6366F1]/20" : "border-zinc-200 hover:border-zinc-300"
                      }`}
                  >
                    <img src={url} alt="post" className="w-full h-full object-cover" />
                    {isSel && (
                      <div className="absolute top-1 right-1 w-4.5 h-4.5 bg-[#6366F1] rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-75">
                        <Check size={10} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleConfirmPosts}
              className="w-full py-2.5 bg-[#6366F1] text-white rounded-sm text-xs font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-[#4f46e5] transition-all cursor-pointer"
            >
              Confirm Selection <ArrowRight size={14} />
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
                  onClick={() => handleConfirmKeyword(s.toUpperCase())}
                  className="shrink-0 px-4 py-2 bg-white border border-zinc-200 hover:border-[#6366F1] hover:text-[#6366F1] rounded-full text-[13px] font-bold text-zinc-700 shadow-sm transition-all"
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="relative flex items-center w-full bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden focus-within:border-[#6366F1] focus-within:bg-white transition-all">
              <input
                type="text"
                value={tempKeyword}
                onChange={(e) => setTempKeyword(e.target.value.toUpperCase())}
                placeholder="Type custom keyword..."
                className="flex-1 w-full pl-4 pr-12 py-3 text-sm outline-none bg-transparent font-medium uppercase"
                onKeyDown={(e) => e.key === "Enter" && tempKeyword.trim() && handleConfirmKeyword()}
              />
              <button
                onClick={() => handleConfirmKeyword()}
                disabled={!tempKeyword.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#6366F1] text-white rounded-lg flex items-center justify-center disabled:opacity-40 transition-all hover:bg-[#4f46e5] cursor-pointer"
              >
                <ArrowRight size={15} />
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium px-2 mt-1">
              💡 Tip: Type <span className="font-bold text-zinc-700 font-mono">*</span> to trigger this automation for every comment or message.
            </p>
          </motion.div>
        );

      // ── Step 2.5: Intro Setup ─────────────────────────────
      case "intro_setup":
        return (
          <motion.div key="intro_setup" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-zinc-200 rounded-xl shadow-lg p-3.5 sm:p-4 space-y-3 mt-2 animate-in fade-in duration-200">
            <div className="space-y-2.5 text-left">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                  Intro DM Message (Greeting)
                </label>
                <textarea
                  value={tempIntroMessage}
                  onChange={(e) => setTempIntroMessage(e.target.value)}
                  placeholder="Hey {name}! Thanks for commenting. Tap the button below for access!"
                  rows={2}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-[14px] text-sm font-medium outline-none focus:border-[#6366F1] focus:bg-white transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                  Intro Button Text
                </label>
                <input
                  type="text"
                  maxLength={20}
                  value={tempIntroBtnText}
                  onChange={(e) => setTempIntroBtnText(e.target.value)}
                  placeholder="Send me the access"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-[14px] text-sm font-medium outline-none focus:border-[#6366F1] focus:bg-white transition-all"
                />
                <p className="text-[10px] text-zinc-400 font-medium px-1 mt-1">
                  * Max 20 characters (Meta API limit)
                </p>
              </div>
            </div>
            <button
              onClick={handleConfirmIntro}
              disabled={!tempIntroMessage.trim() || !tempIntroBtnText.trim()}
              className="w-full py-3 bg-[#6366F1] text-white rounded-sm text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-[#4f46e5] transition-all disabled:opacity-40 cursor-pointer"
            >
              Confirm Intro DM <ArrowRight size={16} />
            </button>
          </motion.div>
        );

      // ── Step 3: DM message ────────────────────────────────
      case "dm_message":
        return (
          <motion.div key="dm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-2 text-left">
            <div className="flex gap-2 items-center justify-between overflow-x-auto no-scrollbar pb-1">
              <div className="flex gap-1">
                {DM_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTempDM(s)}
                    className="shrink-0 px-3.5 py-1.5 bg-white border border-zinc-200 hover:border-[#6366F1] hover:text-[#6366F1] rounded-full text-[12px] font-semibold text-zinc-700 shadow-sm transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (currentPlan === "free") {
                    onUpgradeClick?.("magic_write");
                  } else {
                    handleAiSuggest("dm", tempDM);
                  }
                }}
                disabled={currentPlan !== "free" && isSuggesting}
                className="shrink-0 px-3 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 rounded-full text-[11px] font-bold text-indigo-600 shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <Sparkles size={12} />
                <span>Suggest with AI</span>
                {currentPlan === "free" && <span className="text-[10px]">👑</span>}
              </button>
            </div>
            <div className="relative flex items-end w-full bg-zinc-50 border border-zinc-200 rounded-xl focus-within:border-[#6366F1] focus-within:bg-white transition-all p-1.5">
              <textarea
                value={tempDM}
                onChange={(e) => setTempDM(e.target.value)}
                placeholder="Type the DM message to send..."
                rows={2}
                className="flex-1 w-full px-3 py-2 text-sm outline-none bg-transparent resize-none max-h-32 min-h-[48px] font-medium"
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
                className="shrink-0 mb-0.5 w-8 h-8 bg-[#6366F1] text-white rounded-sm flex items-center justify-center disabled:opacity-40 transition-all hover:bg-[#4f46e5] cursor-pointer"
              >
                <ArrowRight size={15} />
              </button>
            </div>

            {isSuggesting && suggestType === "dm" && (
              <div className="flex items-center justify-center py-4 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-zinc-500">Generating copy variants...</span>
                </div>
              </div>
            )}

            {suggestedTexts.length > 0 && suggestType === "dm" && (
              <div className="p-3 bg-indigo-50/50 border border-indigo-100/60 rounded-xl space-y-2 text-left animate-in fade-in duration-200">
                <p className="text-[10px] font-bold text-indigo-650 flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles size={11} /> AI Suggestions (click to apply)
                </p>
                <div className="space-y-1.5">
                  {suggestedTexts.map((txt, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setTempDM(txt);
                        setSuggestedTexts([]);
                      }}
                      className="w-full text-left p-2.5 bg-white hover:bg-indigo-50/60 border border-zinc-100 hover:border-indigo-200 rounded-xl text-xs font-medium text-zinc-700 transition-all leading-relaxed shadow-sm block"
                    >
                      {txt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );

      // ── Step 4: CTA Button ────────────────────────────────
      case "cta":
        return (
          <motion.div key="cta" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-zinc-200 rounded-[22px] shadow-lg p-3.5 sm:p-4 space-y-3 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <input
                type="text"
                placeholder="Button text (e.g. Shop Now)"
                value={tempBtnText}
                onChange={(e) => setTempBtnText(e.target.value)}
                className="px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-[14px] text-[14.5px] font-medium outline-none focus:border-[#6366F1] transition-all"
              />
              <input
                type="text"
                placeholder="URL (https://...)"
                value={tempBtnLink}
                onChange={(e) => setTempBtnLink(e.target.value)}
                className="px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-[14px] text-[14.5px] font-medium outline-none focus:border-[#6366F1] transition-all"
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
                className="flex-1 py-3 bg-[#6366F1] text-white rounded-[14px] font-bold text-[14px] disabled:opacity-40 transition-all hover:bg-[#4f46e5] cursor-pointer"
              >
                Add Button
              </button>
            </div>
          </motion.div>
        );

      // ── Step 5: Public reply ──────────────────────────────
      case "public_reply":
        return (
          <motion.div key="pr" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-2 text-left bg-white border border-zinc-200 rounded-[22px] p-3.5 sm:p-4 shadow-md animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Comment Reply Variations</span>
              <button
                type="button"
                onClick={() => {
                  if (currentPlan === "free") {
                    onUpgradeClick?.("magic_write");
                  } else {
                    handleAiSuggest("public_reply", publicReplyVariants[0] || "");
                  }
                }}
                disabled={currentPlan !== "free" && isSuggesting}
                className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 rounded-lg text-[11px] font-bold text-indigo-600 shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <Sparkles size={11} />
                <span>Suggest with AI</span>
                {currentPlan === "free" && <span className="text-[10px]">👑</span>}
              </button>
            </div>

            {/* List of variations */}
            <div className="space-y-2 max-h-[160px] overflow-y-auto no-scrollbar pr-1">
              {publicReplyVariants.map((variant, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={variant}
                    onChange={(e) => {
                      const updated = [...publicReplyVariants];
                      updated[idx] = e.target.value;
                      setPublicReplyVariants(updated);
                    }}
                    placeholder={`e.g. Sent! Check your DMs 📬`}
                    className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold outline-none focus:border-[#6366F1] focus:bg-white transition-all"
                  />
                  {publicReplyVariants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPublicReplyVariants(publicReplyVariants.filter((_, i) => i !== idx))}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {publicReplyVariants.length < 5 && (
              <button
                type="button"
                onClick={() => setPublicReplyVariants([...publicReplyVariants, ""])}
                className="w-full py-2 border border-dashed border-zinc-200 rounded-xl text-xs font-bold text-zinc-500 hover:border-[#6366F1] hover:text-[#6366F1] transition-all flex items-center justify-center gap-1"
              >
                <Plus size={13} strokeWidth={2.5} /> Add variation reply
              </button>
            )}

            {/* Loader / AI Suggestions */}
            {isSuggesting && suggestType === "public_reply" && (
              <div className="flex items-center justify-center py-4 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-zinc-500">Generating comment variations...</span>
                </div>
              </div>
            )}

            {suggestedTexts.length > 0 && suggestType === "public_reply" && (
              <div className="p-3 bg-indigo-50/50 border border-indigo-100/60 rounded-xl space-y-2 animate-in fade-in duration-200">
                <p className="text-[10px] font-bold text-indigo-650 uppercase tracking-wider">
                  <Sparkles size={11} /> AI Suggestions (click to add as variant)
                </p>
                <div className="space-y-1">
                  {suggestedTexts.map((txt, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        const emptyIdx = publicReplyVariants.findIndex(v => v.trim() === "");
                        if (emptyIdx !== -1) {
                          const updated = [...publicReplyVariants];
                          updated[emptyIdx] = txt;
                          setPublicReplyVariants(updated);
                        } else if (publicReplyVariants.length < 5) {
                          setPublicReplyVariants([...publicReplyVariants, txt]);
                        } else {
                          const updated = [...publicReplyVariants];
                          updated[updated.length - 1] = txt;
                          setPublicReplyVariants(updated);
                        }
                        setSuggestedTexts(suggestedTexts.filter((_, i) => i !== index));
                      }}
                      className="w-full text-left p-2.5 bg-white hover:bg-indigo-50 border border-zinc-100 hover:border-indigo-200 rounded-lg text-[11px] font-medium text-zinc-700 transition-all leading-normal shadow-sm block"
                    >
                      {txt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Presets suggestions */}
            <div className="space-y-1.5 border-t border-zinc-100 pt-3">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Presets</p>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {PUBLIC_REPLY_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      const emptyIdx = publicReplyVariants.findIndex(v => v.trim() === "");
                      if (emptyIdx !== -1) {
                        const updated = [...publicReplyVariants];
                        updated[emptyIdx] = s;
                        setPublicReplyVariants(updated);
                      } else if (publicReplyVariants.length < 5) {
                        setPublicReplyVariants([...publicReplyVariants, s]);
                      }
                    }}
                    className="shrink-0 px-3.5 py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-full text-xs font-semibold text-zinc-650 shadow-sm transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleConfirmPublicReply()}
              disabled={publicReplyVariants.filter(r => r.trim() !== "").length === 0}
              className="w-full py-3 bg-zinc-950 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-[#6366F1] transition-all disabled:opacity-40"
            >
              Confirm Replies <ArrowRight size={16} />
            </button>
          </motion.div>
        );

      // ── Step 6: Follow gate ───────────────────────────────
      case "follow_gate":
        return (
          <motion.div key="fg" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-2">
            {!followerGateEnabled ? (
              <div className="flex gap-3">
                <button
                  onClick={() => handleConfirmFollowGate(false, "")}
                  className="flex-1 py-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-bold shadow-sm hover:border-zinc-300 transition-all text-sm animate-in fade-in duration-200"
                >
                  No, Skip
                </button>
                <button
                  onClick={() => setFollowerGateEnabled(true)}
                  className="flex-1 py-3 bg-[#6366F1] text-white rounded-xl font-bold shadow-lg hover:bg-[#4f46e5] transition-all text-sm animate-in fade-in duration-200 cursor-pointer"
                >
                  Yes, Enable 🔒
                </button>
              </div>
            ) : (
              <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-lg space-y-3 animate-in fade-in duration-200">
                <label className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Customize Follow Gate Message
                </label>
                <textarea
                  value={tempFollowGateMsg}
                  onChange={(e) => setTempFollowGateMsg(e.target.value)}
                  placeholder="e.g. One final step to unlock! 🎁"
                  rows={2}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-[14px] text-[14px] font-medium outline-none focus:border-[#6366F1] transition-all resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFollowerGateEnabled(false);
                      setTempFollowGateMsg("One final step to unlock! 🎁");
                    }}
                    className="flex-1 py-2 bg-zinc-100 text-zinc-700 rounded-[12px] font-bold text-[13px] hover:bg-zinc-200 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleConfirmFollowGate(true, tempFollowGateMsg)}
                    className="flex-1 py-2 bg-[#6366F1] text-white rounded-[12px] font-bold text-[13px] hover:bg-[#4f46e5] transition-all cursor-pointer"
                  >
                    Confirm & Continue
                  </button>
                </div>
              </div>
            )}
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
                    className={`flex flex-col gap-2 p-4 rounded-[18px] border-2 text-left transition-all ${storyTriggerType === t.id
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
                    className={`flex-1 py-3 rounded-[14px] text-[13px] font-bold border-2 transition-all ${storyCondition === c
                      ? "border-[#6366F1] bg-[#6366F1]/5 text-[#6366F1]"
                      : "border-zinc-200 bg-white text-zinc-650"
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
                placeholder="e.g. COLLAB"
                value={storyKeyword}
                onChange={(e) => setStoryKeyword(e.target.value.toUpperCase())}
                className="w-full px-5 py-3.5 border-2 border-zinc-200 rounded-[16px] text-[14px] font-bold uppercase outline-none focus:border-[#6366F1] transition-all"
              />
            )}

            <button
              onClick={handleConfirmStory}
              className="w-full py-3 bg-[#6366F1] text-white rounded-sm text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-[#4f46e5] transition-all cursor-pointer"
            >
              Next: Set DM Reply <ArrowRight size={16} />
            </button>
          </motion.div>
        );

      case "story_dm":
        return (
          <motion.div key="story-dm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-2">
            <div className="relative flex items-end w-full bg-zinc-50 border border-zinc-200 rounded-xl focus-within:border-[#6366F1] focus-within:bg-white transition-all p-1.5">
              <textarea
                value={storyDM}
                onChange={(e) => setStoryDM(e.target.value)}
                placeholder="DM to send on story interaction..."
                rows={2}
                className="flex-1 w-full px-3 py-2 text-sm outline-none bg-transparent resize-none max-h-32 min-h-[48px] font-medium"
              />
              <button
                onClick={handleConfirmStoryDM}
                disabled={!storyDM.trim()}
                className="shrink-0 mb-0.5 w-8 h-8 bg-[#6366F1] text-white rounded-sm flex items-center justify-center disabled:opacity-40 transition-all hover:bg-[#4f46e5] cursor-pointer"
              >
                <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        );

      // ── FAQ setup ─────────────────────────────────────────
      case "faq_setup":
        return (
          <motion.div key="faq" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-2 bg-white border border-zinc-200 rounded-[22px] p-3.5 sm:p-4 shadow-lg">
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
                    className="w-full text-[13px] text-zinc-655 bg-transparent outline-none resize-none"
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
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {[
                  { id: "friendly", label: "Friendly 😊" },
                  { id: "professional", label: "Professional 🎩" },
                  { id: "concise", label: "Concise ⚡" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setAiPersona(p.id)}
                    className={`py-2 text-[11px] sm:text-[12px] font-bold rounded-[12px] border-2 transition-all ${aiPersona === p.id ? "border-[#6366F1] bg-[#6366F1]/5 text-[#6366F1]" : "border-zinc-200 text-zinc-650"
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
              className="w-full py-3 bg-[#6366F1] text-white rounded-xl text-sm font-semibold disabled:opacity-40 transition-all hover:bg-[#4f46e5] flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              Launch AI FAQ <Sparkles size={16} />
            </button>
          </motion.div>
        );

      // ── Step 8: Sales setup ───────────────────────────────
      case "sales_setup":
        return (
          <motion.div key="sales" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-2 bg-white border border-zinc-200 rounded-[22px] p-3.5 sm:p-4 shadow-lg">
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "friendly", label: "Friendly" },
                  { id: "professional", label: "Pro" },
                  { id: "concise", label: "Concise" },
                  { id: "funny", label: "Witty" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setAiPersona(p.id)}
                    className={`py-2 text-[12px] font-bold rounded-[12px] border-2 transition-all ${aiPersona === p.id ? "border-[#6366F1] bg-[#6366F1]/5 text-[#6366F1]" : "border-zinc-200 text-zinc-650"
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
              className="w-full py-3 bg-[#6366F1] text-white rounded-sm text-sm font-semibold disabled:opacity-40 transition-all hover:bg-[#4f46e5] flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              Launch AI Sales Agent <Rocket size={16} />
            </button>
          </motion.div>
        );

      // ── Done: Launch button ───────────────────────────────
      case "done":
        return (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-2 space-y-2">
            <button
              onClick={() => handlePublish(false)}
              className="w-full py-3 bg-gradient-to-r from-[#6366F1] to-purple-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Rocket size={16} />
              Confirm & Launch Automation
            </button>
            <button
              onClick={() => handlePublish(true)}
              className="w-full py-2.5 bg-white border border-zinc-200 text-zinc-650 rounded-xl text-sm font-semibold shadow-sm hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Save as Draft 📝
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (phase === "select_type") {
    const handleAiBuildClick = (e) => {
      if (currentPlan === "free") {
        e.preventDefault();
        onUpgradeClick?.("ai_builder");
      }
    };

    return (
      <div className="flex flex-col min-h-full sm:h-full w-full max-w-2xl mx-auto relative bg-transparent overflow-y-auto no-scrollbar justify-start sm:justify-center items-center p-4 sm:p-6 gap-6 sm:gap-3">
        {/* Top Section: Header & Template Choice Cards */}
        <div className="flex flex-col items-center text-center max-w-2xl w-full mb-1">
          <img
            src="/logo.png"
            alt="Automixa Logo"
            className="w-10 h-10 object-contain mb-2 select-none"
          />
          <h2 className="text-lg font-black text-zinc-950 tracking-tight">
            What would you like to automate today?
          </h2>
          <p className="text-[11px] font-semibold text-zinc-400 mt-0.5 max-w-md">
            Choose a template below to get started or describe your automation to the AI helper.
          </p>
        </div>

        {/* Template Cards in columns (width matching the chat box) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-2xl mx-auto w-full">
          {AUTOMATION_TYPES.map((type) => {
            const isLocked = type.isPremium && currentPlan === "free";
            return (
              <button
                key={type.id}
                onClick={() => handleSelectType(type)}
                className={`group flex flex-col items-center justify-between p-3.5 rounded-xl border-2 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${isLocked
                  ? "border-zinc-150 bg-zinc-50/50 opacity-80"
                  : `border-zinc-200 bg-white hover:border-[#6366F1] hover:shadow-indigo-500/10`
                  }`}
              >
                <div className="flex flex-col items-center w-full">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 ${type.bg} ${type.color} group-hover:bg-[#6366F1] group-hover:text-white transition-all shadow-sm`}>
                    <type.icon size={20} />
                  </div>
                  <div className="flex items-center gap-1 justify-center flex-wrap">
                    <span className="text-[12px] font-bold text-zinc-950 group-hover:text-[#6366F1] transition-colors">{type.title}</span>
                    {type.isAI && (
                      <span className="px-1 py-0.5 bg-gradient-to-r from-[#6366F1] to-purple-500 text-white text-[7px] font-bold rounded-md">AI</span>
                    )}
                    {isLocked && (
                      <span className="px-1 py-0.5 bg-amber-100 text-amber-700 text-[7px] font-bold rounded-md uppercase">Pro</span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-550 font-medium mt-1 leading-snug px-0.5">{type.desc}</p>
                </div>
                
                <span className="mt-3 text-[9px] font-black text-[#6366F1] uppercase tracking-wider group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Select <ArrowRight size={8} />
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Section: AI One-Shot Chat Box */}
        <div className="w-full max-w-2xl mx-auto">
          <form
            onSubmit={currentPlan === "free" ? handleAiBuildClick : handleAiBuildSubmit}
            className={`bg-white border border-zinc-200 rounded-[20px] p-4 shadow-lg space-y-3 text-left transition-all ${currentPlan === "free" ? "hover:border-[#6366F1]/50 cursor-pointer" : ""}`}
            onClick={currentPlan === "free" ? handleAiBuildClick : undefined}
          >
            <div className="flex items-center justify-between text-[#6366F1]">
              <div className="flex items-center gap-2">
                <Sparkles size={14} />
                <span className="text-[11px] font-black uppercase tracking-wider">Build with Automixa AI</span>
              </div>
              {currentPlan === "free" && (
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-bold rounded-md uppercase">Pro</span>
              )}
            </div>
            <div className="relative flex items-center w-full bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden focus-within:border-[#6366F1] focus-within:bg-white transition-all">
              <input
                type="text"
                value={aiBuildPrompt}
                onChange={(e) => setAiBuildPrompt(e.target.value)}
                onClick={currentPlan === "free" ? handleAiBuildClick : undefined}
                readOnly={currentPlan === "free"}
                placeholder={currentPlan === "free" ? "Upgrade to Pro to unlock AI Builder" : "Describe what you want to automate in 1 sentence..."}
                className={`flex-1 w-full pl-4 pr-12 py-2.5 text-sm outline-none bg-transparent font-medium ${currentPlan === "free" ? "cursor-pointer text-zinc-400 placeholder:text-zinc-400" : ""}`}
              />
              <button
                type="submit"
                disabled={currentPlan === "free" || !aiBuildPrompt.trim() || isAiBuilding}
                onClick={currentPlan === "free" ? handleAiBuildClick : undefined}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#6366F1] text-white rounded-sm flex items-center justify-center disabled:opacity-40 transition-all hover:bg-[#4f46e5] cursor-pointer"
              >
                <ArrowRight size={15} />
              </button>
            </div>
            {aiBuildError && (
              <p className="text-[11px] text-rose-500 font-semibold px-1">{aiBuildError}</p>
            )}
            <p className="text-[10px] text-zinc-400 font-medium px-1">
              e.g., &quot;Send a VIP discount code when someone comments &apos;COUPON&apos;&quot;
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto relative bg-transparent overflow-hidden">
      {/* ── Back step button ── */}
      {phase !== "select_type" && (
        <div className="shrink-0 px-3 sm:px-5 lg:px-6 pt-3 flex">
          <button
            onClick={handleBackStep}
            className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 rounded-sm px-3 py-1.5 shadow-sm transition-all cursor-pointer"
          >
            ← Back Step
          </button>
        </div>
      )}
      {/* ── Chat messages ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-5 lg:px-6 py-4 space-y-4 no-scrollbar pb-8 bg-transparent">
        {/* Intro header — shown only at the very start */}
        {messages.length === 1 && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center pt-6 pb-2"
          >
            <img
              src="/logo.png"
              alt="Automixa Logo"
              className="w-16 h-16 object-contain mb-4 select-none animate-in zoom-in-75 duration-500"
            />
            <h2 className="text-[22px] font-black text-zinc-950 tracking-tight mb-1">
              Automixa AI
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
            <img
              src="/logo.png"
              alt="Automixa AI"
              className="w-8 h-8 object-contain shrink-0 select-none"
            />
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
      <div className="shrink-0 px-3 sm:px-5 lg:px-6 pb-4 pt-2 bg-transparent">
        <AnimatePresence mode="wait">{renderInputPanel()}</AnimatePresence>
      </div>
    </div>
  );
}
