"use client";

import React, { useState } from "react";
import { MoreVertical, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function LinkShareButton({ url, title, color }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Try Web Share API if mobile browser supports it
      if (navigator.share) {
        await navigator.share({
          title: title || "Check out this link",
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
      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-black/10 active:bg-black/20 cursor-pointer z-20"
      style={{ color: color || "inherit" }}
      title="Share link"
    >
      {copied ? <Check size={16} /> : <MoreVertical size={16} />}
    </button>
  );
}
