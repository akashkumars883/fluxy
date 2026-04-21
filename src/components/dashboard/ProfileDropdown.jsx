"use client";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function ProfileDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 pr-4 bg-zinc-100/50 hover:bg-zinc-100 border border-zinc-200/50 rounded-full transition-all group"
      >
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-zinc-600 shadow-sm border border-zinc-200 transition-colors group-hover:border-zinc-300">
          <User size={18} />
        </div>
        <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-60 bg-white border border-zinc-200 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
          <div className="px-4 py-3 border-b border-zinc-100">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Active Session</p>
            <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
          </div>
          <div className="p-1">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-colors group"
            >
              <div className="p-1.5 bg-red-100/50 rounded-lg group-hover:bg-red-100 transition-colors">
                <LogOut size={14} />
              </div>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
