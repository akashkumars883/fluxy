"use client";

import PageTransition from "@/components/ui/PageTransition";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Copy,
  Share2
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { sanitizeHtml } from "@/lib/sanitize";

export default function BlogPostPage({ initialPost, relatedPosts = [] }) {
  const selectedPost = initialPost;
  const blogPosts = relatedPosts;
  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (!selectedPost) return;
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setReadingProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedPost]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedPost]);

  const copyPostUrl = (postId) => {
    const url = `${window.location.origin}/blog/${postId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <main className="min-h-screen text-foreground overflow-x-clip relative font-sans pt-24 pb-16 selection:bg-sage/20">
      {selectedPost && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[110] bg-zinc-100">
          <div
            className="h-full bg-gradient-to-r from-[#6366F1] via-indigo-400 to-pink-500 transition-all duration-100 relative overflow-visible"
            style={{ width: `${readingProgress}%` }}
          >
            <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white/40 to-transparent blur-[1px]" />
            <div className="absolute top-0 right-0 w-6 h-4 bg-pink-500/50 blur-md rounded-full -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>
      )}
      <PageTransition>
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          {selectedPost && (
            <motion.article
              key="detail-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto w-full"
            >
              {/* Back Button */}
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold text-zinc-500 hover:text-foreground transition-colors cursor-pointer mb-8 bg-white/50 backdrop-blur-md px-4.5 py-2.5 rounded-full border border-zinc-200/40"
              >
                <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                Back to All Articles
              </Link>

              <div className="max-w-4xl mx-auto w-full">

                {/* Main Article */}
                <div className="min-w-0 break-words">
                  {/* Article Top Meta */}
                  <div className="space-y-6 mb-8">
                    <span className="text-xs font-bold text-[#6366F1] uppercase tracking-wider bg-[#6366F1]/5 px-3.5 py-1.5 rounded-md inline-block">
                      {selectedPost.category}
                    </span>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-800 leading-tight">
                      {selectedPost.title}
                    </h1>

                    {/* Writer Profile & Stats */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-y border-zinc-200/50 py-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedPost.authorAvatar}
                          alt={selectedPost.author}
                          className="w-12 h-12 rounded-full object-cover border border-zinc-200"
                        />
                        <div>
                          <p className="text-sm font-extrabold text-zinc-800">{selectedPost.author}</p>
                          <p className="text-xs text-zinc-400 font-medium">{selectedPost.authorRole}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 text-xs sm:text-sm text-zinc-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-zinc-400" />
                          <span>{selectedPost.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-zinc-400" />
                          <span>{selectedPost.readTime}</span>
                        </div>

                        {/* Twitter Share */}
                        <button
                          onClick={() => {
                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedPost.title)}&url=${encodeURIComponent(window.location.origin + '/blog/' + selectedPost.id)}`, '_blank');
                          }}
                          className="p-2 border border-zinc-200 hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/5 rounded-full bg-white text-zinc-500 hover:text-[#1DA1F2] transition-all cursor-pointer relative group/twitter"
                          title="Share on X (Twitter)"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/twitter:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            Twitter
                          </span>
                        </button>

                        {/* LinkedIn Share */}
                        <button
                          onClick={() => {
                            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/blog/' + selectedPost.id)}`, '_blank');
                          }}
                          className="p-2 border border-zinc-200 hover:border-[#0A66C2] hover:bg-[#0A66C2]/5 rounded-full bg-white text-zinc-500 hover:text-[#0A66C2] transition-all cursor-pointer relative group/linkedin"
                          title="Share on LinkedIn"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/linkedin:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            LinkedIn
                          </span>
                        </button>

                        {/* Facebook Share */}
                        <button
                          onClick={() => {
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/blog/' + selectedPost.id)}`, '_blank');
                          }}
                          className="p-2 border border-zinc-200 hover:border-[#1877F2] hover:bg-[#1877F2]/5 rounded-full bg-white text-zinc-500 hover:text-[#1877F2] transition-all cursor-pointer relative group/fb"
                          title="Share on Facebook"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/fb:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            Facebook
                          </span>
                        </button>

                        {/* Copy Link button */}
                        <button
                          onClick={() => copyPostUrl(selectedPost.id)}
                          className="p-2 border border-zinc-200 hover:border-zinc-300 rounded-full bg-white text-zinc-500 hover:text-[#6366F1] transition-all cursor-pointer relative group/share"
                          title="Copy article link"
                        >
                          {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/share:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {copiedLink ? "Link Copied!" : "Copy Link"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Article Big Banner Cover */}
                  <div className="rounded-[32px] overflow-hidden aspect-[16/9] shadow-2xl shadow-zinc-200/50 border border-zinc-100/60 mb-12 relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-zinc-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                    <img
                      src={selectedPost.image}
                      alt={selectedPost.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  </div>

                  {/* Premium Typographic Article Content */}
                  <div
                    className="prose prose-zinc prose-lg max-w-none text-zinc-600 leading-relaxed font-normal space-y-6 px-1"
                    style={{
                      fontSize: "1.05rem",
                      fontFamily: "var(--font-outfit), sans-serif",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedPost.content || "") }}
                      className="blog-content-container"
                    />
                  </div>

                  {/* Article Share Footer Banner */}
                  <div className="border-t border-zinc-200/50 pt-10 mt-16 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                      <h4 className="text-sm font-bold text-zinc-800">Did you find this strategy helpful?</h4>
                      <p className="text-xs text-zinc-400">Share this article with your community of creators and marketers.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedPost.title)}&url=${encodeURIComponent(window.location.origin + '/blog/' + selectedPost.id)}`, '_blank');
                        }}
                        className="px-4.5 py-2.5 border border-zinc-200 hover:border-[#6366F1] bg-white hover:bg-[#6366F1]/5 text-zinc-600 hover:text-[#6366F1] font-bold rounded-full transition-all text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Share2 size={13} />
                        Share on Twitter
                      </button>
                      <button
                        onClick={() => copyPostUrl(selectedPost.id)}
                        className="px-4.5 py-2.5 bg-foreground hover:bg-zinc-800 text-background font-bold rounded-full transition-all text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        {copiedLink ? "Link Copied!" : "Copy Article Link"}
                      </button>
                    </div>
                  </div>

                  {/* Related Articles Showcase */}
                  <div className="border-t border-zinc-200/50 pt-16 mt-16 pb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-800 tracking-tight mb-8">
                      Related Articles
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {blogPosts
                        .filter(post => post.id !== selectedPost.id)
                        .slice(0, 3)
                        .map(post => (
                          <Link
                            key={post.id}
                            href={`/blog/${post.id}`}

                            className="group block bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white rounded-[24px] p-4 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              <div className="rounded-[16px] overflow-hidden aspect-[16/10] relative mb-3">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                              </div>
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#6366F1]">{post.category}</span>
                              <h4 className="text-sm font-bold text-zinc-800 leading-snug group-hover:text-[#6366F1] transition-colors duration-300 line-clamp-2">
                                {post.title}
                              </h4>
                            </div>

                            <div className="pt-3 border-t border-zinc-100/60 mt-3 flex items-center justify-between">
                              <span className="text-[10px] text-zinc-400">{post.date}</span>
                              <div className="w-6 h-6 rounded-full border border-zinc-200 bg-white group-hover:bg-[#6366F1] text-zinc-400 group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0">
                                <ArrowRight size={10} className="group-hover:-rotate-45 transition-transform duration-300" />
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          )}

        </div>
      </PageTransition>

      <style jsx global>{`
        .blog-content-container h2 {
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        @media (min-width: 640px) {
          .blog-content-container h2 {
            font-size: 1.85rem;
          }
        }
        .blog-content-container p {
          font-family: var(--font-outfit), sans-serif;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.65;
          color: #4b5563;
          margin-bottom: 1rem;
        }
        @media (min-width: 640px) {
          .blog-content-container p {
            font-size: 1.05rem;
          }
        }
        .blog-content-container strong {
          font-weight: 700;
          color: #111827;
        }
        .blog-content-container em {
          font-style: italic;
        }
        .blog-content-container blockquote {
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 1.15rem;
          font-weight: 500;
          font-style: italic;
          color: #4f46e5;
          border-left: 4px solid #6366F1;
          padding-left: 1.5rem;
          margin: 2rem 0;
          line-height: 1.6;
        }
        @media (min-width: 640px) {
          .blog-content-container blockquote {
            font-size: 1.35rem;
          }
        }
        .blog-content-container ul {
          list-style-type: none;
          padding-left: 0;
          margin-bottom: 1.5rem;
          space-y: 0.5rem;
        }
        .blog-content-container ul li {
          position: relative;
          padding-left: 1.75rem;
          margin-bottom: 0.5rem;
          font-family: var(--font-outfit), sans-serif;
          font-size: 1rem;
          color: #4b5563;
          line-height: 1.7;
        }
        .blog-content-container ul li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: 900;
          font-size: 1rem;
        }
        .blog-content-container ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .blog-content-container ol li {
          font-family: var(--font-outfit), sans-serif;
          font-size: 1rem;
          color: #4b5563;
          line-height: 1.7;
          margin-bottom: 0.5rem;
          padding-left: 0.25rem;
        }
        .blog-content-container ol li::marker {
          color: #6366F1;
          font-weight: 700;
        }
        
        /* Force remove dark-mode inline styles generated by the rich text editor */
        .blog-content-container * {
          background-color: transparent !important;
        }
        
        .blog-content-container span, 
        .blog-content-container p, 
        .blog-content-container strong,
        .blog-content-container b,
        .blog-content-container h1, 
        .blog-content-container h2, 
        .blog-content-container h3, 
        .blog-content-container h4, 
        .blog-content-container h5, 
        .blog-content-container h6,
        .blog-content-container div {
          color: inherit !important;
        }

        .blog-content-container a {
          color: #6366F1 !important;
          text-decoration: underline;
        }
      `}</style>
    </main>
  );
}
