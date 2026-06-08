import React from "react";
import { X, FileText, Shield, FileCheck, Info } from "lucide-react";

export function PropertyDataRoom({ propertyName, onClose }: { propertyName: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0a111f] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#c5a46d]" /> Data Room
            </h3>
            <p className="text-sm text-white/50 mt-1">{propertyName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white/50 hover:text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-sm text-blue-200">
            <Info className="w-5 h-5 shrink-0 text-blue-400" />
            <p>Este Data Room contiene los documentos legales certificados por el Fideicomiso. Todos los archivos están respaldados y son de carácter vinculante.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Tasación Oficial (M2)</h4>
                  <p className="text-xs text-white/40">Actualizado hace 15 días</p>
                </div>
              </div>
              <button className="text-xs font-medium text-[#c5a46d] hover:text-white transition-colors">
                Ver PDF
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Contrato de Fideicomiso Maestro</h4>
                  <p className="text-xs text-white/40">PachaNova Trust LLC</p>
                </div>
              </div>
              <button className="text-xs font-medium text-[#c5a46d] hover:text-white transition-colors">
                Ver PDF
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Póliza de Seguro Integral</h4>
                  <p className="text-xs text-white/40">Seguros del Estado C.A.</p>
                </div>
              </div>
              <button className="text-xs font-medium text-[#c5a46d] hover:text-white transition-colors">
                Ver PDF
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
