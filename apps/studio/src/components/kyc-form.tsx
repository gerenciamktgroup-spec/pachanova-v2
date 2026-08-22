"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, Field } from "./ui";

export function KycForm({ blurb }: { blurb: string }) {
  const [status, setStatus] = useState("pending");
  const [files, setFiles] = useState<any[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/kyc", { cache: "no-store" });
    const data = await res.json();
    setStatus(data.kycStatus);
    setFiles(data.files || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <p className="text-mute text-sm">{blurb} Estado actual: {status}.</p>
      <Card>
        <form className="grid md:grid-cols-3 gap-3" onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const res = await fetch("/api/kyc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ docType: f.get("docType"), fileUrl: f.get("fileUrl") }) });
          const data = await res.json();
          if (!res.ok) return setMsg(data.error);
          setMsg("Enviado a revisión.");
          e.currentTarget.reset();
          await load();
        }}>
          <Field label="Documento">
            <select name="docType">
              <option value="dni_front">DNI frente</option>
              <option value="dni_back">DNI dorso</option>
              <option value="passport">Pasaporte</option>
              <option value="address">Domicilio</option>
            </select>
          </Field>
          <Field label="Enlace al archivo"><input name="fileUrl" required placeholder="https://…" /></Field>
          <div className="flex items-end"><Button type="submit">Enviar</Button></div>
        </form>
        {msg && <p className="text-sm text-clay mt-3">{msg}</p>}
      </Card>
      {files.map((f) => (
        <p key={f.id} className="text-sm border-t border-line py-2">{f.docType} · {f.status}</p>
      ))}
    </div>
  );
}
