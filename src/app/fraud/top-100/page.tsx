'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

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
}

type SortKey = 'risk_rank' | 'name' | 'specialty' | 'state' | 'fraud_probability' | 'total_payments' | 'markup_ratio'

function rowBg(p: number): string {
  if (p > 0.95) return 'bg-red-50/80'
  if (p > 0.93) return 'bg-red-50/50'
  if (p > 0.90) return 'bg-orange-50/50'
  return 'bg-yellow-50/30'
}

function probBarColor(p: number): string {
  if (p > 0.95) return 'bg-red-600'
  if (p > 0.93) return 'bg-red-500'
  if (p > 0.90) return 'bg-orange-500'
  return 'bg-yellow-500'
}

function probBadge(p: number): string {
  if (p > 0.95) return 'text-red-700 font-bold'
  if (p > 0.90) return 'text-red-600 font-semibold'
  return 'text-orange-600 font-semibold'
}

function mode(arr: string[]): string {
  const counts: Record<string, number> = {}
  for (const v of arr) counts[v] = (counts[v] || 0) + 1
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
}

export default function Top100FlaggedProviders() {
  const [data, setData] = useState<MLv2Results | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortKey, setSortKey] = useState<SortKey>('risk_rank')
  const [sortAsc, setSortAsc] = useState(true)

  useEffect(() => {
    fetch('/data/ml-v2-results.json')
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const top100 = useMemo(() => {
    if (!data) return []
    return [...data.still_out_there]
      .sort((a, b) => a.risk_rank - b.risk_rank)
      .slice(0, 100)
  }, [data])

  const sorted = useMemo(() => {
    const copy = [...top100]
    copy.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'name': cmp = a.name.localeCompare(b.name); break
        case 'specialty': cmp = a.specialty.localeCompare(b.specialty); break
        case 'state': cmp = a.state.localeCompare(b.state); break
        case 'fraud_probability': cmp = a.fraud_probability - b.fraud_probability; break
        case 'total_payments': cmp = a.total_payments - b.total_payments; break
        case 'markup_ratio': cmp = a.markup_ratio - b.markup_ratio; break
        default: cmp = a.risk_rank - b.risk_rank
      }
      return sortAsc ? cmp : -cmp
    })
    return copy
  }, [top100, sortKey, sortAsc])

  const stats = useMemo(() => {
    if (top100.length === 0) return null
    const avgProb = top100.reduce((s, p) => s + p.fraud_probability, 0) / top100.length
    const totalPay = top100.reduce((s, p) => s + p.total_payments, 0)
    const topSpecialty = mode(top100.map(p => p.specialty))
    const topState = mode(top100.map(p => p.state))
    return { avgProb, totalPay, topSpecialty, topState }
  }, [top100])

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(key === 'risk_rank' || key === 'name' || key === 'specialty' || key === 'state') }
  }

  function SortHeader({ label, field, className }: { label: string; field: SortKey; className?: string }) {
    return (
      <th
        className={`px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900 select-none ${className ?? ''}`}
        onClick={() => handleSort(field)}
      >
        {label} {sortKey === field ? (sortAsc ? '↑' : '↓') : ''}
      </th>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Top 100 AI-Flagged Medicare Providers',
    description: 'The 100 Medicare providers with the highest AI-predicted fraud probability, ranked by a supervised ML model trained on 2,198 confirmed fraudsters.',
    url: 'https://www.openmedicare.com/fraud/top-100',
    license: 'https://www.usa.gov/government-works',
    creator: { '@type': 'Organization', name: 'OpenMedicare' },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">Loading top 100 providers…</div>
      </div>
    )
  }

  if (!data || top100.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Unable to load data.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[
          { name: 'Fraud Analysis', href: '/fraud' },
          { name: 'Top 100 Flagged Providers' },
        ]} />

        {/* Hero */}
        <div className="mt-6 mb-8 rounded-2xl bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 text-white p-8 sm:p-12 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          </div>
          <div className="relative z-10">
            <div className="text-sm font-medium tracking-widest uppercase text-red-300 mb-3">OpenMedicare ML Analysis</div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif mb-4 leading-tight">
              Top 100 AI-Flagged Medicare Providers
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mb-6">
              Our supervised ML model — trained on {formatNumber(data.trained_on)} confirmed fraudsters — scored {formatNumber(data.total_scored)} Medicare providers.
              These are the 100 with the highest fraud probability. Model AUC: {data.auc_score.toFixed(2)}.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/fraud/still-out-there" className="inline-flex items-center px-5 py-2.5 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/20 text-sm">
                See All 500 Flagged →
              </Link>
              <Link href="/fraud" className="inline-flex items-center px-5 py-2.5 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/20 text-sm">
                Fraud Analysis Hub →
              </Link>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500 mb-1">Avg. Fraud Probability</div>
              <div className="text-2xl font-bold text-red-600">{(stats.avgProb * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500 mb-1">Combined Payments</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPay)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500 mb-1">Most Common Specialty</div>
              <div className="text-xl font-bold text-gray-900">{stats.topSpecialty}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500 mb-1">Most Common State</div>
              <div className="text-2xl font-bold text-gray-900">{stats.topState}</div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <div className="flex gap-3">
            <span className="text-2xl shrink-0">⚠️</span>
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Important Disclaimer</h3>
              <p className="text-sm text-amber-800">
                <strong>This is not an accusation of fraud.</strong> These providers were flagged by a machine learning model based on statistical patterns in billing data.
                High fraud probability means their billing patterns resemble those of confirmed fraudsters — it does not mean they are committing fraud.
                Many legitimate factors (high-volume practices, specialized procedures, regional cost differences) can trigger high scores.
                This data is for research and transparency purposes only. All underlying data is from public CMS datasets.
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <SortHeader label="#" field="risk_rank" className="w-12" />
                  <SortHeader label="Provider" field="name" />
                  <SortHeader label="Specialty" field="specialty" className="hidden lg:table-cell" />
                  <SortHeader label="State" field="state" className="w-16" />
                  <SortHeader label="Fraud Prob." field="fraud_probability" />
                  <SortHeader label="Total Payments" field="total_payments" className="hidden sm:table-cell" />
                  <SortHeader label="Markup" field="markup_ratio" className="hidden md:table-cell" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((p) => (
                  <tr key={p.npi} className={`${rowBg(p.fraud_probability)} hover:bg-red-100/40 transition-colors`}>
                    <td className="px-3 py-3 text-gray-500 font-mono text-xs">{p.risk_rank}</td>
                    <td className="px-3 py-3">
                      <Link href={`/providers/${p.npi}`} className="text-blue-700 hover:text-blue-900 font-medium hover:underline">
                        {p.name}
                      </Link>
                      <div className="lg:hidden text-xs text-gray-500 mt-0.5">{p.specialty}</div>
                    </td>
                    <td className="px-3 py-3 text-gray-600 hidden lg:table-cell">{p.specialty}</td>
                    <td className="px-3 py-3 text-gray-600 font-mono">{p.state}</td>
                    <td className="px-3 py-3 w-40">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5 min-w-[60px]">
                          <div
                            className={`h-2.5 rounded-full ${probBarColor(p.fraud_probability)}`}
                            style={{ width: `${p.fraud_probability * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs tabular-nums whitespace-nowrap ${probBadge(p.fraud_probability)}`}>
                          {(p.fraud_probability * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-700 tabular-nums hidden sm:table-cell">{formatCurrency(p.total_payments)}</td>
                    <td className="px-3 py-3 text-gray-700 tabular-nums hidden md:table-cell">{p.markup_ratio.toFixed(2)}×</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* See All 500 CTA */}
        <div className="text-center mb-12">
          <Link
            href="/fraud/still-out-there"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-200 text-lg"
          >
            See All 500 Flagged Providers →
          </Link>
          <p className="text-sm text-gray-500 mt-3">
            The full dataset includes 500 providers scoring above 86% fraud probability.
          </p>
        </div>

        <div className="mb-6">
          <Link href="/methodology" className="text-sm text-blue-700 hover:underline">📊 How we analyze the data →</Link>
        </div>

        <ShareButtons
          url="https://www.openmedicare.com/fraud/top-100"
          title="Top 100 AI-Flagged Medicare Providers"
          description="ML model trained on 2,198 confirmed fraudsters ranks the 100 highest-risk Medicare providers."
        />
      </div>
    </div>
  )
}
