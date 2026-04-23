"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Support', href: '/dashboard/support' }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
        isScrolled || isMenuOpen
          ? "bg-white/90 backdrop-blur-xl border-border py-4" 
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-8xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-semibold tracking-normal text-foreground">automixa</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
           {navLinks.map((item) => (
             <Link 
               key={item.name} 
               href={item.href} 
               className="text-sm font-semibold text-zinc-muted hover:text-foreground transition-all tracking-normal"
             >
               {item.name}
             </Link>
           ))}
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-4">
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

           {/* Mobile Menu Button */}
           <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="md:hidden p-2 text-foreground"
           >
             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
      </div>

      {/* Mobile Sidebar/Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border p-6 shadow-2xl"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-semibold text-foreground border-b border-zinc-50 pb-4"
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-4 pt-4">
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-4 text-foreground font-bold border border-border rounded-xl"
                >
                  Sign in
                </Link>
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-4 bg-foreground text-background font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
