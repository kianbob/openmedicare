import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Still Out There — 500 ML-Flagged Medicare Providers | OpenMedicare',
  description:
    'A supervised ML model trained on 2,198 confirmed fraudsters scored 1.7M Medicare providers. These 500 unflagged providers bill like known criminals but haven\'t been caught.',
  openGraph: {
    title: 'Still Out There — 500 ML-Flagged Medicare Providers',
    description:
      'A supervised ML model trained on 2,198 confirmed fraudsters identified 500 unflagged providers whose billing patterns match known fraud.',
    url: 'https://www.openmedicare.com/fraud/still-out-there',
    siteName: 'OpenMedicare',
    type: 'article',
    images: [
      {
        url: 'https://www.openmedicare.com/og/still-out-there.png',
        width: 1200,
        height: 630,
        alt: 'Still Out There: 500 ML-Flagged Medicare Providers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Still Out There — 500 ML-Flagged Medicare Providers',
    description:
      'ML model trained on 2,198 confirmed fraudsters flags 500 unflagged providers billing like known criminals.',
  },
}

export default function StillOutThereLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
