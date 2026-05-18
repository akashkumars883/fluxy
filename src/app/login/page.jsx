"use client";

import { createClient } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import PageTransition from "@/components/ui/PageTransition";

/**
 * BRAND ICONS (System Colors)
 */
const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleLogin = async (providerName) => {
    setLoadingProvider(providerName);
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: providerName,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      console.error("Login Error:", error.message);
      setLoadingProvider(null);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden relative font-sans selection:bg-sage/20">
      
      {/* Background Soft Ambient Light Halos on the Right Side Canvas */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-[#6366F1]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[45%] w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none" />

      <PageTransition>
        <div className="flex min-h-screen relative z-10">
          
          {/* --- LEFT SIDE: THE PREMIUM VISUAL PANEL WITH PURE RAW BACKGROUND IMAGE --- */}
          <div 
            className="hidden lg:flex lg:w-[40%] flex-col justify-between p-16 relative overflow-hidden border-r border-zinc-200/10 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/images/login_bg.jpg')` }}
          >
            
            {/* Soft Localized Bottom Fade strictly behind the text block for perfect readability */}
            <div className="absolute bottom-0 inset-x-0 h-[280px] bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none z-10" />
            
            {/* Top Logo Section (White colored for consistent branding) */}
            <div className="relative z-20">
               <Link href="/" className="flex items-center gap-2 text-6xl font-bold tracking-tighter text-white">
                  <img src="/logo.png" alt="Automixa Logo" className="w-8 h-8 object-contain brightness-0 invert" />
                  <span className="text-2xl font-medium tracking-normal font-display">automixa</span>
               </Link>
            </div>

            {/* Empty Middle to let the beautiful image breathe */}
            <div className="flex-1" />

            {/* Simplified Copy & Branding at the Bottom (White for contrast on dark hoodie) */}
            <div className="relative z-20">
               <motion.div 
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="space-y-5"
               >
                  <h1 className="text-4xl font-semibold text-white tracking-tight leading-[1.2] font-display" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                    Instagram growth, <br /> 
                    <span className="text-sage font-normal">automated.</span>
                  </h1>
                  <p className="text-zinc-200 text-sm font-normal max-w-[320px] leading-relaxed">
                    Set up auto-replies to comments and DMs in minutes. Safe, official, and trusted by creators.
                  </p>
                  
                  <div className="pt-8 border-t border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                    © 2026 AUTOMIXA | Akash Enterprises
                  </div>
               </motion.div>
            </div>
          </div>

          {/* --- RIGHT SIDE: THE SIMPLIFIED LOGIN FORM --- */}
          <div className="w-full lg:w-[60%] flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
            
            {/* Mobile Logo Header */}
            <div className="absolute top-8 left-8 lg:hidden">
               <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
                  <img src="/logo.png" alt="Automixa Logo" className="w-8 h-8 object-contain" />
                  <span className="font-semibold text-zinc-900" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>automixa</span>
               </Link>
            </div>

            {/* Seamless, borderless wider container on the background directly */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[480px] space-y-12 relative z-10"
            >
              {/* Form Title Block - Beautiful Highlight */}
              <div className="space-y-4 text-left">
                 <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 font-display leading-[1.1]" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                   Login to <span className="text-[#6366F1] font-bold">automixa</span>
                 </h2>
                 <p className="text-zinc-500 text-base sm:text-lg font-normal leading-relaxed">
                   Link your Facebook or Google account to access your dashboard. Free accounts are created instantly.
                 </p>
              </div>

              {/* Login Action Buttons - High-Fidelity Microgradients & Shadows */}
              <div className="space-y-4">
                 {/* Facebook OAuth Button (Official Blue Gradient & Ambient Shadow Glow) */}
                 <button 
                   onClick={() => handleLogin('facebook')}
                   disabled={loadingProvider !== null}
                   className="group w-full relative flex items-center justify-between bg-gradient-to-r from-[#1877F2] to-[#1565D8] text-white rounded-xl px-8 py-5 text-base font-bold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl hover:shadow-[#1877F2]/15 border border-[#1877F2] cursor-pointer"
                 >
                   <div className="flex items-center gap-5">
                     <FacebookIcon />
                     <span className="text-base sm:text-lg font-bold">
                       {loadingProvider === 'facebook' ? 'Connecting to Facebook...' : 'Continue with Facebook'}
                     </span>
                   </div>
                   <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
                 </button>

                 {/* Google OAuth Button (Frosted White Matte & Sharp Gray Shadow) */}
                 <button 
                   onClick={() => handleLogin('google')}
                   disabled={loadingProvider !== null}
                   className="group w-full relative flex items-center justify-between bg-white border border-zinc-200 hover:bg-zinc-50/80 hover:border-zinc-300 text-zinc-700 rounded-xl px-8 py-5 text-base font-bold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm hover:shadow-lg hover:shadow-zinc-100 cursor-pointer"
                 >
                   <div className="flex items-center gap-5">
                     <GoogleIcon />
                     <span className="text-base sm:text-lg font-bold">
                       {loadingProvider === 'google' ? 'Connecting to Google...' : 'Sign in with Google'}
                     </span>
                   </div>
                   <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform text-zinc-400" />
                 </button>
              </div>

              {/* Security Compliance Block - Elegant Left-accent Bar (Enterprise Stripe-like style) */}
              <div className="p-6 flex gap-5 items-center">
                 <div className="space-y-1 text-center">
                    <h4 className="text-sm font-bold text-zinc-800">100% Safe Connection</h4>
                    <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
                      We connect directly via official Meta API. We never ask for or store your Instagram password.
                    </p>
                 </div>
              </div>

              {/* Non-Uppercase Elegant Legal Footer on Background */}
              <div className="text-center pt-2 flex items-center justify-center gap-6 text-sm text-zinc-400 font-medium">
                 <Link href="/privacy" className="hover:text-zinc-800 transition-colors hover:underline">Privacy Policy</Link>
                 <span className="w-1.5 h-1.5 bg-zinc-200 rounded-full" />
                 <Link href="/terms" className="hover:text-zinc-800 transition-colors hover:underline">Terms of Service</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    </main>
  );
}
