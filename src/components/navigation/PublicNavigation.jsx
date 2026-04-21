"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function PublicNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-xl border-border py-4" 
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-8xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-semibold tracking-normal text-foreground">automixa</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
           {['Features', 'Solutions', 'Pricing', 'Docs'].map((item) => (
             <Link 
               key={item} 
               href={`#${item.toLowerCase()}`} 
               className="text-sm font-semibold text-zinc-muted hover:text-foreground transition-all tracking-normal"
             >
               {item}
             </Link>
           ))}
        </div>

        <div className="flex items-center gap-4">
           <Link 
             href="/login" 
             className="text-sm font-semibold text-foreground px-6 py-2.5 hover:bg-zinc-50 rounded-full transition-all tracking-normal"
           >
             Sign in
           </Link>
           <Link 
             href="/login" 
             className="bg-foreground text-background text-sm font-semibold px-6 py-2.5 rounded-full hover:scale-[1.05] active:scale-[0.98] transition-all shadow-xl shadow-foreground/10 tracking-normal flex items-center gap-2"
           >
             Get Started
             <ArrowRight size={16} />
           </Link>
        </div>
      </div>
    </nav>
  );
}
