"use client";

import { Users, Heart, MessageSquare, TrendingUp, Award, UserCircle } from "lucide-react";

export default function FanEngagement({ stats, history }) {
  // Aggregate top fans from history
  const fanCounts = history.reduce((acc, log) => {
    if (log.sender_name) {
      acc[log.sender_name] = (acc[log.sender_name] || 0) + 1;
    }
    return acc;
  }, {});

  const topFans = Object.entries(fanCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Fan Engagement</h1>
        <p className="text-zinc-muted text-sm font-medium mt-1">Nurture your most active community members.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-border rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                  <Heart size={20} />
                </div>
                <span className="text-sm font-bold text-foreground">Engagement Rate</span>
              </div>
              <div className="text-4xl font-black text-foreground">{stats.engagementRate || "0%"}</div>
              <p className="text-[10px] text-zinc-muted font-bold uppercase mt-2">Active users / total DMs</p>
            </div>

            <div className="bg-white border border-border rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <span className="text-sm font-bold text-foreground">Unique Fans</span>
              </div>
              <div className="text-4xl font-black text-foreground">{stats.uniqueUsers || 0}</div>
              <p className="text-[10px] text-zinc-muted font-bold uppercase mt-2">Total unique reach</p>
            </div>
          </div>

          {/* Top Fans Leaderboard */}
          <div className="bg-white border border-border rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                  <Award size={20} />
                </div>
                <h3 className="font-bold text-lg text-foreground">Top Engagers</h3>
              </div>
            </div>

            <div className="space-y-4">
              {topFans.length === 0 ? (
                <p className="text-sm text-zinc-muted italic">No engagement data available yet.</p>
              ) : (
                topFans.map((fan, index) => (
                  <div key={fan.name} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-border/40">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black text-zinc-muted w-4">#{index + 1}</span>
                      <div className="w-10 h-10 bg-white border border-border rounded-full flex items-center justify-center">
                        <UserCircle size={20} className="text-zinc-muted" />
                      </div>
                      <span className="font-bold text-foreground">@{fan.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-black text-foreground">{fan.count}</span>
                       <span className="text-[10px] font-bold text-zinc-muted uppercase tracking-tighter">Hits</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Quick Actions or Insights */}
        <div className="space-y-6">
           <div className="bg-foreground text-background rounded-[32px] p-8 shadow-xl">
             <TrendingUp size={24} className="mb-6" />
             <h3 className="text-2xl font-bold mb-4 leading-tight">Fastest Growing Community</h3>
             <p className="text-sm text-background/60 font-medium leading-relaxed">
               Your fans are most active during story mentions. Try creating more polls to boost retention!
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
