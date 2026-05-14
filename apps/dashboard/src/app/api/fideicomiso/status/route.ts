import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    status: 'multi-sig pending 2/3' 
  });
}
