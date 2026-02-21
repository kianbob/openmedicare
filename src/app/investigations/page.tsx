import type { Metadata } from 'next'
import Link from 'next/link'
import { ClockIcon, ArrowRightIcon, FireIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import NewsletterCTA from '@/components/NewsletterCTA'
import SourceCitation from '@/components/SourceCitation'

export const metadata: Metadata = {
  title: 'Investigations',
  description: 'Deep-dive investigative reporting on Medicare spending patterns, fraud, and healthcare transparency. 27 data-driven investigations.',
  alternates: {
    canonical: '/investigations',
  },
}

const featuredInvestigation = {
  title: 'The Medicare Markup Machine',
  description: 'How doctors charge $100 billion more than Medicare actually pays them — and why the system incentivizes overbilling',
  href: '/investigations/markup-machine',
  category: 'Deep Dive',
  readTime: '15 min read',
  publishedAt: '2024-02-15',
  excerpt: 'Our analysis of 10 years of Medicare data reveals a systematic pattern of inflated charges across healthcare specialties. While Medicare caps actual payments, providers continue submitting charges 2-3 times higher than reimbursement rates.',
  keyFindings: [
    'Providers submitted $892 billion in charges but received $297 billion in actual payments',
    'Orthopedic surgeons show the highest markup ratios at 3.2x Medicare payments',
    'Rural providers markup charges 15% higher than urban counterparts'
  ],
}

const investigations = [
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

        {/* Featured Investigation */}
        <div className="bg-gradient-to-r from-medicare-primary to-medicare-dark rounded-lg shadow-lg text-white mb-12">
          <div className="p-8 lg:p-12">
            <div className="flex items-center mb-4">
              <FireIcon className="h-6 w-6 mr-2" />
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                Featured Investigation
              </span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4">
              {featuredInvestigation.title}
            </h2>
            
            <p className="text-xl text-blue-100 mb-6 max-w-4xl">
              {featuredInvestigation.description}
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-blue-100 mb-4">
                  {featuredInvestigation.excerpt}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-blue-200">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {featuredInvestigation.readTime}
                  </div>
                  <span>•</span>
                  <span>{new Date(featuredInvestigation.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-3">Key Findings:</h3>
                <ul className="space-y-2 text-blue-100">
                  {featuredInvestigation.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-300 mr-2">•</span>
                      <span className="text-sm">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <Link 
              href={featuredInvestigation.href}
              className="inline-flex items-center px-8 py-3 bg-white text-medicare-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Read Full Investigation
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

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
