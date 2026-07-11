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

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Who Benefits Most</h2>
          <p className="text-gray-700 mb-4">
            The savings aren&apos;t distributed equally. Beneficiaries in the Medicare Part D &quot;coverage gap&quot; (formerly the
            &quot;donut hole&quot;) see the largest dollar savings, because they were previously paying a percentage of high
            list prices. Low-income subsidy (LIS) recipients — who already had minimal out-of-pocket costs — benefit
            less directly, though the program saves the Medicare trust fund money on their behalf.
          </p>
          <p className="text-gray-700 mb-4">
            Geographically, states with the highest Medicare Part D enrollment see the most aggregate savings.
            Florida, California, Texas, and New York — the four largest Medicare states — account for roughly
            35% of total estimated savings from the first 10 negotiated drugs.
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

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Beneficiary Impact</h2>
          <p className="text-gray-700 mb-4">
            For the 9 million Medicare beneficiaries who take one or more of these 10 drugs, the impact is immediate and tangible.
            Consider a patient taking Eliquis (apixaban) for atrial fibrillation — one of the most commonly prescribed blood thinners
            in Medicare. Before negotiation, a 30-day supply could cost a Part D beneficiary $200-500 depending on their plan and
            coverage phase. With the negotiated price plus the $2,000 annual cap, many patients are seeing their annual drug costs
            drop by $3,000 or more.
          </p>
          <p className="text-gray-700 mb-4">
            Diabetes patients benefit especially. Januvia&apos;s 79% price reduction and Jardiance&apos;s 66% reduction mean that the
            most common Type 2 diabetes medications — which patients take daily for years or decades — are now dramatically
            more affordable. For beneficiaries on fixed incomes, this can mean the difference between taking medications as
            prescribed and rationing doses to save money.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">International Comparison: How the U.S. Compares</h2>
          <div className="not-prose overflow-x-auto mb-8">
            <table className="min-w-full bg-white rounded-lg shadow text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Drug</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">U.S. (Pre-Negotiation)</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">U.S. (Negotiated)</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Canada</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">UK (NHS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2 text-gray-800">Eliquis (30-day)</td><td className="px-4 py-2 text-right text-red-600">$521</td><td className="px-4 py-2 text-right text-green-700">~$323</td><td className="px-4 py-2 text-right">~$220</td><td className="px-4 py-2 text-right">~$85</td></tr>
                <tr><td className="px-4 py-2 text-gray-800">Januvia (30-day)</td><td className="px-4 py-2 text-right text-red-600">$527</td><td className="px-4 py-2 text-right text-green-700">~$113</td><td className="px-4 py-2 text-right">~$180</td><td className="px-4 py-2 text-right">~$50</td></tr>
                <tr><td className="px-4 py-2 text-gray-800">Entresto (30-day)</td><td className="px-4 py-2 text-right text-red-600">$628</td><td className="px-4 py-2 text-right text-green-700">~$295</td><td className="px-4 py-2 text-right">~$190</td><td className="px-4 py-2 text-right">~$95</td></tr>
                <tr><td className="px-4 py-2 text-gray-800">Enbrel (30-day)</td><td className="px-4 py-2 text-right text-red-600">$6,122</td><td className="px-4 py-2 text-right text-green-700">~$2,020</td><td className="px-4 py-2 text-right">~$1,200</td><td className="px-4 py-2 text-right">~$750</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2">Approximate prices. International prices based on published reference pricing data. Actual costs vary by plan, pharmacy, and region.</p>
          </div>
          <p className="text-gray-700 mb-4">
            Even after negotiation, U.S. prices generally remain higher than what other developed nations pay. But the
            reductions are a significant step — bringing some drugs closer to international benchmarks for the first time.
            The key question is whether the program will expand aggressively enough to close the remaining gap.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Political Landscape</h2>
          <p className="text-gray-700 mb-4">
            Drug price negotiation remains politically contentious. Pharmaceutical manufacturers argue that price controls
            will stifle innovation, pointing to the multi-billion dollar cost of bringing new drugs to market. Proponents
            counter that the U.S. has subsidized the world&apos;s drug costs for decades, with American patients paying 2-3x
            more than their counterparts in Canada, Europe, and Japan for identical medications.
          </p>
          <p className="text-gray-700 mb-4">
            The program&apos;s long-term impact depends on its expansion. With 15 drugs added in 2027, 15 more in 2028, and
            20 per year after that, the negotiation program will eventually cover hundreds of the most expensive drugs
            in Medicare. The CBO projects cumulative savings of <strong>$98.5 billion over 10 years</strong> — significant,
            but still a fraction of total Medicare drug spending.
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

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Milestones Timeline</h2>
          <div className="not-prose space-y-3 mb-8">
            {[
              { date: 'August 2022', event: 'Inflation Reduction Act signed into law, granting Medicare drug negotiation authority' },
              { date: 'September 2023', event: 'CMS announces first 10 drugs selected for negotiation' },
              { date: 'February 2024', event: 'Initial price offers sent to manufacturers; counter-offer period begins' },
              { date: 'August 2024', event: 'Negotiated Maximum Fair Prices finalized and published' },
              { date: 'January 2025', event: '$2,000 annual Part D out-of-pocket cap takes effect' },
              { date: 'January 2026', event: 'Negotiated prices take effect for first 10 drugs' },
              { date: 'February 2026', event: 'CMS announces 15 additional drugs selected for 2027 negotiation' },
              { date: 'January 2027', event: 'Second round of negotiated prices takes effect (15 drugs, including Part B)' },
              { date: 'January 2028', event: 'Third round: 15 more drugs' },
              { date: '2029+', event: '20 drugs added per year going forward' },
            ].map((m, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-sm font-bold text-blue-600 min-w-[120px]">{m.date}</div>
                <div className="text-sm text-gray-700">{m.event}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bottom Line</h2>
          <p className="text-gray-700 mb-4">
            Medicare drug price negotiation is the most significant change to the program&apos;s pharmaceutical purchasing
            in its 60-year history. The first year&apos;s results — $6 billion in savings on just 10 drugs — are promising
            but modest relative to total Medicare drug spending of $200+ billion annually. The real test comes as the
            program scales to cover dozens, then hundreds of drugs over the next decade.
          </p>
          <p className="text-gray-700 mb-4">
            For beneficiaries, the immediate impact is clear: lower costs on some of the most commonly prescribed
            medications in Medicare. For the broader healthcare system, the question is whether negotiation can
            meaningfully bend the drug spending curve — or whether pharmaceutical companies will simply shift
            pricing strategies to maintain revenue, as they&apos;ve done historically with every cost-containment effort.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8 not-prose">
            <h3 className="font-bold text-gray-900 mb-3">Related Investigations</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/investigations/drug-money" className="text-blue-600 hover:underline">Drug Money: Where Medicare&apos;s Drug Dollars Go</Link></li>
              <li><Link href="/investigations/drug-pipeline" className="text-blue-600 hover:underline">The Drug Pipeline: What&apos;s Coming Next</Link></li>
              <li><Link href="/investigations/oncology-drug-pipeline" className="text-blue-600 hover:underline">Oncology Drug Pipeline: Cancer Drug Costs</Link></li>
              <li><Link href="/investigations/part-d-redesign-impact-2026" className="text-blue-600 hover:underline">Part D Redesign: The $2,000 Cap Six Months In</Link></li>
              <li><Link href="/drug-spending" className="text-blue-600 hover:underline">Drug Spending Explorer →</Link></li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Negotiation Actually Works</h2>
          <p className="text-gray-700 mb-4">
            The process isn&apos;t simple price-setting. CMS selects eligible drugs based on spending thresholds, time on market,
            and lack of generic competition. The agency then makes an initial offer to the manufacturer, followed by up to
            three rounds of negotiation. If no agreement is reached, the manufacturer faces an excise tax of up to 1,900%
            on U.S. sales of the drug — or can withdraw the drug from Medicare and Medicaid entirely.
          </p>
          <p className="text-gray-700 mb-4">
            In practice, every manufacturer in the first round reached agreement rather than face the tax or lose access
            to Medicare&apos;s 68.5 million beneficiaries. The negotiated &quot;Maximum Fair Prices&quot; are confidential during the
            negotiation process but published before they take effect, allowing beneficiaries and plans to see the new prices.
          </p>

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
