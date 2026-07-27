'use client'

import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'

const COMPARISON_ROWS = [
  { feature: 'Monthly Premium (Part B)', original: '$174.70 (2024)', advantage: '$0–$200+/mo (varies by plan)' },
  { feature: 'Annual Deductible', original: '$240 (Part B)', advantage: 'Varies; some plans $0' },
  { feature: 'Out-of-Pocket Maximum', original: 'No cap', advantage: '$8,850 max (2024)' },
  { feature: 'Provider Choice', original: 'Any doctor that accepts Medicare', advantage: 'Plan network only (HMO/PPO)' },
  { feature: 'Referrals Needed', original: 'No', advantage: 'Yes (HMO); No (PPO)' },
  { feature: 'Drug Coverage (Part D)', original: 'Separate plan required', advantage: 'Usually included' },
  { feature: 'Dental/Vision/Hearing', original: 'Not covered', advantage: 'Often included' },
  { feature: 'Supplemental (Medigap)', original: 'Can purchase', advantage: 'Cannot use with MA' },
  { feature: 'Works Nationwide', original: 'Yes', advantage: 'Usually local/regional' },
  { feature: 'Prior Authorization', original: 'Rarely', advantage: 'Frequently required' },
]

const MARKET_SHARE_DATA = [
  { year: 2004, maPct: 13 },
  { year: 2008, maPct: 22 },
  { year: 2010, maPct: 24 },
  { year: 2012, maPct: 27 },
  { year: 2014, maPct: 30 },
  { year: 2016, maPct: 33 },
  { year: 2018, maPct: 36 },
  { year: 2020, maPct: 42 },
  { year: 2022, maPct: 48 },
  { year: 2024, maPct: 51 },
]

const PROS_CONS = {
  original: {
    pros: [
      'See any doctor or hospital that accepts Medicare — no network restrictions',
      'No referrals needed for specialists',
      'Works anywhere in the U.S.',
      'Predictable costs when paired with Medigap',
      'Fewer prior authorization hurdles',
    ],
    cons: [
      'No out-of-pocket maximum — costs can be unlimited',
      'No dental, vision, or hearing coverage',
      'Must buy separate Part D drug plan',
      'Medigap premiums add to cost',
    ],
  },
  advantage: {
    pros: [
      'Out-of-pocket maximum caps your costs ($8,850 in 2024)',
      'Often includes dental, vision, and hearing',
      'Drug coverage usually bundled in',
      'Many plans have $0 premiums beyond Part B',
      'May include extras like gym memberships, meal delivery',
    ],
    cons: [
      'Restricted to plan network (HMO/PPO)',
      'May need referrals for specialists',
      'Prior authorization frequently required',
      'Coverage usually limited to a service area',
      'Plan changes yearly — benefits can shrink',
      'Higher denial rates for services vs Original Medicare',
    ],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Is Medicare Advantage better than Original Medicare?',
    a: 'It depends on your priorities. Medicare Advantage often has lower upfront costs and includes extras like dental and vision. Original Medicare offers broader provider choice and fewer restrictions. People who travel frequently or want to see any specialist may prefer Original Medicare.',
  },
  {
    q: 'Can I switch from Medicare Advantage back to Original Medicare?',
    a: 'Yes. You can switch during the Annual Enrollment Period (Oct 15–Dec 7) or the Medicare Advantage Open Enrollment Period (Jan 1–Mar 31). However, if you switch back to Original after your first year, you may not be guaranteed a Medigap policy depending on your state.',
  },
  {
    q: 'Why do so many people choose Medicare Advantage?',
    a: 'Medicare Advantage plans often have $0 premiums (beyond Part B), include drug coverage, and offer dental/vision/hearing. The out-of-pocket maximum also provides cost certainty that Original Medicare lacks. However, critics note that MA plans have higher denial rates and more prior authorization requirements.',
  },
  {
    q: 'How much does the government pay for Medicare Advantage?',
    a: 'CMS pays Medicare Advantage insurers a per-member monthly capitation rate — averaging roughly $1,100–$1,200/month per enrollee. Studies have found MA costs the government 6% more per enrollee than Original Medicare on average, though plans argue they deliver more coordinated care.',
  },
  {
    q: 'Do Medicare Advantage plans deny more claims?',
    a: 'Yes. A 2022 HHS OIG report found that MA plans denied 18% of prior authorization requests, and 13% of those denials were later overturned — meaning the services met Medicare coverage rules. Prior authorization is a significant concern for MA enrollees.',
  },
]

export default function MedicareAdvantageVsOriginalPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <Breadcrumbs items={[{ name: 'Medicare Advantage vs Original Medicare' }]} />

        <div className="mt-8">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Medicare Advantage vs Original Medicare
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl">
            More than half of Medicare beneficiaries now choose Medicare Advantage over Original Medicare.
            Here&apos;s what&apos;s different, what&apos;s better, and what the tradeoffs are — based on real CMS data.
          </p>
        </div>

        {/* Key Stats */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-6 text-center">
            <p className="text-3xl font-bold text-blue-700">51%</p>
            <p className="mt-1 text-sm text-gray-500">Now in Medicare Advantage</p>
          </div>
          <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center">
            <p className="text-3xl font-bold text-green-700">34.3M</p>
            <p className="mt-1 text-sm text-gray-500">MA Enrollees (2024)</p>
          </div>
          <div className="rounded-xl bg-orange-50 border border-orange-200 p-6 text-center">
            <p className="text-3xl font-bold text-orange-700">$8,850</p>
            <p className="mt-1 text-sm text-gray-500">MA Out-of-Pocket Max</p>
          </div>
          <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
            <p className="text-3xl font-bold text-red-700">18%</p>
            <p className="mt-1 text-sm text-gray-500">MA Prior Auth Denial Rate</p>
          </div>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Side-by-Side Comparison</h2>
          <p className="mt-2 text-gray-600">
            How the two options stack up across the features that matter most.
          </p>

          <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Feature</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase">Original Medicare</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-600 uppercase">Medicare Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.original}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.advantage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-blue-700">Original Medicare</h2>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-green-700 uppercase">✅ Pros</h3>
              <ul className="mt-2 space-y-2">
                {PROS_CONS.original.pros.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-green-500 flex-shrink-0">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-red-700 uppercase">❌ Cons</h3>
              <ul className="mt-2 space-y-2">
                {PROS_CONS.original.cons.map((c) => (
                  <li key={c} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-red-500 flex-shrink-0">✗</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-green-700">Medicare Advantage</h2>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-green-700 uppercase">✅ Pros</h3>
              <ul className="mt-2 space-y-2">
                {PROS_CONS.advantage.pros.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-green-500 flex-shrink-0">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-red-700 uppercase">❌ Cons</h3>
              <ul className="mt-2 space-y-2">
                {PROS_CONS.advantage.cons.map((c) => (
                  <li key={c} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-red-500 flex-shrink-0">✗</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Market Share Trend */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Medicare Advantage Market Share: 2004–2024</h2>
          <p className="mt-2 text-gray-600">
            The shift from Original Medicare to Medicare Advantage has been dramatic — crossing the 50% threshold in 2024.
          </p>

          <div className="mt-8 space-y-2">
            {MARKET_SHARE_DATA.map((d) => (
              <div key={d.year} className="flex items-center gap-3">
                <span className="w-10 text-xs font-medium text-gray-500 text-right">{d.year}</span>
                <div className="flex-1 h-8 flex rounded-lg overflow-hidden">
                  <div
                    className="bg-green-500 flex items-center justify-center text-xs font-bold text-white"
                    style={{ width: `${d.maPct}%` }}
                  >
                    {d.maPct}% MA
                  </div>
                  <div
                    className="bg-blue-400 flex items-center justify-center text-xs font-bold text-white"
                    style={{ width: `${100 - d.maPct}%` }}
                  >
                    {100 - d.maPct}% Original
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Cost Question */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-orange-600 to-red-700 p-8 text-white">
          <h2 className="text-2xl font-bold">The Cost Question: Does MA Save Money?</h2>
          <p className="mt-3 opacity-90">
            Medicare Advantage plans often advertise $0 premiums and lower out-of-pocket costs for enrollees.
            But the government pays MA insurers a capitated rate that&apos;s been found to be 6% higher per
            enrollee than traditional Medicare would have cost — adding an estimated $83 billion in extra
            spending from 2024–2031 according to MedPAC.
          </p>
          <p className="mt-3 opacity-90">
            The tradeoff: enrollees get capped costs and extra benefits, but taxpayers pay more per person,
            and insurers profit from the difference. Whether that&apos;s a good deal depends on your perspective.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">6%</p>
              <p className="text-sm opacity-80">More expensive per enrollee for government</p>
            </div>
            <div>
              <p className="text-3xl font-bold">$83B</p>
              <p className="text-sm opacity-80">Estimated extra cost (2024–2031)</p>
            </div>
          </div>
        </div>

        {/* Who Should Choose What */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Which Is Right for You?</h2>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border-2 border-blue-200 p-6">
              <h3 className="text-lg font-bold text-blue-700">Choose Original Medicare if you...</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>• Want maximum choice of doctors and hospitals</li>
                <li>• Travel frequently or live in multiple states</li>
                <li>• Can afford Medigap + Part D premiums</li>
                <li>• Have complex health needs requiring specialists</li>
                <li>• Want fewer prior authorization requirements</li>
              </ul>
            </div>
            <div className="rounded-xl border-2 border-green-200 p-6">
              <h3 className="text-lg font-bold text-green-700">Choose Medicare Advantage if you...</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>• Want an out-of-pocket spending cap</li>
                <li>• Need dental, vision, and hearing coverage</li>
                <li>• Prefer one plan that covers everything</li>
                <li>• Stay in one area with good plan networks</li>
                <li>• Want to minimize monthly premiums</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            {FAQ_ITEMS.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex cursor-pointer items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-gray-900">{faq.q}</span>
                  <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQ_ITEMS.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: { '@type': 'Answer', text: faq.a },
              })),
            }),
          }}
        />

        {/* Related Links */}
        <div className="mt-12 rounded-xl bg-gray-50 p-6">
          <h3 className="text-lg font-bold text-gray-900">Explore More</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/enrollment-statistics" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Enrollment Statistics →
            </Link>
            <Link href="/your-medicare-dollar" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Where Your Medicare Dollar Goes →
            </Link>
            <Link href="/drug-spending" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Drug Spending Analysis →
            </Link>
            <Link href="/fraud" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Fraud Detection →
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <ShareButtons
            url="https://www.openmedicare.us/medicare-advantage-vs-original"
            title="Medicare Advantage vs Original Medicare: The Full Comparison"
            description="51% of Medicare beneficiaries now choose Advantage over Original. See the costs, coverage, and tradeoffs."
          />
        </div>

        <div className="mt-8"><SourceCitation /></div>
      </div>
    </div>
  )
}
