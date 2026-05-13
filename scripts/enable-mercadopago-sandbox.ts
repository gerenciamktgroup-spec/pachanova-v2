import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.demo.local');

if (!fs.existsSync(envPath)) {
  console.error("❌ .env.demo.local not found. Please create it first and add your TEST credentials.");
  process.exit(1);
}

dotenv.config({ path: envPath });

const requiredKeys = [
  'MERCADOPAGO_ACCESS_TOKEN',
  'MERCADOPAGO_PUBLIC_KEY',
  'MERCADOPAGO_WEBHOOK_SECRET',
  'MERCADOPAGO_WEBHOOK_URL'
];

let valid = true;

for (const key of requiredKeys) {
  const val = process.env[key];
  if (!val || val.includes('placeholder')) {
    console.error(`❌ Missing or invalid ${key} in .env.demo.local`);
    valid = false;
  }
}

if (!process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('TEST_')) {
  console.error("❌ MERCADOPAGO_ACCESS_TOKEN must start with TEST_");
  valid = false;
}

if (!valid) {
  console.error("Please update your .env.demo.local with real sandbox credentials before enabling.");
  process.exit(1);
}

console.log("✅ .env.demo.local has valid test credentials.");
console.log("To fully enable, ensure you set PAYMENTS_EXTERNAL_ENABLED=true and DEMO_PROFILE=sandbox in .env.demo.local.");
console.log("Then restart your local server and run `pnpm mp:sandbox:smoke`.");
