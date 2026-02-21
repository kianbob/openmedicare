import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rural vs Urban Medicare Spending',
  description: 'How Medicare spending differs between rural and urban America — access, pricing, and provider distribution.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
