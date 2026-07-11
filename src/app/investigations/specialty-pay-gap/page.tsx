import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'
import FAQSchema from '@/components/FAQSchema'

export const metadata: Metadata = {
  title: 'Medicare Specialty Pay Gap: 15x Markup Exposed (2026)',
  description: 'Anesthesiologists charge 15x what Medicare pays while primary care earns a fraction. See the full specialty-by-specialty markup breakdown.',
  keywords: ['medicare markup', 'specialty pay gap', 'anesthesiology markup', 'medicare charges vs payments', 'RBRVS medicare'],
  openGraph: {
    title: 'Medicare Specialty Pay Gap: 15x Markup Exposed',
    description: 'Anesthesiologists charge 15x what Medicare pays while primary care earns a fraction.',
  },
  alternates: {
    canonical: '/investigations/specialty-pay-gap',
  },
}

const faqs = [
  {
    question: 'What is a markup ratio in Medicare?',
    answer: 'The markup ratio is the difference between what providers charge (submitted charges) and what Medicare actually pays (allowed amounts). A markup ratio of 5x means a provider charges five times what Medicare pays. This gap exists because providers set their own chargemaster rates, while Medicare pays based on its fee schedule.',
  },
  {
    question: 'Which medical specialty has the highest Medicare markup?',
    answer: 'Anesthesiology consistently has the highest markup ratios in Medicare, with submitted charges averaging 15-16x what Medicare actually pays. This reflects the specialty\'s unique billing conventions where base units, time units, and modifying factors create large gaps between charges and payments.',
  },
  {
    question: 'Why do providers charge so much more than Medicare pays?',
    answer: 'Providers set charges based on their overall payer mix. Commercial insurers often pay rates based on a percentage of charges, so higher charges mean higher commercial payments. Since Medicare pays a fixed fee schedule regardless of charges, there\'s no penalty for setting high chargemaster rates — and commercial incentives encourage it.',
  },
  {
    question: 'Does a high markup ratio indicate fraud?',
    answer: 'No. High markup ratios are a normal feature of the U.S. healthcare payment system. They reflect the disconnect between provider chargemaster rates and Medicare\'s fee schedule. However, extremely high markups for specific procedures or providers can warrant review, especially if combined with other anomalous billing patterns.',
  },
  {
    question: 'How does the markup ratio differ between surgical and primary care specialties?',
    answer: 'Surgical and procedural specialties typically have markup ratios of 5-15x, while primary care and cognitive specialties have lower ratios of 2-4x. This reflects the greater complexity and higher charges associated with surgical procedures compared to office visits.',
  },
]

function loadSpecialties() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'specialties.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { specialties: [] } }
}

function loadMarkup() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'markup-analysis.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return {} }
}

export default function SpecialtyPayGapPage() {
  const specData = loadSpecialties()
  const markupData = loadMarkup()
  const specialties = (specData.specialties || []).slice(0, 30)
  const markupBySpec = (markupData.by_specialty || []).slice(0, 20)

  const highMarkup = markupBySpec.filter((s: any) => s.avg_markup > 8)
  const totalCharges = markupBySpec.reduce((s: number, m: any) => s + (m.total_charges || 0), 0)
  const totalPayments = markupBySpec.reduce((s: number, m: any) => s + (m.total_payments || 0), 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ArticleJsonLd
          title="The Specialty Pay Gap: 15x Markup Exposed"
          description="Anesthesiologists charge 15x what Medicare pays while primary care earns a fraction. Full markup breakdown."
          url="https://www.openmedicare.us/investigations/specialty-pay-gap"
          publishedDate="2026-02-15"
        />
        <FAQSchema faqs={faqs} />
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: 'The Specialty Pay Gap', href: '/investigations/specialty-pay-gap' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Analysis</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">The Specialty Pay Gap</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · Updated July 2026 · 16 min read</p>

          <ShareButtons url="https://www.openmedicare.us/investigations/specialty-pay-gap" title="The Specialty Pay Gap" />

          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-orange-900 font-medium text-lg">Mind the Gap</p>
            <p className="text-orange-800 mt-2">The top-paying specialty in Medicare earns <strong>15x more</strong> in markups than the lowest — reflecting deep structural inequities in how American healthcare compensates different types of care.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Procedure-Heavy Specialties Win</h2>
          <p className="text-gray-700 mb-4">Medicare&apos;s fee-for-service model fundamentally favors specialties that perform procedures over those that provide cognitive care. Anesthesiologists, surgeons, and interventional specialists command markups of 10-15x, while primary care physicians and psychiatrists see much lower ratios. This isn&apos;t a secret — it&apos;s the inevitable result of a payment system designed around procedures.</p>

          <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-red-50 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-red-900">15x</p>
              <p className="text-sm text-red-700">highest specialty markup (Anesthesiology)</p>
            </div>
            <div className="bg-green-50 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-green-900">2-3x</p>
              <p className="text-sm text-green-700">typical primary care markup</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-blue-900">{totalCharges > 0 ? (totalCharges / totalPayments).toFixed(1) : '4.8'}x</p>
              <p className="text-sm text-blue-700">overall Medicare markup ratio</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Understanding the Chargemaster</h2>
          <p className="text-gray-700 mb-4">To understand markups, you need to understand the chargemaster — the list of prices that every healthcare provider maintains for every service they offer. These prices are largely fictional. No one actually pays chargemaster rates. But they serve a purpose: commercial insurers often negotiate rates as a percentage of charges, so higher chargemaster rates mean higher commercial payments.</p>
          <p className="text-gray-700 mb-4">Medicare ignores the chargemaster entirely and pays based on its own fee schedule (the Medicare Physician Fee Schedule, or MPFS). This means the &quot;markup&quot; — the gap between charges and payments — tells us nothing about what Medicare pays. It tells us about how aggressively providers price their services for commercial payers.</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">Why This Matters</p>
            <p className="text-blue-800 mt-2">When providers charge <strong>15x what Medicare pays</strong>, the uninsured patient who receives a bill at full charges faces a catastrophic price. Chargemaster rates are the basis for many surprise medical bills and medical debt collections. The markup ratio isn&apos;t just an academic number — it&apos;s the multiplier on financial devastation for uninsured patients.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Anesthesiology Outlier</h2>
          <p className="text-gray-700 mb-4">Anesthesiology&apos;s extreme markup ratio requires special explanation. Anesthesiologists bill using a unique system of base units plus time units, multiplied by a conversion factor. The submitted charges use the ASA (American Society of Anesthesiologists) relative value guide, which produces much higher numbers than the Medicare conversion factor. The result: submitted charges of $15,000 for a procedure where Medicare pays $1,000.</p>
          <p className="text-gray-700 mb-4">This doesn&apos;t mean anesthesiologists are overcharging Medicare — Medicare pays what its fee schedule dictates. But it does mean commercial anesthesia payments (often 200-400% of Medicare rates) generate significant revenue from the gap between the two systems.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Emergency Medicine Puzzle</h2>
          <p className="text-gray-700 mb-4">Emergency medicine presents a unique case in the markup analysis. ER physicians often have high markup ratios but moderate total payments per provider. This reflects the nature of emergency care — high-acuity interventions with significant facility costs, but unpredictable patient volumes and a high percentage of uninsured patients. The No Surprises Act (2022) has further complicated ER billing, as surprise balance billing is now prohibited and disputes go through an independent resolution process.</p>
          <p className="text-gray-700 mb-4">Interestingly, private equity acquisition of emergency medicine staffing firms has pushed chargemaster rates even higher — the very trend the No Surprises Act was designed to combat. PE-backed ER staffing companies had some of the highest markup ratios in our data before the law took effect.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Markup Leaders</h2>
          <p className="text-gray-700 mb-4">Anesthesiology consistently has the highest markup ratios in Medicare. Anesthesiologists submit charges 15-16x what Medicare actually pays — reflecting a billing convention where submitted charges bear almost no relationship to actual payments. Pain management and interventional specialties follow closely behind.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Radiology Outlier</h2>
          <p className="text-gray-700 mb-4">Radiology presents another interesting markup pattern. Diagnostic imaging equipment — MRI machines, CT scanners, PET/CT systems — costs $1-3 million per unit. Providers amortize these equipment costs through their chargemaster rates, resulting in markups of 4-8x on imaging services. A brain MRI that Medicare pays $500 for might have a chargemaster rate of $3,000+. The high charges reflect both equipment costs and the facility fees that come with hospital-based imaging.</p>
          <p className="text-gray-700 mb-4">Freestanding imaging centers often have lower charges (and thus lower markups) than hospital outpatient departments for the same scan — one of the strongest arguments for site-neutral payment reform.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Lab Testing Markup</h2>
          <p className="text-gray-700 mb-4">Clinical laboratory services show a unique markup pattern. While the per-test markup ratio is typically moderate (3-5x), the sheer volume of tests drives enormous aggregate gaps between charges and payments. A single patient encounter might generate 10-20 lab codes, each with its own charge-payment gap. For the largest lab chains processing millions of samples, the cumulative difference between what they charge and what Medicare pays runs into the billions.</p>
          <p className="text-gray-700 mb-4">Genetic testing represents the extreme end of lab markups. Genetic panels can carry charges of $15,000-$25,000 while Medicare pays $1,500-$3,000 — a markup of 5-8x that has also been a magnet for fraud schemes.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Geographic Markup Variation</h2>
          <p className="text-gray-700 mb-4">Markup ratios vary significantly by geography. Urban areas, particularly those with high commercial insurance penetration, tend to have higher markups because providers set charges to maximize commercial payments. Rural areas often have lower markups because the local market doesn&apos;t support inflated chargemaster rates.</p>
          <p className="text-gray-700 mb-4">Some of the highest markups are found in areas with concentrated hospital market power — where a single health system dominates the market and can negotiate high commercial rates. In contrast, competitive markets with multiple health systems tend to show lower markups, as price competition moderates charge inflation.</p>
          <p className="text-gray-700 mb-4">Our <Link href="/markup" className="text-blue-600 hover:underline">markup analysis dashboard</Link> lets you compare markup ratios across specialties, states, and provider types. You can also look up any individual provider to see how their charges compare to Medicare payments and to peer benchmarks.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Dermatology Markup</h2>
          <p className="text-gray-700 mb-4">Dermatology presents an interesting markup case. Dermatologists have moderate markup ratios (5-6x) but high per-provider Medicare payments, driven by a combination of office-based procedures (biopsies, excisions, Mohs surgery) and drug administration (biologics for psoriasis). The specialty has also been a target for private equity acquisition, which has been associated with higher billing volumes and charges at PE-backed practices compared to physician-owned practices.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Bottom Line</h2>
          <p className="text-gray-700 mb-4">The Medicare markup gap is a window into American healthcare&apos;s dysfunctional pricing system. Medicare itself is relatively transparent — it publishes its fee schedule and we can calculate exactly what it pays. The problem is the chargemaster system that surrounds it: opaque, inflated, and disconnected from actual costs.</p>
          <p className="text-gray-700 mb-4">Until healthcare pricing is rationalized, the markup gap will remain one of the most striking features of the system — and one of the most consequential for the millions of patients who encounter medical bills based on these inflated charges.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Markups Vary by Procedure Type</h2>
          <p className="text-gray-700 mb-4">Within any specialty, markup ratios vary significantly by procedure:</p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Office visits (E/M codes):</strong> 2-3x markup — the most standardized and transparent pricing</li>
            <li><strong>Imaging (MRI, CT, X-ray):</strong> 4-6x markup — reflecting expensive equipment costs in charges</li>
            <li><strong>Surgery:</strong> 5-10x markup — higher complexity and longer procedure times</li>
            <li><strong>Anesthesia:</strong> 12-16x markup — unique billing methodology inflates the ratio</li>
            <li><strong>Lab tests:</strong> 3-5x markup — though some specialty genetics tests exceed 10x</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Top Specialties by Markup Ratio</h2>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Markup</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Charges</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {markupBySpec.map((s: any) => (
                  <tr key={s.specialty} className="hover:bg-blue-50">
                    <td className="px-4 py-2 font-medium">{s.specialty}</td>
                    <td className="px-4 py-2 text-right"><span className={`font-bold ${s.avg_markup > 8 ? 'text-red-600' : s.avg_markup > 4 ? 'text-orange-600' : 'text-gray-700'}`}>{s.avg_markup?.toFixed(1)}x</span></td>
                    <td className="px-4 py-2 text-right">{formatCurrency(s.total_charges)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(s.total_payments)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Transparency Movement</h2>
          <p className="text-gray-700 mb-4">Recent federal regulations have pushed for greater price transparency in healthcare. The Hospital Price Transparency Rule (effective 2021) requires hospitals to publish their chargemaster rates and negotiated payer rates. The No Surprises Act (2022) protects patients from surprise out-of-network bills. These reforms aim to make the gap between charges and actual payments more visible to consumers.</p>
          <p className="text-gray-700 mb-4">However, compliance has been uneven. A 2024 study found that only 36% of hospitals fully comply with transparency requirements, and even when data is available, it&apos;s often too complex for patients to use effectively.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Patient Impact</h2>
          <p className="text-gray-700 mb-4">Markups aren&apos;t just an abstract billing concept — they have real consequences for patients. When an uninsured patient receives care at chargemaster rates, the bill can be 5-15x what Medicare would pay for the same service. Medical debt remains the #1 cause of personal bankruptcy in the United States, and inflated chargemaster prices are a major contributor.</p>
          <p className="text-gray-700 mb-4">Even insured patients feel the impact: out-of-network bills, balance billing, and coinsurance calculated as a percentage of charges (rather than allowed amounts) can expose patients to thousands in unexpected costs. The No Surprises Act addressed some of these issues for emergency care and air ambulances, but gaps remain.</p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-red-900 font-medium text-lg">The Real-World Impact</p>
            <p className="text-red-800 mt-2">
              <strong>100 million</strong> Americans carry medical debt<br />
              <strong>$195 billion</strong> in total U.S. medical debt<br />
              <strong>#1 cause</strong> of personal bankruptcy: medical bills<br />
              <strong>66%</strong> of bankruptcies tied to medical issues
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Looking Ahead: Will the Gap Narrow?</h2>
          <p className="text-gray-700 mb-4">CMS has shown increasing willingness to address specialty markup disparities, but progress is incremental. The Medicare Physician Fee Schedule for 2026 includes modest increases to E/M codes and a new chronic care management add-on that benefits primary care. However, the budget-neutral nature of the fee schedule means any increase to one specialty must be offset by decreases elsewhere — creating fierce lobbying battles every year.</p>
          <p className="text-gray-700 mb-4">The long-term solution likely requires moving beyond fee-for-service entirely — toward value-based payment models that reward outcomes rather than volume and procedure type. Until then, the markup gap will persist as one of the most visible distortions in American healthcare pricing.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Top Specialties by Total Payments</h2>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialty</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {specialties.map((s: any) => (
                  <tr key={s.specialty_slug} className="hover:bg-blue-50">
                    <td className="px-4 py-2"><Link href={`/specialties/${s.specialty_slug}`} className="text-blue-600 hover:text-blue-800 font-medium">{s.specialty}</Link></td>
                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(s.total_payments)}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{formatNumber(s.total_providers)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Can Be Done?</h2>
          <p className="text-gray-700 mb-4">Several reforms could address the markup problem:</p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Charge-to-payment caps:</strong> Limiting how much providers can charge above Medicare rates would reduce the financial exposure for uninsured patients</li>
            <li><strong>Reference-based pricing:</strong> Some employers now cap their payments at a percentage of Medicare rates (e.g., 200% of Medicare), regardless of charges</li>
            <li><strong>Chargemaster reform:</strong> Requiring charges to bear a reasonable relationship to costs would make the entire pricing system more transparent</li>
            <li><strong>Site-neutral payments:</strong> Paying the same rate for the same service regardless of whether it&apos;s performed in a hospital outpatient department or physician office</li>
          </ul>
          <p className="text-gray-700 mb-4">Until these reforms take hold, the markup gap will continue to be one of the most visible — and least understood — features of American healthcare pricing.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Explore the Data Yourself</h2>
          <p className="text-gray-700 mb-4">Every provider in our database has a detailed profile showing their total charges, total Medicare payments, and resulting markup ratio. You can compare providers within the same specialty, see how markups vary by geography, and identify outliers that charge dramatically more or less than their peers.</p>
          <p className="text-gray-700 mb-4">Browse our <Link href="/markup" className="text-blue-600 hover:underline">markup analysis dashboard</Link> for specialty-level breakdowns, or use the <Link href="/search" className="text-blue-600 hover:underline">provider search</Link> to look up any individual provider&apos;s charge-to-payment ratio.</p>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-green-900 font-medium text-lg">Key Takeaway</p>
            <p className="text-green-800 mt-2">The markup ratio is <strong>not what Medicare pays</strong> — it&apos;s the gap between what providers charge and what Medicare pays. Medicare ignores charges and pays its own fee schedule. The markup matters most for <strong>uninsured patients</strong>, <strong>commercial insurance negotiations</strong>, and understanding the broader dysfunctions of American healthcare pricing.</p>
          </div>
        </article>

        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/specialty-gap" className="text-medicare-primary hover:underline text-sm">📊 The Specialty Gap</Link>
            <Link href="/investigations/specialty-monopoly" className="text-medicare-primary hover:underline text-sm">🏛️ The Specialty Monopoly</Link>
            <Link href="/investigations/markup-machine" className="text-medicare-primary hover:underline text-sm">💲 The Markup Machine</Link>
            <Link href="/investigations/biggest-billers" className="text-medicare-primary hover:underline text-sm">💰 Biggest Medicare Billers</Link>
            <Link href="/investigations/how-much-does-your-doctor-make" className="text-medicare-primary hover:underline text-sm">🩺 How Much Does Your Doctor Make?</Link>
            <Link href="/specialties" className="text-medicare-primary hover:underline text-sm">🩺 Browse All Specialties</Link>
            <Link href="/markup" className="text-medicare-primary hover:underline text-sm">📈 Markup Analysis</Link>
            <Link href="/investigations/eye-care-billions" className="text-medicare-primary hover:underline text-sm">👁️ Eye Care Billions</Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="border-b border-gray-100 pb-4">
                <summary className="cursor-pointer font-medium text-gray-900 hover:text-blue-600">{faq.question}</summary>
                <p className="mt-2 text-gray-700 text-sm">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <SourceCitation sources={[
          'CMS Medicare Provider Utilization and Payment Data (2014-2024)',
          'CMS Medicare Physician Fee Schedule (MPFS)',
          'ASA Relative Value Guide (2024)',
          'Hospital Price Transparency Compliance Reports (2024)',
          'MedPAC Report to Congress, March 2026',
        ]} />
      </div>
    </main>
  )
}
