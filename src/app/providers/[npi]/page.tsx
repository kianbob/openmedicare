import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { ExclamationTriangleIcon, MapPinIcon, UserIcon, CalendarDaysIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import AIOverview from '@/components/AIOverview'
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

interface ExternalLink {
  label: string
  url: string
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
  fraud_profile?: boolean
  enforcement_status?: string
  enforcement_details?: string
  enforcement_source?: string
  fraud_context?: string
  notes?: string
  external_links?: ExternalLink[]
  services_per_day?: number
  covid_share_pct?: number
  wound_share_pct?: number
}

interface WatchlistEntry {
  npi: number
  name: string
  risk_score: number
  flags: { type: string; description: string; severity: string }[]
  total_payments: number
  avg_markup: number
  specialty: string
  state: string
  city: string
  credentials: string
}

interface TopProvider {
  npi: string
  name: string
  credentials: string
  specialty: string
  state: string
  city: string
  entity_type: string
  total_payments: number
  total_services: number
  total_beneficiaries: number
  years_active: number
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

function loadWatchlist(): WatchlistEntry[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'watchlist.json')
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
  } catch {}
  return []
}

function loadTopProviders(): TopProvider[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'top-providers.json')
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      return data.providers || data
    }
  } catch {}
  return []
}

interface MlFlaggedProvider {
  npi: string
  name: string
  specialty: string
  state: string
  fraud_probability: number
  total_payments: number
  risk_rank: number
  top_risk_factors: string[]
}

function loadMlV2Results(): { still_out_there: MlFlaggedProvider[] } | null {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'ml-v2-results.json')
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
  } catch {}
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

function getRiskScoreColor(score: number): { bg: string; text: string; border: string } {
  if (score >= 90) return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
  if (score >= 80) return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' }
  if (score >= 70) return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' }
  return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' }
}

function getSpecialtyIcon(specialty: string): string {
  const s = specialty.toLowerCase()
  if (s.includes('cardio') || s.includes('heart')) return '❤️'
  if (s.includes('dermat')) return '🧴'
  if (s.includes('ophthal') || s.includes('optom') || s.includes('eye')) return '👁️'
  if (s.includes('ortho') || s.includes('bone') || s.includes('physical')) return '🦴'
  if (s.includes('neuro') || s.includes('brain')) return '🧠'
  if (s.includes('pediatr') || s.includes('child')) return '👶'
  if (s.includes('psych') || s.includes('mental')) return '🧠'
  if (s.includes('surg')) return '🔪'
  if (s.includes('radiol') || s.includes('imaging')) return '📡'
  if (s.includes('oncol') || s.includes('cancer')) return '🎗️'
  if (s.includes('emergency')) return '🚑'
  if (s.includes('anesthes')) return '💉'
  if (s.includes('internal') || s.includes('family') || s.includes('general')) return '🩺'
  if (s.includes('pulmon') || s.includes('lung')) return '🫁'
  if (s.includes('gastro')) return '🏥'
  if (s.includes('urol')) return '🏥'
  if (s.includes('endocrin') || s.includes('diabet')) return '💊'
  if (s.includes('dent')) return '🦷'
  if (s.includes('nurse') || s.includes('nursing')) return '👩‍⚕️'
  if (s.includes('lab') || s.includes('pathol')) return '🔬'
  if (s.includes('chiroprac')) return '🤲'
  if (s.includes('podiat') || s.includes('foot')) return '🦶'
  return '⚕️'
}

function getSpecialtyColor(specialty: string): { bg: string; border: string; text: string; accent: string } {
  const s = specialty.toLowerCase()
  if (s.includes('cardio')) return { bg: 'from-red-600 to-red-800', border: 'border-red-400', text: 'text-red-100', accent: 'bg-red-500' }
  if (s.includes('neuro') || s.includes('psych')) return { bg: 'from-purple-600 to-purple-800', border: 'border-purple-400', text: 'text-purple-100', accent: 'bg-purple-500' }
  if (s.includes('ortho') || s.includes('physical')) return { bg: 'from-blue-600 to-blue-800', border: 'border-blue-400', text: 'text-blue-100', accent: 'bg-blue-500' }
  if (s.includes('surg')) return { bg: 'from-slate-600 to-slate-800', border: 'border-slate-400', text: 'text-slate-100', accent: 'bg-slate-500' }
  if (s.includes('oncol')) return { bg: 'from-amber-600 to-amber-800', border: 'border-amber-400', text: 'text-amber-100', accent: 'bg-amber-500' }
  if (s.includes('dermat')) return { bg: 'from-pink-600 to-pink-800', border: 'border-pink-400', text: 'text-pink-100', accent: 'bg-pink-500' }
  if (s.includes('ophthal')) return { bg: 'from-cyan-600 to-cyan-800', border: 'border-cyan-400', text: 'text-cyan-100', accent: 'bg-cyan-500' }
  return { bg: 'from-teal-600 to-teal-800', border: 'border-teal-400', text: 'text-teal-100', accent: 'bg-teal-500' }
}

function getCredentialBadge(credentials: string): { label: string; color: string } | null {
  if (!credentials) return null
  const c = credentials.toUpperCase().replace(/[.,]/g, '').trim()
  if (c.includes('MD') || c === 'M.D.') return { label: 'MD', color: 'bg-blue-600' }
  if (c.includes('DO') || c === 'D.O.') return { label: 'DO', color: 'bg-indigo-600' }
  if (c.includes('NP') || c.includes('APRN') || c.includes('CNP')) return { label: 'NP', color: 'bg-green-600' }
  if (c.includes('PA')) return { label: 'PA', color: 'bg-teal-600' }
  if (c.includes('DPM')) return { label: 'DPM', color: 'bg-orange-600' }
  if (c.includes('OD')) return { label: 'OD', color: 'bg-cyan-600' }
  if (c.includes('DDS') || c.includes('DMD')) return { label: 'DDS', color: 'bg-pink-600' }
  if (c.includes('PHD')) return { label: 'PhD', color: 'bg-purple-600' }
  if (c.includes('DC')) return { label: 'DC', color: 'bg-amber-600' }
  if (c.includes('RN') || c.includes('CNS')) return { label: 'RN', color: 'bg-emerald-600' }
  if (c.includes('PT') || c.includes('DPT')) return { label: 'PT', color: 'bg-sky-600' }
  if (c.includes('OT')) return { label: 'OT', color: 'bg-violet-600' }
  return { label: credentials.split(/[,\s]/)[0], color: 'bg-gray-600' }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { npi } = await params
  const raw = loadProviderFile(npi)
  const providerName = raw?.name || `Provider ${npi}`
  
  const title = `${providerName} — Medicare Billing Profile`
  const description = raw
    ? `${providerName} (${raw.specialty}) in ${raw.city}, ${raw.state} — ${formatCurrency(raw.overall.total_payments)} in Medicare payments. View billing patterns, procedures, and peer comparisons.`
    : `Medicare payment details for provider ${npi}.`
  
  return {
    title,
    description,
    alternates: { canonical: `/providers/${npi}` },
    openGraph: {
      title,
      description,
      url: `/providers/${npi}`,
      siteName: 'OpenMedicare',
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
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

  // ML v2 fraud model check
  const mlData = loadMlV2Results()
  const mlMatch = mlData?.still_out_there?.find(p => String(p.npi) === npi) || null

  // Watchlist check
  const watchlist = loadWatchlist()
  const watchlistEntry = watchlist.find(w => String(w.npi) === npi)

  // Services per day calculation (individual providers only)
  const isIndividual = raw.entity_type !== 'Organization' && raw.entity_type !== 'O'
  let servicesPerDay = 0
  if (isIndividual && overall.years_active > 0) {
    servicesPerDay = Math.round(overall.total_services / overall.years_active / 250)
  }

  // Similar providers
  const topProviders = loadTopProviders()
  const watchlistNpis = new Set(watchlist.map(w => String(w.npi)))
  const similarProviders = topProviders
    .filter(p => p.specialty === raw.specialty && p.state === raw.state && String(p.npi) !== npi)
    .slice(0, 5)

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
  const specColor = getSpecialtyColor(raw.specialty)
  const specIcon = getSpecialtyIcon(raw.specialty)
  const credBadge = getCredentialBadge(raw.credentials)

  // Compute specialty rank among peers
  let specialtyRank = 0
  let specialtyTotal = 0
  try {
    const allSameSpecialty = topProviders.filter(p => p.specialty === raw.specialty)
    specialtyTotal = allSameSpecialty.length
    const sorted = [...allSameSpecialty].sort((a, b) => b.total_payments - a.total_payments)
    const idx = sorted.findIndex(p => String(p.npi) === npi)
    specialtyRank = idx >= 0 ? idx + 1 : 0
  } catch {}

  // Detect dramatic yearly payment changes
  let biggestYoyIncrease: { year: number; pctChange: number } | null = null
  try {
    for (let i = 1; i < yearly.length; i++) {
      if (yearly[i - 1].total_payments > 0) {
        const pct = ((yearly[i].total_payments - yearly[i - 1].total_payments) / yearly[i - 1].total_payments) * 100
        if (!biggestYoyIncrease || pct > biggestYoyIncrease.pctChange) {
          biggestYoyIncrease = { year: yearly[i].year, pctChange: pct }
        }
      }
    }
    if (biggestYoyIncrease && biggestYoyIncrease.pctChange < 50) biggestYoyIncrease = null
  } catch {}

  // Key findings
  const keyFindings: string[] = []
  try {
    keyFindings.push(`Billed ${formatCurrency(overall.total_payments)} over ${overall.years_active} year${overall.years_active === 1 ? '' : 's'}`)
    if (overall.avg_markup_ratio > 1.5) {
      keyFindings.push(`${overall.avg_markup_ratio}x markup ratio${overall.avg_markup_ratio > 2 ? ' (above median)' : ''}`)
    }
    if (mlMatch) {
      keyFindings.push(`AI fraud probability: ${(mlMatch.fraud_probability * 100).toFixed(1)}%`)
    }
    if (watchlistEntry) {
      keyFindings.push(`Risk score: ${watchlistEntry.risk_score} — flagged for review`)
    }
    if (percentile >= 90) {
      keyFindings.push(`${percentile}th percentile in ${raw.specialty} by payments`)
    }
    if (isIndividual && servicesPerDay > 50) {
      keyFindings.push(`${formatNumber(servicesPerDay)} services/day — ${servicesPerDay > 200 ? 'physically implausible' : 'unusually high'}`)
    }
    if (biggestYoyIncrease) {
      keyFindings.push(`Payments surged ${biggestYoyIncrease.(pctChange ?? 0).toFixed(0)}% in ${biggestYoyIncrease.year}`)
    }
    const highMarkupProcs = topProcs.filter(p => p.avg_markup > 3)
    if (highMarkupProcs.length > 0) {
      keyFindings.push(`${highMarkupProcs.length} procedure${highMarkupProcs.length > 1 ? 's' : ''} with >3x markup`)
    }
  } catch {}

  // Max procedure payment for bar chart scaling
  const maxProcPayment = topProcs.length > 0 ? Math.max(...topProcs.map(p => p.payments)) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className={`bg-gradient-to-r ${specColor.bg} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/3" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <Breadcrumbs 
            items={[
              { name: 'Providers', href: '/providers' },
              { name: raw.name }
            ]}
            className="mb-6 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white/50 [&_li]:text-white/90"
          />
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{specIcon}</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {credBadge && (
                    <span className={`${credBadge.color} text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg`}>
                      {credBadge.label}
                    </span>
                  )}
                  {raw.entity_type && (
                    <span className="bg-white/20 text-white/90 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {raw.entity_type}
                    </span>
                  )}
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white font-playfair mb-3 drop-shadow-sm">
                {raw.credentials ? `${raw.name}, ${raw.credentials}` : raw.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80 mb-6 text-sm">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1.5" />
                  <span>NPI: {npi}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1.5" />
                  <Link href={`/states/${raw.state}`} className="text-white hover:text-white/90 underline decoration-white/40">
                    {raw.city}, {raw.state}
                  </Link>
                </div>
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-4 w-4 mr-1.5" />
                  <span>{overall.years_active} {overall.years_active === 1 ? 'year' : 'years'} of data</span>
                </div>
                <Link href={`/specialties/${specialtySlug}`} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors">
                  {raw.specialty}
                </Link>
              </div>
              {/* Hero stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: formatCurrency(overall.total_payments), label: 'Total Payments', highlight: true },
                  { value: formatNumber(totalBeneficiaries), label: 'Beneficiaries' },
                  { value: formatNumber(overall.total_services), label: 'Services' },
                  { value: `${overall.avg_markup_ratio}x`, label: 'Markup Ratio' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className={`text-2xl lg:text-3xl font-bold ${stat.highlight ? 'text-white' : 'text-white/90'}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Peer comparison sidebar */}
            {medianPayment > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 min-w-[240px] border border-white/20">
                <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Peer Comparison</h3>
                <div className="text-4xl font-bold text-white mb-1">{percentile}<span className="text-lg text-white/70">th</span></div>
                <div className="text-sm text-white/70 mb-4">percentile in specialty</div>
                {/* Visual comparison bar */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-white/70 mb-1">
                      <span>This provider</span>
                      <span>{formatCurrency(overall.total_payments)}</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(100, (overall.total_payments / Math.max(overall.total_payments, medianPayment * 2)) * 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-white/70 mb-1">
                      <span>Specialty median</span>
                      <span>{formatCurrency(medianPayment)}</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white/50 rounded-full" style={{ width: `${Math.min(100, (medianPayment / Math.max(overall.total_payments, medianPayment * 2)) * 100)}%` }} />
                    </div>
                  </div>
                </div>
                {specialtyRank > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/20 text-sm text-white/80">
                    Rank <span className="font-bold text-white">#{specialtyRank}</span> of {specialtyTotal} in specialty
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Key Findings Summary */}
        {keyFindings.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border-l-4 border-medicare-primary p-6 -mt-6 relative z-10 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">📋</span> Key Findings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {keyFindings.slice(0, 6).map((finding, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex-shrink-0">{i + 1}</span>
                  <span className="text-gray-800">{finding}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fraud Flag Banner */}
        {watchlistEntry ? (
          <div className={`rounded-lg border-2 ${getRiskScoreColor(watchlistEntry.risk_score).border} ${getRiskScoreColor(watchlistEntry.risk_score).bg} p-6 mb-8`}>
            <div className="flex items-start gap-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h2 className="text-xl font-bold text-gray-900">⚠️ Flagged for Review</h2>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getRiskScoreColor(watchlistEntry.risk_score).bg} ${getRiskScoreColor(watchlistEntry.risk_score).text} border ${getRiskScoreColor(watchlistEntry.risk_score).border}`}>
                    Risk Score: {watchlistEntry.risk_score}
                  </span>
                </div>
                <ul className="space-y-1 mb-4">
                  {watchlistEntry.flags.map((flag, i) => (
                    <li key={i} className="text-sm text-gray-800 flex items-start gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${flag.severity === 'high' ? 'bg-red-500' : flag.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                      {flag.description}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-4 mb-3">
                  <Link href="/fraud/deep-dives" className="text-sm font-medium text-blue-700 hover:text-blue-900 underline">
                    View Deep Dives →
                  </Link>
                  <Link href="/fraud/report" className="text-sm font-medium text-blue-700 hover:text-blue-900 underline">
                    Report Fraud →
                  </Link>
                </div>
                <p className="text-xs text-gray-600 italic">
                  Statistical flag only — not an accusation of fraud
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* AI Risk Assessment Card (ML v2) */}
        {mlMatch && (
          <div className="rounded-xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-white p-6 mb-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                🤖
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold text-gray-900">AI Risk Assessment</h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    Rank #{mlMatch.risk_rank} of 500
                  </span>
                </div>

                {/* Fraud probability gauge */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-purple-900">{(mlMatch.fraud_probability * 100).toFixed(1)}%</span>
                    <span className="text-sm text-gray-600">fraud probability</span>
                  </div>
                  <div className="relative h-5 rounded-full overflow-hidden bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500">
                    <div className="absolute inset-0 bg-black/10" />
                    {/* Pointer */}
                    <div 
                      className="absolute top-0 h-full w-1 bg-white shadow-lg border border-gray-800 rounded"
                      style={{ left: `${Math.min(99, mlMatch.fraud_probability * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low risk</span>
                    <span>Medium</span>
                    <span>High risk</span>
                  </div>
                </div>

                {/* Risk factors */}
                {mlMatch.top_risk_factors && mlMatch.top_risk_factors.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Risk Factors</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {mlMatch.top_risk_factors.map((factor: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-800 bg-purple-50 rounded-lg px-3 py-2">
                          <span className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-purple-500" />
                          {factor}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* What this means */}
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">What this means</h3>
                  <p className="text-sm text-gray-600">
                    Our machine learning model analyzed billing patterns, service volumes, markup ratios, and peer comparisons 
                    to estimate a {(mlMatch.fraud_probability * 100).toFixed(1)}% probability that this provider&apos;s billing patterns 
                    are consistent with known fraud cases. This is ranked #{mlMatch.risk_rank} out of 500 highest-risk providers analyzed.
                    This is a statistical prediction, not a determination of fraud.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link href="/fraud/still-out-there" className="text-sm font-medium text-purple-700 hover:text-purple-900 underline">
                    View all ML-flagged providers →
                  </Link>
                  <Link href="/fraud/methodology" className="text-sm font-medium text-gray-600 hover:text-gray-800 underline">
                    Methodology →
                  </Link>
                </div>
                <p className="text-xs text-gray-500 italic mt-2">
                  ML model prediction — not an accusation of fraud
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enforcement Status Banner */}
        {raw.enforcement_status && raw.enforcement_status !== 'NO_CHARGES' && (
          <div className={`rounded-lg border-2 p-6 mb-8 ${
            raw.enforcement_status === 'CHARGED' ? 'bg-red-100 border-red-500' :
            raw.enforcement_status === 'SETTLED' ? 'bg-orange-100 border-orange-500' :
            raw.enforcement_status === 'DISPUTED' ? 'bg-yellow-100 border-yellow-500' :
            'bg-gray-100 border-gray-400'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{
                raw.enforcement_status === 'CHARGED' ? '🚨' :
                raw.enforcement_status === 'SETTLED' ? '⚖️' :
                raw.enforcement_status === 'DISPUTED' ? '❓' : '📋'
              }</span>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  {raw.enforcement_status === 'CHARGED' && 'Federal Charges Filed'}
                  {raw.enforcement_status === 'SETTLED' && 'Federal Settlement'}
                  {raw.enforcement_status === 'DISPUTED' && 'Billing Disputed'}
                </h2>
                <p className="text-sm text-gray-800 mb-2">{raw.enforcement_details}</p>
                {raw.enforcement_source && (
                  <a href={raw.enforcement_source} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-blue-700 hover:text-blue-900 underline">
                    View DOJ source →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {!watchlistEntry && !mlMatch && (
          <div className="flex items-center gap-2 mb-6 text-green-700">
            <ShieldCheckIcon className="h-5 w-5" />
            <span className="text-sm font-medium">✓ No flags detected</span>
          </div>
        )}

        {/* Services Per Day Warning */}
        {isIndividual && servicesPerDay > 50 && (
          <div className={`rounded-lg border p-4 mb-8 ${servicesPerDay > 200 ? 'bg-red-50 border-red-300' : 'bg-yellow-50 border-yellow-300'}`}>
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className={`h-6 w-6 flex-shrink-0 ${servicesPerDay > 200 ? 'text-red-600' : 'text-yellow-600'}`} />
              <div>
                <p className={`font-medium ${servicesPerDay > 200 ? 'text-red-800' : 'text-yellow-800'}`}>
                  {servicesPerDay > 200 ? '⚠️ ' : ''}This provider averages {formatNumber(servicesPerDay)} services per working day
                  {servicesPerDay > 200 ? ' — physically unusual for an individual practitioner' : ''}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Based on {formatNumber(overall.total_services)} total services over {overall.years_active} {overall.years_active === 1 ? 'year' : 'years'} (250 working days/year).{' '}
                  <Link href="/fraud/impossible-numbers" className="text-blue-600 hover:text-blue-800 underline">
                    Learn about impossible service volumes →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Fraud Analysis Profile */}
        {raw.fraud_profile && (
          <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-indigo-900 font-playfair mb-4">🔍 Fraud Analysis Profile</h2>
            
            {raw.fraud_context && (
              <div className="bg-white border border-indigo-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-indigo-800 mb-2">Key Findings</h3>
                <p className="text-gray-800">{raw.fraud_context}</p>
              </div>
            )}

            {raw.services_per_day && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-indigo-800">📊 Services per working day:</span>
                <span className="text-lg font-bold text-red-700">{formatNumber(raw.services_per_day)}</span>
              </div>
            )}

            {raw.notes && (
              <div className="bg-white border border-indigo-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-indigo-800 mb-2">Background</h3>
                <p className="text-gray-700 text-sm">{raw.notes}</p>
              </div>
            )}

            {raw.external_links && raw.external_links.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-indigo-800 mb-2">External Links</h3>
                <div className="flex flex-wrap gap-3">
                  {raw.external_links.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-sm text-blue-700 hover:bg-indigo-100 transition-colors">
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}

            <Link href="/investigations/three-providers" className="inline-flex items-center text-sm font-medium text-indigo-700 hover:text-indigo-900 underline">
              Read the full investigation: Three Providers, $47M →
            </Link>
          </div>
        )}

        {/* AI Overview */}
        <AIOverview
          type="provider"
          data={{ provider: raw, watchlistEntry, percentile, medianPayment, specData }}
          className="mb-8"
        />

        {/* Payment & Services Trend Charts — only show if multiple years */}
        {yearly.length > 1 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
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
            {/* Avg Payment Per Service trend */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
              <TrendChart
                data={yearly.map(y => ({ year: y.year, avg_per_service: y.total_services > 0 ? Math.round(y.total_payments / y.total_services * 100) / 100 : 0 }))}
                xDataKey="year"
                yDataKey="avg_per_service"
                title="Avg Payment per Service"
                height={300}
              />
              {yearly[0]?.avg_submitted != null && (
                <TrendChart
                  data={yearly.map(y => ({ year: y.year, markup: y.avg_paid > 0 ? Math.round((y.avg_submitted / y.avg_paid) * 100) / 100 : 0 }))}
                  xDataKey="year"
                  yDataKey="markup"
                  title="Markup Ratio Over Time"
                  height={300}
                />
              )}
            </div>
            {/* Call out dramatic changes */}
            {biggestYoyIncrease && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                <span className="text-xl">📈</span>
                <div>
                  <p className="font-medium text-amber-900">
                    Notable: Payments increased {biggestYoyIncrease.(pctChange ?? 0).toFixed(0)}% in {biggestYoyIncrease.year}
                  </p>
                  <p className="text-sm text-amber-700">
                    Year-over-year payment surges can indicate changes in practice volume, new services, or billing pattern shifts.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

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
                        <td className="px-4 py-2 text-right text-orange-600">{(ratio ?? 0).toFixed(2)}x</td>
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

        {/* Top Procedures — Visual Bar Chart + Table */}
        {topProcs.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-6">
              Top Procedures ({topProcs.length})
            </h2>
            {/* Visual bar chart */}
            <div className="space-y-3 mb-8">
              {topProcs.map((proc) => {
                const pct = maxProcPayment > 0 ? (proc.payments / maxProcPayment) * 100 : 0
                const isHighMarkup = proc.avg_markup > 3
                return (
                  <div key={proc.code} className={`rounded-lg p-3 ${isHighMarkup ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/procedures/${proc.code}`} className="text-blue-600 hover:text-blue-800 font-mono font-medium text-sm">
                          {proc.code}
                        </Link>
                        <span className="text-sm text-gray-700 truncate max-w-xs">{proc.description}</span>
                        {isHighMarkup && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300">
                            ⚠ {(proc.avg_markup ?? 0).toFixed(1)}x markup
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap ml-2">{formatCurrency(proc.payments)}</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isHighMarkup ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                      <span>{formatNumber(proc.services)} services</span>
                      <span>{proc.services > 0 ? formatCurrency(proc.payments / proc.services) : '—'}/svc</span>
                      <span className={proc.avg_markup > 3 ? 'text-red-600 font-semibold' : ''}>{(proc.avg_markup ?? 0).toFixed(2)}x markup</span>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Collapsible full table */}
            <details className="group">
              <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium">
                Show detailed table ▾
              </summary>
              <div className="overflow-x-auto mt-4">
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
                      <tr key={proc.code} className={`hover:bg-blue-50 ${proc.avg_markup > 3 ? 'bg-red-50' : ''}`}>
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
                            {(proc.avg_markup ?? 0).toFixed(2)}x
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
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

        {/* Similar Providers with visual comparison */}
        {similarProviders.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-2">
              Similar Providers
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Other {raw.specialty} providers in {raw.state} for peer comparison.
            </p>
            {/* Visual comparison */}
            <div className="space-y-3 mb-6">
              {/* Current provider bar */}
              <div className="flex items-center gap-3">
                <div className="w-48 text-sm font-semibold text-gray-900 truncate">{raw.name} (you)</div>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, (overall.total_payments / Math.max(overall.total_payments, ...similarProviders.map(p => p.total_payments))) * 100)}%` }} />
                </div>
                <div className="w-24 text-right text-sm font-medium">{formatCurrency(overall.total_payments)}</div>
              </div>
              {similarProviders.map((p) => {
                const maxP = Math.max(overall.total_payments, ...similarProviders.map(sp => sp.total_payments))
                const isFlagged = watchlistNpis.has(String(p.npi))
                return (
                  <div key={p.npi} className="flex items-center gap-3">
                    <div className="w-48 text-sm text-gray-700 truncate">
                      <Link href={`/providers/${p.npi}`} className="text-blue-600 hover:text-blue-800">
                        {p.credentials ? `${p.name}, ${p.credentials}` : p.name}
                      </Link>
                      {isFlagged && <span className="ml-1 text-xs text-red-600">⚠️</span>}
                    </div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-400 rounded-full" style={{ width: `${(p.total_payments / maxP) * 100}%` }} />
                    </div>
                    <div className="w-24 text-right text-sm text-gray-600">{formatCurrency(p.total_payments)}</div>
                  </div>
                )
              })}
            </div>

            <details className="group">
              <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium">
                Show detailed table ▾
              </summary>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Payments</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {similarProviders.map((p) => {
                      const isFlagged = watchlistNpis.has(String(p.npi))
                      return (
                        <tr key={p.npi} className="hover:bg-blue-50">
                          <td className="px-4 py-3">
                            <Link href={`/providers/${p.npi}`} className="text-blue-600 hover:text-blue-800 font-medium">
                              {p.credentials ? `${p.name}, ${p.credentials}` : p.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{p.city}, {p.state}</td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(p.total_payments)}</td>
                          <td className="px-4 py-3 text-center">
                            {isFlagged ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                ⚠️ Flagged
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✓ Clear
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        )}

        {/* Related Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-4">Related</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/providers" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Browse</div>
              <div className="font-medium text-blue-600">← Back to Provider Directory</div>
            </Link>
            <Link href={`/states/${raw.state}`} className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">State</div>
              <div className="font-medium text-blue-600">All providers in {raw.state} →</div>
            </Link>
            <Link href={`/specialties/${specialtySlug}`} className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Specialty</div>
              <div className="font-medium text-blue-600">All {raw.specialty} providers →</div>
            </Link>
            <Link href="/compare" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Tool</div>
              <div className="font-medium text-blue-600">Compare this provider →</div>
            </Link>
            <Link href="/fraud/watchlist" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Analysis</div>
              <div className="font-medium text-blue-600">Fraud Watchlist →</div>
            </Link>
            <Link href="/search" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors">
              <div className="text-sm text-gray-500">Search</div>
              <div className="font-medium text-blue-600">Search all providers →</div>
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
