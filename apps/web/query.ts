import postgres from 'postgres';

const sql = postgres("postgresql://postgres:bIHsNvabrkAAY0OP@db.cndppfspgqomgwixlfkw.supabase.co:5432/postgres");

const query = `SELECT 
  t.tablename,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = t.tablename 
   AND table_schema = 'public') as col_count,
  pg_stat_user_tables.n_live_tup as row_count
FROM pg_tables t
LEFT JOIN pg_stat_user_tables 
  ON pg_stat_user_tables.relname = t.tablename
WHERE t.schemaname = 'public'
ORDER BY row_count DESC NULLS LAST;`;

sql.unsafe(query)
  .then(res => { console.table(res); process.exit(0); })
  .catch(err => { console.error(err); process.exit(1); });
