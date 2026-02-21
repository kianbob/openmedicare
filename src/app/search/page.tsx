'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { formatCurrency } from '@/lib/format'

const INVESTIGATIONS = [
  { slug: 'markup-machine', title: 'The Markup Machine' },
  { slug: 'biggest-billers', title: 'The Biggest Billers' },
  { slug: 'drug-pipeline', title: 'The Drug Pipeline' },
  { slug: 'covid-impact', title: 'COVID Impact on Medicare' },
  { slug: 'rural-price-tag', title: 'The Rural Price Tag' },
  { slug: 'specialty-gap', title: 'The Specialty Gap' },
  { slug: 'anesthesia-markup', title: 'The Anesthesia Markup' },
  { slug: 'medicare-biggest-spenders', title: 'Medicare\'s Biggest Spenders' },
  { slug: 'state-spending-divide', title: 'The State Spending Divide' },
  { slug: 'corporate-medicine', title: 'Corporate Medicine' },
  { slug: 'office-visit-economy', title: 'The Office Visit Economy' },
  { slug: 'pandemic-recovery', title: 'Pandemic Recovery' },
  { slug: 'eye-care-billions', title: 'Eye Care Billions' },
  { slug: 'where-medicare-dollar-goes', title: 'Where Your Medicare Dollar Goes' },
  { slug: 'covid-test-scheme', title: 'The COVID Test Scheme' },
  { slug: 'wound-care-crisis', title: 'The Wound Care Crisis' },
  { slug: 'impossible-doctors', title: 'The Impossible Doctors' },
  { slug: 'medicare-millionaires', title: 'Medicare Millionaires' },
  { slug: 'specialty-monopoly', title: 'The Specialty Monopoly' },
  { slug: 'ten-year-explosion', title: 'The Ten-Year Explosion' },
  { slug: 'geographic-inequality', title: 'Geographic Inequality' },
  { slug: 'drug-money', title: 'Drug Money' },
  { slug: 'medicare-fraud-2025', title: 'Medicare Fraud in 2025' },
  { slug: 'how-much-does-medicare-pay', title: 'How Much Does Medicare Pay?' },
  { slug: 'medicare-provider-lookup-guide', title: 'Medicare Provider Lookup Guide' },
  { slug: 'most-expensive-medicare-procedures', title: 'Most Expensive Medicare Procedures' },
  { slug: 'medicare-spending-by-state', title: 'Medicare Spending by State' },
  { slug: 'specialty-pay-gap', title: 'The Specialty Pay Gap' },
]

interface Provider { npi: string; name: string; specialty?: string; state?: string; total_payments?: number }
interface State { state: string; state_name: string; total_payments: number }
interface Specialty { specialty: string; specialty_slug: string; total_payments: number }
interface Procedure { code: string; description: string; total_payments?: number }

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [providers, setProviders] = useState<Provider[]>([])
  const [states, setStates] = useState<State[]>([])
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/data/top-providers.json').then(r => r.json()),
      fetch('/data/states.json').then(r => r.json()),
      fetch('/data/specialties.json').then(r => r.json()),
      fetch('/data/procedures.json').then(r => r.json()),
    ]).then(([prov, st, spec, proc]) => {
      setProviders(prov.providers || [])
      setStates(st.states || [])
      setSpecialties(spec.specialties || [])
      setProcedures(proc.procedures || [])
      setLoaded(true)
    })
  }, [])

  const q = query.toLowerCase().trim()

  const results = useMemo(() => {
    if (!q) return null
    return {
      providers: providers.filter(p => p.name?.toLowerCase().includes(q) || p.npi?.toString().includes(q)).slice(0, 10),
      states: states.filter(s => s.state_name?.toLowerCase().includes(q) || s.state?.toLowerCase() === q).slice(0, 10),
      specialties: specialties.filter(s => s.specialty?.toLowerCase().includes(q)).slice(0, 10),
      procedures: procedures.filter(p => p.description?.toLowerCase().includes(q) || p.code?.includes(q)).slice(0, 10),
      investigations: INVESTIGATIONS.filter(i => i.title.toLowerCase().includes(q) || i.slug.includes(q)).slice(0, 10),
    }
  }, [q, providers, states, specialties, procedures])

  const hasResults = results && (results.providers.length + results.states.length + results.specialties.length + results.procedures.length + results.investigations.length > 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: 'Search' }]} />

        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">Search OpenMedicare</h1>

        <div className="relative mb-8">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search providers, states, specialties, procedures, investigations..."
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-medicare-primary focus:border-medicare-primary outline-none"
            autoFocus
          />
        </div>

        {!loaded && q && <p className="text-gray-500">Loading data...</p>}

        {q && loaded && !hasResults && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No results found for &ldquo;{query}&rdquo;</p>
            <p className="text-gray-400">
              Can&apos;t find what you&apos;re looking for?{' '}
              <Link href="/lookup" className="text-medicare-primary hover:underline font-medium">
                Try the NPI Provider Lookup →
              </Link>
            </p>
          </div>
        )}

        {results && hasResults && (
          <div className="space-y-8">
            {results.providers.length > 0 && (
              <Section title="Providers">
                {results.providers.map(p => (
                  <ResultRow key={p.npi} href={`/providers/${p.npi}`} title={p.name} subtitle={`${p.specialty || ''} · ${p.state || ''}`} value={p.total_payments ? formatCurrency(p.total_payments) : undefined} />
                ))}
              </Section>
            )}
            {results.states.length > 0 && (
              <Section title="States">
                {results.states.map(s => (
                  <ResultRow key={s.state} href={`/states/${s.state}`} title={s.state_name} subtitle={s.state} value={formatCurrency(s.total_payments)} />
                ))}
              </Section>
            )}
            {results.specialties.length > 0 && (
              <Section title="Specialties">
                {results.specialties.map(s => (
                  <ResultRow key={s.specialty_slug} href={`/specialties/${s.specialty_slug}`} title={s.specialty} value={formatCurrency(s.total_payments)} />
                ))}
              </Section>
            )}
            {results.procedures.length > 0 && (
              <Section title="Procedures">
                {results.procedures.map(p => (
                  <ResultRow key={p.code} href={`/procedures/${p.code}`} title={`${p.code} — ${p.description}`} value={p.total_payments ? formatCurrency(p.total_payments) : undefined} />
                ))}
              </Section>
            )}
            {results.investigations.length > 0 && (
              <Section title="Investigations">
                {results.investigations.map(i => (
                  <ResultRow key={i.slug} href={`/investigations/${i.slug}`} title={i.title} />
                ))}
              </Section>
            )}
          </div>
        )}

        {q && loaded && hasResults && (
          <div className="mt-8 p-4 bg-blue-50 rounded-xl text-center">
            <p className="text-gray-600">
              Can&apos;t find what you&apos;re looking for?{' '}
              <Link href="/lookup" className="text-medicare-primary hover:underline font-medium">
                Search any provider by NPI →
              </Link>
            </p>
          </div>
        )}

        {!q && loaded && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">Start typing to search across all OpenMedicare data</p>
          </div>
        )}
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">{title}</h2>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function ResultRow({ href, title, subtitle, value }: { href: string; title: string; subtitle?: string; value?: string }) {
  return (
    <Link href={href} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all group">
      <div>
        <div className="text-sm font-medium text-gray-900 group-hover:text-medicare-primary">{title}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
      </div>
      {value && <div className="text-sm font-semibold text-gray-600">{value}</div>}
    </Link>
  )
}
