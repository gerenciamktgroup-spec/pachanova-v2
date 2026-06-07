const postgres = require('postgres');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', 'apps', 'dashboard', '.env.local') });

console.log("DATABASE_URL:", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error("No DATABASE_URL found");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`
  .then(res => {
    console.log("Success connecting to the database! Public tables:");
    console.table(res);
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
