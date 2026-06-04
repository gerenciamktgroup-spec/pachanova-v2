import React from 'react';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { FileText, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FideicomisoAuditPage() {
  const audits = await db.query.fideicomisoAudits.findMany({
    orderBy: (a, { desc }) => [desc(a.createdAt)],
    limit: 50,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-white mb-2 font-display">
          Auditoría Inmutable
        </h1>
        <p className="text-sm text-pn-text-soft">
          Registros descentralizados del Fideicomiso (Fase 52) almacenados en IPFS y Arweave.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {audits.map(audit => (
          <Card key={audit.id} className="bg-pn-surface border-pn-border hover:border-pn-gold/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-1">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span className="text-xs font-mono text-pn-text-soft bg-pn-bg px-2 py-0.5 rounded border border-pn-border">
                  {new Date(audit.createdAt).toLocaleDateString()}
                </span>
              </div>
              <CardTitle className="text-sm text-white">{audit.documentType}</CardTitle>
              <CardDescription className="text-xs line-clamp-1">Propiedad ID: {audit.propertyId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs">
                <div className="text-pn-text-soft mb-1">Hash IPFS:</div>
                <div className="font-mono text-[10px] bg-black/40 p-1.5 rounded border border-pn-border break-all text-emerald-200">
                  {audit.ipfsHash}
                </div>
              </div>
              {audit.arweaveTxId && (
                <div className="text-xs">
                  <div className="text-pn-text-soft mb-1">Arweave TX:</div>
                  <div className="font-mono text-[10px] bg-black/40 p-1.5 rounded border border-pn-border break-all text-violet-300">
                    {audit.arweaveTxId}
                  </div>
                </div>
              )}
              <a 
                href={`https://ipfs.io/ipfs/${audit.ipfsHash}`} 
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 mt-2 px-3 py-2 text-xs font-medium text-white bg-pn-gold/20 hover:bg-pn-gold/30 rounded-lg transition-colors"
              >
                <FileText className="h-3 w-3" />
                Ver Documento
              </a>
            </CardContent>
          </Card>
        ))}
        
        {audits.length === 0 && (
          <div className="col-span-full p-8 text-center border border-dashed border-pn-border rounded-xl text-pn-text-soft">
            <ShieldCheck className="h-8 w-8 mx-auto mb-3 opacity-50 text-pn-gold" />
            <p className="text-sm">No hay registros de auditoría almacenados on-chain en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
