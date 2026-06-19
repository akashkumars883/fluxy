"use client";

import { Home, Cpu, Plus, BarChart2, MoreHorizontal } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { motion } from "framer-motion";

export default function BottomNav({ onCreateClick, onMoreClick }) {
  const { activeTab, setActiveTab } = useDashboard();

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "automations", icon: Cpu, label: "Automations" },
    { id: "create", icon: Plus, label: "Create", isAction: true },
    { id: "analytics", icon: BarChart2, label: "Stats" },
    { id: "more", icon: MoreHorizontal, label: "More", isMore: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80  border-t border-zinc-200/50 pb-safe-area-inset-bottom ">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={onCreateClick}
                className="relative -top-4 bg-zinc-950 text-white p-3.5 rounded-xl-950/20 active:scale-90 transition-transform"
              >
                <Plus size={24} strokeWidth={2.5} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isMore) {
                  onMoreClick();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className="flex flex-col items-center justify-center flex-1 relative h-full group"
            >
              <div className={`transition-all duration-300 ${isActive ? "text-[#6366F1] -translate-y-1" : "text-zinc-400 group-hover:text-zinc-600"}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute bottom-1 w-1 h-1 bg-[#6366F1] rounded-xl"
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                />
              )}

              <span className={`text-[9px] font-bold mt-1 transition-all duration-300 uppercase tracking-wider ${isActive ? "text-[#6366F1] opacity-100 scale-100" : "text-zinc-400 opacity-60 scale-95"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
