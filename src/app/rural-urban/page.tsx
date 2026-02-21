'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

export default function RuralUrbanPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/rural-urban.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading...</div>
  if (!data) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Failed to load data</div>

  const summary = data.rural_urban_summary || []
  const urban = summary.find((s: any) => s.category === 'Urban')
  const rural = summary.find((s: any) => s.category === 'Rural')

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Rural vs Urban', href: '/rural-urban' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Rural vs Urban Medicare Spending</h1>
          <p className="text-lg text-gray-600">How Medicare spending differs between rural and urban areas — examining access, pricing, and provider distribution.</p>
        </div>

        {/* Editorial Context */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="prose max-w-none text-gray-700">
            <p>The vast majority of Medicare spending flows to urban providers — but rural Americans, who are older and sicker on average, face longer drives, fewer specialists, and hospital closures. This isn&apos;t just a funding gap; it&apos;s an access crisis. Rural providers earn less per service, treat fewer patients, and operate on thinner margins. Understanding this divide is key to any serious conversation about Medicare equity.</p>
          </div>
        </div>

        {/* Side-by-side comparison */}
        {urban && rural && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { data: urban, label: 'Urban', color: 'blue', icon: '🏙️' },
              { data: rural, label: 'Rural', color: 'green', icon: '🌾' },
            ].map(({ data: d, label, color, icon }) => (
              <div key={label} className={`bg-white rounded-xl shadow-sm border-2 border-${color}-200 p-6`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{icon} {label}</h2>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-600">Total Payments</span><span className="font-bold">{formatCurrency(d.total_payments)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Providers</span><span className="font-bold">{formatNumber(d.total_providers)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Services</span><span className="font-bold">{formatNumber(d.total_services)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Avg Payment/Service</span><span className="font-bold">{formatCurrency(d.avg_payment_per_service)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Avg Payment/Provider</span><span className="font-bold">{formatCurrency(d.avg_payment_per_provider)}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Key Insights */}
        {urban && rural && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-700 mb-1">Urban Share of Spending</div>
                <div className="text-3xl font-bold text-blue-800">{((urban.total_payments / (urban.total_payments + rural.total_payments)) * 100).toFixed(1)}%</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-700 mb-1">Price Gap (Urban vs Rural)</div>
                <div className="text-3xl font-bold text-green-800">{((urban.avg_payment_per_service / rural.avg_payment_per_service - 1) * 100).toFixed(0)}% higher</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-purple-700 mb-1">Provider Concentration</div>
                <div className="text-3xl font-bold text-purple-800">{(urban.total_providers / rural.total_providers).toFixed(1)}x more urban</div>
              </div>
            </div>
          </div>
        )}

        {/* Specialty Comparison */}
        {data.rural_urban_by_specialty && data.rural_urban_by_specialty.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Spending by Specialty — Rural vs Urban</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Urban Payments</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Rural Payments</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Rural Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.rural_urban_by_specialty.slice(0, 20).map((s: any) => (
                    <tr key={s.specialty} className="hover:bg-blue-50">
                      <td className="px-4 py-2 font-medium">{s.specialty}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(s.urban_payments || 0)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(s.rural_payments || 0)}</td>
                      <td className="px-4 py-2 text-right font-medium">
                        {s.rural_payments && s.urban_payments ? ((s.rural_payments / (s.urban_payments + s.rural_payments)) * 100).toFixed(1) : '0'}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* What This Means for Patients */}
        <div className="bg-green-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What This Means for Patients</h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>For Medicare beneficiaries in rural America, the numbers translate into real consequences. Fewer providers mean longer wait times and farther drives — sometimes hours to see a specialist. Rural hospitals closing at record rates means emergency care is moving further away. And lower per-service payments make it harder for rural practices to recruit new doctors, creating a self-reinforcing cycle of declining access.</p>
          </div>
        </div>

        {/* Explore More */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/geographic" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Geographic Spending</h4>
              <p className="text-sm text-gray-500 mt-1">See how Medicare spending varies across the country</p>
            </Link>
            <Link href="/states" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">State Pages</h4>
              <p className="text-sm text-gray-500 mt-1">Deep dive into Medicare data for every state</p>
            </Link>
            <Link href="/investigations/rural-price-tag" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Rural Price Tag</h4>
              <p className="text-sm text-gray-500 mt-1">What it really costs to deliver healthcare in rural America</p>
            </Link>
            <Link href="/investigations/state-spending-divide" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The State Spending Divide</h4>
              <p className="text-sm text-gray-500 mt-1">Why some states get far more Medicare dollars than others</p>
            </Link>
          </div>
        </div>

        <SourceCitation />
      </div>
    </main>
  )
}
