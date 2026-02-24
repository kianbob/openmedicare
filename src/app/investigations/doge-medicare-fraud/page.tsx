import ArticleJsonLd from "@/components/ArticleJsonLd"
import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'

export const metadata: Metadata = {
  title: 'DOGE vs. Medicare Fraud: $60B Lost, 500 AI Flags',
  description: 'DOGE wants to cut waste. We analyzed $854B in Medicare data and flagged 500 providers matching convicted fraudsters. Here\'s the roadmap they need.',
  keywords: ['DOGE medicare', 'DOGE medicare fraud', 'department of government efficiency medicare', 'DOGE healthcare waste', 'elon musk medicare', 'government efficiency medicare'],
  openGraph: {
    title: 'DOGE vs. Medicare Fraud: $60B Lost, 500 AI Flags',
    description: 'DOGE wants to cut waste. We analyzed $854B in Medicare data and flagged 500 providers matching convicted fraudsters. Here\'s the roadmap they need.',
  },
  alternates: {
    canonical: '/investigations/doge-medicare-fraud',
  },
}

export default function DogeMedicareFraudPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ArticleJsonLd title="What DOGE Should Know About Medicare Fraud" description="$854B in data, 500 AI flags, and the patterns DOGE should target" url="https://www.openmedicare.us/investigations/doge-medicare-fraud" publishedDate="2026-02-21" />
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'DOGE & Medicare Fraud' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Analysis</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            What DOGE Should Know About Medicare Fraud: $854B in Data, 500 AI Flags
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 15 min read</p>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-yellow-900 font-medium text-lg">The Bottom Line</p>
            <p className="text-yellow-800 mt-2">
              The Department of Government Efficiency (DOGE) is looking for waste. Medicare is the biggest target:
              <strong> $854.8 billion</strong> in physician payments alone, an estimated <strong>$60+ billion</strong> lost
              to fraud annually, and <strong>1.72 million providers</strong> billing the system. We built an AI model that
              flagged <strong>500 providers</strong> matching convicted fraudster patterns. Here&apos;s the roadmap DOGE needs.
            </p>
          </div>

          <ShareButtons title="What DOGE Should Know About Medicare Fraud" url="https://www.openmedicare.us/investigations/doge-medicare-fraud" />

          <InvestigationDisclaimer />

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Medicare Is the Biggest Efficiency Problem in Government</h2>
          <p className="text-gray-700 mb-4">
            Forget the $400 hammers. Medicare is where the real money is. The program spent approximately <strong>$1 trillion</strong> in
            total in 2023 — with $854.8 billion going to physician and supplier payments alone. The HHS Office of Inspector General
            estimates that <strong>$60 billion or more</strong> is lost to fraud, waste, and abuse every year. Some estimates run
            as high as $100 billion.
          </p>
          <p className="text-gray-700 mb-4">
            That means Medicare fraud alone likely exceeds the entire budget of the Department of Homeland Security.
            If DOGE is serious about cutting government waste, this is ground zero.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What the Data Actually Shows</h2>
          <p className="text-gray-700 mb-4">
            We analyzed every line of the CMS Medicare Physician and Other Supplier Payment dataset — <strong>96 million rows</strong> of
            billing data covering <strong>1.72 million providers</strong>. We then trained a machine learning model on{' '}
            <strong>8,300+ confirmed fraud cases</strong> from the LEIE (List of Excluded Individuals/Entities) and DOJ prosecution records.
          </p>
          <p className="text-gray-700 mb-4">
            The model (a Random Forest classifier with an AUC of 0.83) flagged <strong>500 currently active providers</strong> whose
            billing patterns statistically match convicted Medicare criminals. These aren&apos;t random — at least 6 of the
            flagged providers were subsequently charged by the DOJ in the{' '}
            <Link href="/investigations/medicare-fraud-2025" className="text-blue-600 hover:text-blue-800">
              largest healthcare fraud takedown in history
            </Link>.
          </p>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 not-prose">
            <h3 className="font-bold text-gray-900 mb-4">DOGE Dashboard: Medicare by the Numbers</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Payments', value: '$854.8B', color: 'text-blue-700' },
                { label: 'Providers', value: '1.72M', color: 'text-gray-700' },
                { label: 'AI Fraud Flags', value: '500', color: 'text-red-700' },
                { label: 'Est. Annual Fraud', value: '$60B+', color: 'text-red-700' },
                { label: 'Billed Charges', value: '$3.22T', color: 'text-gray-700' },
                { label: 'Written Off', value: '$2.14T', color: 'text-amber-700' },
                { label: 'Confirmed Fraudsters', value: '8,300+', color: 'text-gray-700' },
                { label: 'Active Investigations', value: '53', color: 'text-red-700' },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The 5 Biggest Fraud Patterns DOGE Should Target</h2>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Wound Care Schemes ($14.6B in DOJ Takedowns)</h3>
          <p className="text-gray-700 mb-4">
            Wound care is the #1 Medicare fraud vector in 2025. Skin substitute products and debridement procedures
            have been exploited through phantom billing, kickback schemes with manufacturers, and billing for products
            never applied. The DOJ&apos;s June 2025 takedown — the largest ever — was dominated by wound care cases.
          </p>
          <p className="text-gray-700 mb-4">
            Our data confirms it: we found providers billing skin substitutes at <strong>60x markup ratios</strong>, nurse practitioners
            in Phoenix billing <strong>$514 million for 2,974 patients</strong>, and Beverly Hills plastic surgeons billing
            wound care instead of cosmetic procedures.
          </p>
          <p className="text-gray-700 mb-2">
            <Link href="/investigations/wound-care-crisis" className="text-blue-600 hover:text-blue-800">Read: The Wound Care Industrial Complex →</Link>
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/investigations/arizona-wound-care-ring" className="text-blue-600 hover:text-blue-800">Read: The Arizona Wound Care Ring →</Link>
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Impossible Billing Volumes</h3>
          <p className="text-gray-700 mb-4">
            We identified providers billing <strong>400+ services per day</strong> — one every 1-2 minutes for 8 hours
            straight. The most extreme case: a single provider who billed <strong>2.47 million services</strong> in 2023,
            or <strong>9,862 per working day</strong>. That&apos;s one service every 2.9 seconds.
          </p>
          <p className="text-gray-700 mb-4">
            These aren&apos;t rounding errors. They&apos;re either outright fraud or systemic billing abuses that CMS
            should catch automatically but doesn&apos;t. A simple volume cap — already used by private insurers — would
            save billions.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/investigations/9862-services-per-day" className="text-blue-600 hover:text-blue-800">Read: 9,862 Services Per Day →</Link>
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. COVID Test Billing Abuse</h3>
          <p className="text-gray-700 mb-4">
            When CMS created the K1034 code for over-the-counter COVID tests at ~$12 each, some providers saw an ATM.
            Individual providers billed millions in COVID tests — with some shipping unrequested tests to seniors&apos; homes
            and billing Medicare. The fraud was so pervasive that NPR documented cases of seniors receiving tests they never ordered.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/investigations/covid-test-scheme" className="text-blue-600 hover:text-blue-800">Read: The COVID Test Gold Rush →</Link>
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. The Upcoding Epidemic</h3>
          <p className="text-gray-700 mb-4">
            Upcoding — billing for a more expensive service than was actually provided — is the most common form of
            Medicare fraud. The difference between a Level 3 office visit (99213, ~$92) and a Level 4 (99214, ~$130)
            is subjective, and providers know it. Our analysis of the <strong>$117.7 billion office visit economy</strong> found
            systematic shifts toward higher-level codes across specialties.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/fraud/upcoding" className="text-blue-600 hover:text-blue-800">Explore: The Upcoding Detector →</Link>
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Geographic Fraud Hotspots</h3>
          <p className="text-gray-700 mb-4">
            Medicare fraud isn&apos;t evenly distributed. Five states — <strong>California, Florida, New York, Texas,
            and New Jersey</strong> — account for over half of all AI-flagged providers. South Florida alone has been
            called the &quot;Medicare fraud capital of the world.&quot; Targeted enforcement in these hotspots would
            yield the highest return on investment.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/investigations/florida-california-fraud" className="text-blue-600 hover:text-blue-800">Read: The Fraud Belt →</Link>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What DOGE Could Actually Do</h2>
          <p className="text-gray-700 mb-4">
            Based on our data analysis, here are concrete, implementable actions:
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 not-prose">
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-lg">🤖</span>
                <div>
                  <p className="font-semibold text-gray-900">Deploy AI Pre-Payment Review</p>
                  <p className="text-sm text-gray-600">
                    Our model flags suspicious claims with 0.83 AUC accuracy. CMS currently does most fraud detection
                    <em> after</em> payment. Shifting to pre-payment AI screening — like credit card fraud detection —
                    could prevent billions in improper payments before they go out the door.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">📊</span>
                <div>
                  <p className="font-semibold text-gray-900">Implement Real-Time Volume Caps</p>
                  <p className="text-sm text-gray-600">
                    No solo practitioner can legitimately bill 400+ services per day. Private insurers already use
                    automated volume limits. CMS doesn&apos;t. Adding this single rule would immediately flag the most
                    egregious billing abuse.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">🔍</span>
                <div>
                  <p className="font-semibold text-gray-900">Audit the Top 500 Flagged Providers</p>
                  <p className="text-sm text-gray-600">
                    Our model identified 500 providers whose billing patterns match convicted fraudsters. A targeted
                    audit of these 500 — rather than random sampling — would yield significantly higher fraud recovery
                    per audit dollar spent. At least 6 were already confirmed by DOJ action.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">💰</span>
                <div>
                  <p className="font-semibold text-gray-900">Close the Wound Care Loophole</p>
                  <p className="text-sm text-gray-600">
                    Skin substitute products have virtually no billing limits. A single nurse practitioner can bill
                    $22 million in wound care products with no automated review. Prior authorization for high-cost
                    skin substitutes would save billions immediately.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">📱</span>
                <div>
                  <p className="font-semibold text-gray-900">Make the Data Public and Searchable</p>
                  <p className="text-sm text-gray-600">
                    CMS publishes raw data files, but they&apos;re nearly impossible for the public to use. That&apos;s
                    why we built OpenMedicare. If CMS provided a real-time, searchable interface — like what we&apos;ve
                    built — public oversight would multiply government enforcement efforts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The $2.14 Trillion Nobody Talks About</h2>
          <p className="text-gray-700 mb-4">
            Here&apos;s a number DOGE should know: providers submitted <strong>$3.22 trillion</strong> in charges to Medicare in 2023.
            Medicare paid $854.8 billion. The other <strong>$2.14 trillion</strong> was simply written off. This 3.8x markup
            ratio — providers charging nearly 4x what they get paid — is the biggest hidden number in American healthcare.
          </p>
          <p className="text-gray-700 mb-4">
            While the writeoff doesn&apos;t directly cost taxpayers (Medicare pays the allowed amount, not the charged amount),
            these inflated charges flow into private insurance pricing, out-of-network billing, and uninsured patient bills.
            The system-wide waste is staggering.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/investigations/two-trillion-writeoff" className="text-blue-600 hover:text-blue-800">
              Read: The $2.1 Trillion Writeoff →
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why This Matters Now</h2>
          <p className="text-gray-700 mb-4">
            The Department of Government Efficiency has positioned itself as a data-driven reformer. Medicare fraud is
            the ultimate test case: it&apos;s measurable, the data is public, AI tools already exist, and the savings
            potential is enormous. If DOGE can&apos;t make a dent in Medicare fraud — with $60+ billion in annual losses
            and ready-made AI detection tools — it&apos;s hard to argue it can reform anything.
          </p>
          <p className="text-gray-700 mb-4">
            The data is here. The tools are here. The question is whether there&apos;s political will to go after the
            healthcare industry&apos;s most profitable actors.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Explore the Data Yourself</h2>
          <ul className="text-gray-700 mb-4">
            <li><Link href="/fraud/watchlist" className="text-blue-600 hover:text-blue-800">🚨 AI Fraud Watchlist — 500 flagged providers</Link></li>
            <li><Link href="/providers" className="text-blue-600 hover:text-blue-800">🔍 Search any Medicare provider</Link></li>
            <li><Link href="/states" className="text-blue-600 hover:text-blue-800">📊 State-by-state spending data</Link></li>
            <li><Link href="/fraud" className="text-blue-600 hover:text-blue-800">🔬 Full fraud analysis hub</Link></li>
            <li><Link href="/investigations/how-we-built-the-model" className="text-blue-600 hover:text-blue-800">🤖 How we built the ML model</Link></li>
          </ul>

          <SourceCitation />

          <div className="mt-8 p-6 bg-gray-100 rounded-lg not-prose">
            <h3 className="font-bold text-gray-900 mb-2">Related Investigations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/investigations/medicare-fraud-2025" className="text-blue-600 hover:text-blue-800 text-sm">
                ⚖️ Medicare Fraud in 2025: Biggest Cases
              </Link>
              <Link href="/investigations/data-predicted-fraud" className="text-blue-600 hover:text-blue-800 text-sm">
                🎯 Our Data Predicted It: AI vs DOJ
              </Link>
              <Link href="/investigations/still-out-there" className="text-blue-600 hover:text-blue-800 text-sm">
                👻 Still Out There: Unflagged Providers
              </Link>
              <Link href="/investigations/algorithm-knows" className="text-blue-600 hover:text-blue-800 text-sm">
                🧠 How AI Detects Fraud Before Humans
              </Link>
            </div>
          </div>

          <ShareButtons title="What DOGE Should Know About Medicare Fraud" url="https://www.openmedicare.us/investigations/doge-medicare-fraud" />
        </article>
      </div>
    </main>
  )
}
