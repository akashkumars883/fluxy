"use client";

import { ShieldCheck, Camera } from "lucide-react";

export default function Safety() {
  return (
    <section className="py-24 px-6 md:py-32 md:px-10 bg-zinc-950 text-white rounded-xl mx-4 my-8">
       <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-20">
          <div className="flex-1">
             <div className="w-16 h-16 bg-background/10 rounded-xl flex items-center justify-center mb-8">
                <ShieldCheck size={32} className="text-white" />
             </div>
             <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-8 tracking-normal">Official Instagram Graph API Integration.</h2>
             <p className="text-white/60 text-lg font-normal tracking-normal mb-10 leading-relaxed">
               Automixa is built on top of Meta's official APIs. We follow every safety protocol to ensure your account remains safe and compliant while you scale your reach.
             </p>
             <div className="flex items-center gap-6">
                <div className="flex flex-col">
                   <span className="text-2xl font-semibold tracking-normal">100%</span>
                   <span className="text-white/40 text-xs font-normal tracking-normal uppercase mt-1">Safe Flow Control</span>
                </div>
                <div className="w-[1px] h-10 bg-background/20" />
                <div className="flex flex-col">
                   <span className="text-2xl font-semibold tracking-normal">Meta</span>
                   <span className="text-white/40 text-xs font-normal tracking-normal uppercase mt-1">Official Approved API</span>
                </div>
             </div>
          </div>
          <div className="flex-1 w-full aspect-square bg-background/5 rounded-xl border border-background/10 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
             <Camera size={120} strokeWidth={1} className="text-white opacity-20 relative z-10" />
          </div>
       </div>
    </section>
  );
}
