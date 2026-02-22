'use client'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Provider {
  npi: string
  name: string
  specialty: string
  state: string
  total_payments: number
  total_services: number
  total_beneficiaries: number
  fraud_probability: number
  risk_rank: number
  top_risk_factors: string[]
  markup_ratio: number
  services_per_bene: number
}

interface MLv2Results {
  model_version: string
  trained_on: number
  auc_score: number
  total_scored: number
  still_out_there: Provider[]
  top_features: { feature: string; importance: number }[]
  generated_at: string
}

type SortKey = 'risk_rank' | 'name' | 'specialty' | 'state' | 'fraud_probability' | 'total_payments' | 'services_per_bene' | 'markup_ratio'

const CHART_COLORS = ['#dc2626', '#e53e3e', '#ef4444', '#f56565', '#f87171', '#fb923c', '#fdba74', '#fbbf24', '#fcd34d', '#fde68a']

function probColor(p: number): string {
  if (p > 0.95) return 'bg-red-200 text-red-950 border-red-400'
  if (p > 0.90) return 'bg-red-100 text-red-800 border-red-300'
  if (p > 0.85) return 'bg-orange-100 text-orange-800 border-orange-300'
  return 'bg-yellow-50 text-yellow-800 border-yellow-200'
}

export default function StillOutThere() {
  const [data, setData] = useState<MLv2Results | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('risk_rank')
  const [sortAsc, setSortAsc] = useState(true)

  useEffect(() => {
    fetch('/data/ml-v2-results.json')
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const providers = data?.still_out_there ?? []

  const states = useMemo(() => [...new Set(providers.map(p => p.state))].sort(), [providers])
  const specialties = useMemo(() => [...new Set(providers.map(p => p.specialty))].sort(), [providers])

  const filtered = useMemo(() => {
    let list = providers
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q))
    }
    if (stateFilter) list = list.filter(p => p.state === stateFilter)
    if (specialtyFilter) list = list.filter(p => p.specialty === specialtyFilter)
    return list
  }, [providers, search, stateFilter, specialtyFilter])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) => {
      let av: string | number = a[sortKey] as string | number
      let bv: string | number = b[sortKey] as string | number
      if (typeof av === 'string') {
        const cmp = av.localeCompare(bv as string)
        return sortAsc ? cmp : -cmp
      }
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return copy
  }, [filtered, sortKey, sortAsc])

  const totalPayments = useMemo(() => providers.reduce((s, p) => s + p.total_payments, 0), [providers])

  const stateChartData = useMemo(() => {
    const counts: Record<string, number> = {}
    providers.forEach(p => { counts[p.state] = (counts[p.state] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([state, count]) => ({ state, count }))
  }, [providers])

  const specialtyChartData = useMemo(() => {
    const counts: Record<string, number> = {}
    providers.forEach(p => { counts[p.specialty] = (counts[p.specialty] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([specialty, count]) => ({ specialty: specialty.length > 25 ? specialty.slice(0, 22) + '…' : specialty, count }))
  }, [providers])

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(key === 'risk_rank' || key === 'name' || key === 'specialty' || key === 'state') }
  }

  const sortIcon = (key: SortKey) => sortKey === key ? (sortAsc ? ' ↑' : ' ↓') : ''

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">Loading ML model results…</div>

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">Data Unavailable</h1>
        <p className="text-gray-600">Could not load ML results. <Link href="/fraud" className="text-blue-600 underline">Return to Fraud Analysis</Link></p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Dark header */}
      <div className="bg-gradient-to-r from-gray-900 via-red-950 to-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ name: 'Fraud Analysis', href: '/fraud' }, { name: 'Still Out There' }]} />
            <InvestigationDisclaimer />          <h1 className="text-4xl md:text-5xl font-bold font-serif mt-4 mb-3">Still Out There</h1>
          <p className="text-lg text-gray-300 max-w-3xl">
            A supervised ML model trained on <strong className="text-white">2,198 confirmed fraudsters</strong> scored 1.7M Medicare providers. 
            These <strong className="text-red-300">500 unflagged providers</strong> bill like known criminals — but haven't been caught.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-10 mb-10 relative z-10">
          {[
            { value: '500', label: 'Providers Flagged', bg: 'bg-red-50 border-red-200', text: 'text-red-700' },
            { value: `$${Math.round(totalPayments / 1e6)}M`, label: 'In Payments', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
            { value: `${(data.auc_score * 100).toFixed(0)}%`, label: 'Model AUC', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
            { value: formatNumber(data.trained_on), label: 'Training Labels', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} border rounded-xl p-5 text-center shadow-sm`}>
              <div className={`text-3xl font-bold ${s.text}`}>{s.value}</div>
              <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Important Disclaimer:</strong> These are <strong>statistical flags, not accusations</strong>. 
            A high fraud probability means a provider&apos;s billing patterns resemble those of confirmed fraudsters — it does not mean they are committing fraud. 
            Many flagged providers may have legitimate explanations. This analysis is for public transparency and journalism purposes only.
            Report suspected fraud: <a href="tel:1-800-447-8477" className="underline font-medium">1-800-HHS-TIPS</a>.
          </p>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-xl font-bold font-serif text-gray-900 mb-4">Top 10 States by Flagged Providers</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stateChartData} layout="vertical" margin={{ left: 30, right: 20 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="state" width={35} tick={{ fontSize: 13 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {stateChartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-gray-900 mb-4">Top 10 Specialties by Flagged Providers</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={specialtyChartData} layout="vertical" margin={{ left: 120, right: 20 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="specialty" width={115} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {specialtyChartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search by Name</label>
            <input
              type="text"
              placeholder="Search providers…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
            <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">All States</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Specialty</label>
            <select value={specialtyFilter} onChange={e => setSpecialtyFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">All Specialties</option>
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="text-sm text-gray-500 py-2">
            {sorted.length} of {providers.length} providers
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {([
                  ['risk_rank', 'Rank', 'text-center w-16'],
                  ['name', 'Provider Name', 'text-left'],
                  ['specialty', 'Specialty', 'text-left hidden md:table-cell'],
                  ['state', 'State', 'text-center w-16'],
                  ['fraud_probability', 'Fraud Prob.', 'text-right'],
                  ['total_payments', 'Total Payments', 'text-right hidden sm:table-cell'],
                  ['services_per_bene', 'Svc/Bene', 'text-right hidden lg:table-cell'],
                  ['markup_ratio', 'Markup', 'text-right hidden lg:table-cell'],
                ] as [SortKey, string, string][]).map(([key, label, cls]) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className={`px-3 py-3 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none ${cls}`}
                  >
                    {label}{sortIcon(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, idx) => (
                <tr key={p.npi} className={`border-b border-gray-100 hover:bg-blue-50/40 ${idx % 2 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-3 py-2.5 text-center text-gray-400 font-mono text-xs">{p.risk_rank}</td>
                  <td className="px-3 py-2.5">
                    <Link href={`/providers/${p.npi}`} className="text-blue-700 hover:underline font-medium">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 hidden md:table-cell">{p.specialty}</td>
                  <td className="px-3 py-2.5 text-center text-gray-600">{p.state}</td>
                  <td className="px-3 py-2.5 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded border text-xs font-bold ${probColor(p.fraud_probability)}`}>
                      {(p.fraud_probability * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-medium hidden sm:table-cell">{formatCurrency(p.total_payments)}</td>
                  <td className="px-3 py-2.5 text-right text-gray-600 hidden lg:table-cell">{p.services_per_bene.toFixed(1)}</td>
                  <td className="px-3 py-2.5 text-right text-gray-600 hidden lg:table-cell">{p.markup_ratio.toFixed(2)}×</td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">No providers match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-8 rounded-r-lg">
          <p className="text-sm text-yellow-800">
            <strong>Reminder:</strong> A high fraud probability score is a <strong>statistical flag</strong>, not evidence of wrongdoing. 
            Providers may have legitimate reasons for unusual billing. This data is published for transparency and public accountability.
          </p>
        </div>

        {/* Related */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold font-serif text-gray-900 mb-4">Related Fraud Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/fraud/watchlist" className="text-blue-700 hover:underline text-sm">🚨 Statistical Watchlist — Anomaly detection flags</Link>
            <Link href="/fraud/deep-dives" className="text-blue-700 hover:underline text-sm">🔍 Deep Dive Profiles — Top 20 highest-risk</Link>
            <Link href="/investigations/data-predicted-fraud" className="text-blue-700 hover:underline text-sm">📰 Our Data Predicted It — Algorithm vs DOJ</Link>
            <Link href="/fraud/impossible-numbers" className="text-blue-700 hover:underline text-sm">🧮 Impossible Numbers — Physically impossible billing</Link>
            <Link href="/fraud" className="text-blue-700 hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
            <Link href="/methodology" className="text-blue-700 hover:underline text-sm">📊 Methodology — How we analyze the data</Link>
          </div>
        </div>

        <ShareButtons url="https://www.openmedicare.com/fraud/still-out-there" title="Still Out There: 500 ML-Flagged Medicare Providers" />
        <div className="mt-6">
          <SourceCitation sources={[
            'CMS Medicare Provider Utilization and Payment Data (2014-2023)',
            'HHS OIG List of Excluded Individuals/Entities (LEIE)',
            'DOJ Healthcare Fraud Enforcement Actions (2020-2025)',
            'OpenMedicare ML v2 Supervised Fraud Model (AUC 0.83)',
          ]} lastUpdated="February 2026" />
        </div>
      </div>
    </div>
  )
}
