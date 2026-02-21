'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency } from '@/lib/format'

interface WoundCareData {
  providers?: Array<{ npi: number; name: string; total_payments: number }>
}

const caseStudy = {
  name: 'Som Kohanzadeh',
  npi: 1952575342,
  credentials: 'MD',
  specialty: 'Plastic and Reconstructive Surgery',
  location: 'Beverly Hills, CA',
  totalPayments: 14722228,
  avgMarkup: 59.12,
  riskScore: 92,
  procedures: [
    { code: 'Q4158', name: 'Kerecis Omega3 Wound (skin substitute)', note: 'Fish-skin graft product, premium pricing' },
    { code: 'Q4196', name: 'PuraPly AM/XT (skin substitute)', note: 'Antimicrobial wound matrix' },
    { code: 'G0277', name: 'Hyperbaric oxygen therapy', note: 'Expensive adjunct wound treatment' },
    { code: '11043', name: 'Debridement (muscle/bone)', note: 'Billed at 63.7x markup vs specialty median' },
  ],
}

export default function WoundCare() {
  const [woundData, setWoundData] = useState<WoundCareData | null>(null)
  const [dataAvailable, setDataAvailable] = useState(false)

  useEffect(() => {
    fetch('/data/wound-care.json')
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json() })
      .then(data => { setWoundData(data); setDataAvailable(true) })
      .catch(() => setDataAvailable(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: 'Fraud Analysis', href: '/fraud' }, { name: 'Wound Care' }]} />

        <h1 className="text-4xl font-bold font-serif text-gray-900 mt-6 mb-4">Wound Care Fraud Watchlist</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl">
          Wound care — particularly skin substitutes and related treatments — has become the
          <strong> #1 target</strong> in Medicare fraud enforcement. The DOJ&apos;s largest-ever healthcare fraud
          takedown focused heavily on this sector.
        </p>

        {/* Context boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-3">🏛️ DOJ Takedown: $14.6 Billion</h2>
            <p className="text-sm text-red-800 mb-3">
              In June 2025, the Department of Justice announced its <strong>largest-ever healthcare fraud enforcement action</strong>,
              involving $14.6 billion in alleged fraud. Wound care and skin substitutes were a central focus.
            </p>
            <p className="text-sm text-red-800">
              Charges targeted providers who billed for expensive skin substitute products (some costing $1,000+ per application)
              on patients who didn&apos;t need them — or didn&apos;t receive them at all.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-orange-900 mb-3">⚠️ OIG Warning on Skin Substitutes</h2>
            <p className="text-sm text-orange-800 mb-3">
              The HHS Office of Inspector General has specifically called skin substitutes <strong>&quot;particularly
              vulnerable to fraud&quot;</strong> due to their high reimbursement rates and subjective medical necessity criteria.
            </p>
            <p className="text-sm text-orange-800">
              The <strong>$45 million Vohra Wound Physicians settlement</strong> demonstrated how wound care companies
              can systematically overtreat patients in nursing homes for profit.
            </p>
          </div>
        </div>

        {/* Case Study */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Case Study: {caseStudy.name}</h2>
        <div className="border border-orange-200 rounded-lg overflow-hidden mb-10">
          <div className="bg-orange-50 px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  <Link href={`/providers/${caseStudy.npi}`} className="hover:text-medicare-primary">{caseStudy.name}</Link>
                  <span className="text-sm text-gray-500 ml-2">{caseStudy.credentials}</span>
                </h3>
                <div className="text-sm text-gray-600">{caseStudy.specialty} · {caseStudy.location}</div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-orange-100 text-orange-800 border border-orange-200">
                Risk: {caseStudy.riskScore}/100
              </span>
            </div>
          </div>
          <div className="px-6 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(caseStudy.totalPayments)}</div>
                <div className="text-xs text-gray-500">Total Medicare Payments</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{caseStudy.avgMarkup}x</div>
                <div className="text-xs text-gray-500">Average Markup</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">#2</div>
                <div className="text-xs text-gray-500">On Our Watchlist</div>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Wound Care Billing Codes</h4>
            <div className="space-y-3">
              {caseStudy.procedures.map(proc => (
                <div key={proc.code} className="flex items-start gap-3 bg-gray-50 rounded p-3">
                  <Link href={`/procedures/${proc.code}`} className="text-medicare-primary hover:underline font-mono font-bold text-sm whitespace-nowrap">
                    {proc.code}
                  </Link>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{proc.name}</div>
                    <div className="text-xs text-gray-500">{proc.note}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-red-50 border border-red-200 rounded p-4">
              <h4 className="text-sm font-semibold text-red-800 mb-1">Why This Pattern Matters</h4>
              <p className="text-sm text-red-700">
                A Beverly Hills plastic surgeon billing $14.7M in Medicare — primarily through wound care products
                and debridement at 59x markup — fits the exact pattern the DOJ targeted in its $14.6B takedown.
                Skin substitute codes like Q4158 and Q4196 are among the most expensive per-application Medicare
                reimbursements, and debridement at 63.7x the specialty median is an extreme outlier.
              </p>
            </div>
          </div>
        </div>

        {/* Extended data or coming soon */}
        {dataAvailable && woundData ? (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Full Wound Care Analysis</h2>
            <p className="text-gray-600">Detailed wound care billing data loaded.</p>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mb-10">
            <div className="text-4xl mb-3">🩹</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Wound Care Analysis Coming Soon</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              We&apos;re processing skin substitute billing data (Q-codes) across all providers.
              Check back soon for the complete wound care fraud leaderboard.
            </p>
          </div>
        )}

        {/* Related Fraud Analysis */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Fraud Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/fraud/deep-dives" className="text-medicare-primary hover:underline text-sm">🔍 Deep Dive Profiles — Detailed provider breakdowns</Link>
            <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline text-sm">🚨 Enhanced Watchlist — 500 flagged providers</Link>
            <Link href="/fraud/upcoding" className="text-medicare-primary hover:underline text-sm">📊 Upcoding Detector — Billing code manipulation</Link>
            <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
            <Link href="/fraud/report" className="text-medicare-primary hover:underline text-sm">📞 Report Fraud — OIG Hotline</Link>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> These are statistical flags based on publicly available CMS data, not accusations of fraud.
            Report suspected fraud: <a href="tel:1-800-447-8477" className="underline font-medium">1-800-HHS-TIPS</a>.
          </p>
        </div>

        <ShareButtons url="https://www.openmedicare.org/fraud/wound-care" title="Wound Care Fraud Watchlist — OpenMedicare" />
        <div className="mt-6">
          <SourceCitation sources={['CMS Medicare Provider Utilization and Payment Data (2014-2023)', 'DOJ Healthcare Fraud Enforcement Action (June 2025)', 'HHS Office of Inspector General']} lastUpdated="February 2026" />
        </div>
      </div>
    </div>
  )
}
