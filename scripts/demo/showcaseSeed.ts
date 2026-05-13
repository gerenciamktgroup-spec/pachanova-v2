import { execSync } from 'child_process';
import path from 'path';

function runShowcaseSeed() {
  console.log('🔄 Preparando semilla para Showcase...');
  const cwd = path.resolve(__dirname, '../..');
  
  try {
    execSync('pnpm demo:db:migrate', { stdio: 'inherit', cwd });
    execSync('pnpm demo:db:seed', { stdio: 'inherit', cwd });
    console.log('✅ Base de datos Demo re-creada exitosamente con usuarios showcase.');
  } catch (err) {
    console.error('❌ Error durante Showcase Seed:', err);
    process.exit(1);
  }
}

runShowcaseSeed();
