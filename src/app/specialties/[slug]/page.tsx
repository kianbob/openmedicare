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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Specialties', href: '/specialties' }, { label: data.specialty, href: `/specialties/${slug}` }]} />

        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{data.specialty}</h1>
          <p className="text-lg text-gray-600">Medicare spending analysis for {data.specialty} providers</p>
        </div>

        {/* Yearly Trends */}
        {data.yearly_trends && data.yearly_trends.length > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Spending Trends (2014-2023)</h2>
            <TrendChart data={data.yearly_trends.map((y: { year: number; payments: number }) => ({ year: y.year, value: y.payments }))} label="Total Payments" prefix="$" />
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.top_providers.slice(0, 25).map((p: { npi: number; name: string; state: string; payments: number; services: number }, i: number) => (
                    <tr key={p.npi} className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-500 text-sm">{i + 1}</td>
                      <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-blue-600 hover:text-blue-800 font-medium">{p.name}</Link></td>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.top_procedures.slice(0, 20).map((p: { code: string; description: string; payments: number; services: number }) => (
                    <tr key={p.code} className="hover:bg-blue-50">
                      <td className="px-4 py-2"><Link href={`/procedures/${p.code}`} className="text-blue-600 hover:text-blue-800 font-mono font-medium">{p.code}</Link></td>
                      <td className="px-4 py-2 text-gray-600 text-sm">{p.description}</td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(p.payments)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(p.services)}</td>
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
              {data.state_distribution.slice(0, 24).map((s: { state: string; payments: number; providers: number }) => (
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

        <ShareButtons url={`https://openmedicare.vercel.app/specialties/${slug}`} title={`${data.specialty} Medicare Spending — OpenMedicare`} />
        <SourceCitation />
      </div>
    </main>
  )
}
