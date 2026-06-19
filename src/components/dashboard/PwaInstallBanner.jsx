"use client";

import { useEffect, useState } from "react";
import { Share, Plus, Sparkles, X, Smartphone, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showiOSGuide, setShowiOSGuide] = useState(false);

  useEffect(() => {
    // Check if window is available
    if (typeof window === "undefined") return;

    // Detect standalone mode
    const isStandaloneMode = 
      window.matchMedia("(display-mode: standalone)").matches || 
      (window.navigator).standalone === true;
    
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);

    setTimeout(() => {
      setIsStandalone(isStandaloneMode);
      setIsIOS(isIOSDevice);
    }, 0);

    // If already installed, don't show prompt
    if (isStandaloneMode) return;

    // Listen for beforeinstallprompt event (Android / Chrome)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait 3 seconds before showing banner to give a premium feel
      setTimeout(() => {
        setIsVisible(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS, show it after 4 seconds if it's Safari and not installed
    if (isIOSDevice && !isStandaloneMode) {
      const isSafari = /safari/.test(userAgent) && !/crios/.test(userAgent);
      if (isSafari) {
        setTimeout(() => {
          setIsVisible(true);
        }, 4000);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowiOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    // Show native install prompt
    deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || isStandalone) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-20 left-4 right-4 z-50 md:hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="w-full max-w-md mx-auto pointer-events-auto bg-white/95  border border-zinc-200/60 rounded-xl p-5  flex flex-col gap-4 relative overflow-hidden"
          >
            {/* Glossy top aesthetic border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6366F1] via-[#818CF8] to-[#6366F1]" />

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0 ">
                <Smartphone size={22} className="text-[#6366F1]" />
              </div>
              <div className="flex-1 text-left min-w-0 pr-6">
                <h4 className="text-sm font-bold text-zinc-950 flex items-center gap-1.5 leading-none">
                  Install Automixa App <Sparkles size={13} className="text-[#6366F1] animate-pulse" />
                </h4>
                <p className="text-[10px] font-medium text-zinc-500 mt-1 leading-relaxed">
                  Add to your home screen for quick, fullscreen access & native desktop experience.
                </p>
              </div>
              <button 
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-1 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-600 transition-all shrink-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDismiss}
                className="flex-1 py-3 text-zinc-400 hover:text-zinc-600 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Not Now
              </button>
              <button
                onClick={handleInstallClick}
                className="flex-1 py-3 bg-zinc-950 hover:bg-[#6366F1] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider  hover: transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Install App
              </button>
            </div>

            {/* Premium iOS Installation Step-by-Step Guide Modal/Tooltip */}
            <AnimatePresence>
              {showiOSGuide && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-zinc-100 pt-4 mt-2 text-left"
                >
                  <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 space-y-3">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      iOS Safari Setup Guide <ArrowDown size={12} className="animate-bounce" />
                    </div>
                    
                    <div className="space-y-2.5 text-xs text-zinc-700">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white border border-zinc-200 rounded-xl flex items-center justify-center text-[10px] font-black text-zinc-600  shrink-0">
                          1
                        </div>
                        <p className="font-semibold text-zinc-600">
                          {`Tap Safari's `}<span className="inline-flex items-center justify-center p-1 bg-white border border-zinc-200 rounded-xl mx-0.5"><Share size={12} className="text-[#6366F1]" /></span>{` **Share** button below.`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white border border-zinc-200 rounded-xl flex items-center justify-center text-[10px] font-black text-zinc-600  shrink-0">
                          2
                        </div>
                        <p className="font-semibold text-zinc-600">
                          Scroll down and tap <span className="inline-flex items-center gap-1 bg-white border border-zinc-200 px-2 py-0.5 rounded-xl font-bold mx-0.5 text-[10px]"><Plus size={10} /> Add to Home Screen</span>.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white border border-zinc-200 rounded-xl flex items-center justify-center text-[10px] font-black text-zinc-600  shrink-0">
                          3
                        </div>
                        <p className="font-semibold text-zinc-600">
                          Tap **Add** in the top right to install! 🚀
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
