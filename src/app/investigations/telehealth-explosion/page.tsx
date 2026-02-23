import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'How Telehealth Broke Medicare Wide Open',
  description: 'COVID forced CMS to allow telehealth overnight. Spending crashed 10% in 2020, then surged past pre-pandemic highs. Inside the $94B system telehealth rebuilt.',
  alternates: { canonical: '/investigations/telehealth-explosion' },
  openGraph: {
    title: 'How Telehealth Broke Medicare Wide Open',
    description: 'COVID forced CMS to allow telehealth overnight. Spending crashed 10% in 2020, then surged past pre-pandemic highs. Inside the $94B system telehealth rebuilt.',
    url: 'https://www.openmedicare.com/investigations/telehealth-explosion',
  },
}

interface YearlyTrend {
  year: number
  total_providers: number
  total_payments: number
  total_services: number
  total_beneficiaries: number
  total_submitted_charges: number
  avg_payment_per_service: number
  avg_payment_per_provider: number
  markup_ratio: number
  total_payments_change: number
  total_services_change: number
  total_providers_change: number
}

export default function TelehealthExplosionPage() {
  const publishedDate = '2026-02-21'
  const readTime = '13 min read'

  const trendsData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'trends.json'), 'utf8')
  )

  const trends: YearlyTrend[] = trendsData.yearly_trends
  const year2019 = trends.find((t: YearlyTrend) => t.year === 2019)!
  const year2020 = trends.find((t: YearlyTrend) => t.year === 2020)!
  const year2021 = trends.find((t: YearlyTrend) => t.year === 2021)!
  const year2023 = trends.find((t: YearlyTrend) => t.year === 2023)!
  const year2014 = trends.find((t: YearlyTrend) => t.year === 2014)!

  const covidDrop = year2019.total_payments - year2020.total_payments
  const covidDropPct = ((covidDrop / year2019.total_payments) * 100).toFixed(1)
  const providerDrop = year2019.total_providers - year2020.total_providers
  const serviceDrop = year2019.total_services - year2020.total_services

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'The Telehealth Explosion' },
          ]}
          className="mb-8"
        />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-4">
                Investigation
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4">
                The Telehealth Explosion
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                How COVID Changed Medicare Forever
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

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                In March 2020, the world shut down — and Medicare was forced to change overnight. CMS waived decades
                of telehealth restrictions, allowing providers to bill for virtual visits for the first time at scale.
                Medicare spending crashed <strong>{covidDropPct}%</strong> in 2020, shedding {formatCurrency(covidDrop)} in
                payments and {formatNumber(serviceDrop)} services. But what emerged from the wreckage was a fundamentally
                different system.
              </p>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3">The COVID Crash</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-indigo-800">
                  <div>
                    <div className="font-bold text-2xl mb-1">-{covidDropPct}%</div>
                    <div>Payment drop in 2020</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">-{formatNumber(providerDrop)}</div>
                    <div>Fewer active providers</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">-{formatNumber(serviceDrop)}</div>
                    <div>Fewer services rendered</div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Before COVID: Telehealth Was a Rounding Error</h2>
              <p>
                Before 2020, Medicare telehealth was severely restricted. Beneficiaries had to be in a designated
                rural area, at an approved originating site (like a clinic — not their home), and see a provider
                on the other end via real-time video. The restrictions were so onerous that telehealth accounted
                for less than <strong>0.1% of Medicare visits</strong>.
              </p>
              <p>
                Modifier 95 — the CPT modifier for synchronous telehealth — existed but was rarely used. CMS
                maintained a narrow list of telehealth-eligible services, and most providers never bothered with
                the paperwork.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">March 2020: Everything Changed</h2>
              <p>
                Under emergency authority, CMS made sweeping changes virtually overnight:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Geographic restrictions eliminated</strong> — telehealth from anywhere in the country</li>
                <li><strong>Home as originating site</strong> — patients could receive telehealth from their couch</li>
                <li><strong>Audio-only visits allowed</strong> — a phone call could be billed as an office visit</li>
                <li><strong>Payment parity</strong> — telehealth visits reimbursed at the same rate as in-person</li>
                <li><strong>Expanded service list</strong> — hundreds of new codes eligible for telehealth billing</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Spending Trajectory Tells the Story</h2>

              <div className="overflow-x-auto my-6">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left font-semibold">Year</th>
                      <th className="px-4 py-2 text-right font-semibold">Total Payments</th>
                      <th className="px-4 py-2 text-right font-semibold">Providers</th>
                      <th className="px-4 py-2 text-right font-semibold">Services</th>
                      <th className="px-4 py-2 text-right font-semibold">Avg/Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trends.map((t: YearlyTrend) => (
                      <tr key={t.year} className={`border-b border-gray-100 ${t.year === 2020 ? 'bg-red-50' : t.year >= 2021 ? 'bg-green-50' : ''}`}>
                        <td className="px-4 py-2 font-semibold">{t.year}</td>
                        <td className="px-4 py-2 text-right font-mono">{formatCurrency(t.total_payments)}</td>
                        <td className="px-4 py-2 text-right font-mono">{formatNumber(t.total_providers)}</td>
                        <td className="px-4 py-2 text-right font-mono">{formatNumber(t.total_services)}</td>
                        <td className="px-4 py-2 text-right font-mono">{formatCurrency(t.avg_payment_per_provider)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>
                The pattern is unmistakable: steady growth through 2019, a sharp crash in 2020, then a rebound
                that <em>exceeded</em> pre-pandemic levels by 2021. By 2023, Medicare was paying {formatCurrency(year2023.total_payments)} —
                up {((year2023.total_payments / year2014.total_payments - 1) * 100).toFixed(0)}% from 2014.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Modifier 95: The Telehealth Marker</h2>
              <p>
                Modifier 95 is appended to CPT codes when a service is delivered via synchronous (real-time) telehealth.
                Before 2020, it was a footnote in Medicare billing. After March 2020, it became one of the most common
                modifiers in the system.
              </p>
              <p>
                CMS data shows that by 2021, <strong>over 40% of evaluation and management visits</strong> for some
                specialties were billed with telehealth modifiers. Psychiatry and psychology led the way, with some
                providers shifting <em>entirely</em> to telehealth and never returning to in-person care.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Winners: Rural Access</h2>
              <p>
                Telehealth&apos;s greatest promise was always about access. Rural Medicare beneficiaries who previously
                drove hours for specialist appointments could now see providers via video. Mental health services,
                which were critically underserved in rural areas, saw telehealth adoption rates exceeding 50%.
              </p>
              <p>
                The data supports the access argument: the number of active Medicare providers grew
                from {formatNumber(year2020.total_providers)} in 2020 to {formatNumber(year2023.total_providers)} in 2023 —
                a gain of {formatNumber(year2023.total_providers - year2020.total_providers)} providers. Telehealth lowered
                the barrier to serving Medicare patients, especially for behavioral health providers.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">The Access Wins</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-green-800">
                  <li>Mental health telehealth visits grew from near-zero to millions annually</li>
                  <li>Rural beneficiaries gained access to specialists previously unavailable</li>
                  <li>Post-surgical follow-ups could be done remotely, reducing readmissions</li>
                  <li>Chronic disease management improved with easier virtual check-ins</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Losers: Fraud Opportunities</h2>
              <p>
                Telehealth also created new fraud vectors. Without the natural constraint of a physical office —
                where there are only so many exam rooms and hours in the day — some providers billed impossible
                volumes. A provider could theoretically bill telehealth visits back-to-back with minimal actual
                patient interaction.
              </p>
              <p>
                The DOJ&apos;s 2025 healthcare fraud takedown specifically called out telehealth fraud schemes where
                providers billed for services that were either never rendered or consisted of brief, medically
                unnecessary phone calls. Some telehealth companies were accused of paying kickbacks to providers
                for ordering unnecessary genetic tests and durable medical equipment after brief telehealth
                &quot;consultations.&quot;
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">The Fraud Risks</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-red-800">
                  <li>No physical exam requirement makes it harder to verify medical necessity</li>
                  <li>Audio-only visits are nearly impossible to audit after the fact</li>
                  <li>Telehealth companies used &quot;consultations&quot; as a gateway for DME and genetic test fraud</li>
                  <li>Volume constraints removed — providers can bill far more visits per day</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Is Telehealth Saving Money?</h2>
              <p>
                The intuitive answer seems like yes — a video visit should cost less than an in-person visit. But
                the data tells a more complicated story. With payment parity, a telehealth visit reimburses at the
                same rate as in-person. And by lowering access barriers, telehealth may <em>increase</em> utilization —
                people who wouldn&apos;t have bothered with an in-person visit will take a telehealth appointment.
              </p>
              <p>
                Total Medicare spending in 2023 was {formatCurrency(year2023.total_payments)} — the highest ever — with
                {' '}{formatNumber(year2023.total_services)} services. The provider count
                ({formatNumber(year2023.total_providers)}) is also at an all-time high. Telehealth didn&apos;t reduce
                spending — it expanded the system.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What Happens Next</h2>
              <p>
                Congress has repeatedly extended the COVID-era telehealth flexibilities, most recently through 2025.
                The question is whether they become permanent. CMS has been gradually tightening some provisions —
                requiring video capability for certain visit types, adding fraud safeguards — but the political
                pressure to maintain telehealth access is enormous.
              </p>
              <p>
                The genie is out of the bottle. Patients expect telehealth. Providers have built their practices
                around it. And {formatNumber(year2023.total_providers)} Medicare providers aren&apos;t going back to the
                way things were in 2019. The question isn&apos;t whether telehealth stays — it&apos;s how Medicare
                controls it.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This analysis is based on publicly available CMS Medicare Provider Utilization
                and Payment Data (2014-2023). Telehealth-specific billing breakdowns are based on CMS reporting and published
                research, as modifier-level detail is not included in our aggregate trends data.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href="/investigations/covid-impact" className="text-medicare-primary hover:underline text-sm">🦠 COVID&apos;s Impact on Medicare</Link>
                <Link href="/investigations/pandemic-recovery" className="text-medicare-primary hover:underline text-sm">📈 Pandemic Recovery</Link>
                <Link href="/investigations/impossible-doctors" className="text-medicare-primary hover:underline text-sm">⏰ The Impossible Doctors</Link>
                <Link href="/investigations/ten-year-explosion" className="text-medicare-primary hover:underline text-sm">💥 The 10-Year Explosion</Link>
                <Link href="/investigations/genetic-testing-fraud" className="text-medicare-primary hover:underline text-sm">🧬 Genetic Testing Fraud</Link>
                <Link href="/investigations/internal-medicine-crisis" className="text-medicare-primary hover:underline text-sm">🏥 Internal Medicine Crisis</Link>
                <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🚨 Fraud Analysis Hub</Link>
                <Link href="/fraud/impossible-numbers" className="text-medicare-primary hover:underline text-sm">🧮 Impossible Billing Numbers</Link>
                <Link href="/specialties" className="text-medicare-primary hover:underline text-sm">🩺 Browse Specialties</Link>
                <Link href="/states" className="text-medicare-primary hover:underline text-sm">🗺️ Browse by State</Link>
              </div>
            </div>

            <ShareButtons
              url="https://www.openmedicare.com/investigations/telehealth-explosion"
              title="The Telehealth Explosion: How COVID Changed Medicare Forever"
            />

            <div className="mt-6">
              <SourceCitation
                sources={[
                  'Centers for Medicare & Medicaid Services (CMS) — Medicare Provider Utilization and Payment Data (2014-2023)',
                  'CMS COVID-19 Emergency Declaration Blanket Waivers for Health Care Providers',
                  'HHS Office of Inspector General — Telehealth Fraud Reports (2021-2025)',
                  'Department of Justice — Healthcare Fraud Enforcement Actions (2025)',
                ]}
                lastUpdated="February 2026"
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
