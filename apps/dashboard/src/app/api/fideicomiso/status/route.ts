import { NextResponse } from 'next/server';

import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const ops = await db.query.fideicomisoOperations.findMany({
      orderBy: [desc(schema.fideicomisoOperations.id)],
      limit: 1
    });

    let status = 'multi-sig pending 2/3';
    if (ops.length > 0) {
      const op = ops[0];
      if (op.status === 'executed_simulated' || op.status === 'executed') {
        status = 'multi-sig executed';
      } else if (op.status === 'quorum_reached') {
        status = 'multi-sig quorum reached 2/3';
      } else if (op.status === 'fiduciario_signed') {
        status = 'multi-sig fiduciario signed 1/3';
      } else if (op.status === 'proposed' || op.status === 'pending') {
        status = 'multi-sig pending 2/3';
      } else {
        status = `multi-sig ${op.status}`;
      }
    }

    return NextResponse.json({ 
      success: true, 
      status 
    });
  } catch (error) {
    console.error("Fideicomiso Status API Error:", error);
    return NextResponse.json({ 
      success: true, 
      status: 'multi-sig pending 2/3' 
    });
  }
}
