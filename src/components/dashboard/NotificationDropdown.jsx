"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Bell, CheckCircle2, MessageSquare, ShieldAlert, Sparkles, Check, HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";
import * as logger from "@/lib/logger";

export default function NotificationDropdown({ accounts = [] }) {
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
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "automation_history",
        },
        (payload) => {
          const newRow = payload.new;
          if (accountIds.includes(newRow.automation_id)) {
            const mappedNew = mapHistoryToNotification(newRow);
            setNotifications(prev => [mappedNew, ...prev.slice(0, 9)]);
            setUnreadCount(c => c + 1);
          }
        }
      )
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
      await supabase
        .from("automation_history")
        .update({ is_read: true })
        .in("automation_id", accountIds)
        .eq("is_read", false);
    } catch (e) {
      logger.warn("NotificationDropdown: Failed to mark notifications as read in DB:", e);
    }
  };

  const toggleReadStatus = async (id, currentRead) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
    setUnreadCount(c => currentRead ? c + 1 : Math.max(0, c - 1));

    try {
      await supabase
        .from("automation_history")
        .update({ is_read: !currentRead })
        .eq("id", id);
    } catch (e) {
      logger.warn("NotificationDropdown: Failed to update notification read state in DB:", e);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={16} className="text-emerald-600" />;
      case "automation":
        return <MessageSquare size={16} className="text-[#6366F1]" />;
      case "help":
        return <HelpCircle size={16} className="text-amber-600" />;
      case "shield":
        return <ShieldAlert size={16} className="text-sky-700" />;
      default:
        return <Sparkles size={16} className="text-[#6366F1]" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case "success":
        return "bg-emerald-50 border border-emerald-200";
      case "automation":
        return "bg-[#6366F1]/10 border border-[#6366F1]/20";
      case "help":
        return "bg-amber-50 border border-amber-200";
      case "shield":
        return "bg-sky-50 border border-sky-200";
      default:
        return "bg-[#6366F1]/5 border border-[#6366F1]/10";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-zinc-600 hover:text-zinc-950 transition-all relative shrink-0"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#6366F1] rounded-full ring-2 ring-white animate-pulse shadow-sm" />
        )}
      </button>

      {isOpen && (
        <div className="fixed sm:absolute left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 right-auto sm:right-0 top-[64px] sm:top-auto sm:mt-3 w-[calc(100vw-32px)] sm:w-[360px] bg-white border border-zinc-200 rounded-2xl shadow-2xl py-3 z-[999] animate-in fade-in zoom-in-95 duration-200">

          <div className="px-5 py-3 border-b border-zinc-200/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold text-zinc-900 tracking-tight">Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-xs font-semibold bg-[#6366F1] text-white px-2.5 py-0.5 rounded-full shadow-sm">
                  {unreadCount} New
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-[#6366F1] hover:underline flex items-center gap-1"
              >
                <Check size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-zinc-200/50 p-2 space-y-1">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 font-semibold text-xs sm:text-sm px-4">
                No active events on your connected channels yet. 🌟
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => toggleReadStatus(notif.id, notif.read)}
                  className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all cursor-pointer border shadow-sm ${notif.read ? "bg-zinc-50/50 hover:bg-zinc-50 border-transparent text-zinc-600" : "bg-white border-[#6366F1]/30 hover:border-[#6366F1]"
                    }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 shadow-sm ${getIconBg(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className={`text-xs sm:text-sm truncate tracking-tight ${notif.read ? "font-normal text-zinc-600" : "font-semibold text-zinc-900"}`}>
                        {notif.title}
                      </h5>
                      <span className="text-xs text-zinc-500 font-semibold shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-xs text-zinc-600 font-normal leading-relaxed">
                      {notif.desc}
                    </p>
                  </div>

                  {!notif.read && (
                    <div className="w-2 h-2 bg-[#6366F1] rounded-full shrink-0 mt-2 shadow-sm" />
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}
