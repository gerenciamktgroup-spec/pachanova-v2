import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@pachanova/database/src/schema';

type Database = ReturnType<typeof drizzle<typeof schema>>;

let database: Database | null = null;

function getDatabase(): Database {
  if (!database) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is required for database operations');
    }

    const client = postgres(databaseUrl, { prepare: false });
    database = drizzle(client, { schema });
  }

  return database;
}

export const db = new Proxy({} as Database, {
  get(_target, property) {
    return Reflect.get(getDatabase(), property);
  },
});
