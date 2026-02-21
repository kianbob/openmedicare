import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Providers',
  description: 'Compare Medicare providers side by side — payments, services, specialties, and more.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
