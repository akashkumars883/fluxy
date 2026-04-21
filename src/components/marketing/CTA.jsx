"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-40 px-6 text-center">
       <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-semibold text-foreground mb-10 tracking-normal">Ready to transform your engagement?</h2>
          <Link 
            href="/login" 
            className="inline-flex px-12 py-6 bg-foreground text-background text-lg font-semibold rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl tracking-normal"
          >
            Start for Free
          </Link>
          <p className="mt-8 text-zinc-400 text-sm font-normal tracking-normal">No credit card required. Connect your first account in seconds.</p>
       </div>
    </section>
  );
}
