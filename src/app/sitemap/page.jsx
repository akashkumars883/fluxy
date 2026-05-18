import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CTA from "@/components/marketing/CTA";

export const metadata = {
  title: "HTML Sitemap | Automixa",
  description: "Navigate through all the pages on the Automixa website. Find features, solutions, resources, and legal pages easily.",
  alternates: {
    canonical: "https://automixa.in/sitemap",
  }
};

export default function SitemapPage() {
  const sitemapGroups = [
    {
      title: "Main Pages",
      links: [
        { label: "Homepage", href: "/" },
        { label: "Pricing", href: "/pricing" },
        { label: "Contact Us", href: "/contact" },
        { label: "Login / Dashboard", href: "/login" },
      ]
    },
    {
      title: "Features",
      links: [
        { label: "Instagram DM Auto-Reply", href: "/features/dm-auto-reply" },
        { label: "Comment Auto-Responder", href: "/features/comment-auto-responder" },
        { label: "Story Mention Tool", href: "/features/story-mention" },
      ]
    },
    {
      title: "Solutions",
      links: [
        { label: "For Creators & Influencers", href: "/solutions/creators" },
        { label: "For Brands & E-commerce", href: "/solutions/brands" },
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Blog & Playbook", href: "/blog" },
        { label: "Support Desk", href: "/dashboard/support" },
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Data Deletion Instructions", href: "/data-deletion" },
      ]
    }
  ];

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background text-foreground font-sans selection:bg-indigo-500/20">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
            HTML Sitemap
          </h1>
          <p className="text-zinc-500 text-lg">
            A complete overview of all the public pages and resources available on Automixa.
          </p>
        </div>

        {/* Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 mb-24">
          {sitemapGroups.map((group, idx) => (
            <div key={idx} className="space-y-6">
              <h2 className="text-xl font-bold text-zinc-900 border-b border-zinc-200/60 pb-3">
                {group.title}
              </h2>
              <ul className="space-y-4">
                {group.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      href={link.href}
                      className="group flex items-center text-zinc-600 hover:text-indigo-600 transition-colors"
                    >
                      <ChevronRight size={16} className="text-zinc-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all mr-2" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      <CTA />
    </main>
  );
}
