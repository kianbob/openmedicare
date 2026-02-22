import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { formatCurrency, formatNumber } from '@/lib/format'
import SourceCitation from '@/components/SourceCitation'
import StateHeatmap from '@/components/StateHeatmap'
import NewsletterCTA from '@/components/NewsletterCTA'

function loadTopFlagged() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'ml-v2-results.json'), 'utf-8')
    const data = JSON.parse(raw)
    const providers = data.still_out_there || []
    // Top 5 by risk rank
    const top5 = providers.sort((a: any, b: any) => a.risk_rank - b.risk_rank).slice(0, 5)
    // Fraud by state counts
    const stateCounts: Record<string, number> = {}
    providers.forEach((p: any) => { stateCounts[p.state] = (stateCounts[p.state] || 0) + 1 })
    const topStates = Object.entries(stateCounts)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 5)
      .map(([state, count]) => ({ state, count }))
    return { top5, topStates, totalFlagged: providers.length }
  } catch { return { top5: [], topStates: [], totalFlagged: 0 } }
}

const mlData = loadTopFlagged()

function loadStates() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'states.json'), 'utf-8')
    const data = JSON.parse(raw)
    return (data.states || []).map((s: { state: string; total_payments: number }) => ({
      code: s.state,
      value: s.total_payments,
      label: 'Total Payments',
    }))
  } catch { return [] }
}

function loadStats() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'stats.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return null }
}

const stateHeatmapData = loadStates()
const realStats = loadStats()
const keyStats = {
  totalPayments: realStats?.total_payments || 854842324155,
  totalProviders: realStats?.total_providers || 1721798,
  yearsOfData: realStats?.years_covered?.length || 10,
  latestYear: 2023
}

const datasetJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Medicare Provider Utilization and Payment Data',
  description: 'Comprehensive analysis of Medicare physician spending across 10 years (2014-2023), covering provider payments, procedure costs, specialty breakdowns, and geographic trends derived from CMS public data.',
  creator: {
    '@type': 'Organization',
    name: 'Centers for Medicare & Medicaid Services (CMS)',
    url: 'https://www.cms.gov',
  },
  temporalCoverage: '2014/2023',
  license: 'https://www.usa.gov/government-works',
  url: 'https://openmedicare.vercel.app',
  distribution: {
    '@type': 'DataDownload',
    encodingFormat: 'application/json',
    contentUrl: 'https://openmedicare.vercel.app/downloads',
  },
}

const featuredInvestigations = [
  {
    title: 'The Algorithm Knows',
    description: 'How AI detects Medicare fraud before humans do — and what it means for healthcare oversight',
    href: '/investigations/algorithm-knows',
    category: '🤖 AI Analysis',
    readTime: '15 min read'
  },
  {
    title: 'Still Out There',
    description: 'Our AI trained on 8,300+ confirmed fraudsters found 500 providers with identical billing patterns still collecting from Medicare',
    href: '/investigations/still-out-there',
    category: '🚨 ML Investigation',
    readTime: '18 min read'
  },
  {
    title: 'The Florida Infectious Disease Ring',
    description: 'A network of infectious disease providers in Florida billing Medicare millions with suspicious patterns',
    href: '/investigations/florida-infectious-disease',
    category: 'Investigation',
    readTime: '16 min read'
  },
  {
    title: 'Three Providers, One Pattern',
    description: 'How three unrelated providers across different states share eerily identical billing fingerprints',
    href: '/investigations/three-providers',
    category: 'Investigation',
    readTime: '14 min read'
  },
  {
    title: 'The Biggest Billers',
    description: 'The providers collecting the most from Medicare — and what their billing reveals about the system',
    href: '/investigations/biggest-billers',
    category: 'Deep Dive',
    readTime: '15 min read'
  },
  {
    title: 'COVID\'s Impact on Medicare',
    description: 'How the pandemic reshaped Medicare spending, telehealth, and fraud in ways that persist today',
    href: '/investigations/covid-impact',
    category: 'Analysis',
    readTime: '12 min read'
  },
  {
    title: 'The Impossible Doctors',
    description: 'Providers billing for more services per day than hours in a day — the math doesn\'t add up',
    href: '/investigations/impossible-doctors',
    category: '🔍 Investigation',
    readTime: '14 min read'
  },
  {
    title: 'The Oncology Drug Pipeline',
    description: 'How cancer drugs became Medicare\'s biggest expense — and who profits from the pipeline',
    href: '/investigations/oncology-drug-pipeline',
    category: 'Deep Dive',
    readTime: '16 min read'
  }
]

const keyNumbers = [
  {
    value: '$3.77×',
    label: 'Average markup ratio',
    sublabel: 'Doctors charge nearly 4× what Medicare pays',
    icon: '📈'
  },
  {
    value: '500',
    label: 'AI-flagged providers',
    sublabel: 'ML model trained on confirmed fraudsters',
    icon: '🤖'
  },
  {
    value: '10 years',
    label: 'Of Medicare data',
    sublabel: 'Payment data analyzed (2014-2023)',
    icon: '📊'
  },
  {
    value: formatCurrency(keyStats.totalPayments),
    label: 'Total payments',
    sublabel: 'In our database',
    icon: '💰'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Dataset JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-medicare-primary to-medicare-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-blue-100 mb-6">
              Data through 2023 · Updated February 2026
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-playfair mb-6">
              Follow the Money in Medicare
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-4 max-w-4xl mx-auto">
              AI trained on 8,300+ convicted fraudsters analyzed 1.7 million Medicare providers.
            </p>
            <p className="text-lg text-blue-200 mb-8 max-w-3xl mx-auto">
              Explore {formatCurrency(keyStats.totalPayments)} in payments across 10 years of data (2014-2023). 
              Our ML model flagged 500 providers who bill like convicted criminals.
            </p>
            
            {/* Search CTA */}
            <div className="max-w-md mx-auto mb-12">
              <Link href="/search" className="block relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg leading-5 bg-white text-gray-500 text-lg text-left group-hover:ring-2 group-hover:ring-white transition-all">
                  Search providers, procedures, or locations...
                </div>
              </Link>
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
              <Link 
                href="/start"
                className="inline-flex items-center px-8 py-4 border border-white/50 text-lg font-medium rounded-md text-blue-100 hover:bg-white/10 transition-colors"
              >
                Start Here →
              </Link>
            </div>

            {/* Hook line */}
            <p className="mt-8 text-sm text-blue-200 max-w-2xl mx-auto">
              Our AI, trained on 8,300+ confirmed fraudsters, found 500 providers who bill like convicted criminals but haven&apos;t been caught.{' '}
              {formatCurrency(2840000000)} in COVID test billing. {formatCurrency(5530000000)} in wound care. {formatNumber(4636)} providers with impossible volumes.{' '}
              <Link href="/fraud" className="underline text-white hover:text-blue-100">See the fraud analysis →</Link>
            </p>
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

      {/* What We Found */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-4">
              What We Found
            </h2>
            <p className="text-lg text-gray-600">
              The most striking discoveries from our analysis
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                stat: '413 services/day',
                description: 'One nurse practitioner averaged 413 Medicare services per working day',
                href: '/fraud/impossible-numbers',
              },
              {
                stat: '59× markup',
                description: 'A Beverly Hills surgeon charges 59 times what Medicare pays for wound care',
                href: '/fraud/wound-care',
              },
              {
                stat: '$19.7 Billion',
                description: "One eye injection drug costs Medicare more than most agencies' budgets",
                href: '/investigations/eye-care-billions',
              },
              {
                stat: '3.77×',
                description: 'On average, doctors charge nearly 4 times what Medicare actually pays them',
                href: '/markup',
              },
            ].map((finding) => (
              <Link
                key={finding.stat}
                href={finding.href}
                className="group bg-white rounded-lg border-l-4 border-l-medicare-primary border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl font-bold text-medicare-primary mb-3">{finding.stat}</div>
                <p className="text-sm text-gray-600 group-hover:text-gray-900">{finding.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Top AI-Flagged Providers */}
      {mlData.top5.length > 0 && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-4">
                🤖 Top AI-Flagged Providers
              </h2>
              <p className="text-lg text-gray-600">
                Highest fraud probability scores from our ML model trained on confirmed fraudsters
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {mlData.top5.map((provider: any) => (
                <Link
                  key={provider.npi}
                  href={`/providers/${provider.npi}`}
                  className="bg-white border border-red-200 rounded-lg p-5 hover:shadow-lg hover:border-red-400 transition-all group"
                >
                  <div className="text-xs font-mono text-red-600 mb-1">#{provider.risk_rank}</div>
                  <div className="font-semibold text-gray-900 group-hover:text-red-700 mb-1 text-sm leading-tight">{provider.name}</div>
                  <div className="text-xs text-gray-500 mb-3">{provider.specialty} · {provider.state}</div>
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {(provider.fraud_probability * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">fraud probability</div>
                  <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
                    {formatCurrency(provider.total_payments)} payments
                  </div>
                </Link>
              ))}
            </div>

            {/* Fraud by State - Top 5 */}
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🗺️ Most AI-Flagged Providers by State</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {mlData.topStates.map((s: any) => (
                  <Link key={s.state} href={`/states/${s.state}`} className="text-center bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="text-2xl font-bold text-red-600">{s.count}</div>
                    <div className="text-sm font-medium text-gray-900">{s.state}</div>
                    <div className="text-xs text-gray-500">flagged providers</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                href="/fraud/still-out-there"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                View All {mlData.totalFlagged} Flagged Providers
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Latest Investigation */}
      <div className="py-16 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-700 text-indigo-100 mb-6">
              Latest Investigation
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-playfair mb-4">
              The Algorithm Knows
            </h2>
            <p className="text-lg text-indigo-200 mb-8">
              How AI detects Medicare fraud before humans do — and what it means for healthcare oversight. 
              Our model identified patterns invisible to traditional audits.
            </p>
            <Link
              href="/investigations/algorithm-knows"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-900 font-medium rounded-md hover:bg-indigo-50 transition-colors"
            >
              Read the Investigation
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* State Heatmap */}
      {stateHeatmapData.length > 0 && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StateHeatmap
              data={stateHeatmapData}
              title="Medicare Spending by State"
              linkPrefix="/states"
            />
          </div>
        </div>
      )}

      {/* Featured Investigations */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-4">
              Featured Investigations
            </h2>
            <p className="text-lg text-gray-600">
              Deep-dive analysis from our library of 64 data-driven investigations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              View All 59 Investigations
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Explore the Data */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-4">
              Explore the Data
            </h2>
            <p className="text-lg text-gray-600">
              Dive into Medicare spending from every angle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/providers" className="group bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition-colors">
              <div className="text-blue-600 text-2xl mb-3">👨‍⚕️</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-800">Providers</h3>
              <p className="text-sm text-gray-600">Search 2,941 top Medicare providers with full payment histories</p>
            </Link>

            <Link href="/procedures" className="group bg-purple-50 hover:bg-purple-100 rounded-lg p-6 transition-colors">
              <div className="text-purple-600 text-2xl mb-3">🏥</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-800">Procedures</h3>
              <p className="text-sm text-gray-600">500 most common procedures with costs and provider data</p>
            </Link>

            <Link href="/states" className="group bg-green-50 hover:bg-green-100 rounded-lg p-6 transition-colors">
              <div className="text-green-600 text-2xl mb-3">🗺️</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-800">States</h3>
              <p className="text-sm text-gray-600">Compare Medicare spending across all 50 states and territories</p>
            </Link>

            <Link href="/specialties" className="group bg-amber-50 hover:bg-amber-100 rounded-lg p-6 transition-colors">
              <div className="text-amber-600 text-2xl mb-3">🩺</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-amber-800">Specialties</h3>
              <p className="text-sm text-gray-600">105 medical specialties with spending breakdowns</p>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <Link href="/fraud/watchlist" className="group bg-red-50 hover:bg-red-100 rounded-lg p-6 transition-colors">
              <div className="text-red-600 text-2xl mb-3">🚨</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-800">Fraud Watchlist</h3>
              <p className="text-sm text-gray-600">500 providers flagged for billing anomalies</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
            <Link href="/place-of-service" className="group bg-indigo-50 hover:bg-indigo-100 rounded-lg p-6 transition-colors">
              <div className="text-indigo-600 text-2xl mb-3">🏢</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-800">Place of Service</h3>
              <p className="text-sm text-gray-600">Office vs facility billing</p>
            </Link>

            <Link href="/geographic" className="group bg-teal-50 hover:bg-teal-100 rounded-lg p-6 transition-colors">
              <div className="text-teal-600 text-2xl mb-3">📍</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-teal-800">Geographic</h3>
              <p className="text-sm text-gray-600">Spending by city & zip code</p>
            </Link>

            <Link href="/cost-adjustment" className="group bg-rose-50 hover:bg-rose-100 rounded-lg p-6 transition-colors">
              <div className="text-rose-600 text-2xl mb-3">⚖️</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-rose-800">Cost Adjustment</h3>
              <p className="text-sm text-gray-600">Geographic payment gaps</p>
            </Link>

            <Link href="/payment-gap" className="group bg-yellow-50 hover:bg-yellow-100 rounded-lg p-6 transition-colors">
              <div className="text-yellow-600 text-2xl mb-3">💸</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-yellow-800">Payment Gap</h3>
              <p className="text-sm text-gray-600">How much doctors charge vs. what Medicare allows vs. what gets paid — the hidden gap in every bill</p>
            </Link>

            <Link href="/utilization" className="group bg-violet-50 hover:bg-violet-100 rounded-lg p-6 transition-colors">
              <div className="text-violet-600 text-2xl mb-3">🏥</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-violet-800">Utilization</h3>
              <p className="text-sm text-gray-600">Service volume patterns — who bills the most per beneficiary and how organizations compare to solo providers</p>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <Link href="/your-medicare-dollar" className="group bg-emerald-50 hover:bg-emerald-100 rounded-lg p-6 transition-colors">
              <div className="text-emerald-600 text-2xl mb-3">💵</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-800">Your Medicare Dollar</h3>
              <p className="text-sm text-gray-600">See where your tax dollars go in Medicare</p>
            </Link>

            <Link href="/drug-spending" className="group bg-pink-50 hover:bg-pink-100 rounded-lg p-6 transition-colors">
              <div className="text-pink-600 text-2xl mb-3">💊</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-pink-800">Drug Spending</h3>
              <p className="text-sm text-gray-600">Physician-administered drug costs and trends</p>
            </Link>

            <Link href="/compare" className="group bg-cyan-50 hover:bg-cyan-100 rounded-lg p-6 transition-colors">
              <div className="text-cyan-600 text-2xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-cyan-800">Compare</h3>
              <p className="text-sm text-gray-600">Side-by-side provider, state & specialty comparisons</p>
            </Link>

            <Link href="/analysis" className="group bg-slate-50 hover:bg-slate-100 rounded-lg p-6 transition-colors">
              <div className="text-slate-600 text-2xl mb-3">🔬</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-slate-800">All Analysis Tools</h3>
              <p className="text-sm text-gray-600">Central hub for all data exploration tools</p>
            </Link>
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/downloads"
              className="inline-flex items-center text-medicare-primary hover:text-medicare-dark font-medium"
            >
              Download Raw Data →
            </Link>
          </div>
        </div>
      </div>

      {/* ML Fraud Model Findings */}
      <div className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-4">
              🤖 AI-Powered Fraud Detection
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We trained a Random Forest model on 2,198 confirmed Medicare fraudsters — providers excluded by HHS or charged by the DOJ — then scored every active provider in the country.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-indigo-700 mb-1">1.72M</div>
              <div className="text-sm text-gray-600">Providers scored</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-indigo-700 mb-1">2,198</div>
              <div className="text-sm text-gray-600">Confirmed fraudsters used for training</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-red-600 mb-1">500</div>
              <div className="text-sm text-gray-600">Providers flagged (&gt;86% match)</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-indigo-700 mb-1">0.83</div>
              <div className="text-sm text-gray-600">Model AUC (accuracy)</div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/fraud/still-out-there"
              className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              See the 500 AI-Flagged Providers
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Fraud Analysis CTA */}
      <div className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-4">
              🚨 Fraud Analysis
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We flagged 500 providers with statistical billing anomalies. Explore deep-dive profiles,
              COVID test fraud, wound care schemes, upcoding patterns, and impossible billing volumes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/fraud/watchlist" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-red-600 text-2xl mb-3">🔍</div>
              <h3 className="font-semibold text-gray-900 mb-2">500 Flagged Providers</h3>
              <p className="text-sm text-gray-600">Search and filter the full watchlist with risk scores, flags, and payment data</p>
            </Link>
            <Link href="/fraud/deep-dives" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-purple-600 text-2xl mb-3">📋</div>
              <h3 className="font-semibold text-gray-900 mb-2">Deep Dive Profiles</h3>
              <p className="text-sm text-gray-600">Detailed fraud analysis of the 20 highest-risk individual providers</p>
            </Link>
            <Link href="/fraud/impossible-numbers" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-indigo-600 text-2xl mb-3">🧮</div>
              <h3 className="font-semibold text-gray-900 mb-2">Impossible Numbers</h3>
              <p className="text-sm text-gray-600">Providers billing 400+ services per working day — could one person do this?</p>
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/fraud"
              className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Explore Fraud Analysis Hub
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Open Data Network */}
      <div className="py-8 bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            Part of the Open Data Network:{' '}
            <a href="https://www.openmedicaid.org" target="_blank" rel="noopener noreferrer" className="text-medicare-primary hover:underline font-medium">OpenMedicaid</a>
            {' · '}
            <a href="https://www.openfeds.org" target="_blank" rel="noopener noreferrer" className="text-medicare-primary hover:underline font-medium">OpenFeds</a>
            {' · '}
            <a href="https://www.openspending.us" target="_blank" rel="noopener noreferrer" className="text-medicare-primary hover:underline font-medium">OpenSpending</a>
          </p>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterCTA />
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
