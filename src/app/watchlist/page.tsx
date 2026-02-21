'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ExclamationTriangleIcon, ShieldExclamationIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

interface WatchlistProvider {
  npi: string
  name: string
  specialty: string
  city: string
  state: string
  riskScore: number
  totalPayments: number
  riskFlags: string[]
  flagCount: number
  primaryConcern: string
}

// Mock data - will be replaced with real data from /data/watchlist.json
const mockWatchlistData: WatchlistProvider[] = [
  {
    npi: '1234567890',
    name: 'Dr. Robert Williams',
    specialty: 'Orthopedic Surgery',
    city: 'Miami',
    state: 'FL',
    riskScore: 95,
    totalPayments: 8500000,
    riskFlags: ['Extreme Markup', 'Outlier Volume', 'Geographic Anomaly'],
    flagCount: 3,
    primaryConcern: 'Charges 4.2x Medicare rates'
  },
  {
    npi: '1234567891',
    name: 'Dr. Sarah Chen',
    specialty: 'Cardiology',
    city: 'Houston',
    state: 'TX',
    riskScore: 88,
    totalPayments: 6200000,
    riskFlags: ['High Markup', 'Unusual Procedures'],
    flagCount: 2,
    primaryConcern: 'Performs rare procedures at 10x normal rate'
  },
  {
    npi: '1234567892',
    name: 'Dr. Michael Rodriguez',
    specialty: 'Ophthalmology',
    city: 'Los Angeles',
    state: 'CA',
    riskScore: 82,
    totalPayments: 4800000,
    riskFlags: ['Volume Outlier', 'Peer Deviation'],
    flagCount: 2,
    primaryConcern: 'Treats 5x more patients than specialty average'
  },
  {
    npi: '1234567893',
    name: 'Dr. Jennifer Davis',
    specialty: 'Radiology',
    city: 'Phoenix',
    state: 'AZ',
    riskScore: 79,
    totalPayments: 3900000,
    riskFlags: ['Geographic Concentration', 'Billing Pattern'],
    flagCount: 2,
    primaryConcern: 'All patients from single ZIP code'
  }
]

const riskCategories = [
  { name: 'All Risk Levels', min: 0, max: 100, count: mockWatchlistData.length, color: 'gray' },
  { name: 'Extreme Risk (90+)', min: 90, max: 100, count: 1, color: 'red' },
  { name: 'High Risk (80-89)', min: 80, max: 89, count: 2, color: 'orange' },
  { name: 'Medium Risk (70-79)', min: 70, max: 79, count: 1, color: 'yellow' },
  { name: 'Lower Risk (60-69)', min: 60, max: 69, count: 0, color: 'blue' }
]

export default function WatchlistPage() {
  const [providers, setProviders] = useState<WatchlistProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('All Risk Levels')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties')
  const [sortBy, setSortBy] = useState('riskScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const loadWatchlistData = async () => {
      try {
        const response = await fetch('/data/watchlist.json')
        if (response.ok) {
          const data = await response.json()
          setProviders(data)
        } else {
          setProviders(mockWatchlistData)
        }
      } catch (error) {
        console.error('Error loading watchlist data:', error)
        setProviders(mockWatchlistData)
      } finally {
        setLoading(false)
      }
    }

    loadWatchlistData()
  }, [])

  const getRiskColor = (score: number) => {
    if (score >= 90) return 'bg-red-100 text-red-800 border-red-200'
    if (score >= 80) return 'bg-orange-100 text-orange-800 border-orange-200'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  const getRiskLabel = (score: number) => {
    if (score >= 90) return 'EXTREME'
    if (score >= 80) return 'HIGH'
    if (score >= 70) return 'MEDIUM'
    return 'LOWER'
  }

  // Filter providers
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.npi.includes(searchTerm) ||
                         provider.city.toLowerCase().includes(searchTerm.toLowerCase())
    
    const riskCategory = riskCategories.find(cat => cat.name === selectedRiskLevel)
    const matchesRisk = selectedRiskLevel === 'All Risk Levels' || 
                       (riskCategory && provider.riskScore >= riskCategory.min && provider.riskScore <= riskCategory.max)
    
    const matchesSpecialty = selectedSpecialty === 'All Specialties' || provider.specialty === selectedSpecialty
    
    return matchesSearch && matchesRisk && matchesSpecialty
  })

  // Sort providers
  const sortedProviders = [...filteredProviders].sort((a, b) => {
    const aValue = a[sortBy as keyof WatchlistProvider] as number
    const bValue = b[sortBy as keyof WatchlistProvider] as number
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const specialties = ['All Specialties', ...Array.from(new Set(providers.map(p => p.specialty)))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medicare-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fraud risk analysis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { name: 'Analysis', href: '/watchlist' },
            { name: 'Fraud Watchlist' }
          ]}
          className="mb-8"
        />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <ShieldExclamationIcon className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 font-playfair">
              Medicare Fraud Watchlist
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Providers flagged by our statistical analysis for potential billing irregularities, 
            unusual patterns, or outlier behavior that may warrant further investigation.
          </p>

          {/* Warning Box */}
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Important Disclaimer</h3>
                <p className="text-red-800 text-sm">
                  <strong>These are statistical risk flags, not fraud accusations.</strong> High risk scores may reflect 
                  legitimate factors like patient complexity, specialty care, or regional practices. This analysis 
                  identifies patterns that may warrant further investigation by appropriate authorities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Level Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {riskCategories.map((category) => (
            <div 
              key={category.name}
              className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-all ${
                selectedRiskLevel === category.name ? 'ring-2 ring-medicare-primary' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedRiskLevel(category.name)}
            >
              <div className="text-center">
                <div className={`text-2xl font-bold mb-2 ${
                  category.color === 'red' ? 'text-red-600' :
                  category.color === 'orange' ? 'text-orange-600' :
                  category.color === 'yellow' ? 'text-yellow-600' :
                  category.color === 'blue' ? 'text-blue-600' :
                  'text-gray-600'
                }`}>
                  {category.count}
                </div>
                <div className="text-xs font-medium text-gray-600">
                  {category.name.replace(' (', '\n(')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Providers
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, NPI, or city..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-medicare-primary focus:border-medicare-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                Specialty
              </label>
              <select
                id="specialty"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-medicare-primary focus:border-medicare-primary"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sort"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field)
                  setSortOrder(order as 'asc' | 'desc')
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-medicare-primary focus:border-medicare-primary"
              >
                <option value="riskScore-desc">Risk Score (High to Low)</option>
                <option value="riskScore-asc">Risk Score (Low to High)</option>
                <option value="totalPayments-desc">Total Payments (High to Low)</option>
                <option value="totalPayments-asc">Total Payments (Low to High)</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing {sortedProviders.length} of {providers.length} providers
            </div>
            <div className="flex items-center">
              <FunnelIcon className="h-4 w-4 mr-1" />
              Active filters: {[
                searchTerm && 'Search',
                selectedRiskLevel !== 'All Risk Levels' && 'Risk Level',
                selectedSpecialty !== 'All Specialties' && 'Specialty'
              ].filter(Boolean).join(', ') || 'None'}
            </div>
          </div>
        </div>

        {/* Provider Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Primary Concern
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Payments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Flags
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProviders.map((provider) => (
                  <tr key={provider.npi} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          <Link 
                            href={`/providers/${provider.npi}`}
                            className="text-medicare-primary hover:text-medicare-dark hover:underline"
                          >
                            {provider.name}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500">
                          {provider.specialty} • {provider.city}, {provider.state}
                        </div>
                        <div className="text-xs text-gray-400">NPI: {provider.npi}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(provider.riskScore)}`}>
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {provider.riskScore} - {getRiskLabel(provider.riskScore)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{provider.primaryConcern}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(provider.totalPayments)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {provider.riskFlags.slice(0, 2).map((flag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {flag}
                          </span>
                        ))}
                        {provider.riskFlags.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                            +{provider.riskFlags.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-6">
            Risk Scoring Methodology
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistical Analysis</h3>
              <p className="text-gray-700 mb-4">
                Our risk scoring algorithm analyzes multiple factors to identify providers whose billing 
                patterns deviate significantly from their peers:
              </p>
              
              <ul className="text-gray-700 space-y-2">
                <li>• <strong>Markup Analysis:</strong> Charges vs. payments compared to specialty peers</li>
                <li>• <strong>Volume Outliers:</strong> Service volume significantly above/below normal ranges</li>
                <li>• <strong>Geographic Patterns:</strong> Unusual patient geographic concentration</li>
                <li>• <strong>Procedure Mix:</strong> Atypical procedure combinations or frequencies</li>
                <li>• <strong>Peer Comparison:</strong> Performance vs. similar providers in same region</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Score Ranges</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-red-400 pl-4">
                  <div className="font-semibold text-red-900">90-100: Extreme Risk</div>
                  <div className="text-sm text-red-700">Multiple severe outlier patterns requiring immediate attention</div>
                </div>
                <div className="border-l-4 border-orange-400 pl-4">
                  <div className="font-semibold text-orange-900">80-89: High Risk</div>
                  <div className="text-sm text-orange-700">Significant deviations from normal billing patterns</div>
                </div>
                <div className="border-l-4 border-yellow-400 pl-4">
                  <div className="font-semibold text-yellow-900">70-79: Medium Risk</div>
                  <div className="text-sm text-yellow-700">Notable outlier behavior worth monitoring</div>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <div className="font-semibold text-blue-900">60-69: Lower Risk</div>
                  <div className="text-sm text-blue-700">Minor deviations within acceptable ranges</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Source Citation */}
        <SourceCitation 
          lastUpdated="February 2024"
          sources={[
            'Centers for Medicare & Medicaid Services (CMS)',
            'Medicare Provider Utilization and Payment Data (2014-2023)',
            'Statistical analysis based on peer comparison algorithms',
            'Geographic and specialty benchmarking data'
          ]}
        />
      </div>
    </div>
  )
}