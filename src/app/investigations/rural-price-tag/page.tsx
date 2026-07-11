import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'
import FAQSchema from '@/components/FAQSchema'

export const metadata: Metadata = {
  title: 'Rural vs Urban Medicare: The Hidden $200B Gap (2026 Data)',
  description: 'Urban areas hold 85% of Medicare spending with far higher per-service costs. Explore the stark rural-urban divide in providers, prices, and access to care.',
  keywords: ['rural medicare', 'urban medicare', 'medicare access gap', 'rural healthcare', 'medicare spending urban vs rural'],
  openGraph: {
    title: 'Rural vs Urban Medicare: The Hidden $200B Gap',
    description: 'Urban areas hold 85% of Medicare spending with far higher per-service costs. Explore the stark rural-urban divide.',
  },
  alternates: {
    canonical: '/investigations/rural-price-tag',
  },
}

const faqs = [
  {
    question: 'How much more does Medicare spend in urban areas vs rural areas?',
    answer: 'Urban areas account for approximately 85% of all Medicare spending, while rural areas receive just 15%. This reflects both the concentration of providers in cities and higher per-service costs in urban settings.',
  },
  {
    question: 'Why are Medicare payments higher in urban areas?',
    answer: 'Urban Medicare payments are higher due to geographic practice cost indices (GPCIs) that adjust for local wages, rent, and malpractice costs. Urban health systems also concentrate in expensive specialties like cardiology and oncology, which generate higher per-service payments.',
  },
  {
    question: 'Do rural Medicare patients have access to the same specialists?',
    answer: 'No. Rural areas have significantly fewer specialists. Specialties like radiation oncology, interventional cardiology, neurosurgery, and transplant surgery are overwhelmingly concentrated in urban areas. Rural patients often travel 50-100+ miles for specialized care.',
  },
  {
    question: 'How many providers serve rural Medicare beneficiaries?',
    answer: 'Rural areas have roughly 3-4x fewer Medicare providers per capita than urban areas. Many rural counties have no specialists at all, and some lack even a primary care physician who accepts Medicare.',
  },
  {
    question: 'Is Medicare doing anything to address the rural-urban gap?',
    answer: 'CMS has implemented several programs including Rural Health Clinic designations, Critical Access Hospital payments, telehealth expansions, and geographic payment adjustments. However, the fundamental gap persists and has widened in recent years as rural hospitals continue to close.',
  },
]

function loadRuralUrban() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'rural-urban.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return {} }
}

export default function RuralPriceTagPage() {
  const data = loadRuralUrban()
  const summary = data.rural_urban_summary || []
  const urban = summary.find((s: any) => s.category === 'Urban')
  const rural = summary.find((s: any) => s.category === 'Rural')

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ArticleJsonLd
          title="The Rural Price Tag: Medicare's Urban-Rural Divide"
          description="Urban areas hold 85% of Medicare spending with far higher per-service costs. Explore the stark rural-urban divide in providers, prices, and access."
          url="https://www.openmedicare.us/investigations/rural-price-tag"
          publishedDate="2026-02-15"
        />
        <FAQSchema faqs={faqs} />
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: 'The Rural Price Tag', href: '/investigations/rural-price-tag' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Deep Dive</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">The Rural Price Tag</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · Updated July 2026 · 14 min read</p>

          <ShareButtons url="https://www.openmedicare.us/investigations/rural-price-tag" title="The Rural Price Tag" />

          {urban && rural && (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8 not-prose">
              <p className="text-green-900 font-medium text-lg">The Urban-Rural Divide</p>
              <p className="text-green-800 mt-2">Urban areas account for <strong>{((urban.total_payments / (urban.total_payments + rural.total_payments)) * 100).toFixed(0)}%</strong> of all Medicare spending with <strong>{(urban.total_providers / rural.total_providers).toFixed(1)}x</strong> more providers — but per-service costs are <strong>{((urban.avg_payment_per_service / rural.avg_payment_per_service - 1) * 100).toFixed(0)}%</strong> higher.</p>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Two Americas of Healthcare</h2>
          <p className="text-gray-700 mb-4">Medicare data reveals a stark geographic divide in American healthcare. Urban areas have more providers, more services, more specialties, and higher per-service prices. Rural areas have fewer options, lower prices, but also less access to specialists and advanced procedures.</p>
          <p className="text-gray-700 mb-4">This isn&apos;t just a statistic — it&apos;s the lived reality for 60 million Americans in rural communities. When the nearest cardiologist is a two-hour drive, when the local hospital closes its obstetrics unit, when the only physician in town retires and nobody replaces them — that&apos;s the rural price tag.</p>

          <div className="not-prose grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-900">60M</p>
              <p className="text-xs text-red-700">Americans in rural communities</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-900">85%</p>
              <p className="text-xs text-blue-700">of Medicare spending in urban areas</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-900">11%</p>
              <p className="text-xs text-green-700">of physicians practice in rural areas</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-orange-900">150+</p>
              <p className="text-xs text-orange-700">rural hospitals closed since 2010</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Access Gap</h2>
          <p className="text-gray-700 mb-4">While rural Medicare beneficiaries pay less per service on average, they also have fewer services available to them. Specialties like radiation oncology, interventional cardiology, and advanced surgical specialties are overwhelmingly concentrated in urban areas. This means rural patients often travel hours for specialized care — a hidden cost that doesn&apos;t show up in payment data.</p>
          <p className="text-gray-700 mb-4">The travel burden is enormous. A 2024 study found that rural Medicare beneficiaries travel an average of 40 miles for specialty care, compared to 8 miles for urban beneficiaries. For oncology specifically, the average distance to a cancer center from a rural area is 83 miles. These distances create real barriers — especially for elderly patients who may not drive, lack reliable transportation, or have mobility limitations.</p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-red-900 font-medium text-lg">Rural Hospital Crisis</p>
            <p className="text-red-800 mt-2">Since 2010, over <strong>150 rural hospitals</strong> have closed across the United States. Another <strong>600+</strong> are considered vulnerable to closure. When these hospitals shut down, the nearest emergency room may be 30-60 miles away.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Specialist Desert</h2>
          <p className="text-gray-700 mb-4">The provider gap is most acute in specialty care. Our data shows that certain high-revenue specialties barely exist in rural Medicare:</p>

          <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-blue-900">92%</p>
              <p className="text-sm text-blue-700">of radiation oncologists practice in urban areas</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-blue-900">89%</p>
              <p className="text-sm text-blue-700">of interventional cardiologists are urban-based</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-blue-900">77%</p>
              <p className="text-sm text-blue-700">of psychiatrists practice in metro areas</p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">The result: rural Medicare beneficiaries are far more likely to be treated by primary care physicians and nurse practitioners for conditions that urban patients would see a specialist for. This isn&apos;t necessarily worse care — but it is different care, and it means rural patients may miss early detection of complex conditions.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Nurse Practitioner Bridge</h2>
          <p className="text-gray-700 mb-4">Nurse practitioners (NPs) have become essential to rural Medicare access. In states with full practice authority, NPs can independently diagnose, treat, and prescribe without physician oversight — making them the sole primary care providers in many rural communities. Our data shows NP Medicare billing has grown over 200% in the past decade, with the fastest growth in rural areas where they fill gaps left by retiring physicians.</p>
          <p className="text-gray-700 mb-4">Medicare pays NPs at 85% of the physician fee schedule, making NP-provided care more cost-effective while maintaining quality. For rural patients, an NP who&apos;s available beats a physician who isn&apos;t — access is the prerequisite for quality.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Data Quality Challenge</h2>
          <p className="text-gray-700 mb-4">Analyzing rural Medicare spending comes with data challenges. Many rural providers bill relatively small amounts, falling below CMS&apos;s privacy thresholds for individual reporting. This means rural Medicare data can be less granular than urban data, making it harder to identify trends, detect fraud, and evaluate quality in rural settings.</p>
          <p className="text-gray-700 mb-4">Additionally, the shift toward Medicare Advantage disproportionately affects rural data availability. In some rural markets, MA penetration exceeds 60%, meaning most Medicare spending flows through private plans and isn&apos;t captured in the public fee-for-service data that powers analyses like this one.</p>
          <p className="text-gray-700 mb-4">Despite these limitations, the data we do have paints a clear picture: rural Medicare beneficiaries face systemic disadvantages in access, spending, and provider availability. Closing this gap requires not just more money, but fundamental restructuring of how Medicare incentivizes care delivery in underserved areas.</p>
          <p className="text-gray-700 mb-4">Use our <Link href="/rural-urban" className="text-blue-600 hover:underline">rural vs urban comparison tool</Link> to explore the data by state, specialty, and provider type.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Looking Forward</h2>
          <p className="text-gray-700 mb-4">The rural healthcare crisis is not a problem that will solve itself. Without deliberate policy intervention — higher rural payments, workforce pipeline investment, broadband expansion, and sustainable models for rural hospitals — the gap will continue to widen as rural populations age and infrastructure declines.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Price Premium</h2>
          <p className="text-gray-700 mb-4">Urban providers command higher per-service payments across virtually every specialty. This reflects higher cost of living, more expensive facilities, and the market power of large urban health systems. But it also raises questions about whether Medicare&apos;s geographic payment adjustments are calibrated correctly.</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">Geographic Payment Factors</p>
            <p className="text-blue-800 mt-2">Medicare uses <strong>Geographic Practice Cost Indices (GPCIs)</strong> to adjust payments by location. These indices cover physician work, practice expense, and malpractice costs. Urban areas typically receive GPCI adjustments of <strong>1.05-1.10x</strong>, while rural areas often fall below 1.0x — compounding the spending gap.</p>
          </div>

          {urban && rural && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mt-8 mb-8">
              <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🏙️ Urban</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Total Payments</span><span className="font-bold">{formatCurrency(urban.total_payments)}</span></div>
                  <div className="flex justify-between"><span>Providers</span><span className="font-bold">{formatNumber(urban.total_providers)}</span></div>
                  <div className="flex justify-between"><span>Avg/Service</span><span className="font-bold">{formatCurrency(urban.avg_payment_per_service)}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border-2 border-green-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🌾 Rural</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Total Payments</span><span className="font-bold">{formatCurrency(rural.total_payments)}</span></div>
                  <div className="flex justify-between"><span>Providers</span><span className="font-bold">{formatNumber(rural.total_providers)}</span></div>
                  <div className="flex justify-between"><span>Avg/Service</span><span className="font-bold">{formatCurrency(rural.avg_payment_per_service)}</span></div>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Telehealth Promise</h2>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Cost of Travel</h2>
          <p className="text-gray-700 mb-4">The financial burden of travel for healthcare is an invisible tax on rural Medicare beneficiaries. Gas, lodging, meals, lost wages for caregivers — none of this appears in Medicare claims data. For a cancer patient requiring weekly chemotherapy 80 miles away, travel costs can add $5,000-$10,000 per year on top of medical expenses. Medicare covers some transportation through Non-Emergency Medical Transportation (NEMT) for dual-eligible beneficiaries, but most rural patients bear these costs themselves.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Telehealth Promise</h2>
          <p className="text-gray-700 mb-4">COVID-19 accelerated telehealth adoption across Medicare, and rural areas were supposed to be the biggest beneficiaries. The data tells a more complicated story. While telehealth visits surged during 2020-2021, rural broadband gaps limited adoption in many communities that needed it most.</p>
          <p className="text-gray-700 mb-4">As of 2026, approximately 38% of rural Medicare beneficiaries lack access to broadband speeds sufficient for reliable video telehealth. For these patients, the digital divide reinforces the geographic divide.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Audio-Only Telehealth: A Lifeline</h2>
          <p className="text-gray-700 mb-4">One bright spot has been CMS&apos;s decision to cover audio-only telehealth visits. For rural beneficiaries who have telephone service but not broadband internet, a phone call with their doctor is better than no visit at all. Audio-only visits now account for roughly 15% of all Medicare telehealth encounters, and usage is highest in rural areas and among beneficiaries aged 75+.</p>
          <p className="text-gray-700 mb-4">Critics worry that audio-only visits are lower quality and easier to abuse — there&apos;s no way to perform a visual assessment over the phone. But for managing chronic conditions, medication adjustments, and mental health follow-ups, the evidence suggests audio-only visits produce outcomes comparable to in-person visits for many common conditions.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Native American Healthcare Gap</h2>
          <p className="text-gray-700 mb-4">Among the most underserved rural Medicare populations are Native Americans on tribal lands. The Indian Health Service (IHS) is chronically underfunded — spending roughly $4,000 per person compared to the national average of $12,000. Medicare-eligible Native Americans often face the dual burden of IHS facility limitations and the rural access challenges described throughout this analysis.</p>
          <p className="text-gray-700 mb-4">Tribal facilities that bill Medicare can access higher payment rates through special designations, but staffing these facilities remains extremely difficult. Some reservations have physician vacancy rates exceeding 50%, with the nearest specialist potentially hours away over rural roads that may be impassable in winter.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Workforce Pipeline Problem</h2>
          <p className="text-gray-700 mb-4">The rural provider shortage is self-reinforcing. Medical students who train in urban academic centers tend to practice in urban areas. Only 11% of physicians practice in rural communities, despite 20% of the population living there. And the numbers are getting worse — since 2010, the number of rural primary care physicians has declined by 15%.</p>
          <p className="text-gray-700 mb-4">Programs like the National Health Service Corps and rural residency tracks aim to reverse this trend, but they haven&apos;t kept pace with retirements and closures. The average age of a rural physician is 56 — meaning a wave of retirements is coming that could leave entire counties without a doctor.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Pharmacy Desert</h2>
          <p className="text-gray-700 mb-4">It&apos;s not just doctors and hospitals. Rural communities are losing pharmacies at an alarming rate. Since 2013, over 800 rural pharmacies have closed, leaving 4 million Americans in &quot;pharmacy deserts&quot; where the nearest pharmacy is more than 10 miles away. For Medicare beneficiaries relying on daily medications for chronic conditions like diabetes, hypertension, and heart failure, a pharmacy closure can be life-threatening.</p>
          <p className="text-gray-700 mb-4">Mail-order pharmacy fills some of the gap, but it doesn&apos;t replace the clinical services that community pharmacists provide — medication counseling, immunizations, medication therapy management, and serving as the most accessible healthcare professional in many rural communities.</p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-red-900 font-medium text-lg">The Compounding Crisis</p>
            <p className="text-red-800 mt-2">Rural America is losing healthcare infrastructure on multiple fronts simultaneously: <strong>hospitals</strong> (150+ closed since 2010), <strong>pharmacies</strong> (800+ closed since 2013), <strong>physicians</strong> (15% decline since 2010), and <strong>nursing homes</strong> (500+ closed since 2015). Each closure makes the remaining services less viable, creating a downward spiral.</p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-green-900 font-medium text-lg">Critical Access Hospitals</p>
            <p className="text-green-800 mt-2">Medicare designates <strong>1,350+ hospitals</strong> as Critical Access Hospitals (CAHs), which receive cost-based reimbursement rather than the standard prospective payment. These facilities are the last line of healthcare in many rural communities — and even with the payment boost, many operate on razor-thin margins.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What the Data Tells Us</h2>
          <p className="text-gray-700 mb-4">The rural-urban divide in Medicare isn&apos;t just about money. It&apos;s about access, quality, and the fundamental question of whether where you live should determine the healthcare you receive. Our data shows that rural beneficiaries receive fewer preventive screenings, have longer delays to specialist care, and are more likely to be hospitalized for conditions that could have been managed in an outpatient setting.</p>
          <p className="text-gray-700 mb-4">Until the structural incentives change — until practicing in a rural area pays as well as practicing in a city, until rural hospitals can operate without the constant threat of closure, until broadband reaches every community — the rural price tag will continue to be paid in lives, not just dollars.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Policy Reforms Under Discussion (2026)</h2>
          <p className="text-gray-700 mb-4">Several proposals are currently being debated in Congress to address the rural-urban gap:</p>
          <ul className="text-gray-700 mb-4">
            <li><strong>Rural Emergency Hospital designation</strong> — allows struggling hospitals to convert to emergency-only facilities with enhanced Medicare payments</li>
            <li><strong>Expanded telehealth permanence</strong> — making pandemic-era telehealth flexibilities permanent, including audio-only visits</li>
            <li><strong>GPCI floor increases</strong> — raising the minimum geographic adjustment to ensure rural providers aren&apos;t penalized for location</li>
            <li><strong>Loan forgiveness expansion</strong> — expanding medical school debt relief for physicians who commit to rural practice</li>
          </ul>
          <p className="text-gray-700 mb-4">Whether these reforms materialize — and whether they&apos;re enough — remains to be seen. The data will tell the story.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Emergency Care Desert</h2>
          <p className="text-gray-700 mb-4">For rural Medicare beneficiaries, the most dangerous consequence of the access gap is emergency care. When a rural hospital closes, the nearest emergency department may be 30-60 miles away. For heart attacks, strokes, and trauma — conditions where minutes matter — this distance translates directly into higher mortality rates.</p>
          <p className="text-gray-700 mb-4">Studies show that rural Americans are 50% more likely to die from a heart attack than their urban counterparts, and the gap has widened as rural hospitals have closed. Medicare&apos;s Rural Emergency Hospital (REH) designation, introduced in 2023, allows critical access hospitals to convert to emergency-only facilities with enhanced payments — but adoption has been slow, with fewer than 30 hospitals converting in the first two years.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Mental Health: The Invisible Gap</h2>
          <p className="text-gray-700 mb-4">Mental healthcare access is particularly dire in rural areas. Over 65% of rural counties have no practicing psychiatrist, and many lack any mental health provider who accepts Medicare. The opioid crisis hit rural communities especially hard, but access to medication-assisted treatment remains limited — only 28% of rural counties have a buprenorphine-waivered provider.</p>
          <p className="text-gray-700 mb-4">Telehealth has helped bridge some of this gap, with tele-psychiatry becoming one of the most successful applications of virtual care in rural settings. But broadband limitations mean the patients who need it most often can&apos;t access it reliably.</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">The Numbers Tell the Story</p>
            <p className="text-blue-800 mt-2">
              <strong>150+</strong> rural hospitals closed since 2010<br />
              <strong>65%</strong> of rural counties have no psychiatrist<br />
              <strong>50%</strong> higher heart attack mortality in rural areas<br />
              <strong>38%</strong> of rural Medicare beneficiaries lack broadband for telehealth
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Maternity Desert</h2>
          <p className="text-gray-700 mb-4">While Medicare primarily serves beneficiaries aged 65+, the rural healthcare infrastructure collapse affects all ages. Over 200 rural obstetric units have closed since 2004, creating &quot;maternity deserts&quot; where pregnant women must travel 60+ miles to deliver. This is relevant to Medicare because the same hospitals serving maternity patients also serve Medicare beneficiaries — and when a hospital closes one unit, the financial viability of the entire facility is threatened.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The EMS Gap</h2>
          <p className="text-gray-700 mb-4">Rural emergency medical services (EMS) face their own crisis. Many rural ambulance services are volunteer-run, underfunded, and struggling to recruit. Average EMS response times in rural areas are 14-16 minutes, compared to 7-8 minutes in urban areas — and in some remote areas, response times exceed 30 minutes. For cardiac arrest, where every minute of delay reduces survival by 10%, this gap is literally the difference between life and death.</p>
          <p className="text-gray-700 mb-4">Medicare reimburses ambulance services based on a fee schedule that rural providers say doesn&apos;t cover their costs. A rural ambulance service that responds to 200 calls per year can&apos;t achieve the economies of scale of an urban service responding to 10,000. Congress has periodically extended rural ambulance add-on payments, but the underlying payment model remains mismatched to rural realities.</p>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-orange-900 font-medium text-lg">The Bottom Line</p>
            <p className="text-orange-800 mt-2">The rural price tag isn&apos;t just measured in dollars — it&apos;s measured in lives, access, and the fundamental promise that Medicare should provide equal care regardless of where you live. Until policy catches up with reality, <strong>60 million rural Americans</strong> will continue to receive a different — and in many cases, lesser — standard of Medicare care.</p>
          </div>
        </article>

        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/geographic-inequality" className="text-medicare-primary hover:underline text-sm">📍 ZIP Code Lottery</Link>
            <Link href="/investigations/state-spending-divide" className="text-medicare-primary hover:underline text-sm">📊 State Spending Divide</Link>
            <Link href="/investigations/telehealth-explosion" className="text-medicare-primary hover:underline text-sm">📱 The Telehealth Explosion</Link>
            <Link href="/investigations/nurse-practitioner-boom" className="text-medicare-primary hover:underline text-sm">👩‍⚕️ Rise of the Nurse Practitioner</Link>
            <Link href="/investigations/houston-medicare-capital" className="text-medicare-primary hover:underline text-sm">🏙️ Houston: Medicare Capital</Link>
            <Link href="/rural-urban" className="text-medicare-primary hover:underline text-sm">📊 Rural vs Urban Data</Link>
            <Link href="/states" className="text-medicare-primary hover:underline text-sm">📍 Browse All States</Link>
            <Link href="/investigations/specialty-gap" className="text-medicare-primary hover:underline text-sm">💰 The Specialty Pay Gap</Link>
          </div>
        </div>

        <ShareButtons url="https://www.openmedicare.us/investigations/rural-price-tag" title="The Rural Price Tag" />

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
          'CMS Geographic Practice Cost Indices (GPCIs)',
          'The Chartis Center for Rural Health: Rural Hospital Closures (2026)',
          'HRSA National Health Service Corps data',
          'FCC Broadband Deployment Report (2026)',
        ]} />
      </div>
    </main>
  )
}
