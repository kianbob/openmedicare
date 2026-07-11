import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search 1.82M Medicare Providers — $940B+ in Payments & AI Fraud Flags',
  description: 'Look up any of 1.82M Medicare providers. See 11 years of payments ($940B+), AI fraud scores, markup ratios, and peer comparisons — serving 68.5M beneficiaries. Updated 2026.',
  openGraph: {
    title: 'Search 1.82M Medicare Providers — $940B+ in Payments & AI Fraud Flags',
    description: 'Look up any of 1.82M Medicare providers. See 11 years of payments ($940B+), AI fraud scores, markup ratios, and peer comparisons — serving 68.5M beneficiaries. Updated 2026.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
