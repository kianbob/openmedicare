interface ArticleJsonLdProps {
  title: string
  description: string
  url: string
  publishedDate: string
  modifiedDate?: string
  imageUrl?: string
}

export default function ArticleJsonLd({
  title,
  description,
  url,
  publishedDate,
  modifiedDate,
  imageUrl,
}: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `https://www.openmedicare.org${url}`,
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      '@type': 'Organization',
      name: 'OpenMedicare',
      url: 'https://www.openmedicare.org',
    },
    publisher: {
      '@type': 'Organization',
      name: 'OpenMedicare',
      url: 'https://www.openmedicare.org',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.openmedicare.org/og-image.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.openmedicare.org${url}`,
    },
    ...(imageUrl ? { image: imageUrl } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
