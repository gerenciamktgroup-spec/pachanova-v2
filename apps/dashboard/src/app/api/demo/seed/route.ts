import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { assertDemoRequest } from '@/server/demoActions/demoRequestGuard';

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    assertDemoRequest(req, { destructive: true });
    const { stdout, stderr } = await execAsync('pnpm --filter @pachanova/database run demo:seed');
    return NextResponse.json({ success: true, stdout, stderr });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 403 });
  }
}
