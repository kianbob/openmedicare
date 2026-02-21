import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Spending by State',
  description: 'Explore Medicare provider payments across all 50 states and territories. Sortable by payments, providers, services, and markup ratio.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
