import type { Metadata } from 'next'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: "39 AI-Flagged Providers: NY's Hidden Fraud Problem",
  description: 'New York ranks #3 with 39 AI-flagged Medicare providers billing $30M+. Brooklyn and Queens are the epicenters. See the top 5 flagged providers.',
  keywords: ['New York Medicare fraud', 'Medicare fraud Brooklyn', 'NYC healthcare fraud', 'Medicare fraud Queens', 'NY Medicare billing fraud', 'Physical Medicine fraud'],
  alternates: { canonical: '/investigations/new-york-medicare-fraud' },
  openGraph: {
    title: "39 AI-Flagged Providers: NY's Hidden Fraud Problem",
    description: 'New York ranks #3 with 39 AI-flagged Medicare providers billing $30M+. Brooklyn and Queens are the epicenters. See the top 5 flagged providers.',
    url: 'https://www.openmedicare.us/investigations/new-york-medicare-fraud',
  },
}

const flaggedProviders = [
  { npi: '1265990097', name: 'Natalia Maximovsky', specialty: 'Nurse Practitioner', city: 'Brooklyn', prob: 0.943, pay: 1649701, note: 'Highest fraud probability among NY providers. Over $1.6M in Medicare billings — unusually high for a Nurse Practitioner, a pattern commonly seen in fraud schemes where NPs bill under physician supervision arrangements.' },
  { npi: '1568402386', name: 'Norman Haywood', specialty: 'Family Practice', city: 'Brooklyn', prob: 0.942, pay: 694885, note: 'Brooklyn Family Practice provider flagged for billing patterns matching convicted fraudsters. Brooklyn has historically been one of the highest-fraud zip codes in the country.' },
  { npi: '1396849733', name: 'Jack Goldman', specialty: 'Internal Medicine', city: 'Brooklyn', prob: 0.942, pay: 573350, note: 'Another Brooklyn internist — the borough\'s dense healthcare market and Medicare population make it a natural fraud concentration point.' },
  { npi: '1649379934', name: 'Mark Dashevskiy', specialty: 'Family Practice', city: 'Queens', prob: 0.938, pay: 1342386, note: 'Queens-based provider with over $1.3M in billings. Queens and Brooklyn together account for a disproportionate share of NYC Medicare fraud flags.' },
  { npi: '1225126279', name: 'Dunstan Pulle', specialty: 'Internal Medicine', city: 'Queens', prob: 0.930, pay: 272786, note: 'Queens internist with lower payment volume but billing patterns that still match convicted fraudsters — proof that fraud detection isn\'t just about dollar amounts.' },
]

export default function NewYorkMedicareFraudPage() {
  const publishedDate = '2026-02-21'
  const readTime = '13 min read'

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="New York's Hidden Medicare Fraud: 39 AI-Flagged Providers"
        description="New York has 39 AI-flagged Medicare providers — #3 nationally. Brooklyn and Queens are the epicenters."
        publishedDate={publishedDate}
        url="https://www.openmedicare.us/investigations/new-york-medicare-fraud"
      />
            <InvestigationDisclaimer />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'New York Medicare Fraud' },
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
                New York&apos;s Hidden Medicare Fraud
              </h1>
              <p className="text-2xl text-gray-600 font-light leading-relaxed">
                39 AI-Flagged Providers — The #3 State That Flies Under the Radar
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
                <ShareButtons title="New York's Hidden Medicare Fraud: 39 AI-Flagged Providers" url="https://www.openmedicare.us/investigations/new-york-medicare-fraud" />
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
                While California and Florida grab the headlines, <strong>New York quietly ranks #3</strong> with
                39 AI-flagged Medicare providers. These providers billed Medicare over <strong>$30 million</strong> combined,
                and the flags cluster heavily in Brooklyn and Queens — two boroughs with long histories of
                Medicare fraud enforcement actions.
              </p>

              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                The Brooklyn and Queens Connection
              </h2>

              <p>
                If South Florida is America&apos;s #1 Medicare fraud hotspot, <strong>Brooklyn and Queens</strong> are a close
                second. The DOJ&apos;s Eastern District of New York — which covers Brooklyn, Queens, Staten Island,
                and Long Island — has been one of the most active jurisdictions for healthcare fraud prosecutions
                for over two decades.
              </p>

              <p>
                The reasons mirror South Florida in many ways:
              </p>

              <ul>
                <li><strong>Dense elderly population:</strong> Brooklyn alone has more Medicare beneficiaries than many entire states</li>
                <li><strong>Ethnic enclaves:</strong> Tight-knit communities where patient recruitment for fraud schemes can operate through word-of-mouth</li>
                <li><strong>Small practice density:</strong> Thousands of solo and small-group practices, many in storefront clinics that are difficult for CMS to audit</li>
                <li><strong>Established fraud infrastructure:</strong> Decades of prosecution have not eliminated the underlying networks</li>
              </ul>

              <p>
                Brighton Beach, Flatbush, and parts of southern Brooklyn have been particularly targeted in DOJ
                actions. Queens neighborhoods including Flushing, Jamaica, and Elmhurst have also featured
                prominently in Medicare fraud cases.
              </p>

              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                A Different Specialty Mix
              </h2>

              <p>
                One thing that distinguishes New York from California and Florida is the <strong>specialty diversity</strong> among
                flagged providers. While CA is dominated by Internal Medicine and FL shows a mix of IM and Family Practice,
                New York&apos;s flags include:
              </p>

              <ul>
                <li><strong>Internal Medicine</strong> — still the most common, consistent with national patterns</li>
                <li><strong>Family Practice</strong> — the second most common specialty among NY flags</li>
                <li><strong>Nurse Practitioner</strong> — the highest-probability flag in NY is an NP, reflecting the growing role of mid-level providers in Medicare billing</li>
                <li><strong>Physical Medicine &amp; Rehabilitation</strong> — a specialty that has seen increasing fraud attention, particularly around unnecessary therapy and pain management services</li>
              </ul>

              <p>
                The inclusion of Physical Medicine is notable. PM&amp;R fraud often involves billing for unnecessary
                physical therapy sessions, pain injections, and rehabilitation services. Several recent DOJ actions
                in the New York area have targeted PM&amp;R practices, particularly those offering &quot;comprehensive
                pain management&quot; that amounts to assembly-line billing.
              </p>

              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                Top 5 Flagged New York Providers
              </h2>

              <p>
                These five providers have the highest fraud probability scores among New York&apos;s 39 flagged providers.
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
                          {provider.specialty} — {provider.city}, NY
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
                Historical Enforcement in New York
              </h2>

              <p>
                New York has been the target of numerous major Medicare fraud enforcement actions:
              </p>

              <ul>
                <li><strong>Brighton Beach Medical Mill Prosecutions (2012–2018):</strong> A series of cases targeting clinics in Brighton Beach, Brooklyn, that billed Medicare for unnecessary diagnostic tests and services</li>
                <li><strong>Queens Physical Therapy Ring (2019):</strong> Multiple physical therapy practices in Queens charged with billing for sessions that never occurred or were medically unnecessary</li>
                <li><strong>Brooklyn Home Health Sweep (2016):</strong> DOJ action against home health agencies billing for phantom visits to homebound patients</li>
                <li><strong>Long Island Prescription Mill Cases (2020):</strong> Providers on Long Island charged with running prescription mills and billing Medicare for unnecessary office visits</li>
              </ul>

              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                Why &quot;Hidden&quot;?
              </h2>

              <p>
                We call New York&apos;s fraud problem &quot;hidden&quot; not because it&apos;s unknown to law enforcement — it&apos;s not — but
                because public attention and media coverage disproportionately focus on Florida and, to a lesser extent,
                California. New York&apos;s 39 flags represent <strong>7.8% of all 500 flags</strong>, making it the clear #3 state.
                Yet it rarely appears in the same &quot;fraud capital&quot; narratives as Miami or LA.
              </p>

              <p>
                This matters because attention drives resources. The Medicare Fraud Strike Force has operations in
                New York, but the scale of enforcement has historically been smaller than in South Florida. As our
                data shows, the billing patterns that match convicted fraudsters are alive and well in Brooklyn,
                Queens, and across the New York metro area.
              </p>

              {/* Key Stats Box */}
              <div className="bg-blue-50 rounded-lg p-6 my-8 not-prose">
                <h3 className="text-lg font-bold text-blue-900 mb-4">New York Medicare Fraud — Key Numbers</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-blue-900">39</div>
                    <div className="text-xs text-blue-700">AI-flagged providers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">$30M+</div>
                    <div className="text-xs text-blue-700">total Medicare payments</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">#3</div>
                    <div className="text-xs text-blue-700">nationally behind CA & FL</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">7.8%</div>
                    <div className="text-xs text-blue-700">of all 500 flags</div>
                  </div>
                </div>
              </div>

              <SourceCitation
                sources={[
                  'CMS Medicare Provider Utilization and Payment Data (2014–2023)',
                  'HHS Office of Inspector General — List of Excluded Individuals/Entities (LEIE)',
                  'DOJ Eastern District of New York — Healthcare Fraud Prosecutions (2012–2025)',
                  'OpenMedicare ML Model v2.0 (Random Forest, AUC 0.83)',
                  'U.S. Census Bureau — New York Population Estimates (65+ demographics)',
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
                    href="/investigations/florida-medicare-fraud"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">Florida&apos;s Medicare Fraud Epidemic</div>
                    <p className="text-xs text-gray-600">
                      56 AI-flagged providers billing $52M — America&apos;s Medicare fraud capital.
                    </p>
                  </Link>
                  <Link
                    href="/investigations/florida-california-fraud"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">The Fraud Belt</div>
                    <p className="text-xs text-gray-600">
                      Why California and Florida lead Medicare fraud — the full national picture.
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
