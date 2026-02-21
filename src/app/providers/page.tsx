'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, FunnelIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { formatCurrency, formatNumber, toTitleCase } from '@/lib/format'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'

interface Provider {
  npi: string
  name: string
  specialty: string
  city: string
  state: string
  totalPayments: number
  totalServices: number
  beneficiaries: number
  avgMarkup?: number
  riskScore?: number
  isFlagged?: boolean
}

interface WatchlistEntry {
  npi: number
  risk_score: number
  name: string
  specialty: string
  state: string
  city: string
  avg_markup: number
  total_payments: number
}

const specialties = [
  'All Specialties',
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Family Medicine',
  'Internal Medicine',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Orthopedic Surgery',
  'Radiology',
  'Surgery'
]

const states = [
  'All States',
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

type SortField = 'totalPayments' | 'riskScore' | 'avgMarkup' | 'name'

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties')
  const [selectedState, setSelectedState] = useState('All States')
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortField>('totalPayments')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  useEffect(() => {
    const loadData = async () => {
      try {
        const [provRes, watchRes] = await Promise.all([
          fetch('/data/top-providers.json'),
          fetch('/data/watchlist.json'),
        ])

        const watchlist: WatchlistEntry[] = watchRes.ok ? await watchRes.json() : []
        const watchMap = new Map(watchlist.map(w => [String(w.npi), w]))

        if (provRes.ok) {
          const data = await provRes.json()
          const mapped = (data.providers || data).map((p: any) => {
            const npiStr = String(p.npi)
            const wl = watchMap.get(npiStr)
            return {
              npi: npiStr,
              name: p.name,
              specialty: p.specialty,
              city: p.city,
              state: p.state,
              totalPayments: p.total_payments ?? p.totalPayments,
              totalServices: p.total_services ?? p.totalServices,
              beneficiaries: p.total_beneficiaries ?? p.beneficiaries,
              avgMarkup: wl?.avg_markup,
              riskScore: wl?.risk_score,
              isFlagged: !!wl,
            }
          })
          setProviders(mapped)
        }
      } catch (error) {
        console.error('Error loading providers:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      const matchesSearch = searchTerm === '' ||
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.npi.includes(searchTerm) ||
        provider.city.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialty = selectedSpecialty === 'All Specialties' || provider.specialty === selectedSpecialty
      const matchesState = selectedState === 'All States' || provider.state === selectedState
      const matchesFlagged = !showFlaggedOnly || provider.isFlagged
      return matchesSearch && matchesSpecialty && matchesState && matchesFlagged
    })
  }, [providers, searchTerm, selectedSpecialty, selectedState, showFlaggedOnly])

  const sortedProviders = useMemo(() => {
    return [...filteredProviders].sort((a, b) => {
      let aVal: number | string
      let bVal: number | string

      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          return sortOrder === 'asc' ? (aVal < bVal ? -1 : 1) : (aVal > bVal ? -1 : 1)
        case 'riskScore':
          aVal = a.riskScore ?? -1
          bVal = b.riskScore ?? -1
          break
        case 'avgMarkup':
          aVal = a.avgMarkup ?? -1
          bVal = b.avgMarkup ?? -1
          break
        default:
          aVal = a.totalPayments
          bVal = b.totalPayments
      }

      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })
  }, [filteredProviders, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(sortedProviders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProviders = sortedProviders.slice(startIndex, startIndex + itemsPerPage)

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1) }, [searchTerm, selectedSpecialty, selectedState, showFlaggedOnly, sortBy, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const SortArrow = ({ field }: { field: SortField }) =>
    sortBy === field ? <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span> : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medicare-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading provider data...</p>
        </div>
      </div>
    )
  }

  const flaggedCount = providers.filter(p => p.isFlagged).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { name: 'Explore', href: '/providers' },
            { name: 'Providers' }
          ]}
          className="mb-8"
        />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-playfair mb-4">
            Medicare Providers
          </h1>
          <p className="text-xl text-gray-600">
            Explore {formatNumber(providers.length)} healthcare providers and their Medicare payments from 2014-2023.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
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

            {/* Specialty Filter */}
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

            {/* State Filter */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                id="state"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-medicare-primary focus:border-medicare-primary"
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing {formatNumber(sortedProviders.length)} of {formatNumber(providers.length)} providers
              </p>
              <button
                onClick={() => setShowFlaggedOnly(!showFlaggedOnly)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  showFlaggedOnly
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-red-50 hover:text-red-700'
                }`}
              >
                <ExclamationTriangleIcon className="h-4 w-4" />
                Fraud Flagged ({flaggedCount})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              {([
                ['totalPayments', 'Payments'],
                ['riskScore', 'Risk Score'],
                ['avgMarkup', 'Markup'],
                ['name', 'Name'],
              ] as [SortField, string][]).map(([field, label]) => (
                <button
                  key={field}
                  onClick={() => handleSort(field)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    sortBy === field
                      ? 'bg-medicare-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                  <SortArrow field={field} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    Provider Name <SortArrow field="name" />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialty
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('totalPayments')}
                  >
                    Total Payments <SortArrow field="totalPayments" />
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('avgMarkup')}
                  >
                    Markup <SortArrow field="avgMarkup" />
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('riskScore')}
                  >
                    Risk Score <SortArrow field="riskScore" />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProviders.map((provider) => (
                  <tr key={provider.npi} className={`hover:bg-gray-50 ${provider.isFlagged ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          <Link 
                            href={`/providers/${provider.npi}`}
                            className="text-medicare-primary hover:text-medicare-dark hover:underline"
                          >
                            {provider.name}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500">NPI: {provider.npi}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {provider.specialty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {provider.city}, {provider.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(provider.totalPayments)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                      {provider.avgMarkup ? `${provider.avgMarkup.toFixed(1)}x` : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {provider.riskScore ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          provider.riskScore >= 90 ? 'bg-red-100 text-red-800' :
                          provider.riskScore >= 80 ? 'bg-orange-100 text-orange-800' :
                          provider.riskScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {provider.riskScore}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(startIndex + itemsPerPage, sortedProviders.length)}
                    </span>{' '}
                    of <span className="font-medium">{sortedProviders.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNumber
                              ? 'z-10 bg-medicare-primary border-medicare-primary text-white'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Source Citation */}
        <div className="mt-8">
          <SourceCitation 
            lastUpdated="February 2024"
            compact={true}
          />
        </div>
      </div>
    </div>
  )
}
