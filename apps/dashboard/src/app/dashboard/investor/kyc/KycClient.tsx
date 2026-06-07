'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Camera } from 'lucide-react';
import { toast } from 'sonner';

export default function KycClient() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'pending' | 'uploading' | 'review' | 'approved'>('pending');
  const [files, setFiles] = useState<{ id?: File | null, selfie?: File | null }>({ id: null, selfie: null });

  const handleFileUpload = (type: 'id' | 'selfie') => {
    // Simulamos la subida de un archivo
    setFiles(prev => ({ ...prev, [type]: new File([""], `${type}-document.jpg`) }));
    toast.success('Documento adjuntado correctamente');
  };

  const submitKyc = () => {
    setStatus('uploading');
    toast.info('Enviando documentos a verificación...');
    
    setTimeout(() => {
      setStatus('review');
      setStep(3);
      toast.success('Documentos enviados', {
        description: 'Tu perfil está siendo revisado por el equipo de cumplimiento (Compliance).'
      });
    }, 2000);
  };

  if (status === 'approved') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-10 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">Identidad Verificada</h3>
        <p className="text-white/60 max-w-md mx-auto">
          Tu cuenta cumple con todos los requisitos KYC/AML. Tienes acceso total a los mercados primarios, secundarios (P2P) y retiros en moneda fiat.
        </p>
      </div>
    );
  }

  if (status === 'review') {
    return (
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-10 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)] animate-pulse">
          <AlertCircle className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">En Revisión</h3>
        <p className="text-white/60 max-w-md mx-auto">
          Tus documentos están siendo analizados por nuestro equipo de cumplimiento. Este proceso suele tardar entre 24 y 48 horas hábiles.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between relative before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:right-0 before:h-0.5 before:bg-white/10 before:-z-10">
        {[1, 2].map(num => (
          <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${
            step >= num ? 'bg-[#c5a46d] border-[#c5a46d] text-black' : 'bg-[#0a111f] border-white/20 text-white/50'
          }`}>
            {num}
          </div>
        ))}
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors bg-[#0a111f] border-white/20 text-white/50">
            3
        </div>
      </div>
      <div className="flex justify-between text-xs text-white/50 font-medium px-1">
        <span>Documento de Identidad</span>
        <span>Selfie Biométrico</span>
        <span>Revisión</span>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#c5a46d]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Documento Nacional de Identidad</h3>
              <p className="text-sm text-white/50">Por favor, sube una foto clara y legible del anverso y reverso de tu documento de identidad o pasaporte.</p>
            </div>

            <button 
              onClick={() => handleFileUpload('id')}
              className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
                files.id ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/20 hover:border-[#c5a46d]/50 hover:bg-white/5'
              }`}
            >
              {files.id ? (
                <>
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-3" />
                  <span className="text-emerald-400 font-medium">Documento cargado ({files.id.name})</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-white/40 mb-3" />
                  <span className="text-white/80 font-medium mb-1">Click para subir documento</span>
                  <span className="text-white/40 text-xs">Soporta JPG, PNG o PDF (Máx. 5MB)</span>
                </>
              )}
            </button>

            <div className="flex justify-end pt-4">
              <button 
                onClick={() => setStep(2)}
                disabled={!files.id}
                className="bg-[#c5a46d] hover:bg-[#b09260] text-black font-semibold py-2.5 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-[#c5a46d]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Prueba de Vida (Selfie)</h3>
              <p className="text-sm text-white/50">Tómate una selfie sosteniendo tu documento de identidad cerca de tu rostro para verificar que eres tú.</p>
            </div>

            <button 
              onClick={() => handleFileUpload('selfie')}
              className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
                files.selfie ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/20 hover:border-[#c5a46d]/50 hover:bg-white/5'
              }`}
            >
              {files.selfie ? (
                <>
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-3" />
                  <span className="text-emerald-400 font-medium">Selfie cargada ({files.selfie.name})</span>
                </>
              ) : (
                <>
                  <Camera className="w-10 h-10 text-white/40 mb-3" />
                  <span className="text-white/80 font-medium mb-1">Tomar o subir foto</span>
                  <span className="text-white/40 text-xs">Asegúrate de tener buena iluminación</span>
                </>
              )}
            </button>

            <div className="flex justify-between pt-4">
              <button 
                onClick={() => setStep(1)}
                className="bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 px-6 rounded-xl transition-all border border-white/10"
              >
                Volver
              </button>
              <button 
                onClick={submitKyc}
                disabled={!files.selfie || status === 'uploading'}
                className="bg-[#c5a46d] hover:bg-[#b09260] text-black font-semibold py-2.5 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {status === 'uploading' ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"/> : null}
                {status === 'uploading' ? 'Enviando...' : 'Enviar a Verificación'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
