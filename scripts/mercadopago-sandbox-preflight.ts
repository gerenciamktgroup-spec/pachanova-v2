import { validateMercadoPagoSandboxEnv } from '../apps/web/src/server/mercadopago/validateMercadoPagoSandboxEnv';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.demo.local') });

function runPreflight() {
  console.log('🚀 Iniciando Preflight de MercadoPago Sandbox...');
  let hasErrors = false;
  let hasWarnings = false;

  const result = validateMercadoPagoSandboxEnv();

  console.log('\n--- Análisis de Entorno ---');
  if (result.missing.length > 0) {
    console.log('❌ Variables faltantes:', result.missing.join(', '));
    hasErrors = true;
  } else {
    console.log('✅ Todas las variables requeridas existen.');
  }

  if (result.invalid.length > 0) {
    console.log('❌ Variables inválidas:', result.invalid.join(', '));
    hasErrors = true;
  } else {
    console.log('✅ Valores de variables válidos según formato.');
  }

  if (result.warnings.length > 0) {
    console.log('⚠️ Advertencias:', result.warnings.join(', '));
    hasWarnings = true;
  }

  console.log('\n--- Resumen Redactado ---');
  for (const [k, v] of Object.entries(result.redactedSummary)) {
    console.log(`${k}: ${v}`);
  }

  console.log('\n--- Validación de Gitignore ---');
  try {
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
    if (gitignore.includes('.env.demo.local') && gitignore.includes('.env.local')) {
      console.log('✅ .gitignore configurado correctamente para ocultar secretos locales.');
    } else {
      console.log('❌ .gitignore no incluye .env.demo.local o .env.local');
      hasErrors = true;
    }
  } catch (e) {
    console.log('❌ No se pudo leer .gitignore');
    hasErrors = true;
  }

  console.log('\n--- Análisis de APP_USR ---');
  const envDemoLocalPath = path.join(process.cwd(), '.env.demo.local');
  if (fs.existsSync(envDemoLocalPath)) {
    const envContent = fs.readFileSync(envDemoLocalPath, 'utf-8');
    if (envContent.includes('APP_USR')) {
      console.log('❌ SE DETECTÓ APP_USR EN .env.demo.local. ¡PELIGRO DE PRODUCCIÓN!');
      hasErrors = true;
    } else {
      console.log('✅ No se detectó APP_USR en .env.demo.local.');
    }
  } else {
    console.log('✅ .env.demo.local no existe, se usarán variables del sistema.');
  }

  console.log('\n====================================');
  if (hasErrors) {
    console.log('Veredicto: PREFLIGHT_NO_GO');
    console.log('====================================');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('Veredicto: PREFLIGHT_GO_WITH_OBSERVATIONS');
    console.log('====================================');
    process.exit(0);
  } else {
    console.log('Veredicto: PREFLIGHT_GO');
    console.log('====================================');
    process.exit(0);
  }
}

runPreflight();
