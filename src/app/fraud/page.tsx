import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'

export const metadata: Metadata = {
  title: 'Medicare Fraud Analysis Hub — OpenMedicare',
  description: 'Data-driven fraud detection across $854.8B in Medicare spending. 500 flagged providers, deep-dive profiles, COVID test billing analysis, wound care fraud tracking, and more.',
  openGraph: {
    title: 'Medicare Fraud Analysis Hub — OpenMedicare',
    description: 'Data-driven fraud detection across $854.8B in Medicare spending.',
    url: 'https://www.openmedicare.org/fraud',
  },
}

const fraudPages = [
  {
    title: 'Enhanced Watchlist',
    description: '500 providers flagged for billing anomalies — separated by individuals vs organizations, with inline flag details and color-coded risk scores.',
    href: '/fraud/watchlist',
    icon: '🚨',
    color: 'red',
  },
  {
    title: 'Deep Dive Profiles',
    description: 'Detailed fraud profiles for the top 20 highest-risk individual providers. Payment breakdowns, flag explanations, and peer comparisons.',
    href: '/fraud/deep-dives',
    icon: '🔍',
    color: 'purple',
  },
  {
    title: 'COVID Test Billing',
    description: 'How HCPCS code K1034 became a massive fraud vector during the pandemic — and who billed millions for questionable COVID tests.',
    href: '/fraud/covid-tests',
    icon: '🦠',
    color: 'green',
  },
  {
    title: 'Wound Care Watchlist',
    description: 'The DOJ\'s largest-ever healthcare fraud takedown ($14.6B) targeted wound care. We track the skin substitute billing pipeline.',
    href: '/fraud/wound-care',
    icon: '🩹',
    color: 'orange',
  },
  {
    title: 'Upcoding Detector',
    description: 'Office visit codes 99213 vs 99214 account for $117.7B in Medicare spending. Who\'s billing the higher code more than their peers?',
    href: '/fraud/upcoding',
    icon: '📊',
    color: 'blue',
  },
  {
    title: 'Impossible Numbers',
    description: 'Some providers bill for 400+ services per working day. Could one person really do that? We show the math.',
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
            <strong> 500 providers</strong> with statistical anomalies that warrant closer scrutiny.
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mb-8">
            This isn&apos;t about accusations — it&apos;s about transparency. Every dollar lost to fraud is a dollar
            that could fund care for seniors. Our analysis uses publicly available CMS data to surface patterns
            that human reviewers and investigators can evaluate.
          </p>

          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            <div className="bg-red-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-red-700 mb-2">$100B+</div>
              <div className="text-sm text-red-600 font-medium">Lost to Medicare Fraud Annually</div>
              <div className="text-xs text-gray-500 mt-1">National Health Care Anti-Fraud Association estimate</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-blue-700 mb-2">500</div>
              <div className="text-sm text-blue-600 font-medium">Providers Flagged by Our Analysis</div>
              <div className="text-xs text-gray-500 mt-1">Statistical outliers across multiple dimensions</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-green-700 mb-2">$854.8B</div>
              <div className="text-sm text-green-600 font-medium">Total Medicare Spending Analyzed</div>
              <div className="text-xs text-gray-500 mt-1">2014–2023 CMS physician payment data</div>
            </div>
          </div>
        </div>

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
