"use client";
import { createClient } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import PageTransition from "@/components/ui/PageTransition";
import { toast } from "react-hot-toast";

/**
 * BRAND ICONS
 */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAC8adHAN8dPsLLNs";

  // Programmatic rendering of Turnstile
  useEffect(() => {
    setTurnstileToken("");
    
    let timer;
    const renderWidget = () => {
      if (typeof window !== "undefined" && window.turnstile) {
        try {
          const container = document.querySelector(".cf-turnstile");
          if (container) {
            container.innerHTML = "";
            window.turnstile.render(container, {
              sitekey: siteKey,
              callback: (token) => {
                setTurnstileToken(token);
              },
              theme: "light",
            });
          }
        } catch (e) {
          console.warn("Turnstile render failed:", e);
        }
      }
    };

    if (typeof window !== "undefined") {
      if (window.turnstile) {
        timer = setTimeout(renderWidget, 100);
      } else {
        const interval = setInterval(() => {
          if (window.turnstile) {
            clearInterval(interval);
            renderWidget();
          }
        }, 100);
        return () => clearInterval(interval);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSignUp, siteKey]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/dashboard");
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [router]);

  const handleOAuthLogin = async (providerName) => {
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
      toast.error(`Login Error: ${error.message}`);
      setLoadingProvider(null);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!turnstileToken) {
      toast.error("Please complete the security check first");
      return;
    }
    
    setIsLoading(true);
    const supabase = createClient();
    
    try {
      if (isSignUp) {
        // Sign Up Flow
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
            captchaToken: turnstileToken,
          },
        });
        
        if (error) throw error;
        
        if (data?.session) {
          toast.success("Account created successfully!");
          router.replace("/dashboard");
        } else {
          toast.success("Verification link sent! Check your inbox.");
        }
      } else {
        // Sign In Flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
          options: {
            captchaToken: turnstileToken,
          },
        });
        
        if (error) throw error;
        
        toast.success("Logged in successfully!");
        router.replace("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "An authentication error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50/50 text-foreground overflow-hidden relative font-sans">
      <Script 
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" 
        strategy="afterInteractive" 
      />
      {/* Background Soft Ambient Light Halos */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#6366F1]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

      <PageTransition>
        <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white border border-zinc-200/80 rounded-xl shadow-xl p-6 sm:p-8 relative z-10 flex flex-col gap-6">
          {/* Logo Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-zinc-900">
              <img src="/logo.png" alt="Automixa Logo" className="w-7 h-7 object-contain" />
              <span className="font-semibold text-zinc-900 font-display">automixa</span>
            </Link>
          </div>

          {/* Title Block */}
          <div className="space-y-1 text-center">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 font-display">
              {isSignUp ? "Create your free account" : "Welcome back"}
            </h2>
            <p className="text-zinc-500 text-xs font-medium">
              {isSignUp 
                ? "Start growing your Instagram with AI today" 
                : "Enter your credentials to access your dashboard"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider" htmlFor="email">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail size={14} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold outline-none focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 transition-all placeholder:text-zinc-400 text-zinc-800"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                {!isSignUp && (
                  <Link href="/forgot-password" className="text-[10px] font-bold text-[#6366F1] hover:text-[#4F46E5] transition-all">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-10 pr-10 text-xs font-semibold outline-none focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 transition-all placeholder:text-zinc-400 text-zinc-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-zinc-400 hover:text-zinc-650 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Cloudflare Turnstile Captcha */}
            {siteKey && (
              <div 
                key={isSignUp ? "signup-turnstile" : "signin-turnstile"}
                className="cf-turnstile my-2 flex justify-center scale-90 origin-center"
                data-sitekey={siteKey}
                data-callback="onTurnstileSuccess"
                data-theme="light"
              />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || loadingProvider !== null}
              className="w-full py-3 bg-[#6366F1] hover:bg-[#4f46e5] text-white rounded-xl text-xs font-bold shadow-md shadow-[#6366F1]/10 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? "Create Free Account" : "Sign In"}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            {/* Consent Statement */}
            <p className="text-[10px] text-zinc-400 text-center leading-normal mt-2.5">
              By continuing, you agree to our{" "}
              <Link href="/privacy" className="underline hover:text-zinc-600 font-semibold transition-colors">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="underline hover:text-zinc-600 font-semibold transition-colors">
                Terms of Service
              </Link>.
            </p>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-zinc-200/60"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-white px-2">
              or continue with
            </span>
            <div className="flex-grow border-t border-zinc-200/60"></div>
          </div>

          {/* Social OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={loadingProvider !== null || isLoading}
              className="flex items-center justify-center bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 rounded-xl py-3 px-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
              title="Continue with Google"
            >
              <GoogleIcon />
            </button>

            <button 
              type="button"
              onClick={() => handleOAuthLogin('facebook')}
              disabled={loadingProvider !== null || isLoading}
              className="flex items-center justify-center bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 rounded-xl py-3 px-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
              title="Continue with Facebook"
            >
              <FacebookIcon />
            </button>
          </div>

          {/* Toggle Account Mode */}
          <div className="text-center pt-2 text-xs text-zinc-500 border-t border-zinc-100">
            {isSignUp ? (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="font-bold text-[#6366F1] hover:underline focus:outline-none"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="font-bold text-[#6366F1] hover:underline focus:outline-none"
                >
                  Sign Up
                </button>
              </span>
            )}
          </div>
          </div>
        </div>
      </PageTransition>
    </main>
  );
}
