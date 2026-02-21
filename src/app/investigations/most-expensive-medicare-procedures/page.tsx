import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: 'The Most Expensive Medicare Procedures in 2023',
  description: 'Top 20 most expensive Medicare procedures by total payments and average cost per service. From office visits to aflibercept injections and chemotherapy.',
  keywords: ['most expensive medicare procedures', 'medicare procedure costs', 'expensive medical procedures medicare', 'medicare billing codes', 'HCPCS codes medicare'],
  openGraph: {
    title: 'The Most Expensive Medicare Procedures in 2023',
    description: 'Office visits dominate by volume, but what actually costs the most? The data tells a surprising story.',
  },
  alternates: {
    canonical: '/investigations/most-expensive-medicare-procedures',
  },
}

function loadProcedures() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'procedures.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { procedures: [] } }
}

export default function MostExpensiveProceduresPage() {
  const data = loadProcedures()
  const allProcs = data.procedures || []
  const totalPayments = allProcs.reduce((s: number, x: any) => s + x.total_payments, 0)

  // Top 20 by total payments
  const byTotalPayments = [...allProcs]
    .sort((a: any, b: any) => b.total_payments - a.total_payments)
    .slice(0, 20)

  // Top 20 by avg payment per service (min 1000 providers to exclude rare procedures)
  const byAvgCost = [...allProcs]
    .filter((p: any) => p.total_providers >= 1000)
    .sort((a: any, b: any) => b.avg_payment_per_service - a.avg_payment_per_service)
    .slice(0, 20)

  // Drug vs non-drug breakdown
  const drugProcs = allProcs.filter((p: any) => p.is_drug)
  const nonDrugProcs = allProcs.filter((p: any) => !p.is_drug)
  const drugTotal = drugProcs.reduce((s: number, x: any) => s + x.total_payments, 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'Most Expensive Medicare Procedures' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Analysis</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            The Most Expensive Medicare Procedures in 2023
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 10 min read</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">Key Finding</p>
            <p className="text-blue-800 mt-2">
              Office visits (99214) are Medicare&apos;s most expensive procedure by total spending at <strong>{formatCurrency(byTotalPayments[0]?.total_payments || 0)}</strong> over
              10 years. But the most expensive procedures <em>per service</em> are drug injections and complex surgeries
              costing thousands per administration.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Top 20 by Total Medicare Payments</h2>
          <p className="text-gray-700 mb-4">
            These are the 20 procedure codes that have cost Medicare the most over the past decade (2014-2023).
            Volume matters: a $73 office visit performed nearly a billion times outspends a $1,800 injection.
          </p>

          <div className="overflow-x-auto not-prose mb-8">
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700">#</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700">Code</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700">Description</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-700">Total Payments</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-700">Avg/Service</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-700">Services</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {byTotalPayments.map((p: any, i: number) => (
                  <tr key={p.code} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-3 py-2">
                      <Link href={`/procedures/${p.code}`} className="text-blue-600 hover:text-blue-800 font-mono font-medium">
                        {p.is_drug && <span title="Drug">💊 </span>}{p.code}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-gray-600 max-w-xs truncate">{p.description}</td>
                    <td className="px-3 py-2 text-right font-bold">{formatCurrency(p.total_payments)}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{formatCurrency(p.avg_payment_per_service)}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{formatNumber(p.total_services)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Volume vs. Unit Cost: Two Different Stories</h2>
          <p className="text-gray-700 mb-4">
            The total payments table is dominated by office visits and evaluation codes — services performed
            hundreds of millions of times. But if you sort by <em>cost per service</em>, the picture changes
            dramatically. The most expensive individual services are drug injections, chemotherapy administrations,
            and complex surgical procedures.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Top 20 by Average Cost Per Service</h2>
          <p className="text-gray-700 mb-4">
            These are the most expensive procedures on a per-service basis (minimum 1,000 providers to exclude rare one-off codes):
          </p>

          <div className="overflow-x-auto not-prose mb-8">
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700">#</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700">Code</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700">Description</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-700">Avg/Service</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-700">Total Payments</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-700">Providers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {byAvgCost.map((p: any, i: number) => (
                  <tr key={p.code} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-3 py-2">
                      <Link href={`/procedures/${p.code}`} className="text-blue-600 hover:text-blue-800 font-mono font-medium">
                        {p.is_drug && <span title="Drug">💊 </span>}{p.code}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-gray-600 max-w-xs truncate">{p.description}</td>
                    <td className="px-3 py-2 text-right font-bold">{formatCurrency(p.avg_payment_per_service)}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{formatCurrency(p.total_payments)}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{formatNumber(p.total_providers)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Drug Factor</h2>
          <p className="text-gray-700 mb-4">
            Physician-administered drugs (Part B drugs) account for <strong>{formatCurrency(drugTotal)}</strong> of
            total Medicare procedure spending ({(drugTotal / totalPayments * 100).toFixed(1)}%). These are drugs
            given in a doctor&apos;s office or outpatient setting — not prescriptions you fill at a pharmacy.
          </p>
          <p className="text-gray-700 mb-4">
            The biggest single drug by Medicare spending is <strong>aflibercept</strong> (Eylea), an eye injection
            used to treat macular degeneration. At roughly $1,850 per injection, administered every 4-8 weeks,
            it has cost Medicare billions. Ophthalmologists who administer it receive both the drug cost and an
            administration fee.
          </p>
          <p className="text-gray-700 mb-4">
            Other high-cost Part B drugs include chemotherapy agents (pembrolizumab, nivolumab), rheumatoid arthritis
            biologics (infliximab), and osteoporosis treatments (denosumab).
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/investigations/drug-money" className="text-blue-600 hover:text-blue-800">
              Read more: Follow the Drug Money →
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Office Visit Economy</h2>
          <p className="text-gray-700 mb-4">
            Despite all the attention on expensive drugs and procedures, the humble office visit remains Medicare&apos;s
            single largest cost center. Code 99214 (established patient visit, ~25 minutes) alone accounts
            for <strong>{formatCurrency(byTotalPayments[0]?.total_payments || 0)}</strong> — more than any drug,
            surgery, or imaging code.
          </p>
          <p className="text-gray-700 mb-4">
            This reflects the sheer scale of primary care: nearly a billion 99214 visits over 10 years. The average
            payment of about $73 per visit seems modest, but multiplied by volume, it dwarfs most individual
            high-cost procedures.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/investigations/office-visit-economy" className="text-blue-600 hover:text-blue-800">
              Read more: The Office Visit Economy →
            </Link>
          </p>

          <div className="border-t border-gray-200 mt-12 pt-8 not-prose">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/procedures" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">Browse All Procedures</div>
                <div className="text-sm text-gray-500">Payment data for every Medicare procedure code</div>
              </Link>
              <Link href="/investigations/drug-money" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">Follow the Drug Money</div>
                <div className="text-sm text-gray-500">$94B pharmaceutical pipeline</div>
              </Link>
              <Link href="/investigations/eye-care-billions" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">Eye Care Billions</div>
                <div className="text-sm text-gray-500">Ophthalmology&apos;s outsized Medicare share</div>
              </Link>
              <Link href="/investigations/office-visit-economy" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">The Office Visit Economy</div>
                <div className="text-sm text-gray-500">Medicare&apos;s bread and butter</div>
              </Link>
            </div>
          </div>
        </article>

        {/* Related Investigations */}
        <div className="bg-gray-50 rounded-xl p-6 mt-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/office-visit-economy" className="text-medicare-primary hover:underline text-sm">🏢 The $117B Office Visit Economy</Link>
            <Link href="/investigations/drug-money" className="text-medicare-primary hover:underline text-sm">💊 Follow the Drug Money</Link>
            <Link href="/investigations/eye-care-billions" className="text-medicare-primary hover:underline text-sm">👁️ The Billion-Dollar Eye Care Industry</Link>
            <Link href="/procedures" className="text-medicare-primary hover:underline text-sm">📋 Browse All Procedures</Link>
          </div>
        </div>

        <div className="mt-8">
          <ShareButtons
            url="/investigations/most-expensive-medicare-procedures"
            title="The Most Expensive Medicare Procedures in 2023"
            description="Office visits dominate by volume, but drug injections cost thousands per service."
          />
        </div>

        <SourceCitation
          lastUpdated="February 2026 (data through 2023)"
          sources={[
            'CMS Medicare Provider Utilization and Payment Data (2014-2023)',
            'Medicare Physician Fee Schedule (MPFS)',
            'CMS Part B Drug Spending Dashboard',
          ]}
        />
      </div>
    </main>
  )
}
