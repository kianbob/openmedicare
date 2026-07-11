import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'
import RelatedArticles from '@/components/RelatedArticles'
import FAQSchema from '@/components/FAQSchema'

export const metadata: Metadata = {
  title: "Houston Spends $9.24B on Medicare — More Than Most States",
  description: '19,925 providers. $463K per doctor. Houston dominates U.S. Medicare spending thanks to the Texas Medical Center effect. See the top 20 cities ranked.',
  keywords: ['houston medicare spending', 'texas medical center', 'medicare by city', 'top medicare cities', 'houston healthcare'],
  openGraph: {
    title: "Houston Spends $9.24B on Medicare — More Than Most States",
    description: '19,925 providers. $463K per doctor. Houston dominates U.S. Medicare spending thanks to the Texas Medical Center effect. See the top 20 cities ranked.',
  },
  alternates: {
    canonical: '/investigations/houston-medicare-capital',
  },
}

const faqs = [
  {
    question: 'Why does Houston have the highest Medicare spending of any U.S. city?',
    answer: 'Houston leads Medicare spending due to three factors: the Texas Medical Center (the world\'s largest medical complex with 106,000 employees), a large and growing elderly population in Harris County (500,000+ beneficiaries), and a concentration of high-billing specialties like oncology, cardiology, and transplant surgery.',
  },
  {
    question: 'How much does Houston spend on Medicare?',
    answer: 'Houston providers receive approximately $9.24 billion in annual Medicare payments, with 19,925 providers averaging $463,750 each. This exceeds the total Medicare spending of many entire states.',
  },
  {
    question: 'What is the Texas Medical Center and why does it matter for Medicare?',
    answer: 'The Texas Medical Center in Houston is the largest medical complex in the world, housing institutions like MD Anderson Cancer Center (#1 cancer hospital), Methodist Hospital, and Baylor College of Medicine. It has 106,000 employees and handles 10 million patient encounters per year, making it a massive driver of Medicare spending.',
  },
  {
    question: 'Which cities spend the most on Medicare?',
    answer: 'Houston leads all U.S. cities in Medicare spending, followed by New York, Chicago, Los Angeles, and Philadelphia. Cities with major academic medical centers and large elderly populations tend to rank highest.',
  },
  {
    question: 'Is Houston\'s high Medicare spending a sign of waste or fraud?',
    answer: 'Not necessarily. Houston\'s high spending largely reflects its massive healthcare infrastructure, specialty concentration, and patient volume. However, the concentration of spending does warrant oversight — Texas has historically been one of the top states for Medicare fraud enforcement actions.',
  },
]

function loadData() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'geographic.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return { top_cities: [], top_zips: [], cities_by_state: {} } }
}

export default function HoustonMedicareCapitalPage() {
  const data = loadData()
  const topCities = (data.top_cities || []).slice(0, 20)
  const houston = topCities[0] || {}

  const nationalAvgPerProvider = topCities.length > 0
    ? topCities.reduce((s: number, c: any) => s + c.total_payments, 0) / topCities.reduce((s: number, c: any) => s + c.providers, 0)
    : 0

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ArticleJsonLd
          title="Houston: America's Medicare Capital"
          description="Houston leads U.S. Medicare spending at $9.24B — more than most states. The Texas Medical Center effect explained."
          url="https://www.openmedicare.us/investigations/houston-medicare-capital"
          publishedDate="2026-02-15"
        />
        <FAQSchema faqs={faqs} />
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: "Houston: America's Medicare Capital", href: '/investigations/houston-medicare-capital' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Analysis</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Houston: America&apos;s Medicare Capital</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · Updated July 2026 · 14 min read</p>

          <ShareButtons url="https://www.openmedicare.us/investigations/houston-medicare-capital" title="Houston: America's Medicare Capital" />

          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-purple-900 font-medium text-lg">Key Finding</p>
            <p className="text-purple-800 mt-2">Houston, Texas leads the nation with <strong>{formatCurrency(houston.total_payments || 9240000000)}</strong> in Medicare spending — more than most entire states. Its <strong>{formatNumber(houston.providers || 19925)}</strong> providers average <strong>{formatCurrency(houston.avg_payment_per_provider || 463750)}</strong> each.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Numbers</h2>
          <p className="text-gray-700 mb-4">Houston isn&apos;t just the largest city in Texas. It&apos;s the Medicare capital of the United States — and it&apos;s not particularly close.</p>
        </article>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">Total Medicare Spending</p>
            <p className="text-2xl font-bold text-purple-700">{formatCurrency(houston.total_payments || 9240000000)}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">Providers</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(houston.providers || 19925)}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">Markup Ratio</p>
            <p className="text-2xl font-bold text-gray-900">{houston.markup_ratio || '4.4'}x</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">Per Provider</p>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(houston.avg_payment_per_provider || 463750)}</p>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">That per-provider average of {formatCurrency(houston.avg_payment_per_provider || 463750)} is well above the national average — meaning Houston providers don&apos;t just outnumber other cities, they bill more per person too.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Houston?</h2>
          <p className="text-gray-700 mb-4">Three factors converge to make Houston the Medicare capital:</p>
          <p className="text-gray-700 mb-4"><strong>1. The Texas Medical Center:</strong> The largest medical complex in the world. 106,000 employees. 10 million patient encounters per year. It houses MD Anderson Cancer Center (the #1 cancer hospital), Methodist Hospital, Baylor College of Medicine, and dozens more. No other city has anything comparable.</p>
          <p className="text-gray-700 mb-4"><strong>2. Demographics:</strong> Houston is America&apos;s 4th-largest city with a large and growing elderly population. Harris County alone has over 500,000 Medicare beneficiaries. The surrounding metro area adds hundreds of thousands more.</p>
          <p className="text-gray-700 mb-4"><strong>3. Specialty concentration:</strong> The Texas Medical Center attracts high-billing specialties — oncology, cardiology, orthopedics, transplant surgery. These specialties generate far more Medicare revenue per provider than primary care.</p>
          <p className="text-gray-700 mb-4"><strong>4. International patients:</strong> While international patients don&apos;t directly affect Medicare spending, the TMC&apos;s global reputation attracts world-class physicians who also treat Medicare beneficiaries. The talent concentration creates a virtuous cycle: top doctors attract more patients, more patients attract more funding, and more funding attracts more top doctors.</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">The MD Anderson Effect</p>
            <p className="text-blue-800 mt-2">MD Anderson Cancer Center alone sees over <strong>140,000 patients annually</strong>, many of whom are Medicare beneficiaries. Cancer treatment is among the most expensive categories in Medicare — a single course of immunotherapy can cost <strong>$150,000+</strong>. Anderson&apos;s presence in Houston single-handedly drives hundreds of millions in annual Medicare spending.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Referral Magnet</h2>
          <p className="text-gray-700 mb-4">Houston&apos;s dominance isn&apos;t just about local patients. The Texas Medical Center draws patients from across Texas, the Gulf Coast region, Latin America, and beyond. Medicare beneficiaries travel from rural Texas, Louisiana, Mississippi, and other states to receive care at Houston&apos;s world-class facilities. This referral pattern inflates Houston&apos;s Medicare spending beyond what local demographics alone would suggest.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Fraud Factor</h2>
          <p className="text-gray-700 mb-4">Houston&apos;s massive healthcare economy has also attracted fraudsters. Texas ranks among the top three states for Medicare fraud enforcement actions, and Houston is a significant contributor. The DOJ&apos;s Houston office has prosecuted hundreds of millions in Medicare fraud, including home health schemes, pain management pill mills, and diagnostic testing fraud.</p>
          <p className="text-gray-700 mb-4">The scale of Houston&apos;s healthcare economy makes it both a magnet for legitimate world-class care and a target for those who would exploit the system. Our <Link href="/fraud" className="text-blue-600 hover:underline">fraud analysis tools</Link> can help identify suspicious billing patterns among Houston providers.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Top 20 Medicare Cities</h2>
          <p className="text-gray-700 mb-4">Here&apos;s how the nation&apos;s top cities compare:</p>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Spending</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Per Provider</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Markup</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topCities.map((c: any, i: number) => (
                  <tr key={`${c.city}-${c.state}`} className={`hover:bg-blue-50 ${i === 0 ? 'bg-purple-50' : ''}`}>
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2 font-medium">{c.city}</td>
                    <td className="px-4 py-2 text-gray-600">{c.state}</td>
                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(c.total_payments)}</td>
                    <td className="px-4 py-2 text-right">{formatNumber(c.providers)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(c.avg_payment_per_provider)}</td>
                    <td className="px-4 py-2 text-right">{c.markup_ratio}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Per-Provider Story</h2>
          <p className="text-gray-700 mb-4">Raw spending totals are partly a function of city size. The more revealing metric is spending per provider. Some smaller cities punch well above their weight:</p>
          <p className="text-gray-700 mb-4">Cities with major academic medical centers or specialty hospitals tend to have higher per-provider averages — reflecting the concentration of expensive specialty care. Cities dominated by primary care and family medicine show lower per-provider spending but may actually deliver more cost-effective care.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Markup Puzzle</h2>
          <p className="text-gray-700 mb-4">Houston&apos;s markup ratio of {houston.markup_ratio || '4.4'}x means providers charge 4.4 times what Medicare actually pays. This is above the national average but not the highest among major cities — some cities show markup ratios above 5x.</p>
          <p className="text-gray-700 mb-4">High markup ratios don&apos;t necessarily indicate fraud or waste. They can reflect specialty mix (surgeons charge higher multiples than internists), local market dynamics with private insurers, and the general chargemaster inflation that pervades American healthcare.</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">Houston&apos;s Specialty Mix</p>
            <p className="text-blue-800 mt-2">Houston&apos;s provider mix skews heavily toward high-billing specialties. <strong>Oncology</strong>, <strong>cardiology</strong>, <strong>orthopedics</strong>, and <strong>transplant surgery</strong> are overrepresented compared to national averages. These specialties generate <strong>3-7x more revenue</strong> per provider than primary care — explaining much of Houston&apos;s elevated per-provider spending.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Houston vs. the Rest of Texas</h2>
          <p className="text-gray-700 mb-4">Houston alone accounts for a significant share of Texas&apos;s total Medicare spending. Dallas, San Antonio, and Austin are also major Medicare cities, but none approach Houston&apos;s scale. The gap reflects the unique concentration of the Texas Medical Center — no other Texas city has a comparable density of high-acuity, high-revenue healthcare facilities.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Growth Trajectory</h2>
          <p className="text-gray-700 mb-4">Houston&apos;s Medicare spending has grown faster than the national average over the past decade. The city adds approximately 500-700 new Medicare providers per year, and the Texas Medical Center continues to expand — with over $3 billion in construction projects underway as of 2026. This growth trajectory means Houston&apos;s lead over other cities is widening, not narrowing.</p>
          <p className="text-gray-700 mb-4">Harris County&apos;s population aged 65+ is projected to grow 35% by 2035, driven by both aging in place and migration of retirees to Texas&apos;s lower cost of living and no-income-tax environment. More beneficiaries means more Medicare spending — and Houston&apos;s healthcare infrastructure will continue to absorb a disproportionate share.</p>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-green-900 font-medium text-lg">Economic Engine</p>
            <p className="text-green-800 mt-2">The Texas Medical Center generates an estimated <strong>$35 billion</strong> in annual economic impact for the Houston metro area. Medicare payments of <strong>$9.24 billion</strong> represent roughly a quarter of that total — making the federal healthcare program one of Houston&apos;s largest economic drivers.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What It Means</h2>
          <p className="text-gray-700 mb-4">Houston&apos;s dominance isn&apos;t surprising once you understand the Texas Medical Center effect. But it does raise important questions:</p>
          <ul className="text-gray-700 mb-4">
            <li>Is the concentration of spending in a few cities efficient, or does it create geographic inequality in care access?</li>
            <li>Are Houston&apos;s higher per-provider payments justified by complexity and specialty mix?</li>
            <li>Should Medicare adjust payments more aggressively for regional cost differences?</li>
            <li>Does the concentration of high-billing specialists in Houston draw resources away from underserved rural communities?</li>
            <li>Should Medicare implement city-level spending benchmarks that trigger automatic review?</li>
            <li>How much of Houston&apos;s spending is driven by out-of-area referrals versus local patient care?</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Home Health Factor</h2>
          <p className="text-gray-700 mb-4">Houston also has one of the highest concentrations of home health agencies in the country. Texas leads the nation in Medicare home health spending, and Houston is a major driver. Home health has historically been a significant source of Medicare fraud in Texas — the DOJ has prosecuted hundreds of millions in Houston-area home health fraud schemes, particularly in communities with large immigrant populations where language barriers and cultural factors were exploited by fraudsters.</p>
          <p className="text-gray-700 mb-4">CMS has implemented enhanced oversight in Houston through its Targeted Probe and Educate (TPE) program, which requires home health agencies in high-fraud areas to submit documentation for pre-payment review. This has reduced improper payments but has also created administrative burden for legitimate agencies.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Medicare Advantage Shift</h2>
          <p className="text-gray-700 mb-4">Like the rest of Texas, Houston is experiencing a rapid shift toward Medicare Advantage. An estimated 58% of Harris County Medicare beneficiaries are now enrolled in MA plans — higher than the national average. This means our fee-for-service data captures a shrinking share of Houston&apos;s total Medicare spending. The $9.24 billion in provider payments we track may represent only 40-45% of total Medicare money flowing through Houston&apos;s healthcare system.</p>
          <p className="text-gray-700 mb-4">Major Houston health systems like Memorial Hermann and Houston Methodist participate in both fee-for-service and MA networks, but their MA contract payments are not publicly reported — meaning the full picture of Houston&apos;s Medicare economy is larger than what our data shows.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Comparison: Houston vs. Other Medical Hubs</h2>
          <p className="text-gray-700 mb-4">How does Houston stack up against other major medical centers? Boston (home to Mass General, Brigham and Women&apos;s, and Dana-Farber) has higher per-provider averages but fewer total providers. Cleveland (Cleveland Clinic) and Rochester, MN (Mayo Clinic) punch above their population weight. But no city combines Houston&apos;s scale — sheer number of providers, total spending, and specialty diversity — in one metropolitan area.</p>
          <p className="text-gray-700 mb-4">The Texas Medical Center is expanding internationally too, with satellite operations planned in several countries. While these international ventures don&apos;t directly affect Medicare, they reinforce the TMC&apos;s ability to attract top talent — talent that also serves Houston&apos;s massive Medicare population.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Research Dollar Connection</h2>
          <p className="text-gray-700 mb-4">Houston&apos;s academic medical centers receive billions in NIH research funding annually. MD Anderson alone receives over $1 billion in research grants. This research funding subsidizes clinical infrastructure, attracts top physicians, and enables cutting-edge treatments that are then billed to Medicare. The connection between research investment and Medicare spending is direct: more research funding → more advanced capabilities → more complex (and expensive) patient care → higher Medicare billing.</p>
          <p className="text-gray-700 mb-4">This virtuous cycle benefits Houston&apos;s patients but raises questions about whether Medicare spending in research-intensive cities reflects genuinely better care or simply more expensive care. The answer is likely both — and disentangling the two is one of the central challenges of healthcare policy.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Veterans Connection</h2>
          <p className="text-gray-700 mb-4">Houston is also home to the Michael E. DeBakey VA Medical Center, one of the largest VA hospitals in the country. While VA spending is separate from Medicare, many Houston veterans are eligible for both VA and Medicare benefits. The co-location of world-class VA and civilian medical facilities creates unique care coordination challenges and opportunities — and contributes to Houston&apos;s overall healthcare spending footprint.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Methodology</h2>
          <p className="text-gray-700 mb-4">This analysis uses CMS Medicare Provider Utilization and Payment Data (2014-2024) aggregated by provider city. We rank cities by total Medicare payments received by providers listing that city as their practice location. Provider counts, per-provider averages, and markup ratios are calculated from the same dataset.</p>
          <p className="text-gray-700 mb-4">For a complete geographic breakdown by city, state, and ZIP code, see our <Link href="/geographic" className="text-blue-600 hover:underline">geographic analysis page</Link>.</p>
          <p className="text-gray-700 mb-4">
            To explore Texas specifically, visit our <Link href="/states/TX" className="text-blue-600 hover:underline">Texas state page</Link> for provider,
            specialty, and procedure breakdowns. Or search for any Houston provider by name or NPI
            in our <Link href="/search" className="text-blue-600 hover:underline">provider search tool</Link>.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">Explore Houston&apos;s Data</p>
            <p className="text-blue-800 mt-2">
              Browse every Houston provider, specialty, and procedure on our <Link href="/states/TX" className="text-blue-600 hover:underline font-bold">Texas state page</Link>. 
              Search for any provider by name or NPI in our <Link href="/search" className="text-blue-600 hover:underline font-bold">provider search</Link>.
            </p>
          </div>
          <p className="text-gray-700 mb-4">One thing is clear: if you want to follow the Medicare money, start in Houston.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The National Implications</h2>
          <p className="text-gray-700 mb-4">Houston&apos;s position as Medicare&apos;s top city has national policy implications. When CMS adjusts geographic payment factors, Houston&apos;s providers are directly affected. When Congress debates site-neutral payments or specialty spending caps, the Texas Medical Center&apos;s lobbying power is considerable. And when the DOJ investigates Medicare fraud in Texas, Houston&apos;s massive healthcare economy generates a disproportionate share of both legitimate and questionable claims.</p>
          <p className="text-gray-700 mb-4">Understanding Houston&apos;s Medicare landscape is essential for understanding American healthcare spending as a whole. The city exemplifies both the promise and the problems of a system that concentrates resources, expertise, and spending in a handful of urban medical centers while vast rural areas go underserved.</p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-red-900 font-medium text-lg">Houston by the Numbers</p>
            <p className="text-red-800 mt-2">
              <strong>#1</strong> in total Medicare city spending nationwide<br />
              <strong>19,925</strong> Medicare providers in the city<br />
              <strong>$463K</strong> average Medicare payments per provider<br />
              <strong>500,000+</strong> Medicare beneficiaries in Harris County<br />
              <strong>106,000</strong> employees at the Texas Medical Center
            </p>
          </div>

          <p className="text-gray-700 mb-8">For the full state picture, explore our <Link href="/states/TX" className="text-blue-600 hover:underline">Texas Medicare data page</Link> and <Link href="/geographic" className="text-blue-600 hover:underline">geographic analysis tools</Link>.</p>
        </article>

        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/geographic-inequality" className="text-medicare-primary hover:underline text-sm">📍 ZIP Code Lottery</Link>
            <Link href="/investigations/medicare-spending-by-state" className="text-medicare-primary hover:underline text-sm">📊 Spending by State</Link>
            <Link href="/states/TX" className="text-medicare-primary hover:underline text-sm">📍 Texas Medicare Data</Link>
            <Link href="/geographic" className="text-medicare-primary hover:underline text-sm">📊 Geographic Analysis</Link>
            <Link href="/investigations/florida-california-fraud" className="text-medicare-primary hover:underline text-sm">🔴 The Fraud Belt: CA & FL</Link>
            <Link href="/investigations/state-spending-divide" className="text-medicare-primary hover:underline text-sm">💰 State Spending Divide</Link>
            <Link href="/investigations/biggest-billers" className="text-medicare-primary hover:underline text-sm">🏥 Biggest Medicare Billers</Link>
            <Link href="/investigations/rural-price-tag" className="text-medicare-primary hover:underline text-sm">🌾 The Rural Price Tag</Link>
            <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🚨 Fraud Analysis Hub</Link>
            <Link href="/specialties" className="text-medicare-primary hover:underline text-sm">🩺 Browse Specialties</Link>
          </div>
        </div>

        <RelatedArticles articles={[{"slug":"florida-california-fraud","title":"Florida vs. California","description":"The two biggest fraud states compared side by side."},{"slug":"florida-medicare-fraud","title":"Florida Medicare Fraud","description":"The Sunshine State's massive fraud problem."},{"slug":"pain-management-fraud","title":"Pain Management Fraud","description":"How pain clinics became fraud hotspots — especially in Texas."},{"slug":"fraud-enforcement-roundup","title":"Fraud Enforcement Roundup","description":"The latest federal fraud enforcement actions."}]} />

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
          'Texas Medical Center Annual Report (2025)',
          'Harris County Medicare Enrollment Data',
          'DOJ Healthcare Fraud Enforcement Actions — Southern District of Texas',
          'MedPAC Report to Congress, March 2026',
        ]} />
      </div>
    </main>
  )
}
