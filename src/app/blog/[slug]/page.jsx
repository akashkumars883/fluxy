import BlogClient from "./BlogClient";
import { createClient } from "@/lib/supabase";
import { fetchBlogBySlug, fetchPublishedBlogs } from "@/lib/blogs";
import { notFound } from "next/navigation";

// `params` is a plain object provided by Next.js; do not `await` it
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = createClient();

  const post = await fetchBlogBySlug(supabase, slug);

  if (!post) {
    return {
      title: "Post Not Found | Automixa",
      description: "This blog post could not be found."
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.created_at,
      authors: [post.author || "Automixa Team"],
      images: [
        {
          url: post.image || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop"],
    },
    alternates: {
      canonical: `https://automixa.in/blog/${post.slug || post.id}`,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const supabase = createClient();

  const post = await fetchBlogBySlug(supabase, slug);
  if (!post) notFound();

  const relatedPosts = (await fetchPublishedBlogs(supabase))
    .filter((item) => item.id !== post.id)
    .slice(0, 3);

  return (
    <>
      {post && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              image: [post.image || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop"],
              datePublished: post.created_at || new Date().toISOString(),
              author: {
                "@type": "Person",
                name: post.author || "Automixa Team"
              },
              publisher: {
                "@type": "Organization",
                name: "Automixa",
                logo: {
                  "@type": "ImageObject",
                  url: "https://automixa.in/logo.png"
                }
              },
              description: post.description
            })
          }}
        />
      )}
      <BlogClient initialPost={post} relatedPosts={relatedPosts} />
    </>
  );
}
