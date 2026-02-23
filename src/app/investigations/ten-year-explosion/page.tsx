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
  title: 'Medicare\u2019s $15B Spending Surge in 10 Years',
  description: 'Medicare Part B grew 20% in a decade — from $78B to $94B — adding 237K providers. COVID crashed it, then it roared back to record highs. See where it\u2019s heading.',
  openGraph: {
    title: 'Medicare\u2019s $15B Spending Surge in 10 Years',
    description: 'Medicare Part B grew 20% in a decade — from $78B to $94B — adding 237K providers. COVID crashed it, then it roared back to record highs. See where it\u2019s heading.',
  },
}

function loadTrends() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'trends.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { yearly_trends: [] } }
}

function loadDrugSpending() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'drug-spending.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { yearly_trends: [], overall_statistics: {} } }
}

export default function TenYearExplosionPage() {
  const trends = loadTrends()
  const drugData = loadDrugSpending()
  const years = trends.yearly_trends || []
  const drugYears = drugData.yearly_trends || []

  if (years.length < 2) return <div>No trend data available</div>

  const first = years[0]
  const last = years[years.length - 1]
  const growth = last.total_payments - first.total_payments
  const growthPct = (last.total_payments / first.total_payments - 1) * 100
  const cagr = (Math.pow(last.total_payments / first.total_payments, 1 / (last.year - first.year)) - 1) * 100

  // COVID dip
  const y2019 = years.find((y: any) => y.year === 2019)
  const y2020 = years.find((y: any) => y.year === 2020)
  const covidDip = y2019 && y2020 ? ((y2020.total_payments / y2019.total_payments - 1) * 100) : 0

  // Provider growth
  const providerGrowth = last.total_providers - first.total_providers
  const providerGrowthPct = (last.total_providers / first.total_providers - 1) * 100

  // Per-provider spending change
  const perProvFirst = first.avg_payment_per_provider
  const perProvLast = last.avg_payment_per_provider
  const perProvChange = (perProvLast / perProvFirst - 1) * 100

  // Drug spending growth
  const drugFirst = drugYears.length > 0 ? drugYears[0] : null
  const drugLast = drugYears.length > 0 ? drugYears[drugYears.length - 1] : null
  const drugGrowthPct = drugFirst && drugLast ? ((drugLast.drug_payments / drugFirst.drug_payments - 1) * 100) : 0

  // 2030 projection (using CAGR)
  const projected2030 = last.total_payments * Math.pow(1 + cagr / 100, 2030 - last.year)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'The 10-Year Explosion', href: '/investigations/ten-year-explosion' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Analysis</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            The 10-Year Explosion: How Medicare Spending Grew by {formatCurrency(growth)}
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 13 min read</p>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-orange-900 font-medium text-lg">Key Finding</p>
            <p className="text-orange-800 mt-2">
              Medicare Part B physician payments grew <strong>{growthPct.toFixed(0)}%</strong> from {first.year} to {last.year}
              — from {formatCurrency(first.total_payments)} to {formatCurrency(last.total_payments)}.
              At this rate ({cagr.toFixed(1)}% CAGR), spending will reach <strong>{formatCurrency(projected2030)}</strong> by 2030.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Growth Trajectory</h2>
          <p className="text-gray-700 mb-4">
            Every year between 2014 and 2019, Medicare Part B spending crept upward. Then COVID-19 hit,
            and 2020 saw spending plummet {covidDip.toFixed(0)}% as elective procedures were cancelled and
            patients avoided doctors&apos; offices. But the recovery was swift — by 2021, spending had already
            surpassed 2019 levels. By 2023, it hit a new record.
          </p>
        </article>

        {/* Year-by-year table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden my-8">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-semibold text-gray-900">Medicare Part B Spending by Year</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">YoY Change</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Per Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {years.map((y: any, i: number) => {
                  const prevPayments = i > 0 ? years[i - 1].total_payments : y.total_payments
                  const yoyChange = i > 0 ? ((y.total_payments / prevPayments - 1) * 100) : 0
                  const isCovidDip = y.year === 2020
                  return (
                    <tr key={y.year} className={isCovidDip ? 'bg-red-50' : 'hover:bg-blue-50'}>
                      <td className="px-4 py-2 font-medium">{y.year}</td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(y.total_payments)}</td>
                      <td className={`px-4 py-2 text-right font-medium ${yoyChange < 0 ? 'text-red-600' : yoyChange > 3 ? 'text-green-600' : 'text-gray-600'}`}>
                        {i === 0 ? '—' : `${yoyChange > 0 ? '+' : ''}${yoyChange.toFixed(1)}%`}
                      </td>
                      <td className="px-4 py-2 text-right">{formatNumber(y.total_providers)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(y.avg_payment_per_provider)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The COVID Crater and Recovery</h2>
          <p className="text-gray-700 mb-4">
            The 2020 dip is the most dramatic event in modern Medicare history. Spending fell from
            {' '}{formatCurrency(y2019?.total_payments || 0)} to {formatCurrency(y2020?.total_payments || 0)} — a
            {' '}{formatCurrency(Math.abs((y2019?.total_payments || 0) - (y2020?.total_payments || 0)))} drop in a single year.
            Per-provider payments dropped to {formatCurrency(y2020?.avg_payment_per_provider || 0)}, the lowest
            in the decade.
          </p>
          <p className="text-gray-700 mb-4">
            But 2021 saw a dramatic snapback: spending surged to {formatCurrency(years.find((y: any) => y.year === 2021)?.total_payments || 0)},
            as patients returned for deferred care, telehealth became normalized, and COVID testing
            and treatment added new billing categories.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Drug Spending: The Fastest-Growing Category</h2>
          <p className="text-gray-700 mb-4">
            The real growth story in Medicare isn&apos;t office visits — it&apos;s drugs. Part B drug spending
            (physician-administered drugs like injections and infusions) grew <strong>{drugGrowthPct.toFixed(0)}%</strong> over
            the decade, from {formatCurrency(drugFirst?.drug_payments || 0)} in {drugFirst?.year} to
            {' '}{formatCurrency(drugLast?.drug_payments || 0)} in {drugLast?.year}.
          </p>
          <p className="text-gray-700 mb-4">
            Drug spending&apos;s share of total Medicare Part B jumped from
            {' '}{drugFirst?.drug_payment_share.toFixed(1)}% to {drugLast?.drug_payment_share.toFixed(1)}%.
            At this trajectory, drugs alone could account for 20%+ of Medicare physician payments by 2030.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">More Providers, Less Per Person</h2>
          <p className="text-gray-700 mb-4">
            The number of Medicare providers grew by <strong>{formatNumber(providerGrowth)}</strong> ({providerGrowthPct.toFixed(0)}%)
            over the decade — from {formatNumber(first.total_providers)} to {formatNumber(last.total_providers)}.
            But per-provider payments actually <strong>{perProvChange > 0 ? 'grew' : 'fell'} {Math.abs(perProvChange).toFixed(0)}%</strong>,
            from {formatCurrency(perProvFirst)} to {formatCurrency(perProvLast)} per year.
          </p>
          <p className="text-gray-700 mb-4">
            This means the spending growth is driven by <em>more providers entering the system</em>,
            not individual providers billing more. The pie is growing, but each slice is getting thinner.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Projecting Forward: 2030</h2>
          <p className="text-gray-700 mb-4">
            At the current compound annual growth rate of {cagr.toFixed(1)}%, Medicare Part B physician
            payments would reach <strong>{formatCurrency(projected2030)}</strong> by 2030. That&apos;s
            {' '}{formatCurrency(projected2030 - last.total_payments)} more than today.
          </p>
          <p className="text-gray-700 mb-4">
            And that&apos;s just physician payments. Total Medicare spending (Parts A, B, C, and D combined)
            is projected to exceed $1 trillion by 2030. The question isn&apos;t whether Medicare spending
            will keep growing — it&apos;s whether the growth is delivering better outcomes for the
            68 million Americans who depend on it.
          </p>
        </article>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          {[
            { label: '10-Year Growth', value: `+${growthPct.toFixed(0)}%` },
            { label: 'CAGR', value: `${cagr.toFixed(1)}%` },
            { label: 'New Providers', value: `+${formatNumber(providerGrowth)}` },
            { label: '2030 Projection', value: formatCurrency(projected2030) },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/pandemic-recovery" className="text-medicare-primary hover:underline text-sm">📈 Pandemic Recovery</Link>
            <Link href="/investigations/telehealth-explosion" className="text-medicare-primary hover:underline text-sm">📱 Telehealth Explosion</Link>
            <Link href="/trends" className="text-medicare-primary hover:underline text-sm">📊 10-Year Trends Data</Link>
            <Link href="/investigations/where-medicare-dollar-goes" className="text-medicare-primary hover:underline text-sm">💵 Where Your Dollar Goes</Link>
            <Link href="/your-medicare-dollar" className="text-medicare-primary hover:underline text-sm">🧮 Your Medicare Dollar — Interactive tax calculator</Link>
          </div>
        </div>

          <ShareButtons url="https://www.openmedicare.us/investigations/ten-year-explosion" title="The 10-Year Explosion" />
        </div>
        <SourceCitation />
      </div>
    </main>
  )
}
