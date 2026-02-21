import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'Medicare Spending by State: A Complete Breakdown',
  description: 'Full state-by-state breakdown of Medicare spending. California leads with $93B total, but Florida leads per-provider at $121K. Sortable table of all 54 states and territories.',
  keywords: ['medicare spending by state', 'medicare costs by state', 'medicare payments by state', 'state medicare spending', 'medicare state comparison'],
  openGraph: {
    title: 'Medicare Spending by State: A Complete Breakdown',
    description: 'Every state ranked by total Medicare spending, per-provider payments, and markup ratios.',
  },
  alternates: {
    canonical: '/investigations/medicare-spending-by-state',
  },
}

function loadStates() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'states.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { states: [] } }
}

export default function MedicareSpendingByStatePage() {
  const data = loadStates()
  const allStates = (data.states || [])
  const totalPayments = allStates.reduce((s: number, x: any) => s + x.total_payments, 0)
  const totalProviders = allStates.reduce((s: number, x: any) => s + x.total_providers, 0)

  const byTotal = [...allStates].sort((a: any, b: any) => b.total_payments - a.total_payments)
  const byPerProvider = [...allStates].sort((a: any, b: any) => b.avg_payment_per_provider - a.avg_payment_per_provider)

  const top5Total = byTotal.slice(0, 5)
  const top5PerProvider = byPerProvider.slice(0, 5)
  const bottom5PerProvider = [...byPerProvider].reverse().slice(0, 5)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'Medicare Spending by State' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Analysis</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Medicare Spending by State: A Complete Breakdown
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 12 min read</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">Key Finding</p>
            <p className="text-blue-800 mt-2">
              Medicare spending varies dramatically by state. <strong>{byTotal[0]?.state_name || byTotal[0]?.state}</strong> leads
              in total spending at <strong>{formatCurrency(byTotal[0]?.total_payments || 0)}</strong>, while <strong>{byPerProvider[0]?.state_name || byPerProvider[0]?.state}</strong> leads
              in per-provider spending at <strong>{formatCurrency(byPerProvider[0]?.avg_payment_per_provider || 0)}</strong> per provider.
              The gap between the highest and lowest per-provider spending is more than <strong>7x</strong>.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Big Picture</h2>
          <p className="text-gray-700 mb-4">
            Across all {formatNumber(allStates.length)} states and territories, Medicare paid a total of <strong>{formatCurrency(totalPayments)}</strong> to <strong>{formatNumber(totalProviders)}</strong> providers
            between 2014 and 2023. But that spending is far from evenly distributed.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Top 5 States by Total Spending</h3>
          <div className="overflow-x-auto not-prose mb-6">
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Per Provider</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {top5Total.map((s: any, i: number) => (
                  <tr key={s.state} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={`/states/${s.state}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        {s.state_name || s.state}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-bold">{formatCurrency(s.total_payments)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatNumber(s.total_providers)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(s.avg_payment_per_provider)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{(s.total_payments / totalPayments * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Florida Punches Above Its Weight</h2>
          <p className="text-gray-700 mb-4">
            Florida consistently ranks among the top states for Medicare spending — both total and per-provider.
            Several factors drive this:
          </p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Demographics:</strong> Florida has the second-highest share of residents aged 65+ in the nation, creating a massive Medicare-eligible population.</li>
            <li><strong>Provider density:</strong> South Florida, particularly Miami-Dade, has an exceptionally high concentration of Medicare providers.</li>
            <li><strong>Fraud hotspot:</strong> The DOJ has consistently identified South Florida as a Medicare fraud epicenter, with billing patterns that inflate per-provider averages.</li>
            <li><strong>Specialty mix:</strong> Florida has a higher proportion of high-billing specialties like ophthalmology and cardiology.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Highest Per-Provider Spending</h2>
          <p className="text-gray-700 mb-4">
            Total spending is influenced by state size. Per-provider spending better reveals where Medicare
            dollars are most concentrated:
          </p>
          <div className="overflow-x-auto not-prose mb-6">
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Per Provider</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Markup Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {top5PerProvider.map((s: any, i: number) => (
                  <tr key={s.state} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={`/states/${s.state}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        {s.state_name || s.state}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-bold">{formatCurrency(s.avg_payment_per_provider)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(s.total_payments)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${s.markup_ratio > 4 ? 'text-red-600' : s.markup_ratio > 3 ? 'text-orange-600' : 'text-gray-700'}`}>
                        {s.markup_ratio?.toFixed(1)}x
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Lowest Per-Provider Spending</h2>
          <div className="overflow-x-auto not-prose mb-6">
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Per Provider</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bottom5PerProvider.map((s: any, i: number) => (
                  <tr key={s.state} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3">
                      <Link href={`/states/${s.state}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        {s.state_name || s.state}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-bold">{formatCurrency(s.avg_payment_per_provider)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatNumber(s.total_providers)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Complete State Rankings</h2>
          <p className="text-gray-700 mb-4">
            Here&apos;s every state and territory ranked by total Medicare payments:
          </p>
          <div className="overflow-x-auto not-prose mb-8">
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700">#</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700">State</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-700">Total Payments</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-700">Providers</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-700">Per Provider</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-700">Services</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-700">Markup</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {byTotal.map((s: any, i: number) => (
                  <tr key={s.state} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-3 py-2">
                      <Link href={`/states/${s.state}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        {s.state_name || s.state}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(s.total_payments)}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{formatNumber(s.total_providers)}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{formatCurrency(s.avg_payment_per_provider)}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{formatNumber(s.total_services)}</td>
                    <td className="px-3 py-2 text-right">
                      <span className={`font-medium ${s.markup_ratio > 4 ? 'text-red-600' : s.markup_ratio > 3 ? 'text-orange-600' : 'text-gray-700'}`}>
                        {s.markup_ratio?.toFixed(1)}x
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Regional Patterns</h2>
          <p className="text-gray-700 mb-4">
            Medicare spending follows clear regional patterns:
          </p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Sun Belt dominance:</strong> Florida, Texas, and California account for a disproportionate share of spending, driven by large retiree populations.</li>
            <li><strong>Northeast concentration:</strong> New York, Pennsylvania, and New Jersey have high total spending and above-average per-provider payments.</li>
            <li><strong>Rural states lag:</strong> States with more rural populations tend to have lower per-provider spending, partly reflecting fewer high-cost specialists and lower fee schedule adjustments.</li>
            <li><strong>Territories at the bottom:</strong> U.S. territories (Puerto Rico, Virgin Islands, Guam) consistently show the lowest per-provider Medicare payments, reflecting different coverage dynamics and provider economics.</li>
          </ul>

          <p className="text-gray-700 mb-4">
            <Link href="/investigations/geographic-inequality" className="text-blue-600 hover:text-blue-800">
              Read more: ZIP Code Lottery — Why Your Medicare Costs Depend on Where You Live →
            </Link>
          </p>

          <div className="border-t border-gray-200 mt-12 pt-8 not-prose">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/states" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">Browse All States</div>
                <div className="text-sm text-gray-500">Detailed profiles for every state</div>
              </Link>
              <Link href="/investigations/geographic-inequality" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">ZIP Code Lottery</div>
                <div className="text-sm text-gray-500">A 7x gap across states</div>
              </Link>
              <Link href="/investigations/state-spending-divide" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">The State Spending Divide</div>
                <div className="text-sm text-gray-500">Why Medicare costs vary across state lines</div>
              </Link>
              <Link href="/investigations/rural-price-tag" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">Rural Healthcare&apos;s Price Tag</div>
                <div className="text-sm text-gray-500">Medicare pays more in rural America</div>
              </Link>
            </div>
          </div>
        </article>

        {/* Related Investigations */}
        <div className="bg-gray-50 rounded-xl p-6 mt-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/state-spending-divide" className="text-medicare-primary hover:underline text-sm">📊 The State Spending Divide</Link>
            <Link href="/investigations/geographic-inequality" className="text-medicare-primary hover:underline text-sm">📍 ZIP Code Lottery</Link>
            <Link href="/investigations/rural-price-tag" className="text-medicare-primary hover:underline text-sm">🌾 The Rural Price Tag</Link>
            <Link href="/states" className="text-medicare-primary hover:underline text-sm">📍 Browse All States</Link>
          </div>
        </div>

        <div className="mt-8">
          <ShareButtons
            url="/investigations/medicare-spending-by-state"
            title="Medicare Spending by State: A Complete Breakdown"
            description="Every state ranked by Medicare spending, providers, and per-provider payments."
          />
        </div>

        <SourceCitation
          lastUpdated="February 2026 (data through 2023)"
          sources={[
            'CMS Medicare Provider Utilization and Payment Data (2014-2023)',
            'CMS Geographic Variation Public Use File',
          ]}
        />
      </div>
    </main>
  )
}
