"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, UserCircle, Target, MessageCircle, Zap, ArrowRight, Camera, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

// Custom premium CSS-based confetti using Framer Motion
const Confetti = () => {
  const colors = ["#6366F1", "#EC4899", "#10B981", "#F59E0B", "#3B82F6", "#B4D3B2"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 50 }).map((_, i) => {
        const size = ((i * 7) % 10) + 6;
        const color = colors[i % colors.length];
        const delay = ((i * 11) % 15) / 10;
        const duration = ((i * 13) % 25) / 10 + 2;
        const xStart = (i * 19) % 100;
        const rotation = ((i * 29) % 720) - 360;
        
        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${xStart}%`, scale: 0, rotate: 0, opacity: 1 }}
            animate={{ 
              y: 700, 
              rotate: rotation,
              opacity: [1, 1, 0],
              scale: [0, 1, 1, 0.5]
            }}
            transition={{
              duration: duration,
              delay: delay,
              ease: "easeOut",
              repeat: Infinity
            }}
            className="absolute rounded-sm"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
            }}
          />
        );
      })}
    </div>
  );
};

export default function OnboardingModal({ isOpen, onClose, initialStep = 1, connectedAccount = null, user = null }) {
  const [step, setStep] = useState(initialStep);
  const [role, setRole] = useState(user?.user_metadata?.role || null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Sync step state when initialStep changes or modal is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setStep(initialStep), 0);
    }
  }, [isOpen, initialStep]);

  if (!isOpen) return null;

  const nextStep = async () => {
    // If transitioning from step 2 to step 3, we save onboarding as completed in DB
    if (step === 2) {
      try {
        const supabase = createClient();
        await supabase.auth.updateUser({
          data: { onboarding_completed: true, role: role }
        });
      } catch (e) {
        console.error("Failed to update user onboarding metadata:", e);
      }
    }
    setStep(prev => prev + 1);
  };

  const handleSkipOrClose = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: { onboarding_completed: true }
      });
    } catch (e) {
      console.error(e);
    }
    onClose();
  };

  const handleConnectClick = () => {
    setIsConnecting(true);
    // Determine the active role: priority to user's database role, fallback to current state, fallback to 'business'
    const activeRole = user?.user_metadata?.role || role || 'business';
    // Real redirect to Instagram Login for Business authorization endpoint
    setTimeout(() => {
      window.location.href = `/api/auth/connect?role=${activeRole}`;
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xl"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-border rounded-[40px] shadow-2xl overflow-hidden"
      >
        {/* Confetti shows up ONLY in Step 4 (Celebration) */}
        {step === 4 && <Confetti />}

        {/* Glow effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sage/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative p-8 md:p-12 z-10">
          <AnimatePresence mode="wait">
            {step !== 4 && (
              <motion.div 
                key="connect"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 text-center py-6"
              >
                {isConnecting ? (
                  <div className="flex flex-col items-center justify-center space-y-6 py-8">
                    <Loader2 size={64} className="text-[#6366F1] animate-spin" />
                    <div className="space-y-1">
                      <h3 className="text-2xl font-semibold text-foreground">Opening Facebook Login...</h3>
                      <p className="text-zinc-muted text-sm font-medium">Please do not close this window</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-[32px] mx-auto flex items-center justify-center shadow-2xl animate-pulse">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-12 h-12 text-white"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    
                    <div className="space-y-3">
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Connect with Facebook</h2>
                      <p className="text-zinc-muted font-medium text-lg max-w-sm mx-auto">
                        Link your Facebook account to grant Automixa access to manage your connected Instagram professional profiles.
                      </p>
                    </div>

                    <div className="pt-8 flex flex-col items-center gap-4">
                      <button 
                        onClick={handleConnectClick}
                        className="w-full sm:w-auto px-12 py-4 bg-[#1877F2] text-white rounded-xl text-sm font-bold shadow-[0_10px_40px_-10px_rgba(24,119,242,0.5)] hover:shadow-[0_10px_50px_-10px_rgba(24,119,242,0.7)] transition-all flex items-center justify-center gap-3 hover:scale-[1.02]"
                      >
                        Login with Facebook <ArrowRight size={20} />
                      </button>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        Secure connection via Official Meta API
                      </div>
                    </div>
                    
                    <div className="pt-6">
                      <button onClick={handleSkipOrClose} className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors underline underline-offset-4 font-medium">
                        Cancel, I'll do this later
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8 text-center py-8 z-20 relative"
              >
                {/* Glowing Success Checkmark */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
                  className="w-24 h-24 bg-emerald-500 text-white rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)]"
                >
                  <CheckCircle2 size={56} className="stroke-[2.5]" />
                </motion.div>

                <div className="space-y-3">
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                    Instagram Connected!
                  </h2>
                  <p className="text-zinc-muted font-medium text-lg max-w-md mx-auto">
                    Account <strong className="font-semibold text-foreground">@{connectedAccount?.username || "instagram"}</strong> has been successfully linked to Automixa.
                    {connectedAccount?.igBusinessId && (
                      <span className="block text-xs text-zinc-400 mt-2">Connected ID: {connectedAccount.igBusinessId}</span>
                    )}
                  </p>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={onClose}
                    className="px-12 py-4 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 hover:scale-[1.02] mx-auto"
                  >
                    Go to Dashboard <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
