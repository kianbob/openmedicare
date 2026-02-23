import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '400+ Services a Day: Impossible Billing',
  description: 'Some solo Medicare providers claim 400+ services per day — physically impossible. See the most extreme billing volumes exposed by the data.',
  alternates: { canonical: '/fraud/impossible-numbers' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
