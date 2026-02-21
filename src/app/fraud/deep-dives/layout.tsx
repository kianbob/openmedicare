import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fraud Deep Dive Profiles — OpenMedicare',
  description: 'Deep-dive profiles of the most suspicious individual Medicare providers. Risk scores, billing breakdowns, and peer comparisons.',
  alternates: { canonical: '/fraud/deep-dives' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
