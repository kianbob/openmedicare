import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ExclamationTriangleIcon, MapPinIcon, UserIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { TrendChart, BarChart } from '@/components/Charts'
import { formatCurrency, formatNumber, formatPercent, toTitleCase } from '@/lib/format'

interface ProviderData {
  npi: string
  name: string
  credentials: string
  specialty: string
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  totalPayments: number
  totalServices: number
  beneficiaries: number
  years: number[]
  yearlyData: Array<{
    year: number
    payments: number
    services: number
    beneficiaries: number
  }>
  topProcedures: Array<{
    code: string
    description: string
    services: number
    payments: number
    avgCost: number
  }>
  markupRatio: number
  peerComparison: {
    specialty: string
    percentile: number
    medianPayment: number
  }
  riskFlags: Array<{
    type: string
    description: string
    severity: 'low' | 'medium' | 'high'
  }>
}

// Mock data - will be replaced with real data from /data/providers/{npi}.json
const mockProviderData: ProviderData = {
  npi: '1234567890',
  name: 'Dr. Sarah Johnson',
  credentials: 'MD',
  specialty: 'Cardiology',
  address: {
    street: '123 Medical Center Dr',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90210'
  },
  totalPayments: 2850000,
  totalServices: 12500,
  beneficiaries: 3200,
  years: [2019, 2020, 2021, 2022, 2023],
  yearlyData: [
    { year: 2019, payments: 520000, services: 2100, beneficiaries: 580 },
    { year: 2020, payments: 485000, services: 1950, beneficiaries: 540 },
    { year: 2021, payments: 580000, services: 2400, beneficiaries: 650 },
    { year: 2022, payments: 615000, services: 2650, beneficiaries: 720 },
    { year: 2023, payments: 650000, services: 3400, beneficiaries: 710 }
  ],
  topProcedures: [
    { 
      code: '93307', 
      description: 'Echocardiography, transthoracic', 
      services: 1250, 
      payments: 425000, 
      avgCost: 340 
    },
    { 
      code: '93306', 
      description: 'Echocardiography, complete', 
      services: 980, 
      payments: 295000, 
      avgCost: 301 
    },
    { 
      code: '99213', 
      description: 'Office visit, established patient', 
      services: 2100, 
      payments: 180000, 
      avgCost: 86 
    }
  ],
  markupRatio: 2.4,
  peerComparison: {
    specialty: 'Cardiology',
    percentile: 75,
    medianPayment: 485000
  },
  riskFlags: [
    {
      type: 'High Markup',
      description: 'Charges 2.4x more than Medicare pays (specialty average: 1.8x)',
      severity: 'medium'
    }
  ]
}

interface PageProps {
  params: Promise<{ npi: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { npi } = await params
  
  // In a real app, you'd fetch the provider data here
  const providerName = 'Dr. Sarah Johnson' // This would come from the API
  
  return {
    title: `${providerName} (NPI: ${npi})`,
    description: `Medicare payment details for ${providerName}. View total payments, procedures, and peer comparisons.`,
    alternates: {
      canonical: `/providers/${npi}`,
    },
  }
}

async function loadProviderData(npi: string): Promise<ProviderData | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/data/providers/${npi}.json`)
    if (response.ok) {
      return response.json()
    }
  } catch (error) {
    console.error('Error loading provider data:', error)
  }
  
  // Return mock data if real data isn't available yet
  if (npi === '1234567890') {
    return mockProviderData
  }
  
  return null
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const { npi } = await params
  
  const providerData = await loadProviderData(npi)
  
  if (!providerData) {
    notFound()
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { name: 'Explore', href: '/providers' },
            { name: 'Providers', href: '/providers' },
            { name: providerData.name }
          ]}
          className="mb-8"
        />

        {/* Provider Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 font-playfair mb-2">
                {providerData.name}, {providerData.credentials}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  <span>NPI: {providerData.npi}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{providerData.address.city}, {providerData.address.state}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 mr-2" />
                  <span>{providerData.years.length} years of data</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-medicare-primary">
                    {formatCurrency(providerData.totalPayments)}
                  </div>
                  <div className="text-sm text-gray-600">Total Medicare Payments</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatNumber(providerData.beneficiaries)}
                  </div>
                  <div className="text-sm text-gray-600">Medicare Beneficiaries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatNumber(providerData.totalServices)}
                  </div>
                  <div className="text-sm text-gray-600">Total Services</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 lg:mt-0 lg:ml-8">
              <div className="bg-gray-50 rounded-lg p-6 min-w-[200px]">
                <h3 className="font-semibold text-gray-900 mb-4">Specialty</h3>
                <p className="text-lg font-medium text-medicare-primary mb-4">
                  {providerData.specialty}
                </p>
                
                <h4 className="font-semibold text-gray-900 mb-2">Peer Comparison</h4>
                <p className="text-sm text-gray-600">
                  {providerData.peerComparison.percentile}th percentile in {providerData.peerComparison.specialty}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Specialty median: {formatCurrency(providerData.peerComparison.medianPayment)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Flags */}
        {providerData.riskFlags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-4">
              Risk Analysis
            </h2>
            <div className="space-y-3">
              {providerData.riskFlags.map((flag, index) => (
                <div 
                  key={index}
                  className={`border rounded-lg p-4 ${getSeverityColor(flag.severity)}`}
                >
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">{flag.type}</h3>
                      <p className="text-sm">{flag.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Payment Trends */}
          <TrendChart
            data={providerData.yearlyData}
            xDataKey="year"
            yDataKey="payments"
            title="Annual Medicare Payments"
            height={350}
          />

          {/* Services Trends */}
          <TrendChart
            data={providerData.yearlyData}
            xDataKey="year"
            yDataKey="services"
            title="Annual Services Provided"
            height={350}
          />
        </div>

        {/* Top Procedures */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-6">
            Top Procedures (2023)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Procedure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Payments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {providerData.topProcedures.map((procedure) => (
                  <tr key={procedure.code}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {procedure.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          Code: {procedure.code}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(procedure.services)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(procedure.payments)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(procedure.avgCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Markup Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-6">
            Markup Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Charge-to-Payment Ratio
              </h3>
              <div className="text-4xl font-bold text-medicare-primary mb-2">
                {providerData.markupRatio}x
              </div>
              <p className="text-sm text-gray-600 mb-4">
                This provider submits charges {providerData.markupRatio} times higher than what Medicare actually pays.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">What This Means</h4>
                <p className="text-sm text-gray-600">
                  A markup ratio of {providerData.markupRatio}x means for every $100 Medicare pays, 
                  this provider initially charges ${(providerData.markupRatio * 100).toFixed(0)}. 
                  This is {providerData.markupRatio > 2 ? 'higher' : 'lower'} than the specialty average.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Address Information
              </h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p>{providerData.address.street}</p>
                    <p>{providerData.address.city}, {providerData.address.state} {providerData.address.zip}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Provider Verification</h4>
                <p className="text-sm text-blue-800">
                  Always verify provider credentials and location before scheduling appointments. 
                  This data reflects Medicare payments and may not include all practice locations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Share This Provider
              </h3>
              <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                Share this provider's Medicare payment information
              </p>
            </div>
            <ShareButtons
              url={`/providers/${providerData.npi}`}
              title={`${providerData.name} - Medicare Provider`}
              description={`Medicare payment details for ${providerData.name}, ${providerData.specialty} in ${providerData.address.city}, ${providerData.address.state}`}
            />
          </div>
        </div>

        {/* Source Citation */}
        <SourceCitation 
          lastUpdated="February 2024"
          sources={[
            'Centers for Medicare & Medicaid Services (CMS)',
            'Medicare Provider Utilization and Payment Data (2014-2023)',
            'National Plan and Provider Enumeration System (NPPES)'
          ]}
        />
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  // In production, this would fetch the top 200 provider NPIs
  // For now, return a few sample NPIs
  return [
    { npi: '1234567890' },
    { npi: '1234567891' },
    { npi: '1234567892' }
  ]
}

export const dynamicParams = true