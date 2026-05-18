import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import Script from "next/script";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata = {
  metadataBase: new URL("https://automixa.in"),
  title: {
    default: "Automixa | #1 Instagram Automation & AI DM Tool",
    template: "%s | Automixa"
  },
  description: "Automate your Instagram comments and DMs with AI. Scale your growth, generate leads, and boost engagement with Automixa's smart shield technology.",
  keywords: ["Instagram Automation", "AI DM Bot", "Auto Reply Instagram", "Instagram Lead Gen", "Creator Tools", "Social Media Marketing"],
  authors: [{ name: "Automixa Team" }],
  creator: "Automixa",
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
    title: "Automixa | Instagram Automation & AI DM Tool",
    description: "Automate your Instagram comments and DMs with AI. The safest tool for creators and brands.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Automixa - Instagram AI Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automixa | Instagram Automation & AI DM Tool",
    description: "Automate your Instagram comments and DMs with AI. The safest tool for creators and brands.",
    creator: "@automixa",
    images: ["/og-image.png"],
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
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Automixa",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-EVP6P6K5K3"; // Default GA4 measuring ID

  return (
    <html lang="en" className={`h-full antialiased ${outfit.variable} ${spaceGrotesk.variable} ${outfit.className}`}>
      <body className="min-h-full flex flex-col bg-[#FBFBFD]">
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

        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
