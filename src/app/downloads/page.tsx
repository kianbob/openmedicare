import type { Metadata } from 'next'
import { ArrowDownTrayIcon, DocumentChartBarIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'

export const metadata: Metadata = {
  title: 'Data Downloads',
  description: 'Download Medicare provider payment data, spending analysis, and research datasets from OpenMedicare.',
  alternates: {
    canonical: '/downloads',
  },
}

const datasets = [
  {
    category: 'Provider Data',
    files: [
      {
        name: 'Top Medicare Providers (2023)',
        description: 'Top 10,000 providers by Medicare payments with specialty, location, and payment details',
        filename: 'top-providers-2023.csv',
        size: '2.5 MB',
        format: 'CSV',
        lastUpdated: '2024-02-15'
      },
      {
        name: 'Complete Provider Dataset',
        description: 'All Medicare providers 2014-2023 with annual payment summaries',
        filename: 'all-providers-2014-2023.zip',
        size: '850 MB',
        format: 'ZIP (CSV files)',
        lastUpdated: '2024-02-15'
      }
    ]
  },
  {
    category: 'Analysis & Rankings',
    files: [
      {
        name: 'Fraud Watchlist',
        description: 'Risk-scored providers flagged for potential billing irregularities',
        filename: 'medicare-watchlist-2024.csv',
        size: '1.2 MB',
        format: 'CSV',
        lastUpdated: '2024-02-20'
      },
      {
        name: 'Markup Analysis',
        description: 'Provider markup ratios (submitted charges vs Medicare payments) by specialty',
        filename: 'medicare-markup-analysis.csv',
        size: '3.1 MB',
        format: 'CSV',
        lastUpdated: '2024-02-15'
      }
    ]
  },
  {
    category: 'Procedures & Services',
    files: [
      {
        name: 'Top Medicare Procedures',
        description: 'Most common procedures with average costs and utilization data',
        filename: 'top-procedures-2023.csv',
        size: '800 KB',
        format: 'CSV',
        lastUpdated: '2024-02-15'
      },
      {
        name: 'Drug Spending Analysis',
        description: 'Medicare Part B drug spending trends 2014-2023',
        filename: 'drug-spending-trends.csv',
        size: '1.8 MB',
        format: 'CSV',
        lastUpdated: '2024-02-15'
      }
    ]
  },
  {
    category: 'Geographic Analysis',
    files: [
      {
        name: 'State-Level Spending',
        description: 'Medicare spending summaries by state with per-capita analysis',
        filename: 'state-spending-summary.csv',
        size: '150 KB',
        format: 'CSV',
        lastUpdated: '2024-02-15'
      },
      {
        name: 'Rural vs Urban Analysis',
        description: 'Healthcare spending comparison between rural and urban areas',
        filename: 'rural-urban-spending.csv',
        size: '500 KB',
        format: 'CSV',
        lastUpdated: '2024-02-15'
      }
    ]
  }
]

const apiEndpoints = [
  {
    name: 'Provider Lookup API',
    description: 'Search providers by NPI, name, or location',
    endpoint: 'GET /api/providers/search',
    example: '/api/providers/search?name=Smith&state=CA'
  },
  {
    name: 'Provider Details API',
    description: 'Get detailed information for a specific provider',
    endpoint: 'GET /api/providers/{npi}',
    example: '/api/providers/1234567890'
  },
  {
    name: 'Procedure Data API',
    description: 'Get procedure codes with average costs',
    endpoint: 'GET /api/procedures',
    example: '/api/procedures?code=99213'
  }
]

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { name: 'Data Downloads' }
          ]}
          className="mb-8"
        />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-playfair mb-4">
            Data Downloads
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Access our complete Medicare spending datasets, analysis files, and research data for your own investigations.
          </p>
          
          {/* Usage Notice */}
          <div className="bg-blue-50 border-l-4 border-medicare-primary p-4 mb-8">
            <div className="flex">
              <InformationCircleIcon className="h-5 w-5 text-medicare-primary mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-medicare-dark">Data Usage Terms</h3>
                <p className="text-sm text-gray-700 mt-1">
                  All data is sourced from public CMS records and is free to use for research, journalism, and analysis. 
                  We ask that you cite OpenMedicare as the source and link back to this page when using our datasets.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dataset Categories */}
        <div className="space-y-12">
          {datasets.map((category) => (
            <div key={category.category} className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-6 flex items-center">
                <DocumentChartBarIcon className="h-6 w-6 text-medicare-primary mr-3" />
                {category.category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.files.map((file) => (
                  <div key={file.name} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{file.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{file.description}</p>
                        
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                          <span className="bg-gray-100 px-2 py-1 rounded">{file.format}</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">{file.size}</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">Updated {file.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-medicare-primary text-sm font-medium rounded-md text-medicare-primary bg-white hover:bg-medicare-primary hover:text-white transition-colors">
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Download {file.filename}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* API Access */}
        <div className="bg-white rounded-lg shadow-sm p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-6">
            API Access
          </h2>
          <p className="text-gray-600 mb-6">
            Access our data programmatically through our REST API. All endpoints return JSON data and support pagination.
          </p>
          
          <div className="space-y-4">
            {apiEndpoints.map((api) => (
              <div key={api.name} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{api.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{api.description}</p>
                
                <div className="bg-gray-50 rounded p-3 font-mono text-sm">
                  <div className="text-gray-900 mb-1">{api.endpoint}</div>
                  <div className="text-gray-500">Example: {api.example}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">API Coming Soon</h3>
            <p className="text-sm text-yellow-700">
              Our REST API is currently in development. Sign up for updates to be notified when it launches.
            </p>
            <button className="mt-2 inline-flex items-center px-3 py-2 border border-yellow-400 text-sm font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 transition-colors">
              Notify Me When Available
            </button>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white rounded-lg shadow-sm p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-6">
            Technical Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Data Processing</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Data updated monthly when CMS releases new files</li>
                <li>• All files are UTF-8 encoded with standard CSV formatting</li>
                <li>• Provider names and addresses are standardized for consistency</li>
                <li>• Missing or invalid data points are clearly marked as NULL</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Data Dictionary</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>NPI:</strong> National Provider Identifier (unique ID)</li>
                <li>• <strong>HCPCS:</strong> Healthcare Procedure Coding System</li>
                <li>• <strong>Submitted Amount:</strong> Provider's original charge</li>
                <li>• <strong>Payment Amount:</strong> Actual Medicare payment</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mt-12">
          <div className="border-t border-gray-200 pt-6">
            <ShareButtons
              url="/downloads"
              title="OpenMedicare Data Downloads"
              description="Access complete Medicare spending datasets and analysis files"
            />
          </div>
        </div>

        {/* Source Citation */}
        <div className="mt-8">
          <SourceCitation 
            lastUpdated="February 2024"
            sources={[
              'Centers for Medicare & Medicaid Services (CMS)',
              'Medicare Provider Utilization and Payment Data (2014-2023)',
              'CMS Provider Enrollment Database',
              'Medicare Part B National Summary Data Files'
            ]}
          />
        </div>
      </div>
    </div>
  )
}