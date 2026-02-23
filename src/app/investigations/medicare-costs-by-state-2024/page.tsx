import ArticleJsonLd from "@/components/ArticleJsonLd"
import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'

export const metadata: Metadata = {
  title: 'Medicare Costs by State: All 50 States Ranked',
  description: 'California spends $81.6B while Wyoming gets $813M — a 100x gap. See every state ranked by Medicare cost, fraud flags, and per-provider spending.',
  keywords: ['medicare costs by state', 'medicare spending by state', 'medicare cost 2024', 'medicare state comparison', 'how much does medicare cost'],
  openGraph: {
    title: 'Medicare Costs by State: All 50 States Ranked',
    description: 'California spends $81.6B while Wyoming gets $813M — a 100x gap. See every state ranked by Medicare cost, fraud flags, and per-provider spending.',
  },
  alternates: {
    canonical: '/investigations/medicare-costs-by-state-2024',
  },
}

export default function MedicareCostsByStatePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ArticleJsonLd title="How Much Does Medicare Cost by State? The Complete 2024 Guide" description="State-by-state breakdown of Medicare costs from $854.8B in CMS data" url="/investigations/medicare-costs-by-state-2024" publishedDate="2026-02-21" />
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'Medicare Costs by State 2024' }
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Data Guide</span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            How Much Does Medicare Cost by State? The Complete 2024 Guide
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 12 min read · Based on 2023 CMS data (latest available)</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-blue-900 font-medium text-lg">Key Finding</p>
            <p className="text-blue-800 mt-2">
              Medicare paid <strong>$854.8 billion</strong> to <strong>1.72 million providers</strong> in 2023. But costs vary dramatically by state:
              California leads at <strong>$81.6 billion</strong>, while Wyoming received just <strong>$813 million</strong> — a 100x gap.
              Per-provider payments range from <strong>$18K in Puerto Rico</strong> to <strong>$121K in Florida</strong>.
            </p>
          </div>

          <ShareButtons title="Medicare Costs by State — Complete 2024 Guide" url="/investigations/medicare-costs-by-state-2024" />

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Medicare Costs Vary So Much by State</h2>
          <p className="text-gray-700 mb-4">
            Medicare is a federal program, but what it costs taxpayers depends enormously on where they live.
            Several factors drive these differences: the number of beneficiaries, local cost-of-living adjustments
            (Geographic Practice Cost Indices), provider density, specialty mix, and — critically — billing patterns.
          </p>
          <p className="text-gray-700 mb-4">
            Using the complete CMS Physician and Other Supplier Payment dataset, we analyzed every Medicare payment
            made to every provider in 2023. Here&apos;s what $854.8 billion looks like, state by state.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Top 10 Most Expensive Medicare States</h2>
          <p className="text-gray-700 mb-4">
            These ten states account for more than half of all Medicare physician payments:
          </p>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 not-prose">
            <div className="space-y-3">
              {[
                { rank: 1, state: 'California', code: 'CA', total: '$81.6B', providers: '213K', perProvider: '$383K' },
                { rank: 2, state: 'Florida', code: 'FL', total: '$67.2B', providers: '126K', perProvider: '$533K' },
                { rank: 3, state: 'Texas', code: 'TX', total: '$60.8B', providers: '138K', perProvider: '$441K' },
                { rank: 4, state: 'New York', code: 'NY', total: '$57.4B', providers: '142K', perProvider: '$404K' },
                { rank: 5, state: 'Pennsylvania', code: 'PA', total: '$33.1B', providers: '82K', perProvider: '$404K' },
                { rank: 6, state: 'Ohio', code: 'OH', total: '$28.7B', providers: '72K', perProvider: '$399K' },
                { rank: 7, state: 'Illinois', code: 'IL', total: '$27.9B', providers: '71K', perProvider: '$393K' },
                { rank: 8, state: 'Michigan', code: 'MI', total: '$24.6B', providers: '58K', perProvider: '$424K' },
                { rank: 9, state: 'New Jersey', code: 'NJ', total: '$24.1B', providers: '56K', perProvider: '$430K' },
                { rank: 10, state: 'Georgia', code: 'GA', total: '$22.3B', providers: '48K', perProvider: '$465K' },
              ].map((row) => (
                <Link key={row.rank} href={`/states/${row.code}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 w-6">#{row.rank}</span>
                    <span className="font-semibold text-gray-900">{row.state}</span>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <span className="text-gray-600">{row.providers} providers</span>
                    <span className="font-bold text-blue-700">{row.total}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            Together, these 10 states received <strong>$427.7 billion</strong> — roughly <strong>50%</strong> of all Medicare
            physician payments. California and Florida alone account for nearly $150 billion.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/investigations/medicare-spending-by-state" className="text-blue-600 hover:text-blue-800">
              See the full 50-state ranking →
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Per-Provider Costs: Where Medicare Pays the Most Per Doctor</h2>
          <p className="text-gray-700 mb-4">
            Total spending tells one story. Per-provider spending tells another. States with fewer providers but high
            utilization — or states with aggressive billing patterns — stand out when you normalize the data.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Florida</strong> leads the nation at approximately <strong>$121,000 per provider</strong> in average
            Medicare payments — far above the national average of $49,700. This aligns with Florida&apos;s historic role
            as the epicenter of Medicare fraud, with{' '}
            <Link href="/investigations/florida-medicare-fraud" className="text-blue-600 hover:text-blue-800">
              56 AI-flagged providers
            </Link>{' '}
            in our fraud detection model.
          </p>
          <p className="text-gray-700 mb-4">
            At the other end, <strong>Puerto Rico</strong> averages just $18,000 per provider — reflecting lower reimbursement
            rates and a different healthcare delivery model.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Fraud Factor: Why Some States Cost More</h2>
          <p className="text-gray-700 mb-4">
            Not all Medicare cost variation is legitimate. Our machine learning model — trained on 8,300+ confirmed
            fraud cases from the LEIE and DOJ databases — flagged <strong>500 providers</strong> with billing patterns
            that match convicted fraudsters. These flagged providers cluster heavily in specific states:
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-red-900 font-medium">Top States by AI Fraud Flags</p>
            <ul className="mt-2 space-y-1 text-red-800">
              <li><strong>California & Florida:</strong> 56 flags each (22.4% of all flags)</li>
              <li><strong>New York:</strong> 39 flags</li>
              <li><strong>Texas:</strong> 34 flags</li>
              <li><strong>New Jersey:</strong> 21 flags</li>
            </ul>
            <p className="text-red-800 mt-2 text-sm">
              These 5 states account for over half of all suspicious billing patterns.{' '}
              <Link href="/fraud/watchlist" className="underline">View the full watchlist →</Link>
            </p>
          </div>

          <p className="text-gray-700 mb-4">
            The correlation between high per-provider spending and fraud flags is not coincidental. States where
            Medicare pays more per doctor tend to attract more fraud — or the fraud itself drives up the per-provider average.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Medicare Costs by Region</h2>
          <p className="text-gray-700 mb-4">
            Regional patterns emerge clearly in the data. The <strong>Southeast</strong> (Florida, Georgia, the Carolinas)
            has the highest per-beneficiary costs, driven by an older population and higher utilization rates.
            The <strong>Northeast</strong> has high total spending but more providers, resulting in moderate per-provider costs.
            The <strong>Midwest</strong> tends toward lower costs across the board, while the <strong>West</strong> is
            dominated by California&apos;s massive spending.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/geographic" className="text-blue-600 hover:text-blue-800">
              Explore the interactive geographic spending map →
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Drives Medicare Costs: Specialty Mix</h2>
          <p className="text-gray-700 mb-4">
            A state&apos;s specialty mix explains a lot. States with more ophthalmologists and oncologists tend to have
            higher per-provider costs because these specialties bill more per provider. Clinical laboratories can
            bill <strong>$1.9 million per entity</strong> on average, while nurse practitioners average just <strong>$26,000</strong>.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/specialties" className="text-blue-600 hover:text-blue-800">
              Compare specialty costs across states →
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Markup Problem</h2>
          <p className="text-gray-700 mb-4">
            Providers submitted <strong>$3.22 trillion</strong> in charges to Medicare in 2023. Medicare actually paid $854.8 billion.
            The other <strong>$2.14 trillion</strong> was written off — a markup ratio of roughly 3.8x nationally. But some states
            see markups of 5x or more, particularly in wound care and drug administration codes.
          </p>
          <p className="text-gray-700 mb-4">
            <Link href="/investigations/two-trillion-writeoff" className="text-blue-600 hover:text-blue-800">
              Read more: The $2.1 Trillion Writeoff →
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Look Up Medicare Costs in Your State</h2>
          <p className="text-gray-700 mb-4">
            OpenMedicare makes it easy to explore Medicare spending in any state. You can:
          </p>
          <ul className="text-gray-700 mb-4">
            <li>
              <Link href="/states" className="text-blue-600 hover:text-blue-800">Browse all 50 states + DC</Link>{' '}
              with total payments, provider counts, and top specialties
            </li>
            <li>
              <Link href="/providers" className="text-blue-600 hover:text-blue-800">Search any provider</Link>{' '}
              to see their individual Medicare billing history
            </li>
            <li>
              <Link href="/fraud/watchlist" className="text-blue-600 hover:text-blue-800">Check the fraud watchlist</Link>{' '}
              for providers flagged by our AI model
            </li>
            <li>
              <Link href="/compare" className="text-blue-600 hover:text-blue-800">Compare states head-to-head</Link>{' '}
              on spending, fraud rates, and specialty mix
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Methodology</h2>
          <p className="text-gray-700 mb-4">
            This analysis uses the CMS Medicare Physician and Other Supplier Public Use File for calendar year 2023 —
            the most recent data available. It covers Part B fee-for-service claims and includes payments to physicians,
            nurse practitioners, physician assistants, clinical laboratories, and other suppliers. It does not include
            Part A (hospital inpatient), Part C (Medicare Advantage plan payments), or Part D (prescription drug plan) data.
          </p>
          <p className="text-gray-700 mb-4">
            All dollar figures represent actual Medicare payments (allowed amounts), not billed charges.
            Provider counts reflect unique National Provider Identifiers (NPIs) with at least one Medicare claim.
          </p>

          <SourceCitation />

          <div className="mt-8 p-6 bg-gray-100 rounded-lg not-prose">
            <h3 className="font-bold text-gray-900 mb-2">Explore More</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/investigations/medicare-spending-by-state" className="text-blue-600 hover:text-blue-800 text-sm">
                📊 Medicare Spending by State: Full Breakdown
              </Link>
              <Link href="/investigations/geographic-inequality" className="text-blue-600 hover:text-blue-800 text-sm">
                🗺️ ZIP Code Lottery: Geographic Inequality
              </Link>
              <Link href="/investigations/florida-california-fraud" className="text-blue-600 hover:text-blue-800 text-sm">
                🚨 The Fraud Belt: CA & FL Lead Medicare Fraud
              </Link>
              <Link href="/investigations/how-much-does-medicare-pay" className="text-blue-600 hover:text-blue-800 text-sm">
                💰 How Much Does Medicare Pay Doctors?
              </Link>
            </div>
          </div>

          <ShareButtons title="Medicare Costs by State — Complete 2024 Guide" url="/investigations/medicare-costs-by-state-2024" />
        </article>
      </div>
    </main>
  )
}
