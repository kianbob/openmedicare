import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'

export const metadata: Metadata = {
  title: 'Report Medicare Fraud',
  description: 'How to report Medicare fraud. OIG hotline, False Claims Act whistleblower rewards, and what counts as fraud.',
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

        {/* Primary Hotline */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 mb-8 text-center">
          <div className="text-5xl mb-4">📞</div>
          <h2 className="text-2xl font-bold text-red-900 mb-2">OIG Fraud Hotline</h2>
          <a href="tel:1-800-447-8477" className="text-4xl font-bold text-red-700 hover:underline block mb-2">
            1-800-HHS-TIPS
          </a>
          <div className="text-lg text-red-600 mb-4">(1-800-447-8477)</div>
          <a
            href="https://oig.hhs.gov/fraud/report-fraud/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Report Online at OIG.HHS.gov →
          </a>
          <div className="text-sm text-gray-600 mt-4">
            The HHS Office of Inspector General investigates fraud, waste, and abuse in Medicare and other HHS programs.
          </div>
        </div>

        {/* Other contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">📱 CMS / Medicare</h3>
            <a href="tel:1-800-633-4227" className="text-xl font-bold text-blue-700 hover:underline block mb-1">
              1-800-MEDICARE
            </a>
            <div className="text-sm text-blue-600 mb-2">(1-800-633-4227)</div>
            <p className="text-sm text-blue-800">
              Report billing errors, suspicious charges on your Medicare statements, or providers charging for services you didn&apos;t receive.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">🏛️ State Fraud Control Units</h3>
            <p className="text-sm text-green-800 mb-2">
              Every state has a Medicaid Fraud Control Unit (MFCU) that also handles Medicare fraud referrals.
            </p>
            <a
              href="https://oig.hhs.gov/fraud/medicaid-fraud-control-units-mfcu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-700 hover:underline font-medium"
            >
              Find Your State&apos;s MFCU →
            </a>
          </div>
        </div>

        {/* False Claims Act */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-10">
          <h2 className="text-xl font-bold text-amber-900 mb-3">💰 Whistleblower Rewards: The False Claims Act</h2>
          <p className="text-sm text-amber-800 mb-3">
            Under the federal False Claims Act (also called &quot;qui tam&quot;), private citizens who report fraud against
            the government can receive <strong>15–30% of the total amount recovered</strong>.
          </p>
          <div className="bg-white rounded p-4 border border-amber-200 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">How It Works</h4>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>You (the &quot;relator&quot;) file a sealed complaint in federal court with evidence of fraud.</li>
              <li>The DOJ investigates and decides whether to join the case (usually within 60 days, often extended).</li>
              <li>If the government joins and recovers funds, you receive 15–25% of the recovery.</li>
              <li>If the government declines but you continue and win, you receive 25–30%.</li>
            </ol>
          </div>
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> Qui tam cases require a lawyer experienced in False Claims Act litigation.
            The complaint must be filed under seal — do not publicly disclose the fraud before filing.
            Many healthcare fraud attorneys work on contingency (no upfront cost to you).
          </p>
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
              <div key={item.title} className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What to include */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What to Include in Your Report</h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>✅ Provider name, address, and NPI number (if known)</li>
            <li>✅ Description of the suspected fraud — what happened, when, and where</li>
            <li>✅ Names and contact information for anyone who can corroborate</li>
            <li>✅ Copies of relevant documents (Medicare statements, medical records, billing records)</li>
            <li>✅ Your contact information (reports can be anonymous, but follow-up helps investigations)</li>
          </ul>
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

        <ShareButtons url="https://openmedicare.vercel.app/fraud/report" title="Report Medicare Fraud" />
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
