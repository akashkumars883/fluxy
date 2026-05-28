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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
        className="relative w-full max-w-3xl bg-white border border-border rounded-[40px] shadow-2xl overflow-hidden"
      >
        {/* Confetti shows up ONLY in Step 4 (Celebration) */}
        {step === 4 && <Confetti />}

        {/* Glow effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative p-8 md:p-12 z-10">
          <AnimatePresence mode="wait">
            {step !== 4 && (
              <motion.div
                key="connect"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left py-4"
              >
                {isConnecting ? (
                  <div className="flex flex-col items-center justify-center space-y-6 py-8 w-full">
                    <Loader2 size={64} className="text-[#1877F2] animate-spin" />
                    <div className="space-y-1 text-center">
                      <h3 className="text-2xl font-semibold text-foreground">Opening Facebook Login...</h3>
                      <p className="text-zinc-muted text-sm font-medium">Please do not close this window</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="shrink-0 w-32 h-32 md:w-40 md:h-40 flex items-center justify-center overflow-hidden rounded-[32px]">
                      <img
                        src="/logo.png"
                        alt="Automixa Logo"
                        className="w-full h-full object-cover scale-110"
                      />
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="space-y-3">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Connect with Facebook</h2>
                        <p className="text-zinc-muted font-normal text-md">
                          Link your Facebook account to grant Automixa access to manage your connected Instagram professional profiles.
                        </p>
                      </div>

                      <div className="flex flex-col items-center md:items-start gap-3">
                        <button
                          onClick={handleConnectClick}
                          className="w-full sm:w-auto px-10 py-3.5 bg-[#1877F2] text-white rounded-xl text-sm font-bold shadow-[0_8px_30px_-8px_rgba(24,119,242,0.5)] hover:shadow-[0_10px_40px_-10px_rgba(24,119,242,0.7)] transition-all flex items-center justify-center gap-3 hover:scale-[1.02]"
                        >
                          Login with Facebook <ArrowRight size={20} />
                        </button>

                        <div className="flex flex-col gap-2 items-center md:items-start mt-1">
                          <div className="flex items-center gap-2 text-xs text-zinc-500 font-semibold px-3 py-2">
                            <svg className="w-4 h-4 text-[#0064E0] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
                            </svg>
                            Meta Verified Business Partner
                          </div>
                          <div className="text-[10px] text-zinc-400 font-medium px-2">
                            By continuing, you agree to our <a href="/terms" target="_blank" className="underline hover:text-zinc-600">Terms of Service</a> and <a href="/privacy" target="_blank" className="underline hover:text-zinc-600">Privacy Policy</a>.
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 md:pt-4">
                        <button onClick={handleSkipOrClose} className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors underline underline-offset-4 font-medium">
                          Cancel, I'll do this later
                        </button>
                      </div>
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
