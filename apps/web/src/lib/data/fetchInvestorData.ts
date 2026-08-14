import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { InvestorDashboardView, LedgerEntryView } from "@/types/product";
import { db } from "@/server/db";
import * as schema from "@pachanova/database/src/schema";
import { eq } from "drizzle-orm";

type SupabaseLedgerRow = {
  id: string;
  type?: string | null;
  operation?: string | null;
  amount?: string | number | null;
  created_at?: string | null;
  timestamp?: string | null;
  tx_hash?: string | null;
  status?: string | null;
};

function operationType(operation: string | null | undefined): LedgerEntryView["operationType"] {
  const normalized = operation?.toLowerCase();
  if (normalized === "mint") return "MINT";
  if (normalized === "burn") return "BURN";
  if (normalized === "genesis_purchase") return "GENESIS_PURCHASE";
  return "TRANSFER";
}

function transactionStatus(status: string | null | undefined): LedgerEntryView["status"] {
  return status === "failed" ? "failed" : status === "pending" ? "pending" : "confirmed";
}

export async function fetchInvestorData(): Promise<InvestorDashboardView | null> {
  try {
    if (process.env.DEMO_MODE === 'true') {
      // 1. Fetch default demo investor from Drizzle
      const investor = await db.query.investors.findFirst({
        where: eq(schema.investors.email, "demo.investor.approved@pachanova.local")
      });

      if (!investor) {
        console.error("Demo investor not found in local Drizzle DB!");
        return null;
      }

      // 2. Balance
      const balance = await db.query.balances.findFirst({
        where: eq(schema.balances.investorId, investor.id)
      });

      // 3. Transactions
      const transactions = await db.query.tokenLedger.findMany({
        where: eq(schema.tokenLedger.investorId, investor.id),
        orderBy: (table, { desc }) => [desc(table.timestamp)],
        limit: 10
      });

      // 4. KYC Status
      const kycDocs = await db.query.kycDocuments.findMany({
        where: eq(schema.kycDocuments.investorId, investor.id),
        orderBy: (table, { desc }) => [desc(table.createdAt)],
        limit: 1
      });

      const kycStatus = kycDocs && kycDocs.length > 0 ? kycDocs[0].status : (investor.kycStatus || "pending");

      return {
        investor: {
          id: investor.id,
          fullName: `${investor.firstName} ${investor.lastName}`.trim(),
          email: investor.email,
          kycStatus: kycStatus as "pending" | "approved" | "rejected",
          isVerified: investor.isVerified || false,
          balance: {
            investorId: investor.id,
            availableTokens: balance?.availableTokens?.toString() || "0",
            lockedTokens: balance?.lockedTokens?.toString() || "0",
            availableUsd: balance?.availableUsd?.toString() || "0",
            lockedUsd: "0",
            lastUpdated: balance?.lastUpdatedAt?.toISOString() || new Date().toISOString()
          }
        },
        recentTransactions: transactions.map((tx) => ({
          id: tx.id,
          operationType: operationType(tx.operation),
          amount: tx.amount?.toString() || "0",
          timestamp: tx.timestamp.toISOString(),
          txHash: tx.txHash || null,
          status: "confirmed"
        })),
        kycVerificationProvider: "SIMULATED",
        paymentsReadiness: {
          provider: "MERCADOPAGO",
          status: "PENDING_CREDENTIALS",
          lastPing: null,
          message: "No credentials"
        },
        contractReadiness: {
          provider: "FOUNDRY",
          status: "PENDING_FOUNDRY",
          lastPing: null,
          message: "Node inactive"
        }
      };
    }

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // 1. Investor
    const { data: investor, error: investorError } = await supabase
      .from("investors")
      .select("*")
      .eq("supabase_auth_id", user.id)
      .single();

    if (investorError || !investor) {
      console.error("Investor not found in DB:", investorError);
      return null;
    }

    // 2. Balance
    const { data: balance } = await supabase
      .from("balances")
      .select("*")
      .eq("investor_id", investor.id)
      .single();

    // 3. Transactions
    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("investor_id", investor.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // 4. Token Ledger (using transactions as proxy for ledger view for now)
    const { data: tokenLedger } = await supabase
      .from("token_ledger")
      .select("*")
      .eq("investor_id", investor.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // 5. KYC (check kyc_documents, fallback to investor status)
    const { data: kycDocs } = await supabase
      .from("kyc_documents")
      .select("status")
      .eq("investor_id", investor.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const kycStatus = kycDocs && kycDocs.length > 0 ? kycDocs[0].status : (investor.kyc_status || "pending");

    const rawTxs = (tokenLedger && tokenLedger.length > 0) ? tokenLedger : (transactions || []);

    return {
      investor: {
        id: investor.id,
        fullName: `${investor.first_name} ${investor.last_name}`.trim(),
        email: investor.email,
        kycStatus: kycStatus as "pending" | "approved" | "rejected",
        isVerified: investor.is_verified || false,
        balance: {
          investorId: investor.id,
          availableTokens: balance?.available_tokens?.toString() || "0",
          lockedTokens: balance?.locked_tokens?.toString() || "0",
          availableUsd: balance?.available_usd?.toString() || "0",
          lockedUsd: balance?.locked_usd?.toString() || "0",
          lastUpdated: balance?.last_updated_at || new Date().toISOString()
        }
      },
      recentTransactions: (rawTxs as SupabaseLedgerRow[]).map((tx) => ({
        id: tx.id,
        operationType: operationType(tx.operation || tx.type),
        amount: tx.amount?.toString() || "0",
        timestamp: tx.timestamp || tx.created_at || new Date().toISOString(),
        txHash: tx.tx_hash || null,
        status: transactionStatus(tx.status)
      })),
      kycVerificationProvider: "SIMULATED",
      paymentsReadiness: {
        provider: "MERCADOPAGO",
        status: "PENDING_CREDENTIALS",
        lastPing: null,
        message: "No credentials"
      },
      contractReadiness: {
        provider: "FOUNDRY",
        status: "PENDING_FOUNDRY",
        lastPing: null,
        message: "Node inactive"
      }
    };
  } catch (error) {
    console.error("Error fetching investor view model:", error);
    return null;
  }
}
