"use client";

import { useDashboard } from "@/context/DashboardContext";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Lock as LucideLock, Plus, X, Zap } from "lucide-react";
import { useState } from "react";

export default function MobileSidebar({
  isOpen,
  onClose,
  navigationItems,
  onPricingClick,
  onConnectClick,
  quotaPercent = 0,
  usedQuota = 0,
  maxQuota = 0
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          />

          <motion.aside
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed inset-x-0 bottom-0 top-auto h-auto max-h-[88vh] w-full rounded-t-3xl bg-white border-t border-zinc-200/80 z-50 flex flex-col md:hidden select-none shadow-2xl shadow-zinc-200/60"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-zinc-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img src="/logo.png" alt="Automixa Logo" className="w-7 h-7 object-contain" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
                </div>
                <span className="text-base font-bold tracking-tight text-zinc-900">automixa</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Account Section */}
            <div className="px-4 pb-3 shrink-0">
              {selectedAccount && (
                <div className="relative">
                  <button
                    onClick={() => setIsSwitchAccountOpen(!isSwitchAccountOpen)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-200/60 hover:bg-zinc-100/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 overflow-hidden w-full">
                      <div className="relative shrink-0">
                        <img
                          src={selectedAccount.profile_pic || selectedAccount.profile_picture_url || selectedAccount.metadata?.profile_picture_url || selectedAccount.metadata?.profile_pic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(selectedAccount.page_name || "User") + "&background=6366f1&color=fff&size=150"}
                          alt={selectedAccount.ig_username || selectedAccount.page_name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-200"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                      </div>
                      <div className="text-left overflow-hidden flex-1">
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Active Account</p>
                        <p className="text-sm font-semibold text-zinc-800 truncate">
                          @{selectedAccount.ig_username || selectedAccount.name || selectedAccount.page_name || 'automixa_user'}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-zinc-400 mr-1 shrink-0 transition-all duration-300 ${isSwitchAccountOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isSwitchAccountOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 bg-white border border-zinc-200 rounded-2xl p-2 z-50 w-full shadow-xl shadow-zinc-200/60"
                      >
                        <div className="px-2 py-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Switch Account</div>
                        <div className="space-y-0.5 max-h-36 overflow-y-auto no-scrollbar py-1">
                          {accounts.map(acc => (
                            <button
                              key={acc.id}
                              onClick={() => {
                                setSelectedAccount(acc);
                                setIsSwitchAccountOpen(false);
                                onClose();
                              }}
                              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer
                                ${selectedAccount.id === acc.id ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 border border-transparent"}`}
                            >
                              <img
                                src={acc.profile_pic || acc.profile_picture_url || acc.metadata?.profile_picture_url || acc.metadata?.profile_pic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(acc.page_name || "User") + "&background=6366f1&color=fff&size=150"}
                                alt={acc.ig_username || acc.page_name}
                                className="w-6 h-6 rounded-lg object-cover ring-1 ring-zinc-200"
                              />
                              <span className="truncate flex-1 text-left">@{acc.ig_username || acc.name || acc.page_name || 'automixa_user'}</span>
                              {selectedAccount.id === acc.id && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0" />}
                            </button>
                          ))}
                        </div>
                        <div className="pt-1.5 border-t border-zinc-100 mt-1">
                          <button
                            onClick={() => {
                              setIsSwitchAccountOpen(false);
                              onClose();
                              onConnectClick();
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-zinc-50 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-all cursor-pointer"
                          >
                            <div className="w-5 h-5 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                              <Plus size={11} className="text-indigo-500" />
                            </div>
                            <span>Connect Instagram</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-100 mx-4" />

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5 no-scrollbar">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2">Menu</p>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.locked) { onPricingClick(); onClose(); }
                      else { setActiveTab(item.id); onClose(); }
                    }}
                    className={`relative w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer
                      ${isActive ? "text-indigo-600" : item.locked ? "text-zinc-400" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"}`}
                  >
                    {isActive && (
                      <motion.div
                        layout
                        layoutId="sidebarActiveTabMobile"
                        className="absolute inset-0 bg-indigo-50 border border-indigo-100 rounded-xl z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <div className="flex items-center gap-3 relative z-10">
                      <Icon size={18} strokeWidth={isActive ? 2.2 : 1.7} />
                      <span>{item.label}</span>
                    </div>
                    {item.locked && (
                      <div className="flex items-center justify-center bg-zinc-100 w-5 h-5 rounded-md relative z-10 shrink-0">
                        <LucideLock size={9} className="text-zinc-400" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quota Bar */}
            <div className="px-5 py-4 border-t border-zinc-100 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  <Zap size={10} className="text-indigo-500" />
                  Quota Usage
                </span>
                <span className="text-[10px] font-bold text-indigo-500">{quotaPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${quotaPercent >= 90 ? "from-rose-500 to-red-400" : quotaPercent >= 70 ? "from-amber-500 to-orange-400" : "from-indigo-500 to-violet-400"}`}
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
              <p className="text-[9px] text-zinc-400 font-medium mt-1">
                {usedQuota.toLocaleString()} / {maxQuota.toLocaleString()} replies used
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
