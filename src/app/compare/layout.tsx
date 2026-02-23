import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Medicare Providers Side by Side',
  description: 'Compare any two Medicare doctors head-to-head. See who bills more, treats more patients, and how their payments stack up.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
