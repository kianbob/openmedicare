import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Cost Calculator — Free Tool',
  description: 'Estimate what Medicare actually pays for 10,000+ procedures. Search by code or name, build a cost breakdown, and compare prices instantly.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
