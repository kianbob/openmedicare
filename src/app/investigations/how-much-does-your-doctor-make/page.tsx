'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Specialty {
  specialty: string
  specialty_slug: string
  total_payments: number
  total_services: number
  total_providers: number
  total_beneficiaries: number
  avg_payment_per_service: number
  avg_payment_per_provider: number
  avg_services_per_provider: number
  total_submitted_charges: number
  markup_ratio: number
  years_active: number
  payment_share: number
  service_share: number
  provider_share: number
}

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${n.toFixed(0)}`
}

function fmtNum(n: number): string {
  return n.toLocaleString('en-US')
}

export default function DoctorPayPage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [selected, setSelected] = useState<string>('')

  useEffect(() => {
    fetch('/data/specialties.json')
      .then(r => r.json())
      .then(d => {
        const sorted = (d.specialties as Specialty[]).sort((a, b) => a.specialty.localeCompare(b.specialty))
        setSpecialties(sorted)
      })
  }, [])

  const spec = specialties.find(s => s.specialty === selected)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/investigations" className="hover:text-blue-600">Investigations</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Doctor Pay</span>
        </nav>

        <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Interactive Tool</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-3">
          How Much Does Your Doctor Make From Medicare?
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          Select a specialty to see real payment data from 10 years of Medicare records.
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <label htmlFor="specialty-select" className="block text-sm font-semibold text-gray-700 mb-2">
            Pick a medical specialty
          </label>
          <select
            id="specialty-select"
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">— Choose a specialty —</option>
            {specialties.map(s => (
              <option key={s.specialty_slug} value={s.specialty}>{s.specialty}</option>
            ))}
          </select>
        </div>

        {spec && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{spec.specialty}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
                  <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Avg Payment per Provider</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">{fmt(spec.avg_payment_per_provider)}</p>
                  <p className="text-xs text-blue-600 mt-1">over 10 years</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5">
                  <p className="text-sm font-medium text-emerald-600 uppercase tracking-wide">Total Providers</p>
                  <p className="text-3xl font-bold text-emerald-900 mt-1">{fmtNum(spec.total_providers)}</p>
                  <p className="text-xs text-emerald-600 mt-1">who billed Medicare</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5">
                  <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">Total Medicare Payments</p>
                  <p className="text-3xl font-bold text-purple-900 mt-1">{fmt(spec.total_payments)}</p>
                  <p className="text-xs text-purple-600 mt-1">2014–2023</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5">
                  <p className="text-sm font-medium text-amber-600 uppercase tracking-wide">Markup Ratio</p>
                  <p className="text-3xl font-bold text-amber-900 mt-1">{spec.markup_ratio.toFixed(2)}x</p>
                  <p className="text-xs text-amber-600 mt-1">charged vs. paid</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Avg Services/Provider</p>
                  <p className="font-semibold text-gray-900">{fmtNum(Math.round(spec.avg_services_per_provider))}</p>
                </div>
                <div>
                  <p className="text-gray-500">Avg Payment/Service</p>
                  <p className="font-semibold text-gray-900">${spec.avg_payment_per_service.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Services</p>
                  <p className="font-semibold text-gray-900">{fmtNum(spec.total_services)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Beneficiaries</p>
                  <p className="font-semibold text-gray-900">{fmtNum(spec.total_beneficiaries)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Share of All Payments</p>
                  <p className="font-semibold text-gray-900">{spec.payment_share.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Submitted Charges</p>
                  <p className="font-semibold text-gray-900">{fmt(spec.total_submitted_charges)}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
              <strong>Want to go deeper?</strong>{' '}
              <Link href={`/specialties/${spec.specialty_slug}`} className="underline hover:text-blue-600">
                See the full {spec.specialty} breakdown →
              </Link>
            </div>
          </div>
        )}

        {!spec && selected === '' && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🩺</div>
            <p className="text-lg">Pick a specialty above to see the data</p>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <p>Data source: CMS Medicare Provider Utilization and Payment Data, 2014–2023. Payments reflect total Medicare allowed amounts over 10 years.</p>
          <div className="mt-4 flex gap-4">
            <Link href="/investigations" className="text-blue-600 hover:underline">← All Investigations</Link>
            <Link href="/investigations/specialty-pay-gap" className="text-blue-600 hover:underline">Specialty Pay Gap →</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
