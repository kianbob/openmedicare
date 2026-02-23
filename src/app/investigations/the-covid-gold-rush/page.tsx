import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import ArticleJsonLd from '@/components/ArticleJsonLd'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: 'The COVID Gold Rush: $2.8B in Test Billing',
  description: 'Medicare paid $2.8 billion for COVID tests — and most of it went to a handful of states. Inside the biggest billing gold rush in Medicare history.',
  openGraph: {
    title: 'The COVID Gold Rush: $2.8B in Test Billing',
    description: 'Medicare paid $2.8 billion for COVID tests — and most of it went to a handful of states. Inside the biggest billing gold rush in Medicare history.',
  },
}

interface CovidProvider {
  npi: string
  name: string
  specialty: string
  city: string
  state: string
  entity_type: string
  covid_services: number
  covid_beneficiaries: number
  covid_payments: number
}

interface YearlyTrend {
  year: number
  services: number
  beneficiaries: number
  payments: number
  providers: number
}

interface StateBreakdown {
  state: string
  payments: number
  providers: number
  beneficiaries: number
}

interface CovidData {
  total_covid_payments: number
  top_providers: CovidProvider[]
  yearly_trends: YearlyTrend[]
  state_breakdown: StateBreakdown[]
}

function loadData(): CovidData {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'covid-test-billing.json'), 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { total_covid_payments: 0, top_providers: [], yearly_trends: [], state_breakdown: [] }
  }
}

export default function CovidGoldRushPage() {
  const data = loadData()
  const totalPayments = data.total_covid_payments
  const trends = data.yearly_trends
  const states = data.state_breakdown.slice(0, 15)
  const topProviders = data.top_providers.slice(0, 20)

  // Compute stats
  const totalServices = trends.reduce((sum, t) => sum + t.services, 0)
  const totalBeneficiaries = trends.reduce((sum, t) => sum + t.beneficiaries, 0)
  const totalProviderCount = trends.reduce((sum, t) => sum + t.providers, 0)

  // Top billing states
  const topState = states[0]
  const floridaState = states.find(s => s.state === 'FL')
  const texasState = states.find(s => s.state === 'TX')
  const californiaState = states.find(s => s.state === 'CA')

  // Top provider
  const topProvider = topProviders[0]

  // Illinois labs (dominant pattern)
  const illinoisProviders = topProviders.filter(p => p.state === 'IL')
  const floridaProviders = topProviders.filter(p => p.state === 'FL')
  const chicagoLabs = topProviders.filter(p => p.city === 'Chicago')

  // YoY change
  const yoy = trends.length >= 2 ? ((trends[1].payments - trends[0].payments) / trends[0].payments * 100) : 0

  return (
    <main className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="The COVID Gold Rush: How $2.8B in Test Billing Changed Medicare Forever"
        description="When the pandemic hit, COVID testing became the biggest gold rush in Medicare history."
        publishedDate="2026-02-21"
        url="https://www.openmedicare.com/investigations/the-covid-gold-rush"
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'The COVID Gold Rush', href: '/investigations/the-covid-gold-rush' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Investigation</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            The COVID Gold Rush: How {formatCurrency(totalPayments)} in Test Billing Changed Medicare Forever
          </h1>
          <p className="text-gray-500 text-sm mb-2">Published February 2026 · 14 min read</p>
          <ShareButtons title="The COVID Gold Rush" url="https://www.openmedicare.com/investigations/the-covid-gold-rush" />

          {/* Hero stat */}
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg mb-8 mt-8 not-prose">
            <p className="text-red-900 font-medium text-lg">The Bottom Line</p>
            <p className="text-red-800 mt-2">
              Between 2022 and 2023, Medicare paid <strong>{formatCurrency(totalPayments)}</strong> for COVID-related testing services — {formatNumber(totalServices)} individual services across {formatNumber(totalBeneficiaries)} beneficiaries. The money flowed disproportionately to a small number of providers in a handful of states.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Pandemic Created a New Industry Overnight</h2>

          <p className="text-gray-700 mb-4">
            When COVID-19 swept the nation, the federal government did something unprecedented: it told Medicare to pay for COVID tests with almost no questions asked. Emergency waivers removed prior authorization requirements. Telehealth rules were relaxed. New billing codes were fast-tracked.
          </p>

          <p className="text-gray-700 mb-4">
            The result was predictable. A massive new revenue stream appeared overnight, and entrepreneurs — some legitimate, many questionable — rushed to tap it. Pop-up testing sites appeared in strip malls. Pharmacies pivoted to testing. Clinical laboratories multiplied like mushrooms after rain.
          </p>

          <p className="text-gray-700 mb-4">
            Our analysis of CMS Medicare Part B data reveals the full picture of where that money went — and the patterns are striking.
          </p>

          {/* Year over year */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Numbers: Year by Year</h2>
        </article>

        <div className="bg-white rounded-xl shadow-sm border p-8 my-8">
          <h3 className="text-xl font-bold mb-6 text-gray-900">COVID Test Billing — Year-Over-Year Trends</h3>
          <div className="space-y-6">
            {trends.map((t) => (
              <div key={t.year} className="border-b pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">{t.year}</span>
                  <span className="text-2xl font-bold text-red-600">{formatCurrency(t.payments)}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Services:</span>{' '}
                    <span className="font-medium">{formatNumber(t.services)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Beneficiaries:</span>{' '}
                    <span className="font-medium">{formatNumber(t.beneficiaries)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Providers:</span>{' '}
                    <span className="font-medium">{t.providers.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {yoy !== 0 && (
            <p className="text-sm text-gray-500 mt-4">
              Year-over-year change: <span className={yoy > 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                {yoy > 0 ? '+' : ''}{yoy.toFixed(1)}%
              </span> in payments from {trends[0]?.year} to {trends[1]?.year}.
            </p>
          )}
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            The jump from {formatCurrency(trends[0]?.payments || 0)} in {trends[0]?.year} to {formatCurrency(trends[1]?.payments || 0)} in {trends[1]?.year} — a <strong>{yoy.toFixed(1)}%</strong> increase — tells a clear story. Even as the acute pandemic phase waned, COVID test billing <em>surged</em>. More providers entered the market. More services were billed. The gold rush was accelerating, not slowing down.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Follow the Money: The State Breakdown</h2>

          <p className="text-gray-700 mb-4">
            COVID test billing wasn&apos;t evenly distributed across America. It concentrated heavily in a few states — and the leader may surprise you.
          </p>
        </article>

        <div className="bg-gray-900 text-white rounded-xl p-8 my-8">
          <h3 className="text-xl font-bold mb-6 text-red-400">Top 10 States by COVID Test Payments</h3>
          <div className="space-y-4">
            {states.slice(0, 10).map((s, i) => {
              const pct = (s.payments / totalPayments * 100)
              return (
                <div key={s.state} className="flex items-center gap-4">
                  <span className="text-gray-500 w-6 text-right text-sm">{i + 1}.</span>
                  <Link href={`/states/${s.state}`} className="text-red-400 hover:text-red-300 font-bold w-8">
                    {s.state}
                  </Link>
                  <div className="flex-1 bg-gray-800 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-red-600 h-full rounded-full flex items-center pl-2"
                      style={{ width: `${Math.max(pct / (states[0].payments / totalPayments * 100) * 100, 8)}%` }}
                    >
                      <span className="text-xs font-medium text-white whitespace-nowrap">{formatCurrency(s.payments)}</span>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm w-16 text-right">{pct.toFixed(1)}%</span>
                </div>
              )
            })}
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            <strong>Illinois dominates.</strong> With {formatCurrency(topState?.payments || 0)} in COVID test payments — <strong>{((topState?.payments || 0) / totalPayments * 100).toFixed(1)}%</strong> of the national total — Illinois received more than Florida and Texas <em>combined</em>. That&apos;s {topState?.providers.toLocaleString()} providers billing for {formatNumber(topState?.beneficiaries || 0)} beneficiaries.
          </p>

          <p className="text-gray-700 mb-4">
            <Link href="/states/FL" className="text-blue-600 hover:underline">Florida</Link> came in second at {formatCurrency(floridaState?.payments || 0)}, followed by <Link href="/states/TX" className="text-blue-600 hover:underline">Texas</Link> at {formatCurrency(texasState?.payments || 0)} and <Link href="/states/CA" className="text-blue-600 hover:underline">California</Link> at {formatCurrency(californiaState?.payments || 0)}.
          </p>

          <p className="text-gray-700 mb-4">
            The Illinois concentration is particularly notable because the state doesn&apos;t have the largest Medicare population. What it does have is a cluster of clinical laboratories in and around Chicago that became testing powerhouses.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Top Billers: Who Profited Most?</h2>

          <InvestigationDisclaimer />

          <p className="text-gray-700 mb-4">
            The top 20 COVID test billers in Medicare tell a remarkable story. A single provider — {topProvider?.name} in {topProvider?.city}, {topProvider?.state} — billed <strong>{formatCurrency(topProvider?.covid_payments || 0)}</strong> for {formatNumber(topProvider?.covid_services || 0)} services to {formatNumber(topProvider?.covid_beneficiaries || 0)} beneficiaries.
          </p>

          <p className="text-gray-700 mb-4">
            That&apos;s {formatCurrency((topProvider?.covid_payments || 0) / (topProvider?.covid_beneficiaries || 1))} per beneficiary — far above the national average.
          </p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden my-8">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="text-lg font-bold text-gray-900">Top 20 COVID Test Billers in Medicare</h3>
            <p className="text-sm text-gray-500">Ranked by total payments received</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-600">#</th>
                  <th className="text-left p-3 font-medium text-gray-600">Provider</th>
                  <th className="text-left p-3 font-medium text-gray-600">Specialty</th>
                  <th className="text-left p-3 font-medium text-gray-600">Location</th>
                  <th className="text-right p-3 font-medium text-gray-600">Payments</th>
                  <th className="text-right p-3 font-medium text-gray-600">Services</th>
                </tr>
              </thead>
              <tbody>
                {topProviders.map((p, i) => (
                  <tr key={p.npi} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 text-gray-500">{i + 1}</td>
                    <td className="p-3 font-medium text-gray-900">{p.name}</td>
                    <td className="p-3 text-gray-600">{p.specialty}</td>
                    <td className="p-3 text-gray-600">{p.city}, {p.state}</td>
                    <td className="p-3 text-right font-mono text-red-600">{formatCurrency(p.covid_payments)}</td>
                    <td className="p-3 text-right font-mono">{formatNumber(p.covid_services)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Chicago Lab Cluster</h2>

          <p className="text-gray-700 mb-4">
            Zoom in on the top billers and a pattern jumps out: <strong>Chicago-area clinical laboratories dominate the list.</strong> Among the top 20, {chicagoLabs.length} are based in Chicago itself. Names like Vcare Testing Centre Corp, Chicago Care Lab Services, and S K Diagnostics — entities that billed tens of millions each.
          </p>

          <p className="text-gray-700 mb-4">
            Several of these labs share characteristics common to <Link href="/fraud/covid-tests" className="text-blue-600 hover:underline">known COVID testing fraud schemes</Link>: they were newly formed, they billed enormous volumes, and they served suspiciously large numbers of beneficiaries relative to their size.
          </p>

          <p className="text-gray-700 mb-4">
            The top 5 providers alone — all from Florida, Illinois, and Georgia — accounted for over <strong>{formatCurrency(topProviders.slice(0, 5).reduce((sum, p) => sum + p.covid_payments, 0))}</strong> in Medicare payments. To put that in perspective, that&apos;s more than many states received in total.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Florida Connection</h2>

          <p className="text-gray-700 mb-4">
            Florida&apos;s role in the COVID gold rush deserves special attention. With {floridaState?.providers.toLocaleString()} providers billing for COVID tests — the most of any state — Florida was the <em>epicenter of provider proliferation</em>. While Illinois had higher total payments with fewer providers, Florida&apos;s {floridaState?.providers.toLocaleString()} providers suggest a wider, more distributed billing pattern.
          </p>

          <p className="text-gray-700 mb-4">
            The top Florida biller, {floridaProviders[0]?.name}, a <strong>{floridaProviders[0]?.specialty}</strong> in {floridaProviders[0]?.city}, billed {formatCurrency(floridaProviders[0]?.covid_payments || 0)} — notable because pharmacies don&apos;t traditionally perform the volume of laboratory testing implied by {formatNumber(floridaProviders[0]?.covid_services || 0)} services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What the Data Reveals</h2>

          <p className="text-gray-700 mb-4">
            Several patterns emerge from our analysis:
          </p>

          <div className="bg-blue-50 border rounded-xl p-6 my-6 not-prose">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Key Patterns in COVID Test Billing</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold text-lg">1.</span>
                <div>
                  <p className="font-medium text-blue-900">Geographic Concentration</p>
                  <p className="text-blue-800 text-sm">Just 4 states (IL, FL, TX, CA) received {(((states[0]?.payments || 0) + (states[1]?.payments || 0) + (states[2]?.payments || 0) + (states[3]?.payments || 0)) / totalPayments * 100).toFixed(1)}% of all COVID test payments.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold text-lg">2.</span>
                <div>
                  <p className="font-medium text-blue-900">Specialty Mismatch</p>
                  <p className="text-blue-800 text-sm">Pharmacies and non-laboratory entities appear prominently among top billers — an unusual pattern for diagnostic testing.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold text-lg">3.</span>
                <div>
                  <p className="font-medium text-blue-900">Volume Extremes</p>
                  <p className="text-blue-800 text-sm">Top providers billed millions of services — volumes that raise questions about whether legitimate testing could occur at this scale.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold text-lg">4.</span>
                <div>
                  <p className="font-medium text-blue-900">Year-Over-Year Growth</p>
                  <p className="text-blue-800 text-sm">Billing grew {yoy.toFixed(0)}% from {trends[0]?.year} to {trends[1]?.year}, even as pandemic urgency declined.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Bigger Picture</h2>

          <p className="text-gray-700 mb-4">
            The COVID testing gold rush didn&apos;t happen in a vacuum. It&apos;s part of a larger story about how Medicare&apos;s fee-for-service system responds to emergencies. When normal oversight mechanisms are relaxed — even for good reasons — the system becomes vulnerable to exploitation.
          </p>

          <p className="text-gray-700 mb-4">
            The Department of Justice has already brought <Link href="/fraud/covid-tests" className="text-blue-600 hover:underline">dozens of fraud cases</Link> related to COVID testing. But the data suggests the problem is far larger than what&apos;s been prosecuted. Many of the billing patterns we see in the data match profiles of known fraud — but involve providers that haven&apos;t been charged.
          </p>

          <p className="text-gray-700 mb-4">
            Explore the <Link href="/trends" className="text-blue-600 hover:underline">full trend data</Link> yourself, or dive into specific states like <Link href="/states/FL" className="text-blue-600 hover:underline">Florida</Link> and <Link href="/states/CA" className="text-blue-600 hover:underline">California</Link> to see the patterns in your area.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Methodology</h2>

          <p className="text-gray-700 mb-4">
            This analysis uses Medicare Part B Public Use Files from CMS, filtered to HCPCS codes associated with COVID-19 testing (including U0001, U0002, U0003, U0004, U0005, 87426, 87428, 87635, 87636, and related codes). All payment figures reflect actual Medicare payments, not billed charges. Provider counts reflect unique NPIs billing at least one COVID-related service in a given year.
          </p>
        </article>

        <div className="bg-gray-50 rounded-lg p-6 mt-8 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/covid-test-scheme" className="text-medicare-primary hover:underline text-sm">🦠 The COVID Test Billing Scheme</Link>
            <Link href="/fraud/covid-tests" className="text-medicare-primary hover:underline text-sm">📊 COVID Test Billing Data</Link>
            <Link href="/investigations/the-4636-impossible-doctors" className="text-medicare-primary hover:underline text-sm">🧮 The 4,636 Impossible Doctors</Link>
            <Link href="/investigations/florida-medicare-fraud" className="text-medicare-primary hover:underline text-sm">🌴 Florida&apos;s Fraud Factory</Link>
          </div>
        </div>

        <ShareButtons url="https://www.openmedicare.com/investigations/the-covid-gold-rush" title="The COVID Gold Rush: How $2.8B in Test Billing Changed Medicare Forever" />
        <div className="mt-6">
          <SourceCitation />
        </div>
      </div>
    </main>
  )
}
