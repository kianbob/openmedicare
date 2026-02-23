'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { MapPinIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

// --- Types ---

interface FlaggedProvider {
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

interface MLResults {
  model_version: string
  total_scored: number
  still_out_there: FlaggedProvider[]
}

interface StateInfo {
  code: string
  count: number
  totalPayments: number
  topProvider: string
  topProbability: number
}

// --- Constants ---

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia'
}

const REGIONS: Record<string, string[]> = {
  'South': ['AL','AR','DE','FL','GA','KY','LA','MD','MS','NC','OK','SC','TN','TX','VA','WV','DC'],
  'Northeast': ['CT','ME','MA','NH','NJ','NY','PA','RI','VT'],
  'Midwest': ['IL','IN','IA','KS','MI','MN','MO','NE','ND','OH','SD','WI'],
  'West': ['AK','AZ','CA','CO','HI','ID','MT','NV','NM','OR','UT','WA','WY'],
}

const GRID: (string | null)[][] = [
  [null, 'AK', null, null, null, null, null, null, null, null, null, 'ME'],
  [null, 'WA', 'MT', 'ND', 'MN', null, 'WI', null, 'MI', null, 'NY', 'VT', 'NH', 'MA'],
  [null, 'OR', 'ID', 'SD', null, 'IA', 'IN', 'OH', 'PA', 'NJ', 'CT', 'RI'],
  [null, 'NV', 'WY', 'NE', 'IL', null, 'WV', 'VA', 'MD', 'DE'],
  [null, 'CA', 'UT', 'CO', 'KS', 'MO', 'KY', null, 'NC', null, 'DC'],
  [null, null, 'AZ', 'NM', 'OK', 'AR', 'TN', 'SC'],
  [null, null, null, null, 'TX', 'LA', 'MS', 'AL', 'GA'],
  [null, null, 'HI', null, null, null, null, null, null, null, 'FL'],
]

function getFraudColor(count: number): string {
  if (count > 40) return '#991b1b'    // dark red
  if (count >= 20) return '#dc2626'   // red
  if (count >= 10) return '#ea580c'   // orange
  if (count >= 5) return '#eab308'    // yellow
  if (count >= 1) return '#d1d5db'    // light gray
  return '#ffffff'                     // white
}

function getTextColor(count: number): string {
  if (count > 40) return '#ffffff'
  if (count >= 20) return '#ffffff'
  if (count >= 10) return '#ffffff'
  return '#1f2937'
}

// --- Component ---

export default function FraudMapPage() {
  const [data, setData] = useState<FlaggedProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/ml-v2-results.json')
      .then(r => r.json())
      .then((d: MLResults) => {
        setData(d.still_out_there || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const stateMap = useMemo(() => {
    const map: Record<string, StateInfo> = {}
    for (const p of data) {
      if (!map[p.state]) {
        map[p.state] = { code: p.state, count: 0, totalPayments: 0, topProvider: p.name, topProbability: p.fraud_probability }
      }
      map[p.state].count++
      map[p.state].totalPayments += p.total_payments
      if (p.fraud_probability > map[p.state].topProbability) {
        map[p.state].topProvider = p.name
        map[p.state].topProbability = p.fraud_probability
      }
    }
    return map
  }, [data])

  const statesSorted = useMemo(() =>
    Object.values(stateMap).sort((a, b) => b.count - a.count),
    [stateMap]
  )

  const regionStats = useMemo(() => {
    const stats: Record<string, { count: number; payments: number }> = {}
    for (const [region, states] of Object.entries(REGIONS)) {
      stats[region] = { count: 0, payments: 0 }
      for (const st of states) {
        if (stateMap[st]) {
          stats[region].count += stateMap[st].count
          stats[region].payments += stateMap[st].totalPayments
        }
      }
    }
    return stats
  }, [stateMap])

  const totalStatesWithFlags = statesSorted.length
  const mostConcentrated = statesSorted[0]
  const totalFlaggedPayments = data.reduce((s, p) => s + p.total_payments, 0)

  const hoveredInfo = hoveredState ? stateMap[hoveredState] : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    )
  }

  const filteredCards = selectedRegion
    ? statesSorted.filter(s => REGIONS[selectedRegion]?.includes(s.code))
    : statesSorted

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[
          { name: 'Fraud Analysis', href: '/fraud' },
          { name: 'Fraud Map' },
        ]} />

        {/* Header */}
        <div className="mt-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <MapPinIcon className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
              Medicare Fraud Map
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Geographic distribution of {formatNumber(data.length)} providers flagged by our ML model
            for suspicious billing patterns across {totalStatesWithFlags} states.
          </p>
          <div className="mt-4">
            <ShareButtons title="Medicare Fraud Map" url="https://www.openmedicare.us/fraud/map" />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{totalStatesWithFlags}</div>
            <div className="text-sm text-gray-500">States with Flags</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-red-700">{mostConcentrated?.code || '—'}</div>
            <div className="text-sm text-gray-500">Most Concentrated</div>
            <div className="text-xs text-gray-400">{mostConcentrated ? `${mostConcentrated.count} providers` : ''}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalFlaggedPayments)}</div>
            <div className="text-sm text-gray-500">Total Flagged Payments</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{formatNumber(data.length)}</div>
            <div className="text-sm text-gray-500">Flagged Providers</div>
          </div>
        </div>

        {/* US Grid Map */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Flagged Providers by State</h2>
          <p className="text-sm text-gray-500 mb-4">Hover over a state for details. Click to view state page.</p>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-[500px] relative" onMouseLeave={() => setHoveredState(null)}>
              {GRID.map((row, ri) => (
                <div key={ri} className="flex gap-1 mb-1">
                  {row.map((cell, ci) => {
                    if (!cell) return <div key={ci} className="w-10 h-10 sm:w-12 sm:h-12" />
                    const info = stateMap[cell]
                    const count = info?.count || 0
                    const bg = getFraudColor(count)
                    const textCol = getTextColor(count)
                    return (
                      <Link
                        key={ci}
                        href={`/states/${cell}`}
                        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded text-[10px] sm:text-xs font-bold transition-all hover:scale-110 hover:z-10 hover:shadow-lg border border-gray-300"
                        style={{ backgroundColor: bg, color: textCol }}
                        onMouseEnter={() => setHoveredState(cell)}
                        onMouseLeave={() => setHoveredState(null)}
                      >
                        {cell}
                      </Link>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Tooltip */}
          {hoveredState && (
            <div className="mt-3 p-3 bg-gray-900 text-white rounded-lg inline-block text-sm">
              <span className="font-bold">{STATE_NAMES[hoveredState] || hoveredState}</span>
              {hoveredInfo ? (
                <>: {hoveredInfo.count} flagged provider{hoveredInfo.count !== 1 ? 's' : ''} · {formatCurrency(hoveredInfo.totalPayments)} in payments</>
              ) : (
                <>: No flagged providers</>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-gray-600">
            <span className="font-medium">Legend:</span>
            {[
              { label: '0', color: '#ffffff' },
              { label: '1–4', color: '#d1d5db' },
              { label: '5–9', color: '#eab308' },
              { label: '10–19', color: '#ea580c' },
              { label: '20–39', color: '#dc2626' },
              { label: '40+', color: '#991b1b' },
            ].map(l => (
              <span key={l.label} className="flex items-center gap-1">
                <span className="inline-block w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Regional Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Regional Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(regionStats)
              .sort(([,a], [,b]) => b.count - a.count)
              .map(([region, stats]) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
                className={`text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedRegion === region
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <h3 className="font-bold text-lg text-gray-900">{region}</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Flagged providers</span>
                    <span className="font-semibold text-gray-900">{stats.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Flagged payments</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(stats.payments)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">States</span>
                    <span className="font-semibold text-gray-900">{REGIONS[region].length}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {selectedRegion && (
            <p className="mt-3 text-sm text-gray-500">
              Showing state cards for <strong>{selectedRegion}</strong> below. Click again to clear filter.
            </p>
          )}
        </div>

        {/* State Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            {selectedRegion ? `${selectedRegion} States` : 'All States'} with Flagged Providers
            <span className="text-base font-normal text-gray-500 ml-2">({filteredCards.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map(st => (
              <Link
                key={st.code}
                href={`/states/${st.code}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-red-300 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: getFraudColor(st.count) }}
                    />
                    <h3 className="font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                      {STATE_NAMES[st.code] || st.code}
                    </h3>
                  </div>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{st.code}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Flagged providers</span>
                    <span className="font-semibold text-red-700">{st.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total flagged payments</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(st.totalPayments)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Top provider</span>
                    <span className="font-medium text-gray-700 truncate max-w-[160px]">{st.topProvider}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <SourceCitation />

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Research Disclaimer</p>
              <p>
                This map shows providers statistically flagged by machine learning analysis of Medicare
                payment data. A flag does not constitute an accusation of fraud. Many flagged patterns
                may have legitimate explanations. This is a research tool, not a legal determination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
