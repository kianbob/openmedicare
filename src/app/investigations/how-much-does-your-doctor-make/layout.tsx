import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Much Does Your Doctor Make?',
  description: 'Look up any specialty to see real Medicare pay data. Average earnings, top billers, and state breakdowns from 10 years of claims.',
  openGraph: {
    title: 'How Much Does Your Doctor Make?',
    description: 'Look up any specialty to see real Medicare pay data. Average earnings, top billers, and state breakdowns from 10 years of claims.',
    url: 'https://www.openmedicare.us/investigations/how-much-does-your-doctor-make',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
