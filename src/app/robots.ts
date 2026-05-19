import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login/'],
      },
      {
        userAgent: 'Anthropic-ai',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login/'],
      },
      {
        userAgent: 'Cohere-ai',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login/'],
      }
    ],
    sitemap: 'https://automixa.in/sitemap.xml',
  };
}
