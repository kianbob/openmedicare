import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    total_providers: 1719625,
    flagged_providers: 500,
    total_payments: 854800000000,
    flagged_payments: 400000000,
    model_auc: 0.83,
    articles: 51,
    last_updated: "2026-02-21",
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
