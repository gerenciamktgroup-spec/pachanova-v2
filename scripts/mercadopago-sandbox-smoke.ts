import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.demo.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runSmoke() {
  console.log('💨 Iniciando Smoke Test de MercadoPago Sandbox...');
  
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

  if (!accessToken || !webhookSecret) {
    console.log('NO_GO: missing real TEST credentials (not found)');
    process.exit(1);
  }

  const placeholders = ['TEST_placeholder', 'TEST_dummy', 'TEST_xxx', 'changeme', ''];
  if (placeholders.includes(accessToken) || placeholders.includes(webhookSecret)) {
    console.log('CONDITIONAL: placeholders detected, external call skipped.');
    console.log('====================================');
    console.log('Veredicto: PREFLIGHT_GO_WITH_OBSERVATIONS (Waiting for real keys)');
    process.exit(0);
  }

  if (accessToken.startsWith('APP_USR')) {
    console.log('NO_GO: APP_USR is blocked.');
    process.exit(1);
  }

  console.log('✅ Credenciales reales TEST_ detectadas. Intentando comunicación con SDK...');

  try {
    const client = new MercadoPagoConfig({ accessToken, options: { timeout: 5000 } });
    const preference = new Preference(client);
    
    // Minimal valid preference
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'smoke-test',
            title: 'Smoke Test',
            quantity: 1,
            unit_price: 1,
            currency_id: 'USD'
          }
        ]
      }
    });

    if (result.id) {
      console.log(`✅ Conexión Exitosa. Preference ID generado: ${result.id.substring(0, 15)}...`);
      console.log('====================================');
      console.log('Veredicto: SANDBOX_READY');
      console.log('====================================');
    } else {
      console.log('❌ Respuesta del SDK vacía.');
    }
  } catch (e: any) {
    console.log('❌ Falló la comunicación con el SDK. Verifica que tus TEST_ keys estén activas y válidas.');
    console.error(e.message);
    process.exit(1);
  }
}

runSmoke();
