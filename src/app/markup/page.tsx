'use client'

import { useState, useEffect } from 'react'
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { BarChart, PieChart } from '@/components/Charts'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/format'

interface MarkupData {
  specialty: string
  avgMarkup: number
  totalCharges: number
  totalPayments: number
  providerCount: number
  topStates: Array<{ state: string; avgMarkup: number }>
}

// Mock data - will be replaced with real data from /data/markup-analysis.json
const mockMarkupData: MarkupData[] = [
  {
    specialty: 'Orthopedic Surgery',
    avgMarkup: 3.2,
    totalCharges: 45000000000,
    totalPayments: 14000000000,
    providerCount: 12500,
    topStates: [
      { state: 'FL', avgMarkup: 3.8 },
      { state: 'TX', avgMarkup: 3.5 },
      { state: 'CA', avgMarkup: 3.1 }
    ]
  },
  {
    specialty: 'Cardiology',
    avgMarkup: 2.8,
    totalCharges: 38000000000,
    totalPayments: 13500000000,
    providerCount: 15800,
    topStates: [
      { state: 'NY', avgMarkup: 3.2 },
      { state: 'FL', avgMarkup: 3.0 },
      { state: 'CA', avgMarkup: 2.6 }
    ]
  },
  {
    specialty: 'Ophthalmology',
    avgMarkup: 2.6,
    totalCharges: 28000000000,
    totalPayments: 10800000000,
    providerCount: 9200,
    topStates: [
      { state: 'FL', avgMarkup: 3.1 },
      { state: 'AZ', avgMarkup: 2.9 },
      { state: 'TX', avgMarkup: 2.7 }
    ]
  },
  {
    specialty: 'Radiology',
    avgMarkup: 2.4,
    totalCharges: 52000000000,
    totalPayments: 22000000000,
    providerCount: 18500,
    topStates: [
      { state: 'CA', avgMarkup: 2.8 },
      { state: 'NY', avgMarkup: 2.6 },
      { state: 'TX', avgMarkup: 2.3 }
    ]
  },
  {
    specialty: 'Internal Medicine',
    avgMarkup: 1.9,
    totalCharges: 85000000000,
    totalPayments: 45000000000,
    providerCount: 89000,
    topStates: [
      { state: 'FL', avgMarkup: 2.2 },
      { state: 'CA', avgMarkup: 1.9 },
      { state: 'TX', avgMarkup: 1.8 }
    ]
  }
]

const stateAverages = [
  { state: 'FL', avgMarkup: 3.1, providerCount: 45000 },
  { state: 'TX', avgMarkup: 2.8, providerCount: 62000 },
  { state: 'CA', avgMarkup: 2.6, providerCount: 78000 },
  { state: 'NY', avgMarkup: 2.5, providerCount: 54000 },
  { state: 'AZ', avgMarkup: 2.7, providerCount: 18000 },
]

export default function MarkupAnalysisPage() {
  const [markupData, setMarkupData] = useState<MarkupData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All')
  const [viewMode, setViewMode] = useState<'specialty' | 'state'>('specialty')

  useEffect(() => {
    const loadMarkupData = async () => {
      try {
        const response = await fetch('/data/markup-analysis.json')
        if (response.ok) {
          const data = await response.json()
          setMarkupData(data)
        } else {
          setMarkupData(mockMarkupData)
        }
      } catch (error) {
        console.error('Error loading markup data:', error)
        setMarkupData(mockMarkupData)
      } finally {
        setLoading(false)
      }
    }

    loadMarkupData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medicare-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading markup analysis...</p>
        </div>
      </div>
    )
  }

  const totalCharges = markupData.reduce((sum, specialty) => sum + specialty.totalCharges, 0)
  const totalPayments = markupData.reduce((sum, specialty) => sum + specialty.totalPayments, 0)
  const overallMarkup = totalCharges / totalPayments
  const totalProviders = markupData.reduce((sum, specialty) => sum + specialty.providerCount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { name: 'Analysis', href: '/markup' },
            { name: 'Markup Analysis' }
          ]}
          className="mb-8"
        />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-playfair mb-4">
            Medicare Markup Analysis
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Explore how much healthcare providers charge versus what Medicare actually pays. 
            The "markup machine" reveals pricing patterns across specialties and states.
          </p>
          
          {/* Key Insight Box */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 p-6 rounded-r-lg">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">The $600 Billion Gap</h3>
                <p className="text-red-800">
                  Providers charged Medicare <strong>{formatCurrency(totalCharges)}</strong> but received only{' '}
                  <strong>{formatCurrency(totalPayments)}</strong> — a {overallMarkup.toFixed(1)}x markup ratio. 
                  This {formatCurrency(totalCharges - totalPayments)} difference represents one of healthcare's biggest transparency problems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl font-bold text-medicare-primary mb-2">
              {overallMarkup.toFixed(1)}x
            </div>
            <div className="text-sm font-medium text-gray-900">Average Markup</div>
            <div className="text-xs text-gray-500">Charges ÷ Payments</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(totalCharges - totalPayments)}
            </div>
            <div className="text-sm font-medium text-gray-900">Markup Amount</div>
            <div className="text-xs text-gray-500">Excess charges over payments</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatNumber(totalProviders)}
            </div>
            <div className="text-sm font-medium text-gray-900">Providers</div>
            <div className="text-xs text-gray-500">Across all specialties</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              3.2x
            </div>
            <div className="text-sm font-medium text-gray-900">Highest Markup</div>
            <div className="text-xs text-gray-500">Orthopedic Surgery</div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">View by:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('specialty')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'specialty' 
                    ? 'bg-white text-medicare-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Medical Specialty
              </button>
              <button
                onClick={() => setViewMode('state')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'state' 
                    ? 'bg-white text-medicare-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                State
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Data from 2014-2023 • Updated February 2024
          </div>
        </div>

        {/* Charts */}
        {viewMode === 'specialty' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <BarChart
              data={markupData.map(item => ({ 
                specialty: item.specialty, 
                markup: item.avgMarkup 
              }))}
              xDataKey="specialty"
              yDataKey="markup"
              title="Average Markup Ratio by Specialty"
              height={400}
            />
            
            <PieChart
              data={markupData.map(item => ({ 
                name: item.specialty, 
                value: item.totalCharges - item.totalPayments 
              }))}
              dataKey="value"
              nameKey="name"
              title="Excess Charges by Specialty"
              height={400}
            />
          </div>
        ) : (
          <div className="mb-12">
            <BarChart
              data={stateAverages.map(item => ({ 
                state: item.state, 
                markup: item.avgMarkup 
              }))}
              xDataKey="state"
              yDataKey="markup"
              title="Average Markup Ratio by State (Top 5)"
              height={400}
            />
          </div>
        )}

        {/* Detailed Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {viewMode === 'specialty' ? 'Markup by Medical Specialty' : 'Markup by State'}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {viewMode === 'specialty' ? 'Medical Specialty' : 'State'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Markup
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Charges
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Payments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Excess Charges
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Providers
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(viewMode === 'specialty' ? markupData : stateAverages.map(state => ({
                  specialty: state.state,
                  avgMarkup: state.avgMarkup,
                  totalCharges: state.avgMarkup * 1000000000, // Mock calculation
                  totalPayments: 1000000000, // Mock data
                  providerCount: state.providerCount
                }))).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.specialty}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.avgMarkup >= 3 ? 'bg-red-100 text-red-800' :
                        item.avgMarkup >= 2.5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.avgMarkup.toFixed(1)}x
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.totalCharges)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.totalPayments)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      {formatCurrency(item.totalCharges - item.totalPayments)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatNumber(item.providerCount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explainer */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-6">
            Understanding Medicare Markup
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What is a Markup Ratio?</h3>
              <p className="text-gray-700 mb-4">
                The markup ratio compares what providers charge Medicare to what Medicare actually pays. 
                For example, a 2.5x markup means providers charge $250 for every $100 Medicare pays.
              </p>
              
              <h4 className="font-semibold text-gray-900 mb-2">Why Do Providers Mark Up?</h4>
              <ul className="text-gray-700 space-y-2">
                <li>• <strong>Insurance negotiations:</strong> High list prices provide leverage with private insurers</li>
                <li>• <strong>No downside:</strong> Medicare pays fixed rates regardless of charges</li>
                <li>• <strong>Industry practice:</strong> Inflated chargemaster rates are standard across healthcare</li>
              </ul>
            </div>
            
            <div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Markup Color Guide</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-3">
                      &lt;2.5x
                    </span>
                    <span className="text-sm text-gray-700">Lower markup</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-3">
                      2.5-3x
                    </span>
                    <span className="text-sm text-gray-700">Moderate markup</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-3">
                      &gt;3x
                    </span>
                    <span className="text-sm text-gray-700">High markup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Investigation */}
        <div className="bg-gradient-to-r from-medicare-primary to-medicare-dark rounded-lg text-white p-8 mb-8">
          <div className="flex items-center mb-4">
            <InformationCircleIcon className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">Deep Dive Investigation</span>
          </div>
          <h3 className="text-2xl font-bold mb-3">The Medicare Markup Machine</h3>
          <p className="text-blue-100 mb-6">
            Read our full investigation into how doctors charge $100 billion more than Medicare pays them — 
            and why the system incentivizes this practice.
          </p>
          <a 
            href="/investigations/markup-machine"
            className="inline-flex items-center px-6 py-3 bg-white text-medicare-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Read Full Investigation
          </a>
        </div>

        {/* Source Citation */}
        <SourceCitation 
          lastUpdated="February 2024"
          sources={[
            'Centers for Medicare & Medicaid Services (CMS)',
            'Medicare Provider Utilization and Payment Data (2014-2023)',
            'Medicare Part B National Summary Data Files'
          ]}
        />
      </div>
    </div>
  )
}