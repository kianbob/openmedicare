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
    url: `https://openmedicare.vercel.app${url}`,
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      '@type': 'Organization',
      name: 'OpenMedicare',
      url: 'https://openmedicare.vercel.app',
    },
    publisher: {
      '@type': 'Organization',
      name: 'OpenMedicare',
      url: 'https://openmedicare.vercel.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://openmedicare.vercel.app/og-image.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://openmedicare.vercel.app${url}`,
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
