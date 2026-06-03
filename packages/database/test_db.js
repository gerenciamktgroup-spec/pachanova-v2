const postgres = require('postgres');
require('dotenv').config({ path: '../../.env.demo' });

async function test() {
  console.log('Connecting to', process.env.DATABASE_URL);
  const sql = postgres(process.env.DATABASE_URL, { ssl: false });
  try {
    const result = await sql`SELECT 1 as result`;
    console.log('Connection successful:', result);
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    process.exit(0);
  }
}
test();
