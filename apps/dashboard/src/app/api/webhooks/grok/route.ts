import { NextResponse } from "next/server";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, sql } from "drizzle-orm";
import { schema } from "@pachanova/database";

// Endpoint to receive Webhooks from Grok's Orchestrator (Core)
// Example Payload from Grok:
// { "event": "onchain_execution_complete", "propertyId": "PNC-PAR-001", "transactionHash": "0x123...", "amount": 500, "investorEmail": "admin@tuempresa.com" }

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[WEBHOOK] Received from Grok:", body);

    if (body.event === "onchain_execution_complete") {
      const client = postgres(process.env.DATABASE_URL!);
      const db = drizzle(client, { schema });

      const property = await db.query.properties.findFirst({
        where: eq(schema.properties.id, body.propertyId) // This expects Grok to send the exact ID or a mapped code
      });

      if (!property) {
        return NextResponse.json({ success: false, error: "Propiedad no encontrada en frontend V2" }, { status: 404 });
      }

      const inv = await db.query.investors.findFirst({
        where: eq(schema.investors.email, body.investorEmail)
      });

      if (!inv) {
        return NextResponse.json({ success: false, error: "Inversor no encontrado en frontend V2" }, { status: 404 });
      }

      // We can update the transaction record with the hash
      await db.update(schema.transactions)
        .set({ txHash: body.transactionHash, status: "completed" })
        .where(
          sql`${schema.transactions.propertyId} = ${property.id} AND ${schema.transactions.senderId} = ${inv.id} AND ${schema.transactions.txHash} IS NULL`
        );
        
      return NextResponse.json({ success: true, message: "On-chain data synced correctly with PachaNova V2" });
    }

    return NextResponse.json({ success: true, message: "Event ignored" });
  } catch (e: any) {
    console.error("[WEBHOOK] Error processing:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
