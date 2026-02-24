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
          background: 'linear-gradient(135deg, #1a237e 0%, #000000 100%)',
          padding: '60px 80px',
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, color: '#80cbc4', marginBottom: 20, letterSpacing: 4, textTransform: 'uppercase' as const }}>
          OpenMedicare · Investigation
        </div>
        <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
          4,636 Impossible Doctors
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: '#b0bec5', lineHeight: 1.5 }}>
          Medicare providers who appear in the data but may not exist
        </div>
        <div style={{ display: 'flex', position: 'absolute', bottom: 40, right: 60, fontSize: 18, color: '#455a64' }}>
          openmedicare.com
        </div>
      </div>
    ),
    { ...size }
  )
}
