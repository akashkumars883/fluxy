import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    '/dashboard',
    '/dashboard/',
    '/api',
    '/api/',
    '/login',
    '/login/',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'Anthropic-ai',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'Cohere-ai',
        allow: '/',
        disallow,
      }
    ],
    sitemap: 'https://automixa.in/sitemap.xml',
  };
}
