'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ShareFinding from '@/components/ShareFinding'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

interface StillOutThereProvider {
  npi: string
  name: string
  credentials: string
  specialty: string
  city: string
  state: string
  total_payments: number
  total_services: number
  total_beneficiaries: number
  fraud_probability: number
  risk_rank: number
  top_risk_factors: string[]
  similar_to: string[] // Names of caught fraudsters they resemble
}

interface MLv2Results {
  model_version: string
  trained_on: number // number of confirmed fraud NPIs
  auc_score: number
  precision: number
  recall: number
  total_scored: number
  still_out_there: StillOutThereProvider[]
  top_features: { feature: string; importance: number }[]
  generated_at: string
}

function ProbabilityBadge({ prob }: { prob: number }) {
  const pct = (prob * 100).toFixed(1)
  const color = prob >= 0.8 ? 'bg-red-100 text-red-800 border-red-300' :
    prob >= 0.6 ? 'bg-orange-100 text-orange-800 border-orange-300' :
    'bg-yellow-100 text-yellow-800 border-yellow-300'
  return (
    <span className={`inline-block px-2 py-0.5 rounded border text-sm font-bold ${color}`}>
      {pct}% match
    </span>
  )
}

export default function StillOutThere() {
  const [data, setData] = useState<MLv2Results | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetch('/data/ml-v2-results.json')
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const displayed = data?.still_out_there
    ? (showAll ? data.still_out_there : data.still_out_there.slice(0, 50))
    : []

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: 'Fraud Analysis', href: '/fraud' }, { name: 'Still Out There' }]} />

        <h1 className="text-4xl font-bold font-serif text-gray-900 mt-6 mb-4">
          Still Out There
        </h1>
        <p className="text-lg text-gray-600 mb-2 max-w-3xl">
          Our ML model was trained on <strong>{data?.trained_on?.toLocaleString() || '8,300+'} confirmed fraudsters</strong> — 
          providers caught by the DOJ, excluded by HHS OIG, or who settled False Claims Act cases.
          These are the providers who <em>look like caught criminals</em> but haven&apos;t been caught yet.
        </p>

        {data && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-700">{data.still_out_there.length}</div>
              <div className="text-sm text-gray-600">Providers Flagged</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-700">{(data.auc_score * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Model AUC Score</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-700">{data.trained_on.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Confirmed Fraud Labels</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-700">{formatNumber(data.total_scored)}</div>
              <div className="text-sm text-gray-600">Providers Scored</div>
            </div>
          </div>
        )}

        <ShareFinding 
          stat={`${data?.still_out_there.length || '???'} providers`}
          description={`Our AI trained on ${data?.trained_on?.toLocaleString() || '8,300+'} caught fraudsters found ${data?.still_out_there.length || 'hundreds of'} providers who match the same patterns`}
          url="/fraud/still-out-there"
        />

        {/* How the Model Works */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How This Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div>
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">Real Training Labels</h3>
              <p>Unlike our statistical watchlist, this model learned from <strong>real criminals</strong> — 
                providers on the HHS OIG exclusion list, DOJ indictments, and FCA settlements.</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🧠</div>
              <h3 className="font-semibold mb-1">Pattern Recognition</h3>
              <p>The Random Forest model identifies billing patterns that caught fraudsters share — 
                impossible volumes, code concentration, specialty deviation, and more.</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold mb-1">Prediction, Not Proof</h3>
              <p>A high match score means &quot;this provider bills like people who got caught.&quot; 
                It&apos;s a statistical flag — not an accusation. Many may have legitimate explanations.</p>
            </div>
          </div>
        </div>

        {/* Top Features */}
        {data?.top_features && data.top_features.length > 0 && (
          <div className="my-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What the Model Learned</h2>
            <p className="text-sm text-gray-600 mb-3">The most important features for predicting fraud (feature importance from Random Forest):</p>
            <div className="space-y-2 max-w-xl">
              {data.top_features.slice(0, 10).map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-40 truncate">{f.feature.replace(/_/g, ' ')}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div className="bg-medicare-primary h-4 rounded-full" style={{ width: `${(f.importance * 100 / (data.top_features[0]?.importance || 1)).toFixed(0)}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">{(f.importance * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Provider List */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading ML model results...</div>
        ) : !data ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center my-8">
            <div className="text-4xl mb-4">🔬</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Model Training In Progress</h2>
            <p className="text-gray-600">
              Our supervised fraud detection model is currently being trained on {'>'}8,300 confirmed fraudster profiles 
              across 1.7 million Medicare providers. Results will appear here when complete.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              In the meantime, check our <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline">statistical watchlist</Link> for 
              providers flagged by anomaly detection.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
              Highest-Risk Unflagged Providers
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">#</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Provider</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Specialty</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Location</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">Total Payments</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">Fraud Match</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Key Risk Factors</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((p, idx) => (
                    <tr key={p.npi} className={`border-b border-gray-100 hover:bg-gray-50 ${idx % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-3 text-gray-500">{p.risk_rank || idx + 1}</td>
                      <td className="px-4 py-3">
                        <Link href={`/providers/${p.npi}`} className="text-medicare-primary hover:underline font-medium">
                          {p.name}
                        </Link>
                        {p.credentials && <span className="text-gray-400 ml-1 text-xs">{p.credentials}</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.specialty}</td>
                      <td className="px-4 py-3 text-gray-600">{p.city}, {p.state}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(p.total_payments)}</td>
                      <td className="px-4 py-3 text-right"><ProbabilityBadge prob={p.fraud_probability} /></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(p.top_risk_factors || []).slice(0, 3).map((f, i) => (
                            <span key={i} className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">{f}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.still_out_there.length > 50 && !showAll && (
              <div className="text-center mt-4">
                <button onClick={() => setShowAll(true)} className="px-6 py-2 bg-medicare-primary text-white rounded hover:bg-medicare-dark">
                  Show All {data.still_out_there.length} Providers
                </button>
              </div>
            )}
          </>
        )}

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Important Disclaimer:</strong> Machine learning predictions are statistical patterns, not evidence of fraud. 
            A high fraud-match score means a provider&apos;s billing resembles that of confirmed fraudsters — it does not mean they are committing fraud. 
            Many flagged providers may have legitimate explanations for unusual billing patterns. 
            This analysis is for public transparency and journalism purposes only.
            Report suspected fraud: <a href="tel:1-800-447-8477" className="underline font-medium">1-800-HHS-TIPS</a>.
          </p>
        </div>

        {/* Related */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Fraud Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline text-sm">🚨 Statistical Watchlist — 500 providers flagged by anomaly detection</Link>
            <Link href="/fraud/deep-dives" className="text-medicare-primary hover:underline text-sm">🔍 Deep Dive Profiles — Top 20 highest-risk individuals</Link>
            <Link href="/investigations/data-predicted-fraud" className="text-medicare-primary hover:underline text-sm">📰 Our Data Predicted It — Algorithm vs DOJ</Link>
            <Link href="/fraud/impossible-numbers" className="text-medicare-primary hover:underline text-sm">🧮 Impossible Numbers — Physically impossible billing</Link>
            <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
            <Link href="/methodology" className="text-medicare-primary hover:underline text-sm">📊 Methodology — How we analyze the data</Link>
          </div>
        </div>

        <ShareButtons url="https://www.openmedicare.org/fraud/still-out-there" title="Still Out There: AI-Flagged Medicare Providers" />
        <div className="mt-6">
          <SourceCitation sources={[
            'CMS Medicare Provider Utilization and Payment Data (2014-2023)',
            'HHS OIG List of Excluded Individuals/Entities (LEIE)',
            'DOJ Healthcare Fraud Enforcement Actions (2020-2025)',
          ]} lastUpdated="February 2026" />
        </div>
      </div>
    </div>
  )
}