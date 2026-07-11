'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { TrendChart } from '@/components/Charts'
import { formatCurrency, formatNumber } from '@/lib/format'

export default function MarkupAnalysisPage() {
  const [data, setData] = useState<any>(null)
  const [tab, setTab] = useState<'specialty' | 'state' | 'providers' | 'trends'>('specialty')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/markup-analysis.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading markup data...</div>
  if (!data) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Failed to load data</div>

  const tabs = [
    { key: 'specialty' as const, label: 'By Specialty' },
    { key: 'state' as const, label: 'By State' },
    { key: 'providers' as const, label: 'Top Markup Providers' },
    { key: 'trends' as const, label: 'Yearly Trends' },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Markup Analysis', href: '/markup' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">The Medicare Markup Machine</h1>
          <p className="text-lg text-gray-600">Medicare providers submit charges far exceeding what Medicare actually pays. This analysis reveals who charges the most and where the biggest markups occur.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* By Specialty */}
        {tab === 'specialty' && data.by_specialty && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Markup</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Charges</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.by_specialty.slice(0, 40).map((s: any, i: number) => (
                    <tr key={i} className="hover:bg-blue-50">
                      <td className="px-4 py-2 font-medium">{s.specialty}</td>
                      <td className="px-4 py-2 text-right">
                        <span className={`font-bold ${s.avg_markup > 6 ? 'text-red-600' : s.avg_markup > 4 ? 'text-orange-600' : 'text-gray-700'}`}>
                          {s.avg_markup?.toFixed(1)}x
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">{formatCurrency(s.total_charges)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(s.total_payments)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(s.provider_count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* By State */}
        {tab === 'state' && data.by_state && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Markup</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Charges</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.by_state.map((s: any) => (
                    <tr key={s.state} className="hover:bg-blue-50">
                      <td className="px-4 py-2"><Link href={`/states/${s.state}`} className="text-blue-600 hover:text-blue-800 font-medium">{s.state}</Link></td>
                      <td className="px-4 py-2 text-right">
                        <span className={`font-bold ${s.avg_markup > 5 ? 'text-red-600' : s.avg_markup > 3.5 ? 'text-orange-600' : 'text-gray-700'}`}>
                          {s.avg_markup?.toFixed(1)}x
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">{formatCurrency(s.total_charges)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(s.total_payments)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Markup Providers */}
        {tab === 'providers' && data.top_markup_providers && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Provider</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Markup</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Charges</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Payments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.top_markup_providers.slice(0, 50).map((p: any, i: number) => (
                    <tr key={p.npi} className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-500 text-sm">{i + 1}</td>
                      <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-blue-600 hover:text-blue-800 font-medium">{p.name}</Link></td>
                      <td className="px-4 py-2 text-gray-600 text-sm">{p.specialty}</td>
                      <td className="px-4 py-2 text-gray-600">{p.state}</td>
                      <td className="px-4 py-2 text-right"><span className="font-bold text-red-600">{p.avg_markup?.toFixed(1)}x</span></td>
                      <td className="px-4 py-2 text-right">{formatCurrency(p.total_charges)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(p.total_payments)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Yearly Trends */}
        {tab === 'trends' && data.yearly_trends && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Markup Over Time</h2>
            <TrendChart xDataKey="year" yDataKey="value" data={data.yearly_trends.map((y: any) => ({ year: y.year, value: y.avg_markup }))} />
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Excess Charges by Year</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Markup</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Charges</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Excess Charges</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.yearly_trends.map((y: any) => (
                      <tr key={y.year} className="hover:bg-blue-50">
                        <td className="px-4 py-2 font-medium">{y.year}</td>
                        <td className="px-4 py-2 text-right font-bold text-orange-600">{y.avg_markup?.toFixed(1)}x</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(y.total_charges)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(y.total_payments)}</td>
                        <td className="px-4 py-2 text-right text-red-600 font-medium">{formatCurrency(y.markup_dollars || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Understanding Markups */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Medicare Markups</h2>
          <div className="prose max-w-none text-gray-700 space-y-3 text-sm">
            <p>
              When a provider bills Medicare, they submit a <strong>&quot;charge&quot;</strong> — their list price for a service. Medicare then
              determines the <strong>&quot;allowed amount&quot;</strong> based on its fee schedule and pays 80% of that. The gap between what
              providers charge and what Medicare pays is the &quot;markup&quot; or &quot;write-off.&quot;
            </p>
            <p>
              Over 11 years (2014-2024), providers submitted over <strong>$3.5 trillion</strong> in charges to Medicare Part B.
              Medicare actually paid about <strong>$940 billion</strong> — meaning roughly 73% of all submitted charges were written off.
              This isn&apos;t fraud; it&apos;s how the system works. But the ratio has been climbing every year, raising questions about
              whether provider charge structures serve any real purpose.
            </p>
            <p>
              Markups vary wildly by specialty. Clinical laboratories and ambulance services often charge 8-15x what Medicare pays,
              while primary care providers charge 2-3x. Some individual providers submit charges 50x or more above Medicare&apos;s payment —
              a pattern that, while technically legal, raises questions about billing practices.
            </p>
          </div>
        </div>

        {/* Why Markups Matter */}
        <div className="bg-orange-50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Markups Matter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">💰 Uninsured Patients Pay More</h3>
              <p className="text-sm text-gray-700">While Medicare pays the allowed amount, uninsured patients may be billed at full charge prices — often 3-10x higher. High markups disproportionately hurt those without insurance.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📊 Out-of-Pocket Impact</h3>
              <p className="text-sm text-gray-700">For providers who don&apos;t accept Medicare assignment, patients can be billed the &quot;excess charge&quot; — up to 15% above the allowed amount. In high-markup specialties, this adds up quickly.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🚩 Fraud Signal</h3>
              <p className="text-sm text-gray-700">Extremely high markups can indicate billing anomalies. When a provider charges 20-50x what Medicare pays, it may signal upcoding, unbundling, or other problematic billing practices.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📈 Growing Disconnect</h3>
              <p className="text-sm text-gray-700">The average markup ratio has increased every year since 2014. Providers raise their list prices regardless of what Medicare pays, widening a gap that serves no clear purpose in the fee-for-service system.</p>
            </div>
          </div>
        </div>

        {/* Highest Markup Specialties */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Highest-Markup Specialties</h2>
          <div className="space-y-3">
            {[
              { name: 'Clinical Laboratory', ratio: '8-15x', desc: 'Lab tests have the highest markups. A $8 blood test may be billed at $80-120. High volume amplifies the total write-off.' },
              { name: 'Ambulance Services', ratio: '6-10x', desc: 'Emergency transport charges are notoriously inflated. A $500 Medicare payment may come from a $3,000-5,000 bill.' },
              { name: 'Radiation Oncology', ratio: '5-8x', desc: 'Cancer radiation treatments involve expensive equipment. Providers charge premium prices, but Medicare applies standardized rates.' },
              { name: 'Diagnostic Radiology', ratio: '4-7x', desc: 'MRIs, CT scans, and X-rays carry significant markups. A $250 MRI payment may be billed at $1,500-2,500.' },
              { name: 'Anesthesiology', ratio: '4-6x', desc: 'Anesthesia charges are based on time units, and providers often charge 4-6x what Medicare reimburses per unit.' },
            ].map((s) => (
              <div key={s.name} className="bg-gray-50 rounded-lg p-4 flex items-start gap-4">
                <div className="text-lg font-bold text-red-600 min-w-[60px]">{s.ratio}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{s.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Investigations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Investigations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/investigations/the-markup-game" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Markup Game</h4>
              <p className="text-sm text-gray-500 mt-1">$3.2T charged, $940B paid. The gap reveals a broken pricing system getting worse every year.</p>
            </a>
            <a href="/investigations/markup-machine" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Markup Machine</h4>
              <p className="text-sm text-gray-500 mt-1">Which specialties mark up the most and why the gap keeps widening.</p>
            </a>
            <a href="/investigations/beverly-hills-billing" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Beverly Hills Billing</h4>
              <p className="text-sm text-gray-500 mt-1">When a surgeon charges 59x what Medicare pays for wound care.</p>
            </a>
            <a href="/payment-gap" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Payment Gap Analysis</h4>
              <p className="text-sm text-gray-500 mt-1">The three-way gap: Charged vs Allowed vs Paid.</p>
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900">Why do providers charge so much more than Medicare pays?</h4>
              <p className="text-sm text-gray-600 mt-1">Provider charges are essentially list prices set by each practice. They serve as a starting point for negotiation with private insurers. Since Medicare pays a fixed fee schedule regardless of charges, many providers set charges high to maximize private insurance reimbursement. The charges have become increasingly disconnected from actual payment rates.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Is a high markup ratio a sign of fraud?</h4>
              <p className="text-sm text-gray-600 mt-1">Not necessarily. High markups are common in certain specialties (labs, ambulance, radiology) and are part of the billing system&apos;s design. However, extreme outliers — providers charging 20-50x what Medicare pays — can indicate billing anomalies worth investigating.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Does the markup affect what Medicare beneficiaries pay?</h4>
              <p className="text-sm text-gray-600 mt-1">For providers who accept assignment (about 96% of Medicare claims), the markup doesn&apos;t affect patient costs — beneficiaries pay 20% of the Medicare-approved amount, not the charge. For non-participating providers, patients can be billed up to 15% above the approved amount.</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SourceCitation />
        </div>
      </div>
    </main>
  )
}
