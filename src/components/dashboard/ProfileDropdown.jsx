"use client";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown, Settings, CreditCard, HelpCircle, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useDashboard } from "@/context/DashboardContext";

export default function ProfileDropdown({ user, realtimeStats, setActiveTab, onAccountSettingsClick, onSubscriptionClick }) {
  const { currentPlan } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const usedReplies = realtimeStats?.totalDms + realtimeStats?.autoReplies || 0;
  const totalReplies = currentPlan === "free" ? 1000 : currentPlan === "creator_pro" ? 100000 : 1000000;
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
        <div className="absolute right-[-8px] xs:right-0 mt-3 w-[calc(100vw-2rem)] xs:w-[360px] sm:w-[380px] bg-white border border-zinc-200 rounded-[28px] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          
          <div className="px-5 py-4 border-b border-zinc-200/50 flex items-center gap-3">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={fullNameForDropdown} 
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-zinc-100 shrink-0 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 bg-[#6366F1]/10 text-[#6366F1] rounded-full flex items-center justify-center font-semibold text-base border border-zinc-200 shrink-0 shadow-sm">
                {firstLetter || <User size={18} />}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-semibold text-zinc-900 truncate tracking-tight leading-tight">{fullNameForDropdown}</h4>
              <p className="text-xs text-zinc-500 font-normal truncate mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="px-5 py-4 bg-zinc-50/80 border-b border-zinc-200/50">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 capitalize mb-2">
              <span className="flex items-center gap-1.5"><Zap size={14} className="text-[#6366F1] fill-[#6366F1]/10" /> Monthly Usage</span>
              <span className="text-zinc-900 font-semibold">{usagePercentage}%</span>
            </div>
            
            <div className="w-full h-2.5 bg-zinc-100 border border-zinc-200/50 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-[#6366F1] rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-3 text-xs font-semibold text-zinc-500">
              <span>Plan Limits</span>
              <span className="text-zinc-900 font-semibold">{usedReplies} / {totalReplies} Replies</span>
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
                className="w-full flex items-start gap-3 p-3 rounded-2xl hover:bg-white text-left transition-all shadow-sm group border border-transparent hover:border-zinc-200/60"
              >
                <div className="p-2.5 bg-zinc-100 text-zinc-600 rounded-xl group-hover:bg-[#6366F1]/10 group-hover:text-[#6366F1] transition-colors shrink-0 shadow-sm">
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
              className="w-full flex items-center gap-3 p-3 text-xs sm:text-sm text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-2xl font-semibold transition-all shadow-sm group"
            >
              <div className="p-2.5 bg-rose-100/50 text-rose-600 rounded-xl group-hover:bg-rose-100 transition-colors shrink-0 shadow-sm">
                <LogOut size={16} />
              </div>
              Sign Out
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
