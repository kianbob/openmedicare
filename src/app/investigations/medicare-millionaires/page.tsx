import ArticleJsonLd from "@/components/ArticleJsonLd"
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: "Medicare's Top 1%: Who Bills Millions per Year",
  description: 'The average family doctor earns $55K from Medicare. These providers bill $10M+. See the names, specialties, and billing data behind the top 1%.',
  openGraph: {
    title: "Medicare's Top 1%: Who Bills Millions per Year",
    description: 'The average family doctor earns $55K from Medicare. These providers bill $10M+. See the names, specialties, and billing data behind the top 1%.',
  },
}

function loadData() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'top-providers.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { providers: [] } }
}

function loadSpecialties() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'specialties.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { specialties: [] } }
}

export default function MedicareMillionairesPage() {
  const data = loadData()
  const specData = loadSpecialties()
  const providers = data.providers || []

  // Filter tiers (these are 10-year cumulative totals)
  const over1M = providers.filter((p: any) => p.total_payments >= 1_000_000)
  const over5M = providers.filter((p: any) => p.total_payments >= 5_000_000)
  const over10M = providers.filter((p: any) => p.total_payments >= 10_000_000)
  const over50M = providers.filter((p: any) => p.total_payments >= 50_000_000)
  const over100M = providers.filter((p: any) => p.total_payments >= 100_000_000)

  // Individual vs organization
  const individuals = providers.filter((p: any) => p.entity_type === 'I')
  const organizations = providers.filter((p: any) => p.entity_type === 'O')

  // Top 20 individuals
  const topIndividuals = [...individuals]
    .sort((a: any, b: any) => b.total_payments - a.total_payments)
    .slice(0, 20)

  // Specialty breakdown among millionaires
  const specCounts: Record<string, number> = {}
  const specPayments: Record<string, number> = {}
  over1M.forEach((p: any) => {
    specCounts[p.specialty] = (specCounts[p.specialty] || 0) + 1
    specPayments[p.specialty] = (specPayments[p.specialty] || 0) + p.total_payments
  })
  const topSpecialties = Object.entries(specCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  // Average family practice payment
  const familyPractice = (specData.specialties || []).find((s: any) => s.specialty === 'Family Practice')
  const avgFamilyPay = familyPractice ? familyPractice.avg_payment_per_provider : 55150

  const totalMillionairePayments = over1M.reduce((s: number, p: any) => s + p.total_payments, 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ArticleJsonLd title="Medicare Millionaires" description="Providers who received over $10M from Medicare in a single year" url="/investigations/medicare-millionaires" publishedDate="2026-02-21" />
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: "Medicare's Millionaire Club", href: '/investigations/medicare-millionaires' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Investigation</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Medicare&apos;s Millionaire Club: The 1% Who Bill the Most
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 14 min read</p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-red-900 font-medium text-lg">Key Finding</p>
            <p className="text-red-800 mt-2">
              The average family doctor earns <strong>{formatCurrency(avgFamilyPay)}</strong> per year from Medicare.
              The top {formatNumber(over100M.length)} providers in our database each collected over <strong>$100 million</strong> over the past decade.
              Together, these {formatNumber(over1M.length)} &ldquo;millionaire&rdquo; providers collected <strong>{formatCurrency(totalMillionairePayments)}</strong>.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Scale of Concentration</h2>
          <p className="text-gray-700 mb-4">
            Medicare pays over a million providers every year. But the distribution is wildly uneven.
            Our database of the top 1,000 providers — all of whom received at least $1 million — reveals
            an extraordinary concentration of payments at the top.
          </p>
        </article>

        {/* Tier breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
          {[
            { label: '$1M+ (10yr cumulative)', count: over1M.length, color: 'blue' },
            { label: '$5M+', count: over5M.length, color: 'yellow' },
            { label: '$10M+', count: over10M.length, color: 'orange' },
            { label: '$50M+', count: over50M.length, color: 'red' },
            { label: '$100M+', count: over100M.length, color: 'red' },
            { label: 'Total collected', count: null, amount: totalMillionairePayments, color: 'purple' },
          ].map((tier, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">{tier.label}</p>
              <p className="text-2xl font-bold text-gray-900">
                {tier.count !== null ? formatNumber(tier.count) : formatCurrency(tier.amount!)}
              </p>
            </div>
          ))}
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Individual vs. Organization</h2>
          <p className="text-gray-700 mb-4">
            Of the top 1,000 Medicare providers, <strong>{formatNumber(organizations.length)}</strong> are organizations
            (laboratories, ambulance companies, surgical centers) and <strong>{formatNumber(individuals.length)}</strong> are
            individual practitioners. Organizations dominate the top of the list — the biggest being
            Laboratory Corporation of America with over $2.2 billion in cumulative Medicare payments.
          </p>
          <p className="text-gray-700 mb-4">
            But among individuals, the numbers are still staggering. Individual providers in this dataset
            have each collected millions — sometimes tens of millions — from Medicare over the past decade.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Which Specialties Dominate?</h2>
          <p className="text-gray-700 mb-4">
            The millionaire club isn&apos;t evenly distributed across medicine. A handful of specialties
            account for the vast majority of these high-billing providers:
          </p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden my-6">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers ($1M+)</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Combined Payments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topSpecialties.map(([spec, count]) => (
                <tr key={spec} className="hover:bg-blue-50">
                  <td className="px-4 py-2 font-medium text-gray-900">{spec}</td>
                  <td className="px-4 py-2 text-right">{formatNumber(count)}</td>
                  <td className="px-4 py-2 text-right font-medium">{formatCurrency(specPayments[spec])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            Clinical laboratories and ambulance services lead the pack — not because of fraud, but because
            of sheer volume. A single national lab processes millions of tests per year. But ophthalmology&apos;s
            presence is notable: eye care specialists earn their way into the millionaire club through
            expensive injectable drugs like aflibercept, which alone accounts for $19.7 billion in Medicare spending.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Top 20 Individual Providers</h2>
          <p className="text-gray-700 mb-4">
            These are the highest-billing <em>individual</em> providers in the Medicare system — not organizations,
            but single practitioners. Note: some names may appear as &ldquo;Unknown&rdquo; due to CMS privacy thresholds.
          </p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden my-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Provider</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments (10yr)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topIndividuals.map((p: any, i: number) => (
                  <tr key={p.npi || i} className="hover:bg-blue-50">
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2">
                      {p.npi ? (
                        <Link href={`/providers/${p.npi}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          {p.name || 'Unknown'}
                        </Link>
                      ) : (
                        <span className="font-medium text-gray-900">{p.name || 'Unknown'}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-600 text-sm">{p.specialty || 'Unknown'}</td>
                    <td className="px-4 py-2 text-gray-600">{p.state || '—'}</td>
                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(p.total_payments)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Does This Mean?</h2>
          <p className="text-gray-700 mb-4">
            High Medicare payments don&apos;t automatically indicate fraud or waste. Large laboratories
            serve millions of patients. Ophthalmologists administer expensive drugs that Medicare sets
            the price for. Ambulance services operate across entire states.
          </p>
          <p className="text-gray-700 mb-4">
            But the concentration raises important questions: When a handful of providers collect billions,
            is Medicare getting value for its money? Are there competitive markets, or do dominant players
            set the terms? And when an individual practitioner bills $100M+ over a decade, what oversight
            exists to ensure those services were actually delivered?
          </p>
          <p className="text-gray-700 mb-4">
            The millionaire club is a feature of how American healthcare works — massive volume,
            expensive drugs, and a payment system that rewards throughput over outcomes.
            Understanding who&apos;s in the club is the first step toward understanding whether
            the system is working.
          </p>
        </article>

        <div className="mt-8">
        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/biggest-billers" className="text-medicare-primary hover:underline text-sm">📊 Medicare Biggest Billers</Link>
            <Link href="/investigations/specialty-monopoly" className="text-medicare-primary hover:underline text-sm">🏛️ The Specialty Monopoly</Link>
            <Link href="/providers" className="text-medicare-primary hover:underline text-sm">👨‍⚕️ Provider Directory</Link>
            <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline text-sm">🚨 Fraud Watchlist</Link>
          </div>
        </div>

          <ShareButtons url="https://www.openmedicare.us/investigations/medicare-millionaires" title="Medicare's Millionaire Club" />
            <InvestigationDisclaimer />        </div>
        <SourceCitation />
      </div>
    </main>
  )
}
