import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Fraud Map: 500 Flagged Providers',
  description: 'Explore 500 Medicare providers flagged for suspicious billing across all 50 states. Find fraud hotspots in your state and drill into the data.',
  keywords: ['Medicare fraud by state', 'Medicare fraud map', 'Medicare fraud geographic distribution', 'flagged providers by state'],
  alternates: { canonical: '/fraud/map' },
  openGraph: {
    title: 'Medicare Fraud Map: 500 Flagged Providers | OpenMedicare',
    description: 'Explore 500 Medicare providers flagged for suspicious billing across all 50 states. Find fraud hotspots in your state and drill into the data.',
    url: 'https://www.openmedicare.us/fraud/map',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
