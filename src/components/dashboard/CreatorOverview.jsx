"use client";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Camera,
  CheckCircle2,
  Cpu,
  MessageSquare,
  Plus,
  RefreshCw,
  Rocket,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  X,
  Zap,
  Users,
  Clock,
  ChevronRight,
  MessageSquareMore,
  MessagesSquare,
  BarChart2,
  Play,
  Pause,
} from "lucide-react";
import { useEffect, useState } from "react";
import * as logger from "@/lib/logger";
import { createPortal } from "react-dom";
import { useDashboard } from "@/context/DashboardContext";
import AudienceAvatar from "./AudienceAvatar";
import { motion, AnimatePresence } from "framer-motion";

export default function CreatorOverview({
  stats = {},
  history = [],
  topTriggers = [],
  automationId,
  hideHeader = false,
  onSimulateLocal,
  isActive = true,
  onViewAudience,
  onCreateAutoReply,
  onToggleTriggerActive,
  currentPlan = "free",
  onUpgradeClick,
  onCreateTemplate,
}) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncReport, setSyncReport] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [hideBanner, setHideBanner] = useState(false);

  const { user } = useDashboard();
  const userName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.user_metadata?.name?.split(" ")[0] ||
    "Creator";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
      if (localStorage.getItem("hide_upgrade_banner") === "true") {
        setHideBanner(true);
      }
    }
  }, []);

  const handleMetaSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncReport(null);
    try {
      const res = await fetch(`/api/media/sync?automationId=${automationId}`);
      const data = await res.json();
      setSyncReport(
        data.success && data.diagnostics
          ? { success: true, diagnostics: data.diagnostics }
          : { success: false, error: data.error || "Unknown error during sync check." }
      );
    } catch (err) {
      setSyncReport({ success: false, error: "Network error occurred while syncing with Meta." });
      logger.error("CreatorOverview: Meta sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const { totalDms = 0, autoReplies = 0, engagementRate = "0%" } = stats || {};
  const safeHistory = Array.isArray(history) ? history : [];
  const safeTopTriggers = Array.isArray(topTriggers) ? topTriggers : [];

  const formatTime = (dateStr) => {
    if (!dateStr) return "Just now";
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const activeKeywords = safeTopTriggers.map((t) => ({
    id: t.id,
    keyword: (t.keyword || "AUTO").toUpperCase(),
    triggerType:
      t.type === "COMMENT" ? "Post Comment"
        : t.type === "STORY_REPLY" ? "Story Reply"
          : t.type === "DM" ? "Direct Inbox"
            : "Reel Comment",
    isActive: t.metadata?.is_active !== false,
    comments: t.count,
  }));

  const metricCards = [
    {
      label: "Auto Replies",
      value: autoReplies,
      icon: MessageSquareMore,
      gradient: "from-indigo-600 to-violet-600",
      softBg: "bg-indigo-500/10",
      iconColor: "text-indigo-400",
      trend: "+12%",
      trendUp: true,
      desc: "Total comment replies",
    },
    {
      label: "DMs Sent",
      value: totalDms,
      icon: MessagesSquare,
      gradient: "from-amber-500 to-orange-500",
      softBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      trend: "+8%",
      trendUp: true,
      desc: "Delivered to inbox",
    },
    {
      label: "Engagement Rate",
      value: engagementRate,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-500",
      softBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      trend: "+1.2%",
      trendUp: true,
      desc: "Avg. engagement",
    },
    {
      label: "Active Rules",
      value: safeTopTriggers.filter((t) => t.metadata?.is_active !== false).length,
      icon: Cpu,
      gradient: "from-violet-500 to-purple-600",
      softBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
      trend: `${safeTopTriggers.length} total`,
      trendUp: null,
      desc: "Running automations",
    },
  ];

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const quickTemplates = [
    { id: "comment_dm", title: "Comment → DM", icon: MessageSquare, desc: "Auto DM on keyword comment", gradient: "from-blue-600 to-indigo-600", softBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    { id: "story_automator", title: "Story Reply", icon: Camera, desc: "Reply to story interactions", gradient: "from-orange-500 to-rose-500", softBg: "bg-orange-500/10", iconColor: "text-orange-400" },
    { id: "faq_assistant", title: "AI FAQ Bot", icon: Zap, desc: "Auto-answer common questions", gradient: "from-purple-600 to-violet-600", softBg: "bg-purple-500/10", iconColor: "text-purple-400", isAI: true },
    { id: "sales_closer", title: "AI Sales Agent", icon: Rocket, desc: "Close deals via DM 24/7", gradient: "from-emerald-500 to-teal-600", softBg: "bg-emerald-500/10", iconColor: "text-emerald-400", isAI: true },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500 w-full max-w-[1400px] mx-auto pb-6">

      {/* ── Header Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-black opacity-80 uppercase tracking-widest">{greeting} ☀️</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight leading-tight">
            {userName}&apos;s Dashboard
          </h2>
          <p className="text-sm text-black opacity-60 font-normal mt-1">
            Real-time view of your automation performance.
          </p>
        </div>
        <button
          onClick={onCreateAutoReply}
          className="shrink-0 group inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-semibold rounded-md transition-all duration-200  hover:"
        >
          <Plus size={15} className="group-hover:rotate-90 transition-transform duration-300" />
          New Automation
        </button>
      </div>

      {/* ── Quick Template Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickTemplates.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onCreateTemplate?.(t.id)}
              className="group relative flex flex-col items-start p-4 bg-white border border-zinc-200/60 rounded-md hover:border-zinc-300 hover: transition-all duration-200 cursor-pointer text-left overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none`} />

              <div className={`relative w-10 h-10 ${t.softBg} rounded-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={18} className={t.iconColor} />
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-bold text-black group-hover:text-indigo-600 transition-colors">{t.title}</span>
                {t.isAI && (
                  <span className="px-1.5 py-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[8px] font-bold rounded-md">AI</span>
                )}
              </div>
              <p className="text-[10px] text-black opacity-60 font-medium leading-snug">{t.desc}</p>

              <div className={`absolute top-3 right-3 w-6 h-6 rounded-lg bg-gradient-to-br ${t.gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-1 group-hover:translate-y-0`}>
                <ArrowRight size={12} className="text-white" />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.4, ease: "easeOut" }}
              className="group relative bg-white border border-zinc-200/60 rounded-md p-5 flex flex-col gap-3 hover:border-zinc-300 hover: hover:-100/60 transition-all duration-200 cursor-default overflow-hidden"
            >
              {/* Background gradient glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />

              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 ${card.softBg} rounded-md flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                  <Icon size={18} className={card.iconColor} />
                </div>
                {card.trendUp !== null ? (
                  <div className="flex items-center gap-0.5 px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <ArrowUpRight size={10} className="text-emerald-600" />
                    <span className="text-[10px] font-bold text-emerald-600">{card.trend}</span>
                  </div>
                ) : (
                  <span className="text-[10px] font-semibold text-black opacity-60 bg-zinc-50 border border-zinc-100 px-2 py-1 rounded-lg">{card.trend}</span>
                )}
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight leading-none">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                </div>
                <div className="text-[11px] font-medium text-black opacity-60 mt-1.5">{card.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Upgrade Banner ── */}
      {currentPlan !== "viral_scale" && !hideBanner && (
        <div className="relative overflow-hidden bg-zinc-950 rounded-md p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button 
            onClick={() => {
              setHideBanner(true);
              localStorage.setItem("hide_upgrade_banner", "true");
            }}
            className="absolute top-2 right-2 p-1.5 text-zinc-500 hover:text-white transition-colors z-20"
          >
            <X size={14} />
          </button>
          {/* Animated gradient blobs */}
          <div className="absolute -top-8 -left-8 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-11 h-11 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0  -500/25">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="pr-6">
              <p className="text-sm font-bold text-white tracking-tight">
                {currentPlan === "free"
                  ? "Unlock Business Pro — 15x more replies"
                  : "Scale to 50,000 monthly replies"}
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5 max-w-md font-medium leading-relaxed">
                {currentPlan === "free"
                  ? "Unlimited automations, Mini Store, Smart Bio & priority support."
                  : "Advanced CRM, custom persona, white-label & agency workspace."}
              </p>
            </div>
          </div>
          <button
            onClick={() => onUpgradeClick?.(currentPlan === "free" ? "creator_pro" : "viral_scale")}
            className="shrink-0 relative z-10 inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer shadow-lg shadow-white/10"
          >
            Upgrade Now <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* ── Main 2-Col Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Left: Active Automations */}
        <div className="lg:col-span-3 bg-white border border-zinc-200/60 rounded-md flex flex-col overflow-hidden min-h-[420px] ">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100/80">
            <div>
              <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Cpu size={13} className="text-indigo-500" />
                </div>
                Active Automations
              </h3>
              <p className="text-[11px] text-black opacity-60 font-normal mt-0.5 ml-8">
                Toggle, monitor and manage your running rules.
              </p>
            </div>
            <button
              onClick={onCreateAutoReply}
              className="group inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-950 text-white text-[11px] font-semibold rounded-md hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <Plus size={11} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
              New
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-zinc-50">
            {activeKeywords.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-4">
                <div className="w-14 h-14 bg-zinc-50 border-2 border-zinc-100 border-dashed rounded-md flex items-center justify-center">
                  <Zap size={22} className="text-zinc-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">No automations yet</p>
                  <p className="text-xs text-black opacity-60 mt-0.5">Create your first rule to get started.</p>
                </div>
                <button
                  onClick={onCreateAutoReply}
                  className="mt-1 inline-flex items-center gap-1.5 px-5 py-2.5 bg-zinc-950 text-white text-xs font-bold rounded-md hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  <Plus size={12} /> Create Rule
                </button>
              </div>
            ) : (
              activeKeywords.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50/70 transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${item.isActive ? "bg-indigo-50 border border-indigo-100" : "bg-zinc-100 border border-zinc-200"}`}>
                      <MessageSquare size={15} className={item.isActive ? "text-indigo-500" : "text-black opacity-60"} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-black font-mono tracking-wide">#{item.keyword}</span>
                        <span className={`px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-md tracking-wide ${item.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-zinc-100 text-black opacity-60 border border-zinc-200"}`}>
                          {item.isActive ? "Active" : "Paused"}
                        </span>
                      </div>
                      <p className="text-[10px] text-black opacity-60 font-medium mt-0.5 truncate">
                        {item.triggerType} · <span className="font-bold text-black opacity-90">{item.comments}</span> replies
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => onToggleTriggerActive && onToggleTriggerActive(item.id, item.isActive)}
                    className={`relative w-9 h-5 rounded-full transition-all duration-300 cursor-pointer shrink-0 focus:outline-none ${item.isActive ? "bg-indigo-500  -200" : "bg-zinc-200"}`}
                  >
                    <span className={`absolute top-[3px] w-3.5 h-3.5 bg-white rounded-full  transition-all duration-300 ${item.isActive ? "right-[3px]" : "left-[3px]"}`} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Live Activity Feed */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/60 rounded-md flex flex-col overflow-hidden min-h-[320px] ">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100/80">
            <div>
              <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Activity size={13} className="text-emerald-500 animate-pulse" />
                </div>
                Live Activity
              </h3>
              <p className="text-[11px] text-black opacity-60 font-medium mt-0.5 ml-8">Real-time interaction feed.</p>
            </div>
            <button
              onClick={onViewAudience}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-black opacity-60 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              View CRM <ChevronRight size={12} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-zinc-50">
            {safeHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-3">
                <div className="w-12 h-12 bg-zinc-50 border-2 border-zinc-100 border-dashed rounded-md flex items-center justify-center">
                  <Activity size={18} className="text-zinc-300" />
                </div>
                <p className="text-xs text-black opacity-60 font-semibold">No recent activity yet.</p>
              </div>
            ) : (
              safeHistory.slice(0, 15).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-50/70 transition-colors group cursor-default"
                >
                  <AudienceAvatar
                    senderId={log.sender_id}
                    defaultAvatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.sender_id || log.id}`}
                    automationId={automationId}
                    className="w-8 h-8 rounded-md object-cover border border-zinc-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-black truncate max-w-[90px]">
                        @{log.sender_username || log.sender_name || "unknown"}
                      </span>
                      {log.keyword && (
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 border border-indigo-100 rounded-md text-[8px] font-bold leading-none shrink-0">
                          #{log.keyword}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-black opacity-60 font-medium mt-0.5 truncate">
                      {log.type === "COMMENT" ? "Commented on post" : "Replied to story"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] font-semibold text-zinc-300 whitespace-nowrap">
                      {formatTime(log.created_at)}
                    </span>
                    <button
                      onClick={onViewAudience}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-black opacity-60 hover:text-indigo-500 hover:border-indigo-100 transition-all cursor-pointer"
                    >
                      <ArrowRight size={9} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Meta Sync Report Modal ── */}
      {mounted && syncReport && typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm" onClick={() => setSyncReport(null)} />
            <div className="relative w-full max-w-md bg-white border border-zinc-200/80 rounded-md p-6 flex flex-col gap-5 z-10 animate-in zoom-in-95 duration-200 ">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[9px] font-bold uppercase tracking-wider mb-1.5">
                    <Activity size={10} /> Meta Integration
                  </span>
                  <h3 className="text-lg font-bold text-black tracking-tight">Connection Report</h3>
                </div>
                <button
                  onClick={() => setSyncReport(null)}
                  className="p-2 bg-zinc-50 border border-zinc-200 rounded-md text-black opacity-60 hover:text-black transition-all cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {syncReport.success && syncReport.diagnostics ? (
                <div className="space-y-2">
                  {[
                    { label: "Insights Permission", val: syncReport.diagnostics.scope_insights },
                    { label: "Comments Permission", val: syncReport.diagnostics.scope_comments },
                    { label: "Media Feed", val: syncReport.diagnostics.media_found === "YES" ? "SUCCESS" : "MISSING" },
                    { label: "Simulation Reply", val: syncReport.diagnostics.comment_replied },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex items-center justify-between py-2.5 border-b border-zinc-50 last:border-0">
                      <span className="text-xs font-semibold text-black opacity-80">{label}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${val === "SUCCESS" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-md flex gap-3 text-rose-700 text-xs">
                  <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Sync Failed</span>
                    <p className="mt-1 font-medium text-rose-600/90">{syncReport.error}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setSyncReport(null)}
                  className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md font-bold text-xs transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
