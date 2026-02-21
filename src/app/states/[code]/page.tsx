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

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia',PR:'Puerto Rico',VI:'Virgin Islands',GU:'Guam',AS:'American Samoa',MP:'Northern Mariana Islands'
}

function slugifySpecialty(specialty: string): string {
  return specialty.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
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
  const yearly = data.yearly_trends || []
  const totalPayments = yearly.length > 0
    ? yearly.reduce((s: number, y: { payments: number }) => s + y.payments, 0)
    : (data.top_providers?.reduce((s: number, p: { payments: number }) => s + p.payments, 0) || 0)
  const totalProviders = yearly.length > 0 ? yearly[yearly.length - 1]?.providers || 0 : 0

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'States', href: '/states' }, { name: name }]} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{name} Medicare Spending</h1>
          <p className="text-lg text-gray-600">Medicare provider payments and utilization data for {name} ({code})</p>
        </div>

        {/* AI Overview */}
        <AIOverview
          type="state"
          data={{ stateData: data, stateName: name, code }}
          className="mb-8"
        />

        {/* Summary Stats */}
        {yearly.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-500">Total Payments (10yr)</div>
              <div className="text-2xl font-bold text-medicare-primary">{formatCurrency(totalPayments)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-500">Active Providers ({yearly[yearly.length - 1]?.year})</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(totalProviders)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-500">Specialties</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(data.specialty_breakdown?.length || 0)}</div>
            </div>
          </div>
        )}

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
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">YoY Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {yearly.map((y: { year: number; payments: number; services: number; providers: number }, i: number) => {
                    const prev = i > 0 ? yearly[i - 1] : null
                    const yoy = prev ? ((y.payments - prev.payments) / prev.payments * 100) : null
                    return (
                      <tr key={y.year} className="hover:bg-blue-50">
                        <td className="px-4 py-2 font-medium text-gray-900">{y.year}</td>
                        <td className="px-4 py-2 text-right font-medium">{formatCurrency(y.payments)}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{formatNumber(y.services)}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{formatNumber(y.providers)}</td>
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
                      <td className="px-4 py-2 text-gray-600 text-sm">
                        <Link href={`/specialties/${slugifySpecialty(p.specialty)}`} className="hover:text-blue-600">{p.specialty}</Link>
                      </td>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Most Billed Procedures in {name}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Payments</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.top_procedures.slice(0, 20).map((p: { code: string; description: string; payments: number; services: number; providers: number }) => (
                    <tr key={p.code} className="hover:bg-blue-50">
                      <td className="px-4 py-2"><Link href={`/procedures/${p.code}`} className="text-blue-600 hover:text-blue-800 font-mono font-medium">{p.code}</Link></td>
                      <td className="px-4 py-2 text-gray-600 text-sm">{p.description}</td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(p.payments)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(p.services)}</td>
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
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg per Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.specialty_breakdown.slice(0, 25).map((s: { specialty: string; payments: number; providers: number }) => (
                    <tr key={s.specialty} className="hover:bg-blue-50">
                      <td className="px-4 py-2">
                        <Link href={`/specialties/${slugifySpecialty(s.specialty)}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          {s.specialty}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(s.payments)}</td>
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

        {/* Explore More */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore More</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/states" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Browse</div>
              <div className="font-medium text-blue-600">← All States</div>
            </Link>
            <Link href={`/states/${code}/fraud-risk`} className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Fraud Analysis</div>
              <div className="font-medium text-blue-600">Fraud risk in {name} →</div>
            </Link>
            <Link href={`/states/${code}/compare`} className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Compare</div>
              <div className="font-medium text-blue-600">Compare {code} to other states →</div>
            </Link>
            <Link href="/fraud/watchlist" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Watchlist</div>
              <div className="font-medium text-blue-600">Flagged providers in {code} →</div>
            </Link>
            <Link href="/investigations/medicare-spending-by-state" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Investigation</div>
              <div className="font-medium text-blue-600">State spending breakdown →</div>
            </Link>
            <Link href="/investigations/geographic-inequality" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Investigation</div>
              <div className="font-medium text-blue-600">Geographic inequality →</div>
            </Link>
            {code === 'TX' && (
              <Link href="/investigations/houston-medicare-capital" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
                <div className="text-sm text-gray-500">Investigation</div>
                <div className="font-medium text-blue-600">Houston: Medicare Capital →</div>
              </Link>
            )}
            {code === 'FL' && (
              <Link href="/investigations/florida-infectious-disease" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
                <div className="text-sm text-gray-500">Investigation</div>
                <div className="font-medium text-blue-600">Florida&apos;s Fraud Factory →</div>
              </Link>
            )}
            {code === 'AZ' && (
              <Link href="/investigations/arizona-wound-care-ring" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
                <div className="text-sm text-gray-500">Investigation</div>
                <div className="font-medium text-blue-600">Arizona Wound Care Ring →</div>
              </Link>
            )}
            {code === 'CA' && (
              <Link href="/investigations/beverly-hills-billing" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
                <div className="text-sm text-gray-500">Investigation</div>
                <div className="font-medium text-blue-600">Beverly Hills Billing →</div>
              </Link>
            )}
          </div>
        </div>

        <ShareButtons url={`https://www.openmedicare.org/states/${code}`} title={`${name} Medicare Spending — OpenMedicare`} />
        <SourceCitation lastUpdated="February 2026 (data through 2023, the latest CMS release)" />
      </div>
    </main>
  )
}
