import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'OpenMedicare Updates & New Features',
  description: 'See every new feature, data release, and investigation as it ships. AI fraud detection, 59+ articles, and 30,000+ provider profiles — all tracked here.',
  alternates: {
    canonical: '/updates',
  },
}

const updates = [
  {
    date: 'July 2026',
    highlight: true,
    items: [
      {
        title: 'Data Updated: 2024 CMS Data Now Live',
        description: 'Incorporated the 2024 Medicare Provider Utilization and Payment Data release. Total coverage now spans 11 years (2014-2024), with cumulative payments exceeding $940 billion across 1.82 million providers. All analysis pages, state breakdowns, and provider profiles updated.',
        tags: ['Data', 'Major'],
      },
      {
        title: 'Drug Price Negotiation Investigation Published',
        description: 'New investigation covering the Inflation Reduction Act\'s Medicare drug price negotiation program. Covers the first 10 negotiated drugs, $6B in estimated first-year savings, and the 2027 expansion to 15 more drugs.',
        tags: ['Investigations'],
        link: '/investigations/drug-price-negotiation-2026',
      },
      {
        title: 'Updated Spending Figures Across All Pages',
        description: 'All references updated to reflect 2024 data: $940B+ total payments, 1.82M providers, 68.5M beneficiaries, and $890B+ annual Medicare spending.',
        tags: ['Enhancement'],
      },
      {
        title: 'Medicare Cost Calculator Expanded',
        description: 'Calculator now includes common procedure cost reference table, explanations of Medicare pricing methodology, Part B premium/deductible info for 2026, and tips for managing Medicare costs.',
        tags: ['Enhancement'],
        link: '/calculator',
      },
      {
        title: '6 New Analysis Sections Added',
        description: 'Expanded Drug Spending, Rural vs Urban, Markup Analysis, and Deep Analysis pages with additional context, methodology explanations, and key findings. All pages now exceed 300 lines of substantive content.',
        tags: ['Analysis', 'Enhancement'],
        link: '/analysis',
      },
    ],
  },
  {
    date: 'February 21, 2026 — Evening',
    highlight: true,
    items: [
      {
        title: 'Major Platform Update',
        description: 'Added investigation disclaimers, unified provider database (30,000+ providers), ML fraud model integration (500 AI-flagged providers), dynamic OG images, 59 investigation articles.',
        tags: ['Major', 'Enhancement'],
        link: '/investigations',
      },
    ],
  },
  {
    date: 'February 21, 2026',
    highlight: true,
    items: [
      {
        title: 'AI Fraud Detection Model v2',
        description: 'Trained on 2,198 confirmed fraudsters, analyzed 1.82M providers, flagged 500 high-risk. Our ML model now combines anomaly detection, peer comparison, and known-fraud pattern matching for the most comprehensive risk scoring in Medicare transparency.',
        tags: ['AI/ML', 'Major'],
        link: '/fraud',
      },
      {
        title: '4 New Investigation Articles Published',
        description: 'New deep dives into Medicare billing anomalies, including AI-flagged provider clusters and emerging fraud patterns identified by our v2 model.',
        tags: ['Investigations'],
        link: '/investigations',
      },
      {
        title: 'Provider Pages Upgraded with AI Risk Assessment',
        description: 'Every provider page now features ML-powered risk scores, anomaly breakdowns, and peer comparison charts. See exactly why a provider was flagged.',
        tags: ['AI/ML', 'Enhancement'],
      },
      {
        title: 'Fraud Analysis Section Launched',
        description: '8 fraud pages including upcoding detection, COVID test tracker, wound care watchlist, impossible numbers analysis, deep-dive profiles, and the fraud reporting hub.',
        tags: ['Fraud', 'New Section'],
        link: '/fraud',
      },
      {
        title: '3 Investigation Articles',
        description: 'Published "The COVID Test Gold Rush," "The Wound Care Industrial Complex," and "The Impossible Doctors" — deep dives into the most egregious billing patterns in Medicare.',
        tags: ['Investigations'],
        link: '/investigations',
      },
      {
        title: 'Provider Pages Enhanced',
        description: 'Provider profiles now include fraud risk badges, services-per-day warnings, and a similar providers comparison section.',
        tags: ['Enhancement'],
      },
    ],
  },
  {
    date: 'February 20, 2026',
    items: [
      {
        title: '5 New Analysis Pages',
        description: 'Place of Service, Geographic Spending, Cost Adjustment, Payment Gap, and Utilization analysis pages — new ways to explore Medicare data.',
        tags: ['Analysis'],
      },
      {
        title: 'Wave 1 Articles — 8 Investigations Published',
        description: 'Our first wave of data-driven investigations covering markup patterns, specialty spending, geographic variation, and more.',
        tags: ['Investigations'],
        link: '/investigations',
      },
    ],
  },
  {
    date: 'February 19, 2026',
    items: [
      {
        title: 'Site Launched',
        description: 'OpenMedicare goes live with 2,003 provider profiles, 500 procedure pages, 61 state pages, 105 specialty breakdowns, and full search.',
        tags: ['Launch'],
      },
      {
        title: 'Initial Data Processing Complete',
        description: '96 million rows of CMS Medicare Provider Utilization and Payment data (2014-2024) processed, analyzed, and loaded.',
        tags: ['Data'],
      },
    ],
  },
]

const tagColors: Record<string, string> = {
  'Fraud': 'bg-red-100 text-red-700',
  'New Section': 'bg-purple-100 text-purple-700',
  'Investigations': 'bg-blue-100 text-blue-700',
  'Enhancement': 'bg-green-100 text-green-700',
  'Analysis': 'bg-indigo-100 text-indigo-700',
  'Launch': 'bg-amber-100 text-amber-700',
  'Data': 'bg-gray-100 text-gray-700',
  'AI/ML': 'bg-fuchsia-100 text-fuchsia-700',
  'Major': 'bg-red-100 text-red-800 font-semibold',
}

export default function UpdatesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: 'Updates' }]} className="mb-8" />

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">Updates & Changelog</h1>
          <p className="text-xl text-gray-600">A timeline of new features, data releases, and investigations.</p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">74+</div>
            <div className="text-sm text-gray-500">Investigations</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">1.82M</div>
            <div className="text-sm text-gray-500">Providers</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">$940B+</div>
            <div className="text-sm text-gray-500">Payments Analyzed</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">500</div>
            <div className="text-sm text-gray-500">AI-Flagged Providers</div>
          </div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-12">
            {updates.map((group) => (
              <div key={group.date}>
                {/* Date marker */}
                <div className="relative flex items-center mb-6">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 ${(group as any).highlight ? 'bg-medicare-primary ring-4 ring-medicare-light' : 'bg-medicare-primary'}`}>
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                  <h2 className="ml-4 text-lg font-bold text-gray-900">{group.date}</h2>
                </div>

                {/* Items */}
                <div className="ml-12 space-y-4">
                  {group.items.map((item) => (
                    <div key={item.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.tags.map((tag) => (
                          <span key={tag} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tagColors[tag] || 'bg-gray-100 text-gray-700'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      {item.link && (
                        <Link href={item.link} className="inline-block mt-2 text-sm text-medicare-primary hover:text-medicare-dark font-medium">
                          View →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Site Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-bold text-gray-900">74+</div>
              <div className="text-gray-500">Investigation Articles</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-bold text-gray-900">30,000+</div>
              <div className="text-gray-500">Deep Provider Profiles</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-bold text-gray-900">500</div>
              <div className="text-gray-500">AI-Flagged Providers</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-bold text-gray-900">61</div>
              <div className="text-gray-500">State & Territory Pages</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-bold text-gray-900">105+</div>
              <div className="text-gray-500">Specialty Breakdowns</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-bold text-gray-900">7,500+</div>
              <div className="text-gray-500">Procedure Codes</div>
            </div>
          </div>
        </div>

        {/* What's Coming Next */}
        <div className="bg-blue-50 rounded-xl p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🔮 What&apos;s Coming Next</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-lg">📊</span>
              <div>
                <h4 className="font-semibold text-gray-900">Medicare Advantage Analysis</h4>
                <p>A deep comparison of Medicare Advantage vs Traditional Medicare spending, enrollment trends, and what the shift means for provider payments.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🗺️</span>
              <div>
                <h4 className="font-semibold text-gray-900">Interactive State Comparison Tool</h4>
                <p>Compare any two states side-by-side on spending, fraud rates, provider density, and top specialties.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🤖</span>
              <div>
                <h4 className="font-semibold text-gray-900">AI Model v3</h4>
                <p>Next-generation fraud detection incorporating temporal patterns, network analysis (provider referral chains), and 2024 billing data for improved accuracy.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">📱</span>
              <div>
                <h4 className="font-semibold text-gray-900">Mobile-Optimized Provider Lookup</h4>
                <p>A streamlined mobile experience for looking up providers, checking fraud flags, and comparing costs on the go.</p>
              </div>
            </div>
          </div>
        </div>
        {/* How to Stay Updated */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Stay Updated</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              OpenMedicare is continuously updated with new investigations, data releases, and features.
              Bookmark this page to track changes, or check back regularly for new content.
            </p>
            <p>
              <strong>Data releases:</strong> CMS publishes new Medicare Provider Utilization data annually, typically
              in the spring. We process and integrate new data within weeks of release, updating all provider profiles,
              state pages, and analyses.
            </p>
            <p>
              <strong>Investigations:</strong> New data-driven investigations are published regularly, focusing on
              fraud patterns, spending anomalies, and policy-relevant findings from our analysis of $940B+ in
              Medicare payments.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
