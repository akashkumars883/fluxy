"use client";

import { AnimatePresence,motion } from "framer-motion";
import { AlertCircle,ArrowLeft,ArrowRight,Calendar,Camera,Check,Clock,Edit2,Gift,Globe,Loader2,Lock,MessageSquare,MousePointer2,Plus,Rocket,Send,Sparkles,Star,Trash2,Users,Video,X,Zap } from "lucide-react";
import { useState } from "react";
import AutomationPreview from "./AutomationPreview";
import CampaignWizard from "./CampaignWizard";
import EmptyState from "@/components/ui/EmptyState";
import toast from "react-hot-toast";

export default function TriggerManager({ initialTriggers, media = [] }) {
  return (
    <div className="p-6 bg-white/40  border border-zinc-200/80 rounded-md  w-full max-w-[1400px] mx-auto">
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
            className="fixed inset-0 bg-zinc-950/60 "
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white border border-zinc-200 rounded-md  -900/10 p-5 sm:p-8 flex flex-col gap-5 max-h-[90vh] overflow-y-auto no-scrollbar pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-50 border border-zinc-200/60 rounded-md flex items-center justify-center  select-none overflow-hidden shrink-0">
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
                  <p className="text-[12px] font-medium text-black opacity-60 mt-0.5">
                    {quickMode ? "Keyword + Response in seconds" : "AI will guide you through setup"}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-black opacity-60 hover:text-black rounded-md transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Plan Usage Bar */}
            {currentPlan === "free" && (
              <div className="bg-zinc-50 border border-zinc-200 rounded-md p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-black opacity-80 uppercase tracking-wider">Free Plan Rules</span>
                  <span className={`text-[10px] font-bold ${rulesRemaining === 0 ? "text-rose-500" : "text-black opacity-90"}`}>
                    {rulesUsed}/{maxFreeRules} used
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 rounded-md overflow-hidden">
                  <div 
                    className={`h-full rounded-md transition-all duration-500 ${rulesRemaining === 0 ? "bg-rose-500" : "bg-[#6366F1]"}`}
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
            <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-md">
              <button
                onClick={() => setQuickMode(false)}
                className={`flex-1 py-2 px-3 rounded-md text-[11px] font-bold transition-all ${!quickMode ? "bg-white text-black " : "text-black opacity-80 hover:text-black"}`}
              >
                🤖 AI Wizard
              </button>
              <button
                onClick={() => setQuickMode(true)}
                className={`flex-1 py-2 px-3 rounded-md text-[11px] font-bold transition-all ${quickMode ? "bg-white text-black " : "text-black opacity-80 hover:text-black"}`}
              >
                ⚡ Quick Setup
              </button>
            </div>

            {/* Quick Setup Form */}
            {quickMode ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-black opacity-80 uppercase tracking-wider">Campaign Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Sale"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-md px-4 py-3.5 text-[13px] font-semibold text-black placeholder:text-black opacity-60 outline-none focus:border-[#6366F1] focus:bg-white focus:ring-4 focus:ring-[#6366F1]/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-black opacity-80 uppercase tracking-wider">Trigger Keyword</label>
                  <input
                    type="text"
                    placeholder="e.g. PRICE"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleQuickKeyDown}
                    className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-md px-4 py-3.5 text-[13px] font-semibold text-black placeholder:text-black opacity-60 outline-none focus:border-[#6366F1] focus:bg-white focus:ring-4 focus:ring-[#6366F1]/10 transition-all uppercase"
                  />
                  <p className="text-[10px] text-black opacity-60 font-medium">When someone comments this keyword, Auto DM will trigger</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-black opacity-80 uppercase tracking-wider">DM Response</label>
                  <textarea
                    placeholder="e.g. Here's the price list! 🔗 Check your DMs..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleQuickSetup()}
                    rows={3}
                    className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-md px-4 py-3.5 text-[13px] font-semibold text-black placeholder:text-black opacity-60 outline-none focus:border-[#6366F1] focus:bg-white focus:ring-4 focus:ring-[#6366F1]/10 transition-all resize-none"
                  />
                </div>
                <button
                  onClick={handleQuickSetup}
                  disabled={!keyword.trim() || !response.trim() || isQuickLoading || (currentPlan === "free" && rulesRemaining === 0)}
                  className="w-full py-4 bg-[#6366F1] hover:bg-[#4f46e5] text-white rounded-md text-xs font-bold  transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isQuickLoading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-md animate-spin" />
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
                  <label className="text-[12px] font-bold text-black opacity-80 uppercase tracking-wider">Campaign Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Sale Campaign"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-md px-5 py-4 text-[15px] font-semibold text-black placeholder:text-black opacity-60 outline-none focus:border-[#6366F1] focus:bg-white focus:ring-4 focus:ring-[#6366F1]/10 transition-all"
                  />
                  <p className="text-[12px] text-black opacity-60 font-medium px-1">
                    Don't worry about the type - Automixa AI will ask you what you want to automate.
                  </p>
                </div>
                <button
                  onClick={handleCreate}
                  disabled={!campaignName.trim()}
                  className="w-full py-4 bg-zinc-950 hover:bg-[#6366F1] text-white rounded-md text-[14px] font-bold  transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Start with Automixa AI <ArrowRight size={18} />
                </button>
              </div>
            )}

            <button onClick={onClose} className="text-[12px] font-medium text-black opacity-60 hover:text-black opacity-90 transition-all text-center">
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


export function CampaignBuilderWorkspace({ automation, campaignName, templateKey, accountId, onClose, onPublish, currentPlan = "free", onUpgradeClick, media = [], stories = [], initialStrategy }) {
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
      className="animate-in fade-in duration-500 flex flex-col flex-1 h-full min-h-0 bg-transparent text-zinc-950"
    >
      
      {/* Back Button */}
      <header className="shrink-0 border-none bg-transparent px-2 sm:px-6 pt-1 sm:pt-3 pb-0">
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-black opacity-60 hover:text-black hover:border-zinc-300 transition-all cursor-pointer"
          title="Back to automations"
        >
          <ArrowLeft size={18} />
        </button>
      </header>

      {/* Unified chat wizard — centered and responsive */}
      <div className="flex-1 min-h-0 overflow-hidden py-0 sm:py-2 px-0 sm:px-4 max-w-[1240px] mx-auto w-full">
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
          initialStrategy={initialStrategy}
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

export function TriggerList({ triggers, media, onDelete, onEdit, onCreateNew, isMasterActive = true, error = null, onToggleActive, currentPlan = "free", onUpgradeClick, onCreateFromTemplate }) {
  if (error) {
    return (
      <div className="bg-rose-50/80 border border-rose-200 rounded-md p-8 text-center text-rose-800 font-semibold text-xs sm:text-sm">
        <AlertCircle className="mx-auto mb-2" size={32} />
        <p>{error}</p>
      </div>
    );
  }

  if (!triggers || triggers.length === 0) {
    return (
      <EmptyState
        icon={Rocket}
        title="No Automations Yet"
        description="You haven't set up any keywords to auto-reply to comments or DMs yet. Create one now to engage your audience 24/7."
        actionText="Create Auto-Reply"
        onAction={onCreateNew}
      />
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-500 w-full max-w-[1400px] mx-auto pb-10">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-black opacity-60 uppercase tracking-widest mb-1">
            Automation Center
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
            Automation Rules
          </h2>
          <p className="text-sm text-black opacity-60 font-medium mt-1">
            Manage your auto-reply keywords and DM messages.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`hidden sm:inline-flex text-[11px] font-semibold px-3 py-1.5 rounded-md border ${isMasterActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-50 text-black opacity-80 border-zinc-200'}`}>
            {triggers.length} Rules
          </span>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#6366F1] hover:bg-[#4f46e5] text-white text-xs font-bold rounded-md transition-all cursor-pointer"
          >
            <Plus size={13} strokeWidth={2.5} /> Create Rule
          </button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { id: "comment_dm", title: "Comment → DM", icon: MessageSquare, desc: "Auto DM on keyword comment", color: "text-blue-600", bg: "bg-blue-50" },
          { id: "story_automator", title: "Story Reply", icon: Camera, desc: "Reply to story interactions", color: "text-orange-600", bg: "bg-orange-50" },
          { id: "faq_assistant", title: "AI FAQ Bot", icon: Zap, desc: "Auto-answer common questions", color: "text-purple-600", bg: "bg-purple-50", isAI: true },
          { id: "sales_closer", title: "AI Sales Agent", icon: Rocket, desc: "Close deals via DM 24/7", color: "text-emerald-600", bg: "bg-emerald-50", isAI: true },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onCreateFromTemplate ? onCreateFromTemplate(t.id) : onCreateNew()}
              className="group relative overflow-hidden flex flex-col items-start p-4 bg-white border border-zinc-200/60 rounded-md hover:border-indigo-200 hover: transition-all duration-300 cursor-pointer text-left hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-zinc-50/50 -z-10" />
              <div className={`w-8 h-8 ${t.bg} ${t.color} rounded-md flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={16} />
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm font-bold text-black group-hover:text-indigo-600 transition-colors">{t.title}</span>
                {t.isAI && (
                  <span className="px-1.5 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[8px] font-bold rounded-md uppercase tracking-wider">AI</span>
                )}
              </div>
              <p className="text-[11px] text-black opacity-80 font-medium leading-relaxed">{t.desc}</p>
            </button>
          );
        })}
      </div>

      {/* List Header Info */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-zinc-950">All Rules</h3>
      </div>

      {/* Trigger List Items - Compact */}
      <div className="space-y-2">
        {triggers.map((t) => (
          <div 
            key={t.id} 
            className="bg-white border border-zinc-200/60 rounded-md hover:border-indigo-200 hover: transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 group"
          >
            <div className="space-y-1.5 flex-1 min-w-0 relative z-10">
              {/* Top Row: Keyword and Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#6366F1]/10 text-[#6366F1] font-mono text-[12px] font-bold px-2 py-0.5 rounded-md">
                  {t.keyword?.toUpperCase()}
                </span>
                <span className="px-2 py-0.5 bg-zinc-100 text-black opacity-90 rounded-md text-[9px] font-bold uppercase tracking-wider border border-zinc-200">
                  {t.type === "COMMENT" ? "Comment" : t.type === "DM" ? "DM" : "Story"}
                </span>
                {t.metadata?.campaign_name && (
                  <span className="px-2 py-0.5 bg-zinc-50 border border-zinc-200 rounded-md text-[10px] font-semibold text-black opacity-80 max-w-[140px] truncate">
                    {t.metadata.campaign_name}
                  </span>
                )}
                {t.metadata?.is_draft ? (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[9px] font-bold uppercase">Draft</span>
                ) : t.metadata?.is_active !== false ? (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[9px] font-bold uppercase">Live</span>
                ) : (
                  <span className="px-2 py-0.5 bg-zinc-50 text-black opacity-80 border border-zinc-200 rounded-md text-[9px] font-bold uppercase">Paused</span>
                )}
              </div>

              {/* Response Text Preview */}
              <div className="text-[13px] text-black font-medium flex items-start gap-1.5">
                <span className="text-black opacity-60 shrink-0 select-none">↳</span>
                <p className="line-clamp-1 italic">&ldquo;{t.response}&rdquo;</p>
              </div>

              {/* Public reply, Buttons & Follow Gate */}
              {(t.variants?.public?.[0] || t.metadata?.button_link || t.metadata?.follower_gate) && (
                <div className="flex items-center gap-2.5 flex-wrap text-[10px]">
                  {t.variants?.public?.[0] && (
                    <div className="flex items-center gap-1 text-black opacity-80">
                      <Globe size={10} className="text-[#6366F1]" />
                      <span className="font-medium truncate max-w-[180px]">{t.variants.public[0]}</span>
                    </div>
                  )}
                  {t.metadata?.button_link && (
                    <div className="flex items-center gap-1 text-black opacity-80">
                      <MousePointer2 size={10} className="text-[#6366F1]" />
                      <span className="font-medium">{t.metadata.button_text || "Link"}</span>
                    </div>
                  )}
                  {t.metadata?.follower_gate && (
                    <div className="flex items-center gap-1 text-black opacity-80">
                      <Lock size={10} className="text-amber-500" />
                      <span className="font-medium truncate max-w-[180px]">{t.metadata.follow_gate_message || "Follow gate active"}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status & Actions */}
            <div className="flex items-center justify-between md:justify-end gap-2 self-stretch md:self-center shrink-0 border-t border-zinc-100 md:border-t-0 pt-2.5 md:pt-0">
              <div className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100/80">
                <span className="text-[10px] font-bold text-black opacity-80">Active</span>
                <div 
                  onClick={() => onToggleActive && onToggleActive(t.id, t.metadata?.is_active !== false)}
                  className={`w-8 h-4.5 rounded-md relative cursor-pointer hover:opacity-90 transition-all duration-300 ${
                    t.metadata?.is_active !== false ? "bg-[#6366F1]" : "bg-zinc-300"
                  }`}
                >
                  <div className={`w-3.5 h-3.5 bg-white rounded-md absolute top-[2px] transition-all duration-300 ${
                    t.metadata?.is_active !== false ? "right-[2px]" : "left-[2px]"
                  }`} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit(t)} 
                  className="w-9 h-9 bg-zinc-50 border border-zinc-200 hover:border-indigo-300 rounded-md text-black opacity-60 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center cursor-pointer"
                  title="Edit Rule"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => onDelete(t.id)} 
                  className="w-9 h-9 bg-zinc-50 border border-zinc-200 hover:border-rose-300 rounded-md text-black opacity-60 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center justify-center cursor-pointer"
                  title="Delete Rule"
                >
                  <Trash2 size={14} />
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