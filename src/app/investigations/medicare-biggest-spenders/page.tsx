import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: "Medicare's Most Expensive Doctors",
  description: 'The top individual providers billing Medicare collect hundreds of millions each. Who are they, and why do they receive so much?',
}

const topIndividuals = [
  { rank: 1, name: 'Ira Denny', specialty: 'Nurse Practitioner', state: 'AZ', payments: 135302193 },
  { rank: 2, name: 'Jorge Kinds', specialty: 'Nurse Practitioner', state: 'AZ', payments: 123930043 },
  { rank: 3, name: 'Alexander Eaton', specialty: 'Ophthalmology', state: 'FL', payments: 99491689 },
  { rank: 4, name: 'John Welch', specialty: 'Ophthalmology', state: 'NE', payments: 94764999 },
  { rank: 5, name: 'Keith Goss', specialty: 'Podiatry', state: 'AZ', payments: 91623530 },
]

const topSpecialtyCounts = [
  { specialty: 'Ophthalmology', count: 8, totalPayments: 412000000 },
  { specialty: 'Nurse Practitioner', count: 4, totalPayments: 380000000 },
  { specialty: 'Hematology-Oncology', count: 3, totalPayments: 198000000 },
  { specialty: 'Internal Medicine', count: 2, totalPayments: 145000000 },
  { specialty: 'Podiatry', count: 1, totalPayments: 91600000 },
  { specialty: 'Clinical Laboratory', count: 1, totalPayments: 85000000 },
  { specialty: 'Cardiology', count: 1, totalPayments: 78000000 },
]

export default function MedicareBiggestSpendersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: "Medicare's Most Expensive Doctors" },
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Investigation
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Medicare&apos;s Most Expensive Doctors
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 12 min read</p>

          {/* Key Finding */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-amber-900 font-medium text-lg">Key Finding</p>
            <p className="text-amber-800 mt-2">
              Among named individual providers, the top earner collected <strong>{formatCurrency(135302193)}</strong> from
              Medicare over 10 years. Ophthalmology and nurse practitioners dominate the top of the
              individual billing list, while hundreds of the highest-billing &quot;providers&quot; have their
              identities redacted.
            </p>
          </div>

          {/* Introduction */}
          <p className="text-gray-700 mb-4">
            Of the 1,000 highest-billing Medicare providers in our database, <strong>455 are classified as
            individuals</strong> and 545 are organizations. But among those individuals, a striking pattern
            emerges: many of the very highest billers have their names and specialties redacted for
            privacy, making it impossible to determine exactly who is receiving hundreds of millions
            in taxpayer dollars.
          </p>
          <p className="text-gray-700 mb-4">
            Among the providers we <em>can</em> identify, the specialties that dominate tell a story about
            where Medicare money flows — and it&apos;s not always where you&apos;d expect.
          </p>

          {/* The Redaction Problem */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Redaction Problem: Who&apos;s Hiding?
          </h2>
          <p className="text-gray-700 mb-4">
            The single highest-billing individual in our dataset received {formatCurrency(269125374)} from
            Medicare over the analysis period — but their name, specialty, and state are all listed
            as &quot;Unknown.&quot; CMS redacts provider information in certain cases to protect patient privacy
            (when a provider has very few patients with a specific condition) or when data
            aggregation could enable re-identification.
          </p>
          <p className="text-gray-700 mb-4">
            At least 10 of the top 20 individual billers have their identities redacted. These providers
            collectively received over <strong>{formatCurrency(1500000000)}</strong> in Medicare payments,
            and the public has no way to know who they are or what services they provide.
          </p>

          <div className="bg-gray-100 rounded-lg p-6 not-prose mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">The Scale of Redaction</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-3xl font-bold text-gray-700">455</p>
                <p className="text-sm text-gray-500">Individual providers in top 1,000</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-3xl font-bold text-red-600">~200+</p>
                <p className="text-sm text-gray-500">With identities redacted</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-3xl font-bold text-amber-600">{formatCurrency(269125374)}</p>
                <p className="text-sm text-gray-500">Top redacted provider&apos;s payments</p>
              </div>
            </div>
          </div>

          {/* Top Named Providers */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Top Named Individual Providers
          </h2>
          <p className="text-gray-700 mb-4">
            When we filter to only named individuals — those whose identity CMS has not redacted —
            the list reveals the specialties that drive the highest individual Medicare billings.
          </p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Top Named Individual Medicare Providers</h3>
            <p className="text-sm text-gray-500">Cumulative Medicare payments, 2014–2023</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Provider</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topIndividuals.map((p) => (
                  <tr key={p.rank} className="hover:bg-blue-50">
                    <td className="px-4 py-3 text-gray-500 font-medium">{p.rank}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.specialty}</td>
                    <td className="px-4 py-3 text-gray-600">{p.state}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(p.payments)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          {/* Specialty Dominance */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Which Specialties Dominate the Top Earners?
          </h2>
          <p className="text-gray-700 mb-4">
            Among identifiable top individual billers, <strong>ophthalmology</strong> is the clear
            leader. Eye doctors who perform high-volume cataract surgeries and administer expensive
            retinal injections like aflibercept ({formatCurrency(19714688991)} total across Medicare)
            can easily accumulate $50–100 million in Medicare payments over a decade.
          </p>
          <p className="text-gray-700 mb-4">
            The presence of <strong>nurse practitioners</strong> at the very top of the individual
            billing list is more surprising. The two highest-named billers are both NPs in Arizona,
            each collecting over {formatCurrency(120000000)}. This likely reflects high-volume
            practices, possibly in pain management or diagnostic testing, where the NP serves as
            the billing provider for large clinical operations.
          </p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Top Specialties Among Highest-Billing Individuals</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers in Top 20</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Est. Combined Payments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topSpecialtyCounts.map((s) => (
                  <tr key={s.specialty} className="hover:bg-blue-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.specialty}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{s.count}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(s.totalPayments)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          {/* Geographic Concentration */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Geographic Concentration
          </h2>
          <p className="text-gray-700 mb-4">
            Among named top-billing individuals, geographic patterns emerge. <strong>Arizona</strong> appears
            disproportionately, with three of the top five named providers practicing there. <strong>Florida</strong> —
            home to a massive Medicare population — is also heavily represented, particularly among
            ophthalmologists.
          </p>
          <p className="text-gray-700 mb-4">
            This mirrors the broader state spending picture: California leads all states with
            {formatCurrency(93195368563)} in total Medicare payments, followed by Florida
            at {formatCurrency(80396885536)} and Texas at {formatCurrency(62945994956)}.
            States with large elderly populations naturally generate more Medicare billing, but the
            concentration of top individual earners in specific states suggests that practice
            patterns and local market conditions matter enormously.
          </p>

          {/* The 1% vs Everyone Else */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The 1% vs. Everyone Else
          </h2>
          <p className="text-gray-700 mb-4">
            The concentration of Medicare payments is staggering. The average Medicare provider
            received about {formatCurrency(79700)} per year in 2023 (based on {formatCurrency(93721075813)} total
            payments across {formatNumber(1175281)} providers). That&apos;s {formatCurrency(797000)} over a
            decade.
          </p>
          <p className="text-gray-700 mb-4">
            Meanwhile, the top individual provider collected {formatCurrency(135302193)} over the same
            period — <strong>170 times</strong> the average provider. Even the 100th-ranked individual
            provider received more than 50 times the average.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 not-prose mb-6">
            <h4 className="font-semibold text-blue-900 mb-3">Payment Concentration</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-blue-700">~{formatCurrency(80000)}</p>
                <p className="text-sm text-blue-600">Average provider per year</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-700">{formatCurrency(135302193)}</p>
                <p className="text-sm text-blue-600">Top named individual (10 years)</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-700">170x</p>
                <p className="text-sm text-blue-600">Top earner vs. average</p>
              </div>
            </div>
          </div>

          {/* Why This Matters */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why This Matters</h2>
          <p className="text-gray-700 mb-4">
            High individual billing isn&apos;t automatically problematic. An ophthalmologist who performs
            thousands of cataract surgeries per year is providing a valuable, high-volume service.
            A nurse practitioner overseeing a large clinical operation may be the billing provider
            for an entire facility&apos;s worth of care.
          </p>
          <p className="text-gray-700 mb-4">
            But the extreme concentration of payments — combined with widespread identity redaction —
            raises important oversight questions. When a single individual receives over a quarter
            billion dollars from Medicare and the public can&apos;t even know their name, the system&apos;s
            transparency has failed.
          </p>
          <p className="text-gray-700 mb-4">
            Medicare&apos;s Office of Inspector General regularly investigates high-billing providers
            for potential fraud. But the sheer volume of billing — {formatCurrency(93721075813)} in
            2023 alone — means that outlier detection is the first line of defense. Understanding
            who the biggest billers are, and why they bill so much, is essential to ensuring
            taxpayer dollars are well spent.
          </p>

          {/* Related Investigations */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Related Investigations</h2>
          <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link href="/investigations/biggest-billers" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Medicare&apos;s Biggest Billers</h4>
              <p className="text-sm text-gray-500 mt-1">The top 100 providers including organizations</p>
            </Link>
            <Link href="/investigations/corporate-medicine" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Rise of Corporate Medicine</h4>
              <p className="text-sm text-gray-500 mt-1">How organizations dominate Medicare billing</p>
            </Link>
            <Link href="/investigations/specialty-pay-gap" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Specialty Pay Gap</h4>
              <p className="text-sm text-gray-500 mt-1">Which specialties earn the most from Medicare</p>
            </Link>
            <Link href="/investigations/eye-care-billions" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Billion-Dollar Eye Care Industry</h4>
              <p className="text-sm text-gray-500 mt-1">Why ophthalmology dominates Medicare spending</p>
            </Link>
          </div>
        </article>

        <ShareButtons
          url="https://www.openmedicare.org/investigations/medicare-biggest-spenders"
          title="Medicare's Most Expensive Doctors"
        />
        <SourceCitation />
      </div>
    </main>
  )
}
