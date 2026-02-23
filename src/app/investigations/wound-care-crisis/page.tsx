import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'The $14.6B Wound Care Fraud Crisis',
  description: 'DOJ\'s largest-ever healthcare fraud bust targeted wound care. HHS-OIG flagged skin substitutes as "vulnerable to fraud." Inside the scheme.',
  alternates: { canonical: '/investigations/wound-care-crisis' },
  openGraph: {
    title: 'The $14.6B Wound Care Fraud Crisis',
    description: 'DOJ\'s largest-ever healthcare fraud bust targeted wound care. HHS-OIG flagged skin substitutes as "vulnerable to fraud."',
    url: 'https://www.openmedicare.us/investigations/wound-care-crisis',
  },
}

export default function WoundCareCrisisPage() {
  const publishedDate = '2026-02-19'
  const readTime = '16 min read'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'The Wound Care Industrial Complex' },
          ]}
          className="mb-8"
        />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-4">
                Investigation
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4">
                The Wound Care Industrial Complex
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                Medicare&apos;s Most Vulnerable Program
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

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                In September 2025, the HHS Office of Inspector General issued a stark warning: skin substitute
                products in Medicare are <strong>&quot;particularly vulnerable to fraud.&quot;</strong> Three months
                earlier, the Department of Justice had announced the <strong>largest healthcare fraud enforcement
                action in history</strong> — a {formatCurrency(14600000000)} takedown that placed wound care at
                its center.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The {formatCurrency(14600000000)} Takedown</h2>
              <p>
                In June 2025, the DOJ announced Operation Wound Shield, its largest-ever healthcare fraud enforcement
                action. The {formatCurrency(14600000000)} in alleged fraud involved hundreds of defendants across
                the country, with wound care billing — particularly skin substitutes — as the central scheme.
              </p>
              <p>
                The enforcement action revealed a sophisticated network: manufacturers offered kickbacks to
                physicians, physicians prescribed unnecessary products, and billing companies submitted
                inflated claims to Medicare.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">How Skin Substitutes Became a Fraud Magnet</h2>
              <p>
                Skin substitute products — coded under HCPCS Q4xxx series — are bioengineered tissues used to
                treat chronic wounds like diabetic ulcers. Legitimate use is well-established. But the economics
                create perverse incentives:
              </p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">The Economics of Skin Substitutes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-orange-800">
                  <div>
                    <div className="font-bold text-2xl mb-1">$500–$5,000</div>
                    <div>Medicare reimbursement per application</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">Weekly</div>
                    <div>Application frequency for many products</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">12–16 weeks</div>
                    <div>Typical treatment course</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">$6,000–$80,000</div>
                    <div>Total per patient per wound</div>
                  </div>
                </div>
              </div>

              <p>
                A single wound can generate tens of thousands in Medicare billing. A provider with a panel
                of wound care patients can bill millions per year — legitimately. The problem is distinguishing
                legitimate high-volume wound care from fraudulent schemes.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Vohra Settlement: {formatCurrency(45000000)}</h2>
              <p>
                Vohra Wound Physicians, one of the nation&apos;s largest wound care companies, agreed to pay
                {' '}{formatCurrency(45000000)} to settle allegations that it billed Medicare for medically
                unnecessary wound care services. The settlement highlighted how large organizations can
                systematically overbill wound care across dozens of facilities.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Beverly Hills: An Unlikely Wound Care Capital</h2>
              <p>
                Our data analysis reveals a curious geographic anomaly: Beverly Hills, California, has an
                outsized concentration of high-billing wound care providers. Why would one of America&apos;s
                wealthiest ZIP codes be a wound care hotspot?
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Case Study: Som Kohanzadeh, MD — Beverly Hills</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Total Medicare Payments:</span> <strong className="text-purple-800">{formatCurrency(14722228)}</strong></div>
                  <div><span className="text-gray-600">Average Markup Ratio:</span> <strong className="text-purple-800">59.1x</strong></div>
                  <div><span className="text-gray-600">Specialty:</span> <strong>Plastic & Reconstructive Surgery</strong></div>
                  <div><span className="text-gray-600">Risk Score:</span> <strong className="text-purple-800">92/100</strong></div>
                </div>
                <p className="text-sm text-purple-800 mt-4">
                  Top billed procedures include skin substitute products (Kerecis Omega3 Wound, PuraPly AM/XT),
                  hyperbaric oxygen therapy, and debridement coded at <strong>63.7x the specialty median markup</strong>.
                </p>
                <div className="mt-3">
                  <Link href="/providers/1952575342" className="text-purple-700 hover:underline text-sm font-medium">
                    View Full Provider Profile →
                  </Link>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Debridement Markup: 60x and Beyond</h2>
              <p>
                Debridement — the medical removal of dead or damaged tissue — is a legitimate and important
                wound care procedure. But some providers bill it at extraordinary markups. Code 11043
                (debridement of muscle and/or bone) has a standard Medicare reimbursement, but our analysis
                found individual providers submitting charges more than <strong>60 times</strong> the specialty
                median.
              </p>
              <p>
                A 60x markup doesn&apos;t mean the provider receives 60x the standard payment — Medicare caps
                actual payments. But extreme markup ratios are a red flag that billing practices may not
                reflect clinical reality.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The OIG&apos;s Warning</h2>
              <p>
                The HHS-OIG&apos;s September 2025 report specifically called out skin substitutes as
                &quot;particularly vulnerable to fraud&quot; due to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>High reimbursement rates</strong> — some products bill at thousands per application</li>
                <li><strong>Subjective medical necessity</strong> — wound healing is complex and hard to audit retrospectively</li>
                <li><strong>Rapid product proliferation</strong> — new Q-codes are added frequently, outpacing CMS oversight</li>
                <li><strong>Manufacturer incentives</strong> — kickback schemes incentivize prescribing specific products</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What Our Data Shows</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">Wound Care by the Numbers</h3>
                <ul className="space-y-2 text-red-800">
                  <li>• <strong>{formatCurrency(5530000000)}</strong> — Total wound care billing across Medicare</li>
                  <li>• <strong>Top code: 11042</strong> (debridement) — {formatCurrency(1090000000)}</li>
                  <li>• <strong>500 providers</strong> tracked in our wound care database</li>
                  <li>• <strong>Ira Denny, NP</strong> — billed {formatCurrency(135000000)} for just 90 patients ({formatCurrency(1500000)} per patient)</li>
                </ul>
                <div className="mt-3">
                  <Link href="/fraud/wound-care" className="text-red-700 hover:underline text-sm font-medium">
                    Explore the full wound care fraud tracker →
                  </Link>
                </div>
              </div>
              <p>
                Across 10 years of Medicare data, <strong>{formatCurrency(5530000000)}</strong> flowed through wound care
                billing codes. We identified a pattern of billing that concentrates among a relatively small number
                of providers who bill at volumes and markups far exceeding their peers. The most extreme case:
                nurse practitioner <strong>Ira Denny</strong>, who billed {formatCurrency(135000000)} for just 90
                patients — an average of {formatCurrency(1500000)} per patient. The characteristics of these outlier providers include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Skin substitute billing volumes in the 99th percentile</li>
                <li>Markup ratios 10-60x higher than specialty medians</li>
                <li>Geographic clustering in specific ZIP codes</li>
                <li>Combinations of high-cost wound care codes that maximize per-patient revenue</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What Needs to Change</h2>
              <p>
                The wound care fraud problem won&apos;t be solved by enforcement alone. Structural reforms are needed:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li><strong>Prior authorization for high-cost skin substitutes</strong> — requiring clinical justification before billing, not after</li>
                <li><strong>Real-time billing analytics</strong> — CMS should flag volume and markup anomalies in real time, not years later</li>
                <li><strong>Manufacturer transparency</strong> — mandatory disclosure of financial relationships between product manufacturers and prescribing physicians</li>
                <li><strong>Patient notification</strong> — beneficiaries should be notified in real time when wound care products are billed on their behalf</li>
              </ol>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> The billing patterns described in this article are statistical flags
                based on publicly available CMS data, not accusations of fraud. Individual cases may have legitimate
                explanations. Named providers have not been charged with any crime unless otherwise stated.
              </p>
            </div>

            {/* Related */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href="/fraud/wound-care" className="text-medicare-primary hover:underline text-sm">🩹 Wound Care Fraud Watchlist</Link>
                <Link href="/fraud/deep-dives" className="text-medicare-primary hover:underline text-sm">🔍 Deep Dive Profiles</Link>
                <Link href="/investigations/impossible-doctors" className="text-medicare-primary hover:underline text-sm">📰 The Impossible Doctors</Link>
                <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
                <Link href="/investigations/arizona-wound-care-ring" className="text-medicare-primary hover:underline text-sm">🩹 Arizona Wound Care Ring</Link>
                <Link href="/investigations/beverly-hills-wound-care" className="text-medicare-primary hover:underline text-sm">💎 Beverly Hills Wound Care</Link>
                <Link href="/investigations/beverly-hills-billing" className="text-medicare-primary hover:underline text-sm">📈 Beverly Hills Billing</Link>
                <Link href="/investigations/medicare-fraud-2025" className="text-medicare-primary hover:underline text-sm">⚖️ Medicare Fraud in 2025</Link>
                <Link href="/states/AZ" className="text-medicare-primary hover:underline text-sm">🗺️ Arizona Medicare Data</Link>
                <Link href="/states/CA" className="text-medicare-primary hover:underline text-sm">🗺️ California Medicare Data</Link>
              </div>
            </div>

            <ShareButtons
              url="https://www.openmedicare.us/investigations/wound-care-crisis"
              title="The Wound Care Industrial Complex"
            />

            <div className="mt-6">
              <SourceCitation
                sources={[
                  'Centers for Medicare & Medicaid Services (CMS) — Medicare Provider Utilization and Payment Data (2014-2023)',
                  'HHS Office of Inspector General — Skin Substitute Vulnerability Report (September 2025)',
                  'Department of Justice — Operation Wound Shield (June 2025)',
                  'Vohra Wound Physicians Settlement',
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
