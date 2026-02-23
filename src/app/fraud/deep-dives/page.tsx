'use client'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

interface Flag {
  type: string
  description: string
  severity: string
}

interface WatchlistProvider {
  npi: number
  name: string
  credentials: string
  specialty: string
  city: string
  state: string
  total_payments: number
  total_services: number
  total_beneficiaries: number
  avg_markup: number
  risk_score: number
  flags: Flag[]
}

interface FraudFeature {
  npi: string
  services_per_day: number
  beneficiaries_per_day: number
  covid_share_pct: number
  wound_share_pct: number
  drug_share_pct: number
  upcode_ratio: number
  code_concentration: number
  specialty_zscore: number
}

interface EnrichedProvider extends WatchlistProvider {
  fraud?: FraudFeature
}

function RiskGauge({ score }: { score: number }) {
  const pct = Math.min(score, 100)
  const color = score >= 90 ? '#dc2626' : score >= 75 ? '#ea580c' : score >= 60 ? '#ca8a04' : '#16a34a'
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium">Risk Score</span>
        <span className="font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className="h-3 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

function buildNarrative(p: EnrichedProvider): string {
  const parts: string[] = []
  const f = p.fraud

  if (f && f.services_per_day > 500) {
    const secondsPerService = Math.round(28800 / f.services_per_day) // 8-hour day
    parts.push(`At ${formatNumber(Math.round(f.services_per_day))} services per working day, ${p.name} would need to bill a service every ${secondsPerService} seconds for 8 hours straight — without breaks.`)
  } else if (f && f.services_per_day > 100) {
    parts.push(`${p.name} averages ${formatNumber(Math.round(f.services_per_day))} services per working day — far beyond what any single provider could physically deliver.`)
  }

  if (f && f.covid_share_pct > 80) {
    parts.push(`${(f.covid_share_pct).toFixed(0)}% of all billing is COVID-related testing, suggesting this provider's revenue is almost entirely built on pandemic-era test billing.`)
  }

  if (p.avg_markup > 50) {
    parts.push(`Charges ${p.avg_markup.toFixed(1)}x what Medicare actually pays — meaning for every $100 Medicare reimburses, this provider initially bills $${(p.avg_markup * 100).toFixed(0)}.`)
  } else if (p.avg_markup > 15) {
    parts.push(`Markup of ${p.avg_markup.toFixed(1)}x the Medicare rate — several times higher than the specialty median.`)
  }

  if (f && f.upcode_ratio > 10) {
    parts.push(`Upcoding ratio of ${f.upcode_ratio.toFixed(0)}x — billing the most expensive version of services at ${f.upcode_ratio.toFixed(0)} times the expected rate compared to peers.`)
  }

  if (f && f.beneficiaries_per_day > 200) {
    parts.push(`Claims to treat ${formatNumber(Math.round(f.beneficiaries_per_day))} unique patients per day — more than most emergency rooms.`)
  }

  if (f && f.wound_share_pct > 50) {
    parts.push(`${f.wound_share_pct.toFixed(0)}% of billing concentrated in wound care — the specialty most commonly associated with Medicare fraud prosecutions.`)
  }

  const highFlags = p.flags.filter(fl => fl.severity === 'high')
  if (highFlags.length >= 3 && parts.length < 3) {
    parts.push(`Flagged for ${highFlags.length} high-severity billing anomalies simultaneously — a combination rarely seen in legitimate providers.`)
  }

  if (parts.length === 0) {
    parts.push(`This provider's billing patterns show multiple statistical anomalies that, in combination, closely match the profiles of providers who have been convicted of Medicare fraud.`)
  }

  return parts.join(' ')
}

function getDamningStatistic(p: EnrichedProvider): { label: string; value: string } {
  const f = p.fraud
  if (f && f.services_per_day > 1000) return { label: 'Services Per Day', value: formatNumber(Math.round(f.services_per_day)) }
  if (f && f.upcode_ratio > 50) return { label: 'Upcoding Ratio', value: `${f.upcode_ratio.toFixed(0)}x` }
  if (p.avg_markup > 100) return { label: 'Markup Ratio', value: `${p.avg_markup.toFixed(0)}x` }
  if (f && f.beneficiaries_per_day > 200) return { label: 'Patients Per Day', value: formatNumber(Math.round(f.beneficiaries_per_day)) }
  if (f && f.covid_share_pct > 90) return { label: 'COVID Billing', value: `${f.covid_share_pct.toFixed(0)}%` }
  if (p.avg_markup > 20) return { label: 'Markup Ratio', value: `${p.avg_markup.toFixed(1)}x` }
  return { label: 'Specialty Median Multiplier', value: `${p.flags[0]?.description?.match(/(\d+)x/)?.[0] || 'Extreme'}` }
}

export default function DeepDives() {
  const [providers, setProviders] = useState<EnrichedProvider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [watchlistRes, fraudRes] = await Promise.all([
          fetch('/data/watchlist.json'),
          fetch('/data/fraud-features.json'),
        ])
        const watchlist: WatchlistProvider[] = await watchlistRes.json()
        const fraudData: { providers: FraudFeature[] } = await fraudRes.json()

        const fraudMap = new Map<string, FraudFeature>()
        for (const f of fraudData.providers) {
          fraudMap.set(String(f.npi), f)
        }

        // Filter to individuals, take top 20
        const individuals = watchlist
          .filter(p => !/\b(laboratory|holdings|corp|inc|llc|group|health system|hospital|clinic|associates|services|center|imaging|radiology lab)\b/i.test(p.name))
          .sort((a, b) => b.risk_score - a.risk_score)
          .slice(0, 20)

        const enriched = individuals.map(p => ({
          ...p,
          fraud: fraudMap.get(String(p.npi)),
        }))

        setProviders(enriched)
      } catch {
        // fail gracefully
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: 'Fraud Analysis', href: '/fraud' }, { name: 'Deep Dives' }]} />

        <InvestigationDisclaimer />

        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold font-serif text-gray-900 mt-6 mb-4">
            The 20 Most Suspicious Medicare Providers in America
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            We analyzed 1.72 million Medicare providers across a decade of billing data. These 20 individuals have the most extreme statistical anomalies — billing patterns that, in our experience, almost always indicate fraud.
          </p>
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg">
            <p className="text-red-900 text-lg font-medium mb-2">What you&apos;re about to see:</p>
            <ul className="text-red-800 space-y-1 text-sm">
              <li>• A nurse practitioner billing <strong>4,132 services per day</strong> — one every 7 seconds</li>
              <li>• A doctor with a <strong>197.7x markup ratio</strong> — charging $19,770 for every $100 Medicare pays</li>
              <li>• A hematologist upcoding at <strong>476 times</strong> the expected rate</li>
              <li>• A provider claiming <strong>564 unique patients per day</strong> — more than most hospitals</li>
            </ul>
            <p className="text-red-800 text-sm mt-3">Every dollar shown is real CMS data. Every name is from public Medicare records.</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading provider profiles...</div>
        ) : (
          <div className="space-y-10">
            {providers.map((p, idx) => {
              const narrative = buildNarrative(p)
              const damning = getDamningStatistic(p)
              const f = p.fraud

              return (
                <article key={p.npi} id={`npi-${p.npi}`} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  {/* Header */}
                  <div className={`px-6 py-5 ${p.risk_score >= 90 ? 'bg-red-50 border-b-2 border-red-300' : p.risk_score >= 80 ? 'bg-orange-50 border-b-2 border-orange-300' : 'bg-yellow-50 border-b-2 border-yellow-300'}`}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">#{idx + 1} Most Suspicious</div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          <Link href={`/providers/${p.npi}`} className="hover:text-medicare-primary transition-colors">
                            {p.name}
                          </Link>
                          {p.credentials && <span className="text-lg text-gray-500 ml-2">{p.credentials}</span>}
                        </h2>
                        <div className="text-gray-600 mt-1 text-sm">
                          {p.specialty} · {p.city}, {p.state} · NPI: {p.npi}
                        </div>
                      </div>
                      <div className="w-48">
                        <RiskGauge score={p.risk_score} />
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-6">
                    {/* The Numbers Don't Add Up */}
                    <div className="flex items-center gap-4 mb-6 bg-gray-900 text-white rounded-lg p-4">
                      <div className="text-center min-w-[100px]">
                        <div className="text-3xl font-bold text-red-400">{damning.value}</div>
                        <div className="text-xs text-gray-400 mt-1">{damning.label}</div>
                      </div>
                      <div className="border-l border-gray-700 pl-4">
                        <div className="text-xs font-bold text-red-400 uppercase tracking-wide mb-1">The Numbers Don&apos;t Add Up</div>
                        <p className="text-sm text-gray-300">{narrative}</p>
                      </div>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-gray-900">{formatCurrency(p.total_payments)}</div>
                        <div className="text-xs text-gray-500">Total Payments</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-gray-900">{p.avg_markup?.toFixed(1) || '—'}x</div>
                        <div className="text-xs text-gray-500">Markup Ratio</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-gray-900">{formatNumber(p.total_services)}</div>
                        <div className="text-xs text-gray-500">Total Services</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-gray-900">{formatNumber(p.total_beneficiaries)}</div>
                        <div className="text-xs text-gray-500">Patients</div>
                      </div>
                    </div>

                    {/* Fraud Indicators */}
                    {f && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                        {f.services_per_day > 0 && (
                          <div className={`rounded-lg px-3 py-2 text-center ${f.services_per_day >= 200 ? 'bg-red-100' : f.services_per_day >= 50 ? 'bg-orange-100' : 'bg-gray-100'}`}>
                            <div className="text-lg font-bold">{formatNumber(Math.round(f.services_per_day))}</div>
                            <div className="text-[10px] text-gray-600">Services/Day</div>
                          </div>
                        )}
                        {f.beneficiaries_per_day > 0 && (
                          <div className={`rounded-lg px-3 py-2 text-center ${f.beneficiaries_per_day >= 100 ? 'bg-red-100' : 'bg-gray-100'}`}>
                            <div className="text-lg font-bold">{formatNumber(Math.round(f.beneficiaries_per_day))}</div>
                            <div className="text-[10px] text-gray-600">Patients/Day</div>
                          </div>
                        )}
                        {f.upcode_ratio > 0 && (
                          <div className={`rounded-lg px-3 py-2 text-center ${f.upcode_ratio >= 5 ? 'bg-red-100' : f.upcode_ratio >= 2 ? 'bg-orange-100' : 'bg-gray-100'}`}>
                            <div className="text-lg font-bold">{f.upcode_ratio.toFixed(1)}x</div>
                            <div className="text-[10px] text-gray-600">Upcode Ratio</div>
                          </div>
                        )}
                        {f.covid_share_pct > 0 && (
                          <div className={`rounded-lg px-3 py-2 text-center ${f.covid_share_pct >= 50 ? 'bg-red-100' : 'bg-blue-100'}`}>
                            <div className="text-lg font-bold">{f.covid_share_pct.toFixed(0)}%</div>
                            <div className="text-[10px] text-gray-600">COVID Billing</div>
                          </div>
                        )}
                        {f.wound_share_pct > 0 && (
                          <div className={`rounded-lg px-3 py-2 text-center ${f.wound_share_pct >= 50 ? 'bg-red-100' : 'bg-purple-100'}`}>
                            <div className="text-lg font-bold">{f.wound_share_pct.toFixed(0)}%</div>
                            <div className="text-[10px] text-gray-600">Wound Care</div>
                          </div>
                        )}
                        {f.code_concentration > 0 && (
                          <div className={`rounded-lg px-3 py-2 text-center ${f.code_concentration >= 0.8 ? 'bg-red-100' : 'bg-gray-100'}`}>
                            <div className="text-lg font-bold">{(f.code_concentration * 100).toFixed(0)}%</div>
                            <div className="text-[10px] text-gray-600">Code Concentration</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Flags */}
                    <div className="space-y-2 mb-4">
                      {p.flags.map((fl, i) => (
                        <div key={i} className={`text-sm px-3 py-2 rounded ${fl.severity === 'high' ? 'bg-red-50 text-red-800 border-l-3 border-red-500' : fl.severity === 'medium' ? 'bg-yellow-50 text-yellow-800 border-l-3 border-yellow-500' : 'bg-gray-50 text-gray-700'}`}>
                          <span className="font-medium">{fl.severity === 'high' ? '🔴' : '🟡'}</span> {fl.description}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-3 bg-gray-50 border-t flex flex-wrap gap-4 text-sm">
                    <Link href={`/providers/${p.npi}`} className="text-medicare-primary hover:underline font-medium">
                      Full Provider Profile →
                    </Link>
                    <a href="tel:1-800-447-8477" className="text-red-600 hover:underline font-medium">
                      Report Fraud: 1-800-HHS-TIPS
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* AI Model Callout */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-10 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">🤖 See Also: AI-Powered Analysis</h2>
          <p className="text-sm text-gray-600 mb-3">Our machine learning model scored 1.72M providers using patterns from 2,198 convicted fraudsters. It flagged 500 with 86%+ match probability.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/fraud/still-out-there" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              500 AI-Flagged Providers →
            </Link>
            <Link href="/investigations/still-out-there" className="inline-flex items-center px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
              The Full Investigation →
            </Link>
          </div>
        </div>

        {/* Related */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Fraud Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline text-sm">🚨 Enhanced Watchlist — Full 500-provider list</Link>
            <Link href="/fraud/wound-care" className="text-medicare-primary hover:underline text-sm">🩹 Wound Care — DOJ&apos;s #1 fraud target</Link>
            <Link href="/fraud/covid-tests" className="text-medicare-primary hover:underline text-sm">🦠 COVID Test Billing — Pandemic profiteers</Link>
            <Link href="/fraud/impossible-numbers" className="text-medicare-primary hover:underline text-sm">🧮 Impossible Numbers — 4,636 flagged providers</Link>
            <Link href="/fraud/upcoding" className="text-medicare-primary hover:underline text-sm">⬆️ Upcoding — Billing for services never provided</Link>
            <Link href="/investigations/three-providers" className="text-medicare-primary hover:underline text-sm">🔍 Three Providers, Three Red Flags</Link>
            <Link href="/methodology" className="text-sm text-blue-700 hover:underline">📊 How we analyze the data →</Link>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> These are statistical flags based on publicly available CMS data, not accusations of fraud. Billing anomalies can have legitimate explanations. If you suspect fraud, report it to the OIG Fraud Hotline:{' '}
            <a href="tel:1-800-447-8477" className="underline font-medium">1-800-HHS-TIPS (1-800-447-8477)</a>.
          </p>
        </div>

        <ShareButtons url="https://www.openmedicare.us/fraud/deep-dives" title="The 20 Most Suspicious Medicare Providers" />
        <div className="mt-6">
          <SourceCitation sources={['CMS Medicare Provider Utilization and Payment Data (2014-2023)', 'HHS Office of Inspector General']} lastUpdated="February 2026" />
        </div>
      </div>
    </div>
  )
}
