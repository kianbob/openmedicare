'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
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

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia',PR:'Puerto Rico',VI:'Virgin Islands',GU:'Guam',AS:'American Samoa',MP:'Northern Mariana Islands'
}

export default function StatesPage() {
  const [states, setStates] = useState<StateData[]>([])
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<'total_payments' | 'total_providers' | 'total_services' | 'markup_ratio'>('total_payments')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/states.json')
      .then(r => r.json())
      .then(d => { setStates(d.states || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filtered = states
    .filter(s => {
      if (!search) return true
      const name = STATE_NAMES[s.state] || s.state
      return name.toLowerCase().includes(search.toLowerCase()) || s.state.toLowerCase().includes(search.toLowerCase())
    })
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      return ((a[sortField] || 0) - (b[sortField] || 0)) * mul
    })

  const SortHeader = ({ field, label }: { field: typeof sortField; label: string }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 select-none" onClick={() => handleSort(field)}>
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search states..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((s, i) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-500">
              Showing {filtered.length} of {states.length} states and territories
            </div>
          </div>
        )}

        {/* Related Reading */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Reading</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link href="/investigations/medicare-spending-by-state" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-blue-600">Medicare Spending by State: A Complete Breakdown</div>
              <div className="text-sm text-gray-500">Every state ranked with analysis of why spending varies</div>
            </Link>
            <Link href="/investigations/geographic-inequality" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-blue-600">ZIP Code Lottery</div>
              <div className="text-sm text-gray-500">Why your Medicare costs depend on where you live</div>
            </Link>
          </div>
        </div>

        <SourceCitation />
      </div>
    </main>
  )
}
