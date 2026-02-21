import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'The State Spending Divide',
  description: 'California receives $93.2 billion from Medicare while Wyoming gets $1.1 billion. Explore the massive geographic disparities in Medicare spending.',
}

const topStates = [
  { state: 'California', abbr: 'CA', payments: 93195368563, providers: 838654, services: 2377946223, paymentPerProvider: 111125, markup: 3.68, share: 10.9 },
  { state: 'Florida', abbr: 'FL', payments: 80396885536, providers: 666562, services: 2564971227, paymentPerProvider: 120614, markup: 3.57, share: 9.4 },
  { state: 'Texas', abbr: 'TX', payments: 62945994956, providers: 682975, services: 1889700097, paymentPerProvider: 92164, markup: 4.26, share: 7.4 },
  { state: 'New York', abbr: 'NY', payments: 58202088429, providers: 740900, services: 1480111638, paymentPerProvider: 78556, markup: 3.82, share: 6.8 },
  { state: 'New Jersey', abbr: 'NJ', payments: 36586660521, providers: 328163, services: 1067141039, paymentPerProvider: 111489, markup: 3.91, share: 4.3 },
  { state: 'Illinois', abbr: 'IL', payments: 35370702909, providers: 436287, services: 1043604424, paymentPerProvider: 81072, markup: 3.96, share: 4.1 },
  { state: 'Pennsylvania', abbr: 'PA', payments: 34489393695, providers: 535321, services: 982509767, paymentPerProvider: 64427, markup: 3.48, share: 4.0 },
  { state: 'North Carolina', abbr: 'NC', payments: 27888211885, providers: 357596, services: 895134944, paymentPerProvider: 77988, markup: 3.77, share: 3.3 },
  { state: 'Ohio', abbr: 'OH', payments: 24794257490, providers: 430278, services: 692542111, paymentPerProvider: 57624, markup: 3.69, share: 2.9 },
  { state: 'Georgia', abbr: 'GA', payments: 23880854381, providers: 293028, services: 733241802, paymentPerProvider: 81497, markup: 4.12, share: 2.8 },
]

const bottomStates = [
  { state: 'Wyoming', abbr: 'WY', payments: 1133885037, providers: 19794, markup: 4.39, share: 0.13 },
  { state: 'Vermont', abbr: 'VT', payments: 1173084101, providers: 28006, markup: 3.35, share: 0.14 },
  { state: 'Alaska', abbr: 'AK', payments: 1445044406, providers: 25432, markup: 5.46, share: 0.17 },
  { state: 'North Dakota', abbr: 'ND', payments: 1667841675, providers: 35119, markup: 3.74, share: 0.20 },
  { state: 'Hawaii', abbr: 'HI', payments: 1970528990, providers: 35676, markup: 3.43, share: 0.23 },
]

const topMarkupStates = [
  { state: 'Wisconsin', abbr: 'WI', markup: 9.47, payments: 10965873157 },
  { state: 'Alaska', abbr: 'AK', markup: 8.34, payments: 1445044406 },
  { state: 'Nevada', abbr: 'NV', markup: 7.25, payments: 8024604790 },
  { state: 'Texas', abbr: 'TX', markup: 7.08, payments: 62945994956 },
  { state: 'Georgia', abbr: 'GA', markup: 6.90, payments: 23880854381 },
  { state: 'New Hampshire', abbr: 'NH', markup: 6.57, payments: 3231381625 },
  { state: 'Mississippi', abbr: 'MS', markup: 6.55, payments: 8623133279 },
  { state: 'California', abbr: 'CA', markup: 6.55, payments: 93195368563 },
  { state: 'New Jersey', abbr: 'NJ', markup: 6.46, payments: 36586660521 },
  { state: 'Arizona', abbr: 'AZ', markup: 6.40, payments: 21757533553 },
]

export default function StateSpendingDividePage() {
  const totalPayments = 854842324155
  const caPayments = 93195368563
  const wyPayments = 1133885037
  const ratio = Math.round(caPayments / wyPayments)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'The State Spending Divide' },
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Analysis
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            The State Spending Divide
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 13 min read</p>

          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-emerald-900 font-medium text-lg">Key Finding</p>
            <p className="text-emerald-800 mt-2">
              California received <strong>{formatCurrency(caPayments)}</strong> from Medicare
              over 10 years — <strong>{ratio}x more</strong> than Wyoming&apos;s {formatCurrency(wyPayments)}.
              The top 5 states account for 39% of all Medicare spending, while markup ratios
              vary from 2.1x (Puerto Rico) to 9.5x (Wisconsin).
            </p>
          </div>

          <p className="text-gray-700 mb-4">
            Medicare is a federal program, but it doesn&apos;t spend evenly. The geography of
            Medicare spending reflects population, provider density, practice patterns, and
            pricing — creating massive disparities between states that receive tens of
            billions and those that get barely a billion.
          </p>
          <p className="text-gray-700 mb-6">
            Our analysis of {formatCurrency(totalPayments)} in Medicare payments across 10
            years reveals a system where a handful of large states dominate spending, while
            markup practices vary wildly by region.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Top 10: Where the Money Goes
          </h2>
          <p className="text-gray-700 mb-4">
            The ten largest states by Medicare payments account for {((topStates.reduce((s, st) => s + st.share, 0))).toFixed(1)}% of
            all spending. California alone captures nearly 11 cents of every Medicare dollar,
            driven by its massive population and {formatNumber(838654)} billing providers — the
            most of any state.
          </p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Top 10 States by Medicare Payments</h3>
            <p className="text-sm text-gray-500">Cumulative 2014–2023</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Per Provider</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Markup</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topStates.map((s, i) => (
                  <tr key={s.abbr} className="hover:bg-blue-50">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <Link href={`/states/${s.abbr}`} className="text-blue-600 hover:text-blue-800">
                        {s.state}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(s.payments)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(s.paymentPerProvider)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{s.markup.toFixed(1)}x</td>
                    <td className="px-4 py-3 text-right text-gray-600">{s.share}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Bottom 5: Small States, Small Budgets
          </h2>
          <p className="text-gray-700 mb-4">
            At the other end of the spectrum, Wyoming received just {formatCurrency(wyPayments)} over
            the same 10-year period — enough to fund about 12 days of California&apos;s Medicare
            spending. Vermont ({formatCurrency(1173084101)}), Alaska ({formatCurrency(1445044406)}),
            North Dakota ({formatCurrency(1667841675)}), and Hawaii ({formatCurrency(1970528990)})
            round out the bottom five.
          </p>
          <p className="text-gray-700 mb-4">
            These states have smaller elderly populations, fewer providers, and lower overall
            healthcare utilization — but they also illustrate how Medicare&apos;s fixed fee schedule
            interacts with local market conditions to produce very different per-provider averages.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Per-Provider Spending: Florida Leads
          </h2>
          <p className="text-gray-700 mb-4">
            When we normalize by the number of billing providers, a different picture emerges.
            <strong> Florida</strong> leads among large states at {formatCurrency(120614)} per
            provider — reflecting its dense elderly population and high-volume practices. New
            Jersey ({formatCurrency(111489)}) and California ({formatCurrency(111125)}) follow closely.
          </p>
          <p className="text-gray-700 mb-4">
            In contrast, Ohio providers average just {formatCurrency(57624)} each, and Pennsylvania
            comes in at {formatCurrency(64427)} — suggesting either lower utilization, more providers
            splitting the pie, or different specialty mixes.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Markup Map: Which States Overcharge the Most?
          </h2>
          <p className="text-gray-700 mb-4">
            Markup ratios — the gap between what providers charge and what Medicare pays — vary
            dramatically by state. <strong>Wisconsin</strong> leads the nation at 9.47x, meaning
            providers there submit charges nearly 10 times what Medicare actually reimburses.
          </p>
          <p className="text-gray-700 mb-4">
            At the other extreme, <strong>Puerto Rico</strong> has a markup of just 2.11x, reflecting
            both lower charge levels and the territory&apos;s unique healthcare market dynamics.
          </p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Top 10 States by Markup Ratio</h3>
            <p className="text-sm text-gray-500">Average submitted charges ÷ Medicare payments</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Markup Ratio</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topMarkupStates.map((s, i) => (
                  <tr key={s.abbr} className={`hover:bg-blue-50 ${i === 0 ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.state}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold ${s.markup >= 7 ? 'text-red-600' : 'text-orange-600'}`}>
                        {s.markup.toFixed(2)}x
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(s.payments)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Regional Patterns
          </h2>
          <p className="text-gray-700 mb-4">
            Clear regional patterns emerge in both spending and markups:
          </p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Sun Belt dominance:</strong> Florida, Texas, Arizona, and Georgia all rank in
            the top 10 for total spending and tend to have above-average markups. Large retiree
            populations drive volume.</li>
            <li><strong>Midwest markup mystery:</strong> Wisconsin&apos;s 9.47x markup is an extreme
            outlier — nearly double neighboring Minnesota (4.07x) and Iowa (3.57x). This may
            reflect specific provider billing practices or specialty mix.</li>
            <li><strong>Northeast moderation:</strong> Pennsylvania (3.48x) and Maryland (3.32x) have
            relatively modest markups, possibly reflecting more regulated markets and academic
            medical center influence.</li>
            <li><strong>Territory gap:</strong> Puerto Rico (2.11x) and Guam (2.74x) have the lowest
            markups, consistent with lower charge-setting in territories.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Urban-Rural Dimension
          </h2>
          <p className="text-gray-700 mb-4">
            State-level data also reflects the urban-rural divide. Urban providers account for
            <strong> 90.9% </strong> of all Medicare payments ({formatCurrency(776860136431)}), while
            rural providers receive just 8.9% ({formatCurrency(76492183476)}). Within states, this
            concentration is even more extreme — a state&apos;s total may be driven primarily by one
            or two major metro areas.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why This Matters</h2>
          <p className="text-gray-700 mb-4">
            The state spending divide has direct policy implications. Medicare&apos;s Geographic
            Practice Cost Indices (GPCIs) are supposed to adjust payments for local cost
            differences, but the 82x gap between California and Wyoming spending suggests that
            geographic adjustment alone doesn&apos;t explain the disparities.
          </p>
          <p className="text-gray-700 mb-4">
            For beneficiaries, where you live increasingly determines the quality and availability
            of Medicare-funded care. States with more providers and higher spending may offer more
            choices, while smaller states face provider shortages and access challenges. Understanding
            these disparities is the first step toward addressing them.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Related Investigations</h2>
          <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link href="/investigations/rural-price-tag" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Rural Price Tag</h4>
              <p className="text-sm text-gray-500 mt-1">How rural Medicare spending compares to urban areas</p>
            </Link>
            <Link href="/investigations/markup-machine" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Markup Machine</h4>
              <p className="text-sm text-gray-500 mt-1">The system-wide gap between charges and payments</p>
            </Link>
            <Link href="/investigations/where-medicare-dollar-goes" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Where Your Medicare Dollar Goes</h4>
              <p className="text-sm text-gray-500 mt-1">Breaking down the $854.8B across categories</p>
            </Link>
            <Link href="/investigations/anesthesia-markup" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Anesthesia Markup Scandal</h4>
              <p className="text-sm text-gray-500 mt-1">The specialty with the highest markup ratio</p>
            </Link>
          </div>
        </article>

        <ShareButtons
          url="https://www.openmedicare.org/investigations/state-spending-divide"
          title="The State Spending Divide"
        />
        <SourceCitation />
      </div>
    </main>
  )
}
