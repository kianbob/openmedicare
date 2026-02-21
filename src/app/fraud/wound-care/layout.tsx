import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wound Care Fraud Watchlist',
  description: "DOJ's #1 fraud target: wound care billing. Analysis of skin substitute codes, debridement markups, and suspicious providers.",
  alternates: { canonical: '/fraud/wound-care' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
