import type { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import Link from 'next/link'
import { CodeBracketIcon, GlobeAltIcon, ShieldCheckIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Free Medicare Data API — 20+ JSON Endpoints',
  description: 'Access 96M+ Medicare claims via free JSON endpoints. No API key needed. Fraud scores, spending trends, provider lookups — ready for any language.',
}

const endpoints = [
  { path: '/data/ml-v2-results.json', description: 'ML model v2 fraud detection results — scores, features, and classifications for flagged providers' },
  { path: '/data/stats.json', description: 'Site-wide summary statistics (provider counts, payment totals, model metrics)' },
  { path: '/data/top-providers.json', description: 'Top 1,000 Medicare providers by payments' },
  { path: '/data/watchlist.json', description: '500 providers flagged for billing anomalies' },
  { path: '/data/states.json', description: 'State-level Medicare spending data' },
  { path: '/data/specialties.json', description: 'Specialty-level spending data' },
  { path: '/data/procedures.json', description: 'Procedure-level spending data' },
  { path: '/data/trends.json', description: '10-year spending trends (2014–2023)' },
  { path: '/data/fraud-features.json', description: 'Fraud feature matrix for 1.14M providers' },
  { path: '/data/covid-test-billing.json', description: '$2.84B COVID test billing analysis' },
  { path: '/data/wound-care.json', description: '$5.53B wound care billing analysis' },
  { path: '/data/upcoding.json', description: 'Upcoding detection (99214/99213 ratios)' },
  { path: '/data/place-of-service.json', description: 'Office vs facility spending' },
  { path: '/data/geographic.json', description: '500 cities, 200 zip codes' },
  { path: '/data/standardized-payments.json', description: 'Geographic cost adjustments' },
  { path: '/data/allowed-amounts.json', description: 'Three-way payment gap analysis' },
  { path: '/data/utilization.json', description: 'Individual vs organization analysis' },
  { path: '/data/markup-analysis.json', description: 'Specialty markup ratios' },
  { path: '/data/drug-spending.json', description: 'Drug spending trends' },
  { path: '/data/rural-urban.json', description: 'Rural vs urban analysis' },
]

const apiEndpoints = [
  { path: '/api/stats', method: 'GET', description: 'Live JSON stats — total providers, flagged count, payments, model AUC, last updated' },
  { path: '/api/embed/fraud-stats', method: 'GET', description: 'Embeddable HTML widget showing key fraud stats (use in iframe)' },
]

const detailEndpoints = [
  { pattern: '/data/providers/{NPI}.json', example: '/data/providers/1003000126.json', description: 'Individual provider detail (2,003 providers)' },
  { pattern: '/data/procedures/{CODE}.json', example: '/data/procedures/99213.json', description: 'Procedure detail (500 procedures)' },
  { pattern: '/data/states/{CODE}.json', example: '/data/states/CA.json', description: 'State detail (61 states/territories)' },
  { pattern: '/data/specialties/{SLUG}.json', example: '/data/specialties/internal-medicine.json', description: 'Specialty detail (105 specialties)' },
]

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'API Documentation' }]} className="mb-8" />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">API Documentation</h1>
          <p className="text-xl text-gray-600 mb-6">
            Access all OpenMedicare data programmatically via static JSON endpoints.
            No authentication, no rate limits, no API keys.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <ShieldCheckIcon className="h-6 w-6 text-green-600 mb-2" />
            <div className="font-semibold text-gray-900">No Auth Required</div>
            <div className="text-sm text-gray-500 mt-1">Just fetch the URL. No API keys, no tokens, no sign-up.</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <GlobeAltIcon className="h-6 w-6 text-blue-600 mb-2" />
            <div className="font-semibold text-gray-900">CDN-Backed</div>
            <div className="text-sm text-gray-500 mt-1">Served from Vercel&apos;s global edge network. Fast anywhere.</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <ClockIcon className="h-6 w-6 text-purple-600 mb-2" />
            <div className="font-semibold text-gray-900">Periodic Updates</div>
            <div className="text-sm text-gray-500 mt-1">Refreshed with new CMS releases (currently through 2023).</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <DocumentTextIcon className="h-6 w-6 text-orange-600 mb-2" />
            <div className="font-semibold text-gray-900">CC BY 4.0</div>
            <div className="text-sm text-gray-500 mt-1">Free to use with attribution. Open data for everyone.</div>
          </div>
        </div>

        {/* Base URL */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Base URL</h2>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
            https://www.openmedicare.us/data/
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Also available at <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">https://www.openmedicare.us/data/</code>
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Start</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">JavaScript / fetch</h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                <pre>{`const res = await fetch('https://www.openmedicare.us/data/watchlist.json')
const data = await res.json()
console.log(data.providers.length) // 500 flagged providers`}</pre>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Python</h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                <pre>{'import requests\ndata = requests.get(\'https://www.openmedicare.us/data/states.json\').json()\nfor state in data[\'states\'][:5]:\n    print(state[\'state\'], state[\'total_payments\'])'}</pre>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">cURL</h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                <pre>{`curl -s https://www.openmedicare.us/data/trends.json | jq '.yearly_totals[0]'`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Aggregate Endpoints */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
            <CodeBracketIcon className="h-5 w-5 text-medicare-primary mr-2" />
            Aggregate Datasets
          </h2>
          <p className="text-sm text-gray-500 mb-4">Pre-computed analysis files covering all of Medicare.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 pr-4 font-semibold text-gray-900">Endpoint</th>
                  <th className="py-2 font-semibold text-gray-900">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {endpoints.map((ep) => (
                  <tr key={ep.path}>
                    <td className="py-2 pr-4">
                      <a href={ep.path} className="font-mono text-xs text-medicare-primary hover:underline">{ep.path}</a>
                    </td>
                    <td className="py-2 text-gray-600">{ep.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Endpoints */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Detail Endpoints</h2>
          <p className="text-sm text-gray-500 mb-4">Individual records for providers, procedures, states, and specialties.</p>
          <div className="space-y-4">
            {detailEndpoints.map((ep) => (
              <div key={ep.pattern} className="border border-gray-200 rounded-lg p-4">
                <div className="font-mono text-sm text-gray-900 mb-1">{ep.pattern}</div>
                <div className="text-sm text-gray-600 mb-2">{ep.description}</div>
                <div className="text-xs text-gray-400">
                  Example: <a href={ep.example} className="text-medicare-primary hover:underline font-mono">{ep.example}</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic API Endpoints */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
            <GlobeAltIcon className="h-5 w-5 text-green-600 mr-2" />
            Dynamic API Endpoints
          </h2>
          <p className="text-sm text-gray-500 mb-4">Live server-side endpoints returning real-time data.</p>
          <div className="space-y-4">
            {apiEndpoints.map((ep) => (
              <div key={ep.path} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-green-100 text-green-800 text-xs font-mono font-bold px-2 py-0.5 rounded">{ep.method}</span>
                  <a href={ep.path} className="font-mono text-sm text-medicare-primary hover:underline">{ep.path}</a>
                </div>
                <div className="text-sm text-gray-600">{ep.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Example: /api/stats response */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Example: /api/stats Response</h2>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
            <pre>{`{
  "total_providers": 1719625,
  "flagged_providers": 500,
  "total_payments": 854800000000,
  "flagged_payments": 400000000,
  "model_auc": 0.83,
  "articles": 51,
  "last_updated": "2026-02-21"
}`}</pre>
          </div>
          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">total_providers</code> — Total unique Medicare providers in dataset (1.72M)</p>
            <p><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">flagged_providers</code> — Providers flagged by ML model for billing anomalies</p>
            <p><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">total_payments</code> — Total Medicare payments in dollars (2014–2023)</p>
            <p><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">flagged_payments</code> — Payments associated with flagged providers</p>
            <p><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">model_auc</code> — Area Under ROC Curve for the fraud detection model</p>
            <p><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">articles</code> — Number of investigative articles published</p>
            <p><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">last_updated</code> — Date of last data refresh (ISO format)</p>
          </div>
        </div>

        {/* Embeddable Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Embeddable Widget</h2>
          <p className="text-sm text-gray-600 mb-4">
            Embed a live fraud stats card on your site. See the <Link href="/embed" className="text-medicare-primary hover:underline">widget preview page</Link> for a live demo and copy-paste code.
          </p>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
            <pre>{`<iframe src="https://www.openmedicare.us/api/embed/fraud-stats"
  width="500" height="180" frameborder="0"
  style="border:none;border-radius:16px;overflow:hidden;"
  title="OpenMedicare Fraud Stats"></iframe>`}</pre>
          </div>
        </div>

        {/* Usage & Attribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Usage & Attribution</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">License</h3>
              <p>All data is licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="text-medicare-primary hover:underline">Creative Commons Attribution 4.0 (CC BY 4.0)</a>. You are free to use, share, and adapt the data for any purpose, including commercial use.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Attribution</h3>
              <p>Please credit <strong>OpenMedicare</strong> and link to <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">www.openmedicare.us</code> when using our data.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Data Source</h3>
              <p>Original data from <a href="https://data.cms.gov" target="_blank" rel="noopener noreferrer" className="text-medicare-primary hover:underline">CMS (Centers for Medicare & Medicaid Services)</a>. Medicare Provider Utilization and Payment Data, 2014–2023.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Update Frequency</h3>
              <p>Datasets are refreshed periodically as CMS publishes new annual releases. Current data covers 2014–2023 (the latest available release).</p>
            </div>
          </div>
        </div>

        {/* Who is this for */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Who Is This For?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">📰 Journalists</h3>
              <p className="text-sm text-gray-600">Download pre-analyzed datasets for Medicare spending stories. Find outliers, trends, and anomalies without wrangling raw CMS data.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">🔬 Researchers</h3>
              <p className="text-sm text-gray-600">Access fraud feature matrices, geographic breakdowns, and 10-year time series for academic research and policy analysis.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">💻 Developers</h3>
              <p className="text-sm text-gray-600">Build dashboards, visualizations, or tools on top of our data. Static JSON endpoints work with any language or framework.</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <Link href="/downloads" className="text-medicare-primary hover:text-medicare-dark font-medium">
            ← Back to Downloads
          </Link>
        </div>

        <SourceCitation lastUpdated="February 2026 (data through 2023, the latest CMS release)" />
      </div>
    </div>
  )
}
