"use client";

import { useDashboard } from "@/context/DashboardContext";
import { motion } from "framer-motion";
import { ChevronDown,Lock as LucideLock,PanelTopOpen,Plus } from "lucide-react";
import { useState } from "react";

export default function DashboardSidebar({ 
  navigationItems, 
  onPricingClick, 
  onConnectClick
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
    <aside className={`bg-[#FCFDFE] border-r border-[#e9e9eb] hidden md:flex flex-col justify-between select-none transition-all duration-500 ease-[0.16,1,0.3,1] z-30 shrink-0 h-full sticky top-0 overflow-visible ${
      isSidebarCollapsed ? "w-[72px] p-3 items-center" : "w-60 p-5"
    }`}>

      {/* Top Nav */}
      <div className="space-y-1 w-full">

        {/* Brand Logo & Collapse Toggle */}
        <div className={`flex items-center w-full mb-5 ${
          isSidebarCollapsed 
            ? "flex-col gap-3.5 justify-center" 
            : "flex-row justify-between"
        }`}>
          {isSidebarCollapsed ? (
            <img 
              src="/logo.png" 
              alt="automixa logo" 
              className="w-7 h-7 object-contain select-none" 
            />
          ) : (
            <div className="flex items-center gap-2 select-none animate-in fade-in duration-200">
              <img 
                src="/logo.png" 
                alt="automixa logo" 
                className="w-7 h-7 object-contain" 
              />
              <span className="text-[15px] font-black text-zinc-950 tracking-tight lowercase">
                automixa
              </span>
            </div>
          )}
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
              className={`group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 h-10 ${
                isSidebarCollapsed ? "w-10 justify-center p-0 mx-auto" : "w-full justify-start px-3 gap-3"
              } ${
                isActive
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
                <span className="whitespace-nowrap overflow-hidden flex-1 text-left relative z-10 font-semibold animate-in fade-in duration-150">
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
            className={`group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 h-10 ${
              isSidebarCollapsed ? "w-10 justify-center p-0 mx-auto" : "w-full justify-start px-3 gap-3"
            } ${
              activeTab === "settings"
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
              <span className="whitespace-nowrap overflow-hidden flex-1 text-left relative z-10 font-semibold animate-in fade-in duration-150">
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
                  src={selectedAccount.profile_pic || selectedAccount.profile_picture_url || selectedAccount.metadata?.profile_picture_url || selectedAccount.metadata?.profile_pic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(selectedAccount.page_name || "User") + "&background=6366f1&color=fff&size=150"}
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
