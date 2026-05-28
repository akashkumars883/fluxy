"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Lock as LucideLock, Sparkles, ChevronDown, Plus, X, PanelTopOpen } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function DashboardSidebar({ 
  navigationItems, 
  onPricingClick, 
  onConnectClick,
  quotaPercent,
  usedQuota,
  maxQuota
}) {
  const { 
    activeTab, 
    setActiveTab, 
    isSidebarCollapsed, 
    setIsSidebarCollapsed, 
    selectedAccount, 
    setSelectedAccount,
    accounts,
    currentPlan,
    updateSelectedAccount
  } = useDashboard();

  const [isSwitchAccountOpen, setIsSwitchAccountOpen] = useState(false);

  const mainNavItems = navigationItems.filter(item => item.id !== "settings");
  const settingsItem = navigationItems.find(item => item.id === "settings");

  return (
    <aside className={`bg-[#FCFDFE] border-r border-[#e9e9eb] hidden md:flex flex-col justify-between select-none transition-all duration-500 ease-[0.16,1,0.3,1] z-30 shrink-0 h-full sticky top-0 overflow-y-auto no-scrollbar ${
      isSidebarCollapsed ? "w-[72px] p-3 items-center" : "w-60 p-5"
    }`}>

      {/* Top Nav */}
      <div className="space-y-1 w-full">
        {/* Collapse Toggle */}
        <div className={`flex items-center mb-3 ${isSidebarCollapsed ? "justify-center" : "justify-end"}`}>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-all"
            title="Toggle Sidebar"
          >
            <PanelTopOpen size={16} className={`transition-all duration-500 ${isSidebarCollapsed ? "rotate-90" : "-rotate-90"}`} strokeWidth={2} />
          </button>
        </div>

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.locked) {
                  onPricingClick();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`relative flex items-center rounded-xl text-sm font-normal transition-all duration-200 h-10 ${
                isSidebarCollapsed ? "w-10 justify-center p-0 mx-auto" : "w-full justify-start px-3 gap-3"
              } ${
                isActive
                  ? "text-white"
                  : item.locked
                  ? "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-500"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
              }`}
              title={item.label}
            >
              {isActive && (
                <motion.div
                  layout
                  layoutId="sidebarActiveTabDesktop"
                  className="absolute inset-0 bg-[#6366F1] shadow-[0_4px_14px_-4px_rgba(99,102,241,0.4)] rounded-xl z-0"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              <div className="flex items-center justify-center shrink-0 relative z-10">
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              </div>

              {!isSidebarCollapsed && (
                <span className="whitespace-nowrap overflow-hidden flex-1 text-left relative z-10 font-normal animate-in fade-in duration-150">
                  {item.label}
                </span>
              )}

              {!isSidebarCollapsed && item.locked && (
                <div className="flex items-center justify-center bg-zinc-100 w-4 h-4 rounded-full relative z-10">
                  <LucideLock size={9} className="text-zinc-400 shrink-0" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto space-y-3 w-full">
        {/* Settings Tab */}
        {settingsItem && (
          <button
            onClick={() => {
              if (settingsItem.locked) {
                onPricingClick();
              } else {
                setActiveTab(settingsItem.id);
              }
            }}
            className={`relative flex items-center rounded-xl text-sm font-normal transition-all duration-200 h-10 ${
              isSidebarCollapsed ? "w-10 justify-center p-0 mx-auto" : "w-full justify-start px-3 gap-3"
            } ${
              activeTab === "settings"
                ? "bg-zinc-100 text-zinc-900"
                : settingsItem.locked
                ? "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-500"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
            }`}
            title={settingsItem.label}
          >
            <div className="flex items-center justify-center shrink-0 relative z-10">
              <settingsItem.icon size={18} strokeWidth={activeTab === "settings" ? 2 : 1.5} />
            </div>
            {!isSidebarCollapsed && (
              <span className="whitespace-nowrap overflow-hidden flex-1 text-left relative z-10 font-normal animate-in fade-in duration-150">
                {settingsItem.label}
              </span>
            )}
            {!isSidebarCollapsed && settingsItem.locked && (
              <div className="flex items-center justify-center bg-zinc-100 w-4 h-4 rounded-full relative z-10">
                <LucideLock size={9} className="text-zinc-400 shrink-0" />
              </div>
            )}
          </button>
        )}

        {/* Account Switcher */}
        {selectedAccount && (
          <div className="relative w-full pt-3 border-t border-[#e9e9eb]">
            <button
              onClick={() => setIsSwitchAccountOpen(!isSwitchAccountOpen)}
              className={`w-full flex items-center rounded-xl transition-all duration-200 hover:bg-zinc-100/80 ${
                isSidebarCollapsed ? "justify-center p-1.5 w-10 h-10 mx-auto" : "justify-between p-1.5 gap-2"
              }`}
              title="Switch Account"
            >
              <div className="flex items-center gap-2 overflow-hidden min-w-0">
                <img
                  src={selectedAccount.profile_pic || selectedAccount.profile_picture_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&q=80"}
                  alt={selectedAccount.ig_username || selectedAccount.page_name}
                  className="w-8 h-8 rounded-xl object-cover shrink-0 border border-zinc-200 shadow-sm"
                />
                <span className={`text-xs font-semibold text-zinc-700 truncate text-left transition-all duration-300 ${
                  isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 flex-1 min-w-0"
                }`}>
                  @{selectedAccount.ig_username || selectedAccount.name || selectedAccount.page_name || "automixa_user"}
                </span>
              </div>
              <ChevronDown size={13} className={`text-zinc-400 shrink-0 transition-all duration-300 ${
                isSidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              }`} />
            </button>

            {isSwitchAccountOpen && (
              <div className={`absolute bottom-full mb-3 bg-white border border-zinc-200 rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 ${
                isSidebarCollapsed ? "left-0 w-64" : "left-0 w-full min-w-[220px]"
              }`}>
                <div className="p-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 mb-1">Switch Account</div>
                <div className="py-1 space-y-0.5 max-h-48 overflow-y-auto">
                  {accounts.map(acc => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        setSelectedAccount(acc);
                        setIsSwitchAccountOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedAccount.id === acc.id ? "bg-[#6366F1]/10 text-[#6366F1]" : "hover:bg-zinc-50 text-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img
                          src={acc.profile_pic || acc.profile_picture_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&q=80"}
                          alt={acc.ig_username || acc.page_name}
                          className="w-6 h-6 rounded-lg object-cover shrink-0"
                        />
                        <span className="truncate">@{acc.ig_username || acc.name || acc.page_name || "automixa_user"}</span>
                      </div>
                      {selectedAccount.id === acc.id && <div className="w-1.5 h-1.5 bg-[#6366F1] rounded-full shrink-0" />}
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-zinc-100 mt-1">
                  <button
                    onClick={() => {
                      setIsSwitchAccountOpen(false);
                      onConnectClick();
                    }}
                    className="w-full flex items-center gap-2 p-2.5 hover:bg-zinc-50 rounded-lg text-xs font-semibold text-zinc-700 transition-all"
                  >
                    <Plus size={13} className="text-[#6366F1]" /> <span>Connect Another Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

