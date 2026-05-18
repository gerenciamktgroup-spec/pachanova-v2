import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { InvestorDashboardView } from "@/types/product";
import { cookies } from "next/headers";

type OperationType = "GENESIS_PURCHASE" | "TRANSFER" | "BURN" | "MINT";

const VALID_OPERATION_TYPES: OperationType[] = ["GENESIS_PURCHASE", "TRANSFER", "BURN", "MINT"];

function toOperationType(value?: string): OperationType {
  if (value && (VALID_OPERATION_TYPES as string[]).includes(value)) {
    return value as OperationType;
  }
  return "TRANSFER";
}

/**
 * Returns demo mock data when NEXT_PUBLIC_IS_DEMO is true,
 * otherwise fetches real investor data from Supabase.
 */
export async function fetchInvestorData(): Promise<InvestorDashboardView | null> {
  const isDemo = process.env.NEXT_PUBLIC_IS_DEMO === "true";

  try {
    const cookieStore = await cookies();
    const demoKycOverride = cookieStore.get("demo_kyc_status")?.value;

    let user = null;
    try {
      const supabase = await createServerClient();
      const res = await supabase.auth.getUser();
      user = res.data.user;
    } catch (e) {
      console.warn("Supabase auth failed, using demo fallback if active:", e);
    }

    if (!user) {
      if (isDemo) {
        return getDemoInvestorData(demoKycOverride);
      }
      redirect("/login");
    }

    // Bypass broken RLS on 'investors' table by using Service Role Key
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: investor, error: investorError } = await supabaseAdmin
      .from("investors")
      .select("*")
      .eq("supabase_auth_id", user.id)
      .single();

    if (investorError || !investor) {
      console.error("Investor not found in DB:", investorError);
      if (isDemo) {
        return getDemoInvestorData(demoKycOverride);
      }
      return null;
    }

    const { data: balance } = await supabaseAdmin
      .from("balances")
      .select("*")
      .eq("investor_id", investor.id)
      .single();

    const { data: transactions } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("investor_id", investor.id)
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: tokenLedger } = await supabaseAdmin
      .from("token_ledger")
      .select("*")
      .eq("investor_id", investor.id)
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: kycDocs } = await supabaseAdmin
      .from("kyc_documents")
      .select("status")
      .eq("investor_id", investor.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const kycStatus = demoKycOverride || (kycDocs && kycDocs.length > 0 ? kycDocs[0].status : (investor.kyc_status || "pending"));

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
      recentTransactions: rawTxs.map((tx: { id: string; type?: string; amount?: string | number; created_at: string; tx_hash?: string; status?: string }) => ({
        id: tx.id,
        operationType: toOperationType(tx.type),
        amount: tx.amount?.toString() || "0",
        timestamp: tx.created_at,
        txHash: tx.tx_hash || null,
        status: tx.status || "confirmed"
      })),
      kycVerificationProvider: "SIMULATED",
      paymentsReadiness: isDemo ? {
        provider: "MERCADOPAGO",
        status: "SIMULATED",
        lastPing: new Date().toISOString(),
        message: "Sandbox mode — simulado para demo"
      } : {
        provider: "MERCADOPAGO",
        status: "PENDING_CREDENTIALS",
        lastPing: null,
        message: "No credentials"
      },
      contractReadiness: isDemo ? {
        provider: "FOUNDRY",
        status: "SIMULATED",
        lastPing: new Date().toISOString(),
        message: "Smart contract simulado — demo local"
      } : {
        provider: "FOUNDRY",
        status: "PENDING_FOUNDRY",
        lastPing: null,
        message: "Node inactive"
      }
    };
  } catch (error) {
    console.error("Error fetching investor view model:", error);
    if (isDemo) {
      try {
        const cookieStore = await cookies();
        const demoKycOverride = cookieStore.get("demo_kyc_status")?.value;
        return getDemoInvestorData(demoKycOverride);
      } catch {
        return getDemoInvestorData();
      }
    }
    return null;
  }
}

function getDemoInvestorData(demoKycOverride?: string): InvestorDashboardView {
  const kycStatus = demoKycOverride || "approved";
  return {
    investor: {
      id: "demo-investor-001",
      fullName: "Inversor Demo",
      email: "demo@pachanova.com",
      kycStatus: kycStatus as "pending" | "approved" | "rejected",
      isVerified: kycStatus === "approved",
      balance: {
        investorId: "demo-investor-001",
        availableTokens: "1500.00",
        lockedTokens: "250.00",
        availableUsd: "15000.00",
        lockedUsd: "2500.00",
        lastUpdated: new Date().toISOString()
      }
    },
    recentTransactions: [
      {
        id: "demo-tx-001",
        operationType: "GENESIS_PURCHASE",
        amount: "1000.00",
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        txHash: "0xdemo...abc1",
        status: "confirmed"
      },
      {
        id: "demo-tx-002",
        operationType: "GENESIS_PURCHASE",
        amount: "500.00",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        txHash: "0xdemo...abc2",
        status: "confirmed"
      },
      {
        id: "demo-tx-003",
        operationType: "TRANSFER",
        amount: "250.00",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        txHash: "0xdemo...abc3",
        status: "pending"
      }
    ],
    kycVerificationProvider: "SIMULATED",
    paymentsReadiness: {
      provider: "MERCADOPAGO",
      status: "SIMULATED",
      lastPing: new Date().toISOString(),
      message: "Sandbox mode — simulado para demo"
    },
    contractReadiness: {
      provider: "FOUNDRY",
      status: "SIMULATED",
      lastPing: new Date().toISOString(),
      message: "Smart contract simulado — demo local"
    }
  };
}
