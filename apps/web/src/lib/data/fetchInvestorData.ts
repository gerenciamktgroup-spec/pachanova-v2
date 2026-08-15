import { createServerClient } from "@/utils/supabase/server";
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

const FALLBACK_INVESTOR_DATA: InvestorDashboardView = {
  investor: {
    id: "demo-investor-123",
    fullName: "Inversor Demo (Respaldo)",
    email: "investor@pachanova.local",
    kycStatus: "approved",
    isVerified: true,
    balance: {
      investorId: "demo-investor-123",
      availableTokens: "1250",
      lockedTokens: "0",
      availableUsd: "5000",
      lockedUsd: "0",
      lastUpdated: new Date().toISOString()
    }
  },
  recentTransactions: [
    {
      id: "tx-demo-1",
      operationType: "GENESIS_PURCHASE",
      amount: "1250",
      timestamp: new Date().toISOString(),
      txHash: "0x7a8b3f12...e901",
      status: "confirmed"
    }
  ],
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

export async function fetchInvestorData(): Promise<InvestorDashboardView> {
  try {
    if (process.env.DEMO_MODE === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      try {
        // 1. Fetch default demo investor from Drizzle
        const investor = await db.query.investors.findFirst({
          where: eq(schema.investors.email, "demo.investor.approved@pachanova.local")
        });

        if (investor) {
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

          const kycStatus = kycDocs && kycDocs.length > 0 ? kycDocs[0].status : (investor.kycStatus || "approved");

          return {
            investor: {
              id: investor.id,
              fullName: `${investor.firstName || ''} ${investor.lastName || ''}`.trim() || "Inversor Demo",
              email: investor.email,
              kycStatus: kycStatus as "pending" | "approved" | "rejected",
              isVerified: investor.isVerified || true,
              balance: {
                investorId: investor.id,
                availableTokens: balance?.availableTokens?.toString() || "1250",
                lockedTokens: balance?.lockedTokens?.toString() || "0",
                availableUsd: balance?.availableUsd?.toString() || "5000",
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
      } catch (dbErr) {
        console.warn("DB query failed, using deterministic fallback:", dbErr);
        return FALLBACK_INVESTOR_DATA;
      }

      return FALLBACK_INVESTOR_DATA;
    }

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return FALLBACK_INVESTOR_DATA;
    }

    // 1. Investor
    const { data: investor, error: investorError } = await supabase
      .from("investors")
      .select("*")
      .eq("supabase_auth_id", user.id)
      .single();

    if (investorError || !investor) {
      return FALLBACK_INVESTOR_DATA;
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

    // 4. Token Ledger
    const { data: tokenLedger } = await supabase
      .from("token_ledger")
      .select("*")
      .eq("investor_id", investor.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // 5. KYC
    const { data: kycDocs } = await supabase
      .from("kyc_documents")
      .select("status")
      .eq("investor_id", investor.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const kycStatus = kycDocs && kycDocs.length > 0 ? kycDocs[0].status : (investor.kyc_status || "approved");
    const rawTxs = (tokenLedger && tokenLedger.length > 0) ? tokenLedger : (transactions || []);

    return {
      investor: {
        id: investor.id,
        fullName: `${investor.first_name || ''} ${investor.last_name || ''}`.trim() || "Inversor Registrado",
        email: investor.email,
        kycStatus: kycStatus as "pending" | "approved" | "rejected",
        isVerified: investor.is_verified || true,
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
    console.error("Error fetching investor view model, using fallback:", error);
    return FALLBACK_INVESTOR_DATA;
  }
}
