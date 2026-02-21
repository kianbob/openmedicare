'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, CalculatorIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency } from '@/lib/format'

interface Procedure {
  code: string
  description: string
  total_payments: number
  total_services: number
  avg_payment_per_service: number
}

export default function CalculatorPage() {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<(Procedure & { qty: number })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/procedures.json')
      .then(r => r.json())
      .then(d => { setProcedures(d.procedures || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const results = search.length >= 2
    ? procedures.filter(p => p.code.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())).slice(0, 10)
    : []

  const addProcedure = (p: Procedure) => {
    if (!selected.find(s => s.code === p.code)) {
      setSelected([...selected, { ...p, qty: 1 }])
      setSearch('')
    }
  }

  const updateQty = (code: string, qty: number) => {
    setSelected(selected.map(s => s.code === code ? { ...s, qty: Math.max(1, qty) } : s))
  }

  const removeProcedure = (code: string) => {
    setSelected(selected.filter(s => s.code !== code))
  }

  const total = selected.reduce((sum, s) => sum + s.avg_payment_per_service * s.qty, 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Cost Calculator', href: '/calculator' }]} />
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Medicare Cost Calculator</h1>
        <p className="text-lg text-gray-600 mb-8">Estimate Medicare costs by selecting procedures. Costs shown are average Medicare payments based on 2023 data.</p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Add Procedures</h2>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search by code or description (e.g., 99213, office visit)..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          {results.length > 0 && (
            <div className="mt-2 border border-gray-200 rounded-lg divide-y max-h-60 overflow-y-auto">
              {results.map(p => (
                <button key={p.code} onClick={() => addProcedure(p)} className="w-full text-left px-4 py-2 hover:bg-blue-50 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-medium text-blue-600">{p.code}</span>
                    <span className="text-sm text-gray-600 ml-2">{p.description}</span>
                  </div>
                  <span className="text-sm text-gray-500">Avg: {formatCurrency(p.avg_payment_per_service)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selected.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Your Estimate</h2>
            <div className="space-y-3">
              {selected.map(s => (
                <div key={s.code} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                  <div className="flex-1">
                    <span className="font-mono font-medium text-blue-600">{s.code}</span>
                    <span className="text-sm text-gray-600 ml-2">{s.description}</span>
                    <div className="text-sm text-gray-500">Avg Medicare payment: {formatCurrency(s.avg_payment_per_service)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500">Qty:</label>
                    <input type="number" min="1" value={s.qty} onChange={e => updateQty(s.code, parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center" />
                  </div>
                  <div className="text-right min-w-[80px] font-bold">{formatCurrency(s.avg_payment_per_service * s.qty)}</div>
                  <button onClick={() => removeProcedure(s.code)} className="text-red-500 hover:text-red-700 text-lg">×</button>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Estimated Total</span>
              <span className="text-2xl font-bold text-medicare-primary">{formatCurrency(total)}</span>
            </div>

            <p className="text-xs text-gray-500 mt-3">⚠️ These are average Medicare payment amounts and may vary by provider, location, and individual circumstances. Actual costs may differ.</p>
          </div>
        )}

        {selected.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <CalculatorIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Search and add procedures above to estimate costs</p>
          </div>
        )}

        <SourceCitation />
      </div>
    </main>
  )
}
