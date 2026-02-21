import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: 'The Specialty Pay Gap — OpenMedicare',
  description: 'How Medicare payments vary dramatically across medical specialties — from anesthesiologists earning 15x markups to primary care providers.',
}

function loadSpecialties() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'specialties.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { specialties: [] } }
}

function loadMarkup() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'markup-analysis.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return {} }
}

export default function SpecialtyPayGapPage() {
  const specData = loadSpecialties()
  const markupData = loadMarkup()
  const specialties = (specData.specialties || []).slice(0, 30)
  const markupBySpec = (markupData.by_specialty || []).slice(0, 20)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: 'The Specialty Pay Gap', href: '/investigations/specialty-pay-gap' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Analysis</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">The Specialty Pay Gap</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 16 min read</p>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-orange-900 font-medium text-lg">Mind the Gap</p>
            <p className="text-orange-800 mt-2">The top-paying specialty in Medicare earns <strong>15x more</strong> in markups than the lowest — reflecting deep structural inequities in how American healthcare compensates different types of care.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Procedure-Heavy Specialties Win</h2>
          <p className="text-gray-700 mb-4">Medicare&apos;s fee-for-service model fundamentally favors specialties that perform procedures over those that provide cognitive care. Anesthesiologists, surgeons, and interventional specialists command markups of 10-15x, while primary care physicians and psychiatrists see much lower ratios. This isn&apos;t a secret — it&apos;s the inevitable result of a payment system designed around procedures.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Markup Leaders</h2>
          <p className="text-gray-700 mb-4">Anesthesiology consistently has the highest markup ratios in Medicare. Anesthesiologists submit charges 15-16x what Medicare actually pays — reflecting a billing convention where submitted charges bear almost no relationship to actual payments. Pain management and interventional specialties follow closely behind.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Top Specialties by Markup Ratio</h2>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Markup</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Charges</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {markupBySpec.map((s: any) => (
                  <tr key={s.specialty} className="hover:bg-blue-50">
                    <td className="px-4 py-2 font-medium">{s.specialty}</td>
                    <td className="px-4 py-2 text-right"><span className={`font-bold ${s.avg_markup > 8 ? 'text-red-600' : s.avg_markup > 4 ? 'text-orange-600' : 'text-gray-700'}`}>{s.avg_markup?.toFixed(1)}x</span></td>
                    <td className="px-4 py-2 text-right">{formatCurrency(s.total_charges)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(s.total_payments)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Top Specialties by Total Payments</h2>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {specialties.map((s: any) => (
                  <tr key={s.specialty_slug} className="hover:bg-blue-50">
                    <td className="px-4 py-2"><Link href={`/specialties/${s.specialty_slug}`} className="text-blue-600 hover:text-blue-800 font-medium">{s.specialty}</Link></td>
                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(s.total_payments)}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{formatNumber(s.total_providers)}</td>
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
            <Link href="/investigations/specialty-gap" className="text-medicare-primary hover:underline text-sm">📊 The Specialty Pay Gap</Link>
            <Link href="/investigations/specialty-monopoly" className="text-medicare-primary hover:underline text-sm">🏛️ The Specialty Monopoly</Link>
            <Link href="/specialties" className="text-medicare-primary hover:underline text-sm">🩺 Browse All Specialties</Link>
            <Link href="/markup" className="text-medicare-primary hover:underline text-sm">📈 Markup Analysis</Link>
          </div>
        </div>

        <ShareButtons url="https://www.openmedicare.org/investigations/specialty-pay-gap" title="The Specialty Pay Gap — OpenMedicare" />
        <SourceCitation />
      </div>
    </main>
  )
}
