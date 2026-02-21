#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const dataDir = path.join(__dirname, '..', 'public', 'data')
const outDir = path.join(__dirname, '..', 'public', 'downloads')

function csvEscape(val) {
  if (val == null) return ''
  const s = String(val)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

function writeCsv(filename, headers, rows) {
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(row.map(csvEscape).join(','))
  }
  const out = path.join(outDir, filename)
  fs.writeFileSync(out, lines.join('\n') + '\n')
  const size = fs.statSync(out).size
  console.log(`  ${filename}: ${rows.length} rows, ${(size / 1024).toFixed(1)} KB`)
}

// 1. Top Providers Summary
console.log('Generating top-providers-summary.csv...')
const topProviders = JSON.parse(fs.readFileSync(path.join(dataDir, 'top-providers.json'), 'utf-8'))
const provList = (topProviders.providers || topProviders).slice(0, 100)
writeCsv('top-providers-summary.csv',
  ['npi', 'name', 'specialty', 'state', 'total_payments', 'total_services'],
  provList.map(p => [p.npi, p.name, p.specialty, p.state, p.total_payments || p.payments, p.total_services || p.services])
)

// 2. State Summary
console.log('Generating state-summary.csv...')
const statesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'states.json'), 'utf-8'))
const statesList = statesData.states || statesData
writeCsv('state-summary.csv',
  ['state', 'total_payments', 'total_providers', 'total_services', 'avg_markup_ratio'],
  statesList.map(s => [s.state || s.code, s.total_payments || s.payments, s.total_providers || s.providers, s.total_services || s.services || '', s.avg_markup_ratio || s.markup_ratio || ''])
)

// 3. Specialty Summary
console.log('Generating specialty-summary.csv...')
const specsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'specialties.json'), 'utf-8'))
const specsList = specsData.specialties || specsData
writeCsv('specialty-summary.csv',
  ['specialty', 'total_payments', 'total_providers', 'total_services', 'avg_markup_ratio'],
  specsList.map(s => [s.specialty || s.name, s.total_payments || s.payments, s.total_providers || s.providers, s.total_services || s.services || '', s.avg_markup_ratio || s.markup_ratio || ''])
)

// 4. Watchlist Summary
console.log('Generating watchlist-summary.csv...')
const watchData = JSON.parse(fs.readFileSync(path.join(dataDir, 'watchlist.json'), 'utf-8'))
const watchList = (watchData.providers || watchData).slice(0, 500)
writeCsv('watchlist-summary.csv',
  ['npi', 'name', 'specialty', 'state', 'total_payments', 'risk_score', 'risk_flags'],
  watchList.map(p => [p.npi, p.name, p.specialty, p.state, p.total_payments || p.payments, p.risk_score || p.score || '', (p.risk_flags || p.flags || []).join('; ')])
)

console.log('Done!')
