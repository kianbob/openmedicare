import type { Metadata } from 'next'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'Three Providers, Three Red Flags: Inside Medicare\'s Most Suspicious Billing Patterns',
  description: 'A nurse practitioner billing $12.1M in COVID tests. A Beverly Hills plastic surgeon billing $28.9M in wound care. An anti-aging spa doctor with a 197.7x markup. Three providers, three statistical anomalies.',
  alternates: { canonical: '/investigations/three-providers' },
  openGraph: {
    title: 'Three Providers, Three Red Flags: Inside Medicare\'s Most Suspicious Billing Patterns',
    description: 'A nurse practitioner billing $12.1M in COVID tests. A Beverly Hills plastic surgeon billing $28.9M in wound care. An anti-aging spa doctor with a 197.7x markup.',
    url: 'https://openmedicare.vercel.app/investigations/three-providers',
  },
}

function loadProviderData(npi: number) {
  const filePath = path.join(process.cwd(), 'public', 'data', 'providers', `${npi}.json`)
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function loadFraudFeatures() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'fraud-features.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(raw)
  // fraud-features has impossible_providers array
  const all = [...(data.impossible_providers || []), ...(Array.isArray(data) ? data : [])]
  return all
}

export default function ThreeProvidersPage() {
  const publishedDate = '2026-02-21'
  const readTime = '20 min read'

  // Load real provider data
  const taheriProvider = loadProviderData(1184886178)
  const kohanzadehProvider = loadProviderData(1952575342)
  const sharahyProvider = loadProviderData(1598889248)

  const fraudFeatures = loadFraudFeatures()
  const taheriFraud = fraudFeatures.find((p: { npi: string | number }) => String(p.npi) === '1184886178')
  const kohanzadehFraud = fraudFeatures.find((p: { npi: string | number }) => String(p.npi) === '1952575342')
  const sharahyFraud = fraudFeatures.find((p: { npi: string | number }) => String(p.npi) === '1598889248')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'Three Providers, Three Red Flags' },
          ]}
          className="mb-8"
        />
            <InvestigationDisclaimer />
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-4">
                Featured Investigation
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4">
                Three Providers, Three Red Flags
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                Inside Medicare&apos;s Most Suspicious Billing Patterns
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

            {/* Disclaimer - Top */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> The billing patterns described in this article are statistical flags based
                on publicly available CMS data. They are <strong>not accusations of fraud</strong>. Each case may have
                legitimate explanations — data aggregation issues, large group practices billing under one NPI, or other
                factors. Named providers have not been charged with any crime unless otherwise noted. We present these
                patterns because taxpayers deserve transparency in how Medicare dollars are spent.
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* Opening Hook */}
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Three names. Three billing patterns. Three sets of questions that don&apos;t have easy answers.
              </p>
              <p>
                A nurse practitioner in Torrance, California who billed Medicare {formatCurrency(12149038)} for COVID tests
                in a single year — 990 times the specialty median. A Beverly Hills plastic surgeon whose Medicare billing
                is dominated by wound care, totaling {formatCurrency(28873117)} over a decade. An anti-aging spa doctor in
                New Jersey who went from {formatCurrency(235410)} to {formatCurrency(5663224)} in a single year — a 24x explosion.
              </p>
              <p>
                These three providers were flagged by our statistical analysis of CMS Medicare Provider Utilization and Payment Data
                spanning 2014–2023. Each sits atop our{' '}
                <Link href="/watchlist" className="text-medicare-primary hover:underline">risk-scored watchlist</Link>,
                scoring 96, 92, and 88 out of 100 respectively. Each exhibits billing volumes or patterns that fall far
                outside the statistical norms for their specialties.
              </p>
              <p>
                What follows is what the public data shows. You can verify every number yourself.
              </p>

              {/* Methodology */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">📊 How We Identified These Providers</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Our analysis processes 10 years of CMS Medicare Provider Utilization and Payment Data (2014–2023), covering
                  over 1.1 million providers. For each provider, we calculate:
                </p>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• <strong>Specialty z-score:</strong> How many standard deviations their billing exceeds their specialty median</li>
                  <li>• <strong>Services per day:</strong> Whether their daily volume is physically plausible</li>
                  <li>• <strong>Code concentration:</strong> Whether billing is concentrated in a few codes (indicating possible scheme billing)</li>
                  <li>• <strong>Markup ratio:</strong> Submitted charges vs. Medicare payments</li>
                  <li>• <strong>Year-over-year growth:</strong> Sudden billing explosions</li>
                  <li>• <strong>COVID/wound care share:</strong> Billing in categories identified by HHS-OIG as fraud-vulnerable</li>
                </ul>
                <p className="text-blue-800 text-sm mt-3">
                  These metrics are combined into a composite risk score from 0–100. Statistical flags are not proof of fraud —
                  they identify patterns that warrant further scrutiny.
                </p>
              </div>

              {/* ==================== PROVIDER 1: TAHERI ==================== */}
              <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-2 font-serif">
                Provider 1: Merry Taheri
              </h2>
              <p className="text-lg text-gray-500 mb-6">
                A nurse practitioner billed Medicare {formatCurrency(12149038)} in COVID tests — 990x the specialty median
              </p>

              {/* Data Card */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">Merry Taheri, MSN FNP</h3>
                    <p className="text-red-700 text-sm">Nurse Practitioner — Torrance, CA • NPI: 1184886178</p>
                  </div>
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Risk: 96/100</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 block">Total Medicare Payments</span>
                    <strong className="text-red-800 text-lg">{formatCurrency(taheriFraud?.total_payments || 12149038)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Total Services</span>
                    <strong className="text-lg">{formatNumber(taheriFraud?.total_services || 1032955)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Beneficiaries</span>
                    <strong className="text-lg">{formatNumber(taheriFraud?.total_beneficiaries || 127936)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Services per Day</span>
                    <strong className="text-red-800">{formatNumber(taheriFraud?.services_per_day || 4132)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Specialty Z-Score</span>
                    <strong className="text-red-800">{taheriFraud?.specialty_zscore || 23.06}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">COVID Test Share</span>
                    <strong className="text-red-800">{taheriFraud?.covid_share_pct || 100}%</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Unique Codes Billed</span>
                    <strong>{taheriFraud?.unique_codes || 3}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Markup Ratio</span>
                    <strong>{taheriFraud?.markup_ratio || 1.03}x</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Code Concentration</span>
                    <strong className="text-red-800">{taheriFraud?.code_concentration || 1.0} (max)</strong>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/providers/1184886178" className="text-red-700 hover:underline text-sm font-medium">
                    View Full Provider Profile →
                  </Link>
                </div>
              </div>

              {/* Yearly Billing Table */}
              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Yearly Billing History</h3>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Year</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Payments</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Services</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Beneficiaries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taheriProvider.yearly_payments?.map((y: { year: number; total_payments: number; total_services: number; total_beneficiaries: number }) => (
                      <tr key={y.year} className={y.year === 2023 ? 'bg-red-50 font-bold' : ''}>
                        <td className="px-4 py-2 border-t">{y.year}</td>
                        <td className="px-4 py-2 border-t text-right">{formatCurrency(y.total_payments)}</td>
                        <td className="px-4 py-2 border-t text-right">{formatNumber(y.total_services)}</td>
                        <td className="px-4 py-2 border-t text-right">{formatNumber(y.total_beneficiaries)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>
                Merry Taheri is listed as a nurse practitioner in Torrance, California. In 2023 alone, her NPI billed
                Medicare {formatCurrency(taheriProvider.yearly_payments?.[0]?.total_payments || 12149038)} for{' '}
                {formatNumber(taheriProvider.yearly_payments?.[0]?.total_services || 1032955)} services. That&apos;s{' '}
                <strong>{formatNumber(4132)} services per working day</strong> — or roughly 517 per hour for an 8-hour shift.
              </p>
              <p>
                100% of her billing is through COVID test codes, primarily K1034. Her code concentration score is 1.0 — the
                mathematical maximum — meaning virtually every dollar came from one type of service. Her specialty z-score
                of 23.06 means she billed <strong>23 standard deviations above the nurse practitioner median</strong>.
                In statistics, anything above 3 standard deviations is considered extreme. She is at 23.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Public Context</h3>
              <p>
                Publicly available information shows Taheri is running for the California State Assembly, District 69,
                with a campaign website at{' '}
                <a href="https://merrytaheri4assembly.com" target="_blank" rel="noopener noreferrer" className="text-medicare-primary hover:underline">
                  merrytaheri4assembly.com
                </a>. She describes herself as &quot;Dr. Merry Taheri&quot; — she holds a Doctor of Nursing Practice (DNP),
                not a medical degree. Her campaign bio describes &quot;24+ years as nurse/nurse practitioner in multiple
                Emergency Departments&quot; and states she was on &quot;the front lines&quot; during COVID.
              </p>

              <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 my-6">
                <h4 className="font-semibold text-gray-900 mb-2">❓ The Questions</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• How does one nurse practitioner bill {formatCurrency(12149038)} for COVID tests in a single year?</li>
                  <li>• {formatNumber(4132)} services per day means distributing ~517 tests per hour for 8 hours straight</li>
                  <li>• Is this a data aggregation issue? A testing site operation? Or something else?</li>
                  <li>• She appears to have no billing history before 2023 — then suddenly over {formatNumber(1000000)} services</li>
                  <li>• She is simultaneously running for political office while her NPI shows {formatNumber(4132)} daily services</li>
                </ul>
              </div>

              {/* ==================== PROVIDER 2: KOHANZADEH ==================== */}
              <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-2 font-serif">
                Provider 2: Som Kohanzadeh
              </h2>
              <p className="text-lg text-gray-500 mb-6">
                A Beverly Hills plastic surgeon billing Medicare {formatCurrency(28873117)} — 90.3% from wound care
              </p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 my-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-orange-900">Som Kohanzadeh, MD</h3>
                    <p className="text-orange-700 text-sm">Plastic and Reconstructive Surgery — Beverly Hills, CA • NPI: 1952575342</p>
                  </div>
                  <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">Risk: 92/100</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 block">Total Medicare Payments (10yr)</span>
                    <strong className="text-orange-800 text-lg">{formatCurrency(28873117)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">2023 Payments Alone</span>
                    <strong className="text-orange-800 text-lg">{formatCurrency(kohanzadehProvider.yearly_payments?.find((y: {year: number}) => y.year === 2023)?.total_payments || 14722228)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Wound Care Share</span>
                    <strong className="text-orange-800">90.3%</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Specialty Z-Score</span>
                    <strong className="text-orange-800">{kohanzadehFraud?.specialty_zscore || 27.64}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Drug Code Share</span>
                    <strong>33.3%</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Per-Beneficiary Avg</span>
                    <strong className="text-orange-800">{formatCurrency(11170)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Unique Codes</span>
                    <strong>19</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Markup Ratio</span>
                    <strong className="text-orange-800">3.8x</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Avg Markup (Watchlist)</span>
                    <strong className="text-orange-800">59.1x</strong>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/providers/1952575342" className="text-orange-700 hover:underline text-sm font-medium">
                    View Full Provider Profile →
                  </Link>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Yearly Billing History</h3>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Year</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Payments</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Services</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Avg Submitted</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Avg Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kohanzadehProvider.yearly_payments?.map((y: { year: number; total_payments: number; total_services: number; avg_submitted: number; avg_paid: number }) => (
                      <tr key={y.year} className={y.year >= 2020 ? 'bg-orange-50 font-semibold' : ''}>
                        <td className="px-4 py-2 border-t">{y.year}</td>
                        <td className="px-4 py-2 border-t text-right">{formatCurrency(y.total_payments)}</td>
                        <td className="px-4 py-2 border-t text-right">{formatNumber(y.total_services)}</td>
                        <td className="px-4 py-2 border-t text-right">{formatCurrency(y.avg_submitted)}</td>
                        <td className="px-4 py-2 border-t text-right">{formatCurrency(y.avg_paid)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>
                The billing trajectory tells the story. From {formatCurrency(19117)} in 2014 to {formatCurrency(14722228)} in 2023 —
                a <strong>770x increase</strong> over a decade. But the real acceleration began in 2020, when billing jumped from{' '}
                {formatCurrency(662251)} to {formatCurrency(2553302)} — and then kept climbing to {formatCurrency(14722228)} by 2023.
              </p>
              <p>
                Despite being credentialed as a plastic and reconstructive surgeon, 90.3% of Kohanzadeh&apos;s Medicare billing
                is wound care — primarily skin substitute products. His top codes include Q4158 (Kerecis fish skin graft), Q4196
                (PuraPly antimicrobial wound matrix), Q4205 (membrane graft), G0277 (hyperbaric oxygen therapy), and 11043
                (debridement of muscle/bone).
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Public Context</h3>
              <p>
                Kohanzadeh&apos;s practice website at{' '}
                <a href="https://drsom.com" target="_blank" rel="noopener noreferrer" className="text-medicare-primary hover:underline">
                  drsom.com
                </a>{' '}
                markets him as a &quot;Board-Certified Plastic and Reconstructive Surgeon&quot; offering facelifts, breast
                augmentation, liposuction, and other cosmetic procedures. He is also described as co-founder of the
                &quot;Wound Institutes of America, specializing in wound care and healing.&quot;
              </p>
              <p>
                This matters because wound care — specifically skin substitute products — is the Department of Justice&apos;s
                #1 fraud enforcement target. In June 2025, the DOJ announced a <strong>{formatCurrency(14600000000)}</strong> healthcare
                fraud takedown with wound care at the center. In September 2025, the HHS Office of Inspector General
                specifically called skin substitutes &quot;particularly vulnerable to fraud.&quot;
              </p>

              <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 my-6">
                <h4 className="font-semibold text-gray-900 mb-2">❓ The Questions</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Why is a Beverly Hills cosmetic surgeon&apos;s Medicare billing dominated by wound care?</li>
                  <li>• Why did billing jump from {formatCurrency(662251)} to {formatCurrency(14722228)} in 4 years (22x increase)?</li>
                  <li>• How does a plastic surgery practice treat enough wound patients for {formatCurrency(28873117)} in Medicare billing?</li>
                  <li>• Skin substitutes like Kerecis (Q4158) bill at hundreds to thousands of dollars per application</li>
                  <li>• The average submitted charge jumped from {formatCurrency(293)} in 2014 to {formatCurrency(1610)} in 2023</li>
                </ul>
              </div>

              {/* ==================== PROVIDER 3: SHARAHY ==================== */}
              <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-2 font-serif">
                Provider 3: Tatiana Sharahy
              </h2>
              <p className="text-lg text-gray-500 mb-6">
                An anti-aging spa doctor billing Medicare {formatCurrency(8026454)} with COVID tests dominating 2023
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 my-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">Tatiana Sharahy, MD</h3>
                    <p className="text-purple-700 text-sm">Internal Medicine — Ridgewood, NJ • NPI: 1598889248</p>
                  </div>
                  <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">Risk: 88/100</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 block">Total Medicare Payments (10yr)</span>
                    <strong className="text-purple-800 text-lg">{formatCurrency(sharahyFraud?.total_payments || 5663224)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">2023 Payments</span>
                    <strong className="text-purple-800 text-lg">{formatCurrency(sharahyProvider.yearly_payments?.find((y: {year: number}) => y.year === 2023)?.total_payments || 5663224)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Beneficiaries</span>
                    <strong className="text-lg">{formatNumber(sharahyFraud?.total_beneficiaries || 29872)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Services per Day</span>
                    <strong className="text-purple-800">{formatNumber(sharahyFraud?.services_per_day || 1884)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Specialty Z-Score</span>
                    <strong className="text-purple-800">{sharahyFraud?.specialty_zscore || 22.88}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">COVID Test Share</span>
                    <strong className="text-purple-800">{sharahyFraud?.covid_share_pct || 96.7}%</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Unique Codes</span>
                    <strong>{sharahyFraud?.unique_codes || 34}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Markup Ratio</span>
                    <strong>{sharahyFraud?.markup_ratio || 1.31}x</strong>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Upcode Ratio</span>
                    <strong>{sharahyFraud?.upcode_ratio || 0.92}</strong>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/providers/1598889248" className="text-purple-700 hover:underline text-sm font-medium">
                    View Full Provider Profile →
                  </Link>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Yearly Billing History</h3>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Year</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Payments</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Services</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Beneficiaries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sharahyProvider.yearly_payments?.map((y: { year: number; total_payments: number; total_services: number; total_beneficiaries: number }) => (
                      <tr key={y.year} className={y.year === 2023 ? 'bg-purple-50 font-bold' : ''}>
                        <td className="px-4 py-2 border-t">{y.year}</td>
                        <td className="px-4 py-2 border-t text-right">{formatCurrency(y.total_payments)}</td>
                        <td className="px-4 py-2 border-t text-right">{formatNumber(y.total_services)}</td>
                        <td className="px-4 py-2 border-t text-right">{formatNumber(y.total_beneficiaries)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>
                The pattern is unmistakable. For nine years, Sharahy&apos;s billing was modest: between {formatCurrency(138129)} and{' '}
                {formatCurrency(356149)} per year, with roughly 1,600 to 9,200 services annually. Then in 2023:{' '}
                <strong>{formatCurrency(5663224)}</strong> from <strong>{formatNumber(471040)} services</strong> — a{' '}
                <strong>24x increase</strong> over the prior year.
              </p>
              <p>
                96.7% of that 2023 billing was COVID tests. Her services-per-day metric of{' '}
                {formatNumber(sharahyFraud?.services_per_day || 1884)} means her NPI was billing for roughly 236 services per
                hour in an 8-hour day. And her beneficiary count jumped from 26 in 2022 to 29,872 in 2023 (per our aggregated
                fraud features data) — a pattern consistent with mass-distribution COVID test billing.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Public Context</h3>
              <p>
                Sharahy is listed as Medical Director at XBody Health, Wellness & Spa in Wayne, New Jersey — described as an
                &quot;anti-aging medical center that applies futuristic, fully functional approaches to health and wellness.&quot;
                Her practice specializes in anti-aging medicine, MINT threads, carboxytherapy, and peptide treatments. She was
                recognized with &quot;Top Doctor awards in 2019 for Top Internal and Integrative Medicine Practitioner and Top
                Aesthetic Medicine Practitioner.&quot;
              </p>
              <p>
                She also bills for an unusual range of diagnostic services: 76942 (ultrasonic guidance for needle placement),
                20553 (trigger point injections), 95816 (EEG), and 95886 (nerve conduction studies). This diverse code mix,
                combined with the COVID test explosion, creates an unusual profile.
              </p>

              <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 my-6">
                <h4 className="font-semibold text-gray-900 mb-2">❓ The Questions</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Why is an anti-aging spa doctor billing millions in COVID tests?</li>
                  <li>• How does an integrative medicine practitioner also bill for EEGs and nerve conduction studies?</li>
                  <li>• Her billing jumped from {formatCurrency(235410)} to {formatCurrency(5663224)} in one year — a 24x increase</li>
                  <li>• {formatNumber(1884)} services per day as a single doctor — 236 per hour for 8 hours</li>
                  <li>• From 26 beneficiaries (2022) to nearly 30,000 (2023)?</li>
                </ul>
              </div>

              {/* ==================== WHAT THEY HAVE IN COMMON ==================== */}
              <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6 font-serif">
                What These Patterns Have in Common
              </h2>

              <div className="overflow-x-auto mb-8">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Metric</th>
                      <th className="px-4 py-3 text-center">Taheri</th>
                      <th className="px-4 py-3 text-center">Kohanzadeh</th>
                      <th className="px-4 py-3 text-center">Sharahy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2 border-t font-medium">Risk Score</td>
                      <td className="px-4 py-2 border-t text-center text-red-600 font-bold">96</td>
                      <td className="px-4 py-2 border-t text-center text-orange-600 font-bold">92</td>
                      <td className="px-4 py-2 border-t text-center text-purple-600 font-bold">88</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-t font-medium">Specialty Z-Score</td>
                      <td className="px-4 py-2 border-t text-center">23.06</td>
                      <td className="px-4 py-2 border-t text-center">27.64</td>
                      <td className="px-4 py-2 border-t text-center">22.88</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2 border-t font-medium">2023 Billing</td>
                      <td className="px-4 py-2 border-t text-center">{formatCurrency(12149038)}</td>
                      <td className="px-4 py-2 border-t text-center">{formatCurrency(14722228)}</td>
                      <td className="px-4 py-2 border-t text-center">{formatCurrency(5663224)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-t font-medium">Primary Flag</td>
                      <td className="px-4 py-2 border-t text-center">COVID tests (100%)</td>
                      <td className="px-4 py-2 border-t text-center">Wound care (90.3%)</td>
                      <td className="px-4 py-2 border-t text-center">COVID tests (96.7%)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2 border-t font-medium">Billing Explosion</td>
                      <td className="px-4 py-2 border-t text-center">$0 → $12.1M (1yr)</td>
                      <td className="px-4 py-2 border-t text-center">$19K → $14.7M (10yr)</td>
                      <td className="px-4 py-2 border-t text-center">$235K → $5.7M (1yr)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-t font-medium">Services/Day (2023)</td>
                      <td className="px-4 py-2 border-t text-center">{formatNumber(4132)}</td>
                      <td className="px-4 py-2 border-t text-center">139</td>
                      <td className="px-4 py-2 border-t text-center">{formatNumber(1884)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                All three providers share key characteristics:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li><strong>Extreme statistical outliers.</strong> All three have specialty z-scores above 22 — meaning they&apos;re
                more than 22 standard deviations above their peer median. For context, a z-score of 3 is already considered extreme in any field.</li>
                <li><strong>Sudden billing explosions.</strong> None of these patterns built gradually. They all show sharp, dramatic
                increases in billing — the kind of hockey-stick growth that raises eyebrows.</li>
                <li><strong>Billing in fraud-vulnerable categories.</strong> Two are dominated by COVID test billing. One is dominated
                by wound care. Both categories are explicitly identified by the HHS Office of Inspector General as areas
                &quot;particularly vulnerable to fraud.&quot;</li>
                <li><strong>Practice profiles that don&apos;t match billing profiles.</strong> A nurse practitioner running for
                office. A cosmetic surgeon billing wound care. An anti-aging spa doctor distributing thousands of COVID tests per day.</li>
              </ol>

              {/* ==================== WHAT HAPPENS NEXT ==================== */}
              <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6 font-serif">
                What Happens Next
              </h2>
              <p>
                Statistical flags alone don&apos;t result in enforcement actions. The typical path from data anomaly to
                investigation works like this:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li><strong>CMS data analysis</strong> identifies statistical outliers (what we&apos;ve done here, using public data)</li>
                <li><strong>HHS-OIG or DOJ</strong> investigates, often using non-public claims data, patient interviews, and medical records review</li>
                <li>If evidence supports fraud, <strong>civil or criminal charges</strong> may be filed under the False Claims Act or federal healthcare fraud statutes</li>
                <li>The <strong>False Claims Act</strong> provides for treble damages (3x the amount of false claims) plus penalties per claim</li>
                <li><strong>Whistleblowers</strong> who report fraud can receive 15–30% of recovered funds under the qui tam provisions</li>
              </ol>

              {/* Report Fraud */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">📞 Report Suspected Medicare Fraud</h3>
                <p className="text-amber-800 text-sm mb-3">
                  If you received COVID tests or medical services you never requested, or if you notice unfamiliar charges
                  on your Medicare statements, contact the OIG Fraud Hotline:
                </p>
                <p className="text-amber-900 text-lg font-bold mb-3">
                  <a href="tel:1-800-447-8477" className="underline">1-800-HHS-TIPS (1-800-447-8477)</a>
                </p>
                <p className="text-amber-800 text-sm">
                  You can also report online at{' '}
                  <a href="https://oig.hhs.gov/fraud/report-fraud/" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                    oig.hhs.gov/fraud/report-fraud
                  </a>.
                  Under the False Claims Act, whistleblowers who report fraud can receive 15–30% of recovered funds.{' '}
                  <Link href="/fraud/report" className="font-medium underline">Learn more about reporting →</Link>
                </p>
              </div>
            </div>

            {/* Final Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This article presents statistical analysis of publicly available CMS Medicare
                Provider Utilization and Payment Data. The billing patterns described are statistical flags — <strong>they are
                not accusations of fraud</strong>. Individual cases may have legitimate explanations including but not limited to:
                data aggregation under a single NPI, group practice billing, testing site operations, or other authorized
                arrangements. Named providers have not been charged with any crime unless otherwise stated. All data is publicly
                available through CMS and can be independently verified. If you have information about potential Medicare fraud,
                contact the OIG Fraud Hotline.
              </p>
            </div>

            {/* Related */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href="/investigations/arizona-wound-care-ring" className="text-medicare-primary hover:underline text-sm">🏜️ The Arizona Wound Care Ring</Link>
                <Link href="/investigations/beverly-hills-wound-care" className="text-medicare-primary hover:underline text-sm">💎 Beverly Hills Wound Care</Link>
                <Link href="/investigations/oncology-drug-pipeline" className="text-medicare-primary hover:underline text-sm">💊 The Oncology Drug Pipeline</Link>
                <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
              </div>
            </div>

            <ShareButtons
              url="https://openmedicare.vercel.app/investigations/three-providers"
              title="Three Providers, Three Red Flags"
            />

            <div className="mt-6">
              <SourceCitation
                sources={[
                  'Centers for Medicare & Medicaid Services (CMS) — Medicare Provider Utilization and Payment Data (2014–2023)',
                  'HHS Office of Inspector General (OIG) — Fraud Enforcement Reports',
                  'Department of Justice — Healthcare Fraud Enforcement Actions (2023–2025)',
                  'Provider websites and publicly available campaign information',
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
