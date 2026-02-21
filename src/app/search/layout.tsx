import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search OpenMedicare',
  description: 'Search across providers, states, specialties, procedures, and investigations.',
  openGraph: {
    title: 'Search OpenMedicare',
    description: 'Search across providers, states, specialties, procedures, and investigations.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
