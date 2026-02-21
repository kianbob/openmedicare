import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import AIOverview from '@/components/AIOverview'
import { TrendChart } from '@/components/Charts'
import { formatCurrency, formatNumber } from '@/lib/format'

function loadSpecialtiesSummary(slug: string): any {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'specialties.json'), 'utf-8')
    const data = JSON.parse(raw)
    const specialties = data.specialties || []
    return specialties.find((s: any) => s.specialty_slug === slug) || null
  } catch { return null }
}

function loadMlV2Results(): any {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'ml-v2-results.json'), 'utf-8'))
  } catch { return null }
}

function loadSpecialty(slug: string) {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'specialties', `${slug}.json`), 'utf-8')
    return JSON.parse(raw)
  } catch { return null }
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'public', 'data', 'specialties')
  try {
    return fs.readdirSync(dir).filter(f => f.endsWith('.json')).slice(0, 200).map(f => ({ slug: f.replace('.json', '') }))
  } catch { return [] }
}

export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const data = loadSpecialty(slug)
  const name = data?.specialty || slug
  return { title: `${name} Medicare Spending — OpenMedicare`, description: `Medicare spending analysis for ${name}: top providers, procedures, geographic distribution, and 10-year trends.` }
}

export default async function SpecialtyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = loadSpecialty(slug)
  if (!data) notFound()

  const summaryData = loadSpecialtiesSummary(slug)

  // ML v2 flagged providers in this specialty
  const mlData = loadMlV2Results()
  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const mlSpecProviders = mlData?.still_out_there?.filter((p: any) => slugify(p.specialty) === slug) || []

  const yearly = data.yearly_trends || []
  const totalPayments = yearly.reduce((s: number, y: { payments: number }) => s + y.payments, 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Specialties', href: '/specialties' }, { name: data.specialty }]} />

        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{data.specialty}</h1>
          <p className="text-lg text-gray-600">Medicare spending analysis for {data.specialty} providers</p>
        </div>

        {/* AI Overview */}
        <AIOverview
          type="specialty"
          data={{ specialtyData: data, summaryData }}
          className="mb-8"
        />

        {/* ML v2 Flagged Providers */}
        {mlSpecProviders.length > 0 && (
          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <h2 className="text-xl font-serif font-bold text-gray-900">
                  {mlSpecProviders.length} AI-Flagged {data.specialty} Provider{mlSpecProviders.length !== 1 ? 's' : ''}
                </h2>
                <p className="text-sm text-gray-600">Providers in this specialty flagged by the ML v2 fraud detection model</p>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              {mlSpecProviders.slice(0, 3).map((p: any) => (
                <div key={p.npi} className="flex items-center justify-between bg-white rounded-lg border border-purple-200 px-4 py-3">
                  <div>
                    <Link href={`/providers/${p.npi}`} className="text-blue-600 hover:text-blue-800 font-medium">{p.name}</Link>
                    <span className="text-sm text-gray-500 ml-2">{p.state}</span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                    {(p.fraud_probability * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            <Link href="/fraud/still-out-there" className="text-sm font-medium text-purple-700 hover:text-purple-900 underline">
              View all ML-flagged providers →
            </Link>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500">Total Payments (10yr)</div>
            <div className="text-2xl font-bold text-medicare-primary">{formatCurrency(totalPayments)}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500">Top Providers</div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(data.top_providers?.length || 0)}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500">States with Providers</div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(data.state_distribution?.length || 0)}</div>
          </div>
        </div>

        {/* Yearly Trends Chart */}
        {yearly.length > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Spending Trends (2014-2023)</h2>
            <TrendChart xDataKey="year" yDataKey="value" data={yearly.map((y: { year: number; payments: number }) => ({ year: y.year, value: y.payments }))} />
          </div>
        )}

        {/* Year-over-Year Table */}
        {yearly.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Year-over-Year Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Payments</th>
                    {yearly[0].services != null && <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services</th>}
                    {yearly[0].providers != null && <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>}
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">YoY Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {yearly.map((y: any, i: number) => {
                    const prev = i > 0 ? yearly[i - 1] : null
                    const yoy = prev ? ((y.payments - prev.payments) / prev.payments * 100) : null
                    return (
                      <tr key={y.year} className="hover:bg-blue-50">
                        <td className="px-4 py-2 font-medium text-gray-900">{y.year}</td>
                        <td className="px-4 py-2 text-right font-medium">{formatCurrency(y.payments)}</td>
                        {y.services != null && <td className="px-4 py-2 text-right text-gray-600">{formatNumber(y.services)}</td>}
                        {y.providers != null && <td className="px-4 py-2 text-right text-gray-600">{formatNumber(y.providers)}</td>}
                        <td className="px-4 py-2 text-right">
                          {yoy !== null ? (
                            <span className={yoy >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {yoy >= 0 ? '+' : ''}{yoy.toFixed(1)}%
                            </span>
                          ) : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Providers */}
        {data.top_providers && data.top_providers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Top {data.specialty} Providers</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Provider</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Payments</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg/Service</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.top_providers.slice(0, 25).map((p: { npi: number; name: string; state: string; payments: number; services: number }, i: number) => (
                    <tr key={p.npi} className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-500 text-sm">{i + 1}</td>
                      <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-blue-600 hover:text-blue-800 font-medium">{p.name}</Link></td>
                      <td className="px-4 py-2"><Link href={`/states/${p.state}`} className="text-blue-600 hover:text-blue-800">{p.state}</Link></td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(p.payments)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(p.services)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">
                        {p.services > 0 ? formatCurrency(p.payments / p.services) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Procedures */}
        {data.top_procedures && data.top_procedures.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Procedures</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Payments</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg/Service</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.top_procedures.slice(0, 20).map((p: { code: string; description: string; payments: number; services: number }) => (
                    <tr key={p.code} className="hover:bg-blue-50">
                      <td className="px-4 py-2"><Link href={`/procedures/${p.code}`} className="text-blue-600 hover:text-blue-800 font-mono font-medium">{p.code}</Link></td>
                      <td className="px-4 py-2 text-gray-600 text-sm">{p.description}</td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(p.payments)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(p.services)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">
                        {p.services > 0 ? formatCurrency(p.payments / p.services) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* State Distribution */}
        {data.state_distribution && data.state_distribution.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Geographic Distribution</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {data.state_distribution.slice(0, 30).map((s: { state: string; payments: number; providers: number }) => (
                <Link key={s.state} href={`/states/${s.state}`}
                  className="bg-gray-50 hover:bg-blue-50 rounded-lg p-3 text-center transition-colors border border-gray-100">
                  <div className="text-lg font-bold text-blue-600">{s.state}</div>
                  <div className="text-xs text-gray-500">{formatCurrency(s.payments)}</div>
                  <div className="text-xs text-gray-400">{formatNumber(s.providers)} providers</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Related</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/specialties" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Browse</div>
              <div className="font-medium text-blue-600">← All Specialties</div>
            </Link>
            <Link href={`/specialties/${slug}/fraud-risk`} className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Fraud Analysis</div>
              <div className="font-medium text-blue-600">{data.specialty} fraud risk →</div>
            </Link>
            <Link href={`/specialties/compare/${slug}`} className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Compare</div>
              <div className="font-medium text-blue-600">Compare {data.specialty} →</div>
            </Link>
            <Link href="/investigations/specialty-gap" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Investigation</div>
              <div className="font-medium text-blue-600">The Specialty Pay Gap →</div>
            </Link>
            <Link href="/investigations/specialty-monopoly" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Investigation</div>
              <div className="font-medium text-blue-600">The Specialty Monopoly →</div>
            </Link>
            <Link href="/markup" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Analysis</div>
              <div className="font-medium text-blue-600">Markup Analysis →</div>
            </Link>
          </div>
        </div>

        <ShareButtons url={`https://openmedicare.vercel.app/specialties/${slug}`} title={`${data.specialty} Medicare Spending — OpenMedicare`} />
        <SourceCitation lastUpdated="February 2026 (data through 2023, the latest CMS release)" />
      </div>
    </main>
  )
}
