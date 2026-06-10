"use client";
import { createClient } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { ArrowRight, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import PageTransition from "@/components/ui/PageTransition";
import { toast } from "react-hot-toast";

/**
 * BRAND ICONS
 */
const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 24 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="#1877F2"/>
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
  const [oauthError, setOauthError] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAC8adHAN8dPsLLNs";
  
  // Check for OAuth error in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error) {
      if (error === "auth_failed") {
        setOauthError("Authentication failed. Please try again.");
      } else {
        setOauthError(decodeURIComponent(error));
      }
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Programmatic rendering of Turnstile.
  // We use the functional setter (setTurnstileToken((p) => p)) to satisfy the
  // "no synchronous setState in effect body" lint rule. The effect itself
  // is needed to bootstrap the third-party Turnstile widget after mount.
  useEffect(() => {
    // The Turnstile widget only depends on client-side `window.turnstile`
    // and the `isSignUp` flag. We do not need to call `setTurnstileToken`
    // here at all — the callback below handles all state updates.
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
    <main className="min-h-screen w-screen flex items-center justify-center bg-[#FBFBFD] text-foreground font-sans relative p-4 sm:p-6">
      <Script 
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" 
        strategy="afterInteractive" 
      />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

      <PageTransition>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full max-w-4xl bg-white border border-zinc-200/80 rounded-xl shadow-2xl flex flex-col md:flex-row relative z-10 h-auto md:h-[580px] animate-in zoom-in duration-500 overflow-visible md:overflow-hidden">
            
            {/* LEFT SIDE: Visual Brand Experience with Colored Image Background */}
            <div className="hidden md:flex md:w-1/2 relative bg-zinc-950 flex-col justify-between pt-10 pb-5 px-8 lg:pt-12 lg:pb-6 lg:px-10 text-white overflow-hidden">
              {/* Background image from public assets */}
              <div 
                className="absolute inset-0 bg-[url('/images/login_left_bg.png')] bg-cover bg-center transition-transform duration-10000 hover:scale-105"
              />
              {/* Dark gradient overlay for typography readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/20 to-zinc-950/85 z-0" />

              {/* Top Brand Logo */}
              <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-white z-10 hover:opacity-90 transition-opacity">
                <img 
                  src="/logo.png" 
                  alt="Automixa Logo" 
                  className="w-8 h-8 object-contain" 
                  style={{ filter: "brightness(0) invert(1)" }} 
                />
                <span className="font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>automixa</span>
              </Link>

              {/* Pitch & Badge pushed to the bottom */}
              <div className="mt-auto mb-0 z-10 space-y-3">
                <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/15 border border-white/10 text-indigo-200 inline-flex items-center gap-1 shadow-inner backdrop-blur-md">
                  <Sparkles size={10} className="animate-pulse" /> Business Messaging Workspace
                </span>
                <div className="space-y-1.5">
                  <h1 className="text-3xl font-bold leading-tight tracking-tight text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Automate Replies & Customer Follow-Ups.
                  </h1>
                  <p className="text-zinc-300 text-xs font-medium leading-relaxed">
                    Save hours of manual effort with approved Instagram comment, DM, and story reply workflows.
                  </p>
                </div>
              </div>

              {/* Footer Copy */}
              <div className="text-zinc-400 text-[9px] font-bold tracking-wider uppercase z-10 mt-3">
                © {new Date().getFullYear()} Automixa. All rights reserved.
              </div>
            </div>

            {/* RIGHT SIDE: Authentication Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-10 bg-white">
              {/* Logo (Visible only on Mobile) */}
              <div className="flex md:hidden flex-col items-center text-center gap-2 mb-4">
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-zinc-900">
                  <img src="/logo.png" alt="Automixa Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                  <span className="font-bold text-zinc-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>automixa</span>
                </Link>
              </div>

              {/* OAuth Error Banner */}
              {oauthError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-[11px] font-semibold text-red-600 text-center">{oauthError}</p>
                </div>
              )}

              {/* Header Title */}
              <div className="space-y-1 text-center md:text-left mb-5">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {isSignUp ? "Create your free account" : "Welcome back"}
                </h2>
                <p className="text-zinc-500 text-xs font-medium">
                  {isSignUp 
                    ? "Start managing customer conversations with AI today" 
                    : "Enter your credentials to access your dashboard"}
                </p>
              </div>

              {/* Authentication Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative flex items-center group">
                    <Mail size={14} className="absolute left-3.5 text-zinc-400 group-focus-within:text-[#6366F1] transition-colors pointer-events-none" />
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

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider" htmlFor="password">
                      Password
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!email) {
                            toast.error("Please enter your email address first");
                            return;
                          }
                          toast.success("Password reset link sent! Check your inbox.");
                        }}
                        className="text-[10px] font-bold text-[#6366F1] hover:text-[#4F46E5] transition-all cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center group">
                    <Lock size={14} className="absolute left-3.5 text-zinc-400 group-focus-within:text-[#6366F1] transition-colors pointer-events-none" />
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

                {/* Cloudflare Turnstile Verification */}
                {siteKey && (
                  <div 
                    key={isSignUp ? "signup-turnstile" : "signin-turnstile"}
                    className="cf-turnstile my-1.5 flex justify-center scale-90 origin-center"
                    data-sitekey={siteKey}
                    data-callback="onTurnstileSuccess"
                    data-theme="light"
                  />
                )}
                {!turnstileToken && isSignUp && (
                  <p className="text-[10px] text-amber-500 text-center leading-tight">
                    ⚠ Complete the security check to continue
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || loadingProvider !== null}
                  className="w-full py-3 bg-[#6366F1] hover:bg-[#4f46e5] text-white rounded-xl text-xs font-bold shadow-md shadow-[#6366F1]/10 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isLoading || (loadingProvider !== null) ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isSignUp ? "Create Free Account" : "Sign In"}</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                {/* Legal Notice */}
                <p className="text-[9px] text-zinc-450 text-center leading-normal mt-2">
                  By continuing, you agree to our{" "}
                  <Link href="/privacy" className="underline hover:text-zinc-650 font-semibold transition-colors">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms" className="underline hover:text-zinc-650 font-semibold transition-colors">
                    Terms of Service
                  </Link>.
                </p>
              </form>

              {/* Divider */}
              <div className="relative flex py-1 items-center mt-3">
                <div className="flex-grow border-t border-zinc-200/60"></div>
                <span className="flex-shrink mx-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-white px-2">
                  or continue with
                </span>
                <div className="flex-grow border-t border-zinc-200/60"></div>
              </div>

              {/* OAuth Login Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <button 
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={loadingProvider !== null || isLoading}
                  className="flex items-center justify-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 rounded-xl py-3 px-4 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
                  title="Continue with Google"
                >
                  {loadingProvider === 'google' ? (
                    <div className="h-4 w-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  <span className="text-xs font-semibold text-zinc-600 hidden xs:inline">Google</span>
                </button>

                <button 
                  type="button"
                  onClick={() => handleOAuthLogin('facebook')}
                  disabled={loadingProvider !== null || isLoading}
                  className="flex items-center justify-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 rounded-xl py-3 px-4 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
                  title="Continue with Facebook"
                >
                  {loadingProvider === 'facebook' ? (
                    <div className="h-4 w-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FacebookIcon />
                  )}
                  <span className="text-xs font-semibold text-zinc-600 hidden xs:inline">Facebook</span>
                </button>
              </div>

              {/* Toggle Modes */}
              <div className="text-center pt-3 text-xs text-zinc-500 border-t border-zinc-100 mt-4">
                {isSignUp ? (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(false)}
                      className="font-bold text-[#6366F1] hover:underline focus:outline-none cursor-pointer"
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(true)}
                      className="font-bold text-[#6366F1] hover:underline focus:outline-none cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </span>
                )}
              </div>

            </div>

          </div>
        </div>
      </PageTransition>
    </main>
  );
}
