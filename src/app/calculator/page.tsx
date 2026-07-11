'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, CalculatorIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency } from '@/lib/format'

interface Procedure {
  code: string
  description: string
  total_payments: number
  total_services: number
  avg_payment_per_service: number
}

export default function CalculatorPage() {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<(Procedure & { qty: number })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/procedures.json')
      .then(r => r.json())
      .then(d => { setProcedures(d.procedures || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const results = search.length >= 2
    ? procedures.filter(p => p.code.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())).slice(0, 10)
    : []

  const addProcedure = (p: Procedure) => {
    if (!selected.find(s => s.code === p.code)) {
      setSelected([...selected, { ...p, qty: 1 }])
      setSearch('')
    }
  }

  const updateQty = (code: string, qty: number) => {
    setSelected(selected.map(s => s.code === code ? { ...s, qty: Math.max(1, qty) } : s))
  }

  const removeProcedure = (code: string) => {
    setSelected(selected.filter(s => s.code !== code))
  }

  const total = selected.reduce((sum, s) => sum + s.avg_payment_per_service * s.qty, 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Cost Calculator', href: '/calculator' }]} />
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Medicare Cost Calculator</h1>
        <p className="text-lg text-gray-600 mb-8">Estimate Medicare costs by selecting procedures. Costs shown are average Medicare payments based on 2023 data.</p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Add Procedures</h2>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search by code or description (e.g., 99213, office visit)..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          {results.length > 0 && (
            <div className="mt-2 border border-gray-200 rounded-lg divide-y max-h-60 overflow-y-auto">
              {results.map(p => (
                <button key={p.code} onClick={() => addProcedure(p)} className="w-full text-left px-4 py-2 hover:bg-blue-50 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-medium text-blue-600">{p.code}</span>
                    <span className="text-sm text-gray-600 ml-2">{p.description}</span>
                  </div>
                  <span className="text-sm text-gray-500">Avg: {formatCurrency(p.avg_payment_per_service)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selected.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Your Estimate</h2>
            <div className="space-y-3">
              {selected.map(s => (
                <div key={s.code} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                  <div className="flex-1">
                    <span className="font-mono font-medium text-blue-600">{s.code}</span>
                    <span className="text-sm text-gray-600 ml-2">{s.description}</span>
                    <div className="text-sm text-gray-500">Avg Medicare payment: {formatCurrency(s.avg_payment_per_service)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500">Qty:</label>
                    <input type="number" min="1" value={s.qty} onChange={e => updateQty(s.code, parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center" />
                  </div>
                  <div className="text-right min-w-[80px] font-bold">{formatCurrency(s.avg_payment_per_service * s.qty)}</div>
                  <button onClick={() => removeProcedure(s.code)} className="text-red-500 hover:text-red-700 text-lg" aria-label={`Remove ${s.code}`}>×</button>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Estimated Total</span>
              <span className="text-2xl font-bold text-medicare-primary">{formatCurrency(total)}</span>
            </div>

            <p className="text-xs text-gray-500 mt-3">⚠️ These are average Medicare payment amounts and may vary by provider, location, and individual circumstances. Actual costs may differ.</p>
          </div>
        )}

        {selected.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <CalculatorIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Search and add procedures above to estimate costs</p>
          </div>
        )}

        {/* How Medicare Pricing Works */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How Medicare Pricing Works</h2>
          <div className="prose max-w-none text-gray-700 space-y-3 text-sm">
            <p>
              Medicare doesn&apos;t pay whatever a provider charges. Instead, it uses the <strong>Medicare Physician Fee Schedule (MPFS)</strong>,
              which sets an &quot;allowed amount&quot; for each procedure code based on three factors: the work involved (physician time and skill),
              practice expense (rent, staff, equipment), and malpractice insurance costs.
            </p>
            <p>
              These components are adjusted by a <strong>Geographic Practice Cost Index (GPCI)</strong> that accounts for regional cost-of-living
              differences. A procedure in Manhattan costs Medicare more than the same procedure in rural Iowa because rent, staff wages,
              and malpractice premiums are higher.
            </p>
            <p>
              Medicare typically pays <strong>80% of the allowed amount</strong>. The beneficiary is responsible for the remaining 20% coinsurance
              (unless they have supplemental insurance). Providers who &quot;accept assignment&quot; agree to take the Medicare-approved amount as full
              payment. Those who don&apos;t can charge up to 15% more (the &quot;limiting charge&quot;).
            </p>
          </div>
        </div>

        {/* Common Procedure Costs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Common Medicare Procedure Costs (2024 Averages)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Procedure</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Code</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Avg Medicare Payment</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Typical Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-blue-50"><td className="px-4 py-2">Office Visit (Established Patient, Moderate)</td><td className="px-4 py-2 font-mono text-blue-600">99214</td><td className="px-4 py-2 text-right">~$110</td><td className="px-4 py-2 text-right text-gray-500">~$250</td></tr>
                <tr className="hover:bg-blue-50"><td className="px-4 py-2">Office Visit (New Patient, Moderate)</td><td className="px-4 py-2 font-mono text-blue-600">99203</td><td className="px-4 py-2 text-right">~$110</td><td className="px-4 py-2 text-right text-gray-500">~$300</td></tr>
                <tr className="hover:bg-blue-50"><td className="px-4 py-2">Eye Injection (Aflibercept/Eylea)</td><td className="px-4 py-2 font-mono text-blue-600">J0178</td><td className="px-4 py-2 text-right">~$1,850</td><td className="px-4 py-2 text-right text-gray-500">~$2,200</td></tr>
                <tr className="hover:bg-blue-50"><td className="px-4 py-2">Chest X-Ray (2 Views)</td><td className="px-4 py-2 font-mono text-blue-600">71046</td><td className="px-4 py-2 text-right">~$25</td><td className="px-4 py-2 text-right text-gray-500">~$150</td></tr>
                <tr className="hover:bg-blue-50"><td className="px-4 py-2">Complete Blood Count (CBC)</td><td className="px-4 py-2 font-mono text-blue-600">85025</td><td className="px-4 py-2 text-right">~$8</td><td className="px-4 py-2 text-right text-gray-500">~$35</td></tr>
                <tr className="hover:bg-blue-50"><td className="px-4 py-2">MRI Brain Without Contrast</td><td className="px-4 py-2 font-mono text-blue-600">70551</td><td className="px-4 py-2 text-right">~$240</td><td className="px-4 py-2 text-right text-gray-500">~$2,500</td></tr>
                <tr className="hover:bg-blue-50"><td className="px-4 py-2">Colonoscopy with Biopsy</td><td className="px-4 py-2 font-mono text-blue-600">45380</td><td className="px-4 py-2 text-right">~$350</td><td className="px-4 py-2 text-right text-gray-500">~$2,000</td></tr>
                <tr className="hover:bg-blue-50"><td className="px-4 py-2">Physical Therapy Evaluation</td><td className="px-4 py-2 font-mono text-blue-600">97163</td><td className="px-4 py-2 text-right">~$95</td><td className="px-4 py-2 text-right text-gray-500">~$200</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">⚠️ Typical charges show what providers submit; Medicare pays substantially less. The gap between charges and payments is the &quot;markup&quot; analyzed in our <a href="/markup" className="text-blue-600 hover:underline">Markup Analysis</a>.</p>
        </div>

        {/* Understanding Your Medicare Costs */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Understanding Your Medicare Costs</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-lg">💳</span>
              <div>
                <h4 className="font-semibold text-gray-900">Part B Premium</h4>
                <p>Most beneficiaries pay $185/month for Part B in 2026. Higher earners pay more through Income-Related Monthly Adjustment Amounts (IRMAA).</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🏥</span>
              <div>
                <h4 className="font-semibold text-gray-900">Part B Deductible</h4>
                <p>You pay the first $257 per year (2026) before Medicare starts paying its share. After that, you typically pay 20% coinsurance.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">💊</span>
              <div>
                <h4 className="font-semibold text-gray-900">Part D Drug Cap</h4>
                <p>Starting in 2025, Part D out-of-pocket costs are capped at $2,000/year. Combined with IRA-negotiated drug prices in 2026, many beneficiaries are seeing significant savings.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">📊</span>
              <div>
                <h4 className="font-semibold text-gray-900">Assignment Matters</h4>
                <p>Providers who accept assignment agree to Medicare&apos;s approved amount. Non-participating providers can charge up to 15% more. Always ask before your visit.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tips for Managing Medicare Costs</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">✅ Compare Before You Go</h4>
              <p className="mt-1">Use our <a href="/compare" className="text-blue-600 hover:underline">Provider Compare</a> tool to see how different doctors in your area charge for the same procedures.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">✅ Check for Assignment</h4>
              <p className="mt-1">Providers who accept assignment can&apos;t charge you more than the Medicare-approved amount. This can save you hundreds per visit.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">✅ Consider Medigap</h4>
              <p className="mt-1">Medicare Supplement (Medigap) policies can cover your 20% coinsurance, deductibles, and excess charges — making your out-of-pocket costs more predictable.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">✅ Know Your Drug Costs</h4>
              <p className="mt-1">With the new $2,000 annual cap on Part D out-of-pocket spending and IRA-negotiated prices, check if your medications are among the drugs with reduced costs in 2026.</p>
            </div>
          </div>
        </div>

        {/* Medicare vs Private Insurance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Medicare vs Private Insurance Pricing</h2>
          <div className="prose max-w-none text-gray-700 space-y-3 text-sm">
            <p>
              Medicare generally pays <strong>lower rates</strong> than private insurance for the same procedures.
              Studies consistently show Medicare pays about 40% less than private insurers on average. For example,
              a knee replacement that Medicare reimburses at $17,000 might cost a private insurer $30,000-50,000
              at the same hospital.
            </p>
            <p>
              This is why provider &quot;charges&quot; (list prices) are so much higher than Medicare payments — providers
              set charges to maximize private insurance reimbursement, while Medicare applies its own fee schedule
              regardless. The result: providers charge $3.5T+ to Medicare but receive $940B.
            </p>
          </div>
        </div>

        {/* Explore Related */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Explore Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/compare" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">⚖️ Compare Providers</h4>
              <p className="text-sm text-gray-500 mt-1">See how different doctors compare on pricing, volume, and specialties.</p>
            </a>
            <a href="/your-medicare-dollar" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">💵 Your Medicare Dollar</h4>
              <p className="text-sm text-gray-500 mt-1">See exactly where your Medicare premiums and tax dollars go.</p>
            </a>
            <a href="/procedures" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">📋 Procedure Directory</h4>
              <p className="text-sm text-gray-500 mt-1">Browse 7,500+ Medicare procedure codes with cost and utilization data.</p>
            </a>
            <a href="/markup" className="block bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">📈 Markup Analysis</h4>
              <p className="text-sm text-gray-500 mt-1">What providers charge vs what Medicare pays — the 3.7x gap.</p>
            </a>
          </div>
        </div>

        {/* Important Disclaimers */}
        <div className="bg-yellow-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚠️ Important Notes About Cost Estimates</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>These are averages, not quotes.</strong> Actual Medicare payments vary by provider location
              (geographic cost adjustments), facility vs office setting, and whether the provider accepts assignment.
              Use these estimates as a starting point, not a guarantee.
            </p>
            <p>
              <strong>Your out-of-pocket cost is different.</strong> Medicare typically pays 80% of the approved amount.
              You pay 20% coinsurance plus any applicable deductible. If you have Medigap or other supplemental insurance,
              your share may be lower or zero.
            </p>
            <p>
              <strong>Part B only.</strong> This calculator covers Medicare Part B (physician/outpatient) services.
              Hospital inpatient costs (Part A) and pharmacy drugs (Part D) use different payment systems not included here.
            </p>
            <p>
              <strong>Data vintage.</strong> Costs are based on 2024 CMS data — the most recent available. Medicare
              fee schedules are updated annually, so current-year payments may differ slightly.
            </p>
          </div>
        </div>

        {/* Did You Know */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Did You Know?</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <p>• The most expensive single procedure code in Medicare is <strong>J0178 (Eylea injection)</strong> — costing Medicare over $3 billion annually for a single drug injected into the eye.</p>
            <p>• A standard office visit (99213) costs Medicare about <strong>$75-95</strong>, but providers charge $200-400+ for the same visit.</p>
            <p>• Medicare&apos;s fee schedule has over <strong>7,500 procedure codes</strong>, from $3 urine tests to $50,000+ surgical procedures.</p>
            <p>• The <strong>geographic adjustment</strong> means the same procedure costs Medicare 20-30% more in San Francisco than in rural Mississippi.</p>
          </div>
        </div>

        <SourceCitation />
      </div>
    </main>
  )
}
