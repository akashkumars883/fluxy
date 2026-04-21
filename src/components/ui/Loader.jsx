"use client";

import { Loader2 } from "lucide-react";

export default function Loader({ fullScreen = false, text = "" }) {
  const content = (
    <div className={`flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500 ${fullScreen ? 'min-h-[60vh]' : 'p-12'}`}>
      <div className="relative">
         <div className="w-12 h-12 border-4 border-foreground/5 rounded-full"></div>
         <div className="w-12 h-12 border-4 border-transparent border-t-foreground rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      {text && (
        <p className="text-sm font-semibold text-foreground/60">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
