'use client';

import { useState } from 'react';
import { FileSearch, CheckCircle2, XCircle, Clock, Eye, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const mockPendingKyc = [
  { id: 'kyc_123', userId: 'usr_abc', name: 'Juan Pérez', email: 'juan@example.com', submittedAt: '2023-11-20T10:00:00Z', risk: 'low' },
  { id: 'kyc_124', userId: 'usr_xyz', name: 'María Gómez', email: 'maria@example.com', submittedAt: '2023-11-21T14:30:00Z', risk: 'medium' },
  { id: 'kyc_125', userId: 'usr_789', name: 'Carlos Ruiz', email: 'carlos@example.com', submittedAt: '2023-11-22T09:15:00Z', risk: 'high' }
];

export default function AdminKycClient() {
  const [kycList, setKycList] = useState(mockPendingKyc);
  const [selectedKyc, setSelectedKyc] = useState<typeof mockPendingKyc[0] | null>(null);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      toast.success(`Identidad aprobada para ${selectedKyc?.name}`);
    } else {
      toast.error(`Identidad rechazada para ${selectedKyc?.name}`, {
        description: 'Se ha notificado al usuario para que vuelva a subir los documentos.'
      });
    }
    
    setKycList(prev => prev.filter(k => k.id !== id));
    setSelectedKyc(null);
  };

  if (selectedKyc) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedKyc(null)}
            className="text-white/50 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
          >
            ← Volver a la lista
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={() => handleAction(selectedKyc.id, 'reject')}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Rechazar
            </button>
            <button 
              onClick={() => handleAction(selectedKyc.id, 'approve')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <CheckCircle2 className="w-4 h-4" /> Aprobar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Información del Usuario</h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">Nombre Completo</span>
                <span className="text-white font-medium">{selectedKyc.name}</span>
              </div>
              <div>
                <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">Email</span>
                <span className="text-white">{selectedKyc.email}</span>
              </div>
              <div>
                <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">ID de Usuario</span>
                <span className="text-white/60 font-mono text-sm">{selectedKyc.userId}</span>
              </div>
              <div>
                <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">Nivel de Riesgo (IA)</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium uppercase ${
                  selectedKyc.risk === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                  selectedKyc.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {selectedKyc.risk === 'high' && <AlertTriangle className="w-3 h-3" />}
                  {selectedKyc.risk}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-[#c5a46d]" /> Documento de Identidad
              </h3>
              <div className="aspect-[16/9] bg-black/50 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                <img src={`https://placehold.co/800x450/111827/c5a46d?text=DNI+Anverso+${selectedKyc.name.split(' ')[0]}`} alt="ID Front" className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 border border-white/20">
                    <Eye className="w-4 h-4" /> Ampliar
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-[#c5a46d]" /> Prueba de Vida (Selfie)
              </h3>
              <div className="aspect-[4/3] max-w-sm mx-auto bg-black/50 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                <img src={`https://placehold.co/600x800/111827/c5a46d?text=Selfie+${selectedKyc.name.split(' ')[0]}`} alt="Selfie" className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-black/20">
            <th className="p-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Usuario</th>
            <th className="p-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Email</th>
            <th className="p-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Fecha de Solicitud</th>
            <th className="p-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Riesgo</th>
            <th className="p-4 text-xs font-semibold text-white/50 uppercase tracking-wider text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {kycList.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-white/50">
                No hay solicitudes KYC pendientes.
              </td>
            </tr>
          ) : (
            kycList.map(kyc => (
              <tr key={kyc.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="font-medium text-white">{kyc.name}</div>
                  <div className="text-xs text-white/40 font-mono">{kyc.userId}</div>
                </td>
                <td className="p-4 text-white/80">{kyc.email}</td>
                <td className="p-4 text-white/60 text-sm flex items-center gap-2">
                  <Clock className="w-3 h-3" /> {new Date(kyc.submittedAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase ${
                    kyc.risk === 'low' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    kyc.risk === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                    'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {kyc.risk}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => setSelectedKyc(kyc)}
                    className="px-4 py-1.5 bg-[#c5a46d]/10 hover:bg-[#c5a46d]/20 text-[#c5a46d] border border-[#c5a46d]/20 rounded-lg transition-all text-sm font-medium opacity-0 group-hover:opacity-100"
                  >
                    Revisar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
