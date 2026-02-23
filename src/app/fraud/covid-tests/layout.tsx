import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '$3.4B in Suspicious COVID Test Claims',
  description: 'How providers exploited K1034 billing to rake in millions. See the worst offenders, geographic hotspots, and exposed schemes.',
  alternates: { canonical: '/fraud/covid-tests' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
