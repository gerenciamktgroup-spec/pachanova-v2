import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const m2 = parseFloat(url.searchParams.get('m2') || '1');
    const pricePerSqm = 10;
    const nav = m2 * pricePerSqm;
    const pricePerToken = pricePerSqm * 0.1;

    return NextResponse.json({ 
      success: true, 
      nav, 
      pricePerSqm, 
      pricePerToken,
      source: 'simulated_oracle' 
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}
