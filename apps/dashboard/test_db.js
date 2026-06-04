import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log("Connecting to:", process.env.DATABASE_URL);
const sql = postgres(process.env.DATABASE_URL + "?sslmode=require&pgbouncer=true");

async function test() {
  try {
    const result = await sql`SELECT 1 as result`;
    console.log("Success:", result);
  } catch (err) {
    console.error("Connection Error:", err);
  } finally {
    process.exit(0);
  }
}
test();
