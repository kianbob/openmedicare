import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Where Medicare Dollars Are Spent',
  description: 'See how $800B+ in Medicare spending breaks down by setting — office visits, hospitals, ASCs, and telehealth. Interactive charts and data.',
  openGraph: {
    title: 'Where Medicare Dollars Are Spent',
    description: 'See how $800B+ in Medicare spending breaks down by setting — office visits, hospitals, ASCs, and telehealth. Interactive charts and data.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
