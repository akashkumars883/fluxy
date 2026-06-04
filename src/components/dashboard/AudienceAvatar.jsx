"use client";

import { useEffect, useState } from "react";

// Global cache to prevent duplicate fetches across component instances
const avatarCache = {};

export default function AudienceAvatar({ senderId, defaultAvatar, automationId, className }) {
  const fallback = defaultAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${senderId || "default"}`;
  const [src, setSrc] = useState(fallback);

  useEffect(() => {
    if (!automationId || !senderId || senderId.startsWith("mock") || senderId === "unknown" || senderId.startsWith("u")) {
      // Keep fallback for mock/invalid/local test IDs
      return;
    }

    if (avatarCache[senderId]) {
      setSrc(avatarCache[senderId]);
      return;
    }

    const isLocalDev = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    if (isLocalDev) {
      return;
    }

    fetch(`/api/media/profile-pic?automationId=${automationId}&senderId=${senderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profilePic) {
          avatarCache[senderId] = data.profilePic;
          setSrc(data.profilePic);
        }
      })
      .catch((err) => console.error("Error loading avatar:", err));
  }, [senderId, automationId]);

  return (
    <img
      src={src}
      alt="User Avatar"
      className={className || "w-10 h-10 rounded-xl object-cover border border-zinc-200 shadow-sm shrink-0"}
      onError={() => {
        // Fallback if image fails to load
        setSrc(fallback);
      }}
    />
  );
}
