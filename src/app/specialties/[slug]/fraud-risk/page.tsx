import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

interface WatchlistProvider {
  npi: number
  name: string
  specialty: string
  city: string
  state: string
  total_payments: number
  risk_score: number
  avg_markup: number
  flags: { type: string; description: string; severity: string }[]
}

interface SpecialtyData {
  specialty: string
  specialty_slug: string
  total_payments: number
  total_providers: number
  markup_ratio: number
  total_services: number
}

function loadWatchlist(): WatchlistProvider[] {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'watchlist.json'), 'utf-8'))
  } catch { return [] }
}

function loadSpecialties(): SpecialtyData[] {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'specialties.json'), 'utf-8'))
    return data.specialties || []
  } catch { return [] }
}

function slugifySpecialty(specialty: string): string {
  return specialty.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function generateStaticParams() {
  const specialties = loadSpecialties()
  return specialties
    .sort((a, b) => b.total_payments - a.total_payments)
    .slice(0, 30)
    .map(s => ({ slug: s.specialty_slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const specialties = loadSpecialties()
  const spec = specialties.find(s => s.specialty_slug === slug)
  const name = spec?.specialty || slug
  return {
    title: `Medicare Fraud Risk in ${name} | OpenMedicare`,
    description: `Fraud risk analysis for ${name} Medicare providers. Flagged providers, common billing anomalies, and markup analysis.`,
  }
}

export default async function SpecialtyFraudRiskPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const specialties = loadSpecialties()
  const spec = specialties.find(s => s.specialty_slug === slug)
  if (!spec) notFound()

  const watchlist = loadWatchlist()
  const specProviders = watchlist
    .filter(p => slugifySpecialty(p.specialty) === slug)
    .sort((a, b) => b.risk_score - a.risk_score)

  const avgRiskScore = specProviders.length > 0
    ? Math.round(specProviders.reduce((s, p) => s + p.risk_score, 0) / specProviders.length)
    : 0

  // Most common fraud flags
  const flagCounts = new Map<string, number>()
  specProviders.forEach(p => (p.flags || []).forEach(f => flagCounts.set(f.type, (flagCounts.get(f.type) || 0) + 1)))
  const commonFlags = Array.from(flagCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8)

  const flagLabels: Record<string, string> = {
    outlier_spending: '💰 Outlier Spending',
    high_markup: '📈 High Markup',
    beneficiary_stuffing: '👥 Beneficiary Stuffing',
    volume_anomaly: '📊 Volume Anomaly',
    geographic_anomaly: '🗺️ Geographic Anomaly',
  }

  // Markup comparison — top specialties
  const specByMarkup = [...specialties]
    .sort((a, b) => b.markup_ratio - a.markup_ratio)
    .slice(0, 15)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Specialties', href: '/specialties' },
          { name: spec.specialty, href: `/specialties/${slug}` },
          { name: 'Fraud Risk' },
        ]} />

        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
            Medicare Fraud Risk in {spec.specialty}
          </h1>
          <p className="text-lg text-gray-600">
            {specProviders.length} flagged {spec.specialty} providers identified through statistical anomaly detection.
          </p>
          <ShareButtons
            url={`/specialties/${slug}/fraud-risk`}
            title={`Medicare Fraud Risk in ${spec.specialty}`}
            className="mt-4"
          />
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Flagged Providers</p>
            <p className="text-3xl font-bold text-red-600">{specProviders.length}</p>
            <p className="text-xs text-gray-500 mt-1">of {formatNumber(spec.total_providers)} total</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Average Risk Score</p>
            <p className="text-3xl font-bold text-orange-600">{avgRiskScore}/100</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Specialty Markup</p>
            <p className="text-3xl font-bold text-gray-900">{(spec.markup_ratio ?? 0).toFixed(1)}x</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Total Payments</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(spec.total_payments)}</p>
          </div>
        </div>

        {/* Common Fraud Flags */}
        {commonFlags.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Most Common Fraud Flags</h2>
            <p className="text-gray-600 mb-4">Types of billing anomalies most frequently detected among flagged {spec.specialty} providers.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commonFlags.map(([flag, count]) => (
                <div key={flag} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium text-gray-900">{flagLabels[flag] || flag.replace(/_/g, ' ')}</span>
                  <span className="text-orange-600 font-bold">{count} provider{count > 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Flagged Providers */}
        {specProviders.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Flagged {spec.specialty} Providers</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Risk Score</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Payments</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Markup</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {specProviders.slice(0, 30).map((provider) => (
                    <tr key={provider.npi} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/providers/${provider.npi}`} className="text-medicare-primary hover:underline font-medium">
                          {provider.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{provider.city}, {provider.state}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          provider.risk_score >= 80 ? 'bg-red-100 text-red-800' :
                          provider.risk_score >= 60 ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {provider.risk_score}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium">{formatCurrency(provider.total_payments)}</td>
                      <td className="px-4 py-3 text-right text-sm">{(provider.avg_markup ?? 0).toFixed(1)}x</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {provider.flags.slice(0, 2).map(f => f.type.replace(/_/g, ' ')).join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Markup Comparison */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Markup by Specialty</h2>
          <p className="text-gray-600 mb-4">How {spec.specialty} markup compares to other specialties.</p>
          <div className="space-y-2">
            {specByMarkup.map(s => (
              <div key={s.specialty_slug} className="flex items-center">
                <div className="w-48 text-sm text-gray-700 truncate">
                  {s.specialty_slug === slug ? (
                    <span className="font-bold text-medicare-primary">{s.specialty}</span>
                  ) : (
                    <Link href={`/specialties/${s.specialty_slug}/fraud-risk`} className="hover:underline">
                      {s.specialty}
                    </Link>
                  )}
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-4 rounded-full ${s.specialty_slug === slug ? 'bg-medicare-primary' : 'bg-gray-400'}`}
                      style={{ width: `${Math.min((s.markup_ratio / specByMarkup[0].markup_ratio) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium w-16 text-right">{(s.markup_ratio ?? 0).toFixed(1)}x</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-amber-800">
            <strong>⚠️ Disclaimer:</strong> Being flagged does not imply fraud. These providers were identified through statistical analysis
            of billing patterns that deviate significantly from peers. Unusual billing may have legitimate explanations. This data is provided
            for transparency and public accountability purposes only.
          </p>
        </div>

        <SourceCitation
          sources={[
            'Centers for Medicare & Medicaid Services (CMS)',
            'Medicare Provider Utilization and Payment Data (2014-2023)',
            'OpenMedicare Statistical Anomaly Detection',
          ]}
        />
      </div>
    </main>
  )
}
