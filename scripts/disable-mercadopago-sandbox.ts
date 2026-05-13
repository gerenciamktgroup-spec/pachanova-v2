import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.demo.local');

if (!fs.existsSync(envPath)) {
  console.log("✅ .env.demo.local not found, so MercadoPago is already disabled by default.");
  process.exit(0);
}

let content = fs.readFileSync(envPath, 'utf-8');

// Replace specific flags
content = content.replace(/PAYMENTS_EXTERNAL_ENABLED=true/g, 'PAYMENTS_EXTERNAL_ENABLED=false');
content = content.replace(/DEMO_PROFILE=sandbox/g, 'DEMO_PROFILE=offline');
content = content.replace(/DEMO_PROFILE=connected/g, 'DEMO_PROFILE=offline');

fs.writeFileSync(envPath, content, 'utf-8');

console.log("✅ Successfully disabled MercadoPago Sandbox in .env.demo.local");
console.log("Please restart your local development server.");
