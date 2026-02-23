import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Geographic Pay Gaps Exposed',
  description: 'Explore how location changes what Medicare pays doctors. Compare cost adjustments across 3,000+ regions with interactive maps and data.',
  openGraph: {
    title: 'Medicare Geographic Pay Gaps Exposed',
    description: 'Explore how location changes what Medicare pays doctors. Compare cost adjustments across 3,000+ regions with interactive maps and data.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
