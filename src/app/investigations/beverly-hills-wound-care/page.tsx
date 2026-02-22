import type { Metadata } from 'next'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatPercent } from '@/lib/format'
import fs from 'fs'
import path from 'path'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'Beverly Hills Plastic Surgeons Billing Medicare for Wound Care: A $45 Million Question',
  description: '3 Beverly Hills plastic surgeons and 1 physician assistant billed Medicare $45.6 million — with 83-95% of billing in wound care, not cosmetic surgery. An investigation into Medicare wound care billing in America\'s wealthiest ZIP code.',
  alternates: { canonical: '/investigations/beverly-hills-wound-care' },
  openGraph: {
    title: 'Beverly Hills Plastic Surgeons Billing Medicare for Wound Care: A $45 Million Question',
    description: 'Cosmetic surgeons marketing facelifts and breast augmentation — but billing Medicare almost entirely for wound care products.',
    url: 'https://openmedicare.vercel.app/investigations/beverly-hills-wound-care',
  },
}

interface FraudProvider {
  npi: string
  name: string
  specialty: string
  city: string
  state: string
  total_payments: number
  wound_share_pct: number
  drug_share_pct: number
  total_beneficiaries: number
  total_services: number
  markup_ratio: number
}

function loadBeverlyHillsData() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'fraud-features.json'), 'utf-8')
  const data = JSON.parse(raw)
  const providers: FraudProvider[] = data.providers

  return providers
    .filter((p) => p.city === 'Beverly Hills' && p.wound_share_pct > 50)
    .sort((a, b) => b.total_payments - a.total_payments)
}

export default function BeverlyHillsWoundCarePage() {
  const publishedDate = '2026-02-21'
  const readTime = '14 min read'
  const providers = loadBeverlyHillsData()

  const totalPayments = providers.reduce((s, p) => s + p.total_payments, 0)
  const totalPatients = providers.reduce((s, p) => s + p.total_beneficiaries, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'Beverly Hills Wound Care' },
          ]}
          className="mb-8"
        />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-4">
                Investigation
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4">
                Beverly Hills Plastic Surgeons Billing Medicare for Wound Care
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                A {formatCurrency(totalPayments)} Question
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center">
                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                {new Date(publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {readTime}
              </div>
              <span>By OpenMedicare Investigative Team</span>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">

              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Beverly Hills, California — ZIP code 90210 — is synonymous with wealth, luxury, and cosmetic
                surgery. So when we found <strong>three plastic surgeons and one physician assistant</strong> in
                Beverly Hills billing Medicare a combined <strong>{formatCurrency(totalPayments)}</strong>, with{' '}
                <strong>83–95% of their billing in wound care</strong> rather than cosmetic procedures, it raised
                questions.
              </p>

              {/* The Providers */}
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Providers</h2>

              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-3 border-b font-semibold">Provider</th>
                      <th className="text-left p-3 border-b font-semibold">Specialty</th>
                      <th className="text-right p-3 border-b font-semibold">Total Billing</th>
                      <th className="text-right p-3 border-b font-semibold">Wound Care %</th>
                      <th className="text-right p-3 border-b font-semibold">Drug %</th>
                      <th className="text-right p-3 border-b font-semibold">Patients</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((p, i) => (
                      <tr key={p.npi} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-3 border-b font-medium">
                          <Link href={`/providers/${p.npi}`} className="text-medicare-primary hover:underline">
                            {p.name}
                          </Link>
                        </td>
                        <td className="p-3 border-b text-gray-600">{p.specialty}</td>
                        <td className="p-3 border-b text-right font-mono">{formatCurrency(p.total_payments)}</td>
                        <td className="p-3 border-b text-right font-bold text-red-600">{formatPercent(p.wound_share_pct)}</td>
                        <td className="p-3 border-b text-right">{formatPercent(p.drug_share_pct)}</td>
                        <td className="p-3 border-b text-right">{p.total_beneficiaries.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-red-50 font-bold">
                      <td className="p-3 border-t-2 border-red-300">TOTAL</td>
                      <td className="p-3 border-t-2 border-red-300"></td>
                      <td className="p-3 border-t-2 border-red-300 text-right font-mono">{formatCurrency(totalPayments)}</td>
                      <td className="p-3 border-t-2 border-red-300"></td>
                      <td className="p-3 border-t-2 border-red-300"></td>
                      <td className="p-3 border-t-2 border-red-300 text-right">{totalPatients.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* The Paradox */}
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Beverly Hills Paradox</h2>
              <p>
                These are <strong>board-certified plastic surgeons</strong> practicing in one of the wealthiest
                ZIP codes in America. Their public-facing practices market cosmetic procedures: facelifts,
                rhinoplasty, breast augmentation, body contouring.
              </p>
              <p>
                But their Medicare billing tells a different story. Between 83% and 95% of their Medicare payments
                come from <strong>wound care</strong> — skin substitute products, debridement, and related
                services. These are treatments for chronic wounds like diabetic ulcers and pressure sores —
                conditions overwhelmingly associated with elderly, low-income, and diabetic populations.
              </p>
              <p>
                Beverly Hills (90210) has a median household income of over $100,000. Its population skews
                younger and healthier than the typical wound care patient demographic. The question is:
                where are these wound care patients coming from?
              </p>

              {/* Johnson Lee */}
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Johnson Lee: {formatCurrency(22462191)}</h2>
              <p>
                Johnson Lee is the highest-billing provider in this cluster. His Medicare payments totaled{' '}
                <strong>{formatCurrency(22462191)}</strong> in 2023, with <strong>89% from wound care</strong>{' '}
                and <strong>81.4% from drugs</strong> (primarily skin substitute products billed under Part B).
                He treated {(3596).toLocaleString()} Medicare patients.
              </p>
              <p>
                For a plastic surgeon in Beverly Hills, that volume of Medicare wound care billing is
                extraordinary. The average plastic surgeon bills Medicare approximately $200,000–$400,000
                per year, mostly for reconstructive procedures. Lee&apos;s billing is <strong>50–100x</strong>{' '}
                the typical plastic surgeon&apos;s wound care volume.
              </p>

              {/* Kohanzadeh */}
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Som Kohanzadeh: {formatCurrency(14722228)}</h2>
              <p>
                Som Kohanzadeh is a board-certified plastic surgeon who markets his practice as &quot;Beverly Hills
                Plastic Surgery&quot; on his website (drsom.com), featuring cosmetic procedures including facelifts,
                breast augmentation, and body contouring.
              </p>
              <p>
                But Kohanzadeh also co-founded the <strong>&quot;Wound Institutes of America&quot;</strong> — a wound care
                practice. His Medicare billing reflects this dual identity: <strong>{formatPercent(90.3)}</strong>{' '}
                of his {formatCurrency(14722228)} in Medicare payments came from wound care.
              </p>
              <p>
                Kohanzadeh was also{' '}
                <Link href="/investigations/three-providers" className="text-medicare-primary underline">
                  profiled in our Three Providers investigation
                </Link>{' '}
                for his unusual billing growth trajectory — his Medicare billing grew <strong>770x</strong> over
                a decade, from modest amounts to nearly $29 million when including multi-year totals.
              </p>

              {/* The Bigger Picture */}
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Bigger Picture</h2>
              <p>
                This Beverly Hills cluster is not an isolated finding. It fits a national pattern that the
                Department of Justice targeted in its <strong>June 2025 enforcement action</strong> — the
                largest healthcare fraud takedown in history at {formatCurrency(14600000000)}.
              </p>
              <p>
                The DOJ specifically called out schemes where providers:
              </p>
              <ul>
                <li>Billed for <strong>medically unnecessary skin substitute products</strong></li>
                <li>Received <strong>kickbacks</strong> from product manufacturers</li>
                <li>Applied products to wounds that <strong>didn&apos;t require them</strong></li>
                <li>Operated practices that appeared to be one specialty but <strong>billed primarily as wound care</strong></li>
              </ul>
              <p>
                We are not alleging that these providers engaged in any of these schemes. But the pattern —
                cosmetic surgeons in a wealthy ZIP code billing Medicare almost entirely for wound care
                products — is precisely the type of anomaly that warrants scrutiny.
              </p>

              {/* Disclaimer */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-10">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">⚠️ Important Disclaimer</h3>
                <p className="text-yellow-900 mb-2">
                  <strong>This analysis identifies statistical anomalies — not proven fraud.</strong> The billing
                  patterns described here are unusual and warrant further investigation, but unusual billing alone
                  does not constitute evidence of fraud, waste, or abuse. There may be legitimate clinical
                  explanations for these billing patterns.
                </p>
                <p className="text-yellow-900 mb-2">
                  Some plastic surgeons do legitimately treat chronic wounds as part of reconstructive surgery
                  practices. Wound care is within the scope of plastic surgery training. The providers named in
                  this article have not been charged with any crime.
                </p>
                <p className="text-yellow-900 mb-0">
                  All data comes from publicly available CMS Medicare Provider Utilization and Payment Data (2023).
                  If you have information about Medicare fraud, report it to the{' '}
                  <a href="https://oig.hhs.gov/fraud/report-fraud/" className="text-yellow-700 underline font-semibold" target="_blank" rel="noopener noreferrer">
                    HHS Office of Inspector General
                  </a>{' '}
                  or call <strong>1-800-HHS-TIPS (1-800-447-8477)</strong>.
                </p>
              </div>

              {/* Methodology */}
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Methodology</h2>
              <p>
                We analyzed CMS Medicare Provider Utilization and Payment Data (2023), filtering for providers
                in Beverly Hills with wound care billing exceeding 50% of total payments. Wound care share
                is calculated from Q4xxx skin substitute codes, debridement codes, and related wound management
                services as a percentage of total Medicare payments.
              </p>
              <p>
                All data is publicly available from{' '}
                <a href="https://data.cms.gov" target="_blank" rel="noopener noreferrer" className="text-medicare-primary underline">
                  data.cms.gov
                </a>.
              </p>

              {/* Report Fraud CTA */}
              <div className="bg-medicare-primary/5 border border-medicare-primary/20 rounded-lg p-6 mt-10">
                <h3 className="text-lg font-bold text-medicare-primary mb-2">Report Medicare Fraud</h3>
                <p className="text-gray-700 mb-4">
                  If you have information about potential Medicare fraud, waste, or abuse:
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>
                    <strong>HHS-OIG Hotline:</strong>{' '}
                    <a href="tel:1-800-447-8477" className="text-medicare-primary underline">1-800-HHS-TIPS (1-800-447-8477)</a>
                  </li>
                  <li>
                    <strong>Online:</strong>{' '}
                    <a href="https://oig.hhs.gov/fraud/report-fraud/" target="_blank" rel="noopener noreferrer" className="text-medicare-primary underline">
                      oig.hhs.gov/fraud/report-fraud
                    </a>
                  </li>
                  <li>
                    <strong>False Claims Act:</strong> Whistleblowers may be eligible for 15-30% of recovered funds.
                  </li>
                </ul>
              </div>
            </div>

            {/* Share */}
            <div className="mt-10 pt-8 border-t border-gray-200">
        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/arizona-wound-care-ring" className="text-medicare-primary hover:underline text-sm">🩹 Arizona Wound Care Ring</Link>
            <Link href="/investigations/wound-care-crisis" className="text-medicare-primary hover:underline text-sm">🩹 Wound Care Crisis</Link>
            <Link href="/investigations/beverly-hills-billing" className="text-medicare-primary hover:underline text-sm">💎 Beverly Hills Billing</Link>
            <Link href="/states/CA" className="text-medicare-primary hover:underline text-sm">📍 California Medicare Data</Link>
            <Link href="/fraud/wound-care" className="text-medicare-primary hover:underline text-sm">📊 Wound Care Watchlist</Link>
          </div>
        </div>

              <ShareButtons
                url="/investigations/beverly-hills-wound-care"
                title="Beverly Hills Plastic Surgeons Billing Medicare for Wound Care"
                description="3 plastic surgeons in Beverly Hills billed Medicare $45.6M — 83-95% in wound care, not cosmetic surgery."
              />
            <InvestigationDisclaimer />            </div>
          </div>
        </article>

        {/* Source Citation */}
        <div className="mt-8">
          <SourceCitation
            lastUpdated="February 2026 (data through 2023, the latest CMS release)"
            sources={[
              'CMS Medicare Provider Utilization and Payment Data (2023)',
              'DOJ Healthcare Fraud Enforcement Action (June 2025)',
              'HHS-OIG Skin Substitute Vulnerability Report (2025)',
            ]}
          />
        </div>
      </div>
    </div>
  )
}
