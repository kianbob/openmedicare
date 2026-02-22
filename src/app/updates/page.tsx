import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Updates & Changelog',
  description: 'Timeline of new features, data releases, and investigations on OpenMedicare.',
  alternates: {
    canonical: '/updates',
  },
}

const updates = [
  {
    date: 'February 21, 2026 — Evening',
    highlight: true,
    items: [
      {
        title: 'Major Platform Update',
        description: 'Added investigation disclaimers, unified provider database (2,938 providers), ML fraud model integration (500 AI-flagged providers), dynamic OG images, 53 investigation articles.',
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
        description: 'Trained on 2,198 confirmed fraudsters, analyzed 1.72M providers, flagged 500 high-risk. Our ML model now combines anomaly detection, peer comparison, and known-fraud pattern matching for the most comprehensive risk scoring in Medicare transparency.',
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
        description: '96 million rows of CMS Medicare Provider Utilization and Payment data (2014-2023) processed, analyzed, and loaded.',
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
      </div>
    </div>
  )
}
