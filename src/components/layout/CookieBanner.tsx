"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Cookie, X } from "lucide-react";

// Strongly-typed alias for window.gtag to avoid `any` leaks.
type GtagFn = (
  command: "consent" | "js" | "config" | "event",
  action: string,
  params?: Record<string, unknown>
) => void;
interface GtagWindow extends Window {
  gtag?: GtagFn;
  dataLayer?: unknown[];
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been chosen
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Small delay for natural appearance
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie_consent", "accepted");

    // Update Google Consent Mode v2
    if (typeof window !== "undefined") {
      const gWindow = window as GtagWindow;
      if (gWindow.gtag) {
        gWindow.gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
        });
      }
    }

    setIsVisible(false);
  };

  const handleDeclineAll = () => {
    localStorage.setItem("cookie_consent", "declined");

    // Keep Consent Mode v2 as denied
    if (typeof window !== "undefined") {
      const gWindow = window as GtagWindow;
      if (gWindow.gtag) {
        gWindow.gtag("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
      }
    }

    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-[9999] max-w-sm md:w-[380px] bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shrink-0">
                <Cookie size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 font-display">Cookie Settings</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <Shield size={10} className="text-emerald-500 fill-emerald-500/10" />
                  <span className="text-[10px] text-zinc-400 font-semibold tracking-wide uppercase">Privacy Secure</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleDeclineAll}
              className="p-1.5 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-zinc-500 font-normal leading-relaxed">
            We use cookies to optimize site features, analyze traffic, and personalise marketing. Consent helps us keep Automixa fast and reliable. Read our{" "}
            <Link 
              href="/privacy" 
              className="text-[#6366F1] font-semibold hover:underline"
            >
              Privacy Policy
            </Link>.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pt-1.5">
            <button
              onClick={handleDeclineAll}
              className="flex-1 py-2.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/50 rounded-xl transition-all cursor-pointer text-center"
            >
              Decline
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] cursor-pointer text-center"
            >
              Accept All
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
