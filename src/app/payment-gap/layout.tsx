import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Payment Gap Analysis',
  description: 'The difference between submitted charges and Medicare payments by specialty.',
  openGraph: {
    title: 'Medicare Payment Gap Analysis',
    description: 'The difference between submitted charges and Medicare payments by specialty.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
