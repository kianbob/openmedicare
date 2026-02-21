import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Where Does Your Medicare Dollar Go?',
  description: 'Interactive breakdown of how Medicare spends your tax dollars.',
  openGraph: {
    title: 'Where Does Your Medicare Dollar Go?',
    description: 'Interactive breakdown of how Medicare spends your tax dollars.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
