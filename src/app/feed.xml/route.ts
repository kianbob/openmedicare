import { NextResponse } from 'next/server'

const baseUrl = 'https://www.openmedicare.org'

const items = [
  // Investigations
  {
    title: 'The Medicare Markup Machine',
    description: 'How doctors charge $100 billion more than Medicare actually pays them — and why the system incentivizes overbilling',
    link: '/investigations/markup-machine',
    pubDate: '2024-02-15T00:00:00.000Z',
  },
  {
    title: 'The Anesthesia Markup',
    description: 'Why anesthesia charges are among the most inflated in Medicare — and who profits',
    link: '/investigations/anesthesia-markup',
    pubDate: '2024-02-18T00:00:00.000Z',
  },
  {
    title: 'Medicare\'s Biggest Spenders',
    description: 'A data-driven look at the providers collecting the most from Medicare',
    link: '/investigations/medicare-biggest-spenders',
    pubDate: '2024-02-17T00:00:00.000Z',
  },
  {
    title: 'The State Spending Divide',
    description: 'Why Medicare costs vary wildly across state lines',
    link: '/investigations/state-spending-divide',
    pubDate: '2024-02-16T00:00:00.000Z',
  },
  {
    title: 'Corporate Medicine',
    description: 'How large healthcare organizations dominate Medicare billing',
    link: '/investigations/corporate-medicine',
    pubDate: '2024-02-14T00:00:00.000Z',
  },
  {
    title: 'The Office Visit Economy',
    description: 'Office visits are Medicare\'s bread and butter — here\'s what the data shows',
    link: '/investigations/office-visit-economy',
    pubDate: '2024-02-12T00:00:00.000Z',
  },
  {
    title: 'Medicare\'s Biggest Billers',
    description: 'The 100 providers who received the most Medicare payments in 2023',
    link: '/investigations/biggest-billers',
    pubDate: '2024-02-10T00:00:00.000Z',
  },
  {
    title: 'Pandemic Recovery',
    description: 'How Medicare spending rebounded — and what changed permanently',
    link: '/investigations/pandemic-recovery',
    pubDate: '2024-02-08T00:00:00.000Z',
  },
  {
    title: 'The Drug Money Pipeline',
    description: 'How Medicare Part B became a $40 billion drug spending program',
    link: '/investigations/drug-pipeline',
    pubDate: '2024-02-05T00:00:00.000Z',
  },
  {
    title: 'Eye Care Billions',
    description: 'Ophthalmology\'s outsized share of Medicare spending',
    link: '/investigations/eye-care-billions',
    pubDate: '2024-02-03T00:00:00.000Z',
  },
  {
    title: 'Where Your Medicare Dollar Goes',
    description: 'A comprehensive breakdown of Medicare spending flows',
    link: '/investigations/where-medicare-dollar-goes',
    pubDate: '2024-01-30T00:00:00.000Z',
  },
  {
    title: 'COVID\'s Impact on Medicare',
    description: 'How the pandemic shifted $50 billion in Medicare spending patterns',
    link: '/investigations/covid-impact',
    pubDate: '2024-01-28T00:00:00.000Z',
  },
  {
    title: 'Rural Healthcare\'s Price Tag',
    description: 'Why Medicare pays more for the same services in rural America',
    link: '/investigations/rural-price-tag',
    pubDate: '2024-01-20T00:00:00.000Z',
  },
  {
    title: 'The Specialty Pay Gap',
    description: 'How procedure-based specialties dominate Medicare spending',
    link: '/investigations/specialty-gap',
    pubDate: '2024-01-15T00:00:00.000Z',
  },
  {
    title: 'The Specialty Pay Gap (Extended)',
    description: 'An expanded analysis of Medicare specialty compensation disparities',
    link: '/investigations/specialty-pay-gap',
    pubDate: '2024-01-10T00:00:00.000Z',
  },
  // New investigations
  {
    title: 'The COVID Test Gold Rush: How Medicare Lost Billions to K1034 Fraud',
    description: 'K1034 was created for COVID OTC tests at ~$12 each. Some providers billed millions. NPR reported seniors received tests they never ordered.',
    link: '/investigations/covid-test-scheme',
    pubDate: '2026-02-20T00:00:00.000Z',
  },
  {
    title: 'The Wound Care Industrial Complex: Medicare\'s Most Vulnerable Program',
    description: 'HHS-OIG calls skin substitutes "particularly vulnerable to fraud." DOJ\'s $14.6B takedown targeted wound care. Debridement markups of 60x+.',
    link: '/investigations/wound-care-crisis',
    pubDate: '2026-02-19T00:00:00.000Z',
  },
  {
    title: 'The Impossible Doctors: When the Math Doesn\'t Add Up',
    description: 'Individual providers billing 400+ services per day. A new patient every 1-2 minutes for 8 hours straight. The math doesn\'t work.',
    link: '/investigations/impossible-doctors',
    pubDate: '2026-02-18T00:00:00.000Z',
  },
  {
    title: 'Medicare\'s Millionaire Club: The 1% Who Bill the Most',
    description: 'The average family doctor earns $55K from Medicare. These providers bill $10M+. Inside the 1,000 providers who collected billions.',
    link: '/investigations/medicare-millionaires',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  {
    title: 'The Specialty Monopoly: Where Medicare Money Really Goes',
    description: '5 specialties account for 33% of all Medicare spending. Clinical labs earn $1.9M per provider while nurse practitioners average $26K.',
    link: '/investigations/specialty-monopoly',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  {
    title: 'The 10-Year Explosion: How Medicare Spending Grew by $15 Billion',
    description: 'Medicare spending grew 20% in 10 years. COVID crashed it, then it rebounded past pre-pandemic levels. At this rate, $110B+ by 2030.',
    link: '/investigations/ten-year-explosion',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  {
    title: 'ZIP Code Lottery: Why Your Medicare Costs Depend on Where You Live',
    description: 'Medicare pays $121K per provider in Florida but $18K in Puerto Rico. A 7x gap within the same federal program.',
    link: '/investigations/geographic-inequality',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  {
    title: 'Follow the Drug Money: Medicare\'s Pharmaceutical Pipeline',
    description: 'One eye injection drug costs Medicare $19.7B. Drug spending\'s share nearly doubled from 8% to 15% in a decade.',
    link: '/investigations/drug-money',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  // SEO-targeted articles
  {
    title: 'Medicare Fraud in 2025: The Biggest Cases and What\'s Changed',
    description: 'DOJ\'s $14.6B takedown, 324 defendants, and $6.8B in False Claims Act recoveries. The biggest year for Medicare fraud enforcement.',
    link: '/investigations/medicare-fraud-2025',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  {
    title: 'How Much Does Medicare Actually Pay Doctors?',
    description: 'Average Medicare payment per provider by specialty: from $26K for nurse practitioners to $384K for ophthalmologists.',
    link: '/investigations/how-much-does-medicare-pay',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  {
    title: 'How to Look Up Your Doctor\'s Medicare Billing',
    description: 'Step-by-step guide to searching Medicare provider data. What the numbers mean and what to look for.',
    link: '/investigations/medicare-provider-lookup-guide',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  {
    title: 'The Most Expensive Medicare Procedures in 2023',
    description: 'Top 20 procedures by total payments and average cost per service. Office visits vs. drug injections.',
    link: '/investigations/most-expensive-medicare-procedures',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  {
    title: 'Medicare Spending by State: A Complete Breakdown',
    description: 'Every state ranked by total Medicare spending, per-provider payments, and markup ratios.',
    link: '/investigations/medicare-spending-by-state',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  // Fraud pages
  {
    title: 'Medicare Fraud Analysis Hub',
    description: 'Explore Medicare fraud patterns detected in $854.8B of physician payment data. Analysis of upcoding, COVID test billing, wound care schemes, and more.',
    link: '/fraud',
    pubDate: '2026-02-01T00:00:00.000Z',
  },
  {
    title: 'Enhanced Fraud Watchlist',
    description: '500 Medicare providers flagged for suspicious billing patterns. Filter by risk score, specialty, state.',
    link: '/fraud/watchlist',
    pubDate: '2026-02-01T00:00:00.000Z',
  },
  {
    title: 'Fraud Deep Dive Profiles',
    description: 'Deep-dive profiles of the most suspicious individual Medicare providers. Risk scores, billing breakdowns, and peer comparisons.',
    link: '/fraud/deep-dives',
    pubDate: '2026-02-01T00:00:00.000Z',
  },
  {
    title: 'COVID Test Billing Tracker',
    description: 'Analysis of COVID-19 test billing fraud in Medicare. K1034 code abuse, top billers, and geographic hotspots.',
    link: '/fraud/covid-tests',
    pubDate: '2026-02-01T00:00:00.000Z',
  },
  {
    title: 'Wound Care Fraud Watchlist',
    description: 'DOJ\'s #1 fraud target: wound care billing. Analysis of skin substitute codes, debridement markups, and suspicious providers.',
    link: '/fraud/wound-care',
    pubDate: '2026-02-01T00:00:00.000Z',
  },
  {
    title: 'Upcoding Detector',
    description: 'Medicare upcoding analysis: which providers bill 99214 instead of 99213? The $117.7B office visit economy examined.',
    link: '/fraud/upcoding',
    pubDate: '2026-02-01T00:00:00.000Z',
  },
  {
    title: 'Impossible Numbers',
    description: 'Providers billing physically impossible volumes — 400+ services per day as a single practitioner.',
    link: '/fraud/impossible-numbers',
    pubDate: '2026-02-01T00:00:00.000Z',
  },
  {
    title: 'Report Medicare Fraud',
    description: 'How to report Medicare fraud. OIG hotline, False Claims Act whistleblower rewards, and what counts as fraud.',
    link: '/fraud/report',
    pubDate: '2026-02-01T00:00:00.000Z',
  },
]

export async function GET() {
  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>OpenMedicare</title>
    <description>Data-driven investigative reporting on Medicare spending patterns, healthcare fraud, and transparency</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>OpenMedicare</title>
      <link>${baseUrl}</link>
    </image>
    ${items.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${baseUrl}${item.link}</link>
      <guid isPermaLink="true">${baseUrl}${item.link}</guid>
      <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
