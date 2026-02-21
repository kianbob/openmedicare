import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { formatCurrency, formatNumber } from '@/lib/format'
import SourceCitation from '@/components/SourceCitation'

function loadStats() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'stats.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return null }
}

const realStats = loadStats()
const keyStats = {
  totalPayments: realStats?.total_payments || 854842324155,
  totalProviders: realStats?.total_providers || 1721798,
  yearsOfData: realStats?.years_covered?.length || 10,
  latestYear: 2023
}

const featuredInvestigations = [
  {
    title: 'The Medicare Markup Machine',
    description: 'How doctors charge $100 billion more than Medicare actually pays them',
    href: '/investigations/markup-machine',
    category: 'Analysis',
    readTime: '8 min read'
  },
  {
    title: 'Medicare\'s Biggest Billers',
    description: 'The 100 providers who received the most Medicare payments in 2023',
    href: '/investigations/biggest-billers',
    category: 'Investigation',
    readTime: '12 min read'
  },
  {
    title: 'COVID\'s Impact on Medicare',
    description: 'How the pandemic shifted $50 billion in Medicare spending patterns',
    href: '/investigations/covid-impact',
    category: 'Analysis',
    readTime: '10 min read'
  }
]

const keyNumbers = [
  {
    label: 'Total Medicare Payments',
    value: formatCurrency(keyStats.totalPayments),
    sublabel: '2014-2023',
    icon: '💰'
  },
  {
    label: 'Healthcare Providers',
    value: formatNumber(keyStats.totalProviders),
    sublabel: 'Tracked in database',
    icon: '👩‍⚕️'
  },
  {
    label: 'Years of Data',
    value: keyStats.yearsOfData.toString(),
    sublabel: '2014-2023',
    icon: '📊'
  },
  {
    label: 'Latest CMS Release',
    value: keyStats.latestYear.toString(),
    sublabel: 'Most recent available',
    icon: '🆕'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-medicare-primary to-medicare-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-playfair mb-6">
              Follow the Money in Medicare
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
              Professional data journalism tracking Medicare physician spending across 10 years (2014-2023). 
              Explore {formatCurrency(keyStats.totalPayments)} in payments to {formatNumber(keyStats.totalProviders)} providers.
            </p>
            
            {/* Search CTA */}
            <div className="max-w-md mx-auto mb-12">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search providers, procedures, or locations..."
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-lg"
                />
              </div>
              <Link 
                href="/lookup"
                className="inline-block mt-4 text-blue-100 hover:text-white underline text-sm"
              >
                Advanced Provider Lookup →
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/providers"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-medicare-primary bg-white hover:bg-gray-100 transition-colors"
              >
                Explore Providers
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/investigations"
                className="inline-flex items-center px-8 py-4 border border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-medicare-primary transition-colors"
              >
                Read Investigations
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Key Numbers */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-4">
              By the Numbers
            </h2>
            <p className="text-lg text-gray-600">
              A decade of Medicare spending data at your fingertips
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyNumbers.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-4xl font-bold text-medicare-primary mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Investigations */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-4">
              Featured Investigations
            </h2>
            <p className="text-lg text-gray-600">
              Deep-dive analysis and data-driven journalism
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredInvestigations.map((article) => (
              <article key={article.title} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-medicare-primary text-white">
                      {article.category}
                    </span>
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-medicare-primary">
                    <Link href={article.href}>
                      {article.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  
                  <Link 
                    href={article.href}
                    className="inline-flex items-center text-medicare-primary hover:text-medicare-dark font-medium"
                  >
                    Read More
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/investigations"
              className="inline-flex items-center px-6 py-3 border border-medicare-primary text-medicare-primary hover:bg-medicare-primary hover:text-white font-medium rounded-md transition-colors"
            >
              View All Investigations
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-4">
              Quick Access
            </h2>
            <p className="text-lg text-gray-600">
              Jump into the data that matters most
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/watchlist" className="group bg-red-50 hover:bg-red-100 rounded-lg p-6 transition-colors">
              <div className="text-red-600 text-2xl mb-3">🚨</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-800">Fraud Watchlist</h3>
              <p className="text-sm text-gray-600">High-risk providers flagged by our analysis</p>
            </Link>
            
            <Link href="/markup" className="group bg-orange-50 hover:bg-orange-100 rounded-lg p-6 transition-colors">
              <div className="text-orange-600 text-2xl mb-3">📈</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-800">Markup Analysis</h3>
              <p className="text-sm text-gray-600">What doctors charge vs. what Medicare pays</p>
            </Link>
            
            <Link href="/trends" className="group bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition-colors">
              <div className="text-blue-600 text-2xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-800">Spending Trends</h3>
              <p className="text-sm text-gray-600">10-year Medicare spending patterns</p>
            </Link>
            
            <Link href="/calculator" className="group bg-green-50 hover:bg-green-100 rounded-lg p-6 transition-colors">
              <div className="text-green-600 text-2xl mb-3">🧮</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-800">Cost Calculator</h3>
              <p className="text-sm text-gray-600">Estimate Medicare procedure costs</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Source Citation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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