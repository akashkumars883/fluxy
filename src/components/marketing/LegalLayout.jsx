"use client";

export default function LegalLayout({ title, subtitle, lastUpdated, children }) {
  return (
    <main className="flex-1 pt-40 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-normal">{title}</h1>
        <p className="text-zinc-500 text-sm font-normal tracking-normal mb-12">
          {subtitle ? subtitle : `Effective Date: ${lastUpdated}`}
        </p>

        <div className="prose prose-zinc max-w-none space-y-10 text-zinc-600 font-normal tracking-normal leading-relaxed">
          {children}
        </div>
      </div>
    </main>
  );
}
