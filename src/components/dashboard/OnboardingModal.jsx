"use client";

import { useState } from "react";
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
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-border rounded-[40px] shadow-2xl overflow-hidden"
      >
        {/* Confetti shows up ONLY in Step 4 (Celebration) */}
        {step === 4 && <Confetti />}

        {/* Glow effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sage/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative p-8 md:p-12 z-10">
          
          {/* Progress Bar (Hide on celebration step) */}
          {step <= 3 && (
            <div className="flex gap-2 mb-10">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`h-2 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-sage' : 'bg-background'}`} 
                />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Welcome to Automixa</h2>
                  <p className="text-zinc-muted font-medium text-lg">First, tell us who you are so we can customize your experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => { setRole('business'); nextStep(); }}
                    className="group relative bg-background border border-border hover:border-sage hover:shadow-lg rounded-[32px] p-6 text-left transition-all duration-300"
                  >
                    <div className="w-14 h-14 bg-white border border-border text-foreground rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-sage group-hover:text-white group-hover:border-sage transition-all shadow-sm">
                      <Building2 size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Business Owner</h3>
                    <p className="text-sm text-zinc-muted font-medium">I want to automate sales, leads, and customer support.</p>
                  </button>

                  <button 
                    onClick={() => { setRole('content_creator'); nextStep(); }}
                    className="group relative bg-background border border-border hover:border-sage hover:shadow-lg rounded-[32px] p-6 text-left transition-all duration-300"
                  >
                    <div className="w-14 h-14 bg-white border border-border text-foreground rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-sage group-hover:text-white group-hover:border-sage transition-all shadow-sm">
                      <UserCircle size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Content Creator</h3>
                    <p className="text-sm text-zinc-muted font-medium">I want to manage fan engagement and DMs automatically.</p>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">What is your main goal?</h2>
                  <p className="text-zinc-muted font-medium text-lg">We will set up templates based on what you want to achieve.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'leads', icon: Target, title: 'Generate More Leads', desc: 'Collect emails & phone numbers automatically.' },
                    { id: 'support', icon: MessageCircle, title: 'Customer Support', desc: 'Answer FAQs instantly 24/7.' },
                    { id: 'engagement', icon: Zap, title: 'Boost Engagement', desc: 'Auto-reply to comments & story mentions.' }
                  ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={nextStep}
                      className="w-full flex items-center gap-5 bg-background border border-border hover:border-sage hover:shadow-md rounded-[24px] p-5 transition-all duration-300 group text-left"
                    >
                      <div className="w-14 h-14 bg-white border border-border text-foreground rounded-xl flex items-center justify-center group-hover:bg-sage group-hover:text-white group-hover:border-sage transition-colors shrink-0 shadow-sm">
                        <item.icon size={24} />
                      </div>
                      <div>
                        <h4 className="text-foreground font-semibold text-lg leading-tight mb-1">{item.title}</h4>
                        <p className="text-sm text-zinc-muted font-medium">{item.desc}</p>
                      </div>
                      <ArrowRight size={20} className="ml-auto text-zinc-muted/30 group-hover:text-sage group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 text-center py-6"
              >
                {isConnecting ? (
                  <div className="flex flex-col items-center justify-center space-y-6 py-8">
                    <Loader2 size={64} className="text-sage animate-spin" />
                    <div className="space-y-1">
                      <h3 className="text-2xl font-semibold text-foreground">Opening Instagram...</h3>
                      <p className="text-zinc-muted text-sm font-medium">Please do not close this window</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-[32px] mx-auto flex items-center justify-center shadow-xl animate-pulse">
                      <Camera size={48} className="text-white" />
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Last Step: Connect Instagram</h2>
                      <p className="text-zinc-muted font-medium text-lg max-w-md mx-auto">
                        To start automating your DMs and comments, link your Instagram Business or Creator account.
                      </p>
                    </div>

                    <div className="pt-6 flex flex-col items-center gap-4">
                      <button 
                        onClick={handleConnectClick}
                        className="px-12 py-4 bg-[#6366F1] text-white rounded-xl text-[12px] font-semibold shadow-2xl hover:bg-[#5255e0] transition-all flex items-center justify-center gap-3 hover:scale-[1.02]"
                      >
                        Connect Instagram <ArrowRight size={20} />
                      </button>
                      <p className="text-xs text-zinc-muted font-medium">Secure connection via Instagram Business Login.</p>
                    </div>
                    
                    <div className="pt-2">
                      <button onClick={handleSkipOrClose} className="text-sm text-zinc-muted hover:text-foreground transition-colors underline underline-offset-4 font-medium">
                        Skip for now, explore dashboard
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
                  className="w-24 h-24 bg-green-500 text-white rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)]"
                >
                  <CheckCircle2 size={56} className="stroke-[2.5]" />
                </motion.div>

                <div className="space-y-3">
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                    Instagram Connected
                  </h2>
                  <p className="text-zinc-muted font-medium text-lg max-w-md mx-auto">
                    Account <strong className="font-semibold text-foreground">@{connectedAccount?.username || "instagram"}</strong> has been successfully linked to Automixa.
                    {connectedAccount?.igBusinessId && (
                      <span className="block text-xs text-zinc-muted mt-2">Connected ID: {connectedAccount.igBusinessId}</span>
                    )}
                  </p>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={onClose}
                    className="px-12 py-4 bg-[#6366F1] text-white rounded-xl text-[12px] font-semibold shadow-2xl hover:bg-[#5255e0] transition-all flex items-center justify-center gap-3 hover:scale-[1.02]"
                  >
                    Go to Workspace <ArrowRight size={20} />
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
