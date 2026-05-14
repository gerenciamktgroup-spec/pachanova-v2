import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../apps/api/.env.demo') });

async function checkDB() {
  const sql = postgres(process.env.DATABASE_URL);
  
  try {
    const authUsers = await sql`SELECT id, email FROM auth.users`;
    console.log("Auth Users:", authUsers);
    
    const investors = await sql`SELECT id, email FROM public.investors`;
    console.log("Investors:", investors);
    
    const balances = await sql`SELECT * FROM public.balances`;
    console.log("Balances:", balances);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await sql.end();
  }
}

checkDB();
