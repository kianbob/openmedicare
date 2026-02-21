import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.openmedicare.org'
  
  const investigationSlugs = [
    'markup-machine',
    'biggest-billers',
    'drug-pipeline',
    'covid-impact',
    'rural-price-tag',
    'specialty-gap',
    'anesthesia-markup',
    'medicare-biggest-spenders',
    'state-spending-divide',
    'corporate-medicine',
    'office-visit-economy',
    'pandemic-recovery',
    'eye-care-billions',
    'where-medicare-dollar-goes',
  ]

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
    '/markup-analysis',
    '/drug-spending',
    '/rural-urban',
    '/trends',
    '/investigations',
    '/lookup',
    '/compare',
    '/calculator',
    '/place-of-service',
    '/geographic',
    '/cost-adjustment',
    '/payment-gap',
    '/utilization',
    ...investigationSlugs.map(s => `/investigations/${s}`),
  ]

  const staticRoutes: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: `${baseUrl}${p}`,
    lastModified: new Date(),
    changeFrequency: p === '' ? 'daily' : p.startsWith('/investigations') ? 'monthly' : 'weekly',
    priority: p === '' ? 1 : p.startsWith('/investigations/') ? 0.8 : 0.7,
  }))

  // Dynamic routes from data files
  const dynamicRoutes: MetadataRoute.Sitemap = []

  // All states
  try {
    const stateDir = path.join(process.cwd(), 'public', 'data', 'states')
    fs.readdirSync(stateDir).filter(f => f.endsWith('.json')).forEach(f => {
      dynamicRoutes.push({ url: `${baseUrl}/states/${f.replace('.json', '')}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 })
    })
  } catch {}

  // All specialties
  try {
    const specDir = path.join(process.cwd(), 'public', 'data', 'specialties')
    fs.readdirSync(specDir).filter(f => f.endsWith('.json')).forEach(f => {
      dynamicRoutes.push({ url: `${baseUrl}/specialties/${f.replace('.json', '')}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 })
    })
  } catch {}

  // Top procedures
  try {
    const procDir = path.join(process.cwd(), 'public', 'data', 'procedures')
    fs.readdirSync(procDir).filter(f => f.endsWith('.json')).forEach(f => {
      dynamicRoutes.push({ url: `${baseUrl}/procedures/${f.replace('.json', '')}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 })
    })
  } catch {}

  // Top providers (limit to keep sitemap reasonable)
  try {
    const provDir = path.join(process.cwd(), 'public', 'data', 'providers')
    fs.readdirSync(provDir).filter(f => f.endsWith('.json')).slice(0, 500).forEach(f => {
      dynamicRoutes.push({ url: `${baseUrl}/providers/${f.replace('.json', '')}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 })
    })
  } catch {}

  return [...staticRoutes, ...dynamicRoutes]
}
