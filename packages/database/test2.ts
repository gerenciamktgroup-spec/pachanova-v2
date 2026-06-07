import { getDb, schema } from './src/index';
import { eq, desc } from "drizzle-orm";

async function run() {
  try {
    const db = getDb();
    
    console.log("Running transactions query...");
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
    console.log("Transactions query successful. Rows:", txs.length);

    console.log("Running p2p query...");
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
    console.log("P2P query successful. Rows:", p2p.length);
    
    console.log("All queries successful!");
  } catch (e: any) {
    console.error("DB query failed:", e.message, e);
  }
}

run();
