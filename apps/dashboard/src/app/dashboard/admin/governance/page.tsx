import { RouteBreadcrumbs } from "@/components/mission";
import AdminGovClient from "./AdminGovClient";
import { getDb, schema } from "@pachanova/database";
import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminGovernancePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const role = user.app_metadata?.role || user.user_metadata?.role;
  if (role !== "admin") redirect('/dashboard/investor');

  const db = getDb();

  // Obtener todas las propuestas
  const rawProposals = await db.query.proposals.findMany({
    orderBy: (proposals, { desc }) => [desc(proposals.createdAt)],
  });

  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[
        { label: 'Administración' }, 
        { label: 'Gobernanza (Emisor)' }
      ]} />
      
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">Centro de Emisión de Propuestas</h2>
          <p className="text-sm text-gray-500">Publica nuevas propuestas para someterlas a la votación de los tokenholders.</p>
        </div>

        <AdminGovClient proposals={rawProposals} />
      </div>
    </div>
  );
}
