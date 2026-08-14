"use client";

import { useState } from "react";

interface SystemParameter {
  key: string;
  value: string;
  description: string | null;
  updatedAt: string;
}

interface AdminSettingsPanelProps {
  initialParams: SystemParameter[];
}

export function AdminSettingsPanel({ initialParams }: AdminSettingsPanelProps) {
  const [params, setParams] = useState<SystemParameter[]>(initialParams);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [loading, setLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

  // New parameter form state
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const startEdit = (param: SystemParameter) => {
    setEditingKey(param.key);
    setEditValue(param.value);
  };

  const handleSave = async (key: string) => {
    setLoading(key);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: editValue }),
      });
      const data = await res.json();
      if (data.success) {
        setParams(prev =>
          prev.map(p => (p.key === key ? { ...p, value: editValue, updatedAt: new Date().toISOString() } : p))
        );
        setEditingKey(null);
        setFeedback({ status: "success", message: `Parámetro [${key}] actualizado con éxito` });
      } else {
        setFeedback({ status: "error", message: data.error || "Error al actualizar" });
      }
    } catch (error: unknown) {
      setFeedback({ status: "error", message: error instanceof Error ? error.message : "Error de red" });
    } finally {
      setLoading(null);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || newValue === undefined) return;
    setLoading("new");
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newKey, value: newValue, description: newDesc }),
      });
      const data = await res.json();
      if (data.success) {
        setParams(prev => [
          ...prev,
          { key: newKey, value: newValue, description: newDesc, updatedAt: new Date().toISOString() }
        ]);
        setNewKey("");
        setNewValue("");
        setNewDesc("");
        setShowAddForm(false);
        setFeedback({ status: "success", message: `Parámetro [${newKey}] creado con éxito` });
      } else {
        setFeedback({ status: "error", message: data.error || "Error al guardar" });
      }
    } catch (error: unknown) {
      setFeedback({ status: "error", message: error instanceof Error ? error.message : "Error de red" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-pn-text">Parámetros del Sistema</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-pn-gold hover:bg-pn-gold/80 text-black text-xs font-semibold px-4 py-2 rounded transition-colors"
        >
          {showAddForm ? "Cancelar" : "➕ Agregar Parámetro"}
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded border text-sm font-medium ${feedback.status === 'success' ? 'bg-green-950 border-green-800 text-green-300' : 'bg-red-950 border-red-800 text-red-300'}`}>
          {feedback.message}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-pn-surface-strong border border-pn-border rounded-lg p-6 space-y-4">
          <h3 className="text-sm font-bold text-pn-gold">Nuevo Parámetro</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-pn-text-soft block mb-1">Clave (Key)</label>
              <input
                type="text"
                required
                placeholder="ej: default_fee_percent"
                className="w-full bg-pn-bg border border-pn-border rounded px-3 py-2 text-sm text-pn-text"
                value={newKey}
                onChange={e => setNewKey(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-pn-text-soft block mb-1">Valor (Value)</label>
              <input
                type="text"
                required
                placeholder="ej: 2.5"
                className="w-full bg-pn-bg border border-pn-border rounded px-3 py-2 text-sm text-pn-text"
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-pn-text-soft block mb-1">Descripción</label>
            <input
              type="text"
              placeholder="Descripción opcional"
              className="w-full bg-pn-bg border border-pn-border rounded px-3 py-2 text-sm text-pn-text"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading === "new"}
            className="bg-pn-gold text-black text-xs font-semibold px-4 py-2 rounded disabled:opacity-50 hover:bg-pn-gold/80"
          >
            {loading === "new" ? "Guardando..." : "Crear Parámetro"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {params.map(param => (
          <div
            key={param.key}
            className="bg-pn-surface-strong border border-pn-border rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1 max-w-xl">
              <span className="text-xs font-mono text-pn-gold px-2 py-0.5 rounded bg-pn-gold/10 border border-pn-gold/20 inline-block mb-1">
                {param.key}
              </span>
              <p className="text-xs text-pn-text-soft">
                {param.description || "Sin descripción proporcionada."}
              </p>
              <span className="text-[10px] text-pn-text-muted block">
                Última actualización: {new Date(param.updatedAt).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              {editingKey === param.key ? (
                <>
                  <input
                    type="text"
                    className="bg-pn-bg border border-pn-border rounded px-3 py-1.5 text-sm text-pn-text w-48"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                  />
                  <button
                    disabled={loading === param.key}
                    onClick={() => handleSave(param.key)}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                  >
                    {loading === param.key ? "..." : "Guardar"}
                  </button>
                  <button
                    onClick={() => setEditingKey(null)}
                    className="bg-pn-surface hover:bg-pn-surface-strong text-pn-text text-xs font-semibold px-3 py-1.5 rounded border border-pn-border transition-colors"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm font-semibold text-pn-text font-mono border border-pn-border bg-pn-bg px-3 py-1.5 rounded min-w-[80px] text-center">
                    {param.value}
                  </span>
                  <button
                    onClick={() => startEdit(param)}
                    className="bg-pn-surface hover:bg-pn-surface-strong text-pn-text text-xs font-semibold px-4 py-1.5 rounded border border-pn-border transition-colors"
                  >
                    Editar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
