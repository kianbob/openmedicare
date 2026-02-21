'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ExclamationTriangleIcon, ShieldExclamationIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

interface Flag {
  type: string
  description: string
  severity: string
}

interface WatchlistProvider {
  npi: number
  name: string
  credentials: string
  specialty: string
  city: string
  state: string
  total_payments: number
  total_services: number
  total_beneficiaries: number
  avg_markup: number
  risk_score: number
  flags: Flag[]
}

export default function WatchlistPage() {
  const [providers, setProviders] = useState<WatchlistProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties')
  const [sortBy, setSortBy] = useState<keyof WatchlistProvider>('risk_score')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const loadWatchlistData = async () => {
      try {
        const response = await fetch('/data/watchlist.json')
        if (response.ok) {
          const data: WatchlistProvider[] = await response.json()
          setProviders(data)
        }
      } catch (error) {
        console.error('Error loading watchlist data:', error)
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

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'bg-red-100 text-red-700'
    if (severity === 'medium') return 'bg-yellow-100 text-yellow-700'
    return 'bg-blue-100 text-blue-700'
  }

  const riskRanges = [
    { key: 'all', label: 'All Risk Levels', min: 0, max: 100, color: 'gray' },
    { key: 'extreme', label: 'Extreme Risk (90+)', min: 90, max: 100, color: 'red' },
    { key: 'high', label: 'High Risk (80-89)', min: 80, max: 89, color: 'orange' },
    { key: 'medium', label: 'Medium Risk (70-79)', min: 70, max: 79, color: 'yellow' },
    { key: 'lower', label: 'Lower Risk (<70)', min: 0, max: 69, color: 'blue' },
  ]

  const riskCounts = riskRanges.map(r => ({
    ...r,
    count: r.key === 'all'
      ? providers.length
      : providers.filter(p => p.risk_score >= r.min && p.risk_score <= r.max).length,
  }))

  const filteredProviders = providers.filter(provider => {
    const term = searchTerm.toLowerCase()
    const matchesSearch = !searchTerm ||
      provider.name.toLowerCase().includes(term) ||
      String(provider.npi).includes(term) ||
      provider.city.toLowerCase().includes(term) ||
      provider.specialty.toLowerCase().includes(term) ||
      provider.state.toLowerCase().includes(term)

    const range = riskRanges.find(r => r.key === selectedRiskLevel)!
    const matchesRisk = selectedRiskLevel === 'all' ||
      (provider.risk_score >= range.min && provider.risk_score <= range.max)

    const matchesSpecialty = selectedSpecialty === 'All Specialties' || provider.specialty === selectedSpecialty

    return matchesSearch && matchesRisk && matchesSpecialty
  })

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    const aNum = Number(aVal)
    const bNum = Number(bVal)
    return sortOrder === 'asc' ? aNum - bNum : bNum - aNum
  })

  const specialties = ['All Specialties', ...Array.from(new Set(providers.map(p => p.specialty))).sort()]

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
            <h1 className="text-4xl font-bold text-gray-900 font-serif">
              Medicare Fraud Watchlist
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            {formatNumber(providers.length)} providers flagged by our statistical analysis for potential billing irregularities,
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
          {riskCounts.map((category) => (
            <div
              key={category.key}
              className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-all ${
                selectedRiskLevel === category.key ? 'ring-2 ring-medicare-primary' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedRiskLevel(category.key)}
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
                  {category.label}
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
                  placeholder="Search by name, NPI, city, state, or specialty..."
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
                  setSortBy(field as keyof WatchlistProvider)
                  setSortOrder(order as 'asc' | 'desc')
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-medicare-primary focus:border-medicare-primary"
              >
                <option value="risk_score-desc">Risk Score (High to Low)</option>
                <option value="risk_score-asc">Risk Score (Low to High)</option>
                <option value="total_payments-desc">Total Payments (High to Low)</option>
                <option value="total_payments-asc">Total Payments (Low to High)</option>
                <option value="avg_markup-desc">Markup (High to Low)</option>
                <option value="avg_markup-asc">Markup (Low to High)</option>
                <option value="total_services-desc">Services (High to Low)</option>
                <option value="name-asc">Name (A-Z)</option>
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
                selectedRiskLevel !== 'all' && 'Risk Level',
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
                    Total Payments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Markup
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services / Beneficiaries
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
                            {provider.credentials && `, ${provider.credentials}`}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500">
                          {provider.specialty}
                        </div>
                        <div className="text-xs text-gray-400">
                          {provider.city}, {provider.state} &middot; NPI: {provider.npi}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(provider.risk_score)}`}>
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {provider.risk_score} - {getRiskLabel(provider.risk_score)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(provider.total_payments)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        provider.avg_markup >= 6 ? 'bg-red-100 text-red-800' :
                        provider.avg_markup >= 4 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {provider.avg_markup.toFixed(1)}x
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{formatNumber(provider.total_services)} services</div>
                      <div className="text-xs text-gray-400">{formatNumber(provider.total_beneficiaries)} beneficiaries</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {provider.flags.slice(0, 2).map((flag, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(flag.severity)}`}
                            title={flag.description}
                          >
                            {flag.description.length > 30 ? flag.description.slice(0, 30) + '...' : flag.description}
                          </span>
                        ))}
                        {provider.flags.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                            +{provider.flags.length - 2} more
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
          <h2 className="text-2xl font-bold text-gray-900 font-serif mb-6">
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
                <li>&bull; <strong>Markup Analysis:</strong> Charges vs. payments compared to specialty peers</li>
                <li>&bull; <strong>Volume Outliers:</strong> Service volume significantly above/below normal ranges</li>
                <li>&bull; <strong>Geographic Patterns:</strong> Unusual patient geographic concentration</li>
                <li>&bull; <strong>Procedure Mix:</strong> Atypical procedure combinations or frequencies</li>
                <li>&bull; <strong>Peer Comparison:</strong> Performance vs. similar providers in same region</li>
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
