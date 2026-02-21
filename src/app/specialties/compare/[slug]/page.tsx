import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

const SPECIALTY_PAIRS = [
  'internal-medicine-vs-family-practice',
  'cardiology-vs-internal-medicine',
  'ophthalmology-vs-optometry',
  'orthopedic-surgery-vs-physical-therapy',
  'dermatology-vs-plastic-surgery',
  'emergency-medicine-vs-internal-medicine',
  'neurology-vs-psychiatry',
  'general-surgery-vs-orthopedic-surgery',
  'radiology-vs-diagnostic-radiology',
  'anesthesiology-vs-nurse-anesthetist',
  'urology-vs-nephrology',
  'pulmonary-disease-vs-internal-medicine',
  'oncology-vs-hematology',
  'gastroenterology-vs-internal-medicine',
  'rheumatology-vs-internal-medicine',
]

function loadSpecialties() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'specialties.json'), 'utf-8')
  const data = JSON.parse(raw)
  const map: Record<string, any> = {}
  for (const s of data.specialties) {
    map[s.specialty_slug] = s
  }
  return map
}

function parsePairSlug(slug: string): [string, string] | null {
  // Find the matching pair by checking all possible split points
  const parts = slug.split('-vs-')
  if (parts.length === 2) return [parts[0], parts[1]]
  // Handle cases where specialty names contain hyphens
  const idx = slug.indexOf('-vs-')
  if (idx === -1) return null
  return [slug.slice(0, idx), slug.slice(idx + 4)]
}

function loadSpecialtyDetail(slug: string) {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'specialties', `${slug}.json`), 'utf-8')
    return JSON.parse(raw)
  } catch { return null }
}

export async function generateStaticParams() {
  return SPECIALTY_PAIRS.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const specs = loadSpecialties()
  const pair = parsePairSlug(slug)
  if (!pair) return { title: 'Specialty Comparison | OpenMedicare' }
  const s1 = specs[pair[0]]
  const s2 = specs[pair[1]]
  const n1 = s1?.specialty || pair[0]
  const n2 = s2?.specialty || pair[1]
  return {
    title: `${n1} vs ${n2}: Medicare Billing Compared | OpenMedicare`,
    description: `Compare Medicare billing between ${n1} and ${n2}: total payments, provider counts, per-provider spending, and markup ratios.`,
  }
}

function StatCard({ label, v1, v2, format }: { label: string; v1: number; v2: number; format: 'currency' | 'number' | 'ratio' }) {
  const fmt = format === 'currency' ? formatCurrency : format === 'number' ? formatNumber : (v: number) => `${v.toFixed(2)}x`
  const diff = v1 && v2 ? ((v1 - v2) / v2 * 100) : 0
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="text-sm font-medium text-gray-500 mb-3">{label}</div>
      <div className="grid grid-cols-2 gap-4">
        <div><div className="text-lg font-bold text-medicare-primary">{fmt(v1)}</div></div>
        <div><div className="text-lg font-bold text-gray-900">{fmt(v2)}</div></div>
      </div>
      {diff !== 0 && (
        <div className={`text-xs mt-2 ${diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
          {diff > 0 ? '↑' : '↓'} {Math.abs(diff).toFixed(1)}% difference
        </div>
      )}
    </div>
  )
}

export default async function SpecialtyComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pair = parsePairSlug(slug)
  if (!pair) notFound()

  const specs = loadSpecialties()
  const s1 = specs[pair[0]]
  const s2 = specs[pair[1]]
  if (!s1 || !s2) notFound()

  const detail1 = loadSpecialtyDetail(pair[0])
  const detail2 = loadSpecialtyDetail(pair[1])

  const topProcs1 = detail1?.top_procedures?.slice(0, 5) || []
  const topProcs2 = detail2?.top_procedures?.slice(0, 5) || []

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Specialties', href: '/specialties' },
          { name: `${s1.specialty} vs ${s2.specialty}` },
        ]} />

        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
            {s1.specialty} vs {s2.specialty}
          </h1>
          <p className="text-lg text-gray-600">
            Medicare billing comparison between {s1.specialty} and {s2.specialty} providers
          </p>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <Link href={`/specialties/${pair[0]}`} className="text-xl font-bold text-medicare-primary hover:underline">{s1.specialty}</Link>
          </div>
          <div className="text-center">
            <Link href={`/specialties/${pair[1]}`} className="text-xl font-bold text-gray-900 hover:underline">{s2.specialty}</Link>
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
                ? `${s1.specialty} accounts for ${formatCurrency(s1.total_payments - s2.total_payments)} more in Medicare payments than ${s2.specialty}.`
                : `${s2.specialty} accounts for ${formatCurrency(s2.total_payments - s1.total_payments)} more in Medicare payments than ${s1.specialty}.`
              }
            </li>
            <li className="flex items-start gap-2">
              <span className="text-medicare-primary font-bold">•</span>
              {s1.avg_payment_per_provider > s2.avg_payment_per_provider
                ? `${s1.specialty} providers earn ${formatCurrency(s1.avg_payment_per_provider - s2.avg_payment_per_provider)} more per provider on average.`
                : `${s2.specialty} providers earn ${formatCurrency(s2.avg_payment_per_provider - s1.avg_payment_per_provider)} more per provider on average.`
              }
            </li>
            <li className="flex items-start gap-2">
              <span className="text-medicare-primary font-bold">•</span>
              {s1.markup_ratio > s2.markup_ratio
                ? `${s1.specialty} has a higher markup ratio (${s1.markup_ratio.toFixed(2)}x vs ${s2.markup_ratio.toFixed(2)}x).`
                : `${s2.specialty} has a higher markup ratio (${s2.markup_ratio.toFixed(2)}x vs ${s1.markup_ratio.toFixed(2)}x).`
              }
            </li>
          </ul>
        </div>

        {/* Top Procedures */}
        {(topProcs1.length > 0 || topProcs2.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[{ name: s1.specialty, slug: pair[0], procs: topProcs1 }, { name: s2.specialty, slug: pair[1], procs: topProcs2 }].map(({ name, procs }) => (
              <div key={name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Top Procedures — {name}</h3>
                {procs.length === 0 ? (
                  <p className="text-sm text-gray-500">No procedure data available</p>
                ) : (
                  <div className="space-y-3">
                    {procs.map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{p.code || p.hcpcs_code}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">{p.description || p.hcpcs_description}</div>
                        </div>
                        <div className="text-sm font-semibold text-right">
                          {formatCurrency(p.total_payments || p.payments)}
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
          <h3 className="text-lg font-bold text-gray-900 mb-2">Explore Individual Specialties</h3>
          <div className="flex justify-center gap-4">
            <Link href={`/specialties/${pair[0]}`} className="px-6 py-2 bg-medicare-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
              View {s1.specialty}
            </Link>
            <Link href={`/specialties/${pair[1]}`} className="px-6 py-2 bg-white text-medicare-primary border border-medicare-primary rounded-lg hover:bg-blue-50 transition-colors">
              View {s2.specialty}
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
          <SourceCitation />
          <ShareButtons url={`https://openmedicare.vercel.app/specialties/compare/${slug}`} title={`${s1.specialty} vs ${s2.specialty}: Medicare Billing Compared`} />
        </div>
      </div>
    </main>
  )
}
