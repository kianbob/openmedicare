import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: 'The Oncology Drug Pipeline: How Cancer Doctors Bill Millions in Drug Costs',
  description: '24 oncologists with >80% drug billing and >$5M each — $171M combined. Cancer drugs are the most profitable category in Medicare.',
  alternates: { canonical: '/investigations/oncology-drug-pipeline' },
  openGraph: {
    title: 'The Oncology Drug Pipeline: How Cancer Doctors Bill Millions in Drug Costs',
    description: '24 oncologists with >80% drug billing and >$5M each — $171M combined.',
    url: 'https://www.openmedicare.org/investigations/oncology-drug-pipeline',
  },
}

const topOncologists = [
  { npi: '1285603639', name: 'Vinh-Linh Nguyen', city: 'Bakersfield', state: 'CA', total: 11475668, drug_share: 94.2, svc_day: 1534.9 },
  { npi: '1831109792', name: 'Luke Dreisbach', city: 'Rancho Mirage', state: 'CA', total: 9842685, drug_share: 90.0, svc_day: 3298.6 },
  { npi: '1790765337', name: 'John Waples', city: 'Huntsville', state: 'AL', total: 9638057, drug_share: 88.6, svc_day: 2170.5 },
  { npi: '1982665337', name: 'Thomas Buroker', city: 'Des Moines', state: 'IA', total: 9365695, drug_share: 93.4, svc_day: 2309.1 },
  { npi: '1760413652', name: 'William Sharfman', city: 'Lutherville', state: 'MD', total: 9137964, drug_share: 97.2, svc_day: 895.2 },
  { npi: '1790780716', name: 'Guangzhi Qu', city: 'Jackson', state: 'MS', total: 9077378, drug_share: 90.7, svc_day: 2206.7 },
  { npi: '1053372649', name: 'Bassam Mattar', city: 'Wichita', state: 'KS', total: 7230776, drug_share: 87.3, svc_day: 2287.4 },
  { npi: '1457495483', name: 'Mei Tang', city: 'Baltimore', state: 'MD', total: 6937992, drug_share: 91.9, svc_day: 1707.7 },
  { npi: '1689000697', name: 'Justin Kucinski', city: 'Salisbury', state: 'MD', total: 6923883, drug_share: 93.5, svc_day: 1179.3 },
  { npi: '1174665822', name: 'Jamal Misleh', city: 'Newark', state: 'DE', total: 6824650, drug_share: 92.4, svc_day: 1519.0 },
  { npi: '1043272305', name: 'Dennis Moore', city: 'Wichita', state: 'KS', total: 6748778, drug_share: 89.0, svc_day: 1576.4 },
  { npi: '1932161155', name: 'Pavan Reddy', city: 'Wichita', state: 'KS', total: 6704140, drug_share: 84.5, svc_day: 1579.5 },
  { npi: '1124187927', name: 'James Uyeki', city: 'Austin', state: 'TX', total: 6672098, drug_share: 91.0, svc_day: 1635.2 },
  { npi: '1417927054', name: 'Ravi Rao', city: 'Fresno', state: 'CA', total: 6582462, drug_share: 74.0, svc_day: 2191.1 },
  { npi: '1679529473', name: 'David Portnoy', city: 'Germantown', state: 'TN', total: 6523975, drug_share: 92.2, svc_day: 1347.2 },
  { npi: '1386641082', name: 'David Smith', city: 'Easton', state: 'MD', total: 6380987, drug_share: 92.2, svc_day: 1654.8 },
  { npi: '1659351484', name: 'Richard Cherny', city: 'East Syracuse', state: 'NY', total: 6266160, drug_share: 92.8, svc_day: 1796.1 },
  { npi: '1073571949', name: 'Christopher Lobo', city: 'Port Charlotte', state: 'FL', total: 6129989, drug_share: 88.0, svc_day: 2030.7 },
  { npi: '1811187909', name: 'Syed Zafar', city: 'Fort Myers', state: 'FL', total: 5997539, drug_share: 90.6, svc_day: 1487.3 },
  { npi: '1598747164', name: 'Kamal Patel', city: 'Little Rock', state: 'AR', total: 5689504, drug_share: 85.1, svc_day: 1815.1 },
]

export default function OncologyDrugPipelinePage() {
  const publishedDate = '2026-02-21'
  const readTime = '14 min read'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'The Oncology Drug Pipeline' },
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
                The Oncology Drug Pipeline
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                How Cancer Doctors Bill Millions in Drug Costs
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
                Oncology is the most profitable specialty in Medicare — and the most flagged for impossible billing volumes.
                Of the roughly 1,100 individual providers we identified billing more than 400 services per working day,{' '}
                <strong>532 are hematology-oncology or medical oncology doctors</strong> — nearly half of all impossible providers.
                Twenty-four oncologists each billed over {formatCurrency(5000000)} with more than 80% of their revenue
                coming from drug administration codes, combining for <strong>{formatCurrency(171000000)}</strong> in total payments.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The ASP+6% Incentive</h2>
              <p>
                Medicare reimburses physician-administered drugs under Part B at <strong>ASP+6%</strong> — the Average
                Sales Price plus a 6% markup. This means the more expensive the drug, the more profit the doctor makes.
                A $100 drug earns $6 in markup. A $10,000 drug earns $600. For the same 15-minute injection.
              </p>
              <p>
                Cancer drugs are among the most expensive medications in existence. A single dose of immunotherapy
                can cost Medicare $10,000–$30,000. When oncologists&apos; billing is 80–97% drug codes, the financial
                incentive is clear: the practice revenue depends on which drugs they choose and how many patients
                they infuse.
              </p>
              <p>
                This doesn&apos;t mean every high-billing oncologist is doing something wrong. Chemotherapy infusions
                genuinely involve multiple drug codes per patient visit — a patient might receive 3–5 different
                drug administrations in a single session. But when a single doctor bills {formatNumber(3299)} services
                per working day, the math starts to strain credulity.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Numbers</h2>
              <p>
                We filtered Medicare provider data for hematology-oncology and medical oncology doctors with more than
                60% of their billing in drug administration codes. We found <strong>559 oncologists</strong> matching
                this pattern. The top 20 by total payments:
              </p>
            </div>

            {/* Data Table */}
            <div className="my-8 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Provider</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Location</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700">Total Payments</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700">Drug %</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700">Svc/Day</th>
                  </tr>
                </thead>
                <tbody>
                  {topOncologists.map((doc, i) => (
                    <tr key={doc.npi} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="py-2 px-3">
                        <Link href={`/provider/${doc.npi}`} className="text-medicare-primary hover:underline font-medium">
                          {doc.name}
                        </Link>
                      </td>
                      <td className="py-2 px-3 text-gray-600">{doc.city}, {doc.state}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatCurrency(doc.total)}</td>
                      <td className="py-2 px-3 text-right">
                        <span className={doc.drug_share > 90 ? 'text-red-700 font-semibold' : ''}>{doc.drug_share}%</span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span className={doc.svc_day > 2000 ? 'text-red-700 font-semibold' : ''}>{formatNumber(Math.round(doc.svc_day))}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Dreisbach Question</h2>
              <p>
                Luke Dreisbach, a hematology-oncology specialist in Rancho Mirage, California, tops the list
                for services per day: <strong>{formatNumber(3299)} services per working day</strong>. His total
                Medicare payments reached {formatCurrency(9842685)}, with 90% coming from drug administration codes.
              </p>
              <p>
                Even accounting for multiple drug codes per patient — a typical chemo infusion might generate
                3–5 separate billing codes — {formatNumber(3299)} services per day would require treating
                hundreds of patients daily. At 5 codes per patient, that&apos;s still 660 patients per day.
                At 8 hours, that&apos;s 82 patients per hour, or one every 44 seconds.
              </p>
              <p>
                This likely reflects a large multi-provider practice billing under a single NPI, or a billing
                structure where all infusion services are attributed to the supervising oncologist. But the
                pattern raises questions about Medicare&apos;s &quot;incident-to&quot; billing rules, which allow
                services performed by nurses or PAs to be billed under a physician&apos;s NPI at higher
                reimbursement rates.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Wichita: An Oncology Hotspot</h2>
              <p>
                Three oncologists in Wichita, Kansas appear in the top 20: Bassam Mattar ({formatCurrency(7230776)}),
                Dennis Moore ({formatCurrency(6748778)}), and Pavan Reddy ({formatCurrency(6704140)}). Together,
                they billed over {formatCurrency(20000000)} — all with 84–89% drug billing. Wichita is a city
                of 400,000 people with three oncologists each billing like they serve a major metropolitan area.
              </p>
              <p>
                Maryland also stands out: William Sharfman in Lutherville ({formatCurrency(9137964)}, 97.2% drugs),
                Mei Tang in Baltimore ({formatCurrency(6937992)}, 91.9% drugs), Justin Kucinski in Salisbury
                ({formatCurrency(6923883)}, 93.5% drugs), and David Smith in Easton ({formatCurrency(6380987)},
                92.2% drugs). Four Maryland oncologists in the top 20, with a combined {formatCurrency(29000000)}.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why Oncology Dominates the Impossible List</h2>
              <p>
                Of roughly 1,100 individual providers billing more than 400 services per working day, 532 are
                oncologists — <strong>48% of all impossible-volume providers come from a single specialty group</strong>.
                No other specialty comes close. Rheumatology is second with 288, and it shares the same drug-heavy
                billing model (biologics like Remicade and Rituxan).
              </p>

              {/* Stats boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 not-prose">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-700">532</div>
                  <div className="text-sm text-gray-700">Oncologists billing 400+ services/day</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-700">48%</div>
                  <div className="text-sm text-gray-700">Of all impossible-volume providers</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-700">{formatCurrency(171000000)}</div>
                  <div className="text-sm text-gray-700">From 24 highest-billing drug oncologists</div>
                </div>
              </div>

              <p>
                The structural reason is straightforward: oncology is built on drugs. An office visit generates
                a single billing code worth $100–200. A chemotherapy infusion generates multiple drug codes worth
                thousands each. A busy oncology practice with dozens of infusion chairs running simultaneously
                will naturally produce enormous service counts — but the question is whether one doctor can
                meaningfully supervise all of those infusions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Policy Problem</h2>
              <p>
                The ASP+6% formula has been criticized for decades. The Medicare Payment Advisory Commission
                (MedPAC) has repeatedly recommended switching to a flat fee for drug administration, which
                would eliminate the incentive to choose expensive drugs. Congress has not acted.
              </p>
              <p>
                The Inflation Reduction Act of 2022 began Medicare drug price negotiations for Part D drugs,
                but Part B drugs — the physician-administered drugs that drive oncology billing — remain
                largely untouched. As long as the financial incentive favors expensive drugs, oncology will
                continue to dominate Medicare&apos;s high-billing landscape.
              </p>
              <p>
                The 559 oncologists we identified billing more than 60% in drug codes represent a structural
                feature of how Medicare pays for cancer care — not necessarily fraud. But when the incentives
                are this powerful, and the billing volumes this extreme, the line between aggressive practice
                and billing abuse becomes dangerously thin.
              </p>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-8">
                <p className="text-sm text-amber-900 mb-0">
                  <strong>Disclaimer:</strong> The billing patterns described in this article are statistical flags
                  based on publicly available CMS data, not accusations of fraud. High drug billing in oncology may
                  reflect legitimate practice patterns including multi-drug chemotherapy regimens and incident-to
                  billing. Named providers have not been charged with any crime unless otherwise stated. If you
                  suspect fraud, report it to the OIG.
                </p>
              </div>
            </div>

            {/* Related */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href="/investigations/drug-money" className="text-medicare-primary hover:underline text-sm">💊 Follow the Drug Money</Link>
                <Link href="/investigations/impossible-doctors" className="text-medicare-primary hover:underline text-sm">🧮 The Impossible Doctors</Link>
                <Link href="/investigations/drug-pipeline" className="text-medicare-primary hover:underline text-sm">💉 The Drug Money Pipeline</Link>
                <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
              </div>
            </div>

            <ShareButtons
              url="https://www.openmedicare.org/investigations/oncology-drug-pipeline"
              title="The Oncology Drug Pipeline"
            />

            <div className="mt-6">
              <SourceCitation
                sources={[
                  'Centers for Medicare & Medicaid Services (CMS) — Medicare Provider Utilization and Payment Data (2014-2023)',
                  'Medicare Payment Advisory Commission (MedPAC) — Report to Congress, March 2024',
                  'HHS Office of Inspector General (OIG) — Part B Drug Payment Reports',
                  'CMS ASP Drug Pricing Files',
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
