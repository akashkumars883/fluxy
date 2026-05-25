"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, Zap, MessageSquare, Target, Users, ShoppingBag, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";

export default function PublicNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Track active accordion in mobile drawer
  const [mobileDropdown, setMobileDropdown] = useState(null);

  const [session, setSession] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Solutions', href: '#how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' }
  ];

  // Dropdown Configurations for Desktop & Mobile Menus
  const featuresDropdown = [
    {
      title: "Instagram DM Auto-Reply",
      desc: "Reply to incoming direct messages instantly 24/7.",
      href: "/features/dm-auto-reply",
      icon: Zap,
      color: "text-amber-500 bg-amber-500/10"
    },
    {
      title: "Comment Auto-Responder",
      desc: "Send instant links to users who comment on your posts.",
      href: "/features/comment-auto-responder",
      icon: MessageSquare,
      color: "text-indigo-500 bg-indigo-500/10"
    },
    {
      title: "Story Mention Tool",
      desc: "Reply automatically when someone tags you in stories.",
      href: "/features/story-mention",
      icon: Target,
      color: "text-emerald-500 bg-emerald-500/10"
    }
  ];

  const solutionsDropdown = [
    {
      title: "For Creators & Influencers",
      desc: "Deliver courses, ebooks, and digital products automatically.",
      href: "/solutions/creators",
      icon: Users,
      color: "text-[#6366F1] bg-[#6366F1]/10"
    },
    {
      title: "For Brands & E-commerce",
      desc: "Send checkout coupons and discount codes in Instagram DMs.",
      href: "/solutions/brands",
      icon: ShoppingBag,
      color: "text-rose-500 bg-rose-500/10"
    }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${isScrolled || isMenuOpen
            ? "bg-white/40 backdrop-blur-2xl border-zinc-200/40 py-4"
            : "bg-transparent border-transparent py-6"
          }`}
        style={{
          transform: isVisible || isMenuOpen ? "translateY(0)" : "translateY(-100%)"
        }}
      >
        <div className="max-w-8xl mx-auto px-6 md:px-10 flex items-center justify-between">

          {/* Left Side: Logo */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <img src="/logo.png" alt="Automixa Logo" className="w-14 h-14 object-contain" />
            <span className="text-xl font-semibold tracking-normal text-foreground">automixa</span>
          </Link>

          {/* Center: Desktop Navigation Links with Hover Megamenus */}
          <div className="hidden lg:flex items-center gap-8 relative">

            {/* Features Hover Dropdown */}
            <div className="relative group/menu py-2">
              <button className="flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer">
                Features
                <ChevronDown size={14} className="group-hover/menu:rotate-180 transition-transform duration-300 text-zinc-400" />
              </button>

              {/* Dropdown panel container */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[400px] opacity-0 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover/menu:translate-y-0 z-50">
                <div className="bg-white/95 backdrop-blur-3xl border border-zinc-200/40 rounded-[28px] p-5 shadow-2xl shadow-zinc-200/60 flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-3 mb-1">Capabilities</span>
                  {featuresDropdown.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={idx}
                        href={item.href}
                        className="flex items-start gap-4 p-3 rounded-2xl hover:bg-zinc-50 transition-all group/item"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/item:scale-105 ${item.color}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-800 group-hover/item:text-[#6366F1] transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-zinc-500 font-normal mt-0.5 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Solutions Hover Dropdown */}
            <div className="relative group/menu py-2">
              <button className="flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer">
                Solutions
                <ChevronDown size={14} className="group-hover/menu:rotate-180 transition-transform duration-300 text-zinc-400" />
              </button>

              {/* Dropdown panel container */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[400px] opacity-0 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover/menu:translate-y-0 z-50">
                <div className="bg-white/95 backdrop-blur-3xl border border-zinc-200/40 rounded-[28px] p-5 shadow-2xl shadow-zinc-200/60 flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-3 mb-1">Target Audiences</span>
                  {solutionsDropdown.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={idx}
                        href={item.href}
                        className="flex items-start gap-4 p-3 rounded-2xl hover:bg-zinc-50 transition-all group/item"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/item:scale-105 ${item.color}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-800 group-hover/item:text-[#6366F1] transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-zinc-500 font-normal mt-0.5 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pricing Direct Link */}
            <Link href="/pricing" className="text-sm font-semibold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer">
              Pricing
            </Link>

            {/* Blog Direct Link */}
            <Link href="/blog" className="text-sm font-semibold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer">
              Blog
            </Link>

            {/* Contact Direct Link */}
            <Link href="/contact" className="text-sm font-semibold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer">
              Contact
            </Link>

          </div>

          {/* Right Group: Action Button + Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* CTA Button: Visible on Tablet/Desktop, Hidden on Mobile */}
            <Link
              href={session ? "/dashboard" : "/login"}
              className="hidden sm:flex bg-foreground text-background text-sm font-normal px-6 py-3 rounded-full hover:scale-[1.05] active:scale-[0.98] transition-all tracking-normal items-center gap-2 group"
            >
              {session ? "Dashboard" : "Get Started"}
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-45" />
            </Link>

            {/* Custom Interactive Morphing Hamburger Button (Mobile Only) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 text-foreground hover:bg-[#09090B]/5 rounded-full transition-all flex items-center justify-center cursor-pointer relative z-50 group lg:hidden"
            >
              <div className="w-5 h-5 flex items-center justify-center relative">
                {/* Custom morphing lines centered mathematically */}
                <span className={`absolute h-0.5 bg-foreground rounded-full transition-all duration-300 ${isMenuOpen ? "rotate-45 w-5" : "w-5 -translate-y-1.5"}`} />
                <span className={`absolute h-0.5 bg-foreground rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0 w-0" : "w-5"}`} />
                <span className={`absolute h-0.5 bg-foreground rounded-full transition-all duration-300 ${isMenuOpen ? "-rotate-45 w-5" : "w-5 translate-y-1.5"}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Premium Full-Screen Overlay and Sliding Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Soft Dark Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsMenuOpen(false);
                setMobileDropdown(null);
              }}
              className="fixed inset-0 bg-black/20 backdrop-blur-md z-[90]"
            />

            {/* Slide-out Sidebar Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="fixed top-0 right-0 h-[100dvh] w-full max-w-[400px] bg-background border-l border-border shadow-2xl z-[95] p-8 md:p-10 flex flex-col justify-between"
            >
              {/* Drawer Header & Content */}
              <div className="flex flex-col gap-12 pt-20">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-sage uppercase tracking-widest">Navigation Menu</span>
                  <div className="h-[1px] w-12 bg-sage"></div>
                </div>

                {/* Mobile Nav Links Stack with Interactive Accordions */}
                <div className="flex flex-col gap-5 overflow-y-auto max-h-[calc(100dvh-260px)] pr-2">
                  {navLinks.map((item, index) => {
                    const hasDropdown = item.name === 'Features' || item.name === 'Solutions';
                    const isExpanded = mobileDropdown === item.name;
                    const dropdownItems = item.name === 'Features' ? featuresDropdown : solutionsDropdown;

                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06 }}
                        className="flex flex-col gap-2"
                      >
                        {hasDropdown ? (
                          <>
                            {/* Mobile Accordion Toggle Button */}
                            <button
                              onClick={() => setMobileDropdown(isExpanded ? null : item.name)}
                              className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground hover:text-indigo-600 flex items-center justify-between w-full text-left font-display cursor-pointer"
                              style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                            >
                              {item.name}
                              <ChevronDown
                                size={22}
                                className={`text-zinc-400 transition-transform duration-300 ${isExpanded ? "rotate-180 text-indigo-600" : ""}`}
                              />
                            </button>

                            {/* Mobile Accordion Inner Lists */}
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="overflow-hidden pl-4 border-l border-zinc-200/60 flex flex-col gap-3.5 my-2"
                                >
                                  {dropdownItems.map((sub, sIdx) => {
                                    const SubIcon = sub.icon;
                                    return (
                                      <Link
                                        key={sIdx}
                                        href={sub.href}
                                        onClick={() => {
                                          setIsMenuOpen(false);
                                          setMobileDropdown(null);
                                        }}
                                        className="flex items-center gap-3.5 text-zinc-600 hover:text-zinc-950 transition-colors"
                                      >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${sub.color}`}>
                                          <SubIcon size={14} />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-sm font-bold text-zinc-800">{sub.title}</span>
                                          <span className="text-[10px] text-zinc-400 font-normal leading-tight mt-0.5">{sub.desc}</span>
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          /* Direct link */
                          <Link
                            href={item.href}
                            onClick={() => {
                              setIsMenuOpen(false);
                              setMobileDropdown(null);
                            }}
                            className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground hover:text-indigo-600 transition-colors block font-display cursor-pointer"
                            style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                          >
                            {item.name}
                          </Link>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile-Only CTA Button inside Drawer */}
                <div className="flex flex-col gap-4 pt-6 sm:hidden border-t border-border mt-2">
                  <Link
                    href={session ? "/dashboard" : "/login"}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setMobileDropdown(null);
                    }}
                    className="w-full text-center py-4 bg-foreground text-background font-bold rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
                  >
                    {session ? "Dashboard" : "Get Started"}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>

              {/* Drawer Footer info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-6 border-t border-border pt-8"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-zinc-muted">Automixa</span>
                  <span className="text-[10px] font-bold text-zinc-muted/50 uppercase tracking-widest">© 2026 AUTOMIXA | Akash Enterprises</span>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
