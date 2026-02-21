'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, UserIcon, MapPinIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency, formatNumber } from '@/lib/format'

interface SearchResult {
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
  riskScore?: number
}

// Mock search results
const mockResults: SearchResult[] = [
  {
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
    beneficiaries: 3200
  },
  {
    npi: '1234567891',
    name: 'Dr. Michael Chen',
    credentials: 'MD',
    specialty: 'Cardiology',
    address: {
      street: '456 Heart Center Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90211'
    },
    totalPayments: 3200000,
    totalServices: 8900,
    beneficiaries: 2800,
    riskScore: 85
  }
]

export default function ProviderLookupPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'name' | 'npi' | 'location'>('name')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    setHasSearched(true)

    // Simulate API call
    setTimeout(() => {
      // In production, this would call a real API
      if (searchTerm.toLowerCase().includes('johnson') || searchTerm.toLowerCase().includes('cardio')) {
        setResults(mockResults)
      } else {
        setResults([])
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { name: 'Tools', href: '/lookup' },
            { name: 'Provider Lookup' }
          ]}
          className="mb-8"
        />

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 font-playfair mb-4">
            Provider Lookup
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Search for Medicare providers by name, NPI number, or location. 
            Access detailed payment information, specialties, and risk analysis.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Search Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Search by:
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="name"
                    checked={searchType === 'name'}
                    onChange={(e) => setSearchType(e.target.value as 'name')}
                    className="mr-2 text-medicare-primary focus:ring-medicare-primary"
                  />
                  <UserIcon className="h-4 w-4 mr-1" />
                  Provider Name
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="npi"
                    checked={searchType === 'npi'}
                    onChange={(e) => setSearchType(e.target.value as 'npi')}
                    className="mr-2 text-medicare-primary focus:ring-medicare-primary"
                  />
                  <BuildingOffice2Icon className="h-4 w-4 mr-1" />
                  NPI Number
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="location"
                    checked={searchType === 'location'}
                    onChange={(e) => setSearchType(e.target.value as 'location')}
                    className="mr-2 text-medicare-primary focus:ring-medicare-primary"
                  />
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  City or ZIP Code
                </label>
              </div>
            </div>

            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                {searchType === 'name' && 'Provider Name'}
                {searchType === 'npi' && 'NPI Number'}
                {searchType === 'location' && 'City or ZIP Code'}
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
                  placeholder={
                    searchType === 'name' ? 'Enter provider name (e.g., Dr. Smith, Johnson)' :
                    searchType === 'npi' ? 'Enter 10-digit NPI number' :
                    'Enter city name or ZIP code'
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-medicare-primary focus:border-medicare-primary text-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!searchTerm.trim() || loading}
              className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-medicare-primary hover:bg-medicare-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medicare-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  Search Providers
                </>
              )}
            </button>
          </form>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results
                {results.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({results.length} {results.length === 1 ? 'provider' : 'providers'} found)
                  </span>
                )}
              </h2>
            </div>

            {results.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or using a different search type.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 text-left max-w-md mx-auto">
                  <h4 className="font-medium text-blue-900 mb-2">Search Tips:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use partial names (e.g., "Johnson" instead of full name)</li>
                    <li>• Try searching by specialty or location</li>
                    <li>• NPI numbers must be exactly 10 digits</li>
                    <li>• Use city name without state abbreviation</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {results.map((provider) => (
                  <div key={provider.npi} className="px-6 py-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              <Link 
                                href={`/providers/${provider.npi}`}
                                className="text-medicare-primary hover:text-medicare-dark hover:underline"
                              >
                                {provider.name}, {provider.credentials}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {provider.specialty} • NPI: {provider.npi}
                            </p>
                          </div>
                          {provider.riskScore && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              provider.riskScore >= 80 ? 'bg-red-100 text-red-800' :
                              provider.riskScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              Risk: {provider.riskScore}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Practice Location</h4>
                            <div className="flex items-start text-sm text-gray-600">
                              <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <p>{provider.address.street}</p>
                                <p>{provider.address.city}, {provider.address.state} {provider.address.zip}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Medicare Summary</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="font-semibold text-medicare-primary">
                                  {formatCurrency(provider.totalPayments)}
                                </div>
                                <div className="text-gray-500">Total Payments</div>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {formatNumber(provider.totalServices)}
                                </div>
                                <div className="text-gray-500">Services</div>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {formatNumber(provider.beneficiaries)}
                                </div>
                                <div className="text-gray-500">Patients</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Link 
                            href={`/providers/${provider.npi}`}
                            className="inline-flex items-center text-medicare-primary hover:text-medicare-dark font-medium text-sm"
                          >
                            View Full Provider Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-6">
            About Provider Lookup
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">What You'll Find</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Provider name, credentials, and specialty</li>
                <li>• Practice address and location information</li>
                <li>• Total Medicare payments received (2014-2023)</li>
                <li>• Number of services provided and patients treated</li>
                <li>• Risk analysis and peer comparisons</li>
                <li>• Top procedures and billing patterns</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Data Coverage</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Medicare Part B payments only</li>
                <li>• Providers with $10,000+ annual Medicare payments</li>
                <li>• Data from 2014-2023 (10 years)</li>
                <li>• Updated monthly with new CMS releases</li>
                <li>• Over 1.2 million providers in database</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Browse Options */}
        <div className="bg-gradient-to-r from-medicare-primary to-medicare-dark rounded-lg text-white p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Don't know what to search for?</h2>
          <p className="text-blue-100 mb-6">
            Explore our curated lists and analysis tools to discover interesting providers and patterns.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link 
              href="/providers"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
            >
              <h3 className="font-semibold mb-2">Browse All Providers</h3>
              <p className="text-sm text-blue-100">Search and filter the complete provider directory</p>
            </Link>
            
            <Link 
              href="/watchlist"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
            >
              <h3 className="font-semibold mb-2">Fraud Watchlist</h3>
              <p className="text-sm text-blue-100">Providers flagged for potential billing irregularities</p>
            </Link>
            
            <Link 
              href="/markup"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
            >
              <h3 className="font-semibold mb-2">Markup Analysis</h3>
              <p className="text-sm text-blue-100">Explore charge vs. payment patterns by specialty</p>
            </Link>
          </div>
        </div>

        {/* Source Citation */}
        <SourceCitation 
          lastUpdated="February 2024"
          compact={true}
        />
      </div>
    </div>
  )
}