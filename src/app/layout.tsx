import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  title: {
    default: 'OpenMedicare — Where $854B in Medicare Money Really Goes',
    template: '%s | OpenMedicare'
  },
  description: 'We analyzed 1.72M Medicare providers and 10 years of payment data. AI flagged 500 for potential fraud. Search any doctor, see every dollar.',
  keywords: ['Medicare', 'healthcare spending', 'physician payments', 'data journalism', 'healthcare transparency'],
  authors: [{ name: 'OpenMedicare Team' }],
  creator: 'OpenMedicare',
  publisher: 'OpenMedicare',
  metadataBase: new URL('https://www.openmedicare.us'),
  alternates: {},
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.openmedicare.us',
    title: 'OpenMedicare — Where $854B in Medicare Money Really Goes',
    description: 'AI scanned 1.72M providers and flagged 500 for fraud patterns. 10 years of CMS data exposed. Search any doctor free.',
    siteName: 'OpenMedicare',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'OpenMedicare — AI-Powered Medicare Fraud Detection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thedataproject0',
    creator: '@thedataproject0',
    title: 'OpenMedicare — Where $854B in Medicare Money Really Goes',
    description: 'AI scanned 1.72M providers and flagged 500 for fraud patterns. 10 years of data. Search any doctor free.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OpenMedicare',
  url: 'https://www.openmedicare.us',
  description: 'Professional data journalism tracking Medicare physician spending. Analyzing billions in Medicare payments to bring transparency to healthcare spending.',
  logo: 'https://www.openmedicare.us/logo.png',
  sameAs: [],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'OpenMedicare',
  url: 'https://www.openmedicare.us',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.openmedicare.us/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Console */}
        <meta name="google-site-verification" content="pending" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-gray-50 text-gray-900 antialiased`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  )
}
