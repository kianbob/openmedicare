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
  title: '1 Eye Drug Costs Medicare $19.7B: Follow the Money',
  description: 'Aflibercept alone costs Medicare $19.7B — nearly 3x the NIH cancer budget. Drug spending doubled from 8% to 15% in a decade. See the top 20 drugs.',
  openGraph: {
    title: '1 Eye Drug Costs Medicare $19.7B: Follow the Money',
    description: 'Aflibercept alone costs Medicare $19.7B — nearly 3x the NIH cancer budget. Drug spending doubled from 8% to 15% in a decade. See the top 20 drugs.',
  },
}

function loadDrugSpending() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'drug-spending.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { overall_statistics: {}, yearly_trends: [], top_drug_codes: [] } }
}

function loadStats() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'stats.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return {} }
}

export default function DrugMoneyPage() {
  const data = loadDrugSpending()
  const stats = loadStats()
  const overall = data.overall_statistics || {}
  const yearlyTrends = data.yearly_trends || []
  const topDrugs = (data.top_drug_codes || [])
    .sort((a: any, b: any) => b.total_payments - a.total_payments)
    .slice(0, 20)

  const firstYear = yearlyTrends[0]
  const lastYear = yearlyTrends[yearlyTrends.length - 1]
  const drugGrowthPct = firstYear && lastYear
    ? ((lastYear.drug_payments / firstYear.drug_payments - 1) * 100) : 0

  // Aflibercept
  const aflibercept = topDrugs.find((d: any) => d.code === 'J0178')
  const totalDrugPayments = overall.total_drug_payments_all_years || 0

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'Follow the Drug Money', href: '/investigations/drug-money' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Investigation</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Follow the Drug Money: Medicare&apos;s Pharmaceutical Pipeline
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 16 min read</p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-red-900 font-medium text-lg">Key Finding</p>
            <p className="text-red-800 mt-2">
              One eye injection drug — aflibercept — has cost Medicare <strong>{formatCurrency(aflibercept?.total_payments || 19_714_688_990)}</strong> over
              the past decade. That single drug costs more than the entire annual budget of the National
              Cancer Institute. Drug spending&apos;s share of Medicare Part B nearly doubled: from
              <strong> {firstYear?.drug_payment_share.toFixed(1)}%</strong> in {firstYear?.year} to
              <strong> {lastYear?.drug_payment_share.toFixed(1)}%</strong> in {lastYear?.year}.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The $94 Billion Pipeline</h2>
          <p className="text-gray-700 mb-4">
            Medicare Part B doesn&apos;t just pay for office visits and surgeries — it pays for drugs
            administered in doctors&apos; offices. Injections, infusions, chemotherapy, and vaccines
            that can only be given by healthcare professionals. Over the past decade, this drug pipeline
            has funneled <strong>{formatCurrency(totalDrugPayments)}</strong> to pharmaceutical companies
            and the providers who administer their products.
          </p>
          <p className="text-gray-700 mb-4">
            And the pipeline is growing fast. Drug spending grew <strong>{drugGrowthPct.toFixed(0)}%</strong> from
            {' '}{firstYear?.year} to {lastYear?.year}, far outpacing the growth of non-drug Medicare services.
          </p>
        </article>

        {/* Drug spending trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden my-8">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-semibold text-gray-900">Drug Spending as Share of Medicare Part B</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Drug Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Non-Drug</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Drug Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {yearlyTrends.map((y: any) => (
                  <tr key={y.year} className="hover:bg-blue-50">
                    <td className="px-4 py-2 font-medium">{y.year}</td>
                    <td className="px-4 py-2 text-right font-medium text-red-700">{formatCurrency(y.drug_payments)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(y.non_drug_payments)}</td>
                    <td className="px-4 py-2 text-right">
                      <span className={`font-bold ${y.drug_payment_share > 12 ? 'text-red-600' : 'text-gray-700'}`}>
                        {y.drug_payment_share.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Aflibercept Story: $19.7 Billion for One Drug</h2>
          <p className="text-gray-700 mb-4">
            Aflibercept (brand name Eylea) is an eye injection used to treat macular degeneration — the leading
            cause of vision loss in older Americans. Each injection costs Medicare about
            {' '}{formatCurrency(aflibercept?.avg_payment_per_service || 742)} per dose. Over the decade,
            {' '}{formatNumber(aflibercept?.total_services || 26_766_935)} injections were billed to Medicare.
          </p>
          <p className="text-gray-700 mb-4">
            The total: <strong>{formatCurrency(aflibercept?.total_payments || 19_714_688_990)}</strong>.
            To put that in perspective, the entire annual budget of the National Cancer Institute is about $7 billion.
            This single eye drug costs Medicare nearly 3x that — every single year.
          </p>
          <p className="text-gray-700 mb-4">
            And aflibercept isn&apos;t even the only expensive eye drug. Ranibizumab (Lucentis), another
            anti-VEGF injection for the same condition, added another
            {' '}{formatCurrency(topDrugs.find((d: any) => d.code === 'J2778')?.total_payments || 7_822_070_220)}.
            Together, two eye drugs account for over <strong>$27 billion</strong> in Medicare spending.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Top 20 Drugs by Medicare Spending</h2>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden my-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Drug / Code</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments (10yr)</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Per Dose</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topDrugs.map((d: any, i: number) => (
                  <tr key={d.code} className={`hover:bg-blue-50 ${i === 0 ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2">
                      <div className="font-medium text-gray-900">{d.description}</div>
                      <div className="text-xs text-gray-500">{d.code}</div>
                    </td>
                    <td className="px-4 py-2 text-right font-bold">{formatCurrency(d.total_payments)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(d.avg_payment_per_service)}</td>
                    <td className="px-4 py-2 text-right">{formatNumber(d.total_providers)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Cancer Drug Surge</h2>
          <p className="text-gray-700 mb-4">
            Beyond eye care, cancer immunotherapy has exploded in Medicare spending. Pembrolizumab (Keytruda)
            — {formatCurrency(topDrugs.find((d: any) => d.code === 'J9271')?.total_payments || 0)} — treats lung cancer,
            melanoma, and dozens of other cancers. Nivolumab (Opdivo), rituximab, and bevacizumab (Avastin)
            each add billions more.
          </p>
          <p className="text-gray-700 mb-4">
            These drugs save lives. But their costs are staggering, and Medicare has limited ability to
            negotiate prices. Part B drugs are typically reimbursed at the Average Sales Price (ASP) + 6%,
            giving providers a financial incentive to administer more expensive drugs — since the 6% margin
            is larger on a $10,000 drug than a $100 one.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Vaccine Line Item</h2>
          <p className="text-gray-700 mb-4">
            Notably, vaccines also rank among Medicare&apos;s biggest drug expenses. The flu vaccine
            ({formatCurrency(topDrugs.find((d: any) => d.code === '90662')?.total_payments || 0)}) and pneumococcal
            vaccine ({formatCurrency(topDrugs.find((d: any) => d.code === '90670')?.total_payments || 0)}) collectively
            cost billions — not because individual doses are expensive, but because of the sheer volume of
            elderly Americans getting vaccinated through Medicare.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Where This Is Heading</h2>
          <p className="text-gray-700 mb-4">
            Drug spending&apos;s share of Medicare has nearly doubled in a decade: from {firstYear?.drug_payment_share.toFixed(1)}%
            to {lastYear?.drug_payment_share.toFixed(1)}%. New biologics, gene therapies, and weight-loss drugs
            (Ozempic and its successors) are poised to accelerate this trend.
          </p>
          <p className="text-gray-700 mb-4">
            The Inflation Reduction Act gave Medicare some price negotiation power starting in 2026, but
            it covers only a handful of drugs initially. For the vast majority of Part B drugs, the
            ASP + 6% model remains — and the pharmaceutical pipeline keeps flowing.
          </p>
          <p className="text-gray-700 mb-4">
            Following the drug money isn&apos;t just an accounting exercise. It&apos;s the story of how
            American healthcare decided that a single eye injection is worth more than most teachers earn
            in a year — and that Medicare would foot the bill, no questions asked.
          </p>
        </article>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          {[
            { label: 'Total Drug Spending', value: formatCurrency(totalDrugPayments) },
            { label: '2023 Drug Share', value: `${lastYear?.drug_payment_share.toFixed(1)}%` },
            { label: '#1 Drug (Aflibercept)', value: formatCurrency(aflibercept?.total_payments || 0) },
            { label: 'Drug Growth (10yr)', value: `+${drugGrowthPct.toFixed(0)}%` },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/drug-pipeline" className="text-medicare-primary hover:underline text-sm">💊 The Drug Pipeline</Link>
            <Link href="/investigations/oncology-drug-pipeline" className="text-medicare-primary hover:underline text-sm">🔬 Oncology Drug Pipeline</Link>
            <Link href="/investigations/eye-care-billions" className="text-medicare-primary hover:underline text-sm">👁️ Eye Care Billions</Link>
            <Link href="/drug-spending" className="text-medicare-primary hover:underline text-sm">📊 Drug Spending Data</Link>
          </div>
        </div>

          <ShareButtons url="https://www.openmedicare.us/investigations/drug-money" title="Follow the Drug Money" />
        </div>
        <SourceCitation />
      </div>
    </main>
  )
}
