import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Glossary — Medicare & Fraud Detection Terms | OpenMedicare',
  description: 'Comprehensive A-Z glossary of Medicare terminology, fraud detection metrics, billing codes, and machine learning concepts used in OpenMedicare analysis.',
  openGraph: {
    title: 'Medicare & Fraud Detection Glossary',
    description: 'Definitions for every term, metric, and abbreviation used across OpenMedicare.',
  },
}

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return children
}
