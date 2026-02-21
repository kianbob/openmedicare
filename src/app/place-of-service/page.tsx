'use client'

import { useState, useEffect } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import Link from 'next/link'
import { formatCurrency, formatNumber } from '@/lib/format'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PlaceData {
  place: string
  total_payments: number
  total_charges: number
  total_services: number
  markup_ratio: number
  avg_payment_per_service: number
}

export default function PlaceOfServicePage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/place-of-service.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading data...</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Place of Service', href: '/place-of-service' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Office vs Facility: Where Medicare Money Flows</h1>
          <p className="text-lg text-gray-600">The same procedure can cost Medicare dramatically more when performed in a hospital outpatient facility versus a doctor&apos;s office. This analysis breaks down where the money goes.</p>
        </div>

        {!data ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">🏗️</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Data Loading — Check Back Soon</h2>
            <p className="text-gray-500">We&apos;re currently processing place-of-service data from CMS. This analysis will be available shortly.</p>
          </div>
        ) : (
          <>
            {/* Comparison Cards */}
            {data.overall && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {data.overall.map((item: PlaceData) => (
                  <div key={item.place} className={`bg-white rounded-xl shadow-sm border-2 p-6 ${item.place === 'Office' ? 'border-blue-200' : 'border-orange-200'}`}>
                    <h3 className={`text-xl font-bold mb-4 ${item.place === 'Office' ? 'text-blue-700' : 'text-orange-700'}`}>
                      {item.place === 'Office' ? '🏢' : '🏥'} {item.place}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Payments</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(item.total_payments)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Charges</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(item.total_charges)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Markup Ratio</p>
                        <p className="text-2xl font-bold text-gray-900">{item.markup_ratio?.toFixed(1)}x</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Avg Payment/Service</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(item.avg_payment_per_service)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Yearly Trends */}
            {data.yearly_trends && data.yearly_trends.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Office vs Facility Spending Over Time</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={(() => {
                    const years = [...new Set(data.yearly_trends.map((d: any) => d.year))].sort()
                    return years.map((y: any) => {
                      const office = data.yearly_trends.find((d: any) => d.year === y && d.place === 'Office')
                      const facility = data.yearly_trends.find((d: any) => d.year === y && d.place === 'Facility')
                      return { year: y, Office: office?.total_payments || 0, Facility: facility?.total_payments || 0 }
                    })
                  })()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(v: number) => formatCurrency(v)} />
                    <Tooltip formatter={(v: any) => formatCurrency(v)} />
                    <Legend />
                    <Line type="monotone" dataKey="Office" stroke="#2563eb" strokeWidth={2} />
                    <Line type="monotone" dataKey="Facility" stroke="#ea580c" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Specialty Breakdown */}
            {data.specialty_breakdown && data.specialty_breakdown.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">Specialty Breakdown by Place of Service</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Place</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.specialty_breakdown.slice(0, 30).map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{row.specialty}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${row.place === 'Office' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                              {row.place}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(row.total_payments)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Top Procedures */}
            {data.top_procedures && data.top_procedures.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">Top Procedures by Place of Service</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Place</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.top_procedures.slice(0, 20).map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono text-gray-600">{row.code}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.description}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${row.place === 'Office' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                              {row.place}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(row.total_payments)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Editorial */}
            <div className="bg-blue-50 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why This Matters</h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-4">
                <p>One of the most controversial aspects of Medicare billing is the <strong>facility fee</strong>. When a doctor performs a procedure in their office, Medicare pays one rate. When the exact same procedure is performed in a hospital outpatient department, Medicare pays significantly more — sometimes double or triple.</p>
                <p>This &quot;site-of-service differential&quot; was originally designed to account for the higher overhead costs hospitals face. But as hospitals have aggressively acquired physician practices, many procedures that were once done in offices are now billed at the higher facility rate — even when nothing about the care has changed.</p>
                <p>The result: Medicare (and taxpayers) pay billions more each year for the same services, simply because of where they&apos;re billed from. Patients also pay more, since their copays are calculated as a percentage of the higher facility charge.</p>
              </div>
            </div>

            {/* Explore More */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore More</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/cost-adjustment" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600">Cost Adjustment</h4>
                  <p className="text-sm text-gray-500 mt-1">How geographic adjustments change what Medicare pays</p>
                </Link>
                <Link href="/markup" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600">Markup Analysis</h4>
                  <p className="text-sm text-gray-500 mt-1">The gap between charges and payments across Medicare</p>
                </Link>
                <Link href="/investigations/office-visit-economy" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600">The $117B Office Visit Economy</h4>
                  <p className="text-sm text-gray-500 mt-1">Two billing codes that dominate all of Medicare spending</p>
                </Link>
              </div>
            </div>

            <ShareButtons title="Office vs Facility: Where Medicare Money Flows" url="https://openmedicare.vercel.app/place-of-service" />
          </>
        )}

        <SourceCitation />
      </div>
    </main>
  )
}
