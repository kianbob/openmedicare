import type { Metadata } from 'next'
import Link from 'next/link'
import { ClockIcon, ArrowRightIcon, FireIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'

export const metadata: Metadata = {
  title: 'Investigations',
  description: 'Deep-dive investigative reporting on Medicare spending patterns, fraud, and healthcare transparency.',
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
  isFeatured: true
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
    href: '/investigations/specialty-pay-gap',
    category: 'Analysis',
    readTime: '11 min read',
    publishedAt: '2024-01-15',
    excerpt: 'Primary care physicians earn a fraction of what specialists make from Medicare, creating incentives that may distort healthcare delivery and access to basic services.'
  }
]

const categories = [
  { name: 'All', count: investigations.length + 1 },
  { name: 'Deep Dive', count: 3 },
  { name: 'Analysis', count: 3 },
  { name: 'Investigation', count: 1 }
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
            Data-driven investigative reporting on Medicare spending patterns, healthcare fraud, and transparency. 
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
              key={investigation.title} 
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
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Get notified when we publish new investigations and analysis. 
              Our newsletter delivers the latest Medicare transparency stories directly to your inbox.
            </p>
            
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-medicare-primary focus:border-medicare-primary"
              />
              <button className="px-6 py-3 bg-medicare-primary text-white font-medium rounded-r-lg hover:bg-medicare-dark transition-colors">
                Subscribe
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              We never share your email. Unsubscribe anytime.
            </p>
          </div>
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
          lastUpdated="February 2024"
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