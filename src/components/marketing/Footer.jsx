"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 md:px-10 border-t border-border bg-transparent relative overflow-hidden">
      
      {/* --- LARGE BACKGROUND WATERMARK (Moved Up & Behind) --- */}
      <div className="absolute left-1/2 -bottom-10 -translate-x-1/2 select-none pointer-events-none z-0">
         <span className="text-[24vw] font-black text-foreground/[0.03] tracking-tighter leading-none whitespace-nowrap lowercase">
            automixa
         </span>
      </div>

      {/* --- PREMIUM CONTENT AREA --- */}
      <div className="max-w-8xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-20 relative z-10">
        
        {/* Brand Section (LEFT) */}
        <div className="space-y-8 max-w-sm">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Automixa Logo" className="w-8 h-8 object-contain" />
            <span className="text-2xl font-semibold tracking-tighter text-foreground">automixa</span>
          </div>
          <p className="text-zinc-500 text-base font-medium leading-relaxed tracking-normal">
            The intelligent automation cockpit for modern creators and high-growth brands.
          </p>
        </div>

        {/* Links Area (RIGHT) */}
        <div className="flex flex-wrap gap-12 md:gap-20 lg:gap-20 text-left lg:text-left justify-start lg:justify-end flex-1">
          
          {/* Links: Product */}
          <div className="space-y-6">
             <h4 className="text-[14px] font-bold text-zinc-400">Product</h4>
             <div className="flex flex-col gap-4 text-sm font-medium">
                <Link href="#features" className="text-zinc-500 hover:text-foreground transition-all">Features</Link>
                <Link href="/dashboard/support" className="text-zinc-500 hover:text-foreground transition-all">Support</Link>
                <Link href="/login" className="text-zinc-500 hover:text-foreground transition-all">Sign in</Link>
             </div>
          </div>

          {/* Links: Legal */}
          <div className="space-y-6">
             <h4 className="text-[14px] font-bold text-zinc-400">Legal</h4>
             <div className="flex flex-col gap-4 text-sm font-medium">
                <Link href="/privacy" className="text-zinc-500 hover:text-foreground transition-all">Privacy</Link>
                <Link href="/terms" className="text-zinc-500 hover:text-foreground transition-all">Terms</Link>
                <Link href="/data-deletion" className="text-zinc-500 hover:text-foreground transition-all">Data Deletion</Link>
             </div>
          </div>

          {/* Links: Contact */}
          <div className="space-y-6">
             <h4 className="text-[14px] font-bold text-zinc-400">Contact</h4>
             <div className="flex flex-col gap-4 text-sm font-medium text-zinc-500">
                <a href="mailto:info@automixa.in" className="hover:text-foreground transition-all">info@automixa.in</a>
                <a href="tel:+916201231875" className="hover:text-foreground transition-all">+91 6201231875</a>
                <div className="flex gap-4 pt-2">
                  <span className="hover:text-foreground transition-all cursor-pointer">X</span>
                  <span className="hover:text-foreground transition-all cursor-pointer">Instagram</span>
                </div>
             </div>
          </div>

        </div>

      </div>

      {/* --- FOOTER BOTTOM: COPYRIGHT --- */}
      <div className="max-w-8xl mx-auto mt-32 pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
         <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-400 tracking-normal">
              © 2026 automixa | Akash Enterprises. All rights reserved.
            </p>
         </div>
         <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
            Made with ❤️ in India
         </div>
      </div>

    </footer>
  );
}
