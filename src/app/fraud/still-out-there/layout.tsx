import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '500 Unflagged Providers Exposed by AI',
  description:
    'Our ML model trained on 2,198 convicted fraudsters found 500 providers nobody flagged. Their billing mirrors known criminals — see who made the list.',
  openGraph: {
    title: '500 Unflagged Providers Exposed by AI | OpenMedicare',
    description:
      'Our ML model trained on 2,198 convicted fraudsters found 500 providers nobody flagged. Their billing mirrors known criminals — see who made the list.',
    url: 'https://www.openmedicare.us/fraud/still-out-there',
    siteName: 'OpenMedicare',
    type: 'article',
    images: [
      {
        url: 'https://www.openmedicare.us/og/still-out-there.png',
        width: 1200,
        height: 630,
        alt: 'Still Out There: 500 ML-Flagged Medicare Providers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '500 Unflagged Providers Exposed by AI | OpenMedicare',
    description:
      'Our ML model trained on 2,198 convicted fraudsters found 500 providers nobody flagged. Their billing mirrors known criminals — see who made the list.',
  },
}

export default function StillOutThereLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
