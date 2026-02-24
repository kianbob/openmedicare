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
        <div style={{ display: 'flex', fontSize: 22, color: '#ff8a80', marginBottom: 20, letterSpacing: 4, textTransform: 'uppercase' as const }}>
          OpenMedicare · Breaking Investigation
        </div>
        <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
          The Genetic Testing Gold Rush
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: '#ef9a9a', lineHeight: 1.5 }}>
          How a billion-dollar fraud scheme exploited Medicare patients
        </div>
        <div style={{ display: 'flex', position: 'absolute', bottom: 40, right: 60, fontSize: 18, color: '#5c2a2a' }}>
          openmedicare.com
        </div>
      </div>
    ),
    { ...size }
  )
}
