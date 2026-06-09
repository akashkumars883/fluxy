"use client";

import { AnimatePresence,motion } from "framer-motion";
import { AlertCircle,ArrowRight,Calendar,Camera,Check,CircleChevronLeft,Clock,Edit2,Gift,Globe,Loader2,Lock,MessageSquare,MousePointer2,Plus,Rocket,Send,Sparkles,Star,Trash2,Users,Video,X,Zap } from "lucide-react";
import { useState } from "react";
import AutomationPreview from "./AutomationPreview";
import CampaignWizard from "./CampaignWizard";
import toast from "react-hot-toast";

export default function TriggerManager({ initialTriggers, media = [] }) {
  return (
    <div className="p-6 bg-white/40 backdrop-blur-3xl border border-zinc-200/80 rounded-xl shadow-xl w-full max-w-[1400px] mx-auto">
      <h2 className="text-xl font-black text-[#6366F1] tracking-tight">Trigger Manager</h2>
    </div>
  );
}

export function TriggerInputModal({ isOpen, onClose, onSelect, currentPlan = "free", onUpgradeClick, triggersCount = 0 }) {
  const [campaignName, setCampaignName] = useState("");
  const [quickMode, setQuickMode] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [response, setResponse] = useState("");
  const [isQuickLoading, setIsQuickLoading] = useState(false);

  if (!isOpen) return null;

  const maxFreeRules = 5;
  const rulesUsed = triggersCount;
  const rulesRemaining = Math.max(0, maxFreeRules - rulesUsed);

  const handleCreate = () => {
    if (!campaignName.trim()) return;
    onSelect("unified", campaignName.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && campaignName.trim()) handleCreate();
  };

  const handleQuickSetup = async () => {
    if (!keyword.trim() || !response.trim()) return;
    setIsQuickLoading(true);
    try {
      // Simple keyword + response → direct create
      const res = await fetch("/api/triggers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: keyword.trim().toUpperCase(),
          response: response.trim(),
          type: "COMMENT",
          metadata: {
            campaign_name: campaignName.trim() || `${keyword.trim().toUpperCase()} Auto-Reply`,
            is_active: true,
          },
          variants: {
            dm: [response.trim()],
            public: [],
          },
        }),
      });

      const result = await res.json();
      if (result.success && result.trigger) {
        onClose();
        // Trigger a refresh
        window.dispatchEvent(new Event("refresh_dashboard_data"));
      } else {
        toast.error(result.error || "Failed to create rule");
      }
    } catch (err) {
      toast.error("Failed to create rule. Please try again.");
    } finally {
      setIsQuickLoading(false);
    }
  };

  const handleQuickKeyDown = (e) => {
    if (e.key === "Enter" && keyword.trim() && response.trim()) handleQuickSetup();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/50 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="relative w-full max-w-md bg-white border border-zinc-200/60 rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-50 border border-zinc-200/60 rounded-xl flex items-center justify-center shadow-sm select-none overflow-hidden shrink-0">
                  <img
                    src="/logo.png"
                    alt="Automixa Logo"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-black text-zinc-950 tracking-tight">
                    {quickMode ? "Quick Setup" : "New Automation"}
                  </h2>
                  <p className="text-[12px] font-medium text-zinc-400 mt-0.5">
                    {quickMode ? "Keyword + Response in seconds" : "AI will guide you through setup"}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-700 rounded-xl transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Plan Usage Bar */}
            {currentPlan === "free" && (
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Free Plan Rules</span>
                  <span className={`text-[10px] font-bold ${rulesRemaining === 0 ? "text-rose-500" : "text-zinc-600"}`}>
                    {rulesUsed}/{maxFreeRules} used
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${rulesRemaining === 0 ? "bg-rose-500" : "bg-[#6366F1]"}`}
                    style={{ width: `${Math.min(100, (rulesUsed / maxFreeRules) * 100)}%` }}
                  />
                </div>
                {rulesRemaining === 0 && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1.5">
                    ⚠️ Upgrade to create more rules
                  </p>
                )}
              </div>
            )}

            {/* Mode Toggle */}
            <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-xl">
              <button
                onClick={() => setQuickMode(false)}
                className={`flex-1 py-2 px-3 rounded-lg text-[11px] font-bold transition-all ${!quickMode ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
              >
                🤖 AI Wizard
              </button>
              <button
                onClick={() => setQuickMode(true)}
                className={`flex-1 py-2 px-3 rounded-lg text-[11px] font-bold transition-all ${quickMode ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
              >
                ⚡ Quick Setup
              </button>
            </div>

            {/* Quick Setup Form */}
            {quickMode ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Campaign Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Sale"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-xl px-4 py-3 text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Trigger Keyword</label>
                  <input
                    type="text"
                    placeholder="e.g. PRICE"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleQuickKeyDown}
                    className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-xl px-4 py-3 text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all uppercase"
                  />
                  <p className="text-[10px] text-zinc-400 font-medium">When someone comments this keyword, Auto DM will trigger</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">DM Response</label>
                  <textarea
                    placeholder="e.g. Here's the price list! 🔗 Check your DMs..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleQuickSetup()}
                    rows={3}
                    className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-xl px-4 py-3 text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all resize-none"
                  />
                </div>
                <button
                  onClick={handleQuickSetup}
                  disabled={!keyword.trim() || !response.trim() || isQuickLoading || (currentPlan === "free" && rulesRemaining === 0)}
                  className="w-full py-3.5 bg-[#6366F1] hover:bg-[#4f46e5] text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isQuickLoading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Rocket size={16} /> Create Auto-Reply
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* AI Wizard Mode */
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">Campaign Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Sale Campaign"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-xl px-5 py-4 text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all"
                  />
                  <p className="text-[12px] text-zinc-400 font-medium px-1">
                    Don&apos;t worry about the type - Automixa AI will ask you what you want to automate.
                  </p>
                </div>
                <button
                  onClick={handleCreate}
                  disabled={!campaignName.trim()}
                  className="w-full py-4 bg-zinc-950 hover:bg-[#6366F1] text-white rounded-xl text-[14px] font-bold shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start with Automixa AI <ArrowRight size={18} />
                </button>
              </div>
            )}

            <button onClick={onClose} className="text-[12px] font-medium text-zinc-400 hover:text-zinc-600 transition-all text-center">
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


export function CampaignBuilderWorkspace({ automation, campaignName, templateKey, accountId, onClose, onPublish, currentPlan = "free", onUpgradeClick, media = [], stories = [] }) {
  const [wizardValues, setWizardValues] = useState({
    keyword: "",
    response: "",
    type: "COMMENT",
    followerGate: false,
    publicReply: "",
    buttonText: "",
    buttonLink: "",
    faqEnabled: false,
    faqs: [],
    leadCaptureEnabled: false,
    campaignStrategy: "comment_dm",
    storyCondition: "ANY",
    storyTriggerType: "REPLY"
  });

  const [selectedPosts, setSelectedPosts] = useState([]);
  const [wizardPhase, setWizardPhase] = useState("select_type");
  const [campaignNameState, setCampaignNameState] = useState(campaignName || "New Campaign");

  const handleWizardChange = (newVals) => {
    setWizardValues(prev => ({ ...prev, ...newVals }));
  };

  const selectedPreviewPost = selectedPosts.length > 0
    ? media.find((item) => item.id === selectedPosts[0])
    : null;

  const selectedPostUrl = selectedPreviewPost
    ? (selectedPreviewPost.media_type === "VIDEO" || selectedPreviewPost.media_product_type === "REELS"
        ? selectedPreviewPost.thumbnail_url || selectedPreviewPost.media_url
        : selectedPreviewPost.media_url)
    : "";

  const activeUsername = automation?.ig_username || automation?.page_name || automation?.name || "Instagram account";
  const activeProfilePic = automation?.profile_pic || automation?.profile_picture_url || automation?.metadata?.profile_picture_url || automation?.metadata?.profile_pic || null;
  
  const strategyLabel = wizardValues.campaignStrategy === "story_automator"
    ? "Story automation"
    : wizardValues.campaignStrategy === "faq_assistant"
      ? "AI FAQ assistant"
      : wizardValues.campaignStrategy === "sales_closer"
        ? "AI sales agent"
        : "Comment to DM";
  return (
    <div 
      className="animate-in fade-in duration-500 flex flex-col flex-1 h-full min-h-0 bg-white text-zinc-950"
    >
      
      {/* Header / Navbar */}
      <header className="shrink-0 border-none bg-transparent px-4 py-3 shadow-none sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-650 shadow-sm transition-all hover:border-zinc-300 hover:text-zinc-950 cursor-pointer"
              title="Back to automations"
            >
              <CircleChevronLeft size={18} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={campaignNameState}
                  onChange={(e) => setCampaignNameState(e.target.value)}
                  className="bg-transparent border-none font-black text-zinc-950 text-base sm:text-lg focus:ring-0 focus:outline-none p-0 select-all cursor-text rounded max-w-[200px] sm:max-w-xs"
                  placeholder="Campaign Name"
                />
              </div>
              <p className="mt-0.5 truncate text-[11px] font-semibold text-zinc-500">
                {strategyLabel} Setup
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Connected Account Avatar & Name */}
            <div className="flex items-center gap-2 bg-transparent border-none p-0 shadow-none">
              <div className="text-right hidden sm:block shrink-0">
                <span className="block text-[9px] font-black text-zinc-400 uppercase tracking-wider leading-none">Instagram</span>
                <span className="text-[11px] font-black text-zinc-750 leading-none">@{activeUsername}</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 p-[1px] flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-white rounded-full p-[0.5px]">
                  <div className="w-full h-full bg-zinc-100 rounded-full flex items-center justify-center text-[9px] font-bold text-zinc-900 overflow-hidden select-none">
                    {activeProfilePic ? (
                      <img src={activeProfilePic} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                      activeUsername[0]?.toUpperCase()
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Unified chat wizard — centered and responsive */}
      <div className="flex-1 min-h-0 overflow-hidden py-2 px-4 max-w-[1240px] mx-auto w-full">
        <div className="grid h-full min-h-0 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-6">
        <CampaignWizard
          values={wizardValues}
          onChange={handleWizardChange}
          onBack={onClose}
          media={media}
          stories={stories && stories.length > 0
            ? stories.map(s => ({
                id: s.id,
                media_url: s.media_url || s.thumbnail_url,
                timestamp: s.timestamp
                  ? new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Active'
              }))
            : INSTAGRAM_STORIES_MOCK}
          selectedPosts={selectedPosts}
          onSelectPosts={(selection) => setSelectedPosts(selection)}
          currentPlan={currentPlan}
          onUpgradeClick={onUpgradeClick}
          campaignName={campaignNameState}
          onPhaseChange={setWizardPhase}
          onPublish={(keyword, response, opts) => {
            onPublish(keyword?.trim().toUpperCase(), response, {
              ...opts,
              target_media_ids: selectedPosts.length > 0 ? selectedPosts : null,
              campaign_name: campaignNameState
            });
          }}
        />
          <aside className="hidden xl:flex min-h-0 flex-col justify-center bg-transparent overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col justify-center">
              <AutomationPreview
                keyword={wizardValues.keyword}
                response={wizardValues.response}
                buttonText={wizardValues.buttonText}
                buttonLink={wizardValues.buttonLink}
                introTitle={wizardValues.introMessage}
                introButtonText={wizardValues.introButtonText}
                publicReply={wizardValues.publicReply}
                postUrl={selectedPostUrl}
                strategy={wizardValues.campaignStrategy}
                faqs={wizardValues.faqs}
                aiGoal={wizardValues.aiGoal}
                aiKnowledge={wizardValues.aiKnowledge}
                storyTriggerType={wizardValues.storyTriggerType === "MENTION" ? "MENTION" : "REPLY"}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function TriggerList({ triggers, media, onDelete, onEdit, onCreateNew, isMasterActive = true, error = null, onToggleActive, currentPlan = "free", onUpgradeClick }) {
  if (error) {
    return (
      <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-8 text-center text-rose-800 font-semibold text-xs sm:text-sm">
        <AlertCircle className="mx-auto mb-2" size={32} />
        <p>{error}</p>
      </div>
    );
  }

  if (!triggers || triggers.length === 0) {
    return (
      <div className="bg-white border border-zinc-200/60 rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
        <div className="w-14 h-14 bg-[#6366F1]/10 text-[#6366F1] rounded-xl flex items-center justify-center border border-[#6366F1]/20 shadow-sm">
          <Rocket size={24} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-zinc-900 mb-1 tracking-tight">No Auto-Reply Rules Yet</h3>
          <p className="text-xs sm:text-sm font-normal text-zinc-500 max-w-md mx-auto leading-relaxed">
            You haven&apos;t set up any keywords to auto-reply to comments or DMs yet. Create one now to get started!
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-12 py-4 bg-[#6366F1] text-white rounded-xl text-[12px] font-semibold shadow-2xl transition-all flex items-center gap-2 hover:scale-[1.02]"
        >
          <Plus size={18} strokeWidth={2.5} /> <span>Create Auto-Reply</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Premium Upgrade Banner Card (Visible for Free & Pro users) */}
      {currentPlan !== 'viral_scale' && (
        <div className="bg-gradient-to-r from-[#6366F1] to-indigo-700 text-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md relative overflow-hidden animate-in fade-in">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start sm:items-center gap-3.5 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold tracking-tight mb-0.5">
                {currentPlan === 'free' ? "Upgrade Automations with Business Pro" : "Upgrade to Business Scale"}
              </h4>
              <p className="text-[11px] text-indigo-100 font-medium leading-normal max-w-xl">
                {currentPlan === 'free' 
                  ? "Get unlimited automated replies, unlock the Mini Digital Store to sell directly inside DMs, and build premium Link-in-Bio landing pages."
                  : "Get up to 50,000 monthly automated replies, advanced CRM tracking, and full agency multi-workspace collaboration features."
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => onUpgradeClick?.(currentPlan === 'free' ? "creator_pro" : "viral_scale")}
            className="shrink-0 w-full sm:w-auto px-5 py-2 bg-white hover:bg-zinc-50 text-indigo-700 text-[11px] font-bold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      <div className="flex flex-row items-center justify-between gap-4 px-1">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">Active Rules</h3>
          <p className="text-[12px] font-medium text-zinc-550 mt-0.5">Manage your auto-reply keywords and DM messages</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`hidden sm:inline-flex text-[11px] font-black px-3.5 py-2 rounded-xl border ${isMasterActive ? 'bg-emerald-50 text-emerald-700 border-emerald-150 shadow-sm' : 'bg-zinc-50 text-zinc-500 border-zinc-200'}`}>
            {triggers.length} Rules {isMasterActive ? 'Active' : 'Paused'}
          </span>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#6366F1] hover:bg-[#4f46e5] px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-indigo-500/10 cursor-pointer animate-in fade-in duration-300"
          >
            <Plus size={14} strokeWidth={2.5} /> Create Rule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {triggers.map((t) => (
          <div 
            key={t.id} 
            className="bg-white border border-zinc-200 hover:border-[#6366F1]/30 rounded-[18px] p-4 sm:p-5 shadow-sm hover:shadow-md hover:shadow-[#6366F1]/5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group relative"
          >
            <div className="space-y-2 flex-1 min-w-0 relative z-10">
              {/* Top Row: Keyword and Badges */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="bg-[#6366F1]/10 text-[#6366F1] font-mono text-[13px] font-bold px-3 py-1 rounded-lg border border-[#6366F1]/20">
                  {t.keyword?.toUpperCase()}
                </span>
                <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 border border-zinc-200">
                  {t.type === "COMMENT" ? "Comment" : t.type === "DM" ? "DM" : "Story"}
                </span>
                {t.metadata?.campaign_name && (
                  <span className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-500 max-w-[150px] truncate shrink-0">
                    📁 {t.metadata.campaign_name}
                  </span>
                )}
                {t.metadata?.is_draft ? (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0">
                    📝 Draft
                  </span>
                ) : t.metadata?.is_active !== false ? (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0">
                    🟢 Live
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-zinc-50 text-zinc-500 border border-zinc-200 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0">
                    ⏸️ Paused
                  </span>
                )}
              </div>

              {/* Response Text Preview */}
              <div className="text-[14px] text-zinc-700 font-medium flex items-start gap-2">
                <span className="text-zinc-400 shrink-0 select-none">↳</span>
                <p className="line-clamp-1 italic">&ldquo;{t.response}&rdquo;</p>
              </div>

              {/* Public reply, Buttons & Follow Gate */}
              {(t.variants?.public?.[0] || t.metadata?.button_link || t.metadata?.follower_gate) && (
                <div className="flex items-center gap-3 flex-wrap text-[11px] pt-1">
                  {t.variants?.public?.[0] && (
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Globe size={12} className="text-[#6366F1]" />
                      <span className="font-medium truncate max-w-[200px]">Public: &ldquo;{t.variants.public[0]}&rdquo;</span>
                    </div>
                  )}

                  {t.metadata?.button_link && (
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <MousePointer2 size={12} className="text-[#6366F1]" />
                      <span className="font-medium">Button: {t.metadata.button_text || "Link"}</span>
                    </div>
                  )}

                  {t.metadata?.follower_gate && (
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Lock size={12} className="text-amber-500" />
                      <span className="font-medium truncate max-w-[200px]">Gate: &ldquo;{t.metadata.follow_gate_message || "One final step to unlock! 🎁"}&rdquo;</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status & Actions Column */}
            <div className="flex items-center justify-between md:justify-end gap-4 self-stretch md:self-center shrink-0 border-t border-zinc-100 md:border-t-0 pt-3 md:pt-0 relative z-10">
              <div className="flex items-center gap-2.5 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-100">
                <span className="text-[11px] font-bold text-zinc-500">Active</span>
                <div 
                  onClick={() => onToggleActive && onToggleActive(t.id, t.metadata?.is_active !== false)}
                  className={`w-9 h-5 rounded-full relative cursor-pointer shadow-inner hover:opacity-90 transition-all duration-300 ${
                    t.metadata?.is_active !== false ? "bg-[#6366F1]" : "bg-zinc-300"
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${
                    t.metadata?.is_active !== false ? "right-0.5" : "left-0.5"
                  }`} />
                </div>
              </div>
              <div className="hidden md:block h-8 w-[1px] bg-zinc-200" />
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit(t)} 
                  className="w-9 h-9 bg-white border border-zinc-200 hover:border-[#6366F1]/50 rounded-xl text-zinc-500 hover:text-[#6366F1] hover:bg-[#6366F1]/5 transition-all flex items-center justify-center shadow-sm"
                  title="Edit Rule"
                >
                  <Edit2 size={15} />
                </button>
                <button 
                  onClick={() => onDelete(t.id)} 
                  className="w-9 h-9 bg-white border border-zinc-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 rounded-xl text-zinc-400 transition-all flex items-center justify-center shadow-sm"
                  title="Delete Rule"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const INSTAGRAM_POSTS_MOCK = [
  { id: "post_1", media_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80", caption: "New collection dropping tomorrow! 🚀 Comment 'PRICE' for early access link." },
  { id: "post_2", media_url: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80", caption: "Free e-book giveaway! 📚 Comment 'GUIDE' to get the instant download link in your DMs." },
  { id: "post_3", media_url: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80", caption: "Limited time offer! 🎁 Tag a friend and comment 'OFFER' for a 20% discount code." }
];

export const INSTAGRAM_STORIES_MOCK = [
  { id: "story_1", media_url: "https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=800&q=80", timestamp: "2h ago" },
  { id: "story_2", media_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80", timestamp: "5h ago" },
  { id: "story_3", media_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80", timestamp: "12h ago" }
];
