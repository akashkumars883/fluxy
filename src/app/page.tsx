import Hero from "@/components/marketing/Hero";
import SocialProof from "@/components/marketing/SocialProof";
import HowItWorks from "@/components/marketing/HowItWorks";
import Features from "@/components/marketing/Features";
import Pricing from "@/components/marketing/Pricing";
import Safety from "@/components/marketing/Safety";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <Features />
        <Pricing />
        <Safety />
        <FAQ />
        <CTA />
      </main>
    </div>
  );
}
