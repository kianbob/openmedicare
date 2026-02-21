'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ShareFinding from '@/components/ShareFinding'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

interface CovidData {
  providers?: Array<{
    npi: number
    name: string
    total_payments: number
    total_services: number
    specialty: string
    state: string
  }>
  total_spending?: number
  total_providers?: number
}

const knownCases = [
  {
    name: 'Merry Taheri',
    npi: 1184886178,
    credentials: 'MSN FNP',
    specialty: 'Nurse Practitioner',
    location: 'Torrance, CA',
    totalPayments: 12149038,
    k1034Payments: 'Majority of billing',
    totalServices: 1032955,
    riskScore: 96,
    detail: 'Billed $12.1M — 990x the specialty median — primarily through K1034 COVID test codes. As a single nurse practitioner, she billed for over 1 million services in 10 years, which works out to 413 services per working day. The volume alone is physically impossible for one person.',
  },
  {
    name: 'Tatiana Sharahy',
    npi: 1598889248,
    credentials: 'MD',
    specialty: 'Internal Medicine',
    location: 'Los Angeles, CA',
    totalPayments: 5700000,
    k1034Payments: '$5.5M+ in COVID tests',
    totalServices: 260000,
    riskScore: 85,
    detail: 'An internal medicine doctor who billed $5.7M with a 197.7x markup ratio. Her billing included massive COVID test volumes alongside an unusual mix of specialties that don\'t typically overlap.',
  },
]

export default function CovidTests() {
  const [covidData, setCovidData] = useState<CovidData | null>(null)
  const [dataAvailable, setDataAvailable] = useState(false)

  useEffect(() => {
    fetch('/data/covid-test-billing.json')
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json() })
      .then(data => { setCovidData(data); setDataAvailable(true) })
      .catch(() => setDataAvailable(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: 'Fraud Analysis', href: '/fraud' }, { name: 'COVID Test Billing' }]} />

        <h1 className="text-4xl font-bold font-serif text-gray-900 mt-6 mb-4">COVID Test Billing Tracker</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl">
          HCPCS code K1034 — a temporary code for COVID-19 specimen collection — became one of the
          biggest fraud vectors in Medicare history.
        </p>

        <ShareFinding stat="$12.1M" description="in COVID tests billed by a single nurse practitioner through code K1034" url="/fraud/covid-tests" />

        {/* Context */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-10">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">How K1034 Became a Fraud Magnet</h2>
          <div className="text-sm text-blue-800 space-y-2">
            <p>During the pandemic, CMS created temporary billing codes for COVID testing. Code K1034 covered the cost of certain COVID-19 test specimen collection, reimbursed at around $23–$25 per collection.</p>
            <p>The combination of <strong>high volume potential</strong>, <strong>minimal documentation requirements</strong>, and <strong>relaxed oversight</strong> during the public health emergency created ideal conditions for fraud. Some providers billed for hundreds of thousands of collections.</p>
            <p>NPR reported that COVID testing fraud reached into the billions, with some operators setting up pop-up testing sites that billed Medicare for tests that were never processed or for patients who never showed up.</p>
          </div>
          <a
            href="https://www.npr.org/2022/04/13/1092613623/covid-test-fraud-billing-medicare"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-blue-700 hover:underline font-medium"
          >
            📰 NPR: COVID Test Fraud in Medicare →
          </a>
        </div>

        {/* Known Cases */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Flagged Providers</h2>
        <div className="space-y-6 mb-10">
          {knownCases.map(c => (
            <div key={c.npi} className="border border-red-200 rounded-lg overflow-hidden">
              <div className="bg-red-50 px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      <Link href={`/providers/${c.npi}`} className="hover:text-medicare-primary">{c.name}</Link>
                      <span className="text-sm text-gray-500 ml-2">{c.credentials}</span>
                    </h3>
                    <div className="text-sm text-gray-600">{c.specialty} · {c.location}</div>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-800 border border-red-200">
                    Risk: {c.riskScore}/100
                  </span>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{formatCurrency(c.totalPayments)}</div>
                    <div className="text-xs text-gray-500">Total Payments</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{formatNumber(c.totalServices)}</div>
                    <div className="text-xs text-gray-500">Total Services</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{c.k1034Payments}</div>
                    <div className="text-xs text-gray-500">COVID Test Billing</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{Math.round(c.totalServices / 10 / 250)}/day</div>
                    <div className="text-xs text-gray-500">Services Per Working Day</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Extended data or coming soon */}
        {dataAvailable && covidData ? (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Full COVID Test Analysis</h2>
            {covidData.total_spending && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded p-4 text-center">
                  <div className="text-2xl font-bold">{formatCurrency(covidData.total_spending)}</div>
                  <div className="text-sm text-gray-500">Total K1034 Spending</div>
                </div>
                <div className="bg-gray-50 rounded p-4 text-center">
                  <div className="text-2xl font-bold">{formatNumber(covidData.total_providers || 0)}</div>
                  <div className="text-sm text-gray-500">Providers Billing K1034</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mb-10">
            <div className="text-4xl mb-3">🔬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Provider-Level Analysis Coming Soon</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              We&apos;re processing detailed K1034 billing data for all providers. Check back soon for the complete
              COVID test billing leaderboard with individual provider breakdowns.
            </p>
          </div>
        )}

        {/* Related Fraud Analysis */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Fraud Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/fraud/impossible-numbers" className="text-medicare-primary hover:underline text-sm">🧮 Impossible Numbers — Merry Taheri also flagged for 400+ services/day</Link>
            <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline text-sm">🚨 Enhanced Watchlist — 500 flagged providers</Link>
            <Link href="/fraud/deep-dives" className="text-medicare-primary hover:underline text-sm">🔍 Deep Dive Profiles — Top 20 highest-risk providers</Link>
            <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
            <Link href="/fraud/report" className="text-medicare-primary hover:underline text-sm">📞 Report Fraud — OIG Hotline</Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> These are statistical flags based on publicly available CMS data, not accusations of fraud.
            Report suspected fraud: <a href="tel:1-800-447-8477" className="underline font-medium">1-800-HHS-TIPS</a>.
          </p>
        </div>

        <ShareButtons url="https://www.openmedicare.org/fraud/covid-tests" title="COVID Test Billing Tracker — OpenMedicare" />
        <div className="mt-6">
          <SourceCitation sources={['CMS Medicare Provider Utilization and Payment Data (2014-2023)', 'HHS Office of Inspector General', 'NPR COVID Test Fraud Reporting']} lastUpdated="February 2026" />
        </div>
      </div>
    </div>
  )
}
