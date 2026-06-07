import { getDb, schema } from "@pachanova/database";
import { ApprovalsClient } from "./ApprovalsClient";
import { eq, desc } from "drizzle-orm";

// Habilitar renderizado dinámico porque lee de DB y necesita estar fresco
export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const db = getDb();

  try {
    // 1. Obtener Transacciones (Fondeos/Retiros) pendientes
    const txs = await db.select({
      id: schema.transactions.id,
      type: schema.transactions.type,
      amount: schema.transactions.amount,
      date: schema.transactions.createdAt,
      status: schema.transactions.status,
      investorId: schema.transactions.receiverId,
    }).from(schema.transactions)
      .where(eq(schema.transactions.status, "pending"))
      .orderBy(desc(schema.transactions.createdAt));

    // 2. Obtener P2P Trades pendientes
    const p2p = await db.select({
      id: schema.p2pTrades.id,
      amount: schema.p2pTrades.totalAmount,
      fee: schema.p2pTrades.feeAmount,
      date: schema.p2pTrades.createdAt,
      status: schema.p2pTrades.status,
      buyerId: schema.p2pTrades.buyerInvestorId,
    }).from(schema.p2pTrades)
      .where(eq(schema.p2pTrades.status, "pending_approval"))
      .orderBy(desc(schema.p2pTrades.createdAt));

    // Obtener inversores para mapear nombres (Simplificado, idealmente usar JOINs)
    const investors = await db.select({
      id: schema.investors.id,
      email: schema.investors.email,
      firstName: schema.investors.firstName,
      lastName: schema.investors.lastName
    }).from(schema.investors);

    const investorMap = investors.reduce((acc, inv) => {
      acc[inv.id] = { name: `${inv.firstName || ''} ${inv.lastName || ''}`.trim() || 'Inversor', email: inv.email };
      return acc;
    }, {} as Record<string, {name: string, email: string}>);

    // Mapear al formato del Client Component
    const unifiedApprovals = [
      ...txs.map(t => ({
        id: t.id,
        type: t.type?.toUpperCase() || "UNKNOWN",
        user: t.investorId ? investorMap[t.investorId]?.name || "Desconocido" : "Sistema",
        email: t.investorId ? investorMap[t.investorId]?.email || "" : "",
        amount: `$${t.amount} USD`,
        fee: "-",
        date: t.date.toLocaleString(),
        status: t.status.toUpperCase(),
      })),
      ...p2p.map(p => ({
        id: p.id,
        type: "P2P_TRADE",
        user: investorMap[p.buyerId]?.name || "Desconocido",
        email: investorMap[p.buyerId]?.email || "",
        amount: `$${p.amount} USD`,
        fee: `$${p.fee} USD`,
        date: p.date.toLocaleString(),
        status: p.status === "pending_approval" ? "PENDING" : p.status.toUpperCase(),
      }))
    ];

    // Ordenar por fecha (más recientes primero)
    unifiedApprovals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return <ApprovalsClient initialApprovals={unifiedApprovals} />;

  } catch (error) {
    console.error("Error loading approvals:", error);
    return (
      <div className="p-8 text-center text-pn-danger">
        Error al cargar las solicitudes. Verifica la conexión a la base de datos.
      </div>
    );
  }
}
