'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ShareFinding from '@/components/ShareFinding'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface Provider {
  npi: string
  name: string
  specialty: string
  city: string
  state: string
  entity_type: string
  covid_services: number
  covid_beneficiaries: number
  covid_payments: number
}

interface StateRow {
  state: string
  payments: number
  providers: number
  beneficiaries: number
}

interface YearlyTrend {
  year: number
  services: number
  beneficiaries: number
  payments: number
  providers: number
}

interface CovidData {
  total_covid_payments: number
  top_providers: Provider[]
  state_breakdown: StateRow[]
  yearly_trends: YearlyTrend[]
}

type SortKey = 'name' | 'specialty' | 'city' | 'state' | 'covid_payments' | 'covid_services' | 'covid_beneficiaries'

export default function CovidTests() {
  const [data, setData] = useState<CovidData | null>(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('covid_payments')
  const [sortAsc, setSortAsc] = useState(false)

  useEffect(() => {
    fetch('/data/covid-test-billing.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  const filteredProviders = useMemo(() => {
    if (!data) return []
    const q = search.toLowerCase()
    let list = data.top_providers.slice(0, 50)
    if (q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q)
      )
    }
    list.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
      if (typeof av === 'number' && typeof bv === 'number') return sortAsc ? av - bv : bv - av
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })
    return list
  }, [data, search, sortKey, sortAsc])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(false) }
  }

  const sortIcon = (key: SortKey) => sortKey === key ? (sortAsc ? ' ↑' : ' ↓') : ''

  const top15States = useMemo(() => {
    if (!data) return []
    return [...data.state_breakdown].sort((a, b) => b.payments - a.payments).slice(0, 15)
  }, [data])

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading COVID test billing data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: 'Fraud Analysis', href: '/fraud' }, { name: 'COVID Test Billing' }]} />

        <h1 className="text-4xl font-bold font-serif text-gray-900 mt-6 mb-4">COVID Test Billing: $2.84 Billion in K1034 Claims</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl">
          HCPCS code K1034 — a temporary code for COVID-19 specimen collection — became one of the
          biggest fraud vectors in Medicare history. One Tampa pharmacy alone billed <strong>$75.8 million</strong>.
        </p>

        <ShareFinding stat="$75.8M" description="One pharmacy billed Medicare $75.8 million for COVID tests" url="/fraud/covid-tests" />

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-red-50 rounded-lg p-5 text-center">
            <div className="text-2xl font-bold text-red-700">{formatCurrency(data.total_covid_payments)}</div>
            <div className="text-sm text-gray-600">Total K1034 Billing</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-5 text-center">
            <div className="text-2xl font-bold text-orange-700">{formatNumber(data.top_providers.length)}</div>
            <div className="text-sm text-gray-600">Providers Analyzed</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-5 text-center">
            <div className="text-2xl font-bold text-blue-700">{data.state_breakdown.length}</div>
            <div className="text-sm text-gray-600">States/Territories</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-5 text-center">
            <div className="text-2xl font-bold text-purple-700">{data.yearly_trends.length} Years</div>
            <div className="text-sm text-gray-600">2022–2023</div>
          </div>
        </div>

        {/* #1 Provider Callout */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-10">
          <h2 className="text-lg font-semibold text-red-900 mb-3">🏆 #1 Biller: VRA Enterprises LLC</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-xl font-bold text-red-800">{formatCurrency(data.top_providers[0].covid_payments)}</div>
              <div className="text-xs text-gray-500">Total COVID Test Payments</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{formatNumber(data.top_providers[0].covid_services)}</div>
              <div className="text-xs text-gray-500">Services Billed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{formatNumber(data.top_providers[0].covid_beneficiaries)}</div>
              <div className="text-xs text-gray-500">Beneficiaries</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">Tampa, FL</div>
              <div className="text-xs text-gray-500">Pharmacy</div>
            </div>
          </div>
        </div>

        {/* Yearly Trend */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Yearly Trend (2022–2023)</h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-10">
          <div className="grid grid-cols-2 gap-6">
            {data.yearly_trends.map(y => (
              <div key={y.year} className="bg-white rounded-lg p-4 border">
                <div className="text-lg font-bold text-gray-900">{y.year}</div>
                <div className="mt-2 space-y-1">
                  <div className="text-sm"><span className="font-medium">Payments:</span> {formatCurrency(y.payments)}</div>
                  <div className="text-sm"><span className="font-medium">Services:</span> {formatNumber(y.services)}</div>
                  <div className="text-sm"><span className="font-medium">Beneficiaries:</span> {formatNumber(y.beneficiaries)}</div>
                  <div className="text-sm"><span className="font-medium">Providers:</span> {formatNumber(y.providers)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 50 Providers */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Top 50 Providers by COVID Test Billing</h2>
        <input
          type="text"
          placeholder="Search by name, specialty, city, or state..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-96 mb-4 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="overflow-x-auto mb-10">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-3 py-2 font-semibold">#</th>
                <th className="px-3 py-2 font-semibold cursor-pointer" onClick={() => handleSort('name')}>Name{sortIcon('name')}</th>
                <th className="px-3 py-2 font-semibold cursor-pointer" onClick={() => handleSort('specialty')}>Specialty{sortIcon('specialty')}</th>
                <th className="px-3 py-2 font-semibold cursor-pointer" onClick={() => handleSort('city')}>City{sortIcon('city')}</th>
                <th className="px-3 py-2 font-semibold cursor-pointer" onClick={() => handleSort('state')}>State{sortIcon('state')}</th>
                <th className="px-3 py-2 font-semibold cursor-pointer text-right" onClick={() => handleSort('covid_payments')}>Payments{sortIcon('covid_payments')}</th>
                <th className="px-3 py-2 font-semibold cursor-pointer text-right" onClick={() => handleSort('covid_services')}>Services{sortIcon('covid_services')}</th>
                <th className="px-3 py-2 font-semibold cursor-pointer text-right" onClick={() => handleSort('covid_beneficiaries')}>Beneficiaries{sortIcon('covid_beneficiaries')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.map((p, i) => (
                <tr key={p.npi} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-2 font-medium">
                    <Link href={`/providers/${p.npi}`} className="text-medicare-primary hover:underline">{p.name}</Link>
                  </td>
                  <td className="px-3 py-2 text-gray-600">{p.specialty}</td>
                  <td className="px-3 py-2 text-gray-600">{p.city}</td>
                  <td className="px-3 py-2 text-gray-600">{p.state}</td>
                  <td className="px-3 py-2 text-right font-mono font-medium">{formatCurrency(p.covid_payments)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(p.covid_services)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(p.covid_beneficiaries)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* State Breakdown Chart */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">State Breakdown — Top 15 by Payments</h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-6" style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top15States} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" angle={-45} textAnchor="end" fontSize={12} />
              <YAxis tickFormatter={(v: any) => formatCurrency(v)} fontSize={11} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Bar dataKey="payments" fill="#ef4444" name="Payments" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Full State Table */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">All States & Territories ({data.state_breakdown.length})</h2>
        <div className="overflow-x-auto mb-10">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-3 py-2 font-semibold">#</th>
                <th className="px-3 py-2 font-semibold">State</th>
                <th className="px-3 py-2 font-semibold text-right">Payments</th>
                <th className="px-3 py-2 font-semibold text-right">Providers</th>
                <th className="px-3 py-2 font-semibold text-right">Beneficiaries</th>
              </tr>
            </thead>
            <tbody>
              {[...data.state_breakdown].sort((a, b) => b.payments - a.payments).map((s, i) => (
                <tr key={s.state} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-2 font-medium">{s.state}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatCurrency(s.payments)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(s.providers)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(s.beneficiaries)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> These are statistical flags based on publicly available CMS data, not accusations of fraud.
            Report suspected fraud: <a href="tel:1-800-447-8477" className="underline font-medium">1-800-HHS-TIPS</a> (1-800-447-8477).
          </p>
        </div>

        <ShareButtons url="https://www.openmedicare.org/fraud/covid-tests" title="COVID Test Billing Tracker — OpenMedicare" />
        <div className="mt-6">
          <SourceCitation sources={['CMS Medicare Provider Utilization and Payment Data (2022-2023)', 'HHS Office of Inspector General']} lastUpdated="February 2026" />
        </div>
      </div>
    </div>
  )
}
