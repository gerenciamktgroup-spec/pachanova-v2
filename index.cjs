#!/usr/bin/env node
/**
 * index.cjs - Entry point para el Orchestrator Agent (compatibilidad con "type":"module" del proyecto).
 * 
 * Corre el agente autónomo que consulta a Grok vía el comando oficial del proyecto (ejecutar_grok.ps1),
 * recibe la característica masiva de alto impacto, inyecta el plan y repite.
 * 
 * Esto resuelve el "Working porque no puede conectar contigo": ahora conecta 100% local vía el wrapper autorizado por el usuario.
 */

const { runCycle } = require('./orchestrator_agent.cjs');

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const loop = args.includes('--loop');

console.log('=== ORCHESTRATOR AGENT (Panel Maestro) - Ciclo de Singularidad ===');

if (loop) {
  console.log('Modo loop infinito activado. (v3 context exhaustion resilient: on signals or errors will persist state + snapshot for perfect resume in next Grok Build session)');
  (async () => {
    while (true) {
      try {
        await runCycle(dry);
      } catch (e) {
        console.error('Loop iteration error, forcing v3 context persist for infinite continuity:', e.message);
        try {
          const orq = require('./orchestrator_agent.cjs');
          if (typeof orq.persistContextWindowSave === 'function') orq.persistContextWindowSave('index-loop-error');
        } catch (_) {}
      }
      // Always checkpoint persist on loop iterations (save work before potential context fill in the Grok Build side)
      try {
        const orq = require('./orchestrator_agent.cjs');
        if (typeof orq.persistContextWindowSave === 'function') orq.persistContextWindowSave('index-loop-iteration-checkpoint');
      } catch (_) {}
      await new Promise(r => setTimeout(r, 5 * 60 * 1000));
    }
  })();
} else {
  runCycle(dry);
}
