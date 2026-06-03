import { createDemoEnvironmentManager } from '@pachanova/demo-environment';

export async function checkDemoEnvironment(): Promise<boolean> {
  console.log('🔍 Verificando estado del entorno de demo (DemoEnvironmentManager)...');

  try {
    // Cargar variables de entorno de demo
    const { config } = await import('dotenv');
    config({ path: '.env.demo' });
    config({ path: '.env.demo.local' });

    const manager = createDemoEnvironmentManager({
      mode: 'demo',
      verbose: false,
    });

    const status = await manager.getStatus();

    console.log('\n=== Estado del Entorno de Demo ===');
    console.log(`Modo:                    ${status.mode}`);
    console.log(`Saludable:               ${status.isHealthy ? '✅' : '❌'}`);
    console.log(`Usuarios de demo:        ${status.demoUsersCount}`);

    if (status.holderBalance) {
      console.log(`Balance Holder:          ${status.holderBalance.availableTokens} tokens / $${status.holderBalance.availableUsd}`);
    }

    console.log(`Eventos integración (24h): ${status.recentIntegrationEvents}`);
    console.log(`Pagos fallidos recientes:  ${status.hasFailedPayments ? 'Sí ⚠️' : 'No'}`);
    console.log(`KYC pendiente:             ${status.hasPendingKyc ? 'Sí' : 'No'}`);

    if (status.issues.length > 0) {
      console.log('\nProblemas detectados:');
      status.issues.forEach(issue => console.log(`  - ${issue}`));
    }

    console.log('---');

    return status.isHealthy;
  } catch (error: any) {
    console.error('❌ Error al consultar el DemoEnvironmentManager:');
    console.error(error.message || error);
    console.log('---');
    return false;
  }
}
