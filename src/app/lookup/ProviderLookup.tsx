'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { formatCurrency, formatNumber } from '@/lib/format'

interface Provider {
  npi: string
  name: string
  specialty: string
  city?: string
  state: string
  total_payments: number
  total_services: number
  total_beneficiaries: number
  markup_ratio: number
  watchlist: boolean
  fraud_probability: number | null
  entity_type?: string
}

function riskBadge(p: Provider) {
  if (p.fraud_probability && p.fraud_probability >= 0.86) {
    return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-300">🤖 AI-Flagged ({(p.fraud_probability * 100).toFixed(0)}%)</span>
  }
  if (p.watchlist) {
    return <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">📊 Watchlist</span>
  }
  return <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-300">Listed</span>
}

function detailLink(p: Provider) {
  if (p.fraud_probability && p.fraud_probability >= 0.86) return '/fraud/still-out-there'
  if (p.watchlist) return '/fraud/watchlist'
  return '/fraud/still-out-there'
}

export default function ProviderLookup() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/data/all-providers.json').then(r => r.json()),
      fetch('/data/watchlist.json').then(r => r.json()),
    ]).then(([allProviders, watchlist]) => {
      // Merge: all-providers already has watchlist field, but let's ensure watchlist NPIs are marked
      const watchlistNpis = new Set((watchlist as any[]).map(w => String(w.npi)))
      const merged = (allProviders as Provider[]).map(p => ({
        ...p,
        npi: String(p.npi),
        watchlist: p.watchlist || watchlistNpis.has(String(p.npi)),
      }))
      setProviders(merged)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const results = useMemo(() => {
    if (search.length < 2) return []
    const q = search.toLowerCase().trim()
    const isNpi = /^\d+$/.test(q)
    return providers.filter(p => {
      if (isNpi) return p.npi.includes(q)
      return p.name.toLowerCase().includes(q)
    }).slice(0, 20)
  }, [search, providers])

  const showNoResults = search.length >= 3 && results.length === 0 && !loading

  return (
    <div>
      {/* Search box */}
      <div className="relative -mt-14 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <label htmlFor="provider-search" className="block text-sm font-medium text-gray-700 mb-2">
            Search by provider name or NPI number
          </label>
          <div className="relative">
            <input
              id="provider-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="e.g. John Smith or 1234567890"
              className="w-full text-lg px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-red-500 focus:outline-none transition-colors"
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          {loading && <p className="text-sm text-gray-500 mt-2">Loading provider database...</p>}
          {!loading && <p className="text-xs text-gray-400 mt-2">{formatNumber(providers.length)} providers in database • Results appear as you type</p>}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 font-medium">{results.length}{results.length === 20 ? '+' : ''} result{results.length !== 1 ? 's' : ''} found</p>
          {results.map(p => (
            <div key={p.npi} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-500">NPI: {p.npi} • {p.specialty}</p>
                </div>
                {riskBadge(p)}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">State</span>
                  <p className="font-semibold">{p.state}{p.city ? `, ${p.city}` : ''}</p>
                </div>
                <div>
                  <span className="text-gray-500">Total Payments</span>
                  <p className="font-semibold">{formatCurrency(p.total_payments)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Services</span>
                  <p className="font-semibold">{formatNumber(p.total_services)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Beneficiaries</span>
                  <p className="font-semibold">{formatNumber(p.total_beneficiaries)}</p>
                </div>
              </div>
              {p.fraud_probability && p.fraud_probability >= 0.86 && (
                <div className="mt-3 bg-red-50 rounded p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${p.fraud_probability * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-red-800">{(p.fraud_probability * 100).toFixed(1)}% fraud probability</span>
                  </div>
                </div>
              )}
              <div className="mt-3">
                <Link href={detailLink(p)} className="text-sm text-red-600 hover:text-red-800 font-medium">
                  View full analysis →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Not found - good news */}
      {showNoResults && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">
            Good news! &ldquo;{search}&rdquo; is not on any of our flagged lists.
          </h3>
          <p className="text-green-700 max-w-lg mx-auto">
            This provider does not appear in our ML-flagged list, statistical watchlist, or LEIE
            exclusion database. However, this does <strong>not guarantee</strong> the absence of
            billing irregularities — our analysis covers a specific subset of Medicare data.
          </p>
          <p className="text-sm text-green-600 mt-4">
            Our database includes {formatNumber(providers.length)} providers flagged through various methodologies.
            Over 1.2 million Medicare providers are <em>not</em> on any list.
          </p>
        </div>
      )}

      {/* Empty state */}
      {search.length > 0 && search.length < 2 && (
        <p className="text-center text-gray-400 text-sm">Type at least 2 characters to search...</p>
      )}
    </div>
  )
}
