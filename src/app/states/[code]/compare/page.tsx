import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

interface StateData {
  state: string
  state_name: string
  total_payments: number
  total_services: number
  total_providers: number
  total_beneficiaries: number
  avg_payment_per_provider: number
  avg_payment_per_service: number
  markup_ratio: number
  payment_share: number
}

interface WatchlistProvider {
  npi: number
  state: string
  risk_score: number
  specialty: string
  flags: { type: string; description: string; severity: string }[]
}

function loadStates(): StateData[] {
  const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'states.json'), 'utf-8'))
  return raw.states || []
}

function loadWatchlist(): WatchlistProvider[] {
  const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'watchlist.json'), 'utf-8'))
  return Array.isArray(raw) ? raw : []
}

export function generateStaticParams() {
  return loadStates().map(s => ({ code: s.state }))
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params
  const states = loadStates()
  const state = states.find(s => s.state === code.toUpperCase())
  const name = state?.state_name || code.toUpperCase()
  return {
    title: `${name} vs National Average: Medicare Spending`,
    description: `See how ${name} stacks up: per-provider payments, markup ratios, flagged providers, and more versus the national average.`,
  }
}

export default async function StateComparePage({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = await params
  const states = loadStates()
  const watchlist = loadWatchlist()
  const code = rawCode.toUpperCase()
  const state = states.find(s => s.state === code)

  if (!state) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="font-serif text-3xl font-bold text-gray-900">State not found</h1>
          <p className="mt-4 text-gray-600">No data available for state code &quot;{code}&quot;.</p>
          <Link href="/states" className="mt-4 inline-block text-blue-600 hover:underline">← Back to States</Link>
        </div>
      </div>
    )
  }

  // National averages
  const totalNationalPayments = states.reduce((sum, s) => sum + s.total_payments, 0)
  const totalNationalProviders = states.reduce((sum, s) => sum + s.total_providers, 0)
  const totalNationalServices = states.reduce((sum, s) => sum + s.total_services, 0)
  const nationalAvgPerProvider = totalNationalProviders > 0 ? totalNationalPayments / totalNationalProviders : 0
  const nationalAvgMarkup = totalNationalPayments > 0 ? states.reduce((sum, s) => sum + s.markup_ratio * s.total_payments, 0) / totalNationalPayments : 0
  const nationalAvgPerService = totalNationalServices > 0 ? totalNationalPayments / totalNationalServices : 0

  // Watchlist for this state
  const stateFlagged = watchlist.filter(w => w.state === code)
  const totalFlagged = watchlist.length

  // Specialty breakdown for this state from watchlist
  const stateSpecialties = new Map<string, number>()
  stateFlagged.forEach(w => {
    stateSpecialties.set(w.specialty, (stateSpecialties.get(w.specialty) || 0) + 1)
  })
  const topStateSpecialties = [...stateSpecialties.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)

  const stateName = state.state_name

  function compareBar(stateVal: number, nationalVal: number, label: string, format: (n: number) => string) {
    const ratio = stateVal / nationalVal
    const pct = ((ratio - 1) * 100)
    const isHigher = pct > 0

    return (
      <div className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</h3>
        <div className="mt-4 flex items-end gap-8">
          <div>
            <p className="text-sm text-gray-500">{stateName}</p>
            <p className="text-2xl font-bold text-gray-900">{format(stateVal)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">National Average</p>
            <p className="text-2xl font-bold text-gray-400">{format(nationalVal)}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${isHigher ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(Math.abs(pct) * 2, 100)}%` }}
              />
            </div>
            <span className={`text-sm font-semibold ${isHigher ? 'text-red-600' : 'text-green-600'}`}>
              {isHigher ? '+' : ''}{pct.toFixed(1)}%
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {isHigher ? 'Above' : 'Below'} national average
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <Breadcrumbs items={[
          { name: 'States', href: '/states' },
          { name: state.state_name, href: `/states/${code}` },
          { name: 'Compare to National Average' },
        ]} />

        <h1 className="mt-8 font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          How {state.state_name} Compares to the National Average
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          A data-driven comparison of Medicare Part B spending in {state.state_name} versus nationwide averages.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {compareBar(state.avg_payment_per_provider, nationalAvgPerProvider, 'Payment per Provider', formatCurrency)}
          {compareBar(state.markup_ratio, nationalAvgMarkup, 'Average Markup Ratio', n => `${n.toFixed(2)}x`)}
          {compareBar(state.avg_payment_per_service, nationalAvgPerService, 'Payment per Service', n => `$${n.toFixed(2)}`)}
          {compareBar(
            state.total_providers > 0 ? stateFlagged.length / state.total_providers * 10000 : 0,
            totalNationalProviders > 0 ? totalFlagged / totalNationalProviders * 10000 : 0,
            'Flagged Providers per 10K Providers',
            n => n.toFixed(1)
          )}
        </div>

        {/* Flagged Providers Summary */}
        <div className="mt-12 rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">Flagged Providers in {state.state_name}</h2>
          <p className="mt-2 text-gray-600">
            {stateFlagged.length} providers on the watchlist out of {formatNumber(state.total_providers)} total providers.
          </p>

          {topStateSpecialties.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Top Flagged Specialties
              </h3>
              <div className="space-y-2">
                {topStateSpecialties.map(([specialty, count]) => (
                  <div key={specialty} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{specialty}</span>
                    <span className="text-sm font-medium text-gray-900">{count} flagged</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(state.total_payments)}</p>
            <p className="mt-1 text-sm text-gray-500">Total Payments</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">{formatNumber(state.total_providers)}</p>
            <p className="mt-1 text-sm text-gray-500">Providers</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">{(state.payment_share ?? 0).toFixed(1)}%</p>
            <p className="mt-1 text-sm text-gray-500">of National Spending</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">{(state.markup_ratio ?? 0).toFixed(2)}x</p>
            <p className="mt-1 text-sm text-gray-500">Markup Ratio</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link href={`/states/${code}`} className="text-blue-600 hover:underline text-sm">← {state.state_name} Overview</Link>
          <Link href="/compare" className="text-blue-600 hover:underline text-sm">Compare Multiple States →</Link>
        </div>

        <div className="mt-12">
          <ShareButtons
            url={`https://www.openmedicare.com/states/${code}/compare`}
            title={`How ${state.state_name} Medicare Spending Compares`}
          />
        </div>

        <div className="mt-8">
          <SourceCitation />
        </div>
      </div>
    </div>
  )
}
