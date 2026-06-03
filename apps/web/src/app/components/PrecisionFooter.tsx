'use client';

import Link from 'next/link';

export function PrecisionFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#070d19] pt-16 pb-10 text-sm">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid md:grid-cols-12 gap-y-14 gap-x-8">
          {/* Brand + Legal */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-5 rounded bg-[#c5a46d]" />
              <span className="font-semibold tracking-[-0.5px] text-lg text-white/90">PACHA<span className="text-white/50 font-light">NOVA</span></span>
            </div>
            <p className="text-white/50 max-w-md leading-relaxed">
              Primera plataforma de inversión inmobiliaria tokenizada con estructura fiduciaria completa en Perú.
            </p>
            <p className="text-white/30 text-xs mt-8 tracking-widest">
              © {new Date().getFullYear()} PachaNova. Todos los derechos reservados.
            </p>
          </div>

          {/* Navegación */}
          <div className="md:col-span-3">
            <div className="text-white/40 text-[10px] tracking-[1.5px] font-medium mb-4">EXPLORAR</div>
            <ul className="space-y-[13px] text-white/70">
              <li><a href="#activo" className="hover:text-white transition-colors">El Activo</a></li>
              <li><a href="#tokenizacion" className="hover:text-white transition-colors">Tokenización</a></li>
              <li><a href="#estructura" className="hover:text-white transition-colors">Estructura Fiduciaria</a></li>
              <li><a href="#gobernanza" className="hover:text-white transition-colors">Gobernanza</a></li>
              <li><Link href="/como-funciona" className="hover:text-white transition-colors">Cómo Funciona</Link></li>
            </ul>
          </div>

          {/* Institucional */}
          <div className="md:col-span-4">
            <div className="text-white/40 text-[10px] tracking-[1.5px] font-medium mb-4">INSTITUCIONAL</div>
            <div className="text-white/65 text-[13.5px] leading-[1.75] space-y-px">
              <p>Terreno inscrito en SUNARP</p>
              <p>Escritura pública ante notario</p>
              <p>Fideicomiso regido por Ley 26702</p>
              <p className="pt-2 text-white/40">Quórum reforzado de 2/3 fiduciarios</p>
            </div>

            <div className="mt-9 pt-6 border-t border-white/10 text-[11px] text-white/40">
              Esta web es informativa. El acceso al demo es con fines de demostración técnica.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-y-2 text-xs text-white/35 tracking-widest">
          <div>SAN BARTOLO · LIMA · PERÚ</div>
          <div className="flex gap-x-5">
            <a href="#" className="hover:text-white/60 transition-colors">Aviso Legal</a>
            <a href="#" className="hover:text-white/60 transition-colors">Privacidad</a>
            <a href="/preguntas-frecuentes" className="hover:text-white/60 transition-colors">Preguntas Frecuentes</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
