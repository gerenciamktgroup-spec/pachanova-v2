import { NextResponse } from 'next/server';

/**
 * Fase 140: Fleet Status API
 * Returns comprehensive fleet status across all PNC codes.
 * Shows: holdings, distribuciones, P2P trades, fideicomiso ops,
 * sane-guard compliance, and health per property.
 * 
 * GET - Returns fleet overview
 * POST - Trigger fleet health check or audit
 */
export async function GET() {
  try {
    const orq = require('../../../../../../orchestrator_agent.cjs');
    
    if (typeof orq.runFleetStatusTask === 'function') {
      const result = await orq.runFleetStatusTask();
      return NextResponse.json({
        success: true,
        ...result,
        note: 'Fase140 Fleet Status • Live data from orchestrator. DATOS REALES.',
      });
    }
    
    // Thin fallback
    return NextResponse.json({
      success: true,
      fleet: [
        { pnc: 'PNC-PAR-001', status: 'active', effHoldings: 23125, power: 3250, note: 'Paracas Land Reserve' },
        { pnc: 'PNC-SB-003', status: 'active', effHoldings: 0, power: 1250, note: 'Santa Bárbara' },
        { pnc: 'PNC-CHI-004', status: 'active', effHoldings: 0, power: 1250, note: 'Chicama' },
        { pnc: 'AET-002', status: 'active', effHoldings: 0, power: 1250, note: 'Aetheris' },
      ],
      note: 'Fase140 Fleet Status (thin fallback). Real PNC 68112.5@31639/17.1% 3250 23125 ONCHAIN @25246156.',
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
      note: 'Fase140 Fleet Status API error',
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body || {};
    const orq = require('../../../../../../orchestrator_agent.cjs');
    
    if (action === 'health_check') {
      if (typeof orq.runHealthCheckTask === 'function') {
        const result = await orq.runHealthCheckTask();
        return NextResponse.json({ success: true, ...result });
      }
      return NextResponse.json({ success: true, note: 'Health check not available yet' });
    }
    
    if (action === 'portfolio_audit') {
      if (typeof orq.runPortfolioAuditTask === 'function') {
        const result = await orq.runPortfolioAuditTask();
        return NextResponse.json({ success: true, ...result });
      }
      return NextResponse.json({ success: true, note: 'Portfolio audit not available yet' });
    }
    
    if (action === 'fleet_status') {
      if (typeof orq.runFleetStatusTask === 'function') {
        const result = await orq.runFleetStatusTask();
        return NextResponse.json({ success: true, ...result });
      }
    }
    
    return NextResponse.json({ error: 'Invalid action. Use: health_check, portfolio_audit, fleet_status' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
