import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'

export const metadata: Metadata = {
  title: 'How to Report Medicare Fraud (Earn 15-30%)',
  description: 'Step-by-step guide to reporting Medicare fraud. Call 1-800-HHS-TIPS or file online. Whistleblowers earn 15-30% of recovered funds under the False Claims Act.',
  alternates: { canonical: '/fraud/report' },
}

export default function ReportFraud() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: 'Fraud Analysis', href: '/fraud' }, { name: 'Report Fraud' }]} />

        <h1 className="text-4xl font-bold font-serif text-gray-900 mt-6 mb-4">Report Medicare Fraud</h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl">
          If you see something, say something. Medicare fraud costs taxpayers over $100 billion per year.
          Your report could help recover millions — and you may be entitled to a reward.
        </p>

        {/* Primary Hotline — prominent */}
        <div className="relative bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-8 sm:p-10 mb-10 text-center text-white shadow-xl shadow-red-200 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
          </div>
          <div className="relative z-10">
            <div className="text-5xl mb-4">📞</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">OIG Fraud Hotline</h2>
            <a href="tel:1-800-447-8477" className="text-4xl sm:text-5xl font-black tracking-tight hover:underline block mb-2">
              1-800-HHS-TIPS
            </a>
            <div className="text-lg text-red-200 mb-6">(1-800-447-8477) · Available 24/7</div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://oig.hhs.gov/fraud/report-fraud/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-colors shadow"
              >
                Report Online at OIG.HHS.gov →
              </a>
              <a
                href="mailto:HHSTips@oig.hhs.gov"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                Email: HHSTips@oig.hhs.gov
              </a>
            </div>
          </div>
        </div>

        {/* Step-by-Step Reporting Guide */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">How to Report: Step by Step</h2>
          <p className="text-gray-500 mb-8">Follow these steps to file an effective fraud report</p>

          <div className="space-y-0">
            {[
              {
                step: 1,
                title: 'Gather Your Evidence',
                desc: 'Collect everything you can before reaching out. The more detail, the better the investigation.',
                color: 'blue',
              },
              {
                step: 2,
                title: 'Choose Your Reporting Channel',
                desc: 'Call the OIG hotline (1-800-HHS-TIPS), submit online at OIG.HHS.gov, or email HHSTips@oig.hhs.gov. For whistleblower rewards, consult a False Claims Act attorney first.',
                color: 'indigo',
              },
              {
                step: 3,
                title: 'File Your Report',
                desc: 'Provide the provider name, NPI, dates, locations, and a clear description of what happened. Include any supporting documents.',
                color: 'purple',
              },
              {
                step: 4,
                title: 'Follow Up',
                desc: 'Save your reference number. You may be contacted for additional information. Anonymous reports are accepted but named reports lead to better outcomes.',
                color: 'green',
              },
            ].map((item, i, arr) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full bg-${item.color}-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm`}>
                    {item.step}
                  </div>
                  {i < arr.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-1" />}
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What Information to Gather */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 sm:p-8 mb-10">
          <h2 className="text-xl font-bold text-blue-900 mb-1">📋 What Information to Gather Before Reporting</h2>
          <p className="text-sm text-blue-700 mb-5">Having these ready will make your report much more effective</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-gray-900 text-sm mb-2">About the Provider</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex gap-2"><span className="text-blue-500">✓</span> Full name and credentials</li>
                <li className="flex gap-2"><span className="text-blue-500">✓</span> NPI number (find on OpenMedicare)</li>
                <li className="flex gap-2"><span className="text-blue-500">✓</span> Practice address</li>
                <li className="flex gap-2"><span className="text-blue-500">✓</span> Specialty and organization</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-gray-900 text-sm mb-2">About the Fraud</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex gap-2"><span className="text-blue-500">✓</span> What happened (billing, services, etc.)</li>
                <li className="flex gap-2"><span className="text-blue-500">✓</span> When it happened (dates, frequency)</li>
                <li className="flex gap-2"><span className="text-blue-500">✓</span> How you know (patient, employee, etc.)</li>
                <li className="flex gap-2"><span className="text-blue-500">✓</span> Dollar amounts if known</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-gray-900 text-sm mb-2">Supporting Documents</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex gap-2"><span className="text-blue-500">✓</span> Medicare Summary Notices (MSN)</li>
                <li className="flex gap-2"><span className="text-blue-500">✓</span> Explanation of Benefits (EOB)</li>
                <li className="flex gap-2"><span className="text-blue-500">✓</span> Medical records or receipts</li>
                <li className="flex gap-2"><span className="text-blue-500">✓</span> Photos, emails, or other evidence</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-gray-900 text-sm mb-2">Witnesses</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex gap-2"><span className="text-blue-500">✓</span> Names of others who can corroborate</li>
                <li className="flex gap-2"><span className="text-blue-500">✓</span> Their contact information</li>
                <li className="flex gap-2"><span className="text-blue-500">✓</span> Their relationship to the situation</li>
                <li className="flex gap-2"><span className="text-blue-500">✓</span> Your own contact info (optional)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Other contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">📱 CMS / Medicare</h3>
            <a href="tel:1-800-633-4227" className="text-xl font-bold text-blue-700 hover:underline block mb-1">
              1-800-MEDICARE
            </a>
            <div className="text-sm text-blue-600 mb-2">(1-800-633-4227) · TTY 1-877-486-2048</div>
            <p className="text-sm text-blue-800">
              Report billing errors, suspicious charges on your Medicare statements, or providers charging for services you didn&apos;t receive.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">🏛️ State Fraud Control Units</h3>
            <p className="text-sm text-green-800 mb-3">
              Every state has a Medicaid Fraud Control Unit (MFCU) that also handles Medicare fraud referrals.
            </p>
            <a
              href="https://oig.hhs.gov/fraud/medicaid-fraud-control-units-mfcu/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Find Your State&apos;s MFCU →
            </a>
          </div>
        </div>

        {/* What Happens After You Report */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens After You Report</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="text-2xl shrink-0">📥</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Intake & Review</h4>
                <p className="text-sm text-gray-600">Your report is logged and reviewed by OIG analysts. They assess whether the complaint warrants further investigation.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl shrink-0">🔍</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Investigation</h4>
                <p className="text-sm text-gray-600">If warranted, investigators examine billing records, interview witnesses, and subpoena documents. This can take months to years.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl shrink-0">⚖️</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Legal Action</h4>
                <p className="text-sm text-gray-600">Cases may result in civil settlements, criminal charges, or exclusion from Medicare. The DOJ recovered $2.2B in healthcare fraud in FY2023.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl shrink-0">🛡️</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Whistleblower Protection</h4>
                <p className="text-sm text-gray-600">Federal law protects you from retaliation. If your employer fires you for reporting fraud, you may have a wrongful termination claim.</p>
              </div>
            </div>
          </div>
        </div>

        {/* False Claims Act */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 sm:p-8 mb-10">
          <h2 className="text-xl font-bold text-amber-900 mb-3">💰 Whistleblower Rewards: The False Claims Act</h2>
          <p className="text-sm text-amber-800 mb-4">
            Under the federal False Claims Act (also called &quot;qui tam&quot;), private citizens who report fraud against
            the government can receive <strong className="text-amber-900">15–30% of the total amount recovered</strong>.
            In major Medicare fraud cases, this can mean millions of dollars.
          </p>
          <div className="bg-white rounded-lg p-5 border border-amber-200 mb-4">
            <h4 className="font-semibold text-gray-900 mb-3">How It Works</h4>
            <ol className="text-sm text-gray-700 space-y-3 list-decimal list-inside">
              <li><strong>File under seal.</strong> You (the &quot;relator&quot;) file a sealed complaint in federal court with evidence of fraud. You&apos;ll need a qui tam attorney.</li>
              <li><strong>DOJ investigates.</strong> The government has 60 days (often extended) to decide whether to join your case.</li>
              <li><strong>Government joins → 15–25%.</strong> If the DOJ takes the case and recovers funds, you receive 15–25% of the recovery.</li>
              <li><strong>Government declines → 25–30%.</strong> If you continue alone and win, you receive 25–30%.</li>
            </ol>
          </div>
          <div className="flex items-start gap-2 text-sm text-amber-800 bg-amber-100 rounded-lg p-3">
            <span className="text-lg shrink-0">⚠️</span>
            <p>
              <strong>Important:</strong> Qui tam cases require an attorney experienced in False Claims Act litigation.
              The complaint must be filed under seal — do not publicly disclose the fraud before filing.
              Many healthcare fraud attorneys work on contingency (no upfront cost).
            </p>
          </div>
        </div>

        {/* What counts as fraud */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Counts as Medicare Fraud?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '📈', title: 'Upcoding', desc: 'Billing for a more expensive service than was actually provided (e.g., 99214 instead of 99213).' },
              { icon: '👻', title: 'Phantom Billing', desc: 'Billing for services, procedures, or supplies that were never provided to the patient.' },
              { icon: '🏥', title: 'Unnecessary Services', desc: 'Ordering tests, procedures, or treatments that are not medically necessary.' },
              { icon: '💵', title: 'Kickbacks', desc: 'Receiving or paying for patient referrals — illegal under the Anti-Kickback Statute.' },
              { icon: '🔄', title: 'Unbundling', desc: 'Billing separately for services that should be billed as a package at a lower rate.' },
              { icon: '👤', title: 'Identity Theft', desc: 'Using someone else\'s Medicare number to bill for services.' },
            ].map(item => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Fraud Analysis */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Fraud Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline text-sm">🚨 Enhanced Watchlist — 500 flagged providers</Link>
            <Link href="/fraud/deep-dives" className="text-medicare-primary hover:underline text-sm">🔍 Deep Dive Profiles — Top 20 highest-risk</Link>
            <Link href="/fraud/covid-tests" className="text-medicare-primary hover:underline text-sm">🦠 COVID Test Billing — K1034 abuse</Link>
            <Link href="/fraud/wound-care" className="text-medicare-primary hover:underline text-sm">🩹 Wound Care — DOJ&apos;s #1 fraud target</Link>
            <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
          </div>
        </div>

        <div className="text-center mb-10">
          <Link
            href="/fraud"
            className="inline-flex items-center px-6 py-3 border border-medicare-primary text-medicare-primary hover:bg-medicare-primary hover:text-white font-medium rounded-md transition-colors"
          >
            ← Back to Fraud Analysis Hub
          </Link>
        </div>

        <ShareButtons url="https://www.openmedicare.com/fraud/report" title="Report Medicare Fraud" />
        <div className="mt-6">
          <SourceCitation
            sources={['HHS Office of Inspector General', 'Department of Justice, Civil Division', 'False Claims Act (31 U.S.C. §§ 3729–3733)']}
            lastUpdated="February 2026"
          />
        </div>
      </div>
    </div>
  )
}
