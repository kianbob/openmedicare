import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '10-Year Medicare Spending Trends',
  description: 'Track $2T+ in Medicare payments from 2014–2023. See year-over-year growth, COVID impact, and the specialties driving the biggest cost surges.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
