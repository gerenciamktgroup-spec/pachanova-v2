"use client";

import { useState } from "react";
import { createGovernanceProposal } from "@/app/actions/governance";
import { useRouter } from "next/navigation";
import { Calendar, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminGovClient({ proposals }: { proposals: any[] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const res = await createGovernanceProposal(title, description, endDate);
    
    setIsSubmitting(false);
    if (res.success) {
      toast.success("Propuesta publicada exitosamente");
      setTitle("");
      setDescription("");
      setEndDate("");
      router.refresh();
    } else {
      toast.error("Error al publicar propuesta: " + res.error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulario de Nueva Propuesta */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-400" /> Nueva Propuesta
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Título de la Propuesta</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
              placeholder="Ej. Liquidación de Bóveda #4"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Descripción y Racional</label>
            <textarea 
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
              placeholder="Detalla los motivos de la votación..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Fecha Límite de Votación</label>
            <div className="relative">
              <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              <input 
                type="datetime-local" 
                required
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
          >
            {isSubmitting ? "Publicando..." : "Publicar a la Comunidad"}
          </button>
        </form>
      </div>

      {/* Historial */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-gray-400" /> Propuestas Emitidas
        </h3>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
          {proposals.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">No hay propuestas emitidas.</div>
          ) : proposals.map(p => (
            <div key={p.id} className="p-4 flex flex-col gap-2 hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-900 text-sm">{p.title}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
              <div className="text-[10px] text-gray-400">
                Creado: {new Date(p.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
