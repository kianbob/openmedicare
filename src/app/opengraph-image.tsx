import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'OpenMedicare - Follow the Money in Medicare'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0d47a1',
          padding: '40px',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
            fontFamily: 'Georgia, serif',
          }}
        >
          OpenMedicare
        </div>
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 40,
          }}
        >
          Follow the Money in Medicare
        </div>
        <div
          style={{
            display: 'flex',
            gap: '40px',
            color: 'rgba(255,255,255,0.85)',
            fontSize: 22,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 42, fontWeight: 'bold', color: 'white' }}>1.72M</div>
            <div>Providers</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 42, fontWeight: 'bold', color: 'white' }}>$854.8B</div>
            <div>Tracked</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 42, fontWeight: 'bold', color: '#ff6b6b' }}>500</div>
            <div>AI-Flagged</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 42, fontWeight: 'bold', color: 'white' }}>53</div>
            <div>Investigations</div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 18,
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          openmedicare.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
