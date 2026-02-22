import { NextResponse } from 'next/server'

export async function GET() {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: transparent; }
  .card {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-radius: 16px;
    padding: 28px 32px;
    color: white;
    max-width: 480px;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  }
  .header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  .logo {
    width: 20px; height: 20px;
    background: #3b82f6;
    border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    font-weight: bold; font-size: 11px;
  }
  .title { font-size: 14px; font-weight: 600; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; }
  .stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .stat-value { font-size: 28px; font-weight: 700; line-height: 1.2; }
  .stat-label { font-size: 11px; color: #94a3b8; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.3px; }
  .red { color: #f87171; }
  .amber { color: #fbbf24; }
  .green { color: #34d399; }
  .footer {
    display: flex; justify-content: space-between; align-items: center;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 12px;
    font-size: 11px; color: #64748b;
  }
  .footer a { color: #60a5fa; text-decoration: none; }
  .footer a:hover { text-decoration: underline; }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <div class="logo">O</div>
    <div class="title">OpenMedicare Fraud Detection</div>
  </div>
  <div class="stats">
    <div>
      <div class="stat-value red">500</div>
      <div class="stat-label">Providers Flagged</div>
    </div>
    <div>
      <div class="stat-value amber">$400M</div>
      <div class="stat-label">Flagged Payments</div>
    </div>
    <div>
      <div class="stat-value green">0.83</div>
      <div class="stat-label">Model AUC</div>
    </div>
  </div>
  <div class="footer">
    <span>1.72M providers analyzed · 2014–2023</span>
    <a href="https://www.openmedicare.com" target="_blank">www.openmedicare.com</a>
  </div>
</div>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
