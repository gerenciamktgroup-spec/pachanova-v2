"use client";

import { useCallback, useEffect, useState } from "react";

type Item = {
  file: { id: string; docType: string; fileUrl: string; status: string };
  profile: { email: string; fullName: string; role: string; kycStatus: string };
};

export default function KycQueue() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/kyc", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Error");
      return;
    }
    setItems(data.items || []);
  }, []);

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, [load]);

  async function decide(fileId: string, status: "approved" | "rejected") {
    const res = await fetch("/api/admin/kyc", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId, status }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Error");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-3 text-white">
      {error && <p className="text-sm text-red-300">{error}</p>}
      {items.length === 0 && <p className="text-sm text-white/40">No hay documentos KYC.</p>}
      {items.map((item) => (
        <div key={item.file.id} className="border border-white/10 rounded-xl p-4 flex flex-wrap justify-between gap-3">
          <div>
            <p className="text-sm">{item.profile.fullName || item.profile.email} · {item.profile.role}</p>
            <p className="text-xs text-white/45">{item.file.docType} · archivo {item.file.status} · perfil {item.profile.kycStatus}</p>
            {item.file.fileUrl && <p className="text-xs text-white/35 break-all mt-1">{item.file.fileUrl}</p>}
          </div>
          {item.file.status === "pending" && (
            <div className="flex gap-2 text-xs">
              <button className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300" onClick={() => decide(item.file.id, "approved")}>Aprobar</button>
              <button className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300" onClick={() => decide(item.file.id, "rejected")}>Rechazar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
