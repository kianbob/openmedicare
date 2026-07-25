import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Top 30 Costliest Medicare Drugs Exposed',
  description: 'Medicare drug spending exceeds $138B in 2026. The IRA\'s negotiated prices cut costs 38-79% on 10 top drugs, saving $6B in year one. Explore 10-year cost trends, top billers, and the full rankings.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
