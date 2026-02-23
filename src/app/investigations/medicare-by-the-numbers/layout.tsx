import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare By The Numbers: A Visual Data Story',
  description: '$854.8 billion in payments. 1.7 million providers. 24.5 billion services. The most striking facts from a decade of Medicare data.',
  openGraph: {
    title: 'Medicare By The Numbers: A Visual Data Story',
    description: '$854.8B spent. 4,636 impossible providers. 500 flagged for fraud. The numbers that tell the story of American healthcare.',
    url: 'https://www.openmedicare.us/investigations/medicare-by-the-numbers',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
