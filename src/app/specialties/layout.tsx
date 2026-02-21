import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Spending by Specialty',
  description: 'Compare Medicare payments across all medical specialties. See which specialties receive the most Medicare funding.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
