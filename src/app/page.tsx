import Hero from "@/components/marketing/Hero";
import TrustBanner from "@/components/marketing/TrustBanner";
import SocialProof from "@/components/marketing/SocialProof";
import HowItWorks from "@/components/marketing/HowItWorks";
import Features from "@/components/marketing/Features";
import SafetyBanner from "@/components/marketing/SafetyBanner";
import Pricing from "@/components/marketing/Pricing";
import FAQ from "@/components/marketing/FAQ";
import Testimonials from "@/components/marketing/Testimonials";
import CTA from "@/components/marketing/CTA";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = {
  title: "Automixa | #1 Instagram Comment Auto-Reply & DM Automation Tool",
  description: "Automixa is the best, 100% safe Instagram automation tool for creators and brands. Auto-reply to comments, send instant DMs, and grow your followers 24/7.",
  keywords: "Instagram automation, DM auto-reply, comment auto-responder, Instagram bot, Instagram marketing, grow followers, Instagram CRM",
  openGraph: {
    title: "Automixa | Instagram Comment Auto-Reply & DM Automation Tool",
    description: "Auto-reply to comments, send instant download links via DM, and grow your Instagram followers automatically.",
    url: "https://automixa.in",
    siteName: "Automixa",
    type: "website",
  },
  alternates: {
    canonical: "https://automixa.in",
  }
};

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const code = resolvedParams?.code;

  if (code && typeof code === "string") {
    redirect(`/api/auth/callback?code=${code}`);
  }

  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <main>
        <JsonLd />
        <Hero />
        <TrustBanner />
        <SocialProof />
        <HowItWorks />
        <Features />
        <SafetyBanner />
        <Pricing />
        <FAQ />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
}
