import ArticleJsonLd from "@/components/ArticleJsonLd"
import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'

export const metadata: Metadata = {
  title: '500 Providers Still Billing Like Fraudsters',
  description: 'ML model trained on 2,198 convicted Medicare fraudsters flags 500 active providers matching fraud patterns at 86%+ probability. $400M in payments exposed.',
  openGraph: {
    title: '500 Providers Still Billing Like Fraudsters',
    description: 'ML model trained on 2,198 convicted Medicare fraudsters flags 500 active providers matching fraud patterns at 86%+ probability. $400M in payments exposed.',
    url: 'https://www.openmedicare.us/investigations/still-out-there',
  },
}

export default function StillOutThereArticle() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArticleJsonLd title="Still Out There: 500 Providers Who Bill Like Convicted Fraudsters" description="ML model trained on 2,198 confirmed fraudsters flags 500 active providers matching fraud patterns" url="/investigations/still-out-there" publishedDate="2026-02-21" />
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: 'Still Out There' }]} />

        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold font-serif text-gray-900 mt-6 mb-2">
            Still Out There: 500 Providers Who Bill Like Convicted Fraudsters
          </h1>
          <p className="text-sm text-gray-500 mb-8">Published February 2026 · OpenMedicare Investigation</p>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 not-prose">
            <p className="text-red-800 font-medium">
              We trained a machine learning model on 2,198 confirmed Medicare fraudsters. Then we scored
              every provider in America. 500 of them matched fraud patterns with over 86% probability —
              and they&apos;re still billing Medicare today.
            </p>
          </div>

          <p>
            Most fraud detection uses rules: flag anyone who bills above a threshold, sees too many patients,
            or charges too much. That catches the obvious cases. But the providers who study the system — who
            know exactly where the tripwires are — slip through.
          </p>

          <p>
            We tried something different. We collected the billing fingerprints of <strong>2,198 providers
            confirmed as fraudsters</strong> — every provider on the HHS OIG exclusion list (LEIE) and those
            prosecuted by the Department of Justice for healthcare fraud. Real criminals. Real convictions.
          </p>

          <p>
            Then we asked a machine learning model one question: <em>&quot;What does a fraudster&apos;s
            billing look like?&quot;</em>
          </p>

          <p>
            It scored <strong>1,719,625 Medicare providers</strong>. Five hundred of them came back above
            86% fraud-match probability.
          </p>

          <h2>The Model: 83% Accuracy at Identifying Fraud</h2>

          <p>
            Our Random Forest classifier achieved an <strong>AUC of 0.8298</strong> — meaning it correctly
            distinguishes between fraudulent and legitimate providers 83% of the time. That&apos;s not
            perfect, and we don&apos;t pretend it is. But it&apos;s far better than chance, and far better
            than most rule-based systems.
          </p>

          <p>
            The model analyzed billing features across every Medicare provider in the country, learning
            which combinations of behaviors separate convicted fraudsters from everyone else. What it found
            was revealing.
          </p>

          <h2>What the Algorithm Learned</h2>

          <p>
            The three most predictive features weren&apos;t the ones you&apos;d guess. It&apos;s not just
            about billing big numbers:
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 not-prose my-6">
            <h3 className="font-semibold text-gray-900 mb-3">Top Model Features by Importance</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Years Active</span>
                  <span className="text-gray-600">16.3%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Services per Beneficiary</span>
                  <span className="text-gray-600">11.9%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: '73%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Markup Ratio</span>
                  <span className="text-gray-600">8.0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-300 h-2 rounded-full" style={{ width: '49%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <p>
            <strong>Years active</strong> was the single most important feature — accounting for 16.3% of
            the model&apos;s decision-making. Fraudsters tend to operate within a specific window: long
            enough to build a billing pattern, but the data captures their trajectory differently than
            career physicians. The model picks up on this temporal signature.
          </p>

          <p>
            <strong>Services per beneficiary</strong> (11.9%) captures patient churning — how many procedures
            a provider bills per patient. Legitimate high-volume providers see many patients. Fraudulent ones
            tend to bill many services <em>per</em> patient, padding each encounter.
          </p>

          <p>
            <strong>Markup ratio</strong> (8%) measures how aggressively a provider charges above Medicare
            rates. Some markup is normal. But convicted fraudsters consistently push this further than
            their peers.
          </p>

          <p>
            The model learned that it&apos;s the <em>combination</em> that matters. A high markup alone
            means little. High markup <em>plus</em> inflated services-per-patient <em>plus</em> the right
            temporal pattern? That&apos;s what convicted fraudsters look like.
          </p>

          <h2>The Top Flagged Providers</h2>

          <p>
            At the top of the list sits{' '}
            <Link href="/providers/1659378743" className="text-medicare-primary hover:underline font-semibold">
              Ramesh Thimmiah
            </Link>
            , an internal medicine physician in West Virginia, with a <strong>95.9% fraud-match
            probability</strong>. His billing profile — $789K in Medicare payments, a 2.28x markup ratio,
            and 2.4 services per beneficiary — closely mirrors patterns the model learned from convicted
            providers.
          </p>

          <p>
            Right behind him:
          </p>

          <div className="overflow-x-auto not-prose my-6">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Rank</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Provider</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">State</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">Score</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">Payments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">1</td>
                  <td className="px-4 py-2"><Link href="/providers/1659378743" className="text-medicare-primary hover:underline">Ramesh Thimmiah</Link></td>
                  <td className="px-4 py-2">Internal Medicine</td>
                  <td className="px-4 py-2">WV</td>
                  <td className="px-4 py-2 text-right font-mono">95.9%</td>
                  <td className="px-4 py-2 text-right">$789K</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2</td>
                  <td className="px-4 py-2"><Link href="/providers/1972524510" className="text-medicare-primary hover:underline">Frank Leung</Link></td>
                  <td className="px-4 py-2">Endocrinology</td>
                  <td className="px-4 py-2">IL</td>
                  <td className="px-4 py-2 text-right font-mono">95.7%</td>
                  <td className="px-4 py-2 text-right">$602K</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">3</td>
                  <td className="px-4 py-2"><Link href="/providers/1245366558" className="text-medicare-primary hover:underline">Tuan Duong</Link></td>
                  <td className="px-4 py-2">Internal Medicine</td>
                  <td className="px-4 py-2">CA</td>
                  <td className="px-4 py-2 text-right font-mono">95.6%</td>
                  <td className="px-4 py-2 text-right">$517K</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">4</td>
                  <td className="px-4 py-2"><Link href="/providers/1871637157" className="text-medicare-primary hover:underline">Willie Lucas</Link></td>
                  <td className="px-4 py-2">Internal Medicine</td>
                  <td className="px-4 py-2">MS</td>
                  <td className="px-4 py-2 text-right font-mono">95.5%</td>
                  <td className="px-4 py-2 text-right">$1.02M</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">5</td>
                  <td className="px-4 py-2"><Link href="/providers/1063460939" className="text-medicare-primary hover:underline">John Daconti</Link></td>
                  <td className="px-4 py-2">Internal Medicine</td>
                  <td className="px-4 py-2">NJ</td>
                  <td className="px-4 py-2 text-right font-mono">94.9%</td>
                  <td className="px-4 py-2 text-right">$547K</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Four of the top five are in internal medicine. That&apos;s not a coincidence — it&apos;s a pattern
            that runs through the entire dataset.
          </p>

          <h2>The Specialty Problem: Internal Medicine Dominates</h2>

          <p>
            Of the 500 flagged providers, <strong>263 practice internal medicine</strong> — more than half.
            Another <strong>135 are in family practice</strong>. Together, these two specialties account for
            nearly 80% of all flags.
          </p>

          <p>
            This makes sense when you understand how Medicare fraud works. Internal medicine and family
            practice are high-volume, office-visit-heavy specialties with enormous billing flexibility.
            A provider can see dozens of patients a day, upcode visit complexity, order unnecessary tests,
            and bill for services that are nearly impossible to audit from claims data alone. The same
            features that make these specialties essential to healthcare make them vulnerable to exploitation.
          </p>

          <p>
            The remaining flags scatter across specialties including anesthesiology, endocrinology,
            cardiology, and others — but the concentration in primary care is striking.
          </p>

          <h2>The Geography of Fraud Patterns</h2>

          <p>
            The geographic distribution tells its own story:
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 not-prose my-6">
            <h3 className="font-semibold text-gray-900 mb-3">Top States by Flagged Providers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">56</div>
                <div className="text-sm text-gray-600">California</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">56</div>
                <div className="text-sm text-gray-600">Florida</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">39</div>
                <div className="text-sm text-gray-600">New York</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">36</div>
                <div className="text-sm text-gray-600">Texas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">33</div>
                <div className="text-sm text-gray-600">New Jersey</div>
              </div>
            </div>
          </div>

          <p>
            California and Florida tie at 56 flagged providers each — together representing more than a
            fifth of the entire list. These are the same states that have historically dominated DOJ
            healthcare fraud prosecutions. Southern Florida, in particular, has long been called the
            &quot;Medicare fraud capital of America.&quot; Our model, trained on the billing patterns of
            people caught there and elsewhere, is finding more providers in the same regions with the
            same signatures.
          </p>

          <p>
            New York (39), Texas (36), and New Jersey (33) round out the top five — all states with
            large Medicare populations and, historically, significant fraud enforcement activity.
          </p>

          <h2>$400 Million Still Flowing</h2>

          <p>
            The 500 flagged providers collectively received approximately <strong>$400 million in Medicare
            payments</strong>. That&apos;s taxpayer money flowing to providers whose billing patterns are
            statistically indistinguishable from convicted criminals.
          </p>

          <p>
            To be clear: we don&apos;t know how much of that $400 million is fraudulent. Some of these
            providers may be entirely legitimate. But the model is saying something simple and important:
            these billing profiles look like fraud. If even a fraction of these flags are real, tens of
            millions of dollars are walking out the door.
          </p>

          <h2>Validation: The Model Already Works</h2>

          <p>
            This isn&apos;t theoretical. In our{' '}
            <Link href="/investigations/data-predicted-fraud" className="text-medicare-primary hover:underline">
              &quot;Our Data Predicted It&quot;
            </Link>{' '}
            investigation, we showed that our earlier statistical approach had flagged providers who were
            later charged by the DOJ in June 2025 — months before the indictments were unsealed.
          </p>

          <p>
            This v2 model is more sophisticated. It was trained directly on the billing fingerprints of
            confirmed fraudsters, not just statistical outliers. An 83% AUC means it&apos;s learned
            real discriminative patterns — the kind of signal that should be informing enforcement
            decisions.
          </p>

          <h2>A Tool, Not a Verdict</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-6 not-prose">
            <p className="text-amber-900 text-sm">
              <strong>Important:</strong> A high fraud-match score is a statistical flag, not an accusation.
              These providers have not been charged with any crime. Many may have legitimate reasons for
              unusual billing — academic medical centers, high-acuity patient panels, underserved areas,
              or specialty procedures that naturally produce outlier billing.
            </p>
          </div>

          <p>
            We publish this data because transparency matters. The public has a right to see how their
            healthcare dollars are spent, and to understand which billing patterns raise questions. But
            a flag from a machine learning model — even a good one — is a starting point for investigation,
            not a conclusion.
          </p>

          <p>
            The question we&apos;re asking is simple: <em>If 500 providers bill exactly like people who
            went to prison for Medicare fraud, shouldn&apos;t someone at least look?</em>
          </p>

          <p>
            <Link href="/fraud/still-out-there" className="text-medicare-primary hover:underline font-semibold">
              → Explore the full &quot;Still Out There&quot; list of 500 flagged providers →
            </Link>
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 not-prose">
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> This analysis is based on publicly available CMS Medicare data
              and uses statistical modeling for public transparency purposes. A fraud-match probability is
              not evidence of fraud. No provider listed should be assumed to be committing fraud. The model
              has an AUC of 0.83, meaning it produces both false positives and false negatives. Report
              suspected fraud:{' '}
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

        <ShareButtons url="https://www.openmedicare.us/investigations/still-out-there" title="Still Out There: 500 Providers Who Bill Like Convicted Fraudsters" />
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
