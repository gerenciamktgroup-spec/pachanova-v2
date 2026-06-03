import { db } from "@/server/db";
import PropertyOverrideClient from "./PropertyOverrideClient";

export const dynamic = "force-dynamic";

export default async function PropertyOverridePage() {
  const properties = await db.query.properties.findMany({
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });

  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Override de Propiedades</h1>
        <p className="text-gray-500">Avanza fases, ajusta valuaciones y precios de token maestro.</p>
      </div>
      <PropertyOverrideClient properties={properties} />
    </div>
  );
}
