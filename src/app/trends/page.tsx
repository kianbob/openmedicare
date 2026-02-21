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
  total_submitted_charges: number
  avg_payment_per_service: number
}

export default function TrendsPage() {
  const [data, setData] = useState<YearData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/trends.json')
      .then(r => r.json())
      .then(d => { setData(d.yearly_trends || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading trends...</div>

  const latest = data[data.length - 1]
  const earliest = data[0]
  const growth = latest && earliest ? ((latest.total_payments / earliest.total_payments - 1) * 100).toFixed(1) : '0'
  const covidYear = data.find(y => y.year === 2020)
  const preCovidYear = data.find(y => y.year === 2019)
  const covidDip = covidYear && preCovidYear ? ((covidYear.total_payments / preCovidYear.total_payments - 1) * 100).toFixed(1) : null

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Spending Trends', href: '/trends' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Medicare Spending Trends</h1>
          <p className="text-lg text-gray-600">A decade of Medicare provider payments — from {earliest?.year} to {latest?.year}.</p>
        </div>

        {/* Editorial Intro */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="prose max-w-none text-gray-700">
            <p>Medicare spending grew {growth}% over the decade, but the growth wasn&apos;t steady. After years of gradual increases, the COVID-19 pandemic caused an unprecedented drop in 2020 as patients avoided hospitals and elective procedures were postponed. The recovery that followed was sharp — spending surged past pre-pandemic levels, driven by pent-up demand, new high-cost treatments, and an aging population. Understanding these trends is essential to forecasting Medicare&apos;s future fiscal trajectory.</p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { name: `Total (${latest?.year})`, value: formatCurrency(latest?.total_payments || 0), color: 'blue' },
            { name: '10-Year Growth', value: `${growth}%`, color: 'green' },
            { name: 'COVID Impact (2020)', value: covidDip ? `${covidDip}%` : 'N/A', color: 'red' },
            { name: `Providers (${latest?.year})`, value: formatNumber(latest?.total_providers || 0), color: 'purple' },
          ].map(s => (
            <div key={s.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500 mb-1">{s.name}</div>
              <div className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Payment Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Total Medicare Payments</h2>
          <TrendChart xDataKey="year" yDataKey="value" data={data.map(y => ({ year: y.year, value: y.total_payments }))} />
        </div>

        {/* COVID Insight */}
        {covidDip && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
            <p className="text-amber-800 font-medium">📉 <strong>COVID caused a {covidDip}% drop in 2020</strong> — the only year-over-year decline in the entire dataset. Elective procedures ground to a halt, and millions of patients delayed care.</p>
          </div>
        )}

        {/* Provider Count */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Provider Count Over Time</h2>
          <TrendChart xDataKey="year" yDataKey="value" data={data.map(y => ({ year: y.year, value: y.total_providers }))} />
        </div>

        {/* Provider Insight */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8">
          <p className="text-green-800 font-medium">👨‍⚕️ <strong>The provider pool keeps growing.</strong> More providers billing Medicare each year means more access — but also more spending. The rise of nurse practitioners and physician assistants has accelerated this trend.</p>
        </div>

        {/* Services */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Total Services</h2>
          <TrendChart xDataKey="year" yDataKey="value" data={data.map(y => ({ year: y.year, value: y.total_services }))} />
        </div>

        {/* Year-by-Year Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Year-by-Year Data</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg/Service</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map(y => (
                  <tr key={y.year} className="hover:bg-blue-50">
                    <td className="px-4 py-2 font-medium">{y.year}</td>
                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(y.total_payments)}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{formatNumber(y.total_providers)}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{formatNumber(y.total_services)}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{formatCurrency(y.avg_payment_per_service)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explore More */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <Link href="/investigations/ten-year-explosion" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The 10-Year Explosion</h4>
              <p className="text-sm text-gray-500 mt-1">A deep dive into a decade of Medicare spending growth</p>
            </Link>
          </div>
        </div>

        <SourceCitation />
      </div>
    </main>
  )
}
