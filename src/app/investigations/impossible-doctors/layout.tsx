import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Impossible Doctors — OpenMedicare',
  description: 'Medicare providers billing hundreds of services per day — physically impossible volumes that suggest fraud. Data analysis of the most extreme billing outliers.',
  openGraph: {
    title: 'The Impossible Doctors — OpenMedicare',
    description: 'Medicare providers billing hundreds of services per day — physically impossible volumes.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
