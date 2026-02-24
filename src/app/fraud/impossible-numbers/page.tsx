'use client'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ShareFinding from '@/components/ShareFinding'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface FraudProvider {
  npi: string
  name: string
  specialty: string
  city: string
  state: string
  entity_type: string
  total_payments: number
  total_services: number
  total_beneficiaries: number
  services_per_day: number
  beneficiaries_per_day: number
  markup_ratio: number
  svc_per_beneficiary: number
  code_concentration: number
  specialty_zscore: number
}

interface FraudData {
  providers: FraudProvider[]
  total_impossible: number
  total_analyzed: number
}

type SortField = 'services_per_day' | 'total_services' | 'total_payments' | 'beneficiaries_per_day' | 'name'

export default function ImpossibleNumbers() {
  const [data, setData] = useState<FraudData | null>(null)
  const [loading, setLoading] = useState(true)
  const [includeOrgs, setIncludeOrgs] = useState(false)
  const [sortField, setSortField] = useState<SortField>('services_per_day')
  const [sortAsc, setSortAsc] = useState(false)

  useEffect(() => {
    fetch('/data/fraud-features.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!data) return []
    let list = data.providers.filter(p => p.services_per_day >= 50)
    if (!includeOrgs) list = list.filter(p => p.entity_type === 'I')
    list.sort((a, b) => {
      const av = a[sortField] ?? 0
      const bv = b[sortField] ?? 0
      if (typeof av === 'string') return sortAsc ? (av as string).localeCompare(bv as string) : (bv as string).localeCompare(av as string)
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return list
  }, [data, includeOrgs, sortField, sortAsc])

  const top20Chart = useMemo(() => {
    return filtered.slice(0, 20).map(p => ({
      name: p.name.length > 20 ? p.name.slice(0, 18) + '…' : p.name,
      services_per_day: p.services_per_day,
    }))
  }, [filtered])

  const topProvider = useMemo(() => {
    if (!data) return null
    return data.providers
      .filter(p => p.entity_type === 'I')
      .sort((a, b) => b.services_per_day - a.services_per_day)[0]
  }, [data])

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc)
    else { setSortField(field); setSortAsc(false) }
  }

  const sortIcon = (field: SortField) => sortField === field ? (sortAsc ? ' ↑' : ' ↓') : ''

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: 'Fraud Analysis', href: '/fraud' }, { name: 'Impossible Numbers' }]} />
            <InvestigationDisclaimer />
        <h1 className="text-4xl font-bold font-serif text-gray-900 mt-6 mb-4">Impossible Numbers</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl">
          We calculated services per working day for every provider in Medicare and flagged
          <strong> {data ? formatNumber(data.total_impossible) : '4,636'} providers</strong> with physically
          impossible billing volumes.
        </p>

        <ShareFinding
          stat="9,862 services/day"
          description="One doctor averaged a service every 2.9 seconds"
          url="https://www.openmedicare.us/fraud/impossible-numbers"
        />

        {/* Featured Case */}
        {topProvider && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-10">
            <h2 className="text-lg font-semibold text-red-900 mb-3">🏆 The Most Impossible Number</h2>
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <Link href={`/providers/${topProvider.npi}`} className="text-xl font-bold text-gray-900 hover:text-medicare-primary">
                  {topProvider.name}
                </Link>
                <span className="text-sm text-gray-500 ml-2">{topProvider.specialty} · {topProvider.city}, {topProvider.state}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div>
                <div className="text-3xl font-bold text-red-700">{formatNumber(topProvider.services_per_day)}</div>
                <div className="text-xs text-gray-500">Services Per Working Day</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatNumber(topProvider.total_services)}</div>
                <div className="text-xs text-gray-500">Total Services (10 years)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatNumber(topProvider.total_beneficiaries)}</div>
                <div className="text-xs text-gray-500">Unique Beneficiaries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatNumber(Math.round(topProvider.svc_per_beneficiary))}</div>
                <div className="text-xs text-gray-500">Services Per Patient</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-red-800 bg-red-100 rounded p-3">
              <strong>The question:</strong> Can one {topProvider.specialty.toLowerCase()} specialist perform {formatNumber(topProvider.services_per_day)} services every working day?
              That&apos;s one service every {(8 * 3600 / topProvider.services_per_day).toFixed(1)} seconds for an 8-hour day, with no breaks, no lunch, no documentation time.
            </div>
          </div>
        )}

        {/* The Math */}
        {topProvider && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-10">
            <h2 className="text-lg font-semibold text-indigo-900 mb-3">📐 The Math — {topProvider.name}</h2>
            <div className="text-sm text-indigo-800 space-y-2 font-mono">
              <p>{formatNumber(topProvider.total_services)} total services ÷ 10 years ÷ 250 working days/year = <strong>{formatNumber(topProvider.services_per_day)} services/day</strong></p>
              <p>8 hours × 60 min × 60 sec = 28,800 seconds per workday</p>
              <p>28,800 ÷ {formatNumber(topProvider.services_per_day)} = <strong>{(28800 / topProvider.services_per_day).toFixed(1)} seconds per service</strong></p>
            </div>
            <div className="mt-4 text-sm text-indigo-800 space-y-2">
              <p><strong>{formatNumber(topProvider.total_beneficiaries)} beneficiaries</strong> across {formatNumber(topProvider.total_services)} services = <strong>{formatNumber(Math.round(topProvider.svc_per_beneficiary))} services per patient</strong></p>
              <p><strong>Context:</strong> A typical doctor sees 20-30 patients per day. Even a high-volume practice rarely exceeds 50-60 services per day.</p>
              <p><strong>Red flag threshold:</strong> 200+ services per working day for an individual is physically questionable. At 1,000+, it defies the laws of physics.</p>
            </div>
          </div>
        )}

        {/* Bar Chart */}
        {top20Chart.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Top 20 by Services Per Day</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-4" style={{ height: 500 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top20Chart} layout="vertical" margin={{ left: 140, right: 20, top: 5, bottom: 5 }}>
                  <XAxis type="number" tickFormatter={(v: any) => formatNumber(v)} />
                  <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [formatNumber(v), 'Services/Day']} />
                  <Bar dataKey="services_per_day" radius={[0, 4, 4, 0]}>
                    {top20Chart.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? '#dc2626' : i < 5 ? '#ea580c' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading fraud features data...</div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Top 50 Impossible Providers
                </h2>
                <p className="text-sm text-gray-500">{formatNumber(filtered.length)} providers with 50+ services/day ({includeOrgs ? 'individuals + organizations' : 'individuals only'})</p>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={includeOrgs} onChange={e => setIncludeOrgs(e.target.checked)} className="rounded" />
                Include organizations
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-semibold cursor-pointer" onClick={() => handleSort('name')}>Provider{sortIcon('name')}</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-semibold">Specialty</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase font-semibold cursor-pointer" onClick={() => handleSort('services_per_day')}>Services/Day{sortIcon('services_per_day')}</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase font-semibold cursor-pointer" onClick={() => handleSort('beneficiaries_per_day')}>Patients/Day{sortIcon('beneficiaries_per_day')}</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase font-semibold cursor-pointer" onClick={() => handleSort('total_services')}>Total Services{sortIcon('total_services')}</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase font-semibold cursor-pointer" onClick={() => handleSort('total_payments')}>Total Payments{sortIcon('total_payments')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.slice(0, 50).map((p, i) => (
                    <tr key={p.npi} className={p.services_per_day >= 1000 ? 'bg-red-50' : p.services_per_day >= 200 ? 'bg-orange-50' : ''}>
                      <td className="px-4 py-3">
                        <Link href={`/providers/${p.npi}`} className="text-sm font-medium text-medicare-primary hover:underline">{p.name}</Link>
                        <div className="text-xs text-gray-500">{p.city}, {p.state} · {p.entity_type === 'O' ? 'Org' : 'Individual'}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[160px] truncate">{p.specialty}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-bold ${p.services_per_day >= 1000 ? 'text-red-700' : p.services_per_day >= 200 ? 'text-orange-700' : 'text-gray-900'}`}>
                          {formatNumber(p.services_per_day)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-700">{formatNumber(p.beneficiaries_per_day)}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-700">{formatNumber(p.total_services)}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">{formatCurrency(p.total_payments)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Related Fraud Analysis */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Fraud Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/fraud/covid-tests" className="text-medicare-primary hover:underline text-sm">🦠 COVID Test Billing — $2.84B in questionable claims</Link>
            <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline text-sm">🚨 Enhanced Watchlist — 500 flagged providers</Link>
            <Link href="/fraud/upcoding" className="text-medicare-primary hover:underline text-sm">📊 Upcoding Detector — Code-level analysis</Link>
            <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
            <Link href="/fraud/report" className="text-medicare-primary hover:underline text-sm">📞 Report Fraud — OIG Hotline</Link>
            <Link href="/methodology" className="text-sm text-blue-700 hover:underline">📊 How we analyze the data →</Link>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> High service volumes can have legitimate explanations (e.g., lab-like operations under an individual NPI, group practices billing under one provider). These are statistical flags, not accusations of fraud.
            Report suspected fraud: <a href="tel:1-800-447-8477" className="underline font-medium">1-800-HHS-TIPS</a>.
          </p>
        </div>

        <ShareButtons url="https://www.openmedicare.us/fraud/impossible-numbers" title="Impossible Numbers" />
        <div className="mt-6">
          <SourceCitation sources={['CMS Medicare Provider Utilization and Payment Data (2014-2023)']} lastUpdated="February 2026" />
        </div>
      </div>
    </div>
  )
}
