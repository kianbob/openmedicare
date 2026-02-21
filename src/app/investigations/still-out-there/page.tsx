import ArticleJsonLd from "@/components/ArticleJsonLd"
import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'

export const metadata: Metadata = {
  title: 'Still Out There: The Providers Who Bill Like Criminals',
  description: 'Our AI model trained on 8,300+ confirmed Medicare fraudsters found hundreds of providers with identical billing patterns who haven\'t been caught. Here\'s what the algorithm sees.',
  openGraph: {
    title: 'Still Out There: The Providers Who Bill Like Criminals',
    description: 'AI trained on caught fraudsters finds hundreds of providers with identical patterns still billing Medicare.',
    url: 'https://www.openmedicare.org/investigations/still-out-there',
  },
}

export default function StillOutThereArticle() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArticleJsonLd title="Still Out There: The Providers Who Bill Like Criminals" description="AI trained on 8300+ confirmed fraudsters finds providers with identical patterns" url="/investigations/still-out-there" publishedDate="2026-02-21" />
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: 'Still Out There' }]} />

        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold font-serif text-gray-900 mt-6 mb-2">
            Still Out There: The Providers Who Bill Like Criminals
          </h1>
          <p className="text-sm text-gray-500 mb-8">Published February 2026 · OpenMedicare Investigation</p>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 not-prose">
            <p className="text-red-800 font-medium">
              What if you could teach a computer to recognize fraud — not from rules, but from real criminals?
              That&apos;s exactly what we did.
            </p>
          </div>

          <p>
            Most fraud detection systems use rules: billing too much, seeing too many patients, charging too high. 
            Those approaches catch outliers, but they miss the clever ones — the providers who game the system 
            just enough to stay under the radar.
          </p>

          <p>
            We took a different approach. We collected the billing records of <strong>every Medicare provider 
            confirmed as a fraudster</strong> — providers on the HHS OIG exclusion list, indicted by the DOJ, 
            or who paid settlements under the False Claims Act. Over 8,300 confirmed bad actors.
          </p>

          <p>
            Then we trained a machine learning model to answer one question: <em>&quot;What does a fraudster&apos;s 
            billing look like?&quot;</em>
          </p>

          <h2>The Model</h2>

          <p>
            Our Random Forest classifier analyzed 17 billing features across 1.7 million Medicare providers — 
            everything from services-per-day and markup ratios to code concentration and specialty deviation. 
            The model learned what patterns caught fraudsters share.
          </p>

          <p>
            Then we ran it on everyone else.
          </p>

          <p>
            The results were sobering. Hundreds of providers — currently billing Medicare, currently seeing 
            patients, currently getting paid — match the exact patterns of people who went to prison.
          </p>

          <h2>What the Model Sees</h2>

          <p>
            The most important features for predicting fraud aren&apos;t the ones you&apos;d expect. 
            It&apos;s not just about billing a lot of money. The model learned that <strong>the combination 
            of features</strong> matters more than any single red flag:
          </p>

          <ul>
            <li><strong>Services-per-day</strong> — How many procedures they bill per working day</li>
            <li><strong>Code concentration</strong> — Do they bill the same codes over and over?</li>
            <li><strong>Specialty deviation</strong> — How different are they from peers in their specialty?</li>
            <li><strong>Markup patterns</strong> — Do they consistently charge far above Medicare rates?</li>
            <li><strong>Beneficiary-to-service ratio</strong> — Are they seeing real patients, or churning numbers?</li>
          </ul>

          <p>
            Caught fraudsters tend to score high on <em>multiple</em> features simultaneously. 
            A provider who bills a lot but has normal code diversity and typical markup is probably just busy. 
            A provider who bills a lot, with extreme code concentration, unusual markup, and impossible 
            patient volumes? That&apos;s a pattern the model recognizes.
          </p>

          <h2>Validation: We Already Proved This Works</h2>

          <p>
            Before deploying this model, we had already demonstrated that our earlier statistical approach 
            could identify fraudsters before law enforcement caught them. In our{' '}
            <Link href="/investigations/data-predicted-fraud" className="text-medicare-primary hover:underline">
              &quot;Our Data Predicted It&quot;
            </Link>{' '}
            investigation, we showed that our algorithm had flagged providers who were later charged 
            by the DOJ in June 2025 — months before the indictments.
          </p>

          <p>
            This supervised model takes that approach further. Instead of finding statistical outliers 
            and hoping they&apos;re fraud, we&apos;re finding providers who look <em>specifically</em> like 
            people who committed fraud.
          </p>

          <h2>A Tool, Not a Verdict</h2>

          <p>
            We want to be clear: a high fraud-match score is not an accusation. Many providers flagged by 
            this model may have perfectly legitimate reasons for unusual billing patterns. Academic medical 
            centers, high-volume surgical practices, and providers in underserved areas often look like 
            outliers in the data.
          </p>

          <p>
            But the question this model asks is important: <em>If a provider bills exactly like people who 
            went to prison, shouldn&apos;t someone at least look?</em>
          </p>

          <p>
            <Link href="/fraud/still-out-there" className="text-medicare-primary hover:underline font-semibold">
              → Explore the full &quot;Still Out There&quot; list →
            </Link>
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 not-prose">
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> This analysis is based on publicly available CMS Medicare data 
              and uses statistical modeling for public transparency purposes. No provider listed should be 
              assumed to be committing fraud. Report suspected fraud:{' '}
              <a href="tel:1-800-447-8477" className="underline font-medium">1-800-HHS-TIPS</a>.
            </p>
          </div>
        </article>

        {/* Related Investigations */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Investigations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/investigations/data-predicted-fraud" className="text-medicare-primary hover:underline text-sm">📰 Our Data Predicted It — Algorithm vs DOJ</Link>
            <Link href="/investigations/three-providers" className="text-medicare-primary hover:underline text-sm">🔍 Three Providers, Three Red Flags</Link>
            <Link href="/fraud/still-out-there" className="text-medicare-primary hover:underline text-sm">🤖 Still Out There — Full ML Results</Link>
            <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline text-sm">🚨 Enhanced Watchlist — Statistical Flags</Link>
            <Link href="/investigations/arizona-wound-care-ring" className="text-medicare-primary hover:underline text-sm">🏜️ Arizona Wound Care Ring</Link>
            <Link href="/methodology" className="text-medicare-primary hover:underline text-sm">📊 Our Methodology</Link>
          </div>
        </div>

        <ShareButtons url="https://www.openmedicare.org/investigations/still-out-there" title="Still Out There: The Providers Who Bill Like Criminals" />
        <div className="mt-6">
          <SourceCitation sources={[
            'CMS Medicare Provider Utilization and Payment Data (2014-2023)',
            'HHS OIG List of Excluded Individuals/Entities (LEIE)',
            'DOJ Healthcare Fraud Enforcement Actions (2020-2025)',
          ]} lastUpdated="February 2026" />
        </div>
      </div>
    </div>
  )
}
