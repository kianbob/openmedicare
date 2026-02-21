'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

interface Provider {
  npi: number
  name: string
  specialty: string
  state: string
  total_payments: number
  total_services: number
}

export default function ComparePage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/top-providers.json')
      .then(r => r.json())
      .then(d => { setProviders(d.providers || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const results = search.length >= 2
    ? providers.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || String(p.npi).includes(search)).slice(0, 10)
    : []

  const addProvider = (p: Provider) => {
    if (selected.length < 4 && !selected.find(s => s.npi === p.npi)) {
      setSelected([...selected, p])
      setSearch('')
    }
  }

  const removeProvider = (npi: number) => {
    setSelected(selected.filter(s => s.npi !== npi))
  }

  const maxPayments = Math.max(...selected.map(s => s.total_payments), 1)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Compare Providers', href: '/compare' }]} />
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Compare Medicare Providers</h1>
        <p className="text-lg text-gray-600 mb-8">Select up to 4 providers to compare their Medicare payments, services, and specialties side by side.</p>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative max-w-lg">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search providers by name or NPI..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          {results.length > 0 && (
            <div className="mt-2 border border-gray-200 rounded-lg divide-y max-h-60 overflow-y-auto">
              {results.map(p => (
                <button key={p.npi} onClick={() => addProvider(p)} className="w-full text-left px-4 py-2 hover:bg-blue-50 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">{p.name}</span>
                    <span className="text-sm text-gray-500 ml-2">{p.specialty} · {p.state}</span>
                  </div>
                  <span className="text-sm text-blue-600">+ Add</span>
                </button>
              ))}
            </div>
          )}
          {selected.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {selected.map(s => (
                <span key={s.npi} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {s.name}
                  <button onClick={() => removeProvider(s.npi)} className="ml-2 text-blue-600 hover:text-blue-900">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comparison */}
        {selected.length >= 2 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Side-by-Side Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Metric</th>
                    {selected.map(s => (
                      <th key={s.npi} className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                        <Link href={`/providers/${s.npi}`} className="text-blue-600 hover:text-blue-800">{s.name}</Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">Specialty</td>
                    {selected.map(s => <td key={s.npi} className="px-4 py-3 text-center text-gray-600">{s.specialty}</td>)}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">State</td>
                    {selected.map(s => <td key={s.npi} className="px-4 py-3 text-center text-gray-600">{s.state}</td>)}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">Total Payments</td>
                    {selected.map(s => (
                      <td key={s.npi} className="px-4 py-3 text-center">
                        <div className="font-bold text-gray-900">{formatCurrency(s.total_payments)}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-medicare-primary rounded-full h-2" style={{ width: `${(s.total_payments / maxPayments) * 100}%` }} />
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">Total Services</td>
                    {selected.map(s => <td key={s.npi} className="px-4 py-3 text-center font-medium">{formatNumber(s.total_services)}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
            {selected.length === 0 ? 'Search and select at least 2 providers to compare' : 'Select one more provider to start comparing'}
          </div>
        )}

        <SourceCitation />
      </div>
    </main>
  )
}
