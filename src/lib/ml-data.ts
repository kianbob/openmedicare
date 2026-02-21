import fs from 'fs'
import path from 'path'

export interface FlaggedProvider {
  npi: string
  name: string
  specialty: string
  state: string
  total_payments: number
  total_services: number
  total_beneficiaries: number
  fraud_probability: number
  risk_rank: number
  top_risk_factors: string[]
  markup_ratio: number
  services_per_bene: number
}

interface MLResults {
  model_version: string
  still_out_there: FlaggedProvider[]
  total_flagged_payments: number
  top_specialties: Record<string, number>
  top_states: Record<string, number>
}

let _cache: MLResults | null = null

export function getMLResults(): MLResults {
  if (_cache) return _cache
  const filePath = path.join(process.cwd(), 'public', 'data', 'ml-v2-results.json')
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  _cache = data
  return data
}

export function getFlaggedCountsByState(): Record<string, number> {
  const { still_out_there } = getMLResults()
  const counts: Record<string, number> = {}
  for (const p of still_out_there) {
    counts[p.state] = (counts[p.state] || 0) + 1
  }
  return counts
}

export function getFlaggedCountsBySpecialty(): Record<string, number> {
  const { still_out_there } = getMLResults()
  const counts: Record<string, number> = {}
  for (const p of still_out_there) {
    counts[p.specialty] = (counts[p.specialty] || 0) + 1
  }
  return counts
}

export function getFlaggedProviders(): FlaggedProvider[] {
  return getMLResults().still_out_there
}
