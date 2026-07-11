'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

const TrendChart = dynamic(
  () => import('@/components/Charts').then(mod => mod.TrendChart),
  { ssr: false, loading: () => <div className="h-[400px] flex items-center justify-center text-gray-400">Loading chart...</div> }
)

export default function DrugSpendingPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/drug-spending.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading drug spending data...</div>
  if (!data) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Failed to load data</div>

  const stats = data.overall_statistics || {}

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Drug Spending', href: '/drug-spending' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Medicare Drug Spending</h1>
          <p className="text-lg text-gray-600">Analyzing prescription drug payments in Medicare — which drugs cost the most and how drug spending is growing over time.</p>
        </div>

        {/* Editorial Context */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="prose max-w-none text-gray-700">
            <p>Drug spending now accounts for {(stats.latest_year_drug_share || 14.8).toFixed(1)}% of all Medicare payments — up from roughly 11% in 2014. The rise is driven by a wave of expensive specialty drugs, particularly in oncology and ophthalmology. Five drugs alone account for billions in annual spending, and the trend shows no sign of slowing as the pharmaceutical pipeline delivers more targeted (and costlier) therapies.</p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-sm text-gray-500 mb-1">Total Drug Spending (10 years)</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.total_drug_payments_all_years || 0)}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-sm text-gray-500 mb-1">Drug Share of Medicare ({stats.latest_year})</div>
            <div className="text-2xl font-bold text-red-600">{(stats.latest_year_drug_share || 0).toFixed(1)}%</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-sm text-gray-500 mb-1">Overall Drug Share</div>
            <div className="text-2xl font-bold text-orange-600">{(stats.overall_drug_share || 0).toFixed(1)}%</div>
          </div>
        </div>

        {/* Drug Share Trend */}
        {data.yearly_trends && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Drug Share of Medicare Spending Over Time</h2>
            <TrendChart xDataKey="year" yDataKey="value" data={data.yearly_trends.map((y: any) => ({ year: y.year, value: y.drug_payment_share || 0 }))} valueFormatter={(v: number) => `${v.toFixed(1)}%`} tooltipFormatter={(v: number) => `${v.toFixed(2)}%`} />
          </div>
        )}

        {/* Drug Payment Trend */}
        {data.yearly_trends && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Total Drug Payments by Year</h2>
            <TrendChart xDataKey="year" yDataKey="value" data={data.yearly_trends.map((y: any) => ({ year: y.year, value: y.drug_payments || 0 }))} />
          </div>
        )}

        {/* Top Drugs */}
        {data.top_drug_codes && data.top_drug_codes.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Drugs by Medicare Spending</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.top_drug_codes.slice(0, 30).map((d: any, i: number) => (
                    <tr key={d.code} className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-500 text-sm">{i + 1}</td>
                      <td className="px-4 py-2 font-mono text-blue-600 font-medium">{d.code}</td>
                      <td className="px-4 py-2 text-gray-600 text-sm max-w-sm truncate">{d.description}</td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(d.total_payments)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(d.total_providers)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top 5 Drug Spotlight */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Big Five: Medicare&apos;s Costliest Drugs</h2>
          <div className="space-y-4">
            {[
              { name: 'Eylea (Aflibercept)', desc: 'Injected directly into the eye to treat age-related macular degeneration. The single most expensive drug in Medicare, costing billions annually.' },
              { name: 'Keytruda (Pembrolizumab)', desc: 'A revolutionary immunotherapy for cancer. Used across dozens of tumor types, its Medicare spending has skyrocketed since approval.' },
              { name: 'Revlimid (Lenalidomide)', desc: 'A critical treatment for multiple myeloma. Patients often take it for years, driving sustained high spending.' },
              { name: 'Eliquis (Apixaban)', desc: 'A blood thinner prescribed to millions of Medicare beneficiaries to prevent stroke. High volume drives massive total spending.' },
              { name: 'Imbruvica (Ibrutinib)', desc: 'Used for blood cancers like chronic lymphocytic leukemia. One of the newer targeted therapies reshaping oncology spending.' },
            ].map((drug) => (
              <div key={drug.name} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">{drug.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{drug.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Drug Price Negotiation Impact */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🏛️ 2026 Drug Price Negotiation Impact</h2>
          <div className="prose max-w-none text-gray-700 space-y-3 text-sm">
            <p>
              The Inflation Reduction Act gave Medicare the power to negotiate drug prices for the first time. In January 2026,
              negotiated prices took effect for <strong>10 of the costliest Part D drugs</strong>, including Eliquis, Jardiance, Xarelto,
              and Januvia. CMS estimates <strong>$6 billion in first-year savings</strong>, with discounts ranging from 38% to 79%.
            </p>
            <p>
              Combined with the <strong>$2,000 annual out-of-pocket cap</strong> on Part D spending (effective 2025), seniors are seeing
              dramatically lower drug costs. The program expands to 15 more drugs in 2027 and will eventually include Part B
              physician-administered drugs — the most expensive category in our dataset.
            </p>
          </div>
          <a href="/investigations/drug-price-negotiation-2026" className="inline-block mt-3 text-sm font-medium text-blue-700 hover:text-blue-900">
            Read our full Drug Price Negotiation analysis →
          </a>
        </div>

        {/* Why Drug Spending Matters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Drug Spending Matters</h2>
          <div className="prose max-w-none text-gray-700 space-y-3 text-sm">
            <p>
              Drug spending is the fastest-growing component of Medicare Part B. While office visits and procedures grow at
              2-3% annually, drug costs have surged 8-12% per year for the past decade. This is driven by two factors:
              the introduction of expensive new biologics (especially in oncology and ophthalmology) and steady price
              increases on existing drugs that far outpace inflation.
            </p>
            <p>
              The concentration is remarkable: just 20 drug codes account for over 40% of all Medicare drug spending.
              Eylea (aflibercept) alone has cost Medicare more than many federal agencies&apos; entire annual budgets.
              Understanding where drug dollars flow is essential for any serious conversation about Medicare sustainability.
            </p>
          </div>
        </div>

        {/* Drug Spending by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Drug Spending by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-800">🎯 Oncology Drugs</h4>
              <p className="text-sm text-gray-700 mt-1">Cancer drugs are the largest single category. Immunotherapies like Keytruda and targeted therapies like Imbruvica cost $10,000-$30,000+ per month. As cancer screening improves and more Medicare beneficiaries receive treatment, this category continues to surge.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800">👁️ Ophthalmology Drugs</h4>
              <p className="text-sm text-gray-700 mt-1">Anti-VEGF injections for macular degeneration (Eylea, Lucentis, Avastin) are administered in doctors&apos; offices and billed under Part B. Each injection costs $1,000-$2,000, and patients need them every 4-8 weeks indefinitely.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800">🧬 Autoimmune & Biologic Drugs</h4>
              <p className="text-sm text-gray-700 mt-1">Biologics like Enbrel, Humira, and Stelara for rheumatoid arthritis, psoriasis, and Crohn&apos;s disease cost $3,000-$7,000+ per month. Biosimilar competition is beginning to lower some prices.</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800">❤️ Cardiovascular Drugs</h4>
              <p className="text-sm text-gray-700 mt-1">Blood thinners (Eliquis, Xarelto), heart failure drugs (Entresto), and cholesterol medications are high-volume, driving massive total spending even with lower per-unit costs.</p>
            </div>
          </div>
        </div>

        {/* Explore More */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/trends" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Spending Trends</h4>
              <p className="text-sm text-gray-500 mt-1">A decade of Medicare spending growth and what drove it</p>
            </Link>
            <Link href="/markup" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Markup Analysis</h4>
              <p className="text-sm text-gray-500 mt-1">The gap between what providers charge and what Medicare pays</p>
            </Link>
            <Link href="/investigations/drug-money" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Drug Money Investigation</h4>
              <p className="text-sm text-gray-500 mt-1">Following the money trail in Medicare drug spending</p>
            </Link>
            <Link href="/investigations/drug-pipeline" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Follow the Drug Money</h4>
              <p className="text-sm text-gray-500 mt-1">The oncology drug pipeline reshaping Medicare spending</p>
            </Link>
          </div>
        </div>

        {/* Biosimilar Competition */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Biosimilars: The Promise and the Reality</h2>
          <div className="prose max-w-none text-gray-700 space-y-3 text-sm">
            <p>
              Biosimilars — near-identical copies of expensive biologic drugs — were supposed to bring competition and lower prices,
              similar to how generic drugs reduced costs for traditional pharmaceuticals. The reality has been more complicated.
            </p>
            <p>
              While biosimilars for drugs like Avastin (bevacizumab), Herceptin (trastuzumab), and Remicade (infliximab) are now
              available and have reduced some costs, adoption has been slower than expected. Brand-name manufacturers have used
              patent thickets, rebate strategies, and physician relationships to maintain market share. In Medicare Part B,
              biosimilar uptake varies enormously by region — some states have 40%+ biosimilar use for eligible drugs while
              others remain under 10%.
            </p>
            <p>
              The 2024 data shows biosimilar competition is gradually intensifying, particularly for older biologics. But for the
              newest and most expensive drugs — checkpoint inhibitors like Keytruda, which won&apos;t face biosimilar competition until
              the 2030s — prices continue to climb unchecked.
            </p>
          </div>
        </div>

        {/* The $2,000 Cap Impact */}
        <div className="bg-green-50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 The $2,000 Out-of-Pocket Cap</h2>
          <div className="prose max-w-none text-gray-700 space-y-3 text-sm">
            <p>
              Starting in 2025, Medicare Part D beneficiaries pay no more than <strong>$2,000 per year</strong> in out-of-pocket
              drug costs. This is a game-changer for patients on expensive specialty medications who previously faced
              costs of $5,000, $10,000, or more per year in the coverage gap (&quot;donut hole&quot;).
            </p>
            <p>
              Combined with IRA-negotiated drug prices taking effect in 2026, the financial burden on seniors with chronic
              conditions has been substantially reduced. However, the cap only applies to Part D (pharmacy drugs) —
              Part B drugs administered in doctors&apos; offices still have 20% coinsurance with no annual cap.
            </p>
          </div>
        </div>

        {/* Year-over-Year Growth */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Drug Spending Growth vs Overall Medicare</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Metric</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Annual Growth</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">10-Year Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="px-4 py-2">Drug spending (Part B)</td><td className="px-4 py-2 text-right font-medium text-red-600">8-12%</td><td className="px-4 py-2 text-right">+120%+</td></tr>
                <tr><td className="px-4 py-2">Overall Medicare Part B</td><td className="px-4 py-2 text-right font-medium text-orange-600">3-4%</td><td className="px-4 py-2 text-right">+35%</td></tr>
                <tr><td className="px-4 py-2">Office visits</td><td className="px-4 py-2 text-right font-medium text-green-600">2-3%</td><td className="px-4 py-2 text-right">+25%</td></tr>
                <tr><td className="px-4 py-2">Lab services</td><td className="px-4 py-2 text-right font-medium text-green-600">1-2%</td><td className="px-4 py-2 text-right">+15%</td></tr>
                <tr><td className="px-4 py-2">General inflation (CPI)</td><td className="px-4 py-2 text-right font-medium text-gray-600">2-3%</td><td className="px-4 py-2 text-right">+28%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">Drug spending growth far outpaces overall Medicare and general inflation, driven by high-cost biologics and specialty pharmaceuticals.</p>
        </div>

        {/* Key Questions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Questions About Medicare Drug Spending</h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900">Why are Part B drugs so expensive?</h4>
              <p className="text-sm text-gray-600 mt-1">Part B covers drugs administered by physicians — infusions, injections, and other treatments given in medical settings. These are often biologics for cancer, autoimmune conditions, and eye diseases that cost thousands per dose. Unlike Part D (pharmacy) drugs, Part B drugs historically had no negotiation or out-of-pocket cap.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">How does Medicare pay for Part B drugs?</h4>
              <p className="text-sm text-gray-600 mt-1">Medicare pays providers the Average Sales Price (ASP) plus 6% for most Part B drugs. This &quot;buy and bill&quot; model gives providers a financial incentive to use more expensive drugs, since 6% of a $10,000 drug ($600) is more than 6% of a $100 drug ($6) — even if the cheaper drug works just as well.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Will drug negotiation affect Part B drugs?</h4>
              <p className="text-sm text-gray-600 mt-1">Yes. Starting with the 2027 round, the IRA drug negotiation program will include Part B drugs for the first time. This is expected to have a major impact on the most expensive physician-administered drugs in our dataset.</p>
            </div>
          </div>
        </div>

        <SourceCitation />
      </div>
    </main>
  )
}
