import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Medicare Provider Lookup by NPI',
  description: 'Search 1.7M+ Medicare providers instantly. See billing history, fraud risk scores, peer comparisons, and 10 years of payment data — all free.',
  openGraph: {
    title: 'Free Medicare Provider Lookup by NPI',
    description: 'Search 1.7M+ Medicare providers instantly. See billing history, fraud risk scores, peer comparisons, and 10 years of payment data — all free.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
