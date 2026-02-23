import ArticleJsonLd from "@/components/ArticleJsonLd"
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'

export const metadata: Metadata = {
  title: 'Wound Care: America\'s $5.5B Bandage Scheme',
  description: '$5.5B in Medicare wound care. One nurse billed $135M for 90 patients. Spending surged 1,485% in 9 years. Inside the billion-dollar bandage.',
  openGraph: {
    title: 'Wound Care: America\'s $5.5B Bandage Scheme',
    description: '$5.5B in Medicare wound care. One nurse billed $135M for 90 patients. Spending surged 1,485% in 9 years.',
    type: 'article',
  },
}

const TOP_PROVIDERS = [
  { name: 'Ira Denny', specialty: 'Nurse Practitioner', city: 'Surprise', state: 'AZ', total: 135160596, skinSub: 135160596, beneficiaries: 90, markup: 1.28 },
  { name: 'Jorge Kinds', specialty: 'Nurse Practitioner', city: 'Phoenix', state: 'AZ', total: 123792249, skinSub: 123792249, beneficiaries: 97, markup: 1.28 },
  { name: 'Keith Goss', specialty: 'Podiatry', city: 'Chandler', state: 'AZ', total: 91241070, skinSub: 91129744, beneficiaries: 493, markup: 1.30 },
  { name: 'Carlos Ching', specialty: 'Nurse Practitioner', city: 'Phoenix', state: 'AZ', total: 62886995, skinSub: 62886995, beneficiaries: 66, markup: 1.28 },
  { name: 'Bethany Jameson', specialty: 'Nurse Practitioner', city: 'Gilbert', state: 'AZ', total: 49880294, skinSub: 49880294, beneficiaries: 65, markup: 1.28 },
  { name: 'Allyson Pizzo-Berkey', specialty: 'Pain Management', city: 'Newport Beach', state: 'CA', total: 44200948, skinSub: 40733264, beneficiaries: 5280, markup: 1.35 },
  { name: 'Stephen Dubin', specialty: 'General Practice', city: 'Las Vegas', state: 'NV', total: 42751814, skinSub: 42609500, beneficiaries: 821, markup: 1.42 },
  { name: 'Aaron Jeng', specialty: 'Internal Medicine', city: 'San Gabriel', state: 'CA', total: 42694789, skinSub: 42678707, beneficiaries: 187, markup: 1.30 },
  { name: 'Owen Ellington', specialty: 'Internal Medicine', city: 'Sugar Land', state: 'TX', total: 33270073, skinSub: 32377341, beneficiaries: 1945, markup: 1.33 },
  { name: 'Kirk Mitchell', specialty: 'Family Practice', city: 'Longmont', state: 'CO', total: 32240422, skinSub: 32240422, beneficiaries: 99, markup: 1.28 },
]

const TOP_CODES = [
  { code: '11042', desc: 'Wound debridement, first 20 sq cm', payments: 1.10, services: 16.9, providers: 23242 },
  { code: 'Q4262', desc: 'Dual layer impax membrane, per sq cm', payments: 0.83, services: 0.9, providers: 141 },
  { code: '11043', desc: 'Debridement incl. muscle, first 20 sq cm', payments: 0.54, services: 3.5, providers: 6170 },
  { code: 'Q4253', desc: 'Zenith amniotic membrane, per sq cm', payments: 0.36, services: 0.5, providers: 137 },
  { code: 'Q4236', desc: 'Carepatch, per sq cm', payments: 0.22, services: 0.2, providers: 79 },
  { code: 'Q4217', desc: 'Woundfix / Biowound, per sq cm', payments: 0.21, services: 0.3, providers: 111 },
]

const YEARLY_TRENDS = [
  { year: 2014, payments: 135, providers: 11746 },
  { year: 2015, payments: 151, providers: 12149 },
  { year: 2016, payments: 182, providers: 12472 },
  { year: 2017, payments: 224, providers: 12752 },
  { year: 2018, payments: 278, providers: 13132 },
  { year: 2019, payments: 291, providers: 13435 },
  { year: 2020, payments: 446, providers: 12904 },
  { year: 2021, payments: 775, providers: 13520 },
  { year: 2022, payments: 903, providers: 12947 },
  { year: 2023, payments: 2143, providers: 13141 },
]

function formatMoney(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

export default function WoundCareAmericasBillionDollarBandagePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="Wound Care: America's Billion-Dollar Bandage"
        description="$5.5 billion in Medicare wound care — skin substitutes, debridement, and hyperbaric oxygen"
        url="/investigations/wound-care-americas-billion-dollar-bandage"
        publishedDate="2026-02-21"
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'Wound Care: Billion-Dollar Bandage' },
        ]} className="mb-8" />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mb-4">
                Investigation
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4">
                Wound Care: America&apos;s Billion-Dollar Bandage
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                $5.5 Billion in Skin Substitutes, Debridement, and Hyperbaric Oxygen
              </p>
              <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDaysIcon className="h-4 w-4" />
                  February 21, 2026
                </span>
                <span className="flex items-center gap-1.5">
                  <ClockIcon className="h-4 w-4" />
                  12 min read
                </span>
              </div>
              <div className="mt-4">
                <ShareButtons url="/investigations/wound-care-americas-billion-dollar-bandage" title="Wound Care: America's Billion-Dollar Bandage" />
              </div>
            </div>

            <InvestigationDisclaimer />

            {/* Hero Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-orange-700">$5.5B</div>
                <div className="text-xs text-gray-600 mt-1">Total Wound Payments</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-orange-700">$135M</div>
                <div className="text-xs text-gray-600 mt-1">Top Provider Paid</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-700">1,485%</div>
                <div className="text-xs text-gray-600 mt-1">Growth 2014→2023</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-700">500+</div>
                <div className="text-xs text-gray-600 mt-1">Top Wound Providers</div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl leading-relaxed">
                In 2014, Medicare spent <strong>$135 million</strong> on wound care. By 2023, that number
                was <strong>$2.14 billion</strong>. Not billion with a typo. Billion with a B. That&apos;s a
                <strong> 1,485% increase</strong> in nine years — while the number of wound care providers
                barely changed. Same number of doctors. Fifteen times the money.
              </p>

              <p>
                The top wound care provider in America — <strong>Ira Denny</strong>, a nurse practitioner
                in Surprise, Arizona — billed Medicare <strong>$135.2 million</strong>. For 90 patients.
                That&apos;s <strong>$1.5 million per patient</strong>. All of it in skin substitutes.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Explosion Nobody Noticed</h2>
            </div>

            {/* Growth Chart as Table */}
            <div className="my-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Wound Care Spending by Year</h3>
                <div className="space-y-2">
                  {YEARLY_TRENDS.map((y) => {
                    const maxPayments = 2143
                    const widthPct = (y.payments / maxPayments) * 100
                    return (
                      <div key={y.year} className="flex items-center gap-3">
                        <span className="text-sm font-mono text-gray-600 w-12">{y.year}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                          <div
                            className={`h-6 rounded-full ${y.year >= 2020 ? 'bg-red-500' : 'bg-orange-500'}`}
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono text-gray-900 w-20 text-right">${y.payments}M</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-3">Red bars indicate COVID and post-COVID years. Source: wound-care.json</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p>
                Look at that chart. Wound care spending barely moved from 2014 to 2019 — growing from $135M to $291M
                in five years. Then <strong>2020 hit $446 million</strong> — a 53% jump in a pandemic year when
                most of Medicare was contracting. By 2021 it nearly doubled to $775 million. And 2023?
                <strong> $2.14 billion.</strong>
              </p>

              <p>
                The number of wound care providers went from 11,746 to 13,141 over the entire decade — an
                11.9% increase. The money went up 1,485%. Where is it all going?
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Skin Substitutes: The $4 Billion Product</h2>

              <p>
                The answer is overwhelmingly <strong>skin substitutes</strong> — bioengineered tissue products
                applied to chronic wounds. These products, billed through Q-codes like Q4262 (Dual Layer Impax
                Membrane) and Q4253 (Zenith Amniotic Membrane), have become wound care&apos;s golden goose.
              </p>

              <p>
                A single application of a skin substitute can cost Medicare <strong>$1,000 to $10,000+</strong>.
                Patients with chronic diabetic ulcers or venous leg wounds might receive applications every
                1-2 weeks for months. At $5,000 per visit, a single patient can generate <strong>$100,000+
                per year</strong> in skin substitute charges alone.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Top Billers</h2>
            </div>

            {/* Top Providers Table */}
            <div className="overflow-x-auto my-8">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Provider</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Specialty</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700">Total Wound</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700">Patients</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700">$/Patient</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_PROVIDERS.map((p, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-3 px-3">
                        <div className="font-medium text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.city}, {p.state}</div>
                      </td>
                      <td className="py-3 px-3 text-gray-600 text-xs">{p.specialty}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-orange-700">
                        {formatMoney(p.total)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">{p.beneficiaries.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-mono text-red-700">
                        {formatMoney(Math.round(p.total / p.beneficiaries))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="prose prose-lg max-w-none">
              <p>
                The per-patient numbers are staggering. Ira Denny: <strong>$1.5 million per patient</strong>.
                Jorge Kinds: <strong>$1.3 million per patient</strong>. Carlos Ching: <strong>$952,985
                per patient</strong>. All nurse practitioners. All in Arizona. All billing exclusively
                skin substitutes with a markup ratio of 1.28x.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-8 rounded-r-lg">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">🏜️ The Arizona Cluster</h3>
                <p className="text-amber-900">
                  Five of the top 10 wound care billers are in Arizona — specifically in the Phoenix metro area.
                  All are nurse practitioners. All bill exclusively skin substitutes. Their combined billing:
                  <strong> $463 million for 318 patients</strong>. This cluster alone accounts for nearly 9%
                  of all Medicare wound care spending. We investigated this further in our{' '}
                  <Link href="/investigations/arizona-wound-care-ring" className="text-amber-800 underline">
                    Arizona wound care analysis
                  </Link>.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Beverly Hills Connection</h2>

              <p>
                Then there&apos;s <strong>Beverly Hills</strong>. Johnson Lee, a plastic surgeon billing from
                90210, generated <strong>$31.8 million</strong> in wound care payments across 3,713 patients.
                The Comprehensive Outpatient Surgery Center in Beverly Hills billed <strong>$8.5 million</strong> with
                a jaw-dropping markup ratio of <strong>11.43x</strong>.
              </p>

              <p>
                Beverly Hills podiatrist David Pougatsch billed $4.0 million with a <strong>13.1x markup</strong>.
                And Millicent Rovelo, another Beverly Hills plastic surgeon: $7.7 million for 1,248 patients.
              </p>

              <p>
                The presence of Beverly Hills — not exactly known for its diabetic ulcer population — at
                the top of wound care billing raises questions about whether these are chronic wound
                patients or cosmetic procedures coded as wound care. We explored this in our{' '}
                <Link href="/investigations/beverly-hills-wound-care" className="text-indigo-600 hover:text-indigo-800">
                  Beverly Hills Wound Care investigation
                </Link>.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Top Procedure Codes</h2>
            </div>

            {/* Top Codes */}
            <div className="overflow-x-auto my-8">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Code</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Description</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700">Payments</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700">Services (M)</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700">Providers</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_CODES.map((c, i) => (
                    <tr key={c.code} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-3 px-3 font-mono font-semibold text-gray-900">{c.code}</td>
                      <td className="py-3 px-3 text-gray-600 text-xs">{c.desc}</td>
                      <td className="py-3 px-3 text-right font-mono">${c.payments.toFixed(2)}B</td>
                      <td className="py-3 px-3 text-right font-mono">{c.services.toFixed(1)}M</td>
                      <td className="py-3 px-3 text-right font-mono">{c.providers.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="prose prose-lg max-w-none">
              <p>
                Wound debridement (11042) is the most common procedure at <strong>$1.1 billion</strong> across
                23,242 providers — this is the bread-and-butter of wound care and relatively well-distributed.
                But the Q-codes for skin substitutes tell a different story: <strong>$834 million through
                just 141 providers</strong> for Q4262 alone. That&apos;s an average of <strong>$5.9 million
                per provider</strong> for a single product.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Miramar, Florida Pattern</h2>

              <p>
                Scrolling through the data, one city name appears over and over: <strong>Miramar, Florida</strong>.
                Dozens of providers — family practitioners, general surgeons, OB-GYNs — all billing millions
                in wound debridement from the same ZIP code. Names like Bryant Koh ($3.5M), Thomas Vizinas
                ($3.5M), Hayriye Gok ($3.4M), and Qi Li ($3.4M) — all billing exclusively debridement
                with no skin substitutes and markups of 3-4x.
              </p>

              <p>
                The Miramar cluster represents a different model than Arizona: high-volume debridement
                rather than high-cost skin substitutes. Both are lucrative. Both raise questions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why It Matters</h2>

              <p>
                Wound care is the fastest-growing segment of Medicare spending. A 1,485% increase in nine
                years dwarfs every other category — drug spending, telehealth, even COVID testing. And
                unlike those categories, wound care has no natural ceiling. Chronic wounds don&apos;t resolve.
                Patients keep coming back. Skin substitutes keep getting applied.
              </p>

              <p>
                CMS has begun to take notice. In 2024, several skin substitute codes were repriced or
                bundled, and new prior authorization requirements were proposed. But the data through 2023
                shows a system that had already spiraled far beyond any reasonable growth trajectory.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Explore Further</h2>

              <ul>
                <li>
                  <Link href="/fraud/wound-care" className="text-indigo-600 hover:text-indigo-800">
                    Wound Care Fraud Dashboard
                  </Link> — Explore all 500 top wound care providers
                </li>
                <li>
                  <Link href="/investigations/beverly-hills-wound-care" className="text-indigo-600 hover:text-indigo-800">
                    Beverly Hills Wound Care
                  </Link> — The 90210 connection
                </li>
              </ul>
            </div>

            <SourceCitation
              sources={[
                'CMS Medicare Provider Utilization and Payment Data (2014-2023)',
                'OpenMedicare wound-care.json — 500 top wound care providers, top codes, yearly trends',
              ]}
            />

            <InvestigationDisclaimer />
          </div>
        </article>
      </div>
    </main>
  )
}
