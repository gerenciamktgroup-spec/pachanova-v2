import { checkDocker } from './checkDocker';
import { validateNoProduction } from './validateNoProduction';
import { checkIntegrationRegistry } from './checkIntegrationRegistry';
import { securityScan } from './securityScan';

function runDoctor() {
  console.log('=== PACHANOVA DEMO DOCTOR ===\n');
  
  let allGood = true;

  if (!checkDocker()) allGood = false;
  console.log('---');
  
  if (!validateNoProduction()) allGood = false;
  console.log('---');

  if (!checkIntegrationRegistry()) allGood = false;
  console.log('---');

  if (!securityScan()) allGood = false;
  console.log('---');

  if (allGood) {
    console.log('✅ DOCTOR PASSED: El entorno es seguro y está listo.');
    process.exit(0);
  } else {
    console.error('❌ DOCTOR FAILED: Revisa los errores anteriores antes de continuar.');
    process.exit(1);
  }
}

runDoctor();
