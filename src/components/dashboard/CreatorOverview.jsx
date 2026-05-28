"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  MessageSquare, 
  Zap, 
  TrendingUp, 
  Cpu, 
  Plus, 
  Activity, 
  ArrowRight,
  Sparkles,
  Link2,
  X,
  ShieldAlert
} from "lucide-react";

export default function CreatorOverview({ stats = {}, history = [], topTriggers = [], automationId, hideHeader = false, onSimulateLocal, isActive = true, onViewAudience, onCreateAutoReply }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncReport, setSyncReport] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
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
        console.error("Simulation endpoint failed:", data.error);
        alert("Simulation endpoint failed: " + data.error);
      } else {
        console.log("Simulated live event successfully via API route:", data);
      }
    } catch (err) {
      console.error("Network error during simulation:", err);
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
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  const {
    totalDms = 0,
    autoReplies = 0,
    engagementRate = "0%",
  } = stats;

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

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

  const activeKeywords = topTriggers && topTriggers.length > 0
    ? topTriggers.map((t, idx) => {
        const triggerTypes = ["Post Comment", "Reel Comment", "Direct Inbox", "Story Reply"];
        return {
          keyword: (t.keyword || "AUTO").toUpperCase(),
          triggerType: triggerTypes[idx % triggerTypes.length],
          status: "Active",
          comments: t.count
        };
      })
    : [];

  const metricCards = [
    { label: "Automated Comments", value: autoReplies, icon: MessageSquare, color: "text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20", trend: "Total", bgClass: "bg-[#6366F1]/5 border-[#6366F1]/20 hover:border-[#6366F1]/40 hover:shadow-[#6366F1]/5" },
    { label: "Messages Sent", value: totalDms, icon: Zap, color: "text-amber-600 bg-amber-50 border-amber-200", trend: "Total", bgClass: "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40 hover:shadow-amber-500/5" },
    { label: "Conversion Rate", value: engagementRate, icon: TrendingUp, color: "text-emerald-600 bg-emerald-50 border-emerald-200", trend: "Live", bgClass: "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/5" },
    { label: "Active Rules", value: topTriggers.length, icon: Cpu, color: "text-purple-600 bg-purple-50 border-purple-200", trend: "Active", bgClass: "bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/5" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-[1400px] mx-auto pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.label}
              className={`backdrop-blur-3xl border rounded-2xl p-6 flex flex-col justify-between shadow-lg shadow-zinc-200/20 hover:shadow-xl transition-all duration-300 group cursor-default relative overflow-hidden bg-white hover:-translate-y-0.5`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#6366F1]/5 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm transition-all duration-500 group-hover:scale-110 ${card.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              
              <div className="space-y-1 relative z-10">
                <span className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tighter leading-none block group-hover:text-[#6366F1] transition-colors duration-300">
                  {card.value}
                </span>
                <span className="text-[12px] font-semibold text-zinc-500 tracking-wide block mt-1">
                  {card.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Column: Active Automations */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-[24px] p-6 sm:p-8 shadow-xl shadow-zinc-200/20 hover:shadow-2xl hover:shadow-[#6366F1]/5 transition-all duration-500 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative z-10 shrink-0 border-b border-zinc-100 pb-6">
            <div className="space-y-1.5">
              <h3 className="font-bold text-2xl sm:text-3xl text-zinc-950 tracking-tight flex items-center gap-2">
                Active Automations <Zap size={24} className="text-[#6366F1]" fill="#6366F1" fillOpacity={0.2} />
              </h3>
              <p className="text-[13px] text-zinc-500 font-medium">Manage your currently running auto-reply rules.</p>
            </div>
            
            <button 
              onClick={onCreateAutoReply}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-white bg-zinc-950 hover:bg-zinc-800 px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={16} strokeWidth={3} /> Create Rule
            </button>
          </div>

          <div className="space-y-3 flex-1 relative z-10 max-h-[360px] overflow-y-auto no-scrollbar pr-1">
            {!activeKeywords || activeKeywords.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-4 bg-zinc-50/50 rounded-2xl border border-zinc-200 border-dashed">
                <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center">
                  <Zap size={24} className="text-zinc-300" />
                </div>
                <div>
                  <p className="text-base font-bold text-zinc-700">No active automations</p>
                  <p className="text-sm text-zinc-500 max-w-xs mx-auto mt-1">Create your first rule to start automating replies and DMs.</p>
                </div>
              </div>
            ) : (
              activeKeywords.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-zinc-50/80 hover:bg-white border border-zinc-100 hover:border-zinc-200 rounded-2xl transition-all duration-200 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 border border-indigo-100/50 text-[#6366F1] rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="font-bold text-[15px] text-zinc-900">{item.keyword}</span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase rounded-md border border-emerald-100">Active</span>
                      </div>
                      <span className="text-[13px] text-zinc-500 font-medium">{item.triggerType} <span className="mx-1.5 text-zinc-300">•</span> <span className="text-zinc-900 font-semibold">{item.comments}</span> replies sent</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-[#6366F1] rounded-full relative cursor-pointer shadow-inner hover:opacity-90 transition-opacity">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Live Feed */}
        <div className="bg-white border border-zinc-200/80 rounded-[24px] p-6 sm:p-8 shadow-xl shadow-zinc-100/40 hover:shadow-2xl transition-all duration-500 flex flex-col relative h-[480px]">
          <div className="flex items-center justify-between mb-6 border-b border-zinc-100 pb-6 shrink-0">
            <div className="space-y-1.5">
              <h3 className="font-bold text-xl sm:text-2xl text-zinc-950 tracking-tight flex items-center gap-2">
                Recent Activity <Activity size={20} className="text-emerald-500" />
              </h3>
              <p className="text-[13px] text-zinc-500 font-medium">Live feed of interactions.</p>
            </div>
            <button 
              onClick={onViewAudience}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-400 hover:text-[#6366F1] hover:border-[#6366F1]/20 hover:bg-[#6366F1]/5 transition-all"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="space-y-5 flex-1 overflow-y-auto no-scrollbar pb-2 pr-1 relative z-10">
            {!history || history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center">
                  <Activity size={20} className="text-zinc-300" />
                </div>
                <p className="text-sm text-zinc-500 font-medium">No recent activity.</p>
              </div>
            ) : (
              history.map((log) => (
                <div key={log.id} className="flex items-start justify-between group cursor-default">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-[11px] font-bold text-zinc-600 shrink-0 border border-zinc-200/50 group-hover:border-zinc-300 transition-colors">
                      {log.sender_name?.slice(0, 2).toUpperCase() || "??"}
                    </div>
                    <div className="space-y-1 mt-0.5">
                      <span className="text-[13px] font-bold text-zinc-900 block leading-none">@{log.sender_name || "unknown"}</span>
                      <span className="text-[11px] text-zinc-500 font-medium block">
                        {log.type === "COMMENT" ? "commented on post" : "replied to story"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-400 shrink-0 mt-1.5">{formatTime(log.created_at)}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <div className="bg-white/40 backdrop-blur-xl border border-zinc-200/80 rounded-xl p-6 lg:p-8 shadow-xl shadow-zinc-100/40 hover:shadow-2xl hover:shadow-zinc-200/40 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden transition-all duration-500">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#6366F1]/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-xl bg-[#6366F1] flex items-center justify-center text-white shadow-md shrink-0 shadow-[#6366F1]/20">
            <Sparkles size={28} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-snug">Boost sales with auto-reply keywords</h3>
            <p className="text-xs sm:text-sm text-zinc-500 font-normal max-w-2xl mt-2 leading-relaxed lowercase">
              set up keywords to automatically send links, guides, or discount codes when people comment on your posts or reply to your stories.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10 shrink-0 self-start md:self-auto">
          <button
            onClick={handleMetaSync}
            disabled={isSyncing}
            className="px-6 py-4 bg-white border border-zinc-200 hover:border-[#6366F1] shadow-sm text-zinc-700 hover:text-[#6366F1] font-semibold text-[10px] rounded-xl transition-all flex items-center gap-2 shrink-0"
          >
            <Link2 size={16} /> {isSyncing ? "Syncing Meta..." : "Test Connection"}
          </button>
          
          <button
            onClick={onCreateAutoReply}
            className="px-8 py-4 bg-zinc-950 text-white font-semibold text-[10px] rounded-xl hover:bg-zinc-900 shadow-lg shadow-zinc-200/50 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus size={16} strokeWidth={3} /> Create Auto-Reply
          </button>
        </div>
      </div>

      {/* Meta Sync Report Dialog Modal */}
      {mounted && syncReport && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
          <div 
            className="fixed inset-0 bg-[#f3f3f3]/60 backdrop-blur-md transition-all duration-500"
            onClick={() => setSyncReport(null)}
          />

          <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-[32px] shadow-2xl p-6 sm:p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-300 z-10">
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
                className="p-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-400 hover:text-zinc-950 transition-all hover:bg-zinc-100"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            {syncReport.success && syncReport.diagnostics ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-105">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-[#6366F1] flex items-center justify-center shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Status Overview</span>
                    <span className={`text-xs font-bold ${
                      syncReport.diagnostics.scope_insights === "SUCCESS" && syncReport.diagnostics.scope_comments === "SUCCESS"
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
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      syncReport.diagnostics.scope_insights === "SUCCESS" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}>
                      {syncReport.diagnostics.scope_insights}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-xs font-semibold text-zinc-500">Comments Auto-Reply Permission</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      syncReport.diagnostics.scope_comments === "SUCCESS" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}>
                      {syncReport.diagnostics.scope_comments}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-xs font-semibold text-zinc-500">Active Media Feed Detected</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      syncReport.diagnostics.media_found === "YES" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
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
                className="px-5 py-2.5 bg-zinc-950 text-white rounded-xl font-bold text-xs hover:bg-zinc-900 transition-all shadow-md"
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
