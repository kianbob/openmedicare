import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'The Specialty Pay Gap',
  description: 'Primary care physicians earn a fraction of what specialists receive from Medicare. An analysis of the specialty pay gap and its implications for healthcare access.',
}

interface SpecialtyRow {
  specialty: string
  avg_payment_per_provider: number
}

function loadSpecialties(): SpecialtyRow[] {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'specialties.json'), 'utf-8')
    const data = JSON.parse(raw)
    return (data.specialties || []) as SpecialtyRow[]
  } catch {
    return []
  }
}

export default function SpecialtyGapPage() {
  const specialties = loadSpecialties()
  const sorted = [...specialties].sort((a, b) => b.avg_payment_per_provider - a.avg_payment_per_provider)
  const top10 = sorted.slice(0, 10)
  const bottom10 = sorted.slice(-10).reverse()

  const familyPractice = specialties.find(s => s.specialty === 'Family Practice')
  const cardiology = specialties.find(s => s.specialty === 'Cardiology')
  const ophthalmology = specialties.find(s => s.specialty === 'Ophthalmology')
  const dermatology = specialties.find(s => s.specialty === 'Dermatology')

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: 'The Specialty Gap' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Analysis</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">The Specialty Pay Gap</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 11 min read</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">Key Finding</p>
            <p className="text-blue-800 mt-2">
              A family practice physician receives an average of <strong>{formatCurrency(familyPractice?.avg_payment_per_provider || 55150)}</strong> per year from Medicare — while an ophthalmologist receives <strong>{formatCurrency(ophthalmology?.avg_payment_per_provider || 383731)}</strong>. That&apos;s a <strong>{Math.round((ophthalmology?.avg_payment_per_provider || 383731) / (familyPractice?.avg_payment_per_provider || 55150))}x</strong> difference.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Doctors Who Keep You Healthy Earn the Least</h2>
          <p className="text-gray-700 mb-4">
            Primary care is the backbone of healthcare. Family practice physicians, general practitioners, and internists are the providers most Americans see first — and most often. They manage chronic conditions, coordinate care, and catch problems before they become catastrophic. Yet Medicare pays them a fraction of what it pays specialists.
          </p>
          <p className="text-gray-700 mb-4">
            Our analysis of 10 years of Medicare payment data reveals a stark reality: the average family practice physician receives just {formatCurrency(familyPractice?.avg_payment_per_provider || 55150)} in total Medicare payments per year. Meanwhile, cardiologists average {formatCurrency(cardiology?.avg_payment_per_provider || 193093)}, dermatologists earn {formatCurrency(dermatology?.avg_payment_per_provider || 212651)}, and ophthalmologists top the physician rankings at {formatCurrency(ophthalmology?.avg_payment_per_provider || 383731)}.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why the Gap Exists</h2>
          <p className="text-gray-700 mb-4">
            Medicare&apos;s payment system is built around procedures. The Resource-Based Relative Value Scale (RBRVS) assigns higher values to surgical and procedural services than to the cognitive work of evaluation and management. A 15-minute cataract surgery can reimburse more than a 45-minute complex care visit for a patient with diabetes, hypertension, and depression.
          </p>
          <p className="text-gray-700 mb-4">
            This isn&apos;t an accident — it reflects decades of lobbying by specialty societies on the RUC (Relative Value Scale Update Committee), the AMA panel that recommends payment rates to CMS. Primary care has historically been underrepresented on this committee, leading to systematic undervaluation of cognitive and preventive services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Consequences</h2>
          <p className="text-gray-700 mb-4">
            The pay gap has real consequences for healthcare access. Medical students graduating with $200,000+ in debt are rationally steered toward higher-paying specialties. The result: a growing shortage of primary care physicians in the United States, particularly in rural and underserved areas.
          </p>
          <p className="text-gray-700 mb-4">
            According to the AAMC, the U.S. could face a shortage of up to 48,000 primary care physicians by 2034. Meanwhile, specialist supply remains relatively stable. The financial incentives embedded in Medicare&apos;s payment system are a major driver of this imbalance.
          </p>
          <p className="text-gray-700 mb-4">
            When patients can&apos;t access primary care, they end up in emergency rooms — the most expensive setting for care delivery. Chronic conditions go unmanaged, leading to costly hospitalizations that could have been prevented with routine visits. The system pays less for prevention and more for crisis.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Numbers</h2>
          <p className="text-gray-700 mb-4">
            Below are the highest-paid and lowest-paid specialties by average Medicare payment per provider, based on our analysis of 10 years of CMS data.
          </p>
        </article>

        {/* Top 10 Highest Paid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="px-6 py-4 bg-red-50 border-b border-red-100">
            <h3 className="font-bold text-red-900">Top 10 Highest-Paid Specialties</h3>
            <p className="text-sm text-red-700">Average annual Medicare payment per provider</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Payment / Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {top10.map((s, i) => (
                  <tr key={s.specialty} className="hover:bg-red-50">
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2 font-medium text-gray-900">{s.specialty}</td>
                    <td className="px-4 py-2 text-right font-bold text-red-700">{formatCurrency(s.avg_payment_per_provider)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom 10 Lowest Paid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <h3 className="font-bold text-blue-900">Bottom 10 Lowest-Paid Specialties</h3>
            <p className="text-sm text-blue-700">Average annual Medicare payment per provider</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Payment / Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bottom10.map((s, i) => (
                  <tr key={s.specialty} className="hover:bg-blue-50">
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2 font-medium text-gray-900">{s.specialty}</td>
                    <td className="px-4 py-2 text-right font-bold text-blue-700">{formatCurrency(s.avg_payment_per_provider)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Can Be Done?</h2>
          <p className="text-gray-700 mb-4">
            CMS has taken incremental steps to boost primary care payments, including increases to evaluation and management (E/M) codes in recent years. But the structural incentives remain tilted toward procedural medicine. Meaningful reform would require restructuring how Medicare values cognitive vs. procedural work — a politically challenging undertaking given specialist lobbying power.
          </p>
          <p className="text-gray-700 mb-4">
            Some policy proposals include: direct primary care payment models that bypass fee-for-service, expanding the CMS Innovation Center&apos;s primary care experiments, reforming the RUC to give primary care more representation, and tying medical school loan forgiveness to primary care practice in underserved areas.
          </p>
          <p className="text-gray-700 mb-4">
            Until the payment gap narrows, America&apos;s primary care crisis will continue to deepen — and the patients who need basic, preventive healthcare the most will be the ones who suffer.
          </p>
        </article>

        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/specialty-monopoly" className="text-medicare-primary hover:underline text-sm">🏛️ The Specialty Monopoly</Link>
            <Link href="/investigations/how-much-does-medicare-pay" className="text-medicare-primary hover:underline text-sm">💰 How Much Does Medicare Pay?</Link>
            <Link href="/investigations/specialty-pay-gap" className="text-medicare-primary hover:underline text-sm">📊 Specialty Pay Gap Extended</Link>
            <Link href="/specialties" className="text-medicare-primary hover:underline text-sm">🩺 Browse All Specialties</Link>
          </div>
        </div>

        <ShareButtons url="https://www.openmedicare.org/investigations/specialty-gap" title="The Specialty Pay Gap" />
        <SourceCitation />
      </div>
    </main>
  )
}
