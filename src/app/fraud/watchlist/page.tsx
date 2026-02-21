'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

interface Flag {
  type: string
  description: string
  severity: string
}

interface Provider {
  npi: number
  name: string
  credentials: string
  specialty: string
  city: string
  state: string
  total_payments: number
  total_services: number
  total_beneficiaries: number
  avg_markup: number
  risk_score: number
  flags: Flag[]
  entity_type?: string
}

type SortKey = 'risk_score' | 'total_payments' | 'avg_markup' | 'name'
type SortDir = 'asc' | 'desc'
type TabType = 'individuals' | 'organizations'

function RiskBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'bg-red-100 text-red-800 border-red-200'
    : score >= 75 ? 'bg-orange-100 text-orange-800 border-orange-200'
    : score >= 60 ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
    : 'bg-green-100 text-green-800 border-green-200'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${color}`}>
      {score}
    </span>
  )
}

function SeverityDot({ severity }: { severity: string }) {
  const color = severity === 'high' ? 'bg-red-500' : severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
  return <span className={`inline-block w-2 h-2 rounded-full ${color} mr-1`} />
}

export default function FraudWatchlist() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabType>('individuals')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('risk_score')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [stateFilter, setStateFilter] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('')

  useEffect(() => {
    fetch('/data/watchlist.json')
      .then(r => r.json())
      .then(data => { setProviders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Enrich with entity_type heuristic: orgs typically have "Laboratory", "Holdings", etc in name
  const enriched = useMemo(() => providers.map(p => ({
    ...p,
    entity_type: p.entity_type || (
      /\b(laboratory|holdings|corp|inc|llc|group|health system|hospital|clinic|associates|services|center|imaging|radiology lab)\b/i.test(p.name)
        ? 'Organization' : 'Individual'
    )
  })), [providers])

  const filtered = useMemo(() => {
    const isOrg = tab === 'organizations'
    return enriched
      .filter(p => (isOrg ? p.entity_type === 'Organization' : p.entity_type !== 'Organization'))
      .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.specialty.toLowerCase().includes(search.toLowerCase()) || String(p.npi).includes(search))
      .filter(p => !stateFilter || p.state === stateFilter)
      .filter(p => !specialtyFilter || p.specialty === specialtyFilter)
      .sort((a, b) => {
        const mul = sortDir === 'desc' ? -1 : 1
        if (sortKey === 'name') return mul * a.name.localeCompare(b.name)
        return mul * ((a[sortKey] as number) - (b[sortKey] as number))
      })
  }, [enriched, tab, search, stateFilter, specialtyFilter, sortKey, sortDir])

  const states = useMemo(() => [...new Set(enriched.map(p => p.state))].sort(), [enriched])
  const specialties = useMemo(() => [...new Set(enriched.map(p => p.specialty))].sort(), [enriched])
  const individualCount = useMemo(() => enriched.filter(p => p.entity_type !== 'Organization').length, [enriched])
  const orgCount = useMemo(() => enriched.filter(p => p.entity_type === 'Organization').length, [enriched])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const SortButton = ({ k, children }: { k: SortKey; children: React.ReactNode }) => (
    <button onClick={() => toggleSort(k)} className="font-semibold hover:text-medicare-primary flex items-center gap-1">
      {children}
      {sortKey === k && <span className="text-xs">{sortDir === 'desc' ? '↓' : '↑'}</span>}
    </button>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: 'Fraud Analysis', href: '/fraud' }, { name: 'Watchlist' }]} />

        <h1 className="text-4xl font-bold font-serif text-gray-900 mt-6 mb-4">Enhanced Fraud Watchlist</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl">
          500 Medicare providers flagged for statistical billing anomalies. Individuals separated from organizations
          to highlight the truly suspicious patterns vs. large-scale lab operations.
        </p>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading watchlist data...</div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setTab('individuals')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${tab === 'individuals' ? 'border-medicare-primary text-medicare-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Individual Providers ({individualCount})
              </button>
              <button
                onClick={() => setTab('organizations')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${tab === 'organizations' ? 'border-medicare-primary text-medicare-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Organizations ({orgCount})
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <input
                type="text"
                placeholder="Search name, specialty, or NPI..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-72 focus:ring-2 focus:ring-medicare-primary focus:border-medicare-primary"
              />
              <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">All States</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={specialtyFilter} onChange={e => setSpecialtyFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm max-w-xs">
                <option value="">All Specialties</option>
                {specialties.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="text-sm text-gray-500 mb-4">{filtered.length} providers shown</div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider"><SortButton k="name">Provider</SortButton></th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Specialty</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider"><SortButton k="risk_score">Risk</SortButton></th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider"><SortButton k="total_payments">Payments</SortButton></th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider"><SortButton k="avg_markup">Markup</SortButton></th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Flags</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.slice(0, 100).map(p => (
                    <tr key={p.npi} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/providers/${p.npi}`} className="text-sm font-medium text-medicare-primary hover:underline">
                          {p.name}
                        </Link>
                        {p.credentials && <span className="text-xs text-gray-400 ml-1">{p.credentials}</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[180px] truncate">{p.specialty}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.city}, {p.state}</td>
                      <td className="px-4 py-3"><RiskBadge score={p.risk_score} /></td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(p.total_payments)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.avg_markup.toFixed(1)}x</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[250px]">
                          {p.flags.map((f, i) => (
                            <span key={i} className="inline-flex items-center text-xs bg-gray-100 rounded px-1.5 py-0.5" title={f.description}>
                              <SeverityDot severity={f.severity} />
                              <span className="truncate max-w-[120px]">{f.description}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length > 100 && (
              <p className="text-sm text-gray-500 mt-4 text-center">Showing first 100 of {filtered.length} results. Use filters to narrow down.</p>
            )}
          </>
        )}

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> These are statistical flags based on publicly available CMS data, not accusations of fraud.
            Billing anomalies can have legitimate explanations. Report suspected fraud:
            <a href="tel:1-800-447-8477" className="underline font-medium ml-1">1-800-HHS-TIPS</a>.
          </p>
        </div>

        <ShareButtons url="https://www.openmedicare.org/fraud/watchlist" title="Medicare Fraud Watchlist — OpenMedicare" />
        <div className="mt-6">
          <SourceCitation sources={['CMS Medicare Provider Utilization and Payment Data (2014-2023)', 'HHS Office of Inspector General']} lastUpdated="February 2026" />
        </div>
      </div>
    </div>
  )
}
