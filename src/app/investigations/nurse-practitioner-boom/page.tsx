import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: 'The Rise of the Nurse Practitioner: Medicare\'s Fastest-Growing Workforce',
  description: 'Nurse practitioners are 11.4% of Medicare providers but earn just $26K average. Some NPs bill millions. The scope of practice debate meets Medicare data.',
  alternates: { canonical: '/investigations/nurse-practitioner-boom' },
  openGraph: {
    title: 'The Rise of the Nurse Practitioner: Medicare\'s Fastest-Growing Workforce',
    description: '1.2 million NP billing records, $31.5 billion in payments, and a workforce reshaping American healthcare.',
    url: 'https://www.openmedicare.org/investigations/nurse-practitioner-boom',
  },
}

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
  payment_share: number
  provider_share: number
}

export default function NursePractitionerBoomPage() {
  const publishedDate = '2026-02-21'
  const readTime = '14 min read'

  const specialtiesData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'specialties.json'), 'utf8')
  )

  const specialties: Specialty[] = specialtiesData.specialties
  const np = specialties.find((s: Specialty) => s.specialty === 'Nurse Practitioner')!
  const ophth = specialties.find((s: Specialty) => s.specialty === 'Ophthalmology')!
  const intMed = specialties.find((s: Specialty) => s.specialty === 'Internal Medicine')!
  const famPrac = specialties.find((s: Specialty) => s.specialty === 'Family Practice')!

  // Top specialties by provider count for comparison
  const topByProviders = [...specialties].sort((a, b) => b.total_providers - a.total_providers).slice(0, 10)
  const topByAvgPayment = [...specialties].sort((a, b) => b.avg_payment_per_provider - a.avg_payment_per_provider).slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'The Nurse Practitioner Boom' },
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
                The Rise of the Nurse Practitioner
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                Medicare&apos;s Fastest-Growing Workforce
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
                Nurse practitioners are reshaping American healthcare — and Medicare data proves it.
                With <strong>{formatNumber(np.total_providers)} provider records</strong> over the past decade,
                NPs represent <strong>{np.provider_share.toFixed(1)}% of all Medicare providers</strong> — the
                largest single provider type in the system. They&apos;ve billed {formatCurrency(np.total_payments)} in
                total payments. But at an average of just <strong>{formatCurrency(np.avg_payment_per_provider)}</strong> per
                provider, they earn a fraction of what specialists make.
              </p>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-teal-900 mb-3">NPs by the Numbers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-teal-800">
                  <div>
                    <div className="font-bold text-2xl mb-1">{formatNumber(np.total_providers)}</div>
                    <div>Provider records (10 years)</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">{formatCurrency(np.avg_payment_per_provider)}</div>
                    <div>Average payment per NP</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">{np.provider_share.toFixed(1)}%</div>
                    <div>Share of all Medicare providers</div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Pay Gap: {formatCurrency(np.avg_payment_per_provider)} vs {formatCurrency(ophth.avg_payment_per_provider)}</h2>
              <p>
                The average nurse practitioner bills Medicare {formatCurrency(np.avg_payment_per_provider)} per year.
                The average ophthalmologist bills {formatCurrency(ophth.avg_payment_per_provider)}. That&apos;s
                a <strong>{(ophth.avg_payment_per_provider / np.avg_payment_per_provider).toFixed(0)}x difference</strong> —
                and it reflects a fundamental structural divide in how Medicare values different types of care.
              </p>

              <div className="overflow-x-auto my-6">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left font-semibold">Specialty</th>
                      <th className="px-4 py-2 text-right font-semibold">Providers</th>
                      <th className="px-4 py-2 text-right font-semibold">Avg Payment/Provider</th>
                      <th className="px-4 py-2 text-right font-semibold">Total Payments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topByProviders.map((s: Specialty) => (
                      <tr key={s.specialty} className={`border-b border-gray-100 ${s.specialty === 'Nurse Practitioner' ? 'bg-teal-50 font-semibold' : ''}`}>
                        <td className="px-4 py-2">
                          <Link href={`/specialties/${s.specialty_slug}`} className="text-medicare-primary hover:underline">
                            {s.specialty}
                          </Link>
                        </td>
                        <td className="px-4 py-2 text-right font-mono">{formatNumber(s.total_providers)}</td>
                        <td className="px-4 py-2 text-right font-mono">{formatCurrency(s.avg_payment_per_provider)}</td>
                        <td className="px-4 py-2 text-right font-mono">{formatCurrency(s.total_payments)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Highest-Paid Specialties</h2>
              <p>
                While NPs earn {formatCurrency(np.avg_payment_per_provider)} on average, the top-earning specialties
                paint a very different picture of Medicare income:
              </p>

              <div className="overflow-x-auto my-6">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left font-semibold">Specialty</th>
                      <th className="px-4 py-2 text-right font-semibold">Avg Payment/Provider</th>
                      <th className="px-4 py-2 text-right font-semibold">vs NP Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topByAvgPayment.map((s: Specialty) => (
                      <tr key={s.specialty} className="border-b border-gray-100">
                        <td className="px-4 py-2">
                          <Link href={`/specialties/${s.specialty_slug}`} className="text-medicare-primary hover:underline">
                            {s.specialty}
                          </Link>
                        </td>
                        <td className="px-4 py-2 text-right font-mono">{formatCurrency(s.avg_payment_per_provider)}</td>
                        <td className="px-4 py-2 text-right font-mono text-red-600">
                          {(s.avg_payment_per_provider / np.avg_payment_per_provider).toFixed(0)}x
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">But Some NPs Bill Millions</h2>
              <p>
                The average NP bills {formatCurrency(np.avg_payment_per_provider)}. But averages can be deceiving.
                At the extreme end, individual nurse practitioners have billed Medicare millions of dollars —
                volumes that would be extraordinary even for physicians.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">Case Study: Merry Taheri, NP — Torrance, CA</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Total Medicare Payments:</span> <strong className="text-red-800">{formatCurrency(12100000)}</strong></div>
                  <div><span className="text-gray-600">vs NP Average:</span> <strong className="text-red-800">{Math.round(12100000 / np.avg_payment_per_provider)}x</strong></div>
                  <div><span className="text-gray-600">Primary billing:</span> <strong>COVID OTC test kits (K1034)</strong></div>
                  <div><span className="text-gray-600">Specialty:</span> <strong>Nurse Practitioner</strong></div>
                </div>
                <p className="text-sm text-red-800 mt-4">
                  Taheri billed 990x the NP specialty median — almost entirely through COVID test kit distribution
                  codes. A single NP billing more than entire medical practices.
                </p>
                <div className="mt-3">
                  <Link href="/investigations/covid-test-scheme" className="text-red-700 hover:underline text-sm font-medium">
                    Read: The COVID Test Gold Rush →
                  </Link>
                </div>
              </div>

              <p>
                Taheri isn&apos;t alone. Our data reveals dozens of NPs billing well over $1 million per year —
                volumes that raise questions about whether the services were actually performed by the NP, delegated
                to others under &quot;incident-to&quot; billing, or in some cases, not performed at all.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Scope of Practice Debate</h2>
              <p>
                At the heart of the NP boom is one of healthcare&apos;s most contentious policy debates: should nurse
                practitioners practice independently, or should they require physician supervision?
              </p>
              <p>
                As of 2025, <strong>27 states plus DC</strong> grant NPs full practice authority — meaning they can
                evaluate patients, diagnose conditions, prescribe medications, and bill Medicare without physician
                oversight. The remaining states require varying degrees of collaborative agreements or supervision.
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">State-by-State NP Independence</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-purple-800">
                  <div>
                    <div className="font-bold text-2xl mb-1">27 + DC</div>
                    <div>Full practice authority</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">12</div>
                    <div>Reduced practice (collaborative agreement)</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">11</div>
                    <div>Restricted practice (physician supervision)</div>
                  </div>
                </div>
              </div>

              <p>
                The American Medical Association argues that NPs lack the training depth of physicians (NP programs
                require ~500-1,500 clinical hours vs ~15,000+ for physicians) and that independent practice poses
                patient safety risks. The American Association of Nurse Practitioners counters that decades of
                research show comparable outcomes for primary care conditions and that NPs are filling a critical
                provider shortage.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Filling the Gap</h2>
              <p>
                The numbers support the &quot;filling the gap&quot; narrative. With {formatNumber(np.total_providers)} NP
                billing records vs {formatNumber(intMed.total_providers)} for internal medicine
                and {formatNumber(famPrac.total_providers)} for family practice, NPs have become the backbone
                of primary care access in many communities.
              </p>
              <p>
                In rural areas especially, NPs may be the only providers accepting new Medicare patients. The
                average NP sees {Math.round(np.avg_services_per_provider)} services per year —
                a manageable patient load that suggests genuine clinical practice, not just billing optimization.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Or Creating New Billing Opportunities?</h2>
              <p>
                Critics point to a different pattern. Some healthcare companies have hired armies of NPs specifically
                because they&apos;re cheaper to employ than physicians but can bill Medicare at 85% of physician rates
                (or 100% under &quot;incident-to&quot; billing when supervised by a physician). The math is straightforward:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Physician salary: $250K-$400K</li>
                <li>NP salary: $100K-$130K</li>
                <li>NP Medicare billing: 85-100% of physician rates</li>
                <li>Margin per NP: significantly higher than per physician</li>
              </ul>
              <p>
                Corporate medicine has noticed. Large healthcare organizations increasingly staff clinics with
                NPs while a single supervising physician oversees multiple locations — a model that maximizes
                billing volume per dollar of labor cost.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What the Data Says</h2>
              <p>
                NPs billed {formatCurrency(np.total_payments)} to Medicare over the decade — {np.payment_share.toFixed(1)}% of
                total Medicare spending. Their markup ratio of {np.markup_ratio.toFixed(1)}x is close to the
                system average, suggesting billing practices largely in line with norms.
              </p>
              <p>
                The real story isn&apos;t fraud — it&apos;s structural change. Medicare is being delivered by a fundamentally
                different workforce than it was 20 years ago, and the system hasn&apos;t fully caught up. Payment
                rates, supervision requirements, and fraud detection algorithms were all designed for a
                physician-centric system. The NP boom demands a rethink.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This analysis is based on publicly available CMS Medicare Provider Utilization
                and Payment Data (2014-2023). Provider counts represent unique NPI-year combinations over the decade.
                Individual cases cited are based on public billing data and do not constitute accusations of fraud.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Related</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href="/investigations/covid-test-scheme" className="text-medicare-primary hover:underline text-sm">🧪 The COVID Test Gold Rush</Link>
                <Link href="/investigations/specialty-pay-gap" className="text-medicare-primary hover:underline text-sm">💰 The Specialty Pay Gap</Link>
                <Link href="/investigations/how-much-does-medicare-pay" className="text-medicare-primary hover:underline text-sm">💵 How Much Does Medicare Pay?</Link>
                <Link href="/investigations/impossible-doctors" className="text-medicare-primary hover:underline text-sm">⏰ The Impossible Doctors</Link>
              </div>
            </div>

            <ShareButtons
              url="https://www.openmedicare.org/investigations/nurse-practitioner-boom"
              title="The Rise of the Nurse Practitioner — OpenMedicare"
            />

            <div className="mt-6">
              <SourceCitation
                sources={[
                  'Centers for Medicare & Medicaid Services (CMS) — Medicare Provider Utilization and Payment Data (2014-2023)',
                  'American Association of Nurse Practitioners — State Practice Environment Map (2025)',
                  'American Medical Association — Scope of Practice Policy',
                  'Bureau of Labor Statistics — Nurse Practitioner Employment Data',
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
