"use client";

import { useDashboard } from "@/context/DashboardContext";
import { Home, Zap, Users, Menu } from "lucide-react";
import { motion } from "framer-motion";

export default function MobileBottomNav({ onMenuClick }) {
  const { activeTab, setActiveTab } = useDashboard();

  const primaryNavItems = [
    { id: "home", label: "Overview", icon: Home },
    { id: "automations", label: "Automations", icon: Zap },
    { id: 'audience', label: 'Audience', icon: Users, isSpecial: false },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 w-full z-40 px-4 py-2 bg-white/95 backdrop-blur-3xl border-t border-zinc-200/60 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] rounded-t-[24px] flex items-center justify-between pointer-events-auto pb-safe">
      {primaryNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="relative flex-1 flex items-center justify-center py-2 min-w-[50px]"
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

      {/* Menu Button to open bottom sheet */}
      <button
        onClick={onMenuClick}
        className="relative flex-1 flex items-center justify-center py-2 min-w-[50px]"
      >
        <div className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 transition-colors">
          <Menu size={23} strokeWidth={2} />
        </div>
      </button>
    </div>
  );
}
