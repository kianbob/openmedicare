import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Cost Adjustment Analysis — OpenMedicare',
  description: 'How geographic adjustments affect Medicare payments across regions.',
  openGraph: {
    title: 'Medicare Cost Adjustment Analysis — OpenMedicare',
    description: 'How geographic adjustments affect Medicare payments across regions.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
