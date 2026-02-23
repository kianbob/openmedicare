'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { TrendChart } from '@/components/Charts'
import { formatCurrency, formatNumber } from '@/lib/format'

interface YearlyTrend {
  year: number
  payments: number
  services: number
  providers: number
}

interface SpecialtyGrowth {
  name: string
  slug: string
  growth: number
  firstYear: number
  lastYear: number
  firstPayments: number
  lastPayments: number
  totalPayments: number
  yearlyTrends: YearlyTrend[]
}

interface StateGrowth {
  state: string
  name: string
  growth: number
  firstPayments: number
  lastPayments: number
  totalPayments: number
  yearlyTrends: YearlyTrend[]
}

interface GrowthData {
  topSpecialties: SpecialtyGrowth[]
  topStates: StateGrowth[]
  topSpecialtiesFiltered: SpecialtyGrowth[]
  topStatesFiltered: StateGrowth[]
}

export default function FastestGrowingPage() {
  const [data, setData] = useState<GrowthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyGrowth | null>(null)
  const [selectedState, setSelectedState] = useState<StateGrowth | null>(null)
  const [showAllSpecialties, setShowAllSpecialties] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    fetch('/data/fastest-growing.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (!mounted || loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading growth data...</div>
  if (!data) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">No data available</div>

  const specs = showAllSpecialties ? data.topSpecialties.slice(0, 15) : data.topSpecialtiesFiltered.slice(0, 10)
  const states = data.topStatesFiltered.slice(0, 10)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Spending Trends', href: '/trends' },
          { name: 'Fastest Growing', href: '/fastest-growing' }
        ]} />

        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Where Medicare Spending Is Growing Fastest</h1>
          <p className="text-lg text-gray-600">Which specialties, states, and provider types saw the biggest payment increases from 2014 to 2023.</p>
        </div>

        {/* Narrative Intro */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg leading-relaxed">
              Medicare spending didn&apos;t grow uniformly. While total payments rose ~20% over the decade, some corners of the system exploded. <strong>Nurse practitioners saw a 270% payment increase</strong> — reflecting a fundamental shift in who delivers care. Vaccination and immunization billing surged 400-500% with COVID. And geographically, <strong>Sun Belt and Mountain West states</strong> like Idaho (+150%), Arizona (+85%), and Colorado (+61%) far outpaced the national average, driven by population migration and aging demographics.
            </p>
          </div>
        </div>

        {/* ═══════════ SPECIALTIES ═══════════ */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">🏥 Fastest Growing Specialties</h2>
            <button
              onClick={() => setShowAllSpecialties(!showAllSpecialties)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {showAllSpecialties ? 'Show filtered (>$50M baseline)' : 'Show all (including outliers)'}
            </button>
          </div>

          {!showAllSpecialties && (
            <p className="text-sm text-gray-500 mb-4">Filtered to specialties with &gt;$50M in baseline year payments. <button onClick={() => setShowAllSpecialties(true)} className="text-blue-600 underline">Show all</button> to see emerging specialties.</p>
          )}

          <div className="space-y-3 mb-6">
            {specs.map((s, i) => (
              <div
                key={s.slug || s.name}
                className={`bg-white rounded-xl shadow-sm border ${selectedSpecialty?.name === s.name ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'} p-4 cursor-pointer hover:shadow-md transition-all`}
                onClick={() => setSelectedSpecialty(selectedSpecialty?.name === s.name ? null : s)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400 w-8">#{i + 1}</span>
                    <div>
                      <Link href={`/specialties/${s.slug}`} className="font-semibold text-blue-600 hover:underline" onClick={e => e.stopPropagation()}>
                        {s.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(s.firstPayments)} → {formatCurrency(s.lastPayments)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-bold ${s.growth > 100 ? 'text-red-600' : s.growth > 50 ? 'text-orange-600' : 'text-green-600'}`}>
                      +{s.growth.toLocaleString()}%
                    </span>
                    <p className="text-xs text-gray-400">{s.firstYear}–{s.lastYear}</p>
                  </div>
                </div>

                {/* Inline growth bar */}
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.growth > 100 ? 'bg-red-500' : s.growth > 50 ? 'bg-orange-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(100, (s.growth / (specs[0]?.growth || 1)) * 100)}%` }}
                  />
                </div>

                {/* Expandable chart */}
                {selectedSpecialty?.name === s.name && s.yearlyTrends && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Payment Trend</h4>
                    <TrendChart
                      xDataKey="year"
                      yDataKey="value"
                      data={s.yearlyTrends.map(y => ({ year: y.year, value: y.payments }))}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Specialty Insight */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
            <p className="text-blue-800">
              👩‍⚕️ <strong>The rise of nurse practitioners is the defining trend.</strong> NP payments grew 270% as scope-of-practice laws expanded, physician shortages worsened, and health systems increasingly relied on mid-level providers. This isn&apos;t a blip — it&apos;s a structural shift in American healthcare delivery.
            </p>
          </div>
        </div>

        {/* ═══════════ STATES ═══════════ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🗺️ Fastest Growing States</h2>
          <p className="text-sm text-gray-500 mb-4">States with &gt;$50M in baseline year payments, ranked by 10-year payment growth.</p>

          <div className="space-y-3 mb-6">
            {states.map((s, i) => (
              <div
                key={s.state}
                className={`bg-white rounded-xl shadow-sm border ${selectedState?.state === s.state ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'} p-4 cursor-pointer hover:shadow-md transition-all`}
                onClick={() => setSelectedState(selectedState?.state === s.state ? null : s)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400 w-8">#{i + 1}</span>
                    <div>
                      <Link href={`/states/${s.state.toLowerCase()}`} className="font-semibold text-blue-600 hover:underline" onClick={e => e.stopPropagation()}>
                        {s.name || s.state}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(s.firstPayments)} → {formatCurrency(s.lastPayments)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-bold ${s.growth > 60 ? 'text-red-600' : s.growth > 40 ? 'text-orange-600' : 'text-green-600'}`}>
                      +{s.growth}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.growth > 60 ? 'bg-red-500' : s.growth > 40 ? 'bg-orange-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(100, (s.growth / (states[0]?.growth || 1)) * 100)}%` }}
                  />
                </div>

                {selectedState?.state === s.state && s.yearlyTrends && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Payment Trend</h4>
                    <TrendChart
                      xDataKey="year"
                      yDataKey="value"
                      data={s.yearlyTrends.map(y => ({ year: y.year, value: y.payments }))}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* State Insight */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-8">
            <p className="text-orange-800">
              🌵 <strong>The Sun Belt and Mountain West dominate growth.</strong> Idaho (+150%), Arizona (+85%), Colorado (+61%) — retirees are migrating south and west, bringing their Medicare spending with them. Meanwhile, states like New York and Pennsylvania saw much slower growth, reflecting population stagnation and out-migration.
            </p>
          </div>
        </div>

        {/* What's Driving Growth */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4">What&apos;s Driving Medicare Spending Growth?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">👴 Demographics</h3>
              <p className="text-blue-100">10,000 Americans turn 65 every day. The Baby Boom generation is now fully in Medicare, and they&apos;re living longer with more chronic conditions.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">💊 New Treatments</h3>
              <p className="text-blue-100">Expensive biologics, gene therapies, and specialty drugs are transforming care — but at enormous cost. A single course of treatment can exceed $100,000.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">🏥 Provider Expansion</h3>
              <p className="text-blue-100">More NPs, PAs, and telehealth providers are billing Medicare. Each new provider adds services — and costs — to the system.</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/trends" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">📈 10-Year Trends</h4>
              <p className="text-sm text-gray-500 mt-1">The full decade of Medicare spending data</p>
            </Link>
            <Link href="/specialties" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">🏥 All Specialties</h4>
              <p className="text-sm text-gray-500 mt-1">Browse all 132 Medicare specialties</p>
            </Link>
            <Link href="/states" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">🗺️ All States</h4>
              <p className="text-sm text-gray-500 mt-1">State-by-state Medicare spending</p>
            </Link>
          </div>
        </div>

        <SourceCitation />
      </div>
    </main>
  )
}
