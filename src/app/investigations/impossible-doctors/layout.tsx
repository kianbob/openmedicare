import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Impossible Doctors: Providers Billing More Services Than Hours in a Day',
  description: 'Some Medicare providers bill for more services in a day than is physically possible. We identified the most extreme cases and what their billing patterns reveal.',
  openGraph: {
    title: 'The Impossible Doctors: Providers Billing More Services Than Hours in a Day',
    description: 'Medicare providers billing physically impossible volumes — some over 1,000 services per working day.',
    url: 'https://www.openmedicare.org/investigations/impossible-doctors',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
