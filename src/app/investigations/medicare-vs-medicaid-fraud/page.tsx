import type { Metadata } from 'next'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'Medicare vs Medicaid Fraud: What\'s the Difference?',
  description: 'Medicare and Medicaid fraud differ in scale, schemes, and oversight. Learn how fraud works in each program, who commits it, and how much it costs.',
  keywords: ['medicare vs medicaid fraud', 'difference medicare medicaid fraud', 'medicaid fraud', 'medicare fraud comparison', 'healthcare fraud types'],
  alternates: { canonical: '/investigations/medicare-vs-medicaid-fraud' },
  openGraph: {
    title: 'Medicare vs Medicaid Fraud: What\'s the Difference?',
    description: 'Medicare and Medicaid fraud differ in scale, schemes, and oversight. Learn how fraud works in each program and how much it costs.',
    url: 'https://www.openmedicare.us/investigations/medicare-vs-medicaid-fraud',
  },
}

export default function MedicareVsMedicaidFraudPage() {
  const publishedDate = '2026-02-23'
  const readTime = '11 min read'

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="Medicare vs Medicaid Fraud: What's the Difference?"
        description="A comprehensive comparison of fraud in America's two largest healthcare programs: Medicare and Medicaid."
        publishedDate={publishedDate}
        modifiedDate={publishedDate}
        url="https://www.openmedicare.us/investigations/medicare-vs-medicaid-fraud"
      />
      <InvestigationDisclaimer />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'Medicare vs Medicaid Fraud' },
          ]}
          className="mb-8"
        />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-4">
                Explainer
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4 leading-tight">
                Medicare vs Medicaid Fraud
              </h1>
              <p className="text-2xl text-gray-600 font-light leading-relaxed">
                America&apos;s two largest healthcare programs. Both plagued by fraud. But the schemes, scale, and oversight couldn&apos;t be more different.
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
              <div className="ml-auto">
                <ShareButtons title="Medicare vs Medicaid Fraud: What's the Difference?" url="https://www.openmedicare.us/investigations/medicare-vs-medicaid-fraud" />
              </div>
            </div>

            {/* The Two Programs */}
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">Two Programs, Two Systems, Two Fraud Problems</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Medicare and Medicaid were both created in 1965, but they serve different populations, are funded differently, and attract different types of fraud. Understanding the distinction matters — because the solutions are different too.
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-3 border border-gray-200 font-semibold"></th>
                      <th className="text-left p-3 border border-gray-200 font-semibold text-blue-700">Medicare</th>
                      <th className="text-left p-3 border border-gray-200 font-semibold text-green-700">Medicaid</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-3 border border-gray-200 font-medium">Who it covers</td><td className="p-3 border border-gray-200">Adults 65+, some disabled</td><td className="p-3 border border-gray-200">Low-income individuals & families</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border border-gray-200 font-medium">Beneficiaries</td><td className="p-3 border border-gray-200">~65 million</td><td className="p-3 border border-gray-200">~90 million</td></tr>
                    <tr><td className="p-3 border border-gray-200 font-medium">Annual spending</td><td className="p-3 border border-gray-200">~$900 billion (all parts)</td><td className="p-3 border border-gray-200">~$800 billion (federal + state)</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border border-gray-200 font-medium">Funded by</td><td className="p-3 border border-gray-200">Federal government (100%)</td><td className="p-3 border border-gray-200">Federal + state (shared)</td></tr>
                    <tr><td className="p-3 border border-gray-200 font-medium">Administered by</td><td className="p-3 border border-gray-200">CMS (centralized)</td><td className="p-3 border border-gray-200">Each state individually</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border border-gray-200 font-medium">Est. fraud rate</td><td className="p-3 border border-gray-200">3–10%</td><td className="p-3 border border-gray-200">5–10%+</td></tr>
                    <tr><td className="p-3 border border-gray-200 font-medium">Est. annual fraud</td><td className="p-3 border border-gray-200">$60–100 billion</td><td className="p-3 border border-gray-200">$40–80 billion</td></tr>
                  </tbody>
                </table>
              </div>

              <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-6 bg-gray-50 rounded-r-lg">
                <p className="text-lg text-gray-800 italic">
                  &ldquo;Combined, Medicare and Medicaid fraud may cost American taxpayers $100–180 billion every year — more than the entire GDP of most countries.&rdquo;
                </p>
              </blockquote>
            </section>

            {/* How Medicare Fraud Works */}
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">How Medicare Fraud Works</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Medicare fraud is primarily <strong>provider-driven</strong>. Doctors, clinics, labs, and medical equipment companies bill the federal government for services that were never provided, were unnecessary, or were upcoded to more expensive categories.
              </p>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Most Common Medicare Fraud Schemes</h3>
              <div className="space-y-3 mb-4">
                <div className="border-l-4 border-blue-400 pl-4">
                  <p className="text-gray-700"><strong>Phantom billing:</strong> Billing for services never rendered. Our AI found <Link href="/investigations/the-4636-impossible-doctors" className="text-blue-600 hover:underline">4,636 providers</Link> billing physically impossible volumes — up to 9,862 services per day.</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <p className="text-gray-700"><strong>Upcoding:</strong> Billing a higher-cost code than the service provided. The <Link href="/fraud/upcoding" className="text-blue-600 hover:underline">$117.7B office visit economy</Link> is ripe for this.</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <p className="text-gray-700"><strong>Kickback schemes:</strong> Paying for patient referrals, common in lab testing and durable medical equipment. The <Link href="/investigations/genetic-testing-fraud" className="text-blue-600 hover:underline">$328M genetic testing scam</Link> is a prime example.</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <p className="text-gray-700"><strong>Skin substitute/wound care fraud:</strong> DOJ&apos;s top target. The <Link href="/investigations/arizona-wound-care-ring" className="text-blue-600 hover:underline">Arizona wound care ring</Link> billed $514M for 2,974 patients.</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <p className="text-gray-700"><strong>COVID test billing fraud:</strong> The pandemic created new opportunities — providers billing millions for tests patients never ordered.</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Because Medicare is centrally administered by CMS with standardized billing codes, it is possible to analyze patterns across the entire system — which is exactly what <Link href="/fraud/watchlist" className="text-blue-600 hover:underline">our AI model does</Link>.
              </p>
            </section>

            {/* How Medicaid Fraud Works */}
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">How Medicaid Fraud Works</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Medicaid fraud operates differently because the program itself is structured differently. Medicaid is <strong>jointly funded by federal and state governments</strong>, with each state running its own program. This decentralization creates unique vulnerabilities:
              </p>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Most Common Medicaid Fraud Schemes</h3>
              <div className="space-y-3 mb-4">
                <div className="border-l-4 border-green-400 pl-4">
                  <p className="text-gray-700"><strong>Personal care attendant fraud:</strong> Billing for home care services never provided. Medicaid&apos;s large home care component makes this a major vector — caregivers billing for shifts they never worked.</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <p className="text-gray-700"><strong>Pharmacy fraud:</strong> Dispensing cheaper generic drugs while billing for expensive brand-names. Medicaid&apos;s prescription drug benefit is a significant target.</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <p className="text-gray-700"><strong>Beneficiary fraud:</strong> Unlike Medicare (which is age-based), Medicaid eligibility is income-based — making it vulnerable to people misrepresenting their income to obtain coverage.</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <p className="text-gray-700"><strong>Managed care fraud:</strong> Most Medicaid beneficiaries are enrolled in managed care plans. Fraud includes inflating enrollment numbers, cherry-picking healthy patients, and denying care to reduce costs.</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <p className="text-gray-700"><strong>Transportation fraud:</strong> Medicaid covers non-emergency medical transportation — and billing for fake rides is a growing problem in many states.</p>
                </div>
              </div>
            </section>

            {/* Key Differences */}
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">5 Key Differences Between Medicare and Medicaid Fraud</h2>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">1. Who Commits the Fraud</h3>
                  <p className="text-gray-700">Medicare fraud is overwhelmingly <strong>provider-driven</strong> — doctors, labs, and clinics gaming the billing system. Medicaid fraud includes significant <strong>beneficiary fraud</strong> (eligibility fraud) alongside provider schemes, plus fraud by managed care organizations.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">2. Scale Per Scheme</h3>
                  <p className="text-gray-700">Medicare fraud tends to involve <strong>larger dollar amounts per case</strong> because Medicare reimbursement rates are higher. A single Medicare fraud scheme can involve hundreds of millions of dollars. Medicaid fraud often involves more cases at lower dollar amounts — death by a thousand cuts.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">3. Oversight Structure</h3>
                  <p className="text-gray-700">Medicare is <strong>federally administered</strong> — one system, one set of rules, one database. This makes systemic analysis possible (and is why OpenMedicare can analyze all 1.7M providers). Medicaid is run by <strong>50 different state programs</strong> with 50 different systems, making cross-state analysis nearly impossible.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">4. Data Transparency</h3>
                  <p className="text-gray-700">Medicare billing data is <strong>publicly available</strong> through CMS, which is how OpenMedicare exists. Medicaid data is <strong>fragmented across states</strong> — some states publish data, many don&apos;t. This makes Medicaid fraud harder to detect and analyze at scale.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">5. Geographic Patterns</h3>
                  <p className="text-gray-700">Medicare fraud concentrates in <strong>Sun Belt states</strong> — Florida, California, Texas — with high elderly populations and historical fraud infrastructure. Medicaid fraud follows <strong>population and poverty patterns</strong>, with significant issues in states that expanded Medicaid under the ACA.</p>
                </div>
              </div>
            </section>

            {/* Overlap */}
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">Where Medicare and Medicaid Fraud Overlap</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Despite their differences, the two programs share some fraud vectors:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li><strong>Dual-eligible beneficiaries:</strong> About 12 million Americans are enrolled in both Medicare and Medicaid. Providers can bill both programs for the same patient — sometimes fraudulently double-billing.</li>
                <li><strong>Anti-Kickback Statute:</strong> Applies to both programs. Kickback schemes often target both Medicare and Medicaid simultaneously.</li>
                <li><strong>OIG exclusions:</strong> A provider excluded from one program is automatically excluded from both. The <a href="https://exclusions.oig.hhs.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LEIE database</a> covers both.</li>
                <li><strong>False Claims Act:</strong> The federal government&apos;s primary tool for recovering fraud losses applies to both programs, with whistleblower rewards of 15–30%.</li>
              </ul>
            </section>

            {/* Enforcement */}
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">Enforcement: Who Fights Each Type of Fraud?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-bold text-blue-900 mb-2">Medicare Fraud Enforcement</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• DOJ Healthcare Fraud Unit</li>
                    <li>• Medicare Fraud Strike Force (27 cities)</li>
                    <li>• HHS Office of Inspector General</li>
                    <li>• CMS Center for Program Integrity</li>
                    <li>• FBI Healthcare Fraud Division</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-bold text-green-900 mb-2">Medicaid Fraud Enforcement</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• State Medicaid Fraud Control Units (MFCUs)</li>
                    <li>• State Attorneys General</li>
                    <li>• HHS Office of Inspector General</li>
                    <li>• DOJ (for federal share)</li>
                    <li>• State-level inspectors general</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                The fragmented nature of Medicaid enforcement — spread across 50 state agencies — is one reason why Medicaid fraud detection lags behind Medicare. Federal authorities can analyze all of Medicare in one database; Medicaid requires coordination with each individual state.
              </p>
            </section>

            {/* Our Work */}
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">How We&apos;re Tackling Both</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                OpenMedicare focuses on Medicare fraud because the data is centralized and publicly available. But we&apos;re expanding:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">🔵 OpenMedicare</h3>
                  <p className="text-sm text-gray-600 mb-2">$854.8B in Medicare Part B data. 1.7M providers. 500 AI-flagged for fraud patterns.</p>
                  <Link href="/" className="text-blue-600 hover:underline text-sm font-medium">Explore Medicare Data →</Link>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">🟢 OpenMedicaid</h3>
                  <p className="text-sm text-gray-600 mb-2">Coming soon: state-by-state Medicaid spending analysis, provider data, and fraud detection.</p>
                  <a href="https://www.openmedicaid.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm font-medium">Visit OpenMedicaid →</a>
                </div>
              </div>
            </section>

            {/* Bottom Line */}
            <section className="mb-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-purple-900 mb-2">The Bottom Line</h2>
              <p className="text-purple-800 leading-relaxed">
                Medicare and Medicaid fraud are both massive problems, but they require different solutions. Medicare&apos;s centralized structure makes it amenable to AI-driven detection (which is what we do). Medicaid&apos;s fragmentation across 50 states makes it harder to analyze at scale — but not impossible. Together, these two programs lose an estimated <strong>$100–180 billion annually</strong> to fraud, waste, and abuse. Better data transparency and modern detection tools can help recover a significant portion of that.
              </p>
            </section>

          </div>
        </article>

        <div className="mt-8">
          <SourceCitation
            lastUpdated="February 2026"
            sources={[
              'Centers for Medicare & Medicaid Services (CMS)',
              'HHS Office of Inspector General (OIG)',
              'U.S. Department of Justice — Healthcare Fraud Enforcement',
              'National Association of Medicaid Directors',
              'Government Accountability Office (GAO) — High-Risk Series',
              'OpenMedicare AI Fraud Detection Model',
            ]}
          />
        </div>
      </div>
    </div>
  )
}
