import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia',PR:'Puerto Rico',VI:'Virgin Islands',GU:'Guam',AS:'American Samoa',MP:'Northern Mariana Islands'
}

const STATE_PAIRS = [
  ['CA','TX'],['CA','NY'],['FL','TX'],['NY','FL'],['CA','FL'],['TX','NY'],
  ['PA','OH'],['IL','CA'],['GA','FL'],['NC','VA'],['MI','OH'],['NJ','NY'],
  ['WA','CA'],['AZ','CA'],['MA','NY'],['TN','GA'],['MD','VA'],['CO','AZ'],
  ['MN','WI'],['OR','WA'],['IN','OH'],['MO','IL'],['SC','NC'],['AL','GA'],
  ['KY','TN'],['LA','TX'],['OK','TX'],['CT','NY'],['UT','CO'],['NV','AZ'],
]

function loadData() {
  try {
    const statesRaw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'states.json'), 'utf-8')
    const watchlistRaw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'watchlist.json'), 'utf-8')
    const states: Record<string, any> = {}
    for (const s of JSON.parse(statesRaw).states) {
      states[s.state] = s
    }
    const watchlist: any[] = JSON.parse(watchlistRaw)
    return { states, watchlist }
  } catch { return { states: {}, watchlist: [] } }
}

export async function generateStaticParams() {
  return STATE_PAIRS.map(([a, b]) => ({ slug: `${a.toLowerCase()}-vs-${b.toLowerCase()}` }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const [c1, c2] = slug.split('-vs-').map(c => c.toUpperCase())
  const n1 = STATE_NAMES[c1] || c1
  const n2 = STATE_NAMES[c2] || c2
  return {
    title: `${n1} vs ${n2}: Medicare Spending Compared`,
    description: `${n1} or ${n2} — which state spends more? Compare payments, providers, markups, and flagged providers side by side.`,
  }
}

function StatCard({ label, v1, v2, format }: { label: string; v1: number; v2: number; format: 'currency' | 'number' | 'ratio' }) {
  const fmt = format === 'currency' ? formatCurrency : format === 'number' ? formatNumber : (v: number) => `${v.toFixed(2)}x`
  const diff = v1 !== null && v1 !== undefined && v2 !== null && v2 !== undefined ? ((v1 - v2) / v2 * 100) : 0
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="text-sm font-medium text-gray-500 mb-3">{label}</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-lg font-bold text-medicare-primary">{fmt(v1)}</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">{fmt(v2)}</div>
        </div>
      </div>
      {diff !== 0 && (
        <div className={`text-xs mt-2 ${diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
          {diff > 0 ? '↑' : '↓'} {Math.abs(diff).toFixed(1)}% difference
        </div>
      )}
    </div>
  )
}

export default async function StateComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const parts = slug.split('-vs-')
  if (parts.length !== 2) notFound()
  const [c1, c2] = parts.map(c => c.toUpperCase())
  const n1 = STATE_NAMES[c1]
  const n2 = STATE_NAMES[c2]
  if (!n1 || !n2) notFound()

  const { states, watchlist } = loadData()
  const s1 = states[c1]
  const s2 = states[c2]
  if (!s1 || !s2) notFound()

  const flagged1 = watchlist.filter(w => w.state === c1).slice(0, 5)
  const flagged2 = watchlist.filter(w => w.state === c2).slice(0, 5)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'States', href: '/states' },
          { name: `${n1} vs ${n2}` },
        ]} />

        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
            {n1} vs {n2} Medicare Spending
          </h1>
          <p className="text-lg text-gray-600">
            Side-by-side comparison of Medicare provider payments between {n1} and {n2}
          </p>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <Link href={`/states/${c1}`} className="text-xl font-bold text-medicare-primary hover:underline">{n1}</Link>
          </div>
          <div className="text-center">
            <Link href={`/states/${c2}`} className="text-xl font-bold text-gray-900 hover:underline">{n2}</Link>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <StatCard label="Total Medicare Payments" v1={s1.total_payments} v2={s2.total_payments} format="currency" />
          <StatCard label="Total Providers" v1={s1.total_providers} v2={s2.total_providers} format="number" />
          <StatCard label="Avg Payment per Provider" v1={s1.avg_payment_per_provider} v2={s2.avg_payment_per_provider} format="currency" />
          <StatCard label="Markup Ratio" v1={s1.markup_ratio} v2={s2.markup_ratio} format="ratio" />
          <StatCard label="Total Services" v1={s1.total_services} v2={s2.total_services} format="number" />
          <StatCard label="Avg Payment per Service" v1={s1.avg_payment_per_service} v2={s2.avg_payment_per_service} format="currency" />
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Insights</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-medicare-primary font-bold">•</span>
              {s1.total_payments > s2.total_payments
                ? `${n1} has ${formatCurrency(s1.total_payments - s2.total_payments)} more in total Medicare payments than ${n2}.`
                : `${n2} has ${formatCurrency(s2.total_payments - s1.total_payments)} more in total Medicare payments than ${n1}.`
              }
            </li>
            <li className="flex items-start gap-2">
              <span className="text-medicare-primary font-bold">•</span>
              {s1.avg_payment_per_provider > s2.avg_payment_per_provider
                ? `Providers in ${n1} average ${formatCurrency(s1.avg_payment_per_provider - s2.avg_payment_per_provider)} more per provider than ${n2}.`
                : `Providers in ${n2} average ${formatCurrency(s2.avg_payment_per_provider - s1.avg_payment_per_provider)} more per provider than ${n1}.`
              }
            </li>
            <li className="flex items-start gap-2">
              <span className="text-medicare-primary font-bold">•</span>
              {s1.markup_ratio > s2.markup_ratio
                ? `${n1} has a higher markup ratio (${s1.markup_ratio.toFixed(2)}x vs ${s2.markup_ratio.toFixed(2)}x), meaning providers charge more relative to what Medicare pays.`
                : `${n2} has a higher markup ratio (${s2.markup_ratio.toFixed(2)}x vs ${s1.markup_ratio.toFixed(2)}x), meaning providers charge more relative to what Medicare pays.`
              }
            </li>
          </ul>
        </div>

        {/* Flagged Providers */}
        {(flagged1.length > 0 || flagged2.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[{ name: n1, code: c1, flagged: flagged1 }, { name: n2, code: c2, flagged: flagged2 }].map(({ name, flagged }) => (
              <div key={name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Flagged Providers in {name}
                </h3>
                {flagged.length === 0 ? (
                  <p className="text-sm text-gray-500">No flagged providers</p>
                ) : (
                  <div className="space-y-3">
                    {flagged.map((p: any) => (
                      <div key={p.npi} className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div>
                          <Link href={`/providers/${p.npi}`} className="text-sm font-medium text-medicare-primary hover:underline">
                            {p.name}
                          </Link>
                          <div className="text-xs text-gray-500">{p.specialty}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{formatCurrency(p.total_payments)}</div>
                          <div className="text-xs text-red-600">Risk: {p.risk_score}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Explore Individual States</h3>
          <div className="flex justify-center gap-4">
            <Link href={`/states/${c1}`} className="px-6 py-2 bg-medicare-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
              View {n1}
            </Link>
            <Link href={`/states/${c2}`} className="px-6 py-2 bg-white text-medicare-primary border border-medicare-primary rounded-lg hover:bg-blue-50 transition-colors">
              View {n2}
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
          <SourceCitation />
          <ShareButtons url={`https://www.openmedicare.com/states/compare/${slug}`} title={`${n1} vs ${n2} Medicare Spending Comparison`} />
        </div>
      </div>
    </main>
  )
}
