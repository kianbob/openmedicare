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
  title: 'Top 30 Drugs Draining Medicare: $94B Exposed',
  description: 'Medicare drug spending surged from 11% to 15% of total payments. See the 30 costliest drugs — led by a $20B eye injection — and where the money goes.',
}

function loadDrugs() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'drug-spending.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return {} }
}

export default function DrugPipelinePage() {
  const data = loadDrugs()
  const drugs = (data.top_drugs || []).slice(0, 30)
  const stats = data.overall_statistics || {}

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: 'The Drug Pipeline', href: '/investigations/drug-pipeline' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Investigation</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">The Medicare Drug Pipeline</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 18 min read</p>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-purple-900 font-medium text-lg">Growing Fast</p>
            <p className="text-purple-800 mt-2">Drug spending&apos;s share of Medicare grew from <strong>{(stats.overall_drug_share || 11).toFixed(1)}%</strong> overall to <strong>{(stats.latest_year_drug_share || 14.8).toFixed(1)}%</strong> in {stats.latest_year || 2023} — totaling <strong>{formatCurrency(stats.total_drug_payments_all_years || 0)}</strong> over the decade.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Specialty Drug Revolution</h2>
          <p className="text-gray-700 mb-4">Medicare drug spending is being driven by a handful of extraordinarily expensive specialty drugs. Aflibercept (Eylea), used for macular degeneration, is the single most expensive drug in Medicare — generating nearly $20 billion in payments over the decade. Cancer drugs, immunotherapies, and biologic agents make up the rest of the top tier.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why It Matters</h2>
          <p className="text-gray-700 mb-4">As drug costs grow faster than overall Medicare spending, they consume an ever-larger share of the program&apos;s budget. The Inflation Reduction Act&apos;s drug price negotiation provisions were designed to address this — but they only apply to a small number of drugs initially. The broader trend of specialty drug dominance shows no signs of slowing.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Top 30 Drugs by Medicare Spending</h2>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
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
                {drugs.map((d: any, i: number) => (
                  <tr key={d.code} className="hover:bg-blue-50">
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2 font-mono text-blue-600 font-medium">{d.code}</td>
                    <td className="px-4 py-2 text-gray-600 text-sm max-w-sm">{d.description}</td>
                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(d.total_payments)}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{formatNumber(d.total_providers)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/drug-money" className="text-medicare-primary hover:underline text-sm">💊 Follow the Drug Money</Link>
            <Link href="/investigations/oncology-drug-pipeline" className="text-medicare-primary hover:underline text-sm">🔬 Oncology Drug Pipeline</Link>
            <Link href="/drug-spending" className="text-medicare-primary hover:underline text-sm">📊 Drug Spending Data</Link>
            <Link href="/procedures" className="text-medicare-primary hover:underline text-sm">📋 Browse Procedures</Link>
          </div>
        </div>

        <ShareButtons url="https://www.openmedicare.us/investigations/drug-pipeline" title="The Medicare Drug Pipeline" />
        <SourceCitation />
      </div>
    </main>
  )
}
