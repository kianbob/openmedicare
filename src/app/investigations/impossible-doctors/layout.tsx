import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Impossible Doctors: When the Math Doesn\'t Add Up',
  description: 'Individual providers billing 400+ services per day. A new patient every 1-2 minutes for 8 hours straight. The math doesn\'t work.',
  alternates: { canonical: '/investigations/impossible-doctors' },
  openGraph: {
    title: 'The Impossible Doctors: When the Math Doesn\'t Add Up',
    description: 'Individual providers billing 400+ services per day. The math doesn\'t work.',
    url: 'https://www.openmedicare.org/investigations/impossible-doctors',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
