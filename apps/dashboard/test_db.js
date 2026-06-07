import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL, { ssl: { rejectUnauthorized: false } });

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
