"use client";

import PageTransition from "@/components/ui/PageTransition";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Copy,
  Sparkles,
  Share2
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { sanitizeHtml } from "@/lib/sanitize";

export default function BlogPostPage({ initialPost, relatedPosts = [] }) {
  const selectedPost = initialPost;
  const blogPosts = relatedPosts;
  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(null);
  const contentRef = useRef(null);

  // Extract TOC headings from the content - only H2 (top-level sections)
  const tableOfContents = useMemo(() => {
    if (!selectedPost?.content) return [];
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(selectedPost.content, "text/html");
      const headings = Array.from(doc.querySelectorAll("h2"));
      return headings.map((h, idx) => {
        const text = (h.textContent || "").trim();
        if (!text) return null;
        const slug = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .substring(0, 50);
        return { id: `h-${idx}-${slug}`, text };
      }).filter(Boolean);
    } catch {
      return [];
    }
  }, [selectedPost?.content]);

  // Add IDs to headings inside the rendered content after mount
  useEffect(() => {
    if (!contentRef.current || tableOfContents.length === 0) return;
    const container = contentRef.current;
    const headings = container.querySelectorAll("h2, h3");
    headings.forEach((h, idx) => {
      if (tableOfContents[idx]) {
        h.id = tableOfContents[idx].id;
      }
    });
  }, [tableOfContents, selectedPost?.id]);

  // Reading progress + active TOC section
  useEffect(() => {
    if (!selectedPost) return;

    let rafId = null;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const totalHeight = doc.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          setReadingProgress((window.scrollY / totalHeight) * 100);
        }

        // Active section
        if (tableOfContents.length === 0) return;
        const headingElements = tableOfContents
          .map((t) => document.getElementById(t.id))
          .filter(Boolean);
        const scrollPos = window.scrollY + 180;
        let current = null;
        for (const el of headingElements) {
          if (el.offsetTop <= scrollPos) {
            current = el.id;
          } else {
            break;
          }
        }
        setActiveSection(current);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [selectedPost, tableOfContents]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedPost]);

  const copyPostUrl = (postId) => {
    const url = `${window.location.origin}/blog/${postId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen text-foreground overflow-x-clip relative font-sans pt-20 pb-10 selection:bg-sage/20">
      {selectedPost && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[110] bg-zinc-100">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-pink-500 transition-all duration-100 relative overflow-visible"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 relative z-10">
          {selectedPost && (
            <motion.article
              key="detail-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Back Button */}
              <Link
                href="/blog"
                prefetch={false}
                className="group inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold text-zinc-500 hover:text-foreground transition-colors cursor-pointer mb-6 bg-white px-4 py-2 rounded-xl border border-zinc-200"
              >
                <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                Back to All Articles
              </Link>

              {/* Article Top Meta - Centered */}
              <div className="max-w-3xl mx-auto space-y-4 mb-6 text-center">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1.5 rounded-xl inline-block">
                  {selectedPost.category}
                </span>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-800 leading-tight">
                  {selectedPost.title}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-zinc-500 font-medium pt-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedPost.authorAvatar}
                      alt={selectedPost.author}
                      loading="lazy"
                      className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                    />
                    <span className="font-bold text-zinc-700">{selectedPost.author}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-zinc-400" />
                    <span>{selectedPost.date}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-zinc-400" />
                    <span>{selectedPost.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Hero Cover Image */}
              <div className="max-w-4xl mx-auto rounded-xl overflow-hidden aspect-[16/9] shadow-lg border border-zinc-200/60 mb-8 relative">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 3-Column Layout: TOC + Content + CTA */}
              <div className="lg:grid lg:grid-cols-[180px_minmax(0,1fr)_200px] xl:grid-cols-[200px_minmax(0,1fr)_220px] lg:gap-6 xl:gap-8 max-w-7xl mx-auto">
                {/* LEFT: Table of Contents (sticky, compact) */}
                {tableOfContents.length > 0 && (
                  <aside className="hidden lg:block">
                    <div className="sticky top-20 space-y-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-2 flex items-center gap-1">
                        <BookOpen size={10} /> Contents
                      </p>
                      <nav className="space-y-0.5 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
                        {tableOfContents.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => scrollToHeading(item.id)}
                            title={item.text}
                            className={`block w-full text-left text-[11px] leading-tight py-1.5 px-2 rounded-md transition-all cursor-pointer truncate ${
                              activeSection === item.id
                                ? "text-indigo-600 bg-indigo-50 font-bold"
                                : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                            }`}
                          >
                            {item.text}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </aside>
                )}

                {/* CENTER: Article Content */}
                <div className="min-w-0">
                  <div
                    ref={contentRef}
                    className="prose prose-zinc prose-lg max-w-none text-zinc-700 leading-relaxed font-normal blog-content-container"
                    style={{
                      fontSize: "1.0625rem",
                      fontFamily: "var(--font-outfit), sans-serif",
                    }}
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedPost.content || "") }}
                  />

                  {/* Share Footer */}
                  <div className="border-t border-zinc-200 pt-5 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-0.5 text-center sm:text-left">
                      <h4 className="text-sm font-bold text-zinc-800">Found this helpful?</h4>
                      <p className="text-xs text-zinc-500">Share with your team.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyPostUrl(selectedPost.id)}
                        className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedLink ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        {copiedLink ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Sticky CTA */}
                <aside className="hidden lg:block">
                  <div className="sticky top-24 space-y-4">
                    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-xl p-5 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                      <div className="relative z-10 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-md text-[9px] font-bold uppercase tracking-wider">
                          <Sparkles size={10} /> Automixa
                        </div>
                        <h4 className="text-base font-bold leading-snug">
                          Ready to automate your DMs?
                        </h4>
                        <p className="text-xs text-indigo-100/90 leading-relaxed">
                          Start free, connect your Instagram in 1-click, and reply to customers 24/7.
                        </p>
                        <Link
                          href="/login"
                          prefetch={false}
                          className="block w-full text-center bg-white text-indigo-700 font-bold text-xs py-2.5 rounded-xl hover:bg-zinc-50 transition-all"
                        >
                          Start Free Trial
                        </Link>
                        <p className="text-[9px] text-indigo-200/80 text-center">
                          No credit card required
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-xl p-4">
                      <h5 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">
                        Quick Share
                      </h5>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedPost.title)}&url=${encodeURIComponent(window.location.origin + '/blog/' + selectedPost.id)}`, '_blank');
                          }}
                          className="flex-1 p-2 border border-zinc-200 hover:border-zinc-300 rounded-lg bg-white text-zinc-500 hover:text-zinc-800 transition-all cursor-pointer"
                          title="Share on X"
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" className="mx-auto" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                        </button>
                        <button
                          onClick={() => {
                            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/blog/' + selectedPost.id)}`, '_blank');
                          }}
                          className="flex-1 p-2 border border-zinc-200 hover:border-zinc-300 rounded-lg bg-white text-zinc-500 hover:text-zinc-800 transition-all cursor-pointer"
                          title="Share on LinkedIn"
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" className="mx-auto" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </button>
                        <button
                          onClick={() => {
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/blog/' + selectedPost.id)}`, '_blank');
                          }}
                          className="flex-1 p-2 border border-zinc-200 hover:border-zinc-300 rounded-lg bg-white text-zinc-500 hover:text-zinc-800 transition-all cursor-pointer"
                          title="Share on Facebook"
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" className="mx-auto" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </button>
                        <button
                          onClick={() => copyPostUrl(selectedPost.id)}
                          className="flex-1 p-2 border border-zinc-200 hover:border-zinc-300 rounded-lg bg-white text-zinc-500 hover:text-zinc-800 transition-all cursor-pointer"
                          title="Copy link"
                        >
                          {copiedLink ? <Check size={14} className="text-emerald-500 mx-auto" /> : <Copy size={14} className="mx-auto" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>

              {/* Related Articles */}
              {blogPosts.filter(p => p.id !== selectedPost.id).length > 0 && (
                <div className="border-t border-zinc-200 pt-8 mt-12 pb-6 max-w-6xl mx-auto">
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-800 tracking-tight mb-6">
                    Related Articles
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {blogPosts
                      .filter(post => post.id !== selectedPost.id)
                      .slice(0, 3)
                      .map(post => (
                        <Link
                          key={post.id}
                          href={`/blog/${post.id}`}
                          prefetch={false}
                          className="group block bg-white border border-zinc-200 hover:border-indigo-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="rounded-lg overflow-hidden aspect-[16/10] mb-3 bg-zinc-100">
                            <img src={post.image} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                          </div>
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-600">{post.category}</span>
                          <h4 className="text-sm font-bold text-zinc-800 leading-snug mt-1 group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <div className="pt-2 mt-2 border-t border-zinc-100 flex items-center justify-between">
                            <span className="text-[10px] text-zinc-400">{post.date}</span>
                            <ArrowRight size={11} className="text-zinc-400 group-hover:text-indigo-600 group-hover:-rotate-45 transition-all" />
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </motion.article>
          )}
        </div>
      </PageTransition>
    </main>
  );
}
