import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'Look Up Any Doctor\'s Medicare Payments (Free)',
  description: 'Search any doctor\'s Medicare billing by name or NPI. See 10 years of payments, peer comparisons, and fraud red flags in seconds.',
  keywords: ['medicare provider lookup', 'look up doctor medicare', 'medicare doctor search', 'NPI lookup', 'medicare billing lookup', 'find doctor medicare payments'],
  openGraph: {
    title: 'Look Up Any Doctor\'s Medicare Payments (Free)',
    description: 'Search any doctor\'s Medicare billing by name or NPI. See 10 years of payments, peer comparisons, and fraud red flags in seconds.',
  },
  alternates: {
    canonical: '/investigations/medicare-provider-lookup-guide',
  },
}

export default function MedicareProviderLookupGuidePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'Medicare Provider Lookup Guide' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Guide</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            How to Look Up Your Doctor&apos;s Medicare Billing
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 8 min read</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">Why This Matters</p>
            <p className="text-blue-800 mt-2">
              Medicare is a public program funded by taxpayers. Every dollar paid to a provider is public record.
              OpenMedicare makes this data searchable so you can see exactly how much your doctor bills Medicare,
              what services they provide, and how they compare to peers.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 1: Search for Your Provider</h2>
          <p className="text-gray-700 mb-4">
            Go to the <Link href="/lookup" className="text-blue-600 hover:text-blue-800">OpenMedicare Provider Lookup</Link> page
            and type your doctor&apos;s name, NPI number, specialty, or state. You need at least 2 characters to start searching.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Tip:</strong> If your doctor has a common name, add their state abbreviation to narrow results.
            If you know their NPI (National Provider Identifier) — a unique 10-digit number — that&apos;s the most precise search.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 not-prose">
            <p className="font-semibold text-gray-900 mb-2">What you can search by:</p>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• <strong>Name:</strong> &quot;John Smith&quot; or &quot;Smith, John&quot;</li>
              <li>• <strong>NPI:</strong> 10-digit number like &quot;1234567890&quot;</li>
              <li>• <strong>Specialty:</strong> &quot;Cardiology&quot; or &quot;Internal Medicine&quot;</li>
              <li>• <strong>State:</strong> &quot;CA&quot; or &quot;FL&quot;</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 2: Read the Provider Profile</h2>
          <p className="text-gray-700 mb-4">
            When you click on a provider, you&apos;ll see their full billing profile. Here&apos;s what each section means:
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Basic Information</h3>
          <ul className="text-gray-700 mb-4">
            <li><strong>NPI:</strong> The provider&apos;s unique National Provider Identifier — think of it as their Medicare ID.</li>
            <li><strong>Specialty:</strong> Their primary Medicare specialty classification.</li>
            <li><strong>State:</strong> Where they practice (based on their Medicare enrollment).</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Payment Summary</h3>
          <ul className="text-gray-700 mb-4">
            <li><strong>Total Payments:</strong> How much Medicare has paid this provider over the data period (2014-2023).</li>
            <li><strong>Total Services:</strong> The number of individual services billed.</li>
            <li><strong>Total Beneficiaries:</strong> How many unique Medicare patients they&apos;ve treated.</li>
            <li><strong>Submitted Charges:</strong> What the provider billed (before Medicare&apos;s fee schedule adjustments).</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Peer Comparison</h3>
          <p className="text-gray-700 mb-4">
            OpenMedicare compares each provider to others in the same specialty. This helps you understand whether
            their billing is typical or unusual. A provider billing 5x the specialty average isn&apos;t necessarily
            fraudulent — they might have a large practice — but it&apos;s worth understanding.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 3: Understand Fraud Flags</h2>
          <p className="text-gray-700 mb-4">
            Some provider profiles include fraud risk indicators. These are <strong>not</strong> accusations — they&apos;re
            statistical flags based on billing patterns that deviate significantly from peer norms. Common flags include:
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 not-prose">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2 font-bold">⚠️</span>
                <span><strong>High volume:</strong> Billing significantly more services than peers in the same specialty</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2 font-bold">⚠️</span>
                <span><strong>High markup:</strong> Submitted charges far exceeding Medicare payment amounts</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2 font-bold">⚠️</span>
                <span><strong>Code concentration:</strong> Billing heavily on a small number of high-value codes</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2 font-bold">⚠️</span>
                <span><strong>Impossible volume:</strong> Billing more services per day than is physically possible</span>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What the Data Shows — and Doesn&apos;t Show</h2>
          <p className="text-gray-700 mb-4">
            It&apos;s important to understand the limitations of Medicare billing data:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="font-semibold text-green-900 mb-2">✅ What it shows</p>
              <ul className="space-y-1 text-green-800 text-sm">
                <li>• Total Medicare payments received</li>
                <li>• Services billed and their codes</li>
                <li>• Number of patients served</li>
                <li>• Submitted charges vs. actual payments</li>
                <li>• Year-over-year billing trends</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-semibold text-red-900 mb-2">❌ What it doesn&apos;t show</p>
              <ul className="space-y-1 text-red-800 text-sm">
                <li>• Quality of care provided</li>
                <li>• Patient outcomes</li>
                <li>• Private insurance billing</li>
                <li>• Out-of-pocket patient costs</li>
                <li>• Practice overhead or net income</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">CMS Tools vs. OpenMedicare</h2>
          <p className="text-gray-700 mb-4">
            CMS (Centers for Medicare &amp; Medicaid Services) provides its own lookup tools, including the
            {' '}<a href="https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Medicare Provider Utilization and Payment Data</a>{' '}
            portal. Here&apos;s how they compare:
          </p>
          <div className="overflow-x-auto not-prose mb-8">
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Feature</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">CMS Data Portal</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-blue-700">OpenMedicare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-white">
                  <td className="px-4 py-3 text-gray-700">Easy provider search</td>
                  <td className="px-4 py-3 text-center">Limited</td>
                  <td className="px-4 py-3 text-center font-medium text-blue-700">✅ Instant search</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-700">10-year trends</td>
                  <td className="px-4 py-3 text-center">Year-by-year files</td>
                  <td className="px-4 py-3 text-center font-medium text-blue-700">✅ Pre-aggregated</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 text-gray-700">Peer comparison</td>
                  <td className="px-4 py-3 text-center">No</td>
                  <td className="px-4 py-3 text-center font-medium text-blue-700">✅ Built-in</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-700">Fraud risk flags</td>
                  <td className="px-4 py-3 text-center">No</td>
                  <td className="px-4 py-3 text-center font-medium text-blue-700">✅ Statistical flags</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 text-gray-700">Raw data download</td>
                  <td className="px-4 py-3 text-center font-medium text-green-700">✅ Full datasets</td>
                  <td className="px-4 py-3 text-center">Top providers</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Found Something Suspicious?</h2>
          <p className="text-gray-700 mb-4">
            If a provider&apos;s billing seems unusual, you have options. Check our{' '}
            <Link href="/fraud/report" className="text-blue-600 hover:text-blue-800">guide to reporting Medicare fraud</Link>,
            which explains how to file a complaint with the HHS-OIG, understand whistleblower protections, and what
            qualifies as fraud vs. legitimate billing variation.
          </p>

          <div className="bg-medicare-primary/5 border border-medicare-primary/20 rounded-lg p-6 mb-8 not-prose text-center">
            <p className="text-lg font-semibold text-gray-900 mb-3">Ready to look up a provider?</p>
            <Link
              href="/lookup"
              className="inline-flex items-center px-6 py-3 bg-medicare-primary text-white font-semibold rounded-lg hover:bg-medicare-dark transition-colors"
            >
              Search Medicare Providers →
            </Link>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 not-prose">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/investigations/how-much-does-medicare-pay" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">How Much Does Medicare Pay Doctors?</div>
                <div className="text-sm text-gray-500">Average payments by specialty</div>
              </Link>
              <Link href="/investigations/medicare-fraud-2025" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">Medicare Fraud in 2025</div>
                <div className="text-sm text-gray-500">The biggest cases and what&apos;s changed</div>
              </Link>
              <Link href="/fraud/report" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">Report Medicare Fraud</div>
                <div className="text-sm text-gray-500">How to file a complaint</div>
              </Link>
              <Link href="/investigations/impossible-doctors" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">The Impossible Doctors</div>
                <div className="text-sm text-gray-500">When the billing math doesn&apos;t add up</div>
              </Link>
            </div>
          </div>
        </article>

        {/* Related Investigations */}
        <div className="bg-gray-50 rounded-xl p-6 mt-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/how-much-does-medicare-pay" className="text-medicare-primary hover:underline text-sm">💰 How Much Does Medicare Pay?</Link>
            <Link href="/investigations/biggest-billers" className="text-medicare-primary hover:underline text-sm">📊 Medicare&apos;s Biggest Billers</Link>
            <Link href="/investigations/where-medicare-dollar-goes" className="text-medicare-primary hover:underline text-sm">💵 Where Your Medicare Dollar Goes</Link>
            <Link href="/providers" className="text-medicare-primary hover:underline text-sm">👨‍⚕️ Provider Directory</Link>
          </div>
        </div>

        <div className="mt-8">
          <ShareButtons
            url="https://www.openmedicare.us/investigations/medicare-provider-lookup-guide"
            title="How to Look Up Your Doctor's Medicare Billing"
            description="A step-by-step guide to searching Medicare provider data."
          />
        </div>

        <SourceCitation
          lastUpdated="February 2026 (data through 2023)"
          sources={[
            'CMS Medicare Provider Utilization and Payment Data (2014-2023)',
            'CMS National Plan and Provider Enumeration System (NPPES)',
          ]}
        />
      </div>
    </main>
  )
}
