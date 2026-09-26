import { formatCurrency, formatNumber } from '@/lib/format'

interface AIOverviewProps {
  type: 'provider' | 'state' | 'specialty' | 'procedure'
  data: any
  className?: string
}

function generateProviderNarrative(data: any): string[] {
  const sentences: string[] = []
  const { provider, watchlistEntry, percentile, medianPayment, specData } = data

  const overall = provider.overall
  const yearly = provider.yearly_payments || []
  const topProcs = provider.top_procedures || []

  // Spending level / percentile
  if (percentile > 0 && medianPayment > 0) {
    sentences.push(
      `This provider's ${formatCurrency(overall.total_payments)} in total Medicare payments ranks in the ${percentile}th percentile of ${provider.specialty} providers nationally.`
    )
  }

  // Markup
  const specMedianMarkup = specData?.markup_ratio || 0
  if (overall.avg_markup_ratio > 5) {
    const markupNote = specMedianMarkup > 0
      ? ` significantly above the specialty median of ${specMedianMarkup.toFixed(1)}x`
      : ' well above average'
    sentences.push(
      `Their average markup ratio of ${overall.avg_markup_ratio}x is${markupNote}.`
    )
  }

  // Volume
  const isIndividual = provider.entity_type !== 'Organization' && provider.entity_type !== 'O'
  if (isIndividual && overall.years_active > 0) {
    const servicesPerDay = Math.round(overall.total_services / overall.years_active / 250)
    if (servicesPerDay > 50) {
      sentences.push(
        `Averaging ${formatNumber(servicesPerDay)} services per working day raises questions about billing patterns.`
      )
    }
  }

  // Trend
  if (yearly.length >= 2) {
    const first = yearly[0]
    const last = yearly[yearly.length - 1]
    if (first.total_payments > 0) {
      const growth = ((last.total_payments - first.total_payments) / first.total_payments) * 100
      if (growth > 50) {
        sentences.push(
          `Medicare payments to this provider grew ${Math.round(growth)}% from ${first.year} to ${last.year}.`
        )
      }
    }
  }

  // Concentration
  if (topProcs.length > 0) {
    const totalProcPayments = topProcs.reduce((s: number, p: any) => s + p.payments, 0)
    if (totalProcPayments > 0) {
      const topShare = (topProcs[0].payments / totalProcPayments) * 100
      if (topShare > 60) {
        sentences.push(
          `${Math.round(topShare)}% of their billing comes from a single procedure code (${topProcs[0].code} — ${topProcs[0].description}).`
        )
      }
    }
  }

  // Watchlist
  if (watchlistEntry) {
    sentences.push(
      `This provider has been statistically flagged with a risk score of ${watchlistEntry.risk_score}/100. Statistical flags are not accusations of fraud.`
    )
  }

  // If nothing notable
  if (sentences.length <= 1 && !watchlistEntry) {
    sentences.push(
      "This provider's billing patterns fall within normal ranges for their specialty."
    )
  }

  return sentences.slice(0, 5)
}

function generateStateNarrative(data: any): string[] {
  const sentences: string[] = []
  const { stateData, stateName, code } = data

  const yearly = stateData.yearly_trends || []
  const totalPayments = yearly.reduce((s: number, y: any) => s + y.payments, 0)

  if (totalPayments > 0) {
    sentences.push(
      `${stateName} received ${formatCurrency(totalPayments)} in total Medicare provider payments across 10 years of data.`
    )
  }

  // Top specialty
  const specialtyBreakdown = stateData.specialty_breakdown || []
  if (specialtyBreakdown.length > 0) {
    const top = specialtyBreakdown[0]
    sentences.push(
      `The top specialty by spending is ${top.specialty}, accounting for ${formatCurrency(top.payments)} in payments across ${formatNumber(top.providers)} providers.`
    )
  }

  // Provider count from latest year
  if (yearly.length > 0) {
    const latest = yearly[yearly.length - 1]
    if (latest.providers) {
      sentences.push(
        `In ${latest.year}, ${formatNumber(latest.providers)} providers were actively billing Medicare in ${stateName}.`
      )
    }
  }

  // Growth trend
  if (yearly.length >= 2) {
    const first = yearly[0]
    const last = yearly[yearly.length - 1]
    if (first.payments > 0) {
      const growth = ((last.payments - first.payments) / first.payments) * 100
      if (Math.abs(growth) > 20) {
        sentences.push(
          `Annual Medicare spending ${growth > 0 ? 'grew' : 'declined'} ${Math.abs(Math.round(growth))}% from ${first.year} to ${last.year}.`
        )
      }
    }
  }

  return sentences.slice(0, 5)
}

function generateSpecialtyNarrative(data: any): string[] {
  const sentences: string[] = []
  const { specialtyData, summaryData } = data

  const yearly = specialtyData.yearly_trends || []
  const totalPayments = yearly.reduce((s: number, y: any) => s + y.payments, 0)

  const OVERALL_AVG_MARKUP = 3.77

  if (summaryData) {
    sentences.push(
      `${summaryData.specialty} accounts for ${formatCurrency(summaryData.total_payments)} in Medicare payments across ${formatNumber(summaryData.total_providers)} providers.`
    )

    if (summaryData.markup_ratio) {
      const diff = summaryData.markup_ratio > OVERALL_AVG_MARKUP ? 'above' : 'below'
      sentences.push(
        `The specialty's average markup of ${summaryData.markup_ratio.toFixed(1)}x is ${diff} the overall Medicare average of ${OVERALL_AVG_MARKUP}x.`
      )

      if (summaryData.markup_ratio > 6) {
        sentences.push(
          'This high markup suggests significant gaps between what providers charge and what Medicare pays.'
        )
      }
    }
  } else if (totalPayments > 0) {
    sentences.push(
      `This specialty received ${formatCurrency(totalPayments)} in total Medicare payments over 10 years.`
    )
  }

  // High-fraud specialty check
  const HIGH_FRAUD_SPECIALTIES = [
    'wound care', 'infectious disease', 'clinical laboratory', 'durable medical equipment',
    'home health', 'hospice', 'ambulance'
  ]
  const specName = (specialtyData.specialty || '').toLowerCase()
  if (HIGH_FRAUD_SPECIALTIES.some(s => specName.includes(s))) {
    sentences.push(
      'This specialty has been identified by HHS OIG as having elevated fraud risk based on historical enforcement patterns.'
    )
  }

  return sentences.slice(0, 5)
}

function generateProcedureNarrative(data: any): string[] {
  const sentences: string[] = []
  const { procedureData } = data
  const code = procedureData.code || ''
  const yearly = procedureData.yearly_trends || []
  const totalPayments = yearly.reduce((s: number, y: any) => s + y.payments, 0)
  const totalServices = yearly.reduce((s: number, y: any) => s + (y.services || 0), 0)
  const totalProviders = yearly.reduce((s: number, y: any) => s + (y.providers || 0), 0)

  if (totalPayments > 0) {
    sentences.push(
      `Procedure ${code} (${procedureData.description}) received ${formatCurrency(totalPayments)} in total Medicare payments.`
    )
  }

  if (totalServices > 0 && totalPayments > 0) {
    const avgPerService = totalPayments / totalServices
    sentences.push(
      `Across ${formatNumber(totalServices)} services, the average Medicare payment was ${formatCurrency(avgPerService)} per service.`
    )
  }

  // Wound care codes
  if (code.startsWith('Q4') || code === 'K1034') {
    sentences.push(
      'This is a skin substitute/wound care code that has been flagged by HHS OIG as particularly vulnerable to fraud.'
    )
  }

  // COVID test codes
  const COVID_CODES = ['U0003', 'U0004', 'U0005', '87635', '86408', '86409', '86769']
  if (COVID_CODES.includes(code)) {
    sentences.push(
      'COVID-19 testing saw massive billing spikes in 2020–2022.'
    )
  }

  // Payment variance check across top providers
  const topProviders = procedureData.top_providers || []
  if (topProviders.length >= 5) {
    const avgPayments = topProviders.slice(0, 10).map((p: any) => p.services > 0 ? p.payments / p.services : 0).filter((v: number) => v > 0)
    if (avgPayments.length >= 3) {
      const max = Math.max(...avgPayments)
      const min = Math.min(...avgPayments)
      if (min > 0 && max / min > 5) {
        sentences.push(
          `There is significant variance in per-service payments among top providers, with a ${Math.round(max / min)}x spread between highest and lowest average payments.`
        )
      }
    }
  }

  // State concentration
  const stateBreakdown = procedureData.state_breakdown || []
  if (stateBreakdown.length > 0 && totalPayments > 0) {
    const topState = stateBreakdown[0]
    const share = (topState.payments / totalPayments) * 100
    if (share > 25) {
      sentences.push(
        `${topState.state} leads in spending on this procedure, accounting for ${Math.round(share)}% of all payments.`
      )
    }
  }

  return sentences.slice(0, 5)
}

export default function AIOverview({ type, data, className = '' }: AIOverviewProps) {
  let sentences: string[] = []

  switch (type) {
    case 'provider':
      sentences = generateProviderNarrative(data)
      break
    case 'state':
      sentences = generateStateNarrative(data)
      break
    case 'specialty':
      sentences = generateSpecialtyNarrative(data)
      break
    case 'procedure':
      sentences = generateProcedureNarrative(data)
      break
  }

  if (sentences.length === 0) return null

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-serif font-bold text-gray-900 mb-3">
        🔎 Data Analysis
      </h3>
      <div className="text-gray-700 space-y-1 leading-relaxed">
        {sentences.map((s, i) => (
          <p key={i}>{s}</p>
        ))}
      </div>
      <p className="text-xs text-gray-400 italic mt-3">
        AI-generated analysis based on Medicare payment data.
      </p>
    </div>
  )
}
