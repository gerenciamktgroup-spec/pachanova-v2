"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, PageTitle } from "@/components/ui";

export default function AdminKyc() {
  const [items, setItems] = useState<any[]>([]);
  const load = useCallback(async () => {
    const res = await fetch("/api/admin/kyc", { cache: "no-store" });
    setItems((await res.json()).items || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageTitle kicker="Administración" title="Identidad">Documentos de inversores y clientes.</PageTitle>
      <div className="space-y-3">
        {items.length === 0 && <p className="text-mute text-sm">Nada para revisar.</p>}
        {items.map((item) => (
          <Card key={item.file.id}>
            <p className="text-sm">{item.profile.fullName || item.profile.email} · {item.profile.role}</p>
            <p className="text-xs text-mute mt-1">{item.file.docType} · {item.file.status}</p>
            {item.file.status === "pending" && (
              <div className="flex gap-2 mt-3">
                <Button onClick={() => fetch("/api/admin/kyc", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileId: item.file.id, status: "approved" }) }).then(load)}>Aprobar</Button>
                <Button variant="danger" onClick={() => fetch("/api/admin/kyc", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileId: item.file.id, status: "rejected" }) }).then(load)}>Rechazar</Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
