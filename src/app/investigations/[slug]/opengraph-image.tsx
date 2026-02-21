import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'OpenMedicare Investigation'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const slugToTitle: Record<string, string> = {
  'covid-test-scheme': 'The COVID Test Scheme',
  'wound-care-crisis': 'The Wound Care Crisis',
  'impossible-doctors': 'The Impossible Doctors',
  'markup-machine': 'The Markup Machine',
  'medicare-millionaires': 'Medicare Millionaires',
  'biggest-billers': 'The Biggest Billers',
  'corporate-medicine': 'Corporate Medicine',
  'anesthesia-markup': 'The Anesthesia Markup',
  'specialty-gap': 'The Specialty Gap',
  'specialty-pay-gap': 'The Specialty Pay Gap',
  'ten-year-explosion': 'The Ten-Year Explosion',
  'geographic-inequality': 'Geographic Inequality',
  'covid-impact': 'COVID Impact on Medicare',
  'drug-money': 'Drug Money',
  'drug-pipeline': 'The Drug Pipeline',
  'eye-care-billions': 'Eye Care Billions',
  'medicare-biggest-spenders': 'Medicare\'s Biggest Spenders',
  'office-visit-economy': 'The Office Visit Economy',
  'pandemic-recovery': 'Pandemic Recovery',
  'rural-price-tag': 'The Rural Price Tag',
  'specialty-monopoly': 'The Specialty Monopoly',
  'state-spending-divide': 'The State Spending Divide',
  'where-medicare-dollar-goes': 'Where the Medicare Dollar Goes',
}

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const title = slugToTitle[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '3px',
          }}
        >
          OpenMedicare Investigation
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: '900px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.6)',
            marginTop: '48px',
          }}
        >
          openmedicare.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
