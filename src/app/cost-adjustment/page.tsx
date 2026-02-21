'use client'

import { useState, useEffect } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import Link from 'next/link'
import { formatCurrency, formatNumber } from '@/lib/format'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function CostAdjustmentPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'states' | 'specialties' | 'trends'>('states')
  const [sortBy, setSortBy] = useState<'cost_index' | 'actual_payments'>('cost_index')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetch('/data/standardized-payments.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const sortedStates = data?.states ? [...data.states].sort((a: any, b: any) => {
    const mul = sortDir === 'desc' ? -1 : 1
    return mul * (a[sortBy] - b[sortBy])
  }) : []

  const handleSort = (col: 'cost_index' | 'actual_payments') => {
    if (sortBy === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortBy(col); setSortDir('desc') }
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading data...</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Cost Adjustment', href: '/cost-adjustment' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">The Geographic Cost Gap: Who Gets Overpaid?</h1>
          <p className="text-lg text-gray-600">Medicare adjusts payments based on geographic cost of living. Some states receive far more than the national average — and some far less. Here&apos;s who benefits and who loses.</p>
        </div>

        {!data ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">🏗️</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Data Loading — Check Back Soon</h2>
            <p className="text-gray-500">We&apos;re currently processing standardized payment data from CMS.</p>
          </div>
        ) : (
          <>
            {/* Key Insight */}
            {data.most_expensive_states && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold text-red-800 mb-2">💰 Key Finding</h3>
                <p className="text-red-700">The most expensive states for Medicare — <strong>{data.most_expensive_states.slice(0, 5).join(', ')}</strong> — receive significantly more per service than the national average after geographic adjustment. Meanwhile, states like <strong>{data.cheapest_states?.slice(0, 5).join(', ')}</strong> receive less.</p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {[
                { key: 'states' as const, label: 'By State' },
                { key: 'specialties' as const, label: 'By Specialty' },
                { key: 'trends' as const, label: 'Yearly Trends' },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* States Table */}
            {tab === 'states' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600" onClick={() => handleSort('actual_payments')}>
                          Actual Payments {sortBy === 'actual_payments' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Standardized</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600" onClick={() => handleSort('cost_index')}>
                          Cost Index {sortBy === 'cost_index' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sortedStates.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.state}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(row.actual_payments)}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-600">{formatCurrency(row.standardized_payments)}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold">
                            <span className={row.cost_index > 1 ? 'text-red-600' : 'text-green-600'}>
                              {row.cost_index?.toFixed(3)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${row.cost_index > 1 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {row.cost_index > 1 ? 'Above Avg' : 'Below Avg'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Specialties */}
            {tab === 'specialties' && data.specialties && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actual</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Standardized</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Cost Index</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.specialties.slice(0, 30).map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{row.specialty}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(row.actual_payments)}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-600">{formatCurrency(row.standardized_payments)}</td>
                          <td className="px-4 py-3 text-sm text-right">
                            <span className={row.cost_index > 1 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                              {row.cost_index?.toFixed(3)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Trends */}
            {tab === 'trends' && data.yearly_trends && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Actual vs Standardized Payments Over Time</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data.yearly_trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(v: number) => formatCurrency(v)} />
                    <Tooltip formatter={(v: any) => formatCurrency(v)} />
                    <Legend />
                    <Line type="monotone" dataKey="actual_payments" name="Actual" stroke="#dc2626" strokeWidth={2} />
                    <Line type="monotone" dataKey="standardized_payments" name="Standardized" stroke="#16a34a" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Editorial */}
            <div className="bg-blue-50 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Geographic Adjustments</h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-4">
                <p>Medicare doesn&apos;t pay the same amount for the same procedure everywhere. Payments are adjusted by <strong>Geographic Practice Cost Indices (GPCIs)</strong> that account for local differences in physician work costs, practice expenses, and malpractice insurance.</p>
                <p>A cost index above 1.0 means a state&apos;s actual payments exceed what they&apos;d be under a flat national rate. Below 1.0 means they get less. States like Alaska and California have high cost indices due to expensive real estate and labor markets. States in the Deep South tend to have lower indices.</p>
                <p>The debate: are these adjustments fair? Critics argue they perpetuate inequities — rural states with lower cost of living also tend to have fewer doctors and worse health outcomes, yet they receive less per service. Proponents say it&apos;s simply reflecting the cost of doing business.</p>
              </div>
            </div>

            {/* Explore More */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore More</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/rural-urban" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600">Rural vs Urban</h4>
                  <p className="text-sm text-gray-500 mt-1">The spending and access gap between rural and urban Medicare</p>
                </Link>
                <Link href="/place-of-service" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600">Place of Service</h4>
                  <p className="text-sm text-gray-500 mt-1">How office vs facility billing changes what Medicare pays</p>
                </Link>
                <Link href="/investigations/geographic-inequality" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600">Geographic Inequality</h4>
                  <p className="text-sm text-gray-500 mt-1">Where you live determines what Medicare pays for your care</p>
                </Link>
                <Link href="/states" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600">State Pages</h4>
                  <p className="text-sm text-gray-500 mt-1">Medicare data for every state</p>
                </Link>
              </div>
            </div>

            <ShareButtons title="The Geographic Cost Gap" url="https://www.openmedicare.org/cost-adjustment" />
          </>
        )}

        <SourceCitation />
      </div>
    </main>
  )
}
