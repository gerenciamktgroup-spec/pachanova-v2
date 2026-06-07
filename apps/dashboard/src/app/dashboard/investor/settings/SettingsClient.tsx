'use client';

import { useState } from 'react';
import { User, Shield, Bell, Save, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    // Simulated API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Cambios guardados', {
        description: 'Tu configuración ha sido actualizada exitosamente en la bóveda de PachaNova.'
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 flex flex-col gap-2">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
            activeTab === 'profile' ? 'bg-[#c5a46d]/10 text-[#c5a46d] border border-[#c5a46d]/20' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Datos Personales</span>
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
            activeTab === 'security' ? 'bg-[#c5a46d]/10 text-[#c5a46d] border border-[#c5a46d]/20' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="font-medium">Seguridad (2FA)</span>
        </button>
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
            activeTab === 'notifications' ? 'bg-[#c5a46d]/10 text-[#c5a46d] border border-[#c5a46d]/20' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="font-medium">Notificaciones</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8">
        
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h3 className="text-xl font-medium text-white mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Nombre(s)</label>
                  <input type="text" defaultValue="Inversor" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#c5a46d]/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Apellidos</label>
                  <input type="text" defaultValue="PachaNova" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#c5a46d]/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Correo Electrónico</label>
                  <input type="email" defaultValue="inversor@pachanova.com" disabled className="w-full bg-black/50 border border-white/5 rounded-lg px-4 py-2.5 text-white/50 cursor-not-allowed" />
                  <p className="text-xs text-[#c5a46d]/80 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Verificado</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Teléfono</label>
                  <input type="tel" defaultValue="+51 987 654 321" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#c5a46d]/50 transition-colors" />
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-xl font-medium text-white mb-4">Dirección Fiscal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Dirección</label>
                  <input type="text" placeholder="Av. Principal 123" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#c5a46d]/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Ciudad</label>
                  <input type="text" placeholder="Lima" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#c5a46d]/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">País</label>
                  <select className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#c5a46d]/50 transition-colors appearance-none">
                    <option value="pe">Perú</option>
                    <option value="cl">Chile</option>
                    <option value="co">Colombia</option>
                    <option value="mx">México</option>
                    <option value="es">España</option>
                    <option value="us">Estados Unidos</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h3 className="text-xl font-medium text-white mb-2">Autenticación de Dos Factores (2FA)</h3>
              <p className="text-sm text-white/60 mb-6">Añade una capa extra de seguridad a tu cuenta de PachaNova usando una app de autenticación como Google Authenticator o Authy.</p>
              
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-500/20 p-2 rounded-full">
                    <Shield className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-emerald-400">2FA Activado</h4>
                    <p className="text-sm text-white/60 mt-1">Tu cuenta está protegida con autenticación de dos factores.</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors whitespace-nowrap">
                  Desactivar 2FA
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h3 className="text-xl font-medium text-white mb-4">Cambiar Contraseña</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Contraseña Actual</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#c5a46d]/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Nueva Contraseña</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#c5a46d]/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Confirmar Nueva Contraseña</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#c5a46d]/50 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-xl font-medium text-white mb-2">Preferencias de Notificaciones</h3>
            <p className="text-sm text-white/60 mb-6">Controla qué correos y alertas recibes de la Bóveda Central y del Orquestador.</p>
            
            <div className="space-y-4">
              {[
                { title: 'Distribuciones y Rendimientos', desc: 'Alertas cuando se depositan rendimientos o distribuciones de RWA en tu cuenta.' },
                { title: 'Nuevos Lanzamientos Landbanking', desc: 'Notificaciones sobre nuevas propiedades disponibles (5 PNC) antes que el público general.' },
                { title: 'Actualizaciones de Gobernanza', desc: 'Avisos cuando hay propuestas activas que requieren tu voto.' },
                { title: 'Liquidaciones de Bóveda (Burn/Escrow)', desc: 'Reportes mensuales sobre el estado de la bóveda P2P y liquidaciones.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/20 hover:bg-black/40 transition-colors">
                  <div>
                    <h4 className="font-medium text-white">{item.title}</h4>
                    <p className="text-xs text-white/50 mt-1">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c5a46d]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#c5a46d] hover:bg-[#b09260] text-black font-semibold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"/> : <Save className="w-5 h-5" />}
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

      </div>
    </div>
  );
}
