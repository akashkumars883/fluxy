"use client";

import { useDashboard } from "@/context/DashboardContext";
import { Home, Cpu, Users, Settings, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function MobileBottomNav({ onMenuClick }) {
  const { activeTab, setActiveTab, currentPlan, realtimeStats } = useDashboard();

  const primaryNavItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "automations", label: "Automations", icon: Cpu },
    { id: 'audience', label: 'Audience', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const isExtraTabActive = useMemo(() => {
    const primaryIds = ["home", "automations", "audience", "settings"];
    return !primaryIds.includes(activeTab);
  }, [activeTab]);

  const maxQuota = currentPlan === "viral_scale" ? 50000 : currentPlan === "creator_pro" ? 15000 : 1000;
  const usedQuota = (realtimeStats?.totalDms || 0) + (realtimeStats?.autoReplies || 0);
  const quotaPercent = Math.min(100, Math.round((usedQuota / maxQuota) * 100));
  const quotaDotColor = quotaPercent >= 90 ? "bg-rose-500" : quotaPercent >= 70 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 w-full z-50 pointer-events-auto pb-safe-area-inset-bottom">
      {/* Glass bar */}
      <div className="mx-3 mb-3 bg-white/90 backdrop-blur-xl border border-zinc-200/60 rounded-2xl shadow-xl shadow-zinc-900/10 flex items-center justify-between px-2 py-2">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 min-w-[50px] rounded-xl focus-visible:outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="mobileBottomNavActiveIndicator"
                  className="absolute inset-0 bg-indigo-500/10 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <div className={`transition-all duration-200 ${isActive ? "text-indigo-600 scale-110" : "text-zinc-400"}`}>
                <Icon size={21} strokeWidth={isActive ? 2.2 : 1.8} />
              </div>
              <span className={`text-[9px] font-semibold transition-colors ${isActive ? "text-indigo-600" : "text-zinc-400"}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* More Menu */}
        <button
          onClick={onMenuClick}
          className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 min-w-[50px] rounded-xl focus-visible:outline-none"
        >
          {isExtraTabActive && (
            <div className="absolute top-1 right-3 w-2 h-2 bg-indigo-500 rounded-full z-10 ring-2 ring-white animate-pulse" />
          )}
          <div className="relative text-zinc-400">
            <Menu size={21} strokeWidth={1.8} />
            <span className={`absolute -bottom-0.5 right-0 w-1.5 h-1.5 rounded-full ring-1 ring-white ${quotaDotColor}`} />
          </div>
          <span className="text-[9px] font-semibold text-zinc-400">More</span>
        </button>
      </div>
    </div>
  );
}
