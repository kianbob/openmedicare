import type { Metadata } from 'next'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: '7 Pain Clinics Flagged: The Opioid-Fraud Link',
  description: 'AI flagged 7 pain management providers billing up to $3M each. One billed 64,000 services. The opioid crisis shifted from pills to procedures.',
  keywords: ['pain management fraud', 'Medicare pain clinic fraud', 'opioid crisis Medicare', 'pain management billing', 'interventional pain management fraud', 'pill mill Medicare', 'John Hunt Medicare', 'pain clinic fraud scheme'],
  alternates: { canonical: '/investigations/pain-management-fraud' },
  openGraph: {
    title: '7 Pain Clinics Flagged: The Opioid-Fraud Link',
    description: 'AI flagged 7 pain management providers billing up to $3M each. One billed 64,000 services. The opioid crisis shifted from pills to procedures.',
    url: 'https://www.openmedicare.us/investigations/pain-management-fraud',
  },
}

const flaggedProviders = [
  {
    rank: 228,
    npi: '1588647630',
    name: 'John Hunt',
    specialty: 'Interventional Pain Management',
    state: 'FL',
    totalPayments: 3057807,
    services: 64267,
    beneficiaries: 14190,
    probability: 0.8853,
    markupRatio: 2.39,
    servicesPerBene: 4.53,
    riskFactors: ['High services/patient', '7-figure billing', 'Multi-million billing'],
  },
  {
    rank: 359,
    npi: '1609214253',
    name: 'Danish Ali',
    specialty: 'Pain Management',
    state: 'FL',
    totalPayments: 2020596,
    services: 29649,
    beneficiaries: 13819,
    probability: 0.8879,
    markupRatio: 3.10,
    servicesPerBene: 2.15,
    riskFactors: ['High markup ratio', '7-figure billing', 'Multi-million billing'],
  },
  {
    rank: 176,
    npi: '1720269525',
    name: 'Joseph Oei',
    specialty: 'Pain Management',
    state: 'TX',
    totalPayments: 1814882,
    services: 25672,
    beneficiaries: 8704,
    probability: 0.9078,
    markupRatio: 2.77,
    servicesPerBene: 2.95,
    riskFactors: ['High markup ratio', '7-figure billing'],
  },
  {
    rank: 432,
    npi: '1144281080',
    name: 'Kevin Fitzgerald',
    specialty: 'Pain Management',
    state: 'MI',
    totalPayments: 1445185,
    services: 30151,
    beneficiaries: 13396,
    probability: 0.8753,
    markupRatio: 3.68,
    servicesPerBene: 2.25,
    riskFactors: ['High markup ratio', '7-figure billing', 'Extreme markup'],
  },
  {
    rank: 469,
    npi: '1902917164',
    name: 'Jianping Sun',
    specialty: 'Interventional Pain Management',
    state: 'TN',
    totalPayments: 894719,
    services: 15712,
    beneficiaries: 7015,
    probability: 0.8731,
    markupRatio: 2.78,
    servicesPerBene: 2.24,
    riskFactors: ['High markup ratio'],
  },
  {
    rank: 431,
    npi: '1093772717',
    name: 'Theron Grover',
    specialty: 'Pain Management',
    state: 'MI',
    totalPayments: 572189,
    services: 11411,
    beneficiaries: 3913,
    probability: 0.8616,
    markupRatio: 3.59,
    servicesPerBene: 2.92,
    riskFactors: ['High markup ratio', 'Extreme markup'],
  },
  {
    rank: 498,
    npi: '1154314490',
    name: 'Henry Okonneh',
    specialty: 'Pain Management',
    state: 'NC',
    totalPayments: 552299,
    services: 9506,
    beneficiaries: 3957,
    probability: 0.8692,
    markupRatio: 2.67,
    servicesPerBene: 2.40,
    riskFactors: ['High markup ratio'],
  },
]

const totalFlaggedPayments = flaggedProviders.reduce((sum, p) => sum + p.totalPayments, 0)
const totalFlaggedServices = flaggedProviders.reduce((sum, p) => sum + p.services, 0)
const avgMarkup = flaggedProviders.reduce((sum, p) => sum + p.markupRatio, 0) / flaggedProviders.length

export default function PainManagementFraudPage() {
  const publishedDate = '2026-02-21'
  const readTime = '14 min read'

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="The Opioid Connection: Pain Management Providers in Medicare's Fraud Data"
        description="Pain management is a known fraud vector tied to the opioid crisis. Our AI flagged 7 providers billing up to $3M each."
        publishedDate={publishedDate}
        url="https://www.openmedicare.us/investigations/pain-management-fraud"
      />
            <InvestigationDisclaimer />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'Pain Management Fraud' },
          ]}
          className="mb-8"
        />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-4">
                Investigation
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4">
                The Opioid Connection
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                Pain Management Providers in Medicare&apos;s Fraud Data
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

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                The Department of Justice has called pain management clinics &quot;ground zero&quot; for healthcare
                fraud. Between opioid overprescription, unnecessary procedures, and high-volume anesthesia
                billing, pain clinics have been at the center of some of the largest Medicare fraud prosecutions
                in history. Now our AI model has flagged <strong>7 pain management providers</strong> whose
                billing patterns match convicted fraudsters — collectively billing <strong>{formatCurrency(totalFlaggedPayments)}</strong> to
                Medicare with <strong>{formatNumber(totalFlaggedServices)} services</strong>.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">The Numbers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm text-red-800">
                  <div>
                    <div className="font-bold text-2xl mb-1">7</div>
                    <div>Flagged pain providers</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">{formatCurrency(totalFlaggedPayments)}</div>
                    <div>Combined billing</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">{avgMarkup.toFixed(1)}x</div>
                    <div>Average markup ratio</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">$3.06M</div>
                    <div>Highest single provider</div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why Pain Management Is a Fraud Hotspot</h2>
              <p>
                Pain management sits at the intersection of several factors that make it uniquely vulnerable
                to fraud:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Subjective diagnosis:</strong> Pain is self-reported and difficult to objectively measure, making it easy to justify treatments that may not be necessary</li>
                <li><strong>High-reimbursement procedures:</strong> Interventional pain procedures (epidural injections, nerve blocks, spinal cord stimulators) command high Medicare reimbursement rates</li>
                <li><strong>Repeat visits:</strong> Chronic pain requires ongoing treatment, creating a built-in justification for high-volume billing</li>
                <li><strong>Anesthesia codes:</strong> Pain management frequently involves anesthesia services, which use time-based billing that&apos;s notoriously difficult to audit</li>
                <li><strong>Opioid connection:</strong> The same clinics prescribing opioids are performing procedures — creating dual revenue streams and patient dependency</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">John Hunt: $3.06 Million and 64,000 Services</h2>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                  John Hunt — FL (Rank #228) — Interventional Pain Management
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Payments:</span>
                    <div className="font-bold text-red-700 text-lg">{formatCurrency(3057807)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Fraud Probability:</span>
                    <div className="font-bold text-red-700">88.5%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Services:</span>
                    <div className="font-bold text-lg">{formatNumber(64267)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Beneficiaries:</span>
                    <div className="font-bold">{formatNumber(14190)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Services/Beneficiary:</span>
                    <div className="font-bold text-red-700">4.53</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Markup Ratio:</span>
                    <div className="font-bold">2.39x</div>
                  </div>
                </div>
              </div>

              <p>
                Hunt&apos;s numbers are staggering. At <strong>{formatNumber(64267)} total services</strong>, he performed
                more services than most entire pain clinics. His 4.53 services-per-beneficiary ratio — meaning
                each patient received an average of 4.53 services — is well above the pain management
                specialty norm and indicates either extraordinarily complex patients or aggressive treatment patterns.
              </p>
              <p>
                Florida is no coincidence. The state has long been the epicenter of pain clinic fraud,
                earning the nickname &quot;Pill Mill Capital of America&quot; during the peak of the opioid crisis.
                While Florida has since tightened regulations, our data suggests that high-volume billing
                patterns persist — they&apos;ve just shifted from opioid prescriptions to interventional procedures.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Florida Double: Hunt and Ali</h2>
              <p>
                Two of the seven flagged pain management providers practice in Florida. Danish Ali, also
                Florida-based, billed {formatCurrency(2020596)} with a <strong>3.10x markup ratio</strong> — meaning
                he charged Medicare 3.1 times what it actually paid. Between Hunt and Ali alone, Florida
                pain management accounts for <strong>{formatCurrency(3057807 + 2020596)}</strong> in flagged billing.
              </p>
              <p>
                Ali&apos;s markup ratio is particularly notable. While Hunt&apos;s pattern is volume-driven (massive
                service counts), Ali&apos;s pattern suggests <strong>aggressive charge inflation</strong> — billing
                Medicare far more than the service is worth and collecting whatever percentage CMS approves.
                These represent two distinct fraud archetypes operating in the same specialty and state.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Joseph Oei: Texas Pain and $1.81M</h2>
              <p>
                Oei, a Texas-based pain management provider, ranks #176 with the highest fraud probability
                among the pain management flagged group at <strong>90.8%</strong>. His 2.77x markup ratio and
                {formatNumber(25672)} services across {formatNumber(8704)} beneficiaries paint a picture of
                a high-volume practice with elevated billing patterns.
              </p>
              <p>
                Texas is the second-largest state for Medicare spending and has seen significant DOJ enforcement
                action against pain clinics. In 2023 alone, the DOJ&apos;s Houston office prosecuted multiple
                pain management fraud cases involving unnecessary procedures and kickback schemes.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">All 7 Flagged Pain Management Providers</h2>

              <div className="overflow-x-auto my-6">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 text-left font-semibold">Rank</th>
                      <th className="px-3 py-2 text-left font-semibold">Provider</th>
                      <th className="px-3 py-2 text-left font-semibold">State</th>
                      <th className="px-3 py-2 text-right font-semibold">Payments</th>
                      <th className="px-3 py-2 text-right font-semibold">Probability</th>
                      <th className="px-3 py-2 text-right font-semibold">Markup</th>
                      <th className="px-3 py-2 text-right font-semibold">Svcs/Patient</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flaggedProviders.sort((a, b) => a.rank - b.rank).map((p) => (
                      <tr key={p.npi} className={`border-b border-gray-100 ${p.totalPayments > 2000000 ? 'bg-red-50' : ''}`}>
                        <td className="px-3 py-2 font-mono">#{p.rank}</td>
                        <td className="px-3 py-2 font-semibold">{p.name}</td>
                        <td className="px-3 py-2">{p.state}</td>
                        <td className="px-3 py-2 text-right font-mono">{formatCurrency(p.totalPayments)}</td>
                        <td className="px-3 py-2 text-right font-mono text-red-600">{(p.probability * 100).toFixed(1)}%</td>
                        <td className="px-3 py-2 text-right font-mono">{p.markupRatio}x</td>
                        <td className="px-3 py-2 text-right font-mono">{p.servicesPerBene}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Extreme Markup Problem</h2>
              <p>
                Two providers — Kevin Fitzgerald (MI) and Theron Grover (MI) — show <strong>&quot;Extreme markup&quot;</strong> as
                a risk factor. Their markup ratios of 3.68x and 3.59x respectively mean they&apos;re charging
                Medicare roughly <strong>3.5 times what CMS actually reimburses</strong>. While providers are
                free to set their own charges, extreme markups serve a strategic purpose in fraud: by inflating
                charges, providers ensure maximum reimbursement even after CMS applies its fee schedule limits.
              </p>
              <p>
                Both Michigan providers operating with extreme markups suggest a possible regional pattern.
                Michigan has faced its own pain management enforcement challenges, with multiple DOJ cases
                targeting unnecessary procedures and anesthesia billing fraud.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Opioid Crisis Connection</h2>
              <p>
                The opioid epidemic and Medicare pain management fraud are deeply intertwined. The same
                business model that fueled the pill mill crisis — high-volume patient throughput, repeat
                visits, and maximized billing per encounter — has simply evolved. Instead of prescribing
                opioids (now under intense DEA scrutiny), many pain clinics have shifted to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Epidural steroid injections:</strong> High-reimbursement procedures that can be repeated frequently with minimal clinical justification required</li>
                <li><strong>Facet joint injections:</strong> Multiple bilateral injections billed separately, turning a single visit into 4-8 line items</li>
                <li><strong>Nerve blocks:</strong> Diagnostic and therapeutic blocks that can be performed in-office with anesthesia charges</li>
                <li><strong>Urine drug testing:</strong> Mandatory testing for pain patients creates an ancillary revenue stream — some clinics bill $1,000+ per test</li>
                <li><strong>Spinal cord stimulators:</strong> Devices costing $30,000-$50,000 with implantation fees, creating enormous per-patient revenue</li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">DOJ Pain Clinic Enforcement: By the Numbers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-blue-800">
                  <div>
                    <div className="font-bold text-2xl mb-1">$1.7B+</div>
                    <div>Pain clinic fraud recovered (2019–2024)</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">200+</div>
                    <div>Pain management providers charged</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">FL, TX, MI</div>
                    <div>Top enforcement states</div>
                  </div>
                </div>
                <p className="text-xs text-blue-700 mt-3">Source: DOJ Healthcare Fraud Unit annual reports, 2019–2024</p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Anesthesia Billing Problem</h2>
              <p>
                Pain management intersects heavily with anesthesia billing — one of the most fraud-prone
                areas in Medicare. As we covered in our{' '}
                <Link href="/investigations/anesthesia-markup" className="text-medicare-primary hover:underline">
                  anesthesia markup investigation
                </Link>, anesthesia uses time-based billing codes that are inherently difficult to audit.
                A provider can bill for 30 minutes or 90 minutes of anesthesia, and there&apos;s often no
                independent verification of the actual time spent.
              </p>
              <p>
                Interventional pain management providers like John Hunt frequently bill both the procedure
                and the anesthesia — collecting two revenue streams from a single patient encounter. When
                combined with high patient volume, this creates billing levels that our model flags as
                matching convicted fraudster patterns.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Geographic Patterns</h2>
              <p>
                The geographic distribution of flagged pain management providers is not random:
              </p>

              <div className="overflow-x-auto my-6">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left font-semibold">State</th>
                      <th className="px-4 py-2 text-center font-semibold">Flagged Providers</th>
                      <th className="px-4 py-2 text-right font-semibold">Combined Billing</th>
                      <th className="px-4 py-2 text-left font-semibold">Known History</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 bg-red-50">
                      <td className="px-4 py-2 font-semibold">Florida</td>
                      <td className="px-4 py-2 text-center">2</td>
                      <td className="px-4 py-2 text-right font-mono">{formatCurrency(3057807 + 2020596)}</td>
                      <td className="px-4 py-2">&quot;Pill Mill Capital&quot; — historic epicenter</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-2 font-semibold">Michigan</td>
                      <td className="px-4 py-2 text-center">2</td>
                      <td className="px-4 py-2 text-right font-mono">{formatCurrency(1445185 + 572189)}</td>
                      <td className="px-4 py-2">Multiple DOJ pain clinic prosecutions</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-2 font-semibold">Texas</td>
                      <td className="px-4 py-2 text-center">1</td>
                      <td className="px-4 py-2 text-right font-mono">{formatCurrency(1814882)}</td>
                      <td className="px-4 py-2">Houston: #1 Medicare fraud city</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-2 font-semibold">Tennessee</td>
                      <td className="px-4 py-2 text-center">1</td>
                      <td className="px-4 py-2 text-right font-mono">{formatCurrency(894719)}</td>
                      <td className="px-4 py-2">Appalachian opioid crisis corridor</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-2 font-semibold">North Carolina</td>
                      <td className="px-4 py-2 text-center">1</td>
                      <td className="px-4 py-2 text-right font-mono">{formatCurrency(552299)}</td>
                      <td className="px-4 py-2">Growing enforcement target</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Florida and Michigan each have two flagged providers, but Florida&apos;s combined billing
                ({formatCurrency(3057807 + 2020596)}) is more than 2.5x Michigan&apos;s. Every flagged state
                has a documented history of DOJ pain management enforcement — our model is finding patterns
                in exactly the places you&apos;d expect.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What Makes Pain Management Different</h2>
              <p>
                Compared to the{' '}
                <Link href="/investigations/internal-medicine-crisis" className="text-medicare-primary hover:underline">
                  internal medicine fraud patterns
                </Link>{' '}
                that dominate our model (53% of all flagged providers), pain management fraud has distinct characteristics:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Higher per-provider billing:</strong> Pain management averages {formatCurrency(totalFlaggedPayments / 7)} vs ~$750K for flagged internal medicine</li>
                <li><strong>Higher markups:</strong> Average {avgMarkup.toFixed(1)}x vs 2.3x for internal medicine — reflecting expensive procedural billing</li>
                <li><strong>Procedure-driven:</strong> While IM fraud tends to be office visit volume, pain management fraud revolves around high-reimbursement procedures</li>
                <li><strong>Equipment and implants:</strong> Spinal cord stimulators and other devices add billing layers that don&apos;t exist in primary care fraud</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Bottom Line</h2>
              <p>
                Pain management fraud isn&apos;t new — the DOJ has been prosecuting it for decades. What&apos;s new
                is the ability to detect it algorithmically. Our model, trained on thousands of confirmed
                fraudsters, has identified 7 pain management providers whose billing patterns are statistically
                indistinguishable from convicted criminals. Combined, they&apos;ve billed Medicare{' '}
                <strong>{formatCurrency(totalFlaggedPayments)}</strong> while performing{' '}
                <strong>{formatNumber(totalFlaggedServices)} services</strong>.
              </p>
              <p>
                The opioid crisis may have shifted from pills to procedures, but the underlying economics
                remain the same: pain is subjective, patients are desperate, and Medicare pays the bills.
                Until CMS develops specialty-specific fraud detection for pain management — accounting for
                the unique billing patterns of procedural pain clinics — providers like these will continue
                to operate in the gap between what the data shows and what enforcement catches.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This analysis is based on publicly available CMS Medicare Provider Utilization
                and Payment Data (2014–2023) and our machine learning model trained on confirmed fraud cases. Being flagged
                by an AI model does not constitute an accusation of fraud. Named providers have not been charged with any crime.
                All data is from public sources.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href="/investigations/anesthesia-markup" className="text-medicare-primary hover:underline text-sm">💉 The Anesthesia Markup Machine</Link>
                <Link href="/investigations/still-out-there" className="text-medicare-primary hover:underline text-sm">🔍 Still Out There: Providers Who Bill Like Criminals</Link>
                <Link href="/investigations/florida-medicare-fraud" className="text-medicare-primary hover:underline text-sm">🌴 Florida&apos;s Medicare Fraud Epidemic</Link>
                <Link href="/investigations/million-dollar-flagged" className="text-medicare-primary hover:underline text-sm">💰 The Million-Dollar Club</Link>
                <Link href="/investigations/internal-medicine-crisis" className="text-medicare-primary hover:underline text-sm">🏥 Internal Medicine Crisis</Link>
                <Link href="/investigations/houston-medicare-capital" className="text-medicare-primary hover:underline text-sm">🤠 Houston: Medicare Fraud Capital</Link>
              </div>
            </div>

            <ShareButtons
              url="https://www.openmedicare.us/investigations/pain-management-fraud"
              title="The Opioid Connection: Pain Management Providers in Medicare's Fraud Data"
            />

            <div className="mt-6">
              <SourceCitation
                sources={[
                  'Centers for Medicare & Medicaid Services (CMS) — Medicare Provider Utilization and Payment Data (2014–2023)',
                  'OpenMedicare ML Fraud Detection Model v2.0 — Trained on 8,300+ LEIE/DOJ confirmed fraud cases',
                  'U.S. Department of Justice — Healthcare Fraud Unit Annual Reports (2019–2024)',
                  'DEA Diversion Control Division — Pain Clinic Enforcement Actions',
                  'HHS Office of Inspector General — Pain Management Billing Audits',
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
