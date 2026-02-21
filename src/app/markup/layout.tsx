import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Markup Analysis — OpenMedicare',
  description: 'The gap between what doctors charge and what Medicare pays across specialties and providers.',
  openGraph: {
    title: 'Medicare Markup Analysis — OpenMedicare',
    description: 'The gap between what doctors charge and what Medicare pays across specialties and providers.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
