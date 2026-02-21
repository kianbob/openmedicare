'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatCurrency } from '@/lib/format'

interface UpcodingData {
  providers?: Array<{ npi: number; name: string; ratio_99214_99213: number; total_payments: number }>
}

export default function Upcoding() {
  const [upcodingData, setUpcodingData] = useState<UpcodingData | null>(null)
  const [dataAvailable, setDataAvailable] = useState(false)

  useEffect(() => {
    fetch('/data/upcoding.json')
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json() })
      .then(data => { setUpcodingData(data); setDataAvailable(true) })
      .catch(() => setDataAvailable(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: 'Fraud Analysis', href: '/fraud' }, { name: 'Upcoding' }]} />

        <h1 className="text-4xl font-bold font-serif text-gray-900 mt-6 mb-4">Upcoding Detector</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl">
          Upcoding — billing for a more expensive service than was actually provided — is the most common
          form of Medicare fraud. Two office visit codes alone account for <strong>{formatCurrency(117700000000)}</strong> in Medicare spending.
        </p>

        {/* Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-10">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">How Upcoding Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <Link href="/procedures/99213" className="text-2xl font-mono font-bold text-blue-600 hover:underline">99213</Link>
                <span className="text-sm text-gray-500">Established patient, low complexity</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">$49.50</div>
              <div className="text-sm text-gray-500">Average Medicare payment per visit</div>
              <div className="mt-3 text-xs text-gray-600">
                Typical 15-minute visit for a straightforward problem — common cold, medication refill, blood pressure check.
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <Link href="/procedures/99214" className="text-2xl font-mono font-bold text-orange-600 hover:underline">99214</Link>
                <span className="text-sm text-gray-500">Established patient, moderate complexity</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">$72.68</div>
              <div className="text-sm text-gray-500">Average Medicare payment per visit</div>
              <div className="mt-3 text-xs text-gray-600">
                Typical 25-minute visit for a more complex problem — managing multiple conditions, adjusting treatment plans.
              </div>
            </div>
          </div>
          <div className="mt-4 bg-white rounded-lg p-4 border border-red-200">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">The upcoding premium per visit</div>
              <div className="text-3xl font-bold text-red-600">+$23.18 per visit</div>
              <div className="text-sm text-gray-500 mt-1">
                A 47% increase for billing 99214 instead of 99213. At scale, this adds up to billions.
              </div>
            </div>
          </div>
        </div>

        {/* National scale */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">The Scale of the Problem</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(117700000000)}</div>
              <div className="text-sm text-gray-600 font-medium">Combined 99213 + 99214 Spending</div>
              <div className="text-xs text-gray-400 mt-1">These two codes alone: 13.8% of all Medicare physician payments</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">47%</div>
              <div className="text-sm text-gray-600 font-medium">Payment Premium</div>
              <div className="text-xs text-gray-400 mt-1">99214 pays 47% more than 99213 per visit</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">?</div>
              <div className="text-sm text-gray-600 font-medium">Providers with Abnormal Ratios</div>
              <div className="text-xs text-gray-400 mt-1">Analysis in progress</div>
            </div>
          </div>
        </div>

        {/* What to look for */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-10">
          <h2 className="text-lg font-semibold text-orange-900 mb-3">What Does Upcoding Look Like?</h2>
          <div className="text-sm text-orange-800 space-y-2">
            <p><strong>Normal pattern:</strong> Most practices bill a mix of 99213 and 99214, with ratios varying by specialty. Primary care typically has a higher share of 99213; specialists tend toward 99214.</p>
            <p><strong>Red flag:</strong> A provider who bills 99214 for 95%+ of office visits, especially if their peers in the same specialty average 60%. This suggests they may be routinely coding visits at a higher level than warranted.</p>
            <p><strong>How it works:</strong> The difference between 99213 and 99214 is subjective — it depends on the &quot;complexity&quot; of medical decision-making. This subjectivity makes it easy to justify upcoding and hard to detect.</p>
          </div>
        </div>

        {/* Data or coming soon */}
        {dataAvailable && upcodingData?.providers ? (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Provider-Level Analysis</h2>
            <p className="text-gray-600">Detailed upcoding data loaded.</p>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mb-10">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Provider-Level Analysis Coming Soon</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              We&apos;re calculating 99214/99213 ratios for every provider in our dataset and comparing them to
              specialty benchmarks. Check back soon for the complete upcoding leaderboard.
            </p>
          </div>
        )}

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> These are statistical flags based on publicly available CMS data, not accusations of fraud.
            A high 99214/99213 ratio may reflect legitimate patient complexity. Report suspected fraud:
            <a href="tel:1-800-447-8477" className="underline font-medium ml-1">1-800-HHS-TIPS</a>.
          </p>
        </div>

        <ShareButtons url="https://www.openmedicare.org/fraud/upcoding" title="Upcoding Detector — OpenMedicare" />
        <div className="mt-6">
          <SourceCitation sources={['CMS Medicare Provider Utilization and Payment Data (2014-2023)', 'HHS Office of Inspector General']} lastUpdated="February 2026" />
        </div>
      </div>
    </div>
  )
}
