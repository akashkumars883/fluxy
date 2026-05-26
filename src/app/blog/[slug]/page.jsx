import BlogClient from "./BlogClient";
import { createClient } from "@/lib/supabase";

// Next.js 16 requires awaiting params
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = createClient();
  
  // Try finding by slug first, then ID
  let { data: post } = await supabase.from("blogs").select("*").eq("slug", slug).single();
  if (!post) {
    const { data: postById } = await supabase.from("blogs").select("*").eq("id", slug).single();
    post = postById;
  }

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
  
  let { data: post } = await supabase.from("blogs").select("*").eq("slug", slug).single();
  if (!post) {
    const { data: postById } = await supabase.from("blogs").select("*").eq("id", slug).single();
    post = postById;
  }

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
      <BlogClient />
    </>
  );
}
