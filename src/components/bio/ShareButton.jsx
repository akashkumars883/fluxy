"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const url = window.location.href;

      // Try Web Share API if mobile browser supports it
      if (navigator.share) {
        await navigator.share({
          title: "Check out my links",
          url: url,
        });
        return;
      }

      // Fallback to copy link
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (err.name !== "AbortError") {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm text-white cursor-pointer"
      title="Share Profile"
    >
      {copied ? (
        <Check size={14} className="text-emerald-400" />
      ) : (
        <Share2 size={14} />
      )}
    </button>
  );
}
