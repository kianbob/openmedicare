import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Data Sources — Where Our Medicare Data Comes From | OpenMedicare',
  description: 'Complete list of data sources powering OpenMedicare, including CMS Medicare claims, HHS OIG exclusions, and DOJ fraud cases with freshness dates and record counts.',
}

const dataSources = [
  {
    name: 'CMS Medicare Physician & Other Practitioners',
    provider: 'Centers for Medicare & Medicaid Services (CMS)',
    url: 'https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicare-physician-other-practitioners-by-provider-and-service',
    description: 'The primary dataset powering OpenMedicare. Contains every Medicare Part B claim at the provider-service level, including services rendered, beneficiaries served, submitted charges, allowed amounts, and Medicare payments.',
    years: '2014–2023',
    records: '~96 million rows (all years combined)',
    freshness: 'Updated annually by CMS, typically with a 2-year lag. Most recent data: Calendar year 2023.',
    lastUpdated: 'December 2024',
    fields: [
      'Provider NPI, name, credentials, specialty',
      'Practice address (city, state, ZIP)',
      'HCPCS code and description',
      'Place of service (facility vs. non-facility)',
      'Number of services, unique beneficiaries',
      'Average submitted charge, allowed amount, Medicare payment',
    ],
  },
  {
    name: 'HHS OIG List of Excluded Individuals/Entities (LEIE)',
    provider: 'Department of Health & Human Services, Office of Inspector General',
    url: 'https://oig.hhs.gov/exclusions/exclusions_list.asp',
    description: 'Database of individuals and entities excluded from all federal healthcare programs due to convictions for fraud, patient abuse, licensing violations, or other misconduct. We cross-reference this with active Medicare billing data to identify providers who may still be practicing.',
    years: '1977–present',
    records: '~78,000 excluded individuals/entities',
    freshness: 'Updated monthly by OIG.',
    lastUpdated: 'January 2025',
    fields: [
      'Name and business name',
      'NPI (when available)',
      'Exclusion type and authority',
      'Exclusion and reinstatement dates',
      'State and specialty',
    ],
  },
  {
    name: 'DOJ Healthcare Fraud Cases',
    provider: 'U.S. Department of Justice',
    url: 'https://www.justice.gov/criminal/criminal-fraud/health-care-fraud-unit',
    description: 'Public records of federal healthcare fraud prosecutions, settlements, and convictions. Used to validate our fraud detection model against confirmed cases and to provide context for flagged providers.',
    years: '2010–present',
    records: '~2,500 cases referenced',
    freshness: 'Cases added as they are publicly announced.',
    lastUpdated: 'Ongoing',
    fields: [
      'Defendant names and locations',
      'Fraud type and scheme description',
      'Dollar amounts involved',
      'Sentencing and settlement outcomes',
    ],
  },
  {
    name: 'CMS Provider Enrollment Data',
    provider: 'Centers for Medicare & Medicaid Services',
    url: 'https://data.cms.gov/provider-characteristics/medicare-provider-supplier-enrollment/medicare-fee-for-service-public-provider-enrollment',
    description: 'Supplementary enrollment data used to verify provider credentials, practice locations, and enrollment status. Helps identify providers billing from unusual locations or with irregular enrollment patterns.',
    years: 'Current snapshot',
    records: '~2.1 million enrolled providers',
    freshness: 'Updated quarterly.',
    lastUpdated: 'Q4 2024',
    fields: [
      'NPI and enrollment ID',
      'Provider type and specialty',
      'Practice location(s)',
      'Enrollment and certification dates',
    ],
  },
  {
    name: 'NPPES NPI Registry',
    provider: 'Centers for Medicare & Medicaid Services',
    url: 'https://npiregistry.cms.hhs.gov/',
    description: 'The National Plan and Provider Enumeration System registry containing all assigned NPIs. Used to resolve provider identities, verify credentials, and link records across datasets.',
    years: 'Current',
    records: '~7.8 million NPIs assigned',
    freshness: 'Updated daily.',
    lastUpdated: 'Live',
    fields: [
      'NPI number',
      'Provider name and credentials',
      'Taxonomy (specialty) codes',
      'Practice and mailing addresses',
    ],
  },
]

export default function DataSourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <Breadcrumbs items={[{ name: 'Data Sources' }]} />

        <h1 className="mt-8 font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Data Sources
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Every number on OpenMedicare comes from publicly available government data.
          Here&apos;s exactly where it comes from, how fresh it is, and what it contains.
          See our <Link href="/methodology" className="text-medicare-primary hover:underline">methodology</Link> for
          how we process and analyze this data.
        </p>

        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-blue-800">
            <strong>Transparency commitment:</strong> We only use publicly available government data.
            No proprietary datasets, no purchased records, no scraped patient information.
            Anyone can verify our analysis using the same sources listed below.
          </p>
        </div>

        {/* Summary stats */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold text-medicare-primary">5</div>
            <div className="text-xs text-gray-500 mt-1">Data Sources</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold text-medicare-primary">96M+</div>
            <div className="text-xs text-gray-500 mt-1">Claims Records</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold text-medicare-primary">10</div>
            <div className="text-xs text-gray-500 mt-1">Years of Data</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold text-medicare-primary">100%</div>
            <div className="text-xs text-gray-500 mt-1">Public Data</div>
          </div>
        </div>

        {/* Data sources */}
        <div className="mt-12 space-y-10">
          {dataSources.map((source, i) => (
            <div key={source.name} className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-gray-900">{source.name}</h2>
                    <p className="mt-1 text-sm text-gray-500">{source.provider}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Active
                  </span>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm leading-relaxed text-gray-600">{source.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Coverage</span>
                    <p className="mt-1 text-sm font-medium text-gray-900">{source.years}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Scale</span>
                    <p className="mt-1 text-sm font-medium text-gray-900">{source.records}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Update Frequency</span>
                    <p className="mt-1 text-sm font-medium text-gray-900">{source.freshness}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Last Updated</span>
                    <p className="mt-1 text-sm font-medium text-gray-900">{source.lastUpdated}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Key Fields</span>
                  <ul className="mt-2 space-y-1">
                    {source.fields.map((field, j) => (
                      <li key={j} className="flex items-start text-sm text-gray-600">
                        <span className="mr-2 mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                        {field}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-medicare-primary hover:underline"
                  >
                    View original source →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Related pages */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <h2 className="font-serif text-xl font-bold text-gray-900">Related Pages</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/methodology" className="rounded-lg border border-gray-200 p-4 hover:border-medicare-primary hover:bg-blue-50 transition-colors">
              <div className="text-sm font-semibold text-gray-900">Methodology</div>
              <div className="text-xs text-gray-500 mt-1">How we analyze the data</div>
            </Link>
            <Link href="/glossary" className="rounded-lg border border-gray-200 p-4 hover:border-medicare-primary hover:bg-blue-50 transition-colors">
              <div className="text-sm font-semibold text-gray-900">Glossary</div>
              <div className="text-xs text-gray-500 mt-1">Terms and definitions</div>
            </Link>
            <Link href="/downloads" className="rounded-lg border border-gray-200 p-4 hover:border-medicare-primary hover:bg-blue-50 transition-colors">
              <div className="text-sm font-semibold text-gray-900">Downloads</div>
              <div className="text-xs text-gray-500 mt-1">Raw data and CSVs</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
