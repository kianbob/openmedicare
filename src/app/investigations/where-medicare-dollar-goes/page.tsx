import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Where Your Medicare Dollar Goes — OpenMedicare',
  description: 'Breaking down $854.8 billion in Medicare Part B spending: office visits, surgeries, drugs, diagnostics, and more.',
}

const categories = [
  {
    category: 'Office & Outpatient Visits',
    payments: 153200000000,
    share: 17.9,
    color: 'bg-blue-500',
    description: 'E/M codes (99202-99215), wellness visits, nursing facility visits',
    topCodes: '99214 ($73.3B), 99213 ($44.4B), 99215 ($10.1B)',
  },
  {
    category: 'Hospital Inpatient Care',
    payments: 80600000000,
    share: 9.4,
    color: 'bg-indigo-500',
    description: 'Hospital visits, critical care, discharge management',
    topCodes: '99232 ($24.3B), 99233 ($19.2B), 99223 ($15.2B)',
  },
  {
    category: 'Drugs & Biologics',
    payments: 94242035519,
    share: 11.0,
    color: 'bg-orange-500',
    description: 'Physician-administered drugs (Part B), vaccines, chemotherapy',
    topCodes: 'J0178 ($19.7B), J2778 ($7.8B), J0897 ($6.0B)',
  },
  {
    category: 'Eye Care & Ophthalmology',
    payments: 66253000000,
    share: 7.8,
    color: 'bg-cyan-500',
    description: 'Eye exams, cataract surgery, retinal injections, glaucoma treatment',
    topCodes: '66984 ($16.3B), 92014 ($9.3B), J0178 (shared with drugs)',
  },
  {
    category: 'Diagnostic Imaging',
    payments: 45000000000,
    share: 5.3,
    color: 'bg-purple-500',
    description: 'CT scans, MRIs, X-rays, ultrasounds, nuclear medicine',
    topCodes: '74177 ($2.7B), 70450 ($1.7B), 72148 ($1.3B)',
  },
  {
    category: 'Ambulance & Transport',
    payments: 36400000000,
    share: 4.3,
    color: 'bg-red-500',
    description: 'Emergency and non-emergency ambulance, air transport, mileage',
    topCodes: 'A0427 ($15.8B), A0429 ($8.3B), A0428 ($8.0B)',
  },
  {
    category: 'Lab Tests & Pathology',
    payments: 57173000000,
    share: 6.7,
    color: 'bg-green-500',
    description: 'Blood tests, pathology, genetic testing, drug screens',
    topCodes: '88305 ($7.3B), 80053 ($3.1B), 84443 ($2.9B)',
  },
  {
    category: 'Physical Therapy & Rehab',
    payments: 35000000000,
    share: 4.1,
    color: 'bg-teal-500',
    description: 'Therapeutic exercises, manual therapy, occupational therapy',
    topCodes: '97110 ($10.9B), 97530 ($4.7B), 97140 ($4.5B)',
  },
  {
    category: 'Surgical Procedures',
    payments: 42000000000,
    share: 4.9,
    color: 'bg-pink-500',
    description: 'Joint replacements, spinal surgery, vascular procedures, Mohs',
    topCodes: '27447 ($3.7B), 17311 ($3.4B), 27130 ($1.8B)',
  },
  {
    category: 'Cardiology',
    payments: 34817000000,
    share: 4.1,
    color: 'bg-rose-500',
    description: 'Echocardiograms, cardiac catheterization, stress tests, stents',
    topCodes: '93306 ($6.4B), 78452 ($3.5B), 93229 ($1.9B)',
  },
  {
    category: 'Radiation & Oncology',
    payments: 22400000000,
    share: 2.6,
    color: 'bg-amber-500',
    description: 'Radiation therapy, chemotherapy administration, oncology management',
    topCodes: 'G6015 ($3.1B), 77427 ($1.5B), 96413 ($1.8B)',
  },
  {
    category: 'Emergency Department',
    payments: 19800000000,
    share: 2.3,
    color: 'bg-red-600',
    description: 'ED visits at all severity levels',
    topCodes: '99285 ($14.2B), 99284 ($4.4B), 99283 ($1.1B)',
  },
  {
    category: 'Mental Health',
    payments: 8500000000,
    share: 1.0,
    color: 'bg-violet-500',
    description: 'Psychotherapy, psychiatric evaluations, depression screening',
    topCodes: '90837 ($3.3B), 90834 ($2.1B), 90832 ($0.9B)',
  },
  {
    category: 'All Other',
    payments: 159409000000,
    share: 18.6,
    color: 'bg-gray-400',
    description: 'Dialysis, chiropractic, dermatology, urology, and hundreds more',
    topCodes: 'Various',
  },
]

export default function WhereMedicareDollarGoesPage() {
  const totalSpending = 854842324155

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'Where Your Medicare Dollar Goes' },
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Analysis
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Where Your Medicare Dollar Goes
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 16 min read</p>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-green-900 font-medium text-lg">Key Finding</p>
            <p className="text-green-800 mt-2">
              Over 10 years, Medicare Part B spent <strong>{formatCurrency(totalSpending)}</strong> on
              physician services and outpatient care. Office visits alone account for 18 cents
              of every dollar, while drugs consume 11 cents. The largest single line item?
              The 99214 office visit code at <strong>{formatCurrency(73279290511)}</strong>.
            </p>
          </div>

          <p className="text-gray-700 mb-4">
            Where does your Medicare dollar actually go? It&apos;s a question that {formatNumber(67000000)} Medicare
            beneficiaries and every taxpayer should be asking. The answer, drawn from a decade of
            billing data across {formatNumber(1175281)} providers and hundreds of procedure codes,
            reveals a system dominated by routine office visits, expensive drugs, and
            high-volume surgical procedures.
          </p>
          <p className="text-gray-700 mb-6">
            This analysis categorizes every major procedure code by clinical function to build
            a comprehensive picture of where the money flows — from the first blood draw to the
            last radiation session.
          </p>

          {/* The Dollar Bill Breakdown */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Medicare Dollar: A Visual Breakdown
          </h2>
          <p className="text-gray-700 mb-4">
            If you could hold a single Medicare dollar in your hand, here&apos;s how it would
            be divided:
          </p>
        </article>

        {/* Visual dollar breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6 mb-8">
          <div className="flex flex-wrap gap-1 mb-6 h-12 rounded-lg overflow-hidden">
            {categories.filter(c => c.share >= 2).map((c) => (
              <div
                key={c.category}
                className={`${c.color} h-full flex items-center justify-center text-white text-xs font-bold`}
                style={{ width: `${c.share}%`, minWidth: c.share >= 4 ? '40px' : '20px' }}
                title={`${c.category}: ${c.share}%`}
              >
                {c.share >= 4 ? `${c.share}%` : ''}
              </div>
            ))}
            <div className="bg-gray-400 h-full flex items-center justify-center text-white text-xs font-bold flex-1">
              Other
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((c) => (
              <div key={c.category} className="flex items-start gap-2">
                <div className={`w-3 h-3 rounded-sm mt-1 flex-shrink-0 ${c.color}`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.category}</p>
                  <p className="text-xs text-gray-500">{c.share}% · {formatCurrency(c.payments)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Medicare Part B Spending by Category</h3>
            <p className="text-sm text-gray-500">Estimated from procedure-level data, 2014–2023</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Estimated Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Share</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Top Codes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((c) => (
                  <tr key={c.category} className="hover:bg-blue-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${c.color}`}></div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{c.category}</p>
                          <p className="text-xs text-gray-500">{c.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(c.payments)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-gray-700">{c.share}%</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{c.topCodes}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2">
                <tr>
                  <td className="px-4 py-3 font-bold">Total Medicare Part B</td>
                  <td className="px-4 py-3 text-right font-bold">{formatCurrency(totalSpending)}</td>
                  <td className="px-4 py-3 text-right font-bold">100%</td>
                  <td className="px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Office vs. Facility: Where Care Happens
          </h2>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 my-6 not-prose">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-indigo-700">{formatCurrency(558000000000)}</p>
                <p className="text-sm text-indigo-600">Office settings (65%)</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-700">{formatCurrency(297000000000)}</p>
                <p className="text-sm text-purple-600">Facility settings (35%)</p>
              </div>
            </div>
            <p className="text-sm text-indigo-800 mt-3 text-center">
              Nearly two-thirds of all Medicare Part B spending occurs in office settings.{' '}
              <Link href="/place-of-service" className="underline font-medium">See the full place-of-service breakdown →</Link>
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Office Visit Foundation
          </h2>
          <p className="text-gray-700 mb-4">
            Nearly 18 cents of every Medicare dollar goes to office and outpatient visits —
            the bread and butter of ambulatory care. The 99214 code alone ({formatCurrency(73279290511)})
            accounts for 8.6% of all Medicare spending. Combined with 99213 ({formatCurrency(44366912284)}),
            these two codes represent the single largest pair of spending items in the system.
          </p>
          <p className="text-gray-700 mb-4">
            This spending funds the basic infrastructure of healthcare delivery: the 15-to-25-minute
            encounters where doctors manage chronic diseases, adjust medications, order tests,
            and refer to specialists. Without it, the rest of the system doesn&apos;t function.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Drug Question: 11 Cents on the Dollar
          </h2>
          <p className="text-gray-700 mb-4">
            Drugs and biologics account for {formatCurrency(94242035519)} — 11% of total spending.
            This covers only Part B drugs (those administered in physician offices and outpatient
            settings), not Part D pharmacy drugs. The concentration is extreme: just one drug
            (aflibercept) accounts for {((19714688991 / 94242035519) * 100).toFixed(1)}% of all
            Part B drug spending.
          </p>
          <p className="text-gray-700 mb-4">
            By 2023, drugs represented 14.8% of total spending — up from about 9% at the
            start of the analysis period. This reflects both the approval of new expensive
            biologics and the shift of cancer treatment to outpatient settings.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Markup Tax: Charges vs. Payments
          </h2>
          <p className="text-gray-700 mb-4">
            Across the entire system, providers submitted charges totaling roughly
            {formatCurrency(totalSpending * 3.96)} — about 4 times what Medicare actually paid.
            This &quot;markup tax&quot; doesn&apos;t directly cost Medicare beneficiaries, but it
            inflates the sticker prices that affect uninsured patients and distort private
            insurance negotiations.
          </p>

          <div className="bg-green-50 rounded-lg p-6 not-prose mb-6">
            <h4 className="font-semibold text-green-900 mb-3">Your Medicare Dollar at a Glance</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-blue-600">18¢</p>
                <p className="text-sm text-gray-600">Office visits</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-600">11¢</p>
                <p className="text-sm text-gray-600">Drugs & biologics</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-600">9¢</p>
                <p className="text-sm text-gray-600">Hospital care</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-cyan-600">8¢</p>
                <p className="text-sm text-gray-600">Eye care</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-4">
              <div>
                <p className="text-3xl font-bold text-green-600">7¢</p>
                <p className="text-sm text-gray-600">Lab tests</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">5¢</p>
                <p className="text-sm text-gray-600">Imaging</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-pink-600">5¢</p>
                <p className="text-sm text-gray-600">Surgery</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">4¢</p>
                <p className="text-sm text-gray-600">Ambulance</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            What&apos;s Not in These Numbers
          </h2>
          <p className="text-gray-700 mb-4">
            This analysis covers Medicare Part B (physician services and outpatient care). It does
            <strong> not</strong> include:
          </p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Part A</strong> — Hospital inpatient stays (paid under DRGs), skilled nursing
            facilities, hospice, and home health</li>
            <li><strong>Part D</strong> — Prescription drugs filled at pharmacies</li>
            <li><strong>Medicare Advantage</strong> — Payments to MA plans (which then pay providers)</li>
            <li><strong>Administrative costs</strong> — CMS operations, fraud detection, enrollment</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Total Medicare spending (all parts) exceeds $900 billion annually. The {formatCurrency(93721075813)} in
            Part B payments in 2023 represents roughly 10% of the total — but it&apos;s the most
            transparent portion, with detailed procedure-level data available for public analysis.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why This Matters</h2>
          <p className="text-gray-700 mb-4">
            Understanding where Medicare dollars go is the first step toward ensuring they&apos;re
            well spent. When 18% goes to office visits, we should ask: are those visits producing
            good outcomes? When 11% goes to drugs, we should ask: are we using the most
            cost-effective options? When {formatCurrency(19714688991)} goes to a single drug, we
            should ask: is there a cheaper alternative that works just as well?
          </p>
          <p className="text-gray-700 mb-4">
            Medicare&apos;s financial sustainability depends on making every dollar count. With an
            aging population pushing enrollment higher and per-beneficiary costs climbing, the
            $854.8 billion question isn&apos;t just academic — it&apos;s the defining fiscal challenge
            of the next generation.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Related Investigations</h2>
          <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link href="/investigations/office-visit-economy" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The $117 Billion Office Visit Economy</h4>
              <p className="text-sm text-gray-500 mt-1">Deep dive into the two codes that dominate Medicare</p>
            </Link>
            <Link href="/investigations/eye-care-billions" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Billion-Dollar Eye Care Industry</h4>
              <p className="text-sm text-gray-500 mt-1">Why eye care is one of Medicare&apos;s costliest categories</p>
            </Link>
            <Link href="/investigations/drug-pipeline" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Drug Pipeline</h4>
              <p className="text-sm text-gray-500 mt-1">Medicare&apos;s most expensive drugs and their trajectories</p>
            </Link>
            <Link href="/investigations/markup-machine" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Markup Machine</h4>
              <p className="text-sm text-gray-500 mt-1">The gap between charges and what Medicare pays</p>
            </Link>
          </div>
        </article>

        <ShareButtons
          url="https://openmedicare.vercel.app/investigations/where-medicare-dollar-goes"
          title="Where Your Medicare Dollar Goes — OpenMedicare"
        />
        <SourceCitation />
      </div>
    </main>
  )
}
