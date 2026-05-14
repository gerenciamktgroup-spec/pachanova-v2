import { NextResponse } from 'next/server';
import { createIntegrationRegistry } from '@pachanova/integrations';

export async function GET() {
  try {
    const registry = createIntegrationRegistry();
    const matrix = registry.getHealthMatrix();
    return NextResponse.json({ success: true, matrix, simulated: true });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
