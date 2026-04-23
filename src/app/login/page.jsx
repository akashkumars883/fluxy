"use client";

import { createClient } from "@/lib/supabase";
import { useState } from "react";
import { ShieldCheck, ArrowRight, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * CUSTOM SVGS FOR BRAND ICONS (Lucide lacks these)
 */
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

export default function LoginPage() {
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-background font-semibold">
      
      {/* --- LEFT SIDE: THE VISUAL & BRANDING --- */}
      <div className="lg:w-1/2 relative hidden lg:flex bg-zinc-100 p-16 flex-col justify-between overflow-hidden border-r border-border">
        {/* Full Visibility Image (No heavy black overlay) */}
        <div className="absolute inset-0">
           <img 
             src="/images/login-visual.png" 
             alt="Networking Visual" 
             className="w-full h-full object-cover grayscale-[20%] opacity-90"
           />
           {/* Darker gradient for better text readability */}
           <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/70 via-zinc-950/20 to-transparent z-10" />
        </div>

        {/* Content */}
        <div className="relative z-20">
           <Link href="/" className="text-3xl font-semibold text-white tracking-tighter">
              automixa
           </Link>
        </div>

        <div className="relative z-20 mb-20 max-w-lg">
           <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="text-6xl font-semibold text-white leading-tight tracking-normal mb-8 drop-shadow-2xl"
           >
             Scale your influence <br />
             <span className="text-white/90">on autopilot.</span>
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
             className="text-white/80 text-lg font-semibold mb-12 leading-relaxed drop-shadow-lg"
           >
             The ultimate automation engine for modern creators and high-growth brands. Connect your world in seconds.
           </motion.p>

           <div className="flex items-center gap-4 text-white/60 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2 border-r border-white/20 pr-4"> Official API </span>
              <span className="flex items-center gap-2 border-r border-white/20 pr-4"> Meta Approved </span>
              <span> Secure </span>
           </div>
        </div>

        {/* Footer Credit */}
        <div className="relative z-20 text-white/40 text-xs font-semibold">
           © 2026 Automixa | Akash Enterprises. All rights reserved.
        </div>
      </div>

      {/* --- RIGHT SIDE: THE LOGIN FORM --- */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-[440px]">
          
          <div className="lg:hidden mb-12">
             <Link href="/" className="text-2xl font-semibold text-foreground tracking-tighter">
                automixa
             </Link>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-4 tracking-normal">Welcome back</h2>
            <p className="text-zinc-500 font-semibold tracking-normal leading-relaxed">
              Login to continue to your dashboard. New here? We'll create an account for you automatically.
            </p>
          </div>

          <div className="space-y-4 mb-10">
            <button 
              onClick={() => handleLogin('facebook')}
              disabled={loadingProvider !== null}
              className="flex w-full items-center justify-between group rounded-[24px] bg-[#1877F2] px-8 py-5 text-base font-semibold text-white transition-all hover:brightness-110 shadow-2xl shadow-blue-500/10 disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <FacebookIcon />
                <span>{loadingProvider === 'facebook' ? 'Redirecting...' : 'Continue with Facebook'}</span>
              </div>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => handleLogin('google')}
              disabled={loadingProvider !== null}
              className="flex w-full items-center justify-between group rounded-[24px] bg-white border border-border px-8 py-5 text-base font-semibold text-zinc-950 transition-all hover:bg-zinc-50 shadow-sm disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <GoogleIcon />
                <span>{loadingProvider === 'google' ? 'Redirecting...' : 'Sign in with Google'}</span>
              </div>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-zinc-400" />
            </button>
          </div>

          <div className="p-8 bg-zinc-50 border border-border rounded-[32px] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-16 h-16 bg-foreground/[0.02] rounded-full -mr-8 -mt-8" />
             <div className="relative z-10 flex gap-4 items-start">
                <div className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center shrink-0 shadow-sm text-zinc-400">
                   <ShieldCheck size={20} />
                </div>
                <div className="space-y-1">
                   <h4 className="text-sm font-bold text-foreground">Secure Connection</h4>
                   <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                     Automixa never stores your social passwords. We use official Meta tokens that you can revoke at any time from your settings.
                   </p>
                </div>
             </div>
          </div>

          <p className="mt-12 text-center text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">
            By logging in, you agree to our <Link href="/terms" className="underline hover:text-foreground">Terms</Link> & <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
          </p>
        </div>
      </div>

    </div>
  );
}
