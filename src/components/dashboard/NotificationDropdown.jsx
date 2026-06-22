"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Bell, CheckCircle2, MessageSquare, ShieldAlert, Sparkles, Check, HelpCircle, X } from "lucide-react";
import { createClient } from "@/lib/supabase";
import * as logger from "@/lib/logger";
import { motion, AnimatePresence } from "framer-motion";

export default React.memo(function NotificationDropdown({ accounts = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const supabase = useMemo(() => createClient(), []);

  const formatTimeAgo = useCallback((dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${diffDays}d ago`;
  }, []);

  const mapHistoryToNotification = useCallback((item) => {
    let title = "Automation Event";
    let desc = `Activity registered from ${item.sender_name || "a user"}.`;
    let type = "automation";

    if (item.type === "AUTOMIXA_SHIELD" || item.metadata?.shield === "automixa_shield") {
      title = item.status === "COOLDOWN_ACTIVE" ? "Automixa Shield Cooldown" : "Automixa Shield Protected";
      desc = item.metadata?.user_message || "Automixa Shield paused suspicious activity to keep your account safe.";
      type = "shield";
    } else if (item.type === "HELP_REQUESTED" || item.status === "HANDOVER") {
      title = "Support Requested 💬";
      desc = `${item.sender_name || "User"} requested human assistance ("${item.metadata?.text || 'help'}").`;
      type = "help";
    } else if (item.type === "COMMENT") {
      title = `Auto-Reply Sent`;
      desc = `Replied to ${item.sender_name || "user"} on keyword "${item.keyword || '*'}".`;
      type = "automation";
    } else if (item.type === "DM") {
      title = "DM Funnel Triggered";
      desc = `Delivered fulfillment to ${item.sender_name || "user"}.`;
      type = "success";
    }

    return {
      id: item.id,
      title,
      desc,
      time: formatTimeAgo(item.created_at),
      type,
      read: item.is_read || false,
      rawDate: item.created_at
    };
  }, [formatTimeAgo]);

  useEffect(() => {
    if (!accounts || accounts.length === 0) return;

    const fetchNotifications = async () => {
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const accountIds = accounts.map(a => a?.id).filter(id => id && UUID_REGEX.test(id));
      if (accountIds.length === 0) return;

      const { data, error } = await supabase
        .from("automation_history")
        .select("*")
        .in("automation_id", accountIds)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        logger.error("NotificationDropdown: Error fetching notifications from history:", error);
        return;
      }

      if (data) {
        const mapped = data.map(mapHistoryToNotification);
        setNotifications(mapped);
        setUnreadCount(mapped.filter(n => !n.read).length);
      }
    };

    fetchNotifications();

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const accountIds = accounts.map(a => a?.id).filter(id => id && UUID_REGEX.test(id));
    if (accountIds.length === 0) return;
    const channel = supabase
      .channel("live_automation_history")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "automation_history" },
        (payload) => {
          const newRow = payload.new;
          if (accountIds.includes(newRow.automation_id)) {
            const mappedNew = mapHistoryToNotification(newRow);
            setNotifications(prev => [mappedNew, ...prev.slice(0, 9)]);
            setUnreadCount(c => c + 1);
          }
        })
      .subscribe();

    const handleSimulatedEvent = (e) => {
      const { type, senderName, keyword, accountId } = e.detail;
      if (accountIds.includes(accountId)) {
        const fakeRow = {
          id: "simulated-" + Date.now(),
          automation_id: accountId,
          sender_name: senderName,
          type: type,
          keyword: keyword,
          status: "SUCCESS",
          created_at: new Date().toISOString()
        };
        const mappedNew = mapHistoryToNotification(fakeRow);
        setNotifications(prev => [mappedNew, ...prev.slice(0, 9)]);
        setUnreadCount(c => c + 1);
      }
    };

    window.addEventListener("automixa-simulated-event", handleSimulatedEvent);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("automixa-simulated-event", handleSimulatedEvent);
    };
  }, [accounts, mapHistoryToNotification, supabase]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    if (!accounts || accounts.length === 0) return;
    const accountIds = accounts.map(a => a?.id).filter(Boolean);
    if (accountIds.length === 0) return;

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      await supabase.from("automation_history").update({ is_read: true }).in("automation_id", accountIds).eq("is_read", false);
    } catch (e) {
      logger.warn("NotificationDropdown: Failed to mark notifications as read in DB:", e);
    }
  };

  const toggleReadStatus = async (id, currentRead) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
    setUnreadCount(c => currentRead ? c + 1 : Math.max(0, c - 1));

    try {
      await supabase.from("automation_history").update({ is_read: !currentRead }).eq("id", id);
    } catch (e) {
      logger.warn("NotificationDropdown: Failed to update notification read state in DB:", e);
    }
  };

  const getConfig = (type) => {
    switch (type) {
      case "success": return { icon: CheckCircle2, iconColor: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" };
      case "automation": return { icon: MessageSquare, iconColor: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" };
      case "help": return { icon: HelpCircle, iconColor: "text-amber-600", bg: "bg-amber-50 border-amber-100" };
      case "shield": return { icon: ShieldAlert, iconColor: "text-sky-700", bg: "bg-sky-50 border-sky-100" };
      default: return { icon: Sparkles, iconColor: "text-indigo-600", bg: "bg-indigo-50/50 border-indigo-100/50" };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-200 shrink-0
          ${isOpen ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80"}`}
      >
        <Bell size={19} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500 ring-2 ring-white" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed sm:absolute left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 right-auto sm:right-0 top-[64px] sm:top-auto sm:mt-2 w-[calc(100vw-32px)] sm:w-[370px] bg-white border border-zinc-200/80 rounded-2xl overflow-hidden z-[999]  -900/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-100 bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-zinc-900 tracking-tight">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-indigo-500 text-white text-[9px] font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-all"
                  >
                    <Check size={12} /> Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-zinc-50 no-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-14 text-center px-4 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-zinc-50 border border-zinc-200 border-dashed rounded-2xl flex items-center justify-center">
                    <Bell size={18} className="text-zinc-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-500">All caught up!</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">No active events on your channels yet.</p>
                  </div>
                </div>
              ) : (
                notifications.map((notif) => {
                  const { icon: Icon, iconColor, bg } = getConfig(notif.type);
                  return (
                    <div
                      key={notif.id}
                      onClick={() => toggleReadStatus(notif.id, notif.read)}
                      className={`flex items-start gap-3.5 p-4 transition-all cursor-pointer group
                        ${notif.read ? "bg-transparent hover:bg-zinc-50/50" : "bg-indigo-50/20 hover:bg-indigo-50/40"}`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 border ${bg}`}>
                        <Icon size={15} className={iconColor} />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className={`text-xs truncate tracking-tight ${notif.read ? "font-normal text-zinc-600" : "font-bold text-zinc-900"}`}>
                            {notif.title}
                          </h5>
                          <span className="text-[10px] text-zinc-400 font-semibold shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-normal leading-relaxed line-clamp-2">{notif.desc}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1.5" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
