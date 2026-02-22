'use client'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
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

interface MlProvider {
  npi: string
  fraud_probability: number
}

type SortKey = 'risk_score' | 'total_payments' | 'avg_markup' | 'name'
type SortDir = 'asc' | 'desc'
type TabType = 'individuals' | 'organizations'

function RiskBadge({ score }: { score: number }) {
  const bg = score >= 90
    ? 'bg-red-600 text-white shadow-red-200'
    : score >= 80
    ? 'bg-red-100 text-red-800 border border-red-300'
    : score >= 70
    ? 'bg-orange-100 text-orange-800 border border-orange-300'
    : score >= 60
    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
    : 'bg-green-100 text-green-800 border border-green-300'
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${bg}`}>
      {score}
    </span>
  )
}

function RiskBar({ score }: { score: number }) {
  const color = score >= 90
    ? 'bg-red-500'
    : score >= 80
    ? 'bg-red-400'
    : score >= 70
    ? 'bg-orange-400'
    : score >= 60
    ? 'bg-yellow-400'
    : 'bg-green-400'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
            <InvestigationDisclaimer />      </div>
      <RiskBadge score={score} />
    </div>
  )
}

function SeverityDot({ severity }: { severity: string }) {
  const color = severity === 'high' ? 'bg-red-500' : severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
  return <span className={`inline-block w-2 h-2 rounded-full ${color} mr-1`} />
}

function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 whitespace-nowrap">
      🤖 AI Flagged
    </span>
  )
}

export default function FraudWatchlist() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [mlNpis, setMlNpis] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabType>('individuals')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('risk_score')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [stateFilter, setStateFilter] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/data/watchlist.json').then(r => r.json()),
      fetch('/data/ml-v2-results.json').then(r => r.json()).catch(() => ({ still_out_there: [] })),
    ]).then(([watchlist, ml]) => {
      setProviders(watchlist)
      const npis = new Set<string>((ml.still_out_there || []).map((p: MlProvider) => String(p.npi)))
      setMlNpis(npis)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const enriched = useMemo(() => providers.map(p => ({
    ...p,
    entity_type: p.entity_type || (
      /\b(laboratory|holdings|corp|inc|llc|group|health system|hospital|clinic|associates|services|center|imaging|radiology lab)\b/i.test(p.name)
        ? 'Organization' : 'Individual'
    ),
    alsoFlaggedByAi: mlNpis.has(String(p.npi)),
  })), [providers, mlNpis])

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

  const [showAll, setShowAll] = useState(false)

  const states = useMemo(() => [...new Set(enriched.map(p => p.state))].sort(), [enriched])
  const specialties = useMemo(() => [...new Set(enriched.map(p => p.specialty))].sort(), [enriched])
  const individualCount = useMemo(() => enriched.filter(p => p.entity_type !== 'Organization').length, [enriched])
  const orgCount = useMemo(() => enriched.filter(p => p.entity_type === 'Organization').length, [enriched])
  const aiFlaggedCount = useMemo(() => enriched.filter(p => p.alsoFlaggedByAi).length, [enriched])

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
        <p className="text-lg text-gray-600 mb-6 max-w-3xl">
          {formatNumber(providers.length)} Medicare providers flagged for statistical billing anomalies. Individuals separated from organizations
          to highlight truly suspicious patterns vs. large-scale lab operations.
        </p>

        {/* Summary stats strip */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{formatNumber(providers.length)}</div>
              <div className="text-xs text-gray-500 font-medium">Total Flagged</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <div className="text-2xl font-bold text-red-700">{enriched.filter(p => p.risk_score >= 90).length}</div>
              <div className="text-xs text-red-600 font-medium">Critical Risk (90+)</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">{aiFlaggedCount}</div>
              <div className="text-xs text-purple-600 font-medium">Also AI Flagged</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{states.length}</div>
              <div className="text-xs text-blue-600 font-medium">States Represented</div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-medicare-primary rounded-full animate-spin mb-4" />
            <div className="text-gray-500">Loading watchlist data...</div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setTab('individuals')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'individuals' ? 'border-medicare-primary text-medicare-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Individual Providers ({individualCount})
              </button>
              <button
                onClick={() => setTab('organizations')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'organizations' ? 'border-medicare-primary text-medicare-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Organizations ({orgCount})
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
              <input
                type="text"
                placeholder="Search name, specialty, or NPI..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-72 focus:ring-2 focus:ring-medicare-primary focus:border-medicare-primary"
              />
              <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-auto">
                <option value="">All States</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={specialtyFilter} onChange={e => setSpecialtyFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-auto sm:max-w-xs">
                <option value="">All Specialties</option>
                {specialties.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="text-sm text-gray-500 mb-4">{filtered.length} providers shown</div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
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
                  {filtered.slice(0, showAll ? filtered.length : 50).map(p => (
                    <tr key={p.npi} className={`hover:bg-gray-50 transition-colors ${p.risk_score >= 90 ? 'bg-red-50/40' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <div>
                            <Link href={`/providers/${p.npi}`} className="text-sm font-medium text-medicare-primary hover:underline">
                              {p.name}
                            </Link>
                            {p.credentials && <span className="text-xs text-gray-400 ml-1">{p.credentials}</span>}
                          </div>
                          {p.alsoFlaggedByAi && <AiBadge />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[180px] truncate">{p.specialty}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{p.city}, {p.state}</td>
                      <td className="px-4 py-3"><RiskBar score={p.risk_score} /></td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{formatCurrency(p.total_payments)}</td>
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

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filtered.slice(0, showAll ? filtered.length : 50).map(p => (
                <div key={p.npi} className={`rounded-xl border p-4 ${p.risk_score >= 90 ? 'border-red-200 bg-red-50/40' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <Link href={`/providers/${p.npi}`} className="text-sm font-semibold text-medicare-primary hover:underline block truncate">
                        {p.name}
                      </Link>
                      <div className="text-xs text-gray-500 truncate">{p.specialty}</div>
                      <div className="text-xs text-gray-400">{p.city}, {p.state}</div>
                    </div>
                    <RiskBadge score={p.risk_score} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {p.alsoFlaggedByAi && <AiBadge />}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div><span className="text-gray-400">Payments:</span> <span className="font-medium text-gray-900">{formatCurrency(p.total_payments)}</span></div>
                    <div><span className="text-gray-400">Markup:</span> <span className="font-medium text-gray-900">{p.avg_markup.toFixed(1)}x</span></div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.flags.slice(0, 3).map((f, i) => (
                      <span key={i} className="inline-flex items-center text-[10px] bg-gray-100 rounded px-1.5 py-0.5">
                        <SeverityDot severity={f.severity} />
                        <span className="truncate max-w-[100px]">{f.description}</span>
                      </span>
                    ))}
                    {p.flags.length > 3 && <span className="text-[10px] text-gray-400">+{p.flags.length - 3} more</span>}
                  </div>
                </div>
              ))}
            </div>

            {filtered.length > 50 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAll(s => !s)}
                  className="px-6 py-2 bg-medicare-primary text-white rounded-lg hover:bg-medicare-dark transition-colors text-sm font-medium"
                >
                  {showAll ? 'Show First 50' : `Show All ${filtered.length}`}
                </button>
                {!showAll && <p className="text-sm text-gray-500 mt-2">Showing 50 of {filtered.length} results</p>}
              </div>
            )}
          </>
        )}

        {/* ML Model CTA */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 mt-8 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">🤖 Looking for AI-flagged providers?</h3>
              <p className="text-sm text-gray-600">
                Our ML model scored 1.72M providers against 2,198 confirmed fraudsters.
                {aiFlaggedCount > 0 && <span className="font-medium text-purple-700"> {aiFlaggedCount} providers appear on both lists.</span>}
              </p>
            </div>
            <Link href="/fraud/still-out-there" className="inline-flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors whitespace-nowrap shadow-sm">
              See ML Model Results →
            </Link>
          </div>
        </div>

        {/* Related Fraud Analysis */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Fraud Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/fraud/deep-dives" className="text-medicare-primary hover:underline text-sm">🔍 Deep Dive Profiles — Top 20 highest-risk providers</Link>
            <Link href="/fraud/impossible-numbers" className="text-medicare-primary hover:underline text-sm">🧮 Impossible Numbers — Volume anomalies</Link>
            <Link href="/fraud/upcoding" className="text-medicare-primary hover:underline text-sm">📊 Upcoding Detector — Code-level analysis</Link>
            <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
            <Link href="/fraud/report" className="text-medicare-primary hover:underline text-sm">📞 Report Fraud — OIG Hotline</Link>
            <Link href="/methodology" className="text-sm text-blue-700 hover:underline">📊 How we analyze the data →</Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> These are statistical flags based on publicly available CMS data, not accusations of fraud.
            Billing anomalies can have legitimate explanations. Report suspected fraud:
            <a href="tel:1-800-447-8477" className="underline font-medium ml-1">1-800-HHS-TIPS</a>.
          </p>
        </div>

        <ShareButtons url="https://www.openmedicare.com/fraud/watchlist" title="Medicare Fraud Watchlist" />
        <div className="mt-6">
          <SourceCitation sources={['CMS Medicare Provider Utilization and Payment Data (2014-2023)', 'HHS Office of Inspector General']} lastUpdated="February 2026" />
        </div>
      </div>
    </div>
  )
}
