import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Spending Ranked: All 50 States',
  description: 'Compare Medicare payments, provider counts, and AI-flagged fraud risks across every state. Interactive map, sortable data, 2014-2023.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
