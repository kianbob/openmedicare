'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ShareFinding from '@/components/ShareFinding'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

interface Provider {
  npi: string
  name: string
  specialty: string
  city: string
  state: string
  skin_substitute_payments: number
  debridement_payments: number
  hyperbaric_payments: number
  total_wound_payments: number
  total_services: number
  total_beneficiaries: number
  markup_ratio: number
}

interface CodeRow {
  code: string
  description: string
  payments: number
  services: number
  providers: number
  avg_markup: number
}

interface YearlyTrend {
  year: number
  payments: number
  providers: number
  services: number
}

interface WoundData {
  total_wound_payments: number
  top_providers: Provider[]
  top_codes: CodeRow[]
  yearly_trends: YearlyTrend[]
}

type SortKey = 'name' | 'specialty' | 'city' | 'state' | 'total_wound_payments' | 'total_services' | 'total_beneficiaries' | 'markup_ratio'

export default function WoundCare() {
  const [data, setData] = useState<WoundData | null>(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('total_wound_payments')
  const [sortAsc, setSortAsc] = useState(false)

  useEffect(() => {
    fetch('/data/wound-care.json')
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

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading wound care data...</div>
      </div>
    )
  }

  const iraDenny = data.top_providers[0]
  const somK = data.top_providers.find(p => p.name.toLowerCase().includes('kohanzadeh'))

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: 'Fraud Analysis', href: '/fraud' }, { name: 'Wound Care' }]} />

        <h1 className="text-4xl font-bold font-serif text-gray-900 mt-6 mb-4">Wound Care: $5.53 Billion Over 10 Years</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl">
          Skin substitutes and wound care have become the <strong>#1 target</strong> in Medicare fraud enforcement.
          One nurse practitioner billed <strong>$135.2 million</strong> for just <strong>90 patients</strong> — that&apos;s $1.5 million per patient.
        </p>

        <ShareFinding stat="$1.5M per patient" description="One nurse practitioner billed $135M for 90 patients" url="/fraud/wound-care" />

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-red-50 rounded-lg p-5 text-center">
            <div className="text-2xl font-bold text-red-700">{formatCurrency(data.total_wound_payments)}</div>
            <div className="text-sm text-gray-600">Total Wound Care Billing</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-5 text-center">
            <div className="text-2xl font-bold text-orange-700">10 Years</div>
            <div className="text-sm text-gray-600">2014–2023</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-5 text-center">
            <div className="text-2xl font-bold text-blue-700">{data.top_codes.length}</div>
            <div className="text-sm text-gray-600">Wound Care Codes</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-5 text-center">
            <div className="text-2xl font-bold text-purple-700">{formatNumber(data.top_providers.length)}</div>
            <div className="text-sm text-gray-600">Top Providers Analyzed</div>
          </div>
        </div>

        {/* Case Study: Ira Denny */}
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-red-900 mb-3">🚨 Case Study: Ira Denny — $1.5M Per Patient</h2>
          <p className="text-sm text-red-800 mb-4">
            A nurse practitioner in Surprise, AZ billed Medicare <strong>{formatCurrency(iraDenny.total_wound_payments)}</strong> for
            skin substitutes — for only <strong>{iraDenny.total_beneficiaries} beneficiaries</strong>. That works out to <strong>{formatCurrency(iraDenny.total_wound_payments / iraDenny.total_beneficiaries)}</strong> per patient.
            All of the billing was in skin substitutes with zero debridement and zero hyperbaric oxygen.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-xl font-bold text-red-800">{formatCurrency(iraDenny.total_wound_payments)}</div>
              <div className="text-xs text-gray-500">Total Wound Payments</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{iraDenny.total_beneficiaries}</div>
              <div className="text-xs text-gray-500">Beneficiaries</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{formatNumber(iraDenny.total_services)}</div>
              <div className="text-xs text-gray-500">Services</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{iraDenny.markup_ratio}x</div>
              <div className="text-xs text-gray-500">Markup Ratio</div>
            </div>
          </div>
        </div>

        {/* Case Study: Som Kohanzadeh */}
        {somK && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-10">
            <h2 className="text-lg font-semibold text-orange-900 mb-3">📋 Case Study: Som Kohanzadeh — Beverly Hills Plastic Surgeon</h2>
            <p className="text-sm text-orange-800 mb-4">
              A plastic surgeon billing {formatCurrency(somK.total_wound_payments)} in wound care products — fitting the exact pattern
              the DOJ targeted in its $14.6B healthcare fraud takedown.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-xl font-bold text-orange-800">{formatCurrency(somK.total_wound_payments)}</div>
                <div className="text-xs text-gray-500">Total Wound Payments</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{somK.total_beneficiaries}</div>
                <div className="text-xs text-gray-500">Beneficiaries</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{formatNumber(somK.total_services)}</div>
                <div className="text-xs text-gray-500">Services</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{somK.markup_ratio}x</div>
                <div className="text-xs text-gray-500">Markup Ratio</div>
              </div>
            </div>
          </div>
        )}

        {/* 10-Year Trend */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">10-Year Trend: Wound Care Spending</h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-10" style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.yearly_trends} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v: any) => formatCurrency(v)} fontSize={11} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Legend />
              <Line type="monotone" dataKey="payments" stroke="#ef4444" strokeWidth={2} name="Payments" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top 50 Providers */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Top 50 Wound Care Providers</h2>
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
                <th className="px-3 py-2 font-semibold cursor-pointer text-right" onClick={() => handleSort('total_wound_payments')}>Payments{sortIcon('total_wound_payments')}</th>
                <th className="px-3 py-2 font-semibold cursor-pointer text-right" onClick={() => handleSort('total_services')}>Services{sortIcon('total_services')}</th>
                <th className="px-3 py-2 font-semibold cursor-pointer text-right" onClick={() => handleSort('total_beneficiaries')}>Beneficiaries{sortIcon('total_beneficiaries')}</th>
                <th className="px-3 py-2 font-semibold cursor-pointer text-right" onClick={() => handleSort('markup_ratio')}>Markup{sortIcon('markup_ratio')}</th>
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
                  <td className="px-3 py-2 text-right font-mono font-medium">{formatCurrency(p.total_wound_payments)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(p.total_services)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(p.total_beneficiaries)}</td>
                  <td className="px-3 py-2 text-right">{p.markup_ratio}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Wound Care Codes */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Wound Care Codes ({data.top_codes.length})</h2>
        <div className="overflow-x-auto mb-10">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-3 py-2 font-semibold">#</th>
                <th className="px-3 py-2 font-semibold">Code</th>
                <th className="px-3 py-2 font-semibold">Description</th>
                <th className="px-3 py-2 font-semibold text-right">Payments</th>
                <th className="px-3 py-2 font-semibold text-right">Services</th>
                <th className="px-3 py-2 font-semibold text-right">Avg Markup</th>
              </tr>
            </thead>
            <tbody>
              {data.top_codes.map((c, i) => (
                <tr key={c.code} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-2 font-mono font-bold">
                    <Link href={`/procedures/${c.code}`} className="text-medicare-primary hover:underline">{c.code}</Link>
                  </td>
                  <td className="px-3 py-2 text-gray-600 max-w-xs truncate">{c.description}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatCurrency(c.payments)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(c.services)}</td>
                  <td className="px-3 py-2 text-right">{c.avg_markup}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Related Fraud Analysis */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Fraud Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline text-sm">🚨 Enhanced Watchlist — 500 flagged providers</Link>
            <Link href="/fraud/impossible-numbers" className="text-medicare-primary hover:underline text-sm">🧮 Impossible Numbers — Volume anomalies</Link>
            <Link href="/fraud/upcoding" className="text-medicare-primary hover:underline text-sm">📊 Upcoding Detector — Code-level analysis</Link>
            <Link href="/fraud/covid-tests" className="text-medicare-primary hover:underline text-sm">🦠 COVID Test Billing — Questionable claims</Link>
            <Link href="/fraud/deep-dives" className="text-medicare-primary hover:underline text-sm">🔍 Deep Dive Profiles — Top 20 highest-risk</Link>
            <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
            <Link href="/fraud/report" className="text-medicare-primary hover:underline text-sm">📞 Report Fraud — OIG Hotline</Link>
            <Link href="/investigations/wound-care-crisis" className="text-medicare-primary hover:underline text-sm">📰 Wound Care Crisis Investigation</Link>
            <Link href="/investigations/arizona-wound-care-ring" className="text-medicare-primary hover:underline text-sm">📰 Arizona Wound Care Ring</Link>
            <Link href="/investigations/beverly-hills-wound-care" className="text-medicare-primary hover:underline text-sm">📰 Beverly Hills Wound Care</Link>
            <Link href="/methodology" className="text-sm text-blue-700 hover:underline">📊 How we analyze the data →</Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> These are statistical flags based on publicly available CMS data, not accusations of fraud.
            Report suspected fraud: <a href="tel:1-800-447-8477" className="underline font-medium">1-800-HHS-TIPS</a> (1-800-447-8477).
          </p>
        </div>

        <ShareButtons url="https://www.openmedicare.com/fraud/wound-care" title="Wound Care Fraud Watchlist" />
        <div className="mt-6">
          <SourceCitation sources={['CMS Medicare Provider Utilization and Payment Data (2014-2023)', 'DOJ Healthcare Fraud Enforcement Action (June 2025)', 'HHS Office of Inspector General']} lastUpdated="February 2026" />
        </div>
      </div>
    </div>
  )
}
