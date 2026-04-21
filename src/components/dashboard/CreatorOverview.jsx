"use client";

import { MessageSquare, Zap, TrendingUp, Camera, Heart, Plus, Activity, BarChart3 } from "lucide-react";

export default function CreatorOverview({ stats = {}, history = [], topTriggers = [] }) {
  const {
    totalDms = 0,
    autoReplies = 0,
    engagementRate = "0%",
    followerGrowth = 0,
    storyReplies = 0
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

  const metricCards = [
    { label: "Messages received", value: totalDms, icon: MessageSquare, color: "text-foreground" },
    { label: "Replies sent", value: autoReplies, icon: Zap, color: "text-sage" },
    { label: "Interaction rate", value: engagementRate, icon: Heart, color: "text-pink-500" },
    { label: "Story replies", value: storyReplies, icon: Camera, color: "text-purple-500" },
    { label: "New followers", value: `+${followerGrowth}`, icon: TrendingUp, color: "text-emerald-500" },
  ];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">Overview</h1>
          <p className="text-zinc-muted text-sm font-light">Welcome, here are your latest stats</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 px-5 py-4 bg-foreground text-background rounded-xl font-medium text-sm shadow-xl shadow-foreground/5 hover:scale-105 active:scale-95 transition-all">
          <Plus size={16} />
          <span>New Reply</span>
        </button>
      </div>

      {/* Unified Multi-Metric Card */}
      <div className="bg-white border border-border rounded-[22px] overflow-hidden shadow-sm">
        
        {/* Card Header */}
        <div className="p-6 pb-3 border-b border-border/40 bg-zinc-50/30">
           <h2 className="text-xl font-semibold text-foreground">Growth & Stats</h2>
           <p className="text-[11px] text-zinc-muted font-light">{currentDate}</p>
        </div>

        {/* Divided Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {metricCards.map((card, index) => (
            <div 
              key={card.label} 
              className="p-8 group transition-all hover:bg-zinc-50/50"
            >
              <div className="flex items-start justify-between mb-4">
                 <div className={`p-2 rounded-lg bg-foreground/5 ${card.color} group-hover:scale-110 transition-transform`}>
                    <card.icon size={18} />
                 </div>
                 {card.trend && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {card.trend}
                    </span>
                 )}
              </div>
              
              <div className="space-y-0.5">
                 <span className="text-3xl font-bold text-foreground tracking-tight block">
                   {card.value}
                 </span>
                 <p className="text-[11px] font-medium text-zinc-muted block leading-tight">
                   {card.label}
                 </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Layout for Pulse and Triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Left: Live Pulse */}
        <div className="bg-white border border-border rounded-[22px] p-8 shadow-sm flex flex-col h-[320px]">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-foreground/5 rounded-lg text-foreground">
                <Activity size={18} />
              </div>
              <h3 className="font-semibold text-lg text-foreground">Recent Activity</h3>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-bold">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Real-time
            </div>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pb-2">
            {!history || history.length === 0 ? (
              <p className="text-sm text-zinc-muted italic text-center py-10">No recent activity logged.</p>
            ) : (
              history.map((log) => (
                <div key={log.id} className="flex items-center justify-between group cursor-default border-b border-border/30 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-foreground/5 rounded-full flex items-center justify-center text-[10px] font-bold text-zinc-muted group-hover:bg-foreground group-hover:text-background transition-colors shrink-0">
                      {log.sender_name?.slice(0, 2).toUpperCase() || "??"}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-sm font-semibold text-foreground block leading-none">@{log.sender_name || "unknown"}</span>
                      <span className="text-[11px] text-zinc-muted">
                        {log.type === "COMMENT" ? "Commented" : (log.type === "STORY_REPLY" ? "Story Reply" : "Message")} 
                        <span className="opacity-30 mx-1">→</span> 
                        <span className="text-foreground/80 font-medium">Replied</span>
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-muted opacity-30 shrink-0">{formatTime(log.created_at)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Top Triggers */}
        <div className="bg-white border border-border rounded-[22px] p-8 shadow-sm flex flex-col h-[320px]">
          <div className="flex items-center gap-2.5 mb-8 shrink-0">
            <div className="p-1.5 bg-foreground/5 rounded-lg text-foreground">
              <BarChart3 size={18} />
            </div>
            <h3 className="font-semibold text-lg text-foreground">Popular Words</h3>
          </div>

          <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar pr-1">
            {!topTriggers || topTriggers.length === 0 ? (
              <p className="text-sm text-zinc-muted italic text-center py-10">No triggers hit yet.</p>
            ) : (
              topTriggers.map((trigger) => (
                <div key={trigger.keyword} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-foreground/5 rounded-md text-[11px] font-bold border border-border">{trigger.keyword}</span>
                      <span className="text-[11px] font-medium text-zinc-muted opacity-60">Engagement</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{trigger.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-foreground rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${trigger.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
