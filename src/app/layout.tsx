import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

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
    default: 'OpenMedicare - Follow the Money in Medicare',
    template: '%s | OpenMedicare'
  },
  description: 'Professional data journalism tracking Medicare physician spending across 10 years (2014-2023). Explore provider payments, fraud risks, and spending trends.',
  keywords: ['Medicare', 'healthcare spending', 'physician payments', 'data journalism', 'healthcare transparency'],
  authors: [{ name: 'OpenMedicare Team' }],
  creator: 'OpenMedicare',
  publisher: 'OpenMedicare',
  metadataBase: new URL('https://www.openmedicare.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.openmedicare.org',
    title: 'OpenMedicare - Follow the Money in Medicare',
    description: 'Professional data journalism tracking Medicare physician spending across 10 years (2014-2023).',
    siteName: 'OpenMedicare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenMedicare - Follow the Money in Medicare',
    description: 'Professional data journalism tracking Medicare physician spending across 10 years (2014-2023).',
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
  url: 'https://www.openmedicare.org',
  description: 'Professional data journalism tracking Medicare physician spending. Analyzing billions in Medicare payments to bring transparency to healthcare spending.',
  logo: 'https://www.openmedicare.org/logo.png',
  sameAs: [],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'OpenMedicare',
  url: 'https://www.openmedicare.org',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.openmedicare.org/lookup?q={search_term_string}',
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
      </body>
    </html>
  )
}
