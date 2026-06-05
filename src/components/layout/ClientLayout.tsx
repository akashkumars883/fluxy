"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import PublicNavigation from "@/components/navigation/PublicNavigation";
import Footer from "@/components/marketing/Footer";
import CookieBanner from "@/components/layout/CookieBanner";

// Captures ?ref=xyz query parameter from URL and stores it in localStorage
function RefTracker() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (typeof window !== "undefined" && searchParams) {
      const ref = searchParams.get("ref");
      if (ref) {
        localStorage.setItem("automixa_ref", ref);
      }
    }
  }, [searchParams]);

  return null;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define marketing pages that should show navigation and footer
  const isMarketingPage = 
    pathname === '/' ||
    pathname?.startsWith('/pricing') ||
    pathname?.startsWith('/solutions') ||
    pathname?.startsWith('/features') ||
    pathname?.startsWith('/compare') ||
    pathname?.startsWith('/contact') ||
    pathname?.startsWith('/privacy') ||
    pathname?.startsWith('/terms') ||
    pathname?.startsWith('/partners') ||
    pathname?.startsWith('/blog') ||
    pathname?.startsWith('/data-deletion') ||
    pathname?.startsWith('/sitemap') ||
    pathname?.startsWith('/shield');

  // Hide global elements on dashboard, login, checkout, bio pages, and dynamic usernames
  const hideGlobalElements = 
    pathname?.startsWith('/dashboard') || 
    pathname?.startsWith('/login') || 
    pathname?.startsWith('/pay') ||
    pathname?.startsWith('/bio') ||
    !isMarketingPage;

  return (
    <>
      <Suspense fallback={null}>
        <RefTracker />
      </Suspense>
      {!hideGlobalElements && <PublicNavigation />}
      {children}
      {!hideGlobalElements && <Footer />}
      <CookieBanner />
    </>
  );
}
