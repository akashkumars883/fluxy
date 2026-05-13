import Pricing from "@/components/marketing/Pricing";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-24 bg-background overflow-hidden selection:bg-[#6366F1]/20">
      {/* 
        The Pricing component already has the titles and the India/Global toggle. 
        We just render it here as the hero section of the pricing page.
      */}
      <div className="pt-10">
        <Pricing />
      </div>

      {/* Feature Comparison Table (Placeholder for future) */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 text-center border-t border-zinc-100 mt-10">
        <h3 className="text-3xl font-bold text-zinc-900 mb-6">Compare all features</h3>
        <p className="text-zinc-500 mb-10 max-w-2xl mx-auto">
          Need a detailed breakdown? All plans include core Instagram automation, but Growth and Business plans offer advanced AI flows and analytics.
        </p>
        <div className="inline-flex items-center justify-center p-8 bg-zinc-50 rounded-3xl border border-zinc-200/60 w-full max-w-4xl text-zinc-400 font-medium">
          Detailed comparison table coming soon...
        </div>
      </div>

      <FAQ />
      
      <div className="mt-10">
        <CTA />
      </div>
    </main>
  );
}
