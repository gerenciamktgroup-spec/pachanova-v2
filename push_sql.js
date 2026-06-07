const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

const dbUrl = "postgresql://postgres:x9u7Ol7zKliU0up4@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require";

async function push() {
  console.log('Connecting to', dbUrl);
  const sql = postgres(dbUrl);
  
  try {
    const file = path.join(__dirname, 'packages', 'database', 'drizzle', '0001_gifted_wallflower.sql');
    const content = fs.readFileSync(file, 'utf8');
    
    console.log('Executing raw SQL...');
    await sql.unsafe(content);
    console.log('Success!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sql.end();
  }
}

push();
