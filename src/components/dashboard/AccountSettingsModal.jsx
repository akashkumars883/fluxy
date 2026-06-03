"use client";

import { AnimatePresence,motion } from "framer-motion";
import { Calendar,Camera,Mail,Shield,User,X } from "lucide-react";

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xl" 
            onClick={onClose} 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[85vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-[#6366F1]/10 text-[#6366F1] rounded-xl flex items-center justify-center shadow-sm">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tighter">Account Settings</h3>
                  <p className="text-sm text-zinc-500 font-normal mt-0.5">Manage your personal profile and identity.</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-zinc-200/50 rounded-xl transition-all cursor-pointer">
                <X size={20} className="text-zinc-400" />
              </button>
            </div>

            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto flex-1 min-h-0 no-scrollbar">
              {/* Profile Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-xl" />
                  ) : (
                    <div className="w-24 h-24 bg-zinc-100 text-zinc-400 rounded-xl flex items-center justify-center border-4 border-white shadow-xl">
                      <User size={40} />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-zinc-900 text-white rounded-xl flex items-center justify-center border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                    <Camera size={14} />
                  </div>
                </div>

                <div className="text-center sm:text-left flex-1 min-w-0">
                  <h4 className="text-2xl font-semibold text-zinc-900 truncate tracking-tight">{fullName}</h4>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5">
                    <span className="px-2.5 py-0.5 bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold uppercase tracking-wider rounded-xl border border-[#6366F1]/20">
                      {provider} Verified
                    </span>
                    <span className="text-sm text-zinc-400 font-medium">• Joined {joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-100 flex items-start gap-3.5">
                  <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-zinc-400 shadow-sm border border-zinc-100 shrink-0">
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-base font-semibold text-zinc-800 truncate mt-0.5">{user?.email}</p>
                  </div>
                </div>

                <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-100 flex items-start gap-3.5">
                  <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-zinc-400 shadow-sm border border-zinc-100 shrink-0">
                    <Shield size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Login Provider</p>
                    <p className="text-base font-semibold text-zinc-800 truncate mt-0.5 capitalize">{provider}</p>
                  </div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="p-6 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-100 shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-zinc-900 leading-tight">Security Checkup</h4>
                  <p className="text-sm text-zinc-600 font-normal mt-1 leading-relaxed">
                    Your account is currently linked via {provider}. To change your primary email, please update your {provider} profile settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="px-5 sm:px-8 py-4 sm:py-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3 shrink-0 rounded-b-xl">
              <button 
                onClick={onClose}
                className="px-6 py-3 text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-all cursor-pointer"
              >
                Close
              </button>
              <button 
                className="px-8 py-3 bg-zinc-950 text-white rounded-xl font-semibold text-sm shadow-xl hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
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
