"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Camera, Mail, Shield, User, X } from "lucide-react";

export default function AccountSettingsModal({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || "User";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const provider = user?.app_metadata?.provider || "Email";
  const joinedDate = new Date(user?.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" 
            onClick={onClose} 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white w-full max-w-lg rounded-xl border border-zinc-200/80 flex flex-col max-h-[85vh] overflow-y-auto no-scrollbar z-10"
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-zinc-100 shrink-0">
              <div>
                <h3 className="text-xl font-semibold text-zinc-950 tracking-tight leading-none">Account Settings</h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 font-semibold mt-1.5">Manage your personal profile and identity.</p>
              </div>
              <button onClick={onClose} className="p-2 bg-zinc-50 border border-zinc-200/60 hover:bg-zinc-100 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-zinc-800">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0 no-scrollbar">
              {/* Profile Section */}
              <div className="flex flex-col sm:flex-row items-center gap-5 bg-zinc-50/50 p-5 rounded-xl border border-zinc-100">
                <div className="relative group shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-20 h-20 rounded-xl object-cover border-4 border-white" />
                  ) : (
                    <div className="w-20 h-20 bg-zinc-100 text-zinc-400 rounded-xl flex items-center justify-center border-4 border-white">
                      <User size={32} />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-zinc-950 text-white rounded-xl flex items-center justify-center border-2 border-white cursor-pointer hover:bg-zinc-800 transition-colors">
                    <Camera size={12} />
                  </div>
                </div>

                <div className="text-center sm:text-left flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-zinc-900 truncate tracking-tight">{fullName}</h4>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5 flex-wrap">
                    <span className="px-2 py-0.5 bg-[#6366F1]/10 text-[#6366F1] text-[10px] font-bold uppercase tracking-wider rounded-xl border border-[#6366F1]/20">
                      {provider} Verified
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">• Joined {joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded-xl border border-zinc-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-500 border border-zinc-200/60 shrink-0">
                    <Mail size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-sm font-semibold text-zinc-800 truncate mt-0.5">{user?.email}</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-zinc-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-500 border border-zinc-200/60 shrink-0">
                    <Shield size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Login Provider</p>
                    <p className="text-sm font-semibold text-zinc-800 truncate mt-0.5 capitalize">{provider}</p>
                  </div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="p-5 bg-indigo-50/50 rounded-xl border border-indigo-100/50 flex items-start gap-3.5">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-[#6366F1] border border-indigo-100 shrink-0">
                  <Calendar size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-900 leading-tight">Security Checkup</h4>
                  <p className="text-[11px] text-zinc-500 font-medium mt-1 leading-relaxed">
                    Your account is currently linked via {provider}. To change your primary email, please update your {provider} profile settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="px-6 py-5 bg-zinc-50/50 border-t border-zinc-100 flex justify-end gap-3 shrink-0">
              <button 
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl font-semibold text-xs hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Update Profile
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
