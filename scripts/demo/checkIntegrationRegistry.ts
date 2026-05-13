import { createIntegrationRegistry } from '../../packages/integrations/src/registry/IntegrationRegistry';
import * as dotenv from 'dotenv';

export function checkIntegrationRegistry() {
  console.log('🔍 Validando Integration Registry...');
  dotenv.config({ path: '.env.demo.local' });
  dotenv.config({ path: '.env.demo' });

  try {
    const registry = createIntegrationRegistry();
    registry.assertNoProductionConnections();
    console.log('✅ Integration Registry validado. No hay conexiones productivas activas.');
    return true;
  } catch (err: any) {
    console.error('❌ Error en Integration Registry:', err.message);
    return false;
  }
}

if (require.main === module) {
  if (!checkIntegrationRegistry()) process.exit(1);
}
