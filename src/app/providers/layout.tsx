import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Provider Directory — OpenMedicare',
  description: 'Search 1.72 million Medicare providers. Payment data, fraud flags, and peer comparisons from 10 years of CMS data.',
  openGraph: {
    title: 'Medicare Provider Directory — OpenMedicare',
    description: 'Search 1.72 million Medicare providers. Payment data, fraud flags, and peer comparisons from 10 years of CMS data.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
