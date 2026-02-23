import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Top 500 Medicare Procedures by Spending',
  description: 'Browse the 500 most expensive Medicare procedures and drugs. Search by code, see total costs, and find where billions in taxpayer money goes.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
