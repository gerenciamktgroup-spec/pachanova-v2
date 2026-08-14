#!/usr/bin/env tsx

/**
 * Script para aplicar escenarios de demo a través del DemoEnvironmentManager.
 * 
 * Uso:
 *   pnpm demo:scenario happy
 *   pnpm demo:scenario rejected-payment
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createDemoEnvironmentManager } from '../DemoEnvironmentManager';

// Cargar variables de entorno de demo
config({ path: '.env.demo' });
config({ path: '.env.demo.local' });
config({ path: resolve(process.cwd(), '../../.env.demo') });
config({ path: resolve(process.cwd(), '../../.env.demo.local'), override: true });

async function main() {
  const scenarioName = process.argv[2];

  if (!scenarioName) {
    console.error('❌ Debes especificar el nombre del escenario.');
    console.log('Ejemplo: pnpm demo:scenario happy');
    process.exit(1);
  }

  console.log(`🎭 [demo-environment] Aplicando escenario: ${scenarioName}\n`);

  const manager = createDemoEnvironmentManager({
    mode: 'demo',
    verbose: true,
  });

  try {
    await manager.applyScenario(scenarioName);
    console.log(`\n✅ Escenario "${scenarioName}" aplicado exitosamente.`);
    process.exit(0);
  } catch (error: unknown) {
    console.error(`\n❌ Error aplicando el escenario "${scenarioName}":`);
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
