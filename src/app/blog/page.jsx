"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Search, ArrowLeft, Calendar, Clock, ArrowRight, BookOpen, 
  Share2, Check, Copy, Sparkles, Send, HelpCircle, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import PageTransition from "@/components/ui/PageTransition";
import { createClient } from "@/lib/supabase";

// Available categories
const categories = ["All", "Instagram Automation", "Marketing Tips", "Product Updates", "Creator Growth"];

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Fetch blogs dynamically from Supabase
  useEffect(() => {
    async function fetchBlogs() {
      try {
        setIsLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching blogs from Supabase:", error);
          setBlogPosts([]);
        } else if (data && data.length > 0) {
          // Map snake_case SQL columns to camelCase JS properties safely
          const mappedPosts = data.map((post) => ({
            id: post.slug || post.id || "",
            title: post.title || "Untitled Post",
            description: post.description || "",
            category: post.category || "General",
            author: post.author || "Admin",
            authorRole: post.author_role || "Author",
            authorAvatar: post.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
            date: post.date || (post.created_at ? (() => {
              const d = new Date(post.created_at);
              return isNaN(d.getTime()) ? "May 5, 2026" : d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              });
            })() : "May 5, 2026"),
            readTime: post.read_time || "5 min read",
            isFeatured: !!post.is_featured,
            image: post.image || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop",
            content: post.content || ""
          }));
          setBlogPosts(mappedPosts);
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

  // Filter blog posts based on category and search query
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch = searchQuery === "" || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, blogPosts]);

  // Pagination states and calculations
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 10;

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  // Paginated posts for display
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Featured post (from all posts, or fallback to first)
  const featuredPost = useMemo(() => {
    return blogPosts.find(post => post.isFeatured) || blogPosts[0];
  }, [blogPosts]);

  // Handle select/unselect and sync with address bar dynamically
  const handleSelectPost = (post) => {
    setSelectedPost(post);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `/blog?post=${post.id}`);
    }
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/blog");
    }
  };

  // Automatically select a post on initial load if ?post=slug-name is in the URL query parameters
  useEffect(() => {
    if (blogPosts.length > 0 && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const postSlug = params.get("post");
      if (postSlug) {
        const post = blogPosts.find(p => p.id === postSlug);
        if (post) {
          setSelectedPost(post);
        }
      }
    }
  }, [blogPosts]);

  // Track scroll reading progress in deep-article mode
  useEffect(() => {
    if (!selectedPost) {
      setReadingProgress(0);
      return;
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedPost]);

  // Scroll to top when post changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedPost]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail("");
    }, 3000);
  };

  const copyPostUrl = (postId) => {
    const url = `${window.location.origin}/blog?post=${postId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <main className="min-h-screen text-foreground overflow-x-clip relative font-sans pt-32 pb-24 selection:bg-sage/20">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-pink-500/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-[450px] h-[450px] bg-emerald-500/4 rounded-full blur-[110px] pointer-events-none" />

      {/* Reading Progress Bar for Article detail view */}
      {selectedPost && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[110] bg-zinc-100">
          <div 
            className="h-full bg-[#6366F1] transition-all duration-100" 
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}

      <PageTransition>
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          
          <AnimatePresence mode="wait">
            {!selectedPost ? (
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
                {/* Header Title Section */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 md:mb-20 gap-6">
                  <div className="max-w-2xl">
                    <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                      <Sparkles size={12} className="text-[#6366F1]" />
                      Automixa Journal
                    </p>
                    <h1 className="text-4xl md:text-6xl font-semibold text-foreground tracking-normal leading-[1.1]">
                      The Automation <br />
                      <span className="text-sage font-normal">Playbook</span>
                    </h1>
                  </div>
                  <p className="text-zinc-500 text-base sm:text-lg max-w-sm font-normal leading-relaxed">
                    Guides, insights, and marketing funnels to help you automate your Instagram engagement and convert followers into customers.
                  </p>
                </div>

                {/* Featured Post Card (Visible only when 'All' category or first tab) */}
                {isLoading ? (
                  <div className="mb-20 animate-pulse bg-white/20 border border-white/40 rounded-[32px] p-6 md:p-8 lg:p-10 h-[400px] flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
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
                      className="mb-20"
                    >
                    <Link 
                      href={`/blog?post=${featuredPost.id}`}
                      onClick={(e) => { e.preventDefault(); handleSelectPost(featuredPost); }}
                      className="group block bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white rounded-[32px] p-6 md:p-8 lg:p-10 shadow-xl shadow-zinc-100/40 hover:shadow-2xl hover:shadow-zinc-200/40 transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative overflow-hidden"
                    >
                      {/* Interactive glow overlay */}
                      <div className="absolute top-1/2 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -translate-y-1/2" />
                      
                      {/* Left: Image (lg:col-span-7) */}
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-zinc-200/50 pb-8">
                  {/* Category Filter Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 w-full">
                    {categories.map((cat) => {
                      const isActive = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
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
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/40 backdrop-blur-md border border-zinc-200/50 hover:border-zinc-300 focus:border-[#6366F1] rounded-full pl-11 pr-5 py-3 text-sm font-normal text-zinc-800 focus:outline-none transition-all placeholder-zinc-400 shadow-sm focus:shadow-md focus:shadow-indigo-500/5"
                    />
                  </div>
                </div>

                {/* Articles Grid */}
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
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
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
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
                              href={`/blog?post=${post.id}`}
                              onClick={(e) => { e.preventDefault(); handleSelectPost(post); }}
                              className="group block bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white rounded-[32px] p-5 shadow-lg shadow-zinc-100/40 hover:shadow-2xl hover:shadow-zinc-200/40 transition-all duration-500 flex flex-col justify-between overflow-hidden relative h-full"
                            >
                              {/* Inner soft card glow */}
                              <div className="absolute top-1/3 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -translate-y-1/2" />
                              
                              <div>
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
                      <div className="flex items-center justify-center gap-2 mt-8 mb-24">
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
                      We couldn't find any articles matching "{searchQuery}". Try updating your keywords or choosing a different category.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
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
                  className="relative rounded-[24px] sm:rounded-[32px] md:rounded-[40px] px-6 sm:px-10 md:px-14 py-12 md:py-16 bg-gradient-to-br from-[#0c0c14] via-[#05050a] to-[#010103] border border-white/[0.06] shadow-none overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-8 sm:gap-10 group/main mb-20"
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
                      Grow your Instagram <br className="hidden sm:inline" />
                      <span className="text-sage font-normal">with Automixa</span>
                    </h2>

                    {/* Description */}
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
                      Join over 3,000+ creators and marketers. Subscribe to receive our weekly growth strategies, funnel templates, and product updates.
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
              </motion.div>
            ) : (
              // ----------------------------------------------------
              // SINGLE ARTICLE DETAIL VIEW
              // ----------------------------------------------------
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
                  onClick={(e) => { e.preventDefault(); handleBackToList(); }}
                  className="group inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold text-zinc-500 hover:text-foreground transition-colors cursor-pointer mb-8 bg-white/50 backdrop-blur-md px-4.5 py-2.5 rounded-full border border-zinc-200/40 shadow-sm hover:shadow"
                >
                  <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                  Back to All Articles
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
                  
                  {/* LEFT COLUMN: Main Article */}
                  <div className="lg:col-span-8">
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
                          
                          {/* Copy Link button */}
                          <button 
                            onClick={() => copyPostUrl(selectedPost.id)}
                            className="p-2 border border-zinc-200 hover:border-zinc-300 rounded-full bg-white text-zinc-500 hover:text-[#6366F1] transition-all cursor-pointer shadow-sm relative group/share"
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
                    <div className="rounded-[32px] overflow-hidden aspect-[16/9] shadow-xl border border-zinc-100 mb-12">
                      <img 
                        src={selectedPost.image} 
                        alt={selectedPost.title} 
                        className="w-full h-full object-cover"
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
                        dangerouslySetInnerHTML={{ __html: selectedPost.content }} 
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
                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedPost.title)}&url=${encodeURIComponent(window.location.origin + '/blog?post=' + selectedPost.id)}`, '_blank');
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
                              href={`/blog?post=${post.id}`}
                              onClick={(e) => { e.preventDefault(); handleSelectPost(post); }}
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

                  {/* RIGHT COLUMN: Sticky Sidebar */}
                  <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8 h-fit mt-12 lg:mt-0 pb-10">

                    {/* Dark Premium CTA */}
                    <div className="bg-gradient-to-br from-[#0c0c14] via-[#05050a] to-[#010103] rounded-[24px] p-6 border border-white/[0.06] shadow-2xl relative overflow-hidden text-center group/cta">
                      {/* Inner ambient glows */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366F1]/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover/cta:scale-150" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                      
                      {/* Content */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-12 h-12 bg-white/[0.05] border border-white/[0.1] rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                          <Send size={20} className="text-[#6366F1] -ml-1 mt-0.5" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2 leading-tight">
                          Automate Your <br /> Instagram DMs.
                        </h4>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-6 px-2">
                          Stop replying manually. Turn your followers into paying customers while you sleep.
                        </p>
                        <Link 
                          href="/login" 
                          className="w-full py-3.5 bg-white text-zinc-950 font-bold rounded-full hover:scale-[1.03] active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-2 shadow-xl shadow-white/10"
                        >
                          Start Free Trial
                          <ArrowRight size={14} className="text-zinc-600" />
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.article>
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
          line-height: 1.8;
          color: #4b5563;
          margin-bottom: 1.5rem;
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
      `}</style>
    </main>
  );
}
