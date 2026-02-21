import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: '9,862 Services Per Day: The Most Impossible Doctor in America — OpenMedicare',
  description: 'One provider billed Medicare for 2.47 million services in 2023. That\'s 9,862 per working day — or one every 2.9 seconds for 8 hours straight.',
  openGraph: {
    title: '9,862 Services Per Day',
    description: 'The most impossible billing in Medicare — one service every 2.9 seconds, all day, every day.',
  },
}

function loadData() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'fraud-features.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { impossible_providers: [], top_providers: [] } }
}

export default function ImpossibleServicesPage() {
  const data = loadData()
  const impossible = data.impossible_providers || []
  const top = impossible[0]
  const topTen = impossible.slice(0, 10)

  const workingDays = 250
  const hoursPerDay = 8
  const servicesPerDay = top ? Math.round(top.total_services / workingDays) : 9862
  const servicesPerHour = top ? Math.round(top.total_services / workingDays / hoursPerDay) : 1232
  const servicesPerMinute = top ? (top.total_services / workingDays / hoursPerDay / 60).toFixed(1) : '20.5'
  const secondsPerService = top ? (workingDays * hoursPerDay * 3600 / top.total_services).toFixed(1) : '2.9'
  const servicesPerBene = top ? Math.round(top.total_services / top.total_beneficiaries) : 1017

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: '9,862 Services Per Day', href: '/investigations/9862-services-per-day' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Investigation</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">9,862 Services Per Day: The Most Impossible Doctor in America</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 12 min read</p>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-orange-900 font-medium text-lg">Key Finding</p>
            <p className="text-orange-800 mt-2">The #1 most impossible provider in Medicare billed <strong>{formatNumber(top?.total_services || 2465495)}</strong> services in a single year — that&apos;s <strong>{formatNumber(servicesPerDay)}</strong> per working day, or <strong>one every {secondsPerService} seconds</strong> for 8 hours straight.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Let&apos;s Do the Math</h2>
          <p className="text-gray-700 mb-4">{top?.provider_name || 'Madhavi Rayapudi'} is an {top?.specialty || 'Infectious Disease'} specialist in {top?.city || 'Cumming'}, {top?.state || 'GA'}. According to Medicare billing data, in 2023 this single provider submitted <strong>{formatNumber(top?.total_services || 2465495)}</strong> services to Medicare.</p>
          <p className="text-gray-700 mb-4">Let that number sink in. Here&apos;s what it means:</p>
        </article>

        <div className="bg-gray-900 text-white rounded-xl p-8 my-8">
          <h3 className="text-xl font-bold mb-6 text-orange-400">Breaking Down {formatNumber(top?.total_services || 2465495)} Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-3xl font-bold text-white">{formatNumber(servicesPerDay)}</p>
              <p className="text-gray-400 text-sm">services per working day</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{formatNumber(servicesPerHour)}</p>
              <p className="text-gray-400 text-sm">services per hour</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{servicesPerMinute}</p>
              <p className="text-gray-400 text-sm">services per minute</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-400">{secondsPerService}s</p>
              <p className="text-gray-400 text-sm">seconds per service</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4">Assuming 250 working days/year, 8 hours/day, no breaks, no lunch, no bathroom.</p>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">Think about that: <strong>one service every {secondsPerService} seconds</strong>. Not a minute — seconds. For 8 hours straight. Every working day. For an entire year.</p>
          <p className="text-gray-700 mb-4">For context, it takes about 3 seconds to say &quot;hello, how are you?&quot; This provider would need to complete an entire Medicare-billable service in that time. No examination. No documentation. No hand-washing between patients.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Per-Patient Numbers Are Just as Wild</h2>
          <p className="text-gray-700 mb-4">This provider has {formatNumber(top?.total_beneficiaries || 2422)} beneficiaries. That means each patient received an average of <strong>{formatNumber(servicesPerBene)} services</strong> over the year — roughly <strong>{Math.round(servicesPerBene / 12)} services per month per patient</strong>.</p>
          <p className="text-gray-700 mb-4">What kind of patient gets {Math.round(servicesPerBene / 12)} infectious disease services every single month?</p>
          <p className="text-gray-700 mb-4">{top?.drug_pct ? `${top.drug_pct.toFixed(1)}% of this provider's billing is drug-related` : '25.5% of billing is drugs'} — suggesting a significant portion of these &quot;services&quot; may be drug administration or dispensing codes. But even so, the volumes are staggering.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">She&apos;s Not Alone</h2>
          <p className="text-gray-700 mb-4">Our analysis flagged <strong>{formatNumber(impossible.length)}</strong> providers with mathematically impossible billing patterns. Here are the top 10:</p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Provider</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Services</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services/Day</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topTen.map((p: any, i: number) => (
                  <tr key={p.npi || i} className={`hover:bg-blue-50 ${i === 0 ? 'bg-orange-50' : ''}`}>
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2 font-medium text-sm">{p.provider_name}</td>
                    <td className="px-4 py-2 text-gray-600 text-sm">{p.specialty}</td>
                    <td className="px-4 py-2 text-gray-600 text-sm">{p.city}, {p.state}</td>
                    <td className="px-4 py-2 text-right font-medium">{formatNumber(p.total_services)}</td>
                    <td className="px-4 py-2 text-right font-bold text-orange-600">{formatNumber(Math.round(p.total_services / 250))}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(p.total_payments)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What&apos;s Going On?</h2>
          <p className="text-gray-700 mb-4">There are a few possible explanations:</p>
          <p className="text-gray-700 mb-4"><strong>1. Incident-to billing:</strong> In some arrangements, services provided by staff (nurses, PAs) can be billed under the supervising physician&apos;s NPI. This is legal but can make one provider look impossibly productive.</p>
          <p className="text-gray-700 mb-4"><strong>2. Lab/drug codes:</strong> Some providers bill large numbers of lab tests or drug administration codes per patient encounter. A single visit might generate dozens of line items.</p>
          <p className="text-gray-700 mb-4"><strong>3. Data aggregation:</strong> Some NPIs represent practices or groups rather than individuals, despite being listed as individual providers.</p>
          <p className="text-gray-700 mb-4"><strong>4. Fraud:</strong> Billing for services never provided is a federal crime — but it happens. The OIG has prosecuted providers with similar volume patterns.</p>
          <p className="text-gray-700 mb-4">We&apos;re not accusing anyone of fraud. But when one doctor bills for a service every 2.9 seconds for an entire year, the math demands an explanation.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The System Doesn&apos;t Catch This Automatically</h2>
          <p className="text-gray-700 mb-4">Perhaps the most troubling aspect: Medicare processed and paid these claims. The system lacks automated volume checks that would flag a single provider billing {formatNumber(servicesPerDay)} services per day.</p>
          <p className="text-gray-700 mb-4">CMS has fraud detection systems, and the OIG investigates tips and patterns. But with 1.3 million providers billing Medicare annually, manual review catches only a fraction of impossible billing.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Bottom Line</h2>
          <p className="text-gray-700 mb-8">Either these are data errors, billing structure artifacts, or something extraordinary is happening. In any case, {formatNumber(top?.total_services || 2465495)} services from a single provider in a single year deserves scrutiny. The data is public. The math is simple. And the questions remain unanswered.</p>
        </article>

        <ShareButtons url="https://openmedicare.vercel.app/investigations/9862-services-per-day" title="9,862 Services Per Day — OpenMedicare" />
        <SourceCitation />
      </div>
    </main>
  )
}
