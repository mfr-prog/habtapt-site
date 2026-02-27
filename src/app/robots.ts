import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/login', '/api/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
    ],
    sitemap: 'https://habta.eu/sitemap.xml',
    host: 'https://habta.eu',
  };
}
