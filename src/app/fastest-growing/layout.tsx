import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fastest Growing Medicare Spending',
  description: 'Which specialties, states, and provider types saw the biggest Medicare payment increases from 2014-2023. Nurse practitioners up 270%, Idaho up 150%.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
