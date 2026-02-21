'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { TrendChart } from '@/components/Charts'
import { formatCurrency, formatNumber } from '@/lib/format'

export default function MarkupAnalysisPage() {
  const [data, setData] = useState<any>(null)
  const [tab, setTab] = useState<'specialty' | 'state' | 'providers' | 'trends'>('specialty')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/markup-analysis.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading markup data...</div>
  if (!data) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Failed to load data</div>

  const tabs = [
    { key: 'specialty' as const, label: 'By Specialty' },
    { key: 'state' as const, label: 'By State' },
    { key: 'providers' as const, label: 'Top Markup Providers' },
    { key: 'trends' as const, label: 'Yearly Trends' },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Markup Analysis', href: '/markup' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">The Medicare Markup Machine</h1>
          <p className="text-lg text-gray-600">Medicare providers submit charges far exceeding what Medicare actually pays. This analysis reveals who charges the most and where the biggest markups occur.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* By Specialty */}
        {tab === 'specialty' && data.by_specialty && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Markup</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Charges</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.by_specialty.slice(0, 40).map((s: any, i: number) => (
                    <tr key={i} className="hover:bg-blue-50">
                      <td className="px-4 py-2 font-medium">{s.specialty}</td>
                      <td className="px-4 py-2 text-right">
                        <span className={`font-bold ${s.avg_markup > 6 ? 'text-red-600' : s.avg_markup > 4 ? 'text-orange-600' : 'text-gray-700'}`}>
                          {s.avg_markup?.toFixed(1)}x
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">{formatCurrency(s.total_charges)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(s.total_payments)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(s.provider_count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* By State */}
        {tab === 'state' && data.by_state && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Markup</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Charges</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.by_state.map((s: any) => (
                    <tr key={s.state} className="hover:bg-blue-50">
                      <td className="px-4 py-2"><Link href={`/states/${s.state}`} className="text-blue-600 hover:text-blue-800 font-medium">{s.state}</Link></td>
                      <td className="px-4 py-2 text-right">
                        <span className={`font-bold ${s.avg_markup > 5 ? 'text-red-600' : s.avg_markup > 3.5 ? 'text-orange-600' : 'text-gray-700'}`}>
                          {s.avg_markup?.toFixed(1)}x
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">{formatCurrency(s.total_charges)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(s.total_payments)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Markup Providers */}
        {tab === 'providers' && data.top_markup_providers && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Provider</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Markup</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Charges</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Payments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.top_markup_providers.slice(0, 50).map((p: any, i: number) => (
                    <tr key={p.npi} className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-500 text-sm">{i + 1}</td>
                      <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-blue-600 hover:text-blue-800 font-medium">{p.name}</Link></td>
                      <td className="px-4 py-2 text-gray-600 text-sm">{p.specialty}</td>
                      <td className="px-4 py-2 text-gray-600">{p.state}</td>
                      <td className="px-4 py-2 text-right"><span className="font-bold text-red-600">{p.avg_markup?.toFixed(1)}x</span></td>
                      <td className="px-4 py-2 text-right">{formatCurrency(p.total_charges)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(p.total_payments)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Yearly Trends */}
        {tab === 'trends' && data.yearly_trends && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Markup Over Time</h2>
            <TrendChart data={data.yearly_trends.map((y: any) => ({ year: y.year, value: y.avg_markup }))} label="Avg Markup Ratio" suffix="x" />
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Excess Charges by Year</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Markup</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Charges</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Excess Charges</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.yearly_trends.map((y: any) => (
                      <tr key={y.year} className="hover:bg-blue-50">
                        <td className="px-4 py-2 font-medium">{y.year}</td>
                        <td className="px-4 py-2 text-right font-bold text-orange-600">{y.avg_markup?.toFixed(1)}x</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(y.total_charges)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(y.total_payments)}</td>
                        <td className="px-4 py-2 text-right text-red-600 font-medium">{formatCurrency(y.markup_dollars || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <SourceCitation />
        </div>
      </div>
    </main>
  )
}
