"use client";

import { createClient } from "@/lib/supabase";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

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
    <div className="flex-1 flex items-center justify-center px-6 py-20 min-h-screen">
      <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Branding & Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-zinc-950 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-zinc-950/20">
             <div className="w-4 h-4 bg-white rounded-full" />
          </div>
          <h1 className="text-4xl font-semibold text-foreground tracking-normal mb-3">Welcome to Automixa</h1>
          <p className="text-zinc-500 font-normal tracking-normal max-w-[300px] mx-auto leading-relaxed">
            Connect your Instagram Business account to start automating your growth.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-border p-10 rounded-[40px] shadow-sm shadow-zinc-950/5 mb-8">
          <div className="space-y-4">
            <button 
              onClick={() => handleLogin('facebook')}
              disabled={loadingProvider !== null}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-zinc-950 px-8 py-5 text-base font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-zinc-950/20 disabled:opacity-50 tracking-normal"
            >
              {loadingProvider === 'facebook' ? (
                <span className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                   Redirecting...
                </span>
              ) : (
                'Continue with Facebook'
              )}
            </button>

            <button 
              onClick={() => handleLogin('google')}
              disabled={loadingProvider !== null}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-white border border-border px-8 py-5 text-base font-semibold text-zinc-950 transition-all hover:bg-zinc-50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 tracking-normal"
            >
              {loadingProvider === 'google' ? (
                <span className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-zinc-200 border-t-zinc-950 rounded-full animate-spin" />
                   Redirecting...
                </span>
              ) : (
                'Sign in with Google'
              )}
            </button>
            
            <div className="pt-6 flex items-center gap-3 text-zinc-400">
               <div className="h-[1px] flex-1 bg-border/50" />
               <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Official Meta API</span>
               <div className="h-[1px] flex-1 bg-border/50" />
            </div>

            <p className="text-xs text-center text-zinc-400 font-normal leading-relaxed tracking-normal">
              Automixa uses the official Instagram Graph API. We never see your password and your data is always secure.
            </p>
          </div>
        </div>

        {/* Support Section */}
        <div className="flex flex-col items-center gap-6">
           <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium bg-zinc-100/50 py-2 px-4 rounded-full border border-border/50">
              <ShieldCheck size={14} className="text-zinc-950" />
              Enterprise-grade encryption
           </div>
           
           <p className="text-xs text-center text-zinc-400 tracking-normal font-normal">
             Don't have an account? No worries, we'll create one for you upon login.
           </p>
        </div>

      </div>
    </div>
  );
}
