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
  title: "Automixa | Business Messaging Automation",
  description: "Automixa helps businesses manage Instagram comments, DMs, story replies, lead capture, smart bio links, and customer support workflows.",
  keywords: [
    "business messaging automation",
    "customer support automation",
    "Instagram business messaging",
    "Instagram customer support",
    "comment response workflow",
    "DM response workflow",
    "lead capture CRM",
    "smart bio link",
    "digital product delivery",
    "SaaS billing India",
  ],
  openGraph: {
    title: "Automixa | Business Messaging Automation",
    description: "Manage customer comments, DMs, smart bio links, and support workflows from one secure dashboard.",
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
  const home = resolvedParams?.home;

  if (code && typeof code === "string") {
    redirect(`/api/auth/callback?code=${code}`);
  }

  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session && home !== "true") {
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
