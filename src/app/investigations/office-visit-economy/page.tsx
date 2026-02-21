import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: 'The $117 Billion Office Visit Economy — OpenMedicare',
  description: 'Two billing codes — 99213 and 99214 — account for $117.6 billion in Medicare payments. The upcoding concern is real.',
}

const officeVisitCodes = [
  { code: '99214', description: 'Established patient, ~25 min (moderate complexity)', payments: 73279290511, services: 974725328, providers: 4219518, avgPayment: 72.68 },
  { code: '99213', description: 'Established patient, ~15 min (low complexity)', payments: 44366912284, services: 870458946, providers: 4415158, avgPayment: 49.50 },
  { code: '99215', description: 'Established patient, ~40 min (high complexity)', payments: 10077175301, services: 93886889, providers: 1202777, avgPayment: 104.43 },
  { code: '99204', description: 'New patient, ~45 min (moderate complexity)', payments: 10947106736, services: 96082841, providers: 1855301, avgPayment: 111.38 },
  { code: '99203', description: 'New patient, ~30 min (low complexity)', payments: 6860202998, services: 95499405, providers: 1679846, avgPayment: 69.68 },
  { code: '99205', description: 'New patient, ~60 min (high complexity)', payments: 3590946290, services: 23760335, providers: 611581, avgPayment: 149.36 },
  { code: '99212', description: 'Established patient, ~10 min (straightforward)', payments: 3207546772, services: 103300191, providers: 1239818, avgPayment: 30.66 },
  { code: '99202', description: 'New patient, ~20 min (straightforward)', payments: 876018804, services: 18445533, providers: 414812, avgPayment: 46.63 },
]

export default function OfficeVisitEconomyPage() {
  const combined99213_99214 = 73279290511 + 44366912284
  const totalOfficeVisit = officeVisitCodes.reduce((s, c) => s + c.payments, 0)
  const ratio99214to99213 = (974725328 / 870458946).toFixed(2)
  const totalServices99213_99214 = 974725328 + 870458946

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'The $117 Billion Office Visit Economy' },
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Investigation
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            The $117 Billion Office Visit Economy
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 14 min read</p>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-indigo-900 font-medium text-lg">Key Finding</p>
            <p className="text-indigo-800 mt-2">
              Two billing codes — <strong>99214</strong> and <strong>99213</strong> — account
              for <strong>{formatCurrency(combined99213_99214)}</strong> in cumulative Medicare
              payments, more than any other pair of codes in the entire system. Together,
              they represent {formatNumber(totalServices99213_99214)} services — roughly
              1.85 billion office visits over 10 years.
            </p>
          </div>

          <p className="text-gray-700 mb-4">
            The backbone of American medicine isn&apos;t surgery or high-tech imaging — it&apos;s
            the office visit. Every year, hundreds of millions of Medicare beneficiaries sit
            in exam rooms for 10–40 minutes while their doctors assess, diagnose, and manage
            their conditions. The billing codes for these encounters — the 99211–99215 series
            for established patients and 99201–99205 for new patients — represent the single
            largest category of Medicare spending.
          </p>
          <p className="text-gray-700 mb-4">
            And within this category, two codes utterly dominate: <strong>99214</strong> (established
            patient, moderate complexity, ~25 minutes) at {formatCurrency(73279290511)}, and
            <strong> 99213</strong> (established patient, low complexity, ~15 minutes) at
            {formatCurrency(44366912284)}.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Complete Office Visit Landscape
          </h2>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Office Visit Codes by Medicare Payments</h3>
            <p className="text-sm text-gray-500">Evaluation & Management codes, 2014–2023 cumulative</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg/Service</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {officeVisitCodes.map((c) => (
                  <tr key={c.code} className={`hover:bg-blue-50 ${c.code === '99214' || c.code === '99213' ? 'bg-indigo-50' : ''}`}>
                    <td className="px-4 py-3">
                      <Link href={`/procedures/${c.code}`} className="text-blue-600 hover:text-blue-800 font-mono font-bold">
                        {c.code}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{c.description}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(c.payments)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatNumber(c.services)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">${c.avgPayment.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2">
                <tr>
                  <td className="px-4 py-3 font-bold" colSpan={2}>Total Office Visit Codes</td>
                  <td className="px-4 py-3 text-right font-bold">{formatCurrency(totalOfficeVisit)}</td>
                  <td className="px-4 py-3 text-right font-bold">{formatNumber(officeVisitCodes.reduce((s, c) => s + c.services, 0))}</td>
                  <td className="px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            All eight office visit codes combined account for {formatCurrency(totalOfficeVisit)} —
            roughly <strong>17.8% of all Medicare spending</strong>. This is the foundation of the
            entire Medicare payment system, and any change to these codes ripples across every
            medical practice in the country.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Upcoding Concern: 99214 vs. 99213
          </h2>
          <p className="text-gray-700 mb-4">
            One of the most closely watched metrics in Medicare oversight is the ratio of 99214
            to 99213 billing. The 99214 code pays about {formatCurrency(72.68)} per visit — 47%
            more than the {formatCurrency(49.50)} for a 99213. The key difference is supposed to
            be medical complexity and time spent.
          </p>
          <p className="text-gray-700 mb-4">
            The concern: 99214 is now billed <strong>{ratio99214to99213}x more often</strong> than
            99213. With {formatNumber(974725328)} services coded as 99214 versus {formatNumber(870458946)} as
            99213, the higher-paying code has overtaken the lower one in volume.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-amber-900 font-medium text-lg">⚠️ The Upcoding Red Flag</p>
            <p className="text-amber-800 mt-2">
              Our upcoding analysis confirms: the national 99214-to-99213 ratio is <strong>1.44</strong>, with
              <strong> 53.2%</strong> of all E/M visits now coded as 99214. Over the past decade, the 99214 share
              rose from <strong>41.5% to 52.8%</strong>. If just 10% of 99214 visits were actually 99213-level encounters that were
              &quot;upcoded,&quot; the cost to Medicare would be approximately
              <strong> {formatCurrency(974725328 * 0.1 * (72.68 - 49.50))}</strong> in
              overpayments over the analysis period.
            </p>
            <p className="text-amber-700 mt-2 text-sm">
              <Link href="/fraud/upcoding" className="underline font-medium">Explore the full upcoding analysis →</Link>
            </p>
          </div>

          <p className="text-gray-700 mb-4">
            Not all 99214 billing represents upcoding. The 2021 E/M documentation changes
            actually shifted coding guidelines to focus on medical decision-making rather than
            documentation length, which legitimately increased 99214 usage. But the trend
            predates 2021, and the OIG has flagged office visit upcoding as a persistent concern.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            What These Visits Actually Look Like
          </h2>
          <p className="text-gray-700 mb-4">
            Understanding what each code represents helps illuminate the stakes:
          </p>

          <div className="not-prose space-y-3 mb-6">
            <div className="bg-white border rounded-lg p-4 border-l-4 border-gray-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono font-bold text-gray-900">99212 — Straightforward</p>
                  <p className="text-sm text-gray-600 mt-1">Simple follow-up: checking a healing wound, stable chronic condition. ~10 min.</p>
                </div>
                <p className="font-bold text-gray-600">{formatCurrency(30.66)}</p>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-4 border-l-4 border-blue-400">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono font-bold text-gray-900">99213 — Low Complexity</p>
                  <p className="text-sm text-gray-600 mt-1">Routine chronic disease management: adjusting blood pressure med, diabetes check. ~15 min.</p>
                </div>
                <p className="font-bold text-blue-600">{formatCurrency(49.50)}</p>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-4 border-l-4 border-indigo-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono font-bold text-gray-900">99214 — Moderate Complexity</p>
                  <p className="text-sm text-gray-600 mt-1">Multiple conditions, new symptoms, or drug interactions. Requires more clinical judgment. ~25 min.</p>
                </div>
                <p className="font-bold text-indigo-600">{formatCurrency(72.68)}</p>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-4 border-l-4 border-purple-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono font-bold text-gray-900">99215 — High Complexity</p>
                  <p className="text-sm text-gray-600 mt-1">Complex multimorbidity, severe symptoms, difficult diagnostic or therapeutic decisions. ~40 min.</p>
                </div>
                <p className="font-bold text-purple-600">{formatCurrency(104.43)}</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Taxpayer Cost
          </h2>
          <p className="text-gray-700 mb-4">
            To put the {formatCurrency(combined99213_99214)} in perspective:
          </p>
          <ul className="text-gray-700 mb-4">
            <li>It exceeds the <strong>entire GDP of Ecuador</strong> ($110 billion).</li>
            <li>It&apos;s more than the <strong>combined annual revenue</strong> of Pfizer and Merck.</li>
            <li>It could fund <strong>NASA&apos;s budget for 4.7 years</strong>.</li>
            <li>It represents about <strong>$11.7 billion per year</strong> — or <strong>$182 per
            Medicare beneficiary</strong> annually just for these two codes.</li>
          </ul>

          <div className="bg-indigo-50 rounded-lg p-6 not-prose mb-6">
            <h4 className="font-semibold text-indigo-900 mb-3">The Office Visit Economy</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-indigo-700">{formatCurrency(combined99213_99214)}</p>
                <p className="text-sm text-indigo-600">99213 + 99214 combined</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-700">1.85B</p>
                <p className="text-sm text-indigo-600">Total services</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-700">17.8%</p>
                <p className="text-sm text-indigo-600">Share of all Medicare</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-700">{ratio99214to99213}x</p>
                <p className="text-sm text-indigo-600">99214 to 99213 ratio</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Who Bills These Codes?
          </h2>
          <p className="text-gray-700 mb-4">
            Nearly every physician specialty bills office visit codes, but the concentration is
            highest in primary care. <strong>Internal Medicine</strong> ({formatCurrency(77041896330)} total
            payments) and <strong>Family Practice</strong> ({formatCurrency(44348467719)} total) are
            the two largest specialties by Medicare payments, and office visits constitute the
            majority of their billing.
          </p>
          <p className="text-gray-700 mb-4">
            The 99214 code alone has {formatNumber(4219518)} unique billing providers — meaning more
            than a third of all Medicare providers bill this single code. It&apos;s arguably the most
            universal billing code in medicine.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why This Matters</h2>
          <p className="text-gray-700 mb-4">
            Office visits are the gateway to everything else in medicine — every referral, every
            prescription, every surgery begins with an office encounter. The $117.6 billion spent
            on just two codes reflects the volume-driven nature of American healthcare, where
            doctors must see many patients to earn sustainable income.
          </p>
          <p className="text-gray-700 mb-4">
            The ongoing shift toward 99214 coding raises important questions: Are patients genuinely
            sicker and more complex? Are documentation requirements driving legitimate coding changes?
            Or is there systematic upcoding that costs taxpayers billions? The answer is likely all
            three, in varying proportions — and getting the mix right is essential to maintaining
            Medicare&apos;s financial sustainability.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Related Investigations</h2>
          <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link href="/investigations/where-medicare-dollar-goes" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Where Your Medicare Dollar Goes</h4>
              <p className="text-sm text-gray-500 mt-1">The full breakdown of $854.8B in spending</p>
            </Link>
            <Link href="/investigations/specialty-pay-gap" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Specialty Pay Gap</h4>
              <p className="text-sm text-gray-500 mt-1">Which specialties earn the most from Medicare</p>
            </Link>
            <Link href="/investigations/markup-machine" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Markup Machine</h4>
              <p className="text-sm text-gray-500 mt-1">How charges diverge from what Medicare actually pays</p>
            </Link>
            <Link href="/investigations/pandemic-recovery" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Medicare&apos;s Pandemic Recovery</h4>
              <p className="text-sm text-gray-500 mt-1">How office visits rebounded after COVID-19</p>
            </Link>
          </div>
        </article>

        <ShareButtons
          url="https://openmedicare.vercel.app/investigations/office-visit-economy"
          title="The $117 Billion Office Visit Economy — OpenMedicare"
        />
        <SourceCitation />
      </div>
    </main>
  )
}
