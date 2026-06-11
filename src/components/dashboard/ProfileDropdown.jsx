"use client";
import { useDashboard } from "@/context/DashboardContext";
import { createClient } from "@/lib/supabase";
import { CreditCard,LogOut,Settings,User,Zap } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default React.memo(function ProfileDropdown({ user, realtimeStats, onAccountSettingsClick, onSubscriptionClick }) {
  const { currentPlan } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const usedReplies = realtimeStats?.totalDms + realtimeStats?.autoReplies || 0;
  const totalReplies = currentPlan === "free" ? 1000 : currentPlan === "creator_pro" ? 15000 : 50000;
  const usagePercentage = Math.min(Math.round((usedReplies / totalReplies) * 100), 100);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayNameForTrigger = user?.user_metadata?.full_name || user?.user_metadata?.name || "Profile";
  const fullNameForDropdown = user?.user_metadata?.full_name || user?.user_metadata?.name || "User Profile";
  const firstLetter = fullNameForDropdown ? (typeof fullNameForDropdown === 'string' ? fullNameForDropdown.charAt(0).toUpperCase() : "U") : "U";

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-0.5 bg-white/60 hover:bg-white border border-zinc-200/80 rounded-full transition-all group shrink-0 shadow-sm hover:border-[#6366F1]"
      >
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={displayNameForTrigger} 
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover shadow-sm border border-zinc-100"
          />
        ) : (
          <div className="w-8 h-8 bg-[#6366F1]/10 text-[#6366F1] rounded-full flex items-center justify-center font-semibold text-sm shadow-sm border border-zinc-100">
            {firstLetter || <User size={16} />}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="fixed sm:absolute left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 right-auto sm:right-0 top-[64px] sm:top-auto sm:mt-2 w-[calc(100vw-32px)] sm:w-[320px] bg-white border border-zinc-200/80 rounded-2xl py-1 z-[999] animate-in fade-in zoom-in-95 duration-200">
          
          <div className="px-4 py-3 border-b border-zinc-200/50 flex items-center gap-3">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={fullNameForDropdown} 
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-zinc-100 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 bg-[#6366F1]/10 text-[#6366F1] rounded-full flex items-center justify-center font-semibold text-base border border-zinc-200 shrink-0">
                {firstLetter || <User size={18} />}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-semibold text-zinc-900 truncate tracking-tight leading-tight">{fullNameForDropdown}</h4>
              <p className="text-xs text-zinc-500 font-normal truncate mt-0.5">{user?.email}</p>
            </div>
          </div>


          <div className="p-2 space-y-1 border-b border-zinc-200/50">
            {[
              { label: "Account Settings", icon: Settings, desc: "Personal information", action: () => onAccountSettingsClick() },
              { label: "Billing & Plans", icon: CreditCard, desc: "Manage subscription & invoices", action: () => onSubscriptionClick() }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => { setIsOpen(false); item.action(); }}
                className="w-full flex items-start gap-3 p-2.5 rounded-2xl hover:bg-zinc-50 text-left transition-all group border border-transparent"
              >
                <div className="p-2 bg-zinc-100 text-zinc-600 rounded-xl group-hover:bg-[#6366F1]/10 group-hover:text-[#6366F1] transition-colors shrink-0">
                  <item.icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs sm:text-sm font-semibold text-zinc-900 transition-colors leading-normal tracking-tight">{item.label}</h5>
                  <p className="text-xs text-zinc-500 font-normal truncate leading-tight mt-0.5">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-2.5 text-xs sm:text-sm text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-sm font-semibold transition-all group"
            >
              <div className="p-2 bg-rose-100/50 text-rose-600 rounded-xl group-hover:bg-rose-100 transition-colors shrink-0">
                <LogOut size={16} />
              </div>
              Sign Out
            </button>
          </div>

        </div>
      )}
    </div>
  );
});
