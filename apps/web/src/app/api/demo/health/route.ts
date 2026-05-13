import { NextResponse } from 'next/server';
import { createIntegrationRegistry } from '@pachanova/integrations';

export async function GET() {
  try {
    const registry = createIntegrationRegistry();
    registry.assertNoProductionConnections();
    return NextResponse.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
