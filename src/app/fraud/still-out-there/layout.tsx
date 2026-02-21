import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Still Out There — 500 ML-Flagged Medicare Providers | OpenMedicare',
  description: 'Our supervised ML model trained on 2,198 confirmed fraudsters flagged 500 Medicare providers whose billing patterns match known criminals. Interactive data explorer with charts, filters, and search.',
  openGraph: {
    title: 'Still Out There — 500 ML-Flagged Medicare Providers',
    description: 'Our ML model trained on 2,198 confirmed fraudsters flagged 500 providers billing like known criminals. Explore the data.',
    url: 'https://www.openmedicare.org/fraud/still-out-there',
    type: 'article',
    images: [{ url: 'https://www.openmedicare.org/og/still-out-there.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Still Out There — 500 ML-Flagged Medicare Providers',
    description: 'ML model trained on 2,198 confirmed fraudsters flagged 500 providers. Explore the interactive data.',
  },
}

export default function StillOutThereLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
