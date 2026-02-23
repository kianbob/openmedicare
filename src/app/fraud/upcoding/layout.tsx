import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '$117.7B in Office Visits: Who\'s Upcoding',
  description: 'See which Medicare providers bill 99214 instead of 99213 — and who profits most from the $117.7B office visit economy. Data on every doctor.',
  alternates: { canonical: '/fraud/upcoding' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
