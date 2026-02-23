import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: "Houston Spends $9.24B on Medicare — More Than Most States",
  description: '19,925 providers. $463K per doctor. Houston dominates U.S. Medicare spending thanks to the Texas Medical Center effect. See the top 20 cities ranked.',
  openGraph: {
    title: "Houston Spends $9.24B on Medicare — More Than Most States",
    description: '19,925 providers. $463K per doctor. Houston dominates U.S. Medicare spending thanks to the Texas Medical Center effect. See the top 20 cities ranked.',
  },
}

function loadData() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'geographic.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { top_cities: [], top_zips: [], cities_by_state: {} } }
}

export default function HoustonMedicareCapitalPage() {
  const data = loadData()
  const topCities = (data.top_cities || []).slice(0, 20)
  const houston = topCities[0] || {}

  const nationalAvgPerProvider = topCities.length > 0
    ? topCities.reduce((s: number, c: any) => s + c.total_payments, 0) / topCities.reduce((s: number, c: any) => s + c.providers, 0)
    : 0

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: "Houston: America's Medicare Capital", href: '/investigations/houston-medicare-capital' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Analysis</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Houston: America&apos;s Medicare Capital</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 10 min read</p>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-purple-900 font-medium text-lg">Key Finding</p>
            <p className="text-purple-800 mt-2">Houston, Texas leads the nation with <strong>{formatCurrency(houston.total_payments || 9240000000)}</strong> in Medicare spending — more than most entire states. Its <strong>{formatNumber(houston.providers || 19925)}</strong> providers average <strong>{formatCurrency(houston.avg_payment_per_provider || 463750)}</strong> each.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Numbers</h2>
          <p className="text-gray-700 mb-4">Houston isn&apos;t just the largest city in Texas. It&apos;s the Medicare capital of the United States — and it&apos;s not particularly close.</p>
        </article>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">Total Medicare Spending</p>
            <p className="text-2xl font-bold text-purple-700">{formatCurrency(houston.total_payments || 9240000000)}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">Providers</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(houston.providers || 19925)}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">Markup Ratio</p>
            <p className="text-2xl font-bold text-gray-900">{houston.markup_ratio || '4.4'}x</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">Per Provider</p>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(houston.avg_payment_per_provider || 463750)}</p>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">That per-provider average of {formatCurrency(houston.avg_payment_per_provider || 463750)} is well above the national average — meaning Houston providers don&apos;t just outnumber other cities, they bill more per person too.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Houston?</h2>
          <p className="text-gray-700 mb-4">Three factors converge to make Houston the Medicare capital:</p>
          <p className="text-gray-700 mb-4"><strong>1. The Texas Medical Center:</strong> The largest medical complex in the world. 106,000 employees. 10 million patient encounters per year. It houses MD Anderson Cancer Center (the #1 cancer hospital), Methodist Hospital, Baylor College of Medicine, and dozens more. No other city has anything comparable.</p>
          <p className="text-gray-700 mb-4"><strong>2. Demographics:</strong> Houston is America&apos;s 4th-largest city with a large and growing elderly population. Harris County alone has over 500,000 Medicare beneficiaries. The surrounding metro area adds hundreds of thousands more.</p>
          <p className="text-gray-700 mb-4"><strong>3. Specialty concentration:</strong> The Texas Medical Center attracts high-billing specialties — oncology, cardiology, orthopedics, transplant surgery. These specialties generate far more Medicare revenue per provider than primary care.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Top 20 Medicare Cities</h2>
          <p className="text-gray-700 mb-4">Here&apos;s how the nation&apos;s top cities compare:</p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Spending</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Per Provider</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Markup</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topCities.map((c: any, i: number) => (
                  <tr key={`${c.city}-${c.state}`} className={`hover:bg-blue-50 ${i === 0 ? 'bg-purple-50' : ''}`}>
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2 font-medium">{c.city}</td>
                    <td className="px-4 py-2 text-gray-600">{c.state}</td>
                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(c.total_payments)}</td>
                    <td className="px-4 py-2 text-right">{formatNumber(c.providers)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(c.avg_payment_per_provider)}</td>
                    <td className="px-4 py-2 text-right">{c.markup_ratio}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Per-Provider Story</h2>
          <p className="text-gray-700 mb-4">Raw spending totals are partly a function of city size. The more revealing metric is spending per provider. Some smaller cities punch well above their weight:</p>
          <p className="text-gray-700 mb-4">Cities with major academic medical centers or specialty hospitals tend to have higher per-provider averages — reflecting the concentration of expensive specialty care. Cities dominated by primary care and family medicine show lower per-provider spending but may actually deliver more cost-effective care.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Markup Puzzle</h2>
          <p className="text-gray-700 mb-4">Houston&apos;s markup ratio of {houston.markup_ratio || '4.4'}x means providers charge 4.4 times what Medicare actually pays. This is above the national average but not the highest among major cities — some cities show markup ratios above 5x.</p>
          <p className="text-gray-700 mb-4">High markup ratios don&apos;t necessarily indicate fraud or waste. They can reflect specialty mix (surgeons charge higher multiples than internists), local market dynamics with private insurers, and the general chargemaster inflation that pervades American healthcare.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What It Means</h2>
          <p className="text-gray-700 mb-4">Houston&apos;s dominance isn&apos;t surprising once you understand the Texas Medical Center effect. But it does raise important questions:</p>
          <ul className="text-gray-700 mb-4">
            <li>Is the concentration of spending in a few cities efficient, or does it create geographic inequality in care access?</li>
            <li>Are Houston&apos;s higher per-provider payments justified by complexity and specialty mix?</li>
            <li>Should Medicare adjust payments more aggressively for regional cost differences?</li>
          </ul>
          <p className="text-gray-700 mb-8">One thing is clear: if you want to follow the Medicare money, start in Houston.</p>
        </article>

        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/geographic-inequality" className="text-medicare-primary hover:underline text-sm">📍 ZIP Code Lottery</Link>
            <Link href="/investigations/medicare-spending-by-state" className="text-medicare-primary hover:underline text-sm">📊 Spending by State</Link>
            <Link href="/states/TX" className="text-medicare-primary hover:underline text-sm">📍 Texas Medicare Data</Link>
            <Link href="/geographic" className="text-medicare-primary hover:underline text-sm">📊 Geographic Analysis</Link>
            <Link href="/investigations/florida-california-fraud" className="text-medicare-primary hover:underline text-sm">🔴 The Fraud Belt: CA & FL</Link>
            <Link href="/investigations/state-spending-divide" className="text-medicare-primary hover:underline text-sm">💰 State Spending Divide</Link>
            <Link href="/investigations/biggest-billers" className="text-medicare-primary hover:underline text-sm">🏥 Biggest Medicare Billers</Link>
            <Link href="/investigations/rural-price-tag" className="text-medicare-primary hover:underline text-sm">🌾 The Rural Price Tag</Link>
            <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🚨 Fraud Analysis Hub</Link>
            <Link href="/specialties" className="text-medicare-primary hover:underline text-sm">🩺 Browse Specialties</Link>
          </div>
        </div>

        <ShareButtons url="https://www.openmedicare.us/investigations/houston-medicare-capital" title="Houston: America's Medicare Capital" />
        <SourceCitation />
      </div>
    </main>
  )
}
