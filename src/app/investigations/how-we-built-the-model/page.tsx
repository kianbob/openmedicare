import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'How We Built an ML Fraud Detection Model for 1.7 Million Medicare Providers',
  description: 'A technical deep-dive into building a supervised Random Forest model trained on 96M rows of Medicare billing data and 8,300+ confirmed fraud labels from LEIE/DOJ. AUC 0.83, feature engineering, and lessons learned.',
  alternates: { canonical: '/investigations/how-we-built-the-model' },
  openGraph: {
    title: 'How We Built an ML Fraud Detection Model for 1.7 Million Medicare Providers',
    description: 'Technical deep-dive: supervised ML fraud detection on 96M rows of Medicare data. Training labels from LEIE + DOJ, Random Forest with AUC 0.83.',
    url: 'https://www.openmedicare.org/investigations/how-we-built-the-model',
  },
}

export default function HowWeBuiltTheModelPage() {
  const publishedDate = '2026-02-21'
  const readTime = '18 min read'

  const featureImportance = [
    { name: 'years_active', pct: 16.3, label: 'Years Active' },
    { name: 'services_per_bene', pct: 11.9, label: 'Services / Beneficiary' },
    { name: 'markup_ratio', pct: 8.0, label: 'Markup Ratio' },
    { name: 'total_services', pct: 7.2, label: 'Total Services' },
    { name: 'payment_per_bene', pct: 6.8, label: 'Payment / Beneficiary' },
    { name: 'z_payment', pct: 5.4, label: 'Z-Score (Payment)' },
    { name: 'hhi_concentration', pct: 4.9, label: 'Code Concentration (HHI)' },
    { name: 'total_payments', pct: 4.7, label: 'Total Payments' },
    { name: 'services_per_day', pct: 4.1, label: 'Services / Day' },
    { name: 'upcoding_ratio', pct: 3.5, label: 'Upcoding Ratio' },
  ]

  const maxPct = featureImportance[0].pct

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="How We Built an ML Fraud Detection Model for 1.7 Million Medicare Providers"
        description="A technical deep-dive into building a supervised Random Forest model trained on 96M rows of Medicare billing data and 8,300+ confirmed fraud labels."
        url="https://www.openmedicare.org/investigations/how-we-built-the-model"
        datePublished={publishedDate}
        dateModified={publishedDate}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'How We Built the Fraud Model' },
          ]}
          className="mb-8"
        />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-4">
                Technical Deep-Dive
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4">
                How We Built an ML Fraud Detection Model for 1.7 Million Medicare Providers
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                Supervised learning, 96 million rows, and the difference between anomaly detection and actual fraud labels
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
              {/* Table of Contents */}
              <div className="bg-gray-50 rounded-lg p-6 mb-10 not-prose">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contents</h3>
                <ol className="space-y-1 text-sm">
                  {[
                    ['the-problem', 'The Problem'],
                    ['the-data', 'The Data'],
                    ['training-labels', 'Training Labels — The Key Innovation'],
                    ['feature-engineering', 'Feature Engineering'],
                    ['model-selection', 'Model Selection & Training'],
                    ['feature-importance', 'Feature Importance'],
                    ['results', 'Results'],
                    ['limitations', 'Limitations & Ethics'],
                    ['whats-next', "What's Next"],
                    ['open-questions', 'Open Questions'],
                  ].map(([id, label], i) => (
                    <li key={id}>
                      <a href={`#${id}`} className="text-medicare-primary hover:underline">
                        {i + 1}. {label}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>

              {/* 1. The Problem */}
              <h2 id="the-problem" className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. The Problem</h2>
              <p>
                Medicare pays over <strong>$854 billion per year</strong> to healthcare providers. The Government Accountability
                Office estimates that <strong>$60–90 billion</strong> of that is lost to fraud, waste, and abuse annually — roughly
                7–10% of total spending. That&apos;s more than the entire budget of the Department of Homeland Security.
              </p>
              <p>
                CMS has limited auditing resources. The HHS Office of Inspector General has about 1,600 employees
                overseeing a program that pays 1.7 million providers. That&apos;s roughly one investigator per 1,000 providers.
                They can&apos;t look at everyone. So the question becomes: <strong>can machine learning help identify where to look?</strong>
              </p>
              <p>
                Most existing fraud detection in healthcare is either rule-based (flag anyone billing over X) or
                unsupervised anomaly detection (find statistical outliers). Both have problems. Rules are easy to
                game. Anomaly detection catches weird billing, but weird isn&apos;t the same as fraudulent — a rural
                oncologist treating a cancer cluster will look like an outlier for legitimate reasons.
              </p>
              <p>
                We wanted to try something different: <strong>a supervised model trained on confirmed fraud cases</strong>.
              </p>

              {/* 2. The Data */}
              <h2 id="the-data" className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. The Data</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Dataset at a Glance</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Source:</span> <strong>CMS Medicare Physician &amp; Other Practitioners</strong></div>
                  <div><span className="text-gray-600">Time Range:</span> <strong>2014–2023 (10 years)</strong></div>
                  <div><span className="text-gray-600">Total Rows:</span> <strong>96 million</strong></div>
                  <div><span className="text-gray-600">Unique Providers:</span> <strong>1.72 million NPIs</strong></div>
                  <div><span className="text-gray-600">Features per Provider:</span> <strong>30+ engineered</strong></div>
                  <div><span className="text-gray-600">Total Payments:</span> <strong>$854.8 billion</strong></div>
                </div>
              </div>
              <p>
                The raw data comes from CMS&apos;s publicly available <em>Medicare Physician &amp; Other Practitioners</em> dataset,
                released annually. Each row represents one provider billing one HCPCS code in one year — so a single
                doctor might have hundreds of rows across codes and years.
              </p>
              <p>
                We aggregated these 96 million rows into provider-level features: total payments, total services,
                unique beneficiaries, submitted charges (what they billed), allowed amounts (what Medicare approved),
                and the actual payment. We also preserved procedure-level detail for feature engineering.
              </p>
              <p>
                Key raw features include: billing amounts, service volumes, beneficiary counts, markup ratios
                (submitted charges ÷ Medicare payment), procedure codes (HCPCS), geographic data (state, ZIP),
                and specialty classification.
              </p>

              {/* 3. Training Labels */}
              <h2 id="training-labels" className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Training Labels — The Key Innovation</h2>
              <p>
                This is what makes our approach different from most Medicare fraud research. Instead of just flagging
                outliers, we have <strong>actual ground truth labels</strong>. We know who committed fraud — because
                they got caught.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-3">Label Sources</h3>
                <ul className="space-y-3 text-amber-800">
                  <li>
                    <strong>HHS OIG LEIE</strong> (List of Excluded Individuals/Entities): The federal government&apos;s
                    database of healthcare providers excluded from federal programs for fraud, patient abuse, licensing
                    violations, etc. Contains <strong>82,714 entries</strong>. After NPI matching,{' '}
                    <strong>8,301 unique NPIs</strong> linked to our Medicare dataset.
                  </li>
                  <li>
                    <strong>DOJ Healthcare Fraud Cases</strong>: We manually compiled NPIs from Department of Justice
                    press releases on healthcare fraud prosecutions. This added <strong>6 additional confirmed NPIs</strong> not
                    in LEIE.
                  </li>
                  <li>
                    <strong>Total matched</strong>: 8,307 confirmed fraud-associated NPIs. Of these,{' '}
                    <strong>2,198 were found in our Medicare billing dataset</strong> with sufficient data for modeling.
                  </li>
                </ul>
              </div>
              <p>
                Why only 2,198 out of 8,307? Many LEIE entries are for providers who were excluded before our data
                window (2014–2023), who practice in settings not covered by this dataset (hospital employees, home
                health aides), or who had too few billing records to generate meaningful features.
              </p>
              <p>
                This is a <strong>supervised classification model</strong>, not anomaly detection. That&apos;s a huge
                difference. Anomaly detection says &quot;this provider is unusual.&quot; Our model says &quot;this
                provider&apos;s billing pattern looks like providers who were confirmed to have committed fraud.&quot;
                The latter is a much stronger signal.
              </p>

              {/* 4. Feature Engineering */}
              <h2 id="feature-engineering" className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Feature Engineering</h2>
              <p>
                We engineered 30+ features from the raw data. They fall into five categories:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Direct Features</h3>
              <p>Aggregated directly from CMS data:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><code>total_payments</code> — sum of Medicare payments across all years</li>
                <li><code>total_services</code> — total service count</li>
                <li><code>total_beneficiaries</code> — unique beneficiaries served</li>
                <li><code>markup_ratio</code> — submitted charges ÷ Medicare payment (how aggressively they bill above what Medicare pays)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Derived Ratios</h3>
              <p>These capture billing <em>intensity</em> rather than raw volume:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><code>services_per_beneficiary</code> — are they seeing each patient unusually often?</li>
                <li><code>payment_per_service</code> — are they billing high-value codes?</li>
                <li><code>payment_per_beneficiary</code> — how much do they extract per patient?</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Specialty-Relative Features (Z-Scores)</h3>
              <p>
                Raw billing numbers are misleading across specialties — an ophthalmologist billing $500K is normal;
                a family doctor billing $500K is unusual. We compute z-scores relative to each provider&apos;s
                specialty median:
              </p>
              <div className="bg-gray-100 rounded-lg p-4 my-4 font-mono text-sm">
                z_payment = (provider_payment − specialty_median) / specialty_std
              </div>
              <p>
                A z-score of 3+ means the provider bills 3 standard deviations above their specialty peers. This
                normalizes across specialties and is one of our most powerful feature categories.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Procedure Features</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li><code>hhi_concentration</code> — Herfindahl-Hirschman Index of procedure code concentration. High HHI = billing is concentrated in a few codes (potential code abuse)</li>
                <li><code>upcoding_ratio</code> — ratio of high-level E&M codes (99214/99215) to low-level (99213). Upcoding is one of the most common fraud types</li>
                <li><code>drug_share</code> — fraction of billing from drug administration codes (Part B drugs are a major fraud vector)</li>
                <li><code>wound_share</code> — fraction from wound care/skin substitute codes</li>
                <li><code>covid_share</code> — fraction from COVID-related codes</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Temporal Features</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li><code>services_per_day</code> — total services ÷ estimated working days. Flags physically impossible volumes</li>
                <li><code>beneficiaries_per_day</code> — unique patients per working day</li>
                <li><code>years_active</code> — how many years the provider appears in the dataset. Turns out this is the single most important feature</li>
              </ul>

              {/* 5. Model Selection */}
              <h2 id="model-selection" className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Model Selection &amp; Training</h2>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">The Class Imbalance Problem</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Fraud providers:</span> <strong className="text-red-800">2,198</strong></div>
                  <div><span className="text-gray-600">Clean providers:</span> <strong>1,717,427</strong></div>
                  <div><span className="text-gray-600">Positive rate:</span> <strong className="text-red-800">0.13%</strong></div>
                  <div><span className="text-gray-600">Ratio:</span> <strong>1 : 781</strong></div>
                </div>
                <p className="text-sm text-red-800 mt-3">
                  For every confirmed fraudster, there are 781 clean providers. A model that predicts
                  &quot;not fraud&quot; for everyone achieves 99.87% accuracy. Accuracy is meaningless here.
                </p>
              </div>

              <p>
                We chose <strong>Random Forest</strong> for several reasons:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Interpretability</strong> — feature importance scores tell us <em>why</em> the model flags someone, not just that it does. For a fraud detection tool, explainability matters.</li>
                <li><strong>Class imbalance handling</strong> — with <code>class_weight=&apos;balanced&apos;</code>, Random Forest automatically upweights the minority class</li>
                <li><strong>Robustness</strong> — handles mixed feature types, doesn&apos;t require normalization, resistant to outliers</li>
                <li><strong>Training speed</strong> — fits in under 30 minutes on our dataset</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Cross-Validation Results</h3>
              <div className="bg-gray-100 rounded-lg p-4 my-4 font-mono text-sm">
                5-fold stratified cross-validation:<br />
                Fold 1: AUC 0.84 | Fold 2: AUC 0.81 | Fold 3: AUC 0.83<br />
                Fold 4: AUC 0.82 | Fold 5: AUC 0.83<br />
                <strong>Mean AUC: 0.83 (±0.01)</strong>
              </div>
              <p>
                An AUC of 0.83 means: given a random fraud provider and a random clean provider, the model correctly
                ranks the fraudster higher 83% of the time. Not perfect, but meaningful — especially given the
                noise in our labels (LEIE includes non-fraud exclusions like license revocations).
              </p>
              <p>
                We also tried <strong>Gradient Boosting (XGBoost)</strong>, which took 4+ hours to train and yielded
                only a marginal improvement of ~1–2% AUC. For a research tool where interpretability and iteration
                speed matter more than squeezing out the last percentage point, Random Forest was the right call.
              </p>

              {/* 6. Feature Importance */}
              <h2 id="feature-importance" className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. Feature Importance</h2>
              <p>
                What does the model actually look at? Here are the top 10 features by Gini importance:
              </p>

              {/* Bar Chart */}
              <div className="not-prose my-8">
                <div className="space-y-3">
                  {featureImportance.map((f) => (
                    <div key={f.name} className="flex items-center gap-3">
                      <div className="w-44 text-sm text-gray-700 text-right flex-shrink-0">{f.label}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-7 relative overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(f.pct / maxPct) * 100}%` }}
                        >
                          <span className="text-xs font-semibold text-white">{f.pct}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">Gini importance from Random Forest (500 trees, balanced class weights)</p>
              </div>

              <p>The top features tell an interesting story:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>years_active (16.3%)</strong> — The single most important feature. Fraudsters tend to have
                  shorter billing histories. They enter the system, bill aggressively, and get caught (or disappear)
                  within a few years. Legitimate providers have decades-long careers.
                </li>
                <li>
                  <strong>services_per_beneficiary (11.9%)</strong> — How many services per patient. Fraud often involves
                  padding encounters — billing for services that didn&apos;t happen or weren&apos;t medically necessary.
                </li>
                <li>
                  <strong>markup_ratio (8.0%)</strong> — Charge inflation. Fraudulent providers tend to submit charges
                  much higher relative to what Medicare pays, suggesting aggressive overbilling.
                </li>
                <li>
                  <strong>total_services (7.2%)</strong> — Sheer volume. Many fraud schemes are volume plays — doing
                  the same thing thousands of times.
                </li>
                <li>
                  <strong>payment_per_beneficiary (6.8%)</strong> — How much they extract per patient. High values
                  suggest either unnecessary services or high-cost procedure abuse.
                </li>
              </ul>

              {/* 7. Results */}
              <h2 id="results" className="text-2xl font-bold text-gray-900 mt-10 mb-4">7. Results</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Key Findings</h3>
                <ul className="space-y-2 text-green-800">
                  <li>• <strong>500 providers</strong> scored &gt;86% fraud probability</li>
                  <li>• Model correctly flagged providers <strong>later charged by DOJ</strong></li>
                  <li>• Top states: <strong>CA, FL, NY, TX, NJ</strong> — mirrors DOJ enforcement geography</li>
                  <li>• <strong>Internal Medicine (53%) + Family Practice (27%) = 80%</strong> of high-risk flags</li>
                  <li>• Mean AUC: <strong>0.83</strong> across 5-fold cross-validation</li>
                </ul>
              </div>

              <p>
                When we scored all 1.72 million providers, 500 scored above our 86% threshold. These aren&apos;t
                random outliers — they&apos;re providers whose billing patterns statistically resemble confirmed
                fraudsters across multiple dimensions simultaneously.
              </p>
              <p>
                The most compelling validation: we trained the model on LEIE data (providers excluded before or
                during our data window), then checked it against DOJ prosecutions that came <em>after</em>. The
                model had already flagged several of these providers as high-risk. Our data predicted fraud
                before the Department of Justice announced charges.{' '}
                <Link href="/investigations/data-predicted-fraud" className="text-medicare-primary hover:underline">
                  Read the full story →
                </Link>
              </p>
              <p>
                The geographic distribution is also telling. Our top-flagged states — California, Florida, New York,
                Texas, New Jersey — are exactly the states where DOJ has historically concentrated healthcare fraud
                enforcement. The model independently discovered the same geographic patterns.
              </p>
              <p>
                The specialty concentration is notable: 80% of high-risk flags are Internal Medicine or Family Practice.
                This makes sense — these are high-volume, office-visit-heavy specialties where billing fraud is
                easiest to execute and hardest to detect in individual claims.
              </p>

              {/* 8. Limitations & Ethics */}
              <h2 id="limitations" className="text-2xl font-bold text-gray-900 mt-10 mb-4">8. Limitations &amp; Ethics</h2>
              <p>
                We want to be extremely clear about what this model is and isn&apos;t.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">What This Model Is NOT</h3>
                <ul className="space-y-2 text-yellow-800">
                  <li>• <strong>Not an accusation.</strong> A high fraud score means billing patterns statistically resemble
                    confirmed fraudsters. There are many legitimate reasons for unusual billing.</li>
                  <li>• <strong>Not comprehensive.</strong> The model is trained on <em>caught</em> fraudsters. By definition,
                    it may miss sophisticated schemes that haven&apos;t been detected yet.</li>
                  <li>• <strong>Not unbiased.</strong> If LEIE disproportionately includes certain specialties or regions
                    (it does — enforcement resources aren&apos;t evenly distributed), the model inherits that bias.</li>
                  <li>• <strong>Not a replacement for investigation.</strong> Statistical flags are starting points for
                    human review, not conclusions.</li>
                </ul>
              </div>

              <p>
                <strong>Survivorship bias</strong> is our biggest known limitation. We can only train on providers who
                got caught. If there&apos;s a class of sophisticated fraud that systematically evades detection, our
                model won&apos;t learn those patterns. We&apos;re training on the fraud that looks like caught fraud.
              </p>
              <p>
                <strong>Label noise</strong> is another concern. The LEIE includes exclusions for reasons beyond fraud —
                license revocations, controlled substance violations, patient abuse. These providers may have different
                billing patterns than financial fraudsters. We treat all LEIE entries as positive labels, which adds
                noise.
              </p>
              <p>
                We publish this work as a <strong>research and transparency tool</strong>, not as accusations. Every
                provider profile on OpenMedicare includes a disclaimer. We encourage anyone with concerns about a
                specific provider to report to the OIG rather than draw conclusions from statistical models alone.
              </p>

              {/* 9. What's Next */}
              <h2 id="whats-next" className="text-2xl font-bold text-gray-900 mt-10 mb-4">9. What&apos;s Next</h2>
              <p>
                This is v1 of our fraud model. Here&apos;s what we&apos;re working on:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Temporal models</strong> — Year-over-year changes in billing patterns. A provider whose
                  billing doubles overnight is more suspicious than one who&apos;s always billed at high volume.
                  We have 10 years of data; we should use the time dimension.
                </li>
                <li>
                  <strong>Network analysis</strong> — Provider referral patterns. Fraud rings often involve multiple
                  providers referring to each other. Graph-based features could capture this.
                </li>
                <li>
                  <strong>Prescription data integration</strong> — CMS also publishes Medicare Part D prescriber data.
                  Combining billing patterns with prescribing patterns could surface kickback schemes.
                </li>
                <li>
                  <strong>Cleaner labels</strong> — Filtering LEIE to financial fraud exclusions only, excluding
                  license-based exclusions that may not reflect billing fraud.
                </li>
                <li>
                  <strong>Deep learning experiments</strong> — Sequence models on procedure-level billing history,
                  treating each provider&apos;s billing as a time series.
                </li>
              </ul>

              {/* 10. Open Questions */}
              <h2 id="open-questions" className="text-2xl font-bold text-gray-900 mt-10 mb-4">10. Open Questions</h2>
              <p>
                We built this in the open because we believe healthcare transparency benefits from community scrutiny.
                There are questions we haven&apos;t answered — and some we probably haven&apos;t thought to ask.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>How should we handle specialty bias in LEIE? Should we train separate models per specialty?</li>
                <li>Is years_active a leaky feature? (Excluded providers stop billing — does the feature capture exclusion rather than predict it?)</li>
                <li>What&apos;s the right threshold? We used 86% — but the precision/recall tradeoff is a policy decision, not a technical one.</li>
                <li>How do you validate a fraud model when ground truth is inherently incomplete?</li>
                <li>What features are we missing that could separate &quot;unusual but legitimate&quot; from &quot;unusual and fraudulent&quot;?</li>
              </ul>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Explore the Data Yourself</h3>
                <p className="text-purple-800 mb-4">
                  We&apos;ve published the model&apos;s highest-risk flags with full billing breakdowns. Look at the
                  numbers, check our work, and tell us what we&apos;re getting wrong.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/fraud/still-out-there"
                    className="inline-flex items-center px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 text-sm font-medium"
                  >
                    Explore High-Risk Providers →
                  </Link>
                  <Link
                    href="/fraud/watchlist"
                    className="inline-flex items-center px-4 py-2 bg-white text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 text-sm font-medium"
                  >
                    View Full Watchlist →
                  </Link>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> The fraud scores and billing patterns described in this article are
                statistical outputs from a machine learning model trained on publicly available data. They are not
                accusations of fraud. Individual cases may have legitimate explanations. Named providers have not been
                charged with any crime unless otherwise stated. If you suspect fraud, report it to the{' '}
                <a href="tel:1-800-447-8477" className="font-medium underline">OIG Fraud Hotline (1-800-HHS-TIPS)</a>.
              </p>
            </div>

            {/* Related */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Related</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href="/investigations/data-predicted-fraud" className="text-medicare-primary hover:underline text-sm">📊 Our Data Predicted Fraud Before the DOJ</Link>
                <Link href="/investigations/still-out-there" className="text-medicare-primary hover:underline text-sm">🔍 Still Out There: Unflagged Providers</Link>
                <Link href="/investigations/algorithm-knows" className="text-medicare-primary hover:underline text-sm">🤖 The Algorithm Knows</Link>
                <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
              </div>
            </div>

            <ShareButtons
              url="https://www.openmedicare.org/investigations/how-we-built-the-model"
              title="How We Built an ML Fraud Detection Model for 1.7 Million Medicare Providers"
            />

            <div className="mt-6">
              <SourceCitation
                sources={[
                  'Centers for Medicare & Medicaid Services (CMS) — Medicare Physician & Other Practitioners Data (2014–2023)',
                  'HHS Office of Inspector General — List of Excluded Individuals/Entities (LEIE)',
                  'Department of Justice — Healthcare Fraud Prosecution Records',
                  'Government Accountability Office — Medicare Improper Payment Estimates',
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
