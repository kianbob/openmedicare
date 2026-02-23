import Link from 'next/link'
import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'

export const metadata: Metadata = {
  title: '9 Deep Dives Into $854B of Spending',
  description: 'We analyzed 96M rows of CMS data to uncover hidden patterns in Medicare spending. Explore drug costs, geographic gaps, markups, and 10-year trends.',
}

const analyses = [
  {
    title: 'Place of Service',
    href: '/place-of-service',
    description: 'Office vs Facility: Where Medicare Money Flows',
    icon: '🏢',
  },
  {
    title: 'Geographic',
    href: '/geographic',
    description: 'Spending Hotspots by City & Zip Code',
    icon: '📍',
  },
  {
    title: 'Cost Adjustment',
    href: '/cost-adjustment',
    description: 'The Geographic Cost Gap',
    icon: '⚖️',
  },
  {
    title: 'Payment Gap',
    href: '/payment-gap',
    description: 'Charged vs Allowed vs Paid: The Three-Way Gap',
    icon: '💸',
  },
  {
    title: 'Utilization',
    href: '/utilization',
    description: 'Individual Doctors vs Corporate Medicine',
    icon: '🏥',
  },
  {
    title: 'Markup Analysis',
    href: '/markup',
    description: 'What Doctors Charge vs What Medicare Pays',
    icon: '📈',
  },
  {
    title: 'Drug Spending',
    href: '/drug-spending',
    description: "Medicare's Pharmaceutical Pipeline",
    icon: '💊',
  },
  {
    title: 'Rural vs Urban',
    href: '/rural-urban',
    description: 'The Geographic Divide in Medicare',
    icon: '🌾',
  },
  {
    title: 'Trends',
    href: '/trends',
    description: '10 Years of Medicare Spending',
    icon: '📊',
  },
]

export default function AnalysisPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Deep Analysis', href: '/analysis' }]} />

        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
            Deep Analysis — Exploring $854.8B in Medicare Data
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Go beyond the headlines. These analyses dig into specific aspects of Medicare spending
            using 96 million rows of CMS physician payment data.
          </p>
        </div>

        {/* Analysis Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {analyses.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-medicare-primary/30 transition-all"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-medicare-primary mb-2">
                {item.title}
              </h2>
              <p className="text-sm text-gray-600">{item.description}</p>
            </Link>
          ))}
        </div>

        {/* Related */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Also Explore</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/fraud" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">🚨 Fraud Hub</div>
            </Link>
            <Link href="/investigations" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">📰 Investigations</div>
            </Link>
            <Link href="/providers" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">👨‍⚕️ Provider Directory</div>
            </Link>
            <Link href="/search" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">🔍 Search</div>
            </Link>
            <Link href="/states" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">📍 By State</div>
            </Link>
            <Link href="/specialties" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">🩺 By Specialty</div>
            </Link>
            <Link href="/procedures" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">📋 Procedures</div>
            </Link>
            <Link href="/calculator" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600 text-sm">🧮 Calculator</div>
            </Link>
          </div>
        </div>

        <SourceCitation />
      </div>
    </main>
  )
}
