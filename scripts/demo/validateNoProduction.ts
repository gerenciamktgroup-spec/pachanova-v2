import * as dotenv from 'dotenv';

export function validateNoProduction() {
  console.log('🔍 Validando aislamiento de producción...');
  dotenv.config({ path: '.env.demo.local' });
  dotenv.config({ path: '.env.demo' });

  const url = process.env.DATABASE_URL || '';
  if (url.includes('neon.tech') || url.includes('cloudsql') || url.includes('run.app')) {
    console.error('❌ CRITICAL ERROR: DATABASE_URL apunta a producción.');
    return false;
  }

  if (process.env.DEMO_MODE !== 'true') {
    console.error('❌ CRITICAL ERROR: DEMO_MODE no es true.');
    return false;
  }

  console.log('✅ Aislamiento garantizado.');
  return true;
}

if (require.main === module) {
  if (!validateNoProduction()) process.exit(1);
}
