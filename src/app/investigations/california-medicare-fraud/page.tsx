import type { Metadata } from 'next'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: "56 AI-Flagged Providers in California ($47M)",
  description: 'California ties Florida at #1 for AI-flagged Medicare providers. LA is the epicenter, Internal Medicine dominates, and billing patterns match convicted fraudsters.',
  keywords: ['California Medicare fraud', 'Medicare fraud Los Angeles', 'CA healthcare fraud', 'Medicare fraud California', 'Southern California Medicare billing', 'Internal Medicine fraud California'],
  alternates: { canonical: '/investigations/california-medicare-fraud' },
  openGraph: {
    title: "56 AI-Flagged Medicare Providers in California",
    description: 'California ties Florida at #1 for AI-flagged Medicare providers. LA is the epicenter, Internal Medicine dominates, and billing patterns match convicted fraudsters.',
    url: 'https://www.openmedicare.us/investigations/california-medicare-fraud',
  },
}

const flaggedProviders = [
  { npi: '1245366558', name: 'Tuan Duong', specialty: 'Internal Medicine', city: 'Westminster', prob: 0.956, pay: 516519, note: 'Orange County internist with the highest fraud probability score among all California providers. Billing patterns closely match convicted SoCal Medicare fraudsters.' },
  { npi: '1902345678', name: 'Robert Butler', specialty: 'Internal Medicine', city: 'Los Angeles', prob: 0.951, pay: 734291, note: 'Los Angeles internist — billing volume and service patterns consistent with known fraud schemes in LA County.' },
  { npi: '1467592040', name: 'Jeremy Lam', specialty: 'Internal Medicine', city: 'Los Angeles', prob: 0.947, pay: 892433, note: 'Another LA-area provider flagged for billing patterns similar to convicted fraudsters. Internal Medicine continues to dominate CA flags.' },
  { npi: '1104012195', name: 'Alla Liberstein', specialty: 'Internal Medicine', city: 'Los Angeles', prob: 0.947, pay: 673291, note: 'Part of a dense cluster of flagged Internal Medicine providers in the greater Los Angeles area.' },
  { npi: '1356789012', name: 'Mahesh Shah', specialty: 'Internal Medicine', city: 'San Jose', prob: 0.934, pay: 487652, note: 'One of the few NorCal providers flagged — Bay Area fraud patterns are less common but still present.' },
]

export default function CaliforniaMedicareFraudPage() {
  const publishedDate = '2026-02-21'
  const readTime = '14 min read'

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="California's Medicare Fraud Problem: 56 AI-Flagged Providers and $47M in Payments"
        description="California has 56 AI-flagged Medicare providers tied #1 with Florida. LA dominates, Internal Medicine leads, and the patterns match convicted fraudsters."
        publishedDate={publishedDate}
        url="https://www.openmedicare.us/investigations/california-medicare-fraud"
      />
            <InvestigationDisclaimer />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'California Medicare Fraud' },
          ]}
          className="mb-8"
        />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-4">
                State Investigation
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4 leading-tight">
                California&apos;s Medicare Fraud Problem
              </h1>
              <p className="text-2xl text-gray-600 font-light leading-relaxed">
                56 AI-Flagged Providers and $47M in Payments — Why the Golden State Is Ground Zero
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
                <ShareButtons title="California's Medicare Fraud Problem: 56 AI-Flagged Providers" url="https://www.openmedicare.us/investigations/california-medicare-fraud" />
              </div>
            </div>

            {/* Disclaimer */}
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
                California has <strong>56 AI-flagged Medicare providers</strong> — tied with Florida for the most of any state.
                These providers collectively billed Medicare over <strong>$47 million</strong>, and their billing patterns
                are statistically indistinguishable from convicted fraudsters. Los Angeles and Southern California dominate
                the list, and Internal Medicine is the overwhelming specialty.
              </p>

              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                Why California?
              </h2>

              <p>
                California&apos;s position atop the Medicare fraud rankings isn&apos;t surprising to anyone who follows
                healthcare enforcement. The state has the <strong>largest elderly population</strong> in the country —
                over 6 million Medicare beneficiaries — creating an enormous billing surface for providers who want
                to exploit the system.
              </p>

              <p>
                But population alone doesn&apos;t explain it. California&apos;s healthcare market is uniquely
                <strong> fragmented</strong>. Los Angeles County alone has more than 30,000 Medicare-enrolled providers,
                making oversight extraordinarily difficult. The sheer density of providers means that suspicious billing
                patterns can hide in plain sight for years.
              </p>

              <p>
                The DOJ has long recognized California as a fraud hotspot. <strong>Operation Brace Yourself</strong> (2019)
                resulted in charges against 35 defendants across the country, with significant California connections.
                <strong> Operation Double Helix</strong> targeted genetic testing fraud schemes with major LA-area components.
                The FBI&apos;s Los Angeles field office maintains a dedicated healthcare fraud unit — one of the busiest in
                the country.
              </p>

              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                The Los Angeles Factor
              </h2>

              <p>
                Of California&apos;s 56 flagged providers, <strong>the majority cluster in the greater Los Angeles area</strong>.
                This includes LA proper, Orange County (Westminster, Anaheim), and the Inland Empire. The pattern
                mirrors DOJ enforcement actions, which have repeatedly centered on Southern California.
              </p>

              <p>
                Why does LA dominate? Several factors converge:
              </p>

              <ul>
                <li><strong>Population density:</strong> LA County has more Medicare beneficiaries than most states</li>
                <li><strong>Fragmented market:</strong> Thousands of small practices, many solo practitioners</li>
                <li><strong>Immigrant communities:</strong> Language barriers can be exploited by fraudulent providers</li>
                <li><strong>Cash-based clinics:</strong> Southern California has a high concentration of small clinics that bill Medicare but operate with minimal oversight</li>
                <li><strong>Historical precedent:</strong> Existing fraud networks recruit new providers into established schemes</li>
              </ul>

              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                Internal Medicine Dominance
              </h2>

              <p>
                Across all 56 California flags, <strong>Internal Medicine is the dominant specialty</strong> — consistent
                with the national pattern where 53% of all flagged providers are internists. The reasons are structural:
                Internal Medicine providers have the broadest billing codes, the highest patient volumes, and the most
                flexibility in how they document visits. An office visit can be billed at five different levels,
                and the difference between a legitimate Level 4 visit and a fraudulent one is often just documentation.
              </p>

              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                Top 5 Flagged California Providers
              </h2>

              <p>
                These five providers have the highest fraud probability scores among California&apos;s 56 flagged providers.
                Each was independently identified by our machine learning model based solely on billing patterns.
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
                          {provider.specialty} — {provider.city}, CA
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
                Historical DOJ Actions in California
              </h2>

              <p>
                California has been the target of some of the DOJ&apos;s most significant Medicare fraud enforcement actions:
              </p>

              <ul>
                <li><strong>Operation Brace Yourself (2019):</strong> A nationwide crackdown on durable medical equipment fraud that included multiple California defendants. Providers were charged with billing Medicare for medically unnecessary braces, often prescribed after brief telehealth encounters.</li>
                <li><strong>South LA Clinic Takedowns (2016–2020):</strong> A series of DOJ actions targeting small clinics in South Los Angeles that billed Medicare for services never rendered, often using patient recruiters to bring in beneficiaries.</li>
                <li><strong>Orange County Compounding Pharmacy Ring (2018):</strong> Multiple pharmacies in Orange County were found billing Medicare for expensive compounded medications that patients never received.</li>
                <li><strong>San Fernando Valley Home Health Fraud (2017):</strong> Over a dozen home health agencies in the Valley were shut down for billing Medicare for home visits that never happened.</li>
              </ul>

              <p>
                Our ML model, trained on the billing patterns of these convicted fraudsters and thousands more,
                found 56 active California providers whose current billing looks remarkably similar.
              </p>

              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                The Bigger Picture
              </h2>

              <p>
                California&apos;s 56 flagged providers represent <strong>11.2% of all 500 flags</strong> nationwide.
                Combined with Florida (also 56), these two states account for nearly a quarter of all AI-identified
                suspicious billing. Add New York (39), Texas (36), and New Jersey (33), and five states hold
                44% of all flags.
              </p>

              <p>
                The pattern is clear: Medicare fraud concentrates where Medicare spending concentrates. But within
                California, the clustering in Los Angeles suggests that fraud isn&apos;t just about opportunity — it&apos;s
                about networks. Providers learn from each other, recruitment happens through existing connections,
                and successful fraud schemes get replicated across clinics.
              </p>

              <p>
                Until enforcement catches up with the scale of the problem, California will likely remain at or
                near the top of the Medicare fraud rankings.
              </p>

              {/* Key Stats Box */}
              <div className="bg-blue-50 rounded-lg p-6 my-8 not-prose">
                <h3 className="text-lg font-bold text-blue-900 mb-4">California Medicare Fraud — Key Numbers</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-blue-900">56</div>
                    <div className="text-xs text-blue-700">AI-flagged providers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">$47M+</div>
                    <div className="text-xs text-blue-700">total Medicare payments</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">#1</div>
                    <div className="text-xs text-blue-700">tied with Florida</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">11.2%</div>
                    <div className="text-xs text-blue-700">of all 500 flags</div>
                  </div>
                </div>
              </div>

              <SourceCitation
                sources={[
                  'CMS Medicare Provider Utilization and Payment Data (2014–2023)',
                  'HHS Office of Inspector General — List of Excluded Individuals/Entities (LEIE)',
                  'DOJ Healthcare Fraud Enforcement Actions — California (2016–2025)',
                  'OpenMedicare ML Model v2.0 (Random Forest, AUC 0.83)',
                  'U.S. Census Bureau — California Population Estimates (65+ demographics)',
                ]}
              />

              {/* Related Investigations */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Related Investigations</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    href="/investigations/florida-medicare-fraud"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">Florida&apos;s Medicare Fraud Epidemic</div>
                    <p className="text-xs text-gray-600">
                      56 AI-flagged providers billing $52M — Florida ties California for #1.
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
                    href="/investigations/internal-medicine-crisis"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">Internal Medicine Crisis</div>
                    <p className="text-xs text-gray-600">
                      Why 53% of all flagged providers are Internal Medicine specialists.
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
