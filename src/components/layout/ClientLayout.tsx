"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import PublicNavigation from "@/components/navigation/PublicNavigation";
import Footer from "@/components/marketing/Footer";

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
  
  // Dashboard, Auth, and Checkout pages par marketing nav/footer nahi dikhana hai
  const hideGlobalElements = pathname?.startsWith('/dashboard') || pathname?.startsWith('/login') || pathname?.startsWith('/pay');

  return (
    <>
      <Suspense fallback={null}>
        <RefTracker />
      </Suspense>
      {!hideGlobalElements && <PublicNavigation />}
      {children}
      {!hideGlobalElements && <Footer />}
    </>
  );
}
