'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { formatCurrency } from '@/lib/format'

const INVESTIGATIONS = [
  { slug: 'markup-machine', title: 'The Markup Machine', keywords: 'billing charges markup overcharging' },
  { slug: 'biggest-billers', title: 'The Biggest Billers', keywords: 'top providers volume payments' },
  { slug: 'drug-pipeline', title: 'The Drug Pipeline', keywords: 'drugs prescriptions pharmaceutical' },
  { slug: 'covid-impact', title: 'COVID Impact on Medicare', keywords: 'covid pandemic coronavirus' },
  { slug: 'rural-price-tag', title: 'The Rural Price Tag', keywords: 'rural access cost geography' },
  { slug: 'specialty-gap', title: 'The Specialty Gap', keywords: 'specialty pay inequality' },
  { slug: 'anesthesia-markup', title: 'The Anesthesia Markup', keywords: 'anesthesia billing markup' },
  { slug: 'medicare-biggest-spenders', title: 'Medicare\'s Biggest Spenders', keywords: 'top spending providers' },
  { slug: 'state-spending-divide', title: 'The State Spending Divide', keywords: 'states geography regional' },
  { slug: 'corporate-medicine', title: 'Corporate Medicine', keywords: 'corporate organizations entities' },
  { slug: 'office-visit-economy', title: 'The Office Visit Economy', keywords: 'office visits 99213 99214' },
  { slug: 'pandemic-recovery', title: 'Pandemic Recovery', keywords: 'covid recovery telehealth' },
  { slug: 'eye-care-billions', title: 'Eye Care Billions', keywords: 'ophthalmology optometry eyes' },
  { slug: 'where-medicare-dollar-goes', title: 'Where Your Medicare Dollar Goes', keywords: 'spending breakdown dollar' },
  { slug: 'covid-test-scheme', title: 'The COVID Test Scheme', keywords: 'covid testing fraud K1034' },
  { slug: 'wound-care-crisis', title: 'The Wound Care Crisis', keywords: 'wound care billing fraud' },
  { slug: 'impossible-doctors', title: 'The Impossible Doctors', keywords: 'impossible billing volume fraud' },
  { slug: 'medicare-millionaires', title: 'Medicare Millionaires', keywords: 'millionaire top earners payments' },
  { slug: 'specialty-monopoly', title: 'The Specialty Monopoly', keywords: 'specialty concentration market' },
  { slug: 'ten-year-explosion', title: 'The Ten-Year Explosion', keywords: 'growth trends decade spending' },
  { slug: 'geographic-inequality', title: 'Geographic Inequality', keywords: 'geography states inequality' },
  { slug: 'drug-money', title: 'Drug Money', keywords: 'drugs pharmaceutical spending' },
  { slug: 'medicare-fraud-2025', title: 'Medicare Fraud in 2025', keywords: 'fraud detection AI machine learning' },
  { slug: 'how-much-does-medicare-pay', title: 'How Much Does Medicare Pay?', keywords: 'payments rates reimbursement' },
  { slug: 'medicare-provider-lookup-guide', title: 'Medicare Provider Lookup Guide', keywords: 'lookup search NPI provider' },
  { slug: 'most-expensive-medicare-procedures', title: 'Most Expensive Medicare Procedures', keywords: 'expensive procedures costs' },
  { slug: 'medicare-spending-by-state', title: 'Medicare Spending by State', keywords: 'state spending comparison' },
  { slug: 'specialty-pay-gap', title: 'The Specialty Pay Gap', keywords: 'specialty pay disparity' },
]

type ResultType = 'provider' | 'state' | 'specialty' | 'procedure' | 'investigation'

const BADGE_STYLES: Record<ResultType, { bg: string; text: string; label: string }> = {
  provider: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Provider' },
  state: { bg: 'bg-green-100', text: 'text-green-700', label: 'State' },
  specialty: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Specialty' },
  procedure: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Procedure' },
  investigation: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Investigation' },
}

interface Provider { npi: string; name: string; specialty?: string; state?: string; total_payments?: number }
interface FlaggedProvider { npi: string; name: string; fraud_probability: number; specialty: string; state: string; total_payments: number }
interface State { state: string; state_name: string; total_payments: number }
interface Specialty { specialty: string; specialty_slug: string; total_payments: number }
interface Procedure { code: string; description: string; total_payments?: number }

interface UnifiedResult {
  type: ResultType
  href: string
  title: string
  subtitle?: string
  value?: string
  fraudProbability?: number
  relevance: number
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [providers, setProviders] = useState<Provider[]>([])
  const [flaggedMap, setFlaggedMap] = useState<Map<string, FlaggedProvider>>(new Map())
  const [states, setStates] = useState<State[]>([])
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [loaded, setLoaded] = useState(false)
  const [activeFilter, setActiveFilter] = useState<ResultType | 'all'>('all')

  useEffect(() => {
    Promise.all([
      fetch('/data/top-providers.json').then(r => r.json()),
      fetch('/data/states.json').then(r => r.json()),
      fetch('/data/specialties.json').then(r => r.json()),
      fetch('/data/procedures.json').then(r => r.json()),
      fetch('/data/ml-v2-results.json').then(r => r.json()),
    ]).then(([prov, st, spec, proc, ml]) => {
      setProviders(prov.providers || [])
      setStates(st.states || [])
      setSpecialties(spec.specialties || [])
      setProcedures(proc.procedures || [])
      const map = new Map<string, FlaggedProvider>()
      ;(ml.still_out_there || []).forEach((p: FlaggedProvider) => map.set(String(p.npi), p))
      setFlaggedMap(map)
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [])

  const q = query.toLowerCase().trim()

  const results = useMemo((): UnifiedResult[] => {
    if (!q || q.length < 2) return []

    const all: UnifiedResult[] = []

    // Providers — by name, NPI, specialty, state
    providers.forEach(p => {
      let rel = 0
      if (p.name?.toLowerCase().includes(q)) rel = p.name.toLowerCase().startsWith(q) ? 10 : 5
      else if (p.npi?.toString().includes(q)) rel = 8
      else if (p.specialty?.toLowerCase().includes(q)) rel = 2
      else if (p.state?.toLowerCase() === q) rel = 2
      else return

      const flagged = flaggedMap.get(String(p.npi))
      if (flagged) rel += 3 // boost flagged providers

      all.push({
        type: 'provider',
        href: `/providers/${p.npi}`,
        title: p.name,
        subtitle: [p.specialty, p.state].filter(Boolean).join(' · '),
        value: p.total_payments ? formatCurrency(p.total_payments) : undefined,
        fraudProbability: flagged?.fraud_probability,
        relevance: rel,
      })
    })

    // Also search flagged providers not in top-providers
    flaggedMap.forEach((fp, npi) => {
      if (providers.some(p => String(p.npi) === npi)) return
      let rel = 0
      if (fp.name?.toLowerCase().includes(q)) rel = 5
      else if (npi.includes(q)) rel = 8
      else if (fp.specialty?.toLowerCase().includes(q)) rel = 2
      else if (fp.state?.toLowerCase() === q) rel = 2
      else return
      rel += 3
      all.push({
        type: 'provider',
        href: `/providers/${npi}`,
        title: fp.name,
        subtitle: [fp.specialty, fp.state].filter(Boolean).join(' · '),
        value: formatCurrency(fp.total_payments),
        fraudProbability: fp.fraud_probability,
        relevance: rel,
      })
    })

    // States
    states.forEach(s => {
      let rel = 0
      if (s.state_name?.toLowerCase().includes(q)) rel = s.state_name.toLowerCase().startsWith(q) ? 10 : 5
      else if (s.state?.toLowerCase() === q) rel = 10
      else return
      all.push({ type: 'state', href: `/states/${s.state}`, title: s.state_name, subtitle: s.state, value: formatCurrency(s.total_payments), relevance: rel })
    })

    // Specialties
    specialties.forEach(s => {
      let rel = 0
      if (s.specialty?.toLowerCase().includes(q)) rel = s.specialty.toLowerCase().startsWith(q) ? 10 : 5
      else return
      all.push({ type: 'specialty', href: `/specialties/${s.specialty_slug}`, title: s.specialty, value: formatCurrency(s.total_payments), relevance: rel })
    })

    // Procedures
    procedures.forEach(p => {
      let rel = 0
      if (p.description?.toLowerCase().includes(q)) rel = 4
      else if (p.code?.includes(q.toUpperCase())) rel = 8
      else return
      all.push({ type: 'procedure', href: `/procedures/${p.code}`, title: `${p.code} — ${p.description}`, value: p.total_payments ? formatCurrency(p.total_payments) : undefined, relevance: rel })
    })

    // Investigations
    INVESTIGATIONS.forEach(i => {
      let rel = 0
      if (i.title.toLowerCase().includes(q)) rel = 6
      else if (i.slug.includes(q)) rel = 5
      else if (i.keywords.includes(q)) rel = 3
      else return
      all.push({ type: 'investigation', href: `/investigations/${i.slug}`, title: i.title, subtitle: 'Data Investigation', relevance: rel })
    })

    // Sort by relevance, then alphabetically
    all.sort((a, b) => b.relevance - a.relevance || a.title.localeCompare(b.title))
    return all.slice(0, 50)
  }, [q, providers, states, specialties, procedures, flaggedMap])

  const filteredResults = useMemo(() => {
    if (activeFilter === 'all') return results
    return results.filter(r => r.type === activeFilter)
  }, [results, activeFilter])

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: results.length }
    results.forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1 })
    return counts
  }, [results])

  const flaggedInResults = results.filter(r => r.fraudProbability != null).length

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Search' }]} />

        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Search OpenMedicare</h1>
        <p className="text-gray-500 mb-6">Search 30,000+ profiled providers, 50 states, 130+ specialties, and 59 investigations</p>

        <div className="relative mb-6">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveFilter('all') }}
            placeholder="Search providers, states, specialties, procedures, investigations..."
            className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {!loaded && q && <p className="text-gray-500">Loading data...</p>}

        {/* Filter chips */}
        {results.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <FilterChip label="All" count={typeCounts.all} active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
            {(['provider', 'state', 'specialty', 'procedure', 'investigation'] as ResultType[]).map(type => (
              typeCounts[type] ? (
                <FilterChip
                  key={type}
                  label={BADGE_STYLES[type].label + 's'}
                  count={typeCounts[type]}
                  active={activeFilter === type}
                  onClick={() => setActiveFilter(type)}
                />
              ) : null
            ))}
          </div>
        )}

        {/* Flagged providers callout */}
        {flaggedInResults > 0 && activeFilter === 'all' && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm">
            <span className="text-red-600 font-bold">⚠️</span>
            <span className="text-red-800">
              {flaggedInResults} result{flaggedInResults > 1 ? 's' : ''} flagged by our AI fraud model
            </span>
          </div>
        )}

        {q && q.length >= 2 && loaded && filteredResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No results found for &ldquo;{query}&rdquo;</p>
            <p className="text-gray-400">
              Can&apos;t find what you&apos;re looking for?{' '}
              <Link href="/lookup" className="text-blue-600 hover:underline font-medium">
                Try the NPI Provider Lookup →
              </Link>
            </p>
          </div>
        )}

        {/* Results */}
        {filteredResults.length > 0 && (
          <div className="space-y-1">
            {filteredResults.map((r, i) => (
              <Link
                key={`${r.type}-${r.href}-${i}`}
                href={r.href}
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white hover:shadow-sm transition-all group border border-transparent hover:border-gray-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide flex-shrink-0 ${BADGE_STYLES[r.type].bg} ${BADGE_STYLES[r.type].text}`}>
                    {BADGE_STYLES[r.type].label}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">
                      {r.title}
                    </div>
                    {r.subtitle && <div className="text-xs text-gray-500 truncate">{r.subtitle}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  {r.fraudProbability != null && (
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
                      r.fraudProbability >= 0.8 ? 'bg-red-100 text-red-700' :
                      r.fraudProbability >= 0.5 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {(r.fraudProbability * 100).toFixed(0)}% fraud risk
                    </span>
                  )}
                  {r.value && <div className="text-sm font-semibold text-gray-600">{r.value}</div>}
                </div>
              </Link>
            ))}
          </div>
        )}

        {q && q.length >= 2 && loaded && filteredResults.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 rounded-xl text-center">
            <p className="text-gray-600">
              Can&apos;t find what you&apos;re looking for?{' '}
              <Link href="/lookup" className="text-blue-600 hover:underline font-medium">
                Search any provider by NPI →
              </Link>
            </p>
          </div>
        )}

        {q && q.length < 2 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">Type at least 2 characters to search</p>
          </div>
        )}

        {!q && loaded && (
          <div className="space-y-10">
            {/* Category Cards */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-playfair mb-4">Explore Medicare Data</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/providers" className="group flex items-start gap-4 p-5 bg-blue-50 rounded-xl border border-blue-100 hover:border-[#1a73e8] hover:shadow-md transition-all">
                  <span className="text-3xl">👨‍⚕️</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#1a73e8]">Providers</h3>
                    <p className="text-sm text-gray-600 mt-1">Search 1.7M+ Medicare providers by name, NPI, or specialty</p>
                  </div>
                </Link>
                <Link href="/states" className="group flex items-start gap-4 p-5 bg-green-50 rounded-xl border border-green-100 hover:border-green-500 hover:shadow-md transition-all">
                  <span className="text-3xl">🗺️</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700">States</h3>
                    <p className="text-sm text-gray-600 mt-1">Compare Medicare spending across all 50 states</p>
                  </div>
                </Link>
                <Link href="/specialties" className="group flex items-start gap-4 p-5 bg-purple-50 rounded-xl border border-purple-100 hover:border-purple-500 hover:shadow-md transition-all">
                  <span className="text-3xl">🏥</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">Specialties</h3>
                    <p className="text-sm text-gray-600 mt-1">Explore payment patterns across medical specialties</p>
                  </div>
                </Link>
                <Link href="/investigations" className="group flex items-start gap-4 p-5 bg-rose-50 rounded-xl border border-rose-100 hover:border-rose-500 hover:shadow-md transition-all">
                  <span className="text-3xl">🔍</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-rose-700">Investigations</h3>
                    <p className="text-sm text-gray-600 mt-1">59 data-driven investigations into Medicare spending</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 py-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1a73e8]">1.72M</div>
                <div className="text-xs text-gray-500">Providers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1a73e8]">$854.8B</div>
                <div className="text-xs text-gray-500">Total Spending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1a73e8]">10 Years</div>
                <div className="text-xs text-gray-500">2014–2023</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1a73e8]">59</div>
                <div className="text-xs text-gray-500">Investigations</div>
              </div>
            </div>

            {/* Quick searches */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FunnelIcon className="h-4 w-4" /> Try Searching For
              </h2>
              <div className="flex flex-wrap gap-2">
                {['California', 'Cardiology', 'Internal Medicine', 'Florida', 'Nurse Practitioner', 'wound care', 'covid', 'fraud'].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-[#1a73e8] transition-colors text-gray-700"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function FilterChip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
      }`}
    >
      {label}
      <span className={`text-xs ${active ? 'text-blue-200' : 'text-gray-400'}`}>{count}</span>
    </button>
  )
}
