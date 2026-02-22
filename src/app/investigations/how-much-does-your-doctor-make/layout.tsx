import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Much Does Your Doctor Make From Medicare? | OpenMedicare',
  description: 'Look up any medical specialty and see how much Medicare pays providers — average earnings, top earners, and state-by-state breakdowns from 10 years of public data.',
  openGraph: {
    title: 'How Much Does Your Doctor Make From Medicare?',
    description: 'Pick a specialty. See what Medicare actually pays. Based on 10 years of real billing data.',
    url: 'https://www.openmedicare.com/investigations/how-much-does-your-doctor-make',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
