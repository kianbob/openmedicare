import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { ArrowDownTrayIcon, DocumentChartBarIcon, InformationCircleIcon, TableCellsIcon, BookOpenIcon, CodeBracketIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Data Downloads',
  description: 'Download Medicare provider payment data, fraud watchlist, spending analysis, and research datasets in JSON format. Free, open data for journalists, researchers, and developers.',
}

function getFileSize(filePath: string): string {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath)
    const stats = fs.statSync(fullPath)
    const kb = stats.size / 1024
    if (kb > 1024) return `${(kb / 1024).toFixed(1)} MB`
    return `${kb.toFixed(0)} KB`
  } catch { return '' }
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

interface DataFile {
  name: string
  filename: string
  description: string
}

interface DataCategory {
  category: string
  icon: 'core' | 'fraud' | 'deep'
  files: DataFile[]
}

const dataCategories: DataCategory[] = [
  {
    category: 'Core Data',
    icon: 'core',
    files: [
      { name: 'Top Providers', filename: 'top-providers.json', description: 'Top 1,000 Medicare providers by payments' },
      { name: 'Fraud Watchlist', filename: 'watchlist.json', description: '500 providers flagged for billing anomalies' },
      { name: 'States', filename: 'states.json', description: 'State-level Medicare spending data' },
      { name: 'Specialties', filename: 'specialties.json', description: 'Specialty-level spending data' },
      { name: 'Procedures', filename: 'procedures.json', description: 'Procedure-level spending data' },
      { name: 'Trends', filename: 'trends.json', description: '10-year spending trends' },
    ],
  },
  {
    category: 'Fraud Analysis',
    icon: 'fraud',
    files: [
      { name: 'Fraud Feature Matrix', filename: 'fraud-features.json', description: 'Fraud feature matrix for 1.14M providers (services/day, markup, etc.)' },
      { name: 'COVID Test Billing', filename: 'covid-test-billing.json', description: '$2.84B in COVID test (K1034) billing analysis' },
      { name: 'Wound Care', filename: 'wound-care.json', description: '$5.53B in wound care billing analysis' },
      { name: 'Upcoding Detection', filename: 'upcoding.json', description: 'Upcoding detection (99214/99213 ratio analysis)' },
      { name: 'ML v2 Results', filename: 'ml-v2-results.json', description: 'Machine learning fraud model v2 results — 500 flagged providers with fraud probabilities, risk factors, and markup ratios. Model AUC: 0.83.' },
    ],
  },
  {
    category: 'Deep Analysis',
    icon: 'deep',
    files: [
      { name: 'Place of Service', filename: 'place-of-service.json', description: 'Office vs facility spending' },
      { name: 'Geographic', filename: 'geographic.json', description: '500 cities, 200 zip codes' },
      { name: 'Standardized Payments', filename: 'standardized-payments.json', description: 'Geographic cost adjustments' },
      { name: 'Allowed Amounts', filename: 'allowed-amounts.json', description: 'Three-way payment gap ($3.22T charged)' },
      { name: 'Utilization', filename: 'utilization.json', description: 'Individual vs organization analysis' },
      { name: 'Markup Analysis', filename: 'markup-analysis.json', description: 'Specialty markup ratios' },
      { name: 'Drug Spending', filename: 'drug-spending.json', description: 'Drug spending trends' },
      { name: 'Rural vs Urban', filename: 'rural-urban.json', description: 'Rural vs urban analysis' },
    ],
  },
]

const csvDownloads = [
  { name: 'Top Providers Summary', description: 'Top 100 Medicare providers by total payments — NPI, name, specialty, state, payments, and services.', path: '/downloads/top-providers-summary.csv' },
  { name: 'State Summary', description: 'All states and territories with total Medicare payments, provider counts, services, and markup ratios.', path: '/downloads/state-summary.csv' },
  { name: 'Specialty Summary', description: 'All 132 medical specialties with total payments, provider counts, and markup ratios.', path: '/downloads/specialty-summary.csv' },
  { name: 'Fraud Watchlist', description: 'All 500 watchlist providers with risk scores, billing flags, and payment totals.', path: '/downloads/watchlist-summary.csv' },
]

const dictionaryEntries = [
  { field: 'npi', type: 'string', description: 'National Provider Identifier — unique 10-digit ID assigned to every Medicare provider' },
  { field: 'total_payments', type: 'number', description: 'Sum of Medicare payments received across all services and years' },
  { field: 'services_per_day', type: 'number', description: 'Total services ÷ 250 working days — flags impossibly high billing volumes' },
  { field: 'markup_ratio', type: 'number', description: 'Submitted charges ÷ Medicare payments — how much more than the Medicare rate was billed' },
  { field: 'risk_score', type: 'number', description: 'Composite anomaly score (0–100) combining multiple billing flags (watchlist only)' },
  { field: 'specialty_zscore', type: 'number', description: 'Standard deviations from specialty median — measures how far a provider deviates from peers' },
  { field: 'total_charged', type: 'number', description: 'Sum of submitted charges (what provider billed before Medicare adjustments)' },
  { field: 'total_services', type: 'number', description: 'Total service line items billed to Medicare' },
  { field: 'total_beneficiaries', type: 'number', description: 'Unique Medicare patients served' },
  { field: 'hcpcs_code', type: 'string', description: 'Healthcare Common Procedure Coding System code identifying specific services' },
  { field: 'specialty', type: 'string', description: 'CMS-assigned provider specialty classification' },
  { field: 'fraud_probability', type: 'number', description: 'ML model v2 predicted probability of fraud (0–1). Only present in ml-v2-results.json for flagged providers.' },
  { field: 'risk_rank', type: 'number', description: 'Rank among flagged providers (1 = highest risk). Only in ml-v2-results.json.' },
  { field: 'top_risk_factors', type: 'string[]', description: 'Human-readable descriptions of why the provider was flagged (e.g., "Matches confirmed fraud profile")' },
  { field: 'services_per_bene', type: 'number', description: 'Average services per beneficiary — high values indicate potential over-utilization' },
  { field: 'avg_markup', type: 'number', description: 'Average markup ratio across all services (watchlist providers)' },
  { field: 'flags', type: 'object[]', description: 'Array of billing flags with type, description, and severity (watchlist providers)' },
]

export default function DownloadsPage() {
  // Count total files
  let totalSize = 0
  const allFiles = dataCategories.flatMap(c => c.files)
  allFiles.forEach(f => {
    try {
      const fullPath = path.join(process.cwd(), 'public', 'data', f.filename)
      totalSize += fs.statSync(fullPath).size
    } catch {}
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Data Downloads' }]} className="mb-8" />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">Data Downloads</h1>
          <p className="text-xl text-gray-600 mb-6">
            Access our complete Medicare spending datasets for research, journalism, and analysis.
            All {formatNumber(allFiles.length)} datasets are free to download.
          </p>

          <div className="bg-blue-50 border-l-4 border-medicare-primary p-4 mb-8">
            <div className="flex">
              <InformationCircleIcon className="h-5 w-5 text-medicare-primary mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-medicare-dark">Open Data — Free to Use</h3>
                <p className="text-sm text-gray-700 mt-1">
                  All data is sourced from public CMS records (2014–2023). Licensed under{' '}
                  <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="text-medicare-primary hover:underline">CC BY 4.0</a>.
                  Please cite OpenMedicare when using our datasets. See our{' '}
                  <Link href="/api-docs" className="text-medicare-primary hover:underline">API documentation</Link> for programmatic access.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-sm text-gray-500">JSON Datasets</div>
            <div className="text-2xl font-bold text-gray-900">{allFiles.length}</div>
            <div className="text-xs text-gray-400">analysis & research files</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-sm text-gray-500">Total Data Size</div>
            <div className="text-2xl font-bold text-gray-900">{(totalSize / 1024 / 1024).toFixed(0)} MB+</div>
            <div className="text-xs text-gray-400">of processed Medicare data</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-sm text-gray-500">Coverage</div>
            <div className="text-2xl font-bold text-gray-900">2014–2023</div>
            <div className="text-xs text-gray-400">10 years of CMS Medicare data</div>
          </div>
        </div>

        {/* CSV Downloads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
            <TableCellsIcon className="h-5 w-5 text-green-600 mr-2" />
            CSV Downloads — Ready for Excel
          </h2>
          <p className="text-sm text-gray-500 mb-4">Pre-formatted CSV files ready for Excel, Google Sheets, or any data tool.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {csvDownloads.map((file) => {
              const size = getFileSize(file.path)
              return (
                <div key={file.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-1">{file.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{file.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">CSV</span>
                      {size && <span className="text-xs text-gray-400">{size}</span>}
                    </div>
                    <a href={file.path} download className="inline-flex items-center px-3 py-1.5 border border-green-600 text-sm font-medium rounded-md text-green-700 hover:bg-green-600 hover:text-white transition-colors">
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* JSON Datasets by Category */}
        <div className="space-y-8">
          {dataCategories.map((category) => (
            <div key={category.category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                <DocumentChartBarIcon className={`h-5 w-5 mr-2 ${category.icon === 'fraud' ? 'text-red-600' : category.icon === 'core' ? 'text-medicare-primary' : 'text-purple-600'}`} />
                {category.category}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {category.icon === 'core' && 'Essential Medicare spending datasets — providers, states, specialties, and trends.'}
                {category.icon === 'fraud' && 'Anomaly detection and billing investigation datasets.'}
                {category.icon === 'deep' && 'Detailed breakdowns by geography, place of service, utilization, and more.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.files.map((file) => {
                  const size = getFileSize(`/data/${file.filename}`)
                  return (
                    <div key={file.filename} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 mb-1">{file.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{file.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">JSON</span>
                          {size && <span className="text-xs text-gray-400">{size}</span>}
                          <span className="text-xs text-gray-400 font-mono">{file.filename}</span>
                        </div>
                        <a href={`/data/${file.filename}`} download className="inline-flex items-center px-3 py-1.5 border border-medicare-primary text-sm font-medium rounded-md text-medicare-primary hover:bg-medicare-primary hover:text-white transition-colors">
                          <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Detail Files */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detail Files</h2>
          <p className="text-gray-600 mb-4">Individual detail files are also available for each provider, procedure, state, and specialty. Access them via the site or directly:</p>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-2">
            <div><span className="text-gray-500"># Provider detail:</span> /data/providers/&#123;NPI&#125;.json <span className="text-gray-400">(2,003 files)</span></div>
            <div><span className="text-gray-500"># Procedure detail:</span> /data/procedures/&#123;CODE&#125;.json <span className="text-gray-400">(500 files)</span></div>
            <div><span className="text-gray-500"># State detail:</span> /data/states/&#123;CODE&#125;.json <span className="text-gray-400">(61 files)</span></div>
            <div><span className="text-gray-500"># Specialty detail:</span> /data/specialties/&#123;SLUG&#125;.json <span className="text-gray-400">(105 files)</span></div>
          </div>
        </div>

        {/* API Docs Link */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mt-8">
          <div className="flex items-start">
            <CodeBracketIcon className="h-6 w-6 text-medicare-primary mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Developer API</h2>
              <p className="text-gray-600 mb-3">
                All datasets are available as static JSON files at predictable URLs — no authentication needed.
                Perfect for building dashboards, research tools, or data journalism projects.
              </p>
              <Link href="/api-docs" className="inline-flex items-center px-4 py-2 bg-medicare-primary text-white text-sm font-medium rounded-md hover:bg-medicare-dark transition-colors">
                View API Documentation →
              </Link>
            </div>
          </div>
        </div>

        {/* Data Dictionary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
            <BookOpenIcon className="h-5 w-5 text-gray-600 mr-2" />
            Data Dictionary
          </h2>
          <p className="text-sm text-gray-500 mb-4">Key fields used across our datasets.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 pr-4 font-semibold text-gray-900">Field</th>
                  <th className="py-2 pr-4 font-semibold text-gray-900">Type</th>
                  <th className="py-2 font-semibold text-gray-900">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dictionaryEntries.map((entry) => (
                  <tr key={entry.field}>
                    <td className="py-2 pr-4 font-mono text-xs">{entry.field}</td>
                    <td className="py-2 pr-4 text-gray-500">{entry.type}</td>
                    <td className="py-2 text-gray-600">{entry.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CMS Source */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Original CMS Source Data</h2>
          <p className="text-gray-600 mb-4">Our data is derived from the CMS Medicare Provider Utilization and Payment dataset. You can access the original source files directly from CMS:</p>
          <a href="https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicare-physician-other-practitioners-by-provider-and-service" target="_blank" rel="noopener noreferrer" className="text-medicare-primary hover:text-medicare-dark font-medium">
            CMS Medicare Provider Data →
          </a>
        </div>

        <div className="mt-8">
          <SourceCitation lastUpdated="February 2026 (data through 2023, the latest CMS release)" />
        </div>
      </div>
    </div>
  )
}
