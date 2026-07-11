'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ShareButtons from '@/components/ShareButtons'
import FAQSchema from '@/components/FAQSchema'

interface Specialty {
  specialty: string
  specialty_slug: string
  total_payments: number
  total_services: number
  total_providers: number
  total_beneficiaries: number
  avg_payment_per_service: number
  avg_payment_per_provider: number
  avg_services_per_provider: number
  total_submitted_charges: number
  markup_ratio: number
  years_active: number
  payment_share: number
  service_share: number
  provider_share: number
}

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${n.toFixed(0)}`
}

function fmtNum(n: number): string {
  return n.toLocaleString('en-US')
}


const faqs = [
  {
    "question": "How much does my doctor make from Medicare?",
    "answer": "Medicare payments vary enormously by specialty — primary care physicians average $100,000-200,000 annually from Medicare, while some specialists receive over $1 million. You can look up any provider's exact payments in CMS public data."
  },
  {
    "question": "Which medical specialties earn the most from Medicare?",
    "answer": "Ophthalmology, cardiology, orthopedic surgery, and oncology providers tend to receive the highest total Medicare payments, with top earners in these fields receiving several million dollars annually."
  },
  {
    "question": "Is it legal to see how much Medicare pays doctors?",
    "answer": "Yes. Since 2014, CMS publishes annual provider payment data that is fully public. Anyone can search for a specific provider and see their total Medicare payments, services rendered, and patient counts."
  },
  {
    "question": "Why do some doctors receive millions from Medicare?",
    "answer": "High-payment providers typically perform expensive procedures (like eye injections or cardiac interventions), see high patient volumes, or prescribe costly drugs — all of which are individually reimbursed by Medicare."
  }
]

export default function DoctorPayPage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [selected, setSelected] = useState<string>('')

  useEffect(() => {
    fetch('/data/specialties.json')
      .then(r => r.json())
      .then(d => {
        const sorted = (d.specialties as Specialty[]).sort((a, b) => a.specialty.localeCompare(b.specialty))
        setSpecialties(sorted)
      })
  }, [])

  const spec = specialties.find(s => s.specialty === selected)

  // Compute some aggregate stats for context
  const avgAcrossAll = specialties.length > 0
    ? specialties.reduce((s, sp) => s + sp.avg_payment_per_provider, 0) / specialties.length
    : 0

  const highestPaying = specialties.length > 0
    ? [...specialties].sort((a, b) => b.avg_payment_per_provider - a.avg_payment_per_provider)[0]
    : null

  const lowestPaying = specialties.length > 0
    ? [...specialties].sort((a, b) => a.avg_payment_per_provider - b.avg_payment_per_provider)[0]
    : null

  return (
    <main className="min-h-screen bg-gray-50">
      <FAQSchema faqs={faqs} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/investigations" className="hover:text-blue-600">Investigations</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Doctor Pay</span>
        </nav>

        <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Interactive Tool</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-3">
          How Much Does Your Doctor Make From Medicare?
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          Select a specialty to see real payment data from 10 years of Medicare records.
        </p>

        <ShareButtons url="https://www.openmedicare.us/investigations/how-much-does-your-doctor-make" title="How Much Does Your Doctor Make from Medicare?" />

        {/* Context stats */}
        {specialties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-4">
            <div className="bg-blue-50 rounded-lg p-5 text-center">
              <p className="text-2xl font-bold text-blue-900">{fmt(avgAcrossAll)}</p>
              <p className="text-sm text-blue-700">Average across all specialties</p>
            </div>
            <div className="bg-green-50 rounded-lg p-5 text-center">
              <p className="text-2xl font-bold text-green-900">{highestPaying ? fmt(highestPaying.avg_payment_per_provider) : '—'}</p>
              <p className="text-sm text-green-700">Highest: {highestPaying?.specialty || '—'}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-5 text-center">
              <p className="text-2xl font-bold text-red-900">{lowestPaying ? fmt(lowestPaying.avg_payment_per_provider) : '—'}</p>
              <p className="text-sm text-red-700">Lowest: {lowestPaying?.specialty || '—'}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <label htmlFor="specialty-select" className="block text-sm font-semibold text-gray-700 mb-2">
            Pick a medical specialty
          </label>
          <select
            id="specialty-select"
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">— Choose a specialty —</option>
            {specialties.map(s => (
              <option key={s.specialty_slug} value={s.specialty}>{s.specialty}</option>
            ))}
          </select>
        </div>

        {spec && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{spec.specialty}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
                  <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Avg Payment per Provider</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">{fmt(spec.avg_payment_per_provider)}</p>
                  <p className="text-xs text-blue-600 mt-1">over 10 years</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5">
                  <p className="text-sm font-medium text-emerald-600 uppercase tracking-wide">Total Providers</p>
                  <p className="text-3xl font-bold text-emerald-900 mt-1">{fmtNum(spec.total_providers)}</p>
                  <p className="text-xs text-emerald-600 mt-1">who billed Medicare</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5">
                  <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">Total Medicare Payments</p>
                  <p className="text-3xl font-bold text-purple-900 mt-1">{fmt(spec.total_payments)}</p>
                  <p className="text-xs text-purple-600 mt-1">2014–2024</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5">
                  <p className="text-sm font-medium text-amber-600 uppercase tracking-wide">Markup Ratio</p>
                  <p className="text-3xl font-bold text-amber-900 mt-1">{spec.markup_ratio.toFixed(2)}x</p>
                  <p className="text-xs text-amber-600 mt-1">charged vs. paid</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Avg Services/Provider</p>
                  <p className="font-semibold text-gray-900">{fmtNum(Math.round(spec.avg_services_per_provider))}</p>
                </div>
                <div>
                  <p className="text-gray-500">Avg Payment/Service</p>
                  <p className="font-semibold text-gray-900">${spec.avg_payment_per_service.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Services</p>
                  <p className="font-semibold text-gray-900">{fmtNum(spec.total_services)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Beneficiaries</p>
                  <p className="font-semibold text-gray-900">{fmtNum(spec.total_beneficiaries)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Share of All Payments</p>
                  <p className="font-semibold text-gray-900">{spec.payment_share.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Submitted Charges</p>
                  <p className="font-semibold text-gray-900">{fmt(spec.total_submitted_charges)}</p>
                </div>
              </div>

              {/* Comparison to average */}
              {avgAcrossAll > 0 && (
                <div className={`mt-6 p-4 rounded-lg ${spec.avg_payment_per_provider > avgAcrossAll ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`text-sm font-medium ${spec.avg_payment_per_provider > avgAcrossAll ? 'text-green-800' : 'text-red-800'}`}>
                    {spec.specialty} providers earn <strong>{spec.avg_payment_per_provider > avgAcrossAll ? `${((spec.avg_payment_per_provider / avgAcrossAll - 1) * 100).toFixed(0)}% more` : `${((1 - spec.avg_payment_per_provider / avgAcrossAll) * 100).toFixed(0)}% less`}</strong> than the average across all specialties ({fmt(avgAcrossAll)}).
                  </p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
              <strong>Want to go deeper?</strong>{' '}
              <Link href={`/specialties/${spec.specialty_slug}`} className="underline hover:text-blue-600">
                See the full {spec.specialty} breakdown →
              </Link>
            </div>
          </div>
        )}

        {!spec && selected === '' && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🩺</div>
            <p className="text-lg">Pick a specialty above to see the data</p>
          </div>
        )}

        {/* Understanding the Data */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Medicare Provider Payments</h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">What This Data Shows</h3>
            <p className="text-gray-700 mb-3">These figures represent total Medicare Part B payments to providers — what Medicare actually paid, not what was charged. Important context:</p>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• <strong>This isn&apos;t total income.</strong> Medicare is one payer. Most doctors also see patients with private insurance, Medicaid, and self-pay.</li>
              <li>• <strong>Payments go to the practice, not the doctor&apos;s pocket.</strong> Medicare payments cover staff salaries, rent, equipment, malpractice insurance, and supplies.</li>
              <li>• <strong>Averages mask huge variation.</strong> Within any specialty, payments range from a few thousand dollars to millions depending on volume, location, and practice type.</li>
              <li>• <strong>Part B only.</strong> This doesn&apos;t include hospital payments (Part A) or drug plan payments (Part D). Hospital-employed physicians may have lower Part B billing because the hospital bills separately.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Why the Gap Matters</h3>
            <p className="text-gray-700 mb-3">The enormous variation in Medicare payments across specialties has real consequences:</p>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• <strong>Medical student choices:</strong> Students with $200K+ in debt gravitate toward higher-paying specialties, worsening the primary care shortage.</li>
              <li>• <strong>Access to care:</strong> Lower Medicare payments in primary care contribute to fewer physicians accepting new Medicare patients.</li>
              <li>• <strong>Geographic disparities:</strong> Rural areas struggle to attract specialists, as the financial incentives favor urban practice.</li>
              <li>• <strong>Health outcomes:</strong> Countries with stronger primary care systems consistently show better health outcomes at lower costs.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">The Markup Ratio Explained</h3>
            <p className="text-gray-700 mb-3">The markup ratio shows how much providers charge versus what Medicare pays. A 5x markup means the provider submits charges five times higher than Medicare&apos;s payment. Key points:</p>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• Medicare ignores charges and pays its own fee schedule regardless</li>
              <li>• High markups matter for <strong>uninsured patients</strong> who may face full chargemaster rates</li>
              <li>• Commercial insurers often negotiate rates as a <strong>percentage of charges</strong>, so higher charges = higher commercial payments</li>
              <li>• Anesthesiology has the highest markups (15x+) due to unique billing conventions</li>
            </ul>
          </div>
        </div>

        {/* Related Investigations */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/specialty-gap" className="text-blue-600 hover:underline text-sm">📊 The Specialty Pay Gap</Link>
            <Link href="/investigations/specialty-pay-gap" className="text-blue-600 hover:underline text-sm">💲 Specialty Markup Analysis</Link>
            <Link href="/investigations/specialty-monopoly" className="text-blue-600 hover:underline text-sm">🏛️ The Specialty Monopoly</Link>
            <Link href="/investigations/biggest-billers" className="text-blue-600 hover:underline text-sm">💰 Biggest Medicare Billers</Link>
            <Link href="/investigations/medicare-millionaires" className="text-blue-600 hover:underline text-sm">🤑 Medicare Millionaires</Link>
            <Link href="/investigations/rural-price-tag" className="text-blue-600 hover:underline text-sm">🌾 The Rural Price Tag</Link>
            <Link href="/specialties" className="text-blue-600 hover:underline text-sm">🩺 Browse All Specialties</Link>
            <Link href="/investigations/nurse-practitioner-boom" className="text-blue-600 hover:underline text-sm">👩‍⚕️ Rise of the Nurse Practitioner</Link>
          </div>
        </div>

        <ShareButtons url="https://www.openmedicare.us/investigations/how-much-does-your-doctor-make" title="How Much Does Your Doctor Make from Medicare?" />
        {/* Key Insights */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Insights From the Data</h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">The Primary Care Crisis</h3>
            <p className="text-gray-700 mb-3">The massive pay gap between primary care and specialist Medicare payments has real consequences:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-red-50 rounded-lg p-4">
                <p className="font-bold text-red-900">48,000</p>
                <p className="text-red-700">Projected primary care physician shortage by 2034</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="font-bold text-blue-900">30%</p>
                <p className="text-blue-700">Of primary care docs plan to retire within 5 years</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="font-bold text-orange-900">$200K+</p>
                <p className="text-orange-700">Average medical school debt steering students to high-paying specialties</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="font-bold text-green-900">11%</p>
                <p className="text-green-700">Of physicians practice in rural areas (20% of population lives there)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">The Eye Care Anomaly</h3>
            <p className="text-gray-700 text-sm">Ophthalmology often tops the per-provider payment rankings — not because of surgical volume alone, but because of <strong>anti-VEGF drug injections</strong> (Eylea, Lucentis) for macular degeneration. Each injection costs Medicare $1,800-$2,200, and patients may receive 6-12 per year. An ophthalmologist administering 20-30 injections per week generates $2-3M in annual Medicare payments from drug billing alone.</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <p>Data source: CMS Medicare Provider Utilization and Payment Data, 2014–2024. Payments reflect total Medicare allowed amounts over 10 years.</p>
          <div className="mt-4 flex gap-4">
            <Link href="/investigations" className="text-blue-600 hover:underline">← All Investigations</Link>
            <Link href="/investigations/specialty-pay-gap" className="text-blue-600 hover:underline">Specialty Pay Gap →</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
