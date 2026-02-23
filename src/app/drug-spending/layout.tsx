import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Top 30 Costliest Medicare Drugs Exposed',
  description: 'Drug spending hit 14.8% of all Medicare payments. See which 5 drugs drain billions yearly, track 10-year cost trends, and explore the full rankings.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
