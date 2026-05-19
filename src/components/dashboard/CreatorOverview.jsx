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
  BarChart3, 
  ArrowUpRight,
  Sparkles,
  Link2,
  Calendar,
  Layers,
  ShieldCheck,
  Gauge,
  Clock,
  Users,
  Flame,
  ArrowRight,
  X,
  ShieldAlert
} from "lucide-react";

import { createClient } from "@/lib/supabase";

export default function CreatorOverview({ stats = {}, history = [], topTriggers = [], automationId, hideHeader = false, onSimulateLocal, isActive = true, onViewAudience, onCreateAutoReply }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [isHumanMimicEnabled, setIsHumanMimicEnabled] = useState(true);
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
    followerGrowth = 0,
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

  const getWeeklyData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7Days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      last7Days.push({ 
        day: days[d.getDay()], 
        date: d.toDateString(),
        value: 0 
      });
    }

    if (history && history.length > 0) {
      history.forEach(log => {
        const logDate = new Date(log.created_at).toDateString();
        const dayMatch = last7Days.find(d => d.date === logDate);
        if (dayMatch) {
          dayMatch.value += 1;
        }
      });
    }

    // If we have no real data, return zeros instead of mock data
    const hasData = last7Days.some(d => d.value > 0);
    if (!hasData) {
      return last7Days.map(d => ({
        day: d.day,
        value: 0,
        label: "0 replies"
      }));
    }

    return last7Days.map(d => ({
      day: d.day,
      value: d.value,
      label: `${d.value} replies`
    }));
  };

  const graphData = getWeeklyData();

  const width = 600;
  const height = 180;
  const padding = 25;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;
  const maxVal = Math.max(...graphData.map(d => d.value)) || 10;

  const points = graphData.map((d, i) => {
    const x = padding + (i / (graphData.length - 1)) * graphWidth;
    const y = padding + graphHeight - (d.value / maxVal) * graphHeight;
    return { x, y, ...d };
  });

  const pathData = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (p.x - prev.x) / 2;
    const cpY2 = p.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
  }, "");

  const areaPathData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  const activeKeywords = topTriggers && topTriggers.length > 0
    ? topTriggers.map((t, idx) => {
        const commentsCount = t.count;
        const dmsCount = t.count; // Simplified for real data
        const clicksCount = 0; // Not tracked yet
        
        const triggerTypes = ["Post Comment", "Reel Comment", "Direct Inbox", "Story Reply"];
        return {
          keyword: (t.keyword || "AUTO").toUpperCase(),
          triggerType: triggerTypes[idx % triggerTypes.length],
          delivery: "100%",
          comments: commentsCount,
          dms: dmsCount,
          clicks: clicksCount,
          ctr: "0%"
        };
      })
    : [];

  const activeLeads = history && history.length > 0
    ? history.map((log, idx) => {
        return {
          handle: log.sender_name || `user_${log.id}`,
          name: log.sender_name 
            ? log.sender_name.replace(/_|\./g, ' ') 
            : `User #${log.sender_id?.slice(0,4)}`,
          interactions: 1,
          status: "Real Lead",
          lastActive: formatTime(log.created_at)
        };
      })
    : [];

  const metricCards = [
    { label: "Automated Comments", value: autoReplies, icon: MessageSquare, color: "text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20", trend: "+14.8%", bgClass: "bg-[#6366F1]/5 border-[#6366F1]/20 hover:border-[#6366F1]/40 hover:shadow-[#6366F1]/5" },
    { label: "Messages Sent", value: totalDms, icon: Zap, color: "text-amber-600 bg-amber-50 border-amber-200", trend: "+12.1%", bgClass: "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40 hover:shadow-amber-500/5" },
    { label: "Conversion Rate", value: engagementRate, icon: TrendingUp, color: "text-emerald-600 bg-emerald-50 border-emerald-200", trend: "Optimal", bgClass: "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/5" },
    { label: "Active Rules", value: topTriggers.length || "3 Rules", icon: Cpu, color: "text-purple-600 bg-purple-50 border-purple-200", trend: "Active", bgClass: "bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/5" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-[1400px] mx-auto pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.label}
              className={`backdrop-blur-3xl border rounded-xl p-6 flex flex-col justify-between shadow-xl shadow-zinc-200/10 hover:shadow-2xl transition-all duration-500 group cursor-default relative overflow-hidden hover:-translate-y-1 ${card.bgClass}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#6366F1]/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg backdrop-blur-md transition-all duration-500 group-hover:scale-110 ${card.color}`}>
                  <Icon size={18} />
                </div>
                <span className={`text-[9px] font-semibold px-3 py-1 rounded-full shadow-sm ${
                  card.trend === "Optimal" || card.trend === "Active"
                    ? "bg-zinc-950 text-white"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                }`}>
                  {card.trend}
                </span>
              </div>
              
              <div className="space-y-0.5 relative z-10">
                <span className="text-3xl sm:text-4xl font-semibold text-zinc-950 tracking-tighter leading-none block group-hover:text-[#6366F1] transition-colors duration-300">
                  {card.value}
                </span>
                <span className="text-[12px] font-semibold text-zinc-400 leading-tight block mt-2">
                  {card.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        <div className="lg:col-span-2 bg-white/40 backdrop-blur-3xl border border-zinc-200/80 rounded-xl p-8 shadow-xl shadow-zinc-200/20 hover:shadow-2xl hover:shadow-[#6366F1]/5 hover:border-[#6366F1]/40 transition-all duration-500 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366F1]/5 rounded-full -mr-32 -mt-32 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          
          <div className="flex items-center justify-between mb-8 relative z-10 shrink-0">
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-[#6366F1]">Performance Monitor</span>
              <h3 className="font-bold text-2xl sm:text-3xl text-zinc-950 tracking-tighter leading-none flex items-center gap-3 group-hover:text-[#6366F1] transition-colors">
                Weekly Activity 
              </h3>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] font-semibold text-zinc-400 bg-white border border-zinc-100 px-4 py-2.5 rounded-xl shadow-sm">
              <Calendar size={14} className="text-[#6366F1]" />
              <span>Last 7 Days</span>
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 h-[180px] w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1.5" />
              <line x1={padding} y1={padding + graphHeight / 2} x2={width - padding} y2={padding + graphHeight / 2} stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="1.5" />

              <path d={areaPathData} fill="url(#brandGradient)" className="transition-all duration-700 ease-in-out" />

              <path d={pathData} fill="none" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-700 ease-in-out" />

              {points.map((p, i) => (
                <g key={p.day}>
                  {hoveredDay === i && (
                    <circle cx={p.x} cy={p.y} r={9} fill="#6366F1" fillOpacity="0.15" className="animate-ping" />
                  )}
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r={hoveredDay === i ? 6 : 4.5} 
                    fill="#ffffff" 
                    stroke="#6366F1" 
                    strokeWidth={hoveredDay === i ? 3.5 : 2.5}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredDay(i)}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                  <text 
                    x={p.x} 
                    y={height - 5} 
                    textAnchor="middle" 
                    className="text-xs font-semibold fill-zinc-600 capitalize tracking-normal cursor-default"
                  >
                    {p.day}
                  </text>
                </g>
              ))}
            </svg>

            {hoveredDay !== null && (
              <div 
                className="absolute bg-zinc-950 text-white font-semibold text-xs px-3 py-2 rounded-xl shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-150"
                style={{ 
                  left: `${((points[hoveredDay].x - padding) / graphWidth) * 100}%`,
                  top: `${(points[hoveredDay].y / height) * 100 - 8}%`
                }}
              >
                {points[hoveredDay].label}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-xl border border-zinc-200/80 rounded-xl p-8 shadow-xl shadow-zinc-100/40 hover:shadow-2xl hover:shadow-zinc-200/40 flex flex-col relative transition-all duration-500 h-[380px]">
          <div className="flex items-center justify-between mb-8 border-b border-zinc-200/50 pb-6 shrink-0">
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-[#6366F1]">Live Feed</span>
              <h3 className="font-bold text-2xl sm:text-3xl text-zinc-950 tracking-tighter leading-none flex items-center gap-3">
                Recent Leads <Activity size={24} className="text-emerald-500 shrink-0" />
              </h3>
            </div>
            <button 
              onClick={onViewAudience}
              className="p-2.5 bg-white border border-zinc-100 rounded-xl text-zinc-400 hover:text-[#6366F1] hover:shadow-lg transition-all shadow-sm"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="space-y-5 flex-1 overflow-y-auto no-scrollbar pb-2 pr-1 relative z-10">
            {!history || history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-2">
                <Activity size={28} className="text-zinc-300 animate-pulse" />
                <p className="text-xs text-zinc-500 font-normal italic lowercase">no recent messages logged.</p>
              </div>
            ) : (
              history.map((log) => (
                <div key={log.id} className="flex items-start justify-between group cursor-default border-b border-zinc-200/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 bg-white border border-zinc-200 rounded-xl flex items-center justify-center text-[10px] font-bold text-zinc-800 shadow-sm shrink-0 group-hover:border-[#6366F1] group-hover:text-[#6366F1] transition-all">
                      {log.sender_name?.slice(0, 2).toUpperCase() || "??"}
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-xs sm:text-sm font-bold text-foreground tracking-tight block leading-none">@{log.sender_name || "unknown"}</span>
                      <span className="text-[10px] text-zinc-500 font-normal block">
                        {log.type === "COMMENT" ? "commented" : (log.type === "STORY_REPLY" ? "story reply" : "message")} 
                        <span className="opacity-40 mx-1">→</span> 
                        <span className="text-[#6366F1]">sent dm</span>
                      </span>
                    </div>
                  </div>
                  
                  <span className="text-[10px] font-bold text-zinc-400 shrink-0 mt-0.5">{formatTime(log.created_at)}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        <div className="lg:col-span-2 bg-white/40 backdrop-blur-3xl border border-zinc-200/80 rounded-xl p-8 lg:p-10 shadow-xl shadow-zinc-200/20 hover:shadow-2xl hover:shadow-[#6366F1]/5 transition-all duration-500 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#6366F1]/5 rounded-full -mr-24 -mt-24 pointer-events-none" />
          
          <div className="relative z-10 w-full">
            <div className="flex items-center justify-between mb-8 border-b border-zinc-200/50 pb-6 shrink-0">
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-[#6366F1]">Traffic Sources</span>
                <h3 className="font-bold text-2xl sm:text-3xl text-zinc-950 tracking-tighter leading-[1.1] flex items-center gap-2">
                  Top Keywords <Flame size={28} className="text-orange-500 fill-orange-500 shrink-0" />
                </h3>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-semibold text-zinc-500 bg-white border border-zinc-100 px-3 py-1.5 rounded-xl shadow-sm">
                <Gauge size={14} className="text-[#6366F1]" />
                <span>Real-time Insights</span>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200/80 pb-4">
                    <th className="text-[10px] font-semibold text-zinc-400 pb-4">Keyword</th>
                    <th className="text-[10px] font-semibold text-zinc-400 pb-4 hidden sm:table-cell">Trigger Type</th>
                    <th className="text-[10px] font-semibold text-zinc-400 pb-4 text-center">Comments</th>
                    <th className="text-[10px] font-semibold text-zinc-400 pb-4 text-center">DM Sent</th>
                    <th className="text-[10px] font-semibold text-zinc-400 pb-4 text-right">Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/50">
                  {activeKeywords.map((item, index) => (
                    <tr key={index} className="group/row hover:bg-white/60 transition-all duration-150">
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#6366F1] text-white rounded-lg text-[10px] font-bold shadow-sm uppercase tracking-wider">
                          {item.keyword}
                        </span>
                      </td>
                      <td className="py-3 text-xs sm:text-sm font-bold text-zinc-600 hidden sm:table-cell">
                        {item.triggerType}
                      </td>
                      <td className="py-3 text-xs sm:text-sm font-bold text-foreground text-center">
                        {item.comments || 0}
                      </td>
                      <td className="py-3 text-xs sm:text-sm font-bold text-emerald-600 text-center">
                        {item.dms || 0} <span className="text-[10px] font-normal text-zinc-400 ml-1">({item.delivery || '0%'})</span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-xs sm:text-sm font-bold text-foreground tracking-tight leading-none">
                            {item.ctr}
                          </span>
                          <span className="text-[10px] font-semibold text-[#6366F1] leading-none mt-1">
                            {item.clicks} Clicks
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-3xl border border-zinc-200/80 rounded-xl p-8 lg:p-10 shadow-xl shadow-zinc-200/20 hover:shadow-2xl hover:shadow-[#6366F1]/5 transition-all duration-500 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366F1]/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
          
          <div className="relative z-10 w-full flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-[#6366F1]">Active Directory</span>
                <h3 className="font-bold text-2xl sm:text-3xl text-zinc-950 tracking-tighter leading-[1.1] flex items-center gap-2">
                  New Leads <Users size={28} className="text-blue-500 shrink-0" />
                </h3>
              </div>
              
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-semibold text-zinc-500 bg-white border border-zinc-100 px-3 py-1.5 rounded-xl shadow-sm">
                <ShieldCheck size={14} className="text-[#6366F1]" />
                <span>Verified</span>
              </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar max-h-[220px]">
              {activeLeads.map((lead, index) => (
                <div key={index} className="flex items-center justify-between group cursor-default border-b border-zinc-200/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-white rounded-xl border border-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-800 shadow-sm group-hover:border-[#6366F1] group-hover:text-[#6366F1] transition-all duration-300 shrink-0">
                      {lead.handle.slice(0, 2).toUpperCase()}
                    </div>
                    
                    <div className="space-y-0.5">
                      <span className="text-xs sm:text-sm font-bold text-foreground block leading-none hover:text-[#6366F1] transition-colors">
                        @{lead.handle}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-normal block uppercase tracking-tight">
                        {lead.interactions} interactions
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 text-right">
                    <span className={`text-[9px] font-semibold px-2.5 py-1 rounded-full shadow-sm ${
                      lead.status === "Converted" 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                      {lead.status}
                    </span>
                    <span className="text-[9px] font-semibold text-zinc-400 mt-1">
                      {lead.lastActive}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
