import type { Metadata } from 'next'
import { ArrowDownTrayIcon, DocumentChartBarIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'

export const metadata: Metadata = {
  title: 'Data Downloads — OpenMedicare',
  description: 'Download Medicare provider payment data, fraud watchlist, spending analysis, and research datasets.',
}

const datasets = [
  {
    category: 'Core Datasets',
    files: [
      { name: 'Top Medicare Providers', description: 'Top providers by total Medicare payments with specialty, state, and 10-year totals', path: '/data/top-providers.json', format: 'JSON' },
      { name: 'Fraud Watchlist', description: '500 providers flagged for statistical billing anomalies with risk scores and flags', path: '/data/watchlist.json', format: 'JSON' },
      { name: 'Markup Analysis', description: 'Markup ratios by specialty, state, top providers, and yearly trends', path: '/data/markup-analysis.json', format: 'JSON' },
      { name: 'Overall Statistics', description: 'Aggregate stats: total payments, providers, services across all years', path: '/data/stats.json', format: 'JSON' },
    ]
  },
  {
    category: 'Spending Analysis',
    files: [
      { name: 'Spending Trends (2014-2023)', description: 'Year-by-year Medicare payments, providers, services, and charges', path: '/data/trends.json', format: 'JSON' },
      { name: 'Drug Spending', description: 'Top drugs by Medicare spending, yearly drug share trends', path: '/data/drug-spending.json', format: 'JSON' },
      { name: 'Rural vs Urban', description: 'Spending comparison between rural and urban areas by specialty', path: '/data/rural-urban.json', format: 'JSON' },
    ]
  },
  {
    category: 'Directory Data',
    files: [
      { name: 'All States Summary', description: 'Medicare spending summary for all 50 states and territories', path: '/data/states.json', format: 'JSON' },
      { name: 'Top 500 Procedures', description: 'Most common procedures/drugs by total Medicare payments', path: '/data/procedures.json', format: 'JSON' },
      { name: 'All Specialties', description: 'Medicare spending breakdown by medical specialty', path: '/data/specialties.json', format: 'JSON' },
    ]
  },
]

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Data Downloads' }]} className="mb-8" />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">Data Downloads</h1>
          <p className="text-xl text-gray-600 mb-6">Access our complete Medicare spending datasets for your own research, journalism, and analysis.</p>

          <div className="bg-blue-50 border-l-4 border-medicare-primary p-4 mb-8">
            <div className="flex">
              <InformationCircleIcon className="h-5 w-5 text-medicare-primary mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-medicare-dark">Data Usage</h3>
                <p className="text-sm text-gray-700 mt-1">All data is sourced from public CMS records (2014-2023, the latest available release) and is free to use. Please cite OpenMedicare as the source when using our datasets.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div>
            <div className="text-sm text-gray-500">Total Data Files</div>
            <div className="text-2xl font-bold text-gray-900">2,669+</div>
            <div className="text-xs text-gray-400">providers, procedures, states, specialties</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Coverage</div>
            <div className="text-2xl font-bold text-gray-900">2014-2023</div>
            <div className="text-xs text-gray-400">10 years of CMS Medicare data</div>
          </div>
        </div>

        <div className="space-y-8">
          {datasets.map((category) => (
            <div key={category.category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <DocumentChartBarIcon className="h-5 w-5 text-medicare-primary mr-2" />
                {category.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.files.map((file) => (
                  <div key={file.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-1">{file.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{file.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{file.format}</span>
                      <a href={file.path} download className="inline-flex items-center px-3 py-1.5 border border-medicare-primary text-sm font-medium rounded-md text-medicare-primary hover:bg-medicare-primary hover:text-white transition-colors">
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

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
