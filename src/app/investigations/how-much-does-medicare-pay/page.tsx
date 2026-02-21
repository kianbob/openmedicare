import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'How Much Does Medicare Actually Pay Doctors?',
  description: 'Average Medicare payment per provider by specialty: from $26K for nurse practitioners to $384K for ophthalmologists. See the full breakdown with real data.',
  keywords: ['how much does medicare pay doctors', 'medicare reimbursement rates', 'medicare payment by specialty', 'medicare fee schedule', 'doctor medicare pay'],
  openGraph: {
    title: 'How Much Does Medicare Actually Pay Doctors?',
    description: 'From $26K for NPs to $384K for ophthalmology — the real numbers behind Medicare physician payments.',
  },
  alternates: {
    canonical: '/investigations/how-much-does-medicare-pay',
  },
}

function loadSpecialties() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'specialties.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { specialties: [] } }
}

export default function HowMuchDoesMedicarePayPage() {
  const data = loadSpecialties()
  const allSpecs = (data.specialties || [])
  const totalPayments = allSpecs.reduce((s: number, x: any) => s + x.total_payments, 0)
  const totalProviders = allSpecs.reduce((s: number, x: any) => s + x.total_providers, 0)
  const overallAvg = totalPayments / totalProviders

  // Top 20 by avg payment per provider
  const byAvgPayment = [...allSpecs]
    .filter((s: any) => s.total_providers >= 100)
    .sort((a: any, b: any) => b.avg_payment_per_provider - a.avg_payment_per_provider)
    .slice(0, 20)

  // Lowest paid
  const lowestPaid = [...allSpecs]
    .filter((s: any) => s.total_providers >= 1000)
    .sort((a: any, b: any) => a.avg_payment_per_provider - b.avg_payment_per_provider)
    .slice(0, 5)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'How Much Does Medicare Pay Doctors?' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Analysis</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            How Much Does Medicare Actually Pay Doctors?
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 11 min read</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">Key Finding</p>
            <p className="text-blue-800 mt-2">
              The average Medicare payment per provider across all specialties is <strong>{formatCurrency(overallAvg)}</strong> per year.
              But the range is enormous: from {formatCurrency(lowestPaid[0]?.avg_payment_per_provider || 0)} for {lowestPaid[0]?.specialty || 'the lowest-paid specialty'} to {formatCurrency(byAvgPayment[0]?.avg_payment_per_provider || 0)} for {byAvgPayment[0]?.specialty || 'the highest-paid specialty'}.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Understanding the Medicare Fee Schedule</h2>
          <p className="text-gray-700 mb-4">
            Medicare doesn&apos;t pay doctors whatever they ask. Every service has a fee schedule rate — the maximum Medicare
            will pay. Doctors submit charges (what they&apos;d like to get paid), but Medicare pays the fee schedule amount,
            which is typically much less.
          </p>
          <p className="text-gray-700 mb-4">
            This creates what we call the <strong>markup ratio</strong> — the gap between what doctors charge and what
            Medicare actually pays. Across all providers, doctors submit charges averaging about 3x their actual
            Medicare reimbursement. Some specialties charge 5-10x what they receive.
          </p>
          <p className="text-gray-700 mb-4">
            Medicare typically pays about <strong>80% of what private insurance pays</strong> for the same service.
            This is a key reason many providers limit the number of Medicare patients they accept.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Top 20 Specialties by Average Medicare Payment</h2>
          <p className="text-gray-700 mb-4">
            This table shows the average annual Medicare payment per provider for the top 20 highest-paid specialties
            (minimum 100 providers). These figures represent 10 years of cumulative data (2014-2023), divided by provider count.
          </p>

          <div className="overflow-x-auto not-prose mb-8">
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Payment/Provider</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Markup Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {byAvgPayment.map((s: any, i: number) => (
                  <tr key={s.specialty_slug} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={`/specialties/${s.specialty_slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        {s.specialty}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(s.avg_payment_per_provider)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(s.total_payments)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatNumber(s.total_providers)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${s.markup_ratio > 5 ? 'text-red-600' : s.markup_ratio > 3 ? 'text-orange-600' : 'text-gray-700'}`}>
                        {s.markup_ratio?.toFixed(1)}x
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why the Range Is So Wide</h2>
          <p className="text-gray-700 mb-4">
            The gap between the highest and lowest-paid specialties reflects several factors:
          </p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Procedure vs. cognitive services:</strong> Specialties that perform procedures (surgery, injections, imaging) earn far more per service than those focused on evaluation and management visits.</li>
            <li><strong>Drug administration:</strong> Ophthalmology and oncology rank high partly because they administer expensive Part B drugs (like aflibercept at $1,850 per injection) and receive a markup on drug costs.</li>
            <li><strong>Volume capacity:</strong> Some specialties can see more patients per day. Radiology and clinical labs process high volumes with lower per-unit costs but high total payments.</li>
            <li><strong>Patient population:</strong> Specialties serving older, sicker Medicare beneficiaries naturally generate more claims per patient.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Submitted Charges vs. Actual Payments</h2>
          <p className="text-gray-700 mb-4">
            One of the most striking aspects of Medicare billing is the gap between what providers charge and what
            they actually receive. Across all specialties, providers submitted <strong>{formatCurrency(allSpecs.reduce((s: number, x: any) => s + (x.total_submitted_charges || 0), 0))}</strong> in
            charges but received <strong>{formatCurrency(totalPayments)}</strong> in actual payments.
          </p>
          <p className="text-gray-700 mb-4">
            This doesn&apos;t mean Medicare is underpaying. The submitted charge is often a &quot;sticker price&quot; that
            no one actually expects to collect. It&apos;s a legacy of the fee-for-service system where providers
            set their own rates, and insurers (including Medicare) pay according to their own fee schedules.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/investigations/markup-machine" className="text-blue-600 hover:text-blue-800">
              Read more: The Medicare Markup Machine →
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Medicare vs. Private Insurance</h2>
          <p className="text-gray-700 mb-4">
            Medicare generally pays about <strong>80% of what private insurance pays</strong> for the same service,
            according to analyses by the Medicare Payment Advisory Commission (MedPAC). For hospital services,
            the gap can be larger — hospitals receive roughly 50-60% of their private payer rates from Medicare.
          </p>
          <p className="text-gray-700 mb-4">
            This differential is a major factor in physician practice economics. Practices with a higher share
            of Medicare patients tend to have tighter margins, which may explain why some specialties limit
            the number of Medicare beneficiaries they accept.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Lowest-Paid Specialties</h2>
          <p className="text-gray-700 mb-4">
            At the other end of the spectrum, these specialties receive the lowest average Medicare payments per provider:
          </p>
          <div className="overflow-x-auto not-prose mb-8">
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Payment/Provider</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lowestPaid.map((s: any, i: number) => (
                  <tr key={s.specialty_slug} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3">
                      <Link href={`/specialties/${s.specialty_slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        {s.specialty}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(s.avg_payment_per_provider)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatNumber(s.total_providers)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 not-prose">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/investigations/specialty-monopoly" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">The Specialty Monopoly</div>
                <div className="text-sm text-gray-500">5 specialties control 33% of Medicare spending</div>
              </Link>
              <Link href="/investigations/markup-machine" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">The Markup Machine</div>
                <div className="text-sm text-gray-500">$100B gap between charges and payments</div>
              </Link>
              <Link href="/specialties" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">Browse All Specialties</div>
                <div className="text-sm text-gray-500">Payment data for every Medicare specialty</div>
              </Link>
              <Link href="/investigations/specialty-gap" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-gray-900">The Specialty Pay Gap</div>
                <div className="text-sm text-gray-500">Why procedure-based specialties dominate</div>
              </Link>
            </div>
          </div>
        </article>

        {/* Related Investigations */}
        <div className="bg-gray-50 rounded-xl p-6 mt-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/specialty-pay-gap" className="text-medicare-primary hover:underline text-sm">📊 The Specialty Pay Gap</Link>
            <Link href="/investigations/specialty-monopoly" className="text-medicare-primary hover:underline text-sm">🏛️ The Specialty Monopoly</Link>
            <Link href="/investigations/markup-machine" className="text-medicare-primary hover:underline text-sm">📈 The Markup Machine</Link>
            <Link href="/specialties" className="text-medicare-primary hover:underline text-sm">🩺 Browse All Specialties</Link>
          </div>
        </div>

        <div className="mt-8">
          <ShareButtons
            url="/investigations/how-much-does-medicare-pay"
            title="How Much Does Medicare Actually Pay Doctors?"
            description="From $26K for NPs to $384K for ophthalmology — the real numbers."
          />
        </div>

        <SourceCitation
          lastUpdated="February 2026 (data through 2023)"
          sources={[
            'CMS Medicare Provider Utilization and Payment Data (2014-2023)',
            'Medicare Physician Fee Schedule',
            'MedPAC Report to the Congress (2024)',
          ]}
        />
      </div>
    </main>
  )
}
