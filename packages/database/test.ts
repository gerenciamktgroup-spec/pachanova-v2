import { getDb } from './src/index';

try {
  const db = getDb();
  console.log("DB init successful!");
} catch (e: any) {
  console.error("DB init failed:", e.message);
}
