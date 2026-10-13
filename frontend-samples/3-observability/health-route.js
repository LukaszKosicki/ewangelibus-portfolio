import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    status: 'healthy',
    service: 'ewangelibus-frontend',
    timestamp: new Date().toISOString(),
  });
}
