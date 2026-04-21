"use client";

import { Camera } from "lucide-react";

export default function SocialProof() {
  return (
    <section className="py-20 border-y border-border/50 bg-white">
      <div className="max-w-7xl mx-auto px-6">
         <p className="text-center text-[10px] font-semibold text-zinc-muted uppercase tracking-[0.2em] mb-12">Trusted by 100+ high-growth Instagram accounts</p>
         <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-30 grayscale saturate-0">
            <Camera size={32} />
            <Camera size={32} />
            <Camera size={32} />
            <Camera size={32} />
            <Camera size={32} />
         </div>
      </div>
    </section>
  );
}
