import { db } from "@/server/db";
import BroadcastClient from "./BroadcastClient";

export const dynamic = "force-dynamic";

export default async function BroadcastPage() {
  const properties = await db.query.properties.findMany({
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });

  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Broadcast Masivo (Push)</h1>
        <p className="text-gray-500">Envía alertas forzadas a todos los inversores o a un segmento específico.</p>
      </div>
      <BroadcastClient properties={properties} />
    </div>
  );
}
