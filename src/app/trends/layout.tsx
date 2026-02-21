import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Spending Trends — OpenMedicare',
  description: 'A decade of Medicare provider payments from 2014 to 2023. Track growth, COVID impact, and year-over-year changes.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
