import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Florida\'s Fraud Factory: 185 Impossible Providers Billing $573M',
  description: 'Florida leads the nation with 185 providers billing 400+ services per day — more than California and Texas combined. A deep dive into Medicare\'s fraud capital.',
  alternates: { canonical: '/investigations/florida-infectious-disease' },
  openGraph: {
    title: 'Florida\'s Fraud Factory: 185 Impossible Providers Billing $573M',
    description: 'Florida leads the nation with 185 impossible-volume providers — more than California and Texas combined.',
    url: 'https://www.openmedicare.org/investigations/florida-infectious-disease',
  },
}

const topFLProviders = [
  { npi: '1639622665', name: 'Jeffrey Lin', specialty: 'Infectious Disease', city: 'Fort Walton Beach', total: 2212636, drug_share: 49.9, svc_day: 8486.2 },
  { npi: '1598731770', name: 'Patrick Anastasio', specialty: 'Internal Medicine', city: 'Fort Walton Beach', total: 10307266, drug_share: 96.0, svc_day: 4733.1 },
  { npi: '1023364387', name: 'Vinicius Costa Diniz Domingues', specialty: 'Rheumatology', city: 'Daytona Beach', total: 4616484, drug_share: 90.6, svc_day: 4099.9 },
  { npi: '1902008170', name: 'Wilfredo Blasini', specialty: 'Pathology', city: 'Fort Myers', total: 16915367, drug_share: 0, svc_day: 3312.4 },
  { npi: '1033383351', name: 'Ryan Olson', specialty: 'Pathology', city: 'Fort Myers', total: 12763533, drug_share: 0, svc_day: 2990.0 },
  { npi: '1679763387', name: 'Michael Vincent Tablang', specialty: 'Infectious Disease', city: 'Crestview', total: 2018935, drug_share: 58.4, svc_day: 2867.6 },
  { npi: '1003868993', name: 'Vipul Joshi', specialty: 'Rheumatology', city: 'Brandon', total: 5559017, drug_share: 90.7, svc_day: 2517.7 },
  { npi: '1497957476', name: 'Amir Baluch', specialty: 'Anesthesiology', city: 'Miami', total: 6353074, drug_share: 0, svc_day: 2155.2 },
  { npi: '1073571949', name: 'Christopher Lobo', specialty: 'Hematology-Oncology', city: 'Port Charlotte', total: 6129989, drug_share: 88.0, svc_day: 2030.7 },
  { npi: '1326260837', name: 'Vijay Patel', specialty: 'Hematology-Oncology', city: 'Gainesville', total: 4802989, drug_share: 89.2, svc_day: 2028.4 },
  { npi: '1750370755', name: 'Steven Newman', specialty: 'Internal Medicine', city: 'Naples', total: 5698631, drug_share: 85.8, svc_day: 1930.9 },
  { npi: '1750341327', name: 'Huayang Tang', specialty: 'Hematology-Oncology', city: 'Spring Hill', total: 3747941, drug_share: 82.8, svc_day: 1831.2 },
  { npi: '1508874439', name: 'Steven Licata', specialty: 'Osteopathic Manipulative Medicine', city: 'Ft Lauderdale', total: 5556814, drug_share: 0.1, svc_day: 1804.0 },
  { npi: '1972613057', name: 'Mohamed Aboyoussef', specialty: 'Rheumatology', city: 'Merritt Island', total: 3632122, drug_share: 90.7, svc_day: 1761.9 },
  { npi: '1780654889', name: 'Andrew Lipman', specialty: 'Hematology-Oncology', city: 'Naples', total: 5615722, drug_share: 87.3, svc_day: 1744.9 },
  { npi: '1538154596', name: 'George Camacho', specialty: 'Internal Medicine', city: 'Jacksonville', total: 5272112, drug_share: 0, svc_day: 1742.0 },
  { npi: '1952509606', name: 'Jay Wang', specialty: 'Medical Oncology', city: 'Naples', total: 4536312, drug_share: 87.3, svc_day: 1709.0 },
  { npi: '1285735944', name: 'Marc Hirsh', specialty: 'Rheumatology', city: 'Delray Beach', total: 4561496, drug_share: 68.9, svc_day: 1699.9 },
  { npi: '1013002880', name: 'Padmaja Sai', specialty: 'Hematology-Oncology', city: 'Palm Coast', total: 3688669, drug_share: 80.4, svc_day: 1682.1 },
  { npi: '1750383980', name: 'Rakesh Rohatgi', specialty: 'Hematology-Oncology', city: 'The Villages', total: 2503819, drug_share: 78.2, svc_day: 1622.7 },
]

const stateRankings = [
  { state: 'Florida', count: 185 },
  { state: 'California', count: 98 },
  { state: 'Texas', count: 91 },
  { state: 'South Carolina', count: 50 },
  { state: 'Virginia', count: 44 },
  { state: 'Maryland', count: 43 },
  { state: 'New York', count: 43 },
  { state: 'Arizona', count: 42 },
  { state: 'Illinois', count: 42 },
  { state: 'Arkansas', count: 39 },
]

export default function FloridaInfectiousDiseasePage() {
  const publishedDate = '2026-02-21'
  const readTime = '13 min read'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'Florida\'s Fraud Factory' },
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
                Florida&apos;s Fraud Factory
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                185 Impossible Providers Billing {formatCurrency(573000000)}
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

            {/* Lead */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Florida has long been called America&apos;s Medicare fraud capital. Our data confirms it.
                The Sunshine State has <strong>185 individual providers</strong> billing more than 400 services
                per working day — more than California (98) and Texas (91) <em>combined</em>. These 185 providers
                billed a combined <strong>{formatCurrency(573000000)}</strong>. The patterns span oncology,
                rheumatology, infectious disease, pathology, and internal medicine — and they cluster in
                surprising places.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The State Rankings</h2>
              <p>
                When we rank states by the number of individual providers billing at impossible volumes
                (400+ services per working day), Florida dominates:
              </p>
            </div>

            {/* State Rankings */}
            <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stateRankings.map((s, i) => (
                <div key={s.state} className={`flex items-center justify-between p-3 rounded-lg ${i === 0 ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                  <span className="font-medium text-gray-900">
                    <span className="text-gray-400 mr-2">#{i + 1}</span>
                    {s.state}
                  </span>
                  <span className={`font-bold ${i === 0 ? 'text-red-700 text-lg' : 'text-gray-700'}`}>{s.count}</span>
                </div>
              ))}
            </div>

            <div className="prose prose-lg max-w-none">
              <p>
                Florida has nearly <strong>double</strong> the count of California, despite having a smaller
                population. The concentration is striking: 185 out of roughly 1,100 impossible-volume providers
                nationwide are in Florida — <strong>17% of the national total from one state</strong>.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Fort Walton Beach Connection</h2>
              <p>
                Fort Walton Beach is a small city of 22,000 people on Florida&apos;s panhandle. It has two
                providers on our impossible list: <strong>Jeffrey Lin</strong>, an infectious disease specialist
                billing {formatNumber(8486)} services per day, and <strong>Patrick Anastasio</strong>, an internal
                medicine doctor billing {formatNumber(4733)} services per day with 96% drug billing.
              </p>
              <p>
                Lin&apos;s {formatNumber(8486)} services per day means one service every{' '}
                <strong>3.4 seconds</strong> for 8 hours straight. Even if infectious disease involves
                multiple drug infusion codes per patient visit, this volume from a single doctor in a
                small panhandle city defies explanation.
              </p>
              <p>
                Nearby Crestview (population 28,000) has Michael Vincent Tablang, another infectious disease
                specialist, billing {formatNumber(2868)} services per day. Two small neighboring cities,
                three impossible providers, over {formatCurrency(14500000)} in combined billing.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Florida&apos;s Top 20 Impossible Providers</h2>
            </div>

            {/* Data Table */}
            <div className="my-8 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Provider</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Specialty</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">City</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-700">Total</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-700">Drug %</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-700">Svc/Day</th>
                  </tr>
                </thead>
                <tbody>
                  {topFLProviders.map((doc, i) => (
                    <tr key={doc.npi} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="py-2 px-2">
                        <Link href={`/provider/${doc.npi}`} className="text-medicare-primary hover:underline font-medium text-xs sm:text-sm">
                          {doc.name}
                        </Link>
                      </td>
                      <td className="py-2 px-2 text-gray-600 text-xs">{doc.specialty}</td>
                      <td className="py-2 px-2 text-gray-600 text-xs">{doc.city}</td>
                      <td className="py-2 px-2 text-right font-mono text-xs">{formatCurrency(doc.total)}</td>
                      <td className="py-2 px-2 text-right text-xs">
                        <span className={doc.drug_share > 80 ? 'text-red-700 font-semibold' : ''}>{doc.drug_share}%</span>
                      </td>
                      <td className="py-2 px-2 text-right text-xs">
                        <span className={doc.svc_day > 3000 ? 'text-red-700 font-semibold' : ''}>{formatNumber(Math.round(doc.svc_day))}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Specialty Breakdown</h2>
              <p>
                Florida&apos;s 185 impossible providers aren&apos;t concentrated in one specialty — they span
                the full spectrum of high-billing medicine:
              </p>

              {/* Stats boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8 not-prose">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-700">84</div>
                  <div className="text-xs text-gray-700">Hematology-Oncology</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-700">45</div>
                  <div className="text-xs text-gray-700">Rheumatology</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">17</div>
                  <div className="text-xs text-gray-700">Medical Oncology</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-orange-700">39</div>
                  <div className="text-xs text-gray-700">Other Specialties</div>
                </div>
              </div>

              <p>
                The dominance of oncology and rheumatology — both drug-heavy specialties — mirrors the national
                pattern. But Florida&apos;s numbers are outsized relative to its population. The state has about
                6.5% of the U.S. population but 17% of impossible-volume providers.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Fort Myers Pathology Pair</h2>
              <p>
                Two pathologists in Fort Myers — <strong>Wilfredo Blasini</strong> ({formatCurrency(16915367)},
                {formatNumber(3312)} svc/day) and <strong>Ryan Olson</strong> ({formatCurrency(12763533)},
                {formatNumber(2990)} svc/day) — stand out for a different reason. Their drug billing is 0%.
                Pathology involves reading slides and specimens — high-volume work that can legitimately
                generate large service counts through automation and batch processing.
              </p>
              <p>
                But combined they billed nearly {formatCurrency(30000000)}. For pathology. In Fort Myers.
                Whether this represents efficient high-throughput laboratory medicine or something else is
                worth investigating.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why Florida?</h2>
              <p>
                Florida&apos;s status as Medicare&apos;s fraud capital has several structural explanations:
              </p>
              <ul>
                <li><strong>Demographics:</strong> Florida has the second-highest share of residents 65+ in the nation, creating an enormous Medicare market</li>
                <li><strong>Regulatory environment:</strong> Florida has historically had lighter healthcare regulation than states like New York or California</li>
                <li><strong>Geographic dispersion:</strong> Providers aren&apos;t just in Miami — they&apos;re spread across small cities like Fort Walton Beach, Crestview, Spring Hill, and The Villages</li>
                <li><strong>Established networks:</strong> DOJ investigations have repeatedly uncovered organized fraud rings operating in Florida, particularly in South Florida</li>
              </ul>
              <p>
                The DOJ&apos;s 2024 National Health Care Fraud Enforcement Action — the largest ever at $14.6 billion —
                included multiple Florida defendants. Miami-Dade County alone has been the subject of more Medicare
                fraud prosecutions than most states.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Small Cities, Big Billing</h2>
              <p>
                Perhaps the most striking pattern is <em>where</em> these providers practice. Not Miami or Tampa
                or Orlando — but Naples, Port Charlotte, Spring Hill, The Villages, Palm Coast, Merritt Island.
                Small and mid-sized cities where a single high-billing provider can represent an outsized
                share of local Medicare spending.
              </p>
              <p>
                The Villages — a massive retirement community — has Rakesh Rohatgi billing {formatNumber(1623)}
                services per day in hematology-oncology. Naples has three providers in the top 20: an internal
                medicine doctor, an oncologist, and a medical oncologist, collectively billing over{' '}
                {formatCurrency(15000000)}.
              </p>
              <p>
                Florida&apos;s impossible-volume providers billed a combined {formatCurrency(573000000)}.
                Not all of this is fraud — drug-heavy specialties like oncology genuinely produce high service
                counts. But when one state consistently produces nearly double the impossible providers of any
                other, the pattern demands scrutiny.
              </p>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-8">
                <p className="text-sm text-amber-900 mb-0">
                  <strong>Disclaimer:</strong> The billing patterns described in this article are statistical flags
                  based on publicly available CMS data, not accusations of fraud. High service volumes may reflect
                  legitimate practice patterns, multi-provider billing under a single NPI, or drug-heavy specialties.
                  Named providers have not been charged with any crime unless otherwise stated. If you
                  suspect fraud, report it to the OIG.
                </p>
              </div>
            </div>

            {/* Related */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href="/investigations/impossible-doctors" className="text-medicare-primary hover:underline text-sm">🧮 The Impossible Doctors</Link>
                <Link href="/investigations/geographic-inequality" className="text-medicare-primary hover:underline text-sm">📍 ZIP Code Lottery</Link>
                <Link href="/investigations/medicare-fraud-2025" className="text-medicare-primary hover:underline text-sm">⚖️ Medicare Fraud in 2025</Link>
                <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
              </div>
            </div>

            <ShareButtons
              url="https://www.openmedicare.org/investigations/florida-infectious-disease"
              title="Florida's Fraud Factory — OpenMedicare"
            />

            <div className="mt-6">
              <SourceCitation
                sources={[
                  'Centers for Medicare & Medicaid Services (CMS) — Medicare Provider Utilization and Payment Data (2014-2023)',
                  'Department of Justice — 2024 National Health Care Fraud Enforcement Action',
                  'HHS Office of Inspector General (OIG)',
                  'U.S. Census Bureau — Population Estimates',
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
