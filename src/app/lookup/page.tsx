import type { Metadata } from 'next'
import ProviderLookup from './ProviderLookup'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'

export const metadata: Metadata = {
  title: 'Is Your Doctor Flagged? Free Medicare Provider Lookup | OpenMedicare',
  description: 'Search by name or NPI to check if your doctor appears on our AI-flagged fraud risk list, statistical watchlist, or federal exclusion list. Free, instant, anonymous.',
  alternates: { canonical: '/lookup' },
  openGraph: {
    title: 'Is Your Doctor Flagged? Free Medicare Provider Lookup',
    description: 'Check if your doctor appears on AI-flagged Medicare fraud risk lists. Search by name or NPI — instant results, completely free.',
    url: 'https://www.openmedicare.us/lookup',
  },
}

export default function LookupPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Breadcrumbs items={[
            { name: 'Provider Lookup' },
          ]} />
          <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4">
            Is Your Doctor on the List?
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Search by name or NPI to see if your healthcare provider appears on any of our
            AI-flagged fraud risk lists, the statistical watchlist, or the LEIE exclusion list.
          </p>
          <div className="mt-6">
            <ShareButtons
              title="Is Your Doctor Flagged? Free Medicare Provider Lookup"
              url="https://www.openmedicare.us/lookup"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProviderLookup />

        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-bold text-amber-900 mb-2">⚠️ Important Disclaimer</h3>
          <p className="text-amber-800 text-sm leading-relaxed">
            This tool is based on <strong>statistical analysis of publicly available Medicare claims data</strong>.
            Appearing on these lists does <strong>not</strong> mean a provider has committed fraud. Many
            flagged providers may have legitimate reasons for unusual billing patterns, such as
            treating complex patient populations or operating in specialized practice areas. This
            information is provided for transparency and public awareness only. It should not be
            used as the sole basis for choosing or avoiding a healthcare provider.
          </p>
        </div>

        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-3">How This Tool Works</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong className="text-gray-800">🤖 ML-Flagged List (500 providers):</strong> Our
              machine learning model analyzed billing patterns across 1.2 million Medicare
              providers and flagged 500 with an 86%+ probability of fraudulent activity.
            </p>
            <p>
              <strong className="text-gray-800">📊 Statistical Watchlist:</strong> Providers with
              extreme statistical outlier billing — payments, services-per-beneficiary, or markup
              ratios far above their peers.
            </p>
            <p>
              <strong className="text-gray-800">🚫 LEIE Exclusion List:</strong> Providers
              formally excluded from federal healthcare programs by the HHS Office of Inspector General.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
