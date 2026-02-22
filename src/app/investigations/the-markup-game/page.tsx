import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import ArticleJsonLd from '@/components/ArticleJsonLd'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: 'The Markup Game: Why Medicare Pays $100 for a $3 Test | OpenMedicare',
  description: 'Providers charge Medicare $3.2 trillion. Medicare pays $855 billion. The $2.1 trillion gap is the markup game — and it\'s getting worse every year.',
  openGraph: {
    title: 'The Markup Game',
    description: 'Why providers charge Medicare 3-4x what they actually get paid — and what it means.',
  },
}

interface MarkupSpecialty {
  specialty: string
  avg_markup: number
  total_charges: number
  total_payments: number
  provider_count: number
}

interface MarkupState {
  state: string
  avg_markup: number
  total_charges: number
  total_payments: number
}

interface MarkupTrend {
  year: number
  avg_markup: number
  total_charges: number
  total_payments: number
  markup_dollars: number
}

interface AllowedSummary {
  total_charged: number
  total_allowed: number
  total_paid: number
  total_services: number
  charge_to_allowed_ratio: number
  charge_to_paid_ratio: number
  writeoff_amount: number
  writeoff_pct: number
}

interface AllowedSpecialty {
  specialty: string
  total_charged: number
  total_allowed: number
  total_paid: number
  writeoff_pct: number
  charge_to_paid_ratio: number
  providers: number
}

interface AllowedTrend {
  year: number
  total_charged: number
  total_allowed: number
  total_paid: number
  writeoff_pct: number
  markup_ratio: number
}

interface AllowedData {
  summary: AllowedSummary
  yearly_trends: AllowedTrend[]
  specialties: AllowedSpecialty[]
}

interface MarkupData {
  by_specialty: MarkupSpecialty[]
  by_state: MarkupState[]
  yearly_trends: MarkupTrend[]
}

function loadMarkupData(): MarkupData {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'markup-analysis.json'), 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { by_specialty: [], by_state: [], yearly_trends: [] }
  }
}

function loadAllowedData(): AllowedData {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'allowed-amounts.json'), 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { summary: {} as AllowedSummary, yearly_trends: [], specialties: [] }
  }
}

export default function MarkupGamePage() {
  const markup = loadMarkupData()
  const allowed = loadAllowedData()

  const summary = allowed.summary
  const specialties = markup.by_specialty.slice(0, 15)
  const markupStates = markup.by_state.filter(s => s.state.length === 2 && !['AS','AA','AE','XX'].includes(s.state)).slice(0, 15)
  const trends = markup.yearly_trends
  const allowedTrends = allowed.yearly_trends
  const allowedSpecialties = allowed.specialties.slice(0, 20)

  // Highest markup specialties
  const topMarkupSpec = specialties[0]
  const anesthSpec = specialties.find(s => s.specialty === 'Anesthesiology')

  // Worst writeoff specialties
  const worstWriteoff = [...allowed.specialties].sort((a, b) => b.writeoff_pct - a.writeoff_pct).slice(0, 10)

  // Year-over-year trend
  const firstYear = trends[0]
  const lastYear = trends[trends.length - 1]
  const markupGrowth = firstYear && lastYear ? ((lastYear.avg_markup - firstYear.avg_markup) / firstYear.avg_markup * 100) : 0

  return (
    <main className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="The Markup Game: Why Medicare Pays $100 for a $3 Test"
        description="The $2.1 trillion gap between what providers charge and what Medicare pays."
        publishedDate="2026-02-21"
        url="https://www.openmedicare.com/investigations/the-markup-game"
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'The Markup Game', href: '/investigations/the-markup-game' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Investigation</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            The Markup Game: Why Medicare Pays $100 for a $3 Test
          </h1>
          <p className="text-gray-500 text-sm mb-2">Published February 2026 · 16 min read</p>
          <ShareButtons title="The Markup Game" url="https://www.openmedicare.com/investigations/the-markup-game" />

          <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-r-lg mb-8 mt-8 not-prose">
            <p className="text-amber-900 font-medium text-lg">The Bottom Line</p>
            <p className="text-amber-800 mt-2">
              Over the past decade, Medicare providers charged <strong>{formatCurrency(summary.total_charged)}</strong> for their services. Medicare actually paid <strong>{formatCurrency(summary.total_paid)}</strong>. The difference — <strong>{formatCurrency(summary.writeoff_amount)}</strong> — was written off. That&apos;s a {summary.writeoff_pct}% writeoff rate, and it&apos;s getting worse.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">How Medicare Pricing Actually Works</h2>

          <p className="text-gray-700 mb-4">
            Most people don&apos;t know this: the price a doctor charges Medicare is essentially fictional. Here&apos;s how the system actually works:
          </p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border p-8 my-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">The Three Numbers That Matter</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <div className="text-3xl font-bold text-red-600 mb-2">{formatCurrency(summary.total_charged)}</div>
              <div className="text-sm font-medium text-red-800">Submitted Charges</div>
              <div className="text-xs text-red-600 mt-1">What providers <em>ask</em> for</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{formatCurrency(summary.total_allowed)}</div>
              <div className="text-sm font-medium text-yellow-800">Allowed Amount</div>
              <div className="text-xs text-yellow-600 mt-1">What Medicare <em>approves</em></div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(summary.total_paid)}</div>
              <div className="text-sm font-medium text-green-800">Actual Payment</div>
              <div className="text-xs text-green-600 mt-1">What providers <em>receive</em></div>
            </div>
          </div>
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Average charge-to-payment ratio:</span>
              <span className="font-bold text-red-600 text-lg">{summary.charge_to_paid_ratio}x</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">For every $1 Medicare pays, providers submitted ${summary.charge_to_paid_ratio} in charges.</p>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            A provider submits a <strong>charge</strong> — their listed price. Medicare looks at its fee schedule, determines the <strong>allowed amount</strong> (what it considers fair), and pays <strong>80%</strong> of the allowed amount (the beneficiary or supplemental insurance covers the remaining 20%). The difference between the charge and the allowed amount — often 60-90% of the bill — simply evaporates.
          </p>

          <p className="text-gray-700 mb-4">
            This means providers can charge <em>literally anything</em> and it usually doesn&apos;t affect what they get paid. A blood test that Medicare reimburses at $11.76 might be submitted at $300. Medicare pays $11.76 regardless.
          </p>

          <p className="text-gray-700 mb-4">
            So why do providers charge so much? Several reasons: negotiating leverage with private insurers, out-of-network billing, and — in some cases — gaming the system when charges <em>do</em> affect payments.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Wildest Markups by Specialty</h2>

          <p className="text-gray-700 mb-4">
            Not all specialties play the markup game equally. Some charge relatively close to what they receive. Others operate in a completely different reality:
          </p>
        </article>

        <div className="bg-gray-900 text-white rounded-xl p-8 my-8">
          <h3 className="text-xl font-bold mb-6 text-amber-400">Top 15 Specialties by Average Markup Ratio</h3>
          <div className="space-y-4">
            {specialties.map((s, i) => (
              <div key={s.specialty} className="flex items-center gap-3">
                <span className="text-gray-500 w-6 text-right text-sm">{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-200 truncate">{s.specialty}</span>
                    <span className="text-amber-400 font-bold font-mono ml-2">{s.avg_markup.toFixed(1)}x</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-amber-500 rounded-full h-2"
                      style={{ width: `${Math.min(s.avg_markup / specialties[0].avg_markup * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Charged: {formatCurrency(s.total_charges)}</span>
                    <span>Paid: {formatCurrency(s.total_payments)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            <strong>{topMarkupSpec?.specialty}</strong> leads with an average markup of <strong>{topMarkupSpec?.avg_markup.toFixed(1)}x</strong> — meaning pharmacies charge about ${topMarkupSpec?.avg_markup.toFixed(0)} for every $1 Medicare pays. That&apos;s {formatCurrency(topMarkupSpec?.total_charges || 0)} in charges against {formatCurrency(topMarkupSpec?.total_payments || 0)} in payments.
          </p>

          <p className="text-gray-700 mb-4">
            <strong>Anesthesiology</strong> follows at {anesthSpec?.avg_markup.toFixed(1)}x — anesthesiologists charge {formatCurrency(anesthSpec?.total_charges || 0)} and receive {formatCurrency(anesthSpec?.total_payments || 0)}. The {((1 - (anesthSpec?.total_payments || 0) / (anesthSpec?.total_charges || 1)) * 100).toFixed(0)}% gap represents real institutional incentives that shape how care is delivered.
          </p>

          <p className="text-gray-700 mb-4">
            Compare these to specialties at the other end: podiatry, optometry, and chiropractic typically have markups under 2.5x. The range is enormous — and it matters because extreme markups can indicate billing strategies designed to maximize revenue from every possible payer, not just Medicare.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Writeoff Champions</h2>

          <p className="text-gray-700 mb-4">
            Another way to look at this: which <Link href="/specialties" className="text-blue-600 hover:underline">specialties</Link> have the highest writeoff rates? These are the fields where the gap between fiction and reality is widest.
          </p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden my-8">
          <div className="p-4 bg-amber-50 border-b">
            <h3 className="text-lg font-bold text-amber-900">Highest Writeoff Rates by Specialty</h3>
            <p className="text-sm text-amber-700">Percentage of submitted charges that Medicare writes off</p>
          </div>
          <div className="divide-y">
            {worstWriteoff.map((s, i) => (
              <div key={s.specialty} className="p-4 flex items-center gap-4">
                <span className="text-gray-400 w-6 text-right text-sm">{i + 1}.</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{s.specialty}</span>
                    <span className="font-bold text-red-600">{s.writeoff_pct}%</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div className="bg-red-500 rounded-full h-2" style={{ width: `${s.writeoff_pct}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{s.providers.toLocaleString()} providers</span>
                    <span>Charge-to-paid: {s.charge_to_paid_ratio}x</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            {worstWriteoff[0]?.specialty} has a {worstWriteoff[0]?.writeoff_pct}% writeoff rate — meaning for every $100 submitted, Medicare writes off ${worstWriteoff[0]?.writeoff_pct}. At a charge-to-paid ratio of {worstWriteoff[0]?.charge_to_paid_ratio}x, these providers charge about ${worstWriteoff[0]?.charge_to_paid_ratio} for every $1 they actually receive.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Markups by State</h2>

          <p className="text-gray-700 mb-4">
            Geography matters too. Some states have dramatically higher average markups than others:
          </p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden my-8">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="text-lg font-bold text-gray-900">Top 15 States by Average Markup</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x">
            {[0, 5, 10].map(start => (
              <div key={start} className="divide-y">
                {markupStates.slice(start, start + 5).map((s, i) => (
                  <div key={s.state} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm w-5">{start + i + 1}.</span>
                      <Link href={`/states/${s.state}`} className="text-blue-600 hover:underline font-medium">{s.state}</Link>
                    </div>
                    <span className="font-bold text-amber-600">{s.avg_markup.toFixed(1)}x</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            Wisconsin leads at {markupStates[0]?.avg_markup.toFixed(1)}x, followed by Alaska at {markupStates[1]?.avg_markup.toFixed(1)}x and Nevada at {markupStates[2]?.avg_markup.toFixed(1)}x. Texas, the largest state by Medicare volume, comes in at {markupStates.find(s => s.state === 'TX')?.avg_markup.toFixed(1)}x.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Trend: It&apos;s Getting Worse</h2>

          <p className="text-gray-700 mb-4">
            Here&apos;s the most concerning finding: the markup gap is <em>growing</em>. Over the past decade, the average markup ratio has risen {markupGrowth.toFixed(0)}%:
          </p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border p-8 my-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Markup Ratio Trend (2014–2023)</h3>
          <div className="space-y-4">
            {trends.map((t) => (
              <div key={t.year} className="flex items-center gap-4">
                <span className="text-gray-600 font-mono w-12">{t.year}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(t.avg_markup / 7) * 100}%` }}
                  >
                    <span className="text-xs font-bold text-white">{t.avg_markup.toFixed(2)}x</span>
                  </div>
                </div>
                <span className="text-gray-500 text-sm w-32 text-right">
                  {formatCurrency(t.markup_dollars)} gap
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">2014 writeoff:</span>
              <span className="font-medium">{formatCurrency(trends[0]?.markup_dollars || 0)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">2023 writeoff:</span>
              <span className="font-medium text-red-600">{formatCurrency(trends[trends.length - 1]?.markup_dollars || 0)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Growth:</span>
              <span className="font-bold text-red-600">+{formatCurrency((trends[trends.length - 1]?.markup_dollars || 0) - (trends[0]?.markup_dollars || 0))}</span>
            </div>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            In 2014, the average markup was {firstYear?.avg_markup.toFixed(2)}x and the total writeoff gap was {formatCurrency(firstYear?.markup_dollars || 0)}. By 2023, the markup had risen to {lastYear?.avg_markup.toFixed(2)}x and the gap had grown to {formatCurrency(lastYear?.markup_dollars || 0)} — an increase of <strong>{formatCurrency((lastYear?.markup_dollars || 0) - (firstYear?.markup_dollars || 0))}</strong>.
          </p>

          <p className="text-gray-700 mb-4">
            The year-over-year pattern also reveals the COVID effect: markups dipped slightly in 2020 (as procedure volumes fell), then surged to new highs in 2021 and 2022. The pandemic didn&apos;t just change testing — it changed pricing behavior across the board.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why This Matters for Patients</h2>

          <p className="text-gray-700 mb-4">
            You might think: if Medicare ignores the charges anyway, who cares? The answer: <em>you do</em>, in at least three ways:
          </p>

          <div className="bg-blue-50 border rounded-xl p-6 my-6 not-prose">
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold text-lg">1.</span>
                <div>
                  <p className="font-medium text-blue-900">Out-of-Network Billing</p>
                  <p className="text-blue-800 text-sm">When you see an out-of-network provider, you can be billed the full charge — not the Medicare-approved amount. Inflated charges become real bills.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold text-lg">2.</span>
                <div>
                  <p className="font-medium text-blue-900">Supplemental Insurance Costs</p>
                  <p className="text-blue-800 text-sm">Medigap policies cost more when the underlying pricing system is inflated. Higher charges mean higher premiums for everyone.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold text-lg">3.</span>
                <div>
                  <p className="font-medium text-blue-900">System Complexity</p>
                  <p className="text-blue-800 text-sm">The markup game makes healthcare pricing opaque. When a $3 test is billed at $300, trust in the system erodes — and fraud becomes harder to detect.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Explore the Data</h2>

          <p className="text-gray-700 mb-4">
            Every number in this article comes from publicly available Medicare data. You can explore it yourself:
          </p>

          <ul className="text-gray-700 mb-4">
            <li><Link href="/markup" className="text-blue-600 hover:underline">Markup Analysis Tool</Link> — Search any provider or specialty</li>
            <li><Link href="/procedures" className="text-blue-600 hover:underline">Procedure Explorer</Link> — See markups by specific procedure code</li>
            <li><Link href="/specialties" className="text-blue-600 hover:underline">Specialty Comparisons</Link> — Compare billing patterns across specialties</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Methodology</h2>

          <p className="text-gray-700 mb-4">
            Markup ratios are calculated as submitted charges divided by actual Medicare payments, aggregated across all HCPCS codes for each provider/specialty/state. The &quot;allowed amount&quot; represents Medicare&apos;s fee schedule price; actual payment is typically 80% of allowed (with the beneficiary responsible for the remaining 20%). All data is from CMS Medicare Part B Public Use Files, 2014-2023. Writeoff percentages represent the share of submitted charges that Medicare does not pay.
          </p>
        </article>

        <div className="mt-8 mb-12">
          <SourceCitation />
        </div>
      </div>
    </main>
  )
}
