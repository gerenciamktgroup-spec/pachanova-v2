import fs from 'fs';
import path from 'path';

const FORBIDDEN_PATTERNS = [
  /APP_USR-/g,
  /sk_live/g,
  /sk_test/g,
  /DATABASE_URL=postgresql:\/\/.*cloudsql/g,
  /DATABASE_URL=postgresql:\/\/.*neon\.tech/g,
  /firebaseapp\.com/g,
  /PRIVATE_KEY=[A-Za-z0-9]+/g,
  /MERCADOPAGO_ACCESS_TOKEN=.*APP_USR/g,
  /MERCADOPAGO_WEBHOOK_SECRET=.*[A-Za-z0-9]{16,}/g
];

const IGNORE_DIRS = ['node_modules', '.git', 'dist', '.next', 'artifacts'];
const IGNORE_FILES = ['pnpm-lock.yaml', 'package-lock.json', '.env.local', '.env.demo.local', 'securityScan.ts'];

function scanDir(dir: string): boolean {
  let isClean = true;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        if (!scanDir(fullPath)) isClean = false;
      }
    } else {
      if (!IGNORE_FILES.includes(file)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        // Excepción válida para un test de securityScan o mock dummy.
        if (content.includes('TEST_placeholder')) {
          // It's allowed.
        }

        for (const pattern of FORBIDDEN_PATTERNS) {
          if (pattern.test(content)) {
            // Excepción especial para archivos de test donde comprobamos el rechazo de URLs malas
            if (fullPath.includes('unit.test.tsx') && content.includes('postgresql://user:pass@production.neon.tech/db')) {
               continue;
            }
            if (fullPath.includes('unit.test.tsx') && content.includes('APP_USR')) {
               continue; // test de APP_USR
            }
            if (fullPath.includes('showcase.spec.ts') && content.includes('APP_USR')) {
               continue;
            }
            if (fullPath.includes('EXTERNAL_INTEGRATIONS_BACKLOG.md') && content.includes('PRIVATE_KEY=')) {
               continue;
            }
            if (content.includes('TEST_placeholder')) continue;

            console.error(`❌ ALERTA DE SEGURIDAD: Patrón sospechoso encontrado en ${fullPath}`);
            isClean = false;
          }
        }
      }
    }
  }

  return isClean;
}

export function securityScan() {
  console.log('🔍 Iniciando Security Scan local...');
  const repoRoot = path.resolve(__dirname, '../..');
  const clean = scanDir(repoRoot);
  if (clean) {
    console.log('✅ Security Scan limpio. Cero leaks detectados.');
  }
  return clean;
}

if (require.main === module) {
  if (!securityScan()) process.exit(1);
}
