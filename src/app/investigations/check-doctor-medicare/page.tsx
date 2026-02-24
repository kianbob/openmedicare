import type { Metadata } from 'next'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'How to Check if Your Doctor Has Medicare Fraud Flags',
  description: 'Step-by-step guide to checking your doctor\'s Medicare billing history, fraud flags, and OIG exclusion status. Free provider lookup tool included.',
  keywords: ['check doctor medicare fraud', 'is my doctor being investigated', 'medicare provider lookup', 'doctor fraud check', 'OIG exclusion list'],
  alternates: { canonical: '/investigations/check-doctor-medicare' },
  openGraph: {
    title: 'How to Check if Your Doctor Has Medicare Fraud Flags',
    description: 'Step-by-step guide to checking your doctor\'s Medicare billing history, fraud flags, and OIG exclusion status. Free provider lookup tool included.',
    url: 'https://www.openmedicare.us/investigations/check-doctor-medicare',
  },
}

export default function CheckDoctorMedicarePage() {
  const publishedDate = '2026-02-23'
  const readTime = '10 min read'

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="How to Check if Your Doctor Has Medicare Fraud Flags"
        description="Step-by-step guide to checking your doctor's Medicare billing history, fraud flags, and OIG exclusion status."
        publishedDate={publishedDate}
        modifiedDate={publishedDate}
        url="https://www.openmedicare.us/investigations/check-doctor-medicare"
      />
      <InvestigationDisclaimer />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'Check Your Doctor' },
          ]}
          className="mb-8"
        />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-4">
                How-To Guide
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4 leading-tight">
                How to Check if Your Doctor Has Medicare Fraud Flags
              </h1>
              <p className="text-2xl text-gray-600 font-light leading-relaxed">
                A step-by-step guide to looking up any doctor&apos;s Medicare billing patterns, fraud risk scores, and exclusion status.
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
                <ShareButtons title="How to Check if Your Doctor Has Medicare Fraud Flags" url="https://www.openmedicare.us/investigations/check-doctor-medicare" />
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-bold text-blue-900 mb-2">Quick Check: Look Up Your Doctor Now</h2>
              <p className="text-blue-800 mb-4">
                Enter any provider&apos;s name or NPI number to see their Medicare billing data, fraud risk score, and peer comparisons.
              </p>
              <Link
                href="/lookup"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Provider Lookup Tool →
              </Link>
            </div>

            {/* Why Check */}
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">Why Should You Check Your Doctor&apos;s Medicare Record?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Medicare fraud costs taxpayers an estimated <Link href="/investigations/medicare-fraud-statistics" className="text-blue-600 hover:underline">$60–100 billion annually</Link>. While most doctors are honest, fraudulent providers can put patients at risk in several ways:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li><strong>Unnecessary procedures</strong> — some fraudulent providers order tests or procedures you don&apos;t need to bill Medicare</li>
                <li><strong>Phantom billing</strong> — you may be billed for services you never received, which can affect your Medicare benefits</li>
                <li><strong>Quality of care</strong> — providers focused on maximizing billing may cut corners on actual patient care</li>
                <li><strong>Excluded providers</strong> — some providers continue practicing even after being excluded from Medicare by the OIG</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                The good news: all Medicare billing data is public. You can check any provider in minutes.
              </p>
            </section>

            {/* Step 1 */}
            <section className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                <h2 className="text-3xl font-bold text-gray-900 font-serif">Use the OpenMedicare Lookup Tool</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 ml-14">
                Our free <Link href="/lookup" className="text-blue-600 hover:underline font-medium">Provider Lookup Tool</Link> is the fastest way to check any doctor. Here&apos;s what you&apos;ll find:
              </p>
              <div className="ml-14 bg-gray-50 rounded-lg p-6 mb-4">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 font-bold mr-2">✓</span>
                    <span><strong>Total Medicare payments</strong> — how much Medicare has paid this provider over 10 years</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 font-bold mr-2">✓</span>
                    <span><strong>Service volume</strong> — how many services they billed and how many patients they saw</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 font-bold mr-2">✓</span>
                    <span><strong>AI fraud risk score</strong> — our machine learning model compares their billing to 8,300+ confirmed fraudsters</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 font-bold mr-2">✓</span>
                    <span><strong>Peer comparison</strong> — how their billing compares to others in the same specialty and state</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 font-bold mr-2">✓</span>
                    <span><strong>Procedure breakdown</strong> — exactly which services they bill Medicare for</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed ml-14">
                <strong>How to search:</strong> Go to <Link href="/lookup" className="text-blue-600 hover:underline">/lookup</Link> and enter the provider&apos;s name, NPI number, or specialty. Results include all providers in our database of 1.7 million+ Medicare providers.
              </p>
            </section>

            {/* Step 2 */}
            <section className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                <h2 className="text-3xl font-bold text-gray-900 font-serif">Check the OIG Exclusion List</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 ml-14">
                The HHS Office of Inspector General maintains the <strong>List of Excluded Individuals/Entities (LEIE)</strong> — a database of providers who have been banned from participating in Medicare and Medicaid. If your doctor is on this list, Medicare will not pay for their services.
              </p>
              <div className="ml-14 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  <strong>⚠️ Important:</strong> Some excluded providers continue to practice and bill patients directly. If your provider is on the LEIE, you should find a new provider immediately. Medicare will not cover any services from an excluded provider.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed ml-14 mb-4">
                You can search the LEIE directly at <a href="https://exclusions.oig.hhs.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">exclusions.oig.hhs.gov</a>. We also integrate LEIE data into our <Link href="/fraud/watchlist" className="text-blue-600 hover:underline">Fraud Watchlist</Link> for easier cross-referencing.
              </p>
            </section>

            {/* Step 3 */}
            <section className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                <h2 className="text-3xl font-bold text-gray-900 font-serif">Understand What the Flags Mean</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 ml-14">
                Not all flags mean fraud. Here&apos;s how to interpret what you find:
              </p>

              <div className="ml-14 space-y-4 mb-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Low Risk</span>
                    <span className="font-bold text-gray-900">Fraud Score: 0–25%</span>
                  </div>
                  <p className="text-gray-600 text-sm">Billing patterns are normal for their specialty and location. No action needed.</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Moderate</span>
                    <span className="font-bold text-gray-900">Fraud Score: 25–75%</span>
                  </div>
                  <p className="text-gray-600 text-sm">Some billing anomalies detected. Could be legitimate (high-volume practice, unique specialty mix) or warrant closer attention. Review their procedure breakdown.</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">High Risk</span>
                    <span className="font-bold text-gray-900">Fraud Score: 75%+</span>
                  </div>
                  <p className="text-gray-600 text-sm">Billing patterns closely resemble confirmed Medicare fraudsters. This does NOT mean they are committing fraud — but their statistical profile matches those who have been convicted. Our <Link href="/fraud/still-out-there" className="text-blue-600 hover:underline">Still Out There</Link> page profiles the highest-risk providers.</p>
                </div>

                <div className="border rounded-lg p-4 bg-red-50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600 text-white">Excluded</span>
                    <span className="font-bold text-gray-900">OIG Exclusion</span>
                  </div>
                  <p className="text-gray-600 text-sm">This provider has been formally excluded from Medicare/Medicaid by the OIG. They are banned from billing federal healthcare programs. If they are still seeing patients, this is a serious concern.</p>
                </div>
              </div>
            </section>

            {/* What To Do If Flagged */}
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">What to Do If Your Doctor IS Flagged</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you find that your doctor has a high fraud risk score or appears on the OIG exclusion list, here&apos;s what to do:
              </p>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">🔍 Don&apos;t Panic — Investigate First</h3>
                  <p className="text-gray-700 text-sm">A high fraud score means statistical resemblance to fraudsters, not a conviction. Look at the specific billing details. High-volume legitimate practices (e.g., large group practices, drug-administering oncologists) can score higher.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">📋 Review Your Medicare Summary Notices</h3>
                  <p className="text-gray-700 text-sm">Check every service listed on your MSN. If you see charges for services you didn&apos;t receive, dates you didn&apos;t visit, or equipment you never got — that&apos;s a red flag.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">📞 Report Suspected Fraud</h3>
                  <p className="text-gray-700 text-sm">
                    Call the OIG hotline: <strong>1-800-HHS-TIPS (1-800-447-8477)</strong>. You can also file online at <a href="https://oig.hhs.gov/fraud/report-fraud/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">oig.hhs.gov</a>. Under the False Claims Act, whistleblowers can receive 15–30% of recovered funds. See our <Link href="/fraud/report" className="text-blue-600 hover:underline">complete reporting guide</Link>.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">🏥 Consider Switching Providers</h3>
                  <p className="text-gray-700 text-sm">If your provider is OIG-excluded, switch immediately. For high-risk-score providers, use our <Link href="/providers" className="text-blue-600 hover:underline">provider directory</Link> to find alternatives in your area with clean billing records.</p>
                </div>
              </div>
            </section>

            {/* Other Resources */}
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">Other Ways to Research Your Doctor</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/providers" className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <h3 className="font-bold text-blue-600 mb-1">Provider Directory</h3>
                  <p className="text-sm text-gray-600">Browse all 1.7M+ Medicare providers with billing data and rankings.</p>
                </Link>
                <Link href="/fraud/watchlist" className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <h3 className="font-bold text-blue-600 mb-1">Fraud Watchlist</h3>
                  <p className="text-sm text-gray-600">500 providers flagged by AI for suspicious billing patterns.</p>
                </Link>
                <Link href="/fraud/still-out-there" className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <h3 className="font-bold text-blue-600 mb-1">Still Out There</h3>
                  <p className="text-sm text-gray-600">Providers with the highest fraud probability scores still actively billing.</p>
                </Link>
                <Link href="/compare" className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <h3 className="font-bold text-blue-600 mb-1">Compare Providers</h3>
                  <p className="text-sm text-gray-600">Side-by-side comparison of any two providers&apos; billing patterns.</p>
                </Link>
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Is it legal to look up my doctor&apos;s Medicare billing?</h3>
                  <p className="text-gray-700 text-sm">Yes. All Medicare provider payment data is public information, released annually by CMS. OpenMedicare simply makes this data easier to search and understand.</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Does a high fraud score mean my doctor is a criminal?</h3>
                  <p className="text-gray-700 text-sm">No. Our AI model identifies statistical patterns that resemble convicted fraudsters. Many legitimate high-volume providers may score higher. A flag is a signal to look more closely — not an accusation.</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">What is an NPI number?</h3>
                  <p className="text-gray-700 text-sm">A National Provider Identifier (NPI) is a unique 10-digit number assigned to every healthcare provider. You can find your doctor&apos;s NPI on any Medicare billing statement or by searching our <Link href="/lookup" className="text-blue-600 hover:underline">lookup tool</Link>.</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">How often is this data updated?</h3>
                  <p className="text-gray-700 text-sm">CMS releases new Medicare payment data annually, typically with a 1–2 year lag. Our database currently covers 2014–2023. AI fraud scores are recalculated with each data release.</p>
                </div>
              </div>
            </section>

          </div>
        </article>

        <div className="mt-8">
          <SourceCitation
            lastUpdated="February 2026 (data through 2023)"
            sources={[
              'Centers for Medicare & Medicaid Services (CMS) — Provider Utilization and Payment Data',
              'HHS Office of Inspector General — List of Excluded Individuals/Entities (LEIE)',
              'OpenMedicare AI Fraud Detection Model',
            ]}
          />
        </div>
      </div>
    </div>
  )
}
