"use client";

import React, { useState } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lock as LucideLock, PanelLeftClose, PanelLeftOpen, Plus, Zap, ChevronRight, Link2, AlignLeft, Palette, ArrowLeft, BarChart2 } from "lucide-react";

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
    smartBioTab,
    setSmartBioTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    selectedAccount,
    setSelectedAccount,
    accounts
  } = useDashboard();

  const [isSwitchAccountOpen, setIsSwitchAccountOpen] = useState(false);

  const mainNavItems = navigationItems.filter(item => item.id !== "settings");
  const settingsItem = navigationItems.find(item => item.id === "settings");

  const getQuotaColor = () => {
    if (quotaPercent >= 90) return { bar: "from-rose-500 to-red-400", text: "text-rose-500", track: "bg-rose-100" };
    if (quotaPercent >= 70) return { bar: "from-amber-500 to-orange-400", text: "text-amber-500", track: "bg-amber-100" };
    return { bar: "from-indigo-500 to-violet-400", text: "text-indigo-500", track: "bg-indigo-100" };
  };

  const quotaColors = getQuotaColor();

  const NavButton = ({ item }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    const handleClick = () => {
      if (item.locked) onPricingClick();
      else setActiveTab(item.id);
    };

    return (
      <button
        key={item.id}
        onClick={handleClick}
        className={`group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 h-10
          ${isSidebarCollapsed ? "justify-center mx-auto w-10 p-0" : "justify-start w-full px-3 gap-3"}
          ${isActive
            ? "text-indigo-600"
            : item.locked
              ? "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500"
              : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/80"
          }`}
        title={isSidebarCollapsed ? item.label : ""}
      >
        {isActive && (
          <motion.div
            layout
            layoutId="sidebarActiveTabDesktop"
            className="absolute inset-0 bg-indigo-50 border border-indigo-100 rounded-xl z-0"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}

        <div className="flex items-center justify-center shrink-0 relative z-10">
          <Icon
            size={17}
            strokeWidth={isActive ? 2.2 : 1.7}
            className={!isActive && !item.locked ? "group-hover:scale-110 transition-transform duration-200" : ""}
          />
        </div>

        {/* Collapsed Tooltip */}
        {isSidebarCollapsed && (
          <div className="absolute left-full ml-3 px-3 py-1.5 bg-zinc-900 text-white text-[11px] font-semibold rounded-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 flex items-center gap-2 shadow-xl">
            {item.label}
            {item.locked && <LucideLock size={9} className="text-zinc-400" />}
            <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 border-[5px] border-transparent border-r-zinc-900" />
          </div>
        )}

        {!isSidebarCollapsed && (
          <span className="whitespace-nowrap overflow-hidden flex-1 text-left relative z-10 font-medium animate-in fade-in duration-150">
            {item.label}
          </span>
        )}

        {!isSidebarCollapsed && item.locked && (
          <div className="flex items-center justify-center w-4 h-4 bg-zinc-100 rounded-md relative z-10 shrink-0">
            <LucideLock size={8} className="text-zinc-400 shrink-0" />
          </div>
        )}
      </button>
    );
  };

  return (
    <aside className={`hidden md:flex flex-col select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-30 shrink-0 h-[calc(100vh-20px)] sticky top-2.5 overflow-visible rounded-2xl ml-3 bg-white border border-zinc-200/70 shadow-sm
      ${isSidebarCollapsed
        ? "w-[68px] py-4 px-3"
        : "w-[228px] p-4"
      }`}
    >

      {/* Top Section */}
      <div className="space-y-1 w-full">

        {/* Header - Logo + Collapse */}
        <div
          className={`group/logo relative flex items-center cursor-pointer shrink-0 mb-5 ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}
          onClick={() => window.location.href = '/?home=true'}
        >
          <div className={`flex items-center gap-2.5 ${isSidebarCollapsed ? "justify-center" : ""}`}>
            <div className="relative shrink-0">
              <img
                src="/logo.png"
                alt="Automixa Logo"
                className="w-7 h-7 object-contain transition-all duration-300 group-hover/logo:scale-105"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            {!isSidebarCollapsed && (
              <h2 className="text-base font-bold tracking-tight text-zinc-900 truncate animate-in fade-in duration-200">
                automixa
              </h2>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }}
            className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 p-1.5 shrink-0
              ${isSidebarCollapsed ? "absolute left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover/logo:opacity-100 group-hover/logo:pointer-events-auto" : "opacity-100"}`}
            title="Toggle Sidebar"
          >
            {isSidebarCollapsed
              ? <PanelLeftOpen size={15} strokeWidth={1.8} />
              : <PanelLeftClose size={15} strokeWidth={1.8} />
            }
          </button>
        </div>

        {/* Separator */}
        <div className="h-px bg-zinc-100 mb-4" />

        {/* Nav Items */}
        {activeTab === "smart_bio" ? (
          <div className="space-y-0.5 animate-in slide-in-from-right-4 duration-300">
            <button
              onClick={() => setActiveTab("home")}
              className={`group flex items-center rounded-xl text-sm font-bold text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/80 transition-all duration-200 h-10 mb-4
                ${isSidebarCollapsed ? "justify-center mx-auto w-10 p-0" : "justify-start w-full px-3 gap-3"}`}
              title={isSidebarCollapsed ? "Back to Main Menu" : ""}
            >
              <div className="flex items-center justify-center shrink-0">
                <ArrowLeft size={16} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              {!isSidebarCollapsed && <span>Main Menu</span>}
            </button>

            {[
              { id: "analytics", label: "Analytics", icon: BarChart2 },
              { id: "links", label: "Links", icon: Link2 },
              { id: "profile", label: "Profile", icon: AlignLeft },
              { id: "theme", label: "Theme", icon: Palette },
            ].map((item) => {
              const isActive = smartBioTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setSmartBioTab(item.id)}
                  className={`group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 h-10
                    ${isSidebarCollapsed ? "justify-center mx-auto w-10 p-0" : "justify-start w-full px-3 gap-3"}
                    ${isActive ? "text-indigo-600" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/80"}`}
                  title={isSidebarCollapsed ? item.label : ""}
                >
                  {isActive && (
                    <motion.div
                      layout
                      layoutId="sidebarActiveTabSmartBio"
                      className="absolute inset-0 bg-indigo-50 border border-indigo-100 rounded-xl z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <div className="flex items-center justify-center shrink-0 relative z-10">
                    <Icon size={17} strokeWidth={isActive ? 2.2 : 1.7} className={!isActive ? "group-hover:scale-110 transition-transform duration-200" : ""} />
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="whitespace-nowrap overflow-hidden flex-1 text-left relative z-10 font-medium">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <>
            <div className="space-y-0.5 animate-in slide-in-from-left-4 duration-300">
              {mainNavItems.map((item) => (
                <NavButton key={item.id} item={item} />
              ))}
            </div>

            {/* Settings Item */}
            {settingsItem && (
              <>
                <div className="h-px bg-zinc-100 my-3" />
                <NavButton item={settingsItem} />
              </>
            )}
          </>
        )}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto space-y-3 w-full">

        {/* Quota Widget */}
        {isSidebarCollapsed ? (
          <div className="relative flex items-center justify-center w-10 h-10 mx-auto group cursor-pointer" title={`Usage: ${quotaPercent}%`}>
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="15" className="stroke-zinc-100 fill-none" strokeWidth="2.5" />
              <circle
                cx="20" cy="20" r="15"
                className={`fill-none transition-all duration-700 ${quotaPercent >= 90 ? "stroke-rose-500" : quotaPercent >= 70 ? "stroke-amber-500" : "stroke-indigo-500"}`}
                strokeWidth="2.5"
                strokeDasharray="94.2"
                strokeDashoffset={94.2 - (quotaPercent / 100) * 94.2}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap size={11} className={quotaColors.text} fill="currentColor" />
            </div>
            <div className="absolute left-full ml-3 px-3 py-2 bg-zinc-900 text-white text-[10px] font-semibold rounded-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-200 whitespace-nowrap z-[100] flex flex-col items-start gap-0.5 shadow-xl">
              <span className="font-bold">Quota Usage</span>
              <span className="text-zinc-400">{usedQuota.toLocaleString()} / {maxQuota.toLocaleString()}</span>
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 border-[5px] border-transparent border-r-zinc-900" />
            </div>
          </div>
        ) : (
          <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <Zap size={11} className={quotaColors.text} />
                Quota
              </span>
              <span className={`text-[10px] font-bold ${quotaColors.text}`}>{quotaPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${quotaColors.bar} rounded-full transition-all duration-700`}
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
            <p className="text-[9px] font-medium text-zinc-400">
              {usedQuota.toLocaleString()} / {maxQuota.toLocaleString()} replies
            </p>
          </div>
        )}

        {/* Account Switcher */}
        {selectedAccount && (
          <div className={`relative ${isSidebarCollapsed ? "" : "border-t border-zinc-100 pt-3"}`}>
            <button
              onClick={() => setIsSwitchAccountOpen(!isSwitchAccountOpen)}
              className={`w-full flex items-center rounded-xl transition-all duration-200 hover:bg-zinc-50 group
                ${isSidebarCollapsed ? "justify-center p-1.5 w-10 h-10 mx-auto" : "justify-between p-2 gap-2.5"}`}
              title={isSidebarCollapsed ? `@${selectedAccount.ig_username || selectedAccount.page_name || "Switch"}` : ""}
            >
              <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={selectedAccount.profile_pic || selectedAccount.profile_picture_url || selectedAccount.metadata?.profile_picture_url || selectedAccount.metadata?.profile_pic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(selectedAccount.page_name || "User") + "&background=6366f1&color=fff&size=150"}
                    alt={selectedAccount.ig_username || selectedAccount.page_name}
                    className="w-8 h-8 rounded-xl object-cover shrink-0 ring-1 ring-zinc-200"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
                </div>
                {!isSidebarCollapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-0.5">Active</p>
                    <p className="text-xs font-semibold text-zinc-800 truncate">
                      @{selectedAccount.ig_username || selectedAccount.name || selectedAccount.page_name || "automixa_user"}
                    </p>
                  </div>
                )}
              </div>
              {!isSidebarCollapsed && (
                <ChevronDown
                  size={13}
                  className={`text-zinc-400 shrink-0 transition-all duration-300 ${isSwitchAccountOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {/* Account Switcher Dropdown */}
            <AnimatePresence>
              {isSwitchAccountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={`absolute bottom-full mb-2 bg-white border border-zinc-200 rounded-xl p-2 z-50 shadow-xl shadow-zinc-200/60
                    ${isSidebarCollapsed ? "left-1/2 -translate-x-1/2 w-64" : "left-0 w-full"}`}
                >
                  <div className="px-2 py-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Switch Account</div>
                  <div className="space-y-0.5 max-h-44 overflow-y-auto no-scrollbar">
                    {accounts.map(acc => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          setSelectedAccount(acc);
                          setIsSwitchAccountOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-medium transition-all
                          ${selectedAccount.id === acc.id
                            ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                            : "hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 border border-transparent"
                          }`}
                      >
                        <img
                          src={acc.profile_pic || acc.profile_picture_url || acc.metadata?.profile_picture_url || acc.metadata?.profile_pic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(acc.page_name || "User") + "&background=6366f1&color=fff&size=150"}
                          alt={acc.ig_username || acc.page_name}
                          className="w-6 h-6 rounded-lg object-cover shrink-0 ring-1 ring-zinc-200"
                        />
                        <span className="truncate flex-1 text-left">@{acc.ig_username || acc.name || acc.page_name || "automixa_user"}</span>
                        {selectedAccount.id === acc.id && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0" />}
                      </button>
                    ))}
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-zinc-100">
                    <button
                      onClick={() => {
                        setIsSwitchAccountOpen(false);
                        onConnectClick();
                      }}
                      className="w-full flex items-center gap-2 p-2.5 hover:bg-zinc-50 rounded-lg text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-all"
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
    </aside>
  );
});