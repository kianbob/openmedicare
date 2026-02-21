import type { Metadata } from 'next'
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics placeholder */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Google Analytics will be added here
              console.log('Google Analytics placeholder');
            `,
          }}
        />
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