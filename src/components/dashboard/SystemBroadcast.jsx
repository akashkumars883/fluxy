"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Megaphone, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SystemBroadcast() {
  const [broadcasts, setBroadcasts] = useState([]);
  // Initialize dismissed list from localStorage eagerly so the first render
  // already has the correct state (avoids cascading setState in an effect).
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("dismissed_broadcasts");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    // No-op: dismissed list is already initialized above.

    async function fetchBroadcasts() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("system_broadcasts")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        // Filter out expired ones
        const now = new Date();
        const active = data.filter(b => !b.expires_at || new Date(b.expires_at) > now);
        setBroadcasts(active);
      }
    }
    
    fetchBroadcasts();

    // Subscribe to new broadcasts
    const supabase = createClient();
    const channel = supabase
      .channel('public:system_broadcasts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'system_broadcasts' }, fetchBroadcasts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDismiss = (id) => {
    const updated = [...dismissed, id];
    setDismissed(updated);
    localStorage.setItem("dismissed_broadcasts", JSON.stringify(updated));
  };

  const visibleBroadcast = broadcasts.find(b => !dismissed.includes(b.id));

  if (!visibleBroadcast) return null;

  const getColors = (type) => {
    switch(type) {
      case 'error': return 'bg-red-500 text-white';
      case 'warning': return 'bg-amber-500 text-amber-950';
      case 'success': return 'bg-emerald-500 text-white';
      default: return 'bg-indigo-600 text-white';
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={`w-full ${getColors(visibleBroadcast.type)} relative z-50`}
      >
        <div className="max-w-8xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Megaphone size={16} className="shrink-0 animate-pulse" />
            <div className="text-sm font-medium">
              <strong className="mr-2">{visibleBroadcast.title}:</strong>
              {visibleBroadcast.message}
              {visibleBroadcast.link && (
                <a href={visibleBroadcast.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 ml-2 underline underline-offset-2 opacity-90 hover:opacity-100">
                  Read more <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
          <button 
            onClick={() => handleDismiss(visibleBroadcast.id)}
            className="shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
