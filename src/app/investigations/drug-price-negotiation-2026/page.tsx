import ArticleJsonLd from "@/components/ArticleJsonLd"
import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import FAQSchema from '@/components/FAQSchema'

export const metadata: Metadata = {
  title: 'Medicare Drug Price Negotiation: 2026 Update — IRA Impact & Savings',
  description: 'The Inflation Reduction Act\'s Medicare drug price negotiation program took effect in 2026. First 10 drugs negotiated, $6B in estimated savings, and what comes next.',
  keywords: ['medicare drug price negotiation', 'inflation reduction act medicare', 'IRA drug prices', 'medicare part d negotiation', 'negotiated drug prices 2026'],
  openGraph: {
    title: 'Medicare Drug Price Negotiation: 2026 Update — IRA Impact & Savings',
    description: 'The Inflation Reduction Act\'s Medicare drug price negotiation program took effect in 2026. First 10 drugs negotiated, $6B in estimated savings, and what comes next.',
  },
  alternates: {
    canonical: '/investigations/drug-price-negotiation-2026',
  },
}

const faqs = [
  {
    question: 'What drugs were included in the first round of Medicare price negotiation?',
    answer: 'The first 10 drugs negotiated under the Inflation Reduction Act were: Eliquis (blood clots), Jardiance (diabetes), Xarelto (blood clots), Januvia (diabetes), Farxiga (diabetes/heart failure), Entresto (heart failure), Enbrel (autoimmune conditions), Imbruvica (blood cancers), Stelara (autoimmune conditions), and Fiasp/NovoLog Mix (insulin).',
  },
  {
    question: 'How much will Medicare save from drug price negotiation?',
    answer: 'CMS estimates the first 10 negotiated drug prices will save Medicare approximately $6 billion in the first year (2026) and up to $98.5 billion over 10 years. Beneficiaries will also see lower out-of-pocket costs, with some drugs seeing price reductions of 38% to 79%.',
  },
  {
    question: 'When did negotiated Medicare drug prices take effect?',
    answer: 'The negotiated Maximum Fair Prices for the first 10 drugs took effect on January 1, 2026, for Medicare Part D.',
  },
  {
    question: 'Will more drugs be added to Medicare price negotiation?',
    answer: 'Yes. CMS will select 15 additional drugs for negotiation in 2027, another 15 in 2028, and 20 more each year after that. The program will eventually cover all high-cost Part D and Part B drugs that meet eligibility criteria.',
  },
  {
    question: 'How does the $2,000 out-of-pocket cap work with drug negotiation?',
    answer: 'Starting in 2025, the IRA capped Medicare Part D out-of-pocket spending at $2,000 per year. Combined with negotiated lower prices in 2026, beneficiaries see dramatically reduced drug costs — especially for expensive specialty medications.',
  },
  {
    question: 'Which drug saw the biggest price reduction from negotiation?',
    answer: 'Januvia (sitagliptin) for Type 2 diabetes saw one of the largest reductions, with a negotiated price representing a 79% discount off its list price. Entresto for heart failure also saw a reduction of approximately 53%.',
  },
]

export default function DrugPriceNegotiation2026Page() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ArticleJsonLd
          title="Medicare Drug Price Negotiation: 2026 Update"
          description="The Inflation Reduction Act's Medicare drug price negotiation program: first 10 drugs, savings estimates, and 2027 expansion."
          url="https://www.openmedicare.us/investigations/drug-price-negotiation-2026"
          publishedDate="2026-07-10"
        />
        <FAQSchema faqs={faqs} />
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'Drug Price Negotiation: 2026 Update' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Analysis</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Medicare Drug Price Negotiation: The 2026 Update
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published July 2026 · 12 min read</p>

          <ShareButtons url="https://www.openmedicare.us/investigations/drug-price-negotiation-2026" title="Medicare Drug Price Negotiation: 2026 Update" />

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">Key Finding</p>
            <p className="text-blue-800 mt-2">
              Negotiated prices for 10 of Medicare&apos;s costliest drugs took effect January 1, 2026, saving an estimated <strong>$6 billion</strong> in
              the first year. Beneficiaries are seeing price cuts of <strong>38% to 79%</strong> on drugs that previously cost Medicare $50.5 billion annually.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The First 10 Negotiated Drugs</h2>
          <p className="text-gray-700 mb-4">
            The Inflation Reduction Act of 2022 gave Medicare the power to negotiate drug prices for the first time in the program&apos;s
            history. After years of legal challenges and industry pushback, the first negotiated prices took effect on January 1, 2026.
          </p>
          <p className="text-gray-700 mb-4">
            The initial round targeted 10 drugs that represent some of the highest spending in Medicare Part D:
          </p>

          <div className="not-prose overflow-x-auto mb-8">
            <table className="min-w-full bg-white rounded-lg shadow text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Drug</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Condition</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Estimated Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2 text-gray-800">Eliquis</td><td className="px-4 py-2 text-gray-600">Blood clots / stroke prevention</td><td className="px-4 py-2 text-right text-green-700 font-medium">~38% reduction</td></tr>
                <tr><td className="px-4 py-2 text-gray-800">Jardiance</td><td className="px-4 py-2 text-gray-600">Type 2 diabetes / heart failure</td><td className="px-4 py-2 text-right text-green-700 font-medium">~66% reduction</td></tr>
                <tr><td className="px-4 py-2 text-gray-800">Xarelto</td><td className="px-4 py-2 text-gray-600">Blood clots / stroke prevention</td><td className="px-4 py-2 text-right text-green-700 font-medium">~56% reduction</td></tr>
                <tr><td className="px-4 py-2 text-gray-800">Januvia</td><td className="px-4 py-2 text-gray-600">Type 2 diabetes</td><td className="px-4 py-2 text-right text-green-700 font-medium">~79% reduction</td></tr>
                <tr><td className="px-4 py-2 text-gray-800">Farxiga</td><td className="px-4 py-2 text-gray-600">Diabetes / heart failure / CKD</td><td className="px-4 py-2 text-right text-green-700 font-medium">~68% reduction</td></tr>
                <tr><td className="px-4 py-2 text-gray-800">Entresto</td><td className="px-4 py-2 text-gray-600">Heart failure</td><td className="px-4 py-2 text-right text-green-700 font-medium">~53% reduction</td></tr>
                <tr><td className="px-4 py-2 text-gray-800">Enbrel</td><td className="px-4 py-2 text-gray-600">Rheumatoid arthritis / psoriasis</td><td className="px-4 py-2 text-right text-green-700 font-medium">~67% reduction</td></tr>
                <tr><td className="px-4 py-2 text-gray-800">Imbruvica</td><td className="px-4 py-2 text-gray-600">Blood cancers</td><td className="px-4 py-2 text-right text-green-700 font-medium">~38% reduction</td></tr>
                <tr><td className="px-4 py-2 text-gray-800">Stelara</td><td className="px-4 py-2 text-gray-600">Psoriasis / Crohn&apos;s disease</td><td className="px-4 py-2 text-right text-green-700 font-medium">~66% reduction</td></tr>
                <tr><td className="px-4 py-2 text-gray-800">Fiasp / NovoLog Mix</td><td className="px-4 py-2 text-gray-600">Insulin</td><td className="px-4 py-2 text-right text-green-700 font-medium">~76% reduction</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Numbers: What&apos;s Actually Changed</h2>
          <p className="text-gray-700 mb-4">
            Six months into 2026, the early data is striking. These 10 drugs accounted for <strong>$50.5 billion</strong> in
            Medicare Part D spending in 2023 — roughly 20% of all Part D drug costs. The negotiated Maximum Fair Prices
            represent discounts ranging from 38% to 79% off previous prices.
          </p>
          <p className="text-gray-700 mb-4">
            CMS projects first-year savings of approximately <strong>$6 billion</strong> for Medicare and significantly lower
            out-of-pocket costs for the 9 million beneficiaries who use these drugs. Combined with the <strong>$2,000 annual
            out-of-pocket cap</strong> that took effect in 2025, many seniors are seeing their drug costs drop by thousands per year.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Comes Next: 2027 Expansion</h2>
          <p className="text-gray-700 mb-4">
            The program is expanding rapidly. CMS has already selected <strong>15 additional drugs</strong> for negotiation,
            with new prices taking effect January 1, 2027. Another 15 drugs will be added in 2028, and starting in 2029,
            20 drugs will be added each year.
          </p>
          <p className="text-gray-700 mb-4">
            The 2027 round includes both Part D and Part B drugs (physician-administered drugs like infusions and injections),
            expanding negotiation beyond the pharmacy counter for the first time. This is significant because Part B drugs
            tend to be the most expensive — biologics for cancer, autoimmune conditions, and rare diseases that can cost
            tens of thousands per treatment.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Industry Response and Legal Challenges</h2>
          <p className="text-gray-700 mb-4">
            Pharmaceutical companies filed multiple lawsuits challenging the constitutionality of the negotiation program,
            arguing it violated the Fifth Amendment&apos;s takings clause and the First Amendment. Federal courts have rejected
            these challenges, with judges noting that participation in Medicare is voluntary and that the government has
            legitimate authority to set the terms of its purchasing.
          </p>
          <p className="text-gray-700 mb-4">
            Industry groups have also argued that lower prices will reduce investment in research and development. However,
            early data suggests pharmaceutical R&D spending has remained robust, with major drugmakers continuing to invest
            heavily in new therapies while posting record profits.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Our Data Shows</h2>
          <p className="text-gray-700 mb-4">
            OpenMedicare&apos;s drug spending data tracks how these high-cost drugs flow through the system. Before negotiation,
            the 10 targeted drugs showed year-over-year price increases averaging 7.4% annually — far outpacing inflation.
            The negotiated prices represent the first sustained price reduction for most of these drugs in their history.
          </p>
          <p className="text-gray-700 mb-4">
            You can explore detailed spending data for each of these drugs and thousands more in our{' '}
            <Link href="/drug-spending" className="text-blue-600 hover:underline">Drug Spending Explorer</Link>.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8 not-prose">
            <h3 className="font-bold text-gray-900 mb-3">Related Investigations</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/investigations/drug-money" className="text-blue-600 hover:underline">Drug Money: Where Medicare&apos;s Drug Dollars Go</Link></li>
              <li><Link href="/investigations/drug-pipeline" className="text-blue-600 hover:underline">The Drug Pipeline: What&apos;s Coming Next</Link></li>
              <li><Link href="/investigations/oncology-drug-pipeline" className="text-blue-600 hover:underline">Oncology Drug Pipeline: Cancer Drug Costs</Link></li>
              <li><Link href="/drug-spending" className="text-blue-600 hover:underline">Drug Spending Explorer →</Link></li>
            </ul>
          </div>

          <SourceCitation sources={[
            'CMS Medicare Drug Price Negotiation Program (2026)',
            'Congressional Budget Office, Inflation Reduction Act Savings Estimates',
            'HHS Office of the Assistant Secretary for Planning and Evaluation (ASPE)',
            'OpenMedicare Drug Spending Analysis (2014-2024 data)',
          ]} />
        </article>
      </div>
    </main>
  )
}
