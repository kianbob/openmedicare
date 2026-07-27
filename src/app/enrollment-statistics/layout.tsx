import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Enrollment Statistics: 67M+ Beneficiaries & Growth Trends',
  description: 'How many people are on Medicare? Explore enrollment growth from 1966 to 2024, demographic breakdowns, Medicare Advantage market share, and state-by-state enrollment data.',
  openGraph: {
    title: 'Medicare Enrollment Statistics: 67M+ Beneficiaries & Growth Trends',
    description: 'How many people are on Medicare? Explore enrollment growth from 1966 to 2024, demographic breakdowns, Medicare Advantage market share, and state-by-state enrollment data.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
