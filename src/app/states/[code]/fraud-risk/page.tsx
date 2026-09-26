import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia',PR:'Puerto Rico',VI:'Virgin Islands',GU:'Guam',AS:'American Samoa',MP:'Northern Mariana Islands'
}

const NEIGHBORS: Record<string, string[]> = {
  AL:['FL','GA','MS','TN'],AK:[],AZ:['CA','CO','NM','NV','UT'],AR:['LA','MO','MS','OK','TN','TX'],CA:['AZ','NV','OR'],CO:['AZ','KS','NE','NM','OK','UT','WY'],CT:['MA','NY','RI'],DE:['MD','NJ','PA'],FL:['AL','GA'],GA:['AL','FL','NC','SC','TN'],HI:[],ID:['MT','NV','OR','UT','WA','WY'],IL:['IA','IN','KY','MO','WI'],IN:['IL','KY','MI','OH'],IA:['IL','MN','MO','NE','SD','WI'],KS:['CO','MO','NE','OK'],KY:['IL','IN','MO','OH','TN','VA','WV'],LA:['AR','MS','TX'],ME:['NH'],MD:['DC','DE','PA','VA','WV'],MA:['CT','NH','NY','RI','VT'],MI:['IN','OH','WI'],MN:['IA','ND','SD','WI'],MS:['AL','AR','LA','TN'],MO:['AR','IA','IL','KS','KY','NE','OK','TN'],MT:['ID','ND','SD','WY'],NE:['CO','IA','KS','MO','SD','WY'],NV:['AZ','CA','ID','OR','UT'],NH:['MA','ME','VT'],NJ:['DE','NY','PA'],NM:['AZ','CO','OK','TX','UT'],NY:['CT','MA','NJ','PA','VT'],NC:['GA','SC','TN','VA'],ND:['MN','MT','SD'],OH:['IN','KY','MI','PA','WV'],OK:['AR','CO','KS','MO','NM','TX'],OR:['CA','ID','NV','WA'],PA:['DE','MD','NJ','NY','OH','WV'],RI:['CT','MA'],SC:['GA','NC'],SD:['IA','MN','MT','ND','NE','WY'],TN:['AL','AR','GA','KY','MO','MS','NC','VA'],TX:['AR','LA','NM','OK'],UT:['AZ','CO','ID','NM','NV','WY'],VT:['MA','NH','NY'],VA:['DC','KY','MD','NC','TN','WV'],WA:['ID','OR'],WV:['KY','MD','OH','PA','VA'],WI:['IA','IL','MI','MN'],WY:['CO','ID','MT','NE','SD','UT'],DC:['MD','VA'],PR:[],VI:[],GU:[],AS:[],MP:[]
}

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

interface StateData {
  state: string
  state_name: string
  total_payments: number
  total_providers: number
  markup_ratio: number
}

function loadWatchlist(): WatchlistProvider[] {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'watchlist.json'), 'utf-8'))
  } catch { return [] }
}

function loadStates(): StateData[] {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'states.json'), 'utf-8'))
    return data.states || []
  } catch { return [] }
}

export async function generateStaticParams() {
  const states = loadStates()
  return states.map(s => ({ code: s.state }))
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params
  const name = STATE_NAMES[code] || code
  return {
    title: `${name} Medicare Fraud Risk: Flagged Providers`,
    description: `${name} has AI-flagged Medicare providers with suspicious billing. See fraud hotspots, risk scores, and anomaly breakdowns.`,
  }
}

export default async function StateFraudRiskPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const stateName = STATE_NAMES[code]
  if (!stateName) notFound()

  const watchlist = loadWatchlist()
  const allStates = loadStates()
  const stateData = allStates.find(s => s.state === code)
  if (!stateData) notFound()

  const stateProviders = watchlist.filter(p => p.state === code).sort((a, b) => b.risk_score - a.risk_score)
  const nationalAvgMarkup = allStates.reduce((s, st) => s + st.markup_ratio, 0) / allStates.length

  // Fraud hotspots — cities with most flagged providers
  const cityMap = new Map<string, number>()
  stateProviders.forEach(p => cityMap.set(p.city, (cityMap.get(p.city) || 0) + 1))
  const hotspots = Array.from(cityMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10)

  // Neighboring states comparison
  const neighborCodes = NEIGHBORS[code] || []
  const neighborData = neighborCodes
    .map(nc => {
      const sd = allStates.find(s => s.state === nc)
      const count = watchlist.filter(p => p.state === nc).length
      return sd ? { code: nc, name: STATE_NAMES[nc] || nc, watchlistCount: count, markup: sd.markup_ratio } : null
    })
    .filter(Boolean) as { code: string; name: string; watchlistCount: number; markup: number }[]

  const avgRiskScore = stateProviders.length > 0
    ? Math.round(stateProviders.reduce((s, p) => s + p.risk_score, 0) / stateProviders.length)
    : 0

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'States', href: '/states' },
          { name: stateName, href: `/states/${code}` },
          { name: 'Fraud Risk' },
        ]} />

        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
            Medicare Fraud Risk in {stateName}
          </h1>
          <p className="text-lg text-gray-600">
            {stateProviders.length} flagged providers identified through statistical analysis of billing anomalies.
          </p>
          <ShareButtons
            url={`/states/${code}/fraud-risk`}
            title={`Medicare Fraud Risk in ${stateName}`}
            className="mt-4"
          />
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Flagged Providers</p>
            <p className="text-3xl font-bold text-red-600">{stateProviders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Average Risk Score</p>
            <p className="text-3xl font-bold text-orange-600">{avgRiskScore}/100</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">State Markup Ratio</p>
            <p className="text-3xl font-bold text-gray-900">{stateData.markup_ratio.toFixed(1)}x</p>
            <p className="text-xs text-gray-500 mt-1">
              National avg: {nationalAvgMarkup.toFixed(1)}x
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Total Medicare Payments</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stateData.total_payments)}</p>
          </div>
        </div>

        {/* Fraud Hotspots */}
        {hotspots.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔥 Fraud Hotspots in {stateName}</h2>
            <p className="text-gray-600 mb-4">Cities with the most flagged providers based on billing anomaly analysis.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotspots.map(([city, count]) => (
                <div key={city} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium text-gray-900">{city}</span>
                  <span className="text-red-600 font-bold">{count} flagged provider{count > 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flagged Providers Table */}
        {stateProviders.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Flagged Providers in {stateName}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Risk Score</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Payments</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Markup</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stateProviders.slice(0, 50).map((provider) => (
                    <tr key={provider.npi} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/providers/${provider.npi}`} className="text-medicare-primary hover:underline font-medium">
                          {provider.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{provider.specialty}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{provider.city}</td>
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
                      <td className="px-4 py-3 text-right text-sm">{provider.avg_markup.toFixed(1)}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {stateProviders.length > 50 && (
              <p className="text-sm text-gray-500 mt-4">Showing top 50 of {stateProviders.length} flagged providers.</p>
            )}
          </div>
        )}

        {/* Neighboring States Comparison */}
        {neighborData.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Compared to Neighboring States</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Flagged Providers</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Markup Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-blue-50 font-medium">
                    <td className="px-4 py-3">{stateName} (this state)</td>
                    <td className="px-4 py-3 text-right">{stateProviders.length}</td>
                    <td className="px-4 py-3 text-right">{stateData.markup_ratio.toFixed(1)}x</td>
                  </tr>
                  {neighborData.map(n => (
                    <tr key={n.code} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/states/${n.code}/fraud-risk`} className="text-medicare-primary hover:underline">
                          {n.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right">{n.watchlistCount}</td>
                      <td className="px-4 py-3 text-right">{n.markup.toFixed(1)}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
