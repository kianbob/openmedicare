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
    default: 'OpenMedicare - Follow the Money in Medicare',
    template: '%s | OpenMedicare'
  },
  description: 'Professional data journalism tracking Medicare physician spending across 10 years (2014-2023). Explore provider payments, fraud risks, and spending trends.',
  keywords: ['Medicare', 'healthcare spending', 'physician payments', 'data journalism', 'healthcare transparency'],
  authors: [{ name: 'OpenMedicare Team' }],
  creator: 'OpenMedicare',
  publisher: 'OpenMedicare',
  metadataBase: new URL('https://openmedicare.vercel.app'),
  alternates: {},
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://openmedicare.vercel.app',
    title: 'OpenMedicare - Follow the Money in Medicare',
    description: 'AI analyzed 1.72M Medicare providers and flagged 500 for potential fraud. Exposed $854B in spending patterns across 10 years of data.',
    siteName: 'OpenMedicare',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OpenMedicare - AI-Powered Medicare Fraud Detection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thedataproject0',
    creator: '@thedataproject0',
    title: 'OpenMedicare - Follow the Money in Medicare',
    description: 'AI analyzed 1.72M Medicare providers and flagged 500 for potential fraud. $854B in spending tracked.',
    images: ['/og-image.png'],
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
  url: 'https://openmedicare.vercel.app',
  description: 'Professional data journalism tracking Medicare physician spending. Analyzing billions in Medicare payments to bring transparency to healthcare spending.',
  logo: 'https://openmedicare.vercel.app/logo.png',
  sameAs: [],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'OpenMedicare',
  url: 'https://openmedicare.vercel.app',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://openmedicare.vercel.app/search?q={search_term_string}',
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
        <ScrollToTop />
      </body>
    </html>
  )
}
