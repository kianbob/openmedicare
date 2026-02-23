import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '200+ Medicare & Fraud Terms Defined',
  description: 'A-Z glossary of Medicare billing codes, fraud detection metrics, and key terms. Plain-English definitions for every abbreviation and concept.',
  openGraph: {
    title: '200+ Medicare & Fraud Terms Defined',
    description: 'A-Z glossary of Medicare billing codes, fraud detection metrics, and key terms. Plain-English definitions for every abbreviation and concept.',
  },
}

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return children
}
