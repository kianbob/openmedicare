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
  title: 'Beverly Hills: America\'s Most Expensive ZIP Code for Medicare',
  description: 'Beverly Hills providers bill Medicare at rates far exceeding the national average. Plastic surgeons billing wound care, ambulatory surgery centers, and the luxury ZIP code effect.',
  alternates: { canonical: '/investigations/beverly-hills-billing' },
  openGraph: {
    title: 'Beverly Hills: America\'s Most Expensive ZIP Code for Medicare',
    description: 'Three providers in our top 1,000 are from Beverly Hills — billing a combined $120M+ to Medicare.',
    url: 'https://openmedicare.vercel.app/investigations/beverly-hills-billing',
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
  avg_payment_per_service: number
}

interface YearlyTrend {
  year: number
  total_providers: number
  total_payments: number
  avg_payment_per_provider: number
}

export default function BeverlyHillsBillingPage() {
  const publishedDate = '2026-02-21'
  const readTime = '13 min read'

  const providersData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'top-providers.json'), 'utf8')
  )
  const trendsData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'trends.json'), 'utf8')
  )

  const providers: Provider[] = providersData.providers
  const bhProviders = providers.filter((p: Provider) => p.city && p.city.toLowerCase() === 'beverly hills')
  const bhTotal = bhProviders.reduce((sum: number, p: Provider) => sum + p.total_payments, 0)
  const bhAvg = bhTotal / (bhProviders.length || 1)

  // National average from latest year
  const latestYear: YearlyTrend = trendsData.yearly_trends[trendsData.yearly_trends.length - 1]
  const nationalAvgPerProvider = latestYear.avg_payment_per_provider

  // Find some notable providers for comparison — top individual providers in CA
  const caProviders = providers.filter((p: Provider) => p.state === 'CA' && p.entity_type === 'I').slice(0, 10)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'Beverly Hills Billing' },
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
                Beverly Hills
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                America&apos;s Most Expensive ZIP Code for Medicare
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
                Beverly Hills, California — ZIP code 90210 — is synonymous with wealth, luxury, and plastic surgery.
                It&apos;s probably not where you&apos;d expect to find some of Medicare&apos;s highest-billing providers. But our
                analysis of the top 1,000 Medicare providers reveals <strong>{bhProviders.length} Beverly Hills entries</strong> billing
                a combined <strong>{formatCurrency(bhTotal)}</strong> — an average
                of <strong>{formatCurrency(bhAvg)}</strong> per provider. The national average?
                Just {formatCurrency(nationalAvgPerProvider)}.
              </p>

              <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-pink-900 mb-3">Beverly Hills vs The Nation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-pink-800">
                  <div>
                    <div className="font-bold text-2xl mb-1">{formatCurrency(bhTotal)}</div>
                    <div>Combined Beverly Hills billing</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">{formatCurrency(bhAvg)}</div>
                    <div>Avg per BH provider (top 1,000)</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">{(bhAvg / nationalAvgPerProvider).toFixed(0)}x</div>
                    <div>vs national average provider</div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Beverly Hills Providers</h2>
              <p>
                Among Medicare&apos;s top 1,000 billing entities, these Beverly Hills providers stand out:
              </p>

              <div className="overflow-x-auto my-6">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left font-semibold">Provider</th>
                      <th className="px-4 py-2 text-left font-semibold">Specialty</th>
                      <th className="px-4 py-2 text-right font-semibold">Total Payments</th>
                      <th className="px-4 py-2 text-right font-semibold">Services</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bhProviders.map((p: Provider) => (
                      <tr key={p.npi} className="border-b border-gray-100">
                        <td className="px-4 py-2">
                          <Link href={`/providers/${p.npi}`} className="text-medicare-primary hover:underline font-medium">
                            {p.name}
                          </Link>
                        </td>
                        <td className="px-4 py-2">{p.specialty}</td>
                        <td className="px-4 py-2 text-right font-mono">{formatCurrency(p.total_payments)}</td>
                        <td className="px-4 py-2 text-right font-mono">{formatNumber(p.total_services)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Plastic Surgery Pipeline</h2>
              <p>
                Beverly Hills is the plastic surgery capital of America. But plastic surgeons in Beverly Hills
                aren&apos;t just billing Medicare for cosmetic procedures (which Medicare doesn&apos;t cover). They&apos;re
                billing for <strong>wound care</strong>.
              </p>
              <p>
                The connection isn&apos;t as strange as it sounds. Plastic surgeons are trained in wound management
                and tissue reconstruction. Medicare covers wound care for diabetic ulcers, surgical complications,
                and chronic wounds. But the markup opportunities in wound care are enormous — and Beverly Hills
                providers have found them.
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Case Study: Som Kohanzadeh, MD — Beverly Hills</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Total Medicare Payments:</span> <strong className="text-purple-800">{formatCurrency(14722228)}</strong></div>
                  <div><span className="text-gray-600">Specialty:</span> <strong>Plastic & Reconstructive Surgery</strong></div>
                  <div><span className="text-gray-600">Key procedures:</span> <strong>Skin substitutes, debridement</strong></div>
                  <div><span className="text-gray-600">Markup ratio:</span> <strong className="text-purple-800">59.1x</strong></div>
                </div>
                <p className="text-sm text-purple-800 mt-4">
                  A Beverly Hills plastic surgeon billing Medicare $14.7M — primarily through wound care products
                  like Kerecis Omega3 and PuraPly, plus hyperbaric oxygen therapy. His markup ratio of 59.1x means
                  he submits charges 59 times higher than Medicare actually pays.
                </p>
                <div className="mt-3">
                  <Link href="/providers/1952575342" className="text-purple-700 hover:underline text-sm font-medium">
                    View Full Provider Profile →
                  </Link>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why Beverly Hills?</h2>
              <p>
                The Beverly Hills anomaly seems counterintuitive: why would one of America&apos;s wealthiest ZIP codes
                be a Medicare billing hotspot? Several factors converge:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>High concentration of specialists</strong> — Beverly Hills attracts top-tier surgeons and
                  specialists. These providers have the training and credentials to bill high-reimbursement procedures.
                </li>
                <li>
                  <strong>Medicare-eligible elderly population</strong> — despite the wealth, Beverly Hills has a
                  significant elderly population on Medicare. The 90210 ZIP code skews older than you&apos;d think.
                </li>
                <li>
                  <strong>Ambulatory surgery centers</strong> — Beverly Hills has a high density of ASCs that bill
                  Medicare for outpatient surgical procedures at facility rates.
                </li>
                <li>
                  <strong>Wound care opportunity</strong> — the convergence of plastic surgery expertise and
                  lucrative wound care billing creates a natural (if eyebrow-raising) business model.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Luxury ZIP Code Effect</h2>
              <p>
                Beverly Hills isn&apos;t the only wealthy ZIP code with outsized Medicare billing. Across the country,
                luxury ZIP codes show up repeatedly in high-billing provider analyses:
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-3">Luxury ZIP Code Hotspots</h3>
                <div className="space-y-3 text-sm text-amber-800">
                  <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                    <span className="font-semibold">Miami Beach / Bal Harbour, FL</span>
                    <span>Medicare fraud capital — highest fraud conviction rate per capita</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                    <span className="font-semibold">Manhattan (Upper East Side), NY</span>
                    <span>Dense specialist concentration, high per-provider billing</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                    <span className="font-semibold">Boca Raton / Palm Beach, FL</span>
                    <span>Retirement community + specialist density = high Medicare volume</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                    <span className="font-semibold">Scottsdale, AZ</span>
                    <span>Retirement destination with growing specialty care market</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Beverly Hills, CA</span>
                    <span>Specialist density + wound care + ASCs</span>
                  </div>
                </div>
              </div>

              <p>
                The pattern is consistent: wealthy areas attract specialists who command high reimbursement rates,
                while also serving elderly populations with comprehensive Medicare coverage. Add in the higher
                cost of living (which Medicare&apos;s geographic adjustment factors partially account for) and
                you get per-provider billing rates that dwarf the national average.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Beverly Hills vs the National Average</h2>
              <p>
                To put Beverly Hills billing in perspective: the national average Medicare payment per provider
                in 2023 was {formatCurrency(nationalAvgPerProvider)}. The Beverly Hills providers in our top 1,000
                average {formatCurrency(bhAvg)} — roughly <strong>{(bhAvg / nationalAvgPerProvider).toFixed(0)}x</strong> the
                national rate.
              </p>
              <p>
                Even accounting for specialty differences and geographic adjustments, this concentration of
                high-billing providers in a single wealthy ZIP code warrants scrutiny. Not because high billing
                is inherently fraudulent — but because the incentive structures in these luxury markets can
                create opportunities for abuse.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Florida Connection</h2>
              <p>
                If Beverly Hills is a Medicare billing anomaly, South Florida is a Medicare billing universe.
                Miami-Dade County has long been known as the Medicare fraud capital of America, with the
                DOJ&apos;s Medicare Fraud Strike Force maintaining a permanent presence there since 2007.
              </p>
              <p>
                The similarities between Beverly Hills and South Florida Medicare hotspots are striking:
                elderly populations, high specialist density, ambulatory surgery centers, and a culture of
                aggressive billing. The difference is scale — South Florida&apos;s Medicare market is orders of
                magnitude larger than Beverly Hills.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What to Watch</h2>
              <p>
                Beverly Hills represents a broader trend in Medicare: the geographic concentration of billing
                in areas where specialist density, elderly populations, and high-reimbursement procedures
                converge. As CMS increases its use of data analytics for fraud detection, these geographic
                patterns will likely receive more scrutiny.
              </p>
              <p>
                The question isn&apos;t whether Beverly Hills providers are billing a lot — they are. The question
                is whether the volume of high-reimbursement procedures (particularly wound care) in one of
                America&apos;s wealthiest ZIP codes reflects genuine medical need or opportunistic billing.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> The billing patterns described in this article are statistical observations
                based on publicly available CMS data, not accusations of fraud. Individual providers may have
                legitimate explanations for high billing volumes. Named providers have not been charged with any
                crime unless otherwise stated.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href="/investigations/wound-care-crisis" className="text-medicare-primary hover:underline text-sm">🩹 The Wound Care Industrial Complex</Link>
                <Link href="/investigations/geographic-inequality" className="text-medicare-primary hover:underline text-sm">🗺️ ZIP Code Lottery</Link>
                <Link href="/investigations/medicare-millionaires" className="text-medicare-primary hover:underline text-sm">💰 Medicare&apos;s Millionaire Club</Link>
                <Link href="/investigations/markup-machine" className="text-medicare-primary hover:underline text-sm">🔧 The Markup Machine</Link>
                <Link href="/investigations/beverly-hills-wound-care" className="text-medicare-primary hover:underline text-sm">💎 Beverly Hills Wound Care</Link>
                <Link href="/investigations/data-predicted-fraud" className="text-medicare-primary hover:underline text-sm">🏆 Our Data Predicted Fraud</Link>
                <Link href="/states/CA" className="text-medicare-primary hover:underline text-sm">🗺️ California Medicare Data</Link>
                <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🚨 Fraud Analysis Hub</Link>
                <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline text-sm">📋 Fraud Watchlist</Link>
                <Link href="/markup" className="text-medicare-primary hover:underline text-sm">📈 Markup Analysis Tool</Link>
              </div>
            </div>

            <ShareButtons
              url="https://openmedicare.vercel.app/investigations/beverly-hills-billing"
              title="Beverly Hills: America's Most Expensive ZIP Code for Medicare"
            />

            <div className="mt-6">
              <SourceCitation
                sources={[
                  'Centers for Medicare & Medicaid Services (CMS) — Medicare Provider Utilization and Payment Data (2014-2023)',
                  'DOJ Medicare Fraud Strike Force — Annual Reports',
                  'HHS Office of Inspector General — Geographic Variation in Medicare Spending',
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
