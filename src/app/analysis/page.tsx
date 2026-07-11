import Link from 'next/link'
import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'

export const metadata: Metadata = {
  title: 'Medicare Analysis — $940B+ in Spending',
  description: 'We analyzed 96M+ rows of CMS data (2014-2024) to uncover hidden patterns in $940B+ of Medicare spending. Explore drug costs, geographic gaps, markups, and 11-year trends serving 68.5M beneficiaries.',
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
            Deep Analysis — Exploring $940B+ in Medicare Data
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Go beyond the headlines. These analyses dig into specific aspects of Medicare spending
            using 96 million rows of CMS physician payment data spanning 11 years (2014-2024).
          </p>
        </div>

        {/* Key Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">$940B+</div>
            <div className="text-sm text-gray-500">Total Payments</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">1.82M</div>
            <div className="text-sm text-gray-500">Providers Analyzed</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">11 Years</div>
            <div className="text-sm text-gray-500">2014-2024 Data</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">96M+</div>
            <div className="text-sm text-gray-500">Rows of CMS Data</div>
          </div>
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

        {/* Data Coverage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What the Data Covers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Dimension</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="px-4 py-2">Time Period</td><td className="px-4 py-2 text-right font-medium">2014-2024 (11 years)</td></tr>
                <tr><td className="px-4 py-2">Total Payments</td><td className="px-4 py-2 text-right font-medium">$940B+</td></tr>
                <tr><td className="px-4 py-2">Unique Providers</td><td className="px-4 py-2 text-right font-medium">1.82 million</td></tr>
                <tr><td className="px-4 py-2">Total Rows</td><td className="px-4 py-2 text-right font-medium">96 million+</td></tr>
                <tr><td className="px-4 py-2">States & Territories</td><td className="px-4 py-2 text-right font-medium">61</td></tr>
                <tr><td className="px-4 py-2">Medical Specialties</td><td className="px-4 py-2 text-right font-medium">105+</td></tr>
                <tr><td className="px-4 py-2">Procedure Codes (HCPCS)</td><td className="px-4 py-2 text-right font-medium">7,500+</td></tr>
                <tr><td className="px-4 py-2">Deep-Profiled Providers</td><td className="px-4 py-2 text-right font-medium">30,000+</td></tr>
                <tr><td className="px-4 py-2">AI-Flagged for Fraud</td><td className="px-4 py-2 text-right font-medium">500</td></tr>
                <tr><td className="px-4 py-2">Investigation Articles</td><td className="px-4 py-2 text-right font-medium">74+</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Analyze Medicare Data</h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              Every analysis on OpenMedicare starts with the same foundation: CMS Medicare Provider Utilization and Payment Data,
              covering 11 years from 2014 through 2024. This dataset includes every payment Medicare Part B made to every physician
              and supplier in the United States — over 96 million individual rows of billing data.
            </p>
            <p>
              We process this data to calculate aggregate statistics at the provider, specialty, state, and procedure level.
              Our analyses use standard statistical methods including peer comparison (comparing providers against specialty averages),
              trend analysis (year-over-year changes), geographic normalization (adjusting for cost-of-living differences),
              and outlier detection (identifying statistically unusual billing patterns).
            </p>
            <p>
              For fraud-related analyses, we employ machine learning models trained on the billing patterns of 2,198 confirmed
              Medicare fraudsters. Our current model (v2) achieves an AUC of 0.83, meaning it correctly distinguishes between
              fraudulent and legitimate billing patterns 83% of the time.
            </p>
          </div>
        </div>

        {/* What Makes Our Analysis Different */}
        <div className="bg-blue-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Makes Our Analysis Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📊 Comprehensive Coverage</h3>
              <p className="text-sm text-gray-700">We don&apos;t sample — we analyze every row. All 1.82 million providers, all 96 million+ billing records, across all 50 states and territories.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📅 11-Year Longitudinal View</h3>
              <p className="text-sm text-gray-700">Most Medicare analyses look at a single year. Ours spans 2014-2024, revealing trends that only emerge over time — like the slow rise of telehealth or the steady concentration of spending.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🤖 AI-Powered Insights</h3>
              <p className="text-sm text-gray-700">Machine learning models don&apos;t just flag outliers — they identify patterns across thousands of variables that human auditors would never catch.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🔓 Fully Transparent</h3>
              <p className="text-sm text-gray-700">Every number on this site comes from publicly available CMS data. We show our sources, explain our methods, and let you verify everything yourself.</p>
            </div>
          </div>
        </div>

        {/* Key Findings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Findings Across Our Analyses</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">💊</span>
              <div>
                <h4 className="font-semibold text-gray-900">Drug Costs Are the Fastest-Growing Category</h4>
                <p className="text-sm text-gray-600">Physician-administered drugs grew from 11% to nearly 15% of Medicare spending in a decade. A single eye injection drug costs more than most federal agencies&apos; budgets.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📈</span>
              <div>
                <h4 className="font-semibold text-gray-900">Markups Are Getting Worse</h4>
                <p className="text-sm text-gray-600">Providers submitted $3.5T+ in charges but Medicare paid $940B. The 3.7x average markup ratio has been climbing every year since 2014.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🌾</span>
              <div>
                <h4 className="font-semibold text-gray-900">Rural America Is Being Left Behind</h4>
                <p className="text-sm text-gray-600">Rural providers earn less per service, treat fewer patients, and face hospital closures — while their patients are older and sicker on average.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🚨</span>
              <div>
                <h4 className="font-semibold text-gray-900">Fraud Hides in Plain Sight</h4>
                <p className="text-sm text-gray-600">Our AI flagged 500 providers whose billing patterns match convicted fraudsters — many have been billing Medicare for years without scrutiny.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🏥</span>
              <div>
                <h4 className="font-semibold text-gray-900">Corporate Medicine Is Growing</h4>
                <p className="text-sm text-gray-600">Large healthcare organizations receive an increasing share of Medicare payments, while solo practitioners decline. The top 1% of providers collect over 25% of all payments.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gray-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Where to Start</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <p><strong>New here?</strong> Start with the <a href="/trends" className="text-blue-600 hover:underline">Spending Trends</a> page for the big picture — how Medicare spending has changed over 11 years.</p>
            <p><strong>Interested in fraud?</strong> Head to the <a href="/fraud" className="text-blue-600 hover:underline">Fraud Hub</a> to see which providers our AI flagged and why.</p>
            <p><strong>Curious about your state?</strong> Browse <a href="/states" className="text-blue-600 hover:underline">State Pages</a> for detailed breakdowns of Medicare spending in your state.</p>
            <p><strong>Want to look up a doctor?</strong> Use the <a href="/lookup" className="text-blue-600 hover:underline">Provider Lookup</a> to search any of 1.82 million Medicare providers.</p>
            <p><strong>Checking costs?</strong> Our <a href="/calculator" className="text-blue-600 hover:underline">Cost Calculator</a> estimates Medicare payments for any procedure combination.</p>
          </div>
        </div>

        {/* Data Limitations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Limitations</h2>
          <div className="prose max-w-none text-gray-700 space-y-3 text-sm">
            <p>
              <strong>Part B only:</strong> Our data covers Medicare Part B (physician/supplier) payments. It does not include
              Part A (hospital inpatient), Part C (Medicare Advantage plan-level payments), or Part D (pharmacy) spending.
              Total Medicare spending across all parts exceeds $890 billion annually.
            </p>
            <p>
              <strong>Fee-for-service:</strong> As more beneficiaries enroll in Medicare Advantage (now over 50%), our
              fee-for-service dataset represents a shrinking share of total Medicare beneficiaries. MA plan payments
              to providers are not included in CMS public use files.
            </p>
            <p>
              <strong>Privacy thresholds:</strong> CMS suppresses data for providers with fewer than 11 beneficiaries for
              any given service to protect patient privacy. This means some low-volume providers and rare procedures
              are underrepresented in our analysis.
            </p>
          </div>
        </div>

        <SourceCitation />
      </div>
    </main>
  )
}
