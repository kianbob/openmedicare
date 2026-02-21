import type { Metadata } from 'next'
import Link from 'next/link'
import { ClockIcon, ArrowRightIcon, FireIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import NewsletterCTA from '@/components/NewsletterCTA'
import SourceCitation from '@/components/SourceCitation'

export const metadata: Metadata = {
  title: 'Investigations',
  description: 'Deep-dive investigative reporting on Medicare spending patterns, fraud, and healthcare transparency. 51 data-driven investigations.',
  alternates: {
    canonical: '/investigations',
  },
}

const featuredInvestigations = [
  {
    title: 'The Algorithm Knows: How AI Detects Medicare Fraud Before Humans Do',
    description: 'Our AI systems are finding fraud patterns that traditional auditing misses — and the implications for Medicare oversight are staggering.',
    href: '/investigations/algorithm-knows',
    category: '🤖 AI Analysis',
    readTime: '15 min read',
    publishedAt: '2026-02-21',
    excerpt: 'Machine learning models trained on Medicare billing data can detect fraud patterns invisible to human auditors. Our latest AI analysis reveals how algorithmic detection is reshaping healthcare oversight.',
    keyFindings: [
      'AI models detect fraud patterns months before traditional audits',
      'Algorithmic analysis covers 1.7M+ providers simultaneously',
      'Pattern recognition identifies coordinated billing schemes',
      'False positive rates continue to improve with more training data',
    ],
  },
  {
    title: 'Our Data Predicted It: Statistical Analysis Flagged Providers Before the DOJ Did',
    description: 'We flagged 500 providers. The DOJ charged 324 people in $14.6B of fraud. Multiple of our top-flagged providers were among them.',
    href: '/investigations/data-predicted-fraud',
    category: '🏆 Landmark Investigation',
    readTime: '22 min read',
    publishedAt: '2026-02-21',
    excerpt: 'Our fraud detection algorithm — built entirely from public Medicare data — flagged the same providers that federal investigators spent years pursuing. At least 6 of our flagged providers were subsequently charged by the DOJ, including the entire Arizona wound care ring.',
    keyFindings: [
      '500 providers flagged by our algorithm using only public data',
      '6+ flagged providers subsequently charged by DOJ',
      'Arizona ring: 5 charged providers we flagged for identical 1.28x markup ratios',
      'VRA Enterprises: Our #1 COVID test flag settled for $17M with DOJ',
    ],
  },
  {
    title: 'The Arizona Wound Care Ring',
    description: '$514 million billed by 23 nurse practitioners for just 2,974 patients — with identical 1.28x markup ratios',
    href: '/investigations/arizona-wound-care-ring',
    category: 'Featured Investigation',
    readTime: '18 min read',
    publishedAt: '2026-02-21',
    excerpt: '23 nurse practitioners in the Phoenix metro area billed Medicare $514.3 million for skin substitute products. Only 2,974 patients. Top biller: $1.5 million per patient. All share a nearly identical 1.28x markup ratio — suggesting coordinated billing.',
    keyFindings: [
      'Ira Denny (Surprise, AZ): $135.2M for 90 patients — $1,501,784 per patient',
      'Jorge Kinds (Phoenix, AZ): $123.8M for 97 patients — $1,276,209 per patient',
      'All top 7 billers share an identical 1.28x markup ratio',
      'Arizona bills $73,182 per wound care patient vs. California\'s $3,341',
    ],
  },
  {
    title: 'Beverly Hills Plastic Surgeons Billing Medicare for Wound Care',
    description: 'Cosmetic surgeons marketing facelifts — but billing Medicare $45.6 million in wound care',
    href: '/investigations/beverly-hills-wound-care',
    category: 'Featured Investigation',
    readTime: '14 min read',
    publishedAt: '2026-02-21',
    excerpt: '3 Beverly Hills plastic surgeons and 1 physician assistant billed Medicare $45.6 million — with 83-95% of billing in wound care, not cosmetic surgery. One co-founded the "Wound Institutes of America."',
    keyFindings: [
      'Johnson Lee: $22.5M (89% wound care, 81.4% drugs)',
      'Som Kohanzadeh: $14.7M (90.3% wound care, co-founded "Wound Institutes of America")',
      'Beverly Hills — one of America\'s wealthiest ZIP codes — is an unusual wound care hub',
      'DOJ\'s 2025 takedown specifically targeted this billing pattern',
    ],
  },
  {
    title: 'Still Out There: The Providers Who Bill Like Criminals',
    description: 'Our AI trained on 8,300+ confirmed fraudsters found providers with identical billing patterns still collecting from Medicare.',
    href: '/investigations/still-out-there',
    category: '🤖 ML Investigation',
    readTime: '10 min read',
    publishedAt: '2026-02-21',
    excerpt: 'We trained a machine learning model on every confirmed Medicare fraudster — DOJ indictments, HHS OIG exclusions, FCA settlements. Then we ran it on 1.7 million active providers. The results were sobering.',
    keyFindings: [
      'Model trained on 8,300+ confirmed fraudsters from LEIE + DOJ + FCA',
      'Hundreds of providers match convicted criminal billing patterns',
      'Previously validated: our algorithm flagged providers before DOJ charged them',
      'Key features: services-per-day, code concentration, specialty deviation',
    ],
  },
]

const investigations = [
  {
    title: 'The $328M Genetic Testing Scam: How Medicare Became an ATM for Fake Labs',
    description: 'Former NFL player convicted in $328M scheme. Genetic testing fraud is one of Medicare\'s fastest-growing problems.',
    href: '/investigations/genetic-testing-fraud',
    category: '🔴 Breaking',
    readTime: '8 min read',
    publishedAt: '2026-02-21',
    excerpt: 'Keith J. Gray was convicted Thursday for a $328M genetic testing fraud scheme. But his case is just one symptom — genetic testing has become one of Medicare\'s most exploited billing categories.'
  },
  {
    title: 'The $2.1 Trillion Writeoff',
    description: 'Why doctors charge 4x what they get paid — and where $2.14 trillion in Medicare charges vanish',
    href: '/investigations/two-trillion-writeoff',
    category: 'Investigation',
    readTime: '15 min read',
    publishedAt: '2026-02-25',
    excerpt: 'Over 10 years, providers submitted $3.22 trillion in charges to Medicare. Medicare paid $854.8 billion. The other $2.14 trillion — 66.3% — was written off. This is the biggest hidden number in healthcare.'
  },
  {
    title: '9,862 Services Per Day: The Most Impossible Doctor in America',
    description: 'One provider billed 2.47 million Medicare services in 2023 — one every 2.9 seconds',
    href: '/investigations/9862-services-per-day',
    category: 'Investigation',
    readTime: '12 min read',
    publishedAt: '2026-02-24',
    excerpt: 'Madhavi Rayapudi, an infectious disease specialist in Georgia, billed Medicare for 2,465,495 services in a single year. That\'s 9,862 per working day. The math doesn\'t add up.'
  },
  {
    title: 'Houston: America\'s Medicare Capital',
    description: '$9.24 billion in Medicare spending — more than most states',
    href: '/investigations/houston-medicare-capital',
    category: 'Analysis',
    readTime: '10 min read',
    publishedAt: '2026-02-23',
    excerpt: 'Houston leads the nation with $9.24 billion in Medicare spending across 19,925 providers. The Texas Medical Center effect makes the Bayou City America\'s healthcare billing capital.'
  },
  {
    title: 'Medicare\'s Biggest Billers',
    description: 'The 100 providers who received the most Medicare payments in 2023',
    href: '/investigations/biggest-billers',
    category: 'Analysis',
    readTime: '12 min read',
    publishedAt: '2024-02-10',
    excerpt: 'A deep dive into Medicare\'s top-earning providers reveals patterns in specialty care, geographic concentration, and billing practices that raise questions about healthcare resource allocation.'
  },
  {
    title: 'The Drug Money Pipeline',
    description: 'How Medicare Part B became a $40 billion drug spending program',
    href: '/investigations/drug-pipeline',
    category: 'Investigation',
    readTime: '18 min read',
    publishedAt: '2024-02-05',
    excerpt: 'Medicare Part B drug spending has exploded over the past decade, with oncology and rheumatology driving unprecedented growth in physician-administered drug costs.'
  },
  {
    title: 'COVID\'s Impact on Medicare',
    description: 'How the pandemic shifted $50 billion in Medicare spending patterns',
    href: '/investigations/covid-impact',
    category: 'Analysis',
    readTime: '10 min read',
    publishedAt: '2024-01-28',
    excerpt: 'The COVID-19 pandemic dramatically altered Medicare spending, with telehealth surging and elective procedures plummeting. Our analysis reveals the lasting impacts on healthcare delivery.'
  },
  {
    title: 'Rural Healthcare\'s Price Tag',
    description: 'Why Medicare pays more for the same services in rural America',
    href: '/investigations/rural-price-tag',
    category: 'Deep Dive',
    readTime: '14 min read',
    publishedAt: '2024-01-20',
    excerpt: 'Rural healthcare providers receive higher Medicare reimbursements, but patients still face access challenges. We examine the geography of Medicare payments and healthcare equity.'
  },
  {
    title: 'The Specialty Pay Gap',
    description: 'How procedure-based specialties dominate Medicare spending',
    href: '/investigations/specialty-gap',
    category: 'Analysis',
    readTime: '11 min read',
    publishedAt: '2024-01-15',
    excerpt: 'Primary care physicians earn a fraction of what specialists make from Medicare, creating incentives that may distort healthcare delivery and access to basic services.'
  },
  // New investigations
  {
    title: 'The Anesthesia Markup',
    description: 'Why anesthesia charges are among the most inflated in Medicare — and who profits',
    href: '/investigations/anesthesia-markup',
    category: 'Analysis',
    readTime: '10 min read',
    publishedAt: '2024-02-18',
    excerpt: 'Anesthesia services consistently show some of the highest charge-to-payment ratios in Medicare. We investigate the providers and practices behind the markup.'
  },
  {
    title: 'Medicare\'s Biggest Spenders',
    description: 'A data-driven look at the providers collecting the most from Medicare',
    href: '/investigations/medicare-biggest-spenders',
    category: 'Investigation',
    readTime: '14 min read',
    publishedAt: '2024-02-17',
    excerpt: 'Who receives the most Medicare money? Our analysis reveals the organizations and individuals at the top of Medicare\'s payment hierarchy.'
  },
  {
    title: 'The State Spending Divide',
    description: 'Why Medicare costs vary wildly across state lines',
    href: '/investigations/state-spending-divide',
    category: 'Investigation',
    readTime: '12 min read',
    publishedAt: '2024-02-16',
    excerpt: 'Medicare spending per beneficiary varies by more than 2x across states. We map the divide and explore what drives regional differences in healthcare costs.'
  },
  {
    title: 'Corporate Medicine',
    description: 'How large healthcare organizations dominate Medicare billing',
    href: '/investigations/corporate-medicine',
    category: 'Deep Dive',
    readTime: '16 min read',
    publishedAt: '2024-02-14',
    excerpt: 'The rise of corporate healthcare entities has reshaped Medicare spending. We trace the growth of organizational billing and what it means for patients.'
  },
  {
    title: 'The Office Visit Economy',
    description: 'Office visits are Medicare\'s bread and butter — here\'s what the data shows',
    href: '/investigations/office-visit-economy',
    category: 'Analysis',
    readTime: '9 min read',
    publishedAt: '2024-02-12',
    excerpt: 'Evaluation and management codes account for the largest share of Medicare spending. We break down the economics of the humble office visit.'
  },
  {
    title: 'Pandemic Recovery',
    description: 'How Medicare spending rebounded — and what changed permanently',
    href: '/investigations/pandemic-recovery',
    category: 'Analysis',
    readTime: '11 min read',
    publishedAt: '2024-02-08',
    excerpt: 'After the COVID-19 crash, Medicare spending recovered — but the landscape shifted. Telehealth persisted, some specialties boomed, and others never fully recovered.'
  },
  {
    title: 'Eye Care Billions',
    description: 'Ophthalmology\'s outsized share of Medicare spending',
    href: '/investigations/eye-care-billions',
    category: 'Investigation',
    readTime: '13 min read',
    publishedAt: '2024-02-03',
    excerpt: 'Eye care is one of Medicare\'s largest spending categories. We investigate the procedures, providers, and drug costs driving billions in ophthalmology payments.'
  },
  {
    title: 'Where Your Medicare Dollar Goes',
    description: 'A comprehensive breakdown of Medicare spending flows',
    href: '/investigations/where-medicare-dollar-goes',
    category: 'Deep Dive',
    readTime: '10 min read',
    publishedAt: '2024-01-30',
    excerpt: 'For every dollar Medicare spends, where does it actually go? We trace the flow of Medicare payments across specialties, procedures, and geographies.'
  },
  {
    title: 'The COVID Test Gold Rush',
    description: 'How Medicare lost billions to K1034 fraud — one $12 test at a time',
    href: '/investigations/covid-test-scheme',
    category: 'Investigation',
    readTime: '14 min read',
    publishedAt: '2026-02-20',
    excerpt: 'K1034 was created for COVID OTC tests at ~$12 each. Some providers billed millions. Merry Taheri, a single nurse practitioner in Torrance, CA, billed $12.1M — 990x the specialty median.'
  },
  {
    title: 'The Wound Care Industrial Complex',
    description: 'Medicare\'s most vulnerable program: skin substitutes, debridement markups, and the DOJ\'s largest-ever takedown',
    href: '/investigations/wound-care-crisis',
    category: 'Investigation',
    readTime: '16 min read',
    publishedAt: '2026-02-19',
    excerpt: 'HHS-OIG calls skin substitutes "particularly vulnerable to fraud." The DOJ\'s $14.6B takedown targeted wound care. We follow the money from Beverly Hills to the DOJ.'
  },
  {
    title: 'The Impossible Doctors',
    description: 'When the math doesn\'t add up: providers billing 400+ services per day',
    href: '/investigations/impossible-doctors',
    category: 'Investigation',
    readTime: '12 min read',
    publishedAt: '2026-02-18',
    excerpt: 'Individual providers billing 400+ services per day — a new patient every 72 seconds for 8 hours straight. Either these are the fastest doctors in America, or something else is going on.'
  },
  {
    title: 'Medicare\'s Millionaire Club',
    description: 'The 1% who bill the most — and the average family doctor earns $55K',
    href: '/investigations/medicare-millionaires',
    category: 'Investigation',
    readTime: '14 min read',
    publishedAt: '2026-02-21',
    excerpt: 'The average family doctor earns $55K from Medicare. These providers bill $10M+. Inside the millionaire club: 1,000 providers who collected billions from Medicare over the past decade.'
  },
  {
    title: 'The Specialty Monopoly',
    description: 'Where Medicare money really goes — 5 specialties control 33% of all spending',
    href: '/investigations/specialty-monopoly',
    category: 'Deep Dive',
    readTime: '12 min read',
    publishedAt: '2026-02-21',
    excerpt: 'Just 5 specialties account for 33% of all Medicare spending. Clinical labs earn $1.9M per provider while nurse practitioners average $26K. The specialty you choose determines your Medicare income.'
  },
  {
    title: 'The 10-Year Explosion',
    description: 'How Medicare spending grew 20% in a decade — and where it\'s heading by 2030',
    href: '/investigations/ten-year-explosion',
    category: 'Analysis',
    readTime: '13 min read',
    publishedAt: '2026-02-21',
    excerpt: 'Medicare spending grew from $78B to $94B in 10 years. COVID crashed it 10% in 2020, then it rebounded past pre-pandemic levels. At this rate, we\'re heading toward $110B+ by 2030.'
  },
  {
    title: 'ZIP Code Lottery',
    description: 'Why your Medicare costs depend on where you live — a 7x gap across states',
    href: '/investigations/geographic-inequality',
    category: 'Investigation',
    readTime: '15 min read',
    publishedAt: '2026-02-21',
    excerpt: 'Medicare pays $121K per provider in Florida but $18K in Puerto Rico. Urban providers earn $20K more than rural ones. Miami-Dade is the Medicare fraud capital of America.'
  },
  {
    title: 'Follow the Drug Money',
    description: 'Medicare\'s pharmaceutical pipeline: $94 billion and one $19.7B eye drug',
    href: '/investigations/drug-money',
    category: 'Investigation',
    readTime: '16 min read',
    publishedAt: '2026-02-21',
    excerpt: 'One eye injection drug — aflibercept — has cost Medicare $19.7 billion. Drug spending\'s share nearly doubled from 8% to 15%. The pharmaceutical pipeline keeps growing.'
  },
  {
    title: 'Medicare Fraud in 2025: The Biggest Cases and What\'s Changed',
    description: 'DOJ\'s $14.6B takedown, 324 defendants, and $6.8B in False Claims Act recoveries',
    href: '/investigations/medicare-fraud-2025',
    category: 'Investigation',
    readTime: '14 min read',
    publishedAt: '2026-02-21',
    excerpt: '2025 was the biggest year for Medicare fraud enforcement in history. The DOJ charged 324 defendants in a $14.6 billion takedown while False Claims Act recoveries hit a record $6.8 billion.'
  },
  {
    title: 'How Much Does Medicare Actually Pay Doctors?',
    description: 'Average Medicare payment per provider by specialty — from $26K to $384K',
    href: '/investigations/how-much-does-medicare-pay',
    category: 'Analysis',
    readTime: '11 min read',
    publishedAt: '2026-02-21',
    excerpt: 'The range is enormous: from $26K for nurse practitioners to $384K for ophthalmologists. We break down the fee schedule, markup ratios, and how Medicare compares to private insurance.'
  },
  {
    title: 'How to Look Up Your Doctor\'s Medicare Billing',
    description: 'A step-by-step guide to searching Medicare provider data',
    href: '/investigations/medicare-provider-lookup-guide',
    category: 'Analysis',
    readTime: '8 min read',
    publishedAt: '2026-02-21',
    excerpt: 'Search by name or NPI, understand payment data, read provider profiles, and learn what fraud flags mean. A complete guide to using OpenMedicare\'s provider lookup tool.'
  },
  {
    title: 'The Most Expensive Medicare Procedures in 2023',
    description: 'Top 20 procedures by total payments and average cost per service',
    href: '/investigations/most-expensive-medicare-procedures',
    category: 'Analysis',
    readTime: '10 min read',
    publishedAt: '2026-02-21',
    excerpt: 'Office visits dominate by volume at $73B, but drug injections cost thousands per service. Aflibercept, chemotherapy, and cardiac procedures lead per-unit costs.'
  },
  {
    title: 'Medicare Spending by State: A Complete Breakdown',
    description: 'Every state ranked by total spending, per-provider payments, and markup ratios',
    href: '/investigations/medicare-spending-by-state',
    category: 'Analysis',
    readTime: '12 min read',
    publishedAt: '2026-02-21',
    excerpt: 'California leads total spending at $93B, but Florida leads per-provider at $121K. The gap between highest and lowest per-provider spending is more than 7x.'
  },
  {
    title: 'Two Companies Control America\'s Lab Testing — and Bill Medicare Billions',
    description: 'LabCorp and Quest Diagnostics: 37 NPIs, $14 billion, and 25% of all clinical lab payments',
    href: '/investigations/lab-corp-quest-duopoly',
    category: 'Investigation',
    readTime: '14 min read',
    publishedAt: '2026-02-21',
    excerpt: 'LabCorp and Quest Diagnostics operate 37 NPIs across the country, billing Medicare $14 billion over 10 years. Together they handle 25% of all clinical laboratory billing. Is this efficiency or monopoly?'
  },
  {
    title: 'The Telehealth Explosion: How COVID Changed Medicare Forever',
    description: 'Medicare spending crashed 10% in 2020, then telehealth rewrote the rules',
    href: '/investigations/telehealth-explosion',
    category: 'Investigation',
    readTime: '13 min read',
    publishedAt: '2026-02-21',
    excerpt: 'COVID forced CMS to allow telehealth billing overnight. Medicare spending crashed 10% in 2020 then rebounded past pre-pandemic levels. Telehealth is here to stay — but is it saving money or enabling fraud?'
  },
  {
    title: 'The Rise of the Nurse Practitioner: Medicare\'s Fastest-Growing Workforce',
    description: '1.2 million NP records, $31.5 billion in payments, and a scope-of-practice war',
    href: '/investigations/nurse-practitioner-boom',
    category: 'Investigation',
    readTime: '14 min read',
    publishedAt: '2026-02-21',
    excerpt: 'Nurse practitioners are 11.4% of all Medicare providers but average just $26K in payments. Some NPs bill millions. The scope of practice debate meets Medicare data.'
  },
  {
    title: 'The Oncology Drug Pipeline',
    description: 'How cancer doctors bill millions in drug costs — 532 oncologists with impossible volumes',
    href: '/investigations/oncology-drug-pipeline',
    category: 'Investigation',
    readTime: '14 min read',
    publishedAt: '2026-02-21',
    excerpt: '24 oncologists with >80% drug billing and >$5M each — $171M combined. Oncology has the most impossible-volume providers of any specialty: 532 out of ~1,100. The ASP+6% formula incentivizes expensive drugs.'
  },
  {
    title: 'Florida\'s Fraud Factory',
    description: '185 impossible providers billing $573M — more than California and Texas combined',
    href: '/investigations/florida-infectious-disease',
    category: 'Investigation',
    readTime: '13 min read',
    publishedAt: '2026-02-21',
    excerpt: 'Florida has 185 individual providers billing 400+ services per day — 17% of the national total from one state. From Fort Walton Beach to The Villages, small cities harbor impossible billing volumes.'
  },
  {
    title: 'Beverly Hills: America\'s Most Expensive ZIP Code for Medicare',
    description: 'Plastic surgeons billing wound care, ambulatory surgery centers, and the luxury ZIP code effect',
    href: '/investigations/beverly-hills-billing',
    category: 'Investigation',
    readTime: '13 min read',
    publishedAt: '2026-02-21',
    excerpt: 'Beverly Hills providers bill Medicare at rates far exceeding the national average. Plastic surgeons billing wound care, ambulatory surgery centers, and the luxury ZIP code effect.'
  },
  {
    title: 'The Medicare Markup Machine',
    description: 'How doctors charge $100 billion more than Medicare actually pays them — and why the system incentivizes overbilling',
    href: '/investigations/markup-machine',
    category: 'Deep Dive',
    readTime: '15 min read',
    publishedAt: '2024-02-15',
    excerpt: 'Providers submit charges that average 2.4x what Medicare actually pays. The gap between submitted and paid amounts reveals a hidden $100 billion markup built into the system.'
  },
  {
    title: 'The Specialty Pay Gap (Extended)',
    description: 'An expanded analysis of Medicare specialty compensation disparities',
    href: '/investigations/specialty-pay-gap',
    category: 'Analysis',
    readTime: '12 min read',
    publishedAt: '2024-01-10',
    excerpt: 'An expanded deep-dive into how Medicare compensation varies across specialties — from nurse practitioners averaging $26K to ophthalmologists at $384K.'
  },
  {
    title: 'Three Providers, Three Red Flags',
    description: 'Inside Medicare\'s most suspicious billing patterns — a COVID test mill, a wound care scheme, and a markup machine',
    href: '/investigations/three-providers',
    category: 'Investigation',
    readTime: '15 min read',
    publishedAt: '2026-02-15',
    excerpt: 'A nurse practitioner billing $12.1M in COVID tests. A Beverly Hills plastic surgeon billing $28.9M in wound care. An anti-aging spa doctor with a 197.7x markup. Three providers, three statistical anomalies.'
  },
  {
    title: 'How We Built an ML Fraud Detection Model for 1.7 Million Medicare Providers',
    description: 'Technical deep-dive: supervised ML fraud detection on 96M rows of Medicare data. Training labels from LEIE + DOJ, Random Forest with AUC 0.83.',
    href: '/investigations/how-we-built-the-model',
    category: 'Deep Dive',
    readTime: '20 min read',
    publishedAt: '2026-02-21',
    excerpt: 'A technical deep-dive into building a supervised Random Forest model trained on 96M rows of Medicare billing data and 8,300+ confirmed fraud labels from LEIE/DOJ. AUC 0.83, feature engineering, and lessons learned.'
  },
  {
    title: 'Why Internal Medicine Is Ground Zero for Medicare Fraud',
    description: '53% of all AI-flagged Medicare providers are Internal Medicine. Volume + discretion = opportunity.',
    href: '/investigations/internal-medicine-crisis',
    category: 'Analysis',
    readTime: '12 min read',
    publishedAt: '2026-02-21',
    excerpt: '263 of 500 AI-flagged providers (53%) are Internal Medicine specialists. High-volume billing, broad procedure codes, and easy-to-pad office visits make IM the #1 specialty for fraud-pattern matches.'
  },
  {
    title: 'The Fraud Belt: Why California and Florida Lead Medicare Fraud',
    description: 'CA and FL tied at 56 flagged providers each. Fraud follows the sun — and the elderly population.',
    href: '/investigations/florida-california-fraud',
    category: 'Analysis',
    readTime: '14 min read',
    publishedAt: '2026-02-21',
    excerpt: 'California and Florida each have 56 AI-flagged Medicare providers — 22.4% of all flags. Combined with NY, TX, and NJ, five states account for over half of all suspicious billing patterns.'
  },
  {
    title: 'The Million-Dollar Club: 47 AI-Flagged Providers Who Billed Over $1M Each',
    description: '47 providers flagged for fraud patterns each billed over $1M. Terrance Hughes alone: $5.3M.',
    href: '/investigations/million-dollar-flagged',
    category: 'Investigation',
    readTime: '10 min read',
    publishedAt: '2026-02-21',
    excerpt: '47 providers flagged by our AI model each billed Medicare over $1 million. Combined, they collected over $93 million in taxpayer money — while matching the billing patterns of convicted fraudsters.'
  },
  {
    title: "California's Medicare Fraud Problem: 56 AI-Flagged Providers and $47M in Payments",
    description: '56 California providers flagged by our AI model billed $47M in suspicious Medicare payments.',
    href: '/investigations/california-medicare-fraud',
    category: 'Investigation',
    readTime: '12 min read',
    publishedAt: '2026-02-21',
    excerpt: '56 California providers flagged by our AI fraud detection model billed Medicare $47 million. From Los Angeles clinics to Bay Area labs, these providers match the billing patterns of previously convicted fraudsters.'
  },
  {
    title: "Florida's Medicare Fraud Epidemic: 56 AI-Flagged Providers Billing $52M",
    description: '56 Florida providers flagged for fraud patterns billed Medicare $52M.',
    href: '/investigations/florida-medicare-fraud',
    category: 'Investigation',
    readTime: '12 min read',
    publishedAt: '2026-02-21',
    excerpt: "Florida has long been America's Medicare fraud capital. Our AI model flagged 56 providers billing $52 million in suspicious patterns — from Miami's notorious medical corridors to Tampa Bay clinics."
  },
  {
    title: "New York's Hidden Medicare Fraud: 39 AI-Flagged Providers",
    description: '39 New York providers flagged by our AI model for suspicious Medicare billing patterns.',
    href: '/investigations/new-york-medicare-fraud',
    category: 'Investigation',
    readTime: '11 min read',
    publishedAt: '2026-02-21',
    excerpt: "39 New York providers were flagged by our AI fraud detection model for billing patterns that match convicted fraudsters. From Brooklyn clinics to Manhattan specialists, these providers warrant closer scrutiny."
  },
]

const categories = [
  { name: 'All', count: investigations.length + 1 },
  { name: 'Deep Dive', count: investigations.filter(i => i.category === 'Deep Dive').length + 1 },
  { name: 'Analysis', count: investigations.filter(i => i.category === 'Analysis').length },
  { name: 'Investigation', count: investigations.filter(i => i.category === 'Investigation').length },
]

export default function InvestigationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { name: 'Investigations' }
          ]}
          className="mb-8"
        />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 font-playfair mb-4">
            Investigations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {investigations.length + 1} data-driven investigations on Medicare spending patterns, healthcare fraud, and transparency. 
            Our team analyzes billions in Medicare payments to uncover stories that matter.
          </p>
        </div>

        {/* NEW Featured Investigations */}
        {featuredInvestigations.map((fi) => (
          <div key={fi.href} className="bg-gradient-to-r from-red-700 to-red-900 rounded-lg shadow-lg text-white mb-8">
            <div className="p-8 lg:p-12">
              <div className="flex items-center mb-4">
                <FireIcon className="h-6 w-6 mr-2" />
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  🔥 New Investigation
                </span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4">
                {fi.title}
              </h2>
              
              <p className="text-xl text-red-100 mb-6 max-w-4xl">
                {fi.description}
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-red-100 mb-4">
                    {fi.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-red-200">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {fi.readTime}
                    </div>
                    <span>•</span>
                    <span>{new Date(fi.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white mb-3">Key Findings:</h3>
                  <ul className="space-y-2 text-red-100">
                    {fi.keyFindings.map((finding, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-300 mr-2">•</span>
                        <span className="text-sm">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Link 
                href={fi.href}
                className="inline-flex items-center px-8 py-3 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Read Full Investigation
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        ))}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.name}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {category.name}
              <span className="ml-2 bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Investigation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {investigations.map((investigation) => (
            <article 
              key={investigation.href} 
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    investigation.category === 'Deep Dive' ? 'bg-purple-100 text-purple-800' :
                    investigation.category === 'Analysis' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {investigation.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {investigation.readTime}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 font-playfair">
                  <Link 
                    href={investigation.href}
                    className="hover:text-medicare-primary transition-colors"
                  >
                    {investigation.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {investigation.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(investigation.publishedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  
                  <Link 
                    href={investigation.href}
                    className="inline-flex items-center text-medicare-primary hover:text-medicare-dark font-medium text-sm"
                  >
                    Read More
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Related Data Pages */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore the Data Behind the Stories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link href="/providers" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="text-xl mb-1">👨‍⚕️</div>
              <div className="font-medium text-blue-600 text-sm">Providers</div>
            </Link>
            <Link href="/states" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="text-xl mb-1">📍</div>
              <div className="font-medium text-blue-600 text-sm">States</div>
            </Link>
            <Link href="/specialties" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="text-xl mb-1">🩺</div>
              <div className="font-medium text-blue-600 text-sm">Specialties</div>
            </Link>
            <Link href="/procedures" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="text-xl mb-1">📋</div>
              <div className="font-medium text-blue-600 text-sm">Procedures</div>
            </Link>
            <Link href="/fraud" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="text-xl mb-1">🚨</div>
              <div className="font-medium text-blue-600 text-sm">Fraud Hub</div>
            </Link>
            <Link href="/analysis" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="text-xl mb-1">📊</div>
              <div className="font-medium text-blue-600 text-sm">Analysis</div>
            </Link>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mb-8">
          <NewsletterCTA />
        </div>

        {/* Share Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Share Our Investigations
            </h3>
            <ShareButtons
              url="/investigations"
              title="OpenMedicare Investigations"
              description="Data-driven investigative reporting on Medicare spending and healthcare transparency"
              className="justify-center"
            />
          </div>
        </div>

        {/* Source Citation */}
        <SourceCitation 
          lastUpdated="February 2026 (data through 2023, the latest CMS release)"
          sources={[
            'Centers for Medicare & Medicaid Services (CMS)',
            'Medicare Provider Utilization and Payment Data (2014-2023)',
            'Medicare Part B National Summary Data',
            'CMS National Health Expenditure Data'
          ]}
        />
      </div>
    </div>
  )
}
