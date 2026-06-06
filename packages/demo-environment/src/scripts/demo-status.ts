#!/usr/bin/env tsx

/**
 * Script para mostrar el estado actual del entorno de demo.
 * Usa el DemoEnvironmentManager.getStatus() para dar un diagnóstico rápido.
 */

import { config } from 'dotenv';
import { createDemoEnvironmentManager } from '../DemoEnvironmentManager';

// Cargar variables de entorno de demo
config({ path: '.env.demo' });
config({ path: '.env.demo.local' });

async function main() {
  console.log('📊 [demo-environment] Estado del entorno de demo\n');

  const manager = createDemoEnvironmentManager({
    mode: 'demo',
    verbose: false,
  });

  try {
    const status = await manager.getStatus();

    console.log('=== Diagnóstico General ===');
    console.log(`Modo:                 ${status.mode}`);
    console.log(`Saludable:            ${status.isHealthy ? '✅' : '❌'}`);
    console.log(`Base de datos:        ${status.databaseConnected ? 'Conectada' : 'Desconectada'}`);
    console.log(`Usuarios de demo:     ${status.demoUsersCount}`);

    if (status.holderBalance) {
      console.log('\n=== Balance Usuario Holder ===');
      console.log(`Tokens disponibles:   ${status.holderBalance.availableTokens}`);
      console.log(`USD disponibles:      ${status.holderBalance.availableUsd}`);
    }

    console.log('\n=== Actividad Reciente ===');
    console.log(`Eventos integración (24h): ${status.recentIntegrationEvents}`);
    console.log(`Pagos fallidos recientes:  ${status.hasFailedPayments ? 'Sí' : 'No'}`);
    console.log(`KYC pendiente:             ${status.hasPendingKyc ? 'Sí' : 'No'}`);

    if (status.issues.length > 0) {
      console.log('\n=== Problemas Detectados ===');
      status.issues.forEach(issue => console.log(`- ${issue}`));
    } else {
      console.log('\n✅ No se detectaron problemas mayores.');
    }

    console.log('');
    process.exit(status.isHealthy ? 0 : 1);
  } catch (error) {
    console.error('❌ Error al obtener el estado del entorno:');
    console.error(error);
    process.exit(1);
  }
}

main();
