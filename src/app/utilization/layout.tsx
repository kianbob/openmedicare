import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Utilization Breakdown',
  description: 'Explore which Medicare services are surging, shrinking, or shifting. 96M+ claims reveal hidden patterns in how care is actually delivered.',
  openGraph: {
    title: 'Medicare Utilization Breakdown',
    description: 'Explore which Medicare services are surging, shrinking, or shifting. 96M+ claims reveal hidden patterns in how care is actually delivered.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
