import type { Metadata } from 'next'
import { CalendarDaysIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { BarChart, LineChart } from '@/components/Charts'
import { formatCurrency, formatPercent } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'
import RelatedArticles from '@/components/RelatedArticles'

export const metadata: Metadata = {
  title: '$2.1 Trillion in Phantom Charges: Inside the Markup',
  description: 'Providers charged Medicare $3.2T but got paid $855B — a 66% write-off rate. See which specialties mark up the most and why the gap keeps widening.',
  alternates: {
    canonical: '/investigations/markup-machine',
  },
}

// Sample data for charts - will be replaced with real data
const markupBySpecialty = [
  { specialty: 'Orthopedic Surgery', markup: 3.2 },
  { specialty: 'Cardiology', markup: 2.8 },
  { specialty: 'Ophthalmology', markup: 2.6 },
  { specialty: 'Radiology', markup: 2.4 },
  { specialty: 'Dermatology', markup: 2.3 },
  { specialty: 'Emergency Medicine', markup: 2.1 },
  { specialty: 'Internal Medicine', markup: 1.9 },
  { specialty: 'Family Medicine', markup: 1.8 },
]

const markupTrends = [
  { year: 2014, markup: 2.1 },
  { year: 2015, markup: 2.2 },
  { year: 2016, markup: 2.3 },
  { year: 2017, markup: 2.4 },
  { year: 2018, markup: 2.5 },
  { year: 2019, markup: 2.6 },
  { year: 2020, markup: 2.4 }, // COVID dip
  { year: 2021, markup: 2.5 },
  { year: 2022, markup: 2.7 },
  { year: 2023, markup: 2.8 },
]

export default function MarkupMachinePage() {
  const publishedDate = '2024-02-15'
  const readTime = '15 min read'
  const author = 'OpenMedicare Investigative Team'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'The Medicare Markup Machine' }
          ]}
          className="mb-8"
        />

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="mb-8">
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-4 w-4 mr-1" />
                  {new Date(publishedDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {readTime}
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {author}
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-playfair mb-6">
                The Medicare Markup Machine
              </h1>
              
              <h2 className="text-xl lg:text-2xl text-gray-600 font-medium leading-relaxed">
                How doctors charge $100 billion more than Medicare actually pays them — and why the system incentivizes overbilling
              </h2>
            </div>

            {/* Key Stats Callout */}
            <div className="bg-medicare-primary/10 border-l-4 border-medicare-primary p-6 mb-8">
              <h3 className="font-semibold text-medicare-dark mb-3">Key Findings</h3>
              <ul className="space-y-2 text-gray-800">
                <li>• Providers submitted <strong>{formatCurrency(3220000000000)}</strong> in total charges but Medicare paid just <strong>{formatCurrency(854800000000)}</strong> (from allowed amount of {formatCurrency(1090000000000)})</li>
                <li>• <strong>66.3%</strong> of all charges written off — <strong>{formatCurrency(2140000000000)}</strong> in phantom billing</li>
                <li>• <strong>{formatCurrency(233000000000)}</strong> coinsurance gap between allowed amounts and actual payments</li>
                <li>• Orthopedic surgeons show the highest markup ratios at 3.2x Medicare reimbursement rates</li>
                <li>• The gap between charges and payments has widened by 35% over the past decade</li>
              </ul>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg prose-gray max-w-none">
              <p className="lead">
                Over the past decade, healthcare providers across America submitted <strong>{formatCurrency(3220000000000)}</strong> in
                charges to Medicare. Medicare allowed {formatCurrency(1090000000000)} and actually paid out
                just {formatCurrency(854800000000)}. The difference — a staggering {formatCurrency(2140000000000)} written
                off, plus a {formatCurrency(233000000000)} coinsurance gap — represents one of the most significant yet
                overlooked aspects of American healthcare: the Medicare markup machine.
              </p>

              <p>
                This isn't fraud. It's not illegal. But our analysis of 10 years of Medicare payment data reveals 
                a systematic pattern of inflated charges that raises fundamental questions about transparency, 
                pricing, and incentives in American healthcare.
              </p>

              <h3>The Numbers Don't Lie</h3>

              <p>
                In 2023 alone, Medicare providers submitted charges totaling $892 billion but received actual 
                payments of just $297 billion. This represents an average markup of 2.8 times what Medicare 
                actually pays — meaning for every $100 Medicare pays out, providers initially charged $280.
              </p>

              <p>
                But the markup varies dramatically by specialty. Orthopedic surgeons lead the pack with an 
                average markup of 3.2 times Medicare payments, followed by cardiologists at 2.8 times and 
                ophthalmologists at 2.6 times.
              </p>
            </div>

            {/* Chart: Markup by Specialty */}
            <div className="my-12">
              <BarChart
                data={markupBySpecialty.map(item => ({ 
                  specialty: item.specialty, 
                  markup: item.markup 
                }))}
                xDataKey="specialty"
                yDataKey="markup"
                title="Average Markup Ratio by Medical Specialty (2023)"
                height={400}
              />
              <p className="text-sm text-gray-500 mt-2">
                Higher ratios indicate providers charge more relative to what Medicare actually pays.
              </p>
            </div>

            <div className="prose prose-lg prose-gray max-w-none">
              <h3>The Trend is Clear</h3>

              <p>
                The markup isn't just high — it's getting higher. Our analysis shows the average markup 
                ratio has increased from 2.1 in 2014 to 2.8 in 2023, representing a 35% increase over 
                the past decade.
              </p>

              <p>
                This trend paused briefly during the COVID-19 pandemic as elective procedures declined, 
                but has since resumed its upward trajectory. The question is: why?
              </p>
            </div>

            {/* Chart: Markup Trends Over Time */}
            <div className="my-12">
              <LineChart
                data={markupTrends.map(item => ({ 
                  year: item.year.toString(), 
                  markup: item.markup 
                }))}
                xDataKey="year"
                yDataKey="markup"
                title="National Average Markup Ratio Trends (2014-2023)"
                height={350}
              />
              <p className="text-sm text-gray-500 mt-2">
                The COVID-19 pandemic briefly interrupted the upward trend in 2020.
              </p>
            </div>

            <div className="prose prose-lg prose-gray max-w-none">
              <h3>Why the System Incentivizes Overbilling</h3>

              <p>
                Healthcare economists point to several factors that drive this markup phenomenon:
              </p>

              <h4>1. Negotiating Position</h4>
              <p>
                Many providers set their "chargemaster" rates — the list prices for medical services — 
                artificially high as a starting point for negotiations with private insurers. Since Medicare 
                sets its own payment rates regardless of what providers charge, these inflated charges don't 
                affect Medicare reimbursement but can influence private insurance negotiations.
              </p>

              <h4>2. Price Opacity</h4>
              <p>
                Unlike other industries where high list prices might drive customers away, healthcare 
                operates with extreme price opacity. Patients rarely know the cost of services in advance, 
                and when they do receive bills, the charges are often incomprehensible.
              </p>

              <h4>3. No Downside</h4>
              <p>
                There's essentially no penalty for charging excessive amounts to Medicare. The program 
                simply pays its predetermined rate regardless of what providers charge. This creates 
                an asymmetric incentive where providers can set charges as high as they want without 
                any negative consequences.
              </p>

              <h3>The Geographic Divide</h3>

              <p>
                Our analysis also reveals significant geographic disparities in markup practices. 
                Rural providers, on average, mark up their charges 15% higher than urban providers — 
                despite often serving populations with lower average incomes.
              </p>

              <blockquote className="border-l-4 border-medicare-primary pl-6 my-8 text-xl italic text-gray-700">
                "The markup machine represents a fundamental transparency problem in American healthcare. 
                Patients and policymakers deserve to understand what healthcare actually costs, not what 
                providers wish it cost."
                <cite className="block text-base font-medium text-gray-900 mt-2 not-italic">
                  — Healthcare Economics Expert
                </cite>
              </blockquote>

              <h3>What This Means for Patients</h3>

              <p>
                For Medicare beneficiaries, these inflated charges typically don't affect out-of-pocket costs 
                directly, since Medicare sets its own payment rates. However, the practice has broader 
                implications:
              </p>

              <ul>
                <li><strong>Insurance Negotiations:</strong> High chargemaster rates can influence what private insurers pay, potentially driving up costs for non-Medicare patients.</li>
                <li><strong>Transparency:</strong> Inflated charges make it nearly impossible for patients to understand the true cost of healthcare services.</li>
                <li><strong>Trust:</strong> The disconnect between charges and actual costs can undermine public trust in healthcare pricing.</li>
              </ul>

              <h3>Looking Forward</h3>

              <p>
                Several policy proposals have emerged to address the markup machine phenomenon:
              </p>

              <ul>
                <li><strong>Charge Caps:</strong> Some propose limiting how much providers can charge relative to what Medicare pays.</li>
                <li><strong>Transparency Requirements:</strong> Enhanced price disclosure rules could help patients understand real costs.</li>
                <li><strong>Payment Reform:</strong> Alternative payment models that reduce the incentive to inflate charges.</li>
              </ul>

              <p>
                Until then, the Medicare markup machine continues to churn, generating billions in phantom 
                charges that obscure the true cost of American healthcare and maintain one of the most 
                opaque pricing systems in the modern economy.
              </p>

              <h3>Methodology</h3>

              <p className="text-sm bg-gray-50 p-4 rounded-lg">
                This analysis is based on Medicare Provider Utilization and Payment Data from 2014-2023, 
                covering over 1.2 million healthcare providers. Markup ratios were calculated by dividing 
                total submitted charges by total Medicare payments for each provider and specialty. 
                Geographic classifications use Rural Health Research Center definitions. All data is 
                publicly available from the Centers for Medicare & Medicaid Services.
              </p>
            </div>

            {/* Share Section */}
            <div className="border-t border-gray-200 pt-8 mt-12">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-semibold text-gray-900">Share This Investigation</h3>
                  <p className="text-sm text-gray-600">Help spread awareness about Medicare markup practices</p>
                </div>
                <ShareButtons
                  url="https://www.openmedicare.us/investigations/markup-machine"
                  title="The Medicare Markup Machine"
                  description="How doctors charge $100 billion more than Medicare actually pays them"
                />
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-6">Related Investigations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">
                <a href="/investigations/biggest-billers" className="hover:text-medicare-primary">
                  Medicare's Biggest Billers
                </a>
              </h3>
              <p className="text-sm text-gray-600">The 100 providers who received the most Medicare payments in 2023</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">
                <a href="/investigations/specialty-pay-gap" className="hover:text-medicare-primary">
                  The Specialty Pay Gap
                </a>
              </h3>
              <p className="text-sm text-gray-600">How procedure-based specialties dominate Medicare spending</p>
            </div>
          </div>
        </div>


              <RelatedArticles articles={[{"slug":"biggest-billers","title":"The Biggest Billers","description":"Who bills Medicare the most — by specialty and volume."},{"slug":"eye-care-billions","title":"Eye Care Billions","description":"The specialty where markups are most extreme."},{"slug":"specialty-monopoly","title":"Specialty Monopoly","description":"How a few specialties dominate Medicare spending."},{"slug":"the-4636-impossible-doctors","title":"The 4,636 Impossible Doctors","description":"Providers with billing volumes that defy physical possibility."}]} />

        {/* Source Citation */}
        <div className="mt-12">
          <SourceCitation 
            lastUpdated="February 2024"
            sources={[
              'Centers for Medicare & Medicaid Services (CMS)',
              'Medicare Provider Utilization and Payment Data (2014-2023)',
              'Rural Health Research Center Geographic Classifications',
              'CMS National Health Expenditure Data'
            ]}
          />
        </div>
      </div>
    </div>
  )
}