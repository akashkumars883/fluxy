"use client";
import { createClient } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { ArrowRight, Mail, Lock, Eye, EyeOff, Sparkles, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.48C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.1 16.67C20.08 16.74 19.67 18.11 18.71 19.5ZM15.97 4.17C16.63 3.37 17.07 2.28 16.95 1C16 1.04 14.9 1.6 14.24 2.38C13.68 3.04 13.19 4.14 13.34 5.39C14.39 5.47 15.4 4.88 15.97 4.17Z"/>
  </svg>
);

const MetaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white shrink-0">
    <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
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
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAC8adHAN8dPsLLNs";

  useEffect(() => {
    // Define global callback for Cloudflare Turnstile
    if (typeof window !== "undefined") {
      window.onTurnstileSuccess = (token) => {
        setTurnstileToken(token);
      };
    }
    return () => {
      if (typeof window !== "undefined") {
        delete window.onTurnstileSuccess;
      }
    };
  }, []);

  useEffect(() => {
    setTurnstileToken("");
  }, [isSignUp]);

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
    if (!agreeTerms) {
      toast.error("Please agree to the Privacy Policy and Terms of Service first");
      return;
    }
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
    if (!agreeTerms) {
      toast.error("Please agree to the Privacy Policy and Terms of Service first");
      return;
    }
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
    <main className="min-h-screen bg-background text-foreground overflow-hidden relative font-sans">
      <Script 
        src="https://challenges.cloudflare.com/turnstile/v0/api.js" 
        strategy="afterInteractive" 
      />
      {/* Background Soft Ambient Light Halos on the Right Side Canvas */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-[#6366F1]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[45%] w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none" />

      <PageTransition>
        <div className="flex min-h-screen relative z-10">
          
          {/* --- LEFT SIDE: 50% SPLIT VISUAL PANEL --- */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden border border-white/10 bg-gradient-to-br from-[#4F46E5] via-[#3730A3] to-[#1E1B4B] lg:m-4 lg:rounded-2xl shadow-xl">
            {/* Grainy Noise Overlay */}
            <div 
              className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none" 
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
              }} 
            />

            {/* Decorative Grid & Glowing Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="glow-line-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818CF8" stopOpacity="0" />
                  <stop offset="30%" stopColor="#A78BFA" stopOpacity="0.25" />
                  <stop offset="70%" stopColor="#F472B6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="glow-line-2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
                  <stop offset="50%" stopColor="#818CF8" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Glowing flowing linear lines */}
              <path d="M-100 150 C 200 300, 150 50, 700 200" stroke="url(#glow-line-1)" strokeWidth="2" fill="none" />
              <path d="M-50 100 C 150 200, 300 -20, 800 100" stroke="url(#glow-line-1)" strokeWidth="1" fill="none" />
              <path d="M-200 250 C 100 50, 200 350, 600 50" stroke="url(#glow-line-2)" strokeWidth="2.5" fill="none" />
              <path d="M0 400 C 200 250, 100 550, 500 350" stroke="url(#glow-line-2)" strokeWidth="1.5" fill="none" />
            </svg>

            {/* Ambient Glows */}
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#C084FC]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#6366F1]/10 rounded-full blur-[120px] pointer-events-none" />
            
            {/* Soft Localized Bottom Fade strictly behind the text block for perfect readability */}
            <div className="absolute bottom-0 inset-x-0 h-[250px] bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10" />
            
            {/* Top Logo Section (White colored for consistent branding) */}
            <div className="relative z-20">
               <Link href="/" className="flex items-center gap-2 text-6xl font-bold tracking-tighter text-white">
                  <Image src="/logo.png" alt="Automixa Logo" width={32} height={32} className="object-contain brightness-0 invert" />
                  <span className="text-2xl font-medium tracking-normal font-display">automixa</span>
               </Link>
            </div>

            {/* Empty Middle to let the beautiful image breathe */}
            <div className="flex-1" />

            {/* Branding & Marketing text */}
            <div className="relative z-20">
               <motion.div 
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="space-y-4"
               >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90 w-fit">
                    <MetaIcon />
                    <span>Meta Official Business Partner</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.2] font-display">
                    Instagram growth, <br /> 
                    <span className="text-[#6366F1] font-normal">automated with AI.</span>
                  </h1>
                  
                  <div className="pt-8 border-t border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                    © 2026 AUTOMIXA | Akash Enterprises
                  </div>
               </motion.div>
            </div>
          </div>
          {/* --- RIGHT SIDE: 50% SPLIT FORM --- */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-[#FBFBFD]">
            
            {/* Mobile Logo Header */}
            <div className="absolute top-8 left-8 lg:hidden">
               <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
                  <Image src="/logo.png" alt="Automixa Logo" width={24} height={24} className="object-contain" />
                  <span className="font-semibold text-zinc-900 font-display">automixa</span>
               </Link>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[370px] space-y-5 relative z-10"
            >
              {/* Form Title Block */}
              <div className="space-y-1.5 text-left">
                 <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 font-display">
                   {isSignUp ? "Get started free" : "Welcome back"}
                 </h2>
                 <p className="text-zinc-500 text-xs sm:text-sm font-normal">
                   {isSignUp 
                     ? "Create your account in less than a minute." 
                     : "Enter your credentials to access your dashboard."}
                 </p>
              </div>
               {/* Login Action Area */}
              <div className="space-y-5">
                {/* Email Form */}
                <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail size={16} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full bg-zinc-50/50 border border-zinc-200/80 focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 rounded-lg py-2.5 pl-10 pr-4 text-xs outline-none transition-all placeholder:text-zinc-400/80 text-zinc-800 font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
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
                      <Lock size={16} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-zinc-50/50 border border-zinc-200/80 focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 rounded-lg py-2.5 pl-10 pr-10 text-xs outline-none transition-all placeholder:text-zinc-400/80 text-zinc-800 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Cloudflare Turnstile Captcha Widget */}
                  {siteKey && (
                    <div 
                      key={isSignUp ? "signup-turnstile" : "signin-turnstile"} // Force re-render widget on tab switch
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
                    className="w-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#4F46E5] hover:to-[#4338CA] text-white rounded-lg py-2.5 px-4 text-xs font-semibold shadow-sm hover:shadow-[#6366F1]/10 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{isSignUp ? "Create Free Account" : "Sign In with Email"}</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>

                  {/* Consent Checkbox */}
                  <div className="flex items-start gap-2 pt-2">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 rounded border-zinc-300 text-[#6366F1] focus:ring-[#6366F1]/20 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-[10px] text-zinc-500 leading-normal font-medium cursor-pointer">
                      I agree to the{" "}
                      <Link href="/privacy" className="text-[#6366F1] hover:underline font-semibold">
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link href="/terms" className="text-[#6366F1] hover:underline font-semibold">
                        Terms of Service
                      </Link>
                    </label>
                  </div>
                </form>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-zinc-200/60"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-[#FBFBFD] px-2">
                    or continue with
                  </span>
                  <div className="flex-grow border-t border-zinc-200/60"></div>
                </div>

                {/* Social Login Buttons (Google, Facebook in one row) */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Google OAuth Button */}
                  <button 
                    type="button"
                    onClick={() => handleOAuthLogin('google')}
                    disabled={loadingProvider !== null || isLoading}
                    className="group flex items-center justify-center bg-white border border-zinc-200/80 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 rounded-lg py-2.5 px-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
                    title="Continue with Google"
                  >
                    <GoogleIcon />
                  </button>

                  {/* Facebook OAuth Button */}
                  <button 
                    type="button"
                    onClick={() => handleOAuthLogin('facebook')}
                    disabled={loadingProvider !== null || isLoading}
                    className="group flex items-center justify-center bg-white border border-zinc-200/80 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 rounded-lg py-2.5 px-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
                    title="Continue with Facebook"
                  >
                    <FacebookIcon />
                  </button>
                </div>
              </div>

              {/* Toggle Account Mode */}
              <div className="text-center pt-1 text-xs text-zinc-500">
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

            </motion.div>
          </div>
        </div>
      </PageTransition>
    </main>
  );
}
