import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Procedure Explorer',
  description: 'Browse the top 500 Medicare procedures and drugs by total spending. Search by code or description.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
