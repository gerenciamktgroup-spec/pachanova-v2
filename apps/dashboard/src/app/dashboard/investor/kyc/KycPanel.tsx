"use client";

import { useCallback, useEffect, useState } from "react";

type FileRow = { id: string; docType: string; fileUrl: string; status: string; createdAt: string };

export default function KycPanel() {
  const [kycStatus, setKycStatus] = useState("pending");
  const [files, setFiles] = useState<FileRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/kyc", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Error");
      return;
    }
    setKycStatus(data.kycStatus);
    setFiles(data.files || []);
  }, []);

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, [load]);

  return (
    <div className="space-y-6 text-white">
      <p className="text-sm text-white/60">
        Estado: <span className="text-[#c5a46d]">{kycStatus}</span>. El aporte de capital requiere KYC aprobado.
      </p>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <form
        className="grid md:grid-cols-3 gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const res = await fetch("/api/kyc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ docType: f.get("docType"), fileUrl: f.get("fileUrl") }),
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.error || "Error");
            return;
          }
          e.currentTarget.reset();
          await load();
        }}
      >
        <select name="docType" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm">
          <option value="dni_front">DNI frente</option>
          <option value="dni_back">DNI dorso</option>
          <option value="passport">Pasaporte</option>
          <option value="address">Domicilio</option>
        </select>
        <input name="fileUrl" required placeholder="URL del documento" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        <button className="bg-[#c5a46d] text-black rounded-lg text-sm">Enviar a revisión</button>
      </form>
      <div className="space-y-2">
        {files.map((file) => (
          <div key={file.id} className="text-sm text-white/70 flex justify-between border border-white/10 rounded-lg px-3 py-2">
            <span>{file.docType}</span>
            <span>{file.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
