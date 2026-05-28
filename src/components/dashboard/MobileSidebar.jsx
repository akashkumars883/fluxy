"use client";

import WorkspaceSwitcher from "@/components/dashboard/WorkspaceSwitcher";
import { useDashboard } from "@/context/DashboardContext";
import { AnimatePresence,motion } from "framer-motion";
import { ChevronDown,Lock as LucideLock,Plus,X } from "lucide-react";
import { useState } from "react";

export default function MobileSidebar({ 
  isOpen, 
  onClose, 
  navigationItems, 
  onPricingClick,
  onConnectClick
}) {
  const { 
    activeTab, 
    setActiveTab, 
    selectedAccount, 
    setSelectedAccount,
    accounts
  } = useDashboard();

  const [isSwitchAccountOpen, setIsSwitchAccountOpen] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay - now completely transparent to remove the shadow as requested */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-transparent md:hidden"
          />
          
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-2xl z-50 p-6 flex flex-col gap-6 shadow-2xl md:hidden select-none border-r border-zinc-200/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200/50 pb-4 shrink-0">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Automixa Logo" className="w-7 h-7 object-contain" />
                <span className="text-base font-semibold tracking-tight text-zinc-900">automixa</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100/50 rounded-full transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Workspace Switcher */}
            <div className="shrink-0 relative">
              <WorkspaceSwitcher variant="sidebar" />
            </div>

            {/* Main Menu Links */}
            <div className="space-y-1 overflow-y-auto pr-1 flex-1">
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
                    className={`relative w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
                      isActive
                        ? "text-[#6366F1] font-semibold"
                        : item.locked
                          ? "text-zinc-400 font-medium hover:bg-zinc-100"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-white/60 shadow-xs"
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

            {/* Account Switcher Section */}
            <div className="mt-auto pt-4 border-t border-zinc-200/50 shrink-0">
              {selectedAccount && (
                <div className="relative w-full">
                  <button
                    onClick={() => setIsSwitchAccountOpen(!isSwitchAccountOpen)}
                    className="w-full flex items-center justify-between p-1.5 rounded-2xl hover:bg-zinc-100/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 overflow-hidden w-full">
                      <img
                        src={selectedAccount.profile_pic || selectedAccount.profile_picture_url || selectedAccount.metadata?.profile_picture_url || selectedAccount.metadata?.profile_pic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(selectedAccount.page_name || "User") + "&background=6366f1&color=fff&size=150"}
                        alt={selectedAccount.ig_username || selectedAccount.page_name}
                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-200 shadow-sm"
                      />
                      <div className="text-left overflow-hidden">
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-0.5">Account</p>
                        <span className="text-xs font-semibold text-zinc-800 truncate block">
                          @{selectedAccount.ig_username || selectedAccount.name || selectedAccount.page_name || 'automixa_user'}
                        </span>
                      </div>
                    </div>
                    <ChevronDown size={14} className={`text-zinc-400 mr-2 shrink-0 transition-all duration-300 ${isSwitchAccountOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isSwitchAccountOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-0 mb-2 bg-white border border-zinc-200 rounded-2xl p-2 shadow-2xl z-50 w-full"
                      >
                        <div className="p-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Switch Instagram Account</div>
                        <div className="py-1 space-y-1 max-h-40 overflow-y-auto no-scrollbar">
                          {accounts.map(acc => (
                            <button
                              key={acc.id}
                              onClick={() => {
                                setSelectedAccount(acc);
                                setIsSwitchAccountOpen(false);
                                onClose();
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                selectedAccount.id === acc.id ? "bg-[#6366F1]/10 text-[#6366F1]" : "hover:bg-zinc-50/80 text-zinc-700"
                              }`}
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <img
                                  src={acc.profile_pic || acc.profile_picture_url || acc.metadata?.profile_picture_url || acc.metadata?.profile_pic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(acc.page_name || "User") + "&background=6366f1&color=fff&size=150"}
                                  alt={acc.ig_username || acc.page_name}
                                  className="w-6 h-6 rounded-lg object-cover shrink-0"
                                />
                                <span className="truncate">@{acc.ig_username || acc.name || acc.page_name || 'automixa_user'}</span>
                              </div>
                              {selectedAccount.id === acc.id && <div className="w-1.5 h-1.5 bg-[#6366F1] rounded-full shrink-0" />}
                            </button>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-zinc-100 mt-1">
                          <button
                            onClick={() => {
                              setIsSwitchAccountOpen(false);
                              onClose();
                              onConnectClick();
                            }}
                            className="w-full flex items-center gap-2 p-2 hover:bg-zinc-50 rounded-xl text-xs font-bold text-zinc-800 transition-all cursor-pointer"
                          >
                            <Plus size={14} className="text-[#6366F1]" /> <span>Connect Account</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
