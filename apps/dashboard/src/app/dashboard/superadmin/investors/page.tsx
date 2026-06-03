import { db } from "@/server/db";
import InvestorOverrideClient from "./InvestorOverrideClient";

export const dynamic = "force-dynamic";

export default async function InvestorOverridePage() {
  const investors = await db.query.investors.findMany({
    orderBy: (i, { desc }) => [desc(i.createdAt)],
    limit: 100
  });

  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Override de Inversores</h1>
        <p className="text-gray-500">Forzar saldos, tokens y estados KYC directamente.</p>
      </div>
      <InvestorOverrideClient investors={investors} />
    </div>
  );
}
