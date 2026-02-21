import type { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Embeddable Widget',
  description: 'Embed OpenMedicare fraud detection stats on your site. Free widget showing key Medicare fraud statistics.',
}

export default function EmbedPage() {
  const embedCode = `<iframe src="https://openmedicare.vercel.app/api/embed/fraud-stats" width="500" height="180" frameborder="0" style="border:none;border-radius:16px;overflow:hidden;" title="OpenMedicare Fraud Stats"></iframe>`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Embed Widget' }]} className="mb-8" />

        <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">Embeddable Fraud Stats Widget</h1>
        <p className="text-xl text-gray-600 mb-8">
          Add OpenMedicare&apos;s fraud detection stats to your site, article, or dashboard. Free to use with attribution.
        </p>

        {/* Live Preview */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Live Preview</h2>
          <div className="bg-gray-900 rounded-xl p-8 flex justify-center">
            <iframe
              src="/api/embed/fraud-stats"
              width="500"
              height="180"
              style={{ border: 'none', borderRadius: '16px', overflow: 'hidden' }}
              title="OpenMedicare Fraud Stats"
            />
          </div>
        </div>

        {/* Embed Code */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Embed Code</h2>
          <p className="text-sm text-gray-600 mb-4">Copy and paste this HTML into your site:</p>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
            <pre>{embedCode}</pre>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            The widget auto-updates with the latest data. No API key required.
          </p>
        </div>

        {/* JSON API */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Prefer JSON?</h2>
          <p className="text-sm text-gray-600 mb-4">Use our stats API endpoint for programmatic access:</p>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
            <pre>{`fetch('https://openmedicare.vercel.app/api/stats')
  .then(r => r.json())
  .then(data => console.log(data))

// Response:
// {
//   "total_providers": 1719625,
//   "flagged_providers": 500,
//   "total_payments": 854800000000,
//   "flagged_payments": 400000000,
//   "model_auc": 0.83,
//   "articles": 51,
//   "last_updated": "2026-02-21"
// }`}</pre>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Great For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">📰 News Articles</h3>
              <p className="text-gray-600">Embed live stats in your Medicare fraud reporting.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">📊 Dashboards</h3>
              <p className="text-gray-600">Add to internal healthcare analytics dashboards.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">🎓 Research</h3>
              <p className="text-gray-600">Reference in papers and presentations with live data.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/api-docs" className="text-medicare-primary hover:text-medicare-dark font-medium">
            View Full API Documentation →
          </Link>
        </div>
      </div>
    </div>
  )
}
