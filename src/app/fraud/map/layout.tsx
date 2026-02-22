import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Fraud Map — Flagged Providers by State',
  description: 'Interactive map showing geographic distribution of Medicare fraud flags across all 50 states. See which states have the most flagged providers, total suspicious payments by region, and drill into state-level details.',
  keywords: ['Medicare fraud by state', 'Medicare fraud map', 'Medicare fraud geographic distribution', 'flagged providers by state'],
  alternates: { canonical: '/fraud/map' },
  openGraph: {
    title: 'Medicare Fraud Map — Flagged Providers by State',
    description: 'Geographic distribution of 500 Medicare providers flagged for suspicious billing. Explore fraud concentrations by state and region.',
    url: 'https://www.openmedicare.com/fraud/map',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
