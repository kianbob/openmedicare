import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '64 Medicare Investigations Exposed',
  description: 'Data-driven investigations uncovering $14.6B in Medicare fraud, impossible billing, and suspicious providers. AI-powered analysis of 1.7M+ providers.',
}

export default function InvestigationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.openmedicare.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Investigations',
        item: 'https://www.openmedicare.com/investigations',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  )
}
