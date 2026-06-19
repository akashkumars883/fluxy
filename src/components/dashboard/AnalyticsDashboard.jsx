"use client";

import { BarChart2, MessageSquare, Send, Sparkles, TrendingUp, Users, ArrowRight, ArrowUpRight, Zap, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsDashboard({ realtimeStats, history = [], triggers = [], currentPlan = "free", onUpgradeClick }) {
  const campaigns = (triggers || []).map(trigger => {
    // Note: 'history' is currently limited to 200 items in page.jsx. 
    // To get true counts, we now rely on 'trigger.count' which is calculated in page.jsx across all contacts.
    const triggerHistory = (history || []).filter(h => h.keyword === trigger.keyword || h.trigger_id === trigger.id);
    const sentCount = trigger.count || triggerHistory.length;
    const triggerContacts = new Set(triggerHistory.map(h => h.sender_id)).size;
    return {
      name: trigger.metadata?.campaign_name || trigger.name || "Custom Flow ⚡",
      keyword: trigger.keyword,
      sent: sentCount,
      sentFmt: sentCount.toLocaleString(),
      contacts: triggerContacts.toLocaleString(),
      rate: sentCount > 0 ? `${Math.min(100, Math.round((triggerContacts / sentCount) * 100))}%` : "0%",
    };
  });

  const totalInteractions = (realtimeStats?.totalDms || 0) + (realtimeStats?.autoReplies || 0);
  const totalDms = realtimeStats?.totalDms || 0;
  const uniqueContacts = realtimeStats?.uniqueContacts || 0;
  const trend = realtimeStats?.trend || "0%";

  const metricCards = [
    {
      label: "Total Interactions",
      value: totalInteractions.toLocaleString(),
      desc: "Auto-replies + DMs",
      icon: MessageSquare,
      gradient: "from-indigo-600 to-violet-600",
      softBg: "bg-indigo-500/10",
      iconColor: "text-indigo-500",
      trend: trend,
      trendColor: realtimeStats?.trendIsPositive !== false ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      label: "Automation Success",
      value: realtimeStats?.successRate || "0%",
      desc: "Success rate",
      icon: Send,
      gradient: "from-violet-500 to-purple-600",
      softBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
      trend: trend,
      trendColor: realtimeStats?.trendIsPositive !== false ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      label: "Contacts Captured",
      value: uniqueContacts.toLocaleString(),
      desc: "Unique users reached",
      icon: Users,
      gradient: "from-emerald-500 to-teal-500",
      softBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      trend: null, // Just show description
    },
    {
      label: "Conversion Rate",
      value: realtimeStats?.conversionRate || "0%",
      desc: "Contacts per Reply",
      icon: Zap,
      gradient: "from-amber-500 to-orange-500",
      softBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      trend: null,
    },
  ];

  const maxSent = campaigns.reduce((m, c) => Math.max(m, c.sent), 1);

  return (
    <div className="space-y-4 animate-in fade-in duration-500 w-full max-w-[1400px] mx-auto pb-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Overview</p>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">Analytics</h2>
          <p className="text-sm text-zinc-400 font-medium mt-0.5">Performance across all your automation campaigns.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Live Data
          </span>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07, duration: 0.4, ease: "easeOut" }}
              className="group relative bg-white border border-zinc-200/40 rounded-[16px] p-4 flex flex-col gap-2.5 hover:border-zinc-300 hover:shadow-sm transition-all duration-200 cursor-default overflow-hidden shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]"
            >
              {/* Hover gradient glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />

              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 ${card.softBg} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                  <Icon size={16} className={card.iconColor} />
                </div>
                {card.trend ? (
                  <div className={`flex items-center gap-0.5 px-2 py-1 border rounded-lg ${card.trendColor || "bg-emerald-50 border-emerald-100 text-emerald-600"}`}>
                    <ArrowUpRight size={10} className="currentColor" />
                    <span className="text-[10px] font-bold currentColor">{card.trend}</span>
                  </div>
                ) : (
                  <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-50 border border-zinc-100 px-2 py-1 rounded-lg">{card.desc}</span>
                )}
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-900 tracking-tight leading-none">{card.value}</div>
                <div className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-wider">{card.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Upgrade Banner ── */}
      {currentPlan !== "viral_scale" && (
        <div className="relative overflow-hidden bg-zinc-950 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="absolute -top-8 -left-8 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/25">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {currentPlan === "free" ? "Unlock advanced analytics with Business Pro" : "Scale to full analytics suite"}
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5 max-w-md font-medium leading-relaxed">
                {currentPlan === "free"
                  ? "Detailed funnel reports, contact heatmaps and export to CSV."
                  : "Agency-level reports, multi-account comparison & white-label exports."}
              </p>
            </div>
          </div>
          <button
            onClick={() => onUpgradeClick?.(currentPlan === "free" ? "creator_pro" : "viral_scale")}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-50 text-zinc-950 text-xs font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer relative z-10"
          >
            Upgrade Now <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* ── Campaign Breakdown ── */}
      <div className="bg-white border border-zinc-200/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-100/80">
          <div>
            <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center">
                <TrendingUp size={13} className="text-indigo-500" />
              </div>
              Campaign Breakdown
            </h3>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5 ml-8">Performance per automation rule.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl">
            <Activity size={10} /> {campaigns.length} rules
          </span>
        </div>

        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="w-14 h-14 bg-zinc-50 border-2 border-zinc-100 border-dashed rounded-2xl flex items-center justify-center">
              <BarChart2 size={22} className="text-zinc-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-600">No campaign data yet</p>
              <p className="text-xs text-zinc-400 mt-0.5">Create automations to start tracking performance.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <table className="hidden md:table w-full text-left">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-100">
                  {["Campaign", "Keyword", "Messages Sent", "Contacts", "Conv. Rate"].map(h => (
                    <th key={h} className="px-6 py-3.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {campaigns.map((c, i) => (
                  <tr key={i} className="hover:bg-zinc-50/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                          <MessageSquare size={12} className="text-indigo-500" />
                        </div>
                        <span className="text-xs font-semibold text-zinc-900 truncate max-w-[160px]">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold rounded-lg font-mono">
                        #{c.keyword}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                            style={{ width: `${Math.round((c.sent / maxSent) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-zinc-800">{c.sentFmt}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-emerald-600">{c.contacts}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg">{c.rate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-zinc-50">
              {campaigns.map((c, i) => (
                <div key={i} className="px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                        <MessageSquare size={12} className="text-indigo-500" />
                      </div>
                      <span className="text-xs font-bold text-zinc-900 truncate max-w-[160px]">{c.name}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold rounded-lg font-mono">#{c.keyword}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Sent", val: c.sentFmt, green: false },
                      { label: "Contacts", val: c.contacts, green: true },
                      { label: "Rate", val: c.rate, green: true },
                    ].map(({ label, val, green }) => (
                      <div key={label} className="bg-zinc-50 rounded-xl p-2.5">
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1">{label}</p>
                        <p className={`text-sm font-black ${green ? "text-emerald-600" : "text-zinc-900"}`}>{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
