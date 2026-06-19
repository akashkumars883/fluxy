"use client";

import { useEffect, useRef } from "react";

export default function BioTracker({ automationId }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!automationId || tracked.current) return;
    
    tracked.current = true;
    
    // Fire and forget view tracking
    fetch("/api/bio/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ automationId, type: "view" }),
    }).catch(err => console.error("Failed to track view:", err));

  }, [automationId]);

  return null;
}
