"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Lock as LucideLock, Sparkles } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function MobileSidebar({ 
  isOpen, 
  onClose, 
  navigationItems, 
  onPricingClick,
  quotaPercent,
  usedQuota,
  maxQuota
}) {
  const { activeTab, setActiveTab, selectedAccount, currentPlan } = useDashboard();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          />
          
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-72 bg-white/90 backdrop-blur-2xl z-50 p-6 flex flex-col gap-8 shadow-2xl md:hidden select-none"
          >
            <div className="flex items-center justify-between border-b border-zinc-200/50 pb-4 shrink-0">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Automixa Logo" className="w-7 h-7 object-contain" />
                <span className="text-base font-semibold tracking-tight text-zinc-900">automixa</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1 overflow-y-auto pr-1">
              <p className="text-xs font-semibold text-zinc-500 tracking-normal capitalize px-3 mb-2">Main Menu</p>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.locked) {
                        onPricingClick();
                        onClose();
                      } else {
                        setActiveTab(item.id);
                        onClose();
                      }
                    }}
                    className={`relative w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all ${
                      isActive
                        ? "text-[#6366F1] font-semibold"
                        : item.locked
                          ? "text-zinc-400 font-medium hover:bg-zinc-100"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-white shadow-sm"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layout
                        layoutId="sidebarActiveTabMobile"
                        className="absolute inset-0 bg-[#6366F1]/10 rounded-2xl z-0"
                        transition={{ type: "tween", ease: "easeInOut", duration: 0.25 }}
                      />
                    )}

                    <div className="flex items-center gap-3 relative z-10">
                      <Icon size={18} className="shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.locked && (
                      <div className="flex items-center justify-center bg-zinc-200/80 w-5 h-5 rounded-full relative z-10 shrink-0">
                        <LucideLock size={10} className="text-zinc-600" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

              <div className="mt-auto space-y-4 pt-4 border-t border-zinc-200/50">
              </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
