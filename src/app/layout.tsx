import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import Script from "next/script";
import type { Metadata, Viewport } from "next";

import { createClient } from "@/lib/supabase";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: seoSettings } = await supabase.from("seo_settings").select("*");

  const settingsMap: Record<string, string> = {};
  if (seoSettings) {
    for (const s of seoSettings) {
      settingsMap[s.setting_key] = s.setting_value;
    }
  }

  const siteTitle = settingsMap.site_title || "Automixa | #1 Instagram Automation & AI DM Tool";
  const metaDesc = settingsMap.meta_description || "Automate your Instagram comments and DMs with AI. Scale your growth, generate leads, and boost engagement with Automixa's smart shield technology.";
  const ogImage = settingsMap.og_image || "/og-image.png";
  const twitterHandle = settingsMap.twitter_handle || "@automixa";

  return {
    metadataBase: new URL("https://automixa.in"),
    title: {
      default: siteTitle,
      template: "%s | Automixa"
    },
    description: metaDesc,
    keywords: [
      "Instagram automation tool",
      "Instagram automation tool India",
      "Instagram DM automation",
      "Instagram DM automation India",
      "Instagram DM auto reply tool",
      "Instagram comment auto reply",
      "Comment to DM automation",
      "Auto DM tool India",
      "Instagram lead generation tool",
      "AI DM bot",
      "Meta Graph API automation",
      "ManyChat alternative India",
      "Chatfuel alternative",
      "DMFlow alternative",
      "Instagram DM marketing",
      "UPI billing SaaS India",
    ],
    authors: [{ name: "Akash Kumar" }, { name: "Automixa Team" }],
    creator: "Akash Kumar",
    publisher: "Automixa",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://automixa.in",
      siteName: "Automixa",
      title: siteTitle,
      description: metaDesc,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Automixa - Instagram AI Automation",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: metaDesc,
      creator: twitterHandle,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/icon.png",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Automixa",
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const hasGA = !!gaId;

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FBFBFD]">
        {hasGA ? (
          <>
            {/* Google Analytics (GA4) Integration */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        ) : null}

        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
