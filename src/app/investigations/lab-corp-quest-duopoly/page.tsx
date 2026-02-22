import type { Metadata } from 'next'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
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
  title: 'Two Companies Control America\'s Lab Testing — and Bill Medicare Billions',
  description: 'LabCorp and Quest Diagnostics operate 37 NPIs across the country, billing Medicare $14 billion over 10 years. Together they handle 25% of all clinical laboratory billing.',
  alternates: { canonical: '/investigations/lab-corp-quest-duopoly' },
  openGraph: {
    title: 'Two Companies Control America\'s Lab Testing — and Bill Medicare Billions',
    description: 'LabCorp and Quest Diagnostics: 37 NPIs, $14 billion in Medicare payments, and 25% market share.',
    url: 'https://www.openmedicare.com/investigations/lab-corp-quest-duopoly',
  },
}

interface Provider {
  npi: string
  name: string
  credentials: string
  specialty: string
  state: string
  city: string
  entity_type: string
  total_payments: number
  total_services: number
  total_beneficiaries: number
  years_active: number
  first_year: number
  last_year: number
  avg_payment_per_service: number
}

export default function LabCorpQuestDuopolyPage() {
  const publishedDate = '2026-02-21'
  const readTime = '14 min read'

  const providersData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'top-providers.json'), 'utf8')
  )
  const specialtiesData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'specialties.json'), 'utf8')
  )

  const providers: Provider[] = providersData.providers

  const labCorpNPIs = providers.filter((p: Provider) => {
    const n = p.name.toLowerCase()
    return n.includes('laboratory corporation') || n.includes('labcorp')
  })
  const questNPIs = providers.filter((p: Provider) => p.name.toLowerCase().includes('quest'))

  const labCorpTotal = labCorpNPIs.reduce((sum: number, p: Provider) => sum + p.total_payments, 0)
  const labCorpServices = labCorpNPIs.reduce((sum: number, p: Provider) => sum + p.total_services, 0)
  const questTotal = questNPIs.reduce((sum: number, p: Provider) => sum + p.total_payments, 0)
  const questServices = questNPIs.reduce((sum: number, p: Provider) => sum + p.total_services, 0)
  const combinedTotal = labCorpTotal + questTotal
  const combinedServices = labCorpServices + questServices

  const clinicalLab = specialtiesData.specialties.find((s: { specialty: string }) => s.specialty === 'Clinical Laboratory')
  const duopolyShare = ((combinedTotal / clinicalLab.total_payments) * 100).toFixed(1)
  const totalLabProviders = clinicalLab.total_providers

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'The Lab Testing Duopoly' },
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
                Two Companies Control America&apos;s Lab Testing
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                And Bill Medicare Billions
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
                When your doctor orders a blood test, there&apos;s a good chance it ends up at one of two companies:
                {' '}<strong>Laboratory Corporation of America (LabCorp)</strong> or <strong>Quest Diagnostics</strong>.
                Together, these two corporations operate <strong>{labCorpNPIs.length + questNPIs.length} separate NPIs</strong> across
                the country and have billed Medicare <strong>{formatCurrency(combinedTotal)}</strong> over the past decade —
                representing <strong>{duopolyShare}%</strong> of all clinical laboratory payments.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">The Duopoly by the Numbers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-blue-800">
                  <div>
                    <div className="font-bold text-2xl mb-1">{formatCurrency(combinedTotal)}</div>
                    <div>Combined Medicare payments (10 years)</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">{formatNumber(combinedServices)}</div>
                    <div>Combined lab services performed</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">{duopolyShare}%</div>
                    <div>Share of all clinical lab payments</div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">LabCorp: {labCorpNPIs.length} NPIs, {formatCurrency(labCorpTotal)}</h2>
              <p>
                LabCorp operates under <strong>{labCorpNPIs.length} separate National Provider Identifiers</strong> across
                the country, each representing a different laboratory location. Their largest operation in Burlington, NC
                alone billed {formatCurrency(labCorpNPIs[0]?.total_payments || 0)} over the decade — making it one of
                the single highest-billing NPIs in all of Medicare.
              </p>

              <div className="overflow-x-auto my-6">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left font-semibold">NPI</th>
                      <th className="px-4 py-2 text-left font-semibold">Location</th>
                      <th className="px-4 py-2 text-right font-semibold">Total Payments</th>
                      <th className="px-4 py-2 text-right font-semibold">Services</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labCorpNPIs.map((p: Provider) => (
                      <tr key={p.npi} className="border-b border-gray-100">
                        <td className="px-4 py-2">
                          <Link href={`/providers/${p.npi}`} className="text-medicare-primary hover:underline">{p.npi}</Link>
                        </td>
                        <td className="px-4 py-2">{p.city}, {p.state}</td>
                        <td className="px-4 py-2 text-right font-mono">{formatCurrency(p.total_payments)}</td>
                        <td className="px-4 py-2 text-right font-mono">{formatNumber(p.total_services)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Quest Diagnostics: {questNPIs.length} NPIs, {formatCurrency(questTotal)}</h2>
              <p>
                Quest Diagnostics operates an even more fragmented network with <strong>{questNPIs.length} separate NPIs</strong>.
                Their Tampa, FL location is the largest single NPI at {formatCurrency(questNPIs[0]?.total_payments || 0)},
                followed by Clifton, NJ at {formatCurrency(questNPIs[1]?.total_payments || 0)}.
              </p>

              <div className="overflow-x-auto my-6">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left font-semibold">NPI</th>
                      <th className="px-4 py-2 text-left font-semibold">Location</th>
                      <th className="px-4 py-2 text-right font-semibold">Total Payments</th>
                      <th className="px-4 py-2 text-right font-semibold">Services</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questNPIs.map((p: Provider) => (
                      <tr key={p.npi} className="border-b border-gray-100">
                        <td className="px-4 py-2">
                          <Link href={`/providers/${p.npi}`} className="text-medicare-primary hover:underline">{p.npi}</Link>
                        </td>
                        <td className="px-4 py-2">{p.city}, {p.state}</td>
                        <td className="px-4 py-2 text-right font-mono">{formatCurrency(p.total_payments)}</td>
                        <td className="px-4 py-2 text-right font-mono">{formatNumber(p.total_services)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Is This a Monopoly Problem?</h2>
              <p>
                Clinical laboratory testing is a {formatCurrency(clinicalLab.total_payments)} Medicare market over 10 years,
                with {formatNumber(totalLabProviders)} total providers. But those numbers are misleading — the vast majority
                of those providers are small hospital labs and independent pathology groups.
              </p>
              <p>
                LabCorp and Quest don&apos;t just share {duopolyShare}% of Medicare lab payments. In the <em>commercial</em> lab
                market — the reference testing that doctors order and send out — their combined market share is estimated
                at <strong>over 50%</strong>. They set pricing, they negotiate with insurers, and they define turnaround times
                that independent labs must match or beat.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-3">The Scale Advantage</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-amber-800">
                  <div>
                    <div className="font-bold text-2xl mb-1">{formatCurrency(clinicalLab.avg_payment_per_service)}</div>
                    <div>Industry avg payment per service</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">{formatCurrency((labCorpTotal + questTotal) / (labCorpServices + questServices))}</div>
                    <div>LabCorp/Quest avg payment per service</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">{formatCurrency(clinicalLab.avg_payment_per_provider)}</div>
                    <div>Industry avg payment per provider NPI</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">{formatCurrency(combinedTotal / (labCorpNPIs.length + questNPIs.length))}</div>
                    <div>LabCorp/Quest avg payment per NPI</div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Independent Lab Squeeze</h2>
              <p>
                For every LabCorp or Quest mega-laboratory, there are thousands of independent labs competing
                for a shrinking share of Medicare reimbursement. The <strong>Protecting Access to Medicare Act (PAMA)</strong> of
                2014 fundamentally changed lab reimbursement by requiring CMS to set rates based on weighted median
                private payer rates — rates largely set by LabCorp and Quest through their massive insurer contracts.
              </p>
              <p>
                The result: independent labs saw Medicare reimbursement rates cut by <strong>10% or more</strong> in
                successive years, while the two giants — with their economies of scale — could absorb the cuts. Critics
                called it a &quot;death spiral&quot; for independent labs. The American Clinical Laboratory Association
                fought the cuts, and Congress delayed full implementation multiple times.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Case for Scale</h2>
              <p>
                Defenders of the duopoly argue that scale brings benefits: faster turnaround times, broader test menus,
                consistent quality standards, and lower per-test costs. A LabCorp reference lab in Burlington, NC can
                process millions of specimens per year with automation that a small independent lab simply can&apos;t match.
              </p>
              <p>
                And at {formatCurrency((labCorpTotal + questTotal) / (labCorpServices + questServices))} per service,
                LabCorp and Quest actually bill <em>below</em> the industry average of {formatCurrency(clinicalLab.avg_payment_per_service)} per
                service. The cost efficiency argument has merit.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Case Against</h2>
              <p>
                But consolidation in any market raises concerns. When two companies control the majority of reference
                testing, they also control:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Pricing power</strong> — their private payer rates become the benchmark for Medicare reimbursement</li>
                <li><strong>Test availability</strong> — they decide which esoteric tests to offer or retire</li>
                <li><strong>Data monopoly</strong> — with billions of test results, they hold unparalleled population health data</li>
                <li><strong>Acquisition strategy</strong> — both companies routinely acquire independent labs, further consolidating the market</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What the Numbers Don&apos;t Show</h2>
              <p>
                Our data captures Medicare Part B fee-for-service laboratory payments. It doesn&apos;t capture:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Medicare Advantage lab billing (a growing share of Medicare)</li>
                <li>Commercial insurance laboratory revenue (the majority of their business)</li>
                <li>Direct-to-consumer testing (a fast-growing segment)</li>
                <li>COVID testing revenue (which was enormous for both companies in 2020-2022)</li>
              </ul>
              <p>
                The {formatCurrency(combinedTotal)} in Medicare payments we can see is likely just the tip of the iceberg.
                Both companies report annual revenues exceeding $15 billion, with Medicare representing a meaningful but
                not dominant share.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Bottom Line</h2>
              <p>
                Two companies, {labCorpNPIs.length + questNPIs.length} NPIs, {formatCurrency(combinedTotal)} in Medicare
                payments. Whether you see this as efficient consolidation or dangerous monopolization depends on your
                perspective. What&apos;s undeniable is the scale: in a healthcare system where most providers bill Medicare
                thousands or tens of thousands per year, LabCorp and Quest bill <em>billions</em>.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This analysis is based on publicly available CMS Medicare Provider Utilization
                and Payment Data. Payment figures represent 10-year totals (2014-2023) for Medicare Part B fee-for-service
                claims only.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href="/investigations/corporate-medicine" className="text-medicare-primary hover:underline text-sm">🏢 Corporate Medicine</Link>
                <Link href="/investigations/specialty-monopoly" className="text-medicare-primary hover:underline text-sm">📊 The Specialty Monopoly</Link>
                <Link href="/investigations/biggest-billers" className="text-medicare-primary hover:underline text-sm">💰 Medicare&apos;s Biggest Billers</Link>
                <Link href="/investigations/markup-machine" className="text-medicare-primary hover:underline text-sm">🔧 The Markup Machine</Link>
              </div>
            </div>

            <ShareButtons
              url="https://www.openmedicare.com/investigations/lab-corp-quest-duopoly"
              title="Two Companies Control America's Lab Testing"
            />
            <InvestigationDisclaimer />
            <div className="mt-6">
              <SourceCitation
                sources={[
                  'Centers for Medicare & Medicaid Services (CMS) — Medicare Provider Utilization and Payment Data (2014-2023)',
                  'American Clinical Laboratory Association — PAMA Impact Analysis',
                  'LabCorp and Quest Diagnostics Annual Reports',
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
