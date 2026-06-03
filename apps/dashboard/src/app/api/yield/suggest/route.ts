import { NextRequest, NextResponse } from 'next/server';
import { suggestYieldToCoreMaestro } from "@pachanova/integrations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const yieldData = body.yieldData;
    const email = body.investorEmail || 'demo.investor.holder@pachanova.local';

    if (!yieldData) {
      return NextResponse.json({ success: false, error: 'yieldData is required' }, { status: 400 });
    }

    const res = await suggestYieldToCoreMaestro(yieldData, email);
    return NextResponse.json({ success: true, ...res });
  } catch (e: any) {
    console.error('[API suggest error]', e?.message || e);
    return NextResponse.json({ success: false, error: String(e?.message || e) }, { status: 500 });
  }
}
