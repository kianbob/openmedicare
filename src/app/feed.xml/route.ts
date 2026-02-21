import { NextResponse } from 'next/server'

const baseUrl = 'https://www.openmedicare.org'

const items = [
  // LANDMARK Investigation
  {
    title: 'Our Data Predicted It: How Statistical Analysis Flagged Providers Before the DOJ Did',
    description: 'Our fraud detection algorithm flagged 500 providers. At least 6 were subsequently charged by the DOJ in the largest healthcare fraud takedown in history. The proof that statistical analysis works.',
    link: '/investigations/data-predicted-fraud',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  // NEW Flagship Investigations
  {
    title: 'The Arizona Wound Care Ring: $514 Million Billed by 23 Nurse Practitioners for 2,974 Patients',
    description: '23 nurse practitioners in Phoenix billed Medicare $514.3 million for skin substitutes — for just 2,974 patients. Top biller: $1.5M per patient. All share an identical 1.28x markup ratio.',
    link: '/investigations/arizona-wound-care-ring',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  {
    title: 'Beverly Hills Plastic Surgeons Billing Medicare for Wound Care: A $45 Million Question',
    description: '3 Beverly Hills plastic surgeons and 1 PA billed Medicare $45.6M — with 83-95% in wound care, not cosmetic surgery. One co-founded the "Wound Institutes of America."',
    link: '/investigations/beverly-hills-wound-care',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  // Investigations
  {
    title: 'Three Providers, Three Red Flags: Inside Medicare\'s Most Suspicious Billing Patterns',
    description: 'A nurse practitioner billing $12.1M in COVID tests. A Beverly Hills plastic surgeon billing $28.9M in wound care. An anti-aging spa doctor whose billing exploded 24x in one year. Three providers, three statistical anomalies.',
    link: '/investigations/three-providers',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  {
    title: 'The Oncology Drug Pipeline: How Cancer Doctors Bill Millions in Drug Costs',
    description: '24 oncologists with >80% drug billing and >$5M each — $171M combined. Oncology has 532 impossible-volume providers, nearly half the national total.',
    link: '/investigations/oncology-drug-pipeline',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  {
    title: 'Florida\'s Fraud Factory: 185 Impossible Providers Billing $573M',
    description: 'Florida leads the nation with 185 providers billing 400+ services per day — more than California and Texas combined. From Fort Walton Beach to The Villages.',
    link: '/investigations/florida-infectious-disease',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  {
    title: 'The $2.1 Trillion Writeoff: Why Doctors Charge 4x What They Get Paid',
    description: 'Over 10 years, providers submitted $3.22 trillion in charges. Medicare paid $854.8 billion. The other $2.14 trillion was written off. The biggest hidden number in healthcare.',
    link: '/investigations/two-trillion-writeoff',
    pubDate: '2026-02-25T00:00:00.000Z',
  },
  {
    title: '9,862 Services Per Day: The Most Impossible Doctor in America',
    description: 'One provider billed Medicare for 2.47 million services in 2023 — that\'s 9,862 per working day, or one every 2.9 seconds for 8 hours straight.',
    link: '/investigations/9862-services-per-day',
    pubDate: '2026-02-24T00:00:00.000Z',
  },
  {
    title: 'Houston: America\'s Medicare Capital',
    description: 'Houston leads the nation with $9.24 billion in Medicare spending — more than most states. The Texas Medical Center effect explained.',
    link: '/investigations/houston-medicare-capital',
    pubDate: '2026-02-23T00:00:00.000Z',
  },
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
  {
    title: 'Two Companies Control America\'s Lab Testing — and Bill Medicare Billions',
    description: 'LabCorp and Quest Diagnostics: 37 NPIs, $14 billion, and 25% of all clinical lab payments.',
    link: '/investigations/lab-corp-quest-duopoly',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  {
    title: 'The Telehealth Explosion: How COVID Changed Medicare Forever',
    description: 'COVID forced CMS to allow telehealth billing. Medicare crashed 10% in 2020 then rebounded. Telehealth is here to stay.',
    link: '/investigations/telehealth-explosion',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  {
    title: 'The Rise of the Nurse Practitioner: Medicare\'s Fastest-Growing Workforce',
    description: '1.2 million NP records, $31.5 billion in payments. Average NP bills $26K vs ophthalmologist at $384K.',
    link: '/investigations/nurse-practitioner-boom',
    pubDate: '2026-02-21T00:00:00.000Z',
  },
  {
    title: 'Beverly Hills: America\'s Most Expensive ZIP Code for Medicare',
    description: 'Beverly Hills providers bill Medicare at rates far exceeding the national average. Plastic surgeons billing wound care in 90210.',
    link: '/investigations/beverly-hills-billing',
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
