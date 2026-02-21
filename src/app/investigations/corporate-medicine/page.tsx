import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: 'The Rise of Corporate Medicine — OpenMedicare',
  description: 'Organizations now outnumber individuals among Medicare\'s top billers. Lab corporations alone collect billions annually.',
}

const topOrganizations = [
  { rank: 1, name: 'Laboratory Corp. of America Holdings', specialty: 'Clinical Laboratory', state: 'NC', payments: 2203741737 },
  { rank: 2, name: 'Exact Sciences Laboratories, LLC', specialty: 'Clinical Laboratory', state: 'WI', payments: 1640797633 },
  { rank: 3, name: 'Laboratory Corp. of America Holdings', specialty: 'Clinical Laboratory', state: 'NJ', payments: 1249488503 },
  { rank: 4, name: 'Quest Diagnostics Clinical Labs', specialty: 'Clinical Laboratory', state: 'FL', payments: 1046178856 },
  { rank: 5, name: 'Quest Diagnostics Incorporated', specialty: 'Clinical Laboratory', state: 'NJ', payments: 927210476 },
  { rank: 6, name: 'Genomic Health, Inc.', specialty: 'Clinical Laboratory', state: 'CA', payments: 887613089 },
  { rank: 7, name: 'Unilab Corporation', specialty: 'Clinical Laboratory', state: 'CA', payments: 868839405 },
  { rank: 8, name: 'Bioreference Health, LLC', specialty: 'Clinical Laboratory', state: 'NJ', payments: 840998964 },
  { rank: 9, name: 'CareDx Inc.', specialty: 'Clinical Laboratory', state: 'CA', payments: 750987766 },
  { rank: 10, name: 'Rocky Mountain Holdings, LLC', specialty: 'Ambulance Service', state: 'AL', payments: 740053925 },
]

const orgVsIndividual = [
  { category: 'Organizations', count: 545, totalPayments: 52000000000, avgPayment: 95412844 },
  { category: 'Individuals', count: 455, totalPayments: 28000000000, avgPayment: 61538462 },
]

export default function CorporateMedicinePage() {
  const labCorpTotal = 2203741737 + 1249488503 + 692687546 + 659229855 // NC + NJ + AL + OH
  const questTotal = 1046178856 + 927210476 + 599206542 // FL + NJ + GA

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'The Rise of Corporate Medicine' },
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Investigation
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            The Rise of Corporate Medicine
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 13 min read</p>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-purple-900 font-medium text-lg">Key Finding</p>
            <p className="text-purple-800 mt-2">
              Among Medicare&apos;s top 1,000 billers, <strong>545 are organizations</strong> and only
              455 are individuals. Laboratory Corporation of America alone collected
              <strong> {formatCurrency(labCorpTotal)}</strong> across multiple state entities,
              while Quest Diagnostics received <strong>{formatCurrency(questTotal)}</strong>.
              Clinical laboratories dominate the organizational billing landscape.
            </p>
          </div>

          <p className="text-gray-700 mb-4">
            When Americans think of Medicare billing, they picture doctors and hospitals. But the
            reality is that some of the biggest recipients of Medicare payments are corporations —
            clinical laboratories, ambulance companies, diagnostic testing facilities, and ambulatory
            surgical centers that process millions of claims annually.
          </p>
          <p className="text-gray-700 mb-4">
            Our analysis of the top 1,000 Medicare billers reveals that organizations not only
            outnumber individuals on the list but also collect significantly more per entity. The
            era of the independent physician-as-primary-biller is being eclipsed by corporate
            medicine.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Organizations vs. Individuals: The Numbers
          </h2>
        </article>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-5xl font-bold text-purple-600">545</p>
            <p className="text-lg font-medium text-gray-700 mt-2">Organizations</p>
            <p className="text-sm text-gray-500">in top 1,000 Medicare billers</p>
            <p className="text-lg font-semibold text-gray-800 mt-3">54.5% of the list</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-5xl font-bold text-blue-600">455</p>
            <p className="text-lg font-medium text-gray-700 mt-2">Individuals</p>
            <p className="text-sm text-gray-500">in top 1,000 Medicare billers</p>
            <p className="text-lg font-semibold text-gray-800 mt-3">45.5% of the list</p>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            The organizational dominance is even more pronounced at the very top. Of the 20
            highest-billing entities in Medicare, the vast majority are organizations — with
            clinical laboratories occupying most of the top spots. The single highest-billing
            entity, LabCorp&apos;s North Carolina operation, received {formatCurrency(2203741737)} over
            the analysis period.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Lab Corporation Duopoly
          </h2>
          <p className="text-gray-700 mb-4">
            Two companies dominate Medicare laboratory billing: <strong>Laboratory Corporation
            of America (LabCorp)</strong> and <strong>Quest Diagnostics</strong>. Together, their
            various state-level entities collected over <strong>{formatCurrency(labCorpTotal + questTotal)}</strong> from
            Medicare.
          </p>
          <p className="text-gray-700 mb-4">
            LabCorp appears multiple times in the top billers list because CMS tracks billing by
            NPI (National Provider Identifier), and large corporations have separate NPIs for
            different state operations. When consolidated:
          </p>

          <div className="bg-gray-50 rounded-lg p-6 not-prose mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <p className="font-semibold text-gray-900">LabCorp (consolidated)</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{formatCurrency(labCorpTotal)}</p>
                <p className="text-sm text-gray-500 mt-1">4+ state-level entities in top 1,000</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="font-semibold text-gray-900">Quest Diagnostics (consolidated)</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{formatCurrency(questTotal)}</p>
                <p className="text-sm text-gray-500 mt-1">3+ state-level entities in top 1,000</p>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            These two companies effectively form a duopoly in Medicare lab testing. They process
            hundreds of millions of tests annually — blood panels, genetic tests, cancer screenings,
            drug tests — and their scale means that even at Medicare&apos;s relatively low per-test
            reimbursement rates, the total payments are enormous.
          </p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Top 10 Organizations by Medicare Payments</h3>
            <p className="text-sm text-gray-500">Cumulative 2014–2023</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Organization</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topOrganizations.map((o) => (
                  <tr key={`${o.name}-${o.state}`} className="hover:bg-blue-50">
                    <td className="px-4 py-3 text-gray-500">{o.rank}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 text-sm">{o.name}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{o.specialty}</td>
                    <td className="px-4 py-3 text-gray-600">{o.state}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(o.payments)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Beyond Labs: The Corporate Ecosystem
          </h2>
          <p className="text-gray-700 mb-4">
            While clinical laboratories dominate, other corporate sectors are also heavily represented
            among top Medicare billers:
          </p>

          <div className="not-prose space-y-3 mb-6">
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">Ambulance Service Providers</h4>
              <p className="text-sm text-gray-600">
                Rocky Mountain Holdings, LLC collected {formatCurrency(740053925)} as an ambulance
                service. Medicare spent {formatCurrency(36399829994)} on ambulance services overall —
                making it one of the largest spending categories.
              </p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">Independent Diagnostic Testing Facilities</h4>
              <p className="text-sm text-gray-600">
                CardioNet, LLC collected {formatCurrency(662017714)} for cardiac monitoring services.
                IDTFs have a markup ratio of 11.25x — among the highest of any provider type.
              </p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">Portable X-Ray Suppliers</h4>
              <p className="text-sm text-gray-600">
                Symphony Diagnostic Services collected {formatCurrency(654634802)} providing mobile
                X-ray services to nursing homes and homebound patients.
              </p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">Ambulatory Surgical Centers</h4>
              <p className="text-sm text-gray-600">
                ASCs collectively received {formatCurrency(4298258798)} with a markup ratio of 10.34x,
                reflecting the growth of outpatient surgery centers as alternatives to hospital-based care.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Consolidation Trend
          </h2>
          <p className="text-gray-700 mb-4">
            The dominance of organizations in Medicare billing reflects a broader trend in American
            healthcare: consolidation. Over the past decade, the number of independent physician
            practices has declined sharply, while hospital-owned practices, private equity-backed
            groups, and corporate chains have expanded.
          </p>
          <p className="text-gray-700 mb-4">
            Medicare&apos;s total provider count grew from {formatNumber(938141)} in 2014 to
            {formatNumber(1175281)} in 2023 — a 25% increase. But much of this growth came from
            organizational NPIs, as corporate entities expanded their footprints. The average
            provider received {formatCurrency(79700)} per year in 2023, but organizational billing
            entities at the top received thousands of times more.
          </p>

          <div className="bg-purple-50 rounded-lg p-6 not-prose mb-6">
            <h4 className="font-semibold text-purple-900 mb-3">The Scale of Corporate Medicare</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-purple-700">$2.2B</p>
                <p className="text-sm text-purple-600">Largest single org entity</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-700">9 of 10</p>
                <p className="text-sm text-purple-600">Top orgs are clinical labs</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-700">$57.2B</p>
                <p className="text-sm text-purple-600">Clinical lab total spending</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-700">54.5%</p>
                <p className="text-sm text-purple-600">Org share of top 1,000</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Private Equity Factor
          </h2>
          <p className="text-gray-700 mb-4">
            Private equity investment in healthcare has surged in recent years, with firms acquiring
            physician practices, urgent care chains, and specialty clinics. While the Medicare data
            doesn&apos;t directly identify PE-backed entities, the pattern is visible: organizations with
            generic names, multi-state operations, and high billing volumes often have private equity
            ownership behind the scenes.
          </p>
          <p className="text-gray-700 mb-4">
            The concern is that corporate ownership may prioritize billing optimization over patient
            care — scheduling more procedures, upcoding visits, and maximizing revenue per encounter.
            The data alone can&apos;t prove this, but the trend toward organizational dominance in
            Medicare billing is unmistakable.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why This Matters</h2>
          <p className="text-gray-700 mb-4">
            The corporatization of Medicare billing has profound implications:
          </p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Market power:</strong> When two lab companies dominate testing, they have
            outsized influence over what tests are ordered and how they&apos;re priced.</li>
            <li><strong>Oversight challenges:</strong> Corporate structures with multiple NPIs across
            states make it harder for regulators to see the full picture of any single entity&apos;s
            Medicare revenue.</li>
            <li><strong>Access implications:</strong> Corporate consolidation in ambulance services,
            for example, can affect emergency response times and service quality, particularly in
            rural areas.</li>
            <li><strong>Cost pressure:</strong> While organizations achieve economies of scale, the
            savings don&apos;t always flow back to Medicare — they may instead flow to shareholders.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Related Investigations</h2>
          <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link href="/investigations/biggest-billers" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Medicare&apos;s Biggest Billers</h4>
              <p className="text-sm text-gray-500 mt-1">The top 100 providers by total payments</p>
            </Link>
            <Link href="/investigations/medicare-biggest-spenders" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Medicare&apos;s Most Expensive Doctors</h4>
              <p className="text-sm text-gray-500 mt-1">The individual providers who bill the most</p>
            </Link>
            <Link href="/investigations/markup-machine" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Markup Machine</h4>
              <p className="text-sm text-gray-500 mt-1">How charges diverge from payments across Medicare</p>
            </Link>
            <Link href="/investigations/where-medicare-dollar-goes" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Where Your Medicare Dollar Goes</h4>
              <p className="text-sm text-gray-500 mt-1">Breaking down the $854.8B spending pie</p>
            </Link>
          </div>
        </article>

        <ShareButtons
          url="https://openmedicare.vercel.app/investigations/corporate-medicine"
          title="The Rise of Corporate Medicine — OpenMedicare"
        />
        <SourceCitation />
      </div>
    </main>
  )
}
