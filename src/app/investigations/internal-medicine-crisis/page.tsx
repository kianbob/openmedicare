import type { Metadata } from 'next'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'Why Internal Medicine Is Ground Zero for Medicare Fraud | OpenMedicare',
  description: '263 of 500 AI-flagged providers (53%) are Internal Medicine specialists. High-volume billing, broad procedure codes, and easy-to-pad office visits make IM the #1 specialty for fraud-pattern matches.',
  alternates: { canonical: '/investigations/internal-medicine-crisis' },
  openGraph: {
    title: 'Why Internal Medicine Is Ground Zero for Medicare Fraud',
    description: '53% of all AI-flagged Medicare providers are Internal Medicine. Volume + discretion = opportunity.',
    url: 'https://www.openmedicare.org/investigations/internal-medicine-crisis',
  },
}

const topIMProviders = [
  { rank: 1, npi: '1659378743', name: 'Ramesh Thimmiah', state: 'WV', prob: 0.959, pay: 788668, markup: 2.28, spb: 2.45, note: 'Highest fraud probability of any provider in the dataset — billing patterns nearly identical to convicted IM fraudsters' },
  { rank: 2, npi: '1871637157', name: 'Willie Lucas', state: 'MS', prob: 0.955, pay: 1017050, markup: 1.97, spb: 3.66, note: '7-figure billing with 3.66 services per beneficiary — well above the IM average of 1.8' },
  { rank: 5, npi: '1063460939', name: 'John Daconti', state: 'NJ', prob: 0.949, pay: 546971, markup: 2.15, spb: 2.91, note: 'New Jersey — one of the top 5 states for healthcare fraud prosecutions' },
  { rank: 6, npi: '1245366558', name: 'Tuan Duong', state: 'CA', prob: 0.956, pay: 516519, markup: 2.25, spb: 2.69, note: 'California — tied #1 for most flagged providers by state' },
  { rank: 7, npi: '1427163427', name: 'Lilia Gorovits', state: 'PA', prob: 0.946, pay: 716667, markup: 2.21, spb: 3.00, note: 'Consistent volume-driven billing pattern across all years analyzed' },
]

const specialtyComparison = [
  { specialty: 'Internal Medicine', flagged: 263, pct: 52.6, color: 'bg-red-500' },
  { specialty: 'Family Practice', flagged: 135, pct: 27.0, color: 'bg-orange-500' },
  { specialty: 'Nurse Practitioner', flagged: 28, pct: 5.6, color: 'bg-yellow-500' },
  { specialty: 'Cardiology', flagged: 18, pct: 3.6, color: 'bg-blue-500' },
  { specialty: 'All Others', flagged: 56, pct: 11.2, color: 'bg-gray-400' },
]

export default function InternalMedicineCrisisPage() {
  const publishedDate = '2026-02-21'
  const readTime = '10 min read'

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title="Why Internal Medicine Is Ground Zero for Medicare Fraud"
        description="263 of 500 AI-flagged providers are Internal Medicine — 53% of all flags from a single specialty."
        publishedDate={publishedDate}
        url="https://www.openmedicare.org/investigations/internal-medicine-crisis"
      />
            <InvestigationDisclaimer />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'Internal Medicine Crisis' },
          ]}
          className="mb-8"
        />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-4">
                ML Investigation
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4 leading-tight">
                Why Internal Medicine Is Ground Zero for Medicare Fraud
              </h1>
              <p className="text-2xl text-gray-600 font-light leading-relaxed">
                263 of 500 flagged providers — 53% — share a single specialty. That&apos;s not a coincidence.
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
                <ShareButtons title="Why Internal Medicine Is Ground Zero for Medicare Fraud" url="/investigations/internal-medicine-crisis" />
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
              {/* The Hook */}
              <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                When we trained a machine learning model on 8,300+ convicted Medicare fraudsters and asked it to find
                500 active providers with matching billing patterns, we expected the results to span dozens of specialties.
                Instead, one specialty dominated everything: <strong><Link href="/specialties/internal-medicine" className="text-medicare-primary hover:underline">Internal Medicine</Link></strong>.
              </p>

              <p>
                263 of the <Link href="/fraud/still-out-there" className="text-medicare-primary hover:underline">500 flagged providers</Link> — <strong>52.6%</strong> — are internists. The next closest specialty,
                <Link href="/specialties/family-practice" className="text-medicare-primary hover:underline">Family Practice</Link>, accounts for 135 (27%). Together, these two primary care specialties make up nearly
                80% of all AI-flagged providers. Every other medical specialty combined accounts for the remaining 20%.
              </p>

              <p>
                This isn&apos;t because internists are inherently dishonest. It&apos;s because Internal Medicine
                is the perfect storm for billing abuse: high patient volume, broad procedure codes, and
                extraordinary discretion in what constitutes a &quot;necessary&quot; service.
              </p>

              {/* Specialty Breakdown */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                The Numbers Don&apos;t Lie
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Flagged Providers by Specialty</h3>
                <div className="space-y-3">
                  {specialtyComparison.map((s) => (
                    <div key={s.specialty} className="flex items-center gap-3">
                      <div className="w-40 text-sm font-medium text-gray-700 shrink-0">{s.specialty}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                          className={`h-full ${s.color} rounded-full flex items-center justify-end pr-2`}
                          style={{ width: `${(s.flagged / 263) * 100}%` }}
                        >
                          <span className="text-xs text-white font-bold">{s.flagged}</span>
                        </div>
                      </div>
                      <div className="w-14 text-sm text-gray-500 text-right">{s.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <p>
                Internal Medicine is the largest single specialty in Medicare by provider count — but it doesn&apos;t
                represent 53% of all providers. It represents roughly 15% of the Medicare physician workforce. The fact
                that it accounts for more than half of all fraud-pattern flags means the <strong>rate</strong> of
                suspicious billing in Internal Medicine is disproportionately high.
              </p>

              {/* Why Internal Medicine */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                Why Internal Medicine? Volume + Discretion = Opportunity
              </h2>

              <p>
                Three structural features of Internal Medicine make it uniquely vulnerable to billing abuse:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 not-prose">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <div className="text-3xl mb-2">📋</div>
                  <h4 className="font-bold text-blue-900 mb-2">Broad Procedure Codes</h4>
                  <p className="text-sm text-blue-800">
                    IM doctors use the same handful of E&M codes (99213, 99214, 99215) for almost everything.
                    The difference between a $92 visit (99213) and a $132 visit (99214) is subjective — it depends
                    on documentation the provider writes themselves.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <div className="text-3xl mb-2">🏥</div>
                  <h4 className="font-bold text-blue-900 mb-2">High Patient Volume</h4>
                  <p className="text-sm text-blue-800">
                    Internists see more Medicare patients than almost any other specialty. More patients = more claims =
                    more opportunity to pad. A fraudulent internist can add $40 per visit by upcoding — across
                    thousands of visits per year, that adds up fast.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <div className="text-3xl mb-2">🔍</div>
                  <h4 className="font-bold text-blue-900 mb-2">Low Scrutiny</h4>
                  <p className="text-sm text-blue-800">
                    Unlike surgical specialties where procedures are physically verifiable, office visits are
                    documentation-based. If the chart says the visit was complex, Medicare pays for a complex visit.
                    No one is in the room to verify.
                  </p>
                </div>
              </div>

              <p>
                The classic fraud playbook in Internal Medicine is simple: see a patient for a basic checkup,
                document it as a comprehensive evaluation, and bill 99214 instead of 99213. Do this 30 times
                a day, 250 days a year, and you&apos;ve added <strong>$300,000</strong> in fraudulent billing
                that&apos;s nearly invisible in the data — unless you&apos;re comparing it to what convicted
                fraudsters did.
              </p>

              {/* The 99213/99214 Problem */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                The 99213/99214 Problem
              </h2>

              <p>
                The two most common billing codes in all of Medicare are 99213 (established patient, low complexity)
                and 99214 (established patient, moderate complexity). Together, they account for over <strong>$50 billion</strong> in
                annual Medicare payments. Our <Link href="/fraud/upcoding" className="text-medicare-primary hover:underline">upcoding detector</Link> tracks these patterns nationally.
              </p>

              <p>
                The difference? About $40 per visit and a judgment call. A legitimate internist seeing a patient for
                a blood pressure check bills 99213. A fraudulent one documents additional &quot;complexity&quot; — reviewing
                systems, discussing treatment options that may or may not have happened — and bills 99214.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-red-900 mb-3">💰 The Math of Upcoding</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-800">
                  <div>
                    <p className="font-semibold">99213 (Low Complexity)</p>
                    <p>Medicare payment: ~$92</p>
                    <p>Typical legitimate office visit</p>
                  </div>
                  <div>
                    <p className="font-semibold">99214 (Moderate Complexity)</p>
                    <p>Medicare payment: ~$132</p>
                    <p>$40 more per visit — adds up fast</p>
                  </div>
                </div>
                <p className="text-red-700 text-sm mt-4">
                  <strong>30 patients/day × $40 upcode × 250 days = $300,000/year in fraudulent billing</strong>
                </p>
              </div>

              <p>
                Among our 263 flagged Internal Medicine providers, the average 99214-to-99213 ratio is
                significantly higher than the national average for internists. They bill the more expensive
                code at rates that match convicted upcoding fraudsters.
              </p>

              {/* Top 5 Flagged IM Providers */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                The Top 5 Flagged Internists
              </h2>

              <p>
                These five Internal Medicine providers have the highest fraud probability scores in our model.
                Their billing patterns are statistically closest to convicted Medicare fraudsters.
              </p>

              <div className="space-y-4 my-8 not-prose">
                {topIMProviders.map((p) => (
                  <Link
                    key={p.npi}
                    href={`/providers/${p.npi}`}
                    className="block bg-white border border-gray-200 rounded-lg p-5 hover:border-medicare-primary hover:shadow-md transition-all no-underline"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-white bg-red-600 rounded px-2 py-0.5">
                            Rank #{p.rank}
                          </span>
                          <span className="text-xs text-gray-500">NPI: {p.npi}</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">{p.name}</h4>
                        <p className="text-sm text-gray-600">Internal Medicine · {p.state}</p>
                        <p className="text-xs text-gray-500 mt-1">{p.note}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="text-2xl font-bold text-red-600">{(p.prob * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">fraud probability</div>
                        <div className="text-sm font-semibold text-gray-700 mt-1">
                          ${(p.pay / 1000000).toFixed(2)}M
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Compare to Family Practice */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                Internal Medicine vs. Family Practice
              </h2>

              <p>
                Family Practice is the second-most flagged specialty at 135 providers (27%). Together with Internal
                Medicine, these two primary care specialties account for <strong>398 of 500 flags — 79.6%</strong>.
              </p>

              <p>
                The pattern makes sense. Both specialties share the same structural vulnerabilities: high volume,
                broad codes, subjective documentation. But Internal Medicine flags at nearly <strong>twice the rate</strong> of
                Family Practice. Why?
              </p>

              <div className="bg-gray-50 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Differences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-bold text-gray-900 mb-2">Internal Medicine (263 flagged)</p>
                    <ul className="space-y-1 text-gray-700">
                      <li>• More concentrated in urban fraud hotspots</li>
                      <li>• Higher average billing per provider</li>
                      <li>• More likely to be solo practitioners</li>
                      <li>• Historically the #1 specialty in DOJ fraud cases</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-2">Family Practice (135 flagged)</p>
                    <ul className="space-y-1 text-gray-700">
                      <li>• More evenly distributed geographically</li>
                      <li>• More often in group practices</li>
                      <li>• Lower average billing per provider</li>
                      <li>• More pediatric/younger patients (less Medicare)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p>
                Internists also tend to treat older, sicker Medicare patients with multiple chronic conditions —
                which provides legitimate justification for higher-complexity billing codes. The line between
                &quot;this patient is genuinely complex&quot; and &quot;I&apos;m documenting complexity that doesn&apos;t exist&quot;
                is where fraud lives. And in Internal Medicine, that line is exceptionally blurry.
              </p>

              {/* What This Means */}
              <h2 className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b-2 border-medicare-primary pb-2">
                What This Means for Medicare
              </h2>

              <p>
                The concentration of fraud-pattern flags in Internal Medicine suggests that CMS and the OIG
                should focus audit resources disproportionately on this specialty — not because internists are
                bad actors, but because the structure of IM billing creates the widest window of opportunity
                for abuse.
              </p>

              <p>
                Automated billing audits that compare a provider&apos;s 99213/99214 ratio to their peers,
                flag unusual services-per-beneficiary rates, and monitor markup ratios could catch the most
                egregious patterns before they cost taxpayers millions. Our model proves the math works —
                the question is whether anyone will use it.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">📊 By The Numbers</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-900">263</div>
                    <div className="text-xs text-blue-700">IM providers flagged</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">53%</div>
                    <div className="text-xs text-blue-700">of all 500 flags</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">~15%</div>
                    <div className="text-xs text-blue-700">of Medicare physicians</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">3.5×</div>
                    <div className="text-xs text-blue-700">overrepresented in flags</div>
                  </div>
                </div>
              </div>

              {/* Source Citation */}
              <SourceCitation
                sources={[
                  'CMS Medicare Provider Utilization and Payment Data (2014–2023)',
                  'HHS Office of Inspector General — List of Excluded Individuals/Entities (LEIE)',
                  'OpenMedicare ML Model v2.0 (Random Forest, AUC 0.83)',
                  'DOJ Healthcare Fraud Prosecution Records by Specialty',
                ]}
              />

              {/* Related Investigations */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Related Investigations</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    href="/investigations/algorithm-knows"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">The Algorithm Knows</div>
                    <p className="text-xs text-gray-600">
                      How AI trained on 8,300 convicted fraudsters found 500 providers who bill just like them.
                    </p>
                  </Link>
                  <Link
                    href="/investigations/florida-california-fraud"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">The Fraud Belt</div>
                    <p className="text-xs text-gray-600">
                      Why California and Florida lead Medicare fraud — 56 flagged providers each.
                    </p>
                  </Link>
                  <Link
                    href="/investigations/million-dollar-flagged"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">The Million-Dollar Club</div>
                    <p className="text-xs text-gray-600">
                      47 AI-flagged providers who each billed Medicare over $1 million.
                    </p>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 not-prose">
                  <Link href="/investigations/impossible-doctors" className="block bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors no-underline">
                    <div className="text-sm font-bold text-gray-900">The Impossible Doctors</div>
                    <p className="text-xs text-gray-600">Providers billing 400+ services per day</p>
                  </Link>
                  <Link href="/investigations/office-visit-economy" className="block bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors no-underline">
                    <div className="text-sm font-bold text-gray-900">The Office Visit Economy</div>
                    <p className="text-xs text-gray-600">How E&M codes drive Medicare spending</p>
                  </Link>
                  <Link href="/investigations/specialty-monopoly" className="block bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors no-underline">
                    <div className="text-sm font-bold text-gray-900">The Specialty Monopoly</div>
                    <p className="text-xs text-gray-600">How a few specialties dominate Medicare</p>
                  </Link>
                  <Link href="/investigations/nurse-practitioner-boom" className="block bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors no-underline">
                    <div className="text-sm font-bold text-gray-900">The NP Boom</div>
                    <p className="text-xs text-gray-600">How nurse practitioners are reshaping primary care billing</p>
                  </Link>
                </div>
                <div className="mt-4 not-prose">
                  <p className="text-sm text-gray-600">
                    Explore: <Link href="/specialties/internal-medicine" className="text-medicare-primary hover:underline">Internal Medicine data</Link> · <Link href="/specialties/family-practice" className="text-medicare-primary hover:underline">Family Practice data</Link> · <Link href="/fraud" className="text-medicare-primary hover:underline">Fraud Analysis Hub</Link> · <Link href="/fraud/upcoding" className="text-medicare-primary hover:underline">Upcoding Detector</Link> · <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline">Full Watchlist</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
