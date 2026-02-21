'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

interface GlossaryTerm {
  term: string
  abbreviation?: string
  definition: string
  category: 'medicare' | 'fraud' | 'data' | 'model' | 'billing'
  related?: string[]
}

const glossaryTerms: GlossaryTerm[] = [
  { term: 'Area Under Curve', abbreviation: 'AUC', definition: 'A model accuracy metric measuring how well the algorithm distinguishes between fraudulent and legitimate providers. Our model achieves 0.83 AUC, meaning 83% discrimination accuracy. A score of 0.5 would be random chance; 1.0 would be perfect.', category: 'model', related: ['Random Forest', 'Fraud Probability'] },
  { term: 'Allowed Amount', definition: 'The maximum amount Medicare has determined is appropriate for a given service. This is typically less than the provider\'s submitted charge but more than the actual payment after cost-sharing.', category: 'billing', related: ['Markup Ratio', 'Submitted Charges'] },
  { term: 'Beneficiary', definition: 'A person enrolled in and receiving benefits from Medicare. Also referred to as a Medicare patient. Each beneficiary has a unique identifier (not the same as the provider\'s NPI).', category: 'medicare', related: ['Services Per Beneficiary'] },
  { term: 'Billing Fraud', definition: 'Intentionally submitting false or misleading claims to Medicare for payment. Includes upcoding, unbundling, phantom billing, and billing for services not rendered. A federal crime under the False Claims Act.', category: 'fraud', related: ['Upcoding', 'Phantom Billing', 'Unbundling'] },
  { term: 'Centers for Medicare & Medicaid Services', abbreviation: 'CMS', definition: 'The federal agency within the Department of Health and Human Services that administers Medicare, Medicaid, and the Children\'s Health Insurance Program. CMS publishes the provider utilization data that powers this site.', category: 'medicare', related: ['HHS OIG', 'Medicare Part B'] },
  { term: 'Confidence Interval', definition: 'A statistical range indicating the uncertainty around a fraud probability estimate. A narrower interval means more certainty. We report 95% confidence intervals for our risk scores.', category: 'model', related: ['Fraud Probability', 'Area Under Curve'] },
  { term: 'Cost-to-Charge Ratio', definition: 'The ratio between what a procedure actually costs to perform and what the provider bills. Extremely high ratios can indicate inflated billing, though they vary significantly by specialty.', category: 'billing', related: ['Markup Ratio', 'Submitted Charges'] },
  { term: 'Deep Dive Profile', definition: 'An in-depth analysis of a specific flagged provider, examining their billing patterns, peer comparisons, geographic context, and specific anomalies that triggered the fraud detection model.', category: 'fraud', related: ['Risk Rank', 'Fraud Probability'] },
  { term: 'Durable Medical Equipment, Prosthetics, Orthotics, and Supplies', abbreviation: 'DMEPOS', definition: 'Medical equipment and supplies prescribed by providers and paid for by Medicare. Includes wheelchairs, oxygen equipment, diabetic supplies, and prosthetic devices. Historically a high-fraud category.', category: 'medicare', related: ['HCPCS'] },
  { term: 'Excluded Provider', definition: 'A provider who has been banned from participating in Medicare and other federal healthcare programs, typically due to fraud convictions, license revocation, or other misconduct. Listed on the LEIE.', category: 'fraud', related: ['LEIE', 'HHS OIG'] },
  { term: 'False Claims Act', abbreviation: 'FCA', definition: 'Federal law (31 U.S.C. §§ 3729–3733) that imposes liability on persons who defraud the government. The primary legal tool for prosecuting Medicare fraud. Allows whistleblowers (qui tam relators) to file suits on behalf of the government.', category: 'fraud', related: ['Billing Fraud', 'Whistleblower'] },
  { term: 'Feature Importance', definition: 'A machine learning concept measuring which data signals contribute most to the model\'s predictions. In our fraud model, top features include markup ratio, services per beneficiary, total payment amount, and deviation from specialty peers.', category: 'model', related: ['Random Forest', 'Fraud Probability'] },
  { term: 'Fraud Probability', definition: 'The machine learning model\'s estimate that a provider\'s billing patterns match known fraud patterns, expressed as a percentage from 0–100%. This is a statistical risk indicator, not an accusation. High scores warrant further investigation.', category: 'model', related: ['Risk Rank', 'Area Under Curve', 'Feature Importance'] },
  { term: 'Healthcare Common Procedure Coding System', abbreviation: 'HCPCS', definition: 'A standardized coding system used to identify specific medical services, procedures, and equipment for billing purposes. Level I codes are CPT codes for physician services; Level II codes cover non-physician services like ambulance rides and DMEPOS.', category: 'billing', related: ['Upcoding', 'DMEPOS'] },
  { term: 'HHS Office of Inspector General', abbreviation: 'HHS OIG', definition: 'The Department of Health and Human Services Office of Inspector General, responsible for fighting fraud, waste, and abuse in Medicare, Medicaid, and other HHS programs. Maintains the LEIE and publishes fraud case outcomes.', category: 'fraud', related: ['LEIE', 'CMS'] },
  { term: 'Impossible Numbers', definition: 'Billing volumes that are physically impossible for a single provider — such as billing for more than 24 hours of services in a day, or seeing 400+ patients daily. A strong indicator of fraudulent billing.', category: 'fraud', related: ['Services Per Beneficiary', 'Billing Fraud'] },
  { term: 'List of Excluded Individuals/Entities', abbreviation: 'LEIE', definition: 'A database maintained by the HHS OIG containing individuals and entities excluded from federally funded healthcare programs. Our model cross-references this list to identify providers with prior fraud history still billing Medicare.', category: 'fraud', related: ['HHS OIG', 'Excluded Provider'] },
  { term: 'Markup Ratio', definition: 'The ratio of a provider\'s submitted charges to Medicare\'s allowed amount. A markup ratio of 3.0 means the provider charges three times what Medicare considers reasonable. Extremely high ratios (>5x) are a fraud indicator.', category: 'billing', related: ['Allowed Amount', 'Submitted Charges', 'Cost-to-Charge Ratio'] },
  { term: 'Medicare Part B', definition: 'The component of Medicare that covers physician services, outpatient care, medical supplies, and preventive services. All data on OpenMedicare comes from Part B claims. (Part A covers hospital/inpatient; Part D covers prescription drugs.)', category: 'medicare', related: ['CMS', 'Beneficiary'] },
  { term: 'National Provider Identifier', abbreviation: 'NPI', definition: 'A unique 10-digit identification number assigned to every healthcare provider in the United States. NPIs are permanent and never reassigned. This is the primary key we use to track providers across years and datasets.', category: 'data', related: ['Provider Profile'] },
  { term: 'Outlier Detection', definition: 'Statistical methods for identifying providers whose billing patterns deviate significantly from their peers. We use z-scores and interquartile ranges within specialty and geographic groupings to flag anomalies.', category: 'model', related: ['Feature Importance', 'Peer Comparison'] },
  { term: 'Peer Comparison', definition: 'Evaluating a provider\'s billing patterns against other providers in the same specialty and geographic region. A cardiologist billing 10x the average for their specialty is more suspicious than one billing 1.5x.', category: 'model', related: ['Outlier Detection', 'Specialty'] },
  { term: 'Phantom Billing', definition: 'Submitting claims for services that were never actually provided to patients. One of the most common and egregious forms of Medicare fraud.', category: 'fraud', related: ['Billing Fraud', 'False Claims Act'] },
  { term: 'Provider Profile', definition: 'An aggregated view of a provider\'s billing history, including total payments received, services rendered, beneficiaries served, specialty, location, and fraud risk indicators across all available years (2014–2023).', category: 'data', related: ['NPI', 'Specialty'] },
  { term: 'Random Forest', definition: 'An ensemble machine learning algorithm that builds multiple decision trees and merges their predictions. Our fraud detection model uses a Random Forest classifier trained on features extracted from Medicare billing data and validated against known fraud cases.', category: 'model', related: ['Area Under Curve', 'Feature Importance', 'Fraud Probability'] },
  { term: 'Risk Rank', definition: 'A provider\'s position among the 500 highest-risk flagged providers, where Rank 1 has the highest fraud probability. Rankings are based on the model\'s composite risk score combining multiple fraud indicators.', category: 'fraud', related: ['Fraud Probability', 'Fraud Watchlist'] },
  { term: 'Services Per Beneficiary', definition: 'The average number of services a provider bills per unique patient. Abnormally high values suggest potential upcoding, unbundling, or phantom billing — especially when far exceeding specialty averages.', category: 'billing', related: ['Beneficiary', 'Impossible Numbers', 'Upcoding'] },
  { term: 'Specialty', definition: 'The medical specialty a provider is classified under in Medicare data (e.g., Internal Medicine, Cardiology, Ophthalmology). There are 100+ specialties in CMS data. Risk analysis is always performed within specialty groupings.', category: 'medicare', related: ['Peer Comparison', 'Provider Profile'] },
  { term: 'Submitted Charges', definition: 'The amount a provider bills Medicare for a service, before any adjustments. Typically higher than the allowed amount. The gap between submitted charges and actual payment is the basis for markup ratio calculations.', category: 'billing', related: ['Allowed Amount', 'Markup Ratio'] },
  { term: 'Unbundling', definition: 'The fraudulent practice of billing separately for services that should be billed together under a single code, resulting in higher total reimbursement. The opposite of bundling.', category: 'fraud', related: ['Billing Fraud', 'HCPCS', 'Upcoding'] },
  { term: 'Upcoding', definition: 'Billing Medicare for a more expensive service than what was actually provided. For example, billing a complex office visit (99215) when only a simple one (99213) was performed. A common and costly form of fraud.', category: 'fraud', related: ['HCPCS', 'Billing Fraud', 'Unbundling'] },
  { term: 'Utilization Rate', definition: 'A measure of how frequently a particular service or procedure is used, typically expressed per 1,000 beneficiaries. High utilization rates for expensive procedures in a geographic area may indicate overuse or fraud.', category: 'data', related: ['Services Per Beneficiary', 'Beneficiary'] },
  { term: 'Fraud Watchlist', definition: 'Our curated list of 500 providers flagged by the machine learning model as having the highest probability of fraudulent billing patterns. Updated with each data release. Not an accusation — a starting point for investigation.', category: 'fraud', related: ['Risk Rank', 'Fraud Probability'] },
  { term: 'Whistleblower', definition: 'An individual, often a healthcare worker, who reports suspected Medicare fraud. Protected under the False Claims Act and eligible for a percentage of recovered funds. The HHS OIG hotline (1-800-HHS-TIPS) accepts anonymous reports.', category: 'fraud', related: ['False Claims Act', 'HHS OIG'] },
  { term: 'Z-Score', definition: 'A statistical measure indicating how many standard deviations a value is from the mean. In our analysis, providers with billing z-scores above 3.0 in multiple categories are flagged for further review.', category: 'model', related: ['Outlier Detection', 'Peer Comparison'] },
].sort((a, b) => a.term.localeCompare(b.term))

const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  medicare: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Medicare' },
  fraud: { bg: 'bg-red-100', text: 'text-red-800', label: 'Fraud' },
  data: { bg: 'bg-green-100', text: 'text-green-800', label: 'Data' },
  model: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'ML Model' },
  billing: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Billing' },
}

export default function GlossaryPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return glossaryTerms.filter(t => {
      const matchesSearch = !search ||
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        (t.abbreviation && t.abbreviation.toLowerCase().includes(search.toLowerCase())) ||
        t.definition.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !activeCategory || t.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  const letters = useMemo(() => {
    const all = new Set(filtered.map(t => t.term[0].toUpperCase()))
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => ({ letter: l, active: all.has(l) }))
  }, [filtered])

  const groupedByLetter = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {}
    filtered.forEach(t => {
      const l = t.term[0].toUpperCase()
      if (!groups[l]) groups[l] = []
      groups[l].push(t)
    })
    return groups
  }, [filtered])

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <Breadcrumbs items={[{ name: 'Glossary' }]} />

        <h1 className="mt-8 font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Medicare & Fraud Detection Glossary
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Definitions for every term, metric, and abbreviation used across OpenMedicare.
          See also our <Link href="/methodology" className="text-medicare-primary hover:underline">methodology</Link> and{' '}
          <Link href="/data-sources" className="text-medicare-primary hover:underline">data sources</Link>.
        </p>

        {/* Search */}
        <div className="mt-8">
          <input
            type="text"
            placeholder="Search terms, abbreviations, or definitions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-medicare-primary focus:outline-none focus:ring-2 focus:ring-medicare-primary/20"
          />
        </div>

        {/* Category filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${!activeCategory ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            All ({glossaryTerms.length})
          </button>
          {Object.entries(categoryColors).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(activeCategory === key ? null : key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${activeCategory === key ? `${val.bg} ${val.text} ring-2 ring-current` : `${val.bg} ${val.text} hover:opacity-80`}`}
            >
              {val.label} ({glossaryTerms.filter(t => t.category === key).length})
            </button>
          ))}
        </div>

        {/* A-Z navigation */}
        <div className="mt-6 flex flex-wrap gap-1">
          {letters.map(({ letter, active }) => (
            <a
              key={letter}
              href={active ? `#letter-${letter}` : undefined}
              className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors ${
                active ? 'bg-medicare-primary text-white hover:bg-medicare-primary/90' : 'bg-gray-100 text-gray-300 cursor-default'
              }`}
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Terms */}
        <div className="mt-10 space-y-2">
          {Object.entries(groupedByLetter).sort(([a], [b]) => a.localeCompare(b)).map(([letter, terms]) => (
            <div key={letter} id={`letter-${letter}`} className="scroll-mt-24">
              <h2 className="sticky top-16 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-2 font-serif text-2xl font-bold text-medicare-primary">
                {letter}
              </h2>
              <div className="divide-y divide-gray-100">
                {terms.map(term => (
                  <div key={term.term} className="py-5">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {term.term}
                          {term.abbreviation && (
                            <span className="ml-2 text-sm font-normal text-gray-500">({term.abbreviation})</span>
                          )}
                        </h3>
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[term.category].bg} ${categoryColors[term.category].text}`}>
                          {categoryColors[term.category].label}
                        </span>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">{term.definition}</p>
                        {term.related && term.related.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="text-xs text-gray-400">Related:</span>
                            {term.related.map(r => (
                              <span key={r} className="text-xs text-medicare-primary hover:underline cursor-default">{r}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-gray-500">No terms match your search. Try a different keyword.</p>
        )}

        {/* Back to top */}
        <div className="mt-16 border-t border-gray-200 pt-8 text-center">
          <a href="#" className="text-sm text-medicare-primary hover:underline">↑ Back to top</a>
          <p className="mt-4 text-sm text-gray-500">
            Missing a term? <Link href="/about" className="text-medicare-primary hover:underline">Let us know</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
