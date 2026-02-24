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
          background: 'linear-gradient(135deg, #0d47a1 0%, #0a1628 100%)',
          padding: '60px 80px',
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, color: '#ffd54f', marginBottom: 20, letterSpacing: 4, textTransform: 'uppercase' as const }}>
          OpenMedicare · Investigation
        </div>
        <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
          {"Medicare's Millionaire Doctors"}
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: '#b0bec5', lineHeight: 1.5 }}>
          The providers billing $1M+ per year
        </div>
        <div style={{ display: 'flex', position: 'absolute', bottom: 40, right: 60, fontSize: 18, color: '#455a64' }}>
          openmedicare.com
        </div>
      </div>
    ),
    { ...size }
  )
}
