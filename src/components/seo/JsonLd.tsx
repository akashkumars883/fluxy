export default function JsonLd() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Automixa",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1240"
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Automixa",
    "url": "https://automixa.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://automixa.in/blog?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Corporation",
    "name": "Automixa",
    "url": "https://automixa.in",
    "logo": "https://automixa.in/icon.png",
    "founder": {
      "@type": "Person",
      "name": "Akash Kumar",
      "jobTitle": "Founder & CEO"
    },
    "sameAs": [
      "https://instagram.com/automixa",
      "https://twitter.com/automixa"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is Automixa safe for my Instagram account?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, 100%. Automixa uses official Instagram and Meta APIs. We never ask for your password or use shadow-scrapers that could flag your account."
        }
      },
      {
        "@type": "Question",
        "name": "Can I automate replies to direct messages (DMs) too?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! Automixa handles both public comment replies and direct messages. You can set it to automatically send a DM containing a resource link whenever someone comments."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
