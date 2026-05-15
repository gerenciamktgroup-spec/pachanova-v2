const postgres = require('postgres');
const sql = postgres('postgresql://postgres.cndppfspgqomgwixlfkw:bIHsNvabrkAAY0OP@aws-0-us-west-1.pooler.supabase.com:6543/postgres?sslmode=require');

async function run() {
  try {
    const q1 = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name IN ('balances', 'token_ledger', 'p2p_orders', 'audit_logs') ORDER BY table_name, ordinal_position;`;
    console.table(q1);
  } catch(e) { console.error(e.message); }

  process.exit(0);
}
run();
