'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ShareFinding from '@/components/ShareFinding'
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

interface Procedure {
  hcpcs_code: string
  description: string
  total_services?: number
  total_payments?: number
  avg_payment?: number
}

interface ProviderDetail {
  name: string
  credentials: string
  specialty: string
  city: string
  state: string
  entity_type: string
  yearly_payments?: Record<string, number>
  overall?: Record<string, number>
  top_procedures?: Procedure[]
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
  detail?: ProviderDetail
  fraud?: FraudFeature
}

const flagExplanations: Record<string, string> = {
  outlier_spending: 'This provider\'s total Medicare payments are hundreds or thousands of times higher than the median for their specialty. This level of spending from a single provider is extremely unusual.',
  high_markup: 'The provider charges far more than what Medicare actually pays, indicating they bill at rates dramatically above the standard fee schedule.',
  beneficiary_stuffing: 'An unusually high number of unique patients — potentially indicating phantom billing or excessive patient volume.',
  volume_anomaly: 'The total number of services billed is far above what\'s normal for this specialty — raising questions about whether one provider could physically deliver this many services.',
  concentration_risk: 'Revenue is concentrated in a very small number of procedure codes, which can indicate repetitive billing for specific high-value services.',
  specialty_mismatch: 'The provider\'s billing pattern doesn\'t match their listed specialty — they may be billing for services outside their expertise.',
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

function FraudBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`rounded px-2 py-1 text-center ${color}`}>
      <div className="text-sm font-bold">{value}</div>
      <div className="text-[10px] text-gray-600">{label}</div>
    </div>
  )
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

        // Build NPI lookup from fraud features
        const fraudMap = new Map<string, FraudFeature>()
        for (const f of fraudData.providers) {
          fraudMap.set(String(f.npi), f)
        }

        // Filter to individuals only (heuristic) and take top 20 by risk_score
        const individuals = watchlist
          .filter(p => !/\b(laboratory|holdings|corp|inc|llc|group|health system|hospital|clinic|associates|services|center|imaging|radiology lab)\b/i.test(p.name))
          .sort((a, b) => b.risk_score - a.risk_score)
          .slice(0, 20)

        // Fetch detail files in parallel, cross-reference with fraud features
        const enriched = await Promise.all(individuals.map(async (p) => {
          const fraud = fraudMap.get(String(p.npi))
          try {
            const res = await fetch(`/data/providers/${p.npi}.json`)
            if (!res.ok) return { ...p, fraud }
            const detail: ProviderDetail = await res.json()
            return { ...p, detail, fraud }
          } catch {
            return { ...p, fraud }
          }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: 'Fraud Analysis', href: '/fraud' }, { name: 'Deep Dives' }]} />

        <h1 className="text-4xl font-bold font-serif text-gray-900 mt-6 mb-4">Fraud Deep Dive Profiles</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl">
          Detailed profiles of the 20 highest-risk <strong>individual</strong> providers in our watchlist,
          enriched with fraud feature data including impossible volumes, upcoding ratios, and billing concentration.
        </p>

        <ShareFinding stat="990x specialty median" description="One nurse practitioner billed $12.1M — 990 times the specialty median for COVID test billing" url="/fraud/deep-dives" />

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading provider profiles...</div>
        ) : (
          <div className="space-y-12">
            {providers.map((p, idx) => (
              <article key={p.npi} id={`npi-${p.npi}`} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <div className={`px-6 py-4 ${p.risk_score >= 90 ? 'bg-red-50' : p.risk_score >= 75 ? 'bg-orange-50' : 'bg-yellow-50'}`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-gray-500 font-medium">#{idx + 1} Highest Risk Individual</div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        <Link href={`/providers/${p.npi}`} className="hover:text-medicare-primary">
                          {p.name}
                        </Link>
                        {p.credentials && <span className="text-lg text-gray-500 ml-2">{p.credentials}</span>}
                      </h2>
                      <div className="text-gray-600 mt-1">
                        {p.detail?.specialty || p.specialty} · {p.city}, {p.state} · NPI: {p.npi}
                      </div>
                    </div>
                    <div className="w-48">
                      <RiskGauge score={p.risk_score} />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Stats */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-2xl font-bold text-gray-900">{formatCurrency(p.total_payments)}</div>
                        <div className="text-xs text-gray-500">Total Payments (10yr)</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-2xl font-bold text-gray-900">{(p.avg_markup || 0).toFixed(1)}x</div>
                        <div className="text-xs text-gray-500">Average Markup</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-2xl font-bold text-gray-900">{formatNumber(p.total_services)}</div>
                        <div className="text-xs text-gray-500">Total Services</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-2xl font-bold text-gray-900">{formatNumber(p.total_beneficiaries)}</div>
                        <div className="text-xs text-gray-500">Unique Beneficiaries</div>
                      </div>
                    </div>

                    {/* Fraud Features from fraud-features.json */}
                    {p.fraud && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Fraud Feature Analysis</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          <FraudBadge
                            label="Svc/Day"
                            value={formatNumber(p.fraud.services_per_day)}
                            color={(p.fraud?.services_per_day ?? 0) >= 200 ? 'bg-red-100' : (p.fraud?.services_per_day ?? 0) >= 50 ? 'bg-orange-100' : 'bg-gray-100'}
                          />
                          <FraudBadge
                            label="Patients/Day"
                            value={formatNumber(p.fraud.beneficiaries_per_day)}
                            color={(p.fraud?.beneficiaries_per_day ?? 0) >= 100 ? 'bg-red-100' : 'bg-gray-100'}
                          />
                          <FraudBadge
                            label="Upcode Ratio"
                            value={(p.fraud.upcode_ratio || 0) > 0 ? (p.fraud.upcode_ratio || 0).toFixed(1) + 'x' : 'N/A'}
                            color={(p.fraud.upcode_ratio || 0) >= 5 ? 'bg-red-100' : (p.fraud.upcode_ratio || 0) >= 2 ? 'bg-orange-100' : 'bg-gray-100'}
                          />
                          <FraudBadge
                            label="Code Concentration"
                            value={((p.fraud.code_concentration || 0) * 100).toFixed(0) + '%'}
                            color={(p.fraud.code_concentration || 0) >= 0.8 ? 'bg-red-100' : (p.fraud.code_concentration || 0) >= 0.5 ? 'bg-orange-100' : 'bg-gray-100'}
                          />
                          <FraudBadge
                            label="Specialty Z-Score"
                            value={(p.fraud.specialty_zscore || 0).toFixed(1)}
                            color={(p.fraud.specialty_zscore || 0) >= 5 ? 'bg-red-100' : (p.fraud.specialty_zscore || 0) >= 3 ? 'bg-orange-100' : 'bg-gray-100'}
                          />
                          {(p.fraud?.covid_share_pct ?? 0) > 0 && (
                            <FraudBadge label="COVID %" value={(p.fraud.covid_share_pct || 0).toFixed(1) + '%'} color={(p.fraud.covid_share_pct || 0) >= 50 ? 'bg-red-100' : 'bg-blue-100'} />
                          )}
                          {(p.fraud.wound_share_pct || 0) > 0 && (
                            <FraudBadge label="Wound %" value={(p.fraud.wound_share_pct || 0).toFixed(1) + '%'} color={(p.fraud.wound_share_pct || 0) >= 50 ? 'bg-red-100' : 'bg-purple-100'} />
                          )}
                          {(p.fraud.drug_share_pct || 0) > 0 && (
                            <FraudBadge label="Drug %" value={(p.fraud.drug_share_pct || 0).toFixed(1) + '%'} color={(p.fraud.drug_share_pct || 0) >= 50 ? 'bg-red-100' : 'bg-teal-100'} />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Yearly payments */}
                    {p.detail?.yearly_payments && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Yearly Payments</h4>
                        <div className="space-y-1">
                          {Object.entries(p.detail.yearly_payments).sort().map(([year, amt]) => (
                            <div key={year} className="flex justify-between text-sm">
                              <span className="text-gray-600">{year}</span>
                              <span className="font-medium">{formatCurrency(amt as number)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Flags + Procedures */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Why This Is Suspicious</h3>
                    <div className="space-y-3 mb-6">
                      {p.flags.map((f, i) => (
                        <div key={i} className={`border-l-4 p-3 rounded-r ${f.severity === 'high' ? 'border-red-500 bg-red-50' : f.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}`}>
                          <div className="text-sm font-semibold text-gray-900">{f.description}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {flagExplanations[f.type] || 'This pattern is statistically unusual and warrants further review.'}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Top Procedures */}
                    {p.detail?.top_procedures && p.detail.top_procedures.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Procedures</h4>
                        <div className="space-y-2">
                          {p.detail.top_procedures.slice(0, 8).map((proc, i) => (
                            <div key={i} className="flex justify-between text-sm border-b border-gray-100 pb-1">
                              <div>
                                <Link href={`/procedures/${proc.hcpcs_code}`} className="text-medicare-primary hover:underline font-medium">{proc.hcpcs_code}</Link>
                                <span className="text-gray-500 ml-2 text-xs">{proc.description}</span>
                              </div>
                              <span className="font-medium text-gray-900 whitespace-nowrap ml-2">
                                {proc.total_payments ? formatCurrency(proc.total_payments) : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50 flex flex-wrap gap-4 text-sm">
                  <Link href={`/providers/${p.npi}`} className="text-medicare-primary hover:underline font-medium">
                    Full Provider Profile →
                  </Link>
                  <a href="tel:1-800-447-8477" className="text-red-600 hover:underline font-medium">
                    Report Fraud: 1-800-HHS-TIPS
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Related Fraud Analysis */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Fraud Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline text-sm">🚨 Enhanced Watchlist — Full 500-provider list</Link>
            <Link href="/fraud/wound-care" className="text-medicare-primary hover:underline text-sm">🩹 Wound Care — DOJ&apos;s #1 fraud target</Link>
            <Link href="/fraud/covid-tests" className="text-medicare-primary hover:underline text-sm">🦠 COVID Test Billing — K1034 abuse</Link>
            <Link href="/fraud/impossible-numbers" className="text-medicare-primary hover:underline text-sm">🧮 Impossible Numbers — 4,636 flagged providers</Link>
            <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
            <Link href="/fraud/report" className="text-medicare-primary hover:underline text-sm">📞 Report Fraud — OIG Hotline</Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> These are statistical flags based on publicly available CMS data, not accusations of fraud.
            Billing anomalies can have legitimate explanations. Report suspected fraud:
            <a href="tel:1-800-447-8477" className="underline font-medium ml-1">1-800-HHS-TIPS</a>.
          </p>
        </div>

        <ShareButtons url="https://www.openmedicare.org/fraud/deep-dives" title="Fraud Deep Dive Profiles" />
        <div className="mt-6">
          <SourceCitation sources={['CMS Medicare Provider Utilization and Payment Data (2014-2023)', 'HHS Office of Inspector General']} lastUpdated="February 2026" />
        </div>
      </div>
    </div>
  )
}
