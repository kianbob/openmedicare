import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/admin/',
        '/data/providers/', // Don't crawl individual provider data files
      ],
    },
    sitemap: 'https://openmedicare.vercel.app/sitemap.xml',
  }
}