"use client";

import { usePathname } from "next/navigation";
import PublicNavigation from "@/components/navigation/PublicNavigation";
import Footer from "@/components/marketing/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Dashboard aur Auth pages par marketing nav/footer nahi dikhana hai
  const hideGlobalElements = pathname?.startsWith('/dashboard') || pathname?.startsWith('/login');

  return (
    <>
      {!hideGlobalElements && <PublicNavigation />}
      {children}
      {!hideGlobalElements && <Footer />}
    </>
  );
}
