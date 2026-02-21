import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'OpenMedicare - $854.8B in Medicare Payments Exposed'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-2px',
            }}
          >
            OpenMedicare
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.95)',
              textAlign: 'center',
            }}
          >
            $854.8B in Medicare Payments Exposed
          </div>
          <div
            style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              marginTop: '8px',
            }}
          >
            23 Investigations · 500 Flagged Providers · 3,100+ Pages of Data
          </div>
          <div
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.6)',
              marginTop: '32px',
            }}
          >
            openmedicare.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
