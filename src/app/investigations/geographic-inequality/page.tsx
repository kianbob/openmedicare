import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: "ZIP Code Lottery: Why Your Medicare Costs Depend on Where You Live — OpenMedicare",
  description: 'Medicare pays $121K per provider in Florida but $18K in Puerto Rico. The same system, wildly different costs, depending on your state.',
  openGraph: {
    title: "ZIP Code Lottery: Why Your Medicare Costs Depend on Where You Live",
    description: 'Medicare per-provider payments vary by 7x across states. Where you live determines what Medicare looks like.',
  },
}

function loadStates() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'states.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { states: [] } }
}

function loadRuralUrban() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'rural-urban.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { rural_urban_summary: [] } }
}

export default function GeographicInequalityPage() {
  const statesData = loadStates()
  const ruralData = loadRuralUrban()
  const states = (statesData.states || []).filter((s: any) => s.state_name && s.state_name.length > 2)

  const byPerProvider = [...states].sort((a: any, b: any) => b.avg_payment_per_provider - a.avg_payment_per_provider)
  const byPerService = [...states].sort((a: any, b: any) => b.avg_payment_per_service - a.avg_payment_per_service)
  const byTotal = [...states].sort((a: any, b: any) => b.total_payments - a.total_payments)

  const highest = byPerProvider[0]
  const lowest = byPerProvider[byPerProvider.length - 1]
  const ratio = highest && lowest ? (highest.avg_payment_per_provider / lowest.avg_payment_per_provider) : 1

  // Rural vs urban
  const rural = (ruralData.rural_urban_summary || []).find((r: any) => r.category === 'Rural')
  const urban = (ruralData.rural_urban_summary || []).find((r: any) => r.category === 'Urban')

  // Florida stats
  const florida = states.find((s: any) => s.state === 'FL')

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'ZIP Code Lottery', href: '/investigations/geographic-inequality' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Investigation</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            ZIP Code Lottery: Why Your Medicare Costs Depend on Where You Live
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 15 min read</p>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-green-900 font-medium text-lg">Key Finding</p>
            <p className="text-green-800 mt-2">
              Medicare pays an average of <strong>{formatCurrency(highest?.avg_payment_per_provider || 0)}</strong> per
              provider in {highest?.state_name || 'the highest state'} — but just <strong>
              {formatCurrency(lowest?.avg_payment_per_provider || 0)}</strong> in {lowest?.state_name || 'the lowest'}.
              That&apos;s a <strong>{ratio.toFixed(0)}x</strong> difference within the same federal program.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Geography of Medicare Money</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6 not-prose">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">City-Level Analysis</h3>
            <p className="text-blue-800 mb-2">
              Our geographic analysis of 500 cities reveals <strong>Houston</strong> as the #1 Medicare city
              at <strong>{formatCurrency(9240000000)}</strong> in total billing — more than many entire states.
            </p>
            <div className="mt-3">
              <Link href="/geographic" className="text-blue-700 hover:underline text-sm font-medium">
                Explore the full geographic breakdown →
              </Link>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Medicare is a federal program with uniform rules. But the money flows very differently depending
            on geography. Florida, California, New Jersey, and Nevada consistently top the charts for
            per-provider payments. States with smaller, rural populations fall far behind.
          </p>
          <p className="text-gray-700 mb-4">
            This isn&apos;t just about cost of living. Florida&apos;s per-provider payments are high partly because
            of its large elderly population, but also because of its historic role as a fraud hotspot.
            Miami-Dade County has been called the &ldquo;Medicare fraud capital of America&rdquo; — a designation
            backed by decades of DOJ investigations and billion-dollar takedowns.
          </p>
        </article>

        {/* Top and bottom states */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">🔴 Highest Cost States (per provider)</h3>
            <div className="space-y-3">
              {byPerProvider.slice(0, 8).map((s: any, i: number) => (
                <div key={s.state} className="flex justify-between items-center">
                  <Link href={`/states/${s.state}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    {i + 1}. {s.state_name}
                  </Link>
                  <span className="font-bold">{formatCurrency(s.avg_payment_per_provider)}/yr avg</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">🟢 Lowest Cost States (per provider)</h3>
            <div className="space-y-3">
              {byPerProvider.slice(-8).reverse().map((s: any, i: number) => (
                <div key={s.state} className="flex justify-between items-center">
                  <Link href={`/states/${s.state}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    {i + 1}. {s.state_name}
                  </Link>
                  <span className="font-bold">{formatCurrency(s.avg_payment_per_provider)}/yr avg</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Florida Problem</h2>
          <p className="text-gray-700 mb-4">
            Florida is Medicare&apos;s second-largest market — {formatCurrency(florida?.total_payments || 0)} over the decade,
            with {formatNumber(florida?.total_providers || 0)} providers. Per provider, Florida pays
            {' '}{formatCurrency(florida?.avg_payment_per_provider || 0)} — among the highest in the nation.
          </p>
          <p className="text-gray-700 mb-4">
            Miami-Dade in particular has been a magnet for Medicare fraud schemes. Home health fraud,
            durable medical equipment scams, and compounding pharmacy schemes have all centered in South Florida.
            The DOJ&apos;s Medicare Fraud Strike Force has made Miami its primary base of operations since 2007.
          </p>
          <p className="text-gray-700 mb-4">
            It&apos;s not that every Florida provider is fraudulent — far from it. But the concentration of
            elderly residents, combined with a permissive business environment, has created conditions
            where fraud flourishes alongside legitimate care.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Rural-Urban Divide</h2>
        </article>

        {rural && urban && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 text-center">
              <p className="text-sm text-blue-600 font-medium mb-1">Urban Medicare</p>
              <p className="text-3xl font-bold text-blue-900">{formatCurrency(urban.avg_payment_per_provider)}</p>
              <p className="text-sm text-blue-700 mt-1">per provider · {formatNumber(urban.total_providers)} providers</p>
              <p className="text-sm text-blue-600 mt-2">{formatCurrency(urban.avg_payment_per_service)}/service</p>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-200 p-6 text-center">
              <p className="text-sm text-green-600 font-medium mb-1">Rural Medicare</p>
              <p className="text-3xl font-bold text-green-900">{formatCurrency(rural.avg_payment_per_provider)}</p>
              <p className="text-sm text-green-700 mt-1">per provider · {formatNumber(rural.total_providers)} providers</p>
              <p className="text-sm text-green-600 mt-2">{formatCurrency(rural.avg_payment_per_service)}/service</p>
            </div>
          </div>
        )}

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            Urban providers earn <strong>{formatCurrency((urban?.avg_payment_per_provider || 0) - (rural?.avg_payment_per_provider || 0))}</strong> more
            per provider than their rural counterparts. Urban areas also have {formatNumber((urban?.total_providers || 0) - (rural?.total_providers || 0))} more
            providers, creating a massive access gap for rural Americans.
          </p>
          <p className="text-gray-700 mb-4">
            The per-service gap tells a similar story: urban providers are paid {formatCurrency(urban?.avg_payment_per_service || 0)} per
            service compared to {formatCurrency(rural?.avg_payment_per_service || 0)} in rural areas. Rural patients
            get less access <em>and</em> their providers get paid less for the same work.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cost Per Service: A Different Map</h2>
          <p className="text-gray-700 mb-4">
            When we look at cost per service instead of per provider, the map shifts. Kansas leads with
            an average of {formatCurrency(byPerService[0]?.avg_payment_per_service || 0)} per service, while states like
            Vermont and New Hampshire pay around {formatCurrency(byPerService[byPerService.length - 1]?.avg_payment_per_service || 0)}.
            This reflects differences in the <em>types</em> of services delivered — states with more expensive
            procedures and drug administrations have higher per-service costs.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Biggest Markets</h2>
          <p className="text-gray-700 mb-4">
            In raw dollars, California ({formatCurrency(byTotal[0]?.total_payments || 0)}),
            Florida ({formatCurrency(byTotal[1]?.total_payments || 0)}), and
            Texas ({formatCurrency(byTotal[2]?.total_payments || 0)}) account for over a quarter of all Medicare
            spending. These three states alone spent more than the next seven combined.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What This Means for Patients</h2>
          <p className="text-gray-700 mb-4">
            Medicare is supposed to be a universal program. But the reality is that your ZIP code
            determines how many providers are available, how much they&apos;re paid, and how much fraud
            surrounds the system. A Medicare beneficiary in Miami lives in a completely different
            healthcare economy than one in rural Montana.
          </p>
          <p className="text-gray-700 mb-4">
            Geographic adjustment is one of Medicare&apos;s most contentious policy debates. Should rural
            providers get paid more to attract talent? Should high-cost states face more scrutiny?
            The data doesn&apos;t give easy answers — but it makes the questions unavoidable.
          </p>
        </article>

        {/* Full state table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden my-8">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-semibold text-gray-900">All States by Per-Provider Payments</h3>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Per Provider</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Per Service</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {byPerProvider.map((s: any, i: number) => (
                  <tr key={s.state} className="hover:bg-blue-50">
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2">
                      <Link href={`/states/${s.state}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        {s.state_name}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(s.avg_payment_per_provider)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(s.avg_payment_per_service)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(s.total_payments)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8">
          <ShareButtons url="https://openmedicare.vercel.app/investigations/geographic-inequality" title="ZIP Code Lottery — OpenMedicare" />
        </div>
        <SourceCitation />
      </div>
    </main>
  )
}
