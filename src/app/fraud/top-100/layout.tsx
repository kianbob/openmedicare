import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Top 100 AI-Flagged Medicare Providers — Highest Fraud Probability | OpenMedicare',
  description:
    'The top 100 Medicare providers most likely to be committing fraud, ranked by AI probability score. ML model trained on 2,198 confirmed fraudsters scored 1.7M providers.',
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
    title: 'Top 100 AI-Flagged Medicare Providers',
    description:
      'The 100 Medicare providers with the highest AI-predicted fraud probability. Trained on 2,198 confirmed fraudsters, scoring 1.7M providers.',
    url: 'https://www.openmedicare.com/fraud/top-100',
    siteName: 'OpenMedicare',
    type: 'article',
    images: [
      {
        url: 'https://www.openmedicare.com/og/still-out-there.png',
        width: 1200,
        height: 630,
        alt: 'Top 100 AI-Flagged Medicare Providers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top 100 AI-Flagged Medicare Providers',
    description:
      'ML model trained on 2,198 confirmed fraudsters ranks the top 100 highest-risk Medicare providers.',
  },
}

export default function Top100Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
