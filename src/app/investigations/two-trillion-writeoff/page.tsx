import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'The $2.1 Trillion Writeoff: Why Doctors Charge 4x What They Get Paid',
  description: 'Doctors submitted $3.22 trillion in charges to Medicare over 10 years. Medicare allowed $1.09 trillion. The other $2.14 trillion — 66.3% — was simply written off.',
  openGraph: {
    title: 'The $2.1 Trillion Writeoff',
    description: 'Why doctors charge 4x what they know Medicare will pay — and where that $2.14 trillion goes.',
  },
}

function loadData() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'allowed-amounts.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { summary: {}, yearly_trends: [], specialties: [], top_procedures: [] } }
}

export default function TwoTrillionWriteoffPage() {
  const data = loadData()
  const { summary, yearly_trends, specialties } = data

  const topWriteoffSpecialties = [...(specialties || [])].sort((a: any, b: any) => b.writeoff_pct - a.writeoff_pct).slice(0, 20)
  const topChargeSpecialties = [...(specialties || [])].sort((a: any, b: any) => b.total_charged - a.total_charged).slice(0, 15)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: 'The $2.1 Trillion Writeoff', href: '/investigations/two-trillion-writeoff' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Investigation</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">The $2.1 Trillion Writeoff: Why Doctors Charge 4x What They Get Paid</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 15 min read</p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-red-900 font-medium text-lg">Key Finding</p>
            <p className="text-red-800 mt-2">Over 10 years, Medicare providers submitted <strong>{formatCurrency(summary.total_charged || 0)}</strong> in charges. Medicare allowed <strong>{formatCurrency(summary.total_allowed || 0)}</strong>. The difference — <strong>{formatCurrency(summary.writeoff_amount || 0)}</strong> — was written off. That&apos;s {summary.writeoff_pct || 66.3}% of all charges, gone.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Biggest Hidden Number in Healthcare</h2>
          <p className="text-gray-700 mb-4">There is a number so large, so absurd, that almost nobody in healthcare talks about it: <strong>{formatCurrency(summary.writeoff_amount || 0)}</strong>.</p>
          <p className="text-gray-700 mb-4">That&apos;s the total amount that Medicare providers charged but never collected over the past decade. Doctors submitted {formatCurrency(summary.total_charged || 0)} in bills. Medicare said &quot;we&apos;ll allow {formatCurrency(summary.total_allowed || 0)} of that.&quot; And then Medicare actually paid {formatCurrency(summary.total_paid || 0)}.</p>
          <p className="text-gray-700 mb-4">The math is staggering:</p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 not-prose">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Total Charges Submitted</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.total_charged || 0)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Medicare Allowed Amount</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(summary.total_allowed || 0)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Medicare Actually Paid</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(summary.total_paid || 0)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Written Off (Never Collected)</p>
                <p className="text-2xl font-bold text-red-700">{formatCurrency(summary.writeoff_amount || 0)}</p>
              </div>
            </div>
            <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Coinsurance Gap (Patient Responsibility)</p>
              <p className="text-2xl font-bold text-orange-700">{formatCurrency(summary.coinsurance_gap || 0)}</p>
              <p className="text-xs text-gray-400 mt-1">The difference between what Medicare allows and what Medicare pays — patients owe this.</p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">For every dollar providers bill Medicare, they collect about <strong>27 cents</strong>. The charge-to-paid ratio is {summary.charge_to_paid_ratio || '3.77'}x. Doctors know this. Insurance companies know this. CMS knows this. And yet the system persists.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Do Doctors Charge 4x What They Know They&apos;ll Get?</h2>
          <p className="text-gray-700 mb-4">This isn&apos;t incompetence — it&apos;s strategy. There are three key reasons providers set charges far above what Medicare pays:</p>
          <p className="text-gray-700 mb-4"><strong>1. The Fee Schedule Floor:</strong> Medicare pays based on its own fee schedule, regardless of what you charge — but if you charge <em>less</em> than the Medicare rate, you get paid your lower charge. So providers set charges high to ensure they never leave money on the table.</p>
          <p className="text-gray-700 mb-4"><strong>2. Private Insurance Benchmarking:</strong> Many private insurers negotiate rates as a percentage of Medicare or a percentage of &quot;billed charges.&quot; Higher chargemaster prices give providers leverage in these negotiations. A provider who charges $500 for a service and negotiates 60% of charges gets $300. One who charges $200 gets $120.</p>
          <p className="text-gray-700 mb-4"><strong>3. The Chargemaster Game:</strong> Hospital and practice &quot;chargemasters&quot; — the master list of prices — have been disconnected from reality for decades. Prices are set by administrative inertia, competitive positioning, and the knowledge that almost no one actually pays them. It&apos;s a fictional price list that everyone agrees to pretend is real.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Coinsurance Problem: $233 Billion on Patients</h2>
          <p className="text-gray-700 mb-4">There&apos;s a hidden casualty in this system: patients. The &quot;coinsurance gap&quot; — the difference between what Medicare allows and what Medicare actually pays — totals <strong>{formatCurrency(summary.coinsurance_gap || 0)}</strong> over the decade.</p>
          <p className="text-gray-700 mb-4">This is the amount patients are theoretically responsible for through copays, coinsurance, and deductibles. That&apos;s {summary.coinsurance_pct || 21.4}% of the allowed amount — money that comes out of seniors&apos; pockets or their supplemental insurance.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Writeoff Is Getting Worse</h2>
          <p className="text-gray-700 mb-4">The gap between charges and payments has been widening every year:</p>
        </article>

        {yearly_trends && yearly_trends.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Charges</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Allowed</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Paid</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Writeoff %</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Markup</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {yearly_trends.map((y: any) => (
                    <tr key={y.year} className="hover:bg-blue-50">
                      <td className="px-4 py-2 font-medium">{y.year}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(y.total_charged)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(y.total_allowed)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(y.total_paid)}</td>
                      <td className="px-4 py-2 text-right font-medium text-red-600">{y.writeoff_pct}%</td>
                      <td className="px-4 py-2 text-right">{y.markup_ratio}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">In 2014, providers wrote off 63.3% of charges. By 2023, it was <strong>68.1%</strong>. The markup ratio climbed from 3.47x to 3.96x. Providers are inflating charges faster than Medicare is increasing payments.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Which Specialties Write Off the Most?</h2>
          <p className="text-gray-700 mb-4">The writeoff rate varies enormously by specialty. Some specialties charge nearly 10x what they get paid:</p>
        </article>

        {topWriteoffSpecialties.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Charged</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Paid</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Writeoff %</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Charge/Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topWriteoffSpecialties.map((s: any, i: number) => (
                    <tr key={s.specialty} className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                      <td className="px-4 py-2 font-medium">{s.specialty}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(s.total_charged)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(s.total_paid)}</td>
                      <td className="px-4 py-2 text-right font-bold text-red-600">{s.writeoff_pct}%</td>
                      <td className="px-4 py-2 text-right">{s.charge_to_paid_ratio}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">Anesthesiology assistants top the list at nearly 90% writeoff — charging <strong>12.2x</strong> what Medicare pays. CRNAs, anesthesiologists, emergency medicine, ambulatory surgical centers, and radiation therapy centers all write off 80%+ of their charges.</p>
          <p className="text-gray-700 mb-4">At the other end, chiropractors write off only 30% — their charges are closest to what Medicare actually pays. Optometry (35%) and pharmacies (34%) also have relatively realistic pricing.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Biggest Charges by Specialty</h2>
          <p className="text-gray-700 mb-4">In absolute dollar terms, internal medicine leads with {formatCurrency(topChargeSpecialties[0]?.total_charged || 0)} in total charges over the decade. But the most interesting story is in the writeoff amounts:</p>
        </article>

        {topChargeSpecialties.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Charged</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Written Off</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topChargeSpecialties.map((s: any) => (
                    <tr key={s.specialty} className="hover:bg-blue-50">
                      <td className="px-4 py-2 font-medium">{s.specialty}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(s.total_charged)}</td>
                      <td className="px-4 py-2 text-right text-red-600">{formatCurrency(s.total_charged - s.total_paid)}</td>
                      <td className="px-4 py-2 text-right">{formatNumber(s.providers)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Does This Mean?</h2>
          <p className="text-gray-700 mb-4">The $2.1 trillion writeoff isn&apos;t &quot;lost money&quot; in the traditional sense — no one actually paid it. It&apos;s more like a system-wide fiction that everyone participates in:</p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Providers</strong> set high charges to maximize negotiating leverage with private insurers</li>
            <li><strong>Medicare</strong> ignores charges entirely and pays its fee schedule</li>
            <li><strong>Private insurers</strong> use the inflated charges as a benchmark for &quot;discounts&quot;</li>
            <li><strong>Patients</strong> who are uninsured or out-of-network face the full fictional price</li>
          </ul>
          <p className="text-gray-700 mb-4">The real losers are the uninsured and underinsured, who may be billed at chargemaster rates that bear no relationship to the actual cost of care. The $2.1 trillion writeoff is the clearest evidence that American healthcare pricing is fundamentally disconnected from reality.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Bottom Line</h2>
          <p className="text-gray-700 mb-4">Every year, the gap grows wider. In 2023, providers charged {formatCurrency(yearly_trends?.[yearly_trends.length - 1]?.total_charged || 0)} and collected {formatCurrency(yearly_trends?.[yearly_trends.length - 1]?.total_paid || 0)}. That&apos;s a {yearly_trends?.[yearly_trends.length - 1]?.writeoff_pct || 68}% writeoff rate — the highest on record.</p>
          <p className="text-gray-700 mb-8">Until we fix the underlying incentives that reward inflated pricing, the fictional charges will keep climbing, the writeoffs will keep growing, and the gap between what healthcare &quot;costs&quot; and what it actually costs will remain America&apos;s biggest hidden number.</p>
        </article>

        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/markup-machine" className="text-medicare-primary hover:underline text-sm">📈 The Markup Machine</Link>
            <Link href="/investigations/where-medicare-dollar-goes" className="text-medicare-primary hover:underline text-sm">💵 Where Your Dollar Goes</Link>
            <Link href="/markup" className="text-medicare-primary hover:underline text-sm">📊 Markup Analysis Data</Link>
            <Link href="/payment-gap" className="text-medicare-primary hover:underline text-sm">📊 Payment Gap Data</Link>
            <Link href="/your-medicare-dollar" className="text-medicare-primary hover:underline text-sm">💵 Your Medicare Dollar — Interactive tax breakdown</Link>
          </div>
        </div>

        <ShareButtons url="https://www.openmedicare.com/investigations/two-trillion-writeoff" title="The $2.1 Trillion Writeoff" />
        <SourceCitation />
      </div>
    </main>
  )
}
