import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: 'The Rural Price Tag',
  description: 'How Medicare spending differs dramatically between rural and urban America — fewer providers, lower prices, but access gaps.',
}

function loadRuralUrban() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'rural-urban.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return {} }
}

export default function RuralPriceTagPage() {
  const data = loadRuralUrban()
  const summary = data.rural_urban_summary || []
  const urban = summary.find((s: any) => s.category === 'Urban')
  const rural = summary.find((s: any) => s.category === 'Rural')

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: 'The Rural Price Tag', href: '/investigations/rural-price-tag' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Deep Dive</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">The Rural Price Tag</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 14 min read</p>

          {urban && rural && (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8 not-prose">
              <p className="text-green-900 font-medium text-lg">The Urban-Rural Divide</p>
              <p className="text-green-800 mt-2">Urban areas account for <strong>{((urban.total_payments / (urban.total_payments + rural.total_payments)) * 100).toFixed(0)}%</strong> of all Medicare spending with <strong>{(urban.total_providers / rural.total_providers).toFixed(1)}x</strong> more providers — but per-service costs are <strong>{((urban.avg_payment_per_service / rural.avg_payment_per_service - 1) * 100).toFixed(0)}%</strong> higher.</p>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Two Americas of Healthcare</h2>
          <p className="text-gray-700 mb-4">Medicare data reveals a stark geographic divide in American healthcare. Urban areas have more providers, more services, more specialties, and higher per-service prices. Rural areas have fewer options, lower prices, but also less access to specialists and advanced procedures.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Access Gap</h2>
          <p className="text-gray-700 mb-4">While rural Medicare beneficiaries pay less per service on average, they also have fewer services available to them. Specialties like radiation oncology, interventional cardiology, and advanced surgical specialties are overwhelmingly concentrated in urban areas. This means rural patients often travel hours for specialized care — a hidden cost that doesn&apos;t show up in payment data.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Price Premium</h2>
          <p className="text-gray-700 mb-4">Urban providers command higher per-service payments across virtually every specialty. This reflects higher cost of living, more expensive facilities, and the market power of large urban health systems. But it also raises questions about whether Medicare&apos;s geographic payment adjustments are calibrated correctly.</p>

          {urban && rural && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mt-8 mb-8">
              <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🏙️ Urban</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Total Payments</span><span className="font-bold">{formatCurrency(urban.total_payments)}</span></div>
                  <div className="flex justify-between"><span>Providers</span><span className="font-bold">{formatNumber(urban.total_providers)}</span></div>
                  <div className="flex justify-between"><span>Avg/Service</span><span className="font-bold">{formatCurrency(urban.avg_payment_per_service)}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border-2 border-green-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🌾 Rural</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Total Payments</span><span className="font-bold">{formatCurrency(rural.total_payments)}</span></div>
                  <div className="flex justify-between"><span>Providers</span><span className="font-bold">{formatNumber(rural.total_providers)}</span></div>
                  <div className="flex justify-between"><span>Avg/Service</span><span className="font-bold">{formatCurrency(rural.avg_payment_per_service)}</span></div>
                </div>
              </div>
            </div>
          )}
        </article>

        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/geographic-inequality" className="text-medicare-primary hover:underline text-sm">📍 ZIP Code Lottery</Link>
            <Link href="/investigations/state-spending-divide" className="text-medicare-primary hover:underline text-sm">📊 State Spending Divide</Link>
            <Link href="/rural-urban" className="text-medicare-primary hover:underline text-sm">📊 Rural vs Urban Data</Link>
            <Link href="/states" className="text-medicare-primary hover:underline text-sm">📍 Browse All States</Link>
          </div>
        </div>

        <ShareButtons url="https://www.openmedicare.org/investigations/rural-price-tag" title="The Rural Price Tag" />
        <SourceCitation />
      </div>
    </main>
  )
}
