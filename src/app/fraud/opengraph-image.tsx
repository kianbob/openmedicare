import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #b71c1c 0%, #1a0a0a 100%)',
          padding: '60px 80px',
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ display: 'flex', fontSize: 24, color: '#ef9a9a', marginBottom: 24, letterSpacing: 4, textTransform: 'uppercase' as const }}>
          OpenMedicare · Fraud Hub
        </div>
        <div style={{ display: 'flex', fontSize: 52, fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
          $854.8 Billion in Medicare Payments. Our AI Flagged $400M.
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#ef9a9a', lineHeight: 1.5 }}>
          500 Providers. 8,300+ Confirmed Fraudsters Used as Training Data.
        </div>
        <div style={{ display: 'flex', position: 'absolute', bottom: 40, right: 60, fontSize: 18, color: '#5c2a2a' }}>
          openmedicare.com
        </div>
      </div>
    ),
    { ...size }
  )
}
