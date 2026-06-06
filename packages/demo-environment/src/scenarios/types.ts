import type { DemoEnvironmentManager } from '../DemoEnvironmentManager';

export interface DemoScenarioContext {
  mode: 'demo' | 'sandbox' | 'offline';
  databaseUrl: string;
  verbose: boolean;
}

/**
 * Interfaz que los escenarios pueden usar para orquestar acciones.
 * Esto permite que los escenarios llamen a reset(), seed(), y también ejecuten
 * operaciones de base de datos específicas.
 */
export interface DemoScenarioRunner {
  reset(): Promise<void>;
  seed(): Promise<void>;
  getStatus(): Promise<any>;

  /**
   * Permite a los escenarios ejecutar consultas personalizadas contra la base de datos.
   * Ejemplo de uso:
   *   await runner.withDb(async (db) => {
   *     await db.update(...).set(...);
   *   });
   */
  withDb<T>(fn: (db: any) => Promise<T>): Promise<T>;
}

export interface DemoScenario {
  name: string;
  description: string;

  /**
   * Ejecuta el escenario.
   * Recibe un runner que le da acceso a las operaciones del manager.
   */
  run(runner: DemoScenarioRunner, context: DemoScenarioContext): Promise<void>;
}
