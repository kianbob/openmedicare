'use client'

import { useState, useEffect } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import Link from 'next/link'
import { formatCurrency, formatNumber } from '@/lib/format'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function UtilizationPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'trends' | 'specialty' | 'participation'>('overview')

  useEffect(() => {
    fetch('/data/utilization.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading data...</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Utilization', href: '/utilization' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Individual Doctors vs Corporate Medicine</h1>
          <p className="text-lg text-gray-600">Medicare pays both individual physicians and organizations. As corporate medicine grows, how is the balance shifting — and what does it mean for patients?</p>
        </div>

        {!data ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">🏗️</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Data Loading — Check Back Soon</h2>
            <p className="text-gray-500">We&apos;re currently processing utilization data from CMS.</p>
          </div>
        ) : (
          <>
            {/* Entity Comparison Cards */}
            {data.entity_breakdown && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {data.entity_breakdown.map((item: any) => (
                  <div key={item.entity_type} className={`bg-white rounded-xl shadow-sm border-2 p-6 ${item.entity_type === 'Individual' ? 'border-blue-200' : 'border-purple-200'}`}>
                    <h3 className={`text-xl font-bold mb-4 ${item.entity_type === 'Individual' ? 'text-blue-700' : 'text-purple-700'}`}>
                      {item.entity_type === 'Individual' ? '👨‍⚕️' : '🏢'} {item.entity_type}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Providers</p>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(item.providers)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Payments</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(item.total_payments)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Services</p>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(item.total_services)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Markup Ratio</p>
                        <p className="text-2xl font-bold text-gray-900">{item.markup_ratio?.toFixed(1)}x</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {[
                { key: 'trends' as const, label: 'Growth Trends' },
                { key: 'specialty' as const, label: 'By Specialty' },
                { key: 'participation' as const, label: 'Participation' },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Trends Chart */}
            {tab === 'trends' && data.entity_trends && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Individual vs Organization Growth</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={(() => {
                    const years = [...new Set(data.entity_trends.map((d: any) => d.year))].sort()
                    return years.map((y: any) => {
                      const ind = data.entity_trends.find((d: any) => d.year === y && d.entity_type === 'Individual')
                      const org = data.entity_trends.find((d: any) => d.year === y && d.entity_type === 'Organization')
                      return { year: y, Individual: ind?.total_payments || 0, Organization: org?.total_payments || 0 }
                    })
                  })()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(v: number) => formatCurrency(v)} />
                    <Tooltip formatter={(v: any) => formatCurrency(v)} />
                    <Legend />
                    <Line type="monotone" dataKey="Individual" stroke="#2563eb" strokeWidth={2} />
                    <Line type="monotone" dataKey="Organization" stroke="#7c3aed" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Specialty Utilization */}
            {tab === 'specialty' && data.utilization_by_specialty && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">Utilization Intensity by Specialty</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Intensity</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services/Beneficiary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.utilization_by_specialty.slice(0, 30).map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{row.specialty}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{row.intensity?.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-600">{row.services_per_bene?.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Participation */}
            {tab === 'participation' && data.participation && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Medicare Participation Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {data.participation.map((item: any, i: number) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-6 text-center">
                      <p className="text-lg font-semibold text-gray-900 mb-2">{item.label}</p>
                      <p className="text-3xl font-bold text-medicare-primary mb-1">{formatNumber(item.providers)}</p>
                      <p className="text-sm text-gray-500">providers</p>
                      <p className="text-lg font-semibold text-gray-700 mt-2">{formatCurrency(item.total_payments)}</p>
                      <p className="text-sm text-gray-500">in payments</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Editorial */}
            <div className="bg-blue-50 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The Corporatization of Medicine</h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-4">
                <p>American healthcare is undergoing a quiet revolution. Private equity firms, hospital systems, and corporate entities are acquiring physician practices at an unprecedented rate. What was once a profession of independent practitioners is increasingly becoming corporate employment.</p>
                <p>The data shows this shift clearly: <strong>organizational providers</strong> are growing their share of Medicare payments faster than individual physicians. When a hospital buys a doctor&apos;s practice, the same services can be billed at higher facility rates, and the practice gains negotiating leverage with insurers.</p>
                <p>For patients, corporatization is a double-edged sword. Larger organizations can invest in technology, coordinate care better, and offer more services. But consolidation also reduces competition, can increase prices, and may prioritize revenue over the physician-patient relationship.</p>
                <p>Medicare participation data reveals another dimension: providers who &quot;participate&quot; in Medicare agree to accept Medicare&apos;s approved amount as full payment. Non-participating providers can charge up to 15% more, leaving patients to cover the difference.</p>
              </div>
            </div>

            {/* Explore More */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore More</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/trends" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600">Spending Trends</h4>
                  <p className="text-sm text-gray-500 mt-1">A decade of Medicare spending growth</p>
                </Link>
                <Link href="/investigations/corporate-medicine" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600">Corporate Medicine Investigation</h4>
                  <p className="text-sm text-gray-500 mt-1">How private equity is reshaping healthcare delivery</p>
                </Link>
                <Link href="/investigations/nurse-practitioner-boom" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600">The Nurse Practitioner Boom</h4>
                  <p className="text-sm text-gray-500 mt-1">The fastest-growing provider type in Medicare</p>
                </Link>
                <Link href="/investigations/biggest-billers" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600">Medicare&apos;s Biggest Billers</h4>
                  <p className="text-sm text-gray-500 mt-1">Which providers collect the most from Medicare</p>
                </Link>
              </div>
            </div>

            <ShareButtons title="Individual Doctors vs Corporate Medicine" url="https://www.openmedicare.us/utilization" />
          </>
        )}

        <SourceCitation />
      </div>
    </main>
  )
}
