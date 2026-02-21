'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

interface Provider {
  npi: number
  name: string
  specialty: string
  state: string
  total_payments: number
  total_services: number
}

export default function LookupPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/top-providers.json')
      .then(r => r.json())
      .then(d => { setProviders(d.providers || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const results = search.length >= 2
    ? providers.filter(p => {
        const q = search.toLowerCase()
        return p.name?.toLowerCase().includes(q) || String(p.npi).includes(q) || p.specialty?.toLowerCase().includes(q) || p.state?.toLowerCase().includes(q)
      }).slice(0, 25)
    : []

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Provider Lookup', href: '/lookup' }]} />
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Provider Lookup</h1>
        <p className="text-lg text-gray-600 mb-8">Search for any Medicare provider by name, NPI number, specialty, or state to see their payment details.</p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search by provider name, NPI, specialty, or state..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" />
          </div>
          {loading && <p className="text-sm text-gray-400 mt-2">Loading provider database...</p>}
          {!loading && search.length >= 2 && <p className="text-sm text-gray-500 mt-2">{results.length} result{results.length !== 1 ? 's' : ''} found</p>}
        </div>

        {results.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {results.map(p => (
                <Link key={p.npi} href={`/providers/${p.npi}`} className="flex items-center justify-between px-6 py-4 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 rounded-full p-2">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="text-sm text-gray-500">{p.specialty} · {p.state} · NPI: {p.npi}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{formatCurrency(p.total_payments)}</div>
                    <div className="text-sm text-gray-500">{formatNumber(p.total_services)} services</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {search.length >= 2 && results.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
            <p className="text-lg mb-2">No providers found matching &quot;{search}&quot;</p>
            <p className="text-sm">Try searching by name, NPI number, specialty, or state abbreviation. Our database includes the top Medicare providers by total payments.</p>
          </div>
        )}

        {search.length < 2 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
            <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>Type at least 2 characters to search</p>
          </div>
        )}

        <SourceCitation />
      </div>
    </main>
  )
}
