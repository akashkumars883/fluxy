import Hero from "@/components/marketing/Hero";
import MetaPartnerCard from "@/components/marketing/MetaPartnerCard";
import Stats from "@/components/marketing/Stats";
import HowItWorks from "@/components/marketing/HowItWorks";
import Features from "@/components/marketing/Features";
import Testimonials from "@/components/marketing/Testimonials";
import Pricing from "@/components/marketing/Pricing";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";
import JsonLd from "@/components/seo/JsonLd";

export const revalidate = 3600; // Cache page for 1 hour to prevent database overload

export const metadata = {
  title: "Automixa — Instagram DM & Comment Automation for Creatores",
  description: "Auto-reply to Instagram comments & DMs in seconds. Capture leads, deliver resources, and grow on autopilot. Free trial — no credit card required.",
  keywords: [
    "Instagram DM automation",
    "Instagram comment auto reply",
    "Instagram automation tool India",
    "auto reply Instagram DMs",
    "Instagram business messaging",
    "ManyChat alternative India",
    "Instagram comment to DM",
    "lead capture Instagram",
    "Instagram customer support automation",
    "Meta Graph API tool",
    "Instagram automation free",
    "DM automation tool",
  ],
  openGraph: {
    title: "Automixa — Instagram DM & Comment Automation for Businesses",
    description: "Auto-reply to Instagram comments & DMs in seconds. Capture leads, deliver resources, and grow on autopilot. Free — no credit card required.",
    url: "https://automixa.in",
    siteName: "Automixa",
    type: "website",
    images: [{ url: "https://automixa.in/og-image.png", width: 1200, height: 630, alt: "Automixa — Instagram DM & Comment Automation Dashboard" }],
  },
  alternates: {
    canonical: "https://automixa.in",
  }
};

import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase";

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
  const { data: { user } } = await supabase.auth.getUser();
  if (user && home !== "true") {
    redirect("/dashboard");
  }

  // Fetch real stats
  const supabaseAdmin = createAdminClient();
  const [usersRes, messagesRes, triggersRes] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({ perPage: 1 }),
    supabaseAdmin.from('automation_history').select('*', { count: 'exact', head: true }).eq('status', 'SUCCESS'),
    supabaseAdmin.from('triggers').select('*', { count: 'exact', head: true })
  ]);

  const realStats = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    users: (usersRes?.data as any)?.total || usersRes?.data?.users?.length || 0,
    messages: messagesRes?.count || 0,
    triggers: triggersRes?.count || 0
  };

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <main>
        <JsonLd />
        <Hero />
        <MetaPartnerCard />
        <Stats realStats={realStats} />
        <HowItWorks />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
    </div>
  );
}
