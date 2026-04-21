"use client";

import { Building2, UserCircle, ArrowRight } from "lucide-react";

export default function IdentitySelection({ onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-4xl mx-auto animate-in fade-in zoom-in duration-700">
      <div className="text-center mb-12 space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Welcome to Automixa
        </h2>
        <p className="text-zinc-muted text-lg font-medium">
          Tell us who you are so we can customize your workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Business Option */}
        <button 
          onClick={() => onSelect('business')}
          className="group relative bg-background border border-border rounded-[40px] p-10 flex flex-col items-center text-center space-y-6 hover:border-foreground/20 hover:shadow-2xl transition-all duration-500 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
          
          <div className="w-20 h-20 bg-foreground text-background rounded-3xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform duration-500">
            <Building2 size={40} />
          </div>
          
          <div className="space-y-2 relative z-10">
            <h3 className="text-2xl font-bold text-foreground transition-colors">Business Owner</h3>
            <p className="text-sm text-zinc-muted font-medium leading-relaxed">
              Automate support, lead generation, and sales for your brand.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-foreground/40 group-hover:text-foreground transition-colors mt-4">
            Setup Business Workspace <ArrowRight size={14} />
          </div>
        </button>

        {/* Content Creator Option */}
        <button 
          onClick={() => onSelect('content_creator')}
          className="group relative bg-background border border-border rounded-[40px] p-10 flex flex-col items-center text-center space-y-6 hover:border-sage/40 hover:shadow-2xl transition-all duration-500 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-sage/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />

          <div className="w-20 h-20 bg-sage text-foreground rounded-3xl flex items-center justify-center shadow-xl group-hover:-rotate-6 transition-transform duration-500">
            <UserCircle size={40} />
          </div>
          
          <div className="space-y-2 relative z-10">
            <h3 className="text-2xl font-bold text-foreground">Content Creator</h3>
            <p className="text-sm text-zinc-muted font-medium leading-relaxed">
              Manage fan engagement, collab requests, and personal branding.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-foreground/40 group-hover:text-foreground transition-colors mt-4">
            Setup Creator Workspace <ArrowRight size={14} />
          </div>
        </button>
      </div>

      <p className="mt-12 text-[10px] font-bold text-zinc-muted/40">
        Professional Automation Dashboard v2.0
      </p>
    </div>
  );
}
