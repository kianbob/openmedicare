import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upcoding Detector',
  description: 'Medicare upcoding analysis: which providers bill 99214 instead of 99213? The $117.7B office visit economy examined.',
  alternates: { canonical: '/fraud/upcoding' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
