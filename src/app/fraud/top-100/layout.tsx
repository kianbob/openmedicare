import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Top 100 Riskiest Medicare Providers',
  description:
    'AI ranked 1.7M providers using 2,198 convicted fraudsters. See the 100 most suspicious Medicare billers and their red flags.',
  keywords: [
    'top medicare fraud providers',
    'medicare fraud list',
    'medicare fraud providers 2025',
    'AI flagged medicare providers',
    'medicare billing fraud',
    'medicare provider fraud ranking',
    'highest risk medicare providers',
  ],
  alternates: { canonical: '/fraud/top-100' },
  openGraph: {
    title: 'Top 100 Riskiest Medicare Providers',
    description:
      'AI ranked 1.7M providers using 2,198 convicted fraudsters. See the 100 most suspicious Medicare billers and their red flags.',
    url: 'https://www.openmedicare.us/fraud/top-100',
    siteName: 'OpenMedicare',
    type: 'article',
    images: [
      {
        url: 'https://www.openmedicare.us/og/still-out-there.png',
        width: 1200,
        height: 630,
        alt: 'Top 100 Riskiest Medicare Providers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top 100 Riskiest Medicare Providers',
    description:
      'AI ranked 1.7M providers using 2,198 convicted fraudsters. See the 100 most suspicious Medicare billers.',
  },
}

export default function Top100Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
