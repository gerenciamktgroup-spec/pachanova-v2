import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req: Request) {
  if (process.env.DEMO_MODE !== 'true') {
    return NextResponse.json({ success: false, error: 'Not in demo mode' }, { status: 403 });
  }

  try {
    const { stdout, stderr } = await execAsync('pnpm --filter @pachanova/database run demo:reset');
    return NextResponse.json({ success: true, stdout, stderr });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
