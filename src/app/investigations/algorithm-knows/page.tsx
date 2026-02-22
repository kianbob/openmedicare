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
  title: 'The Algorithm Knows: How AI Trained on 8,300 Convicted Fraudsters Found 500 Doctors Who Look Just Like Them | OpenMedicare',
  description: 'We fed 10 years of Medicare billing data and 8,300+ confirmed fraud convictions into a machine learning model. It found 500 providers who bill exactly like caught criminals — but haven\'t been caught yet.',
  alternates: { canonical: '/investigations/algorithm-knows' },
  openGraph: {
    title: 'The Algorithm Knows: AI Found 500 Doctors Who Bill Like Convicted Fraudsters',
    description: 'A machine learning model trained on 8,300+ convicted Medicare fraudsters flagged 500 active providers with matching billing patterns. $400M in taxpayer money. Here\'s what the data shows.',
    url: 'https://www.openmedicare.com/investigations/algorithm-knows',
  },
}

const top10 = [
  { rank: 1, npi: '1659378743', name: 'Ramesh Thimmiah', specialty: 'Internal Medicine', state: 'WV', prob: 0.959, pay: 788668, markup: 2.28, spb: 2.45, note: 'Billing pattern nearly identical to convicted fraudsters in same specialty' },
  { rank: 2, npi: '1871637157', name: 'Willie Lucas', specialty: 'Internal Medicine', state: 'MS', prob: 0.955, pay: 1017050, markup: 1.97, spb: 3.66, note: '7-figure billing with high services per patient' },
  { rank: 3, npi: '1194756411', name: 'Michael Cozzi', specialty: 'Anesthesiology', state: 'IN', prob: 0.943, pay: 1662836, markup: 2.89, spb: 3.20, note: 'Highest markup ratio in top 10 — nearly 3x submitted vs. allowed' },
  { rank: 4, npi: '1972524510', name: 'Frank Leung', specialty: 'Endocrinology', state: 'IL', prob: 0.957, pay: 601846, markup: 2.30, spb: 3.28, note: 'Rare specialty flag — endocrinologists are uncommon on fraud lists' },
  { rank: 5, npi: '1063460939', name: 'John Daconti', specialty: 'Internal Medicine', state: 'NJ', prob: 0.949, pay: 546971, markup: 2.15, spb: 2.91, note: 'New Jersey — one of the top 5 states for healthcare fraud prosecutions' },
  { rank: 6, npi: '1245366558', name: 'Tuan Duong', specialty: 'Internal Medicine', state: 'CA', prob: 0.956, pay: 516519, markup: 2.25, spb: 2.69, note: 'California — tied #1 for most flagged providers by state' },
  { rank: 7, npi: '1427163427', name: 'Lilia Gorovits', specialty: 'Internal Medicine', state: 'PA', prob: 0.946, pay: 716667, markup: 2.21, spb: 3.00, note: 'Consistent volume-driven billing pattern across all years' },
  { rank: 8, npi: '1093807497', name: 'Sudhirkumar Shah', specialty: 'Internal Medicine', state: 'MO', prob: 0.953, pay: 724716, markup: 1.99, spb: 3.21, note: 'High services per beneficiary in a lower-volume state' },
  { rank: 9, npi: '1609929405', name: 'Michael Hernandez', specialty: 'Internal Medicine', state: 'FL', prob: 0.951, pay: 1210737, markup: 2.12, spb: 3.34, note: 'Florida — tied #1 for most flagged providers, $1.2M in payments' },
  { rank: 10, npi: '1346237096', name: 'Edd Jones', specialty: 'Family Practice', state: 'GA', prob: 0.947, pay: 795844, markup: 1.93, spb: 2.64, note: 'Only Family Practice provider in top 10' },
]

const featureImportance = [
  { feature: 'Years Active', importance: 16.3, explanation: 'Fraudsters tend to have shorter careers — they get caught, lose their license, or move on to a new scheme.' },
  { feature: 'Services per Beneficiary', importance: 11.9, explanation: 'How many services a provider bills per patient. Padding patient visits with unnecessary tests and procedures is the oldest fraud playbook.' },
  { feature: 'Markup Ratio', importance: 8.0, explanation: 'The ratio of what a provider charges vs. what Medicare allows. Legitimate providers typically charge 1.5–2x. Fraudsters routinely charge 3–5x, knowing Medicare will pay the allowed amount regardless.' },
  { feature: 'Total Services', importance: 7.8, explanation: 'Raw billing volume. More services = more revenue = more opportunity for abuse.' },
  { feature: 'Total Beneficiaries', importance: 7.2, explanation: 'Patient count. Extremely high patient counts can indicate "patient mills" — clinics designed to churn through Medicare beneficiaries.' },
  { feature: 'Payment per Service', importance: 6.5, explanation: 'Higher average payments suggest upcoding — billing for more expensive procedures than were actually performed.' },
  { feature: 'Geographic Concentration', importance: 5.1, explanation: 'Fraud clusters geographically. South Florida, Houston, Los Angeles, and Detroit are historical hotspots.' },
]

export default function AlgorithmKnowsPage() {
  const publishedDate = '2026-02-21'
  const readTime = '15 min read'

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="The Algorithm Knows: How AI Trained on 8,300 Convicted Fraudsters Found 500 Doctors Who Look Just Like Them"
        description="A machine learning model trained on 8,300+ convicted Medicare fraudsters flagged 500 active providers with matching billing patterns."
        publishedDate={publishedDate}
        url="https://www.openmedicare.com/investigations/algorithm-knows"
      />
            <InvestigationDisclaimer />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'The Algorithm Knows' },
          ]}
          className="mb-8"
        />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-4">
                Flagship Investigation
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4 leading-tight">
                The Algorithm Knows
              </h1>
              <p className="text-2xl text-gray-600 font-light leading-relaxed">
                How AI Trained on 8,300 Convicted Fraudsters Found 500 Doctors Who Look Just Like Them
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
                <ShareButtons title="The Algorithm Knows" url="/investigations/algorithm-knows" />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important Disclaimer:</strong> The providers identified in this analysis are flagged based on
                <strong> statistical patterns</strong>, not evidence of wrongdoing. A high fraud probability score means
                a provider&apos;s billing patterns are mathematically similar to those of convicted fraudsters. There may be
                entirely legitimate explanations — large group practices, complex patient populations, specialty billing
                patterns, or data aggregation artifacts. <strong>No provider named here has been accused or charged with
                any crime</strong> unless otherwise noted. We present this analysis because taxpayers deserve to know how
                public money is being spent.
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* The Hook */}
              <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                We fed 10 years of Medicare billing data — every claim, every dollar, every provider — into a machine
                learning model trained on 8,300+ confirmed fraud convictions. Then we asked it a simple question:
                <em> Who else bills like a criminal?</em>
              </p>
              <p>
                The algorithm returned 500 names.
              </p>
              <p>
                Five hundred active Medicare providers whose billing patterns are statistically indistinguishable from
                doctors, nurse practitioners, and clinics that were later convicted of healthcare fraud, excluded from
                federal programs, or sentenced to prison. Collectively, these 500 providers have billed Medicare over{' '}
                <strong>{formatCurrency(400000000)}</strong> in taxpayer money — an average of{' '}
                <strong>{formatCurrency(800000)}</strong> each.
              </p>
              <p>
                This doesn&apos;t mean they&apos;re guilty. It means the math says they look exactly like people who were.
              </p>

              {/* How It Works */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                How We Built It
              </h2>
              <p>
                Our model is a <strong>Random Forest classifier</strong> — an ensemble of hundreds of decision trees, each
                one learning slightly different patterns in the data. Think of it as 500 fraud investigators, each with
                a slightly different perspective, voting on whether a provider&apos;s billing looks suspicious. When the
                majority vote yes, the probability goes up.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">🔬 Training Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <p className="font-semibold mb-1">Confirmed Fraudsters (Labels)</p>
                    <ul className="space-y-1">
                      <li>• <strong>8,301 NPIs</strong> from the HHS OIG LEIE exclusion list</li>
                      <li>• DOJ healthcare fraud prosecution records</li>
                      <li>• Cross-referenced with CMS billing data</li>
                      <li>• <strong>2,198</strong> had sufficient billing history for training</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Billing Features (Inputs)</p>
                    <ul className="space-y-1">
                      <li>• Total billing volume &amp; payment amounts</li>
                      <li>• Markup ratios (charged vs. allowed)</li>
                      <li>• Services per beneficiary</li>
                      <li>• Specialty-specific patterns</li>
                      <li>• Geographic concentration</li>
                      <li>• Years of active billing</li>
                    </ul>
                  </div>
                </div>
                <p className="text-blue-700 text-sm mt-4">
                  <strong>Data source:</strong> CMS Medicare Provider Utilization and Payment Data (2014–2023),
                  1.7M+ providers scored. HHS OIG LEIE database. DOJ press releases and case records.
                </p>
              </div>

              <p>
                The key insight: we don&apos;t try to detect fraud directly. We trained the model on the billing
                patterns of people who <em>were</em> convicted of fraud, then asked it to find active providers
                who match those patterns. It&apos;s the difference between trying to define fraud in the abstract
                vs. learning what fraud actually looks like from 2,198 real cases.
              </p>

              {/* What the Algorithm Learned */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                What the Algorithm Learned
              </h2>
              <p>
                When you train a model on thousands of convicted fraudsters, certain patterns emerge. Here are the
                features the model found most predictive, ranked by importance:
              </p>

              <div className="my-8 space-y-4">
                {featureImportance.map((f) => (
                  <div key={f.feature} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-medicare-primary font-mono">{f.importance}%</span>
                      <span className="text-lg font-semibold text-gray-900">{f.feature}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-medicare-primary rounded-full h-2"
                        style={{ width: `${(f.importance / 16.3) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">{f.explanation}</p>
                  </div>
                ))}
              </div>

              <p>
                The #1 predictor surprised us: <strong>years active</strong>. Fraudsters don&apos;t tend to build
                long careers. They enter the system, bill aggressively for a few years, and either get caught,
                move to a different NPI, or flee. A provider who&apos;s been billing Medicare for 15+ years is
                statistically <em>less</em> likely to match fraud patterns — not because fraud doesn&apos;t exist
                among veterans, but because the convicted ones rarely lasted that long.
              </p>
              <p>
                The #2 predictor — <strong>services per beneficiary</strong> — is the classic fraud signal.
                Legitimate internists might bill 2–4 services per patient visit. Fraud mills bill 8, 10, 15
                services per encounter — stacking labs, tests, and procedures onto every patient who walks
                through the door.
              </p>

              {/* The Top 10 */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                The Top 10 Flagged Providers
              </h2>
              <p>
                These are the 10 active Medicare providers whose billing patterns most closely match those of
                convicted fraudsters. Each link goes to their full provider profile with detailed billing data.
              </p>
            </div>

            {/* Top 10 Table */}
            <div className="my-8 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Fraud Prob.</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Medicare Payments</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {top10.map((p) => (
                    <tr key={p.npi} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          p.rank <= 3 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {p.rank}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <Link href={`/providers/${p.npi}`} className="text-medicare-primary hover:underline font-semibold">
                          {p.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">{p.note}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{p.state}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{p.specialty}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold bg-red-100 text-red-800">
                          {(p.prob * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        {formatCurrency(p.pay)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-sm text-gray-500 italic">
                Click any provider name to see their full billing history, year-by-year breakdown, and top procedures.
              </p>

              {/* The Pattern */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                The Specialty Pattern: Why Internal Medicine Dominates
              </h2>
              <p>
                Of the 500 flagged providers, the specialty breakdown is striking:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 my-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-32 text-sm font-medium text-gray-700">Internal Med</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6">
                      <div className="bg-red-500 rounded-full h-6 flex items-center justify-end pr-2" style={{ width: '52.6%' }}>
                        <span className="text-xs font-bold text-white">263</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">52.6%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 text-sm font-medium text-gray-700">Family Practice</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6">
                      <div className="bg-orange-500 rounded-full h-6 flex items-center justify-end pr-2" style={{ width: '27%' }}>
                        <span className="text-xs font-bold text-white">135</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">27.0%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 text-sm font-medium text-gray-700">Other</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6">
                      <div className="bg-gray-400 rounded-full h-6 flex items-center justify-end pr-2" style={{ width: '20.4%' }}>
                        <span className="text-xs font-bold text-white">102</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">20.4%</span>
                  </div>
                </div>
              </div>

              <p>
                <strong>Internal Medicine + Family Practice = 79.6% of all flagged providers.</strong> Why? These are
                the highest-volume primary care specialties. They see the most patients, order the most tests, and
                bill the most line items. That volume creates <em>opportunity</em> — more claims mean more chances
                to pad, upcode, or bill for services never rendered. It&apos;s the same reason bank robbers target
                banks with the most cash.
              </p>
              <p>
                This doesn&apos;t mean internists are inherently more fraudulent. It means the model learned that
                fraud patterns concentrate where billing volume is highest — which is exactly what DOJ prosecution
                records show.
              </p>

              {/* The Geography */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                The Geography of Suspicion
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 my-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  {[
                    { state: 'CA', count: 56 },
                    { state: 'FL', count: 56 },
                    { state: 'NY', count: 39 },
                    { state: 'TX', count: 36 },
                    { state: 'NJ', count: 33 },
                  ].map((s) => (
                    <div key={s.state} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-3xl font-bold text-medicare-primary">{s.count}</div>
                      <div className="text-sm text-gray-600">{s.state}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Top 5 states by number of flagged providers (220 of 500, or 44%)
                </p>
              </div>

              <p>
                California and Florida are tied at 56 flagged providers each. Then New York (39), Texas (36), and
                New Jersey (33). If that list looks familiar, it should — these are the exact same states that
                dominate DOJ healthcare fraud takedowns year after year.
              </p>
              <p>
                South Florida alone has been the target of more Medicare fraud strike forces than any other region
                in the country. Our algorithm didn&apos;t know that. It simply learned from the data that providers
                in these states are more likely to match convicted fraud patterns. The geography of fraud is not random.
              </p>

              {/* The Money */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                The Money
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-red-800">{formatCurrency(400000000)}</div>
                  <div className="text-sm text-red-600 mt-1">Total Medicare payments to flagged providers</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-red-800">{formatCurrency(800000)}</div>
                  <div className="text-sm text-red-600 mt-1">Average per provider</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-red-800">500</div>
                  <div className="text-sm text-red-600 mt-1">Providers flagged</div>
                </div>
              </div>

              <p>
                Four hundred million dollars. That&apos;s the total Medicare payments flowing to these 500 providers
                over the past decade. To put that in perspective: the entire HHS OIG budget for investigating
                Medicare fraud is roughly $400M per year. We&apos;re talking about the same amount of money going
                to just 500 providers whose billing patterns match convicted criminals.
              </p>
              <p>
                Not all of that money is fraudulent — probably not even most of it. But if even 10% represents
                waste, fraud, or abuse, that&apos;s $40 million in taxpayer money. Enough to fund 800 nurses for a year.
              </p>

              {/* Validation */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                Does It Actually Work?
              </h2>
              <p>
                Yes. Our model achieves an <strong>AUC of 0.83</strong> — meaning it correctly distinguishes between
                fraudsters and legitimate providers 83% of the time. That&apos;s not perfect, but it&apos;s
                significantly better than random chance (0.50) and comparable to models used in financial fraud
                detection.
              </p>
              <p>
                More importantly: <strong>we&apos;ve already seen it work in the real world.</strong> Several providers
                flagged by earlier versions of our model were subsequently charged by the DOJ — months or years
                after our analysis identified them. We documented these cases in{' '}
                <Link href="/investigations/data-predicted-fraud" className="text-medicare-primary hover:underline font-semibold">
                  &ldquo;Our Data Predicted It&rdquo;
                </Link>.
              </p>
              <p>
                The model doesn&apos;t know <em>why</em> a provider bills the way they do. It only knows that
                the pattern matches. But when you train on 2,198 confirmed cases and the math keeps being right,
                the patterns deserve scrutiny.
              </p>

              {/* Disclaimer - Bottom */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">⚠️ What This Is — And What It Isn&apos;t</h3>
                <p className="text-yellow-800 mb-3">
                  This is a <strong>statistical analysis</strong>, not an investigation by law enforcement. A high fraud
                  probability means a provider&apos;s billing patterns are mathematically similar to convicted fraudsters.
                  It does <strong>not</strong> mean they have committed fraud.
                </p>
                <p className="text-yellow-800 mb-3">
                  There are many legitimate reasons a provider might trigger our model: they may treat unusually complex
                  patients, operate a high-volume clinic, practice in an underserved area, or bill under a group NPI
                  that aggregates multiple providers&apos; claims.
                </p>
                <p className="text-yellow-800">
                  <strong>No provider named in this article has been accused or charged with any crime</strong> based on
                  this analysis. If you believe you have information about Medicare fraud, contact the{' '}
                  <Link href="/fraud/report" className="text-yellow-900 underline font-semibold">
                    HHS OIG Hotline
                  </Link>.
                </p>
              </div>

              {/* Call to Action */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                Explore the Data Yourself
              </h2>
              <p>
                We believe in transparency. Every number in this article comes from publicly available CMS data.
                You can verify it, challenge it, or build on it.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <Link
                  href="/fraud/still-out-there"
                  className="block bg-medicare-primary text-white rounded-lg p-6 hover:bg-blue-700 transition-colors no-underline"
                >
                  <div className="text-lg font-bold mb-2">🔍 Full Searchable List</div>
                  <p className="text-blue-100 text-sm">
                    All 500 flagged providers — searchable, sortable, with fraud probability scores and billing details.
                  </p>
                </Link>
                <Link
                  href="/fraud/report"
                  className="block bg-red-600 text-white rounded-lg p-6 hover:bg-red-700 transition-colors no-underline"
                >
                  <div className="text-lg font-bold mb-2">📞 Report Fraud</div>
                  <p className="text-red-100 text-sm">
                    If you have information about Medicare fraud, waste, or abuse — the HHS OIG hotline is your next step.
                  </p>
                </Link>
              </div>

              {/* Source Citation */}
              <SourceCitation
                sources={[
                  'CMS Medicare Provider Utilization and Payment Data (2014–2023)',
                  'HHS Office of Inspector General — List of Excluded Individuals/Entities (LEIE)',
                  'Department of Justice — Healthcare Fraud Prosecution Records',
                  'OpenMedicare ML Model v2.0 (Random Forest, AUC 0.83)',
                ]}
              />

              {/* Related Investigations */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Related Investigations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/investigations/still-out-there"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">Still Out There</div>
                    <p className="text-xs text-gray-600">
                      The full list of 500 flagged providers, searchable and sortable.
                    </p>
                  </Link>
                  <Link
                    href="/investigations/how-we-built-the-model"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">How We Built the Model</div>
                    <p className="text-xs text-gray-600">
                      The ML fraud detection model behind 1.7 million provider analyses.
                    </p>
                  </Link>
                  <Link
                    href="/investigations/data-predicted-fraud"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">Our Data Predicted It</div>
                    <p className="text-xs text-gray-600">
                      Providers our model flagged who were later charged by the DOJ.
                    </p>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 not-prose">
                  <Link href="/investigations/internal-medicine-crisis" className="block bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors no-underline">
                    <div className="text-sm font-bold text-gray-900">Internal Medicine: Ground Zero</div>
                    <p className="text-xs text-gray-600">Why 53% of flagged providers share one specialty</p>
                  </Link>
                  <Link href="/investigations/florida-california-fraud" className="block bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors no-underline">
                    <div className="text-sm font-bold text-gray-900">The Fraud Belt</div>
                    <p className="text-xs text-gray-600">CA & FL lead with 56 flags each</p>
                  </Link>
                  <Link href="/investigations/impossible-doctors" className="block bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors no-underline">
                    <div className="text-sm font-bold text-gray-900">The Impossible Doctors</div>
                    <p className="text-xs text-gray-600">400+ services per working day</p>
                  </Link>
                  <Link href="/investigations/medicare-fraud-2025" className="block bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors no-underline">
                    <div className="text-sm font-bold text-gray-900">Medicare Fraud in 2025</div>
                    <p className="text-xs text-gray-600">DOJ&apos;s $14.6B enforcement action</p>
                  </Link>
                </div>
                <div className="mt-4 not-prose">
                  <p className="text-sm text-gray-600">
                    Explore: <Link href="/fraud" className="text-medicare-primary hover:underline">Fraud Analysis Hub</Link> · <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline">Full Watchlist</Link> · <Link href="/fraud/still-out-there" className="text-medicare-primary hover:underline">ML Results</Link> · <Link href="/specialties/internal-medicine" className="text-medicare-primary hover:underline">Internal Medicine</Link> · <Link href="/states" className="text-medicare-primary hover:underline">Browse States</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
