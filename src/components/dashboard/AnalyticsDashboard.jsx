"use client";

import { MessageSquare,Send,Users } from "lucide-react";

export default function AnalyticsDashboard({ realtimeStats, history = [], triggers = [] }) {
  // Calculate real unique contacts from history
  const uniqueContacts = new Set((history || []).filter(h => h.sender_id).map(h => h.sender_id)).size;

  // Calculate campaign-like breakdown from actual triggers
  const campaigns = (triggers || []).map(trigger => {
    const triggerHistory = (history || []).filter(h => h.keyword === trigger.keyword || h.trigger_id === trigger.id);
    const sentCount = triggerHistory.length;
    const triggerContacts = new Set(triggerHistory.map(h => h.sender_id)).size;
    
    return {
      name: trigger.metadata?.campaign_name || trigger.name || "Custom Flow ⚡",
      keyword: trigger.keyword,
      sent: sentCount.toLocaleString(),
      contacts: triggerContacts.toLocaleString(),
      rate: sentCount > 0 ? `${Math.min(100, Math.round((triggerContacts / sentCount) * 100))}%` : "0%"
    };
  });

  const currentData = {
    triggers: (realtimeStats?.totalDms + realtimeStats?.autoReplies)?.toLocaleString() || "0",
    dms: (realtimeStats?.totalDms)?.toLocaleString() || "0",
    contacts: uniqueContacts.toLocaleString(),
    descTriggers: "Total interactions",
    descDms: "100% delivery rate",
    descContacts: "Unique users reached",
    campaigns: campaigns.length > 0 ? campaigns : [
      { name: "No active campaigns found", keyword: "-", sent: "0", contacts: "0", rate: "0%" }
    ]
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full max-w-[1400px] mx-auto">
      
      {/* 3 Simple Clean Metrics (ManyChat style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Triggers Found", value: currentData.triggers, desc: currentData.descTriggers, icon: MessageSquare, color: "text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20", bgClass: "bg-[#6366F1]/5 border-[#6366F1]/20 hover:border-[#6366F1]/40 hover:shadow-[#6366F1]/5" },
          { title: "DMs Delivered", value: currentData.dms, desc: currentData.descDms, icon: Send, color: "text-purple-600 bg-purple-50 border-purple-200", bgClass: "bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/5" },
          { title: "Contacts Captured", value: currentData.contacts, desc: currentData.descContacts, icon: Users, color: "text-emerald-600 bg-emerald-50 border-emerald-200", bgClass: "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/5" }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className={`backdrop-blur-3xl border rounded-xl p-6 flex flex-col justify-between shadow-xl shadow-zinc-200/10 hover:shadow-2xl transition-all duration-500 group cursor-default relative overflow-hidden hover:-translate-y-1 ${card.bgClass}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#6366F1]/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg backdrop-blur-md transition-all duration-500 group-hover:scale-110 ${card.color}`}>
                  <Icon size={18} />
                </div>
                <span className="text-[9px] font-semibold px-3 py-1 rounded-full shadow-sm bg-zinc-950 text-white border border-zinc-900">{card.desc}</span>
              </div>
              
              <div className="space-y-0.5 relative z-10">
                <span className="text-3xl sm:text-4xl font-semibold text-zinc-950 tracking-tighter block group-hover:text-[#6366F1] transition-colors duration-300">
                  {card.value}
                </span>
                <span className="text-[12px] font-semibold text-zinc-400 block mt-2">
                  {card.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simple Active Campaigns Breakdown */}
      <div className="bg-white/40 backdrop-blur-xl border border-zinc-200/80 rounded-xl p-6 sm:p-8 shadow-xl shadow-zinc-100/40 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200/50 pb-4">
          <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">Campaign Breakdown</h3>
          <span className="text-xs font-semibold text-[#6366F1] bg-[#6366F1]/10 px-3 py-1 rounded-full shadow-sm">Live</span>
        </div>

        <div className="overflow-hidden">
          {/* Desktop Table View */}
          <table className="hidden md:table w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-200/50 text-xs font-semibold text-zinc-400">
                <th className="pb-4 pl-4">Automation Rule</th>
                <th className="pb-4">Keyword</th>
                <th className="pb-4 text-right">Messages Sent</th>
                <th className="pb-4 text-right pr-4">Contacts Captured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/30">
              {currentData.campaigns.map((c, i) => (
                <tr key={i} className="hover:bg-white/60 transition-all group">
                  <td className="py-4 pl-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-zinc-900">{c.name}</h4>
                  </td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-[#6366F1]/10 text-[#6366F1] font-semibold text-xs rounded-xl">
                      &apos;{c.keyword}&apos;
                    </span>
                  </td>
                  <td className="py-4 text-right font-semibold text-zinc-800 text-xs sm:text-sm">
                    {c.sent}
                  </td>
                  <td className="py-4 text-right pr-4 font-semibold text-emerald-600 text-xs sm:text-sm">
                    {c.contacts} ({c.rate})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card List View */}
          <div className="md:hidden flex flex-col gap-4">
            {currentData.campaigns.map((c, i) => (
              <div 
                key={i} 
                className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4 hover:border-[#6366F1]/40 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-sm font-bold text-zinc-950 truncate">{c.name}</h4>
                  <span className="px-2.5 py-0.5 bg-[#6366F1]/10 text-[#6366F1] rounded-lg text-[9px] font-bold shrink-0">
                    &apos;{c.keyword}&apos;
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-3 text-[11px]">
                  <div>
                    <span className="text-zinc-400 block font-semibold uppercase tracking-wider text-[8px] mb-1">Messages Sent</span>
                    <span className="text-sm font-bold text-zinc-800">{c.sent}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block font-semibold uppercase tracking-wider text-[8px] mb-1">Contacts Captured</span>
                    <span className="text-sm font-bold text-emerald-600">{c.contacts} <span className="text-[10px] font-medium text-emerald-500">({c.rate})</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
