import { execSync } from 'child_process';
import path from 'path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import { DemoEnvironmentConfig, DemoEnvironmentStatus, ApplyScenarioOptions } from './types';
import { getScenario, type DemoScenarioRunner } from './scenarios';
import * as schema from '@pachanova/database'; // for schema access if needed

export class DemoEnvironmentManager {
  private config: Required<DemoEnvironmentConfig>;
  private _dbClient: ReturnType<typeof drizzle> | null = null;

  constructor(config: DemoEnvironmentConfig = {}) {
    this.config = {
      mode: config.mode ?? 'demo',
      databaseUrl: config.databaseUrl ?? process.env.DATABASE_URL ?? '',
      verbose: config.verbose ?? true,
    };
  }

  /**
   * Obtiene (o crea) una instancia de Drizzle para operaciones directas.
   */
  private async getDb() {
    if (this._dbClient) return this._dbClient;

    if (!this.config.databaseUrl) {
      throw new Error('DATABASE_URL es requerido para operaciones de base de datos');
    }

    const client = postgres(this.config.databaseUrl);
    this._dbClient = drizzle(client, { schema: schema as any });
    return this._dbClient;
  }

  /**
   * Encuentra la raíz del proyecto (pachanova-v2-git)
   */
  private findProjectRoot(): string {
    // Asumimos que este paquete está en packages/demo-environment
    // Subimos dos niveles para llegar a la raíz del monorepo
    return path.resolve(__dirname, '../../../../');
  }

  /**
   * Ejecuta el script de reset existente del paquete de base de datos.
   * Este es un enfoque orquestador para la fase inicial.
   */
  async reset(): Promise<void> {
    this.log('🗑️ Ejecutando reset del entorno de demo...');

    const rootDir = this.findProjectRoot();
    const cmd = `pnpm --filter @pachanova/database run demo:reset`;

    try {
      execSync(cmd, {
        cwd: rootDir,
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: this.config.databaseUrl },
      });
      this.log('✅ Reset completado.');
    } catch (error) {
      this.log('❌ Error durante el reset');
      throw error;
    }
  }

  /**
   * Ejecuta el script de seed existente.
   */
  async seed(): Promise<void> {
    this.log('🌱 Ejecutando seed del entorno de demo...');

    const rootDir = this.findProjectRoot();
    const cmd = `pnpm --filter @pachanova/database run demo:seed`;

    try {
      execSync(cmd, {
        cwd: rootDir,
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: this.config.databaseUrl },
      });
      this.log('✅ Seed completado.');
    } catch (error) {
      this.log('❌ Error durante el seed');
      throw error;
    }
  }

  /**
   * Aplica un escenario predefinido.
   * Los escenarios ahora reciben el manager como runner para poder llamar reset(), seed(), etc.
   */
  async applyScenario(scenarioName: string, options: ApplyScenarioOptions = {}): Promise<void> {
    this.log(`🎭 Aplicando escenario: ${scenarioName}`);

    const scenario = getScenario(scenarioName);

    if (!scenario) {
      throw new Error(
        `Escenario "${scenarioName}" no encontrado. Disponibles: happy, rejected-payment, kyc-pending`
      );
    }

    this.log(`   → ${scenario.description}`);

    // El propio manager actúa como runner
    const runner: DemoScenarioRunner = {
      reset: () => this.reset(),
      seed: () => this.seed(),
      getStatus: () => this.getStatus(),
      withDb: <T>(fn: (db: any) => Promise<T>) => this.withDb(fn),
    };

    const context = {
      mode: this.config.mode,
      databaseUrl: this.config.databaseUrl,
      verbose: this.config.verbose,
    };

    await scenario.run(runner, context);

    this.log(`✅ Escenario "${scenarioName}" aplicado correctamente.`);
  }

  /**
   * Implementación de withDb para el runner.
   */
  async withDb<T>(fn: (db: any) => Promise<T>): Promise<T> {
    const db = await this.getDb();
    return fn(db);
  }

  /**
   * Retorna un diagnóstico detallado del entorno de demo.
   * Este método es muy útil para herramientas de diagnóstico y para el doctor.
   */
  async getStatus(): Promise<DemoEnvironmentStatus> {
    this.log('🔍 Obteniendo estado detallado del entorno de demo...');

    try {
      const status = await this.withDb(async (db) => {
        // Contar usuarios de demo
        const usersResult = await db.execute(sql`
          SELECT COUNT(*) as count FROM investors 
          WHERE email LIKE '%@pachanova.local'
        `);
        const demoUsersCount = Number(usersResult[0]?.count || 0);

        // Balance del holder (usuario principal de demo)
        const balanceResult = await db.execute(sql`
          SELECT available_tokens, available_usd 
          FROM balances 
          WHERE investor_id = (
            SELECT id FROM investors WHERE email = 'demo.investor.holder@pachanova.local'
          )
        `);
        const holderBalance = balanceResult[0] 
          ? { 
              availableTokens: balanceResult[0].available_tokens, 
              availableUsd: balanceResult[0].available_usd 
            } 
          : undefined;

        // Eventos de integración recientes (últimas 24h)
        const eventsResult = await db.execute(sql`
          SELECT COUNT(*) as count FROM integration_events 
          WHERE timestamp > NOW() - INTERVAL '24 hours'
        `);
        const recentIntegrationEvents = Number(eventsResult[0]?.count || 0);

        // ¿Existen pagos fallidos recientes?
        const failedResult = await db.execute(sql`
          SELECT COUNT(*) as count FROM genesis_purchases 
          WHERE status = 'failed' 
            AND timestamp > NOW() - INTERVAL '7 days'
        `);
        const hasFailedPayments = Number(failedResult[0]?.count || 0) > 0;

        // ¿Existen documentos KYC pendientes?
        const kycResult = await db.execute(sql`
          SELECT COUNT(*) as count FROM kyc_documents 
          WHERE status = 'pending' 
            AND is_demo = true
        `);
        const hasPendingKyc = Number(kycResult[0]?.count || 0) > 0;

        return {
          demoUsersCount,
          holderBalance,
          recentIntegrationEvents,
          hasFailedPayments,
          hasPendingKyc,
        };
      });

      const issues: string[] = [];
      if (status.demoUsersCount === 0) issues.push('No se encontraron usuarios de demo');
      if (!status.holderBalance) issues.push('No se encontró balance del usuario holder');

      return {
        isHealthy: issues.length === 0,
        mode: this.config.mode,
        databaseConnected: true,
        hasDemoData: status.demoUsersCount > 0,
        demoUsersCount: status.demoUsersCount,
        holderBalance: status.holderBalance,
        recentIntegrationEvents: status.recentIntegrationEvents,
        hasFailedPayments: status.hasFailedPayments,
        hasPendingKyc: status.hasPendingKyc,
        issues,
      };
    } catch (error) {
      this.log('⚠️ Error al obtener estado detallado');
      return {
        isHealthy: false,
        mode: this.config.mode,
        databaseConnected: false,
        hasDemoData: false,
        demoUsersCount: 0,
        recentIntegrationEvents: 0,
        hasFailedPayments: false,
        hasPendingKyc: false,
        issues: ['Error al conectar con la base de datos o consultar estado'],
      };
    }
  }

  async validate(): Promise<{ isValid: boolean; issues: string[] }> {
    const status = await this.getStatus();
    return {
      isValid: status.isHealthy,
      issues: status.issues,
    };
  }

  private log(message: string) {
    if (this.config.verbose) {
      console.log(`[DemoEnvironment] ${message}`);
    }
  }
}

export function createDemoEnvironmentManager(config?: DemoEnvironmentConfig) {
  return new DemoEnvironmentManager(config);
}
