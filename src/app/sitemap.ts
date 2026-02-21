import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.openmedicare.org'
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/downloads',
    '/providers',
    '/procedures',
    '/states',
    '/specialties',
    '/watchlist',
    '/markup',
    '/drug-spending',
    '/rural-urban',
    '/trends',
    '/investigations',
    '/investigations/markup-machine',
    '/investigations/biggest-billers',
    '/investigations/drug-pipeline',
    '/investigations/covid-impact',
    '/investigations/rural-price-tag',
    '/investigations/specialty-pay-gap',
    '/lookup',
    '/compare',
    '/calculator'
  ]

  const staticRoutes: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : path.startsWith('/investigations') ? 'monthly' : 'weekly',
    priority: path === '' ? 1 : path.startsWith('/investigations') ? 0.8 : 0.7,
  }))

  // In production, these would be dynamically generated from data files
  // For now, include some sample provider, procedure, state, and specialty pages
  const dynamicRoutes: MetadataRoute.Sitemap = [
    // Sample provider pages
    {
      url: `${baseUrl}/providers/1234567890`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    // Sample procedure pages
    {
      url: `${baseUrl}/procedures/99213`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // State pages
    {
      url: `${baseUrl}/states/CA`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/states/TX`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/states/FL`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/states/NY`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Sample specialty pages
    {
      url: `${baseUrl}/specialties/cardiology`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/specialties/orthopedic-surgery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  return [...staticRoutes, ...dynamicRoutes]
}