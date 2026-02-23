import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search 1.72M Medicare Providers — Payments & Fraud Flags',
  description: 'Look up any Medicare doctor. See 10 years of payments, AI fraud scores, markup ratios, and peer comparisons for 1.72 million providers.',
  openGraph: {
    title: 'Search 1.72M Medicare Providers — Payments & Fraud Flags',
    description: 'Look up any Medicare doctor. See 10 years of payments, AI fraud scores, markup ratios, and peer comparisons for 1.72 million providers.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
