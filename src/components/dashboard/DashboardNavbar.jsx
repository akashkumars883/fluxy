"use client";

import { HelpCircle, Search, Users, BarChart2, Settings } from "lucide-react";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import { useDashboard } from "@/context/DashboardContext";
import WorkspaceSwitcher from "@/components/dashboard/WorkspaceSwitcher";

export default function DashboardNavbar({ isScrolled, onHelpClick, accounts, realtimeStats, onAccountSettingsClick, onSubscriptionClick, onMenuClick }) {
  const { user, setActiveTab, isSidebarCollapsed } = useDashboard();

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 border-b px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shrink-0 ${isScrolled
        ? "bg-white/90 backdrop-blur-md border-zinc-200 shadow-sm"
        : "bg-white border-transparent shadow-none"
      }`}>
      <div className="flex items-center gap-1.5 sm:gap-3 overflow-hidden">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.location.href = '/?home=true'}>
          <img
            src="/logo.png"
            alt="Automixa Logo"
            className="w-8 h-8 object-contain transition-all duration-300 shrink-0 group-hover:scale-110"
          />
          {!isSidebarCollapsed && (
            <h2 className="text-xl font-semibold tracking-normal text-zinc-900 truncate animate-in fade-in duration-200">
              automixa
            </h2>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="hidden lg:flex items-center w-64 mr-2">
          <div className="relative w-full group cursor-pointer" onClick={onMenuClick}>
            <div className="w-full bg-zinc-50/80 hover:bg-white backdrop-blur-xl border border-zinc-200 hover:border-zinc-300 rounded-[14px] pl-10 pr-12 py-2 text-[13px] font-medium text-zinc-400 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-sm flex items-center h-[38px] group-hover:ring-4 group-hover:ring-zinc-50">
              Search Automixa...
            </div>
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none group-hover:text-[#6366F1] transition-colors z-10">
              <Search size={16} strokeWidth={2} />
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center gap-0.5 px-2 py-0.5 rounded-[6px] bg-white border border-zinc-200 text-[10px] font-semibold text-zinc-500 pointer-events-none transition-all shadow-sm group-hover:bg-zinc-50">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
        </div>

        <div className="hidden md:block mr-1">
          <WorkspaceSwitcher variant="minimal" onUpgradeClick={onSubscriptionClick} />
        </div>

        <NotificationDropdown accounts={accounts} />

        <div className="h-5 w-[1px] bg-zinc-200 hidden xs:block" />

        <ProfileDropdown
          user={user}
          realtimeStats={realtimeStats}
          setActiveTab={setActiveTab}
          onAccountSettingsClick={onAccountSettingsClick}
          onSubscriptionClick={onSubscriptionClick}
        />
      </div>
    </nav>
  );
}