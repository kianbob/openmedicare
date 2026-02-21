'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
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

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState<SpecialtyData[]>([])
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<'total_payments' | 'total_providers' | 'markup_ratio'>('total_payments')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/specialties.json')
      .then(r => r.json())
      .then(d => { setSpecialties(d.specialties || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filtered = specialties
    .filter(s => !search || s.specialty.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => ((a[sortField] || 0) - (b[sortField] || 0)) * (sortDir === 'asc' ? 1 : -1))

  const SortHeader = ({ field, label, align }: { field: typeof sortField; label: string; align?: string }) => (
    <th className={`px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 select-none ${align === 'right' ? 'text-right' : 'text-left'}`} onClick={() => handleSort(field)}>
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search specialties..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((s, i) => (
                    <tr key={s.specialty_slug} className={`hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-3">
                        <Link href={`/specialties/${s.specialty_slug}`} className="text-blue-600 hover:text-blue-800 font-medium">{s.specialty}</Link>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(s.total_payments)}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatNumber(s.total_providers)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${(s.markup_ratio || 0) > 5 ? 'text-red-600' : (s.markup_ratio || 0) > 3 ? 'text-orange-600' : 'text-gray-700'}`}>
                          {s.markup_ratio?.toFixed(1)}x
                        </span>
                      </td>
                    </tr>
                  ))}
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
