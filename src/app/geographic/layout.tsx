import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Spending by Region: State & City Rankings',
  description: 'See which states and cities spend the most per Medicare beneficiary. Interactive maps reveal surprising regional gaps in healthcare costs.',
  openGraph: {
    title: 'Medicare Spending by Region: State & City Rankings',
    description: 'See which states and cities spend the most per Medicare beneficiary. Interactive maps reveal surprising regional gaps in healthcare costs.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
