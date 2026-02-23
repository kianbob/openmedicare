'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { TrendChart } from '@/components/Charts'
import { formatCurrency, formatNumber } from '@/lib/format'

interface YearData {
  year: number
  total_payments: number
  total_services: number
  total_providers: number
  total_beneficiaries: number
  total_submitted_charges: number
  avg_payment_per_service: number
  avg_payment_per_provider: number
  avg_services_per_provider: number
  avg_beneficiaries_per_provider: number
  markup_ratio: number
  total_payments_change: number
  total_services_change: number
  total_providers_change: number
}

export default function TrendsPage() {
  const [data, setData] = useState<YearData[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    fetch('/data/trends.json')
      .then(r => r.json())
      .then(d => { setData(d.yearly_trends || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (!mounted || loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading trends...</div>
  if (!data.length) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">No data available</div>

  const latest = data[data.length - 1]
  const earliest = data[0]
  const growth = ((latest.total_payments / earliest.total_payments - 1) * 100).toFixed(1)
  const cagr = ((Math.pow(latest.total_payments / earliest.total_payments, 1 / (latest.year - earliest.year)) - 1) * 100).toFixed(1)
  const covidYear = data.find(y => y.year === 2020)
  const preCovidYear = data.find(y => y.year === 2019)
  const covidDip = covidYear && preCovidYear ? ((covidYear.total_payments / preCovidYear.total_payments - 1) * 100).toFixed(1) : null
  const postCovid = data.find(y => y.year === 2021)
  const postCovidRebound = postCovid && covidYear ? ((postCovid.total_payments / covidYear.total_payments - 1) * 100).toFixed(1) : null

  // Find fastest growing year
  const fastestYear = data.reduce((best, y) => y.total_payments_change > (best?.total_payments_change || 0) ? y : best, data[0])

  // Spending per capita (per beneficiary)
  const perCapitaData = data.map(y => ({
    year: y.year,
    value: Math.round(y.total_payments / y.total_beneficiaries * 100) / 100
  }))
  const latestPerCapita = perCapitaData[perCapitaData.length - 1]?.value || 0
  const earliestPerCapita = perCapitaData[0]?.value || 0
  const perCapitaGrowth = ((latestPerCapita / earliestPerCapita - 1) * 100).toFixed(1)

  // Services per provider
  const servicesPerProviderData = data.map(y => ({
    year: y.year,
    value: Math.round(y.avg_services_per_provider)
  }))

  // Cost per service
  const costPerServiceData = data.map(y => ({
    year: y.year,
    value: Math.round(y.avg_payment_per_service * 100) / 100
  }))

  // Markup ratio
  const markupData = data.map(y => ({
    year: y.year,
    value: Math.round(y.markup_ratio * 100) / 100
  }))

  // Total 10-year spending
  const totalDecadeSpending = data.reduce((sum, y) => sum + y.total_payments, 0)

  // Provider growth
  const providerGrowth = ((latest.total_providers / earliest.total_providers - 1) * 100).toFixed(1)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Spending Trends', href: '/trends' }]} />

        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">A Decade of Medicare Spending: 2014–2023</h1>
          <p className="text-lg text-gray-600">$854.8 billion in provider payments. Ten years of data. One story of relentless growth, a pandemic shock, and a system under pressure.</p>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Decade Spending', value: formatCurrency(totalDecadeSpending), sub: `${earliest.year}–${latest.year}`, color: 'text-blue-600' },
            { label: '10-Year Growth', value: `${growth}%`, sub: `${cagr}% CAGR`, color: 'text-green-600' },
            { label: 'COVID Impact', value: `${covidDip}%`, sub: '2020 year-over-year', color: 'text-red-600' },
            { label: 'Fastest Year', value: `+${fastestYear.total_payments_change}%`, sub: `${fastestYear.year}`, color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500 mb-1">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Editorial Intro */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg leading-relaxed">
              Medicare spending grew <strong>{growth}%</strong> over the decade — from {formatCurrency(earliest.total_payments)} in {earliest.year} to {formatCurrency(latest.total_payments)} in {latest.year}. But the growth wasn&apos;t steady. After years of gradual 2-3% annual increases, the COVID-19 pandemic caused an unprecedented <strong>{covidDip}% drop in 2020</strong> as patients avoided hospitals and elective procedures were postponed. The recovery was sharp: spending surged <strong>{postCovidRebound}% in 2021</strong>, blowing past pre-pandemic levels. By 2023, Medicare was paying out nearly $94 billion annually to providers — and the trajectory shows no signs of slowing.
            </p>
          </div>
        </div>

        {/* ═══════════ CHART 1: Total Payments ═══════════ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Total Medicare Payments by Year</h2>
          <p className="text-gray-500 mb-4">Annual provider payments, billions USD</p>
          <TrendChart xDataKey="year" yDataKey="value" data={data.map(y => ({ year: y.year, value: y.total_payments }))} />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <p className="text-amber-800">
            📉 <strong>2020 stands alone as the only decline in the entire dataset.</strong> Elective procedures ground to a halt. Millions of patients delayed care. But the rebound was even more dramatic — 2021 saw the largest single-year increase at +{postCovidRebound}%, driven by pent-up demand, new COVID treatments, and catch-up procedures.
          </p>
        </div>

        {/* ═══════════ CHART 2: Provider Count ═══════════ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Provider Count Over Time</h2>
          <p className="text-gray-500 mb-4">Number of unique providers billing Medicare each year</p>
          <TrendChart xDataKey="year" yDataKey="value" data={data.map(y => ({ year: y.year, value: y.total_providers }))} />
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8">
          <p className="text-green-800">
            👨‍⚕️ <strong>The provider pool grew {providerGrowth}% — from {formatNumber(earliest.total_providers)} to {formatNumber(latest.total_providers)}.</strong> The rise of nurse practitioners, physician assistants, and telehealth providers has accelerated this trend. More providers billing Medicare means more access — but also more spending pressure.
          </p>
        </div>

        {/* ═══════════ CHART 3: Spending Per Beneficiary ═══════════ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Spending Per Beneficiary</h2>
          <p className="text-gray-500 mb-4">Total payments divided by total beneficiaries served — a rough &quot;per capita&quot; measure</p>
          <TrendChart xDataKey="year" yDataKey="value" data={perCapitaData} />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
          <p className="text-blue-800">
            💰 <strong>Per-beneficiary spending grew {perCapitaGrowth}% over the decade</strong> — from {formatCurrency(earliestPerCapita)} to {formatCurrency(latestPerCapita)}. This metric controls for the growing number of beneficiaries and reveals the true cost pressure: even per person, Medicare is spending more every year.
          </p>
        </div>

        {/* ═══════════ CHART 4: Services Per Provider ═══════════ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Services Per Provider</h2>
          <p className="text-gray-500 mb-4">Average number of services billed per provider per year</p>
          <TrendChart xDataKey="year" yDataKey="value" data={servicesPerProviderData} />
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-8">
          <p className="text-purple-800">
            📊 <strong>Services per provider have actually declined slightly</strong> — from {formatNumber(servicesPerProviderData[0]?.value)} to {formatNumber(servicesPerProviderData[servicesPerProviderData.length - 1]?.value)}. As more providers enter the system, the workload is spreading thinner per provider. This could reflect specialization, part-time billing, or the influx of mid-level practitioners.
          </p>
        </div>

        {/* ═══════════ CHART 5: Cost Per Service ═══════════ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Average Cost Per Service</h2>
          <p className="text-gray-500 mb-4">What Medicare pays, on average, for each individual service</p>
          <TrendChart xDataKey="year" yDataKey="value" data={costPerServiceData} />
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-8">
          <p className="text-orange-800">
            🏷️ <strong>The cost per service rose from {formatCurrency(costPerServiceData[0]?.value)} to {formatCurrency(costPerServiceData[costPerServiceData.length - 1]?.value)}.</strong> Even as volume fluctuates, the price of each service keeps climbing. This reflects fee schedule updates, shift toward higher-complexity codes, and the growing prevalence of expensive treatments.
          </p>
        </div>

        {/* ═══════════ CHART 6: Markup Ratio ═══════════ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Markup Ratio: Charges vs. Payments</h2>
          <p className="text-gray-500 mb-4">How much providers charge relative to what Medicare actually pays (higher = bigger gap)</p>
          <TrendChart xDataKey="year" yDataKey="value" data={markupData} />
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8">
          <p className="text-red-800">
            🔴 <strong>The markup ratio grew from {markupData[0]?.value}x to {markupData[markupData.length - 1]?.value}x.</strong> Providers are charging increasingly more relative to what Medicare pays. This widening gap signals growing tension between provider expectations and government reimbursement rates — a key driver of the access crisis in Medicare.
          </p>
        </div>

        {/* Year-by-Year Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Year-by-Year Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                  <th className="px-3 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  <th className="px-3 py-3 text-right text-sm font-semibold text-gray-700">YoY Change</th>
                  <th className="px-3 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  <th className="px-3 py-3 text-right text-sm font-semibold text-gray-700">Services</th>
                  <th className="px-3 py-3 text-right text-sm font-semibold text-gray-700">$/Service</th>
                  <th className="px-3 py-3 text-right text-sm font-semibold text-gray-700">$/Beneficiary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((y, i) => (
                  <tr key={y.year} className={`hover:bg-blue-50 ${y.year === 2020 ? 'bg-red-50' : y.year === 2021 ? 'bg-green-50' : ''}`}>
                    <td className="px-3 py-2 font-medium">{y.year}</td>
                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(y.total_payments)}</td>
                    <td className={`px-3 py-2 text-right font-medium ${y.total_payments_change < 0 ? 'text-red-600' : y.total_payments_change > 5 ? 'text-green-600' : 'text-gray-600'}`}>
                      {i === 0 ? '—' : `${y.total_payments_change > 0 ? '+' : ''}${y.total_payments_change}%`}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">{formatNumber(y.total_providers)}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{formatNumber(y.total_services)}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{formatCurrency(y.avg_payment_per_service)}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{formatCurrency(y.total_payments / y.total_beneficiaries)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Key Takeaways</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-1">🚀 Relentless Growth</h3>
              <p className="text-blue-100">Medicare spending grew {growth}% over the decade. Even accounting for the COVID dip, the trend is unmistakably upward with a {cagr}% compound annual growth rate.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-1">🦠 COVID Was a Blip</h3>
              <p className="text-blue-100">The 2020 dip ({covidDip}%) was fully recovered by 2021 (+{postCovidRebound}%). The pandemic didn&apos;t slow Medicare spending — it just delayed it.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-1">💸 Price Over Volume</h3>
              <p className="text-blue-100">While services per provider dropped, cost per service rose steadily. Medicare is paying more per service, not just doing more services.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-1">📈 Markup Widening</h3>
              <p className="text-blue-100">The gap between what providers charge and what Medicare pays has grown from {markupData[0]?.value}x to {markupData[markupData.length - 1]?.value}x — a growing source of friction.</p>
            </div>
          </div>
        </div>

        {/* Explore More */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Go Deeper</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/fastest-growing" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">🔥 Fastest Growing</h4>
              <p className="text-sm text-gray-500 mt-1">Which specialties and states saw the biggest spending increases</p>
            </Link>
            <Link href="/drug-spending" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Drug Spending</h4>
              <p className="text-sm text-gray-500 mt-1">How prescription drugs are driving Medicare costs higher</p>
            </Link>
            <Link href="/rural-urban" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Rural vs Urban</h4>
              <p className="text-sm text-gray-500 mt-1">The geographic divide in Medicare spending and access</p>
            </Link>
            <Link href="/place-of-service" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Place of Service</h4>
              <p className="text-sm text-gray-500 mt-1">Why the same procedure costs more at a hospital</p>
            </Link>
            <Link href="/markup" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Markup Analysis</h4>
              <p className="text-sm text-gray-500 mt-1">The gap between what doctors charge and what Medicare pays</p>
            </Link>
            <Link href="/fraud" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Fraud Detection</h4>
              <p className="text-sm text-gray-500 mt-1">AI analysis of 500+ suspicious billing patterns</p>
            </Link>
          </div>
        </div>

        <SourceCitation />
      </div>
    </main>
  )
}
