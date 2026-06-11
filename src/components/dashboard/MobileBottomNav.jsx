"use client";

import { useDashboard } from "@/context/DashboardContext";
import { Home, Cpu, Users, Settings, Menu, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function MobileBottomNav({ onMenuClick }) {
  const { activeTab, setActiveTab, currentPlan, realtimeStats } = useDashboard();

  const primaryNavItems = [
    { id: "home", label: "Overview", icon: Home },
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
  const quotaDotColor = quotaPercent >= 90 ? "bg-red-500" : quotaPercent >= 60 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 w-full z-50 px-4 py-2 bg-white/95 backdrop-blur-3xl border-t border-zinc-200/60 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] flex items-center justify-between pointer-events-auto pb-safe-area-inset-bottom">
      {primaryNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="relative flex-1 flex items-center justify-center py-2 min-w-[50px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/30 rounded-lg"
          >
            {isActive && (
              <motion.div
                layoutId="mobileBottomNavActiveIndicator"
                className="absolute inset-0 bg-[#6366F1]/10 rounded-[16px] -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <div className={`p-1.5 rounded-full transition-colors ${isActive ? "text-[#6366F1]" : "text-zinc-400"}`}>
              <Icon size={23} strokeWidth={isActive ? 2.5 : 2} />
            </div>
          </button>
        );
      })}

      {/* Menu Button with "More" indicator when extra tab active */}
      <button
        onClick={onMenuClick}
        className="relative flex-1 flex items-center justify-center py-2 min-w-[50px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/30 rounded-sm"
      >
        {isExtraTabActive && (
          <div className="absolute -top-0.5 right-2 w-2 h-2 bg-[#6366F1] rounded-full z-10" />
        )}
        <div className="relative inline-flex items-center justify-center p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 transition-colors">
          <Menu size={23} strokeWidth={2} />
          {/* Quota indicator dot */}
          <span className={`absolute -bottom-0.5 right-0.5 w-2 h-2 rounded-full ${quotaDotColor} ring-1 ring-white`} />
        </div>
      </button>
    </div>
  );
}
