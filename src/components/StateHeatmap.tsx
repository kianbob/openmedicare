'use client'

import { useState } from 'react'
import Link from 'next/link'

interface StateDataItem {
  code: string
  value: number
  label: string
}

interface StateHeatmapProps {
  data: StateDataItem[]
  title: string
  linkPrefix: string
}

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia'
}

// Grid layout roughly matching US geography
// Each row is an array of cells; null = empty space
const GRID: (string | null)[][] = [
  [null, 'AK', null, null, null, null, null, null, null, null, null, 'ME'],
  [null, 'WA', 'MT', 'ND', 'MN', null, 'WI', null, 'MI', null, 'NY', 'VT', 'NH', 'MA'],
  [null, 'OR', 'ID', 'SD', null, 'IA', 'IN', 'OH', 'PA', 'NJ', 'CT', 'RI'],
  [null, 'NV', 'WY', 'NE', 'IL', null, 'WV', 'VA', 'MD', 'DE'],
  [null, 'CA', 'UT', 'CO', 'KS', 'MO', 'KY', null, 'NC', null, 'DC'],
  [null, null, 'AZ', 'NM', 'OK', 'AR', 'TN', 'SC'],
  [null, null, null, null, 'TX', 'LA', 'MS', 'AL', 'GA'],
  [null, null, 'HI', null, null, null, null, null, null, null, 'FL'],
]

function getColor(value: number, min: number, max: number): string {
  if (max === min) return 'rgb(74, 222, 128)'
  const ratio = (value - min) / (max - min)
  // green (low) -> yellow (mid) -> red (high)
  if (ratio < 0.5) {
    const t = ratio * 2
    const r = Math.round(74 + (250 - 74) * t)
    const g = Math.round(222 + (204 - 222) * t)
    const b = Math.round(128 + (21 - 128) * t)
    return `rgb(${r},${g},${b})`
  } else {
    const t = (ratio - 0.5) * 2
    const r = Math.round(250 + (239 - 250) * t)
    const g = Math.round(204 + (68 - 204) * t)
    const b = Math.round(21 + (68 - 21) * t)
    return `rgb(${r},${g},${b})`
  }
}

function formatCompact(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

export default function StateHeatmap({ data, title, linkPrefix }: StateHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ code: string; x: number; y: number } | null>(null)

  const dataMap = new Map(data.map(d => [d.code, d]))
  const values = data.map(d => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">{title}</h3>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-[500px] relative" onMouseLeave={() => setTooltip(null)}>
          {GRID.map((row, ri) => (
            <div key={ri} className="flex gap-1 mb-1">
              {row.map((cell, ci) => {
                if (!cell) return <div key={ci} className="w-10 h-10 sm:w-12 sm:h-12" />
                const item = dataMap.get(cell)
                const bg = item ? getColor(item.value, min, max) : '#e5e7eb'
                const textColor = item ? (item.value > (min + max) * 0.6 ? 'white' : '#1f2937') : '#9ca3af'
                return (
                  <Link
                    key={ci}
                    href={`${linkPrefix}/${cell}`}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded text-[10px] sm:text-xs font-bold transition-transform hover:scale-110 hover:z-10 hover:shadow-lg relative"
                    style={{ backgroundColor: bg, color: textColor }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      setTooltip({ code: cell, x: rect.left + rect.width / 2, y: rect.top })
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {cell}
                  </Link>
                )
              })}
            </div>
          ))}
          
          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
            <span>Low</span>
            <div className="flex h-3 rounded overflow-hidden flex-1 max-w-[200px]">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: getColor(min + (max - min) * (i / 19), min, max) }} />
              ))}
            </div>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Tooltip rendered as fixed overlay */}
      {tooltip && dataMap.get(tooltip.code) && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 pointer-events-none shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y - 8,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-bold">{STATE_NAMES[tooltip.code] || tooltip.code}</div>
          <div>{dataMap.get(tooltip.code)!.label}: {formatCompact(dataMap.get(tooltip.code)!.value)}</div>
        </div>
      )}
    </div>
  )
}
