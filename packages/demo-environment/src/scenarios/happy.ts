import type { DemoScenario, DemoScenarioContext, DemoScenarioRunner } from './types';

/**
 * Escenario "happy" - El flujo más común y positivo para demostraciones.
 */
export const happyScenario: DemoScenario = {
  name: 'happy',
  description: 'Flujo feliz: usuario con KYC aprobado, buen saldo y una compra previa exitosa registrada.',

  async run(runner: DemoScenarioRunner, context: DemoScenarioContext): Promise<void> {
    console.log('🎉 Ejecutando escenario "happy"...');

    console.log('   → Ejecutando reset...');
    await runner.reset();

    console.log('   → Ejecutando seed...');
    await runner.seed();

    console.log('   → Inyectando datos adicionales para un estado "happy" más rico...');

    await runner.withDb(async (db) => {
      // Aseguramos que el usuario holder tenga un saldo atractivo para demo
      await db.execute`
        UPDATE balances 
        SET available_tokens = '1850', available_usd = '12450.00', locked_tokens = '0'
        WHERE investor_id = (
          SELECT id FROM investors WHERE email = 'demo.investor.holder@pachanova.local'
        )
      `;

      // Creamos una compra de génesis exitosa para que el dashboard muestre historial
      await db.execute`
        INSERT INTO genesis_purchases (
          investor_id, 
          property_id, 
          quantity, 
          unit_price, 
          total_amount, 
          currency, 
          status, 
          payment_reference, 
          created_at
        )
        SELECT 
          (SELECT id FROM investors WHERE email = 'demo.investor.holder@pachanova.local'),
          NULL,
          600,
          8.40,
          5040.00,
          'USD',
          'completed',
          'demo_happy_payment_' || extract(epoch from now())::text,
          NOW() - INTERVAL '3 days'
        WHERE NOT EXISTS (
          SELECT 1 FROM genesis_purchases 
          WHERE payment_reference LIKE 'demo_happy_payment_%'
        )
      `;

      // Inyectamos movimientos en el token ledger para que se vea actividad
      const holderId = `(SELECT id FROM investors WHERE email = 'demo.investor.holder@pachanova.local')`;

      await db.execute`
        INSERT INTO token_ledger (investor_id, operation, amount, tx_hash, previous_hash, current_hash, timestamp)
        VALUES 
          (${holderId}, 'mint', '1250', '0xhappy001', '0xgenesis', '0xhash001', NOW() - INTERVAL '5 days'),
          (${holderId}, 'transfer', '400', '0xhappy002', '0xhash001', '0xhash002', NOW() - INTERVAL '4 days')
        ON CONFLICT DO NOTHING
      `;

      // Agregamos algunos audit logs para que el historial de la demo se vea más real
      await db.execute`
        INSERT INTO audit_logs (action, details, user_id, timestamp)
        SELECT 
          'KYC_APPROVED',
          'KYC verification completed successfully for demo investor',
          (SELECT id FROM investors WHERE email = 'demo.investor.holder@pachanova.local'),
          NOW() - INTERVAL '6 days'
        WHERE NOT EXISTS (
          SELECT 1 FROM audit_logs 
          WHERE action = 'KYC_APPROVED' 
            AND details LIKE '%demo investor%'
        )
      `;

      await db.execute`
        INSERT INTO audit_logs (action, details, user_id, timestamp)
        SELECT 
          'GENESIS_PURCHASE_COMPLETED',
          'Successful purchase of 600 PACHA tokens',
          (SELECT id FROM investors WHERE email = 'demo.investor.holder@pachanova.local'),
          NOW() - INTERVAL '3 days'
        WHERE NOT EXISTS (
          SELECT 1 FROM audit_logs 
          WHERE action = 'GENESIS_PURCHASE_COMPLETED'
        )
      `;
    });

    console.log('   → Estado listo: usuario con buen saldo + historial de compra exitosa.');

    console.log('✅ Escenario "happy" completado.');
  },
};

export default happyScenario;
