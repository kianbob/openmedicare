import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Fraud Watchlist: 500 Flagged',
  description: '500 Medicare providers ranked by AI fraud risk score. Filter by specialty, state, and anomaly type. See who billed the most — and why it looks wrong.',
  alternates: { canonical: '/fraud/watchlist' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
