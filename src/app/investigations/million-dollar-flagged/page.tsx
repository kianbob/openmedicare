import type { Metadata } from 'next'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'The Million-Dollar Club: 47 AI-Flagged Providers Who Billed Over $1M Each | OpenMedicare',
  description: '47 providers flagged by our AI model each billed Medicare over $1 million. Combined, they collected over $93 million in taxpayer money — while matching the billing patterns of convicted fraudsters.',
  alternates: { canonical: '/investigations/million-dollar-flagged' },
  openGraph: {
    title: 'The Million-Dollar Club: 47 AI-Flagged Providers Who Billed Over $1M Each',
    description: '47 providers flagged for fraud patterns each billed over $1M. Terrance Hughes alone: $5.3M. Here\'s who they are.',
    url: 'https://openmedicare.vercel.app/investigations/million-dollar-flagged',
  },
}

const topBillers = [
  { rank: 294, npi: '1932192068', name: 'Terrance Hughes', specialty: 'Internal Medicine', state: 'IL', prob: 0.912, pay: 5316842, markup: 2.41, spb: 4.12, note: 'Highest total payments of any flagged provider — $5.3M from Medicare with a 4.12 services-per-beneficiary ratio' },
  { rank: 52, npi: '1003837076', name: 'Remy Zockazock', specialty: 'Internal Medicine', state: 'FL', prob: 0.937, pay: 4102938, markup: 2.18, spb: 3.87, note: 'South Florida internist with $4.1M in payments — high probability and high volume' },
  { rank: 349, npi: '1407894990', name: 'Edwin Yau', specialty: 'Internal Medicine', state: 'CA', prob: 0.908, pay: 3812456, markup: 2.33, spb: 3.55, note: 'California internist billing $3.8M — the state\'s highest-billing flagged provider' },
  { rank: 254, npi: '1952487530', name: 'Chinh Mai', specialty: 'Internal Medicine', state: 'TX', prob: 0.918, pay: 3345671, markup: 2.27, spb: 3.91, note: 'Texas internist with $3.3M and nearly 4 services per beneficiary — well above the specialty average' },
]

const millionDollarStats = {
  count: 47,
  totalPayments: 93400000,
  avgPayments: 1987234,
  avgProb: 0.921,
  pctIM: 72,
  avgMarkup: 2.31,
  avgSPB: 3.64,
}

export default function MillionDollarFlaggedPage() {
  const publishedDate = '2026-02-21'
  const readTime = '11 min read'

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="The Million-Dollar Club: 47 AI-Flagged Providers Who Billed Over $1M Each"
        description="47 providers flagged by our AI model each billed Medicare over $1 million while matching the billing patterns of convicted fraudsters."
        publishedDate={publishedDate}
        url="https://openmedicare.vercel.app/investigations/million-dollar-flagged"
      />
            <InvestigationDisclaimer />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'The Million-Dollar Club' },
          ]}
          className="mb-8"
        />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-4">
                ML Investigation
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4 leading-tight">
                The Million-Dollar Club
              </h1>
              <p className="text-2xl text-gray-600 font-light leading-relaxed">
                47 AI-Flagged Providers Who Billed Over $1M Each — and Match the Pattern of Convicted Fraudsters
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
              <div className="ml-auto">
                <ShareButtons title="The Million-Dollar Club: 47 AI-Flagged $1M+ Providers" url="/investigations/million-dollar-flagged" />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important Disclaimer:</strong> The providers identified in this analysis are flagged based on
                <strong> statistical patterns</strong>, not evidence of wrongdoing. High billing volume alone is not
                suspicious — many of these providers may serve large, complex patient populations. A high fraud probability
                score means billing patterns are mathematically similar to those of convicted fraudsters. <strong>No
                provider named here has been accused or charged with any crime</strong> unless otherwise noted.
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* The Hook */}
              <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                Most of the 500 providers flagged by our AI model bill Medicare in the hundreds of thousands per year —
                enough to trigger statistical alarm bells, but not enough to stand out in raw dollar terms. Then there
                are the 47 who crossed the million-dollar threshold.
              </p>

              <p>
                These aren&apos;t just providers with suspicious billing patterns. They&apos;re providers with suspicious
                billing patterns <em>and</em> massive volume. Collectively, they billed Medicare over{' '}
                <strong>{formatCurrency(millionDollarStats.totalPayments)}</strong> — an average of{' '}
                <strong>{formatCurrency(millionDollarStats.avgPayments)}</strong> each. Their average fraud probability
                score is <strong>{(millionDollarStats.avgProb * 100).toFixed(1)}%</strong>.
              </p>

              <p>
                Not all big billers are fraudsters. Oncologists routinely bill millions due to expensive drug costs.
                Large group practices can legitimately bill tens of millions. But when a provider bills over $1 million
                <em> and</em> their billing pattern matches convicted criminals across every metric our model
                tracks — volume, markup, services per patient, geographic concentration — that&apos;s a different story.
              </p>

              {/* Key Stats */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">📊 The Million-Dollar Club at a Glance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-900">{millionDollarStats.count}</div>
                    <div className="text-xs text-blue-700">providers over $1M</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">${(millionDollarStats.totalPayments / 1000000).toFixed(0)}M</div>
                    <div className="text-xs text-blue-700">combined payments</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">{millionDollarStats.pctIM}%</div>
                    <div className="text-xs text-blue-700">Internal Medicine</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">{(millionDollarStats.avgProb * 100).toFixed(0)}%</div>
                    <div className="text-xs text-blue-700">avg fraud probability</div>
                  </div>
                </div>
              </div>

              {/* The Biggest Billers */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                The Biggest Billers
              </h2>

              <p>
                At the top of the million-dollar club sits <strong>Terrance Hughes</strong>, an Illinois internist
                who billed Medicare <strong>{formatCurrency(5316842)}</strong>. That&apos;s more than six times the average
                for Internal Medicine providers — and his billing pattern matches convicted fraudsters with a
                91.2% probability score.
              </p>

              <div className="space-y-4 my-8 not-prose">
                {topBillers.map((p) => (
                  <Link
                    key={p.npi}
                    href={`/providers/${p.npi}`}
                    className="block bg-white border border-gray-200 rounded-lg p-5 hover:border-medicare-primary hover:shadow-md transition-all no-underline"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-white bg-red-600 rounded px-2 py-0.5">
                            Rank #{p.rank}
                          </span>
                          <span className="text-xs text-gray-500">{p.state} · NPI: {p.npi}</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900"><Link href={`/providers/${p.npi}`} className="hover:text-medicare-primary">{p.name}</Link></h4>
                        <p className="text-sm text-gray-600">{p.specialty}</p>
                        <p className="text-xs text-gray-500 mt-1">{p.note}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="text-2xl font-bold text-green-700">{formatCurrency(p.pay)}</div>
                        <div className="text-xs text-gray-500">total payments</div>
                        <div className="text-sm font-semibold text-red-600 mt-1">
                          {(p.prob * 100).toFixed(1)}% prob
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">Markup:</span> {p.markup}×
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">Services/Beneficiary:</span> {p.spb}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* What Makes Them Different */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                What Makes High-Volume Flagged Providers Different?
              </h2>

              <p>
                The million-dollar flagged providers aren&apos;t just scaled-up versions of typical suspicious billers.
                They have a distinct profile:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 my-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-bold text-gray-900 mb-2">Million-Dollar Club (47 providers)</p>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Avg payments: <strong>{formatCurrency(millionDollarStats.avgPayments)}</strong></li>
                      <li>• Avg markup ratio: <strong>{millionDollarStats.avgMarkup}×</strong></li>
                      <li>• Avg services/beneficiary: <strong>{millionDollarStats.avgSPB}</strong></li>
                      <li>• {millionDollarStats.pctIM}% Internal Medicine</li>
                      <li>• Concentrated in CA, FL, IL, TX</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-2">Other Flagged Providers (453)</p>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Avg payments: <strong>{formatCurrency(680000)}</strong></li>
                      <li>• Avg markup ratio: <strong>2.15×</strong></li>
                      <li>• Avg services/beneficiary: <strong>2.89</strong></li>
                      <li>• 51% Internal Medicine</li>
                      <li>• More geographically dispersed</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p>
                The million-dollar group has higher markup ratios, more services per beneficiary, and is even
                more concentrated in Internal Medicine than the broader flagged pool. They&apos;re not just billing
                more — they&apos;re billing <em>differently</em>. Higher intensity per patient, higher charges relative
                to what Medicare allows, and more services packed into each patient encounter.
              </p>

              {/* The Pattern */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                Not All Big Billers Are Fraudsters — But These Match the Pattern
              </h2>

              <p>
                This is an important distinction. Medicare has thousands of providers who legitimately bill over
                $1 million per year. Oncologists administering chemotherapy drugs can bill $5–10M+. Large
                multi-provider group practices bill tens of millions. High-volume surgical practices serve
                hundreds of patients.
              </p>

              <p>
                What sets the million-dollar club apart isn&apos;t the dollar amount — it&apos;s that these providers
                match convicted fraudsters across <strong>every dimension</strong> our model evaluates:
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-red-900 mb-3">🚩 The Full Pattern Match</h3>
                <ul className="space-y-2 text-sm text-red-800">
                  <li>✓ <strong>Volume:</strong> High total services and beneficiary counts</li>
                  <li>✓ <strong>Markup:</strong> Charging 2–3× what Medicare allows (vs. 1.5× typical)</li>
                  <li>✓ <strong>Intensity:</strong> 3.5+ services per beneficiary (vs. 1.8 average)</li>
                  <li>✓ <strong>Specialty:</strong> Overwhelmingly Internal Medicine (72%)</li>
                  <li>✓ <strong>Geography:</strong> Concentrated in known fraud hotspot states</li>
                  <li>✓ <strong>Code distribution:</strong> Heavy on high-paying E&M codes</li>
                </ul>
                <p className="text-red-700 text-sm mt-4">
                  Each factor alone could be explained. All six together, matching the exact signature of
                  convicted criminals? That&apos;s what our model is designed to detect.
                </p>
              </div>

              <p>
                The question isn&apos;t whether these providers are billing a lot of money. Plenty of legitimate
                providers do. The question is <em>why their billing patterns look identical to people who went to prison</em>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <Link
                  href="/fraud/still-out-there"
                  className="block bg-medicare-primary text-white rounded-lg p-6 hover:bg-blue-700 transition-colors no-underline"
                >
                  <div className="text-lg font-bold mb-2">🔍 Search All 500 Flagged Providers</div>
                  <p className="text-blue-100 text-sm">
                    Full searchable list with fraud probability scores, billing data, and provider profiles.
                  </p>
                </Link>
                <Link
                  href="/fraud/report"
                  className="block bg-red-600 text-white rounded-lg p-6 hover:bg-red-700 transition-colors no-underline"
                >
                  <div className="text-lg font-bold mb-2">📞 Report Fraud</div>
                  <p className="text-red-100 text-sm">
                    HHS OIG hotline and False Claims Act whistleblower information.
                  </p>
                </Link>
              </div>

              {/* Source Citation */}
              <SourceCitation
                sources={[
                  'CMS Medicare Provider Utilization and Payment Data (2014–2023)',
                  'HHS Office of Inspector General — List of Excluded Individuals/Entities (LEIE)',
                  'OpenMedicare ML Model v2.0 (Random Forest, AUC 0.83)',
                  'Provider-level billing aggregates from public CMS data',
                ]}
              />

              {/* Related Investigations */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Related Investigations</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    href="/investigations/algorithm-knows"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">The Algorithm Knows</div>
                    <p className="text-xs text-gray-600">
                      How AI trained on 8,300 convicted fraudsters found 500 providers who bill just like them.
                    </p>
                  </Link>
                  <Link
                    href="/investigations/internal-medicine-crisis"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">Internal Medicine Crisis</div>
                    <p className="text-xs text-gray-600">
                      Why 53% of all flagged providers are Internal Medicine specialists.
                    </p>
                  </Link>
                  <Link
                    href="/investigations/florida-california-fraud"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">The Fraud Belt</div>
                    <p className="text-xs text-gray-600">
                      Why California and Florida lead Medicare fraud — 56 flagged providers each.
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
