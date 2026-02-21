import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Utilization Analysis',
  description: 'Patterns in Medicare service utilization and how it has changed over time.',
  openGraph: {
    title: 'Medicare Utilization Analysis',
    description: 'Patterns in Medicare service utilization and how it has changed over time.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
