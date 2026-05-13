import { execSync } from 'child_process';
import path from 'path';

function runStep(name: string, command: string) {
  console.log(`\n=== Ejecutando: ${name} ===`);
  try {
    const cwd = path.resolve(__dirname, '../..');
    execSync(command, { stdio: 'inherit', cwd });
    console.log(`✅ ${name} PASSED.`);
    return true;
  } catch (error) {
    console.error(`❌ ${name} FAILED.`);
    return false;
  }
}

function runAcceptance() {
  console.log('🚀 INICIANDO FULL ACCEPTANCE TEST PIPELINE...');
  let success = true;

  const steps = [
    { name: 'Doctor Checks', cmd: 'pnpm run demo:doctor' },
    { name: 'Lint', cmd: 'pnpm run lint' },
    { name: 'Typecheck', cmd: 'pnpm run typecheck' },
    { name: 'Build', cmd: 'pnpm run build' },
    { name: 'E2E Playwright', cmd: 'pnpm run test:e2e:demo' }
  ];

  for (const step of steps) {
    if (!runStep(step.name, step.cmd)) {
      success = false;
      break;
    }
  }

  if (success) {
    console.log('\n✅ ACCEPTANCE COMPLETADA. Sistema listo para Release Candidate.');
    process.exit(0);
  } else {
    console.error('\n❌ ACCEPTANCE FALLIDA. Revisa los logs superiores.');
    process.exit(1);
  }
}

runAcceptance();
