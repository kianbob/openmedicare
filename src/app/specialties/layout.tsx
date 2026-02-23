import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Spending by Specialty (Ranked)',
  description: 'See which medical specialties get the most Medicare money. Explore $854B in payments ranked by total spending, per-provider averages, and more.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
