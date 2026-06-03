import type { DemoScenario, DemoScenarioContext, DemoScenarioRunner } from './types';

/**
 * Escenario "kyc-pending"
 * 
 * Simula el caso en el que un inversor intenta comprar tokens
 * pero su KYC todavía está pendiente de aprobación.
 * 
 * Útil para demostrar:
 * - Flujos de verificación
 * - Mensajes de error cuando el usuario no está verificado
 * - Diferencia entre "approved" y "pending"
 */
export const kycPendingScenario: DemoScenario = {
  name: 'kyc-pending',
  description: 'Inversor con KYC pendiente. Demuestra bloqueos por verificación de identidad.',

  async run(runner: DemoScenarioRunner, context: DemoScenarioContext): Promise<void> {
    console.log('⏳ Ejecutando escenario "kyc-pending"...');

    console.log('   → Ejecutando reset...');
    await runner.reset();

    console.log('   → Ejecutando seed...');
    await runner.seed();

    console.log('   → Forzando estado de KYC pendiente en el usuario demo...');

    await runner.withDb(async (db) => {
      // Actualizamos directamente al usuario pending para dejarlo en estado KYC pendiente.
      await db.execute`
        UPDATE investors 
        SET kyc_status = 'pending', is_verified = false 
        WHERE email = 'demo.investor.pending@pachanova.local'
      `;

      // Insertamos documentos KYC en estado pendiente para que se vea en la UI de revisión
      await db.execute`
        INSERT INTO kyc_documents (investor_id, document_type, file_url, status, is_demo, created_at, updated_at)
        SELECT 
          (SELECT id FROM investors WHERE email = 'demo.investor.pending@pachanova.local'),
          'IDENTITY_FRONT',
          'https://demo.pachanova.local/kyc/demo_pending_front.jpg',
          'pending',
          true,
          NOW() - INTERVAL '2 days',
          NOW() - INTERVAL '2 days'
        WHERE NOT EXISTS (
          SELECT 1 FROM kyc_documents 
          WHERE investor_id = (SELECT id FROM investors WHERE email = 'demo.investor.pending@pachanova.local')
            AND document_type = 'IDENTITY_FRONT'
        )
      `;

      await db.execute`
        INSERT INTO kyc_documents (investor_id, document_type, file_url, status, is_demo, created_at, updated_at)
        SELECT 
          (SELECT id FROM investors WHERE email = 'demo.investor.pending@pachanova.local'),
          'PROOF_OF_ADDRESS',
          'https://demo.pachanova.local/kyc/demo_pending_address.pdf',
          'pending',
          true,
          NOW() - INTERVAL '2 days',
          NOW() - INTERVAL '2 days'
        WHERE NOT EXISTS (
          SELECT 1 FROM kyc_documents 
          WHERE investor_id = (SELECT id FROM investors WHERE email = 'demo.investor.pending@pachanova.local')
            AND document_type = 'PROOF_OF_ADDRESS'
        )
      `;
    });

    console.log('   → Estado preparado: el usuario pending tiene KYC pendiente + documentos subidos.');

    console.log('✅ Escenario "kyc-pending" completado.');
  },
};

export default kycPendingScenario;
