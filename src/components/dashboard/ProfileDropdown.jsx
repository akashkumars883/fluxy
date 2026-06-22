"use client";
import { useDashboard } from "@/context/DashboardContext";
import { createClient } from "@/lib/supabase";
import { CreditCard, LogOut, Settings, User, Zap, ChevronRight, Crown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default React.memo(function ProfileDropdown({ user, realtimeStats, onAccountSettingsClick, onSubscriptionClick }) {
  const { currentPlan } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const usedReplies = realtimeStats?.totalDms + realtimeStats?.autoReplies || 0;
  const totalReplies = currentPlan === "free" ? 1000 : currentPlan === "creator_pro" ? 15000 : 50000;
  const usagePercentage = Math.min(Math.round((usedReplies / totalReplies) * 100), 100);

  const planLabel = currentPlan === "free" ? "Free" : currentPlan === "creator_pro" ? "Business Pro" : "Viral Scale";
  const planColor = currentPlan === "free"
    ? "bg-zinc-100 text-zinc-600 border-zinc-200"
    : currentPlan === "creator_pro"
      ? "bg-indigo-50 text-indigo-600 border-indigo-200"
      : "bg-amber-50 text-amber-600 border-amber-200";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || "User Profile";
  const firstLetter = fullName ? (typeof fullName === 'string' ? fullName.charAt(0).toUpperCase() : "U") : "U";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center p-0.5 border rounded-xl transition-all duration-200 shrink-0 group
          ${isOpen ? "border-indigo-300 ring-2 ring-indigo-500/10 bg-white" : "border-zinc-200/80 bg-white/60 hover:bg-white hover:border-zinc-300"}`}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={fullName}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-xl object-cover border border-zinc-100"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center font-bold text-sm text-white border border-zinc-100">
            {firstLetter || <User size={16} />}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed sm:absolute left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 right-auto sm:right-0 top-[64px] sm:top-auto sm:mt-2 w-[calc(100vw-32px)] sm:w-[300px] bg-white border border-zinc-200/80 rounded-2xl overflow-hidden z-[999]  -900/10"
          >
            {/* Profile Header */}
            <div className="relative px-4 py-4 bg-zinc-50 border-b border-zinc-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-60" />

              <div className="flex items-center gap-3 relative z-10">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover border-2 border-white  shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center font-bold text-lg text-white border-2 border-white  shrink-0">
                    {firstLetter || <User size={20} />}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-zinc-900 truncate tracking-tight leading-tight">{fullName}</h4>
                  <p className="text-[11px] text-zinc-400 font-normal truncate mt-0.5">{user?.email}</p>
                </div>
              </div>

              {/* Plan Badge + Usage */}
              <div className="flex items-center justify-between mt-3 relative z-10">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${planLabel === "Free" ? "bg-zinc-100 text-zinc-500 border-zinc-200" : planLabel === "Business Pro" ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
                  {planLabel !== "Free" && <Crown size={9} />}
                  {planLabel}
                </span>

                {/* Usage mini bar */}
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${usagePercentage >= 90 ? "bg-rose-500" : usagePercentage >= 70 ? "bg-amber-500" : "bg-indigo-500"}`}
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400">{usagePercentage}%</span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {[
                { label: "Account Settings", icon: Settings, desc: "Personal information & preferences", action: () => onAccountSettingsClick(), iconBg: "bg-zinc-50 text-zinc-600", iconHover: "group-hover:bg-indigo-50 group-hover:text-indigo-600" },
                { label: "Billing & Plans", icon: CreditCard, desc: "Manage subscription & invoices", action: () => onSubscriptionClick(), iconBg: "bg-zinc-50 text-zinc-600", iconHover: "group-hover:bg-violet-50 group-hover:text-violet-600" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setIsOpen(false); item.action(); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 text-left transition-all group border border-transparent hover:border-zinc-100"
                >
                  <div className={`p-2 rounded-xl transition-all duration-200 shrink-0 ${item.iconBg} ${item.iconHover}`}>
                    <item.icon size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-semibold text-zinc-900 tracking-tight">{item.label}</h5>
                    <p className="text-[10px] text-zinc-400 font-normal truncate mt-0.5">{item.desc}</p>
                  </div>
                  <ChevronRight size={13} className="text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" />
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-100 mx-3" />

            {/* Sign Out */}
            <div className="p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 text-xs text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl font-semibold transition-all group cursor-pointer"
              >
                <div className="p-2 bg-rose-50 text-rose-500 rounded-xl group-hover:bg-rose-100 transition-colors shrink-0">
                  <LogOut size={14} />
                </div>
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
