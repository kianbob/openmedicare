import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'The Fraud Belt: Why California and Florida Lead Medicare Fraud | OpenMedicare',
  description: 'California and Florida each have 56 AI-flagged Medicare providers — 22.4% of all flags. Combined with NY, TX, and NJ, five states account for over half of all suspicious billing patterns.',
  alternates: { canonical: '/investigations/florida-california-fraud' },
  openGraph: {
    title: 'The Fraud Belt: Why California and Florida Lead Medicare Fraud',
    description: 'CA and FL tied at 56 flagged providers each. Fraud follows the sun — and the elderly population.',
    url: 'https://www.openmedicare.org/investigations/florida-california-fraud',
  },
}

const stateRankings = [
  { rank: 1, state: 'California', abbr: 'CA', flagged: 56, pct: 11.2, color: 'bg-red-500' },
  { rank: 1, state: 'Florida', abbr: 'FL', flagged: 56, pct: 11.2, color: 'bg-red-500' },
  { rank: 3, state: 'New York', abbr: 'NY', flagged: 39, pct: 7.8, color: 'bg-orange-500' },
  { rank: 4, state: 'Texas', abbr: 'TX', flagged: 36, pct: 7.2, color: 'bg-orange-400' },
  { rank: 5, state: 'New Jersey', abbr: 'NJ', flagged: 33, pct: 6.6, color: 'bg-yellow-500' },
]

const caProviders = [
  { npi: '1245366558', name: 'Tuan Duong', specialty: 'Internal Medicine', city: 'Westminster', prob: 0.956, pay: 516519, note: 'Orange County internist with billing patterns matching convicted SoCal fraudsters' },
  { npi: '1467592040', name: 'Kambiz Pahlavan', specialty: 'Internal Medicine', city: 'Los Angeles', prob: 0.942, pay: 892433, note: 'Los Angeles — the single highest-volume city for Medicare fraud flags in the country' },
  { npi: '1104012195', name: 'Nasser Samiy', specialty: 'Internal Medicine', city: 'San Jose', prob: 0.938, pay: 673291, note: 'Bay Area internist — unusual for NorCal, where fraud concentrates less than SoCal' },
]

const flProviders = [
  { npi: '1609929405', name: 'Michael Hernandez', specialty: 'Internal Medicine', city: 'Miami', prob: 0.951, pay: 1210737, note: 'Miami — historically the single most fraudulent city in Medicare history per DOJ records' },
  { npi: '1831290979', name: 'Enrique Herrera', specialty: 'Internal Medicine', city: 'Hialeah', prob: 0.944, pay: 689452, note: 'Hialeah — the small city that consistently appears in DOJ takedown press releases' },
  { npi: '1952487530', name: 'Mario De La Osa', specialty: 'Internal Medicine', city: 'Miami', prob: 0.939, pay: 745893, note: 'South Florida clustering — 3 of top 5 FL flags within 10 miles of each other' },
]

export default function FloridaCaliforniaFraudPage() {
  const publishedDate = '2026-02-21'
  const readTime = '12 min read'
  const top5Total = stateRankings.reduce((s, r) => s + r.flagged, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="The Fraud Belt: Why California and Florida Lead Medicare Fraud"
        description="CA and FL tied at 56 flagged providers each — 22.4% of all AI-flagged Medicare providers."
        publishedDate={publishedDate}
        url="https://www.openmedicare.org/investigations/florida-california-fraud"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'The Fraud Belt' },
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
                The Fraud Belt
              </h1>
              <p className="text-2xl text-gray-600 font-light leading-relaxed">
                Why California and Florida Lead Medicare Fraud — and Why the Pattern Keeps Repeating
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
                <ShareButtons title="The Fraud Belt: Why CA and FL Lead Medicare Fraud" url="/investigations/florida-california-fraud" />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important Disclaimer:</strong> The providers identified in this analysis are flagged based on
                <strong> statistical patterns</strong>, not evidence of wrongdoing. A high fraud probability score means
                a provider&apos;s billing patterns are mathematically similar to those of convicted fraudsters. There may be
                entirely legitimate explanations. <strong>No provider named here has been accused or charged with
                any crime</strong> unless otherwise noted.
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* The Hook */}
              <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                If Medicare fraud had a geography, it would look like a sun belt. <Link href="/states/CA" className="text-medicare-primary hover:underline font-semibold">California</Link> and <Link href="/states/FL" className="text-medicare-primary hover:underline font-semibold">Florida</Link> — tied at
                56 flagged providers each — account for <strong>22.4%</strong> of all <Link href="/fraud/still-out-there" className="text-medicare-primary hover:underline">AI-flagged providers</Link>. Add <Link href="/states/NY" className="text-medicare-primary hover:underline">New York</Link>,
                <Link href="/states/TX" className="text-medicare-primary hover:underline">Texas</Link>, and <Link href="/states/NJ" className="text-medicare-primary hover:underline">New Jersey</Link>, and five states account for <strong>{top5Total} of 500 flags ({((top5Total / 500) * 100).toFixed(1)}%)</strong>.
              </p>

              <p>
                This isn&apos;t new. The DOJ&apos;s largest Medicare fraud takedowns have consistently centered on
                South Florida, Los Angeles, Houston, and the New York metro area. Our machine learning model,
                trained on 8,300+ convicted fraudsters, independently arrived at the same conclusion: fraud
                follows the sun — and the elderly population.
              </p>

              {/* State Rankings */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                The Top 5 States for Fraud-Pattern Flags
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 my-8">
                <div className="space-y-3">
                  {stateRankings.map((s) => (
                    <div key={s.abbr} className="flex items-center gap-3">
                      <div className="w-8 text-sm font-bold text-gray-500">#{s.rank}</div>
                      <div className="w-28 text-sm font-medium text-gray-700 shrink-0">{s.state}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                          className={`h-full ${s.color} rounded-full flex items-center justify-end pr-2`}
                          style={{ width: `${(s.flagged / 56) * 100}%` }}
                        >
                          <span className="text-xs text-white font-bold">{s.flagged}</span>
                        </div>
                      </div>
                      <div className="w-14 text-sm text-gray-500 text-right">{s.pct}%</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Top 5 states: {top5Total} of 500 flagged providers ({((top5Total / 500) * 100).toFixed(1)}%). The remaining 45 states + territories share {500 - top5Total} flags.
                </p>
              </div>

              {/* Why These States */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                Why These States? Three Structural Factors
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 not-prose">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <div className="text-3xl mb-2">👴</div>
                  <h4 className="font-bold text-blue-900 mb-2">Elderly Population</h4>
                  <p className="text-sm text-blue-800">
                    Florida has the highest share of 65+ residents (21.3%). California has the largest absolute
                    number of Medicare beneficiaries (6.4 million). More patients = more billing = more opportunity.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <div className="text-3xl mb-2">🏪</div>
                  <h4 className="font-bold text-blue-900 mb-2">Provider Density</h4>
                  <p className="text-sm text-blue-800">
                    Dense metropolitan areas (Miami, LA, NYC) have enormous numbers of providers competing for
                    patients. This creates pressure to maximize billing — and cover for fraudulent providers to
                    hide in the crowd.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <div className="text-3xl mb-2">📜</div>
                  <h4 className="font-bold text-blue-900 mb-2">Historical Networks</h4>
                  <p className="text-sm text-blue-800">
                    Fraud breeds fraud. Once billing schemes take root in a region, knowledge spreads through
                    professional networks. South Florida has had organized fraud rings since the 1990s — the
                    infrastructure is generational.
                  </p>
                </div>
              </div>

              {/* California Profiles */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                California: 56 Flags, Concentrated in SoCal
              </h2>

              <p>
                <Link href="/states/CA" className="text-medicare-primary hover:underline">California&apos;s</Link> 56 flagged providers are heavily concentrated in Southern California — particularly
                Los Angeles County and Orange County. This mirrors DOJ enforcement patterns: the Central District
                of California (covering LA) is consistently among the top districts for <Link href="/fraud" className="text-medicare-primary hover:underline">Medicare fraud</Link> prosecutions.
              </p>

              <div className="space-y-4 my-8 not-prose">
                {caProviders.map((p) => (
                  <Link
                    key={p.npi}
                    href={`/providers/${p.npi}`}
                    className="block bg-white border border-gray-200 rounded-lg p-5 hover:border-medicare-primary hover:shadow-md transition-all no-underline"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-white bg-blue-600 rounded px-2 py-0.5">CA</span>
                          <span className="text-xs text-gray-500">{p.city} · NPI: {p.npi}</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">{p.name}</h4>
                        <p className="text-sm text-gray-600">{p.specialty}</p>
                        <p className="text-xs text-gray-500 mt-1">{p.note}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="text-2xl font-bold text-red-600">{(p.prob * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">fraud probability</div>
                        <div className="text-sm font-semibold text-gray-700 mt-1">
                          ${(p.pay / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Florida Profiles */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                Florida: 56 Flags, Miami Is Still Ground Zero
              </h2>

              <p>
                South <Link href="/states/FL" className="text-medicare-primary hover:underline">Florida</Link> has been called the &quot;Medicare fraud capital of the world&quot; by federal prosecutors.
                Our data confirms it. Of Florida&apos;s 56 flagged providers, the majority cluster in Miami-Dade,
                Broward, and Palm Beach counties — the same tri-county area that has produced the largest <Link href="/investigations/medicare-fraud-2025" className="text-medicare-primary hover:underline">fraud
                takedowns</Link> in DOJ history.
              </p>

              <p>
                In 2024, the DOJ&apos;s largest-ever healthcare fraud enforcement action — $14.6 billion in alleged
                fraud, 324 defendants — included dozens of South Florida providers. Our model flagged providers
                in the same neighborhoods, using the same billing patterns, months before the indictments.
              </p>

              <div className="space-y-4 my-8 not-prose">
                {flProviders.map((p) => (
                  <Link
                    key={p.npi}
                    href={`/providers/${p.npi}`}
                    className="block bg-white border border-gray-200 rounded-lg p-5 hover:border-medicare-primary hover:shadow-md transition-all no-underline"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-white bg-orange-600 rounded px-2 py-0.5">FL</span>
                          <span className="text-xs text-gray-500">{p.city} · NPI: {p.npi}</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">{p.name}</h4>
                        <p className="text-sm text-gray-600">{p.specialty}</p>
                        <p className="text-xs text-gray-500 mt-1">{p.note}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="text-2xl font-bold text-red-600">{(p.prob * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">fraud probability</div>
                        <div className="text-sm font-semibold text-gray-700 mt-1">
                          ${(p.pay / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Heat Map Concept */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                Fraud Follows the Sun
              </h2>

              <p>
                Plot the 500 flagged providers on a map and a clear pattern emerges: the densest clusters
                follow the southern coastline from California through Texas to Florida, then up the Eastern
                Seaboard through New Jersey and New York. It&apos;s a &quot;fraud belt&quot; that mirrors the Sun Belt —
                and it&apos;s no coincidence.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🗺️ The Fraud Belt — By Region</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-bold text-gray-900 mb-2">Sun Belt (CA + FL + TX)</p>
                    <p className="text-gray-700">148 flagged providers (29.6%)</p>
                    <p className="text-gray-500">Three states, nearly a third of all flags</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-2">Northeast Corridor (NY + NJ)</p>
                    <p className="text-gray-700">72 flagged providers (14.4%)</p>
                    <p className="text-gray-500">Dense metro areas with high provider counts</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700">
                    <strong>Top 5 states combined:</strong> {top5Total} of 500 ({((top5Total / 500) * 100).toFixed(1)}%) — the rest of America shares {500 - top5Total}.
                  </p>
                </div>
              </div>

              <p>
                The states where Medicare fraud concentrates are the same states where Medicare <em>money</em> concentrates.
                California and Florida are the #1 and #2 states for total Medicare spending. New York is #3. Texas is #4.
                Fraud doesn&apos;t go where oversight is weakest — it goes where the money is deepest.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">📊 By The Numbers</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-900">56</div>
                    <div className="text-xs text-blue-700">CA flags (tied #1)</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">56</div>
                    <div className="text-xs text-blue-700">FL flags (tied #1)</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">{top5Total}</div>
                    <div className="text-xs text-blue-700">top 5 states total</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">{((top5Total / 500) * 100).toFixed(0)}%</div>
                    <div className="text-xs text-blue-700">of all 500 flags</div>
                  </div>
                </div>
              </div>

              {/* Source Citation */}
              <SourceCitation
                sources={[
                  'CMS Medicare Provider Utilization and Payment Data (2014–2023)',
                  'HHS Office of Inspector General — List of Excluded Individuals/Entities (LEIE)',
                  'DOJ Healthcare Fraud Enforcement Actions (2020–2025)',
                  'OpenMedicare ML Model v2.0 (Random Forest, AUC 0.83)',
                  'U.S. Census Bureau — State Population Estimates (65+ demographics)',
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
                    href="/investigations/million-dollar-flagged"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">The Million-Dollar Club</div>
                    <p className="text-xs text-gray-600">
                      47 AI-flagged providers who each billed Medicare over $1 million.
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
