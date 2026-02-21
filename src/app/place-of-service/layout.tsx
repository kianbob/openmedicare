import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Place of Service Analysis — OpenMedicare',
  description: 'Where Medicare services are delivered — office, facility, ASC, telehealth.',
  openGraph: {
    title: 'Medicare Place of Service Analysis — OpenMedicare',
    description: 'Where Medicare services are delivered — office, facility, ASC, telehealth.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
