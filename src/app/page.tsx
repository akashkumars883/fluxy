import Hero from "@/components/marketing/Hero";
import SocialProof from "@/components/marketing/SocialProof";
import Features from "@/components/marketing/Features";
import Safety from "@/components/marketing/Safety";
import CTA from "@/components/marketing/CTA";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFD] overflow-x-hidden">
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <Safety />
        <CTA />
      </main>
    </div>
  );
}
