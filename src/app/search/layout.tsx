import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search 1.72M Providers & Doctors',
  description: 'Look up any Medicare doctor by name, NPI, state, or specialty. 10 years of payment data, fraud flags, and billing patterns for 1.72M providers.',
  openGraph: {
    title: 'Search 1.72M Providers & Doctors',
    description: 'Look up any Medicare doctor by name, NPI, state, or specialty. 10 years of payment data, fraud flags, and billing patterns for 1.72M providers.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
