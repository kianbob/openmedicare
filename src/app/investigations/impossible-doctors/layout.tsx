import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Impossible Doctors: 400+ Services/Day',
  description: '4,636 Medicare providers bill more services per day than is physically possible. One billed 9,862. We did the math on every single one.',
  openGraph: {
    title: 'The Impossible Doctors: 400+ Services/Day',
    description: '4,636 Medicare providers bill more services per day than is physically possible. One billed 9,862. We did the math on every single one.',
    url: 'https://www.openmedicare.us/investigations/impossible-doctors',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
