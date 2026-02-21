import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'COVID Test Billing Tracker',
  description: 'Analysis of COVID-19 test billing fraud in Medicare. K1034 code abuse, top billers, and geographic hotspots.',
  alternates: { canonical: '/fraud/covid-tests' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
