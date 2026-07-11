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
  title: 'Top 30 Drugs Draining Medicare: $94B Exposed (2026)',
  description: 'Medicare drug spending surged from 11% to 15% of total payments. See the 30 costliest drugs — led by a $20B eye injection — and where the money goes.',
  keywords: ['medicare drug spending', 'most expensive medicare drugs', 'medicare part b drugs', 'aflibercept medicare', 'drug pipeline medicare'],
  openGraph: {
    title: 'Top 30 Drugs Draining Medicare: $94B Exposed',
    description: 'Medicare drug spending surged from 11% to 15% of total payments. See the 30 costliest drugs.',
  },
  alternates: {
    canonical: '/investigations/drug-pipeline',
  },
}

const faqs = [
  {
    question: 'What is the most expensive drug in Medicare?',
    answer: 'Aflibercept (brand name Eylea), used to treat macular degeneration and diabetic eye disease, is the single most expensive drug in Medicare Part B, generating nearly $20 billion in payments over the past decade. It is administered as an eye injection, typically every 4-8 weeks.',
  },
  {
    question: 'How much does Medicare spend on drugs each year?',
    answer: 'Medicare Part B drug spending has grown from approximately 11% of total Medicare payments to over 15% in recent years, reaching roughly $50 billion annually. When Part D (pharmacy benefit) is included, total Medicare drug spending exceeds $200 billion per year.',
  },
  {
    question: 'What is the Inflation Reduction Act doing about Medicare drug prices?',
    answer: 'The Inflation Reduction Act of 2022 allows Medicare to negotiate prices on a limited number of high-spend drugs. The first 10 drugs were selected in 2023, with negotiated prices taking effect in 2026. By 2029, Medicare will negotiate prices for up to 20 drugs per year. However, this still covers a small fraction of total drug spending.',
  },
  {
    question: 'Why are specialty drugs so expensive in Medicare?',
    answer: 'Specialty drugs — biologics, immunotherapies, and gene therapies — are expensive because they are complex to manufacture, often have limited competition, and treat serious conditions where patients have few alternatives. Medicare Part B pays for physician-administered drugs at Average Sales Price (ASP) plus 6%, which creates limited incentive for price negotiation.',
  },
  {
    question: 'What are the top cancer drugs in Medicare by spending?',
    answer: 'The top cancer drugs in Medicare include pembrolizumab (Keytruda) for immunotherapy, rituximab for lymphoma, and various chemotherapy agents. Oncology drugs collectively account for over $15 billion in annual Medicare Part B spending, making cancer treatment one of the largest drug spending categories.',
  },
]

function loadDrugs() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'drug-spending.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return {} }
}

export default function DrugPipelinePage() {
  const data = loadDrugs()
  const drugs = (data.top_drugs || []).slice(0, 30)
  const stats = data.overall_statistics || {}

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ArticleJsonLd
          title="The Medicare Drug Pipeline: $94B in Drug Spending Exposed"
          description="Medicare drug spending surged from 11% to 15% of total payments. See the 30 costliest drugs and where the money goes."
          url="https://www.openmedicare.us/investigations/drug-pipeline"
          publishedDate="2026-02-15"
        />
        <FAQSchema faqs={faqs} />
        <Breadcrumbs items={[{ name: 'Investigations', href: '/investigations' }, { name: 'The Drug Pipeline', href: '/investigations/drug-pipeline' }]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Investigation</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">The Medicare Drug Pipeline</h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · Updated July 2026 · 18 min read</p>

          <ShareButtons url="https://www.openmedicare.us/investigations/drug-pipeline" title="The Medicare Drug Pipeline" />

          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-purple-900 font-medium text-lg">Growing Fast</p>
            <p className="text-purple-800 mt-2">Drug spending&apos;s share of Medicare grew from <strong>{(stats.overall_drug_share || 11).toFixed(1)}%</strong> overall to <strong>{(stats.latest_year_drug_share || 14.8).toFixed(1)}%</strong> in {stats.latest_year || 2023} — totaling <strong>{formatCurrency(stats.total_drug_payments_all_years || 0)}</strong> over the decade.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Specialty Drug Revolution</h2>
          <p className="text-gray-700 mb-4">Medicare drug spending is being driven by a handful of extraordinarily expensive specialty drugs. Aflibercept (Eylea), used for macular degeneration, is the single most expensive drug in Medicare — generating nearly $20 billion in payments over the decade. Cancer drugs, immunotherapies, and biologic agents make up the rest of the top tier.</p>
          <p className="text-gray-700 mb-4">The shift toward specialty drugs represents a fundamental transformation of Medicare spending. A decade ago, the most common Medicare drugs were generic statins, blood pressure medications, and diabetes pills. Today, the top drugs by spending are biologics and specialty injectables that cost thousands of dollars per dose.</p>
          <p className="text-gray-700 mb-4">This transformation reflects both scientific progress and economic reality. Biologics are extraordinarily effective — immunotherapies have turned some cancers from death sentences into manageable chronic conditions, and anti-VEGF agents have prevented millions of cases of blindness. But their prices are set in a market with limited competition, patent protections that last decades, and a payment system that provides little incentive for cost-consciousness.</p>

          <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-red-50 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-red-900">$20B+</p>
              <p className="text-sm text-red-700">spent on Aflibercept (Eylea) over 10 years</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-purple-900">{(stats.latest_year_drug_share || 14.8).toFixed(0)}%</p>
              <p className="text-sm text-purple-700">of Medicare spending goes to drugs</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-5 text-center">
              <p className="text-3xl font-bold text-blue-900">30</p>
              <p className="text-sm text-blue-700">drugs account for majority of Part B drug spend</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Eye Care Phenomenon</h2>
          <p className="text-gray-700 mb-4">Ophthalmology drugs dominate Medicare Part B spending in a way that surprises most people. Aflibercept (Eylea), ranibizumab (Lucentis), and other anti-VEGF agents used for wet macular degeneration collectively account for over $30 billion in Medicare payments over our 10-year dataset.</p>
          <p className="text-gray-700 mb-4">These drugs are administered as intravitreal injections — literally injected into the eye — every 4-8 weeks. Each injection costs Medicare $1,800-$2,200. A single patient may receive 20-30 injections over the course of treatment. With millions of aging baby boomers developing age-related macular degeneration, this spending category is projected to continue growing.</p>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-green-900 font-medium text-lg">The Eylea Story</p>
            <p className="text-green-800 mt-2">
              <strong>$20B+</strong> in total Medicare payments over 10 years<br />
              <strong>$1,850</strong> average cost per injection<br />
              <strong>6-12</strong> injections per patient per year<br />
              <strong>4M+</strong> Americans with wet macular degeneration<br />
              A biosimilar launched in 2024, but adoption has been slow — less than <strong>15%</strong> market share in the first year
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Oncology Pipeline</h2>
          <p className="text-gray-700 mb-4">Cancer treatment is the second-largest driver of Medicare drug spending. Immunotherapy drugs like pembrolizumab (Keytruda) and nivolumab (Opdivo) have revolutionized cancer care — but at extraordinary cost. A year of Keytruda treatment can exceed $150,000, and these drugs are increasingly used in combination therapies and earlier-stage cancers, expanding the total spending.</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">The Biosimilar Gap</p>
            <p className="text-blue-800 mt-2">Biosimilars — lower-cost versions of biologic drugs — have been slow to gain traction in Medicare. While generic drugs capture <strong>90%+</strong> of the market for small-molecule drugs, biosimilars hold less than <strong>30%</strong> market share for their reference biologics. Higher adoption could save Medicare <strong>$5-10 billion annually</strong>.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why It Matters</h2>
          <p className="text-gray-700 mb-4">As drug costs grow faster than overall Medicare spending, they consume an ever-larger share of the program&apos;s budget. The Inflation Reduction Act&apos;s drug price negotiation provisions were designed to address this — but they only apply to a small number of drugs initially. The broader trend of specialty drug dominance shows no signs of slowing.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The IRA&apos;s Impact: Early Results</h2>
          <p className="text-gray-700 mb-4">The Inflation Reduction Act&apos;s Medicare drug negotiation provisions took effect in 2026, with the first 10 negotiated prices now in place. Early data suggests savings of 20-60% on the targeted drugs — representing estimated savings of $6 billion in the first year alone. However, critics point out that these 10 drugs represent a fraction of total Medicare drug spending, and pharmaceutical companies have filed legal challenges that could limit the program&apos;s scope.</p>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-green-900 font-medium text-lg">IRA Drug Negotiation: First Results</p>
            <p className="text-green-800 mt-2">
              <strong>10 drugs</strong> negotiated in first round (2026 prices)<br />
              <strong>20-60%</strong> estimated price reductions on targeted drugs<br />
              <strong>15 more drugs</strong> selected for 2027 negotiations<br />
              <strong>$2,000</strong> annual Part D out-of-pocket cap (effective 2025)<br />
              <strong>No cap</strong> on Part B drug coinsurance (the drugs on this list)
            </p>
          </div>
          <p className="text-gray-700 mb-4">The second round of 15 drugs was selected in early 2026, with negotiated prices to take effect in 2027. Notable inclusions: several high-cost cancer immunotherapies and diabetes treatments.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The 340B Controversy</h2>
          <p className="text-gray-700 mb-4">The 340B Drug Pricing Program allows certain hospitals and clinics to purchase drugs at deeply discounted prices (typically 25-50% off) while billing Medicare at the standard ASP+6% rate. This spread generates significant revenue for 340B-eligible entities — but critics argue the savings often aren&apos;t passed on to patients. The program has grown from $12 billion in discounted purchases in 2015 to over $44 billion in 2023, with ongoing debate about whether it achieves its original goal of supporting safety-net providers.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The ASP+6% Problem</h2>
          <p className="text-gray-700 mb-4">Medicare Part B pays for physician-administered drugs at Average Sales Price (ASP) plus 6%. This payment methodology creates a perverse incentive: physicians who administer more expensive drugs earn a higher margin. A $10,000 drug generates $600 in physician revenue, while a biosimilar priced at $6,000 generates only $360. This &quot;spread pricing&quot; has been widely criticized by health economists as a barrier to biosimilar adoption and cost-effective prescribing.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Weight-Loss Drug Question</h2>
          <p className="text-gray-700 mb-4">GLP-1 receptor agonists like semaglutide (Ozempic/Wegovy) and tirzepatide (Mounjaro/Zepbound) represent the next potential budget-buster for Medicare. While currently Medicare is prohibited from covering weight-loss drugs, the Treat and Reduce Obesity Act — reintroduced in 2025 — would change that. If passed, CMS estimates coverage could cost $35-50 billion annually, given that 42% of Medicare beneficiaries are obese.</p>
          <p className="text-gray-700 mb-4">Even without obesity coverage, Medicare already pays for these drugs when prescribed for diabetes (their FDA-approved indication). Semaglutide spending in Medicare Part D has grown 400% since 2020, making it one of the fastest-growing drug categories in the program.</p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-red-900 font-medium text-lg">The $100,000 Drug</p>
            <p className="text-red-800 mt-2">Cancer immunotherapy drugs like pembrolizumab (Keytruda) can cost <strong>$150,000+</strong> per year of treatment. As these drugs are approved for more cancer types and earlier-stage disease, the total Medicare spending on immunotherapy is projected to exceed <strong>$25 billion annually</strong> by 2028.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Part B vs Part D: Where the Money Flows</h2>
          <p className="text-gray-700 mb-4">Medicare drug spending splits across two programs: Part B covers drugs administered in physician offices and outpatient settings (injections, infusions, chemotherapy), while Part D covers self-administered drugs (pills, inhalers, insulin pens). The top 30 drugs below are Part B — physician-administered drugs that generate the highest per-unit payments.</p>
          <p className="text-gray-700 mb-4">Part B drug spending is more concentrated than Part D: fewer drugs, but each generating massive total payments. Part D spending is spread across thousands of drugs but is growing faster overall, driven by specialty pharmacy and the GLP-1 surge.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The White Bagging Controversy</h2>
          <p className="text-gray-700 mb-4">&quot;White bagging&quot; is a growing practice where health plans require physicians to use specialty pharmacy-dispensed drugs rather than purchasing drugs through traditional buy-and-bill channels. This shifts the supply chain — and the associated margin — from physician practices to pharmacy benefit managers. Physicians argue white bagging creates safety concerns (drug handling, temperature control) and reduces their revenue, while payers say it reduces costs through better price negotiation.</p>
          <p className="text-gray-700 mb-4">Several states have passed anti-white-bagging legislation, and the debate has implications for Medicare Part B drug spending: if white bagging becomes standard, it could change how ASP is calculated and how physicians are compensated for drug administration.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Analysis</h2>
          <p className="text-gray-700 mb-4">OpenMedicare tracks every Part B drug code in CMS&apos;s dataset — over 500 unique drug codes billed by hundreds of thousands of providers. Our drug spending analysis aggregates 10 years of data to show which drugs cost the most, which providers bill the most drug codes, and how drug spending has shifted over time.</p>
          <p className="text-gray-700 mb-4">Explore the full dataset on our <Link href="/drug-spending" className="text-blue-600 hover:underline">drug spending dashboard</Link>, or search for any specific drug by HCPCS code to see which providers bill it most and how spending has trended over time.</p>
          <p className="text-gray-700 mb-4">Want to see how your doctor&apos;s drug prescribing compares to peers? Our <Link href="/search" className="text-blue-600 hover:underline">provider search</Link> shows drug vs. non-drug billing breakdown for every Medicare provider.</p>
          <p className="text-gray-700 mb-4">The drug pipeline isn&apos;t just a policy issue — it&apos;s personal for the millions of Medicare beneficiaries who depend on these medications. Understanding where the money goes is the first step toward ensuring it goes where it should.</p>

          <p className="text-gray-700 mb-8">As new therapies enter the pipeline — from Alzheimer&apos;s treatments to cell therapies to next-generation cancer drugs — the pressure on Medicare&apos;s drug budget will only intensify. The choices made today about pricing, negotiation, and payment reform will determine whether Medicare can afford the cures of tomorrow.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Drug Fraud Angle</h2>
          <p className="text-gray-700 mb-4">High-cost drugs create fraud opportunities. Some providers have been caught billing for expensive drugs while administering cheaper alternatives (or nothing at all), diluting drug doses to stretch them further, or using &quot;buy and bill&quot; arbitrage — purchasing drugs at discounted rates while billing Medicare at ASP+6%. Our <Link href="/fraud/watchlist" className="text-blue-600 hover:underline">fraud watchlist</Link> tracks providers with suspicious drug billing patterns.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Top 30 Drugs by Medicare Spending</h2>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Providers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {drugs.map((d: any, i: number) => (
                  <tr key={d.code} className="hover:bg-blue-50">
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2 font-mono text-blue-600 font-medium">{d.code}</td>
                    <td className="px-4 py-2 text-gray-600 text-sm max-w-sm">{d.description}</td>
                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(d.total_payments)}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{formatNumber(d.total_providers)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Looking Ahead: Gene Therapies and the Next Wave</h2>
          <p className="text-gray-700 mb-4">The next frontier of Medicare drug spending is gene therapy. Treatments like Zolgensma (for spinal muscular atrophy, priced at $2.1 million per dose) and emerging cell therapies for cancer represent a paradigm shift: one-time treatments that cost more than most Americans earn in a lifetime. As these therapies expand to conditions affecting Medicare-age patients, the budget implications are staggering.</p>
          <p className="text-gray-700 mb-4">Medicare is not currently structured to pay for million-dollar one-time therapies. CMS is exploring outcomes-based payment models, installment payments, and value-based arrangements — but the policy infrastructure lags far behind the science.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Drug Spending by Specialty</h2>
          <p className="text-gray-700 mb-4">Drug costs are concentrated in specific specialties. Ophthalmology, oncology, and rheumatology account for the vast majority of Part B drug spending:</p>
          <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-blue-900">Ophthalmology</p>
              <p className="text-sm text-blue-700">~35% of Part B drug spend (anti-VEGF injections)</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-red-900">Oncology</p>
              <p className="text-sm text-red-700">~30% of Part B drug spend (chemo, immunotherapy)</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-green-900">Rheumatology</p>
              <p className="text-sm text-green-700">~10% of Part B drug spend (biologics for RA, Crohn&apos;s)</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">This concentration means that drug spending reform efforts need to target specific specialties and specific drugs to have meaningful impact. Broad-based approaches that treat all drugs equally miss the reality that a handful of products in three specialties drive the majority of the spending growth.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Patient Perspective</h2>
          <p className="text-gray-700 mb-4">For Medicare beneficiaries, the drug pipeline isn&apos;t just a budget issue — it&apos;s a personal one. The 20% Part B coinsurance on $100,000+ drugs creates devastating out-of-pocket costs. Supplemental insurance (Medigap) covers most or all of this coinsurance for some beneficiaries, but roughly 30% of Medicare beneficiaries lack supplemental coverage and face the full 20% bill.</p>
          <p className="text-gray-700 mb-4">One thing is clear from the data: the drug pipeline isn&apos;t slowing down, and neither is the bill.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The International Price Comparison</h2>
          <p className="text-gray-700 mb-4">The U.S. pays significantly more for the same drugs than other developed countries. A RAND Corporation study found that U.S. drug prices are on average 2.56x higher than prices in 32 OECD comparison countries. For specialty drugs — the category dominating Medicare spending — the gap is even wider, often 3-5x higher.</p>
          <p className="text-gray-700 mb-4">This price gap is particularly stark for the drugs topping Medicare&apos;s spending list. Aflibercept (Eylea) costs Medicare roughly $1,850 per injection in the U.S. The same drug costs $800-$1,100 in the UK, Germany, and Japan. Over millions of injections annually, these price differences translate to billions in additional spending.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Beneficiaries Pay</h2>
          <p className="text-gray-700 mb-4">Under Medicare Part B, beneficiaries are responsible for 20% coinsurance on drug costs. For expensive drugs, this creates significant out-of-pocket burden:</p>
          <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-red-900">$370/injection</p>
              <p className="text-xs text-red-700">Patient cost for Eylea (20% of $1,850)</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-orange-900">$4,400-$8,900</p>
              <p className="text-xs text-orange-700">Annual out-of-pocket for eye injections</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-blue-900">$30,000+</p>
              <p className="text-xs text-blue-700">Annual patient cost for Keytruda (20%)</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">The Inflation Reduction Act capped Part D (pharmacy) out-of-pocket costs at $2,000 starting in 2025. But Part B drugs — the physician-administered drugs on this list — have no similar cap, leaving beneficiaries exposed to uncapped 20% coinsurance on the most expensive treatments.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Bottom Line</h2>
          <p className="text-gray-700 mb-8">Medicare&apos;s drug spending trajectory is unsustainable without structural reform. The IRA&apos;s negotiation provisions are a start, but they address only a fraction of the problem. Biosimilar adoption, international reference pricing, ASP reform, and new payment models for gene therapies will all be needed to bend the curve. Until then, the 30 drugs on this list will continue to consume an ever-larger share of the Medicare budget.</p>
        </article>

        {/* Related */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/investigations/drug-money" className="text-medicare-primary hover:underline text-sm">💊 Follow the Drug Money</Link>
            <Link href="/investigations/oncology-drug-pipeline" className="text-medicare-primary hover:underline text-sm">🔬 Oncology Drug Pipeline</Link>
            <Link href="/investigations/eye-care-billions" className="text-medicare-primary hover:underline text-sm">👁️ Eye Care Billions</Link>
            <Link href="/investigations/biggest-billers" className="text-medicare-primary hover:underline text-sm">💰 The Biggest Billers</Link>
            <Link href="/investigations/ten-year-explosion" className="text-medicare-primary hover:underline text-sm">📈 The 10-Year Explosion</Link>
            <Link href="/investigations/part-d-redesign-impact-2026" className="text-medicare-primary hover:underline text-sm">💰 Part D Redesign: The $2,000 Cap</Link>
            <Link href="/drug-spending" className="text-medicare-primary hover:underline text-sm">📊 Drug Spending Data</Link>
            <Link href="/procedures" className="text-medicare-primary hover:underline text-sm">📋 Browse Procedures</Link>
            <Link href="/investigations/specialty-pay-gap" className="text-medicare-primary hover:underline text-sm">📊 Specialty Pay Gap</Link>
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
          'CMS Medicare Part B Drug Spending Dashboard',
          'Inflation Reduction Act Drug Negotiation Program (2026)',
          'MedPAC Report to Congress, March 2026',
          'FDA Biosimilar Product Information',
        ]} />
      </div>
    </main>
  )
}
