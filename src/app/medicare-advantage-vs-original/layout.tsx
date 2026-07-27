import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Advantage vs Original Medicare: Costs, Coverage & Market Share Compared',
  description: 'Should you choose Medicare Advantage or Original Medicare? Compare costs, coverage, provider networks, out-of-pocket limits, and market share trends with real CMS data.',
  openGraph: {
    title: 'Medicare Advantage vs Original Medicare: Costs, Coverage & Market Share Compared',
    description: 'Should you choose Medicare Advantage or Original Medicare? Compare costs, coverage, provider networks, out-of-pocket limits, and market share trends with real CMS data.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
