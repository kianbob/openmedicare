import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
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
  if (!data) notFound()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Procedures', href: '/procedures' }, { name: code, href: `/procedures/${code}` }]} />

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-mono font-bold text-sm">{code}</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{data.description || code}</h1>
        </div>

        {/* Yearly Trends */}
        {data.yearly_trends && data.yearly_trends.length > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Spending Trends (2014-2023)</h2>
            <TrendChart xDataKey="year" yDataKey="value" data={data.yearly_trends.map((y: { year: number; payments: number }) => ({ year: y.year, value: y.payments }))} />
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.top_providers.slice(0, 25).map((p: { npi: number; name: string; specialty: string; state: string; payments: number; services: number }, i: number) => (
                    <tr key={p.npi} className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-500 text-sm">{i + 1}</td>
                      <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-blue-600 hover:text-blue-800 font-medium">{p.name}</Link></td>
                      <td className="px-4 py-2 text-gray-600 text-sm">{p.specialty}</td>
                      <td className="px-4 py-2 text-gray-600">{p.state}</td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(p.payments)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(p.services)}</td>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.state_breakdown.slice(0, 20).map((s: { state: string; payments: number; services: number; providers: number }) => (
                    <tr key={s.state} className="hover:bg-blue-50">
                      <td className="px-4 py-2"><Link href={`/states/${s.state}`} className="text-blue-600 hover:text-blue-800 font-medium">{s.state}</Link></td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(s.payments)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(s.services)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(s.providers)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ShareButtons url={`https://openmedicare.vercel.app/procedures/${code}`} title={`${code} Medicare Spending — OpenMedicare`} />
        <SourceCitation />
      </div>
    </main>
  )
}
