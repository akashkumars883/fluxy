"use client";

import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-30 pb-20 md:pt-40 md:pb-40 px-6 overflow-hidden">
      {/* Subtle Background Art */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent blur-[120px] rounded-full -mt-[300px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-8xl font-semibold text-foreground leading-[1.1] tracking-normal mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Automate your <br />
            <span className="text-zinc-400">Instagram world.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-500 font-normal max-w-2xl leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Automixa helps content creators and brands scale their engagement with intelligent AI-powered replies and DM sequences. Connect once, automate forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-10 py-5 bg-foreground text-background text-base font-semibold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-foreground/20 flex items-center justify-center gap-3 tracking-normal"
            >
              Get Started for Free
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="#features" 
              className="w-full sm:w-auto px-10 py-5 bg-white border border-border text-foreground text-base font-semibold rounded-full hover:bg-zinc-50 transition-all text-center tracking-normal"
            >
              View Features
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
