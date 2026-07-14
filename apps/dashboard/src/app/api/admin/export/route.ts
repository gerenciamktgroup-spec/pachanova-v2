import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { desc } from 'drizzle-orm';

function toCSV(headers: string[], rows: string[][]): string {
  const escape = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [
    headers.map(escape).join(','),
    ...rows.map(row => row.map(escape).join(','))
  ].join('\n');
}

// GET /api/admin/export?type=users|audit|transactions|orders
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'users';

    let csv = '';
    let filename = '';

    if (type === 'users') {
      const investors = await db.query.investors.findMany({ limit: 1000 });
      const balances = await db.query.balances.findMany();
      const balMap = new Map(balances.map(b => [b.investorId, b]));

      filename = 'usuarios-kyc.csv';
      csv = toCSV(
        ['ID', 'Nombre', 'Email', 'KYC Status', 'Verificado', 'Rol', 'Tokens Disponibles', 'USD Disponible', 'Fecha Alta'],
        investors.map(inv => {
          const bal = balMap.get(inv.id);
          return [
            inv.id,
            `${inv.firstName || ''} ${inv.lastName || ''}`.trim(),
            inv.email,
            inv.kycStatus || 'pending',
            inv.isVerified ? 'Sí' : 'No',
            inv.role || 'investor',
            bal?.availableTokens?.toString() || '0',
            bal?.availableUsd?.toString() || '0',
            inv.createdAt?.toISOString() || '',
          ];
        })
      );
    } else if (type === 'audit') {
      const logs = await db.query.auditLogs.findMany({
        orderBy: [desc(schema.auditLogs.timestamp)],
        limit: 1000,
      });
      filename = 'auditoria.csv';
      csv = toCSV(
        ['ID', 'Acción', 'Detalles', 'Actor', 'Timestamp'],
        logs.map((l: any) => [
          l.id,
          l.action || '',
          typeof l.details === 'string' ? l.details : JSON.stringify(l.details || ''),
          l.userId || 'System',
          l.timestamp?.toISOString() || '',
        ])
      );
    } else if (type === 'transactions') {
      const ledger = await db.query.tokenLedger.findMany({
        orderBy: [desc(schema.tokenLedger.createdAt)],
        limit: 1000,
      });
      filename = 'transacciones-ledger.csv';
      csv = toCSV(
        ['ID', 'Investor ID', 'Tipo', 'Cantidad', 'TX Hash', 'Estado', 'Fecha'],
        ledger.map((tx: any) => [
          tx.id,
          tx.investorId,
          tx.operation || tx.type || '',
          tx.amount?.toString() || '0',
          tx.txHash || '',
          tx.status || 'confirmed',
          tx.createdAt?.toISOString() || '',
        ])
      );
    } else if (type === 'orders') {
      const orders = await db.query.tokenOrders.findMany({
        orderBy: [desc(schema.tokenOrders.createdAt)],
        limit: 1000,
      });
      filename = 'ordenes-token.csv';
      csv = toCSV(
        ['ID', 'Investor ID', 'Cantidad', 'Precio Unit.', 'Total USD', 'Estado', 'Fecha'],
        orders.map((o: any) => [
          o.id,
          o.investorId,
          o.quantity?.toString() || '0',
          o.pricePerToken?.toString() || '0',
          o.totalAmount?.toString() || '0',
          o.status || '',
          o.createdAt?.toISOString() || '',
        ])
      );
    } else {
      return NextResponse.json({ error: 'Invalid type. Use: users|audit|transactions|orders' }, { status: 400 });
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('CSV Export error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
