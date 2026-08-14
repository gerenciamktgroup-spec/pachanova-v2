#!/usr/bin/env tsx

/**
 * Script de reset del entorno de demo.
 * Usa el DemoEnvironmentManager como orquestador.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createDemoEnvironmentManager } from '../DemoEnvironmentManager';

// Cargar variables de entorno de demo (igual que los scripts antiguos)
config({ path: '.env.demo' });
config({ path: '.env.demo.local' });
config({ path: resolve(process.cwd(), '../../.env.demo') });
config({ path: resolve(process.cwd(), '../../.env.demo.local'), override: true });

async function main() {
  console.log('🗑️  [demo-environment] Iniciando reset del entorno de demo...\n');

  const manager = createDemoEnvironmentManager({
    mode: 'demo',
    verbose: true,
  });

  try {
    await manager.reset();
    console.log('\n✅ Reset del entorno de demo completado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante el reset del entorno de demo:');
    console.error(error);
    process.exit(1);
  }
}

main();
