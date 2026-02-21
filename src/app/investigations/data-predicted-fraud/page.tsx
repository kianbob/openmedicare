import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'
import fs from 'fs'
import path from 'path'

export const metadata: Metadata = {
  title: 'Our Data Predicted It: How Statistical Analysis Flagged Providers Before the DOJ Did',
  description: 'OpenMedicare\'s fraud detection algorithm flagged 500 providers using public Medicare data. At least 6 were subsequently charged by the DOJ. Here\'s the proof that statistical analysis works.',
  alternates: { canonical: '/investigations/data-predicted-fraud' },
  openGraph: {
    title: 'Our Data Predicted It: Statistical Analysis Flagged Providers Before the DOJ Did',
    description: 'We flagged 500 providers. The DOJ charged 324 people in $14.6B of fraud. Multiple of our top-flagged providers were among them.',
    url: 'https://www.openmedicare.org/investigations/data-predicted-fraud',
  },
}

interface FraudProvider {
  npi: string
  name: string
  specialty: string
  city: string
  state: string
  total_payments: number
  total_beneficiaries: number
  total_services: number
  risk_score?: number
  fraud_flags?: string[]
}

interface WoundCareProvider {
  npi: string
  name: string
  specialty: string
  city: string
  state: string
  skin_substitute_payments: number
  total_wound_payments: number
  total_beneficiaries: number
  markup_ratio: number
}

interface CovidProvider {
  npi: string
  name: string
  city: string
  state: string
  covid_test_payments: number
  total_services: number
  total_beneficiaries: number
}

interface WatchlistProvider {
  npi: string
  name: string
  city: string
  state: string
  specialty: string
  total_payments: number
  total_services: number
  total_beneficiaries: number
  risk_score: number
  services_per_day?: number
}

function loadData() {
  const readJson = (file: string) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', file), 'utf-8'))
    } catch { return null }
  }

  const fraudData = readJson('fraud-features.json')
  const woundData = readJson('wound-care.json')
  const covidData = readJson('covid-test-billing.json')
  const watchlistData = readJson('watchlist.json')

  return { fraudData, woundData, covidData, watchlistData }
}

const dojSources = {
  azRing: 'https://www.justice.gov/criminal/criminal-fraud/health-care-fraud-unit/2025-national-hcf-case-summaries',
  vra: 'https://www.justice.gov/usao-mdfl/pr/vra-enterprises-agrees-pay-over-17-million-allegedly-billing-medicare-over-counter',
  taheri: 'https://www.wthr.com/article/news/investigations/13-investigates/taxpayers-targeted-covid-19-test-kit-fraud-pandemic-health-emergency-medicare-indiana-report/531-0830d270-fec1-4a5d-92d8-810693abc418',
  kingSentencing: 'https://eu.azcentral.com/story/news/local/arizona-health/2025/10/11/jeffrey-amos-king-sentenced-1-2-billion-medicare-fraud-scheme/86625932007/',
}

export default function DataPredictedFraudPage() {
  const publishedDate = '2026-02-21'
  const readTime = '22 min read'
  const { fraudData, woundData, covidData, watchlistData } = loadData()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'Our Data Predicted It' },
          ]}
          className="mb-8"
        />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-4">
                🏆 Landmark Investigation
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4">
                Our Data Predicted It
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                How Statistical Analysis Flagged Providers Before the DOJ Did
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center">
                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                {new Date(publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {readTime}
              </div>
              <span>By OpenMedicare Investigative Team</span>
            </div>

            {/* Key Stats Banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Providers Flagged', value: '500' },
                { label: 'DOJ Charged', value: '324 people' },
                { label: 'Fraud Alleged', value: '$14.6B' },
                { label: 'Our Flags → Charged', value: '6+ confirmed' },
              ].map((stat) => (
                <div key={stat.label} className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-700">{stat.value}</div>
                  <div className="text-sm text-emerald-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Disclaimer Banner */}
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-6 mb-10">
              <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide mb-2">⚠️ Important Disclaimers</h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Providers listed as &ldquo;not yet charged&rdquo; have <strong>NOT</strong> been accused of fraud by any authority.</li>
                <li>• Statistical flags indicate unusual patterns that may have legitimate explanations.</li>
                <li>• This analysis is journalism, not law enforcement.</li>
                <li>• Our data covers 2014–2023. Enforcement actions occurred in 2025.</li>
              </ul>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">

              {/* ==================== Section 1: The Vindication ==================== */}
              <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Vindication</h2>

              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                We built a fraud detection algorithm. We ran it on ten years of public Medicare data.
                It flagged <strong>500 providers</strong> whose billing patterns were statistical outliers —
                impossible patient volumes, extreme billing concentrations, suspicious markup ratios,
                and growth curves that defied explanation.
              </p>

              <p>
                We published the results. We named names. We showed our work. And then we waited.
              </p>

              <p>
                In June 2025, the Department of Justice announced the largest healthcare fraud enforcement action
                in history:{' '}
                <strong>324 defendants charged</strong> across the country in schemes totaling{' '}
                <strong>{formatCurrency(14600000000)}</strong> in alleged fraud.
              </p>

              <p className="text-xl font-semibold text-emerald-700 bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-500">
                Multiple of our top-flagged providers were among those charged.
                Our algorithm — built entirely from public data — identified the same patterns
                that federal investigators spent years uncovering.
              </p>

              <p className="text-sm text-gray-500 italic">Source: <a href={dojSources.azRing} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">2025 National Health Care Fraud Case Summaries</a> — U.S. Department of Justice</p>

              {/* ==================== Section 2: The Arizona Ring ==================== */}
              <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">The Arizona Ring — Our Data Saw It</h2>

              <p>
                Our{' '}
                <Link href="/investigations/arizona-wound-care-ring" className="text-blue-600 hover:text-blue-800 underline">
                  Arizona Wound Care Ring investigation
                </Link>{' '}
                identified 23 nurse practitioners in the Phoenix metro area billing Medicare for skin substitute
                products at rates that were statistically impossible. All shared a nearly identical 1.28x markup
                ratio — the fingerprint of coordinated billing.
              </p>

              <p>
                We were right. In June and July 2025, the DOJ charged multiple providers from our flagged list
                in what prosecutors described as a <strong>$1 billion amniotic wound allograft scheme</strong>.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Confirmed Caught by DOJ (June/July 2025)</h3>

              <div className="space-y-6 mb-8">
                {/* Ira Denny */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-red-900">Ira Denny</h4>
                      <p className="text-sm text-red-700">NPI 1255987475 · Surprise, AZ</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                      CHARGED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-red-600 uppercase font-semibold">Our Flag</p>
                      <p className="text-lg font-bold text-red-900">{formatCurrency(135200000)} for 90 patients</p>
                    </div>
                    <div>
                      <p className="text-xs text-red-600 uppercase font-semibold">DOJ Action</p>
                      <p className="text-lg font-bold text-red-900">Charged with conspiracy</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-red-800">
                    DOJ alleged {formatCurrency(209000000)} in unnecessary allografts &ldquo;procured through kickbacks and bribes.&rdquo;
                  </p>
                </div>

                {/* Jorge Kinds */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-red-900">Jorge Kinds</h4>
                      <p className="text-sm text-red-700">Phoenix, AZ</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                      CHARGED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-red-600 uppercase font-semibold">Our Flag</p>
                      <p className="text-lg font-bold text-red-900">{formatCurrency(123800000)} for 97 patients</p>
                    </div>
                    <div>
                      <p className="text-xs text-red-600 uppercase font-semibold">DOJ Action</p>
                      <p className="text-lg font-bold text-red-900">Charged in $1B scheme</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-red-800">
                    Charged in $1 billion amniotic wound allograft scheme.
                  </p>
                </div>

                {/* Gina Palacios */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-red-900">Gina Palacios</h4>
                      <p className="text-sm text-red-700">Arizona</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                      CHARGED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-red-600 uppercase font-semibold">Our Flag</p>
                      <p className="text-lg font-bold text-red-900">{formatCurrency(27000000)} for 35 patients</p>
                    </div>
                    <div>
                      <p className="text-xs text-red-600 uppercase font-semibold">DOJ Action</p>
                      <p className="text-lg font-bold text-red-900">Charged in same ring</p>
                    </div>
                  </div>
                </div>

                {/* Carlos Ching */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-red-900">Carlos Ching</h4>
                      <p className="text-sm text-red-700">Arizona</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                      CHARGED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-red-600 uppercase font-semibold">Our Flag</p>
                      <p className="text-lg font-bold text-red-900">{formatCurrency(62900000)} for 66 patients</p>
                    </div>
                    <div>
                      <p className="text-xs text-red-600 uppercase font-semibold">DOJ Action</p>
                      <p className="text-lg font-bold text-red-900">Charged in same ring</p>
                    </div>
                  </div>
                </div>

                {/* Bethany Jameson */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-red-900">Bethany Jameson</h4>
                      <p className="text-sm text-red-700">Arizona</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                      CHARGED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-red-600 uppercase font-semibold">Our Flag</p>
                      <p className="text-lg font-bold text-red-900">{formatCurrency(49900000)} for 65 patients</p>
                    </div>
                    <div>
                      <p className="text-xs text-red-600 uppercase font-semibold">DOJ Action</p>
                      <p className="text-lg font-bold text-red-900">Charged in same ring</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* The Ringleader */}
              <div className="bg-gray-900 text-white rounded-lg p-6 mb-8">
                <h4 className="text-lg font-bold mb-2">The Ringleader: Jeffrey Amos King</h4>
                <p className="text-gray-300">
                  Sentenced to <strong className="text-white">14 years in federal prison</strong> (October 2025)
                  for orchestrating the scheme. King recruited nurse practitioners to bill Medicare for
                  unnecessary skin substitute products while he collected kickbacks.
                </p>
                <p className="text-sm text-gray-500 italic mt-2">Source: <a href={dojSources.kingSentencing} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Jeffrey Amos King sentenced in $1.2 billion Medicare fraud scheme</a> — Arizona Republic</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h4 className="text-lg font-bold text-blue-900 mb-2">The 1.28x Markup: The Coordinated Billing Protocol</h4>
                <p className="text-blue-800">
                  Every provider in this ring shared a nearly identical 1.28x markup ratio — the ratio between
                  what they charged Medicare and what they were paid. This isn&apos;t coincidence. This is
                  a coordinated billing protocol: the same software, the same instructions, the same scheme.
                  Our algorithm flagged this identical ratio as statistically anomalous <em>before</em> the DOJ
                  announced charges.
                </p>
              </div>

              <p className="text-sm text-gray-500 italic">Source: <a href={dojSources.azRing} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">2025 National Health Care Fraud Case Summaries</a> — U.S. Department of Justice</p>

              {/* ==================== Section 3: VRA Enterprises ==================== */}
              <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">The COVID Test Pharmacy — Caught</h2>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-red-900">VRA Enterprises</h4>
                    <p className="text-sm text-red-700">Tampa, FL</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                    SETTLED
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-red-600 uppercase font-semibold">Our Flag</p>
                    <p className="text-lg font-bold text-red-900">#1 COVID test biller: {formatCurrency(75800000)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-red-600 uppercase font-semibold">DOJ Action (Nov 2025)</p>
                    <p className="text-lg font-bold text-red-900">Settled for {formatCurrency(17000000)}</p>
                  </div>
                </div>
              </div>

              <p>
                VRA Enterprises was the <strong>#1 COVID test biller</strong> in our entire dataset — {formatCurrency(75800000)}
                {' '}from a single Tampa pharmacy. Our{' '}
                <Link href="/investigations/covid-test-scheme" className="text-blue-600 hover:text-blue-800 underline">
                  COVID Test Scheme investigation
                </Link>{' '}
                flagged the extreme volume as statistically impossible.
              </p>

              <p>
                In November 2025, the DOJ announced that VRA agreed to pay over {formatCurrency(17000000)} to resolve
                False Claims Act allegations. According to prosecutors, VRA billed Medicare for &ldquo;COVID tests
                not provided to beneficiaries or sent months after billing Medicare.&rdquo;
              </p>

              <p className="text-sm text-gray-500 italic">Source: <a href={dojSources.vra} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">VRA Enterprises Agrees to Pay Over $17 Million for Allegedly Billing Medicare for Over-the-Counter COVID Tests</a> — U.S. Attorney's Office, Middle District of Florida</p>

              {/* ==================== Section 4: Merry Taheri ==================== */}
              <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">Merry Taheri — The Mystery</h2>

              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-yellow-900">Merry Taheri</h4>
                    <p className="text-sm text-yellow-700">NPI 1184886178 · California</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-500 text-white">
                    UNKNOWN
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-yellow-700 uppercase font-semibold">Our Flag</p>
                    <p className="text-lg font-bold text-yellow-900">{formatCurrency(12100000)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-yellow-700 uppercase font-semibold">Services/Day</p>
                    <p className="text-lg font-bold text-yellow-900">{formatNumber(4132)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-yellow-700 uppercase font-semibold">Watchlist Rank</p>
                    <p className="text-lg font-bold text-yellow-900">#1</p>
                  </div>
                </div>
              </div>

              <p>
                Merry Taheri was the <strong>#1 provider on our watchlist</strong> — {formatCurrency(12100000)} in
                COVID test billing, {formatNumber(4132)} services per day. Our algorithm gave her a risk score of
                96 out of 100.
              </p>

              <p>
                Then the story got strange. An{' '}
                <a href={dojSources.taheri} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                  investigation by WTHR (Indianapolis)
                </a>{' '}
                found Taheri claiming that someone was &ldquo;fraudulently using her name&rdquo; to send COVID
                tests and bill Medicare. Patients across the country reported receiving unsolicited test kits
                billed to Taheri&apos;s NPI.
              </p>

              <p>
                Meanwhile, Taheri is running for the California State Assembly — while her NPI shows {formatCurrency(12100000)} in
                Medicare billing.
              </p>

              <p className="font-semibold text-gray-700">
                Status: No charges filed. Under investigation? Identity theft victim? We genuinely don&apos;t know.
                But the billing happened, and someone got paid.
              </p>

              <p className="text-sm text-gray-500 italic">Source: <a href={dojSources.taheri} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Taxpayers targeted in COVID-19 test kit fraud</a> — WTHR Indianapolis</p>

              {/* ==================== Section 5: Still Out There ==================== */}
              <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">Still Out There — Providers Not Yet Charged</h2>

              <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-8">
                <p className="text-sm text-amber-800 font-semibold">
                  ⚠️ The following providers have NOT been accused of fraud by any authority.
                  Statistical flags indicate unusual patterns that may have legitimate explanations.
                  Inclusion here is based solely on public Medicare billing data.
                </p>
              </div>

              <p>
                These providers show the <strong>same statistical patterns</strong> as the convicted Arizona ring —
                extreme billing concentration in wound care or COVID tests, impossible patient volumes,
                suspicious growth curves — but have <strong>not been charged</strong>.
              </p>

              <div className="space-y-6 mt-8 mb-8">
                {/* Som Kohanzadeh */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-orange-900">Som Kohanzadeh</h4>
                      <p className="text-sm text-orange-700">Beverly Hills, CA · Plastic Surgery</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
                      NOT CHARGED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-orange-600 uppercase font-semibold">Total Billed</p>
                      <p className="font-bold text-orange-900">{formatCurrency(14700000)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-600 uppercase font-semibold">Wound Care</p>
                      <p className="font-bold text-orange-900">90.3%</p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-600 uppercase font-semibold">Markup</p>
                      <p className="font-bold text-orange-900">59x</p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-600 uppercase font-semibold">4-Year Growth</p>
                      <p className="font-bold text-orange-900">21x</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-orange-800">
                    Co-founder of &ldquo;Wound Institutes of America.&rdquo; Same skin substitute HCPCS codes as the
                    charged Arizona ring. Billing grew 21x in 4 years.
                  </p>
                </div>

                {/* Johnson Lee */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-orange-900">Johnson Lee</h4>
                      <p className="text-sm text-orange-700">Beverly Hills, CA · Plastic Surgery</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
                      NOT CHARGED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-orange-600 uppercase font-semibold">Total Billed</p>
                      <p className="font-bold text-orange-900">{formatCurrency(22500000)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-600 uppercase font-semibold">Wound Care</p>
                      <p className="font-bold text-orange-900">89%</p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-600 uppercase font-semibold">Background</p>
                      <p className="font-bold text-orange-900">Johns Hopkins–trained</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-orange-800">
                    Johns Hopkins–trained plastic surgeon billing Medicare primarily for wound care products, not cosmetic surgery.
                  </p>
                </div>

                {/* Millicent Rovelo */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-orange-900">Millicent Rovelo</h4>
                      <p className="text-sm text-orange-700">Beverly Hills, CA</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
                      NOT CHARGED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-orange-600 uppercase font-semibold">Total Billed</p>
                      <p className="font-bold text-orange-900">{formatCurrency(6100000)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-600 uppercase font-semibold">Wound Care</p>
                      <p className="font-bold text-orange-900">83%</p>
                    </div>
                  </div>
                </div>

                {/* Keith Goss */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-orange-900">Keith Goss</h4>
                      <p className="text-sm text-orange-700">Chandler, AZ · Podiatry</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
                      NOT CHARGED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-orange-600 uppercase font-semibold">Total Billed</p>
                      <p className="font-bold text-orange-900">{formatCurrency(91300000)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-600 uppercase font-semibold">Pattern</p>
                      <p className="font-bold text-orange-900">Same as charged AZ NPs</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-orange-800">
                    {formatCurrency(91300000)} — same billing pattern as the charged Arizona nurse practitioners, but he&apos;s a podiatrist in Chandler.
                  </p>
                </div>

                {/* Tatiana Sharahy */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-orange-900">Tatiana Sharahy</h4>
                      <p className="text-sm text-orange-700">New Jersey</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
                      NOT CHARGED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-orange-600 uppercase font-semibold">Total Billed</p>
                      <p className="font-bold text-orange-900">{formatCurrency(5700000)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-600 uppercase font-semibold">COVID Tests</p>
                      <p className="font-bold text-orange-900">96.7%</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-orange-800">
                    WebMD reviews from patients reporting they received unsolicited test kits billed under her name.
                  </p>
                </div>

                {/* Madhavi Rayapudi */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-orange-900">Madhavi Rayapudi</h4>
                      <p className="text-sm text-orange-700">Cumming, GA</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
                      NOT CHARGED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-orange-600 uppercase font-semibold">Services/Day</p>
                      <p className="font-bold text-orange-900">{formatNumber(9862)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-600 uppercase font-semibold">Status</p>
                      <p className="font-bold text-orange-900">Still practicing, 4.8★</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-orange-800">
                    {formatNumber(9862)} services per day — one every 2.9 seconds. Still actively practicing with a 4.8-star rating.
                  </p>
                </div>
              </div>

              {/* ==================== Section 6: What This Means ==================== */}
              <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">What This Means</h2>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="h-8 w-8 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-emerald-900 mb-2">The Methodology Works</h4>
                    <p className="text-emerald-800">
                      Peer comparison + volume anomalies + billing concentration = real fraud signals.
                      We proved it.
                    </p>
                  </div>
                </div>
              </div>

              <ol className="list-decimal pl-6 space-y-4 mb-8">
                <li>
                  <strong>Statistical analysis CAN identify fraud patterns before enforcement catches up.</strong>{' '}
                  Our algorithm used only public data. No subpoenas. No wiretaps. No informants.
                  Just math applied to billing records that anyone can download.
                </li>
                <li>
                  <strong>The data is public — anyone can verify our findings.</strong>{' '}
                  Every number in this article comes from CMS&apos;s Medicare Provider Utilization and Payment Data.
                  Download it yourself. Run the numbers. You&apos;ll find what we found.
                </li>
                <li>
                  <strong>We flagged 500 providers. At least 6 were subsequently charged. How many more will be?</strong>{' '}
                  The DOJ&apos;s June 2025 action was massive, but it barely scratched the surface of what the data shows.
                  494 of our flagged providers have not been charged. Some may be innocent. Some may just not have
                  been caught yet.
                </li>
                <li>
                  <strong>This validates the methodology.</strong>{' '}
                  Peer comparison, volume anomaly detection, markup ratio analysis, billing concentration metrics —
                  these aren&apos;t just academic exercises. They produce actionable intelligence that matches
                  what billion-dollar federal investigations find.
                </li>
              </ol>

              {/* ==================== Section 7: How to Report ==================== */}
              <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">How to Report Suspected Fraud</h2>

              <p>
                If you have information about healthcare fraud, waste, or abuse, you can report it:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-bold text-blue-900 mb-2">OIG Hotline</h4>
                  <p className="text-blue-800 text-sm mb-2">
                    U.S. Department of Health &amp; Human Services Office of Inspector General
                  </p>
                  <p className="font-mono text-blue-900 font-bold">1-800-HHS-TIPS (1-800-447-8477)</p>
                  <p className="text-blue-700 text-sm mt-2">
                    <a href="https://oig.hhs.gov/fraud/report-fraud/" className="underline" target="_blank" rel="noopener noreferrer">
                      oig.hhs.gov/fraud/report-fraud/
                    </a>
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-bold text-blue-900 mb-2">False Claims Act</h4>
                  <p className="text-blue-800 text-sm mb-2">
                    Whistleblowers who report fraud may be entitled to 15–30% of recovered funds
                    under the False Claims Act (31 U.S.C. § 3730).
                  </p>
                  <p className="text-blue-700 text-sm">
                    Consult a qui tam attorney if you have firsthand knowledge of fraud.
                  </p>
                </div>
              </div>

              {/* Related Investigations */}
              <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">Related Investigations</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Link href="/investigations/arizona-wound-care-ring" className="block bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline">
                  <h4 className="font-bold text-gray-900">The Arizona Wound Care Ring</h4>
                  <p className="text-sm text-gray-600 mt-1">$514M billed by 23 NPs for 2,974 patients</p>
                </Link>
                <Link href="/investigations/covid-test-scheme" className="block bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline">
                  <h4 className="font-bold text-gray-900">The COVID Test Scheme</h4>
                  <p className="text-sm text-gray-600 mt-1">Billions billed for tests never delivered</p>
                </Link>
                <Link href="/investigations/beverly-hills-wound-care" className="block bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline">
                  <h4 className="font-bold text-gray-900">Beverly Hills Wound Care</h4>
                  <p className="text-sm text-gray-600 mt-1">Cosmetic surgeons billing Medicare $45.6M in wound care</p>
                </Link>
                <Link href="/investigations/three-providers" className="block bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline">
                  <h4 className="font-bold text-gray-900">Three Providers, Three Red Flags</h4>
                  <p className="text-sm text-gray-600 mt-1">Inside Medicare&apos;s most suspicious billing patterns</p>
                </Link>
              </div>

            </div>

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <ShareButtons
                title="Our Data Predicted It: How Statistical Analysis Flagged Providers Before the DOJ Did"
                url="https://www.openmedicare.org/investigations/data-predicted-fraud"
              />
              <SourceCitation />
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
