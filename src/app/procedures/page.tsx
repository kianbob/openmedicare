'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, BeakerIcon } from '@heroicons/react/24/outline'
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
}

export default function ProceduresPage() {
  const [procedures, setProcedures] = useState<ProcedureData[]>([])
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<'total_payments' | 'total_services' | 'total_providers' | 'avg_payment_per_service'>('total_payments')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [drugFilter, setDrugFilter] = useState<'all' | 'drugs' | 'services'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/procedures.json')
      .then(r => r.json())
      .then(d => { setProcedures(d.procedures || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filtered = procedures
    .filter(p => {
      if (drugFilter === 'drugs' && !p.is_drug) return false
      if (drugFilter === 'services' && p.is_drug) return false
      if (!search) return true
      return p.code.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())
    })
    .sort((a, b) => ((a[sortField] || 0) - (b[sortField] || 0)) * (sortDir === 'asc' ? 1 : -1))

  const SortHeader = ({ field, label, align }: { field: typeof sortField; label: string; align?: string }) => (
    <th className={`px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 select-none ${align === 'right' ? 'text-right' : 'text-left'}`} onClick={() => handleSort(field)}>
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search by code or description..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="flex gap-2">
            {(['all', 'services', 'drugs'] as const).map(f => (
              <button key={f} onClick={() => setDrugFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${drugFilter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {f === 'all' ? 'All' : f === 'drugs' ? '💊 Drugs' : '🩺 Services'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading procedures...</div>
        ) : (
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.slice(0, 100).map((p, i) => (
                    <tr key={p.code} className={`hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-500">
              Showing {Math.min(100, filtered.length)} of {filtered.length} procedures
            </div>
          </div>
        )}

        <SourceCitation />
      </div>
    </main>
  )
}
