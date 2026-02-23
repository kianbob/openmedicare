import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { TrendChart } from '@/components/Charts'
import { formatCurrency } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'COVID Exposed a $30B Medicare Shock',
  description: 'Medicare payments plunged 10% in 2020 — the first decline in program history. See the year-by-year data on what collapsed, what surged, and what never recovered.',
}

function loadTrends() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'trends.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { yearly_trends: [] } }
}

export default function CovidImpactPage() {
  const data = loadTrends()
  const trends = data.yearly_trends || []
  const y2019 = trends.find((y: any) => y.year === 2019)
  const y2020 = trends.find((y: any) => y.year === 2020)
  const y2021 = trends.find((y: any) => y.year === 2021)
  const drop = y2019 && y2020 ? y2019.total_payments - y2020.total_payments : 0
  const dropPct = y2019 && y2020 ? ((y2020.total_payments / y2019.total_payments - 1) * 100).toFixed(1) : '0'

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: "COVID's Impact on Medicare", href: '/investigations/covid-impact' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Analysis</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">COVID&apos;s Impact on Medicare Spending</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 10 min read</p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-red-900 font-medium text-lg">The COVID Shock</p>
            <p className="text-red-800 mt-2">Medicare payments dropped <strong>{dropPct}%</strong> in 2020 — a <strong>{formatCurrency(Math.abs(drop))}</strong> decline as elective procedures were postponed and patients avoided healthcare facilities.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Unprecedented Dip</h2>
          <p className="text-gray-700 mb-4">For the first time in the history of Medicare, total provider payments declined in 2020. This wasn&apos;t because healthcare got cheaper — it was because millions of Americans simply stopped going to the doctor. Elective surgeries were postponed. Routine screenings were skipped. Outpatient visits plummeted.</p>
          <p className="text-gray-700 mb-4">The data tells a stark story: from {formatCurrency(y2019?.total_payments || 0)} in 2019 to {formatCurrency(y2020?.total_payments || 0)} in 2020. Then a sharp recovery to {formatCurrency(y2021?.total_payments || 0)} in 2021 as the healthcare system bounced back — and then some.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Winners and Losers</h2>
          <p className="text-gray-700 mb-4">Not all specialties were affected equally. Surgical specialties saw the steepest declines — orthopedic surgeons, ophthalmologists, and cardiologists who depend on elective procedures took the biggest hit. Meanwhile, telehealth-compatible specialties like psychiatry and primary care adapted faster.</p>
          <p className="text-gray-700 mb-4">COVID testing itself became a massive new spending category. Codes like U0003, U0004, and U0005 (COVID-19 testing) appeared out of nowhere in 2020 and generated billions in Medicare payments by 2021-2022.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Bounce-Back</h2>
          <p className="text-gray-700 mb-4">By 2021, Medicare spending not only recovered but exceeded pre-pandemic levels. This &quot;revenge healthcare&quot; phenomenon — patients catching up on deferred procedures — drove a surge that continued through 2023. The question now is whether spending has permanently shifted to a higher trajectory.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Spending Trends 2014-2023</h2>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6 mb-8">
          <TrendChart xDataKey="year" yDataKey="value" data={trends.map((y: any) => ({ year: y.year, value: y.total_payments }))} title="Total Medicare Payments by Year" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">Year-by-Year Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">YoY Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trends.map((y: any, i: number) => {
                  const prev = i > 0 ? trends[i - 1] : null
                  const change = prev ? ((y.total_payments / prev.total_payments - 1) * 100) : 0
                  return (
                    <tr key={y.year} className={`hover:bg-blue-50 ${y.year === 2020 ? 'bg-red-50' : ''}`}>
                      <td className="px-4 py-2 font-medium">{y.year}</td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(y.total_payments)}</td>
                      <td className={`px-4 py-2 text-right font-medium ${change < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {i > 0 ? `${change > 0 ? '+' : ''}${change.toFixed(1)}%` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/covid-test-scheme" className="text-medicare-primary hover:underline text-sm">🦠 COVID Test Gold Rush</Link>
            <Link href="/investigations/nurse-practitioner-boom" className="text-medicare-primary hover:underline text-sm">👩‍⚕️ The Rise of the Nurse Practitioner</Link>
            <Link href="/investigations/ten-year-explosion" className="text-medicare-primary hover:underline text-sm">📈 The 10-Year Explosion</Link>
            <Link href="/investigations/telehealth-explosion" className="text-medicare-primary hover:underline text-sm">📱 The Telehealth Explosion</Link>
          </div>
        </div>

        <ShareButtons url="https://www.openmedicare.com/investigations/covid-impact" title="COVID's Impact on Medicare" />
        <SourceCitation />
      </div>
    </main>
  )
}
