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
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeBlogPost);
}

export async function fetchBlogBySlug(supabase, slug) {
  const bySlug = await supabase.from("blogs").select("*").eq("slug", slug).maybeSingle();
  if (!bySlug.error && bySlug.data) return normalizeBlogPost(bySlug.data);

  const byId = await supabase.from("blogs").select("*").eq("id", slug).maybeSingle();
  if (!byId.error && byId.data) return normalizeBlogPost(byId.data);

  return null;
}
