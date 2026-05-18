"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Users, Sparkles, ShieldCheck, Mail, Phone, Search, Filter, Download, MessageSquare, Clock, ArrowUpRight, UserCheck, X, CheckCircle2, Lock as LucideLock } from "lucide-react";

export default function AudienceCRM({ accountId, history = [], currentPlan = "free" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  // Generate robust mock audience list combined with simulated live history
  // 1. Group history by sender_id to build real profiles
  const realAudienceMap = new Map();
  (history || []).forEach(h => {
    if (!h.sender_id) return;
    
    if (!realAudienceMap.has(h.sender_id)) {
      realAudienceMap.set(h.sender_id, {
        id: h.sender_id,
        username: h.sender_name || "instagram_user",
        name: h.sender_name?.replace('_', ' ') || "Instagram User",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${h.sender_id}`,
        tier: "⚡ Realtime Engager",
        keywordTriggered: h.keyword || "AUTO",
        email: h.metadata?.email || null,
        phone: h.metadata?.phone || null,
        lastActive: new Date(h.created_at).toLocaleDateString(),
        tags: ["leads", "realtime"],
        chats: []
      });
    }
    
    // Add interaction to chat history
    const user = realAudienceMap.get(h.sender_id);
    user.chats.push({
      sender: "user",
      text: h.keyword || "Triggered Automation",
      time: new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    user.chats.push({
      sender: "bot",
      text: h.status === "SUCCESS" ? "Delivered automated response." : "Interaction started.",
      time: new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });

  const displayAudience = Array.from(realAudienceMap.values()).filter(u => {
    const matchesSearch = (u.username || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.keywordTriggered || "").toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedTag === "all") return matchesSearch;
    return matchesSearch && u.tags.includes(selectedTag);
  });

  const isFreePlan = currentPlan === "free";
  const filteredAudience = displayAudience; // For export logic consistency

  const handleExportCSV = () => {
    if (isFreePlan) {
      alert("CSV Export is a Premium feature. Please upgrade to Creator Pro to export leads.");
      return;
    }
    const headers = "ID,Username,Name,EngagementTier,TriggerKeyword,Email,Phone,LastActive\n";
    const csvContent = filteredAudience.map(u => `${u.id},@${u.username},${u.name},${u.tier},${u.keywordTriggered},${u.email || 'N/A'},${u.phone || 'N/A'},${u.lastActive}`).join("\n");
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `automixa_audience_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleExportEvent = () => {
      handleExportCSV();
    };
    window.addEventListener("export_audience_csv", handleExportEvent);
    return () => {
      window.removeEventListener("export_audience_csv", handleExportEvent);
    };
  }, [displayAudience]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full max-w-[1400px] mx-auto">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Real Audience", value: displayAudience.length, change: "Live data", icon: Users, color: "text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20", bgClass: "bg-[#6366F1]/5 border-[#6366F1]/20 hover:border-[#6366F1]/40 hover:shadow-[#6366F1]/5" },
          { title: "Captured Leads", value: displayAudience.filter(u => u.email || u.phone).length, change: "Real-time", icon: Sparkles, color: "text-emerald-600 bg-emerald-50 border-emerald-200", bgClass: "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/5" },
          { title: "Follower Gate", value: "Active", change: "100% Secure", icon: ShieldCheck, color: "text-purple-600 bg-purple-50 border-purple-200", bgClass: "bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/5" },
          { title: "Interactions", value: history.length, change: "History", icon: MessageSquare, color: "text-amber-600 bg-amber-50 border-amber-200", bgClass: "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40 hover:shadow-amber-500/5" }
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
                <span className={`text-[9px] font-semibold px-3 py-1 rounded-full shadow-sm ${
                  card.change === "100% Secure" || card.change === "History" || card.change === "Live data"
                    ? "bg-zinc-950 text-white"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                }`}>
                  {card.change}
                </span>
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

      <div className="bg-white/40 backdrop-blur-3xl border border-zinc-200/80 rounded-xl p-6 sm:p-10 shadow-xl shadow-zinc-200/20 hover:border-[#6366F1]/20 transition-all duration-500 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366F1]/5 rounded-full -mr-32 -mt-32 pointer-events-none" />

        {isFreePlan && (
          <div className="p-4 bg-[#6366F1]/5 border border-[#6366F1]/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1]">
                <Sparkles size={20} />
              </div>
              <p className="text-xs font-semibold text-zinc-700">
                Free Plan: Viewing limited to first 50 contacts. <span className="text-[#6366F1]">Upgrade to Creator Pro</span> for unlimited CRM & CSV Export.
              </p>
            </div>
            <button className="px-4 py-2 bg-[#6366F1] text-white text-[10px] font-bold rounded-xl shadow-sm hover:bg-[#5255e0]">
              Upgrade Now
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-t border-b border-zinc-200/50 py-6">
          <div className="relative flex-1 max-w-md group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none group-focus-within:text-[#6366F1] group-hover:text-[#6366F1] transition-colors z-10">
              <Search size={14} strokeWidth={2.5} />
            </div>
            <input 
              type="text"
              placeholder="Search by username, name, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100/50 hover:bg-zinc-100/80 focus:bg-white backdrop-blur-xl border border-zinc-200/50 focus:border-[#6366F1]/50 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-zinc-800 placeholder:text-zinc-400 transition-all duration-300 shadow-inner outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
            <Filter size={16} className="text-zinc-400 shrink-0 mr-1" />
            {[
              { id: "all", label: "All Users" },
              { id: "leads", label: "⚡ Leads Captured" },
              { id: "vip", label: "🌟 VIP Buyers" },
              { id: "giveaway", label: "🎁 Giveaway" }
            ].map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                  selectedTag === tag.id ? 'bg-[#6366F1] text-white shadow-md' : 'bg-white/80 border border-zinc-200/80 text-zinc-700 hover:bg-white'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden">
          {/* Desktop Table View */}
          <table className="hidden md:table w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-200/50 text-xs font-semibold text-zinc-400">
                <th className="pb-4 pl-4">User Profile</th>
                <th className="pb-4">User Level</th>
                <th className="pb-4">Trigger Keyword</th>
                <th className="pb-4">Contact Details</th>
                <th className="pb-4">Last Activity</th>
                <th className="pb-4 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/30">
              {displayAudience.map((usr) => (
                <tr key={usr.id} className="hover:bg-white/60 transition-all group">
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <img src={usr.avatar} alt={usr.name} className="w-10 h-10 rounded-xl object-cover border border-zinc-200 shadow-sm" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-[#6366F1] transition-colors flex items-center gap-1">
                          {usr.name} <UserCheck size={12} className="text-blue-500" />
                        </h4>
                        <span className="text-[10px] text-zinc-500 font-semibold">@{usr.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-white border border-zinc-200 rounded-xl text-[10px] font-semibold text-zinc-800 shadow-sm">
                      {usr.tier}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-[#6366F1]/10 text-[#6366F1] font-semibold text-xs rounded-xl">
                      &apos;{usr.keywordTriggered}&apos;
                    </span>
                  </td>
                  <td className="py-4 space-y-1">
                    {usr.email && (
                      <div className="flex items-center gap-1.5 text-xs text-zinc-700 font-semibold">
                        <Mail size={14} className="text-emerald-600" /> <span>{usr.email}</span>
                      </div>
                    )}
                    {usr.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-zinc-700 font-semibold">
                        <Phone size={14} className="text-blue-600" /> <span>{usr.phone}</span>
                      </div>
                    )}
                    {!usr.email && !usr.phone && (
                      <span className="text-xs text-zinc-400 font-normal italic">No contact details captured</span>
                    )}
                  </td>
                  <td className="py-4 text-xs font-semibold text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-zinc-400" /> <span>{usr.lastActive}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-right">
                    <button
                      onClick={() => setSelectedUser(usr)}
                      className="px-4 py-2 bg-white hover:bg-zinc-950 hover:text-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 transition-all shadow-sm flex items-center gap-1 ml-auto"
                    >
                      <span>View Chats</span> <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card List View */}
          <div className="md:hidden flex flex-col gap-4">
            {displayAudience.map((usr) => (
              <div 
                key={usr.id} 
                className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4 hover:border-[#6366F1]/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img src={usr.avatar} alt={usr.name} className="w-12 h-12 rounded-xl border border-zinc-200 shadow-sm shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-zinc-950 truncate flex items-center gap-1">
                      {usr.name} <UserCheck size={14} className="text-blue-500" />
                    </h4>
                    <span className="text-xs text-zinc-500 font-semibold truncate block">@{usr.username}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-zinc-50 border border-zinc-150 rounded-lg text-[9px] font-bold text-zinc-600">
                    {usr.tier}
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#6366F1]/10 text-[#6366F1] rounded-lg text-[9px] font-bold">
                    Trigger: &apos;{usr.keywordTriggered}&apos;
                  </span>
                </div>

                <div className="space-y-1.5 border-t border-zinc-100 pt-3 text-[11px]">
                  {usr.email && (
                    <div className="flex items-center gap-1.5 text-zinc-700 font-semibold">
                      <Mail size={12} className="text-emerald-600" /> <span>{usr.email}</span>
                    </div>
                  )}
                  {usr.phone && (
                    <div className="flex items-center gap-1.5 text-zinc-700 font-semibold">
                      <Phone size={12} className="text-blue-600" /> <span>{usr.phone}</span>
                    </div>
                  )}
                  {!usr.email && !usr.phone && (
                    <span className="text-zinc-400 font-normal italic">No contact details captured</span>
                  )}
                  <div className="flex items-center gap-1.5 text-zinc-400 font-semibold pt-1">
                    <Clock size={12} /> <span>Active: {usr.lastActive}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUser(usr)}
                  className="w-full py-3 bg-zinc-50 border border-zinc-200/80 hover:bg-zinc-950 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Chats</span> <ArrowUpRight size={14} />
                </button>
              </div>
            ))}
          </div>

          {displayAudience.length === 0 && (
            <div className="py-12 text-center text-zinc-500 text-xs font-semibold">
              No Instagram users found matching your search or filter tags.
            </div>
          )}
        </div>
      </div>

      {selectedUser && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-[#f3f3f3]/60 backdrop-blur-xl" onClick={() => setSelectedUser(null)} />
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-zinc-200 rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between border-b border-zinc-200/50 pb-6 shrink-0">
              <div className="flex items-center gap-4">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shadow-sm shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight truncate">{selectedUser.name}</h3>
                  <span className="text-xs text-zinc-500 font-semibold truncate block">@{selectedUser.username}</span>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-500 hover:text-zinc-950 shadow-sm transition-all shrink-0">
                <X size={20} />
              </button>
            </div>

            <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-6 space-y-3 shadow-sm shrink-0">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">User Contact Profile</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block">Trigger Keyword:</span>
                  <span className="font-semibold text-[#6366F1]">&apos;{selectedUser.keywordTriggered}&apos;</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">User Level:</span>
                  <span className="font-semibold text-zinc-900">{selectedUser.tier}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-zinc-500 block">Contact Info:</span>
                  <span className="font-semibold text-zinc-900">{selectedUser.email || selectedUser.phone || "None"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 shrink-0 min-h-0 flex flex-col">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Chat History</h4>
              <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-6 max-h-[240px] overflow-y-auto space-y-4 no-scrollbar">
                {selectedUser.chats?.map((c, idx) => (
                  <div key={idx} className={`flex flex-col ${c.sender === 'user' ? 'items-start' : 'items-end'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold text-zinc-400">{c.sender === 'user' ? `@${selectedUser.username}` : 'Automixa Bot'}</span>
                      <span className="text-[10px] text-zinc-400">• {c.time}</span>
                    </div>
                    <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold max-w-[80%] shadow-sm ${
                      c.sender === 'user' ? 'bg-zinc-100 text-zinc-800 rounded-tl-none' : 'bg-[#6366F1] text-white rounded-tr-none'
                    }`}>
                      {c.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200/50 flex items-center justify-end shrink-0">
              <button onClick={() => setSelectedUser(null)} className="px-8 py-4 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs rounded-xl shadow-lg transition-all">
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
