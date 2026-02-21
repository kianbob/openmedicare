import ArticleJsonLd from "@/components/ArticleJsonLd"
import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: "Medicare's Biggest Billers",
  description: 'The 100 providers who received the most Medicare payments in 2023. Lab corporations dominate the top spots.',
}

function loadProviders() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'top-providers.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { providers: [] } }
}

export default function BiggestBillersPage() {
  const data = loadProviders()
  const providers = (data.providers || []).slice(0, 100)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ArticleJsonLd title="The Biggest Billers in Medicare" description="The top 100 highest-paid Medicare providers and what they bill for" url="/investigations/biggest-billers" publishedDate="2026-02-21" />
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: "Medicare's Biggest Billers", href: '/investigations/biggest-billers' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Analysis</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Medicare&apos;s Biggest Billers</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 12 min read</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">Key Finding</p>
            <p className="text-blue-800 mt-2">The top 100 Medicare providers collected <strong>{formatCurrency(providers.reduce((s: number, p: any) => s + (p.total_payments || 0), 0))}</strong> in total payments — with clinical laboratories dominating the list.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Lab Corporations Rule Medicare</h2>
          <p className="text-gray-700 mb-4">When most people think of healthcare spending, they picture hospitals and doctors. But the biggest recipients of Medicare payments are often clinical laboratories — massive corporations processing millions of tests annually.</p>
          <p className="text-gray-700 mb-4">Laboratory Corporation of America (LabCorp) and Quest Diagnostics consistently rank among the top Medicare billers, each collecting hundreds of millions annually. These aren&apos;t fraudulent charges — they reflect the sheer volume of diagnostic testing in modern medicine.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Concentration Problem</h2>
          <p className="text-gray-700 mb-4">Medicare spending is remarkably concentrated. A tiny fraction of providers account for a disproportionate share of total payments. This isn&apos;t necessarily waste — large health systems and national laboratories serve enormous patient populations. But it does raise questions about market power, pricing leverage, and whether Medicare is getting value for its money.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Top 100 Medicare Providers</h2>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Provider</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {providers.map((p: any, i: number) => (
                  <tr key={p.npi} className="hover:bg-blue-50">
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-blue-600 hover:text-blue-800 font-medium">{p.name}</Link></td>
                    <td className="px-4 py-2 text-gray-600 text-sm">{p.specialty}</td>
                    <td className="px-4 py-2 text-gray-600">{p.state}</td>
                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(p.total_payments)}</td>
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
            <Link href="/investigations/medicare-millionaires" className="text-medicare-primary hover:underline text-sm">💰 Medicare Millionaires</Link>
            <Link href="/investigations/medicare-biggest-spenders" className="text-medicare-primary hover:underline text-sm">📊 Biggest Spenders</Link>
            <Link href="/providers" className="text-medicare-primary hover:underline text-sm">👨‍⚕️ Provider Directory</Link>
            <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline text-sm">🚨 Fraud Watchlist</Link>
          </div>
        </div>

        <ShareButtons url="https://openmedicare.vercel.app/investigations/biggest-billers" title="Medicare's Biggest Billers" />
        <SourceCitation />
      </div>
    </main>
  )
}
