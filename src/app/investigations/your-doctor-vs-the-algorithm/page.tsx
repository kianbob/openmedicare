import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import ArticleJsonLd from '@/components/ArticleJsonLd'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Your Doctor vs. The Algorithm: What AI Found That Humans Missed | OpenMedicare',
  description: 'We trained a machine learning model on 2,198 confirmed fraud cases. It scored 1.7 million providers. Here\'s what it looks for — and what it found.',
  openGraph: {
    title: 'Your Doctor vs. The Algorithm',
    description: 'What AI found in Medicare billing that humans missed.',
  },
}

interface StillOutThere {
  npi: string
  name: string
  specialty: string
  state: string
  total_payments: number
  total_services: number
  total_beneficiaries: number
  fraud_probability: number
  risk_rank: number
  top_risk_factors: string[]
  markup_ratio: number
  services_per_bene: number
}

interface Feature {
  feature: string
  importance: number
}

interface SpecialtyCount {
  specialty: string
  count: number
}

interface StateCount {
  state: string
  count: number
}

interface MLData {
  model_version: string
  trained_on: number
  auc_score: number
  total_scored: number
  still_out_there: StillOutThere[]
  top_features: Feature[]
  top_specialties: SpecialtyCount[]
  top_states: StateCount[]
  total_flagged_payments: number
}

function loadData(): MLData {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'ml-v2-results.json'), 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { model_version: '2.0', trained_on: 0, auc_score: 0, total_scored: 0, still_out_there: [], top_features: [], top_specialties: [], top_states: [], total_flagged_payments: 0 }
  }
}

function featureLabel(f: string): string {
  const labels: Record<string, string> = {
    years_active: 'Years Active',
    services_per_bene: 'Services Per Patient',
    markup_ratio: 'Markup Ratio',
    payment_per_service: 'Payment Per Service',
    markup_vs_median: 'Markup vs. Median',
    payment_per_bene: 'Payment Per Patient',
    total_payments: 'Total Payments',
    total_services: 'Total Services',
    benes_vs_median: 'Patients vs. Median',
    payments_vs_median: 'Payments vs. Median',
  }
  return labels[f] || f.replace(/_/g, ' ')
}

function featureExplainer(f: string): string {
  const explanations: Record<string, string> = {
    years_active: 'How long has this provider been billing Medicare? Fraudsters tend to be newer — they set up shop, bill aggressively, and disappear.',
    services_per_bene: 'How many services does this provider bill per patient? Most doctors see a patient a few times a year. Fraud mills bill dozens of services per person.',
    markup_ratio: 'How much does this provider charge vs. what Medicare actually pays? Extreme markups can signal inflated billing.',
    payment_per_service: 'The average Medicare payment per service. Unusually high values suggest upcoding — billing for more expensive procedures than were performed.',
    markup_vs_median: 'How does this provider\'s markup compare to the median for their specialty? Outliers stand out.',
    payment_per_bene: 'Total payments divided by number of patients. A high ratio means heavy billing per person.',
    total_payments: 'Raw dollar volume. Not suspicious alone, but combined with other factors, large totals amplify risk.',
    total_services: 'Total number of services billed. At extreme levels, it becomes physically impossible for one provider to deliver this many.',
    benes_vs_median: 'How does this provider\'s patient count compare to peers? Both extremes — too many and too few — can signal problems.',
    payments_vs_median: 'Total payments relative to specialty peers. Consistent outliers attract algorithmic attention.',
  }
  return explanations[f] || ''
}

export default function DoctorVsAlgorithmPage() {
  const data = loadData()
  const features = data.top_features
  const specialties = data.top_specialties.slice(0, 10)
  const states = data.top_states.slice(0, 10)
  const flagged = data.still_out_there.slice(0, 10)
  const totalFlagged = data.still_out_there.length
  const totalFlaggedPayments = data.total_flagged_payments

  return (
    <main className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="Your Doctor vs. The Algorithm: What AI Found That Humans Missed"
        description="We trained a machine learning model on confirmed fraud cases and scored 1.7 million Medicare providers."
        datePublished="2026-02-21"
        url="https://openmedicare.com/investigations/your-doctor-vs-the-algorithm"
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'Your Doctor vs. The Algorithm', href: '/investigations/your-doctor-vs-the-algorithm' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Investigation</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Your Doctor vs. The Algorithm: What AI Found That Humans Missed
          </h1>
          <p className="text-gray-500 text-sm mb-2">Published February 2026 · 15 min read</p>
          <ShareButtons title="Your Doctor vs. The Algorithm" url="/investigations/your-doctor-vs-the-algorithm" />

          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg mb-8 mt-8 not-prose">
            <p className="text-purple-900 font-medium text-lg">Key Finding</p>
            <p className="text-purple-800 mt-2">
              We trained a machine learning model on <strong>{data.trained_on.toLocaleString()}</strong> confirmed fraud cases and scored <strong>{formatNumber(data.total_scored)}</strong> Medicare providers. The model achieved an AUC of <strong>{data.auc_score}</strong> — meaning it correctly distinguishes fraudulent from legitimate providers about 83% of the time.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What Is an AUC Score? (And Why 0.83 Matters)</h2>

          <p className="text-gray-700 mb-4">
            Let&apos;s start with the basics. AUC stands for &quot;Area Under the Curve&quot; — it&apos;s how data scientists measure whether a model can tell the difference between two groups. In our case: fraudulent providers vs. legitimate ones.
          </p>

          <p className="text-gray-700 mb-4">
            An AUC of <strong>0.5</strong> means the model is guessing randomly — a coin flip. An AUC of <strong>1.0</strong> means perfect detection. Our score of <strong>{data.auc_score}</strong> means the model is significantly better than chance. It&apos;s not perfect, but it&apos;s powerful enough to surface patterns that human auditors would take years to find manually.
          </p>

          <div className="bg-gray-100 rounded-xl p-6 my-6 not-prose">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400">0.50</div>
                <div className="text-xs text-gray-500">Random guess</div>
              </div>
              <div className="flex-1 h-4 bg-gradient-to-r from-gray-300 via-yellow-400 to-green-500 rounded-full relative">
                <div className="absolute top-0 h-4 flex items-center" style={{ left: `${(data.auc_score - 0.5) / 0.5 * 100}%` }}>
                  <div className="w-1 h-8 bg-purple-700 rounded -mt-2"></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">1.00</div>
                <div className="text-xs text-gray-500">Perfect</div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600">Our model: <span className="font-bold text-purple-700">{data.auc_score}</span></p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What the Algorithm Looks For</h2>

          <p className="text-gray-700 mb-4">
            This is the part most people are curious about. What actually makes a provider look &quot;suspicious&quot; to a machine? The answer isn&apos;t any single thing — it&apos;s a <em>combination</em> of factors, weighted by how predictive each one is.
          </p>

          <p className="text-gray-700 mb-4">
            Here are the top 10 features our model uses, ranked by importance:
          </p>
        </article>

        {/* Feature importance */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden my-8">
          <div className="p-4 bg-purple-50 border-b">
            <h3 className="text-lg font-bold text-purple-900">Top 10 Features — What the Model Weighs Most</h3>
            <p className="text-sm text-purple-700">Feature importance scores from our gradient-boosted classifier</p>
          </div>
          <div className="divide-y">
            {features.map((f, i) => (
              <div key={f.feature} className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-100 text-purple-700 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center">{i + 1}</span>
                    <span className="font-bold text-gray-900">{featureLabel(f.feature)}</span>
                  </div>
                  <span className="text-purple-600 font-mono font-bold">{(f.importance * 100).toFixed(1)}%</span>
                </div>
                <div className="ml-11">
                  <div className="bg-gray-100 rounded-full h-2 mb-2">
                    <div className="bg-purple-500 rounded-full h-2" style={{ width: `${f.importance / features[0].importance * 100}%` }}></div>
                  </div>
                  <p className="text-sm text-gray-600">{featureExplainer(f.feature)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The #1 Signal: How Long You&apos;ve Been Around</h2>

          <p className="text-gray-700 mb-4">
            The single most important feature — at <strong>{(features[0]?.importance * 100).toFixed(1)}%</strong> importance — is <strong>years active</strong>. This might seem counterintuitive. Why would how long you&apos;ve been practicing matter?
          </p>

          <p className="text-gray-700 mb-4">
            The answer tells you everything about how Medicare fraud works. Fraudsters tend to be <em>new</em>. They register a fresh NPI, bill as aggressively as possible for 1-3 years, then close up shop — often before auditors catch on. Legitimate providers, by contrast, build practices over decades.
          </p>

          <p className="text-gray-700 mb-4">
            So when the algorithm sees a provider who&apos;s only been active for 2 years but is already billing millions, that&apos;s a red flag. Not proof of fraud — but a pattern worth investigating.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The #2 Signal: Services Per Patient</h2>

          <p className="text-gray-700 mb-4">
            At <strong>{(features[1]?.importance * 100).toFixed(1)}%</strong> importance, <strong>services per beneficiary</strong> is the second-strongest signal. This one is intuitive: a normal doctor might bill 5-10 services per patient per year. A fraud mill might bill 50, 100, or even 200+.
          </p>

          <p className="text-gray-700 mb-4">
            In the confirmed fraud cases our model trained on, the average services-per-beneficiary ratio was dramatically higher than the national median. Many were physically impossible — no doctor can perform that many procedures on one person in a year.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Normal vs. Suspicious: A Side-by-Side</h2>

          <p className="text-gray-700 mb-4">
            To make this concrete, here&apos;s what a typical provider looks like next to a flagged one:
          </p>
        </article>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✅</span>
              <h3 className="text-lg font-bold text-green-900">Typical Provider</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-green-700">Years Active</span><span className="font-bold text-green-900">15-20 years</span></div>
              <div className="flex justify-between"><span className="text-green-700">Services/Patient</span><span className="font-bold text-green-900">3-8</span></div>
              <div className="flex justify-between"><span className="text-green-700">Markup Ratio</span><span className="font-bold text-green-900">1.2-1.8x</span></div>
              <div className="flex justify-between"><span className="text-green-700">Total Payments</span><span className="font-bold text-green-900">$100K-$500K</span></div>
              <div className="flex justify-between"><span className="text-green-700">Fraud Score</span><span className="font-bold text-green-900">0.01-0.10</span></div>
            </div>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🚩</span>
              <h3 className="text-lg font-bold text-red-900">Flagged Provider</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-red-700">Years Active</span><span className="font-bold text-red-900">1-3 years</span></div>
              <div className="flex justify-between"><span className="text-red-700">Services/Patient</span><span className="font-bold text-red-900">15-50+</span></div>
              <div className="flex justify-between"><span className="text-red-700">Markup Ratio</span><span className="font-bold text-red-900">2.0-3.0x+</span></div>
              <div className="flex justify-between"><span className="text-red-700">Total Payments</span><span className="font-bold text-red-900">$500K-$2M+</span></div>
              <div className="flex justify-between"><span className="text-red-700">Fraud Score</span><span className="font-bold text-red-900">0.90-0.96</span></div>
            </div>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            The difference is stark. Flagged providers aren&apos;t just a little unusual — they&apos;re statistical outliers across multiple dimensions simultaneously.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Where the Algorithm Finds Risk</h2>

          <p className="text-gray-700 mb-4">
            When we look at the providers the model flagged as highest-risk, they cluster in specific specialties and states:
          </p>
        </article>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Flagged Specialties</h3>
            <div className="space-y-3">
              {specialties.map((s, i) => (
                <div key={s.specialty} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{s.specialty}</span>
                  <span className="bg-purple-100 text-purple-700 text-sm font-bold px-2 py-1 rounded">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Flagged States</h3>
            <div className="space-y-3">
              {states.map((s) => (
                <div key={s.state} className="flex items-center justify-between">
                  <Link href={`/states/${s.state}`} className="text-sm text-blue-600 hover:underline">{s.state}</Link>
                  <span className="bg-purple-100 text-purple-700 text-sm font-bold px-2 py-1 rounded">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            <strong>Internal Medicine</strong> dominates with {specialties[0]?.count} flagged providers — nearly twice the next specialty ({specialties[1]?.specialty} at {specialties[1]?.count}). This makes sense: Internal Medicine is one of the broadest billing categories in Medicare, making it easier to blend fraudulent billing with legitimate-looking services.
          </p>

          <p className="text-gray-700 mb-4">
            Geographically, <strong>California and Florida</strong> tie at {states[0]?.count} flagged providers each, followed by New York ({states[2]?.count}), Texas ({states[3]?.count}), and New Jersey ({states[4]?.count}). These are the same states that appear repeatedly in <Link href="/fraud/still-out-there" className="text-blue-600 hover:underline">our fraud database</Link>.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The {totalFlagged} Providers &quot;Still Out There&quot;</h2>

          <InvestigationDisclaimer />

          <p className="text-gray-700 mb-4">
            Our model identified <strong>{totalFlagged} providers</strong> with fraud probability scores above 0.90 — representing <strong>{formatCurrency(totalFlaggedPayments)}</strong> in total Medicare payments. These are providers who look statistically similar to confirmed fraudsters but haven&apos;t been charged.
          </p>

          <p className="text-gray-700 mb-4">
            To be clear: a high fraud score doesn&apos;t mean a provider <em>is</em> committing fraud. It means their billing patterns match those of providers who were later convicted. Some may have legitimate explanations. Others may warrant investigation.
          </p>

          <p className="text-gray-700 mb-4">
            Explore the full list and methodology at <Link href="/fraud/still-out-there" className="text-blue-600 hover:underline">/fraud/still-out-there</Link>, or read about <Link href="/investigations/how-we-built-the-model" className="text-blue-600 hover:underline">how we built the model</Link>.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What the Algorithm Can&apos;t Do</h2>

          <p className="text-gray-700 mb-4">
            It&apos;s important to be honest about limitations:
          </p>

          <div className="bg-yellow-50 border rounded-xl p-6 my-6 not-prose">
            <h3 className="text-lg font-bold text-yellow-900 mb-3">⚠️ Limitations</h3>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li>• <strong>Not a diagnosis.</strong> The model flags patterns — it can&apos;t prove intent or distinguish billing errors from deliberate fraud.</li>
              <li>• <strong>Specialty bias.</strong> Some specialties naturally have higher volumes or markups. The model accounts for this, but imperfectly.</li>
              <li>• <strong>Training data limits.</strong> We trained on {data.trained_on.toLocaleString()} confirmed cases — a real but small sample. Some fraud types may be underrepresented.</li>
              <li>• <strong>Public data only.</strong> We use publicly available Medicare Part B data, which doesn&apos;t include Part A (hospital), Part D (drugs), or private claims.</li>
              <li>• <strong>No patient context.</strong> A provider in an underserved area may have unusual patterns for legitimate reasons.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why This Matters</h2>

          <p className="text-gray-700 mb-4">
            Medicare loses an estimated $60 billion per year to fraud. The federal government has about 1,500 investigators at HHS-OIG responsible for overseeing a program that pays 1.7 million providers. The math doesn&apos;t work.
          </p>

          <p className="text-gray-700 mb-4">
            Machine learning doesn&apos;t replace investigators — it helps them focus. Instead of auditing providers at random, algorithms can surface the most suspicious patterns for human review. Think of it as a spotlight, not a judge.
          </p>

          <p className="text-gray-700 mb-4">
            Read our full <Link href="/methodology" className="text-blue-600 hover:underline">methodology</Link> for technical details on the model architecture, training process, and validation.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Methodology</h2>

          <p className="text-gray-700 mb-4">
            Our model (v{data.model_version}) is a gradient-boosted decision tree (XGBoost) trained on {data.trained_on.toLocaleString()} confirmed fraud cases from the HHS-OIG LEIE database, matched against Medicare Part B billing features. The model was validated using 5-fold cross-validation with stratified sampling. Features are computed from the most recent available Medicare Part B Public Use File. AUC is reported on held-out test data.
          </p>
        </article>

        <div className="mt-8 mb-12">
          <SourceCitation
            title="Medicare Part B Public Use File & HHS-OIG LEIE Database"
            url="https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners"
            description="Provider billing features from CMS. Fraud labels from HHS-OIG List of Excluded Individuals/Entities."
          />
        </div>
      </div>
    </main>
  )
}
