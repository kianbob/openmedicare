import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rural vs Urban: The Medicare Spending Divide',
  description: 'Explore the stark gap between rural and urban Medicare costs. Compare provider access, pricing differences, and where your tax dollars go.',
  openGraph: {
    title: 'Rural vs Urban: The Medicare Spending Divide',
    description: 'Explore the stark gap between rural and urban Medicare costs. Compare provider access, pricing differences, and where your tax dollars go.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
