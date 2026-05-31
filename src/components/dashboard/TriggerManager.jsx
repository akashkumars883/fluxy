"use client";

import { AnimatePresence,motion } from "framer-motion";
import { AlertCircle,ArrowRight,Brain,Calendar,Camera,Check,CircleChevronLeft,Clock,Edit2,Gift,Globe,Loader2,MessageSquare,MousePointer2,Plus,Rocket,Send,Sparkles,Star,Trash2,Users,Video,X,Zap } from "lucide-react";
import { useState } from "react";
import CampaignWizard from "./CampaignWizard";

export default function TriggerManager({ initialTriggers, media = [] }) {
  return (
    <div className="p-6 bg-white/40 backdrop-blur-3xl border border-zinc-200/80 rounded-xl shadow-xl w-full max-w-[1400px] mx-auto">
      <h2 className="text-xl font-black text-[#6366F1] tracking-tight">Trigger Manager</h2>
    </div>
  );
}

export function TriggerInputModal({ isOpen, onClose, onSelect, currentPlan = "free", onUpgradeClick }) {
  const [campaignName, setCampaignName] = useState("");

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!campaignName.trim()) return;
    // Pass 'unified' — the wizard itself will handle automation type selection
    onSelect("unified", campaignName.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && campaignName.trim()) handleCreate();
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
            className="relative w-full max-w-md bg-white border border-zinc-200/60 rounded-[24px] shadow-2xl p-8 flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[16px] flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Brain size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-zinc-950 tracking-tight">New Automation</h2>
                  <p className="text-[12px] font-medium text-zinc-400 mt-0.5">AI will guide you through setup</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-700 rounded-xl transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Campaign name */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">Campaign Name</label>
              <input
                type="text"
                placeholder="e.g. Summer Sale Campaign"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-[16px] px-5 py-4 text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all"
              />
              <p className="text-[12px] text-zinc-400 font-medium px-1">
                Don't worry about the type — our AI Copilot will ask you what you want to automate.
              </p>
            </div>

            {/* Action */}
            <button
              onClick={handleCreate}
              disabled={!campaignName.trim()}
              className="w-full py-4 bg-zinc-950 hover:bg-[#6366F1] text-white rounded-[16px] text-[14px] font-bold shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start with AI Copilot <ArrowRight size={18} />
            </button>

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


  const handleWizardChange = (newVals) => {
    setWizardValues(prev => ({ ...prev, ...newVals }));
  };



  return (
    <div className="animate-in fade-in duration-500 flex flex-col flex-1 min-h-0">

      {/* Top bar */}
      <div className="px-4 py-3 shrink-0 flex items-center gap-3 border-b border-zinc-100">
        <button onClick={onClose} className="p-2 cursor-pointer text-zinc-400 hover:text-zinc-950 transition-all shrink-0 hover:bg-zinc-100 rounded-xl">
          <CircleChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
            <Brain size={14} className="text-white" />
          </div>
          <h1 className="text-[15px] font-bold text-zinc-900 truncate">{campaignName || "New Automation"}</h1>
        </div>
      </div>

      {/* Unified chat wizard — full width */}
      <div className="flex-1 min-h-0 overflow-hidden">
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
          campaignName={campaignName}
          onPublish={(keyword, response, opts) => {
            onPublish(keyword, response, {
              ...opts,
              target_media_ids: selectedPosts.length > 0 ? selectedPosts : null,
              campaign_name: campaignName
            });
          }}
        />
      </div>
    </div>
  );
}

export function TriggerList({ triggers, media, onDelete, onEdit, onCreateNew, isMasterActive = true, error = null, onToggleActive }) {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tighter">Active Rules</h3>
          <p className="text-[13px] font-medium text-zinc-500 mt-1">Manage your auto-reply keywords and messages</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-[12px] font-bold px-4 py-2 rounded-xl shadow-sm border ${isMasterActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
            {triggers.length} Rules {isMasterActive ? 'Active' : 'Paused'}
          </span>
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
                  {t.keyword}
                </span>
                <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 border border-zinc-200">
                  {t.type === "COMMENT" ? "Comment" : t.type === "DM" ? "DM" : "Story"}
                </span>
                {t.metadata?.campaign_name && (
                  <span className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-500 max-w-[150px] truncate shrink-0">
                    📁 {t.metadata.campaign_name}
                  </span>
                )}
              </div>

              {/* Response Text Preview */}
              <div className="text-[14px] text-zinc-700 font-medium flex items-start gap-2">
                <span className="text-zinc-400 shrink-0 select-none">↳</span>
                <p className="line-clamp-1 italic">&ldquo;{t.response}&rdquo;</p>
              </div>

              {/* Public reply & Buttons */}
              {(t.variants?.public?.[0] || t.metadata?.button_link) && (
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
