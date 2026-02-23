import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'Anesthesiologists Charge 15.6x What Medicare Pays',
  description: 'They billed $8.2B but Medicare paid $788M. Anesthesiologists have the highest markup of any major specialty — and patients pay the price.',
}

const topMarkupSpecialties = [
  { specialty: 'Pharmacy', markup: 22.45, charges: 630088924, payments: 432030297, providers: 2960 },
  { specialty: 'Anesthesiology', markup: 15.59, charges: 8176931596, payments: 787765511, providers: 34189 },
  { specialty: 'Interventional Pain Management', markup: 15.02, charges: 1524494530, payments: 276436372, providers: 1478 },
  { specialty: 'Anesthesiology Assistant', markup: 14.73, charges: 127829865, payments: 8817848, providers: 2157 },
  { specialty: 'CRNA (Nurse Anesthetist)', markup: 13.16, charges: 4285081553, payments: 371529615, providers: 38387 },
  { specialty: 'Pain Management', markup: 12.94, charges: 2157959861, payments: 387802532, providers: 2710 },
  { specialty: 'Radiation Therapy Center', markup: 11.59, charges: 234110475, payments: 26582273, providers: 25 },
  { specialty: 'Independent Diagnostic Testing Facility', markup: 11.25, charges: 5638006435, payments: 881305636, providers: 1949 },
  { specialty: 'Ambulatory Surgical Center', markup: 10.34, charges: 26549197647, payments: 4298258798, providers: 5353 },
  { specialty: 'Pulmonary Disease', markup: 10.02, charges: 3427060625, payments: 991177624, providers: 10381 },
]

const anesthesiaCodes = [
  { code: '00142', description: 'Anesthesia for lens surgery (cataract)', payments: 1509055593, services: 18764244 },
  { code: '00810', description: 'Anesthesia for lower intestine endoscopy', payments: 858247219, services: 8730589 },
  { code: '00811', description: 'Anesthesia for large bowel endoscopy', payments: 586860559, services: 7004731 },
  { code: '00731', description: 'Anesthesia for upper GI endoscopy', payments: 674187251, services: 7756568 },
  { code: '00670', description: 'Anesthesia for spine/spinal cord procedure', payments: 345018815, services: 1043534 },
  { code: '01402', description: 'Anesthesia for total knee replacement', payments: 526235244, services: 2810499 },
  { code: '00790', description: 'Anesthesia for upper abdomen endoscopy', payments: 378099324, services: 1999136 },
  { code: '00813', description: 'Anesthesia for GI endoscopy (combined)', payments: 260856099, services: 2527713 },
]

export default function AnesthesiaMarkupPage() {
  const totalAnesthesiaCharges = 8176931596
  const totalAnesthesiaPayments = 787765511
  const totalAnesthesiaMarkup = 15.59
  const totalCrnaCharges = 4285081553
  const totalCrnaPayments = 371529615
  const combinedCharges = totalAnesthesiaCharges + totalCrnaCharges
  const combinedPayments = totalAnesthesiaPayments + totalCrnaPayments

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'The Anesthesia Markup Scandal' },
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Investigation
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            The Anesthesia Markup Scandal
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 14 min read</p>

          {/* Key Finding */}
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-red-900 font-medium text-lg">Key Finding</p>
            <p className="text-red-800 mt-2">
              Anesthesiologists submit charges that are <strong>15.6 times</strong> what Medicare
              actually pays — the highest markup ratio among all major medical specialties.
              Combined, anesthesia-related providers charged <strong>{formatCurrency(combinedCharges)}</strong> but
              received only <strong>{formatCurrency(combinedPayments)}</strong>.
            </p>
          </div>

          {/* Introduction */}
          <p className="text-gray-700 mb-4">
            When you go under the knife, the anesthesiologist keeps you alive and pain-free. It&apos;s arguably
            the most critical role in the operating room. But the billing practices of anesthesia providers
            reveal something startling: they routinely charge Medicare more than 15 times what the program
            actually pays.
          </p>
          <p className="text-gray-700 mb-4">
            This isn&apos;t fraud — it&apos;s the system working as designed. Medicare sets its own fee schedule,
            and providers are free to set their &quot;list prices&quot; (submitted charges) at whatever level they
            choose. The gap between charges and payments — the markup ratio — reveals which specialties
            have the most inflated price tags.
          </p>
          <p className="text-gray-700 mb-6">
            Our analysis of {formatNumber(34189)} anesthesiologists billing Medicare reveals a specialty
            where submitted charges bear almost no relationship to actual reimbursement, and where the
            gap has profound implications for uninsured patients and those with out-of-network coverage.
          </p>

          {/* The Markup Landscape */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Markup Landscape: Who Charges the Most?
          </h2>
          <p className="text-gray-700 mb-4">
            Across all of Medicare, the average markup ratio is roughly 3.96x — providers charge about
            four times what they actually receive. But anesthesia-related specialties occupy four of the
            top six spots in our markup rankings, forming a cluster of extreme pricing that far exceeds
            any other area of medicine.
          </p>
          <p className="text-gray-700 mb-4">
            While Pharmacy tops the list at 22.45x, it represents a relatively small pool of
            just {formatNumber(2960)} providers. Anesthesiology, with {formatNumber(34189)} providers and
            nearly {formatCurrency(8200000000)} in submitted charges, is the largest specialty with a
            double-digit markup ratio.
          </p>
        </article>

        {/* Top 10 Markup Specialties Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Top 10 Highest-Markup Medical Specialties</h3>
            <p className="text-sm text-gray-500">Ratio of submitted charges to Medicare payments (2014–2023 cumulative)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Markup Ratio</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Submitted Charges</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Medicare Paid</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topMarkupSpecialties.map((s, i) => (
                  <tr key={s.specialty} className={`hover:bg-blue-50 ${i < 2 ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 text-gray-500 font-medium">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.specialty}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold ${s.markup >= 13 ? 'text-red-600' : s.markup >= 10 ? 'text-orange-600' : 'text-yellow-600'}`}>
                        {s.markup.toFixed(1)}x
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(s.charges)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(s.payments)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatNumber(s.providers)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          {/* The Anesthesia Ecosystem */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Anesthesia Ecosystem: A $1.2 Billion Machine
          </h2>
          <p className="text-gray-700 mb-4">
            The anesthesia markup story isn&apos;t limited to anesthesiologists themselves. The entire
            anesthesia ecosystem — including Certified Registered Nurse Anesthetists (CRNAs),
            anesthesiology assistants, and pain management specialists — follows the same pattern
            of extreme markups.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 not-prose mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">The Anesthesia Billing Family</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm text-gray-500">Anesthesiologists</p>
                <p className="text-2xl font-bold text-red-600">15.6x markup</p>
                <p className="text-sm text-gray-600">{formatNumber(34189)} providers · {formatCurrency(787765511)} paid</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm text-gray-500">CRNAs (Nurse Anesthetists)</p>
                <p className="text-2xl font-bold text-orange-600">13.2x markup</p>
                <p className="text-sm text-gray-600">{formatNumber(38387)} providers · {formatCurrency(371529615)} paid</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm text-gray-500">Anesthesiology Assistants</p>
                <p className="text-2xl font-bold text-orange-600">14.7x markup</p>
                <p className="text-sm text-gray-600">{formatNumber(2157)} providers · {formatCurrency(8817848)} paid</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm text-gray-500">Pain Management</p>
                <p className="text-2xl font-bold text-yellow-600">12.9x markup</p>
                <p className="text-sm text-gray-600">{formatNumber(2710)} providers · {formatCurrency(387802532)} paid</p>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            Together, these four anesthesia-related specialties account for more
            than {formatNumber(77443)} providers who submitted {formatCurrency(combinedCharges + 2157959861 + 127829865)} in
            charges but received just {formatCurrency(combinedPayments + 387802532 + 8817848)} — an effective
            combined markup of roughly 14x.
          </p>

          {/* Why So High? */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Why Are Anesthesia Markups So High?
          </h2>
          <p className="text-gray-700 mb-4">
            Several factors contribute to the extreme disconnect between anesthesia charges and payments:
          </p>

          <div className="not-prose mb-6">
            <div className="space-y-4">
              <div className="bg-white border rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-2">1. Time-Based Billing Units</h4>
                <p className="text-gray-600 text-sm">
                  Anesthesia uses a unique unit-based billing system where charges are calculated using
                  base units plus time units. This creates a compound effect where the &quot;list price&quot; per
                  unit can be inflated far beyond the Medicare conversion factor. Medicare pays about $22
                  per unit, while anesthesiologists often set their charge per unit at $150–$350.
                </p>
              </div>
              <div className="bg-white border rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-2">2. Out-of-Network Leverage</h4>
                <p className="text-gray-600 text-sm">
                  Anesthesiologists are among the most commonly out-of-network providers. Patients
                  rarely choose their anesthesiologist — the surgeon does. This creates zero price
                  competition and incentivizes high list prices that serve as starting points for
                  out-of-network negotiations with private insurers.
                </p>
              </div>
              <div className="bg-white border rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-2">3. Surprise Billing Dynamics</h4>
                <p className="text-gray-600 text-sm">
                  Before the No Surprises Act (2022), anesthesiologists could balance-bill patients
                  for the difference between their charges and insurance payments. High submitted charges
                  became a negotiating tactic, and the practice of setting inflated rates persists in
                  the Medicare data even after regulatory changes.
                </p>
              </div>
              <div className="bg-white border rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-2">4. Historical Inertia</h4>
                <p className="text-gray-600 text-sm">
                  Once a practice sets high charges, there&apos;s little incentive to lower them. Submitted
                  charges are essentially wish-list prices — Medicare ignores them entirely when
                  calculating payments. But private insurers and patients sometimes don&apos;t.
                </p>
              </div>
            </div>
          </div>

          {/* Top Anesthesia Procedures */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            What Anesthesia Procedures Cost Medicare the Most
          </h2>
          <p className="text-gray-700 mb-4">
            The most expensive anesthesia procedure in Medicare isn&apos;t for heart surgery or brain
            operations — it&apos;s for cataract removal. Anesthesia for lens surgery (code 00142) accounts
            for {formatCurrency(1509055593)} in Medicare payments across {formatNumber(18764244)} services,
            reflecting the enormous volume of cataract procedures performed on Medicare beneficiaries.
          </p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Top Anesthesia Procedure Codes by Medicare Payments</h3>
            <p className="text-sm text-gray-500">2014–2023 cumulative</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Medicare Paid</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {anesthesiaCodes.map((c) => (
                  <tr key={c.code} className="hover:bg-blue-50">
                    <td className="px-4 py-3">
                      <Link href={`/procedures/${c.code}`} className="text-blue-600 hover:text-blue-800 font-mono font-medium">
                        {c.code}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{c.description}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(c.payments)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatNumber(c.services)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          {/* Impact on Patients */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Patient Impact: When Markups Become Real Bills
          </h2>
          <p className="text-gray-700 mb-4">
            For Medicare beneficiaries, these inflated charges are largely invisible — Medicare pays
            what it pays, and patients owe their standard copay. But the ripple effects are real:
          </p>
          <ul className="text-gray-700 mb-4">
            <li>
              <strong>Uninsured patients</strong> may be billed at the full charge rate — 15.6x what
              Medicare considers reasonable — before any negotiation or charity care discount.
            </li>
            <li>
              <strong>Medicare Advantage enrollees</strong> may face higher cost-sharing when
              out-of-network anesthesiologists bill at inflated rates.
            </li>
            <li>
              <strong>Private insurance premiums</strong> are influenced by provider charge levels,
              as insurers often negotiate rates as a percentage of submitted charges.
            </li>
            <li>
              <strong>Hospital pricing transparency</strong> becomes meaningless when the
              anesthesiology component has a 15x disconnect from actual costs.
            </li>
          </ul>

          {/* Comparison to Other Specialties */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            How Anesthesia Compares to Other Specialties
          </h2>
          <p className="text-gray-700 mb-4">
            To put the 15.6x markup in perspective: Internal Medicine — the largest Medicare
            specialty with {formatNumber(917573)} providers and {formatCurrency(77041896330)} in
            payments — has a markup ratio of roughly 3.5x. Ophthalmology, the second-largest
            specialty at {formatCurrency(66253395294)} in payments, operates at about 3.8x.
          </p>
          <p className="text-gray-700 mb-4">
            Even Emergency Medicine, another specialty known for surprise billing issues, has a
            markup of 8.7x — high, but barely more than half the anesthesia markup. The
            anesthesia ecosystem stands alone in the extremity of its pricing disconnect.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 not-prose mb-6">
            <h4 className="font-semibold text-blue-900 mb-3">By the Numbers</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-blue-700">15.6x</p>
                <p className="text-sm text-blue-600">Anesthesiology markup</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-700">3.96x</p>
                <p className="text-sm text-blue-600">Overall Medicare average</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-700">{formatNumber(34189)}</p>
                <p className="text-sm text-blue-600">Anesthesiologists billing</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-700">{formatCurrency(8176931596)}</p>
                <p className="text-sm text-blue-600">Total charges submitted</p>
              </div>
            </div>
          </div>

          {/* Why This Matters */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why This Matters</h2>
          <p className="text-gray-700 mb-4">
            The anesthesia markup story illustrates a fundamental dysfunction in American healthcare
            pricing. When providers can set charges at 15 times what the government considers a fair
            price, the concept of a &quot;price&quot; in healthcare becomes meaningless for consumers.
          </p>
          <p className="text-gray-700 mb-4">
            The No Surprises Act has begun to address the worst abuses, but it doesn&apos;t change the
            underlying incentive structure that produces these markups. As long as submitted charges
            serve as anchors in private insurance negotiations, providers have every reason to keep
            them inflated.
          </p>
          <p className="text-gray-700 mb-4">
            Real price transparency in anesthesia would mean publishing the actual negotiated rates
            with each insurer — not the fantasy charges that bear no relationship to what anyone
            actually pays. Until that happens, the 15.6x markup will remain a monument to
            healthcare&apos;s broken pricing system.
          </p>

          {/* Methodology */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Methodology</h2>
          <p className="text-gray-700 mb-4 text-sm">
            This analysis uses the CMS Medicare Provider Utilization and Payment Data for
            2014–2023. Markup ratios are calculated as the average ratio of submitted charges to
            Medicare allowed amounts across all providers within each specialty. Only specialties
            with meaningful provider counts are highlighted. Individual provider-level data is
            aggregated from the public use files available at data.cms.gov.
          </p>

          {/* Related Investigations */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Related Investigations</h2>
          <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link href="/investigations/markup-machine" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Markup Machine</h4>
              <p className="text-sm text-gray-500 mt-1">How Medicare charges diverge from payments across the system</p>
            </Link>
            <Link href="/investigations/specialty-pay-gap" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Specialty Pay Gap</h4>
              <p className="text-sm text-gray-500 mt-1">Which specialties earn the most — and least — from Medicare</p>
            </Link>
            <Link href="/investigations/office-visit-economy" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The $117 Billion Office Visit Economy</h4>
              <p className="text-sm text-gray-500 mt-1">Two billing codes that dominate all of Medicare spending</p>
            </Link>
            <Link href="/investigations/eye-care-billions" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Billion-Dollar Eye Care Industry</h4>
              <p className="text-sm text-gray-500 mt-1">Aflibercept, cataracts, and the costliest corner of Medicare</p>
            </Link>
          </div>
        </article>

        <ShareButtons
          url="https://www.openmedicare.us/investigations/anesthesia-markup"
          title="The Anesthesia Markup Scandal"
        />
        <SourceCitation />
      </div>
    </main>
  )
}
