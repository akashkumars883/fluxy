import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Automixa Shield™ | 100% Safe Instagram Automation",
  description:
    "Learn how Automixa Shield™ keeps your Instagram automation safe with human-like delays, surge protection, and Meta-compliant Graph API workflows.",
  openGraph: {
    title: "Automixa Shield™ | 100% Safe Instagram Automation",
    description:
      "Automixa Shield™ protects your account with human-like delays, surge protection, and Meta-compliant Graph API workflows.",
    url: "https://automixa.in/shield",
    siteName: "Automixa",
    type: "website",
  },
  alternates: {
    canonical: "https://automixa.in/shield",
  },
};

export default function ShieldLayout({ children }: { children: ReactNode }) {
  return children;
}
