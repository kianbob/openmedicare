import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'
import FAQSchema from '@/components/FAQSchema'

export const metadata: Metadata = {
  title: 'Why Specialists Earn 7x More From Medicare (2026 Data)',
  description: 'Family doctors average $55K from Medicare while ophthalmologists pull $383K. See the 10-year data behind the specialty pay gap.',
  keywords: ['specialty pay gap medicare', 'doctor pay medicare', 'ophthalmology medicare pay', 'primary care shortage', 'RBRVS', 'RUC committee'],
  openGraph: {
    title: 'Why Specialists Earn 7x More From Medicare',
    description: 'Family doctors average $55K from Medicare while ophthalmologists pull $383K.',
  },
  alternates: {
    canonical: '/investigations/specialty-gap',
  },
}

const faqs = [
  {
    question: 'How much does a family doctor make from Medicare?',
    answer: 'The average family practice physician receives approximately $55,150 per year in Medicare payments. This is one of the lowest averages among medical specialties, despite family practice being the most common type of physician in the United States.',
  },
  {
    question: 'Which medical specialty earns the most from Medicare?',
    answer: 'Ophthalmology consistently ranks as the highest-paid physician specialty in Medicare, with average payments of approximately $383,731 per provider per year. This is driven by expensive drug injections (anti-VEGF agents) and high-volume surgical procedures like cataract surgery.',
  },
  {
    question: 'Why does Medicare pay specialists so much more than primary care?',
    answer: 'Medicare\'s Resource-Based Relative Value Scale (RBRVS) assigns higher values to surgical and procedural services than to cognitive work like office visits. The Relative Value Scale Update Committee (RUC), which recommends payment rates to CMS, has historically been dominated by specialist societies, leading to systematic undervaluation of primary care.',
  },
  {
    question: 'How does the specialty pay gap affect patients?',
    answer: 'The pay gap steers medical students toward higher-paying specialties, worsening the primary care physician shortage. The U.S. could face a shortage of 48,000 primary care physicians by 2034. When patients can\'t access primary care, they end up in emergency rooms — the most expensive setting for care delivery.',
  },
  {
    question: 'What is the RUC and why does it matter?',
    answer: 'The Relative Value Scale Update Committee (RUC) is an AMA panel that recommends payment rates to CMS for Medicare\'s physician fee schedule. It has 31 members, most representing specialist societies. Primary care has historically been underrepresented, contributing to the pay gap between specialists and primary care physicians.',
  },
]

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
  const internalMedicine = specialties.find(s => s.specialty === 'Internal Medicine')
  const psychiatry = specialties.find(s => s.specialty === 'Psychiatry')

  const gapMultiple = (ophthalmology && familyPractice)
    ? Math.round(ophthalmology.avg_payment_per_provider / familyPractice.avg_payment_per_provider)
    : 7

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ArticleJsonLd
          title="The Specialty Pay Gap: Why Specialists Earn 7x More From Medicare"
          description="Family doctors average $55K from Medicare while ophthalmologists pull $383K. The 10-year data behind the gap."
          url="https://www.openmedicare.us/investigations/specialty-gap"
          publishedDate="2026-02-15"
        />
        <FAQSchema faqs={faqs} />
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: 'The Specialty Gap' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Analysis</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">The Specialty Pay Gap</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · Updated July 2026 · 14 min read</p>

          <ShareButtons url="https://www.openmedicare.us/investigations/specialty-gap" title="The Specialty Pay Gap" />

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">Key Finding</p>
            <p className="text-blue-800 mt-2">
              A family practice physician receives an average of <strong>{formatCurrency(familyPractice?.avg_payment_per_provider || 55150)}</strong> per year from Medicare — while an ophthalmologist receives <strong>{formatCurrency(ophthalmology?.avg_payment_per_provider || 383731)}</strong>. That&apos;s a <strong>{gapMultiple}x</strong> difference.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Doctors Who Keep You Healthy Earn the Least</h2>
          <p className="text-gray-700 mb-4">
            Primary care is the backbone of healthcare. Family practice physicians, general practitioners, and internists are the providers most Americans see first — and most often. They manage chronic conditions, coordinate care, and catch problems before they become catastrophic. Yet Medicare pays them a fraction of what it pays specialists.
          </p>
          <p className="text-gray-700 mb-4">
            Our analysis of 10 years of Medicare payment data reveals a stark reality: the average family practice physician receives just {formatCurrency(familyPractice?.avg_payment_per_provider || 55150)} in total Medicare payments per year. Meanwhile, cardiologists average {formatCurrency(cardiology?.avg_payment_per_provider || 193093)}, dermatologists earn {formatCurrency(dermatology?.avg_payment_per_provider || 212651)}, and ophthalmologists top the physician rankings at {formatCurrency(ophthalmology?.avg_payment_per_provider || 383731)}.
          </p>

          <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-red-900">{formatCurrency(familyPractice?.avg_payment_per_provider || 55150)}</p>
              <p className="text-xs text-red-700">Family Practice</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-blue-900">{formatCurrency(internalMedicine?.avg_payment_per_provider || 68000)}</p>
              <p className="text-xs text-blue-700">Internal Medicine</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-purple-900">{formatCurrency(cardiology?.avg_payment_per_provider || 193093)}</p>
              <p className="text-xs text-purple-700">Cardiology</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-green-900">{formatCurrency(ophthalmology?.avg_payment_per_provider || 383731)}</p>
              <p className="text-xs text-green-700">Ophthalmology</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why the Gap Exists</h2>
          <p className="text-gray-700 mb-4">
            Medicare&apos;s payment system is built around procedures. The Resource-Based Relative Value Scale (RBRVS) assigns higher values to surgical and procedural services than to the cognitive work of evaluation and management. A 15-minute cataract surgery can reimburse more than a 45-minute complex care visit for a patient with diabetes, hypertension, and depression.
          </p>
          <p className="text-gray-700 mb-4">
            This isn&apos;t an accident — it reflects decades of lobbying by specialty societies on the RUC (Relative Value Scale Update Committee), the AMA panel that recommends payment rates to CMS. Primary care has historically been underrepresented on this committee, leading to systematic undervaluation of cognitive and preventive services.
          </p>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-orange-900 font-medium text-lg">The RUC Problem</p>
            <p className="text-orange-800 mt-2">The Relative Value Scale Update Committee has <strong>31 members</strong>, the majority representing specialty societies. Primary care holds only <strong>4-5 seats</strong>. This committee&apos;s recommendations are accepted by CMS <strong>over 90% of the time</strong> — effectively allowing specialists to set their own prices while undervaluing the work of primary care.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Ophthalmology Anomaly</h2>
          <p className="text-gray-700 mb-4">
            Ophthalmology&apos;s dominance at the top of the pay rankings might seem surprising — eye doctors earning more than heart surgeons? The answer lies in two factors: high-volume cataract surgery (one of the most common surgical procedures in America, with over 4 million performed annually) and expensive anti-VEGF drug injections for macular degeneration.
          </p>
          <p className="text-gray-700 mb-4">
            A single eye injection of Eylea (aflibercept) generates roughly $1,800-$2,200 in Medicare payments. An ophthalmologist administering 20-30 injections per week — which is common — generates $2-3 million in annual Medicare payments from drug administration alone. Add cataract surgeries and routine eye exams, and the total far exceeds what most other specialties can bill.
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

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-red-900 font-medium text-lg">The Primary Care Crisis</p>
            <p className="text-red-800 mt-2">
              <strong>48,000</strong> — projected primary care physician shortage by 2034<br />
              <strong>30%</strong> — of primary care physicians plan to retire within 5 years<br />
              <strong>$200K+</strong> — average medical school debt, steering graduates toward high-paying specialties<br />
              <strong>11%</strong> — of physicians who practice in rural areas (despite 20% of population living there)
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The International Comparison</h2>
          <p className="text-gray-700 mb-4">
            The U.S. specialty pay gap is extreme by international standards. In the UK&apos;s NHS, the ratio between the highest and lowest-paid specialties is roughly 2:1. In Canada, it&apos;s about 3:1. In the U.S. Medicare system, the ratio exceeds 7:1 — and when you include private insurance payments, it can reach 10:1 or higher.
          </p>
          <p className="text-gray-700 mb-4">
            Countries with smaller specialty pay gaps tend to have stronger primary care systems, better health outcomes, and lower per-capita health spending. This isn&apos;t a coincidence.
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
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Nurse Practitioner Response</h2>
          <p className="text-gray-700 mb-4">
            As primary care physician supply declines, nurse practitioners (NPs) and physician assistants (PAs) have filled much of the gap. NPs now provide over 25% of all Medicare primary care visits, and their numbers are growing 10% annually. Medicare pays NPs at 85% of the physician rate — a policy that makes NP-provided primary care more cost-effective while still providing substantial income for NP practices.
          </p>
          <p className="text-gray-700 mb-4">
            The rise of NPs in Medicare hasn&apos;t eliminated the specialty pay gap — it has, in some ways, institutionalized it. As NPs take over more primary care, physicians increasingly migrate toward specialty practice, further concentrating Medicare&apos;s highest payments among procedural specialists.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recent Reforms and What&apos;s Coming</h2>
          <p className="text-gray-700 mb-4">
            CMS has taken some steps to address the gap. In 2021, CMS increased payments for evaluation and management (E/M) codes — the bread and butter of primary care billing. This resulted in a modest redistribution toward primary care, though the overall gap remains vast.
          </p>
          <p className="text-gray-700 mb-4">
            For 2026, CMS has proposed further E/M increases and a new payment category for chronic care management that could benefit primary care. However, these changes are offset by a scheduled 3.37% across-the-board payment cut (the conversion factor reduction), which disproportionately affects lower-revenue primary care practices.
          </p>

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

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Data Is Clear</h2>
          <p className="text-gray-700 mb-4">
            Ten years of Medicare payment data leave no room for ambiguity: the system pays dramatically more for procedures than for the cognitive work of managing chronic disease, coordinating care, and preventing illness. This isn&apos;t a bug in the system — it&apos;s the system working exactly as designed. Changing it requires confronting the specialty societies that benefit from the status quo, reforming the RUC, and ultimately deciding as a society whether we value prevention as much as intervention.
          </p>
          <p className="text-gray-700 mb-4">
            Use our <Link href="/investigations/how-much-does-your-doctor-make" className="text-blue-600 hover:underline">interactive specialty pay tool</Link> to explore the data for any medical specialty.
          </p>
        </article>

        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/specialty-monopoly" className="text-medicare-primary hover:underline text-sm">🏛️ The Specialty Monopoly</Link>
            <Link href="/investigations/how-much-does-medicare-pay" className="text-medicare-primary hover:underline text-sm">💰 How Much Does Medicare Pay?</Link>
            <Link href="/investigations/specialty-pay-gap" className="text-medicare-primary hover:underline text-sm">📊 Specialty Markup Analysis</Link>
            <Link href="/investigations/how-much-does-your-doctor-make" className="text-medicare-primary hover:underline text-sm">🩺 How Much Does Your Doctor Make?</Link>
            <Link href="/investigations/eye-care-billions" className="text-medicare-primary hover:underline text-sm">👁️ Eye Care Billions</Link>
            <Link href="/investigations/nurse-practitioner-boom" className="text-medicare-primary hover:underline text-sm">👩‍⚕️ Rise of the Nurse Practitioner</Link>
            <Link href="/investigations/rural-price-tag" className="text-medicare-primary hover:underline text-sm">🌾 The Rural Price Tag</Link>
            <Link href="/specialties" className="text-medicare-primary hover:underline text-sm">🩺 Browse All Specialties</Link>
          </div>
        </div>

        <SourceCitation sources={[
          'CMS Medicare Provider Utilization and Payment Data (2014-2024)',
          'AAMC Physician Workforce Projections (2021-2034)',
          'AMA RUC Membership and Voting Records',
          'MedPAC Report to Congress, March 2026',
          'CMS Proposed Rule: Medicare Physician Fee Schedule CY2026',
        ]} />
      </div>
    </main>
  )
}
