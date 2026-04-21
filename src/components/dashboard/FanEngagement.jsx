"use client";

import { Users, Heart, MessageSquare, TrendingUp, Award, UserCircle, CheckCircle2, ShieldAlert, Clock } from "lucide-react";

export default function FanEngagement({ stats, history }) {
  // Aggregate unique fans with their latest status and counts
  const fanMap = (history || []).reduce((acc, log) => {
    if (!log.sender_name) return acc;
    
    if (!acc[log.sender_name]) {
      acc[log.sender_name] = {
        name: log.sender_name,
        count: 0,
        lastActive: log.created_at,
        status: log.metadata?.funnel_complete ? "SUCCESS" : (log.status === "gated" ? "GATED" : "INTERACTED"),
        keyword: log.keyword
      };
    }
    
    acc[log.sender_name].count += 1;
    // Update to latest activity if new
    if (new Date(log.created_at) > new Date(acc[log.sender_name].lastActive)) {
      acc[log.sender_name].lastActive = log.created_at;
      acc[log.sender_name].status = log.metadata?.funnel_complete ? "SUCCESS" : (log.status === "gated" ? "GATED" : "INTERACTED");
    }
    
    return acc;
  }, {});

  const fans = Object.values(fanMap).sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
  const topFans = Object.values(fanMap).sort((a, b) => b.count - a.count).slice(0, 5);

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Fan Engagement</h1>
          <p className="text-zinc-muted text-sm font-medium mt-1">Real-time tracker of your active leads.</p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-foreground/5 rounded-full border border-border">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">Live Sync</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-border rounded-[24px] p-6 shadow-sm">
           <div className="text-[10px] font-bold text-zinc-muted uppercase mb-1">Total Reach</div>
           <div className="text-2xl font-black text-foreground">{stats.uniqueUsers || 0}</div>
        </div>
        <div className="bg-white border border-border rounded-[24px] p-6 shadow-sm">
           <div className="text-[10px] font-bold text-zinc-muted uppercase mb-1">Engagement Rate</div>
           <div className="text-2xl font-black text-foreground">{stats.engagementRate || "0%"}</div>
        </div>
        <div className="bg-white border border-border rounded-[24px] p-6 shadow-sm">
           <div className="text-[10px] font-bold text-zinc-muted uppercase mb-1">Link Success</div>
           <div className="text-2xl font-black text-sage">{stats.followerGrowth || 0}</div>
        </div>
        <div className="bg-white border border-border rounded-[24px] p-6 shadow-sm">
           <div className="text-[10px] font-bold text-zinc-muted uppercase mb-1">Automations Sent</div>
           <div className="text-2xl font-black text-foreground">{stats.autoReplies || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Leads Table */}
        <div className="lg:col-span-2 bg-white border border-border rounded-[32px] p-8 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-foreground text-background rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
            <h3 className="font-bold text-lg text-foreground">Recent Interactions</h3>
          </div>

          <div className="overflow-x-auto -mx-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-8 pb-4 text-[11px] font-bold text-zinc-muted uppercase">Fan</th>
                  <th className="px-4 pb-4 text-[11px] font-bold text-zinc-muted uppercase">Keyword</th>
                  <th className="px-4 pb-4 text-[11px] font-bold text-zinc-muted uppercase">Status</th>
                  <th className="px-8 pb-4 text-[11px] font-bold text-zinc-muted uppercase text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {fans.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-12 text-center text-zinc-muted italic">No interactions yet. Trigger an automation to see data.</td>
                  </tr>
                ) : (
                  fans.map((fan) => (
                    <tr key={fan.name} className="group hover:bg-zinc-50 transition-colors">
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-foreground/5 rounded-full flex items-center justify-center text-[10px] font-bold text-zinc-muted group-hover:bg-foreground group-hover:text-background transition-all">
                               {fan.name.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-foreground">@{fan.name}</span>
                         </div>
                      </td>
                      <td className="px-4 py-5">
                         <span className="text-xs font-semibold text-zinc-muted">{fan.keyword || "General"}</span>
                      </td>
                      <td className="px-4 py-5">
                         {fan.status === "SUCCESS" ? (
                           <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100">
                             <CheckCircle2 size={10} /> Delivered
                           </div>
                         ) : fan.status === "GATED" ? (
                           <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold border border-amber-100">
                             <ShieldAlert size={10} /> Gate Hit
                           </div>
                         ) : (
                           <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-full text-[10px] font-bold border border-zinc-200">
                             <Clock size={10} /> Chatting
                           </div>
                         )}
                      </td>
                      <td className="px-8 py-5 text-right">
                         <span className="text-[10px] font-bold text-zinc-muted opacity-40">{formatTime(fan.lastActive)}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Top Fans Leaderboard */}
        <div className="bg-white border border-border rounded-[32px] p-8 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
              <Award size={20} />
            </div>
            <h3 className="font-bold text-lg text-foreground">Active Members</h3>
          </div>

          <div className="space-y-4 flex-1">
            {topFans.map((fan, index) => (
              <div key={fan.name} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-border/40">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-white text-[10px] font-black text-zinc-muted">
                     {index + 1}
                  </div>
                  <span className="text-sm font-bold text-foreground">@{fan.name}</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-sm font-black text-foreground">{fan.count}</span>
                   <span className="text-[8px] font-bold text-zinc-muted uppercase tracking-tighter">Interactions</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-border">
             <div className="bg-foreground text-background rounded-2xl p-6 text-center shadow-lg">
                <TrendingUp size={20} className="mx-auto mb-3" />
                <h4 className="font-bold text-sm mb-1">Fan Loyalty is 12% higher</h4>
                <p className="text-[10px] opacity-60 font-medium leading-relaxed">Since you enabled Follow-Gate, users are interacting more with Link cards.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
