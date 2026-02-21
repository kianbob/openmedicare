import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'

export const metadata: Metadata = {
  title: 'Methodology — How We Analyze Medicare Data',
  description: 'Transparent explanation of our data sources, risk score calculations, limitations, and responsible disclosure practices.',
}

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <Breadcrumbs items={[{ name: 'Methodology' }]} />

        <h1 className="mt-8 font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Our Methodology
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Transparency is core to our mission. Here&apos;s exactly how we collect, process, and analyze Medicare data.
        </p>

        <div className="mt-12 prose prose-lg prose-gray max-w-none">
          <section>
            <h2 className="font-serif text-2xl font-bold text-gray-900">Data Source</h2>
            <p>
              All data comes from the <strong>CMS Medicare Provider Utilization and Payment Data</strong>,
              published by the Centers for Medicare &amp; Medicaid Services. This is the same data the federal
              government uses to track Medicare spending.
            </p>
            <ul>
              <li><strong>Dataset:</strong> Medicare Physician &amp; Other Practitioners — by Provider and Service</li>
              <li><strong>Years covered:</strong> 2014–2023 (10 years)</li>
              <li><strong>Scale:</strong> ~96 million rows of physician/supplier claims for Medicare Part B</li>
              <li><strong>Scope:</strong> Every physician, nurse practitioner, and clinical supplier who billed Medicare</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-2xl font-bold text-gray-900">What&apos;s Included</h2>
            <p>
              Each record includes: provider name and NPI, specialty, location, HCPCS procedure code,
              number of services, number of unique beneficiaries, submitted charges, Medicare allowed amount,
              and Medicare payment amount. We aggregate across all years to build provider profiles.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-2xl font-bold text-gray-900">Risk Score Calculation</h2>
            <p>
              Our risk score (0–100) identifies statistical outliers who may warrant further investigation.
              It is <strong>not</strong> a fraud determination. The score combines several signals:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6">1. Specialty Peer Comparison</h3>
            <p>
              How far is a provider from the median in their own specialty? A cardiologist billing 50x the
              median cardiologist stands out more than one billing 2x. We compare total payments, services,
              and beneficiary counts against specialty peers.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6">2. Markup Ratio Analysis</h3>
            <p>
              The ratio between what a provider submits (charges) vs. what Medicare actually pays. While
              some markup is normal, extreme ratios (10x, 25x, or higher) can indicate billing anomalies.
              We compare each provider&apos;s markup to their specialty average.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6">3. Volume Anomalies</h3>
            <p>
              Unusually high service volumes or beneficiary counts relative to peers. A single provider
              seeing more patients than seems physically possible is a meaningful signal.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6">4. Pattern Flags</h3>
            <p>
              Specific billing patterns associated with known fraud schemes: excessive COVID testing
              concentration, wound care billing anomalies, high-cost drug administration patterns, and others.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6">5. Scoring</h3>
            <p>
              Individual signals are weighted and combined using logarithmic scaling to produce a final score
              from 0–100. Logarithmic scaling ensures that extreme outliers are clearly distinguished while
              avoiding false alarms from moderate variations.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-2xl font-bold text-gray-900">What This Is NOT</h2>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 not-prose">
              <p className="text-amber-900 font-medium">
                ⚠️ A high risk score is <strong>not</strong> an accusation of fraud.
              </p>
              <p className="mt-2 text-amber-800">
                It identifies statistical outliers — providers whose billing patterns differ significantly
                from their peers. There may be legitimate reasons: a specialist handling unusually complex cases,
                a provider in an underserved area seeing more patients, or data reporting differences.
              </p>
              <p className="mt-2 text-amber-800">
                Only proper investigation by qualified authorities (CMS, OIG, law enforcement) can determine
                whether actual fraud has occurred.
              </p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-2xl font-bold text-gray-900">Supervised Fraud Detection (ML v2)</h2>
            <p>
              In addition to our statistical approach, we developed a <strong>supervised machine learning model</strong> trained
              on confirmed fraudsters — providers who have been indicted by the DOJ, excluded by the HHS OIG
              (<a href="https://oig.hhs.gov/exclusions/" className="text-medicare-primary hover:underline">LEIE database</a>),
              or who settled False Claims Act cases.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6">Model Details</h3>
            <ul>
              <li><strong>Algorithm:</strong> Random Forest classifier</li>
              <li><strong>Training labels:</strong> 2,198 confirmed fraudsters (LEIE exclusions + DOJ charges)</li>
              <li><strong>Providers scored:</strong> 1,719,625 active Medicare providers</li>
              <li><strong>AUC:</strong> 0.83 — the model correctly ranks a random fraudster above a random legitimate provider 83% of the time</li>
              <li><strong>Flagged:</strong> 500 providers scored above the 86% fraud-match threshold</li>
            </ul>

            <p className="mt-3">
              The model learns what billing patterns caught fraudsters share — volume anomalies, markup ratios,
              specialty concentration, geographic signals, beneficiary patterns — then scores every active provider
              on how closely they resemble confirmed criminals. The result is a &quot;fraud match probability&quot; —
              not proof of fraud, but a statistical measure of resemblance to convicted providers.
            </p>
            <p className="mt-3">
              This approach was validated when our earlier statistical analysis{' '}
              <Link href="/investigations/data-predicted-fraud" className="text-medicare-primary hover:underline">
                flagged providers before the DOJ charged them
              </Link>
              . The supervised model builds on this by learning directly from the ground truth of confirmed fraud.
            </p>
            <p className="mt-3">
              Results are available on our{' '}
              <Link href="/fraud/still-out-there" className="text-medicare-primary hover:underline">
                &quot;Still Out There&quot; page
              </Link>.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-2xl font-bold text-gray-900">Limitations</h2>
            <ul>
              <li><strong>Part B only:</strong> This data covers physician and supplier claims. It does not include hospital inpatient stays (Part A), prescription drugs (Part D), or Medicare Advantage (Part C) plans.</li>
              <li><strong>No clinical context:</strong> We see billing codes, not patient charts. We cannot assess medical necessity.</li>
              <li><strong>Aggregated data:</strong> CMS suppresses data for providers with fewer than 11 beneficiaries for a given service, which may affect small-practice providers.</li>
              <li><strong>Payment ≠ Income:</strong> Medicare payments go to practices and organizations, not necessarily individual providers.</li>
              <li><strong>Historical data:</strong> Patterns may reflect past practices that have since changed.</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-2xl font-bold text-gray-900">How to Use This Data</h2>
            <p>This data is valuable for:</p>
            <ul>
              <li><strong>Journalists</strong> investigating Medicare spending patterns and potential waste</li>
              <li><strong>Researchers</strong> studying healthcare economics, utilization, and geographic variation</li>
              <li><strong>Policymakers</strong> evaluating program integrity and spending trends</li>
              <li><strong>Concerned citizens</strong> understanding how their tax dollars fund healthcare</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-2xl font-bold text-gray-900">Responsible Disclosure</h2>
            <p>
              We do not label any provider as &quot;fraudulent.&quot; We identify statistical outliers and
              present the data transparently so that qualified parties can draw informed conclusions.
              Provider names are included because this is public data published by the federal government,
              but we encourage users to consider context before drawing conclusions.
            </p>
          </section>
        </div>

        <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="font-serif text-xl font-bold text-gray-900">Learn More</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/glossary" className="rounded-lg border border-gray-200 bg-white p-4 hover:border-medicare-primary hover:bg-blue-50 transition-colors">
              <div className="text-sm font-semibold text-gray-900">📖 Glossary</div>
              <div className="text-xs text-gray-500 mt-1">Every Medicare and fraud detection term defined, A-Z</div>
            </Link>
            <Link href="/data-sources" className="rounded-lg border border-gray-200 bg-white p-4 hover:border-medicare-primary hover:bg-blue-50 transition-colors">
              <div className="text-sm font-semibold text-gray-900">📊 Data Sources</div>
              <div className="text-xs text-gray-500 mt-1">Where our data comes from, how fresh it is, and what it contains</div>
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <ShareButtons
            url="https://openmedicare.vercel.app/methodology"
            title="OpenMedicare Methodology"
            description="How we analyze Medicare data — transparent methodology and responsible disclosure"
          />
        </div>

        <div className="mt-8">
          <SourceCitation />
        </div>
      </div>
    </div>
  )
}
