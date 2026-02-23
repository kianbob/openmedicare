import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Where Your Medicare Dollar Goes',
  description: 'See exactly how every $1 of Medicare spending breaks down. Interactive charts reveal where $854B in taxpayer money flows — and what surprises most people.',
  openGraph: {
    title: 'Where Your Medicare Dollar Goes | OpenMedicare',
    description: 'See exactly how every $1 of Medicare spending breaks down. Interactive charts reveal where $854B in taxpayer money flows — and what surprises most people.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
