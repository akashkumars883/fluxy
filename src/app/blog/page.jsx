"use client";

import FAQ from "@/components/marketing/FAQ";
import PageTransition from "@/components/ui/PageTransition";
import { fetchPublishedBlogs } from "@/lib/blogs";
import { createClient } from "@/lib/supabase";
import { AnimatePresence,motion } from "framer-motion";
import {
ArrowRight,
Check,
ChevronLeft,ChevronRight,
HelpCircle,
Search,
Sparkles
} from "lucide-react";
import Link from "next/link";
import { useEffect,useMemo,useState } from "react";

// Available categories
const categories = ["All", "Business Messaging", "Marketing Tips", "Product Updates", "Customer Workflows"];

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch blogs dynamically from Supabase
  useEffect(() => {
    async function fetchBlogs() {
      try {
        setIsLoading(true);
        const supabase = createClient();
        const posts = await fetchPublishedBlogs(supabase);

        if (posts.length > 0) {
          setBlogPosts(posts);
        } else {
          // Table exists but has no entries yet
          setBlogPosts([]);
        }
      } catch (err) {
        console.error("Catch block in fetchBlogs:", err);
        setBlogPosts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  // Featured post (from all posts, or fallback to first)
  const featuredPost = useMemo(() => {
    return blogPosts.find(post => post.isFeatured) || blogPosts[0];
  }, [blogPosts]);

  // Filter blog posts based on category and search query
  const filteredPosts = useMemo(() => {
    const isFeaturedShownAtTop = selectedCategory === "All" && searchQuery === "";
    return blogPosts.filter(post => {
      // Exclude featured post from the grid if it's shown at the top
      if (isFeaturedShownAtTop && featuredPost && post.id === featuredPost.id) {
        return false;
      }

      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch = searchQuery === "" || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, blogPosts, featuredPost]);

  // Pagination states and calculations
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 10;

  // Calculate total pages
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  // Paginated posts for display
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail("");
    }, 3000);
  };

  return (
    <main className="min-h-screen text-foreground overflow-x-clip relative font-sans pt-32 pb-10 selection:bg-[#6366F1]/20">
      <PageTransition>
        <div className="max-w-7xl mx-auto px-6 md:px-10 mt-6 relative z-10">
          
          <AnimatePresence mode="wait">
            {(
              // ----------------------------------------------------
              // BLOG DIRECTORY VIEW
              // ----------------------------------------------------
              <motion.div
                key="directory-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
              >

                {/* Featured Post Card (Visible only when 'All' category or first tab) */}
                {isLoading ? (
                  <div className="mb-10 animate-pulse bg-white/20 border border-white/40 rounded-[32px] p-6 md:p-8 lg:p-10 h-[400px] flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                    <div className="w-full lg:w-7/12 bg-zinc-200/40 rounded-[24px] aspect-[16/10] md:aspect-[16/9] h-[250px] lg:h-[320px]" />
                    <div className="w-full lg:w-5/12 space-y-4">
                      <div className="h-6 bg-zinc-200/40 rounded w-1/4" />
                      <div className="h-10 bg-zinc-200/40 rounded w-3/4" />
                      <div className="h-4 bg-zinc-200/40 rounded w-full" />
                      <div className="h-4 bg-zinc-200/40 rounded w-5/6" />
                      <div className="pt-8 border-t border-zinc-100/60 mt-8 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-200/40" />
                        <div className="space-y-1 w-1/3">
                          <div className="h-4 bg-zinc-200/40 rounded" />
                          <div className="h-3 bg-zinc-200/40 rounded w-2/3" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  selectedCategory === "All" && searchQuery === "" && featuredPost && (
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="mb-10"
                    >
                    <Link 
                      href={`/blog/${featuredPost.id}`}
                      className="group block bg-white/40 backdrop-blur-xl border border-white/60 hover:border-[#6366F1]/50 rounded-[32px] p-6 md:p-8 lg:p-10 shadow-xl shadow-zinc-100/40 hover:shadow-2xl hover:shadow-[#6366F1]/20 hover:-translate-y-2 transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative overflow-hidden"
                    >
                      {/* Interactive glow overlay */}
                      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#6366F1]/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -translate-y-1/2" />
                      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      <div className="lg:col-span-7 rounded-[24px] overflow-hidden aspect-[16/10] md:aspect-[16/9] relative shadow-md">
                        <img 
                          src={featuredPost.image} 
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 bg-[#6366F1] text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                          Featured Article
                        </div>
                      </div>

                      {/* Right: Text content (lg:col-span-5) */}
                      <div className="lg:col-span-5 flex flex-col justify-between h-full py-2 z-10">
                        <div className="space-y-4">
                          <span className="text-xs font-bold text-[#6366F1] uppercase tracking-wider bg-[#6366F1]/5 px-3 py-1.5 rounded-full">
                            {featuredPost.category}
                          </span>
                          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800 tracking-tight leading-snug group-hover:text-[#6366F1] transition-colors duration-300">
                            {featuredPost.title}
                          </h2>
                          <p className="text-zinc-500 text-sm leading-relaxed font-normal">
                            {featuredPost.description}
                          </p>
                        </div>

                        <div className="pt-8 flex items-center justify-between border-t border-zinc-100/60 mt-8">
                          {/* Author avatar and details */}
                          <div className="flex items-center gap-3">
                            <img 
                              src={featuredPost.authorAvatar} 
                              alt={featuredPost.author}
                              className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                            />
                            <div>
                              <p className="text-sm font-bold text-zinc-800">{featuredPost.author}</p>
                              <div className="flex items-center gap-2 text-xs text-zinc-400 font-normal">
                                <span>{featuredPost.date}</span>
                                <span>•</span>
                                <span>{featuredPost.readTime}</span>
                              </div>
                            </div>
                          </div>

                          {/* Interactive arrow circle */}
                          <div className="w-10 h-10 rounded-full border border-zinc-200 group-hover:border-[#6366F1] bg-white group-hover:bg-[#6366F1] text-zinc-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm shrink-0">
                            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-rotate-45" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}

                {/* Filter and Search Bar Container */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-200/50 pb-6">
                  {/* Category Filter Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 w-full">
                    {categories.map((cat) => {
                      const isActive = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setCurrentPage(1);
                          }}
                          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-tight transition-all duration-300 cursor-pointer shrink-0 border relative ${
                            isActive 
                              ? "bg-foreground text-background border-foreground shadow-md shadow-zinc-950/5 scale-[1.02]" 
                              : "bg-white/40 backdrop-blur-md text-zinc-500 border-zinc-200/50 hover:bg-white hover:text-zinc-800"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full md:max-w-xs shrink-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-white/40 backdrop-blur-md border border-zinc-200/50 hover:border-zinc-300 focus:border-[#6366F1] rounded-full pl-11 pr-5 py-3 text-sm font-normal text-zinc-800 focus:outline-none transition-all placeholder-zinc-400 shadow-sm focus:shadow-md focus:shadow-indigo-500/5"
                    />
                  </div>
                </div>

                {/* Articles Grid */}
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="animate-pulse bg-white/20 border border-white/40 rounded-[32px] p-5 h-[480px] flex flex-col justify-between">
                        <div>
                          <div className="rounded-[22px] bg-zinc-200/40 aspect-[16/10] mb-5 h-[180px]" />
                          <div className="space-y-3 px-1">
                            <div className="h-4 bg-zinc-200/40 rounded w-1/4" />
                            <div className="h-6 bg-zinc-200/40 rounded w-5/6" />
                            <div className="h-4 bg-zinc-200/40 rounded w-full" />
                          </div>
                        </div>
                        <div className="pt-6 border-t border-zinc-100/60 mt-6 flex items-center justify-between px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-200/40" />
                            <div className="space-y-1 w-20">
                              <div className="h-3 bg-zinc-200/40 rounded" />
                              <div className="h-2 bg-zinc-200/40 rounded w-2/3" />
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-zinc-200/40" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : paginatedPosts.length > 0 ? (
                  <>
                    <motion.div 
                      layout
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                    >
                      <AnimatePresence>
                        {paginatedPosts.map((post, idx) => (
                          <motion.article
                            layout
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                            className="h-full"
                          >
                            <Link
                              href={`/blog/${post.id}`}
                              className="group block bg-white/40 backdrop-blur-xl border border-white/60 hover:border-[#6366F1]/40 rounded-[32px] p-5 shadow-lg shadow-zinc-100/40 hover:shadow-2xl hover:shadow-[#6366F1]/10 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between overflow-hidden relative h-full"
                            >
                              {/* Inner soft card glow */}
                              <div className="absolute top-1/3 left-0 w-48 h-48 bg-[#6366F1]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -translate-y-1/2" />
                              
                              <div className="space-y-4 relative z-10">
                                {/* Card Image Cover */}
                                <div className="rounded-[22px] overflow-hidden aspect-[16/10] relative mb-5 shadow-sm">
                                  <img 
                                    src={post.image} 
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                                  />
                                </div>

                                {/* Info */}
                                <div className="space-y-3 px-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6366F1] bg-[#6366F1]/5 px-2.5 py-1 rounded-md">
                                      {post.category}
                                    </span>
                                  </div>
                                  <h3 className="text-lg sm:text-xl font-bold text-zinc-800 tracking-tight leading-snug group-hover:text-[#6366F1] transition-colors duration-300 line-clamp-2">
                                    {post.title}
                                  </h3>
                                  <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-normal line-clamp-3">
                                    {post.description}
                                  </p>
                                </div>
                              </div>

                              {/* Footer details */}
                              <div className="pt-6 border-t border-zinc-100/60 mt-6 flex items-center justify-between px-1 relative z-10">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={post.authorAvatar} 
                                    alt={post.author}
                                    className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                                  />
                                  <div>
                                    <p className="text-xs font-bold text-zinc-800">{post.author}</p>
                                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-normal mt-0.5">
                                      <span>{post.date}</span>
                                      <span>•</span>
                                      <span>{post.readTime}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Arrow indicator */}
                                <div className="w-8 h-8 rounded-full border border-zinc-200 group-hover:border-[#6366F1] bg-white group-hover:bg-[#6366F1] text-zinc-400 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm shrink-0">
                                  <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-rotate-45" />
                                </div>
                              </div>
                            </Link>
                          </motion.article>
                        ))}
                      </AnimatePresence>
                    </motion.div>

                    {/* Premium Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-4 mb-12">
                        {/* Previous Page Button */}
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="w-10 h-10 rounded-full border border-zinc-200/60 bg-white/40 backdrop-blur-md text-zinc-600 flex items-center justify-center hover:border-foreground hover:text-foreground disabled:opacity-40 disabled:hover:border-zinc-200/60 disabled:hover:text-zinc-600 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed shadow-sm hover:shadow"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1.5">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            const isPageActive = page === currentPage;
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                                  isPageActive
                                    ? "bg-foreground text-background border-foreground shadow-md scale-105"
                                    : "bg-white/40 backdrop-blur-md text-zinc-500 border-zinc-200/40 hover:bg-white hover:text-zinc-800"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                        </div>

                        {/* Next Page Button */}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="w-10 h-10 rounded-full border border-zinc-200/60 bg-white/40 backdrop-blur-md text-zinc-600 flex items-center justify-center hover:border-foreground hover:text-foreground disabled:opacity-40 disabled:hover:border-zinc-200/60 disabled:hover:text-zinc-600 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed shadow-sm hover:shadow"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  // Search fallback empty state
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-24 text-center max-w-md mx-auto"
                  >
                    <div className="w-16 h-16 bg-zinc-100/80 border border-zinc-200/50 rounded-2xl flex items-center justify-center text-zinc-400 mx-auto mb-6 shadow-sm">
                      <HelpCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-800 mb-2">No articles found</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                      {`We couldn't find any articles matching "${searchQuery}". Try updating your keywords or choosing a different category.`}
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                        setCurrentPage(1);
                      }}
                      className="px-5 py-2.5 bg-foreground text-background text-xs sm:text-sm font-semibold rounded-full hover:scale-105 active:scale-98 transition-all cursor-pointer shadow-md"
                    >
                      Clear Search & Filters
                    </button>
                  </motion.div>
                )}

                {/* Highly-Curated Newsletter Section (Matches CTA.jsx Premium Dark Glass design exactly) */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative rounded-[24px] sm:rounded-[32px] md:rounded-[40px] px-6 sm:px-10 md:px-14 py-12 md:py-16 bg-gradient-to-br from-[#0c0c14] via-[#05050a] to-[#010103] border border-white/[0.06] shadow-none overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-8 sm:gap-10 group/main mb-12"
                >
                  {/* SVG Noise Overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none z-[2]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }}
                  />

                  {/* Inner Ambient Glow Spots */}
                  <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 -translate-x-1/2 z-[1]" />
                  <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-[#6366F1]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2 z-[1]" />

                  {/* Left Side: Info Details */}
                  <div className="relative z-10 text-left space-y-3 max-w-xl">
                    {/* Tagline label */}
                    <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] block">
                      Newsletter
                    </p>

                    {/* Main Title */}
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                      Improve customer replies <br className="hidden sm:inline" />
                      <span className="text-sage font-normal">with Automixa</span>
                    </h2>

                    {/* Description */}
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
                      Join teams using Automixa for messaging workflows, customer support ideas, funnel templates, and product updates.
                    </p>
                  </div>

                  {/* Right Side: Subscription Form */}
                  <div className="relative z-10 shrink-0 w-full md:max-w-md space-y-3">
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                      <div className="relative w-full">
                        <input
                          type="email"
                          placeholder="Your professional email"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          disabled={isSubscribed}
                          required
                          className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-[#6366F1] disabled:opacity-60 rounded-full px-5 py-3.5 text-sm font-normal text-white focus:outline-none transition-all placeholder-zinc-500 shadow-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubscribed || !newsletterEmail}
                        className="bg-white text-zinc-950 px-6 py-3.5 rounded-full hover:scale-[1.03] active:scale-[0.98] disabled:scale-100 disabled:opacity-60 font-bold text-xs sm:text-sm tracking-tight transition-all shrink-0 cursor-pointer shadow-md flex items-center justify-center gap-2 hover:bg-zinc-50"
                      >
                        {isSubscribed ? (
                          <>
                            <Check size={16} className="text-emerald-500" />
                            Subscribed!
                          </>
                        ) : (
                          "Join Playbook"
                        )}
                      </button>
                    </form>
                    
                    <p className="text-[10px] text-zinc-500 text-center sm:text-left">
                      No spam. Unsubscribe with 1-click anytime. Your data is perfectly safe.
                    </p>
                  </div>
                </motion.div>

                {/* Blog Reader FAQs */}
                <div className="mb-12">
                  <FAQ 
                    customFaqs={[
                      {
                        q: "How often do you publish new articles?",
                        a: "We publish business messaging strategies and product updates every Tuesday. Join our newsletter to get them directly in your inbox."
                      },
                      {
                        q: "Are the automation templates mentioned in blogs free?",
                        a: "Yes! All workflow templates and DM funnels discussed in our articles can be implemented for free using the Automixa dashboard."
                      },
                      {
                        q: "Can I contribute an article to the Automixa Playbook?",
                        a: "We love hearing from operators, marketers, and support teams. If you have a useful messaging workflow, reach out to us at info@automixa.in."
                      }
                    ]} 
                  />
                </div>
              </motion.div>
            
            )}
          </AnimatePresence>
          
        </div>
      </PageTransition>

      {/* Styled JSX/Global CSS to properly format blog HTML content (e.g. h2, p, ul, blockquotes) */}
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
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .blog-content-container ul li {
          margin-bottom: 0.5rem;
          font-family: var(--font-outfit), sans-serif;
          font-size: 1rem;
          color: #4b5563;
          line-height: 1.7;
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
