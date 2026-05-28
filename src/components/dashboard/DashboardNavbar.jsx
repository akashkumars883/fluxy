"use client";

import { HelpCircle, Search, X, Clock, Zap, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import { useDashboard } from "@/context/DashboardContext";
import WorkspaceSwitcher from "@/components/dashboard/WorkspaceSwitcher";


export default function DashboardNavbar({ isScrolled, onHelpClick, accounts, realtimeStats, onAccountSettingsClick, onSubscriptionClick }) {
  const { user, setActiveTab } = useDashboard();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl+K or Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyK') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
        return;
      }
      
      // Close on Escape
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  const recentSearches = [
    "Instagram Campaign 2024",
    "Story Auto-Reply Setup",
    "Lead Gen Analytics"
  ];

  const quickActions = [
    { name: "Create New Campaign", icon: Zap, tab: "automations" },
    { name: "View CRM", icon: Zap, tab: "audience" },
    { name: "Settings", icon: Zap, tab: "settings" }
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 border-b px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shrink-0 ${
      isScrolled 
        ? "bg-white/90 backdrop-blur-md border-zinc-200 shadow-sm" 
        : "bg-white border-transparent shadow-none"
    }`}>
      <div className="flex items-center gap-1.5 sm:gap-3 overflow-hidden">
        {/* Mobile menu button removed from here as it's now in BottomNav */}
        
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.location.href = '/?home=true'}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden rounded-[10px] shrink-0">
            <img src="/logo.png" alt="Automixa Logo" className="w-full h-full object-cover scale-110" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 truncate">
            automixa
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="hidden lg:flex items-center w-64 mr-2">
          <div className="relative w-full group cursor-pointer" onClick={() => setIsSearchOpen(true)}>
            <div className="w-full bg-zinc-100/50 hover:bg-zinc-100/80 backdrop-blur-xl border border-zinc-200/50 rounded-2xl pl-10 pr-10 py-2.5 text-xs font-medium text-zinc-400 transition-all duration-300 shadow-inner flex items-center">
              Search...
            </div>
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none group-hover:text-[#6366F1] transition-colors z-10">
              <Search size={14} strokeWidth={2.5} />
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-zinc-200 text-[10px] font-bold text-zinc-400 pointer-events-none transition-opacity">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Workspace Switcher next to search bar on the right */}
        <div className="hidden md:block mr-1">
          <WorkspaceSwitcher variant="minimal" />
        </div>


        <button 
          onClick={onHelpClick}
          className="p-1.5 sm:p-2 text-zinc-600 hover:text-zinc-950 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-semibold shrink-0"
        >
          <HelpCircle size={20} /> 
          <span className="hidden md:inline">Help</span>
        </button>
        
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

      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-zinc-200/60 overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center gap-4">
                <Search className="text-[#6366F1]" size={24} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search campaigns, users, or automation logs..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-zinc-900 placeholder:text-zinc-400"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {searchQuery.length === 0 ? (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-[10px] font-semibold text-zinc-400 mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {quickActions.map((action, i) => (
                          <button 
                            key={i}
                            onClick={() => {
                              setActiveTab(action.tab);
                              setIsSearchOpen(false);
                            }}
                            className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-[#6366F1]/30 hover:bg-[#6366F1]/5 transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-[#6366F1]">
                                <action.icon size={18} />
                              </div>
                              <span className="text-sm font-semibold text-zinc-700 group-hover:text-zinc-900">{action.name}</span>
                            </div>
                            <ArrowRight size={16} className="text-zinc-300 group-hover:text-[#6366F1] transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-semibold text-zinc-400 mb-4">Recent Searches</h3>
                      <div className="space-y-2">
                        {recentSearches.map((search, i) => (
                          <button 
                            key={i}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors text-sm text-zinc-600 group"
                          >
                            <Clock size={16} className="text-zinc-300 group-hover:text-zinc-500" />
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="text-zinc-300" size={32} />
                    </div>
                    <h3 className="text-zinc-900 font-semibold mb-1">{`No results for "${searchQuery}"`}</h3>
                    <p className="text-sm text-zinc-500">Try searching for campaigns, keywords, or account settings.</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                    <span className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded shadow-sm text-zinc-500 font-bold">ESC</span>
                    <span>to close</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                    <span className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded shadow-sm text-zinc-500 font-bold">↵</span>
                    <span>to select</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-zinc-300">Automixa Search v1.0</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
