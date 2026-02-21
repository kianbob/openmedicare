import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: 'The COVID Test Gold Rush: How Medicare Lost Billions to K1034 Fraud',
  description: 'K1034 was created for COVID OTC tests at ~$12 each. Some providers billed millions. An investigation into Medicare COVID test billing fraud.',
  alternates: { canonical: '/investigations/covid-test-scheme' },
  openGraph: {
    title: 'The COVID Test Gold Rush: How Medicare Lost Billions to K1034 Fraud',
    description: 'K1034 was created for COVID OTC tests at ~$12 each. Some providers billed millions.',
    url: 'https://www.openmedicare.org/investigations/covid-test-scheme',
  },
}

export default function CovidTestSchemePage() {
  const publishedDate = '2026-02-20'
  const readTime = '14 min read'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'The COVID Test Gold Rush' },
          ]}
          className="mb-8"
        />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-4">
                Investigation
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4">
                The COVID Test Gold Rush
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                How Medicare Lost Billions to K1034 Fraud
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center">
                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                {new Date(publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {readTime}
              </div>
              <span>By OpenMedicare Investigative Team</span>
            </div>

            {/* Lead */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                In 2020, as the COVID-19 pandemic swept the nation, the Centers for Medicare & Medicaid Services (CMS)
                created a new billing code: <strong>K1034</strong>. It was designed for over-the-counter COVID test kits,
                reimbursed at roughly <strong>$12 per test</strong>. What happened next was one of the largest billing
                fraud schemes in Medicare history.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The $12 Code That Became a Gold Mine</h2>
              <p>
                K1034 — &quot;COVID-19 OTC home test&quot; — was meant to be simple. Seniors could get free test kits,
                and Medicare would reimburse providers about $12 per kit. But for some providers, this modest
                reimbursement became a pipeline to millions.
              </p>
              <p>
                The math was straightforward: bill enough tests, and the money adds up fast. At $12 per test,
                billing one million tests generates {formatCurrency(12000000)}. And that&apos;s exactly what some
                providers appear to have done.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Case Study: {formatCurrency(12100000)} from One Nurse Practitioner</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">Merry Taheri, MSN FNP — Torrance, CA</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Total Medicare Payments:</span> <strong className="text-red-800">{formatCurrency(12149038)}</strong></div>
                  <div><span className="text-gray-600">Total Services (10 years):</span> <strong>{formatNumber(1032955)}</strong></div>
                  <div><span className="text-gray-600">Specialty Median:</span> <strong>{formatCurrency(12271)}</strong></div>
                  <div><span className="text-gray-600">Multiple of Median:</span> <strong className="text-red-800">990x</strong></div>
                  <div><span className="text-gray-600">Services per Working Day:</span> <strong className="text-red-800">413</strong></div>
                  <div><span className="text-gray-600">Risk Score:</span> <strong className="text-red-800">96/100</strong></div>
                </div>
                <p className="text-sm text-red-800 mt-4">
                  As a single nurse practitioner, Taheri billed for over 1 million services across 10 years — an
                  average of 413 services per working day. This volume is physically impossible for one person to
                  deliver. Her billing was primarily through K1034 COVID test codes.
                </p>
                <div className="mt-3">
                  <Link href="/providers/1184886178" className="text-red-700 hover:underline text-sm font-medium">
                    View Full Provider Profile →
                  </Link>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Seniors Got Tests They Never Ordered</h2>
              <p>
                NPR reported that seniors across the country received dozens of COVID tests they never requested.
                Boxes of test kits showed up at doorsteps, sometimes weekly, sometimes addressed to people who
                had never interacted with the billing provider. The scheme was simple: obtain Medicare beneficiary
                numbers, ship unrequested test kits, and bill Medicare for each one.
              </p>
              <p>
                For a single beneficiary receiving a test kit per week for a year, that&apos;s roughly
                {' '}{formatCurrency(624)} in fraudulent billing. Multiply by thousands of beneficiaries, and the
                numbers become staggering.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Nationwide Enforcement Response</h2>
              <p>
                In 2023, the Department of Justice announced a nationwide COVID healthcare fraud enforcement action
                that charged defendants with over <strong>{formatCurrency(1700000000)}</strong> in alleged fraudulent
                billing. COVID test kit fraud was a central focus.
              </p>
              <p>
                The HHS Office of Inspector General (OIG) identified COVID-related fraud as one of its top priorities,
                noting that the rapid deployment of new billing codes and relaxed oversight during the pandemic
                created &quot;unprecedented opportunities for fraud.&quot;
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Key Numbers</h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• <strong>{formatCurrency(2840000000)}</strong> — total K1034 COVID test billing in Medicare</li>
                  <li>• <strong>{formatCurrency(1700000000)}</strong> charged in 2023 COVID healthcare fraud enforcement</li>
                  <li>• <strong>~$12/test</strong> — K1034 reimbursement rate</li>
                  <li>• <strong>500 providers</strong> tracked in our COVID test billing database</li>
                  <li>• <strong>{formatCurrency(75800000)}</strong> — #1 biller (VRA Enterprises, Tampa)</li>
                  <li>• <strong>413 services/day</strong> — the physical impossibility threshold</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">How the Scheme Worked</h2>
              <ol className="list-decimal pl-6 space-y-3">
                <li><strong>Obtain beneficiary information</strong> — through call centers, door-to-door campaigns, or purchased lists</li>
                <li><strong>Ship unrequested test kits</strong> — sometimes to beneficiaries who were surprised to receive them</li>
                <li><strong>Bill Medicare via K1034</strong> — at approximately $12 per test kit</li>
                <li><strong>Scale massively</strong> — bill thousands of kits per day, far exceeding what any individual provider could reasonably handle</li>
                <li><strong>Use individual NPIs</strong> — billing under a single practitioner&apos;s NPI rather than an organization, making volume anomalies even more suspicious</li>
              </ol>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What Our Data Shows</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">COVID Test Billing: The Full Picture</h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• <strong>{formatCurrency(2840000000)}</strong> — Total K1034 COVID test billing across Medicare</li>
                  <li>• <strong>500 providers</strong> tracked in our COVID test billing database</li>
                  <li>• <strong>#1 biller: VRA Enterprises</strong> (Tampa pharmacy) — {formatCurrency(75800000)}</li>
                </ul>
                <div className="mt-3">
                  <Link href="/fraud/covid-tests" className="text-blue-700 hover:underline text-sm font-medium">
                    Explore the full COVID test billing tracker →
                  </Link>
                </div>
              </div>
              <p>
                Our analysis of CMS Medicare Provider Utilization and Payment Data reveals a cluster of providers
                with extreme K1034 billing volumes. Across the entire program, <strong>{formatCurrency(2840000000)}</strong> was
                billed through K1034 — a staggering sum for a code that reimburses ~$12 per test. The statistical profile
                of these providers shows:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Billing volumes hundreds of times higher than specialty medians</li>
                <li>Service counts that would require seeing a new patient every 1-2 minutes, 8 hours a day</li>
                <li>Markup ratios far exceeding any clinical explanation</li>
                <li>Geographic clustering in a few ZIP codes</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What You Can Do</h2>
              <p>
                If you or a family member received COVID tests you never ordered, or if you notice unfamiliar
                charges on your Medicare statements, you may have been a victim of this scheme.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Report Suspected Fraud</h3>
                <p className="text-amber-800 text-sm mb-3">
                  Contact the OIG Fraud Hotline: <a href="tel:1-800-447-8477" className="font-bold underline">1-800-HHS-TIPS (1-800-447-8477)</a>
                </p>
                <p className="text-amber-800 text-sm">
                  Under the False Claims Act, whistleblowers can receive 15-30% of recovered funds.{' '}
                  <Link href="/fraud/report" className="font-medium underline">Learn more about reporting →</Link>
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> The billing patterns described in this article are statistical flags
                based on publicly available CMS data, not accusations of fraud. Individual cases may have legitimate
                explanations. Named providers have not been charged with any crime unless otherwise stated. If you
                suspect fraud, report it to the OIG.
              </p>
            </div>

            {/* Related */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href="/fraud/covid-tests" className="text-medicare-primary hover:underline text-sm">🦠 COVID Test Billing Tracker</Link>
                <Link href="/fraud/impossible-numbers" className="text-medicare-primary hover:underline text-sm">🧮 Impossible Numbers</Link>
                <Link href="/investigations/impossible-doctors" className="text-medicare-primary hover:underline text-sm">📰 The Impossible Doctors</Link>
                <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
              </div>
            </div>

            <ShareButtons
              url="https://www.openmedicare.org/investigations/covid-test-scheme"
              title="The COVID Test Gold Rush — OpenMedicare"
            />

            <div className="mt-6">
              <SourceCitation
                sources={[
                  'Centers for Medicare & Medicaid Services (CMS) — Medicare Provider Utilization and Payment Data (2014-2023)',
                  'HHS Office of Inspector General (OIG)',
                  'NPR — COVID Test Fraud Reporting',
                  'Department of Justice — 2023 COVID Healthcare Fraud Enforcement Action',
                ]}
                lastUpdated="February 2026"
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
