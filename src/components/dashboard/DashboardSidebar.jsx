"use client";

import React, { useState } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { motion } from "framer-motion";
import { ChevronDown, Lock as LucideLock, PanelTopOpen, Plus, HelpCircle, Zap, ShieldCheck } from "lucide-react";

export default React.memo(function DashboardSidebar({
  navigationItems,
  onPricingClick,
  onConnectClick,
  onHelpClick,
  quotaPercent = 0,
  usedQuota = 0,
  maxQuota = 0
}) {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    selectedAccount,
    setSelectedAccount,
    accounts
  } = useDashboard();

  const [isSwitchAccountOpen, setIsSwitchAccountOpen] = useState(false);

  const mainNavItems = navigationItems.filter(item => item.id !== "settings");
  const settingsItem = navigationItems.find(item => item.id === "settings");

  return (
    <aside className={`bg-white/90 backdrop-blur-xl border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hidden md:flex flex-col justify-between select-none transition-all duration-300 ease-[0.16,1,0.3,1] z-30 shrink-0 h-[calc(100vh-24px)] sticky top-3 my-3 ml-3 rounded-2xl overflow-visible ${isSidebarCollapsed ? "w-[72px] px-2 py-3 items-center" : "w-60 p-5"
      }`}>

      {/* Top Nav */}
      <div className="space-y-1 w-full">

        {/* Header with Logo and Collapse Toggle */}
        <div className={`flex items-center justify-between mb-4 w-full ${isSidebarCollapsed ? "flex-col gap-4 justify-center" : "px-1"}`}>
          <div className="flex items-center gap-2 cursor-pointer group shrink-0" onClick={() => window.location.href = '/?home=true'}>
            <img
              src="/logo.png"
              alt="Automixa Logo"
              className="w-7 h-7 object-contain transition-all duration-300 shrink-0 group-hover:scale-110"
            />
            {!isSidebarCollapsed && (
              <h2 className="text-lg font-bold tracking-tight text-zinc-900 truncate animate-in fade-in duration-200">
                automixa
              </h2>
            )}
          </div>

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="inline-flex items-center justify-center p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-all"
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
              className={`group relative flex items-center ${isSidebarCollapsed ? "justify-center mx-auto" : "justify-start"} rounded-xl text-sm font-medium transition-all duration-200 h-10 ${isSidebarCollapsed ? "w-10 p-0" : "w-full px-3 gap-3"} ${isActive
                ? "text-white"
                : item.locked
                  ? "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-500"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
                }`}
              title={isSidebarCollapsed ? "" : item.label}
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

              {isSidebarCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-[11px] font-medium rounded-md opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-lg flex items-center">
                  {item.label}
                  <div className="absolute top-1/2 -left-1 -mt-1 border-[4px] border-transparent border-r-zinc-800" />
                </div>
              )}

              {!isSidebarCollapsed && (
                <span className="whitespace-nowrap overflow-hidden flex-1 text-left relative z-10 font-medium animate-in fade-in duration-150">
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
        {/* Quota Usage Widget */}
        {isSidebarCollapsed ? (
          <div className="relative flex items-center justify-center w-10 h-10 mx-auto group cursor-pointer" title={`Quota: ${quotaPercent}%`}>
            <svg className="w-10 h-10 -rotate-90">
              {/* Background circle */}
              <circle
                cx="20"
                cy="20"
                r="14"
                className="stroke-zinc-100 fill-none"
                strokeWidth="2.5"
              />
              {/* Progress circle */}
              <circle
                cx="20"
                cy="20"
                r="14"
                className="stroke-[#6366F1] fill-none transition-all duration-500"
                strokeWidth="2.5"
                strokeDasharray="88"
                strokeDashoffset={88 - (quotaPercent / 100) * 88}
                strokeLinecap="round"
              />
            </svg>
            {/* Inner Icon */}
            <div className="absolute inset-0 flex items-center justify-center text-[#6366F1]">
              <Zap size={11} className="fill-[#6366F1]/10" />
            </div>

            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-[11px] font-medium rounded-md opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-200 whitespace-nowrap z-[100] shadow-lg flex flex-col items-start">
              <span className="font-bold">Quota Usage</span>
              <span>{usedQuota.toLocaleString()} / {maxQuota.toLocaleString()} ({quotaPercent}%)</span>
              <div className="absolute top-1/2 -left-1 -mt-1 border-[4px] border-transparent border-r-zinc-800" />
            </div>
          </div>
        ) : (
          <div className="p-3 bg-zinc-50/50 border border-zinc-200/50 rounded-2xl space-y-1.5 mb-2 mx-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]">
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><Zap size={13} className="text-[#6366F1] fill-[#6366F1]/10" /> Usage</span>
              <span className="text-zinc-800">{quotaPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 border border-zinc-200/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#6366F1] rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-medium text-zinc-400">
              <span>{usedQuota.toLocaleString()} / {maxQuota.toLocaleString()} Replies</span>
            </div>
          </div>
        )}

        {/* Help Option */}
        <button
          onClick={onHelpClick}
          className={`group relative flex items-center ${isSidebarCollapsed ? "justify-center mx-auto" : "justify-start"} rounded-sm text-sm font-medium transition-all duration-200 h-10 ${isSidebarCollapsed ? "w-10 p-0" : "w-full px-3 gap-3"} text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80`}
          title={isSidebarCollapsed ? "" : "Help"}
        >
          <div className="flex items-center justify-center shrink-0 relative z-10">
            <HelpCircle size={18} strokeWidth={1.5} />
          </div>

          {isSidebarCollapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-[11px] font-medium rounded-md opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-lg flex items-center">
              Help
              <div className="absolute top-1/2 -left-1 -mt-1 border-[4px] border-transparent border-r-zinc-800" />
            </div>
          )}

          {!isSidebarCollapsed && (
            <span className="whitespace-nowrap overflow-hidden flex-1 text-left relative z-10 font-medium animate-in fade-in duration-150">
              Help
            </span>
          )}
        </button>

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
            className={`group relative flex items-center ${isSidebarCollapsed ? "justify-center mx-auto" : "justify-start"} rounded-xl text-sm font-medium transition-all duration-200 h-10 ${isSidebarCollapsed ? "w-10 p-0" : "w-full px-3 gap-3"} ${activeTab === "settings"
              ? "bg-zinc-100 text-zinc-900"
              : settingsItem.locked
                ? "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-500"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
              }`}
            title={isSidebarCollapsed ? "" : settingsItem.label}
          >
            <div className="flex items-center justify-center shrink-0 relative z-10">
              <settingsItem.icon size={18} strokeWidth={activeTab === "settings" ? 2 : 1.5} />
            </div>

            {isSidebarCollapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-[11px] font-medium rounded-md opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-lg flex items-center">
                {settingsItem.label}
                <div className="absolute top-1/2 -left-1 -mt-1 border-[4px] border-transparent border-r-zinc-800" />
              </div>
            )}

            {!isSidebarCollapsed && (
              <span className="whitespace-nowrap overflow-hidden flex-1 text-left relative z-10 font-medium animate-in fade-in duration-150">
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

        {/* Protected by Automixa Shield */}
        {selectedAccount && (
          <div className="w-full mb-1">
            {isSidebarCollapsed ? (
              <div 
                className="group relative flex items-center justify-center mx-auto rounded-xl transition-all duration-200 h-10 w-10 text-emerald-500 hover:text-emerald-600"
                title="Powered by Automixa Shield"
              >
                <ShieldCheck size={18} />
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-[11px] font-medium rounded-md opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-lg flex items-center">
                  Powered by Automixa Shield
                  <div className="absolute top-1/2 -left-1 -mt-1 border-[4px] border-transparent border-r-zinc-800" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium text-zinc-400 select-none">
                <ShieldCheck size={13} className="text-emerald-500" />
                <span>Powered by Automixa Shield</span>
              </div>
            )}
          </div>
        )}

        {/* Account Switcher */}
        {selectedAccount && (
          <div className="relative w-full pt-3 border-t border-[#e9e9eb]">
            <button
              onClick={() => setIsSwitchAccountOpen(!isSwitchAccountOpen)}
              className={`w-full flex items-center rounded-xl transition-all duration-200 hover:bg-zinc-100/80 ${isSidebarCollapsed ? "justify-center p-1.5 w-10 h-10 mx-auto" : "justify-between p-1.5 gap-2"
                }`}
              title="Switch Account"
            >
              <div className="flex items-center gap-2 overflow-hidden min-w-0">
                <img
                  src={selectedAccount.profile_pic || selectedAccount.profile_picture_url || selectedAccount.metadata?.profile_picture_url || selectedAccount.metadata?.profile_pic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(selectedAccount.page_name || "User") + "&background=6366f1&color=fff&size=150"}
                  alt={selectedAccount.ig_username || selectedAccount.page_name}
                  className="w-8 h-8 rounded-xl object-cover shrink-0 border border-zinc-200 shadow-sm"
                />
                <span className={`text-xs font-medium text-zinc-700 truncate text-left transition-all duration-300 ${isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 flex-1 min-w-0"
                  }`}>
                  @{selectedAccount.ig_username || selectedAccount.name || selectedAccount.page_name || "automixa_user"}
                </span>
              </div>
              <ChevronDown size={13} className={`text-zinc-400 shrink-0 transition-all duration-300 ${isSidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                }`} />
            </button>

            {isSwitchAccountOpen && (
              <div className={`absolute bottom-full mb-3 bg-white border border-zinc-200 rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 ${isSidebarCollapsed ? "left-0 w-64" : "left-0 w-full min-w-[220px]"
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
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all ${selectedAccount.id === acc.id ? "bg-[#6366F1]/10 text-[#6366F1]" : "hover:bg-zinc-50 text-zinc-700"
                        }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img
                          src={acc.profile_pic || acc.profile_picture_url || acc.metadata?.profile_picture_url || acc.metadata?.profile_pic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(acc.page_name || "User") + "&background=6366f1&color=fff&size=150"}
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
                    className="w-full flex items-center gap-2 p-2.5 hover:bg-zinc-50 rounded-xl text-xs font-medium text-zinc-700 transition-all"
                  >
                    <Plus size={13} className="text-[#6366F1]" /> <span>Connect Instagram</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
});
