import ArticleJsonLd from "@/components/ArticleJsonLd"
import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'

export const metadata: Metadata = {
  title: 'The 10-Year Money Trail: $78B to $94B | OpenMedicare',
  description: 'A decade of Medicare spending: from $78 billion in 2014 to $94 billion in 2023. 938K to 1.17M providers. The COVID dip. The recovery. The trend.',
  openGraph: {
    title: 'The 10-Year Money Trail: $78B to $94B',
    description: 'Tracing a decade of Medicare Part B spending through 2.65 billion annual services and 1.17 million providers.',
    type: 'article',
  },
}

const YEARLY_DATA = [
  { year: 2014, payments: 78.2, providers: 938, services: 2.27, beneficiaries: 848, markup: 3.47, avgPerProvider: 83384 },
  { year: 2015, payments: 80.6, providers: 968, services: 2.36, beneficiaries: 862, markup: 3.55, avgPerProvider: 83254 },
  { year: 2016, payments: 82.1, providers: 1001, services: 2.38, beneficiaries: 864, markup: 3.70, avgPerProvider: 82021 },
  { year: 2017, payments: 83.5, providers: 1033, services: 2.41, beneficiaries: 864, markup: 3.78, avgPerProvider: 80884 },
  { year: 2018, payments: 86.0, providers: 1061, services: 2.48, beneficiaries: 864, markup: 3.85, avgPerProvider: 81037 },
  { year: 2019, payments: 89.5, providers: 1093, services: 2.59, beneficiaries: 858, markup: 3.89, avgPerProvider: 81884 },
  { year: 2020, payments: 80.5, providers: 1085, services: 2.33, beneficiaries: 799, markup: 3.77, avgPerProvider: 74199 },
  { year: 2021, payments: 91.5, providers: 1124, services: 2.50, beneficiaries: 850, markup: 3.59, avgPerProvider: 81424 },
  { year: 2022, payments: 89.0, providers: 1149, services: 2.52, beneficiaries: 844, markup: 3.52, avgPerProvider: 77455 },
  { year: 2023, payments: 93.7, providers: 1175, services: 2.65, beneficiaries: 853, markup: 3.45, avgPerProvider: 79720 },
]

export default function The10YearMoneyTrailPage() {
  const totalDecadePayments = YEARLY_DATA.reduce((sum, y) => sum + y.payments, 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="The 10-Year Money Trail: $78B to $94B"
        description="A decade of Medicare Part B spending from 2014 to 2023"
        url="/investigations/the-10-year-money-trail"
        publishedDate="2026-02-21"
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'The 10-Year Money Trail' },
        ]} className="mb-8" />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-4">
                Data Analysis
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4">
                The 10-Year Money Trail
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                $78 Billion to $94 Billion
              </p>
              <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDaysIcon className="h-4 w-4" />
                  February 21, 2026
                </span>
                <span className="flex items-center gap-1.5">
                  <ClockIcon className="h-4 w-4" />
                  10 min read
                </span>
              </div>
              <div className="mt-4">
                <ShareButtons title="The 10-Year Money Trail" url="https://openmedicare.vercel.app/investigations/the-10-year-money-trail" />
              </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-emerald-700">$78B</div>
                <div className="text-xs text-gray-600 mt-1">2014 Spending</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-emerald-700">$94B</div>
                <div className="text-xs text-gray-600 mt-1">2023 Spending</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-700">938K</div>
                <div className="text-xs text-gray-600 mt-1">2014 Providers</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-700">1.17M</div>
                <div className="text-xs text-gray-600 mt-1">2023 Providers</div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl leading-relaxed">
                Every year, Medicare Part B publishes data on what it paid, to whom, and for what. We compiled
                a decade of this data — from 2014 to 2023 — and traced <strong>${totalDecadePayments.toFixed(0)} billion</strong> flowing
                through the system. The story it tells is one of steady growth, a pandemic shock, and a system
                that keeps expanding regardless of what happens in the world.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Year by Year: The Full Picture</h2>
            </div>

            {/* Year-by-Year Table */}
            <div className="overflow-x-auto my-8">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Year</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700">Payments</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700">Providers</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700">Services</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700">Markup</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700">$/Provider</th>
                  </tr>
                </thead>
                <tbody>
                  {YEARLY_DATA.map((y, i) => (
                    <tr key={y.year} className={`${y.year === 2020 ? 'bg-red-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        {y.year}
                        {y.year === 2020 && <span className="ml-1 text-red-600 text-xs">COVID</span>}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">${y.payments.toFixed(1)}B</td>
                      <td className="py-3 px-3 text-right font-mono">{y.providers.toLocaleString()}K</td>
                      <td className="py-3 px-3 text-right font-mono">{y.services.toFixed(2)}B</td>
                      <td className="py-3 px-3 text-right font-mono">{y.markup.toFixed(2)}x</td>
                      <td className="py-3 px-3 text-right font-mono">${y.avgPerProvider.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Steady Climb: 2014–2019</h2>

              <p>
                Before COVID, the trend was relentlessly upward but not alarming. Payments grew from
                <strong> $78.2 billion to $89.5 billion</strong> — a 14.4% increase over six years, roughly
                tracking inflation plus the aging of the Baby Boom generation.
              </p>

              <p>
                The provider count tells a more interesting story. From <strong>938,141 to 1,093,367</strong> —
                a 16.5% increase — outpacing payment growth. More providers entering the system meant the
                average payment per provider actually <em>declined</em> from $83,384 to $81,884. The pie was
                growing, but it was being split more ways.
              </p>

              <p>
                Services grew faster than payments: from <strong>2.27 billion to 2.59 billion</strong>, a
                14.1% increase. Medicare was doing more, paying roughly the same per service, and distributing
                the work across more providers. A picture of controlled expansion.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The COVID Crater: 2020</h2>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8 rounded-r-lg">
                <h3 className="text-lg font-semibold text-red-900 mb-2">📉 2020: The Year Everything Stopped</h3>
                <p className="text-red-900">
                  Medicare payments plunged to <strong>$80.5 billion</strong> — a 10% drop from 2019 and back to 2015 levels.
                  Services fell to <strong>2.33 billion</strong>, wiping out five years of growth in a single year.
                  Beneficiary encounters dropped to 799 million, as millions of seniors delayed or skipped care entirely.
                </p>
              </div>

              <p>
                The 2020 data is the clearest picture we have of what happens when the healthcare system
                contracts. Elective procedures vanished. Routine check-ups were postponed. Specialists saw
                their patient volumes crater. The average payment per provider fell to <strong>$74,199</strong> —
                the lowest in our entire dataset.
              </p>

              <p>
                But providers didn&apos;t leave the system. The count only dipped from 1,093,367 to 1,085,313 —
                less than 1%. The workforce stayed; the work disappeared.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Recovery: 2021–2023</h2>

              <p>
                The snapback was dramatic. <strong>2021 hit $91.5 billion</strong> — an all-time high that
                blew past the pre-pandemic peak by $2 billion. Patients flooded back. Deferred procedures
                got scheduled. COVID testing and treatment added entirely new billing categories.
              </p>

              <p>
                Then something strange happened. <strong>2022 dipped to $89.0 billion</strong>. Not a crash,
                but a pullback — possibly as COVID-specific billing wound down and the pent-up demand from
                2020 was finally absorbed.
              </p>

              <p>
                By <strong>2023, the system hit $93.7 billion</strong> — the definitive new high. Services
                reached <strong>2.65 billion</strong>, the most ever. The provider count reached
                <strong> 1,175,281</strong>. Medicare Part B wasn&apos;t just back — it was bigger than ever.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Markup Story</h2>

              <p>
                One of the most revealing trends is the <strong>markup ratio</strong> — the gap between what
                providers charge and what Medicare actually pays. In 2014, providers billed <strong>3.47x</strong> what
                Medicare paid. By 2019, that ratio hit <strong>3.89x</strong>.
              </p>

              <p>
                Then it started falling: 3.77x in 2020, 3.59x in 2021, 3.52x in 2022, and <strong>3.45x
                in 2023</strong> — actually lower than the 2014 level. This could mean Medicare is paying
                closer to charged amounts, or that providers are adjusting their charge strategies, or that
                the mix of services is shifting toward lower-markup procedures.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What $854 Billion Buys</h2>

              <p>
                Over ten years, Medicare Part B paid out <strong>${totalDecadePayments.toFixed(0)} billion</strong> for
                <strong> 24.5 billion services</strong> delivered by over a million providers to hundreds
                of millions of beneficiary encounters. It&apos;s the largest single healthcare dataset in the
                world, and it tells us:
              </p>

              <ul>
                <li><strong>The system always grows.</strong> Even a global pandemic only created a one-year dip.</li>
                <li><strong>More providers, less per provider.</strong> The average provider earned less in 2023 than in 2014.</li>
                <li><strong>Services grow faster than payments.</strong> Medicare is extracting more work for each dollar.</li>
                <li><strong>Markup is declining.</strong> The gap between billed and paid amounts is narrowing.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Explore the Data</h2>

              <ul>
                <li>
                  <Link href="/trends" className="text-indigo-600 hover:text-indigo-800">
                    Interactive Trends Dashboard
                  </Link> — Explore all metrics year by year
                </li>
                <li>
                  <Link href="/drug-spending" className="text-indigo-600 hover:text-indigo-800">
                    Drug Spending Analysis
                  </Link> — Where the fastest-growing dollars are going
                </li>
              </ul>
            </div>

            <SourceCitation
              sources={[
                'CMS Medicare Provider Utilization and Payment Data (2014-2023)',
                'OpenMedicare trends.json — compiled from 10 years of annual releases',
              ]}
            />
          </div>
        </article>
      </div>
    </main>
  )
}
