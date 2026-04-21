"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-20 px-6 md:px-10 border-t border-border bg-white">
      <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-normal text-foreground">automixa</span>
          </div>
          <p className="text-zinc-500 text-sm font-normal max-w-xs leading-relaxed tracking-normal">
            Empowering creators and brands to automate their digital identity with intelligent conversational flows.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-20">
           <div className="space-y-6 text-sm">
              <h4 className="font-semibold text-foreground tracking-normal">Product</h4>
              <div className="flex flex-col gap-4 text-zinc-500">
                 <Link href="#features" className="hover:text-foreground transition-all">Features</Link>
                 <Link href="/login" className="hover:text-foreground transition-all">Sign in</Link>
                 <Link href="/login" className="hover:text-foreground transition-all">Get Started</Link>
              </div>
           </div>
           <div className="space-y-6 text-sm">
              <h4 className="font-semibold text-foreground tracking-normal">Legal</h4>
              <div className="flex flex-col gap-4 text-zinc-500">
                 <Link href="/privacy" className="hover:text-foreground transition-all">Privacy Policy</Link>
                 <Link href="/terms" className="hover:text-foreground transition-all">Terms of Service</Link>
                 <Link href="/data-deletion" className="hover:text-foreground transition-all">Data Deletion</Link>
              </div>
           </div>
           <div className="space-y-6 text-sm col-span-2 lg:col-span-1">
              <h4 className="font-semibold text-foreground tracking-normal">Contact</h4>
              <div className="flex flex-col gap-4 text-zinc-500">
                 <span className="cursor-pointer">support@automixa.ai</span>
                 <span className="cursor-pointer">Twitter / X</span>
              </div>
           </div>
        </div>
      </div>
      <div className="max-w-8xl mx-auto mt-20 pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
         <p className="text-[10px] font-semibold text-zinc-muted tracking-normal">© 2026 Automixa AI. All rights reserved.</p>
      </div>
    </footer>
  );
}
