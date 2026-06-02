import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createAdminClient } from "./src/lib/supabase.js";

async function checkBlog() {
  const admin = createAdminClient();

  // 1. Check blog_posts table
  console.log("=== Checking blog_posts table ===");
  const { data: blogPosts, error: blogError } = await admin
    .from("blog_posts")
    .select("id, title, status, slug, published_at")
    .order("published_at", { ascending: false });

  if (blogError) {
    console.error("blog_posts error:", blogError);
  } else {
    console.log(`Found ${blogPosts.length} rows in blog_posts:`, blogPosts);
  }

  // 2. Check specifically published ones
  console.log("\n=== Checking published blog_posts ===");
  const { data: published, error: pubError } = await admin
    .from("blog_posts")
    .select("id, title, status, slug, published_at")
    .eq("status", "published");

  if (pubError) {
    console.error("published blog_posts error:", pubError);
  } else {
    console.log(`Found ${published.length} published posts:`, published);
  }

  // 3. Check RLS policy - does anonClient see same data?
  console.log("\n=== Checking anonClient (RLS) view of blog_posts ===");
  const { createClient } = await import("./src/lib/supabase.js");
  const anon = createClient();
  const { data: anonPublished, error: anonError } = await anon
    .from("blog_posts")
    .select("id, title, status, slug")
    .eq("status", "published");

  if (anonError) {
    console.error("anonClient blog_posts error:", anonError);
  } else {
    console.log(`anonClient sees ${anonPublished.length} published posts:`, anonPublished);
  }
}

checkBlog();
