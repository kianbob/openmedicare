import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deep Dives: 27 Highest-Risk Providers',
  description: 'Full fraud profiles on Medicare\'s most suspicious billers. Risk scores, peer comparisons, red-flag timelines, and the exposed billing patterns.',
  alternates: { canonical: '/fraud/deep-dives' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
