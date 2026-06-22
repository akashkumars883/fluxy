"use client";

import {
  Activity,
  ChevronRight,
  Clock,
  Download,
  Filter,
  MessageSquare,
  Search,
  UserCheck,
  Users,
  X,
  Zap,
  Sparkles,
  ArrowUpRight,
  Mail,
  Hash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDashboard } from "@/context/DashboardContext";
import AudienceAvatar from "./AudienceAvatar";
import { motion, AnimatePresence } from "framer-motion";

export default function AudienceCRM({ history = [], currentPlan = "free", onUpgradeClick }) {
  const { selectedAccount } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [modalProfilePic, setModalProfilePic] = useState(null);
  const [profilePicLoading, setProfilePicLoading] = useState(false);

  const isMounted = mounted || typeof window !== "undefined";

  useEffect(() => {
    if (!selectedUser || !selectedAccount) {
      setModalProfilePic(null);
      return;
    }
    setModalProfilePic(selectedUser.avatar);
    const isLocalDev = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    if (isLocalDev || selectedUser.id.startsWith("mock") || !selectedAccount.id) return;
    setProfilePicLoading(true);
    fetch(`/api/media/profile-pic?automationId=${selectedAccount.id}&senderId=${selectedUser.id}`)
      .then((res) => res.json())
      .then((data) => { if (data.success && data.profilePic) setModalProfilePic(data.profilePic); })
      .catch((err) => console.error("Error loading profile pic:", err))
      .finally(() => setProfilePicLoading(false));
  }, [selectedUser, selectedAccount]);

  // Build audience map from history
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
        lastActiveLabel: new Date(h.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
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
      user.lastActiveLabel = new Date(h.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
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

  const allAudience = Array.from(realAudienceMap.values()).sort((a, b) => b.lastActive - a.lastActive);
  const commentUsers = allAudience.filter((u) => u.tags.includes("comment"));
  const storyUsers = allAudience.filter((u) => u.tags.includes("story"));

  const filterOptions = [
    { id: "all", label: "All", count: allAudience.length },
    ...(commentUsers.length > 0 ? [{ id: "comment", label: "Comments", count: commentUsers.length }] : []),
    ...(storyUsers.length > 0 ? [{ id: "story", label: "Stories", count: storyUsers.length }] : []),
  ];

  const filteredAudience = allAudience.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.keywordTriggered.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFilter === "all") return matchSearch;
    return matchSearch && u.tags.includes(selectedFilter);
  });

  const totalInteractions = (history || []).length;
  const uniqueUsers = allAudience.length;
  const successfulDeliveries = (history || []).filter((h) => h.status === "SUCCESS").length;
  const successRate = totalInteractions > 0 ? Math.round((successfulDeliveries / totalInteractions) * 100) : 0;

  const statCards = [
    { label: "Total Contacts", value: uniqueUsers, icon: Users, softBg: "bg-indigo-50", iconColor: "text-indigo-500", gradient: "from-indigo-500 to-violet-500" },
    { label: "Interactions", value: totalInteractions, icon: MessageSquare, softBg: "bg-amber-50", iconColor: "text-amber-500", gradient: "from-amber-500 to-orange-400" },
    { label: "Delivered", value: successfulDeliveries, icon: Zap, softBg: "bg-emerald-50", iconColor: "text-emerald-500", gradient: "from-emerald-500 to-teal-400" },
    { label: "Success Rate", value: `${successRate}%`, icon: Activity, softBg: "bg-violet-50", iconColor: "text-violet-500", gradient: "from-violet-500 to-purple-500" },
  ];

  const handleExportCSV = () => {
    if (currentPlan === "free") { onUpgradeClick?.("creator_pro"); return; }
    const headers = "ID,Username,Keyword,Interactions,Last Active\n";
    const rows = filteredAudience.map((u) => `${u.id},@${u.username},${u.keywordTriggered},${u.interactionCount},${u.lastActiveLabel}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `automixa_contacts_${Date.now()}.csv`;
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
    <div className="space-y-4 animate-in fade-in duration-500 w-full max-w-[1400px] mx-auto pb-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-black opacity-60 uppercase tracking-widest mb-0.5">CRM</p>
          <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">Contacts</h2>
          <p className="text-sm text-black opacity-60 font-medium mt-0.5">All users who interacted with your automations.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black opacity-90 bg-white border border-zinc-200 rounded-md hover:border-zinc-300 hover:bg-zinc-50 transition-all"
          >
            <Download size={13} /> Export CSV
          </button>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100">
            <Users size={12} /> {allAudience.length} contacts
          </span>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.35 }}
              className="group bg-white border border-zinc-200/60 rounded-md p-4 flex items-center gap-3 hover:border-zinc-300 hover: hover:-100/60 transition-all duration-200"
            >
              <div className={`w-9 h-9 ${card.softBg} ${card.iconColor} rounded-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                <Icon size={16} />
              </div>
              <div>
                <div className="text-xl font-black text-zinc-950 leading-none">{card.value}</div>
                <div className="text-[10px] font-semibold text-black opacity-60 mt-0.5 uppercase tracking-wide">{card.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Upgrade Banner ── */}
      {currentPlan !== "viral_scale" && (
        <div className="relative overflow-hidden bg-zinc-950 rounded-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="absolute -top-6 -left-6 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center shrink-0">
              <Sparkles size={15} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{currentPlan === "free" ? "Unlock Business Pro — full CRM access" : "Scale to 50,000 contacts"}</p>
              <p className="text-[10px] text-black opacity-60 mt-0.5 font-medium">
                {currentPlan === "free" ? "Export CSV, detailed contact profiles & lead tracking." : "Agency-level CRM, multi-account contacts & white-label."}
              </p>
            </div>
          </div>
          <button
            onClick={() => onUpgradeClick?.(currentPlan === "free" ? "creator_pro" : "viral_scale")}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-zinc-50 text-zinc-950 text-xs font-bold rounded-md transition-all hover: relative z-10"
          >
            Upgrade Now <ArrowUpRight size={12} />
          </button>
        </div>
      )}

      {/* ── Contacts Table Card ── */}
      <div className="bg-white border border-zinc-200/60 rounded-md overflow-hidden ">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 px-4 py-3 border-b border-zinc-100 bg-zinc-50/40">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-xs group">
            <Search size={13} strokeWidth={2.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-black opacity-60 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Search contacts or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-md pl-8 pr-3 py-2 text-[12px] font-medium text-black placeholder:text-black opacity-60 transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5">
            {filterOptions.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1
                  ${selectedFilter === f.id
                    ? "bg-indigo-500 text-white  -200"
                    : "bg-zinc-100 text-black opacity-90 hover:bg-zinc-200 border border-zinc-200"
                  }`}
              >
                {f.label}
                <span className={`text-[9px] px-1 py-0.5 rounded-md font-black ${selectedFilter === f.id ? "bg-white/20" : "bg-zinc-200/80"}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table Header - Desktop */}
        {filteredAudience.length > 0 && (
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-2.5 bg-zinc-50/60 border-b border-zinc-100 text-[9px] font-bold text-black opacity-60 uppercase tracking-widest">
            <span>Contact</span>
            <span>Keyword</span>
            <span>Type</span>
            <span>Last Active</span>
            <span className="text-right">Actions</span>
          </div>
        )}

        {/* Contact List */}
        <div className="max-h-[540px] overflow-y-auto no-scrollbar divide-y divide-zinc-50">
          {filteredAudience.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
              <div className="w-12 h-12 bg-zinc-50 border-2 border-zinc-100 border-dashed rounded-md flex items-center justify-center">
                <Users size={20} className="text-zinc-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">No contacts yet</p>
                <p className="text-xs text-black opacity-60 mt-0.5">Users who trigger your automations will appear here.</p>
              </div>
            </div>
          ) : (
            filteredAudience.map((usr, idx) => (
              <motion.button
                key={usr.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setSelectedUser(usr)}
                className="w-full group"
              >
                {/* Desktop Row */}
                <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 items-center px-5 py-3 hover:bg-zinc-50/70 transition-colors text-left">
                  {/* Contact */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <AudienceAvatar
                        senderId={usr.id}
                        defaultAvatar={usr.avatar}
                        automationId={selectedAccount?.id}
                        className="w-9 h-9 rounded-md object-cover border border-zinc-100"
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${usr.isFollowing ? "bg-emerald-400" : "bg-zinc-300"}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-black truncate">@{usr.username}</span>
                        {usr.isFollowing && <UserCheck size={10} className="text-emerald-500 shrink-0" />}
                      </div>
                      <span className={`inline-flex items-center mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${usr.isFollowing ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-black opacity-60"}`}>
                        {usr.isFollowing ? "Follower" : "Not following"}
                      </span>
                    </div>
                  </div>

                  {/* Keyword */}
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold rounded-lg font-mono">
                      <Hash size={8} />
                      {usr.keywordTriggered}
                    </span>
                  </div>

                  {/* Type */}
                  <div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg border ${usr.tags.includes("story") ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-zinc-50 text-black opacity-80 border-zinc-200"}`}>
                      {usr.tags.includes("story") ? "Story" : "Comment"}
                    </span>
                  </div>

                  {/* Last Active */}
                  <div className="flex items-center gap-1 text-[11px] text-black opacity-60 font-medium">
                    <Clock size={10} />
                    {formatTimeAgo(usr.lastActive)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-[10px] font-bold text-black opacity-90 bg-zinc-50 border border-zinc-100 px-2 py-1 rounded-lg">
                      {usr.interactionCount}×
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-black opacity-60 group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-500 transition-all">
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </div>

                {/* Mobile Row */}
                <div className="sm:hidden flex items-center gap-3 px-4 py-3 hover:bg-zinc-50/70 transition-colors text-left">
                  <div className="relative shrink-0">
                    <AudienceAvatar
                      senderId={usr.id}
                      defaultAvatar={usr.avatar}
                      automationId={selectedAccount?.id}
                      className="w-10 h-10 rounded-md object-cover border border-zinc-100"
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${usr.isFollowing ? "bg-emerald-400" : "bg-zinc-300"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-bold text-black">@{usr.username}</span>
                      <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-bold rounded-md font-mono">#{usr.keywordTriggered}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-black opacity-60 font-medium">
                      <span className="flex items-center gap-0.5"><Clock size={9} />{formatTimeAgo(usr.lastActive)}</span>
                      <span>·</span>
                      <span className="font-bold text-black opacity-90">{usr.interactionCount} interactions</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-zinc-300 shrink-0" />
                </div>
              </motion.button>
            ))
          )}
        </div>

        {/* Table Footer */}
        {filteredAudience.length > 0 && (
          <div className="px-5 py-2.5 border-t border-zinc-100 bg-zinc-50/40 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-black opacity-60">
              Showing {filteredAudience.length} of {allAudience.length} contacts
            </span>
            <span className="text-[10px] font-semibold text-black opacity-60">Click a contact to view details</span>
          </div>
        )}
      </div>

      {/* ── Contact Detail Modal ── */}
      {selectedUser && isMounted && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
          >
            <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative w-full max-w-md bg-white border border-zinc-200 rounded-md flex flex-col overflow-hidden max-h-[88vh]  -900/20"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-zinc-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={modalProfilePic || selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-11 h-11 rounded-md object-cover border border-zinc-200"
                    />
                    {profilePicLoading && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-md">
                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${selectedUser.isFollowing ? "bg-emerald-400" : "bg-zinc-300"}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-black flex items-center gap-1.5">
                      @{selectedUser.username}
                      {selectedUser.isFollowing && <UserCheck size={13} className="text-emerald-500" />}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold rounded-md border border-indigo-100 font-mono">
                        <Hash size={7} />{selectedUser.keywordTriggered}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${selectedUser.isFollowing ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-zinc-50 text-black opacity-80 border-zinc-200"}`}>
                        {selectedUser.isFollowing ? "Follower" : "Not following"}
                      </span>
                      <span className="text-[9px] text-black opacity-60 font-medium">{selectedUser.interactionCount} interactions</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 bg-zinc-50 border border-zinc-200 rounded-md text-black opacity-60 hover:text-black hover:bg-zinc-100 transition-all cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
                <p className="text-[9px] font-bold text-black opacity-60 uppercase tracking-widest mb-3">Interaction History</p>
                <div className="space-y-3">
                  {selectedUser.chats.length === 0 ? (
                    <p className="text-xs text-black opacity-60 text-center py-8">No interaction history.</p>
                  ) : (
                    selectedUser.chats.map((c, idx) => (
                      <div key={idx} className={`flex flex-col ${c.sender === "user" ? "items-start" : "items-end"}`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-bold text-black opacity-60">
                            {c.sender === "user" ? `@${selectedUser.username}` : "🤖 Automixa"}
                          </span>
                          <span className="text-[9px] text-zinc-300">· {c.time}</span>
                        </div>
                        <div className={`px-3.5 py-2.5 rounded-md text-xs font-medium max-w-[85%] leading-relaxed ${
                          c.sender === "user"
                            ? "bg-zinc-50 border border-zinc-200 text-black"
                            : "bg-indigo-500 text-white"
                        }`}>
                          {c.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-zinc-100 shrink-0">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-md transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
