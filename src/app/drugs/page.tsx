'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
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

interface DrugSpendingData {
  overall_statistics: {
    total_drug_payments_all_years: number
    overall_drug_share: number
    latest_year_drug_share: number
    latest_year: number
  }
  yearly_trends: {
    year: number
    drug_payments: number
    drug_payment_share: number
    drug_avg_payment: number
    drug_codes: number
  }[]
}

type SortField = 'total_payments' | 'total_services' | 'avg_payment_per_service' | 'total_providers'

export default function DrugsPage() {
  const [drugs, setDrugs] = useState<ProcedureData[]>([])
  const [spending, setSpending] = useState<DrugSpendingData | null>(null)
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('total_payments')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)
  const [showCount, setShowCount] = useState(50)

  useEffect(() => {
    Promise.all([
      fetch('/data/procedures.json').then(r => r.json()),
      fetch('/data/drug-spending.json').then(r => r.json()),
    ]).then(([procData, spendData]) => {
      setDrugs((procData.procedures || []).filter((p: ProcedureData) => p.is_drug))
      setSpending(spendData)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filtered = useMemo(() => drugs
    .filter(p => {
      if (!search) return true
      return p.code.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())
    })
    .sort((a, b) => ((a[sortField] || 0) - (b[sortField] || 0)) * (sortDir === 'asc' ? 1 : -1)),
    [drugs, search, sortField, sortDir])

  const stats = spending?.overall_statistics
  const trends = spending?.yearly_trends || []
  const firstYear = trends[0]
  const lastYear = trends[trends.length - 1]
  const growthPct = firstYear && lastYear ? ((lastYear.drug_payments / firstYear.drug_payments - 1) * 100).toFixed(0) : null

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 cursor-pointer hover:text-violet-600 select-none whitespace-nowrap" onClick={() => handleSort(field)}>
      {label} {sortField === field ? (sortDir === 'desc' ? '↓' : '↑') : ''}
    </th>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Drugs', href: '/drugs' }]} />

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Medicare Drug Costs</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Explore Medicare Part B physician-administered drug costs. These are drugs billed through HCPCS J-codes — infusions, injections, and specialty medications administered in doctor&apos;s offices and outpatient settings.
          </p>
        </div>

        {/* Spending Overview */}
        {stats && (
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-violet-900 mb-4">💊 Drug Spending at a Glance</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-violet-600 font-medium">Total Drug Spending (All Years)</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_drug_payments_all_years)}</div>
              </div>
              <div>
                <div className="text-sm text-violet-600 font-medium">Drug Share of Medicare ({stats.latest_year})</div>
                <div className="text-2xl font-bold text-gray-900">{stats.latest_year_drug_share.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-violet-600 font-medium">Spending Growth ({firstYear?.year}–{lastYear?.year})</div>
                <div className="text-2xl font-bold text-gray-900">{growthPct ? `+${growthPct}%` : '—'}</div>
              </div>
              <div>
                <div className="text-sm text-violet-600 font-medium">J-Code Drugs in Database</div>
                <div className="text-2xl font-bold text-gray-900">{drugs.length}</div>
              </div>
            </div>
            {/* Mini trend */}
            {trends.length > 0 && (
              <div className="mt-4 flex items-end gap-1 h-16">
                {trends.map(t => {
                  const maxPay = Math.max(...trends.map(y => y.drug_payments))
                  const h = (t.drug_payments / maxPay) * 100
                  return (
                    <div key={t.year} className="flex-1 flex flex-col items-center group relative">
                      <div className="w-full bg-violet-400 rounded-t opacity-70 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} title={`${t.year}: ${formatCurrency(t.drug_payments)}`} />
                    </div>
                  )
                })}
              </div>
            )}
            {trends.length > 0 && (
              <div className="flex justify-between text-xs text-violet-500 mt-1">
                <span>{firstYear?.year}</span>
                <span>{lastYear?.year}</span>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search drugs by code or name..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
          </div>
          <div className="mt-2 text-sm text-gray-500">{filtered.length} drugs found</div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading drug data...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Drug Name</th>
                    <SortHeader field="total_payments" label="Total Payments" />
                    <SortHeader field="avg_payment_per_service" label="Avg/Service" />
                    <SortHeader field="total_services" label="Services" />
                    <SortHeader field="total_providers" label="Providers" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.slice(0, showCount).map((p, i) => (
                    <tr key={p.code} className={`hover:bg-violet-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-3">
                        <Link href={`/procedures/${p.code}`} className="text-violet-600 hover:text-violet-800 font-mono font-medium">
                          💊 {p.code}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm max-w-md truncate">{p.description}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(p.total_payments)}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(p.avg_payment_per_service)}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatNumber(p.total_services)}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatNumber(p.total_providers)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Showing {Math.min(showCount, filtered.length)} of {filtered.length} drugs
              </span>
              {filtered.length > showCount && (
                <button onClick={() => setShowCount(s => s + 50)}
                  className="text-sm text-violet-600 hover:text-violet-800 font-medium">
                  Load more →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Info note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-8">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Drug costs shown are Medicare Part B physician-administered drugs billed through HCPCS J-codes. This does not include Part D retail pharmacy drugs. Costs represent Medicare allowed amounts paid to providers for drug administration in clinical settings.
          </p>
        </div>

        {/* Related */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/drug-spending" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-violet-600">📊 Drug Spending Trends</div>
              <div className="text-sm text-gray-500">Year-over-year analysis</div>
            </Link>
            <Link href="/procedures" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-violet-600">🩺 All Procedures</div>
              <div className="text-sm text-gray-500">Browse 500 procedures & drugs</div>
            </Link>
            <Link href="/investigations/markup-machine" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-violet-600">📈 The Markup Machine</div>
              <div className="text-sm text-gray-500">Charges vs actual payments</div>
            </Link>
          </div>
        </div>

        <SourceCitation />
      </div>
    </main>
  )
}
