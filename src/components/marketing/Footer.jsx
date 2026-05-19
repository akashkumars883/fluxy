"use client";

import Link from "next/link";

export default function Footer() {
  const productLinks = [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog Playbook", href: "/blog" },
    { label: "Support Desk", href: "/dashboard/support" }
  ];

  const featuresLinks = [
    { label: "DM Auto-Reply", href: "/features/dm-auto-reply" },
    { label: "Comment Auto-Responder", href: "/features/comment-auto-responder" },
    { label: "Story Mentions", href: "/features/story-mention" }
  ];

  const solutionsLinks = [
    { label: "For Creators", href: "/solutions/creators" },
    { label: "For Brands", href: "/solutions/brands" },
    { label: "Partner Program", href: "/partners", badge: "Beta" }
  ];

  const compareLinks = [
    { label: "vs ManyChat", href: "/compare/manychat" },
    { label: "vs Chatfuel", href: "/compare/chatfuel" },
    { label: "vs InstaChamp", href: "/compare/instachamp" }
  ];

  return (
    <footer className="pt-10 pb-16 md:pt-16 md:pb-20 px-6 md:px-10 border-t border-zinc-200/40 bg-transparent relative overflow-hidden">
      
      {/* --- LARGE BACKGROUND WATERMARK (Optimized for Mobile & Desktop - Touch-free alignment) --- */}
      <div className="absolute left-1/2 bottom-[-7px] sm:bottom-[-50px] -translate-x-1/2 select-none pointer-events-none z-0">
         <span className="text-[18vw] sm:text-[24vw] font-black text-foreground/[0.04] sm:text-foreground/[0.03] tracking-tighter leading-none whitespace-nowrap lowercase">
            automixa
         </span>
      </div>

      {/* --- PREMIUM CONTENT AREA --- */}
      <div className="max-w-8xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16 relative z-10">
        
        {/* Brand Section (LEFT) */}
        <div className="space-y-6 max-w-sm">
          <div className="flex items-center gap-3 group/logo">
            <img 
              src="/logo.png" 
              alt="Automixa Logo" 
              className="w-8 h-8 object-contain group-hover/logo:scale-110 transition-transform duration-500" 
            />
            <span className="text-2xl font-bold text-foreground">
              automixa
            </span>
          </div>
          <p className="text-zinc-500 text-sm sm:text-base font-normal leading-relaxed">
            The intelligent automation cockpit for modern creators, high-growth brands, and fast-scaling digital agencies.
          </p>
          
          {/* Aligned Contact & Socials */}
          <div className="space-y-3.5 pt-2">
            <a 
              href="mailto:info@automixa.in" 
              className="text-sm font-semibold text-zinc-600 hover:text-[#6366F1] transition-all duration-300 inline-block w-fit"
            >
              info@automixa.in
            </a>
            
            <div className="flex gap-4 pt-1 text-zinc-400">
              <a href="#" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#E1306C] hover:-translate-y-1 hover:scale-110 transition-all duration-300 cursor-pointer">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-[#1877F2] hover:-translate-y-1 hover:scale-110 transition-all duration-300 cursor-pointer">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" target="_blank" rel="noreferrer" aria-label="X (Twitter)" className="hover:text-foreground hover:-translate-y-1 hover:scale-110 transition-all duration-300 cursor-pointer">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" target="_blank" rel="noreferrer" aria-label="Pinterest" className="hover:text-[#E60023] hover:-translate-y-1 hover:scale-110 transition-all duration-300 cursor-pointer">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.4 9.3-.1-1-.2-2.4 0-3.4l1.3-5.3s-.3-.6-.3-1.6c0-1.5.9-2.6 2-2.6 1 0 1.5.7 1.5 1.6 0 1-.6 2.5-.9 3.9-.3 1.1.6 2 1.6 2 2 0 3.5-2.1 3.5-5.1 0-2.6-1.9-4.5-4.6-4.5-3.2 0-5 2.4-5 4.8 0 1 .4 2.1.8 2.6.1.1.1.2 0 .3l-.3 1.1c0 .1-.1.2-.2.1-1.3-.6-2.1-2.4-2.1-3.9 0-3.2 2.3-6.1 6.7-6.1 3.5 0 6.3 2.5 6.3 5.8 0 3.5-2.2 6.3-5.3 6.3-1 0-2-.5-2.4-1.2l-.6 2.4c-.2.9-.8 2-1.2 2.7 1.1.3 2.2.5 3.4.5 5.5 0 10-4.5 10-10S17.5 2 12 2Z"/></svg>
              </a>
            </div>
            
            {/* BacklinkLog Trust Badge */}
            <div className="pt-2 opacity-70 hover:opacity-100 transition-opacity">
              <a 
                href="https://backlinklog.com/listing/automixa.in?utm_source=backlinklog&utm_medium=badge" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img 
                  src="https://backlinklog.com/badge/automixa.in.svg" 
                  alt="Listed on BacklinkLog" 
                  width="130" 
                  height="32" 
                  className="h-8 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Links Area (RIGHT) - 2 Columns on Mobile, Flex on Desktop */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-10 md:flex md:flex-wrap md:gap-16 lg:gap-20 justify-start lg:justify-end flex-1 w-full">
          
          {/* Links: Product */}
          <div className="space-y-4 min-w-[120px]">
             <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Product</h4>
             <div className="flex flex-col gap-3 text-sm font-medium">
                {productLinks.map((link, idx) => (
                  <Link 
                    key={idx}
                    href={link.href} 
                    className="text-zinc-500 hover:text-[#6366F1] hover:translate-x-1 transition-all duration-300 inline-block w-fit"
                  >
                    {link.label}
                  </Link>
                ))}
             </div>
          </div>

          {/* Links: Features */}
          <div className="space-y-4 min-w-[120px]">
             <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Features</h4>
             <div className="flex flex-col gap-3 text-sm font-medium">
                {featuresLinks.map((link, idx) => (
                  <Link 
                    key={idx}
                    href={link.href} 
                    className="text-zinc-500 hover:text-[#6366F1] hover:translate-x-1 transition-all duration-300 inline-block w-fit"
                  >
                    {link.label}
                  </Link>
                ))}
             </div>
          </div>

          {/* Links: Solutions & Partners */}
          <div className="space-y-4 min-w-[120px]">
             <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Solutions</h4>
             <div className="flex flex-col gap-3 text-sm font-medium">
                {solutionsLinks.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2 w-fit">
                    <Link 
                      href={link.href} 
                      className="text-zinc-500 hover:text-[#6366F1] hover:translate-x-1 transition-all duration-300 inline-block w-fit"
                    >
                      {link.label}
                    </Link>
                    {link.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        {link.badge}
                      </span>
                    )}
                  </div>
                ))}
             </div>
          </div>

          {/* Links: Compare */}
          <div className="space-y-4 min-w-[120px]">
             <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Compare</h4>
             <div className="flex flex-col gap-3 text-sm font-medium">
                {compareLinks.map((link, idx) => (
                  <Link 
                    key={idx}
                    href={link.href} 
                    className="text-zinc-500 hover:text-[#6366F1] hover:translate-x-1 transition-all duration-300 inline-block w-fit"
                  >
                    {link.label}
                  </Link>
                ))}
             </div>
          </div>

        </div>

      </div>

      {/* --- FOOTER BOTTOM: COPYRIGHT & DIRECT LEGAL LINKS (Replaced Made with Love) --- */}
      <div className="max-w-8xl mx-auto mt-12 md:mt-16 pt-6 border-t border-zinc-200/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10 text-xs sm:text-sm font-normal text-zinc-400">
         <p>
           © 2026 automixa | Akash Enterprises. All rights reserved.
         </p>
         
         {/* Direct Horizontal Links (Privacy Policy, Terms, Sitemap) */}
         <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1.5 text-xs font-normal text-zinc-400">
            <Link href="/privacy" className="hover:text-[#6366F1] transition-colors duration-300">
              Privacy Policy
            </Link>
            <span className="text-zinc-200/50 hidden sm:inline">•</span>
            <Link href="/terms" className="hover:text-[#6366F1] transition-colors duration-300">
              Terms & Conditions
            </Link>
            <span className="text-zinc-200/50 hidden sm:inline">•</span>
            <Link href="/sitemap" className="hover:text-[#6366F1] transition-colors duration-300">
              Sitemap
            </Link>
            <span className="text-zinc-200/50 hidden sm:inline">•</span>
            <Link href="/data-deletion" className="hover:text-[#6366F1] transition-colors duration-300">
              Data Deletion
            </Link>
         </div>
      </div>

    </footer>
  );
}
