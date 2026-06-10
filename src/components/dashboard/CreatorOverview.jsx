"use client";
import {
  Activity,
  ArrowRight,
  Cpu,
  MessageSquare,
  Plus,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  X,
  Zap,
  RefreshCw
} from "lucide-react";
import { useEffect, useState } from "react";
import * as logger from "@/lib/logger";
import { createPortal } from "react-dom";
import { useDashboard } from "@/context/DashboardContext";
import AudienceAvatar from "./AudienceAvatar";

export default function CreatorOverview({ stats = {}, history = [], topTriggers = [], automationId, hideHeader = false, onSimulateLocal, isActive = true, onViewAudience, onCreateAutoReply, onToggleTriggerActive, currentPlan = "free", onUpgradeClick }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncReport, setSyncReport] = useState(null);
  const [mounted, setMounted] = useState(false);

  const { user } = useDashboard();
  const userName = user?.user_metadata?.full_name || "Creator";

  // `mounted` is needed because `createPortal` cannot run on the server.
  // The synchronous setTimeout(0) was flagged as a cascading render;
  // the effect below only upgrades to `true` on real browser, never
  // back to `false`, so the value is stable for the rest of the lifecycle.
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
    }
  }, []);

  const handleSimulateTrigger = async (type) => {
    if (automationId === "dev-test-id") {
      if (onSimulateLocal) {
        onSimulateLocal(type);
      }
      return;
    }

    try {
      const res = await fetch("/api/media/test-simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          automationId,
          type,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        logger.error("Simulation endpoint failed:", data.error);
        alert("Simulation endpoint failed: " + data.error);
      } else {
        logger.log("Simulated live event successfully via API route");
      }
    } catch (err) {
      logger.error("Network error during simulation:", err);
    }
  };

  const handleMetaSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncReport(null);
    try {
      const res = await fetch(`/api/media/sync?automationId=${automationId}`);
      const data = await res.json();

      if (data.success && data.diagnostics) {
        setSyncReport({
          success: true,
          diagnostics: data.diagnostics
        });
      } else {
        setSyncReport({
          success: false,
          error: data.error || "Unknown error during sync check."
        });
      }
    } catch (err) {
      setSyncReport({
        success: false,
        error: "Network error occurred while syncing with Meta."
      });
      logger.error("CreatorOverview: Meta sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const {
    totalDms = 0,
    autoReplies = 0,
    engagementRate = "0%",
  } = stats || {};

  // Defensive defaults to prevent "Cannot read properties of null (reading 'length')" crash
  const safeHistory = Array.isArray(history) ? history : [];
  const safeTopTriggers = Array.isArray(topTriggers) ? topTriggers : [];

  const formatTime = (dateStr) => {
    if (!dateStr) return "Just now";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const activeKeywords = safeTopTriggers.length > 0
    ? safeTopTriggers.map((t) => {
      return {
        id: t.id,
        keyword: (t.keyword || "AUTO").toUpperCase(),
        triggerType: t.type === "COMMENT" ? "Post Comment" : t.type === "STORY_REPLY" ? "Story Reply" : t.type === "DM" ? "Direct Inbox" : "Reel Comment",
        isActive: t.metadata?.is_active !== false,
        comments: t.count
      };
    })
    : [];

  const metricCards = [
    { label: "Automated Comments", value: autoReplies, icon: MessageSquare, color: "text-[#6366F1]" },
    { label: "Messages Sent", value: totalDms, icon: Zap, color: "text-amber-500" },
    { label: "Conversion Rate", value: engagementRate, icon: TrendingUp, color: "text-emerald-500" },
    { label: "Active Rules", value: safeTopTriggers.length, icon: Cpu, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-700 w-full max-w-[1400px] mx-auto pb-8">

      {/* Welcome Back Header */}
      <div className="mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
          Welcome back, {userName}! 👋
        </h2>
        <p className="text-sm text-zinc-500 font-medium mt-0.5">
          Here is what&apos;s happening with your automations today.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-md shadow-zinc-200/10 border border-zinc-200/80 hover:shadow-lg transition-all duration-300 group cursor-default relative overflow-hidden hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3 relative z-10">
                <Icon size={20} className={`${card.color} transition-all duration-300 group-hover:scale-110`} />
              </div>

              <div className="space-y-1 relative z-10">
                <span className="text-xl sm:text-3xl font-bold text-zinc-950 tracking-tighter leading-none block group-hover:text-[#6366F1] transition-colors duration-300">
                  {card.value}
                </span>
                <span className="text-[11px] font-semibold text-zinc-400 tracking-wide block mt-1">
                  {card.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

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

      {/* Main Content Columns: Automations & Activity List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">

        {/* Left Column: Active Automations */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-xl p-5 sm:p-6 shadow-md shadow-zinc-200/5 flex flex-col relative overflow-hidden min-h-[280px] lg:min-h-[380px]">
          <div className="flex items-center justify-between mb-3 shrink-0 border-b border-zinc-100 pb-4">
            <div className="space-y-1">
              <h3 className="font-bold text-lg sm:text-xl text-zinc-950 tracking-tight flex items-center gap-2">
                Active Automations <Zap size={18} className="text-[#6366F1]" fill="#6366F1" fillOpacity={0.2} />
              </h3>
              <p className="text-xs text-zinc-400 font-semibold">Manage your currently running auto-reply rules.</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Simple Meta Sync Badge */}
              <button
                onClick={handleMetaSync}
                disabled={isSyncing}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-[10px] font-bold text-zinc-500 hover:bg-zinc-100 transition-all cursor-pointer"
                title="Verify Meta connection status"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw size={10} className="animate-spin text-zinc-400" />
                    Checking...
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                    Meta: Not Verified
                  </>
                )}
              </button>

              <button
                onClick={onCreateAutoReply}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#6366F1] hover:bg-[#4f46e5] px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Plus size={13} strokeWidth={3} /> Create Rule
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 relative z-10 overflow-y-auto no-scrollbar pr-1 divide-y divide-zinc-100">
            {!activeKeywords || activeKeywords.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-4 bg-zinc-50/50 rounded-2xl border border-zinc-200 border-dashed">
                <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center">
                  <Zap size={24} className="text-zinc-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-700">No active automations</p>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto mt-1">Create your first rule to start automating replies and DMs.</p>
                </div>
              </div>
            ) : (
              activeKeywords.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3.5 group transition-colors">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} className="text-[#6366F1] shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-zinc-900">#{item.keyword}</span>
                        {item.isActive ? (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-bold uppercase rounded-md">Active</span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-zinc-50 text-zinc-400 text-[8px] font-bold uppercase rounded-md border border-zinc-100">Paused</span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-400 font-semibold mt-0.5 block">
                        {item.triggerType} <span className="mx-1.5 text-zinc-200">•</span> <span className="text-zinc-700 font-bold">{item.comments}</span> replies sent
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => onToggleTriggerActive && onToggleTriggerActive(item.id, item.isActive)}
                      className={`w-8 h-[18px] rounded-full relative cursor-pointer hover:opacity-95 transition-all duration-300 ${item.isActive ? "bg-[#6366F1]" : "bg-zinc-200"}`}
                    >
                      <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[1px] shadow-sm transition-all duration-300 ${item.isActive ? "right-0.5" : "left-0.5"}`} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Live Feed */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 sm:p-6 shadow-md shadow-zinc-100/40 hover:shadow-lg transition-all duration-500 flex flex-col relative min-h-[280px] lg:min-h-[380px]">
          <div className="flex items-center justify-between mb-5 border-b border-zinc-100 pb-4 shrink-0">
            <div className="space-y-1">
              <h3 className="font-bold text-lg sm:text-xl text-zinc-950 tracking-tight flex items-center gap-2">
                Recent Activity <Activity size={16} className="text-emerald-500" />
              </h3>
              <p className="text-xs text-zinc-400 font-semibold">Live feed of interactions.</p>
            </div>
            <button
              onClick={onViewAudience}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-50 border border-zinc-100 text-zinc-400 hover:text-[#6366F1] hover:border-[#6366F1]/20 hover:bg-[#6366F1]/5 transition-all cursor-pointer"
              title="Go to CRM Audience"
            >
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pr-1 divide-y divide-zinc-100">
            {safeHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center">
                  <Activity size={18} className="text-zinc-300" />
                </div>
                <p className="text-xs text-zinc-400 font-semibold">No recent activity.</p>
              </div>
            ) : (
              safeHistory.map((log, index) => (
                <div key={log.id} className="flex items-center justify-between py-3 group cursor-default">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AudienceAvatar
                      senderId={log.sender_id}
                      defaultAvatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.sender_id || log.id}`}
                      automationId={automationId}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-200 shrink-0"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-zinc-900 truncate max-w-[85px] block leading-none">
                          @{log.sender_username || log.sender_name || "unknown"}
                        </span>
                        {log.keyword && (
                          <span className="px-1.5 py-0.5 bg-zinc-50 border border-zinc-200/60 text-zinc-500 rounded text-[8px] font-bold leading-none shrink-0">
                            #{log.keyword}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-semibold block truncate max-w-[140px]">
                        {log.type === "COMMENT" ? "commented on post" : "replied to story"}
                        {log.response && (
                          <span className="text-zinc-500 font-medium block truncate mt-0.5 italic">
                            &ldquo;{log.response}&rdquo;
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[9px] font-bold text-zinc-300">{formatTime(log.created_at)}</span>
                    <button
                      onClick={onViewAudience}
                      className="opacity-0 group-hover:opacity-100 p-1 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-md transition-all cursor-pointer ml-1"
                      title="View in CRM"
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

      {/* Meta Sync Report Dialog Modal */}
      {mounted && syncReport && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
          <div
            className="fixed inset-0 bg-[#f3f3f3]/60 backdrop-blur-md transition-all duration-500"
            onClick={() => setSyncReport(null)}
          />

          <div className="relative w-full max-w-md bg-white border border-zinc-200/80 rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 animate-in zoom-in duration-300 z-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200/50 pb-4 shrink-0">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-full text-[9px] font-bold uppercase tracking-wider mb-1">
                  <Activity size={10} /> Meta Integration
                </div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Meta Connection Report</h3>
              </div>
              <button
                onClick={() => setSyncReport(null)}
                className="p-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-400 hover:text-zinc-950 transition-all hover:bg-zinc-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            {syncReport.success && syncReport.diagnostics ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-[#6366F1] flex items-center justify-center shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Status Overview</span>
                    <span className={`text-xs font-bold ${syncReport.diagnostics.scope_insights === "SUCCESS" && syncReport.diagnostics.scope_comments === "SUCCESS"
                      ? "text-emerald-600"
                      : "text-amber-600"
                      }`}>
                      {syncReport.diagnostics.scope_insights === "SUCCESS" && syncReport.diagnostics.scope_comments === "SUCCESS"
                        ? "✅ READY FOR ACTION"
                        : "⚠️ ATTENTION NEEDED"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-xs font-semibold text-zinc-500">Insights Reading Permission</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${syncReport.diagnostics.scope_insights === "SUCCESS" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}>
                      {syncReport.diagnostics.scope_insights}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-xs font-semibold text-zinc-500">Comments Auto-Reply Permission</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${syncReport.diagnostics.scope_comments === "SUCCESS" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}>
                      {syncReport.diagnostics.scope_comments}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-xs font-semibold text-zinc-500">Active Media Feed Detected</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${syncReport.diagnostics.media_found === "YES" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}>
                      {syncReport.diagnostics.media_found}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs font-semibold text-zinc-500">Diagnostics Simulation Reply</span>
                    <span className="text-xs font-bold text-zinc-400">
                      {syncReport.diagnostics.comment_replied}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 text-rose-700 text-xs">
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Sync Diagnostic Failed</span>
                  <p className="mt-1 leading-normal font-medium text-rose-600/90">{syncReport.error}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-zinc-200/50 pt-4 flex justify-end shrink-0">
              <button
                onClick={() => setSyncReport(null)}
                className="px-5 py-2.5 bg-[#6366F1] hover:bg-[#4f46e5] text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-[#6366F1]/10 hover:shadow-lg hover:shadow-[#6366F1]/20 cursor-pointer"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
