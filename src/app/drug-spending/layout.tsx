import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Drug Spending Analysis',
  description: 'How prescription drug spending in Medicare is growing and which drugs cost the most.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
