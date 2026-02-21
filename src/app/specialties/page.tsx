'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, ExclamationTriangleIcon, FireIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

interface SpecialtyData {
  specialty: string
  specialty_slug: string
  total_payments: number
  total_services: number
  total_providers: number
  markup_ratio: number
}

interface MLResult {
  specialty: string
  fraud_probability: number
}

const FRAUD_HOTSPOTS = ['Internal Medicine', 'Family Practice']

type SortField = 'total_payments' | 'total_providers' | 'markup_ratio' | 'ai_flagged'

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState<SpecialtyData[]>([])
  const [flagsBySpecialty, setFlagsBySpecialty] = useState<Record<string, number>>({})
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('total_payments')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/data/specialties.json').then(r => r.json()),
      fetch('/data/ml-v2-results.json').then(r => r.json()),
    ]).then(([specData, mlData]) => {
      setSpecialties(specData.specialties || [])
      const counts: Record<string, number> = {}
      ;(mlData.still_out_there || []).forEach((p: MLResult) => {
        counts[p.specialty] = (counts[p.specialty] || 0) + 1
      })
      setFlagsBySpecialty(counts)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const getSortValue = (s: SpecialtyData, field: SortField): number => {
    if (field === 'ai_flagged') return flagsBySpecialty[s.specialty] || 0
    return (s[field] as number) || 0
  }

  const filtered = specialties
    .filter(s => !search || s.specialty.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (getSortValue(a, sortField) - getSortValue(b, sortField)) * (sortDir === 'asc' ? 1 : -1))

  const totalFlagged = Object.values(flagsBySpecialty).reduce((a, b) => a + b, 0)

  const SortHeader = ({ field, label, align }: { field: SortField; label: string; align?: string }) => (
    <th className={`px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 select-none whitespace-nowrap ${align === 'right' ? 'text-right' : 'text-left'}`} onClick={() => handleSort(field)}>
      {label} {sortField === field ? (sortDir === 'desc' ? '↓' : '↑') : ''}
    </th>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Specialties', href: '/specialties' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Medicare Spending by Specialty</h1>
          <p className="text-lg text-gray-600">Compare Medicare payments across all medical specialties. Click any specialty for top providers, procedures, and 10-year trends.</p>
        </div>

        {/* Fraud Hotspot Alert */}
        {totalFlagged > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-5 mb-8">
            <div className="flex items-start gap-3">
              <FireIcon className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Fraud Hotspot Specialties</h3>
                <p className="text-sm text-red-800">
                  <strong>Internal Medicine</strong> ({flagsBySpecialty['Internal Medicine'] || 0} flagged) and{' '}
                  <strong>Family Practice</strong> ({flagsBySpecialty['Family Practice'] || 0} flagged) account for{' '}
                  <strong>{Math.round(((flagsBySpecialty['Internal Medicine'] || 0) + (flagsBySpecialty['Family Practice'] || 0)) / totalFlagged * 100)}%</strong>{' '}
                  of all {totalFlagged} AI-flagged providers. These high-volume primary care specialties are disproportionately
                  represented in fraud patterns.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative max-w-md w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Search specialties..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Sort:</span>
              {([
                ['total_payments', 'Payments'],
                ['total_providers', 'Providers'],
                ['ai_flagged', '🚩 AI-Flagged'],
                ['markup_ratio', 'Markup'],
              ] as [SortField, string][]).map(([field, label]) => (
                <button
                  key={field}
                  onClick={() => handleSort(field)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    sortField === field
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label} {sortField === field ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading specialties...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                    <SortHeader field="total_payments" label="Total Payments" align="right" />
                    <SortHeader field="total_providers" label="Providers" align="right" />
                    <SortHeader field="markup_ratio" label="Avg Markup" align="right" />
                    <SortHeader field="ai_flagged" label="🚩 AI-Flagged" align="right" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((s, i) => {
                    const flagCount = flagsBySpecialty[s.specialty] || 0
                    const isHotspot = FRAUD_HOTSPOTS.includes(s.specialty)
                    return (
                      <tr key={s.specialty_slug} className={`hover:bg-blue-50 transition-colors ${isHotspot && flagCount > 0 ? 'bg-red-50/40' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link href={`/specialties/${s.specialty_slug}`} className="text-blue-600 hover:text-blue-800 font-medium">{s.specialty}</Link>
                            {isHotspot && flagCount > 0 && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                <FireIcon className="h-3 w-3" /> Hotspot
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(s.total_payments)}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{formatNumber(s.total_providers)}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-medium ${(s.markup_ratio || 0) > 5 ? 'text-red-600' : (s.markup_ratio || 0) > 3 ? 'text-orange-600' : 'text-gray-700'}`}>
                            {s.markup_ratio?.toFixed(1)}x
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {flagCount > 0 ? (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              flagCount >= 50 ? 'bg-red-100 text-red-800' :
                              flagCount >= 10 ? 'bg-orange-100 text-orange-800' :
                              flagCount >= 3 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              <ExclamationTriangleIcon className="h-3.5 w-3.5" />
                              {flagCount}
                            </span>
                          ) : (
                            <span className="text-gray-300 text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-500">
              Showing {filtered.length} of {specialties.length} specialties
            </div>
          </div>
        )}

        {/* Related Reading & Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Explore More</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link href="/investigations/how-much-does-medicare-pay" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">💰 How Much Does Medicare Pay?</div>
              <div className="text-sm text-gray-500">Average payments from $26K to $384K</div>
            </Link>
            <Link href="/investigations/specialty-monopoly" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🏛️ The Specialty Monopoly</div>
              <div className="text-sm text-gray-500">5 specialties control 33% of spending</div>
            </Link>
            <Link href="/investigations/specialty-pay-gap" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">📊 The Specialty Pay Gap</div>
              <div className="text-sm text-gray-500">Procedure-based vs primary care</div>
            </Link>
            <Link href="/fraud/watchlist" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🚨 Fraud Watchlist</div>
              <div className="text-sm text-gray-500">Flagged providers by specialty</div>
            </Link>
            <Link href="/search" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🔍 Search Providers</div>
              <div className="text-sm text-gray-500">Find any provider by name</div>
            </Link>
            <Link href="/markup" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">📈 Markup Analysis</div>
              <div className="text-sm text-gray-500">What doctors charge vs what Medicare pays</div>
            </Link>
          </div>
        </div>

        <SourceCitation />
      </div>
    </main>
  )
}
