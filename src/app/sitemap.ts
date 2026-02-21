import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://openmedicare.vercel.app'
  
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
    'covid-test-scheme',
    'wound-care-crisis',
    'impossible-doctors',
    'medicare-millionaires',
    'specialty-monopoly',
    'ten-year-explosion',
    'geographic-inequality',
    'drug-money',
    'medicare-fraud-2025',
    'how-much-does-medicare-pay',
    'medicare-provider-lookup-guide',
    'most-expensive-medicare-procedures',
    'medicare-spending-by-state',
    'specialty-pay-gap',
    'lab-corp-quest-duopoly',
    'telehealth-explosion',
    'nurse-practitioner-boom',
    'beverly-hills-billing',
    'two-trillion-writeoff',
    '9862-services-per-day',
    'houston-medicare-capital',
    'three-providers',
    'oncology-drug-pipeline',
    'florida-infectious-disease',
    'arizona-wound-care-ring',
    'beverly-hills-wound-care',
    'data-predicted-fraud',
    'still-out-there',
    'genetic-testing-fraud',
    'algorithm-knows',
    'how-we-built-the-model',
    'internal-medicine-crisis',
    'florida-california-fraud',
    'million-dollar-flagged',
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
    '/your-medicare-dollar',
    '/methodology',
    '/glossary',
    '/data-sources',
    ...investigationSlugs.map(s => `/investigations/${s}`),
    '/api-docs',
    '/search',
    // State comparison pages
    ...['ca-vs-tx','ca-vs-ny','fl-vs-tx','ny-vs-fl','ca-vs-fl','tx-vs-ny','pa-vs-oh','il-vs-ca','ga-vs-fl','nc-vs-va','mi-vs-oh','nj-vs-ny','wa-vs-ca','az-vs-ca','ma-vs-ny','tn-vs-ga','md-vs-va','co-vs-az','mn-vs-wi','or-vs-wa','in-vs-oh','mo-vs-il','sc-vs-nc','al-vs-ga','ky-vs-tn','la-vs-tx','ok-vs-tx','ct-vs-ny','ut-vs-co','nv-vs-az'].map(s => `/states/compare/${s}`),
    // Specialty comparison pages
    ...['internal-medicine-vs-family-practice','cardiology-vs-internal-medicine','ophthalmology-vs-optometry','orthopedic-surgery-vs-physical-therapy','dermatology-vs-plastic-surgery','emergency-medicine-vs-internal-medicine','neurology-vs-psychiatry','general-surgery-vs-orthopedic-surgery','radiology-vs-diagnostic-radiology','anesthesiology-vs-nurse-anesthetist','urology-vs-nephrology','pulmonary-disease-vs-internal-medicine','oncology-vs-hematology','gastroenterology-vs-internal-medicine','rheumatology-vs-internal-medicine'].map(s => `/specialties/compare/${s}`),
    '/fraud',
    '/fraud/watchlist',
    '/fraud/deep-dives',
    '/fraud/still-out-there',
    '/fraud/covid-tests',
    '/fraud/wound-care',
    '/fraud/upcoding',
    '/fraud/impossible-numbers',
    '/fraud/report',
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

  // State fraud risk pages
  try {
    const statesData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'states.json'), 'utf-8'))
    ;(statesData.states || []).forEach((s: { state: string }) => {
      dynamicRoutes.push({ url: `${baseUrl}/states/${s.state}/fraud-risk`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 })
      dynamicRoutes.push({ url: `${baseUrl}/states/${s.state}/compare`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 })
    })
  } catch {}

  // Specialty fraud risk pages (top 30)
  try {
    const specData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'specialties.json'), 'utf-8'))
    const specs = (specData.specialties || []).sort((a: { total_payments: number }, b: { total_payments: number }) => b.total_payments - a.total_payments).slice(0, 30)
    specs.forEach((s: { specialty_slug: string }) => {
      dynamicRoutes.push({ url: `${baseUrl}/specialties/${s.specialty_slug}/fraud-risk`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 })
    })
  } catch {}

  // Procedure cost pages (top 100 by file size)
  try {
    const procDir2 = path.join(process.cwd(), 'public', 'data', 'procedures')
    const procFiles = fs.readdirSync(procDir2).filter(f => f.endsWith('.json'))
    const withSize = procFiles.map(f => ({ name: f, size: fs.statSync(path.join(procDir2, f)).size }))
    withSize.sort((a, b) => b.size - a.size)
    withSize.slice(0, 100).forEach(f => {
      dynamicRoutes.push({ url: `${baseUrl}/procedures/${f.name.replace('.json', '')}/cost`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 })
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
