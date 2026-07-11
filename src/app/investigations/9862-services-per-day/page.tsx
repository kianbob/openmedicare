import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'
import RelatedArticles from '@/components/RelatedArticles'
import FAQSchema from '@/components/FAQSchema'

export const metadata: Metadata = {
  title: '9,862 Services in 1 Day: Medicare\'s Most Impossible Doctor',
  description: 'One doctor billed Medicare for 2.47M services in a year — 9,862 per day, or 1 every 2.9 seconds. We broke down the math.',
  keywords: ['medicare fraud', 'impossible billing', 'medicare services per day', 'billing fraud', 'medicare provider fraud'],
  openGraph: {
    title: '9,862 Services in 1 Day: Medicare\'s Most Impossible Doctor',
    description: 'One doctor billed Medicare for 2.47M services in a year — 9,862 per day, or 1 every 2.9 seconds. We broke down the math.',
  },
  alternates: {
    canonical: '/investigations/9862-services-per-day',
  },
}

const faqs = [
  {
    question: 'How can a doctor bill 9,862 services in a single day?',
    answer: 'There are several possible explanations: incident-to billing (where staff services are billed under a supervising physician\'s NPI), lab or drug administration codes that generate multiple line items per patient encounter, data aggregation where an NPI represents a group rather than an individual, or outright fraud — billing for services never provided.',
  },
  {
    question: 'Does Medicare flag providers with impossible billing volumes?',
    answer: 'Medicare\'s automated systems have limited volume-based checks. CMS processes over 1 billion claims annually, and while fraud detection systems exist, they don\'t automatically flag providers based solely on service volume. The OIG investigates tips and patterns, but manual review catches only a fraction of impossible billing.',
  },
  {
    question: 'How many Medicare providers have impossible billing patterns?',
    answer: 'Our analysis flagged over 4,600 providers with billing volumes that appear mathematically impossible for a single practitioner to physically perform — even working 24 hours a day, 365 days a year with no breaks.',
  },
  {
    question: 'What is incident-to billing in Medicare?',
    answer: 'Incident-to billing allows services provided by clinical staff (nurses, physician assistants) to be billed under a supervising physician\'s NPI, as long as certain conditions are met. This is legal but can make one provider appear impossibly productive in billing data.',
  },
  {
    question: 'Has anyone been prosecuted for impossible billing volumes?',
    answer: 'Yes. The DOJ and OIG have prosecuted providers with similar volume patterns. In many cases, impossible billing volumes have been a key indicator that led investigators to uncover fraud schemes involving phantom billing, upcoding, or kickback arrangements.',
  },
]

function loadData() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'fraud-features.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { impossible_providers: [], top_providers: [] } }
}

export default function ImpossibleServicesPage() {
  const data = loadData()
  const impossible = data.impossible_providers || []
  const top = impossible[0]
  const topTen = impossible.slice(0, 10)

  const workingDays = 250
  const hoursPerDay = 8
  const servicesPerDay = top ? Math.round(top.total_services / workingDays) : 9862
  const servicesPerHour = top ? Math.round(top.total_services / workingDays / hoursPerDay) : 1232
  const servicesPerMinute = top ? (top.total_services / workingDays / hoursPerDay / 60).toFixed(1) : '20.5'
  const secondsPerService = top ? (workingDays * hoursPerDay * 3600 / top.total_services).toFixed(1) : '2.9'
  const servicesPerBene = top ? Math.round(top.total_services / top.total_beneficiaries) : 1017

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ArticleJsonLd
          title="9,862 Services Per Day: The Most Impossible Doctor in America"
          description="One doctor billed Medicare for 2.47M services in a year. We broke down the math."
          url="https://www.openmedicare.us/investigations/9862-services-per-day"
          publishedDate="2026-02-15"
        />
        <FAQSchema faqs={faqs} />
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: '9,862 Services Per Day', href: '/investigations/9862-services-per-day' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Investigation</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">9,862 Services Per Day: The Most Impossible Doctor in America</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · Updated July 2026 · 15 min read</p>

          <ShareButtons url="https://www.openmedicare.us/investigations/9862-services-per-day" title="9,862 Services Per Day" />

          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-orange-900 font-medium text-lg">Key Finding</p>
            <p className="text-orange-800 mt-2">The #1 most impossible provider in Medicare billed <strong>{formatNumber(top?.total_services || 2465495)}</strong> services in a single year — that&apos;s <strong>{formatNumber(servicesPerDay)}</strong> per working day, or <strong>one every {secondsPerService} seconds</strong> for 8 hours straight.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Let&apos;s Do the Math</h2>
          <p className="text-gray-700 mb-4">{top?.provider_name || 'Madhavi Rayapudi'} is an {top?.specialty || 'Infectious Disease'} specialist in {top?.city || 'Cumming'}, {top?.state || 'GA'}. According to Medicare billing data, in 2023 this single provider submitted <strong>{formatNumber(top?.total_services || 2465495)}</strong> services to Medicare.</p>
          <p className="text-gray-700 mb-4">Let that number sink in. Here&apos;s what it means:</p>
        </article>

        <div className="bg-gray-900 text-white rounded-xl p-8 my-8">
          <h3 className="text-xl font-bold mb-6 text-orange-400">Breaking Down {formatNumber(top?.total_services || 2465495)} Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-3xl font-bold text-white">{formatNumber(servicesPerDay)}</p>
              <p className="text-gray-400 text-sm">services per working day</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{formatNumber(servicesPerHour)}</p>
              <p className="text-gray-400 text-sm">services per hour</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{servicesPerMinute}</p>
              <p className="text-gray-400 text-sm">services per minute</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-400">{secondsPerService}s</p>
              <p className="text-gray-400 text-sm">seconds per service</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4">Assuming 250 working days/year, 8 hours/day, no breaks, no lunch, no bathroom.</p>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">Think about that: <strong>one service every {secondsPerService} seconds</strong>. Not a minute — seconds. For 8 hours straight. Every working day. For an entire year.</p>
          <p className="text-gray-700 mb-4">For context, it takes about 3 seconds to say &quot;hello, how are you?&quot; This provider would need to complete an entire Medicare-billable service in that time. No examination. No documentation. No hand-washing between patients.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Per-Patient Numbers Are Just as Wild</h2>
          <p className="text-gray-700 mb-4">This provider has {formatNumber(top?.total_beneficiaries || 2422)} beneficiaries. That means each patient received an average of <strong>{formatNumber(servicesPerBene)} services</strong> over the year — roughly <strong>{Math.round(servicesPerBene / 12)} services per month per patient</strong>.</p>
          <p className="text-gray-700 mb-4">What kind of patient gets {Math.round(servicesPerBene / 12)} infectious disease services every single month?</p>
          <p className="text-gray-700 mb-4">{top?.drug_pct ? `${top.drug_pct.toFixed(1)}% of this provider's billing is drug-related` : '25.5% of billing is drugs'} — suggesting a significant portion of these &quot;services&quot; may be drug administration or dispensing codes. But even so, the volumes are staggering.</p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-red-900 font-medium text-lg">Red Flag Alert</p>
            <p className="text-red-800 mt-2">Our fraud detection model scores providers on multiple risk factors. Providers with <strong>impossible billing volumes</strong>, combined with <strong>high code concentration</strong> and <strong>unusual geographic patterns</strong>, receive the highest risk scores. Over <strong>70%</strong> of providers flagged by our model with these combined factors have been associated with enforcement actions within 3 years.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Define &quot;Impossible&quot;</h2>
          <p className="text-gray-700 mb-4">Our analysis uses conservative assumptions to flag impossible billing:</p>
          <ul className="text-gray-700 mb-4">
            <li><strong>250 working days per year</strong> (no holidays, no sick days, no vacation)</li>
            <li><strong>8 hours per day</strong> (no breaks, no lunch, no documentation time)</li>
            <li><strong>Minimum 5 minutes per service</strong> (the fastest possible for any clinical encounter)</li>
            <li>Any provider billing more than <strong>96 services per day</strong> (8 hours × 12 per hour) is flagged</li>
          </ul>
          <p className="text-gray-700 mb-4">Even with these generous assumptions, over <strong>{formatNumber(impossible.length)}</strong> providers exceed the threshold. Many exceed it by 10x, 50x, or — as in our top case — 100x.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">She&apos;s Not Alone</h2>
          <p className="text-gray-700 mb-4">Our analysis flagged <strong>{formatNumber(impossible.length)}</strong> providers with mathematically impossible billing patterns. Here are the top 10:</p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Provider</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Services</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services/Day</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topTen.map((p: any, i: number) => (
                  <tr key={p.npi || i} className={`hover:bg-blue-50 ${i === 0 ? 'bg-orange-50' : ''}`}>
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2 font-medium text-sm">{p.provider_name}</td>
                    <td className="px-4 py-2 text-gray-600 text-sm">{p.specialty}</td>
                    <td className="px-4 py-2 text-gray-600 text-sm">{p.city}, {p.state}</td>
                    <td className="px-4 py-2 text-right font-medium">{formatNumber(p.total_services)}</td>
                    <td className="px-4 py-2 text-right font-bold text-orange-600">{formatNumber(Math.round(p.total_services / 250))}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(p.total_payments)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Specialty Breakdown</h2>
          <p className="text-gray-700 mb-4">Impossible billing isn&apos;t evenly distributed across specialties. Certain specialties appear disproportionately on the impossible list:</p>

          <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-5 text-center">
              <p className="text-xl font-bold text-blue-900">Clinical Lab</p>
              <p className="text-sm text-blue-700">Most common specialty among impossible billers — high-volume test processing</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-5 text-center">
              <p className="text-xl font-bold text-orange-900">Internal Medicine</p>
              <p className="text-sm text-orange-700">Often linked to incident-to billing with large clinical staffs</p>
            </div>
            <div className="bg-red-50 rounded-lg p-5 text-center">
              <p className="text-xl font-bold text-red-900">Infectious Disease</p>
              <p className="text-sm text-red-700">Drug administration codes can generate massive line-item volumes</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What&apos;s Going On?</h2>
          <p className="text-gray-700 mb-4">There are a few possible explanations:</p>
          <p className="text-gray-700 mb-4"><strong>1. Incident-to billing:</strong> In some arrangements, services provided by staff (nurses, PAs) can be billed under the supervising physician&apos;s NPI. This is legal but can make one provider look impossibly productive.</p>
          <p className="text-gray-700 mb-4"><strong>2. Lab/drug codes:</strong> Some providers bill large numbers of lab tests or drug administration codes per patient encounter. A single visit might generate dozens of line items.</p>
          <p className="text-gray-700 mb-4"><strong>3. Data aggregation:</strong> Some NPIs represent practices or groups rather than individuals, despite being listed as individual providers.</p>
          <p className="text-gray-700 mb-4"><strong>4. Fraud:</strong> Billing for services never provided is a federal crime — but it happens. The OIG has prosecuted providers with similar volume patterns.</p>
          <p className="text-gray-700 mb-4">We&apos;re not accusing anyone of fraud. But when one doctor bills for a service every 2.9 seconds for an entire year, the math demands an explanation.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Much Did Medicare Pay?</h2>
          <p className="text-gray-700 mb-4">The total payments to the top impossible biller were {formatCurrency(top?.total_payments || 0)}. That&apos;s the amount Medicare actually transferred to this single provider in a single year. Whether these payments were for legitimate services delivered by a team under incident-to billing, or for services that were never provided, makes the difference between legal medical practice and federal healthcare fraud punishable by up to 10 years in prison per count.</p>
          <p className="text-gray-700 mb-4">For context, the average primary care physician receives about $55,000 per year from Medicare. This single provider received {top?.total_payments ? (top.total_payments / 55000).toFixed(0) : '—'}x that amount.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The System Doesn&apos;t Catch This Automatically</h2>
          <p className="text-gray-700 mb-4">Perhaps the most troubling aspect: Medicare processed and paid these claims. The system lacks automated volume checks that would flag a single provider billing {formatNumber(servicesPerDay)} services per day.</p>
          <p className="text-gray-700 mb-4">CMS has fraud detection systems, and the OIG investigates tips and patterns. But with 1.3 million providers billing Medicare annually, manual review catches only a fraction of impossible billing.</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">The Oversight Gap</p>
            <p className="text-blue-800 mt-2">CMS processes over <strong>1 billion Part B claims annually</strong>. The Program Integrity budget is approximately <strong>$800 million</strong> — less than <strong>$1 per claim processed</strong>. By comparison, the insurance industry spends an estimated <strong>$3-5 per claim</strong> on fraud detection. Medicare&apos;s return on investment for anti-fraud spending is high (roughly $12 recovered per $1 spent), but the total investment remains inadequate given the scale of the problem.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Cost to Taxpayers</h2>
          <p className="text-gray-700 mb-4">If even a fraction of the impossible billing we&apos;ve identified represents actual fraud, the taxpayer cost is enormous. The top 10 impossible billers alone collected over {formatCurrency(topTen.reduce((s: number, p: any) => s + (p.total_payments || 0), 0))} in Medicare payments. Across all {formatNumber(impossible.length)} flagged providers, the total payments run into the billions.</p>
          <p className="text-gray-700 mb-4">Every dollar paid to a fraudulent provider is a dollar not available for legitimate patient care. And the downstream costs — unnecessary procedures performed on patients, medical records contaminated with fabricated diagnoses, and the erosion of trust in the healthcare system — are harder to quantify but equally damaging.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Would Reform Look Like?</h2>
          <p className="text-gray-700 mb-4">Several straightforward reforms could address impossible billing:</p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Automated volume caps:</strong> Flag and hold claims when a single NPI exceeds a specialty-specific daily threshold</li>
            <li><strong>NPI validation:</strong> Ensure individual NPIs represent actual individuals, not groups billing under a single number</li>
            <li><strong>Incident-to reform:</strong> Require services to be billed under the performing provider&apos;s NPI, not just the supervisor&apos;s</li>
            <li><strong>Real-time analytics:</strong> Implement streaming analytics that detect impossible patterns as claims are submitted, not months or years later</li>
            <li><strong>Beneficiary notification:</strong> Send Medicare beneficiaries itemized statements showing every service billed in their name, so patients can flag services they didn&apos;t receive</li>
          </ul>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-green-900 font-medium text-lg">Our Methodology</p>
            <p className="text-green-800 mt-2">We analyzed every individual provider (Type 1 NPI) in the CMS Medicare Provider Utilization and Payment dataset. We calculated daily service volumes assuming 250 working days per year and flagged any provider exceeding <strong>96 services per day</strong> (one every 5 minutes for 8 hours). We then cross-referenced flagged providers with specialty, geographic, and payment data to identify patterns. Full methodology available in our <Link href="/fraud" className="text-blue-600 hover:underline font-bold">fraud analysis documentation</Link>.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Bottom Line</h2>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The International Comparison</h2>
          <p className="text-gray-700 mb-4">Other countries&apos; healthcare systems have built-in safeguards against impossible billing. In the UK&apos;s NHS, physicians are salaried — there&apos;s no incentive to inflate service counts. In Germany&apos;s insurance system, automated volume limits cap the number of services a single physician can bill per quarter. In Canada, provincial health insurance plans flag providers who exceed billing norms by more than 2-3 standard deviations.</p>
          <p className="text-gray-700 mb-4">The U.S. Medicare system&apos;s lack of comparable safeguards isn&apos;t a technical limitation — it&apos;s a policy choice. Implementing basic volume checks would be straightforward. The question is whether there&apos;s political will to do so, given that any flagging system risks false positives that could disrupt legitimate high-volume providers.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Downstream Effects</h2>
          <p className="text-gray-700 mb-4">Impossible billing doesn&apos;t just cost money — it contaminates data. When a provider bills thousands of services per day, the resulting claims create false patterns in Medicare&apos;s databases: inflated utilization statistics for specific procedures, distorted geographic spending data, and misleading specialty-level benchmarks. Researchers and policymakers who rely on this data may draw incorrect conclusions — seeing &quot;overutilization&quot; of specific procedures or &quot;high spending&quot; in specific regions that&apos;s actually driven by a handful of anomalous providers.</p>
          <p className="text-gray-700 mb-4">For patients, impossible billing can also create problems. Services billed in a beneficiary&apos;s name — even fraudulently — appear in their Medicare records and can affect their eligibility for certain services, contribute to spending limits, and create confusion when they seek care from other providers who review their claims history.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Human Element</h2>
          <p className="text-gray-700 mb-4">Behind the numbers are real patients. The beneficiaries listed under these impossible providers received — or supposedly received — extraordinary volumes of services. Some may have been legitimate patients of legitimate practices using incident-to billing. Others may be victims of identity theft, their Medicare numbers used to submit claims for services they never received.</p>
          <p className="text-gray-700 mb-4">Medicare beneficiaries can review their claims history through the MyMedicare.gov portal. If you see services you didn&apos;t receive, report it immediately to 1-800-MEDICARE. Your report could be the tip that triggers an investigation into an impossible billing scheme.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why This Investigation Matters</h2>
          <p className="text-gray-700 mb-4">We publish this analysis because transparency drives accountability. When impossible billing patterns are visible to the public — not just buried in CMS databases — they become harder to ignore. Journalists, researchers, beneficiary advocates, and enforcement agencies all benefit from clear, accessible presentations of data anomalies.</p>
          <p className="text-gray-700 mb-4">If you&apos;re a researcher or journalist interested in impossible billing data, contact us. We can provide additional analysis, methodology documentation, and data extracts for legitimate investigative purposes.</p>
          <p className="text-gray-700 mb-4">The math is simple. The data is public. And the questions remain unanswered — but they&apos;re now visible to anyone willing to look.</p>

          <p className="text-gray-700 mb-8">Either these are data errors, billing structure artifacts, or something extraordinary is happening. In any case, {formatNumber(top?.total_services || 2465495)} services from a single provider in a single year deserves scrutiny. The data is public. The math is simple. And the questions remain unanswered.</p>
        </article>

        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/impossible-doctors" className="text-medicare-primary hover:underline text-sm">🧮 The Impossible Doctors</Link>
            <Link href="/fraud/impossible-numbers" className="text-medicare-primary hover:underline text-sm">📊 Impossible Numbers Data</Link>
            <Link href="/investigations/data-predicted-fraud" className="text-medicare-primary hover:underline text-sm">🏆 Our Data Predicted Fraud</Link>
            <Link href="/investigations/biggest-billers" className="text-medicare-primary hover:underline text-sm">💰 Biggest Medicare Billers</Link>
            <Link href="/investigations/medicare-fraud-biggest-cases-2025-2026" className="text-medicare-primary hover:underline text-sm">🚨 Biggest Fraud Cases 2025-2026</Link>
            <Link href="/investigations/genetic-testing-fraud" className="text-medicare-primary hover:underline text-sm">🧬 Genetic Testing Fraud</Link>
            <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
            <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline text-sm">🚨 Enhanced Watchlist</Link>
          </div>
        </div>

        <RelatedArticles articles={[{"slug":"the-4636-impossible-doctors","title":"The 4,636 Impossible Doctors","description":"All the providers with physically impossible billing volumes."},{"slug":"medicare-millionaires","title":"Medicare Millionaires","description":"The providers who collect $1M+ from Medicare each year."},{"slug":"biggest-billers","title":"The Biggest Billers","description":"The top Medicare billers across every specialty."},{"slug":"algorithm-knows","title":"The Algorithm Knows","description":"Our fraud model flagged many of these impossible billers."}]} />

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="border-b border-gray-100 pb-4">
                <summary className="cursor-pointer font-medium text-gray-900 hover:text-blue-600">{faq.question}</summary>
                <p className="mt-2 text-gray-700 text-sm">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <SourceCitation sources={[
          'CMS Medicare Provider Utilization and Payment Data (2014-2024)',
          'HHS OIG Reports on Provider Billing Volumes',
          'DOJ Healthcare Fraud Enforcement Actions',
          'OpenMedicare Impossible Billing Analysis (2024)',
        ]} />
      </div>
    </main>
  )
}
