import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Much Does Your Doctor Make from Medicare?',
  description: 'Look up any doctor\'s Medicare payments instantly. Search 1.82M providers to see exactly what Medicare paid them — broken down by procedure.',
}

export default function HowMuchPage() {
  redirect('/your-medicare-dollar')
}
