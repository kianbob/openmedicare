import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Start Here | OpenMedicare',
  description: 'New to OpenMedicare? A guided tour of Medicare spending data, fraud analysis, investigations, and interactive tools.',
}

const sections = [
  {
    step: '1',
    title: 'Check Your Doctor',
    href: '/lookup',
    description: 'Search any Medicare provider and see their billing history, specialty comparison, and risk flags.',
    icon: '🔍',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    step: '2',
    title: 'Explore the Fraud Analysis',
    href: '/fraud',
    description: 'We flagged 500 providers with statistical billing anomalies. See who\'s billing impossible volumes.',
    icon: '🚨',
    color: 'bg-red-50 border-red-200',
  },
  {
    step: '3',
    title: 'Read Our Investigations',
    href: '/investigations',
    description: '40+ data-driven articles exploring Medicare spending patterns, from drug money to geographic inequality.',
    icon: '📰',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    step: '4',
    title: 'Dive Into the Data',
    href: '/analysis',
    description: 'State-by-state breakdowns, specialty comparisons, 10-year trends, and more.',
    icon: '📊',
    color: 'bg-green-50 border-green-200',
  },
]

const tools = [
  { name: 'Compare Providers', href: '/compare', icon: '⚖️' },
  { name: 'Cost Calculator', href: '/calculator', icon: '🧮' },
  { name: 'Your Medicare Dollar', href: '/your-medicare-dollar', icon: '💵' },
]

export default function StartHerePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
            New to OpenMedicare?
          </h1>
          <p className="text-xl text-gray-600">
            Here&apos;s where to start.
          </p>
        </div>

        {/* Guided Sections */}
        <div className="space-y-6 mb-16">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={`group flex items-start gap-5 rounded-xl border p-6 transition-all hover:shadow-lg ${section.color}`}
            >
              <div className="text-3xl flex-shrink-0">{section.icon}</div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Step {section.step}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-medicare-primary mb-1">
                  {section.title}
                </h2>
                <p className="text-gray-600">{section.description}</p>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-medicare-primary flex-shrink-0 mt-1" />
            </Link>
          ))}
        </div>

        {/* Interactive Tools */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Step 5: Interactive Tools
          </h2>
          <p className="text-gray-600 mb-6">Hands-on ways to explore the data yourself.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-white rounded-lg border border-gray-200 p-5 text-center hover:shadow-md hover:border-medicare-primary/30 transition-all"
              >
                <div className="text-2xl mb-2">{tool.icon}</div>
                <div className="font-medium text-gray-900 group-hover:text-medicare-primary">{tool.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center bg-white rounded-xl border border-gray-200 p-8">
          <p className="text-gray-600 mb-4">Have a tip? Know about suspicious billing?</p>
          <Link
            href="/fraud/report"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            Report Fraud
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  )
}
