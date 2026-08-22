"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card } from "@/components/ui";

export function Contribute({ projects }: { projects: { code: string; name: string; type: string; location: string; raised: string; target: string }[] }) {
  const [msg, setMsg] = useState<string | null>(null);
  if (projects.length === 0) return <p className="text-sm text-mute">No hay rondas abiertas.</p>;
  return (
    <div className="space-y-3">
      {msg && <p className="text-sm text-clay">{msg}</p>}
      {projects.map((p) => (
        <Card key={p.code}>
          <Link href={`/inversor/proyectos/${p.code}`} className="block mb-3">
            <p className="text-xs text-mute">{p.code} · {p.type}</p>
            <h3 className="text-xl">{p.name}</h3>
            <p className="text-sm text-mute">{p.location}</p>
          </Link>
          <form className="flex gap-2" onSubmit={async (e) => {
            e.preventDefault();
            const amount = Number(new FormData(e.currentTarget).get("amount"));
            const res = await fetch(`/api/projects/${p.code}/capital`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "contribute", amount }) });
            const data = await res.json();
            setMsg(res.ok ? `Aporte de ${amount} registrado. Queda pendiente de conciliación.` : data.error);
          }}>
            <input name="amount" type="number" min="1" required placeholder="USD" />
            <Button type="submit">Aportar</Button>
          </form>
        </Card>
      ))}
    </div>
  );
}
