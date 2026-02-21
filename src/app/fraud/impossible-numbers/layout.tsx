import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impossible Numbers',
  description: "Providers billing physically impossible volumes — 400+ services per day as a single practitioner. The math doesn't add up.",
  alternates: { canonical: '/fraud/impossible-numbers' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
