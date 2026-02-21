'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

type TabMode = 'providers' | 'states' | 'specialties'

interface Provider {
  npi: string
  name: string
  specialty: string
  state: string
  total_payments: number
  total_services: number
  total_beneficiaries: number
  avg_payment_per_service: number
  entity_type: string
  credentials: string
}

interface WatchlistProvider {
  npi: number
  name: string
  specialty: string
  state: string
  total_payments: number
  total_services: number
  total_beneficiaries: number
  avg_markup: number
  risk_score: number
  flags: { type: string; description: string; severity: string }[]
}

interface StateData {
  state: string
  state_name: string
  total_payments: number
  total_services: number
  total_providers: number
  total_beneficiaries: number
  avg_payment_per_provider: number
  markup_ratio: number
  payment_share: number
}

interface SpecialtyData {
  specialty: string
  specialty_slug: string
  total_payments: number
  total_services: number
  total_providers: number
  avg_payment_per_provider: number
  markup_ratio: number
  payment_share: number
}

const TABS: { key: TabMode; label: string }[] = [
  { key: 'providers', label: 'Compare Providers' },
  { key: 'states', label: 'Compare States' },
  { key: 'specialties', label: 'Compare Specialties' },
]

export default function ComparePage() {
  const [tab, setTab] = useState<TabMode>('providers')
  const [providers, setProviders] = useState<Provider[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistProvider[]>([])
  const [states, setStates] = useState<StateData[]>([])
  const [specialties, setSpecialties] = useState<SpecialtyData[]>([])
  const [loading, setLoading] = useState(true)

  // Selections
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/data/top-providers.json').then(r => r.json()),
      fetch('/data/watchlist.json').then(r => r.json()),
      fetch('/data/states.json').then(r => r.json()),
      fetch('/data/specialties.json').then(r => r.json()),
    ]).then(([p, w, s, sp]) => {
      setProviders(p.providers || [])
      setWatchlist(Array.isArray(w) ? w : [])
      setStates(s.states || [])
      setSpecialties(sp.specialties || [])
      setLoading(false)
    })
  }, [])

  const watchlistMap = useMemo(() => {
    const m = new Map<number, WatchlistProvider>()
    watchlist.forEach(w => m.set(w.npi, w))
    return m
  }, [watchlist])

  const filteredProviders = useMemo(() => {
    if (!searchQuery.trim()) return providers.slice(0, 50)
    const q = searchQuery.toLowerCase()
    return providers.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.npi.toString().includes(q) ||
      p.specialty.toLowerCase().includes(q)
    ).slice(0, 50)
  }, [providers, searchQuery])

  const filteredStates = useMemo(() => {
    if (!searchQuery.trim()) return states
    const q = searchQuery.toLowerCase()
    return states.filter(s => s.state_name.toLowerCase().includes(q) || s.state.toLowerCase().includes(q))
  }, [states, searchQuery])

  const filteredSpecialties = useMemo(() => {
    if (!searchQuery.trim()) return specialties.slice(0, 50)
    const q = searchQuery.toLowerCase()
    return specialties.filter(s => s.specialty.toLowerCase().includes(q)).slice(0, 50)
  }, [specialties, searchQuery])

  const selectedProviderData = useMemo(() =>
    selectedProviders.map(npi => providers.find(p => p.npi === npi)).filter(Boolean) as Provider[],
    [selectedProviders, providers]
  )

  const selectedStateData = useMemo(() =>
    selectedStates.map(code => states.find(s => s.state === code)).filter(Boolean) as StateData[],
    [selectedStates, states]
  )

  const selectedSpecialtyData = useMemo(() =>
    selectedSpecialties.map(slug => specialties.find(s => s.specialty_slug === slug)).filter(Boolean) as SpecialtyData[],
    [selectedSpecialties, specialties]
  )

  function toggleProvider(npi: string) {
    setSelectedProviders(prev =>
      prev.includes(npi) ? prev.filter(p => p !== npi) : prev.length >= 3 ? prev : [...prev, npi]
    )
  }

  function toggleState(code: string) {
    setSelectedStates(prev =>
      prev.includes(code) ? prev.filter(s => s !== code) : prev.length >= 3 ? prev : [...prev, code]
    )
  }

  function toggleSpecialty(slug: string) {
    setSelectedSpecialties(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : prev.length >= 3 ? prev : [...prev, slug]
    )
  }

  function getFlaggedCount(stateCode: string) {
    return watchlist.filter(w => w.state === stateCode).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <Breadcrumbs items={[{ name: 'Compare' }]} />

        <h1 className="mt-8 font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Compare Medicare Data
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Side-by-side comparison of providers, states, and specialties.
        </p>

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-200">
          <nav className="flex gap-x-8">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setSearchQuery('') }}
                className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${
                  tab === t.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Search */}
        <div className="mt-6">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              tab === 'providers' ? 'Search providers by name, NPI, or specialty...' :
              tab === 'states' ? 'Search states...' :
              'Search specialties...'
            }
            className="block w-full max-w-lg rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <p className="mt-2 text-sm text-gray-500">Select up to 3 items to compare</p>
        </div>

        {/* Selection List */}
        <div className="mt-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
          {tab === 'providers' && filteredProviders.map(p => (
            <button
              key={p.npi}
              onClick={() => toggleProvider(p.npi)}
              className={`w-full text-left px-4 py-2 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center text-sm ${
                selectedProviders.includes(p.npi) ? 'bg-blue-50' : ''
              }`}
            >
              <div>
                <span className="font-medium">{p.name}</span>
                <span className="text-gray-500 ml-2">{p.specialty} · {p.state}</span>
              </div>
              <span className="text-gray-500">{formatCurrency(p.total_payments)}</span>
            </button>
          ))}
          {tab === 'states' && filteredStates.map(s => (
            <button
              key={s.state}
              onClick={() => toggleState(s.state)}
              className={`w-full text-left px-4 py-2 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center text-sm ${
                selectedStates.includes(s.state) ? 'bg-blue-50' : ''
              }`}
            >
              <span className="font-medium">{s.state_name} ({s.state})</span>
              <span className="text-gray-500">{formatCurrency(s.total_payments)}</span>
            </button>
          ))}
          {tab === 'specialties' && filteredSpecialties.map(s => (
            <button
              key={s.specialty_slug}
              onClick={() => toggleSpecialty(s.specialty_slug)}
              className={`w-full text-left px-4 py-2 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center text-sm ${
                selectedSpecialties.includes(s.specialty_slug) ? 'bg-blue-50' : ''
              }`}
            >
              <span className="font-medium">{s.specialty}</span>
              <span className="text-gray-500">{formatCurrency(s.total_payments)}</span>
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        {tab === 'providers' && selectedProviderData.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Provider Comparison</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                  {selectedProviderData.map(p => (
                    <th key={p.npi} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      <Link href={`/providers/${p.npi}`} className="text-blue-600 hover:underline">
                        {p.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Specialty</td>
                  {selectedProviderData.map(p => <td key={p.npi} className="px-4 py-3 text-sm text-gray-700">{p.specialty}</td>)}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">State</td>
                  {selectedProviderData.map(p => <td key={p.npi} className="px-4 py-3 text-sm text-gray-700">{p.state}</td>)}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Total Payments</td>
                  {selectedProviderData.map(p => <td key={p.npi} className="px-4 py-3 text-sm text-gray-700 font-semibold">{formatCurrency(p.total_payments)}</td>)}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Total Services</td>
                  {selectedProviderData.map(p => <td key={p.npi} className="px-4 py-3 text-sm text-gray-700">{formatNumber(p.total_services)}</td>)}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Total Beneficiaries</td>
                  {selectedProviderData.map(p => <td key={p.npi} className="px-4 py-3 text-sm text-gray-700">{formatNumber(p.total_beneficiaries)}</td>)}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Avg Payment/Service</td>
                  {selectedProviderData.map(p => <td key={p.npi} className="px-4 py-3 text-sm text-gray-700">${p.avg_payment_per_service?.toFixed(2) ?? 'N/A'}</td>)}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Markup</td>
                  {selectedProviderData.map(p => {
                    const w = watchlistMap.get(parseInt(p.npi))
                    return <td key={p.npi} className="px-4 py-3 text-sm text-gray-700">{w ? `${w.avg_markup.toFixed(1)}x` : 'N/A'}</td>
                  })}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Risk Score</td>
                  {selectedProviderData.map(p => {
                    const w = watchlistMap.get(parseInt(p.npi))
                    return (
                      <td key={p.npi} className="px-4 py-3 text-sm">
                        {w ? (
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            w.risk_score >= 80 ? 'bg-red-100 text-red-800' :
                            w.risk_score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {w.risk_score}
                          </span>
                        ) : <span className="text-gray-400">N/A</span>}
                      </td>
                    )
                  })}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Flags</td>
                  {selectedProviderData.map(p => {
                    const w = watchlistMap.get(parseInt(p.npi))
                    return (
                      <td key={p.npi} className="px-4 py-3 text-sm text-gray-700">
                        {w?.flags?.length ? w.flags.map((f, i) => (
                          <span key={i} className="inline-block bg-gray-100 rounded px-2 py-0.5 text-xs mr-1 mb-1">{f.description}</span>
                        )) : <span className="text-gray-400">None</span>}
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {tab === 'states' && selectedStateData.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">State Comparison</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                  {selectedStateData.map(s => (
                    <th key={s.state} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      <Link href={`/states/${s.state}`} className="text-blue-600 hover:underline">{s.state_name}</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Total Payments</td>
                  {selectedStateData.map(s => <td key={s.state} className="px-4 py-3 text-sm font-semibold text-gray-700">{formatCurrency(s.total_payments)}</td>)}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Total Providers</td>
                  {selectedStateData.map(s => <td key={s.state} className="px-4 py-3 text-sm text-gray-700">{formatNumber(s.total_providers)}</td>)}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Avg Payment/Provider</td>
                  {selectedStateData.map(s => <td key={s.state} className="px-4 py-3 text-sm text-gray-700">{formatCurrency(s.avg_payment_per_provider)}</td>)}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Markup Ratio</td>
                  {selectedStateData.map(s => <td key={s.state} className="px-4 py-3 text-sm text-gray-700">{s.markup_ratio.toFixed(2)}x</td>)}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Payment Share</td>
                  {selectedStateData.map(s => <td key={s.state} className="px-4 py-3 text-sm text-gray-700">{s.payment_share.toFixed(1)}%</td>)}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Flagged Providers</td>
                  {selectedStateData.map(s => <td key={s.state} className="px-4 py-3 text-sm text-gray-700">{getFlaggedCount(s.state)}</td>)}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Total Services</td>
                  {selectedStateData.map(s => <td key={s.state} className="px-4 py-3 text-sm text-gray-700">{formatNumber(s.total_services)}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {tab === 'specialties' && selectedSpecialtyData.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Specialty Comparison</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                  {selectedSpecialtyData.map(s => (
                    <th key={s.specialty_slug} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      <Link href={`/specialties/${s.specialty_slug}`} className="text-blue-600 hover:underline">{s.specialty}</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Total Payments</td>
                  {selectedSpecialtyData.map(s => <td key={s.specialty_slug} className="px-4 py-3 text-sm font-semibold text-gray-700">{formatCurrency(s.total_payments)}</td>)}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Total Providers</td>
                  {selectedSpecialtyData.map(s => <td key={s.specialty_slug} className="px-4 py-3 text-sm text-gray-700">{formatNumber(s.total_providers)}</td>)}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Avg Payment/Provider</td>
                  {selectedSpecialtyData.map(s => <td key={s.specialty_slug} className="px-4 py-3 text-sm text-gray-700">{formatCurrency(s.avg_payment_per_provider)}</td>)}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Markup Ratio</td>
                  {selectedSpecialtyData.map(s => <td key={s.specialty_slug} className="px-4 py-3 text-sm text-gray-700">{s.markup_ratio.toFixed(2)}x</td>)}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Payment Share</td>
                  {selectedSpecialtyData.map(s => <td key={s.specialty_slug} className="px-4 py-3 text-sm text-gray-700">{s.payment_share.toFixed(1)}%</td>)}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Total Services</td>
                  {selectedSpecialtyData.map(s => <td key={s.specialty_slug} className="px-4 py-3 text-sm text-gray-700">{formatNumber(s.total_services)}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {((tab === 'providers' && !selectedProviderData.length) ||
          (tab === 'states' && !selectedStateData.length) ||
          (tab === 'specialties' && !selectedSpecialtyData.length)) && (
          <div className="mt-12 text-center py-12 text-gray-400">
            <p className="text-lg">Select items above to compare them side by side</p>
          </div>
        )}

        {/* ML Analysis link */}
        <div className="mt-12 rounded-xl bg-gray-50 border border-gray-200 p-5 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">🤖 Want to see which providers our AI flagged?</p>
            <p className="text-xs text-gray-500 mt-1">ML model scored 1.72M providers — 500 flagged for fraud risk</p>
          </div>
          <Link href="/fraud/still-out-there" className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap">
            View ML Results →
          </Link>
        </div>

        <div className="mt-12">
          <ShareButtons url="https://www.openmedicare.org/compare" title="Compare Medicare Data" />
        </div>
        <div className="mt-8">
          <SourceCitation />
        </div>
      </div>
    </div>
  )
}
