'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

interface Provider {
  npi: number
  name: string
  credentials: string
  specialty: string
  city: string
  state: string
  total_payments: number
  total_services: number
  total_beneficiaries: number
  avg_markup: number
  risk_score: number
}

interface FraudFeatures {
  providers?: Array<{ npi: number; services_per_day: number }>
}

const WORKING_DAYS_PER_YEAR = 250
const YEARS = 10

export default function ImpossibleNumbers() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [fraudFeatures, setFraudFeatures] = useState<FraudFeatures | null>(null)

  useEffect(() => {
    // Try fraud-features.json first, fall back to watchlist
    fetch('/data/fraud-features.json')
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json() })
      .then(data => setFraudFeatures(data))
      .catch(() => {})

    fetch('/data/watchlist.json')
      .then(r => r.json())
      .then(data => { setProviders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const impossibleProviders = useMemo(() => {
    return providers
      .filter(p => !/\b(laboratory|holdings|corp|inc|llc|group|health system|hospital|clinic|associates|services|center|imaging|radiology lab)\b/i.test(p.name))
      .map(p => ({
        ...p,
        servicesPerDay: Math.round(p.total_services / YEARS / WORKING_DAYS_PER_YEAR),
      }))
      .filter(p => p.servicesPerDay >= 50)
      .sort((a, b) => b.servicesPerDay - a.servicesPerDay)
  }, [providers])

  const flaggedCount = impossibleProviders.filter(p => p.servicesPerDay >= 200).length

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: 'Fraud Analysis', href: '/fraud' }, { name: 'Impossible Numbers' }]} />

        <h1 className="text-4xl font-bold font-serif text-gray-900 mt-6 mb-4">Impossible Numbers</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl">
          Could one person really do this? We calculate services per working day for every individual
          provider and flag those with physically questionable volumes.
        </p>

        {/* The Math */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-10">
          <h2 className="text-lg font-semibold text-indigo-900 mb-3">📐 The Math</h2>
          <div className="text-sm text-indigo-800 space-y-2 font-mono">
            <p>services_per_day = total_services ÷ {YEARS} years ÷ {WORKING_DAYS_PER_YEAR} working days/year</p>
          </div>
          <div className="mt-4 text-sm text-indigo-800 space-y-2">
            <p><strong>Context:</strong> A typical doctor sees 20-30 patients per day. Even a high-volume practice rarely exceeds 50-60 services per day (some services like lab orders can generate multiple billing lines per patient).</p>
            <p><strong>Red flag threshold:</strong> 200+ services per working day for an individual is physically questionable. At 400+, it&apos;s almost certainly not one person doing the work.</p>
          </div>
        </div>

        {/* Featured Case */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-10">
          <h2 className="text-lg font-semibold text-red-900 mb-3">🏆 The Most Impossible Number</h2>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <Link href="/providers/1184886178" className="text-xl font-bold text-gray-900 hover:text-medicare-primary">Merry Taheri</Link>
              <span className="text-sm text-gray-500 ml-2">MSN FNP · Nurse Practitioner · Torrance, CA</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div>
              <div className="text-3xl font-bold text-red-700">413</div>
              <div className="text-xs text-gray-500">Services Per Working Day</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(1032955)}</div>
              <div className="text-xs text-gray-500">Total Services (10 years)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(12149038)}</div>
              <div className="text-xs text-gray-500">Total Payments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">1 person</div>
              <div className="text-xs text-gray-500">Nurse Practitioner (individual)</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-red-800 bg-red-100 rounded p-3">
            <strong>The question:</strong> Can a single nurse practitioner perform 413 services every working day
            for 10 consecutive years? That&apos;s one service every 1.2 minutes for an 8-hour day, with no breaks,
            no lunch, no documentation time. Every day. For a decade.
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Calculating services per day...</div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Individual Providers by Services Per Day
            </h2>
            <p className="text-sm text-gray-500 mb-6">{flaggedCount} providers with 200+ services/day (red), {impossibleProviders.length} total with 50+/day</p>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-semibold">Provider</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-semibold">Specialty</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase font-semibold">Services/Day</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase font-semibold">Total Services</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase font-semibold">Total Payments</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase font-semibold">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {impossibleProviders.slice(0, 50).map(p => (
                    <tr key={p.npi} className={p.servicesPerDay >= 200 ? 'bg-red-50' : p.servicesPerDay >= 100 ? 'bg-orange-50' : ''}>
                      <td className="px-4 py-3">
                        <Link href={`/providers/${p.npi}`} className="text-sm font-medium text-medicare-primary hover:underline">{p.name}</Link>
                        {p.credentials && <span className="text-xs text-gray-400 ml-1">{p.credentials}</span>}
                        <div className="text-xs text-gray-500">{p.city}, {p.state}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[160px] truncate">{p.specialty}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-bold ${p.servicesPerDay >= 200 ? 'text-red-700' : p.servicesPerDay >= 100 ? 'text-orange-700' : 'text-gray-900'}`}>
                          {p.servicesPerDay}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-700">{formatNumber(p.total_services)}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">{formatCurrency(p.total_payments)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${p.risk_score >= 90 ? 'bg-red-100 text-red-800' : p.risk_score >= 75 ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {p.risk_score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> High service volumes can have legitimate explanations (e.g., lab-like operations under an individual NPI, group practices billing under one provider). These are statistical flags, not accusations of fraud.
            Report suspected fraud: <a href="tel:1-800-447-8477" className="underline font-medium">1-800-HHS-TIPS</a>.
          </p>
        </div>

        <ShareButtons url="https://www.openmedicare.org/fraud/impossible-numbers" title="Impossible Numbers — OpenMedicare" />
        <div className="mt-6">
          <SourceCitation sources={['CMS Medicare Provider Utilization and Payment Data (2014-2023)']} lastUpdated="February 2026" />
        </div>
      </div>
    </div>
  )
}
