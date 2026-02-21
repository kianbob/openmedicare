'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

interface ProcedureData {
  code: string
  description: string
  is_drug: boolean
  total_payments: number
  total_services: number
  total_providers: number
  avg_payment_per_service: number
  markup_ratio?: number
}

type SortField = 'total_payments' | 'total_services' | 'total_providers' | 'avg_payment_per_service' | 'markup_ratio'

export default function ProceduresPage() {
  const [procedures, setProcedures] = useState<ProcedureData[]>([])
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('total_payments')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [drugFilter, setDrugFilter] = useState<'all' | 'drugs' | 'services'>('all')
  const [highlightMarkup, setHighlightMarkup] = useState(false)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [showCount, setShowCount] = useState(50)

  useEffect(() => {
    fetch('/data/procedures.json')
      .then(r => r.json())
      .then(d => { setProcedures(d.procedures || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filtered = useMemo(() => procedures
    .filter(p => {
      if (drugFilter === 'drugs' && !p.is_drug) return false
      if (drugFilter === 'services' && p.is_drug) return false
      if (highlightMarkup && (p.markup_ratio || 0) <= 3) return false
      if (!search) return true
      return p.code.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())
    })
    .sort((a, b) => ((a[sortField] || 0) - (b[sortField] || 0)) * (sortDir === 'asc' ? 1 : -1)),
    [procedures, search, sortField, sortDir, drugFilter, highlightMarkup])

  const highMarkupCount = useMemo(() => procedures.filter(p => (p.markup_ratio || 0) > 3).length, [procedures])
  const maxPayments = useMemo(() => Math.max(...procedures.map(p => p.total_payments), 1), [procedures])

  const SortHeader = ({ field, label, align }: { field: SortField; label: string; align?: string }) => (
    <th className={`px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 select-none whitespace-nowrap ${align === 'right' ? 'text-right' : 'text-left'}`} onClick={() => handleSort(field)}>
      {label} {sortField === field ? (sortDir === 'desc' ? '↓' : '↑') : ''}
    </th>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Procedures', href: '/procedures' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Medicare Procedure Explorer</h1>
          <p className="text-lg text-gray-600">Browse the top 500 procedures and drugs by Medicare spending. Click any code for detailed provider and geographic breakdowns.</p>
        </div>

        {/* Summary Stats */}
        {procedures.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm font-medium text-gray-500">Total Procedures</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{procedures.length}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm font-medium text-gray-500">💊 Drugs</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{procedures.filter(p => p.is_drug).length}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm font-medium text-gray-500">🩺 Services</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{procedures.filter(p => !p.is_drug).length}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-5 bg-orange-50/50">
              <div className="text-sm font-medium text-orange-600 flex items-center gap-1">
                <ExclamationTriangleIcon className="h-4 w-4" />
                High Markup (&gt;3x)
              </div>
              <div className="text-2xl font-bold text-orange-700 mt-1">{highMarkupCount}</div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Search by code or description..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'services', 'drugs'] as const).map(f => (
                <button key={f} onClick={() => setDrugFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${drugFilter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {f === 'all' ? 'All' : f === 'drugs' ? '💊 Drugs' : '🩺 Services'}
                </button>
              ))}
              <button onClick={() => setHighlightMarkup(!highlightMarkup)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${highlightMarkup ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-orange-50'}`}>
                ⚠️ High Markup Only
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-4 items-center justify-between">
            <div className="flex gap-2">
              <button onClick={() => setViewMode('table')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                📋 Table
              </button>
              <button onClick={() => setViewMode('cards')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                🃏 Cards
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {filtered.length} results
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading procedures...</div>
        ) : viewMode === 'cards' ? (
          /* Card View */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {filtered.slice(0, showCount).map(p => {
                const isHighMarkup = (p.markup_ratio || 0) > 3
                const barWidth = Math.min(p.total_payments / maxPayments * 100, 100)
                return (
                  <Link key={p.code} href={`/procedures/${p.code}`}
                    className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-all group ${
                      isHighMarkup ? 'border-orange-200 hover:border-orange-300' : 'border-gray-200 hover:border-blue-300'
                    }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-sm font-bold text-blue-600 group-hover:text-blue-800">
                          {p.is_drug ? '💊 ' : ''}{p.code}
                        </span>
                        {isHighMarkup && (
                          <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">
                            {p.markup_ratio?.toFixed(1)}x markup
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description}</div>
                    <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isHighMarkup ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${barWidth}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="font-semibold text-gray-900">{formatCurrency(p.total_payments)}</span>
                      <span className="text-gray-500">{formatCurrency(p.avg_payment_per_service)}/svc</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{formatNumber(p.total_providers)} providers</div>
                  </Link>
                )
              })}
            </div>
            {filtered.length > showCount && (
              <div className="text-center mb-8">
                <button onClick={() => setShowCount(s => s + 50)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Show More ({filtered.length - showCount} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          /* Table View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <SortHeader field="total_payments" label="Total Payments" align="right" />
                    <SortHeader field="total_providers" label="Providers" align="right" />
                    <SortHeader field="avg_payment_per_service" label="Avg/Service" align="right" />
                    <SortHeader field="markup_ratio" label="Markup" align="right" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.slice(0, showCount).map((p, i) => {
                    const isHighMarkup = (p.markup_ratio || 0) > 3
                    return (
                      <tr key={p.code} className={`hover:bg-blue-50 transition-colors ${
                        isHighMarkup ? 'bg-orange-50/30' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}>
                        <td className="px-4 py-3">
                          <Link href={`/procedures/${p.code}`} className="text-blue-600 hover:text-blue-800 font-mono font-medium flex items-center gap-1">
                            {p.is_drug && <span title="Drug">💊</span>}
                            {p.code}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-sm max-w-md truncate">{p.description}</td>
                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(p.total_payments)}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{formatNumber(p.total_providers)}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(p.avg_payment_per_service)}</td>
                        <td className="px-4 py-3 text-right">
                          {p.markup_ratio ? (
                            <span className={`font-medium ${
                              p.markup_ratio > 5 ? 'text-red-600' : p.markup_ratio > 3 ? 'text-orange-600' : 'text-gray-600'
                            }`}>
                              {p.markup_ratio.toFixed(1)}x
                              {p.markup_ratio > 3 && ' ⚠️'}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Showing {Math.min(showCount, filtered.length)} of {filtered.length} procedures
              </span>
              {filtered.length > showCount && (
                <button onClick={() => setShowCount(s => s + 50)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Load more →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Related Reading & Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Explore More</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link href="/investigations/most-expensive-medicare-procedures" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">💸 Most Expensive Procedures</div>
              <div className="text-sm text-gray-500">Top 20 by total payments</div>
            </Link>
            <Link href="/investigations/office-visit-economy" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🏥 The Office Visit Economy</div>
              <div className="text-sm text-gray-500">The data behind E&amp;M codes</div>
            </Link>
            <Link href="/investigations/markup-machine" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">📈 The Markup Machine</div>
              <div className="text-sm text-gray-500">Charges vs actual payments</div>
            </Link>
            <Link href="/calculator" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🧮 Cost Calculator</div>
              <div className="text-sm text-gray-500">Estimate procedure costs</div>
            </Link>
            <Link href="/search" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🔍 Search Providers</div>
              <div className="text-sm text-gray-500">Find providers for any procedure</div>
            </Link>
            <Link href="/drug-spending" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">💊 Drug Spending</div>
              <div className="text-sm text-gray-500">Medicare&apos;s pharmaceutical pipeline</div>
            </Link>
          </div>
        </div>

        <SourceCitation />
      </div>
    </main>
  )
}
