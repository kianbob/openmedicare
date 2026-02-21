'use client'

import { useState, useEffect } from 'react'
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

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { name: `Total (${latest?.year})`, value: formatCurrency(latest?.total_payments || 0), color: 'blue' },
            { name: '10-Year Growth', value: `${growth}%`, color: 'green' },
            { name: 'COVID Impact (2020)', value: covidDip ? `${covidDip}%` : 'N/A', color: 'red' },
            { name: `Providers (${latest?.year})`, value: formatNumber(latest?.total_providers || 0), color: 'purple' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500 mb-1">{s.label}</div>
              <div className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Payment Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Total Medicare Payments</h2>
          <TrendChart xDataKey="year" yDataKey="value" data={data.map(y => ({ year: y.year, value: y.total_payments }))} />
        </div>

        {/* Provider Count */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Provider Count Over Time</h2>
          <TrendChart xDataKey="year" yDataKey="value" data={data.map(y => ({ year: y.year, value: y.total_providers }))} />
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

        <SourceCitation />
      </div>
    </main>
  )
}
