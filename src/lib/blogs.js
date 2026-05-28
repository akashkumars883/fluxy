export function normalizeBlogPost(post) {
  if (!post) return null;

  return {
    id: post.slug || post.id || "",
    rawId: post.id,
    slug: post.slug || post.id || "",
    title: post.title || "Untitled Post",
    description: post.description || post.excerpt || "",
    category: post.category || "General",
    author: post.author || "Automixa Team",
    authorRole: post.author_role || "Author",
    authorAvatar:
      post.author_avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
    date: post.date || post.published_at || post.created_at || "May 5, 2026",
    readTime: post.read_time || "5 min read",
    isFeatured: post.is_featured || false,
    image:
      post.image ||
      post.cover_image ||
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop",
    content: post.content || "",
    created_at: post.created_at,
    published_at: post.published_at,
  };
}

export async function fetchPublishedBlogs(supabase) {
  const primary = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (!primary.error) {
    return (primary.data || []).map(normalizeBlogPost);
  }

  const fallback = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (fallback.error) throw fallback.error;
  return (fallback.data || []).map(normalizeBlogPost);
}

export async function fetchBlogBySlug(supabase, slug) {
  const bySlug = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!bySlug.error && bySlug.data) return normalizeBlogPost(bySlug.data);

  const byId = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!byId.error && byId.data) return normalizeBlogPost(byId.data);

  const legacyBySlug = await supabase.from("blogs").select("*").eq("slug", slug).maybeSingle();
  if (!legacyBySlug.error && legacyBySlug.data) return normalizeBlogPost(legacyBySlug.data);

  const legacyById = await supabase.from("blogs").select("*").eq("id", slug).maybeSingle();
  if (!legacyById.error && legacyById.data) return normalizeBlogPost(legacyById.data);

  return null;
}
