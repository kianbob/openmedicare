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
  svc_99211: number
  svc_99212: number
  svc_99213: number
  svc_99214: number
  svc_99215: number
  total_em: number
  em_payments: number
  upcode_ratio: number
  pct_99214: number
  pct_99215: number
}

interface YearlyTrend {
  year: number
  svc_99214: number
  svc_99213: number
  svc_99215: number
  total_em: number
  pct_99214: number
  ratio_14_to_13: number
}

interface UpcodingData {
  national_ratio: number
  total_providers_analyzed: number
  national_pct_99214: number
  suspicious_providers: Provider[]
  yearly_trends: YearlyTrend[]
}

type SortKey = 'name' | 'specialty' | 'city' | 'state' | 'total_em' | 'em_payments' | 'pct_99214' | 'upcode_ratio'

export default function Upcoding() {
  const [data, setData] = useState<UpcodingData | null>(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('pct_99214')
  const [sortAsc, setSortAsc] = useState(false)

  useEffect(() => {
    fetch('/data/upcoding.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  const filteredProviders = useMemo(() => {
    if (!data) return []
    const q = search.toLowerCase()
    let list = data.suspicious_providers.slice(0, 50)
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
        <div className="text-gray-500">Loading upcoding data...</div>
      </div>
    )
  }

  const cahill = data.suspicious_providers.find(p => p.name.toLowerCase().includes('cahill'))

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: 'Fraud Analysis', href: '/fraud' }, { name: 'Upcoding' }]} />

        <h1 className="text-4xl font-bold font-serif text-gray-900 mt-6 mb-4">Upcoding Detector: 53.2% of Visits Coded at Higher Rate</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl">
          Nationally, 99214 is billed <strong>44% more often</strong> than 99213. Some doctors code <strong>100%</strong> of
          office visits at the higher-paying level — every single visit, every single patient.
        </p>

        <ShareFinding stat="100%" description="Some doctors code every single office visit at the higher rate" url="/fraud/upcoding" />

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-red-50 rounded-lg p-5 text-center">
            <div className="text-2xl font-bold text-red-700">{data.national_ratio.toFixed(2)}</div>
            <div className="text-sm text-gray-600">National 99214:99213 Ratio</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-5 text-center">
            <div className="text-2xl font-bold text-orange-700">{data.national_pct_99214}%</div>
            <div className="text-sm text-gray-600">E/M Visits Coded 99214</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-5 text-center">
            <div className="text-2xl font-bold text-blue-700">{formatNumber(data.total_providers_analyzed)}</div>
            <div className="text-sm text-gray-600">Providers Analyzed</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-5 text-center">
            <div className="text-2xl font-bold text-purple-700">{formatNumber(data.suspicious_providers.length)}</div>
            <div className="text-sm text-gray-600">Suspicious Providers</div>
          </div>
        </div>

        {/* How Upcoding Works */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-10">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">How Upcoding Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <Link href="/procedures/99213" className="text-2xl font-mono font-bold text-blue-600 hover:underline">99213</Link>
                <span className="text-sm text-gray-500">Low complexity visit</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">~$49.50</div>
              <div className="text-sm text-gray-500">15-min visit — cold, refill, BP check</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <Link href="/procedures/99214" className="text-2xl font-mono font-bold text-orange-600 hover:underline">99214</Link>
                <span className="text-sm text-gray-500">Moderate complexity visit</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">~$72.68</div>
              <div className="text-sm text-gray-500">25-min visit — managing multiple conditions</div>
            </div>
          </div>
          <div className="mt-4 bg-white rounded-lg p-4 border border-red-200 text-center">
            <div className="text-sm text-gray-500 mb-1">The upcoding premium per visit</div>
            <div className="text-3xl font-bold text-red-600">+$23.18 per visit (47% more)</div>
            <div className="text-sm text-gray-500 mt-1">At scale, this adds up to billions in overcharges.</div>
          </div>
        </div>

        {/* Thomas Cahill Callout */}
        {cahill && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-10">
            <h2 className="text-lg font-bold text-red-900 mb-3">🚨 Thomas Cahill — 100% Upcoded</h2>
            <p className="text-sm text-red-800 mb-4">
              A cardiologist in O&apos;Fallon, IL coded <strong>every single one</strong> of his {cahill.total_em} office visits
              as 99214. Zero 99213s, zero 99212s. That&apos;s {formatCurrency(cahill.em_payments)} in E/M payments — all at the higher rate.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-xl font-bold text-red-800">{cahill.pct_99214}%</div>
                <div className="text-xs text-gray-500">Coded as 99214</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{cahill.total_em}</div>
                <div className="text-xs text-gray-500">Total E/M Visits</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{formatCurrency(cahill.em_payments)}</div>
                <div className="text-xs text-gray-500">E/M Payments</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{cahill.specialty}</div>
                <div className="text-xs text-gray-500">{cahill.city}, {cahill.state}</div>
              </div>
            </div>
          </div>
        )}

        {/* 10-Year Trend */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">99214 Share of E/M Visits Over 10 Years</h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-10" style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.yearly_trends} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[40, 55]} tickFormatter={(v: any) => `${v}%`} fontSize={11} />
              <Tooltip formatter={(v: any, name: any) => name === 'pct_99214' ? `${v}%` : v} />
              <Legend />
              <Line type="monotone" dataKey="pct_99214" stroke="#ef4444" strokeWidth={2} name="% Coded 99214" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top 50 Suspicious Providers */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Top 50 Suspicious Providers (Ratio = 999 means 0 claims for 99213)</h2>
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
                <th className="px-3 py-2 font-semibold cursor-pointer text-right" onClick={() => handleSort('total_em')}>E/M Visits{sortIcon('total_em')}</th>
                <th className="px-3 py-2 font-semibold cursor-pointer text-right" onClick={() => handleSort('pct_99214')}>% 99214{sortIcon('pct_99214')}</th>
                <th className="px-3 py-2 font-semibold text-right">% 99215</th>
                <th className="px-3 py-2 font-semibold cursor-pointer text-right" onClick={() => handleSort('em_payments')}>Payments{sortIcon('em_payments')}</th>
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
                  <td className="px-3 py-2 text-right">{formatNumber(p.total_em)}</td>
                  <td className="px-3 py-2 text-right font-bold" style={{ color: p.pct_99214 >= 95 ? '#dc2626' : p.pct_99214 >= 80 ? '#ea580c' : '#374151' }}>
                    {p.pct_99214.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2 text-right">{p.pct_99215.toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right font-mono">{formatCurrency(p.em_payments)}</td>
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
            <Link href="/fraud/covid-tests" className="text-medicare-primary hover:underline text-sm">🦠 COVID Test Billing — Questionable claims</Link>
            <Link href="/fraud/wound-care" className="text-medicare-primary hover:underline text-sm">🩹 Wound Care — DOJ&apos;s #1 fraud target</Link>
            <Link href="/fraud/deep-dives" className="text-medicare-primary hover:underline text-sm">🔍 Deep Dive Profiles — Top 20 highest-risk</Link>
            <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
            <Link href="/fraud/report" className="text-medicare-primary hover:underline text-sm">📞 Report Fraud — OIG Hotline</Link>
            <Link href="/investigations/office-visit-economy" className="text-medicare-primary hover:underline text-sm">🏥 The Office Visit Economy</Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> These are statistical flags based on publicly available CMS data, not accusations of fraud.
            A high 99214/99213 ratio may reflect legitimate patient complexity. Report suspected fraud:
            <a href="tel:1-800-447-8477" className="underline font-medium ml-1">1-800-HHS-TIPS</a> (1-800-447-8477).
          </p>
        </div>

        <ShareButtons url="https://www.openmedicare.org/fraud/upcoding" title="Upcoding Detector" />
        <div className="mt-6">
          <SourceCitation sources={['CMS Medicare Provider Utilization and Payment Data (2014-2023)', 'HHS Office of Inspector General']} lastUpdated="February 2026" />
        </div>
      </div>
    </div>
  )
}
