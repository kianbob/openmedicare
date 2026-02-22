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

function loadProcedure(code: string) {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'procedures', `${code}.json`), 'utf-8')
    return JSON.parse(raw)
  } catch { return null }
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'public', 'data', 'procedures')
  try {
    return fs.readdirSync(dir).filter(f => f.endsWith('.json')).slice(0, 200).map(f => ({ code: f.replace('.json', '') }))
  } catch { return [] }
}

export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params
  const data = loadProcedure(code)
  const desc = data?.description || code
  return { title: `${code} — ${desc} — OpenMedicare`, description: `Medicare spending analysis for procedure ${code}: ${desc}. Top providers, state breakdown, and 10-year trends.` }
}

export default async function ProcedureDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const data = loadProcedure(code)

  if (!data) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Breadcrumbs items={[{ name: 'Procedures', href: '/procedures' }, { name: code }]} />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-4 text-center">
            <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full font-mono font-bold text-lg inline-block mb-4">{code}</span>
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-3">Procedure Code Not in Our Database</h1>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              We have detailed spending data for the top 500 Medicare procedures by total payments. Code <strong>{code}</strong> is not in our top 500.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/procedures" className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                Browse Top 500 Procedures
              </Link>
              <Link href="/search" className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                Search OpenMedicare
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const yearly = data.yearly_trends || []
  const totalPayments = yearly.reduce((s: number, y: { payments: number }) => s + y.payments, 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Procedures', href: '/procedures' }, { name: code }]} />

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-mono font-bold text-sm">{code}</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{data.description || code}</h1>
          {yearly.length > 0 && (
            <p className="text-lg text-gray-600">
              {formatCurrency(totalPayments)} in total Medicare payments across {yearly.length} years
            </p>
          )}
        </div>

        {/* AI Overview */}
        <AIOverview
          type="procedure"
          data={{ procedureData: data }}
          className="mb-8"
        />

        {/* Yearly Trends Chart */}
        {yearly.length > 1 && (
          <div className="mb-8">
            <TrendChart title="Spending Trends (2014-2023)" xDataKey="year" yDataKey="value" data={yearly.map((y: { year: number; payments: number }) => ({ year: y.year, value: y.payments }))} />
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Providers for {code}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Provider</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Payments</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg/Service</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.top_providers.slice(0, 25).map((p: { npi: string; name: string; specialty: string; state: string; payments: number; services: number }, i: number) => (
                    <tr key={p.npi} className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-500 text-sm">{i + 1}</td>
                      <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-blue-600 hover:text-blue-800 font-medium">{p.name}</Link></td>
                      <td className="px-4 py-2 text-gray-600 text-sm">{p.specialty}</td>
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

        {/* State Breakdown */}
        {data.state_breakdown && data.state_breakdown.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Spending by State</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Payments</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg/Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.state_breakdown.slice(0, 30).map((s: { state: string; payments: number; services: number; providers: number }) => (
                    <tr key={s.state} className="hover:bg-blue-50">
                      <td className="px-4 py-2"><Link href={`/states/${s.state}`} className="text-blue-600 hover:text-blue-800 font-medium">{s.state}</Link></td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(s.payments)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(s.services)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(s.providers)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">
                        {s.providers > 0 ? formatCurrency(s.payments / s.providers) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Related */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Related</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/procedures" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Browse</div>
              <div className="font-medium text-blue-600">← All Procedures</div>
            </Link>
            <Link href={`/procedures/${code}/cost`} className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Cost Analysis</div>
              <div className="font-medium text-blue-600">Cost breakdown for {code} →</div>
            </Link>
            <Link href="/calculator" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Tool</div>
              <div className="font-medium text-blue-600">Cost Calculator →</div>
            </Link>
            <Link href="/investigations/most-expensive-medicare-procedures" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Investigation</div>
              <div className="font-medium text-blue-600">Most expensive procedures →</div>
            </Link>
            <Link href="/investigations/markup-machine" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Investigation</div>
              <div className="font-medium text-blue-600">The Markup Machine →</div>
            </Link>
            <Link href="/search" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Search</div>
              <div className="font-medium text-blue-600">Search providers →</div>
            </Link>
          </div>
        </div>

        <ShareButtons url={`https://www.openmedicare.com/procedures/${code}`} title={`${code} Medicare Spending — OpenMedicare`} />
        <SourceCitation lastUpdated="February 2026 (data through 2023, the latest CMS release)" />
      </div>
    </main>
  )
}
