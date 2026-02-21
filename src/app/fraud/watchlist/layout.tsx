import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fraud Watchlist',
  description: '500 Medicare providers flagged for suspicious billing patterns. Filter by risk score, specialty, state. Statistical analysis of outlier spending.',
  alternates: { canonical: '/fraud/watchlist' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
