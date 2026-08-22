import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { core } from "@pachanova/database";

const url = process.env.DATABASE_URL || "postgresql://postgres:pachanova_dev@127.0.0.1:5433/pachanova";
const sql = postgres(url, { prepare: false, max: 4 });
export const db = drizzle(sql, { schema: core });
export { core };
