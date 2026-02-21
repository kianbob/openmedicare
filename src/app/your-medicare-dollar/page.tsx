'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

interface Specialty {
  specialty: string; specialty_slug: string; total_payments: number
  total_services: number; total_providers: number; payment_share: number
}

interface Stats {
  total_payments: number; total_providers: number; total_services: number; total_beneficiaries: number
}

interface FlaggedProvider {
  npi: string; name: string; total_payments: number; fraud_probability: number
  specialty: string; state: string
}

const COLORS = [
  '#1e40af', '#7c3aed', '#db2777', '#ea580c', '#ca8a04',
  '#16a34a', '#0d9488', '#2563eb', '#9333ea', '#e11d48',
  '#d97706', '#65a30d', '#0891b2', '#4f46e5', '#c026d3',
  '#059669', '#dc2626', '#8b5cf6', '#f59e0b', '#6366f1',
]

export default function YourMedicareDollarPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [flagged, setFlagged] = useState<FlaggedProvider[]>([])
  const [income, setIncome] = useState<string>('65000')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    fetch('/data/stats.json').then(r => r.json()).then(setStats)
    fetch('/data/specialties.json').then(r => r.json()).then(d => setSpecialties(d.specialties || []))
    fetch('/data/ml-v2-results.json').then(r => r.json()).then(d => setFlagged(d.still_out_there || []))
  }, [])

  const totalFlaggedPayments = useMemo(() => flagged.reduce((s, f) => s + f.total_payments, 0), [flagged])

  const flaggedShare = useMemo(() => {
    if (!stats || !totalFlaggedPayments) return 0
    return (totalFlaggedPayments / stats.total_payments) * 100
  }, [stats, totalFlaggedPayments])

  const flaggedCentsPerDollar = useMemo(() => {
    return Math.round(flaggedShare) || 1
  }, [flaggedShare])

  const breakdown = useMemo(() => {
    if (!specialties.length || !stats) return []
    const sorted = [...specialties].sort((a, b) => b.total_payments - a.total_payments)
    const topN = sorted.slice(0, 15)
    const otherPayments = sorted.slice(15).reduce((sum, s) => sum + s.total_payments, 0)
    const total = stats.total_payments

    const items = topN.map((s, i) => ({
      name: s.specialty, slug: s.specialty_slug, payments: s.total_payments,
      share: (s.total_payments / total) * 100, cents: Math.round((s.total_payments / total) * 100),
      color: COLORS[i % COLORS.length],
    }))

    if (otherPayments > 0) {
      items.push({ name: 'All Other Specialties', slug: '', payments: otherPayments,
        share: (otherPayments / total) * 100, cents: Math.round((otherPayments / total) * 100), color: '#6b7280' })
    }
    return items
  }, [specialties, stats])

  const medicareTax = useMemo(() => {
    const num = parseFloat(income.replace(/,/g, ''))
    if (isNaN(num) || num <= 0) return null
    const employeeShare = num * 0.0145
    const employerMatch = num * 0.0145
    const additionalTax = num > 200000 ? (num - 200000) * 0.009 : 0
    return {
      employee: employeeShare, employer: employerMatch, additional: additionalTax,
      total: employeeShare + employerMatch + additionalTax,
    }
  }, [income])

  const yourFraudShare = useMemo(() => {
    if (!medicareTax || !flaggedShare) return null
    return medicareTax.total * (flaggedShare / 100)
  }, [medicareTax, flaggedShare])

  if (!stats || !breakdown.length) {
    return (
      <div className="min-h-screen bg-white"><div className="mx-auto max-w-7xl px-6 py-16">
        <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/3" /><div className="h-64 bg-gray-200 rounded" /></div>
      </div></div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <Breadcrumbs items={[{ name: 'Your Medicare Dollar' }]} />

        <div className="mt-8">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Where Does Your Medicare Dollar Go?
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl">
            For every dollar Medicare spends, here&apos;s how it breaks down across medical specialties.
            Based on {formatCurrency(stats.total_payments)} in total Medicare Part B payments (2014–2023).
          </p>
        </div>

        {/* Tax Calculator */}
        <div className="mt-12 rounded-2xl bg-blue-50 border border-blue-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Medicare Tax Contribution</h2>
          <p className="mt-2 text-gray-600">
            Medicare is funded by a 1.45% payroll tax on employees, matched by employers (2.9% total).
            High earners pay an additional 0.9% above $200K.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div>
              <label htmlFor="income" className="block text-sm font-medium text-gray-700">Your Annual Income</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  id="income" type="text" value={income}
                  onChange={(e) => setIncome(e.target.value.replace(/[^0-9.,]/g, ''))}
                  className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-8 pr-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="65,000"
                />
              </div>
            </div>
          </div>
          {medicareTax && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Your Contribution</p>
                <p className="text-2xl font-bold text-blue-600">${medicareTax.employee.toFixed(2)}</p>
                <p className="text-xs text-gray-400">1.45% of income</p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Employer Match</p>
                <p className="text-2xl font-bold text-blue-600">${medicareTax.employer.toFixed(2)}</p>
                <p className="text-xs text-gray-400">1.45% matched</p>
              </div>
              {medicareTax.additional > 0 && (
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Additional Tax</p>
                  <p className="text-2xl font-bold text-orange-600">${medicareTax.additional.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">0.9% above $200K</p>
                </div>
              )}
              <div className="rounded-lg bg-white p-4 shadow-sm border-2 border-blue-200">
                <p className="text-sm text-gray-500">Total Annual</p>
                <p className="text-2xl font-bold text-gray-900">${medicareTax.total.toFixed(2)}</p>
                <p className="text-xs text-gray-400">your + employer</p>
              </div>
            </div>
          )}
        </div>

        {/* Fraud Context Section */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900">💰 How Much Goes to AI-Flagged Providers?</h2>
          <p className="mt-2 text-gray-600">
            Our machine learning model flagged {flagged.length} providers who received {formatCurrency(totalFlaggedPayments)} in Medicare payments — and many have never been investigated.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg bg-white p-5 shadow-sm text-center">
              <p className="text-sm text-gray-500">Of every $100 in Medicare</p>
              <p className="text-4xl font-bold text-red-600 mt-1">${flaggedShare.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">goes to AI-flagged providers</p>
            </div>
            <div className="rounded-lg bg-white p-5 shadow-sm text-center">
              <p className="text-sm text-gray-500">Total to flagged providers</p>
              <p className="text-4xl font-bold text-red-600 mt-1">{formatCurrency(totalFlaggedPayments)}</p>
              <p className="text-xs text-gray-400 mt-1">across {flagged.length} providers</p>
            </div>
            {yourFraudShare != null && (
              <div className="rounded-lg bg-white p-5 shadow-sm text-center border-2 border-red-200">
                <p className="text-sm text-gray-500">Your tax to flagged providers</p>
                <p className="text-4xl font-bold text-red-600 mt-1">${yourFraudShare.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">of your ${medicareTax?.total.toFixed(2)} annual tax</p>
              </div>
            )}
          </div>

          {/* Visual: $100 bill breakdown */}
          <div className="mt-6 p-4 bg-white rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-3">For every $100 Medicare spends:</p>
            <div className="flex rounded-lg overflow-hidden h-10">
              <div className="bg-green-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${100 - flaggedShare}%` }}>
                ${(100 - flaggedShare).toFixed(2)} normal
              </div>
              <div className="bg-red-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${Math.max(flaggedShare, 3)}%` }}>
                ${flaggedShare.toFixed(2)}
              </div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>✅ Clean providers</span>
              <span>⚠️ AI-flagged providers</span>
            </div>
          </div>

          <Link href="/fraud/still-out-there" className="mt-4 inline-flex items-center text-sm font-medium text-red-700 hover:text-red-800">
            See all AI-flagged providers →
          </Link>
        </div>

        {/* Visual Dollar Breakdown */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Of Every Dollar Medicare Spends...</h2>
          <p className="mt-2 text-gray-600">
            Here&apos;s how each cent is distributed across the top 15 medical specialties.
          </p>

          <div className="mt-8 rounded-xl overflow-hidden border border-gray-200">
            <div className="flex h-16">
              {breakdown.map((item, i) => (
                <div key={item.name} className="relative cursor-pointer transition-opacity"
                  style={{ width: `${item.share}%`, backgroundColor: item.color, opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.4 : 1 }}
                  onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}
                  title={`${item.name}: ${item.cents}¢`}>
                  {item.share > 4 && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">{item.cents}¢</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {hoveredIndex !== null && (
            <div className="mt-4 text-center p-3 rounded-lg bg-gray-50">
              <span className="font-bold" style={{ color: breakdown[hoveredIndex].color }}>{breakdown[hoveredIndex].name}</span>
              : {breakdown[hoveredIndex].cents}¢ of every dollar ({formatCurrency(breakdown[hoveredIndex].payments)} total)
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
            {breakdown.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-default"
                onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(item.payments)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-gray-900">{item.cents}¢</p>
                  <p className="text-xs text-gray-500">{item.share.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shareable stat card */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white text-center">
          <p className="text-sm uppercase tracking-wide opacity-80">Did you know?</p>
          <p className="text-3xl font-bold mt-2">
            {medicareTax ? `$${medicareTax.total.toFixed(0)}` : '$1,885'} of your taxes go to Medicare each year
          </p>
          <p className="mt-2 opacity-80">
            {yourFraudShare ? `$${yourFraudShare.toFixed(2)} of that goes to providers flagged by AI for potential fraud` : `${flaggedCentsPerDollar}¢ of every dollar goes to AI-flagged providers`}
          </p>
          <p className="mt-4 text-xs opacity-60">Source: OpenMedicare analysis of CMS data (2014–2023)</p>
        </div>

        {/* Key stats */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.total_payments)}</p>
            <p className="mt-1 text-sm text-gray-500">Total Medicare Part B Payments</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.total_providers)}</p>
            <p className="mt-1 text-sm text-gray-500">Providers</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.total_services)}</p>
            <p className="mt-1 text-sm text-gray-500">Total Services</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">10</p>
            <p className="mt-1 text-sm text-gray-500">Years of Data (2014–2023)</p>
          </div>
        </div>

        <div className="mt-12">
          <ShareButtons
            url="https://openmedicare.vercel.app/your-medicare-dollar"
            title="Where Does Your Medicare Dollar Go?"
            description={`$${flaggedShare.toFixed(2)} of every $100 in Medicare goes to AI-flagged providers. See the full breakdown.`}
          />
        </div>

        <div className="mt-8"><SourceCitation /></div>
      </div>
    </div>
  )
}
