import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber, formatLargeNumber } from '@/lib/format'

interface ProcedureData {
  code: string
  description: string
  top_providers: { npi: string; name: string; specialty: string; state: string; payments: number; services: number }[]
  state_breakdown: { state: string; payments: number; services: number; providers: number }[]
  yearly_trends: { year: number; payments: number; services: number; avg_payment: number }[]
}

function loadProcedure(code: string): ProcedureData | null {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'procedures', `${code}.json`), 'utf-8')
    return JSON.parse(raw)
  } catch { return null }
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'public', 'data', 'procedures')
  try {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))
    // Sort by file size descending (more data = more interesting)
    const withSize = files.map(f => ({
      name: f,
      size: fs.statSync(path.join(dir, f)).size,
    }))
    withSize.sort((a, b) => b.size - a.size)
    return withSize.slice(0, 100).map(f => ({ code: f.name.replace('.json', '') }))
  } catch { return [] }
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params
  const data = loadProcedure(code)
  const desc = data?.description || `Procedure ${code}`
  return {
    title: `How Much Does ${desc} Cost on Medicare? | OpenMedicare`,
    description: `Medicare cost analysis for ${desc} (CPT ${code}). Average payment, state-by-state variation, yearly trends, and top billing providers.`,
  }
}

export default async function ProcedureCostPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const data = loadProcedure(code)
  if (!data) notFound()

  const trends = data.yearly_trends || []
  const states = (data.state_breakdown || []).sort((a, b) => b.payments - a.payments)
  const providers = (data.top_providers || []).sort((a, b) => b.payments - a.payments)

  // Calculate overall averages
  const totalPayments = trends.reduce((s, t) => s + t.payments, 0)
  const totalServices = trends.reduce((s, t) => s + t.services, 0)
  const overallAvgPayment = totalServices > 0 ? totalPayments / totalServices : 0

  // Latest year data
  const latestYear = trends.length > 0 ? trends[trends.length - 1] : null
  const firstYear = trends.length > 0 ? trends[0] : null

  // Calculate avg submitted charge from state data (approximate from markup)
  const avgStatePayment = states.length > 0
    ? states.reduce((s, st) => s + st.payments, 0) / states.reduce((s, st) => s + st.services, 0)
    : 0

  // State cost variation
  const stateAvgPayments = states
    .filter(s => s.services > 100)
    .map(s => ({ state: s.state, avg: s.payments / s.services, services: s.services, payments: s.payments }))
    .sort((a, b) => b.avg - a.avg)

  const mostExpensiveState = stateAvgPayments[0]
  const cheapestState = stateAvgPayments[stateAvgPayments.length - 1]
  const priceVariation = mostExpensiveState && cheapestState
    ? (mostExpensiveState.avg / cheapestState.avg).toFixed(1)
    : null

  // Year-over-year trend
  const yoyChange = latestYear && firstYear
    ? ((latestYear.avg_payment - firstYear.avg_payment) / firstYear.avg_payment * 100).toFixed(1)
    : null

  // Is this procedure overpriced?
  const isOverpriced = priceVariation && parseFloat(priceVariation) > 2

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Procedures', href: '/procedures' },
          { name: `${data.code}`, href: `/procedures/${data.code}` },
          { name: 'Cost Analysis' },
        ]} />

        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
            How Much Does {data.description} Cost on Medicare?
          </h1>
          <p className="text-lg text-gray-600">
            Cost analysis for CPT {data.code} — {data.description}
          </p>
          <ShareButtons
            url={`/procedures/${data.code}/cost`}
            title={`Medicare Cost: ${data.description}`}
            className="mt-4"
          />
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Average Medicare Payment</p>
            <p className="text-3xl font-bold text-medicare-primary">
              {latestYear ? `$${latestYear.avg_payment.toFixed(2)}` : 'N/A'}
            </p>
            {latestYear && <p className="text-xs text-gray-500 mt-1">{latestYear.year} data</p>}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Total Payments ({latestYear?.year || 'Latest'})</p>
            <p className="text-3xl font-bold text-gray-900">
              {latestYear ? formatCurrency(latestYear.payments) : 'N/A'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Services ({latestYear?.year || 'Latest'})</p>
            <p className="text-3xl font-bold text-gray-900">
              {latestYear ? formatNumber(latestYear.services) : 'N/A'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Price Change ({firstYear?.year}–{latestYear?.year})</p>
            <p className={`text-3xl font-bold ${yoyChange && parseFloat(yoyChange) > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {yoyChange ? `${parseFloat(yoyChange) > 0 ? '+' : ''}${yoyChange}%` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Year-over-Year Trend */}
        {trends.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 Year-over-Year Cost Trend</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Payment</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Payments</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Services</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">YoY Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trends.map((t, i) => {
                    const prev = i > 0 ? trends[i - 1] : null
                    const change = prev && prev.avg_payment > 0 ? ((t.avg_payment - prev.avg_payment) / prev.avg_payment * 100) : null
                    return (
                      <tr key={t.year} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{t.year}</td>
                        <td className="px-4 py-3 text-right">${t.avg_payment.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(t.payments)}</td>
                        <td className="px-4 py-3 text-right">{formatNumber(t.services)}</td>
                        <td className="px-4 py-3 text-right">
                          {change !== null ? (
                            <span className={change > 0 ? 'text-red-600' : 'text-green-600'}>
                              {change > 0 ? '+' : ''}{change.toFixed(1)}%
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

        {/* State-by-State Cost Variation */}
        {stateAvgPayments.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🗺️ State-by-State Cost Variation</h2>
            {priceVariation && (
              <p className="text-gray-600 mb-4">
                The most expensive state pays <strong>{priceVariation}x</strong> more than the cheapest for this procedure.
                {mostExpensiveState && cheapestState && (
                  <> {mostExpensiveState.state} averages ${mostExpensiveState.avg.toFixed(2)} vs {cheapestState.state} at ${cheapestState.avg.toFixed(2)}.</>
                )}
              </p>
            )}
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Payment</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Payments</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Services</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Providers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stateAvgPayments.slice(0, 51).map(s => (
                    <tr key={s.state} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/states/${s.state}`} className="text-medicare-primary hover:underline font-medium">
                          {s.state}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">${s.avg.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(s.payments)}</td>
                      <td className="px-4 py-3 text-right">{formatNumber(s.services)}</td>
                      <td className="px-4 py-3 text-right">
                        {formatNumber(states.find(st => st.state === s.state)?.providers || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Billing Providers */}
        {providers.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 Who Bills the Most for This Procedure?</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Payments</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Services</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg/Service</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {providers.slice(0, 20).map((p) => (
                    <tr key={p.npi} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/providers/${p.npi}`} className="text-medicare-primary hover:underline font-medium">
                          {p.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.specialty}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.state}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium">{formatCurrency(p.payments)}</td>
                      <td className="px-4 py-3 text-right text-sm">{formatNumber(p.services)}</td>
                      <td className="px-4 py-3 text-right text-sm">{p.services > 0 ? `$${(p.payments / p.services).toFixed(2)}` : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Is this procedure overpriced? */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🤔 Is {data.description} Overpriced?</h2>
          <div className="prose prose-gray max-w-none">
            {isOverpriced ? (
              <>
                <p>
                  The data suggests significant pricing inconsistencies for CPT {data.code}. With a <strong>{priceVariation}x price gap</strong> between
                  the most and least expensive states, geography plays an outsized role in what Medicare pays for this procedure.
                </p>
                <p>
                  {yoyChange && parseFloat(yoyChange) > 10 ? (
                    <>Costs have risen <strong>{yoyChange}%</strong> since {firstYear?.year}, outpacing inflation and raising questions about whether
                    reimbursement rates reflect actual costs.</>
                  ) : yoyChange && parseFloat(yoyChange) < -5 ? (
                    <>While costs have decreased {Math.abs(parseFloat(yoyChange))}% since {firstYear?.year}, the wide state-by-state variation
                    suggests the pricing formula may not adequately account for regional differences.</>
                  ) : (
                    <>Costs have remained relatively stable over time, but the geographic variation suggests Medicare&apos;s geographic adjustment
                    factors may not fully capture the true cost differences across states.</>
                  )}
                </p>
              </>
            ) : (
              <>
                <p>
                  Based on the data, CPT {data.code} shows {priceVariation ? `a ${priceVariation}x variation` : 'variation'} in pricing across states —
                  {priceVariation && parseFloat(priceVariation) < 1.5 ? ' relatively consistent' : ' moderate variation'} by Medicare standards.
                </p>
                <p>
                  {yoyChange && parseFloat(yoyChange) > 0 ? (
                    <>Costs have increased {yoyChange}% since {firstYear?.year}. </>
                  ) : yoyChange ? (
                    <>Costs have decreased {Math.abs(parseFloat(yoyChange!))}% since {firstYear?.year}. </>
                  ) : null}
                  Medicare&apos;s fee schedule attempts to standardize pricing, though some variation is expected due to geographic cost-of-living
                  adjustments and practice expense differences.
                </p>
              </>
            )}
            <p className="text-sm text-gray-500 mt-4">
              This analysis is based on publicly available CMS data and does not account for patient complexity, comorbidities,
              or facility-specific factors that may justify pricing differences.
            </p>
          </div>
        </div>

        <SourceCitation
          sources={[
            'Centers for Medicare & Medicaid Services (CMS)',
            'Medicare Provider Utilization and Payment Data (2014-2023)',
            'Medicare Physician Fee Schedule',
          ]}
        />
      </div>
    </main>
  )
}
