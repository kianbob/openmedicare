'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPinIcon, MagnifyingGlassIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import StateHeatmap from '@/components/StateHeatmap'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

interface StateData {
  state: string
  total_payments: number
  total_services: number
  total_providers: number
  total_beneficiaries: number
  markup_ratio: number
}

interface MLResult {
  state: string
  specialty: string
  fraud_probability: number
}

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia',PR:'Puerto Rico',VI:'Virgin Islands',GU:'Guam',AS:'American Samoa',MP:'Northern Mariana Islands'
}

type SortField = 'total_payments' | 'total_providers' | 'total_services' | 'markup_ratio' | 'ai_flagged'

export default function StatesPage() {
  const [states, setStates] = useState<StateData[]>([])
  const [flagsByState, setFlagsByState] = useState<Record<string, number>>({})
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('total_payments')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/data/states.json').then(r => r.json()),
      fetch('/data/ml-v2-results.json').then(r => r.json()),
    ]).then(([stateData, mlData]) => {
      setStates(stateData.states || [])
      const counts: Record<string, number> = {}
      ;(mlData.still_out_there || []).forEach((p: MLResult) => {
        counts[p.state] = (counts[p.state] || 0) + 1
      })
      setFlagsByState(counts)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const getSortValue = (s: StateData, field: SortField): number => {
    if (field === 'ai_flagged') return flagsByState[s.state] || 0
    return (s[field] as number) || 0
  }

  const filtered = states
    .filter(s => {
      if (!search) return true
      const name = STATE_NAMES[s.state] || s.state
      return name.toLowerCase().includes(search.toLowerCase()) || s.state.toLowerCase().includes(search.toLowerCase())
    })
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      return (getSortValue(a, sortField) - getSortValue(b, sortField)) * mul
    })

  const totalFlagged = Object.values(flagsByState).reduce((a, b) => a + b, 0)

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 select-none whitespace-nowrap" onClick={() => handleSort(field)}>
      {label} {sortField === field ? (sortDir === 'desc' ? '↓' : '↑') : ''}
    </th>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'States', href: '/states' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Medicare Spending by State</h1>
          <p className="text-lg text-gray-600">Explore Medicare provider payments across all 50 states and territories. Data covers 2014-2023.</p>
        </div>

        {states.length > 0 && (
          <div className="mb-8">
            <StateHeatmap
              data={states.map(s => ({ code: s.state, value: s.total_payments, label: 'Total Payments' }))}
              title="Spending by State"
              linkPrefix="/states"
            />
          </div>
        )}

        {/* Summary Stats */}
        {totalFlagged > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500 mb-1">Total States & Territories</div>
              <div className="text-2xl font-bold text-gray-900">{states.length}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500 mb-1">States with AI-Flagged Providers</div>
              <div className="text-2xl font-bold text-gray-900">{Object.keys(flagsByState).length}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-5 bg-red-50/30">
              <div className="text-sm text-red-600 mb-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="h-4 w-4" />
                Total AI-Flagged Providers
              </div>
              <div className="text-2xl font-bold text-red-700">{totalFlagged}</div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative max-w-md w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Search states..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Sort:</span>
              {([
                ['total_payments', 'Payments'],
                ['total_providers', 'Providers'],
                ['ai_flagged', '🚩 AI-Flagged'],
                ['markup_ratio', 'Markup'],
              ] as [SortField, string][]).map(([field, label]) => (
                <button
                  key={field}
                  onClick={() => handleSort(field)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    sortField === field
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label} {sortField === field ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading state data...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                    <SortHeader field="total_payments" label="Total Payments" />
                    <SortHeader field="total_providers" label="Providers" />
                    <SortHeader field="total_services" label="Services" />
                    <SortHeader field="markup_ratio" label="Avg Markup" />
                    <SortHeader field="ai_flagged" label="🚩 AI-Flagged" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((s, i) => {
                    const flagCount = flagsByState[s.state] || 0
                    return (
                      <tr key={s.state} className={`hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-4 py-3">
                          <Link href={`/states/${s.state}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
                            <MapPinIcon className="h-4 w-4" />
                            {STATE_NAMES[s.state] || s.state} <span className="text-gray-400 text-sm">({s.state})</span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 font-medium">{formatCurrency(s.total_payments)}</td>
                        <td className="px-4 py-3 text-gray-600">{formatNumber(s.total_providers)}</td>
                        <td className="px-4 py-3 text-gray-600">{formatNumber(s.total_services)}</td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${s.markup_ratio > 4 ? 'text-red-600' : s.markup_ratio > 3 ? 'text-orange-600' : 'text-gray-700'}`}>
                            {s.markup_ratio?.toFixed(1)}x
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {flagCount > 0 ? (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              flagCount >= 20 ? 'bg-red-100 text-red-800' :
                              flagCount >= 10 ? 'bg-orange-100 text-orange-800' :
                              flagCount >= 5 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              <ExclamationTriangleIcon className="h-3.5 w-3.5" />
                              {flagCount}
                            </span>
                          ) : (
                            <span className="text-gray-300 text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-500">
              Showing {filtered.length} of {states.length} states and territories
            </div>
          </div>
        )}

        {/* Related Reading & Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Explore More</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link href="/investigations/medicare-spending-by-state" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">📊 State Spending Breakdown</div>
              <div className="text-sm text-gray-500">Every state ranked with analysis</div>
            </Link>
            <Link href="/investigations/geographic-inequality" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">📍 ZIP Code Lottery</div>
              <div className="text-sm text-gray-500">Why costs depend on where you live</div>
            </Link>
            <Link href="/investigations/houston-medicare-capital" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🏙️ Houston: Medicare Capital</div>
              <div className="text-sm text-gray-500">$9.24B — more than most states</div>
            </Link>
            <Link href="/fraud/watchlist" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🚨 Fraud Watchlist</div>
              <div className="text-sm text-gray-500">Flagged providers by state</div>
            </Link>
            <Link href="/search" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🔍 Search Providers</div>
              <div className="text-sm text-gray-500">Find any provider by name</div>
            </Link>
            <Link href="/rural-urban" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="font-medium text-blue-600">🌾 Rural vs Urban</div>
              <div className="text-sm text-gray-500">The geographic divide in Medicare</div>
            </Link>
          </div>
        </div>

        <SourceCitation />
      </div>
    </main>
  )
}
