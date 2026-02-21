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
  title: 'The Specialty Monopoly: Where Medicare Money Really Goes',
  description: '5 specialties account for 33% of all Medicare spending. Inside the concentration of $854 billion in healthcare payments.',
  openGraph: {
    title: 'The Specialty Monopoly: Where Medicare Money Really Goes',
    description: '5 specialties account for 33% of all Medicare spending.',
  },
}

function loadSpecialties() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'specialties.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { specialties: [] } }
}

export default function SpecialtyMonopolyPage() {
  const data = loadSpecialties()
  const allSpecs = (data.specialties || []).sort((a: any, b: any) => b.total_payments - a.total_payments)
  const totalPayments = allSpecs.reduce((s: number, x: any) => s + x.total_payments, 0)

  const top5 = allSpecs.slice(0, 5)
  const top10 = allSpecs.slice(0, 10)
  const top5Share = top5.reduce((s: number, x: any) => s + x.total_payments, 0) / totalPayments * 100
  const top10Share = top10.reduce((s: number, x: any) => s + x.total_payments, 0) / totalPayments * 100

  // Highest per-provider payment specialties
  const byPerProvider = [...allSpecs]
    .sort((a: any, b: any) => b.avg_payment_per_provider - a.avg_payment_per_provider)
    .slice(0, 10)

  // Provider count vs payment share analysis
  const totalProviders = allSpecs.reduce((s: number, x: any) => s + x.total_providers, 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'The Specialty Monopoly', href: '/investigations/specialty-monopoly' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Deep Dive</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            The Specialty Monopoly: Where Medicare Money Really Goes
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 12 min read</p>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-purple-900 font-medium text-lg">Key Finding</p>
            <p className="text-purple-800 mt-2">
              Just 5 specialties account for <strong>{top5Share.toFixed(0)}%</strong> of all Medicare spending
              ({formatCurrency(top5.reduce((s: number, x: any) => s + x.total_payments, 0))} out of {formatCurrency(totalPayments)}).
              The top 10 control <strong>{top10Share.toFixed(0)}%</strong>.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Big Five</h2>
          <p className="text-gray-700 mb-4">
            Medicare covers {formatNumber(allSpecs.length)} distinct specialties. But the spending distribution
            looks nothing like an even split. Internal Medicine, Ophthalmology, Clinical Laboratory, Family Practice,
            and Ambulance Services together absorb a third of every Medicare dollar spent.
          </p>
          <p className="text-gray-700 mb-4">
            This isn&apos;t necessarily surprising — these are high-volume specialties that serve the most patients.
            But the degree of concentration raises questions about where Medicare&apos;s priorities actually lie,
            and whether smaller specialties get squeezed.
          </p>
        </article>

        {/* Top 10 table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden my-8">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-semibold text-gray-900">Top 10 Specialties by Total Medicare Payments (2014–2023)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">% of Total</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Per Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {top10.map((s: any, i: number) => {
                  const providerShare = s.total_providers / totalProviders * 100
                  const paymentShare = s.total_payments / totalPayments * 100
                  return (
                    <tr key={s.specialty} className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                      <td className="px-4 py-2">
                        <Link href={`/specialties/${s.specialty_slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          {s.specialty}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(s.total_payments)}</td>
                      <td className="px-4 py-2 text-right">{paymentShare.toFixed(1)}%</td>
                      <td className="px-4 py-2 text-right">{formatNumber(s.total_providers)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(s.avg_payment_per_provider)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Outsized Money Problem</h2>
          <p className="text-gray-700 mb-4">
            Some specialties punch far above their weight. Clinical Laboratory represents just
            {' '}{((allSpecs.find((s: any) => s.specialty === 'Clinical Laboratory')?.total_providers || 0) / totalProviders * 100).toFixed(1)}%
            of all providers, but captures {((allSpecs.find((s: any) => s.specialty === 'Clinical Laboratory')?.total_payments || 0) / totalPayments * 100).toFixed(1)}%
            of payments. Ophthalmology has just {((allSpecs.find((s: any) => s.specialty === 'Ophthalmology')?.total_providers || 0) / totalProviders * 100).toFixed(1)}%
            of providers but receives {((allSpecs.find((s: any) => s.specialty === 'Ophthalmology')?.total_payments || 0) / totalPayments * 100).toFixed(1)}%
            of all Medicare spending.
          </p>
          <p className="text-gray-700 mb-4">
            Compare that to Family Practice: {((allSpecs.find((s: any) => s.specialty === 'Family Practice')?.total_providers || 0) / totalProviders * 100).toFixed(1)}%
            of providers, but only {((allSpecs.find((s: any) => s.specialty === 'Family Practice')?.total_payments || 0) / totalPayments * 100).toFixed(1)}%
            of payments. The family doctor sees the most patients but gets the smallest slice of the pie per provider.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Highest-Paid Specialties Per Provider</h2>
          <p className="text-gray-700 mb-4">
            Which specialties earn the most per provider? This reveals where the real money in Medicare is —
            not just total volume, but concentration of payments per practitioner.
          </p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden my-6">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Payment/Provider (10yr)</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {byPerProvider.map((s: any, i: number) => (
                <tr key={s.specialty} className="hover:bg-blue-50">
                  <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-2 font-medium text-gray-900">{s.specialty}</td>
                  <td className="px-4 py-2 text-right font-bold text-green-700">{formatCurrency(s.avg_payment_per_provider)}</td>
                  <td className="px-4 py-2 text-right text-gray-600">{formatNumber(s.total_providers)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            Clinical laboratories lead at nearly <strong>$1.9 million per provider</strong> over 10 years — though
            these are mostly large corporations processing millions of tests. Radiation therapy centers,
            ambulatory surgical centers, and ophthalmologists round out the top spots.
          </p>
          <p className="text-gray-700 mb-4">
            At the bottom? Nurse practitioners average about $26,000 per year from Medicare. Physical therapists
            earn about $45,000. The specialty you choose determines your Medicare income more than almost
            any other factor.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Policy Question</h2>
          <p className="text-gray-700 mb-4">
            Medicare&apos;s specialty spending reflects decades of fee schedule decisions, lobbying, and historical
            precedent. Procedure-based specialties consistently earn more than cognitive specialties.
            A 15-minute eye injection can generate more revenue than an hour-long primary care visit.
          </p>
          <p className="text-gray-700 mb-4">
            This isn&apos;t just about fairness — it&apos;s about incentives. When Medicare pays ophthalmologists
            {formatCurrency((allSpecs.find((s: any) => s.specialty === 'Ophthalmology')?.avg_payment_per_provider || 0))} per
            provider while family doctors earn {formatCurrency((allSpecs.find((s: any) => s.specialty === 'Family Practice')?.avg_payment_per_provider || 0))},
            medical students notice. The primary care shortage isn&apos;t just about workload — it&apos;s about money.
          </p>
        </article>

        <div className="mt-8">
        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/specialty-gap" className="text-medicare-primary hover:underline text-sm">📊 The Specialty Pay Gap</Link>
            <Link href="/investigations/how-much-does-medicare-pay" className="text-medicare-primary hover:underline text-sm">💰 How Much Does Medicare Pay?</Link>
            <Link href="/investigations/nurse-practitioner-boom" className="text-medicare-primary hover:underline text-sm">👩‍⚕️ Nurse Practitioner Boom</Link>
            <Link href="/specialties" className="text-medicare-primary hover:underline text-sm">🩺 Browse All Specialties</Link>
          </div>
        </div>

          <ShareButtons url="https://www.openmedicare.org/investigations/specialty-monopoly" title="The Specialty Monopoly" />
        </div>
        <SourceCitation />
      </div>
    </main>
  )
}
