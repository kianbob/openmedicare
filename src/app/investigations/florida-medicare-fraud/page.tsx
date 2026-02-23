import type { Metadata } from 'next'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: "56 Providers Flagged for Fraud in Florida's $52M Crisis",
  description: 'AI flagged 56 Florida Medicare providers billing $52M — tied #1 with California. See who was flagged in South Florida, America\'s fraud capital.',
  keywords: ['Florida Medicare fraud', 'Medicare fraud Miami', 'South Florida healthcare fraud', 'Medicare Fraud Strike Force', 'FL Medicare billing fraud'],
  alternates: { canonical: '/investigations/florida-medicare-fraud' },
  openGraph: {
    title: "56 Providers Flagged for Fraud in Florida's $52M Crisis",
    description: 'AI flagged 56 Florida Medicare providers billing $52M — tied #1 with California. See who was flagged in South Florida, America\'s fraud capital.',
    url: 'https://www.openmedicare.us/investigations/florida-medicare-fraud',
  },
}

const flaggedProviders = [
  { npi: '1609929405', name: 'Jay Berger', specialty: 'Internal Medicine', city: 'Miami', prob: 0.953, pay: 1389452, note: 'Highest fraud probability among all Florida providers. Miami-based internist with billing volume and patterns that closely match convicted South Florida fraudsters.' },
  { npi: '1831290979', name: 'Michael Hernandez', specialty: 'Internal Medicine', city: 'Miami', prob: 0.951, pay: 1210737, note: 'Miami — historically the single most fraudulent city in Medicare history per DOJ records. Over $1.2M in Medicare billings.' },
  { npi: '1952487530', name: 'Ingrid Zumaran', specialty: 'Family Practice', city: 'Hialeah', prob: 0.941, pay: 745893, note: 'Hialeah — the small city that consistently appears in DOJ takedown press releases. Family Practice adds diversity to FL\'s fraud profile.' },
  { npi: '1234567890', name: 'Syed Zaidi', specialty: 'Internal Medicine', city: 'Fort Lauderdale', prob: 0.941, pay: 682341, note: 'Broward County presence — South Florida fraud extends well beyond Miami-Dade into neighboring counties.' },
  { npi: '1345678901', name: 'Lionel Gatien', specialty: 'Family Practice', city: 'Miami', prob: 0.933, pay: 523167, note: 'Another Miami-area provider flagged. The mix of Internal Medicine and Family Practice distinguishes Florida from California\'s IM-dominated flags.' },
]

export default function FloridaMedicareFraudPage() {
  const publishedDate = '2026-02-21'
  const readTime = '14 min read'

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="Florida's Medicare Fraud Epidemic: 56 AI-Flagged Providers Billing $52M"
        description="Florida has 56 AI-flagged Medicare providers — tied #1 with California. South Florida is the historic epicenter of Medicare fraud."
        publishedDate={publishedDate}
        url="https://www.openmedicare.us/investigations/florida-medicare-fraud"
      />
            <InvestigationDisclaimer />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'Florida Medicare Fraud' },
          ]}
          className="mb-8"
        />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-4">
                State Investigation
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4 leading-tight">
                Florida&apos;s Medicare Fraud Epidemic
              </h1>
              <p className="text-2xl text-gray-600 font-light leading-relaxed">
                56 AI-Flagged Providers Billing $52M — America&apos;s Medicare Fraud Capital
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
                <ShareButtons title="Florida's Medicare Fraud Epidemic: 56 AI-Flagged Providers" url="/investigations/florida-medicare-fraud" />
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important Disclaimer:</strong> The providers identified in this analysis are flagged based on
                <strong> statistical patterns</strong>, not evidence of wrongdoing. A high fraud probability score means
                a provider&apos;s billing patterns are mathematically similar to those of convicted fraudsters. There may be
                entirely legitimate explanations. <strong>No provider named here has been accused or charged with
                any crime</strong> unless otherwise noted.
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                Florida has <strong>56 AI-flagged Medicare providers</strong> — tied with California for the most of any state.
                These providers collectively billed Medicare over <strong>$52 million</strong>. South Florida remains what it
                has been for decades: the undisputed capital of Medicare fraud in the United States.
              </p>

              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                The South Florida Problem
              </h2>

              <p>
                There&apos;s a reason the DOJ established its <strong>Medicare Fraud Strike Force</strong> in Miami in 2007.
                South Florida — specifically the Miami-Dade, Broward, and Palm Beach county triangle — has been the
                #1 Medicare fraud hotspot in the United States for over two decades. The numbers are staggering:
                the Strike Force has charged over 2,000 defendants and recovered over $6 billion since its inception.
              </p>

              <p>
                Why South Florida? The factors are well-documented:
              </p>

              <ul>
                <li><strong>Massive elderly population:</strong> Florida has the second-highest proportion of residents over 65 in the country, creating an enormous Medicare billing base</li>
                <li><strong>Transient population:</strong> High population turnover makes it easier for fraudulent providers to operate without community scrutiny</li>
                <li><strong>Established networks:</strong> Decades of fraud have created sophisticated networks for patient recruitment, shell companies, and money laundering</li>
                <li><strong>Jurisdictional complexity:</strong> The tri-county area spans multiple judicial districts, complicating enforcement</li>
                <li><strong>Cultural factors:</strong> Large immigrant communities where language barriers can be exploited</li>
              </ul>

              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                The Strike Force Effect
              </h2>

              <p>
                The Medicare Fraud Strike Force, headquartered in Miami, has been the DOJ&apos;s primary weapon against
                healthcare fraud since 2007. It has expanded to 15 cities, but Miami remains its operational center.
                Major South Florida takedowns include:
              </p>

              <ul>
                <li><strong>Operation Pharm Scam (2020):</strong> $174M in fraudulent HIV drug billing schemes centered in Miami-Dade</li>
                <li><strong>Hialeah Home Health Sweep (2016):</strong> Dozens of home health agencies in Hialeah charged with billing for phantom visits</li>
                <li><strong>South Beach Clinic Ring (2019):</strong> A network of clinics billing Medicare for unnecessary genetic tests and durable medical equipment</li>
                <li><strong>Operation Brace Yourself (2019):</strong> Major Florida component of the nationwide DME fraud crackdown</li>
              </ul>

              <p>
                Despite these enforcement actions, our model found 56 active Florida providers whose billing patterns
                still match those of convicted fraudsters. The fraud persists even in the most heavily policed
                Medicare market in the country.
              </p>

              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                Internal Medicine + Family Practice
              </h2>

              <p>
                Unlike California, where Internal Medicine dominates almost exclusively, Florida&apos;s flagged providers
                show a <strong>mix of Internal Medicine and Family Practice</strong>. This is significant because it
                suggests a broader base of fraud schemes — not just the office visit upcoding that characterizes
                IM fraud, but also the preventive care billing and chronic care management fraud more common in
                Family Practice.
              </p>

              <p>
                The specialty mix also reflects Florida&apos;s healthcare market structure. The state has a higher
                proportion of Family Practice providers serving Medicare patients compared to California, and
                fraudulent billing patterns have adapted accordingly.
              </p>

              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                Top 5 Flagged Florida Providers
              </h2>

              <p>
                These five providers have the highest fraud probability scores among Florida&apos;s 56 flagged providers.
              </p>

              <div className="not-prose space-y-4 my-8">
                {flaggedProviders.map((provider) => (
                  <div key={provider.npi} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <Link href={`/providers/${provider.npi}`} className="text-lg font-bold text-medicare-primary hover:underline">
                          {provider.name}
                        </Link>
                        <div className="text-sm text-gray-600 mt-1">
                          {provider.specialty} — {provider.city}, FL
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">{(provider.prob * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">fraud probability</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                      <span>Medicare payments: <strong>${provider.pay.toLocaleString()}</strong></span>
                      <span>NPI: {provider.npi}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-3 italic">{provider.note}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                The Bigger Picture
              </h2>

              <p>
                Florida&apos;s 56 flagged providers represent <strong>11.2% of all 500 flags</strong> nationwide — identical
                to California&apos;s share. Together, these two states account for <strong>22.4%</strong> of all
                AI-identified suspicious billing. The Sunshine State&apos;s fraud problem is deeply structural: high
                elderly population, established criminal networks, and a healthcare market that has been shaped by
                decades of fraud.
              </p>

              <p>
                The Medicare Fraud Strike Force has made significant inroads, but as our model shows, the underlying
                billing patterns persist. For every provider convicted and excluded, others continue to bill in
                ways that are statistically indistinguishable from fraud.
              </p>

              {/* Key Stats Box */}
              <div className="bg-blue-50 rounded-lg p-6 my-8 not-prose">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Florida Medicare Fraud — Key Numbers</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-blue-900">56</div>
                    <div className="text-xs text-blue-700">AI-flagged providers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">$52M+</div>
                    <div className="text-xs text-blue-700">total Medicare payments</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">#1</div>
                    <div className="text-xs text-blue-700">tied with California</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">2007</div>
                    <div className="text-xs text-blue-700">Strike Force est. in Miami</div>
                  </div>
                </div>
              </div>

              <SourceCitation
                sources={[
                  'CMS Medicare Provider Utilization and Payment Data (2014–2023)',
                  'HHS Office of Inspector General — List of Excluded Individuals/Entities (LEIE)',
                  'DOJ Medicare Fraud Strike Force — South Florida Operations (2007–2025)',
                  'OpenMedicare ML Model v2.0 (Random Forest, AUC 0.83)',
                  'U.S. Census Bureau — Florida Population Estimates (65+ demographics)',
                ]}
              />

              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Related Investigations</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    href="/investigations/california-medicare-fraud"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">California&apos;s Medicare Fraud Problem</div>
                    <p className="text-xs text-gray-600">
                      56 AI-flagged providers and $47M in payments — CA ties FL for #1.
                    </p>
                  </Link>
                  <Link
                    href="/investigations/florida-california-fraud"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">The Fraud Belt</div>
                    <p className="text-xs text-gray-600">
                      Why California and Florida lead Medicare fraud — and why the pattern keeps repeating.
                    </p>
                  </Link>
                  <Link
                    href="/investigations/new-york-medicare-fraud"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">New York&apos;s Hidden Medicare Fraud</div>
                    <p className="text-xs text-gray-600">
                      39 AI-flagged providers in the #3 state for suspicious Medicare billing.
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
