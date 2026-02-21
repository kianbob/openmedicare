import type { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'

export const metadata: Metadata = {
  title: 'About OpenMedicare',
  description: 'Learn about OpenMedicare\'s methodology, data sources, and commitment to independent healthcare transparency journalism.',
  alternates: {
    canonical: '/about',
  },
}

const sisterSites = [
  { 
    name: 'OpenMedicaid', 
    url: 'https://www.openmedicaid.org', 
    description: 'Tracking Medicaid spending and provider transparency' 
  },
  { 
    name: 'OpenFeds', 
    url: 'https://www.openfeds.org', 
    description: 'Federal spending transparency and accountability' 
  },
  { 
    name: 'OpenSpending', 
    url: 'https://www.openspending.us', 
    description: 'Government spending data across all levels' 
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { name: 'About' }
          ]}
          className="mb-8"
        />

        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 font-playfair mb-4">
              About OpenMedicare
            </h1>
            <p className="text-xl text-gray-600">
              Professional data journalism tracking Medicare physician spending to promote transparency and accountability in healthcare.
            </p>
          </div>

          {/* Mission */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-4">
              Our Mission
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                OpenMedicare is an independent data journalism project dedicated to making Medicare physician spending transparent and accessible. We analyze over a decade of Medicare payment data (2014-2023) to help patients, policymakers, and researchers understand how taxpayer dollars flow through the healthcare system.
              </p>
              <p>
                Our goal is simple: shine light on Medicare spending patterns to promote accountability, identify potential fraud, and help Americans make informed healthcare decisions.
              </p>
            </div>
          </section>

          {/* Methodology */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-4">
              Methodology
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Data Sources</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Medicare Provider Utilization and Payment Data:</strong> Annual datasets released by CMS containing detailed payment information for individual healthcare providers</li>
                <li><strong>Medicare Part B National Summary Data:</strong> Aggregate spending data across all Medicare Part B services</li>
                <li><strong>Provider enrollment data:</strong> Physician credentials, specialties, and practice locations from CMS databases</li>
                <li><strong>Geographic data:</strong> Rural-urban classifications and state-level healthcare statistics</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Analysis Framework</h3>
              <p>
                Our analysis focuses on several key areas:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Markup Analysis:</strong> Comparing submitted charges to actual Medicare payments to identify billing patterns</li>
                <li><strong>Peer Comparison:</strong> Benchmarking providers against others in similar specialties and geographic areas</li>
                <li><strong>Trend Analysis:</strong> Tracking spending changes over the 10-year dataset to identify patterns</li>
                <li><strong>Risk Scoring:</strong> Flagging statistical outliers that may warrant further investigation</li>
                <li><strong>Geographic Analysis:</strong> Examining rural vs urban spending patterns and state-level variations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Limitations & Disclaimers</h3>
              <p>
                Important limitations to understand when using our data:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Data reflects Medicare Part B payments only (physician services), not hospital or prescription drug coverage</li>
                <li>Providers must receive at least $10,000 annually to appear in CMS public datasets</li>
                <li>High payment amounts may reflect legitimate factors like patient complexity or specialty care</li>
                <li>Statistical outliers require further investigation to determine if fraud or abuse occurred</li>
                <li>Data processing involves cleaning and standardization that may introduce minor variations</li>
              </ul>
            </div>
          </section>

          {/* Independence Statement */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-4">
              Editorial Independence
            </h2>
            <div className="bg-medicare-primary/10 border-l-4 border-medicare-primary p-6 rounded-r-lg">
              <p className="text-gray-800 font-medium mb-4">
                OpenMedicare is an independent journalism project. We are not affiliated with or funded by:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>The Centers for Medicare & Medicaid Services (CMS)</li>
                <li>Any federal or state government agency</li>
                <li>Healthcare providers, insurers, or pharmaceutical companies</li>
                <li>Political organizations or advocacy groups</li>
              </ul>
              <p className="text-gray-800 mt-4">
                Our analysis and editorial content reflect our own independent research and perspectives. We follow professional journalism standards for accuracy, fairness, and transparency.
              </p>
            </div>
          </section>

          {/* Sister Sites */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-4">
              Sister Projects
            </h2>
            <p className="text-gray-600 mb-6">
              OpenMedicare is part of a network of government transparency projects:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sisterSites.map((site) => (
                <div key={site.name} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-medicare-primary mb-2">
                    <a 
                      href={site.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {site.name}
                    </a>
                  </h3>
                  <p className="text-gray-600 text-sm">{site.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-4">
              Contact & Feedback
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                We welcome feedback, corrections, and story tips from healthcare professionals, researchers, and the public.
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:contact@openmedicare.org" className="text-medicare-primary hover:underline">contact@openmedicare.org</a></p>
                <p><strong>Tips:</strong> <a href="mailto:tips@openmedicare.org" className="text-medicare-primary hover:underline">tips@openmedicare.org</a></p>
                <p><strong>Technical Issues:</strong> <a href="mailto:support@openmedicare.org" className="text-medicare-primary hover:underline">support@openmedicare.org</a></p>
              </div>
            </div>
          </section>

          {/* Share */}
          <div className="border-t border-gray-200 pt-6">
            <ShareButtons
              url="/about"
              title="About OpenMedicare"
              description="Learn about our methodology and commitment to Medicare transparency"
            />
          </div>
        </div>

        {/* Source Citation */}
        <div className="mt-8">
          <SourceCitation 
            lastUpdated="February 2026 (data through 2023, the latest CMS release)"
            sources={[
              'Centers for Medicare & Medicaid Services (CMS)',
              'Medicare Provider Utilization and Payment Data (2014-2023)',
              'CMS Provider Enrollment Files',
              'Rural Health Research Center Classifications'
            ]}
          />
        </div>
      </div>
    </div>
  )
}