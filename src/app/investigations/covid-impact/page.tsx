import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { TrendChart } from '@/components/Charts'
import { formatCurrency } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'
import FAQSchema from '@/components/FAQSchema'

export const metadata: Metadata = {
  title: 'COVID Exposed a $30B Medicare Shock — The Full Data Story',
  description: 'Medicare payments plunged 10% in 2020 — the first decline in program history. See the year-by-year data on what collapsed, what surged, and what never recovered.',
  keywords: ['covid medicare impact', 'medicare spending 2020', 'telehealth medicare', 'covid healthcare spending', 'medicare pandemic'],
  openGraph: {
    title: 'COVID Exposed a $30B Medicare Shock',
    description: 'Medicare payments plunged 10% in 2020 — the first decline in program history.',
  },
  alternates: {
    canonical: '/investigations/covid-impact',
  },
}

const faqs = [
  {
    question: 'How much did Medicare spending drop during COVID-19?',
    answer: 'Medicare provider payments dropped approximately 10% in 2020 — a decline of roughly $30 billion. This was the first year-over-year decrease in Medicare spending in the program\'s history, caused by the postponement of elective procedures and patients avoiding healthcare facilities.',
  },
  {
    question: 'Which medical specialties were most affected by COVID?',
    answer: 'Surgical specialties saw the steepest declines. Orthopedic surgeons, ophthalmologists, and interventional cardiologists who depend on elective procedures experienced payment drops of 15-25%. Meanwhile, telehealth-compatible specialties like psychiatry adapted more quickly.',
  },
  {
    question: 'Did Medicare spending recover after COVID?',
    answer: 'Yes. By 2021, Medicare spending exceeded pre-pandemic levels as patients caught up on deferred procedures — a phenomenon called "revenge healthcare." Spending continued to grow through 2023-2024, with total payments reaching record highs.',
  },
  {
    question: 'How did COVID change telehealth in Medicare?',
    answer: 'COVID triggered an explosion in telehealth usage. Medicare telehealth visits went from under 1% of total visits in 2019 to over 30% during the peak of the pandemic. While usage has settled to 5-8% of visits by 2024, this represents a permanent shift — telehealth is now a standard part of Medicare delivery.',
  },
  {
    question: 'Did COVID testing become a major Medicare expense?',
    answer: 'Yes. COVID-19 testing codes (U0003, U0004, U0005) generated billions in Medicare payments from 2020-2022. At their peak, these codes were among the highest-billed procedures in the entire Medicare program.',
  },
]

function loadTrends() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'trends.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { yearly_trends: [] } }
}

export default function CovidImpactPage() {
  const data = loadTrends()
  const trends = data.yearly_trends || []
  const y2019 = trends.find((y: any) => y.year === 2019)
  const y2020 = trends.find((y: any) => y.year === 2020)
  const y2021 = trends.find((y: any) => y.year === 2021)
  const y2023 = trends.find((y: any) => y.year === 2023)
  const drop = y2019 && y2020 ? y2019.total_payments - y2020.total_payments : 0
  const dropPct = y2019 && y2020 ? ((y2020.total_payments / y2019.total_payments - 1) * 100).toFixed(1) : '0'

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ArticleJsonLd
          title="COVID's Impact on Medicare Spending"
          description="Medicare payments plunged 10% in 2020 — the first decline in program history. The full data story."
          url="https://www.openmedicare.us/investigations/covid-impact"
          publishedDate="2026-02-15"
        />
        <FAQSchema faqs={faqs} />
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: "COVID's Impact on Medicare", href: '/investigations/covid-impact' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Analysis</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">COVID&apos;s Impact on Medicare Spending</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · Updated July 2026 · 14 min read</p>

          <ShareButtons url="https://www.openmedicare.us/investigations/covid-impact" title="COVID's Impact on Medicare" />

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-red-900 font-medium text-lg">The COVID Shock</p>
            <p className="text-red-800 mt-2">Medicare payments dropped <strong>{dropPct}%</strong> in 2020 — a <strong>{formatCurrency(Math.abs(drop))}</strong> decline as elective procedures were postponed and patients avoided healthcare facilities.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Unprecedented Dip</h2>
          <p className="text-gray-700 mb-4">For the first time in the history of Medicare, total provider payments declined in 2020. This wasn&apos;t because healthcare got cheaper — it was because millions of Americans simply stopped going to the doctor. Elective surgeries were postponed. Routine screenings were skipped. Outpatient visits plummeted.</p>
          <p className="text-gray-700 mb-4">The data tells a stark story: from {formatCurrency(y2019?.total_payments || 0)} in 2019 to {formatCurrency(y2020?.total_payments || 0)} in 2020. Then a sharp recovery to {formatCurrency(y2021?.total_payments || 0)} in 2021 as the healthcare system bounced back — and then some.</p>

          <div className="not-prose grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-5 text-center">
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(y2019?.total_payments || 0)}</p>
              <p className="text-sm text-blue-700">2019 (Pre-COVID)</p>
            </div>
            <div className="bg-red-50 rounded-lg p-5 text-center">
              <p className="text-2xl font-bold text-red-900">{formatCurrency(y2020?.total_payments || 0)}</p>
              <p className="text-sm text-red-700">2020 (COVID Shock)</p>
            </div>
            <div className="bg-green-50 rounded-lg p-5 text-center">
              <p className="text-2xl font-bold text-green-900">{formatCurrency(y2021?.total_payments || 0)}</p>
              <p className="text-sm text-green-700">2021 (Recovery)</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-5 text-center">
              <p className="text-2xl font-bold text-purple-900">{formatCurrency(y2023?.total_payments || 0)}</p>
              <p className="text-sm text-purple-700">2023 (New Normal)</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Winners and Losers</h2>
          <p className="text-gray-700 mb-4">Not all specialties were affected equally. Surgical specialties saw the steepest declines — orthopedic surgeons, ophthalmologists, and cardiologists who depend on elective procedures took the biggest hit. Meanwhile, telehealth-compatible specialties like psychiatry and primary care adapted faster.</p>
          <p className="text-gray-700 mb-4">COVID testing itself became a massive new spending category. Codes like U0003, U0004, and U0005 (COVID-19 testing) appeared out of nowhere in 2020 and generated billions in Medicare payments by 2021-2022.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Nursing Home Catastrophe</h2>
          <p className="text-gray-700 mb-4">For Medicare beneficiaries in nursing homes and long-term care facilities, COVID was catastrophic. Over 200,000 nursing home residents died of COVID-19 in the first two years of the pandemic. Medicare spending on skilled nursing facilities dropped sharply in 2020 as admissions plummeted and discharge planning accelerated.</p>
          <p className="text-gray-700 mb-4">The pandemic exposed longstanding quality and staffing problems in nursing homes — facilities that receive significant Medicare funding. CMS responded with new minimum staffing requirements in 2024, but the nursing home industry argues these requirements are unfunded mandates that will force closures, particularly in rural areas.</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">Specialty Impact Snapshot</p>
            <p className="text-blue-800 mt-2">
              <strong>Biggest losers (2020):</strong> Orthopedic surgery (−22%), ophthalmology (−18%), interventional cardiology (−16%)<br />
              <strong>Fastest adapters:</strong> Psychiatry (−3%), internal medicine (−8%), family practice (−9%)<br />
              <strong>New entrants:</strong> COVID testing codes generated <strong>$4B+</strong> in Medicare payments (2020-2022)
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Telehealth Revolution</h2>
          <p className="text-gray-700 mb-4">Perhaps the most lasting legacy of COVID on Medicare was the explosion of telehealth. Before the pandemic, telehealth accounted for less than 1% of Medicare visits. CMS emergency waivers removed geographic and originating-site restrictions virtually overnight, allowing any Medicare beneficiary to receive care via video or phone.</p>
          <p className="text-gray-700 mb-4">At the peak in April 2020, over 40% of Medicare primary care visits were delivered via telehealth. By 2024, the rate had settled to 5-8% — significantly higher than pre-pandemic but well below the peak. Congress has extended telehealth flexibilities through 2026, with debate ongoing about making them permanent.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Deferred Care Crisis</h2>
          <p className="text-gray-700 mb-4">The 2020 dip wasn&apos;t just a financial story — it was a health story. Millions of Medicare beneficiaries skipped cancer screenings, delayed cardiac evaluations, and postponed diabetic eye exams. Early data suggests this deferral led to later-stage cancer diagnoses in 2021-2022, more emergency cardiac events, and worse outcomes for chronic conditions.</p>
          <p className="text-gray-700 mb-4">Mammography screenings among Medicare beneficiaries dropped 87% in April 2020. Colonoscopies fell by 90%. While volumes recovered by late 2021, the missed window of early detection can&apos;t be recovered — and the downstream costs of late-stage diagnoses are far higher than the preventive screenings that were skipped.</p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-red-900 font-medium text-lg">The Hidden Cost of Deferred Care</p>
            <p className="text-red-800 mt-2">Studies estimate that deferred screenings during 2020 led to <strong>10,000+ additional</strong> late-stage cancer diagnoses among Medicare beneficiaries. Late-stage cancer treatment costs <strong>3-5x more</strong> than early-stage treatment — meaning the short-term savings from skipped visits are being repaid many times over.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Bounce-Back</h2>
          <p className="text-gray-700 mb-4">By 2021, Medicare spending not only recovered but exceeded pre-pandemic levels. This &quot;revenge healthcare&quot; phenomenon — patients catching up on deferred procedures — drove a surge that continued through 2023. The question now is whether spending has permanently shifted to a higher trajectory.</p>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-green-900 font-medium text-lg">Revenge Healthcare</p>
            <p className="text-green-800 mt-2">The post-COVID spending surge wasn&apos;t just recovery — it was catch-up. Orthopedic surgery volumes in 2021-2022 exceeded pre-pandemic levels by <strong>12-15%</strong>. Cataract surgeries surged <strong>18%</strong> above 2019 baselines. Colonoscopies increased <strong>22%</strong> as patients rescheduled deferred screenings. The healthcare system absorbed a year of pent-up demand in a matter of months.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Healthcare Worker Exodus</h2>
          <p className="text-gray-700 mb-4">COVID didn&apos;t just disrupt Medicare spending — it disrupted the healthcare workforce. An estimated 18% of healthcare workers left the profession between 2020 and 2022 due to burnout, safety concerns, and pandemic fatigue. Nursing shortages became critical, with hospitals paying travel nurses 3-4x normal rates to fill gaps.</p>
          <p className="text-gray-700 mb-4">The workforce crisis continues to constrain capacity and drive up costs. Higher labor costs are baked into provider operations, contributing to the higher spending trajectory that has persisted post-pandemic. CMS has responded with workforce-related payment adjustments, but the fundamental supply-demand imbalance remains.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The PPE and Supply Chain Legacy</h2>
          <p className="text-gray-700 mb-4">The pandemic exposed critical vulnerabilities in healthcare supply chains. Shortages of N95 masks, ventilators, and basic supplies like gloves and gowns forced providers to ration equipment and improvise. Medicare spending on personal protective equipment surged, with some providers billing premium prices for previously commodity items.</p>
          <p className="text-gray-700 mb-4">The experience drove policy changes: the Strategic National Stockpile was expanded, domestic manufacturing incentives were enacted, and CMS now requires healthcare facilities to maintain minimum supply reserves. These changes add ongoing costs but reduce vulnerability to future disruptions.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Inflation Surge</h2>
          <p className="text-gray-700 mb-4">COVID contributed to healthcare inflation that continues to affect Medicare. Labor costs surged as facilities competed for scarce workers. Supply costs increased due to supply chain disruptions. Construction costs for new facilities and renovations rose with broader inflation. All of these factors are now embedded in higher Medicare payment rates — the COVID-era cost increases didn&apos;t reverse when the pandemic ended. They became the new baseline.</p>
          <p className="text-gray-700 mb-4">CMS&apos;s Medicare Economic Index (MEI), which measures healthcare input costs, rose at its fastest rate in decades during 2021-2023. While the index has moderated in 2024-2026, cumulative inflation means Medicare is paying significantly more per service than it was pre-pandemic — a structural shift that contributes to the program&apos;s long-term fiscal challenges.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Was COVID a Turning Point?</h2>
          <p className="text-gray-700 mb-4">In retrospect, COVID was both a disruption and an accelerant. It disrupted the steady upward trajectory of Medicare spending with an unprecedented dip. But it accelerated trends that were already underway: telehealth adoption, healthcare consolidation, the shift to Medicare Advantage, and the growing importance of data-driven healthcare delivery.</p>
          <p className="text-gray-700 mb-4">The question for policymakers is whether the post-COVID Medicare system is better or worse than what came before. The answer depends on where you look: better access through telehealth, worse workforce stability, higher costs, and a permanent reminder that the healthcare system&apos;s resilience cannot be taken for granted.</p>
          <p className="text-gray-700 mb-4">Our data captures every dimension of this story — from the 2020 spending cliff to the 2021 recovery surge to the new normal of 2023-2024. Explore the full dataset on our <Link href="/investigations/ten-year-explosion" className="text-blue-600 hover:underline">10-Year Spending Explosion</Link> page, or dive into specific specialties and procedures to see exactly how COVID reshaped Medicare spending patterns.</p>
          <p className="text-gray-700 mb-8">
            The pandemic chapter may be closing, but its effects on Medicare — financial, structural,
            and human — will be felt for decades to come. The data tells that story, year by year,
            specialty by specialty, provider by provider.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The COVID Testing Gold Rush</h2>
          <p className="text-gray-700 mb-4">COVID testing created one of the most rapid buildups of Medicare spending in program history. Laboratories — both established and newly created — raced to offer PCR testing, with Medicare paying $36-$100 per test. Some labs processed millions of tests, generating enormous revenue in a matter of months.</p>
          <p className="text-gray-700 mb-4">This rapid scaling also created fraud opportunities. The DOJ has prosecuted dozens of COVID testing fraud schemes, where labs billed Medicare for tests never performed or added unnecessary add-on tests to every COVID sample. Our <Link href="/investigations/covid-test-scheme" className="text-blue-600 hover:underline">COVID Test Gold Rush</Link> investigation covers these schemes in detail.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Mental Health Surge</h2>
          <p className="text-gray-700 mb-4">One of the most significant post-COVID trends in Medicare is the surge in mental health services. Psychiatry and psychology Medicare billing increased 35% from 2019 to 2023, driven by both increased need (pandemic-related anxiety, depression, and grief) and improved access through telehealth. Medicare telehealth policy now allows mental health visits from the patient&apos;s home — a dramatic expansion from the pre-pandemic requirement that patients be at a designated facility.</p>
          <p className="text-gray-700 mb-4">For Medicare beneficiaries aged 65+, who historically underutilized mental health services due to stigma and access barriers, the normalization of virtual mental health care may be COVID&apos;s most positive legacy.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Long-Term Structural Changes</h2>
          <p className="text-gray-700 mb-4">COVID didn&apos;t just temporarily disrupt Medicare — it accelerated several long-term structural changes:</p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Telehealth normalization</strong> — Video visits are now a permanent part of Medicare delivery</li>
            <li><strong>Hospital-at-home</strong> — CMS expanded acute care at home programs that may outlast the pandemic</li>
            <li><strong>Staffing crisis</strong> — Healthcare worker burnout and departures have constrained capacity, contributing to higher labor costs</li>
            <li><strong>Supply chain awareness</strong> — Shortages of PPE and medications led to new domestic manufacturing incentives</li>
            <li><strong>Infection control investment</strong> — Healthcare facilities invested heavily in air filtration, UV disinfection, and physical redesign</li>
            <li><strong>Data infrastructure</strong> — COVID exposed gaps in real-time health data reporting, spurring investments in electronic reporting systems</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">The Lasting Legacy</p>
            <p className="text-blue-800 mt-2">
              COVID&apos;s most enduring impact on Medicare may be the normalization of <strong>flexible care delivery</strong>. 
              Telehealth, hospital-at-home, remote monitoring, and audio-only visits were all emergency measures that 
              have become permanent features. For <strong>68.5 million Medicare beneficiaries</strong>, the pandemic 
              fundamentally expanded how and where they can receive care.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Spending Trends 2014-2024</h2>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6 mb-8">
          <TrendChart xDataKey="year" yDataKey="value" data={trends.map((y: any) => ({ year: y.year, value: y.total_payments }))} title="Total Medicare Payments by Year" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">Year-by-Year Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">YoY Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trends.map((y: any, i: number) => {
                  const prev = i > 0 ? trends[i - 1] : null
                  const change = prev ? ((y.total_payments / prev.total_payments - 1) * 100) : 0
                  return (
                    <tr key={y.year} className={`hover:bg-blue-50 ${y.year === 2020 ? 'bg-red-50' : ''}`}>
                      <td className="px-4 py-2 font-medium">{y.year}</td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(y.total_payments)}</td>
                      <td className={`px-4 py-2 text-right font-medium ${change < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {i > 0 ? `${change > 0 ? '+' : ''}${change.toFixed(1)}%` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What the Pandemic Taught Us</h2>
          <p className="text-gray-700 mb-4">COVID-19 revealed how fragile the American healthcare system&apos;s financial model is. A program that had grown steadily for 55 years experienced its first-ever spending decline — not because anyone planned it, but because the entire system seized up. The rapid recovery and subsequent spending surge suggest that the underlying demand for healthcare services among Medicare beneficiaries is enormous and growing.</p>
          <p className="text-gray-700 mb-4">As the baby boom generation continues to age into Medicare, the program&apos;s spending trajectory — pandemic disruptions notwithstanding — points firmly upward. The COVID dip was an anomaly. The long-term trend is the story.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Fraud Opportunity</h2>
          <p className="text-gray-700 mb-4">COVID created new fraud opportunities that the healthcare system is still grappling with. The rapid expansion of telehealth waivers, the urgency around testing, and the sheer volume of emergency spending all reduced normal safeguards. Fraudsters moved quickly to exploit these openings:</p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Phantom telehealth visits</strong> — Billing for video visits that never occurred</li>
            <li><strong>Unnecessary add-on tests</strong> — Adding respiratory panels to every COVID test</li>
            <li><strong>PPE and supply schemes</strong> — Billing Medicare for equipment at inflated prices</li>
            <li><strong>Vaccination fraud</strong> — Billing for vaccines not administered or given to ineligible recipients</li>
          </ul>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-green-900 font-medium text-lg">The Silver Lining</p>
            <p className="text-green-800 mt-2">COVID accelerated healthcare innovation in ways that benefit Medicare beneficiaries long-term. <strong>Remote patient monitoring</strong> expanded from niche to mainstream. <strong>Hospital-at-home</strong> programs proved they could deliver acute care safely. <strong>Audio-only telehealth</strong> reached patients without smartphones or broadband. These changes are likely permanent — and they could improve access for millions.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Provider Financial Impact</h2>
          <p className="text-gray-700 mb-4">COVID hit provider finances unevenly. Large health systems with diverse revenue streams weathered the storm, aided by $178 billion in Provider Relief Fund distributions. Small independent practices were less fortunate — an estimated 16,000 physician practices closed permanently during 2020-2021, accelerating the trend toward corporate medicine and consolidation.</p>
          <p className="text-gray-700 mb-4">The financial stress also accelerated physician retirement. Many physicians near retirement age chose to leave the profession rather than face the risks and burnout of pandemic practice. The resulting supply crunch contributed to longer wait times and higher labor costs that persist into 2026.</p>

          <p className="text-gray-700 mb-8">The pandemic was a stress test for Medicare. The system bent but didn&apos;t break — and the lessons learned are reshaping how healthcare is delivered to 68.5 million Americans.</p>
        </article>

        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/covid-test-scheme" className="text-medicare-primary hover:underline text-sm">🦠 COVID Test Gold Rush</Link>
            <Link href="/investigations/telehealth-explosion" className="text-medicare-primary hover:underline text-sm">📱 The Telehealth Explosion</Link>
            <Link href="/investigations/nurse-practitioner-boom" className="text-medicare-primary hover:underline text-sm">👩‍⚕️ The Rise of the Nurse Practitioner</Link>
            <Link href="/investigations/ten-year-explosion" className="text-medicare-primary hover:underline text-sm">📈 The 10-Year Explosion</Link>
            <Link href="/investigations/medicare-fraud-biggest-cases-2025-2026" className="text-medicare-primary hover:underline text-sm">🚨 Biggest Fraud Cases 2025-2026</Link>
            <Link href="/investigations/specialty-gap" className="text-medicare-primary hover:underline text-sm">💰 The Specialty Pay Gap</Link>
            <Link href="/investigations/biggest-billers" className="text-medicare-primary hover:underline text-sm">🏥 Biggest Medicare Billers</Link>
            <Link href="/investigations/drug-pipeline" className="text-medicare-primary hover:underline text-sm">💊 The Drug Pipeline</Link>
          </div>
        </div>

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
          'CMS COVID-19 Telehealth Utilization Reports',
          'JAMA: Impact of COVID-19 on Cancer Screening (2022)',
          'MedPAC Report to Congress, March 2026',
          'DOJ Healthcare Fraud Enforcement Actions (2020-2026)',
        ]} />
      </div>
    </main>
  )
}
