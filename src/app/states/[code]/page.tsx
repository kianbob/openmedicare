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

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia',PR:'Puerto Rico',VI:'Virgin Islands',GU:'Guam',AS:'American Samoa',MP:'Northern Mariana Islands'
}

function loadState(code: string) {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'states', `${code}.json`), 'utf-8')
    return JSON.parse(raw)
  } catch { return null }
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'public', 'data', 'states')
  try {
    return fs.readdirSync(dir).filter(f => f.endsWith('.json')).slice(0, 200).map(f => ({ code: f.replace('.json', '') }))
  } catch { return [] }
}

export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params
  const name = STATE_NAMES[code] || code
  return { title: `${name} Medicare Spending — OpenMedicare`, description: `Explore Medicare provider spending, top procedures, and specialty breakdown in ${name}.` }
}

export default async function StateDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const data = loadState(code)
  if (!data) notFound()

  const name = STATE_NAMES[code] || code
  const totalPayments = data.top_providers?.reduce((s: number, p: { payments: number }) => s + p.payments, 0) || 0

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'States', href: '/states' }, { name: name, href: `/states/${code}` }]} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{name} Medicare Spending</h1>
          <p className="text-lg text-gray-600">Medicare provider payments and utilization data for {name} ({code})</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Providers in {name}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Provider</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Payments</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.top_providers.slice(0, 25).map((p: { npi: number; name: string; specialty: string; payments: number; services: number }, i: number) => (
                    <tr key={p.npi} className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-500 text-sm">{i + 1}</td>
                      <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-blue-600 hover:text-blue-800 font-medium">{p.name}</Link></td>
                      <td className="px-4 py-2 text-gray-600 text-sm">{p.specialty}</td>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Procedures in {name}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Payments</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.top_procedures.slice(0, 20).map((p: { code: string; description: string; payments: number; providers: number }) => (
                    <tr key={p.code} className="hover:bg-blue-50">
                      <td className="px-4 py-2"><Link href={`/procedures/${p.code}`} className="text-blue-600 hover:text-blue-800 font-mono font-medium">{p.code}</Link></td>
                      <td className="px-4 py-2 text-gray-600 text-sm">{p.description}</td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(p.payments)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(p.providers)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Specialty Breakdown */}
        {data.specialty_breakdown && data.specialty_breakdown.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Spending by Specialty</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Payments</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.specialty_breakdown.slice(0, 20).map((s: { specialty: string; payments: number; providers: number }) => (
                    <tr key={s.specialty} className="hover:bg-blue-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{s.specialty}</td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(s.payments)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(s.providers)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ShareButtons url={`https://openmedicare.vercel.app/states/${code}`} title={`${name} Medicare Spending — OpenMedicare`} />
        <SourceCitation />
      </div>
    </main>
  )
}
