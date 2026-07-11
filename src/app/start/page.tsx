import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Start Here — Guide to OpenMedicare',
  description: 'New to OpenMedicare? Follow 8 steps to explore $940B+ in Medicare data (2014-2024), check your doctor among 1.82M providers, uncover AI fraud flags, and use free interactive tools. 68.5M beneficiaries.',
}

const sections = [
  {
    step: '1',
    title: 'Welcome — The Big Picture',
    href: '/about',
    description: 'OpenMedicare analyzes 1.82 million providers across $940B in Medicare payments, with 30,000+ deep-profiled. 500 are ML-flagged for fraud risk.',
    icon: '👋',
    color: 'bg-amber-50 border-amber-200',
  },
  {
    step: '2',
    title: 'Check Your Doctor',
    href: '/lookup',
    description: 'Search any of 1.7M Medicare providers — 30,000+ have detailed profiles with billing history, specialty comparison, and risk flags.',
    icon: '🔍',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    step: '3',
    title: 'Explore the Fraud Analysis',
    href: '/fraud',
    description: 'We flagged 500 providers with statistical billing anomalies. See who\'s billing impossible volumes.',
    icon: '🚨',
    color: 'bg-red-50 border-red-200',
  },
  {
    step: '4',
    title: 'Still Out There',
    href: '/fraud/still-out-there',
    description: 'Our AI model trained on 2,198 confirmed fraudsters found 500 providers who bill like criminals but haven\'t been caught. AUC: 0.83.',
    icon: '🤖',
    color: 'bg-indigo-50 border-indigo-200',
  },
  {
    step: '5',
    title: 'Read Our Investigations',
    href: '/investigations',
    description: '68 data-driven investigations exploring Medicare spending patterns, from drug money to geographic inequality.',
    icon: '📰',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    step: '6',
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
            Step 7: Interactive Tools
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

        {/* Quick Links */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Step 8: Browse the Data
          </h2>
          <p className="text-gray-600 mb-6">Jump directly into provider, state, specialty, or procedure data.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/providers" className="group bg-white rounded-lg border border-gray-200 p-5 text-center hover:shadow-md hover:border-medicare-primary/30 transition-all">
              <div className="text-2xl mb-2">👨‍⚕️</div>
              <div className="font-medium text-gray-900 group-hover:text-medicare-primary">Providers</div>
            </Link>
            <Link href="/states" className="group bg-white rounded-lg border border-gray-200 p-5 text-center hover:shadow-md hover:border-medicare-primary/30 transition-all">
              <div className="text-2xl mb-2">📍</div>
              <div className="font-medium text-gray-900 group-hover:text-medicare-primary">States</div>
            </Link>
            <Link href="/specialties" className="group bg-white rounded-lg border border-gray-200 p-5 text-center hover:shadow-md hover:border-medicare-primary/30 transition-all">
              <div className="text-2xl mb-2">🩺</div>
              <div className="font-medium text-gray-900 group-hover:text-medicare-primary">Specialties</div>
            </Link>
            <Link href="/procedures" className="group bg-white rounded-lg border border-gray-200 p-5 text-center hover:shadow-md hover:border-medicare-primary/30 transition-all">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-medium text-gray-900 group-hover:text-medicare-primary">Procedures</div>
            </Link>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
            <div className="text-2xl font-bold text-blue-600">$940B+</div>
            <div className="text-sm text-gray-500">Total Payments</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
            <div className="text-2xl font-bold text-green-600">1.82M</div>
            <div className="text-sm text-gray-500">Providers</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
            <div className="text-2xl font-bold text-purple-600">11 Years</div>
            <div className="text-sm text-gray-500">of Data (2014-2024)</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
            <div className="text-2xl font-bold text-red-600">500</div>
            <div className="text-sm text-gray-500">AI-Flagged Providers</div>
          </div>
        </div>

        {/* About the Data */}
        <div className="bg-blue-50 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">About the Data</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              Every number on OpenMedicare comes from <strong>official CMS data</strong> — the Centers for Medicare & Medicaid Services
              Medicare Provider Utilization and Payment Data. This covers every payment Medicare Part B made to every physician
              and supplier in the United States from 2014 through 2024.
            </p>
            <p>
              We process over <strong>96 million rows</strong> of billing data to calculate provider-level statistics, specialty
              comparisons, geographic patterns, and trend analysis. Our AI fraud detection model was trained on the billing
              patterns of <strong>2,198 confirmed Medicare fraudsters</strong> to identify active providers with similar patterns.
            </p>
            <p>
              This data is public and free. We didn&apos;t create it — we made it accessible, searchable, and understandable.
              CMS publishes this data annually. We clean it, analyze it, and present it in a way that anyone can explore.
            </p>
          </div>
        </div>

        {/* What You'll Find */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">What You&apos;ll Find on OpenMedicare</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">💰 $940B+ in Payments</h3>
              <p className="text-sm text-gray-600">Every dollar Medicare Part B has paid to every provider from 2014 through 2024 — fully searchable and analyzed. See where your tax dollars and premiums actually go.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">🤖 AI Fraud Detection</h3>
              <p className="text-sm text-gray-600">Our machine learning model, trained on 2,198 confirmed fraudsters, has flagged 500 active providers with suspicious billing patterns. Each comes with a detailed risk profile.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">📰 74+ Investigations</h3>
              <p className="text-sm text-gray-600">Data-driven investigations into Medicare fraud schemes, spending patterns, geographic inequality, and the stories behind the numbers.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Interactive Analysis</h3>
              <p className="text-sm text-gray-600">Drug spending trends, markup ratios, rural vs urban breakdowns, state-by-state comparisons, and 11-year trend lines — all interactive.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Common Questions</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900">Is this data real?</h3>
              <p className="text-sm text-gray-600 mt-1">Yes. Every number comes from official CMS (Centers for Medicare & Medicaid Services) public datasets. We process, analyze, and present the data — we don&apos;t create it.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900">Does a high-risk AI flag mean a provider is committing fraud?</h3>
              <p className="text-sm text-gray-600 mt-1">No. Our AI identifies <em>statistical patterns</em> that resemble known fraud. It&apos;s a signal for further review, not a determination of guilt. Many flagged providers may have legitimate reasons for unusual billing.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900">How current is the data?</h3>
              <p className="text-sm text-gray-600 mt-1">Our dataset covers 2014-2024 (11 years). CMS releases data with approximately a 1-2 year lag. The most recent complete year in our dataset is 2024.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900">Why does this matter?</h3>
              <p className="text-sm text-gray-600 mt-1">Medicare spends $890B+ annually serving 68.5 million Americans. Fraud wastes an estimated $60-100 billion per year. Transparency — knowing where the money goes and who&apos;s getting it — is the first step toward accountability.</p>
            </div>
          </div>
        </div>

        {/* How to Use This Site */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Tips for Exploring</h2>
          <div className="space-y-3">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900">🔍 Search by NPI Number</h3>
              <p className="text-sm text-gray-600 mt-1">Every Medicare provider has a unique 10-digit NPI (National Provider Identifier). If you have it, searching by NPI gives you the most precise results. You can find NPIs on medical bills, insurance statements, or the CMS NPPES registry.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900">📊 Understand the Numbers</h3>
              <p className="text-sm text-gray-600 mt-1">Payment amounts show what Medicare actually paid, not what was charged. Providers typically charge 3-4x more than Medicare pays. High payments don&apos;t necessarily mean a provider is expensive — it often means they see many Medicare patients.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900">🚨 About Fraud Flags</h3>
              <p className="text-sm text-gray-600 mt-1">AI fraud flags are statistical indicators, not accusations. A flagged provider may have perfectly legitimate reasons for unusual billing patterns (e.g., specialized practice, high-volume clinic). Always consider context before drawing conclusions.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900">🗺️ State-Level Detail</h3>
              <p className="text-sm text-gray-600 mt-1">Each of our 61 state/territory pages includes top providers, specialty breakdowns, spending trends, and fraud flags specific to that location. Great for understanding Medicare in your area.</p>
            </div>
          </div>
        </div>

        {/* The Mission */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-16">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Why OpenMedicare Exists</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              Medicare is the largest healthcare payer in the United States, spending over <strong>$890 billion annually</strong> to
              serve <strong>68.5 million Americans</strong>. That&apos;s public money — funded by payroll taxes, premiums, and general revenue.
              Every taxpayer has a stake in how it&apos;s spent.
            </p>
            <p>
              Yet most Americans have no idea where their Medicare dollars go. Which providers receive the most? Which procedures
              cost the most? Who&apos;s billing suspiciously? CMS publishes this data, but it&apos;s buried in massive CSV files that
              require technical expertise to access.
            </p>
            <p>
              OpenMedicare makes this data accessible to everyone. Search any provider. Compare costs. Explore spending patterns.
              Read investigations. The goal is simple: <strong>transparency breeds accountability</strong>.
            </p>
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

        {/* Data Source */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>All data sourced from <strong>Centers for Medicare & Medicaid Services (CMS)</strong></p>
          <p>Medicare Provider Utilization and Payment Data, 2014-2024</p>
          <p className="mt-2">
            <a href="/about" className="text-blue-600 hover:underline">About OpenMedicare</a>
            {' · '}
            <a href="/updates" className="text-blue-600 hover:underline">Updates & Changelog</a>
            {' · '}
            <a href="/investigations" className="text-blue-600 hover:underline">74+ Investigations</a>
          </p>
        </div>
      </div>
    </main>
  )
}
