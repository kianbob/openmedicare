import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Provider Lookup',
  description: 'Look up any Medicare provider by NPI. Billing history, fraud flags, and peer comparison.',
  openGraph: {
    title: 'Medicare Provider Lookup',
    description: 'Look up any Medicare provider by NPI. Billing history, fraud flags, and peer comparison.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
