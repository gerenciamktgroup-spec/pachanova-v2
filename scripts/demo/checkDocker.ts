import { execSync } from 'child_process';

export function checkDocker() {
  console.log('🔍 Validando Docker...');
  try {
    execSync('docker info', { stdio: 'ignore' });
    console.log('✅ Docker está activo.');
    return true;
  } catch (err) {
    console.error('❌ Error: Docker no está activo o no tienes permisos.');
    return false;
  }
}

if (require.main === module) {
  if (!checkDocker()) process.exit(1);
}
