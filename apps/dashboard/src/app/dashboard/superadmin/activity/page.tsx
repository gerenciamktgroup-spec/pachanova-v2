import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import ActivityClient from "./ActivityClient";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const initialLogs = await db.query.auditLogs.findMany({
    orderBy: (a, { desc }) => [desc(a.timestamp)],
    limit: 50,
  });

  const stats = {
    investors: await db.$count(schema.investors),
    properties: await db.$count(schema.properties),
    distributions: await db.$count(schema.distributions)
  };

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <div className="mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-gray-100 uppercase tracking-widest">Global Activity Feed</h1>
        <p className="text-gray-500">Monitor en tiempo real de operaciones de la plataforma.</p>
      </div>
      <ActivityClient initialLogs={initialLogs} stats={stats} />
    </div>
  );
}
