import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Gap: What Doctors Bill vs. Get Paid',
  description: 'Exposed: the gap between what doctors charge and what Medicare actually pays. Compare markups across 70+ specialties with 10 years of data.',
  openGraph: {
    title: 'Payment Gap: What Doctors Bill vs. Get Paid',
    description: 'Exposed: the gap between what doctors charge and what Medicare actually pays. Compare markups across 70+ specialties with 10 years of data.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
