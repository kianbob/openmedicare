'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

type TabMode = 'providers' | 'states' | 'specialties' | 'flagged-vs-clean'

interface Provider {
  npi: string; name: string; specialty: string; state: string
  total_payments: number; total_services: number; total_beneficiaries: number
  avg_payment_per_service: number; entity_type: string; credentials: string
}

interface FlaggedProvider {
  npi: string; name: string; specialty: string; state: string
  total_payments: number; total_services: number; total_beneficiaries: number
  fraud_probability: number; risk_rank: number; markup_ratio: number; services_per_bene: number
  top_risk_factors: string[]
}

interface WatchlistProvider {
  npi: number; name: string; specialty: string; state: string
  total_payments: number; total_services: number; total_beneficiaries: number
  avg_markup: number; risk_score: number; flags: { type: string; description: string; severity: string }[]
}

interface StateData {
  state: string; state_name: string; total_payments: number; total_services: number
  total_providers: number; total_beneficiaries: number; avg_payment_per_provider: number
  markup_ratio: number; payment_share: number
}

interface SpecialtyData {
  specialty: string; specialty_slug: string; total_payments: number; total_services: number
  total_providers: number; avg_payment_per_provider: number; markup_ratio: number; payment_share: number
}

const TABS: { key: TabMode; label: string; icon: string }[] = [
  { key: 'states', label: 'States', icon: '🗺️' },
  { key: 'providers', label: 'Providers', icon: '👨‍⚕️' },
  { key: 'specialties', label: 'Specialties', icon: '🏥' },
  { key: 'flagged-vs-clean', label: 'AI-Flagged vs Clean', icon: '🤖' },
]

interface QuickComparison {
  label: string; tab: TabMode; items: string[]; description: string
}

const QUICK_COMPARISONS: QuickComparison[] = [
  { label: 'California vs Florida vs Texas', tab: 'states', items: ['CA', 'FL', 'TX'], description: 'The three biggest Medicare states' },
  { label: 'New York vs California', tab: 'states', items: ['NY', 'CA'], description: 'East vs West coast Medicare spending' },
  { label: 'AI-Flagged vs Clean Providers', tab: 'flagged-vs-clean', items: [], description: 'How do AI-flagged providers compare to normal?' },
]

export default function ComparePage() {
  const [tab, setTab] = useState<TabMode>('states')
  const [providers, setProviders] = useState<Provider[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistProvider[]>([])
  const [flagged, setFlagged] = useState<FlaggedProvider[]>([])
  const [states, setStates] = useState<StateData[]>([])
  const [specialties, setSpecialties] = useState<SpecialtyData[]>([])
  const [loading, setLoading] = useState(true)

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
      fetch('/data/ml-v2-results.json').then(r => r.json()),
    ]).then(([p, w, s, sp, ml]) => {
      setProviders(p.providers || [])
      setWatchlist(Array.isArray(w) ? w : [])
      setStates(s.states || [])
      setSpecialties(sp.specialties || [])
      setFlagged(ml.still_out_there || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const watchlistMap = useMemo(() => {
    const m = new Map<number, WatchlistProvider>()
    watchlist.forEach(w => m.set(w.npi, w))
    return m
  }, [watchlist])

  // Flagged vs Clean stats
  const flaggedVsClean = useMemo(() => {
    if (!flagged.length || !providers.length) return null
    const flaggedNpis = new Set(flagged.map(f => String(f.npi)))
    const cleanProviders = providers.filter(p => !flaggedNpis.has(String(p.npi)))

    const avgFlaggedPayments = flagged.reduce((s, f) => s + f.total_payments, 0) / flagged.length
    const avgCleanPayments = cleanProviders.length ? cleanProviders.reduce((s, p) => s + p.total_payments, 0) / cleanProviders.length : 0
    const avgFlaggedServices = flagged.reduce((s, f) => s + f.total_services, 0) / flagged.length
    const avgCleanServices = cleanProviders.length ? cleanProviders.reduce((s, p) => s + p.total_services, 0) / cleanProviders.length : 0
    const avgFlaggedBene = flagged.reduce((s, f) => s + f.total_beneficiaries, 0) / flagged.length
    const avgCleanBene = cleanProviders.length ? cleanProviders.reduce((s, p) => s + p.total_beneficiaries, 0) / cleanProviders.length : 0
    const avgFlaggedMarkup = flagged.reduce((s, f) => s + (f.markup_ratio || 0), 0) / flagged.length
    const avgFlaggedFraudProb = flagged.reduce((s, f) => s + f.fraud_probability, 0) / flagged.length
    const totalFlaggedPayments = flagged.reduce((s, f) => s + f.total_payments, 0)

    return {
      flaggedCount: flagged.length,
      cleanCount: cleanProviders.length,
      avgFlaggedPayments, avgCleanPayments,
      avgFlaggedServices, avgCleanServices,
      avgFlaggedBene, avgCleanBene,
      avgFlaggedMarkup,
      avgFlaggedFraudProb,
      totalFlaggedPayments,
      paymentMultiplier: avgCleanPayments > 0 ? avgFlaggedPayments / avgCleanPayments : 0,
      serviceMultiplier: avgCleanServices > 0 ? avgFlaggedServices / avgCleanServices : 0,
    }
  }, [flagged, providers])

  function applyQuickComparison(qc: QuickComparison) {
    setTab(qc.tab)
    setSearchQuery('')
    if (qc.tab === 'states') setSelectedStates(qc.items)
    else if (qc.tab === 'providers') setSelectedProviders(qc.items)
    else if (qc.tab === 'specialties') setSelectedSpecialties(qc.items)
  }

  const filteredProviders = useMemo(() => {
    if (!searchQuery.trim()) return providers.slice(0, 50)
    const q = searchQuery.toLowerCase()
    return providers.filter(p => p.name.toLowerCase().includes(q) || p.npi.toString().includes(q) || p.specialty.toLowerCase().includes(q)).slice(0, 50)
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

  const selectedProviderData = useMemo(() => selectedProviders.map(npi => providers.find(p => p.npi === npi)).filter(Boolean) as Provider[], [selectedProviders, providers])
  const selectedStateData = useMemo(() => selectedStates.map(code => states.find(s => s.state === code)).filter(Boolean) as StateData[], [selectedStates, states])
  const selectedSpecialtyData = useMemo(() => selectedSpecialties.map(slug => specialties.find(s => s.specialty_slug === slug)).filter(Boolean) as SpecialtyData[], [selectedSpecialties, specialties])

  function toggleProvider(npi: string) { setSelectedProviders(prev => prev.includes(npi) ? prev.filter(p => p !== npi) : prev.length >= 3 ? prev : [...prev, npi]) }
  function toggleState(code: string) { setSelectedStates(prev => prev.includes(code) ? prev.filter(s => s !== code) : prev.length >= 3 ? prev : [...prev, code]) }
  function toggleSpecialty(slug: string) { setSelectedSpecialties(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : prev.length >= 3 ? prev : [...prev, slug]) }
  function getFlaggedCount(stateCode: string) { return watchlist.filter(w => w.state === stateCode).length }

  if (loading) return (
    <div className="min-h-screen bg-white"><div className="mx-auto max-w-7xl px-6 py-16"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/3" /><div className="h-64 bg-gray-200 rounded" /></div></div></div>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <Breadcrumbs items={[{ name: 'Compare' }]} />

        <h1 className="mt-8 font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Compare Medicare Data</h1>
        <p className="mt-4 text-lg text-gray-600">Side-by-side comparison of providers, states, specialties — plus AI fraud analysis.</p>

        {/* Quick Comparisons */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">⚡ Quick Comparisons</h2>
          <div className="flex flex-wrap gap-3">
            {QUICK_COMPARISONS.map(qc => (
              <button
                key={qc.label}
                onClick={() => applyQuickComparison(qc)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-colors text-left"
              >
                <div className="text-sm font-semibold text-gray-900">{qc.label}</div>
                <div className="text-xs text-gray-500">{qc.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-200">
          <nav className="flex gap-x-6 overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setSearchQuery('') }}
                className={`pb-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Flagged vs Clean mode */}
        {tab === 'flagged-vs-clean' && flaggedVsClean && (
          <div className="mt-8 space-y-8">
            <div className="rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🤖 AI-Flagged vs Clean Providers</h2>
              <p className="text-gray-600">
                Our ML model flagged {flaggedVsClean.flaggedCount} providers out of 1.72M scored.
                Here&apos;s how they compare to the rest.
              </p>
            </div>

            {/* Key stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCompareCard
                label="Avg Medicare Payments"
                flaggedValue={formatCurrency(flaggedVsClean.avgFlaggedPayments)}
                cleanValue={formatCurrency(flaggedVsClean.avgCleanPayments)}
                multiplier={`${flaggedVsClean.paymentMultiplier.toFixed(1)}x more`}
                severity="high"
              />
              <StatCompareCard
                label="Avg Services Billed"
                flaggedValue={formatNumber(Math.round(flaggedVsClean.avgFlaggedServices))}
                cleanValue={formatNumber(Math.round(flaggedVsClean.avgCleanServices))}
                multiplier={`${flaggedVsClean.serviceMultiplier.toFixed(1)}x more`}
                severity="high"
              />
              <StatCompareCard
                label="Avg Fraud Probability"
                flaggedValue={`${(flaggedVsClean.avgFlaggedFraudProb * 100).toFixed(0)}%`}
                cleanValue="< 1%"
                multiplier="Model confidence"
                severity="critical"
              />
            </div>

            {/* Visual bar comparison */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Distribution</h3>
              <div className="space-y-6">
                <CompareBar label="Avg Payments" flaggedVal={flaggedVsClean.avgFlaggedPayments} cleanVal={flaggedVsClean.avgCleanPayments} format="currency" />
                <CompareBar label="Avg Services" flaggedVal={flaggedVsClean.avgFlaggedServices} cleanVal={flaggedVsClean.avgCleanServices} format="number" />
                <CompareBar label="Avg Beneficiaries" flaggedVal={flaggedVsClean.avgFlaggedBene} cleanVal={flaggedVsClean.avgCleanBene} format="number" />
                <CompareBar label="Avg Markup Ratio" flaggedVal={flaggedVsClean.avgFlaggedMarkup} cleanVal={1.5} format="ratio" />
              </div>
            </div>

            {/* Total impact */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-sm text-red-600 font-medium uppercase tracking-wide">Total Payments to AI-Flagged Providers</p>
              <p className="text-4xl font-bold text-red-700 mt-2">{formatCurrency(flaggedVsClean.totalFlaggedPayments)}</p>
              <p className="text-sm text-gray-600 mt-2">across {flaggedVsClean.flaggedCount} providers who matched fraud patterns</p>
              <Link href="/fraud/still-out-there" className="inline-flex items-center mt-4 text-sm font-medium text-red-700 hover:text-red-800">
                View all flagged providers →
              </Link>
            </div>
          </div>
        )}

        {/* Search & selection for other tabs */}
        {tab !== 'flagged-vs-clean' && (
          <>
            <div className="mt-6">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={
                  tab === 'providers' ? 'Search providers by name, NPI, or specialty...' :
                  tab === 'states' ? 'Search states...' : 'Search specialties...'
                }
                className="block w-full max-w-lg rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-2 text-sm text-gray-500">Select up to 3 items to compare</p>
            </div>

            <div className="mt-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {tab === 'providers' && filteredProviders.map(p => {
                const isFlagged = watchlistMap.has(parseInt(p.npi))
                return (
                  <button key={p.npi} onClick={() => toggleProvider(p.npi)}
                    className={`w-full text-left px-4 py-2 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center text-sm ${selectedProviders.includes(p.npi) ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{p.name}</span>
                      {isFlagged && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold">⚠️ Flagged</span>}
                      <span className="text-gray-500">{p.specialty} · {p.state}</span>
                    </div>
                    <span className="text-gray-500">{formatCurrency(p.total_payments)}</span>
                  </button>
                )
              })}
              {tab === 'states' && filteredStates.map(s => (
                <button key={s.state} onClick={() => toggleState(s.state)}
                  className={`w-full text-left px-4 py-2 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center text-sm ${selectedStates.includes(s.state) ? 'bg-blue-50' : ''}`}>
                  <span className="font-medium">{s.state_name} ({s.state})</span>
                  <span className="text-gray-500">{formatCurrency(s.total_payments)}</span>
                </button>
              ))}
              {tab === 'specialties' && filteredSpecialties.map(s => (
                <button key={s.specialty_slug} onClick={() => toggleSpecialty(s.specialty_slug)}
                  className={`w-full text-left px-4 py-2 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center text-sm ${selectedSpecialties.includes(s.specialty_slug) ? 'bg-blue-50' : ''}`}>
                  <span className="font-medium">{s.specialty}</span>
                  <span className="text-gray-500">{formatCurrency(s.total_payments)}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Comparison Tables with visual bars */}
        {tab === 'providers' && selectedProviderData.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Provider Comparison</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                    {selectedProviderData.map(p => (
                      <th key={p.npi} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        <Link href={`/providers/${p.npi}`} className="text-blue-600 hover:underline">{p.name}</Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { label: 'Specialty', render: (p: Provider) => p.specialty },
                    { label: 'State', render: (p: Provider) => p.state },
                    { label: 'Total Payments', render: (p: Provider) => formatCurrency(p.total_payments), bold: true },
                    { label: 'Total Services', render: (p: Provider) => formatNumber(p.total_services) },
                    { label: 'Total Beneficiaries', render: (p: Provider) => formatNumber(p.total_beneficiaries) },
                    { label: 'Avg Payment/Service', render: (p: Provider) => `$${p.avg_payment_per_service?.toFixed(2) ?? 'N/A'}` },
                    { label: 'Markup', render: (p: Provider) => { const w = watchlistMap.get(parseInt(p.npi)); return w ? `${w.avg_markup.toFixed(1)}x` : 'N/A' } },
                    { label: 'Risk Score', render: (p: Provider) => {
                      const w = watchlistMap.get(parseInt(p.npi))
                      if (!w) return <span className="text-gray-400">N/A</span>
                      return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${w.risk_score >= 80 ? 'bg-red-100 text-red-800' : w.risk_score >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{w.risk_score}</span>
                    }},
                  ].map((row, i) => (
                    <tr key={row.label} className={i % 2 ? 'bg-gray-50' : ''}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.label}</td>
                      {selectedProviderData.map(p => (
                        <td key={p.npi} className={`px-4 py-3 text-sm text-gray-700 ${row.bold ? 'font-semibold' : ''}`}>{row.render(p)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Visual bars for payments */}
            <div className="mt-6 space-y-3">
              {selectedProviderData.map(p => {
                const max = Math.max(...selectedProviderData.map(x => x.total_payments))
                const pct = max > 0 ? (p.total_payments / max) * 100 : 0
                return (
                  <div key={p.npi} className="flex items-center gap-3">
                    <div className="w-32 text-sm font-medium text-gray-700 truncate">{p.name.split(' ').slice(-1)[0]}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold transition-all" style={{ width: `${Math.max(pct, 8)}%` }}>
                        {formatCurrency(p.total_payments)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {tab === 'states' && selectedStateData.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">State Comparison</h2>
            <div className="overflow-x-auto">
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
                  {[
                    { label: 'Total Payments', render: (s: StateData) => formatCurrency(s.total_payments), bold: true },
                    { label: 'Total Providers', render: (s: StateData) => formatNumber(s.total_providers) },
                    { label: 'Avg Payment/Provider', render: (s: StateData) => formatCurrency(s.avg_payment_per_provider) },
                    { label: 'Markup Ratio', render: (s: StateData) => `${s.markup_ratio.toFixed(2)}x` },
                    { label: 'Payment Share', render: (s: StateData) => `${s.payment_share.toFixed(1)}%` },
                    { label: 'Flagged Providers', render: (s: StateData) => {
                      const count = getFlaggedCount(s.state)
                      return count > 0 ? <span className="text-red-600 font-semibold">{count}</span> : '0'
                    }},
                    { label: 'Total Services', render: (s: StateData) => formatNumber(s.total_services) },
                  ].map((row, i) => (
                    <tr key={row.label} className={i % 2 ? 'bg-gray-50' : ''}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.label}</td>
                      {selectedStateData.map(s => (
                        <td key={s.state} className={`px-4 py-3 text-sm text-gray-700 ${row.bold ? 'font-semibold' : ''}`}>{row.render(s)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Visual bars */}
            <div className="mt-6 space-y-3">
              {selectedStateData.map(s => {
                const max = Math.max(...selectedStateData.map(x => x.total_payments))
                const pct = max > 0 ? (s.total_payments / max) * 100 : 0
                return (
                  <div key={s.state} className="flex items-center gap-3">
                    <div className="w-32 text-sm font-medium text-gray-700 truncate">{s.state_name}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold transition-all" style={{ width: `${Math.max(pct, 8)}%` }}>
                        {formatCurrency(s.total_payments)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {tab === 'specialties' && selectedSpecialtyData.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Specialty Comparison</h2>
            <div className="overflow-x-auto">
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
                  {[
                    { label: 'Total Payments', render: (s: SpecialtyData) => formatCurrency(s.total_payments), bold: true },
                    { label: 'Total Providers', render: (s: SpecialtyData) => formatNumber(s.total_providers) },
                    { label: 'Avg Payment/Provider', render: (s: SpecialtyData) => formatCurrency(s.avg_payment_per_provider) },
                    { label: 'Markup Ratio', render: (s: SpecialtyData) => `${s.markup_ratio.toFixed(2)}x` },
                    { label: 'Payment Share', render: (s: SpecialtyData) => `${s.payment_share.toFixed(1)}%` },
                    { label: 'Total Services', render: (s: SpecialtyData) => formatNumber(s.total_services) },
                  ].map((row, i) => (
                    <tr key={row.label} className={i % 2 ? 'bg-gray-50' : ''}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.label}</td>
                      {selectedSpecialtyData.map(s => (
                        <td key={s.specialty_slug} className={`px-4 py-3 text-sm text-gray-700 ${row.bold ? 'font-semibold' : ''}`}>{row.render(s)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Visual bars */}
            <div className="mt-6 space-y-3">
              {selectedSpecialtyData.map(s => {
                const max = Math.max(...selectedSpecialtyData.map(x => x.total_payments))
                const pct = max > 0 ? (s.total_payments / max) * 100 : 0
                return (
                  <div key={s.specialty_slug} className="flex items-center gap-3">
                    <div className="w-40 text-sm font-medium text-gray-700 truncate">{s.specialty}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold transition-all" style={{ width: `${Math.max(pct, 8)}%` }}>
                        {formatCurrency(s.total_payments)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {tab !== 'flagged-vs-clean' && ((tab === 'providers' && !selectedProviderData.length) || (tab === 'states' && !selectedStateData.length) || (tab === 'specialties' && !selectedSpecialtyData.length)) && (
          <div className="mt-12 text-center py-12 text-gray-400">
            <p className="text-lg">Select items above to compare them side by side</p>
            <p className="text-sm mt-2">Or try a quick comparison above ☝️</p>
          </div>
        )}

        <div className="mt-12 rounded-xl bg-gray-50 border border-gray-200 p-5 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">🤖 Want to see which providers our AI flagged?</p>
            <p className="text-xs text-gray-500 mt-1">ML model scored 1.72M providers — 500 flagged for fraud risk</p>
          </div>
          <Link href="/fraud/still-out-there" className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap">View ML Results →</Link>
        </div>

        <div className="mt-12"><ShareButtons url="https://www.openmedicare.us/compare" title="Compare Medicare Data" /></div>
        <div className="mt-8"><SourceCitation /></div>
      </div>
    </div>
  )
}

function StatCompareCard({ label, flaggedValue, cleanValue, multiplier, severity }: { label: string; flaggedValue: string; cleanValue: string; multiplier: string; severity: 'high' | 'critical' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-red-600 font-semibold uppercase">⚠️ Flagged</span>
          <span className="text-lg font-bold text-red-700">{flaggedValue}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-green-600 font-semibold uppercase">✅ Clean</span>
          <span className="text-lg font-bold text-green-700">{cleanValue}</span>
        </div>
      </div>
      <div className={`mt-3 text-center text-xs font-bold rounded-full px-2 py-1 ${severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
        {multiplier}
      </div>
    </div>
  )
}

function CompareBar({ label, flaggedVal, cleanVal, format }: { label: string; flaggedVal: number; cleanVal: number; format: 'currency' | 'number' | 'ratio' }) {
  const max = Math.max(flaggedVal, cleanVal)
  const flaggedPct = max > 0 ? (flaggedVal / max) * 100 : 0
  const cleanPct = max > 0 ? (cleanVal / max) * 100 : 0
  const fmt = (v: number) => format === 'currency' ? formatCurrency(v) : format === 'ratio' ? `${v.toFixed(1)}x` : formatNumber(Math.round(v))

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-16 text-xs text-red-600 font-medium">Flagged</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div className="h-full bg-red-500 rounded-full flex items-center justify-end pr-2 text-white text-[10px] font-bold transition-all" style={{ width: `${Math.max(flaggedPct, 10)}%` }}>
              {fmt(flaggedVal)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-16 text-xs text-green-600 font-medium">Clean</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div className="h-full bg-green-500 rounded-full flex items-center justify-end pr-2 text-white text-[10px] font-bold transition-all" style={{ width: `${Math.max(cleanPct, 10)}%` }}>
              {fmt(cleanVal)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
