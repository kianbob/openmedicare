import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import NewsletterCTA from '@/components/NewsletterCTA'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Medicare Fraud Analysis Hub — OpenMedicare',
  description: 'Explore Medicare fraud patterns detected in $854.8B of physician payment data. Analysis of upcoding, COVID test billing, wound care schemes, and more.',
  alternates: { canonical: '/fraud' },
  openGraph: {
    title: 'Medicare Fraud Analysis Hub — OpenMedicare',
    description: 'Explore Medicare fraud patterns detected in $854.8B of physician payment data. Analysis of upcoding, COVID test billing, wound care schemes, and more.',
    url: 'https://www.openmedicare.org/fraud',
  },
}

function loadJson(filename: string) {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', filename), 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const covidData = loadJson('covid-test-billing.json')
const woundData = loadJson('wound-care.json')
const fraudData = loadJson('fraud-features.json')
const upcodeData = loadJson('upcoding.json')

const totalCovidPayments = covidData?.total_covid_payments ?? 0
const totalWoundPayments = woundData?.total_wound_payments ?? 0
const totalImpossible = fraudData?.total_impossible ?? 0
const nationalPct99214 = upcodeData?.national_pct_99214 ?? 0

function loadWatchlistStats() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'watchlist.json'), 'utf-8')
    const providers = JSON.parse(raw) as { specialty: string; state: string; risk_score: number }[]

    const specCount: Record<string, number> = {}
    const stateCount: Record<string, number> = {}
    for (const p of providers) {
      specCount[p.specialty] = (specCount[p.specialty] || 0) + 1
      stateCount[p.state] = (stateCount[p.state] || 0) + 1
    }

    const topSpecialties = Object.entries(specCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    const topStates = Object.entries(stateCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return { topSpecialties, topStates, total: providers.length }
  } catch {
    return { topSpecialties: [], topStates: [], total: 500 }
  }
}

const watchlistStats = loadWatchlistStats()

const fraudPages = [
  {
    title: 'Enhanced Watchlist',
    description: `${formatNumber(watchlistStats.total)} providers flagged for billing anomalies — separated by individuals vs organizations, with inline flag details and color-coded risk scores.`,
    href: '/fraud/watchlist',
    icon: '🚨',
    color: 'red',
  },
  {
    title: 'Deep Dive Profiles',
    description: 'Detailed fraud profiles for the top 20 highest-risk individual providers. Payment breakdowns, flag explanations, and fraud feature analysis.',
    href: '/fraud/deep-dives',
    icon: '🔍',
    color: 'purple',
  },
  {
    title: 'Still Out There',
    description: 'Our ML model trained on 8,300+ confirmed fraudsters identifies providers who bill like criminals but haven\'t been caught yet.',
    href: '/fraud/still-out-there',
    icon: '🤖',
    color: 'indigo',
  },
  {
    title: 'COVID Test Billing',
    description: `${formatCurrency(totalCovidPayments)} billed for COVID tests via HCPCS K1034. Who billed millions for questionable COVID tests during the pandemic?`,
    href: '/fraud/covid-tests',
    icon: '🦠',
    color: 'green',
  },
  {
    title: 'Wound Care Watchlist',
    description: `${formatCurrency(totalWoundPayments)} in wound care billing. The DOJ's largest-ever healthcare fraud takedown targeted skin substitute schemes.`,
    href: '/fraud/wound-care',
    icon: '🩹',
    color: 'orange',
  },
  {
    title: 'Upcoding Detector',
    description: `${nationalPct99214}% of E&M visits billed as 99214 nationally. Office visit codes 99213 vs 99214 account for $117.7B in Medicare spending.`,
    href: '/fraud/upcoding',
    icon: '📊',
    color: 'blue',
  },
  {
    title: 'Impossible Numbers',
    description: `${formatNumber(totalImpossible)} providers flagged with physically impossible billing volumes. The worst: 9,862 services per working day.`,
    href: '/fraud/impossible-numbers',
    icon: '🧮',
    color: 'indigo',
  },
  {
    title: 'Report Fraud',
    description: 'How to report Medicare fraud to the OIG, including the False Claims Act whistleblower program (15-30% of recovered funds).',
    href: '/fraud/report',
    icon: '📞',
    color: 'amber',
  },
]

const colorMap: Record<string, string> = {
  red: 'bg-red-50 hover:bg-red-100 text-red-800',
  purple: 'bg-purple-50 hover:bg-purple-100 text-purple-800',
  green: 'bg-green-50 hover:bg-green-100 text-green-800',
  orange: 'bg-orange-50 hover:bg-orange-100 text-orange-800',
  blue: 'bg-blue-50 hover:bg-blue-100 text-blue-800',
  indigo: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800',
  amber: 'bg-amber-50 hover:bg-amber-100 text-amber-800',
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OpenMedicare',
    url: 'https://www.openmedicare.org',
    description: 'Open-source Medicare spending transparency and fraud analysis platform',
    sameAs: ['https://github.com/kianbob/openmedicare'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Medicare Provider Utilization and Payment Data',
    description: 'CMS Medicare physician payment data from 2014-2023, covering $854.8 billion in spending across 1.2 million providers',
    url: 'https://www.openmedicare.org/fraud',
    license: 'https://www.usa.gov/government-works',
    creator: { '@type': 'Organization', name: 'Centers for Medicare & Medicaid Services (CMS)' },
    temporalCoverage: '2014/2023',
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: 'https://www.openmedicare.org/downloads',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Medicare Fraud Analysis Hub',
    url: 'https://www.openmedicare.org/fraud',
    description: 'Data-driven fraud detection across $854.8B in Medicare spending. 500 flagged providers, deep-dive profiles, COVID test billing analysis, wound care fraud tracking, and more.',
    isPartOf: { '@type': 'WebSite', name: 'OpenMedicare', url: 'https://www.openmedicare.org' },
  },
]

function BarChart({ data, title, color }: { data: [string, number][]; title: string; color: string }) {
  const max = Math.max(...data.map(d => d[1]), 1)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h4 className="text-lg font-serif font-bold text-gray-900 mb-4">{title}</h4>
      <div className="space-y-3">
        {data.map(([label, value]) => (
          <div key={label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 truncate mr-2">{label}</span>
              <span className="font-semibold text-gray-900 shrink-0">{value}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all"
                style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FraudHub() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: 'Fraud Analysis' }]} />

        {/* Hero */}
        <div className="mt-8 mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-gray-900 mb-6">
            Medicare Fraud Analysis Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mb-8">
            The U.S. loses an estimated <strong>$100 billion or more</strong> to Medicare fraud every year.
            We analyzed <strong>$854.8 billion</strong> in Medicare physician payments across 10 years and flagged
            <strong> {formatNumber(watchlistStats.total)} providers</strong> with statistical anomalies that warrant closer scrutiny.
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mb-8">
            This isn&apos;t about accusations — it&apos;s about transparency. Every dollar lost to fraud is a dollar
            that could fund care for seniors. Our analysis uses publicly available CMS data to surface patterns
            that human reviewers and investigators can evaluate.
          </p>

          {/* Key Stats — real data */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            <div className="bg-red-50 rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-red-700 mb-1">{formatCurrency(totalCovidPayments)}</div>
              <div className="text-sm text-red-600 font-medium">COVID Test Billing</div>
              <div className="text-xs text-gray-500 mt-1">K1034 claims (2020-2023)</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-orange-700 mb-1">{formatCurrency(totalWoundPayments)}</div>
              <div className="text-sm text-orange-600 font-medium">Wound Care Billing</div>
              <div className="text-xs text-gray-500 mt-1">Skin substitutes + debridement</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-indigo-700 mb-1">{formatNumber(totalImpossible)}</div>
              <div className="text-sm text-indigo-600 font-medium">Impossible Providers</div>
              <div className="text-xs text-gray-500 mt-1">Physically questionable volumes</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-blue-700 mb-1">{nationalPct99214}%</div>
              <div className="text-sm text-blue-600 font-medium">Upcoding Rate</div>
              <div className="text-xs text-gray-500 mt-1">National 99214 share of E&M visits</div>
            </div>
          </div>
        </div>

        {/* Bar Charts */}
        {(watchlistStats.topSpecialties.length > 0 || watchlistStats.topStates.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {watchlistStats.topSpecialties.length > 0 && (
              <BarChart data={watchlistStats.topSpecialties} title="Top 5 Riskiest Specialties" color="#dc2626" />
            )}
            {watchlistStats.topStates.length > 0 && (
              <BarChart data={watchlistStats.topStates} title="Top 5 States by Flagged Providers" color="#1a73e8" />
            )}
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {fraudPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className={`rounded-lg p-6 transition-colors ${colorMap[page.color]}`}
            >
              <div className="text-3xl mb-3">{page.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{page.title}</h3>
              <p className="text-sm opacity-80 mb-4">{page.description}</p>
              <span className="inline-flex items-center text-sm font-medium">
                Explore <ArrowRightIcon className="ml-1 h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>

        {/* Related Investigations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-4">Related Investigations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link href="/investigations/data-predicted-fraud" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🏆 Our Data Predicted Fraud</div>
              <div className="text-sm text-gray-500">We flagged providers before the DOJ did</div>
            </Link>
            <Link href="/investigations/arizona-wound-care-ring" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🩹 Arizona Wound Care Ring</div>
              <div className="text-sm text-gray-500">$514M billed by 23 nurse practitioners</div>
            </Link>
            <Link href="/investigations/impossible-doctors" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🧮 The Impossible Doctors</div>
              <div className="text-sm text-gray-500">400+ services per day</div>
            </Link>
            <Link href="/investigations/medicare-fraud-2025" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">⚖️ Medicare Fraud in 2025</div>
              <div className="text-sm text-gray-500">DOJ&apos;s $14.6B takedown</div>
            </Link>
            <Link href="/investigations/florida-infectious-disease" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🌴 Florida&apos;s Fraud Factory</div>
              <div className="text-sm text-gray-500">185 impossible providers</div>
            </Link>
            <Link href="/investigations/beverly-hills-wound-care" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">💎 Beverly Hills Wound Care</div>
              <div className="text-sm text-gray-500">Plastic surgeons billing Medicare $45.6M</div>
            </Link>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link href="/investigations" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View all investigations →
            </Link>
          </div>
        </div>

        {/* Related Data */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Related Data</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/providers" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">Provider Directory</div>
            </Link>
            <Link href="/states" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">Browse by State</div>
            </Link>
            <Link href="/specialties" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">Browse by Specialty</div>
            </Link>
            <Link href="/analysis" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">Deep Analysis</div>
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> These are statistical flags based on publicly available CMS data, not accusations of fraud.
            Billing anomalies can have legitimate explanations. If you suspect fraud, report it to the
            OIG Fraud Hotline: <a href="tel:1-800-447-8477" className="underline font-medium">1-800-HHS-TIPS (1-800-447-8477)</a>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <ShareButtons url="https://www.openmedicare.org/fraud" title="Medicare Fraud Analysis Hub — OpenMedicare" />
        </div>

        <div className="mb-8">
          <NewsletterCTA />
        </div>

        <SourceCitation
          sources={[
            'Centers for Medicare & Medicaid Services (CMS)',
            'Medicare Provider Utilization and Payment Data (2014-2023)',
            'National Health Care Anti-Fraud Association (NHCAA)',
            'HHS Office of Inspector General (OIG)',
          ]}
          lastUpdated="February 2026"
        />
      </div>
    </div>
  )
}
