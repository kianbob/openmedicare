import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Doctors Charge Up to 10x What Medicare Pays',
  description: 'See the staggering gap between billed charges and actual payments. Ranked by specialty, state, and provider with yearly trend data.',
  openGraph: {
    title: 'Doctors Charge Up to 10x What Medicare Pays',
    description: 'See the staggering gap between billed charges and actual payments. Ranked by specialty, state, and provider with yearly trend data.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
