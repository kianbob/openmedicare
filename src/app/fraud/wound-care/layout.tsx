import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wound Care: DOJ\'s #1 Fraud Target',
  description: 'Exposed: skin substitute schemes and debridement markups costing Medicare billions. See why DOJ is cracking down and who\'s flagged.',
  alternates: { canonical: '/fraud/wound-care' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
