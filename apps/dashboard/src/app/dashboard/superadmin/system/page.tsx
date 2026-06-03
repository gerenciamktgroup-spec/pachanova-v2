import { db } from "@/server/db";
import SystemParametersClient from "./SystemParametersClient";

export const dynamic = "force-dynamic";

export default async function SystemParametersPage() {
  const params = await db.query.systemParameters.findMany({
    orderBy: (p, { desc }) => [desc(p.updatedAt)]
  });

  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Parámetros del Sistema</h1>
        <p className="text-gray-500">Gestión maestra de configuraciones globales.</p>
      </div>
      <SystemParametersClient initialParams={params} />
    </div>
  );
}
