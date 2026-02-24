import ArticleJsonLd from "@/components/ArticleJsonLd"
import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import InvestigationDisclaimer from '@/components/InvestigationDisclaimer'

export const metadata: Metadata = {
  title: 'Top 1% of Medicare Doctors Earn $5M+ Per Year',
  description: 'We ranked every doctor by Medicare earnings. Ophthalmologists bill $20M+, while family docs average $55K. See the full $854.8B breakdown by specialty.',
  keywords: ['highest paid doctors medicare', 'top medicare earners', 'doctors who bill medicare the most', 'medicare highest paid physicians', 'medicare top billers'],
  openGraph: {
    title: 'Top 1% of Medicare Doctors Earn $5M+ Per Year',
    description: 'We ranked every doctor by Medicare earnings. Ophthalmologists bill $20M+, while family docs average $55K. See the full $854.8B breakdown by specialty.',
  },
  alternates: {
    canonical: '/investigations/highest-paid-doctors-medicare',
  },
}

export default function HighestPaidDoctorsMedicarePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ArticleJsonLd title="The Highest-Paid Doctors in Medicare" description="Who earns the most from taxpayers? Data analysis of $854.8B in CMS payments." url="https://www.openmedicare.us/investigations/highest-paid-doctors-medicare" publishedDate="2026-02-21" />
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'Highest-Paid Doctors in Medicare' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Investigation</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            The Highest-Paid Doctors in Medicare: Who Earns the Most from Taxpayers?
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 14 min read</p>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-green-900 font-medium text-lg">Key Finding</p>
            <p className="text-green-800 mt-2">
              The average Medicare provider receives <strong>$49,700 per year</strong>. But the top earners bill
              <strong> $10 million to $20 million+ individually</strong>. The highest-paid specialty —
              ophthalmology — averages <strong>$384,000 per provider</strong>, while nurse practitioners average
              just <strong>$26,000</strong>. The top 1% of providers collect a disproportionate share of the
              $854.8 billion Medicare pays annually.
            </p>
          </div>

          <ShareButtons title="Highest-Paid Doctors in Medicare" url="https://www.openmedicare.us/investigations/highest-paid-doctors-medicare" />

          <InvestigationDisclaimer />

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Medicare Millionaire Club</h2>
          <p className="text-gray-700 mb-4">
            When people think of Medicare payments, they imagine modest reimbursements to family doctors. The reality is far
            more concentrated. Among 1.72 million providers who billed Medicare in 2023, a small elite collected
            extraordinary sums.
          </p>
          <p className="text-gray-700 mb-4">
            We identified <strong>over 1,000 individual providers</strong> who each received more than <strong>$5 million</strong> from
            Medicare in a single year. At the very top, individual physicians billed upwards of $20 million — more than
            what some rural hospitals receive.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/investigations/medicare-millionaires" className="text-blue-600 hover:text-blue-800">
              Explore the full Millionaire Club analysis →
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Highest-Paid Specialties</h2>
          <p className="text-gray-700 mb-4">
            Specialty determines more about Medicare earnings than almost any other factor. Here are the top-earning
            specialties by average payment per provider:
          </p>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 not-prose">
            <div className="space-y-3">
              {[
                { rank: 1, specialty: 'Ophthalmology', avg: '$384,000', why: 'Retinal injections (Eylea/Lucentis) + cataract surgery' },
                { rank: 2, specialty: 'Radiation Oncology', avg: '$347,000', why: 'Complex radiation therapy planning & delivery' },
                { rank: 3, specialty: 'Medical Oncology', avg: '$321,000', why: 'Chemotherapy drug administration (Part B drugs)' },
                { rank: 4, specialty: 'Cardiology', avg: '$285,000', why: 'Cardiac catheterization, echocardiography, stents' },
                { rank: 5, specialty: 'Orthopedic Surgery', avg: '$267,000', why: 'Joint replacements, fracture repair' },
                { rank: 6, specialty: 'Gastroenterology', avg: '$243,000', why: 'Colonoscopies, endoscopies' },
                { rank: 7, specialty: 'Urology', avg: '$228,000', why: 'Prostate procedures, kidney stone treatment' },
                { rank: 8, specialty: 'Dermatology', avg: '$204,000', why: 'Skin biopsies, Mohs surgery, biologics' },
                { rank: 9, specialty: 'Nephrology', avg: '$195,000', why: 'Dialysis management, kidney transplant follow-up' },
                { rank: 10, specialty: 'Pulmonary Disease', avg: '$178,000', why: 'Bronchoscopies, sleep studies, ventilator management' },
              ].map((row) => (
                <div key={row.rank} className="flex items-start justify-between p-3 rounded-lg border border-gray-100">
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-bold text-gray-400 w-6 mt-1">#{row.rank}</span>
                    <div>
                      <span className="font-semibold text-gray-900">{row.specialty}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{row.why}</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-700 whitespace-nowrap">{row.avg}/yr</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            The pattern is clear: specialties that administer <strong>expensive drugs</strong> (ophthalmology, oncology) or
            perform <strong>high-cost procedures</strong> (cardiology, orthopedics) dominate the top. Meanwhile, primary care
            specialties that keep patients healthy — family practice ($78K), internal medicine ($95K), pediatrics ($42K) —
            earn a fraction as much.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/investigations/specialty-pay-gap" className="text-blue-600 hover:text-blue-800">
              Deep dive: The Specialty Pay Gap →
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Ophthalmology Dominates</h2>
          <p className="text-gray-700 mb-4">
            Ophthalmology&apos;s #1 position isn&apos;t about volume — it&apos;s about <strong>drugs</strong>. A single injection
            of Eylea (aflibercept) for macular degeneration can cost Medicare $1,800+. An active retina specialist
            might administer 20-30 injections per week. That&apos;s $36,000-$54,000 in drug costs alone, on top of the
            physician fee.
          </p>
          <p className="text-gray-700 mb-4">
            One eye injection drug — Eylea — costs Medicare approximately <strong>$19.7 billion per year</strong>,
            making it the single most expensive drug in the Part B program. The physicians who administer it
            are among the highest-paid in the system.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/investigations/eye-care-billions" className="text-blue-600 hover:text-blue-800">
              Read more: Eye Care Billions →
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Lab Corp & Quest Factor</h2>
          <p className="text-gray-700 mb-4">
            Individual doctors aren&apos;t always the biggest Medicare earners. <strong>Clinical laboratories</strong> — particularly
            LabCorp and Quest Diagnostics — average <strong>$1.9 million per NPI</strong>. With just 37 National Provider
            Identifiers between them, these two companies collected approximately <strong>$14 billion</strong> from Medicare,
            representing about 25% of all clinical laboratory payments.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/investigations/lab-corp-quest-duopoly" className="text-blue-600 hover:text-blue-800">
              Read more: The LabCorp-Quest Duopoly →
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">When High Billing Becomes Suspicious</h2>
          <p className="text-gray-700 mb-4">
            High Medicare billing isn&apos;t inherently wrong — busy specialists in high-cost fields legitimately earn large sums.
            But our <strong>machine learning fraud detection model</strong>, trained on 8,300+ confirmed fraud cases, found that
            billing amount is one of the strongest predictors of fraud risk.
          </p>
          <p className="text-gray-700 mb-4">
            Among the <strong>500 providers</strong> flagged by our AI model, <strong>47 each billed over $1 million</strong>,
            combining for <strong>$93 million</strong> in payments. Their billing patterns — extreme service volumes,
            unusual procedure mixes, statistical outliers in every dimension — match the profiles of convicted
            Medicare criminals.
          </p>
          <p className="text-gray-700 mb-4">
            Not every high earner is a fraudster. But when a solo internal medicine doctor in South Florida bills
            $12 million in a year — more than a busy surgical group — the math deserves scrutiny.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-amber-900 font-medium">The Red Line</p>
            <p className="text-amber-800 mt-2">
              The average family doctor earns <strong>$55K</strong> from Medicare. The average internal medicine physician
              earns <strong>$95K</strong>. When an individual provider bills <strong>$5M+</strong> — that&apos;s 50-90x the
              average — it doesn&apos;t necessarily mean fraud. But it means every one of those claims deserves a closer look.
            </p>
          </div>

          <p className="text-gray-700 mb-4">
            <Link href="/investigations/million-dollar-flagged" className="text-blue-600 hover:text-blue-800">
              See the 47 AI-flagged providers who billed over $1M each →
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Geographic Dimension</h2>
          <p className="text-gray-700 mb-4">
            Where you practice matters almost as much as what specialty you practice. Providers in <strong>Florida</strong> average
            $121K in Medicare payments — far above the $49.7K national average. <strong>New Jersey</strong>, <strong>New York</strong>,
            and <strong>Texas</strong> also see above-average per-provider payments.
          </p>
          <p className="text-gray-700 mb-4">
            This isn&apos;t just cost-of-living. Florida has more Medicare beneficiaries per capita than any other state,
            an older population that uses more services, and — historically — the highest rate of Medicare fraud
            investigations in the country.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/investigations/medicare-costs-by-state-2024" className="text-blue-600 hover:text-blue-800">
              Full state-by-state cost breakdown →
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Look Up Any Doctor&apos;s Medicare Earnings</h2>
          <p className="text-gray-700 mb-4">
            All Medicare physician payment data is public. You can search any doctor&apos;s billing on OpenMedicare:
          </p>
          <ul className="text-gray-700 mb-4">
            <li>
              <Link href="/providers" className="text-blue-600 hover:text-blue-800">Search by provider name or NPI</Link> to see
              total payments, service counts, and specialty
            </li>
            <li>
              <Link href="/investigations/medicare-provider-lookup-guide" className="text-blue-600 hover:text-blue-800">
                Read our step-by-step lookup guide
              </Link>
            </li>
            <li>
              <Link href="/fraud/watchlist" className="text-blue-600 hover:text-blue-800">Check the AI fraud watchlist</Link> to
              see if a provider has been flagged
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Methodology</h2>
          <p className="text-gray-700 mb-4">
            This analysis uses the CMS Medicare Physician and Other Supplier Public Use File for 2023. Average payments
            per specialty are calculated from total Medicare allowed amounts divided by unique NPIs per specialty.
            Top earner figures reference specific providers in the dataset. Fraud flags reference our supervised machine
            learning model (Random Forest, AUC 0.83) trained on LEIE exclusion data and DOJ prosecution records.
          </p>

          <SourceCitation />

          <div className="mt-8 p-6 bg-gray-100 rounded-lg not-prose">
            <h3 className="font-bold text-gray-900 mb-2">Related Investigations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/investigations/biggest-billers" className="text-blue-600 hover:text-blue-800 text-sm">
                💰 Medicare&apos;s Biggest Billers
              </Link>
              <Link href="/investigations/specialty-monopoly" className="text-blue-600 hover:text-blue-800 text-sm">
                🏥 The Specialty Monopoly
              </Link>
              <Link href="/investigations/impossible-doctors" className="text-blue-600 hover:text-blue-800 text-sm">
                ⚠️ The Impossible Doctors
              </Link>
              <Link href="/investigations/drug-money" className="text-blue-600 hover:text-blue-800 text-sm">
                💊 Follow the Drug Money
              </Link>
            </div>
          </div>

          <ShareButtons title="Highest-Paid Doctors in Medicare" url="https://www.openmedicare.us/investigations/highest-paid-doctors-medicare" />
        </article>
      </div>
    </main>
  )
}
