import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Cost Calculator',
  description: 'Estimate Medicare procedure costs based on average payment data. Search procedures and build a cost estimate.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
