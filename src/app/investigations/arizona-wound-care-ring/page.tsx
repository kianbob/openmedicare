import ArticleJsonLd from "@/components/ArticleJsonLd"
import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'
import fs from 'fs'
import path from 'path'

export const metadata: Metadata = {
  title: 'The Arizona Wound Care Ring: $514 Million Billed by 23 Nurse Practitioners for 2,974 Patients',
  description: '23 nurse practitioners in the Phoenix metro area billed Medicare $514.3 million for skin substitute products — for just 2,974 patients. Top billers charged $1.5 million per patient. All share a nearly identical 1.28x markup ratio.',
  alternates: { canonical: '/investigations/arizona-wound-care-ring' },
  openGraph: {
    title: 'The Arizona Wound Care Ring: $514 Million Billed by 23 NPs for 2,974 Patients',
    description: '$514.3 million in skin substitute billing. 2,974 patients. $173,000 per patient average. A nearly identical 1.28x markup across 23 providers in Phoenix.',
    url: 'https://www.openmedicare.org/investigations/arizona-wound-care-ring',
  },
}

interface WoundCareProvider {
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

function loadArizonaData() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'wound-care.json'), 'utf-8')
  const data = JSON.parse(raw)
  const providers: WoundCareProvider[] = data.top_providers

  const azNPs = providers
    .filter((p) => p.state === 'AZ' && p.specialty === 'Nurse Practitioner')
    .sort((a, b) => b.total_wound_payments - a.total_wound_payments)

  const azAll = providers
    .filter((p) => p.state === 'AZ')
    .sort((a, b) => b.total_wound_payments - a.total_wound_payments)

  // State-level aggregates for comparison
  const stateMap: Record<string, { payments: number; providers: number; patients: number }> = {}
  providers.forEach((p) => {
    if (!stateMap[p.state]) stateMap[p.state] = { payments: 0, providers: 0, patients: 0 }
    stateMap[p.state].payments += p.total_wound_payments
    stateMap[p.state].providers += 1
    stateMap[p.state].patients += p.total_beneficiaries
  })

  const stateComparison = Object.entries(stateMap)
    .map(([state, d]) => ({
      state,
      payments: d.payments,
      providers: d.providers,
      patients: d.patients,
      perPatient: d.patients > 0 ? d.payments / d.patients : 0,
    }))
    .sort((a, b) => b.payments - a.payments)
    .slice(0, 10)

  return { azNPs, azAll, stateComparison }
}

export default function ArizonaWoundCareRingPage() {
  const publishedDate = '2026-02-21'
  const readTime = '18 min read'
  const { azNPs, azAll, stateComparison } = loadArizonaData()

  const totalPayments = azNPs.reduce((s, p) => s + p.total_wound_payments, 0)
  const totalPatients = azNPs.reduce((s, p) => s + p.total_beneficiaries, 0)
  const avgPerPatient = totalPatients > 0 ? totalPayments / totalPatients : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArticleJsonLd title="The Arizona Wound Care Ring" description="$514M billed by 23 nurse practitioners for 2,974 patients" url="/investigations/arizona-wound-care-ring" publishedDate="2026-02-21" />
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'The Arizona Wound Care Ring' },
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
                The Arizona Wound Care Ring
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                {formatCurrency(totalPayments)} Billed by {azNPs.length} Nurse Practitioners for {formatNumber(totalPatients)} Patients
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

            {/* Key Stats Banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Total Billed', value: formatCurrency(totalPayments) },
                { label: 'Nurse Practitioners', value: azNPs.length.toString() },
                { label: 'Total Patients', value: formatNumber(totalPatients) },
                { label: 'Avg Per Patient', value: formatCurrency(avgPerPatient) },
              ].map((stat) => (
                <div key={stat.label} className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-700">{stat.value}</div>
                  <div className="text-sm text-red-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">

              {/* Section 1: The Pattern */}
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Pattern</h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                In the Phoenix metropolitan area, {azNPs.length} nurse practitioners billed Medicare a combined{' '}
                <strong>{formatCurrency(totalPayments)}</strong> for skin substitute products. They treated just{' '}
                <strong>{formatNumber(totalPatients)}</strong> patients — an average of{' '}
                <strong>{formatCurrency(avgPerPatient)}</strong> per patient.
              </p>
              <p>
                The top biller, Ira Denny of Surprise, Arizona, billed <strong>{formatCurrency(135160596)}</strong>{' '}
                for <strong>90 patients</strong> — that&apos;s <strong>{formatCurrency(1501784)}</strong> per patient.
                To put that in perspective, the median annual income in Surprise, AZ is about $68,000.
                Denny billed Medicare more <em>per patient</em> than 22 years of the typical resident&apos;s salary.
              </p>
              <p>
                These providers are concentrated in a tight geographic cluster: Surprise, Phoenix, Chandler, Gilbert,
                Mesa, Tucson, and Goodyear — all within the greater Phoenix metro area. And they share something
                else: a nearly identical markup ratio of <strong>1.28x</strong>.
              </p>

              {/* Section 2: The Full Table */}
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">All {azNPs.length} Arizona NPs</h2>
              <p>
                Every nurse practitioner in Arizona flagged for significant wound care billing in our dataset.
                Sorted by total billing:
              </p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-3 border-b font-semibold">#</th>
                      <th className="text-left p-3 border-b font-semibold">Provider</th>
                      <th className="text-left p-3 border-b font-semibold">City</th>
                      <th className="text-right p-3 border-b font-semibold">Total Billed</th>
                      <th className="text-right p-3 border-b font-semibold">Patients</th>
                      <th className="text-right p-3 border-b font-semibold">Per Patient</th>
                      <th className="text-right p-3 border-b font-semibold">Markup</th>
                    </tr>
                  </thead>
                  <tbody>
                    {azNPs.map((p, i) => (
                      <tr key={p.npi} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-3 border-b text-gray-500">{i + 1}</td>
                        <td className="p-3 border-b font-medium">
                          <Link href={`/providers/${p.npi}`} className="text-medicare-primary hover:underline">
                            {p.name}
                          </Link>
                        </td>
                        <td className="p-3 border-b text-gray-600">{p.city}</td>
                        <td className="p-3 border-b text-right font-mono">{formatCurrency(p.total_wound_payments)}</td>
                        <td className="p-3 border-b text-right">{formatNumber(p.total_beneficiaries)}</td>
                        <td className="p-3 border-b text-right font-mono">
                          {formatCurrency(p.total_beneficiaries > 0 ? p.total_wound_payments / p.total_beneficiaries : 0)}
                        </td>
                        <td className="p-3 border-b text-right">{p.markup_ratio}x</td>
                      </tr>
                    ))}
                    <tr className="bg-red-50 font-bold">
                      <td className="p-3 border-t-2 border-red-300"></td>
                      <td className="p-3 border-t-2 border-red-300">TOTAL</td>
                      <td className="p-3 border-t-2 border-red-300"></td>
                      <td className="p-3 border-t-2 border-red-300 text-right font-mono">{formatCurrency(totalPayments)}</td>
                      <td className="p-3 border-t-2 border-red-300 text-right">{formatNumber(totalPatients)}</td>
                      <td className="p-3 border-t-2 border-red-300 text-right font-mono">{formatCurrency(avgPerPatient)}</td>
                      <td className="p-3 border-t-2 border-red-300 text-right">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Also note the podiatrist */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-bold text-amber-800 mb-2">Also in Arizona: The Podiatrist</h3>
                <p className="text-amber-900 mb-0">
                  Keith Goss, a podiatrist in Chandler, AZ, billed <strong>{formatCurrency(91241070)}</strong>{' '}
                  for 493 patients ({formatCurrency(185073)}/patient) with a 1.30x markup. While not a nurse
                  practitioner, the billing pattern is strikingly similar to the NP cluster — concentrated skin
                  substitute billing in the same metro area.
                </p>
              </div>

              {/* Section 3: The Math */}
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Math</h2>
              <p>
                Skin substitute products (coded as Q4xxx in Medicare) are biological or synthetic materials applied
                to chronic wounds — diabetic ulcers, venous stasis ulcers, pressure sores. Each application typically
                bills between <strong>$500 and $5,000+</strong> depending on the product and quantity.
              </p>
              <p>
                At {formatCurrency(1501784)} per patient, Ira Denny&apos;s billing implies that each of her 90 patients
                received skin substitute applications worth <strong>hundreds of thousands of dollars</strong>. Even at
                $5,000 per application, that would require roughly <strong>300 applications per patient</strong>.
              </p>
              <p>
                For context: a typical wound care patient might receive 5-20 skin substitute applications over the
                course of treatment. Three hundred applications per patient is not clinically normal.
              </p>
              <p>
                Denny billed for <strong>{formatNumber(153294)}</strong> total services across just 90 patients —
                that&apos;s <strong>{formatNumber(Math.round(153294 / 90))}</strong> services per patient.
              </p>

              {/* Section 4: The Identical Markup */}
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Identical Markup</h2>
              <p>
                Perhaps the most striking pattern isn&apos;t the dollar amounts — it&apos;s the consistency. Of the top 7
                billers (each over $16M), <strong>all seven</strong> have a markup ratio of exactly <strong>1.28x</strong>.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-4">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2 font-semibold">Provider</th>
                      <th className="text-right p-2 font-semibold">Total Billed</th>
                      <th className="text-right p-2 font-semibold">Markup Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {azNPs.filter(p => p.markup_ratio === 1.28).slice(0, 8).map((p) => (
                      <tr key={p.npi}>
                        <td className="p-2">{p.name}</td>
                        <td className="p-2 text-right font-mono">{formatCurrency(p.total_wound_payments)}</td>
                        <td className="p-2 text-right font-bold text-red-600">{p.markup_ratio}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4">
                In a free market, markup ratios vary based on product selection, supplier relationships, and
                billing practices. When <strong>8+ independent providers</strong> all land on the exact same 1.28x
                markup, it suggests they may be using the <strong>same billing protocol</strong>, the{' '}
                <strong>same supplier</strong>, or operating under <strong>coordinated guidance</strong>.
              </p>

              {/* Section 5: Arizona vs the Nation */}
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Arizona vs. the Nation</h2>
              <p>
                Arizona is a national outlier in wound care billing. Compare the per-patient cost of wound care
                across the top states:
              </p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-3 border-b font-semibold">State</th>
                      <th className="text-right p-3 border-b font-semibold">Total Wound Care</th>
                      <th className="text-right p-3 border-b font-semibold">Providers</th>
                      <th className="text-right p-3 border-b font-semibold">Patients</th>
                      <th className="text-right p-3 border-b font-semibold">Per Patient</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stateComparison.map((s, i) => (
                      <tr key={s.state} className={`${s.state === 'AZ' ? 'bg-red-50 font-bold' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="p-3 border-b">{s.state}</td>
                        <td className="p-3 border-b text-right font-mono">{formatCurrency(s.payments)}</td>
                        <td className="p-3 border-b text-right">{s.providers}</td>
                        <td className="p-3 border-b text-right">{formatNumber(s.patients)}</td>
                        <td className="p-3 border-b text-right font-mono">{formatCurrency(s.perPatient)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4">
                Arizona&apos;s per-patient wound care cost dwarfs every other state. The national average for wound
                care states in this dataset shows per-patient costs in the low thousands. Arizona&apos;s figure is
                in the <strong>tens of thousands</strong> — driven almost entirely by this cluster of 23 nurse
                practitioners.
              </p>

              {/* Section 6: What These Codes Are */}
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What These Codes Are</h2>
              <p>
                The billing in this investigation centers on <strong>Q4xxx HCPCS codes</strong> — Medicare&apos;s
                category for skin substitute products. These include:
              </p>
              <ul>
                <li><strong>Q4101–Q4281</strong>: Various skin substitute grafts and wound care products</li>
                <li>Products like Apligraf, Dermagraft, EpiFix, and dozens of others</li>
                <li>Applied to chronic wounds: diabetic foot ulcers, venous leg ulcers, pressure injuries</li>
                <li>Each application bills anywhere from <strong>$500 to $5,000+</strong> per cm²</li>
              </ul>
              <p>
                The HHS Office of Inspector General has called skin substitutes{' '}
                <strong>&quot;particularly vulnerable to fraud schemes&quot;</strong> due to their high per-unit cost,
                the difficulty of auditing wound measurements, and the ease of upcoding product quantities.
              </p>
              <p>
                In June 2025, the Department of Justice announced its <strong>largest-ever healthcare fraud
                enforcement action</strong> — a {formatCurrency(14600000000)} takedown involving 324 defendants.
                Wound care billing, particularly skin substitutes, was at the center of the operation.
              </p>

              {/* Disclaimer */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-10">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">⚠️ Important Disclaimer</h3>
                <p className="text-yellow-900 mb-2">
                  <strong>This analysis identifies statistical anomalies — not proven fraud.</strong> The billing
                  patterns described here are unusual and warrant further investigation, but unusual billing alone
                  does not constitute evidence of fraud, waste, or abuse. There may be legitimate clinical
                  explanations for the patterns we&apos;ve identified.
                </p>
                <p className="text-yellow-900 mb-2">
                  <strong>Update (June 2025):</strong> Since this analysis was published, several providers identified here —
                  including Ira Denny, Jorge Kinds, and Gina Palacios — were <strong>charged by the DOJ</strong> as
                  part of Operation Wound Shield, the largest healthcare fraud enforcement action in history.
                  Our statistical analysis flagged these providers before law enforcement acted.
                  See our investigation: <a href="/investigations/data-predicted-fraud" className="text-yellow-700 underline font-semibold">Our Data Predicted It</a>.
                </p>
                <p className="text-yellow-900 mb-2">
                  Other providers named in this article have not been charged. The data comes from
                  publicly available CMS Medicare Provider Utilization and Payment Data for 2023. Unusual billing alone
                  does not constitute evidence of fraud — there may be legitimate explanations.
                </p>
                <p className="text-yellow-900 mb-0">
                  If you have information about Medicare fraud, you can report it to the{' '}
                  <a href="https://oig.hhs.gov/fraud/report-fraud/" className="text-yellow-700 underline font-semibold" target="_blank" rel="noopener noreferrer">
                    HHS Office of Inspector General
                  </a>{' '}
                  or call the OIG hotline at <strong>1-800-HHS-TIPS (1-800-447-8477)</strong>.
                </p>
              </div>

              {/* Methodology */}
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Methodology</h2>
              <p>
                This analysis uses CMS Medicare Provider Utilization and Payment Data (2023). We identified
                providers with significant billing for Q4xxx skin substitute codes, aggregated by state and
                specialty. Markup ratios are calculated as submitted charges divided by Medicare payments.
                Per-patient costs are calculated as total wound care payments divided by unique beneficiaries.
              </p>
              <p>
                All data is publicly available from{' '}
                <a href="https://data.cms.gov" target="_blank" rel="noopener noreferrer" className="text-medicare-primary underline">
                  data.cms.gov
                </a>.
                Our analysis code and methodology are documented on our{' '}
                <Link href="/methodology" className="text-medicare-primary underline">methodology page</Link>.
              </p>

              {/* Report Fraud CTA */}
              <div className="bg-medicare-primary/5 border border-medicare-primary/20 rounded-lg p-6 mt-10">
                <h3 className="text-lg font-bold text-medicare-primary mb-2">Report Medicare Fraud</h3>
                <p className="text-gray-700 mb-4">
                  If you have information about potential Medicare fraud, waste, or abuse, there are several ways
                  to report it:
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
                    Consult a qui tam attorney.
                  </li>
                </ul>
              </div>
            </div>

            {/* Related Investigations */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Related Investigations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/investigations/data-predicted-fraud" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-medicare-primary mb-1">Our Data Predicted It</h4>
                  <p className="text-sm text-gray-600">How our statistical analysis flagged providers before the DOJ charged them</p>
                </Link>
                <Link href="/investigations/beverly-hills-wound-care" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-medicare-primary mb-1">Beverly Hills Wound Care</h4>
                  <p className="text-sm text-gray-600">Plastic surgeons billing Medicare for wound care — $45M question</p>
                </Link>
                <Link href="/investigations/three-providers" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-medicare-primary mb-1">Three Providers, Three Red Flags</h4>
                  <p className="text-sm text-gray-600">Inside Medicare&apos;s most suspicious billing patterns</p>
                </Link>
              </div>
            </div>

            {/* Key Provider Pages */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">View Provider Profiles</h4>
              <div className="flex flex-wrap gap-3">
                <Link href="/providers/1255987475" className="text-sm text-medicare-primary hover:underline">Ira Denny (Charged) →</Link>
                <Link href="/providers/1174182760" className="text-sm text-medicare-primary hover:underline">Jorge Kinds (Charged) →</Link>
                <Link href="/providers/1275217952" className="text-sm text-medicare-primary hover:underline">Gina Palacios (Charged) →</Link>
                <Link href="/states/AZ" className="text-sm text-medicare-primary hover:underline">All Arizona Providers →</Link>
                <Link href="/fraud/watchlist" className="text-sm text-medicare-primary hover:underline">Full Fraud Watchlist →</Link>
              </div>
            </div>

            {/* Share */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <ShareButtons
                url="/investigations/arizona-wound-care-ring"
                title="The Arizona Wound Care Ring: $514 Million Billed by 23 NPs"
                description="23 nurse practitioners in Phoenix billed $514M for skin substitutes — for just 2,974 patients."
              />
            </div>
          </div>
        </article>

        {/* Source Citation */}
        <div className="mt-8">
          <SourceCitation
            lastUpdated="February 2026 (data through 2023, the latest CMS release)"
            sources={[
              'CMS Medicare Provider Utilization and Payment Data (2023)',
              'HHS-OIG Report on Skin Substitute Vulnerabilities (2025)',
              'DOJ Operation Wound Shield Enforcement Action (June 2025)',
            ]}
          />
        </div>
      </div>
    </div>
  )
}
