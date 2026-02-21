'use client'

import { useState, useEffect } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function PaymentGapPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/allowed-amounts.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading data...</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Payment Gap', href: '/payment-gap' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">The Three-Way Gap: Charged vs Allowed vs Paid</h1>
          <p className="text-lg text-gray-600">Doctors charge one amount, Medicare allows another, and pays even less. The gap between these numbers reveals a trillion-dollar accounting fiction.</p>
        </div>

        {!data ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">🏗️</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Data Loading — Check Back Soon</h2>
            <p className="text-gray-500">We&apos;re currently processing allowed amount data from CMS.</p>
          </div>
        ) : (
          <>
            {/* Big Three-Bar Visual */}
            {data.summary && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">The Trillion-Dollar Gap</h2>
                <div className="max-w-2xl mx-auto space-y-4">
                  {[
                    { label: 'Charged', value: data.summary.total_charged, color: 'bg-red-500' },
                    { label: 'Allowed', value: data.summary.total_allowed, color: 'bg-yellow-500' },
                    { label: 'Paid', value: data.summary.total_paid, color: 'bg-green-500' },
                  ].map(item => {
                    const maxVal = data.summary.total_charged || 1
                    const pct = (item.value / maxVal) * 100
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                          <span className="text-sm font-bold text-gray-900">{formatCurrency(item.value)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-8">
                          <div className={`${item.color} h-8 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Summary Cards */}
            {data.summary && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-sm text-gray-500 mb-1">Total Write-Off</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency((data.summary.total_charged || 0) - (data.summary.total_allowed || 0))}</p>
                  <p className="text-sm text-gray-500">Charges that simply vanish</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-sm text-gray-500 mb-1">Write-Off Rate</p>
                  <p className="text-2xl font-bold text-orange-600">{data.summary.writeoff_pct?.toFixed(1)}%</p>
                  <p className="text-sm text-gray-500">Of charges never collected</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-sm text-gray-500 mb-1">Coinsurance Gap</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency((data.summary.total_allowed || 0) - (data.summary.total_paid || 0))}</p>
                  <p className="text-sm text-gray-500">Patient responsibility</p>
                </div>
              </div>
            )}

            {/* Yearly Trends */}
            {data.yearly_trends && data.yearly_trends.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">The Gap Over Time</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data.yearly_trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(v: number) => formatCurrency(v)} />
                    <Tooltip formatter={(v: any) => formatCurrency(v)} />
                    <Legend />
                    <Line type="monotone" dataKey="total_charged" name="Charged" stroke="#dc2626" strokeWidth={2} />
                    <Line type="monotone" dataKey="total_allowed" name="Allowed" stroke="#eab308" strokeWidth={2} />
                    <Line type="monotone" dataKey="total_paid" name="Paid" stroke="#16a34a" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Specialty Table */}
            {data.specialties && data.specialties.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">Biggest Gaps by Specialty</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Charged</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Allowed</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Paid</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Write-Off %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.specialties.slice(0, 25).map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{row.specialty}</td>
                          <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(row.total_charged)}</td>
                          <td className="px-4 py-3 text-sm text-right text-yellow-600">{formatCurrency(row.total_allowed)}</td>
                          <td className="px-4 py-3 text-sm text-right text-green-600">{formatCurrency(row.total_paid)}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{row.writeoff_pct?.toFixed(1)}%</td>
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
                  <h2 className="text-2xl font-bold text-gray-900">Top Procedures with Biggest Gaps</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Charged</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.top_procedures.slice(0, 20).map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono text-gray-600">{row.code}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.description}</td>
                          <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(row.total_charged)}</td>
                          <td className="px-4 py-3 text-sm text-right text-green-600">{formatCurrency(row.total_paid)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Editorial */}
            <div className="bg-blue-50 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Do These Numbers Really Mean?</h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-4">
                <p><strong>Charged:</strong> This is the &quot;list price&quot; — what a doctor or hospital puts on the bill. Think of it like the sticker price on a car: almost nobody pays it. These charges are largely fictional numbers that have inflated wildly over decades, detached from actual costs.</p>
                <p><strong>Allowed:</strong> This is what Medicare determines a service is actually worth, based on the Resource-Based Relative Value Scale (RBRVS). It&apos;s the maximum amount that can be collected for a service from all sources combined.</p>
                <p><strong>Paid:</strong> This is what Medicare actually sends to the provider — typically 80% of the allowed amount. The remaining 20% is the patient&apos;s responsibility (coinsurance), paid out-of-pocket or by supplemental insurance.</p>
                <p>The gap between &quot;charged&quot; and &quot;allowed&quot; is a <strong>write-off</strong> — it simply disappears. Providers who accept Medicare assignment agree not to bill patients for this difference. The gap between &quot;allowed&quot; and &quot;paid&quot; represents patient cost-sharing.</p>
              </div>
            </div>

            <ShareButtons title="The Three-Way Payment Gap" url="https://www.openmedicare.org/payment-gap" />
          </>
        )}

        <SourceCitation />
      </div>
    </main>
  )
}
