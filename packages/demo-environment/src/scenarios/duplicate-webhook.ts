import type { DemoScenario, DemoScenarioContext, DemoScenarioRunner } from './types';

/**
 * Escenario "duplicate-webhook"
 * 
 * Simula el caso en el que Mercado Pago envía el mismo webhook dos veces
 * (escenario común en producción).
 * 
 * El sistema debe detectar el duplicado y no acreditar los tokens dos veces.
 * 
 * Muy útil para demostrar robustez e idempotencia en el flujo de pagos.
 */
export const duplicateWebhookScenario: DemoScenario = {
  name: 'duplicate-webhook',
  description: 'Demuestra idempotencia: mismo webhook de Mercado Pago enviado dos veces.',

  async run(runner: DemoScenarioRunner, context: DemoScenarioContext): Promise<void> {
    console.log('🔁 Ejecutando escenario "duplicate-webhook"...');

    console.log('   → Ejecutando reset...');
    await runner.reset();

    console.log('   → Ejecutando seed...');
    await runner.seed();

    console.log('   → Simulando webhook duplicado...');

    await runner.withDb(async (db) => {
      const holderId = `(SELECT id FROM investors WHERE email = 'demo.investor.holder@pachanova.local')`;

      // Creamos una compra completada (como si el primer webhook ya la hubiera procesado)
      await db.execute`
        INSERT INTO genesis_purchases (
          investor_id, 
          token_amount, 
          usd_price_per_token, 
          total_usd_amount, 
          status, 
          payment_reference, 
          timestamp
        )
        SELECT 
          ${holderId},
          250,
          8.40,
          2100.00,
          'completed',
          'demo_duplicate_webhook_001',
          NOW() - INTERVAL '2 hours'
        WHERE NOT EXISTS (
          SELECT 1 FROM genesis_purchases 
          WHERE payment_reference = 'demo_duplicate_webhook_001'
        )
      `;

      // Primer webhook recibido (procesado correctamente)
      await db.execute`
        INSERT INTO integration_events (provider, event_type, payload, simulated, created_at)
        VALUES (
          'MERCADOPAGO',
          'WEBHOOK_RECEIVED',
          '{"scenario": "duplicate-webhook", "payment_id": "demo_duplicate_webhook_001", "status": "approved"}'::jsonb,
          true,
          NOW() - INTERVAL '2 hours'
        )
      `;

      // Segundo webhook (duplicado) - el sistema debería detectarlo
      await db.execute`
        INSERT INTO integration_events (provider, event_type, payload, simulated, created_at)
        VALUES (
          'MERCADOPAGO',
          'PAYMENT_DUPLICATE',
          '{"scenario": "duplicate-webhook", "payment_id": "demo_duplicate_webhook_001", "reason": "already_processed"}'::jsonb,
          true,
          NOW() - INTERVAL '1 hour'
        )
      `;
    });

    console.log('   → Estado listo: una compra + webhook duplicado registrado.');

    console.log('✅ Escenario "duplicate-webhook" completado.');
  },
};

export default duplicateWebhookScenario;
