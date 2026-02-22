import ArticleJsonLd from "@/components/ArticleJsonLd"
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'

export const metadata: Metadata = {
  title: '4,636 Doctors Billing the Impossible: Medicare\'s Phantom Workforce | OpenMedicare',
  description: '4,636 Medicare providers billed more services per day than humanly possible. Top: Madhavi Rayapudi at 9,862/day. But many are drug unit billing, not fraud.',
  openGraph: {
    title: '4,636 Doctors Billing the Impossible',
    description: 'Medicare\'s phantom workforce: providers billing thousands of services per day. The truth is more nuanced than it appears.',
    type: 'article',
  },
}

const TOP_IMPOSSIBLE = [
  { name: 'Madhavi Rayapudi', specialty: 'Infectious Disease', city: 'Cumming', state: 'GA', servicesPerDay: 9862, totalServices: 2465495, totalPayments: 1250413, drugSharePct: 25.5, codeConcentration: 0.96 },
  { name: 'Vatsala Sastry', specialty: 'Infectious Disease', city: 'Brooksville', state: 'FL', servicesPerDay: 9287, totalServices: 2321839, totalPayments: 833049, drugSharePct: 36.7, codeConcentration: 0.945 },
  { name: 'Jeffrey Lin', specialty: 'Infectious Disease', city: 'Fort Walton Beach', state: 'FL', servicesPerDay: 8486, totalServices: 2121542, totalPayments: 2212636, drugSharePct: 49.9, codeConcentration: 0.92 },
  { name: 'Mohamed Erritouni', specialty: 'Infectious Disease', city: 'Delray Beach', state: 'FL', servicesPerDay: 6889, totalServices: 1722256, totalPayments: 1010187, drugSharePct: 28.9, codeConcentration: 0.961 },
  { name: 'Violetta Mailyan', specialty: 'Family Practice', city: 'Glendale', state: 'CA', servicesPerDay: 6334, totalServices: 1583465, totalPayments: 8751101, drugSharePct: 88.9, codeConcentration: 0.995 },
  { name: 'David Warrow', specialty: 'Ophthalmology', city: 'Hagerstown', state: 'MD', servicesPerDay: 6159, totalServices: 1539669, totalPayments: 15061230, drugSharePct: 60.4, codeConcentration: 0.9 },
  { name: 'Sheeba Mathai', specialty: 'Nurse Practitioner', city: 'Frisco', state: 'TX', servicesPerDay: 5509, totalServices: 1377269, totalPayments: 16207674, drugSharePct: 0.0, codeConcentration: 1.0 },
  { name: 'William Harper', specialty: 'Urology', city: 'Columbus', state: 'GA', servicesPerDay: 4757, totalServices: 1189309, totalPayments: 680038, drugSharePct: 18.8, codeConcentration: 0.975 },
  { name: 'Patrick Anastasio', specialty: 'Internal Medicine', city: 'Fort Walton Beach', state: 'FL', servicesPerDay: 4733, totalServices: 1183273, totalPayments: 10307266, drugSharePct: 96.0, codeConcentration: 0.888 },
  { name: 'Robert Brennan', specialty: 'Infectious Disease', city: 'Lynchburg', state: 'VA', servicesPerDay: 4324, totalServices: 1081020, totalPayments: 15926131, drugSharePct: 97.6, codeConcentration: 0.222 },
]

const SPECIALTY_BREAKDOWN = [
  { specialty: 'Hematology-Oncology', count: 987, pctDrugBilling: 82 },
  { specialty: 'Rheumatology', count: 842, pctDrugBilling: 88 },
  { specialty: 'Infectious Disease', count: 456, pctDrugBilling: 34 },
  { specialty: 'Ophthalmology', count: 312, pctDrugBilling: 72 },
  { specialty: 'Nurse Practitioner', count: 298, pctDrugBilling: 65 },
  { specialty: 'Internal Medicine', count: 267, pctDrugBilling: 58 },
  { specialty: 'Other', count: 1474, pctDrugBilling: 45 },
]

function formatNum(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

export default function The4636ImpossibleDoctorsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="4,636 Doctors Billing the Impossible: Medicare's Phantom Workforce"
        description="4,636 Medicare providers billed more services per day than humanly possible — but the truth involves J-codes, drug units, and billing mechanics."
        url="/investigations/the-4636-impossible-doctors"
        publishedDate="2026-02-21"
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: '4,636 Impossible Doctors' },
        ]} className="mb-8" />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-4">
                Investigation
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4">
                4,636 Doctors Billing the Impossible
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                Medicare&apos;s Phantom Workforce
              </p>
              <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDaysIcon className="h-4 w-4" />
                  February 21, 2026
                </span>
                <span className="flex items-center gap-1.5">
                  <ClockIcon className="h-4 w-4" />
                  14 min read
                </span>
              </div>
              <div className="mt-4">
                <ShareButtons title="4,636 Doctors Billing the Impossible" url="https://www.openmedicare.com/investigations/the-4636-impossible-doctors" />
              </div>
            </div>

            <InvestigationDisclaimer />

            {/* Lead */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl leading-relaxed">
                When we ran the numbers on every Medicare provider in the United States — 1.17 million of them —
                we found <strong>4,636 providers</strong> billing more services per working day than any human could
                possibly deliver. The top name on the list? <strong>Madhavi Rayapudi</strong>, an infectious disease
                doctor in Cumming, Georgia, who billed <strong>9,862 services per day</strong>.
              </p>

              <p>
                That&apos;s one service every <strong>0.05 seconds</strong>. Not every minute. Every fraction of a second.
                Twenty-four hours a day wouldn&apos;t be enough. A hundred hours a day wouldn&apos;t be enough.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-8 rounded-r-lg">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">⚠️ Before You Grab the Pitchforks</h3>
                <p className="text-amber-900 mb-3">
                  Most of these &ldquo;impossible&rdquo; numbers aren&apos;t fraud — they&apos;re a quirk of how Medicare
                  counts services. When a doctor administers an IV infusion drug, <strong>each unit of the drug
                  is counted as a separate service</strong>. A single cancer patient receiving chemotherapy might
                  generate hundreds of &ldquo;services&rdquo; in a single visit.
                </p>
                <p className="text-amber-900">
                  These are called <strong>J-codes</strong> (HCPCS codes starting with &ldquo;J&rdquo;), and they represent
                  injectable drugs billed per unit. A single vial of a biologic drug might contain 100+ billable units.
                  The doctor didn&apos;t see 9,862 patients — they administered drugs whose unit counts add up to that number.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Top 10: Impossible by the Numbers</h2>

              <p>
                These are the ten providers with the highest services-per-day rates in all of Medicare.
                Every single one bills over 4,000 &ldquo;services&rdquo; per working day. Look at the drug share
                percentage — it tells the real story.
              </p>
            </div>

            {/* Top 10 Table */}
            <div className="overflow-x-auto my-8">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Provider</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Specialty</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Svc/Day</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Paid</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Drug %</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Code Conc.</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_IMPOSSIBLE.map((p, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.city}, {p.state}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{p.specialty}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-red-700">
                        {p.servicesPerDay.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">{formatNum(p.totalPayments)}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          p.drugSharePct > 50 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {p.drugSharePct}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-gray-600">{p.codeConcentration.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The J-Code Effect: Why the Numbers Lie</h2>

              <p>
                Medicare&apos;s billing system was designed in an era of office visits and surgical procedures. When
                injectable drugs entered the picture — chemotherapy, biologics, IV antibiotics — the system wasn&apos;t
                redesigned. Instead, each unit of each drug became a &ldquo;service.&rdquo;
              </p>

              <p>
                Consider a rheumatologist administering <strong>Rituximab</strong> to a patient. A single infusion might
                be billed as 500+ individual &ldquo;services&rdquo; — one for each milligram unit. The doctor sees one
                patient, performs one procedure, but Medicare records 500 services. Multiply by 10-20 patients per day,
                and suddenly you&apos;re at 5,000-10,000 &ldquo;services.&rdquo;
              </p>

              <p>
                This is why <strong>Hematology-Oncology</strong> and <strong>Rheumatology</strong> dominate our
                impossible list. These specialties administer the most expensive, highest-unit-count injectable drugs
                in medicine.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Specialty Breakdown</h2>

              <p>
                Of the 4,636 impossible providers, the distribution by specialty reveals the drug-billing pattern:
              </p>
            </div>

            {/* Specialty Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
              {SPECIALTY_BREAKDOWN.map((s) => (
                <div key={s.specialty} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900">{s.specialty}</span>
                    <span className="text-lg font-bold text-indigo-700">{s.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${s.pctDrugBilling}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">{s.pctDrugBilling}% attributable to drug unit billing</div>
                </div>
              ))}
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Ones That Aren&apos;t J-Codes</h2>

              <p>
                But not every impossible number can be explained by drug billing. Look at <strong>Sheeba Mathai</strong>,
                a nurse practitioner in Frisco, Texas: 5,509 services per day, <strong>0% drug billing</strong>, and
                a code concentration of 1.0 — meaning every single service is the same procedure code.
                Her 1.37 million services went to 169,879 beneficiaries, all coded as COVID testing.
              </p>

              <p>
                Or <strong>David Chess</strong>, a geriatric medicine doctor in Stratford, Connecticut:
                3,390 services per day to <strong>209,711 beneficiaries</strong> — more patients than the
                entire population of most Connecticut cities. His $41.7 million in payments with zero drug billing
                raises very different questions than the oncologists.
              </p>

              <p>
                These outliers — the ones with low drug percentages and impossibly high patient counts — are
                where the real investigative questions begin. The J-code providers are gaming a broken counting
                system. The non-drug impossible providers may be gaming something else entirely.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The COVID Factor</h2>

              <p>
                A significant subset of impossible providers — including Sheeba Mathai, Merry Taheri, and
                Linda Bankovich — show <strong>99-100% COVID share</strong> in their billing. During the pandemic,
                mass testing sites could legitimately process thousands of patients per day, with each test
                counted as a service under the provider&apos;s NPI.
              </p>

              <p>
                These aren&apos;t individual doctors seeing individual patients. They&apos;re billing entities — testing
                sites, mobile clinics, drive-through operations — where the NPI serves as an organizational
                identifier more than a personal one.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What This Means for Fraud Detection</h2>

              <p>
                The &ldquo;services per day&rdquo; metric — which seems like the ultimate fraud indicator — turns out to
                be deeply flawed when applied without context. A naive algorithm flagging anyone over 100 services
                per day would catch <strong>every oncologist in America</strong> who administers chemotherapy.
              </p>

              <p>
                This is why our <Link href="/investigations/impossible-doctors" className="text-indigo-600 hover:text-indigo-800">
                full impossible doctors analysis</Link> uses multiple signals: drug share percentage,
                code concentration, beneficiary counts, and specialty Z-scores. The goal isn&apos;t to flag
                high-volume billers — it&apos;s to find the ones whose volume can&apos;t be explained by any
                legitimate billing pattern.
              </p>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3">📊 By the Numbers</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-700">4,636</div>
                    <div className="text-xs text-gray-600">Impossible Providers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-700">9,862</div>
                    <div className="text-xs text-gray-600">Max Svc/Day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-700">~70%</div>
                    <div className="text-xs text-gray-600">Drug Unit Billing</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-700">~15%</div>
                    <div className="text-xs text-gray-600">COVID Testing</div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Systemic Problem</h2>

              <p>
                The real scandal isn&apos;t 4,636 individual providers. It&apos;s that Medicare&apos;s service counting
                system makes it <em>impossible</em> to distinguish a doctor who saw 50 patients from one who
                saw 5 patients but administered expensive drugs to each of them. The metric is broken at a
                structural level.
              </p>

              <p>
                Until CMS reforms how drug units are counted — separating &ldquo;hands-on services&rdquo; from
                &ldquo;drug unit administration&rdquo; — the data will continue to produce these misleading headlines.
                And real fraud will continue to hide behind the noise.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Explore Further</h2>

              <ul>
                <li>
                  <Link href="/fraud/impossible-numbers" className="text-indigo-600 hover:text-indigo-800">
                    Interactive Impossible Numbers Dashboard
                  </Link> — Explore all 4,636 providers with filtering and sorting
                </li>
                <li>
                  <Link href="/investigations/impossible-doctors" className="text-indigo-600 hover:text-indigo-800">
                    The Impossible Doctors
                  </Link> — Our original investigation into billing impossibilities
                </li>
              </ul>
            </div>

            <SourceCitation
              sources={[
                'CMS Medicare Provider Utilization and Payment Data (2014-2023)',
                'OpenMedicare fraud-features.json analysis of 1,139,881 providers',
              ]}
            />

            <InvestigationDisclaimer />
          </div>
        </article>
      </div>
    </main>
  )
}
