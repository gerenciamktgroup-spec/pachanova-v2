import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { InvestorDashboardView } from "@/types/product";

export async function fetchInvestorData(): Promise<InvestorDashboardView | null> {
  try {
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
      recentTransactions: rawTxs.map((tx: any) => ({
        id: tx.id,
        operationType: tx.type || "TRANSFER",
        amount: tx.amount?.toString() || "0",
        timestamp: tx.created_at,
        txHash: tx.tx_hash || null,
        status: tx.status || "confirmed"
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
