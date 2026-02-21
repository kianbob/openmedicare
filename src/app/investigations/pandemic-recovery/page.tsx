import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: "Medicare's Pandemic Recovery",
  description: 'Medicare spending crashed 10% in 2020, then surged past pre-pandemic levels by 2023. The recovery reshaped healthcare delivery.',
}

const yearlyData = [
  { year: 2018, payments: 86005963374, providers: 1061278, services: 2484244187, markup: 3.82 },
  { year: 2019, payments: 89512295633, providers: 1093367, services: 2592695317, markup: 3.86 },
  { year: 2020, payments: 80539388258, providers: 1085313, services: 2327887276, markup: 3.83 },
  { year: 2021, payments: 91535062398, providers: 1123589, services: 2499901028, markup: 3.74 },
  { year: 2022, payments: 89042856516, providers: 1148873, services: 2519061084, markup: 3.94 },
  { year: 2023, payments: 93721075813, providers: 1175281, services: 2645589817, markup: 3.96 },
]

export default function PandemicRecoveryPage() {
  const prePandemic2019 = 89512295633
  const pandemic2020 = 80539388258
  const recovery2023 = 93721075813
  const dropPct = ((1 - pandemic2020 / prePandemic2019) * 100).toFixed(1)
  const surgeAbovePre = ((recovery2023 / prePandemic2019 - 1) * 100).toFixed(1)
  const peakYear2021 = 91535062398

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: "Medicare's Pandemic Recovery" },
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Analysis
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Medicare&apos;s Pandemic Recovery
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 13 min read</p>

          <div className="bg-teal-50 border-l-4 border-teal-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-teal-900 font-medium text-lg">Key Finding</p>
            <p className="text-teal-800 mt-2">
              Medicare spending dropped <strong>{dropPct}%</strong> in 2020 — from {formatCurrency(prePandemic2019)} to
              {formatCurrency(pandemic2020)}. By 2023, spending surged to {formatCurrency(recovery2023)} —
              <strong> {surgeAbovePre}% above pre-pandemic levels</strong>. The recovery wasn&apos;t
              just a return to normal; it reshaped how and where care is delivered.
            </p>
          </div>

          <p className="text-gray-700 mb-4">
            The COVID-19 pandemic triggered the only meaningful decline in Medicare spending in the
            program&apos;s modern history. Elective procedures were cancelled, office visits shifted to
            telehealth, and millions of beneficiaries avoided healthcare facilities entirely.
            Then came the recovery — swift, uneven, and transformative.
          </p>
          <p className="text-gray-700 mb-4">
            Our analysis of year-by-year Medicare data from 2018 to 2023 reveals not just how
            spending recovered, but how the pandemic permanently changed the Medicare landscape.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Crash and Recovery: Year by Year
          </h2>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Medicare Spending Trajectory (2018–2023)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Change</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Markup</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {yearlyData.map((y, i) => {
                  const prev = i > 0 ? yearlyData[i - 1].payments : null
                  const change = prev ? ((y.payments / prev - 1) * 100).toFixed(1) : '—'
                  return (
                    <tr key={y.year} className={`hover:bg-blue-50 ${y.year === 2020 ? 'bg-red-50' : y.year === 2023 ? 'bg-green-50' : ''}`}>
                      <td className="px-4 py-3 font-bold text-gray-900">{y.year}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(y.payments)}</td>
                      <td className="px-4 py-3 text-right">
                        {change !== '—' ? (
                          <span className={`font-medium ${parseFloat(change) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {parseFloat(change) > 0 ? '+' : ''}{change}%
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatNumber(y.providers)}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatNumber(y.services)}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{y.markup.toFixed(2)}x</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            The pattern is clear: a sharp {dropPct}% decline in 2020, followed by a dramatic 13.7%
            rebound in 2021 to {formatCurrency(peakYear2021)}. Then a surprising 2.7% dip in 2022
            before reaching the all-time high of {formatCurrency(recovery2023)} in 2023.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The 2020 Crater: Where Did Spending Fall?
          </h2>
          <p className="text-gray-700 mb-4">
            The {formatCurrency(prePandemic2019 - pandemic2020)} decline in 2020 wasn&apos;t evenly
            distributed. Services dropped from {formatNumber(2592695317)} to {formatNumber(2327887276)} — a
            loss of over {formatNumber(2592695317 - 2327887276)} services. The hardest-hit areas:
          </p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Elective surgeries</strong> — Cataract removal (66984), knee replacements (27447),
            and hip replacements (27130) saw massive volume declines as hospitals cancelled
            non-emergency procedures.</li>
            <li><strong>Office visits</strong> — In-person E/M visits dropped sharply, partially offset
            by the explosion of telehealth codes (99442, 99443) that didn&apos;t exist in meaningful
            volume pre-pandemic.</li>
            <li><strong>Diagnostic imaging</strong> — CT scans, MRIs, and screening mammograms declined
            as patients avoided healthcare facilities.</li>
            <li><strong>Preventive care</strong> — Annual wellness visits and cancer screenings saw
            significant drops, with potential long-term health consequences.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The 2021 Bounce: Faster Than Expected
          </h2>
          <p className="text-gray-700 mb-4">
            The 2021 recovery was remarkably swift. Medicare spending surged 13.7% — the largest
            single-year increase in the entire 10-year dataset — driven by:
          </p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Catch-up procedures:</strong> Patients who deferred surgeries and screenings
            in 2020 returned in force, creating pent-up demand.</li>
            <li><strong>COVID-19 testing:</strong> New codes like U0003, U0004, U0005, and K1034
            added billions in new spending — {formatCurrency(1959133949 + 519403451 + 458708206 + 2835176259)} combined over 2020–2023.</li>
            <li><strong>Vaccination administration:</strong> COVID vaccine codes (0001A, 0002A, 0011A, 0012A,
            0064A, 0124A, 90480) generated hundreds of millions in additional billing.</li>
            <li><strong>Provider growth:</strong> The number of billing providers actually increased from
            {formatNumber(1085313)} to {formatNumber(1123589)}, as telehealth lowered barriers to
            Medicare participation.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Telehealth Revolution
          </h2>
          <p className="text-gray-700 mb-4">
            Before 2020, telephone and virtual visit codes barely registered in Medicare data.
            The pandemic changed everything. The telephone visit codes 99442 and 99443 generated
            a combined {formatCurrency(520587777 + 492511845)} — over <strong>$1 billion</strong> in
            payments that essentially didn&apos;t exist pre-pandemic.
          </p>

          <div className="bg-teal-50 rounded-lg p-6 not-prose mb-6">
            <h4 className="font-semibold text-teal-900 mb-3">Telehealth by the Numbers</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-3xl font-bold text-teal-700">{formatCurrency(520587777)}</p>
                <p className="text-sm text-teal-600">99442: Phone visits (11-20 min)</p>
                <p className="text-xs text-gray-500">{formatNumber(9589644)} services</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-3xl font-bold text-teal-700">{formatCurrency(492511845)}</p>
                <p className="text-sm text-teal-600">99443: Phone visits (21-30 min)</p>
                <p className="text-xs text-gray-500">{formatNumber(6194605)} services</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-3xl font-bold text-teal-700">{formatCurrency(1013099622)}</p>
                <p className="text-sm text-teal-600">Combined telehealth spending</p>
                <p className="text-xs text-gray-500">From ~$0 pre-2020</p>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            The {formatNumber(15784249)} telephone visits represent a permanent shift in care
            delivery. While volumes have moderated from their 2020–2021 peak, telehealth has
            become a lasting part of the Medicare landscape, particularly for behavioral health,
            chronic disease management, and rural access.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            2023: The New Normal Exceeds the Old
          </h2>
          <p className="text-gray-700 mb-4">
            By 2023, Medicare spending reached {formatCurrency(recovery2023)} — {surgeAbovePre}%
            above the 2019 pre-pandemic level. But the composition of that spending shifted
            significantly:
          </p>
          <ul className="text-gray-700 mb-4">
            <li><strong>More providers:</strong> {formatNumber(1175281)} vs. {formatNumber(1093367)} in
            2019, a {((1175281/1093367 - 1) * 100).toFixed(1)}% increase.</li>
            <li><strong>More services:</strong> {formatNumber(2645589817)} vs. {formatNumber(2592695317)} in
            2019, a 2% increase.</li>
            <li><strong>Higher per-service payments:</strong> Average payment rose from about $34.52
            per service to $35.43, reflecting both fee schedule updates and coding shifts.</li>
            <li><strong>Higher markups:</strong> The markup ratio climbed from 3.86x to 3.96x,
            suggesting providers continued raising submitted charges faster than Medicare raised payments.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Markup Trend: A Warning Sign
          </h2>
          <p className="text-gray-700 mb-4">
            One subtle but important trend: the markup ratio has steadily climbed from 3.47x in
            2014 to 3.96x in 2023. Providers are raising their submitted charges faster than
            Medicare is raising its payments. This 14% increase in the markup ratio over a decade
            means the gap between what providers charge and what they receive continues to widen.
          </p>
          <p className="text-gray-700 mb-4">
            Interestingly, 2021 was a brief exception — the markup ratio actually declined to 3.74x,
            possibly reflecting the surge of COVID testing and vaccination codes that had lower
            markup characteristics. But by 2023, the upward trend resumed.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why This Matters</h2>
          <p className="text-gray-700 mb-4">
            The pandemic recovery story has critical implications for Medicare&apos;s future:
          </p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Deferred care has consequences:</strong> Patients who skipped cancer screenings
            and chronic disease management in 2020 may present with more advanced conditions in
            subsequent years, driving costs higher.</li>
            <li><strong>Telehealth is here to stay:</strong> The $1+ billion in telephone visit
            payments represents a permanent expansion of how Medicare delivers care.</li>
            <li><strong>Spending trajectory is steepening:</strong> The {surgeAbovePre}% increase above
            pre-pandemic levels outpaces both inflation and beneficiary growth, raising
            sustainability concerns.</li>
            <li><strong>COVID costs are embedded:</strong> Testing and vaccination codes added
            billions in new spending categories that partially offset savings from reduced
            utilization elsewhere.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Related Investigations</h2>
          <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link href="/investigations/covid-impact" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">COVID-19&apos;s Impact on Medicare</h4>
              <p className="text-sm text-gray-500 mt-1">The initial shock of the pandemic on Medicare spending</p>
            </Link>
            <Link href="/investigations/office-visit-economy" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The $117 Billion Office Visit Economy</h4>
              <p className="text-sm text-gray-500 mt-1">How office visits drive Medicare spending</p>
            </Link>
            <Link href="/investigations/where-medicare-dollar-goes" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Where Your Medicare Dollar Goes</h4>
              <p className="text-sm text-gray-500 mt-1">Breaking down $854.8B across categories</p>
            </Link>
            <Link href="/investigations/specialty-gap" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Specialty Gap</h4>
              <p className="text-sm text-gray-500 mt-1">How specialties fared differently through the pandemic</p>
            </Link>
          </div>
        </article>

        <ShareButtons
          url="https://www.openmedicare.org/investigations/pandemic-recovery"
          title="Medicare's Pandemic Recovery"
        />
        <SourceCitation />
      </div>
    </main>
  )
}
