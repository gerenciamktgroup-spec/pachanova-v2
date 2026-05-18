"use client";

import { useState, useEffect } from "react";
import { MissionCard } from "@/components/mission/MissionCard";
import { CommandButton } from "@/components/mission/CommandButton";

interface LegalDocument {
  id: string;
  title: string;
  url: string;
  createdAt: string;
}

export function LegalPortalClient({ isAdmin }: { isAdmin: boolean }) {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");

  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/demo/actions/legal-documents");
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async () => {
    if (!newDocTitle.trim()) return;
    setUploading(true);
    try {
      await fetch("/api/demo/actions/legal-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newDocTitle }),
      });
      setNewDocTitle("");
      await fetchDocs();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <MissionCard title="Portal Legal y Auditoría">
      <div className="space-y-6">
        {isAdmin && (
          <div className="p-4 border border-pn-border rounded-lg bg-pn-surface-strong">
            <h4 className="text-sm font-medium text-pn-gold mb-3">Subir Nuevo Documento (Admin)</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Título del documento (ej. Auditoría KYC)"
                value={newDocTitle}
                onChange={(e) => setNewDocTitle(e.target.value)}
                className="flex-1 bg-pn-bg border border-pn-border rounded px-3 py-2 text-sm focus:outline-none focus:border-pn-gold"
              />
              <CommandButton 
                variant="primary" 
                onClick={handleUpload} 
                disabled={uploading || !newDocTitle.trim()}
              >
                {uploading ? "Subiendo..." : "Subir (Demo)"}
              </CommandButton>
            </div>
            <p className="text-xs text-pn-text-muted mt-2">
              Nota: En modo Demo, el archivo no se almacena físicamente; se genera un enlace simulado de auditoría disponible para todos los inversores.
            </p>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-pn-text mb-4">Documentos Disponibles</h4>
          {loading ? (
            <p className="text-sm text-pn-text-muted">Cargando documentos...</p>
          ) : documents.length === 0 ? (
            <p className="text-sm text-pn-text-muted p-4 border border-dashed border-pn-border rounded-lg text-center">
              No hay documentos legales publicados aún.
            </p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex justify-between items-center p-3 bg-pn-bg border border-pn-border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-pn-text">{doc.title}</p>
                    <p className="text-xs text-pn-text-muted">{new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                  <CommandButton variant="outline" onClick={() => alert(`Descargando archivo simulado: ${doc.url}`)}>
                    Descargar
                  </CommandButton>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MissionCard>
  );
}
