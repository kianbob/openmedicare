import fs from 'fs'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
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
  title: 'Medicare Fraud Analysis Hub',
  description: 'Explore Medicare fraud patterns detected in $854.8B of physician payment data. Analysis of upcoding, COVID test billing, wound care schemes, and more.',
  alternates: { canonical: '/fraud' },
  openGraph: {
    title: 'Medicare Fraud Analysis Hub',
    description: 'Explore Medicare fraud patterns detected in $854.8B of physician payment data. Analysis of upcoding, COVID test billing, wound care schemes, and more.',
    url: 'https://openmedicare.vercel.app/fraud',
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
    title: 'Top 100 Flagged Providers',
    description: 'The 100 Medicare providers with the highest AI-predicted fraud probability, ranked by our ML model trained on 2,198 confirmed fraudsters.',
    href: '/fraud/top-100',
    icon: '🏆',
    color: 'red',
  },
  {
    title: 'Still Out There',
    description: 'Our ML model scored 1.7M providers against 2,198 confirmed fraudsters. 500 scored above 86% match. AUC: 0.83.',
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
  red: 'bg-red-50 hover:bg-red-100 text-red-800 border border-red-200',
  purple: 'bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200',
  green: 'bg-green-50 hover:bg-green-100 text-green-800 border border-green-200',
  orange: 'bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200',
  blue: 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200',
  indigo: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200',
  amber: 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200',
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OpenMedicare',
    url: 'https://openmedicare.vercel.app',
    description: 'Open-source Medicare spending transparency and fraud analysis platform',
    sameAs: ['https://github.com/kianbob/openmedicare'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Medicare Provider Utilization and Payment Data',
    description: 'CMS Medicare physician payment data from 2014-2023, covering $854.8 billion in spending across 1.2 million providers',
    url: 'https://openmedicare.vercel.app/fraud',
    license: 'https://www.usa.gov/government-works',
    creator: { '@type': 'Organization', name: 'Centers for Medicare & Medicaid Services (CMS)' },
    temporalCoverage: '2014/2023',
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: 'https://openmedicare.vercel.app/downloads',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Medicare Fraud Analysis Hub',
    url: 'https://openmedicare.vercel.app/fraud',
    description: 'Data-driven fraud detection across $854.8B in Medicare spending. 500 flagged providers, deep-dive profiles, COVID test billing analysis, wound care fraud tracking, and more.',
    isPartOf: { '@type': 'WebSite', name: 'OpenMedicare', url: 'https://openmedicare.vercel.app' },
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
            <InvestigationDisclaimer />            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PipelineStep({ number, label, sublabel, isLast }: { number: string; label: string; sublabel: string; isLast?: boolean }) {
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center text-center min-w-[120px] sm:min-w-[140px]">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <span className="text-lg sm:text-xl font-bold text-white leading-tight">{number}</span>
        </div>
        <div className="mt-3 text-sm sm:text-base font-semibold text-gray-900">{label}</div>
        <div className="text-xs text-gray-500">{sublabel}</div>
      </div>
      {!isLast && (
        <div className="flex-1 flex items-center justify-center mx-1 sm:mx-2 -mt-8">
          <div className="w-full h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-purple-400" />
          </div>
        </div>
      )}
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

        {/* Hero — dramatic */}
        <div className="relative mt-8 mb-6 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white p-8 sm:p-12 lg:p-16 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          </div>
          <div className="relative z-10">
            <div className="text-sm font-medium tracking-widest uppercase text-indigo-300 mb-4">OpenMedicare Fraud Analysis</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif mb-6 leading-tight">
              $854.8 Billion in Medicare Payments.<br />
              <span className="text-red-400">Our AI Flagged $400M of It.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mb-8">
              We analyzed a decade of CMS physician payment data — every line item, every provider, every dollar.
              The result: {formatNumber(watchlistStats.total)} providers with billing patterns that don&apos;t add up.
              This isn&apos;t about accusations. It&apos;s about transparency.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/fraud/watchlist" className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg">
                View the Watchlist <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/fraud/still-out-there" className="inline-flex items-center px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20">
                See ML Results <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Fraud Pipeline Diagram */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-2 text-center">The Fraud Detection Pipeline</h2>
          <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">How we go from raw CMS data to actionable fraud flags</p>
          <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl p-6 sm:p-10 border border-gray-200">
            <div className="flex items-center justify-between overflow-x-auto pb-4">
              <PipelineStep number="96M" label="Payment Rows" sublabel="10 years of CMS data" />
              <PipelineStep number="1.72M" label="Providers Scored" sublabel="ML model v2" />
              <PipelineStep number="2,198" label="Training Labels" sublabel="Confirmed fraudsters" />
              <PipelineStep number="500" label="Flagged" sublabel="86%+ fraud match" isLast />
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> AUC: 0.83</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Precision: 78%</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Open Source</span>
            </div>
          </div>
        </div>

        {/* By the Numbers */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-8 text-center">By the Numbers</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="relative bg-white rounded-xl border border-gray-200 p-6 text-center group hover:shadow-lg hover:border-red-200 transition-all">
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-1">$854.8B</div>
              <div className="text-sm font-medium text-gray-700">Total Medicare Payments</div>
              <div className="text-xs text-gray-400 mt-1">2014–2023</div>
            </div>
            <div className="relative bg-white rounded-xl border border-gray-200 p-6 text-center group hover:shadow-lg hover:border-orange-200 transition-all">
              <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-1">{formatCurrency(totalCovidPayments)}</div>
              <div className="text-sm font-medium text-gray-700">COVID Test Billing</div>
              <div className="text-xs text-gray-400 mt-1">K1034 claims</div>
            </div>
            <div className="relative bg-white rounded-xl border border-gray-200 p-6 text-center group hover:shadow-lg hover:border-indigo-200 transition-all">
              <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-1">{formatNumber(totalImpossible)}</div>
              <div className="text-sm font-medium text-gray-700">Impossible Providers</div>
              <div className="text-xs text-gray-400 mt-1">Physically questionable volumes</div>
            </div>
            <div className="relative bg-white rounded-xl border border-gray-200 p-6 text-center group hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">{nationalPct99214}%</div>
              <div className="text-sm font-medium text-gray-700">Upcoding Rate</div>
              <div className="text-xs text-gray-400 mt-1">National 99214 share</div>
            </div>
            <div className="relative bg-white rounded-xl border border-gray-200 p-6 text-center group hover:shadow-lg hover:border-purple-200 transition-all">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-1">{formatCurrency(totalWoundPayments)}</div>
              <div className="text-sm font-medium text-gray-700">Wound Care Billing</div>
              <div className="text-xs text-gray-400 mt-1">Skin substitutes + debridement</div>
            </div>
            <div className="relative bg-white rounded-xl border border-gray-200 p-6 text-center group hover:shadow-lg hover:border-red-200 transition-all">
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-1">500</div>
              <div className="text-sm font-medium text-gray-700">Flagged Providers</div>
              <div className="text-xs text-gray-400 mt-1">Statistical anomalies</div>
            </div>
            <div className="relative bg-white rounded-xl border border-gray-200 p-6 text-center group hover:shadow-lg hover:border-green-200 transition-all">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">2,198</div>
              <div className="text-sm font-medium text-gray-700">Confirmed Fraudsters</div>
              <div className="text-xs text-gray-400 mt-1">LEIE + OIG exclusions</div>
            </div>
            <div className="relative bg-white rounded-xl border border-gray-200 p-6 text-center group hover:shadow-lg hover:border-amber-200 transition-all">
              <div className="text-3xl sm:text-4xl font-bold text-amber-600 mb-1">$100B+</div>
              <div className="text-sm font-medium text-gray-700">Annual Fraud Estimate</div>
              <div className="text-xs text-gray-400 mt-1">NHCAA estimate</div>
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

        {/* Explore the Analysis — Cards */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-2 text-center">Explore the Analysis</h2>
          <p className="text-gray-500 text-center mb-8">Eight angles on Medicare fraud — from AI detection to wound care schemes</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fraudPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className={`rounded-xl p-6 transition-all hover:shadow-md hover:-translate-y-0.5 ${colorMap[page.color]}`}
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
            <Link href="/investigations/internal-medicine-crisis" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🏥 Internal Medicine Crisis</div>
              <div className="text-sm text-gray-500">Why 53% of flagged providers are internists</div>
            </Link>
            <Link href="/investigations/telehealth-explosion" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">📱 The Telehealth Explosion</div>
              <div className="text-sm text-gray-500">How COVID changed Medicare billing forever</div>
            </Link>
            <Link href="/investigations/genetic-testing-fraud" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🧬 Genetic Testing Fraud</div>
              <div className="text-sm text-gray-500">Telehealth-driven testing schemes</div>
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
            <Link href="/markup" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">Markup Analysis</div>
            </Link>
            <Link href="/geographic" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">Geographic Data</div>
            </Link>
            <Link href="/drug-spending" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">Drug Spending</div>
            </Link>
            <Link href="/investigations" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">All Investigations</div>
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
          <ShareButtons url="https://openmedicare.vercel.app/fraud" title="Medicare Fraud Analysis Hub" description="AI flagged 500 Medicare providers for potential fraud out of 1.72M analyzed. See the data behind the investigation." />
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
