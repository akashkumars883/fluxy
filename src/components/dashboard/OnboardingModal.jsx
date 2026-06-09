"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from '@/lib/supabase'; // adding this back since it's used
import * as logger from "@/lib/logger";

const COLORS = ["#6366F1", "#EC4899", "#10B981", "#F59E0B", "#3B82F6", "#EF4444", "#A855F7"];

// Generate confetti particles ONCE on mount (not during render) to avoid
// impure Math.random() calls during render. Re-rendering the component
// will reuse the same stable particle values.
const generateParticles = () => Array.from({ length: 80 }).map((_, i) => {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 320 + 60;
    const xDest = Math.cos(angle) * distance;
    const yDest = Math.sin(angle) * distance;
    const gravity = Math.random() * 150 + 150;
    const width = Math.random() * 6 + 10;
    const height = Math.random() * 4 + 5;
    const color = COLORS[i % COLORS.length];
    const delay = Math.random() * 0.2;
    const duration = Math.random() * 1.5 + 1.2;
    const rotation = Math.random() * 1080 - 540;

    return {
      id: i,
      xDest,
      yDest,
      yFinal: yDest + gravity,
      width,
      height,
      color,
      delay,
      duration,
      rotation,
    };
  });

// Custom premium CSS-based confetti using Framer Motion
const Confetti = () => {
  // useState initializer runs once on mount; subsequent re-renders reuse
  // the same stable particle values, keeping render pure.
  const [particles] = useState(generateParticles);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 0.1, 
            rotate: 0, 
            rotateX: 0, 
            rotateY: 0, 
            opacity: 1,
            left: "50%",
            top: "50%"
          }}
          animate={{
            x: p.xDest,
            // Array keyframes: shoots outward to yDest, then drifts down to yFinal
            y: [p.yDest, p.yFinal],
            scale: [0.1, 1, 1, 0.6],
            rotate: p.rotation,
            rotateX: p.rotation * 1.2,
            rotateY: p.rotation * 0.8,
            opacity: [1, 1, 0.7, 0]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
            repeat: 0 // play only once
          }}
          className="absolute"
          style={{
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            borderRadius: "1px", // rectangular paper cuts
            transformOrigin: "center"
          }}
        />
      ))}
    </div>
  );
};

export default function OnboardingModal({ isOpen, onClose, initialStep = 1, connectedAccount = null, user = null }) {
  const [step, setStep] = useState(initialStep);
  const role = user?.user_metadata?.role || null;
  const [isConnecting, setIsConnecting] = useState(false);

  // Sync step state when initialStep changes or modal is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setStep(initialStep), 0);
    }
  }, [isOpen, initialStep]);

  if (!isOpen) return null;

  const handleSkipOrClose = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: { onboarding_completed: true }
      });
    } catch (e) {
      logger.error("OnboardingModal: Failed to update user onboarding state ->", e);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xl"
      />

      {/* Confetti shows up ONLY in Step 4 (Celebration) */}
      {step === 4 && <Confetti />}

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl bg-white border border-border rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Glow effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative p-5 sm:p-6 md:p-8 z-10">
          <AnimatePresence mode="wait">
            {step !== 4 && (
              <motion.div
                key="connect"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3 sm:space-y-4 text-center py-1 sm:py-2"
              >
                {isConnecting ? (
                  <div className="flex flex-col items-center justify-center space-y-6 py-6 sm:py-8 w-full">
                    <Loader2 size={56} className="text-[#1877F2] animate-spin" />
                    <div className="space-y-1 text-center">
                      <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Opening Facebook Login...</h3>
                      <p className="text-zinc-muted text-xs sm:text-sm font-medium">Please do not close this window</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center overflow-hidden rounded-xl">
                      <img
                        src="/logo.png"
                        alt="Automixa Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Connect with Facebook</h2>
                      <p className="text-zinc-muted font-normal text-sm sm:text-base max-w-sm mx-auto px-2">
                        Log in with Facebook to link your Facebook Page and Instagram Professional account to Automixa.
                      </p>
                    </div>

                    <div className="pt-1 sm:pt-2 flex flex-col items-center gap-2">
                      <button
                        onClick={handleConnectClick}
                        className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-3.5 bg-[#1877F2] text-white rounded-xl text-sm font-bold shadow-[0_8px_30px_-8px_rgba(24,119,242,0.5)] hover:shadow-[0_10px_40px_-10px_rgba(24,119,242,0.7)] transition-all flex items-center justify-center gap-3 hover:scale-[1.02]"
                      >
                        Login with Facebook <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                      </button>

                      <div className="flex flex-col gap-1.5 sm:gap-2 items-center mt-1 sm:mt-2">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-zinc-500 font-semibold px-2 py-1">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E1306C] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
                          </svg>
                          Meta Verified Business Partner
                        </div>
                        <div className="text-[10px] text-zinc-400 font-medium px-2 sm:mt-1">
                          By continuing, you agree to our <a href="/terms" target="_blank" className="underline hover:text-zinc-600">Terms of Service</a> and <a href="/privacy" target="_blank" className="underline hover:text-zinc-600">Privacy Policy</a>.
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 sm:pt-2">
                      <button onClick={handleSkipOrClose} className="text-xs sm:text-sm text-zinc-400 hover:text-zinc-700 transition-colors underline underline-offset-4 font-medium">
                        Cancel, I&apos;ll do this later
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
                className="space-y-5 sm:space-y-6 text-center py-2 sm:py-6 z-20 relative"
              >
                {/* Connected Account Profile Picture / Avatar */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
                  className="relative w-24 h-24 mx-auto"
                >
                  <div className="w-full h-full rounded-full overflow-hidden border-[4px] border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] bg-zinc-50 flex items-center justify-center">
                    <img
                      src={connectedAccount?.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(connectedAccount?.username || "User")}&background=6366f1&color=fff&size=150`}
                      alt={connectedAccount?.username || "Connected Account"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(connectedAccount?.username || "User")}&background=6366f1&color=fff&size=150`;
                      }}
                    />
                  </div>
                  {/* Small Success Badge */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-md">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </motion.div>

                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Instagram Connected!
                  </h2>
                  <p className="text-zinc-muted font-normal text-sm sm:text-base max-w-sm mx-auto px-2">
                    Account <strong className="font-semibold text-foreground">@{connectedAccount?.username || "instagram"}</strong> has been successfully linked to Automixa.
                    {connectedAccount?.igBusinessId && (
                      <span className="block text-[10px] sm:text-xs text-zinc-400 mt-1.5 sm:mt-2">Connected ID: {connectedAccount.igBusinessId}</span>
                    )}
                  </p>
                </div>

                <div className="pt-4 sm:pt-6">
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-4 bg-[#6366F1] text-white rounded-xl text-sm font-bold shadow-[0_8px_30px_-8px_rgba(99,102,241,0.5)] hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.7)] transition-all flex items-center justify-center gap-3 hover:scale-[1.02] mx-auto"
                  >
                    Go to Dashboard <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
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
