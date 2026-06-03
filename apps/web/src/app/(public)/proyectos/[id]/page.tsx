'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ImmersiveProjectView() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-pn-gold/30">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black z-10" />
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop" 
            alt="San Bartolo Genesis" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        
        <div className="relative z-20 text-center max-w-4xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="px-4 py-1.5 rounded-full border border-pn-gold/50 text-pn-gold text-sm tracking-widest uppercase mb-6 inline-block bg-black/50 backdrop-blur-md">
              Genesis 100
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              San Bartolo <br/> Valley
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
              5 hectáreas de tierra virgen en el corredor de mayor crecimiento inmobiliario del sur de Lima.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-pn-gold to-transparent" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-black relative z-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'Superficie', value: '50,000', suffix: ' m²' },
            { label: 'Precio m²', value: '$120', suffix: ' USD' },
            { label: 'ROI Proyectado', value: '+161', suffix: '%' },
            { label: 'Plazo', value: '36', suffix: ' meses' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-sm text-gray-500 uppercase tracking-widest mb-2">{stat.label}</div>
              <div className="text-4xl md:text-5xl font-light text-pn-gold">
                {stat.value}<span className="text-xl text-gray-400">{stat.suffix}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Map & Investment Section */}
      <section className="py-24 bg-zinc-950 relative z-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-square rounded-3xl overflow-hidden relative group"
          >
            {/* Interactive Map Placeholder */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2948&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-4 bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-pn-gold/20 flex items-center justify-center border border-pn-gold">
                  <svg className="w-5 h-5 text-pn-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Ubicación</div>
                  <div className="text-white font-medium">Panamericana Sur Km 45</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Adquiere tu fracción hoy.
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Mediante la tokenización bajo el estándar ERC-3643, obtienes derechos de propiedad reales proporcionales sobre el terreno. Invierte de manera institucional desde 1 m².
            </p>
            
            <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
              <div className="flex justify-between items-center mb-6">
                <div className="text-gray-400">Tokens Disponibles</div>
                <div className="text-pn-gold font-mono">15,420 PACHA</div>
              </div>
              <div className="w-full bg-black rounded-full h-2 mb-8 overflow-hidden">
                <div className="bg-gradient-to-r from-pn-gold to-yellow-200 h-2 rounded-full w-[65%]" />
              </div>
              
              <button className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                Invertir ahora en Genesis
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
