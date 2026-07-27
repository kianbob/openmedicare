'use client'

import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatNumber } from '@/lib/format'

const ENROLLMENT_HISTORY = [
  { year: 1966, total: 19.1 },
  { year: 1970, total: 20.5 },
  { year: 1975, total: 25.0 },
  { year: 1980, total: 28.5 },
  { year: 1985, total: 31.1 },
  { year: 1990, total: 34.2 },
  { year: 1995, total: 37.6 },
  { year: 2000, total: 39.6 },
  { year: 2005, total: 42.5 },
  { year: 2010, total: 47.5 },
  { year: 2015, total: 55.5 },
  { year: 2020, total: 62.6 },
  { year: 2022, total: 65.0 },
  { year: 2023, total: 66.7 },
  { year: 2024, total: 67.4 },
]

const STATE_ENROLLMENT = [
  { state: 'California', enrolled: 6_700_000, pctMa: 46 },
  { state: 'Florida', enrolled: 5_100_000, pctMa: 55 },
  { state: 'Texas', enrolled: 4_400_000, pctMa: 47 },
  { state: 'New York', enrolled: 3_800_000, pctMa: 48 },
  { state: 'Pennsylvania', enrolled: 2_900_000, pctMa: 50 },
  { state: 'Ohio', enrolled: 2_400_000, pctMa: 48 },
  { state: 'Illinois', enrolled: 2_200_000, pctMa: 43 },
  { state: 'Michigan', enrolled: 2_100_000, pctMa: 44 },
  { state: 'North Carolina', enrolled: 2_000_000, pctMa: 44 },
  { state: 'Georgia', enrolled: 1_800_000, pctMa: 48 },
]

const DEMOGRAPHICS = [
  { label: 'Aged 65+', pct: 85, count: '57.3M' },
  { label: 'Under 65 (Disability)', pct: 13, count: '8.8M' },
  { label: 'End-Stage Renal Disease', pct: 2, count: '1.3M' },
]

const FAQ_ITEMS = [
  {
    q: 'How many people are on Medicare in 2024?',
    a: 'As of 2024, approximately 67.4 million Americans are enrolled in Medicare, including those with Original Medicare and Medicare Advantage plans.',
  },
  {
    q: 'What is the fastest-growing Medicare population?',
    a: 'Medicare Advantage enrollment is the fastest-growing segment, now covering over 51% of all Medicare beneficiaries — up from just 13% in 2004.',
  },
  {
    q: 'At what age do you qualify for Medicare?',
    a: 'Most people qualify at age 65. However, people under 65 can qualify if they have certain disabilities (after a 24-month waiting period) or end-stage renal disease.',
  },
  {
    q: 'How is Medicare funded?',
    a: 'Medicare is primarily funded through payroll taxes (2.9% split between employee and employer), premiums paid by beneficiaries, and general federal revenue.',
  },
  {
    q: 'Which state has the most Medicare beneficiaries?',
    a: 'California has the most Medicare beneficiaries with approximately 6.7 million enrollees, followed by Florida (5.1M) and Texas (4.4M).',
  },
]

export default function EnrollmentStatisticsPage() {
  const maxTotal = Math.max(...ENROLLMENT_HISTORY.map(d => d.total))

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <Breadcrumbs items={[{ name: 'Enrollment Statistics' }]} />

        <div className="mt-8">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Medicare Enrollment Statistics
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl">
            From 19.1 million in 1966 to 67.4 million in 2024 — Medicare now covers 1 in 5 Americans.
            Explore enrollment growth, demographics, and state-by-state data.
          </p>
        </div>

        {/* Key Stats */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-6 text-center">
            <p className="text-3xl font-bold text-blue-700">67.4M</p>
            <p className="mt-1 text-sm text-gray-500">Total Enrollees (2024)</p>
          </div>
          <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center">
            <p className="text-3xl font-bold text-green-700">51%+</p>
            <p className="mt-1 text-sm text-gray-500">In Medicare Advantage</p>
          </div>
          <div className="rounded-xl bg-purple-50 border border-purple-200 p-6 text-center">
            <p className="text-3xl font-bold text-purple-700">253%</p>
            <p className="mt-1 text-sm text-gray-500">Growth Since 1966</p>
          </div>
          <div className="rounded-xl bg-orange-50 border border-orange-200 p-6 text-center">
            <p className="text-3xl font-bold text-orange-700">10,000</p>
            <p className="mt-1 text-sm text-gray-500">Turning 65 Daily</p>
          </div>
        </div>

        {/* Enrollment Growth Chart */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Enrollment Growth: 1966–2024</h2>
          <p className="mt-2 text-gray-600">
            Medicare enrollment has more than tripled since the program began, driven by population growth,
            the aging Baby Boomer generation, and expanded eligibility for disabled Americans.
          </p>

          <div className="mt-8 space-y-3">
            {ENROLLMENT_HISTORY.map((d) => (
              <div key={d.year} className="flex items-center gap-4">
                <span className="w-12 text-sm font-medium text-gray-500 text-right">{d.year}</span>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-lg flex items-center justify-end pr-3 transition-all"
                    style={{ width: `${(d.total / maxTotal) * 100}%` }}
                  >
                    <span className="text-xs font-bold text-white">{d.total}M</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Who Qualifies */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Who Is on Medicare?</h2>
          <p className="mt-2 text-gray-600">
            While most enrollees are 65 and older, about 15% of Medicare beneficiaries qualify
            through disability or end-stage renal disease.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {DEMOGRAPHICS.map((d) => (
              <div key={d.label} className="rounded-xl bg-gray-50 p-6">
                <p className="text-4xl font-bold text-gray-900">{d.pct}%</p>
                <p className="mt-2 text-sm font-medium text-gray-700">{d.label}</p>
                <p className="text-sm text-gray-500">{d.count} beneficiaries</p>
              </div>
            ))}
          </div>
        </div>

        {/* State Enrollment */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Top 10 States by Medicare Enrollment</h2>
          <p className="mt-2 text-gray-600">
            The states with the largest populations naturally have the most enrollees,
            but Medicare Advantage adoption varies significantly by region.
          </p>

          <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Enrollees</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">% in MA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {STATE_ENROLLMENT.map((s, i) => (
                  <tr key={s.state} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.state}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right">{formatNumber(s.enrolled)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right">{s.pctMa}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Baby Boomer Impact */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
          <h2 className="text-2xl font-bold">The Baby Boomer Wave</h2>
          <p className="mt-3 opacity-90">
            Between 2024 and 2030, roughly 10,000 Americans turn 65 every day. By 2030, all Baby Boomers
            will be 65+, pushing total Medicare enrollment past 80 million. This demographic shift is the
            biggest driver of Medicare spending growth and one of the most significant fiscal challenges
            facing the federal government.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">2030</p>
              <p className="text-sm opacity-80">All Boomers 65+</p>
            </div>
            <div>
              <p className="text-3xl font-bold">80M+</p>
              <p className="text-sm opacity-80">Projected Enrollees</p>
            </div>
            <div>
              <p className="text-3xl font-bold">$1.8T</p>
              <p className="text-sm opacity-80">Projected Annual Cost</p>
            </div>
          </div>
        </div>

        {/* Medicare Advantage Growth */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">The Rise of Medicare Advantage</h2>
          <p className="mt-2 text-gray-600">
            Medicare Advantage (Part C) — private plans that replace Original Medicare — has surged from
            covering 13% of beneficiaries in 2004 to over 51% in 2024. This shift has fundamentally changed
            how Medicare works for most enrollees.
          </p>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-3">Medicare Advantage Market Share Over Time</p>
            <div className="space-y-2">
              {[
                { year: 2004, pct: 13 },
                { year: 2008, pct: 22 },
                { year: 2012, pct: 27 },
                { year: 2016, pct: 33 },
                { year: 2020, pct: 42 },
                { year: 2022, pct: 48 },
                { year: 2024, pct: 51 },
              ].map((d) => (
                <div key={d.year} className="flex items-center gap-3">
                  <span className="w-10 text-xs text-gray-500 text-right">{d.year}</span>
                  <div className="flex-1 h-6 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded flex items-center justify-end pr-2"
                      style={{ width: `${d.pct}%` }}
                    >
                      <span className="text-xs font-bold text-white">{d.pct}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            <Link href="/medicare-advantage-vs-original" className="text-blue-600 hover:text-blue-800 font-medium">
              Compare Medicare Advantage vs Original Medicare →
            </Link>
          </p>
        </div>

        {/* FAQ Section with Schema */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            {FAQ_ITEMS.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex cursor-pointer items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-gray-900">{faq.q}</span>
                  <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQ_ITEMS.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: { '@type': 'Answer', text: faq.a },
              })),
            }),
          }}
        />

        <div className="mt-12">
          <ShareButtons
            url="https://www.openmedicare.us/enrollment-statistics"
            title="Medicare Enrollment Statistics: 67M+ Beneficiaries"
            description="From 19.1M in 1966 to 67.4M in 2024 — Medicare now covers 1 in 5 Americans. Explore the data."
          />
        </div>

        <div className="mt-8"><SourceCitation /></div>
      </div>
    </div>
  )
}
