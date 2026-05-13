"use client";

import { Outfit,Space_Grotesk } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import PublicNavigation from "@/components/navigation/PublicNavigation";
import Footer from "@/components/marketing/Footer";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Dashboard aur Auth pages par marketing nav/footer nahi dikhana hai
  const hideGlobalElements = pathname?.startsWith('/dashboard') || pathname?.startsWith('/login');

  return (
    <html lang="en" className={`h-full antialiased ${outfit.variable} ${spaceGrotesk.variable} ${outfit.className}`}>
      <body className="min-h-full flex flex-col bg-[#FBFBFD]">
        {!hideGlobalElements && <PublicNavigation />}
        {children}
        {!hideGlobalElements && <Footer />}
      </body>
    </html>
  );
}
