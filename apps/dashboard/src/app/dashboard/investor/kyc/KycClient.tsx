'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Camera, Signature } from 'lucide-react';
import { toast } from 'sonner';

export default function KycClient() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'pending' | 'uploading' | 'review' | 'approved'>('pending');
  const [files, setFiles] = useState<{ id?: File | null, selfie?: File | null }>({ id: null, selfie: null });
  const [agreed, setAgreed] = useState(false);

  const handleFileUpload = (type: 'id' | 'selfie') => {
    // Simulamos la subida de un archivo
    setFiles(prev => ({ ...prev, [type]: new File([""], `${type}-document.jpg`) }));
    toast.success('Documento adjuntado correctamente');
  };

  const submitKycAndSign = async () => {
    setStatus('uploading');
    toast.info('Firmando contrato digitalmente y enviando a verificación...');
    
    // Aquí llamaríamos a signAgreement(authId, "fideicomiso_adhesion")
    // await signAgreement("auth-id-xyz", "fideicomiso_adhesion");
    
    setTimeout(() => {
      setStatus('review');
      setStep(4);
      toast.success('Contrato firmado y documentos enviados', {
        description: 'Tu perfil y tu firma están siendo validados por el equipo de cumplimiento (Compliance).'
      });
    }, 2500);
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
          Tus documentos y tu firma electrónica están siendo analizados por nuestro equipo de cumplimiento y el Fideicomiso. Este proceso suele tardar entre 24 y 48 horas hábiles.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between relative before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:right-0 before:h-0.5 before:bg-white/10 before:-z-10">
        {[1, 2, 3].map(num => (
          <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors relative z-10 ${
            step >= num ? 'bg-[#c5a46d] border-[#c5a46d] text-black' : 'bg-[#0a111f] border-white/20 text-white/50'
          }`}>
            {num}
          </div>
        ))}
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors relative z-10 bg-[#0a111f] border-white/20 text-white/50">
            4
        </div>
      </div>
      <div className="flex justify-between text-xs text-white/50 font-medium px-1">
        <span>Identidad</span>
        <span>Biométrico</span>
        <span>Contrato</span>
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
                onClick={() => setStep(3)}
                disabled={!files.selfie}
                className="bg-[#c5a46d] hover:bg-[#b09260] text-black font-semibold py-2.5 px-6 rounded-xl transition-all disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#c5a46d]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#c5a46d]/20">
                <Signature className="w-8 h-8 text-[#c5a46d]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Acuerdo del Fideicomiso</h3>
              <p className="text-sm text-white/50">Para operar en PachaNova, debes adherirte criptográficamente a las normas de custodia del fideicomiso regulado.</p>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl p-4 max-h-48 overflow-y-auto text-xs text-white/60 space-y-3 font-mono">
              <p><strong>CONTRATO DE ADHESIÓN A FIDEICOMISO INMOBILIARIO</strong></p>
              <p>Entre PACHANOVA TRUST LLC (el "Fiduciario") y el "Inversor".</p>
              <p>1. <strong>Custodia Institucional:</strong> El Inversor reconoce que los activos subyacentes (inmuebles) son administrados exclusiva y legalmente por el Fiduciario.</p>
              <p>2. <strong>Participación Digital:</strong> La tenencia de tokens en la plataforma representa un derecho de cobro (beneficio) sobre las utilidades del inmueble, no una escritura directa sobre el mismo.</p>
              <p>3. <strong>Prevención de Lavado:</strong> El Inversor garantiza bajo declaración jurada que los fondos provienen de fuentes lícitas.</p>
              <p>4. <strong>Firma Electrónica Avanzada:</strong> El check en la siguiente casilla, junto con el rastro de auditoría de IP y cuenta verificada, tiene el mismo peso legal que una firma manuscrita.</p>
            </div>

            <label className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex-shrink-0 mt-0.5">
                <input 
                  type="checkbox" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 bg-black text-[#c5a46d] focus:ring-[#c5a46d] focus:ring-offset-0"
                />
              </div>
              <span className="text-sm text-white/80 select-none">
                He leído y acepto los términos del Fideicomiso. Firmo digitalmente este acuerdo bajo mi responsabilidad.
              </span>
            </label>

            <div className="flex justify-between pt-4 border-t border-white/10">
              <button 
                onClick={() => setStep(2)}
                className="bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 px-6 rounded-xl transition-all border border-white/10"
              >
                Volver
              </button>
              <button 
                onClick={submitKycAndSign}
                disabled={!agreed || status === 'uploading'}
                className="bg-[#c5a46d] hover:bg-[#b09260] text-black font-semibold py-2.5 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {status === 'uploading' ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"/> : <Signature className="w-4 h-4" />}
                {status === 'uploading' ? 'Firmando y Enviando...' : 'Firmar y Enviar KYC'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
