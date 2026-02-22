'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

const TrendChart = dynamic(
  () => import('@/components/Charts').then(mod => mod.TrendChart),
  { ssr: false, loading: () => <div className="h-[400px] flex items-center justify-center text-gray-400">Loading chart...</div> }
)

export default function DrugSpendingPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/drug-spending.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading drug spending data...</div>
  if (!data) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Failed to load data</div>

  const stats = data.overall_statistics || {}

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Drug Spending', href: '/drug-spending' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Medicare Drug Spending</h1>
          <p className="text-lg text-gray-600">Analyzing prescription drug payments in Medicare — which drugs cost the most and how drug spending is growing over time.</p>
        </div>

        {/* Editorial Context */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="prose max-w-none text-gray-700">
            <p>Drug spending now accounts for {(stats.latest_year_drug_share || 14.8).toFixed(1)}% of all Medicare payments — up from roughly 11% in 2014. The rise is driven by a wave of expensive specialty drugs, particularly in oncology and ophthalmology. Five drugs alone account for billions in annual spending, and the trend shows no sign of slowing as the pharmaceutical pipeline delivers more targeted (and costlier) therapies.</p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-sm text-gray-500 mb-1">Total Drug Spending (10 years)</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.total_drug_payments_all_years || 0)}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-sm text-gray-500 mb-1">Drug Share of Medicare ({stats.latest_year})</div>
            <div className="text-2xl font-bold text-red-600">{(stats.latest_year_drug_share || 0).toFixed(1)}%</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-sm text-gray-500 mb-1">Overall Drug Share</div>
            <div className="text-2xl font-bold text-orange-600">{(stats.overall_drug_share || 0).toFixed(1)}%</div>
          </div>
        </div>

        {/* Drug Share Trend */}
        {data.yearly_trends && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Drug Share of Medicare Spending Over Time</h2>
            <TrendChart xDataKey="year" yDataKey="value" data={data.yearly_trends.map((y: any) => ({ year: y.year, value: y.drug_payment_share || 0 }))} valueFormatter={(v: number) => `${v.toFixed(1)}%`} tooltipFormatter={(v: number) => `${v.toFixed(2)}%`} />
          </div>
        )}

        {/* Drug Payment Trend */}
        {data.yearly_trends && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Total Drug Payments by Year</h2>
            <TrendChart xDataKey="year" yDataKey="value" data={data.yearly_trends.map((y: any) => ({ year: y.year, value: y.drug_payments || 0 }))} />
          </div>
        )}

        {/* Top Drugs */}
        {data.top_drug_codes && data.top_drug_codes.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Drugs by Medicare Spending</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.top_drug_codes.slice(0, 30).map((d: any, i: number) => (
                    <tr key={d.code} className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-500 text-sm">{i + 1}</td>
                      <td className="px-4 py-2 font-mono text-blue-600 font-medium">{d.code}</td>
                      <td className="px-4 py-2 text-gray-600 text-sm max-w-sm truncate">{d.description}</td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(d.total_payments)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(d.total_providers)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top 5 Drug Spotlight */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Big Five: Medicare&apos;s Costliest Drugs</h2>
          <div className="space-y-4">
            {[
              { name: 'Eylea (Aflibercept)', desc: 'Injected directly into the eye to treat age-related macular degeneration. The single most expensive drug in Medicare, costing billions annually.' },
              { name: 'Keytruda (Pembrolizumab)', desc: 'A revolutionary immunotherapy for cancer. Used across dozens of tumor types, its Medicare spending has skyrocketed since approval.' },
              { name: 'Revlimid (Lenalidomide)', desc: 'A critical treatment for multiple myeloma. Patients often take it for years, driving sustained high spending.' },
              { name: 'Eliquis (Apixaban)', desc: 'A blood thinner prescribed to millions of Medicare beneficiaries to prevent stroke. High volume drives massive total spending.' },
              { name: 'Imbruvica (Ibrutinib)', desc: 'Used for blood cancers like chronic lymphocytic leukemia. One of the newer targeted therapies reshaping oncology spending.' },
            ].map((drug) => (
              <div key={drug.name} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">{drug.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{drug.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Explore More */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/trends" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Spending Trends</h4>
              <p className="text-sm text-gray-500 mt-1">A decade of Medicare spending growth and what drove it</p>
            </Link>
            <Link href="/markup" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Markup Analysis</h4>
              <p className="text-sm text-gray-500 mt-1">The gap between what providers charge and what Medicare pays</p>
            </Link>
            <Link href="/investigations/drug-money" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Drug Money Investigation</h4>
              <p className="text-sm text-gray-500 mt-1">Following the money trail in Medicare drug spending</p>
            </Link>
            <Link href="/investigations/drug-pipeline" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Follow the Drug Money</h4>
              <p className="text-sm text-gray-500 mt-1">The oncology drug pipeline reshaping Medicare spending</p>
            </Link>
          </div>
        </div>

        <SourceCitation />
      </div>
    </main>
  )
}
