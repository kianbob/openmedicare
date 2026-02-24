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
          background: 'linear-gradient(135deg, #c62828 0%, #0a0a0a 100%)',
          padding: '60px 80px',
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, color: '#ef9a9a', marginBottom: 20, letterSpacing: 4, textTransform: 'uppercase' as const }}>
          OpenMedicare · Deep Dives
        </div>
        <div style={{ display: 'flex', fontSize: 56, fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
          The 20 Most Suspicious Medicare Providers in America
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#ef9a9a', lineHeight: 1.5 }}>
          AI-powered fraud detection meets investigative journalism.
        </div>
        <div style={{ display: 'flex', position: 'absolute', bottom: 40, right: 60, fontSize: 18, color: '#5c2a2a' }}>
          openmedicare.com
        </div>
      </div>
    ),
    { ...size }
  )
}
