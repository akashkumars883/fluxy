"use client";

import { Outfit } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import PublicNavigation from "@/components/navigation/PublicNavigation";
import Footer from "@/components/marketing/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
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
    <html lang="en" className={`h-full antialiased ${outfit.className}`}>
      <body className="min-h-full flex flex-col bg-[#FBFBFD]">
        {!hideGlobalElements && <PublicNavigation />}
        {children}
        {!hideGlobalElements && <Footer />}
      </body>
    </html>
  );
}
