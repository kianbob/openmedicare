'use client'

import { useState, useEffect, useMemo } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

export default function GeographicPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'cities' | 'zips' | 'byState'>('cities')
  const [search, setSearch] = useState('')
  const [selectedState, setSelectedState] = useState('')

  useEffect(() => {
    fetch('/data/geographic.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filteredCities = useMemo(() => {
    if (!data?.top_cities) return []
    return data.top_cities.filter((c: any) =>
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 50)
  }, [data, search])

  const states = useMemo(() => {
    if (!data?.cities_by_state) return []
    return Object.keys(data.cities_by_state).sort()
  }, [data])

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading data...</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Geographic', href: '/geographic' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Medicare Spending by City & Zip Code</h1>
          <p className="text-lg text-gray-600">Where in America does Medicare spend the most? Explore spending hotspots down to the zip code level.</p>
        </div>

        {!data ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">🏗️</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Data Loading — Check Back Soon</h2>
            <p className="text-gray-500">We&apos;re currently processing geographic spending data from CMS.</p>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {data.top_cities?.[0] && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-sm text-gray-500 mb-1">#1 City by Medicare Spending</p>
                  <p className="text-2xl font-bold text-gray-900">{data.top_cities[0].city}, {data.top_cities[0].state}</p>
                  <p className="text-lg text-medicare-primary font-semibold">{formatCurrency(data.top_cities[0].total_payments)}</p>
                </div>
              )}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-sm text-gray-500 mb-1">Total Cities Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(data.top_cities?.length || 0)}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-sm text-gray-500 mb-1">Total Zip Codes</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(data.top_zip_codes?.length || 0)}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {[
                { key: 'cities' as const, label: 'Top Cities' },
                { key: 'zips' as const, label: 'Top Zip Codes' },
                { key: 'byState' as const, label: 'By State' },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Cities Tab */}
            {tab === 'cities' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-4 border-b">
                  <input
                    type="text"
                    placeholder="Search cities or states..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Markup</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredCities.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.city}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{row.state}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(row.total_payments)}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-600">{formatNumber(row.providers)}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-600">{row.markup_ratio?.toFixed(1)}x</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Zip Codes Tab */}
            {tab === 'zips' && data.top_zip_codes && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Zip Code</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.top_zip_codes.slice(0, 50).map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">{row.zip}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.city}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{row.state}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(row.total_payments)}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-600">{formatNumber(row.providers)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* By State Tab */}
            {tab === 'byState' && data.cities_by_state && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-4 border-b">
                  <select
                    value={selectedState}
                    onChange={e => setSelectedState(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a state...</option>
                    {states.map((s: string) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {selectedState && data.cities_by_state[selectedState] && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {data.cities_by_state[selectedState].map((row: any, i: number) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.city}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(row.total_payments)}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-600">{formatNumber(row.providers)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <ShareButtons title="Medicare Spending by City & Zip Code" url="https://openmedicare.vercel.app/geographic" />
          </>
        )}

        <SourceCitation />
      </div>
    </main>
  )
}
