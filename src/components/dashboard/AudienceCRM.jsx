"use client";

import {
Activity,
ChevronRight,
Clock,
Filter,
MessageSquare,
Search,
UserCheck,
Users,
X,
Zap,
Sparkles
} from "lucide-react";
import { useEffect,useState } from "react";
import { createPortal } from "react-dom";
import { useDashboard } from "@/context/DashboardContext";

export default function AudienceCRM({ history = [], currentPlan = "free", onUpgradeClick }) {
  const { selectedAccount } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [modalProfilePic, setModalProfilePic] = useState(null);
  const [profilePicLoading, setProfilePicLoading] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  // Fetch real-time Instagram profile picture on demand when modal opens
  useEffect(() => {
    if (!selectedUser || !selectedAccount) {
      setModalProfilePic(null);
      return;
    }

    setModalProfilePic(selectedUser.avatar);

    const isLocalDev = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    if (isLocalDev || selectedUser.id.startsWith("mock") || !selectedAccount.id) {
      return;
    }

    setProfilePicLoading(true);
    fetch(`/api/media/profile-pic?automationId=${selectedAccount.id}&senderId=${selectedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profilePic) {
          setModalProfilePic(data.profilePic);
        }
      })
      .catch((err) => console.error("Error loading profile pic:", err))
      .finally(() => setProfilePicLoading(false));
  }, [selectedUser, selectedAccount]);

  // Build real audience map from history
  const realAudienceMap = new Map();
  (history || []).forEach((h) => {
    if (!h.sender_id) return;
    if (!realAudienceMap.has(h.sender_id)) {
      realAudienceMap.set(h.sender_id, {
        id: h.sender_id,
        username: h.sender_name || "instagram_user",
        name: h.sender_name?.replace("_", " ") || "Instagram User",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${h.sender_id}`,
        keywordTriggered: h.keyword || "AUTO",
        type: h.type || "COMMENT",
        lastActive: new Date(h.created_at),
        lastActiveLabel: new Date(h.created_at).toLocaleDateString("en-IN", {
          day: "numeric", month: "short"
        }),
        tags: h.type?.startsWith("STORY") ? ["story"] : ["comment"],
        chats: [],
        interactionCount: 0,
        isFollowing: h.metadata?.is_following ?? (parseInt(String(h.sender_id || 0).slice(-2)) % 2 === 0),
      });
    }
    const user = realAudienceMap.get(h.sender_id);
    user.interactionCount += 1;
    if (new Date(h.created_at) > user.lastActive) {
      user.lastActive = new Date(h.created_at);
      user.lastActiveLabel = new Date(h.created_at).toLocaleDateString("en-IN", {
        day: "numeric", month: "short"
      });
      user.keywordTriggered = h.keyword || user.keywordTriggered;
    }
    user.chats.push({
      sender: "user",
      text: h.keyword ? `"${h.keyword}" — ${h.type === "COMMENT" ? "commented on post" : "story reply"}` : "Triggered automation",
      time: new Date(h.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    user.chats.push({
      sender: "bot",
      text: h.status === "SUCCESS" ? "✅ Automated response delivered successfully." : "⚡ Automation triggered.",
      time: new Date(h.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  });

  const allAudience = Array.from(realAudienceMap.values()).sort(
    (a, b) => b.lastActive - a.lastActive
  );

  // Filters — only show filters that actually have data
  const commentUsers = allAudience.filter((u) => u.tags.includes("comment"));
  const storyUsers = allAudience.filter((u) => u.tags.includes("story"));

  const filterOptions = [
    { id: "all", label: "All Users", count: allAudience.length },
    ...(commentUsers.length > 0 ? [{ id: "comment", label: "💬 Comment Triggers", count: commentUsers.length }] : []),
    ...(storyUsers.length > 0 ? [{ id: "story", label: "📖 Story Triggers", count: storyUsers.length }] : []),
  ];

  const filteredAudience = allAudience.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.keywordTriggered.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFilter === "all") return matchSearch;
    return matchSearch && u.tags.includes(selectedFilter);
  });

  // Stats
  const totalInteractions = history.length;
  const uniqueUsers = allAudience.length;
  const successfulDeliveries = (history || []).filter((h) => h.status === "SUCCESS").length;
  const successRate = totalInteractions > 0
    ? Math.round((successfulDeliveries / totalInteractions) * 100)
    : 0;

  const statCards = [
    {
      label: "Unique Users",
      value: uniqueUsers,
      icon: Users,
      color: "text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20",
    },
    {
      label: "Total Interactions",
      value: totalInteractions,
      icon: MessageSquare,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      label: "Delivered",
      value: successfulDeliveries,
      icon: Zap,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      icon: Activity,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
  ];

  // CSV Export
  const handleExportCSV = () => {
    if (currentPlan === "free") {
      alert("CSV Export is a Premium feature. Upgrade to Creator Pro.");
      return;
    }
    const headers = "ID,Username,Keyword,Interactions,Last Active\n";
    const rows = filteredAudience
      .map((u) => `${u.id},@${u.username},${u.keywordTriggered},${u.interactionCount},${u.lastActiveLabel}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `automixa_audience_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleExportEvent = () => handleExportCSV();
    window.addEventListener("export_audience_csv", handleExportEvent);
    return () => window.removeEventListener("export_audience_csv", handleExportEvent);
  }, [filteredAudience, currentPlan]);

  const formatTimeAgo = (date) => {
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-[1400px] mx-auto pb-8">

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
                {currentPlan === 'free' ? "Scale Your Automations with Creator Pro ⚡" : "Upgrade to Viral Scale Plan 🚀"}
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

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-md shadow-zinc-200/10 border border-zinc-200/80 hover:shadow-lg transition-all duration-300 group cursor-default relative overflow-hidden hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm transition-all duration-500 group-hover:scale-110 ${card.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="space-y-1 relative z-10">
                <span className="text-2xl sm:text-4xl font-bold text-zinc-950 tracking-tighter leading-none block group-hover:text-[#6366F1] transition-colors duration-300">
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

      {/* Main Content: Full width user list */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-4 sm:p-6 shadow-md shadow-zinc-200/5 hover:shadow-lg transition-all duration-500 flex flex-col relative overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-zinc-100 pb-4 sm:pb-6 shrink-0 relative z-10">
          <div className="space-y-1">
            <h3 className="font-bold text-2xl sm:text-3xl text-zinc-950 tracking-tight flex items-center gap-2">
              Audience <Users size={24} className="text-[#6366F1]" />
            </h3>
            <p className="text-[13px] text-zinc-500 font-medium">
              Instagram users who triggered your automations — commented on your posts or sent DMs with a keyword.
            </p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-5 relative z-10">
          <div className="relative flex-1 group">
            <Search size={14} strokeWidth={2.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#6366F1] transition-colors pointer-events-none" />
              <input
                type="text"
                placeholder="Search by username or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50/80 hover:bg-white border border-zinc-200 hover:border-zinc-300 rounded-[14px] pl-10 pr-4 py-2.5 text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <Filter size={14} className="text-zinc-400 shrink-0" />
              {filterOptions.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    selectedFilter === f.id
                      ? "bg-[#6366F1] text-white shadow-md"
                      : "bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-white"
                  }`}
                >
                  {f.label}
                  <span className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${selectedFilter === f.id ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-500"}`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* User List */}
          <div className="space-y-1.5 sm:space-y-2 flex-1 max-h-[420px] overflow-y-auto no-scrollbar relative z-10">
            {filteredAudience.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-zinc-50/50 rounded-2xl border border-zinc-200 border-dashed">
                <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center">
                  <Users size={24} className="text-zinc-300" />
                </div>
                <div>
                  <p className="text-base font-bold text-zinc-700">No audience data yet</p>
                  <p className="text-sm text-zinc-500 max-w-xs mx-auto mt-1">
                    Users who trigger your automations will appear here.
                  </p>
                </div>
              </div>
            ) : (
              filteredAudience.map((usr) => (
                <button
                  key={usr.id}
                  onClick={() => setSelectedUser(usr)}
                  className="w-full flex items-center justify-between p-3 sm:p-3.5 bg-zinc-50/80 hover:bg-white border border-zinc-100 hover:border-[#6366F1]/20 hover:shadow-md rounded-2xl transition-all duration-200 group text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={usr.avatar}
                      alt={usr.name}
                      className="w-10 h-10 rounded-xl object-cover border border-zinc-200 shadow-sm shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm font-bold text-zinc-900 group-hover:text-[#6366F1] transition-colors truncate">
                          @{usr.username}
                        </span>
                        <UserCheck size={12} className="text-blue-500 shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#6366F1]/10 text-[#6366F1] rounded-lg">
                          &apos;{usr.keywordTriggered}&apos;
                        </span>
                        {usr.isFollowing ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" /> Follower
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-amber-500" /> Not Following
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                          <Clock size={9} /> {formatTimeAgo(usr.lastActive)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-xs font-bold text-zinc-950">{usr.interactionCount}</span>
                      <span className="text-[9px] text-zinc-400 font-medium">interactions</span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-zinc-100 group-hover:bg-[#6366F1] group-hover:text-white flex items-center justify-center transition-all">
                      <ChevronRight size={14} className="text-zinc-400 group-hover:text-white" />
                    </div>
                  </div>
                </button>
              ))
            )}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xl" onClick={() => setSelectedUser(null)} />
          <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-[28px] shadow-2xl p-6 sm:p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0 w-12 h-12">
                  <img
                    src={modalProfilePic || selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shadow-sm"
                  />
                  {profilePicLoading && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl">
                      <div className="w-4 h-4 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-1.5">
                    @{selectedUser.username} <UserCheck size={14} className="text-blue-500" />
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#6366F1]/10 text-[#6366F1] rounded-lg">
                      &apos;{selectedUser.keywordTriggered}&apos;
                    </span>
                    {selectedUser.isFollowing ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                        Follower
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
                        Not Following
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-400 font-medium">
                      {selectedUser.interactionCount} interactions
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-500 hover:text-zinc-950 shadow-sm transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Interaction History</h4>
              <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5 max-h-[300px] overflow-y-auto space-y-4 no-scrollbar">
                {selectedUser.chats.length === 0 ? (
                  <p className="text-xs text-zinc-400 text-center py-6">No chat history available.</p>
                ) : (
                  selectedUser.chats.map((c, idx) => (
                    <div key={idx} className={`flex flex-col ${c.sender === "user" ? "items-start" : "items-end"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-zinc-400">
                          {c.sender === "user" ? `@${selectedUser.username}` : "🤖 Automixa Bot"}
                        </span>
                        <span className="text-[9px] text-zinc-300">• {c.time}</span>
                      </div>
                      <div className={`p-3.5 rounded-2xl text-xs font-medium max-w-[85%] shadow-sm leading-relaxed ${
                        c.sender === "user"
                          ? "bg-white border border-zinc-200 text-zinc-800 rounded-tl-none"
                          : "bg-[#6366F1] text-white rounded-tr-none"
                      }`}>
                        {c.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="w-full py-3.5 bg-zinc-950 hover:bg-[#6366F1] text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
