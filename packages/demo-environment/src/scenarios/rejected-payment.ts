import type { DemoScenario, DemoScenarioContext, DemoScenarioRunner } from './types';

/**
 * Escenario "rejected-payment"
 * 
 * Simula el caso en el que un pago con Mercado Pago es rechazado.
 * Útil para demostrar manejo de errores, reintentos, y mensajes al usuario.
 */
export const rejectedPaymentScenario: DemoScenario = {
  name: 'rejected-payment',
  description: 'Pago rechazado por Mercado Pago. Demuestra manejo de errores y flujos de recuperación.',

  async run(runner: DemoScenarioRunner, context: DemoScenarioContext): Promise<void> {
    console.log('❌ Ejecutando escenario "rejected-payment"...');

    // El escenario controla su propio ciclo de vida
    console.log('   → Ejecutando reset...');
    await runner.reset();

    console.log('   → Ejecutando seed...');
    await runner.seed();

    console.log('   → Simulando estado de pago rechazado...');

    await runner.withDb(async (db) => {
      // Insertamos un evento de integración que representa un pago rechazado.
      await db.execute`
        INSERT INTO integration_events (provider, event_type, payload, simulated, timestamp)
        VALUES (
          'MERCADOPAGO', 
          'PAYMENT_REJECTED', 
          '{"scenario": "rejected-payment", "reason": "insufficient_funds"}'::jsonb, 
          true, 
          NOW()
        )
      `;

      // Creamos un registro de compra fallida en genesis_purchases
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
          (SELECT id FROM investors WHERE email = 'demo.investor.holder@pachanova.local'),
          300,
          8.40,
          2520.00,
          'failed',
          'demo_rejected_payment_' || extract(epoch from now())::text,
          NOW() - INTERVAL '1 day'
        WHERE NOT EXISTS (
          SELECT 1 FROM genesis_purchases 
          WHERE payment_reference LIKE 'demo_rejected_payment_%'
        )
      `;
    });

    console.log('   → Estado listo para demostrar error de pago (compra fallida + evento registrado).');

    console.log('✅ Escenario "rejected-payment" completado.');
  },
};

export default rejectedPaymentScenario;
