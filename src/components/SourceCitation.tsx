import { InformationCircleIcon } from '@heroicons/react/24/outline'

interface SourceCitationProps {
  sources?: string[]
  lastUpdated?: string
  className?: string
  compact?: boolean
}

const defaultSources = [
  'Centers for Medicare & Medicaid Services (CMS)',
  'Medicare Provider Utilization and Payment Data (2014-2023)',
  'CMS National Health Expenditure Data'
]

export default function SourceCitation({ 
  sources = defaultSources, 
  lastUpdated,
  className = '',
  compact = false
}: SourceCitationProps) {
  if (compact) {
    return (
      <div className={`text-xs text-gray-500 mt-4 ${className}`}>
        <div className="flex items-center">
          <InformationCircleIcon className="h-3 w-3 mr-1 text-gray-400" />
          <span>Source: CMS Medicare Provider Data</span>
          {lastUpdated && (
            <span className="ml-2">• Updated {lastUpdated}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 mt-8 border-l-4 border-medicare-primary ${className}`}>
      <div className="flex items-start">
        <InformationCircleIcon className="h-5 w-5 text-medicare-primary mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Data Sources</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {sources.map((source, index) => (
              <li key={index}>• {source}</li>
            ))}
          </ul>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-3">
              <strong>Last Updated:</strong> {lastUpdated}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            <strong>Note:</strong> All data is from publicly available Medicare records. 
            OpenMedicare is an independent journalism project not affiliated with CMS.
          </p>
        </div>
      </div>
    </div>
  )
}