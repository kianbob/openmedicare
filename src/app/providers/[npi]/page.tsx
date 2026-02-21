import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { ExclamationTriangleIcon, MapPinIcon, UserIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { TrendChart, BarChart } from '@/components/Charts'
import { formatCurrency, formatNumber } from '@/lib/format'

interface YearlyPayment {
  year: number
  total_payments: number
  total_services: number
  total_beneficiaries: number
  avg_submitted: number
  avg_paid: number
}

interface TopProcedure {
  code: string
  description: string
  services: number
  payments: number
  avg_markup: number
}

interface RawProvider {
  name: string
  credentials: string
  specialty: string
  city: string
  state: string
  entity_type: string
  yearly_payments: YearlyPayment[]
  overall: {
    total_payments: number
    total_services: number
    total_beneficiaries: number
    avg_markup_ratio: number
    years_active: number
  }
  top_procedures: TopProcedure[]
}

interface PageProps {
  params: Promise<{ npi: string }>
}

function loadProviderFile(npi: string): RawProvider | null {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'providers', `${npi}.json`)
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
  } catch (error) {
    console.error('Error loading provider data:', error)
  }
  return null
}

function loadSpecialtiesData(): any[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'specialties.json')
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      return data.specialties || []
    }
  } catch {}
  return []
}

function slugifySpecialty(specialty: string): string {
  return specialty.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { npi } = await params
  const raw = loadProviderFile(npi)
  const providerName = raw?.name || `Provider ${npi}`
  
  return {
    title: `${providerName} (NPI: ${npi}) — OpenMedicare`,
    description: `Medicare payment details for ${providerName}. View ${raw ? formatCurrency(raw.overall.total_payments) : ''} in total payments, top procedures, markup analysis, and year-over-year trends.`,
    alternates: { canonical: `/providers/${npi}` },
  }
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const { npi } = await params
  const raw = loadProviderFile(npi)
  if (!raw) notFound()

  const overall = raw.overall
  const yearly = raw.yearly_payments || []
  const topProcs = raw.top_procedures || []
  const totalBeneficiaries = yearly.reduce((sum, y) => sum + (y.total_beneficiaries || 0), 0)

  // Peer comparison
  const specialties = loadSpecialtiesData()
  const specData = specialties.find((s: any) => s.specialty === raw.specialty)
  let percentile = 0
  let medianPayment = 0
  if (specData) {
    medianPayment = specData.avg_payment_per_provider || 0
    if (medianPayment > 0) {
      const ratio = overall.total_payments / medianPayment
      percentile = ratio >= 1
        ? Math.min(99, Math.round(50 + 50 * (1 - 1 / ratio)))
        : Math.max(1, Math.round(50 * ratio))
    }
  }

  const specialtySlug = slugifySpecialty(raw.specialty)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { name: 'Providers', href: '/providers' },
            { name: raw.name }
          ]}
          className="mb-8"
        />

        {/* Provider Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 font-playfair mb-2">
                {raw.credentials ? `${raw.name}, ${raw.credentials}` : raw.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  <span>NPI: {npi}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <Link href={`/states/${raw.state}`} className="text-blue-600 hover:text-blue-800">
                    {raw.city}, {raw.state}
                  </Link>
                </div>
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 mr-2" />
                  <span>{overall.years_active} years of data</span>
                </div>
                {raw.entity_type && (
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">{raw.entity_type}</span>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-medicare-primary">
                    {formatCurrency(overall.total_payments)}
                  </div>
                  <div className="text-sm text-gray-600">Total Medicare Payments</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatNumber(totalBeneficiaries)}
                  </div>
                  <div className="text-sm text-gray-600">Total Beneficiaries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatNumber(overall.total_services)}
                  </div>
                  <div className="text-sm text-gray-600">Total Services</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">
                    {overall.avg_markup_ratio}x
                  </div>
                  <div className="text-sm text-gray-600">Avg Markup Ratio</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 lg:mt-0 lg:ml-8">
              <div className="bg-gray-50 rounded-lg p-6 min-w-[200px]">
                <h3 className="font-semibold text-gray-900 mb-4">Specialty</h3>
                <Link href={`/specialties/${specialtySlug}`} className="text-lg font-medium text-medicare-primary hover:text-medicare-dark mb-4 block">
                  {raw.specialty}
                </Link>
                
                {medianPayment > 0 && (
                  <>
                    <h4 className="font-semibold text-gray-900 mb-2">Peer Comparison</h4>
                    <p className="text-sm text-gray-600">
                      {percentile}th percentile in {raw.specialty}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Specialty median: {formatCurrency(medianPayment)}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Services Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TrendChart
            data={yearly.map(y => ({ year: y.year, payments: y.total_payments }))}
            xDataKey="year"
            yDataKey="payments"
            title="Annual Medicare Payments"
            height={350}
          />
          <TrendChart
            data={yearly.map(y => ({ year: y.year, services: y.total_services }))}
            xDataKey="year"
            yDataKey="services"
            title="Annual Services Provided"
            height={350}
          />
        </div>

        {/* Submitted vs Paid — the markup gap over time */}
        {yearly.length > 0 && yearly[0].avg_submitted != null && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-2">Submitted Charges vs. Medicare Payments</h2>
            <p className="text-sm text-gray-500 mb-4">Average per-service amounts submitted by the provider compared to what Medicare actually paid — the gap represents the markup.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Submitted</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Paid</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Markup Ratio</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gap per Service</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Payments</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficiaries</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {yearly.map((y) => {
                    const ratio = y.avg_paid > 0 ? (y.avg_submitted / y.avg_paid) : 0
                    const gap = y.avg_submitted - y.avg_paid
                    return (
                      <tr key={y.year} className="hover:bg-blue-50">
                        <td className="px-4 py-2 font-medium text-gray-900">{y.year}</td>
                        <td className="px-4 py-2 text-right text-red-600 font-medium">{formatCurrency(y.avg_submitted)}</td>
                        <td className="px-4 py-2 text-right text-green-600 font-medium">{formatCurrency(y.avg_paid)}</td>
                        <td className="px-4 py-2 text-right text-orange-600">{ratio.toFixed(2)}x</td>
                        <td className="px-4 py-2 text-right text-gray-600">{formatCurrency(gap)}</td>
                        <td className="px-4 py-2 text-right font-medium">{formatCurrency(y.total_payments)}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{formatNumber(y.total_services)}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{formatNumber(y.total_beneficiaries)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Procedures */}
        {topProcs.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-6">
              Top Procedures ({topProcs.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Payments</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg/Service</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Markup</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topProcs.map((proc) => (
                    <tr key={proc.code} className="hover:bg-blue-50">
                      <td className="px-4 py-2">
                        <Link href={`/procedures/${proc.code}`} className="text-blue-600 hover:text-blue-800 font-mono font-medium">
                          {proc.code}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">{proc.description}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatNumber(proc.services)}</td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(proc.payments)}</td>
                      <td className="px-4 py-2 text-right text-gray-600">
                        {proc.services > 0 ? formatCurrency(proc.payments / proc.services) : '—'}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className={`${proc.avg_markup > 3 ? 'text-red-600' : proc.avg_markup > 2 ? 'text-orange-600' : 'text-gray-600'} font-medium`}>
                          {proc.avg_markup.toFixed(2)}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Markup Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-6">
            Markup Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Charge-to-Payment Ratio
              </h3>
              <div className="text-4xl font-bold text-medicare-primary mb-2">
                {overall.avg_markup_ratio}x
              </div>
              <p className="text-sm text-gray-600 mb-4">
                This provider submits charges {overall.avg_markup_ratio} times higher than what Medicare actually pays.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">What This Means</h4>
                <p className="text-sm text-gray-600">
                  A markup ratio of {overall.avg_markup_ratio}x means for every $100 Medicare pays, 
                  this provider initially charges ${(overall.avg_markup_ratio * 100).toFixed(0)}. 
                  This is {overall.avg_markup_ratio > 2 ? 'higher' : 'lower'} than the national average.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Location
              </h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p>
                      <Link href={`/states/${raw.state}`} className="text-blue-600 hover:text-blue-800">
                        {raw.city}, {raw.state}
                      </Link>
                    </p>
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

        {/* Related Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-4">Related</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href={`/states/${raw.state}`} className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">State</div>
              <div className="font-medium text-blue-600">All providers in {raw.state} →</div>
            </Link>
            <Link href={`/specialties/${specialtySlug}`} className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Specialty</div>
              <div className="font-medium text-blue-600">{raw.specialty} →</div>
            </Link>
            <Link href="/watchlist" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Analysis</div>
              <div className="font-medium text-blue-600">Fraud Watchlist →</div>
            </Link>
          </div>
        </div>

        {/* Share & Source */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Share This Provider</h3>
              <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                Share this provider&apos;s Medicare payment information
              </p>
            </div>
            <ShareButtons
              url={`/providers/${npi}`}
              title={`${raw.name} - Medicare Provider`}
              description={`Medicare payment details for ${raw.name}, ${raw.specialty} in ${raw.city}, ${raw.state}`}
            />
          </div>
        </div>

        <SourceCitation 
          lastUpdated="February 2026 (data through 2023, the latest CMS release)"
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
  try {
    const dir = path.join(process.cwd(), 'public', 'data', 'providers')
    if (!fs.existsSync(dir)) return []
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).slice(0, 200)
    return files.map(f => ({ npi: f.replace('.json', '') }))
  } catch {
    return []
  }
}

export const dynamicParams = true
