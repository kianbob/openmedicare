import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Geographic Medicare Spending — OpenMedicare',
  description: 'Regional variation in Medicare spending. Which states and cities spend the most per beneficiary?',
  openGraph: {
    title: 'Geographic Medicare Spending — OpenMedicare',
    description: 'Regional variation in Medicare spending. Which states and cities spend the most per beneficiary?',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
