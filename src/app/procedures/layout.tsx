import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Procedure Costs — Search 500 Procedures | OpenMedicare',
  description: 'How much does Medicare pay for common procedures? Search 500 procedures by cost, compare most vs least expensive, and explore 10-year spending trends with provider data.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
